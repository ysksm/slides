#!/usr/bin/env python3
"""
tsc-lsp 最小実証クライアント (Python 版)
Python 3.10+ 標準ライブラリのみで動作します（サードパーティ依存ゼロ）。

TypeScript 7 のネイティブ言語サーバー `tsc --lsp --stdio` を起動し、
主要な LSP リクエスト (initialize, didOpen, diagnostic, hover, definition,
references, callHierarchy, completion, shutdown, exit) を送信・検証します。

使い方:
    python3 probe_lsp.py [project-root] [file.ts] [line] [character] [--json]

例:
    python3 probe_lsp.py ../evidence/fixture src/diagnostics-demo.ts 2 28
"""

import json
import os
import queue
import subprocess
import sys
import threading
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import url2pathname


def file_url_to_path(url: str) -> str:
    parsed = urlparse(url)
    return os.path.abspath(url2pathname(parsed.path))


def path_to_file_url(path_str: str) -> str:
    return Path(path_str).resolve().as_uri()


def find_tsc() -> str:
    # 候補パスの探索
    script_dir = Path(__file__).resolve().parent
    candidates = [
        script_dir / "../evidence/fixture/node_modules/.bin/tsc",
        script_dir / "../../node_modules/.bin/tsc",
        Path("/tmp/test-ts/node_modules/.bin/tsc"),
        Path("tsc"),
    ]
    for cand in candidates:
        cand_str = str(cand)
        try:
            out = subprocess.check_output([cand_str, "--version"], stderr=subprocess.DEVNULL, text=True).strip()
            if "Version 7." in out or "7.0." in out or "7.1." in out:
                return cand_str
        except Exception:
            continue
    return ""


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    is_json = "--json" in sys.argv

    script_dir = Path(__file__).resolve().parent
    default_root = str((script_dir / "../evidence/fixture").resolve())
    root_dir = os.path.abspath(args[0] if len(args) > 0 else default_root)
    file_rel = args[1] if len(args) > 1 else "src/diagnostics-demo.ts"
    target_file = file_rel if os.path.isabs(file_rel) else os.path.join(root_dir, file_rel)
    target_line = int(args[2]) if len(args) > 2 else 2
    target_char = int(args[3]) if len(args) > 3 else 28

    if not os.path.isfile(target_file):
        sys.stderr.write(f"エラー: 対象ファイルが存在しません: {target_file}\n")
        sys.exit(1)

    tsc_bin = find_tsc()
    if not tsc_bin:
        sys.stderr.write("エラー: TypeScript 7 以上の tsc が見つかりませんでした。\n")
        sys.stderr.write("解決策: `npm install typescript@7.0.2` を実行してください。\n")
        sys.exit(1)

    proc = subprocess.Popen(
        [tsc_bin, "--lsp", "--stdio"],
        cwd=root_dir,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        bufsize=0
    )

    t0 = time.time()
    next_id = 0
    pending_lock = threading.Lock()
    pending = {}
    timings = {}
    evidence = {
        "environment": {
            "pythonVersion": sys.version.split()[0],
            "tscBinary": tsc_bin,
            "platform": sys.platform
        },
        "requests": {}
    }

    def log(label: str, *details):
        if not is_json:
            elapsed = f"{int((time.time() - t0) * 1000):>5}ms"
            print(f"[{elapsed}] {label:<20}", *details)

    def send(msg: dict):
        body = json.dumps(msg).encode("utf-8")
        header = f"Content-Length: {len(body)}\r\n\r\n".encode("ascii")
        proc.stdin.write(header + body)
        proc.stdin.flush()

    def request(method: str, params=None) -> dict:
        nonlocal next_id
        with pending_lock:
            next_id += 1
            req_id = next_id
            q = queue.Queue(maxsize=1)
            pending[req_id] = (q, method, time.perf_counter())

        msg = {"jsonrpc": "2.0", "id": req_id, "method": method}
        if params is not None:
            msg["params"] = params
        send(msg)

        res = q.get()
        if "error" in res and res["error"] is not None:
            err = res["error"]
            raise RuntimeError(f"LSP Error [{method}]: {err.get('message')} (code {err.get('code')})")
        return res.get("result")

    def notify(method: str, params=None):
        msg = {"jsonrpc": "2.0", "method": method}
        if params is not None:
            msg["params"] = params
        send(msg)

    def reader():
        buf = bytearray()
        try:
            while True:
                chunk = proc.stdout.read(4096)
                if not chunk:
                    break
                buf.extend(chunk)
                while True:
                    sep = buf.find(b"\r\n\r\n")
                    if sep == -1:
                        break
                    header = buf[:sep].decode("ascii", errors="replace")
                    content_length = None
                    for line in header.split("\r\n"):
                        if line.lower().startswith("content-length:"):
                            content_length = int(line.split(":", 1)[1].strip())
                            break
                    if content_length is None:
                        break
                    if len(buf) < sep + 4 + content_length:
                        break
                    body_bytes = buf[sep + 4:sep + 4 + content_length]
                    del buf[:sep + 4 + content_length]
                    msg = json.loads(body_bytes.decode("utf-8", errors="replace"))

                    # 1. サーバー → クライアントのリクエスト
                    if "id" in msg and "method" in msg:
                        if msg["method"] == "workspace/configuration":
                            items = msg.get("params", {}).get("items", [])
                            send({"jsonrpc": "2.0", "id": msg["id"], "result": [None] * len(items)})
                        else:
                            send({"jsonrpc": "2.0", "id": msg["id"], "result": None})
                        continue

                    # 2. クライアントのリクエストに対するレスポンス
                    if "id" in msg and "method" not in msg:
                        req_id = msg["id"]
                        with pending_lock:
                            item = pending.pop(req_id, None)
                        if item:
                            q, method_name, req_start = item
                            timings[method_name] = f"{(time.perf_counter() - req_start) * 1000:.2f}"
                            evidence["requests"][method_name] = msg
                            q.put(msg)
                        continue

                    # 3. 通知
                    if "method" in msg:
                        if msg["method"] == "textDocument/publishDiagnostics":
                            diag_uri = msg.get("params", {}).get("uri", "")
                            diag_path = file_url_to_path(diag_uri)
                            if diag_path.lower().startswith(root_dir.lower()):
                                rel = diag_path[len(root_dir):].lstrip("/\\")
                            else:
                                rel = os.path.basename(diag_path)
                            count = len(msg.get("params", {}).get("diagnostics", []))
                            log("pushDiagnostics", f"{rel}: {count} 件")
        except Exception as e:
            sys.stderr.write(f"Reader thread error: {e}\n")
        finally:
            with pending_lock:
                for q, method_name, _ in pending.values():
                    q.put({"error": {"message": "Process closed", "code": -32000}})
                pending.clear()

    reader_thread = threading.Thread(target=reader, daemon=True)
    reader_thread.start()

    root_uri = path_to_file_url(root_dir)
    file_uri = path_to_file_url(target_file)
    with open(target_file, "r", encoding="utf-8") as f:
        file_text = f.read()

    # 1. initialize
    init_res = request("initialize", {
        "processId": os.getpid(),
        "rootUri": root_uri,
        "capabilities": {
            "textDocument": {
                "diagnostic": {},
                "hover": {"contentFormat": ["markdown", "plaintext"]},
                "documentSymbol": {"hierarchicalDocumentSymbolSupport": True},
                "completion": {"completionItem": {"snippetSupport": True}}
            },
            "workspace": {"configuration": True}
        }
    })
    server_info = init_res.get("serverInfo", {})
    log("initialize", f"{server_info.get('name')} v{server_info.get('version')} ({timings.get('initialize')} ms)")
    notify("initialized", {})

    # 2. didOpen
    notify("textDocument/didOpen", {
        "textDocument": {
            "uri": file_uri,
            "languageId": "typescript",
            "version": 1,
            "text": file_text
        }
    })
    rel_target = os.path.relpath(target_file, root_dir)
    log("didOpen", f"{rel_target} opened")

    # 3. textDocument/diagnostic
    diag_res = request("textDocument/diagnostic", {"textDocument": {"uri": file_uri}})
    diag_items = diag_res.get("items", []) if diag_res else []
    log("diagnostic", f"{len(diag_items)} 件 ({timings.get('textDocument/diagnostic')} ms)")
    for d in diag_items:
        rng = d.get("range", {}).get("start", {})
        log("  └─ diag item", f"L{rng.get('line', 0)+1}:{rng.get('character', 0)+1} [TS{d.get('code')}] {d.get('message')}")

    # 4. textDocument/documentSymbol
    sym_res = request("textDocument/documentSymbol", {"textDocument": {"uri": file_uri}})
    sym_names = ", ".join(s.get("name", "") for s in (sym_res or []))
    log("documentSymbol", f"{len(sym_res or [])} 件 [{sym_names}] ({timings.get('textDocument/documentSymbol')} ms)")

    # 5. textDocument/hover
    pos = {"line": target_line, "character": target_char}
    hover_res = request("textDocument/hover", {"textDocument": {"uri": file_uri}, "position": pos})
    val = hover_res.get("contents", {}).get("value") if isinstance(hover_res, dict) and "contents" in hover_res else str(hover_res)
    short_val = (val or "").strip().replace("\n", " ")[:60]
    log("hover", f"@ L{target_line+1}:{target_char+1} -> {short_val} ({timings.get('textDocument/hover')} ms)")

    # 6. textDocument/definition
    def_res = request("textDocument/definition", {"textDocument": {"uri": file_uri}, "position": pos})
    defs = def_res if isinstance(def_res, list) else ([def_res] if def_res else [])
    def_strs = []
    for d in defs:
        p = os.path.relpath(file_url_to_path(d["uri"]), root_dir)
        def_strs.append(f"{p}:L{d['range']['start']['line']+1}")
    log("definition", f"-> {', '.join(def_strs) or '(none)'} ({timings.get('textDocument/definition')} ms)")

    # 7. textDocument/references
    ref_res = request("textDocument/references", {"textDocument": {"uri": file_uri}, "position": pos, "context": {"includeDeclaration": True}})
    log("references", f"{len(ref_res or [])} 箇所 ({timings.get('textDocument/references')} ms)")

    # 8. callHierarchy
    prep = request("textDocument/prepareCallHierarchy", {"textDocument": {"uri": file_uri}, "position": pos})
    if prep and len(prep) > 0:
        incoming = request("callHierarchy/incomingCalls", {"item": prep[0]})
        log("callHierarchy", f"{prep[0].get('name')} ← {len(incoming or [])} 件 ({timings.get('callHierarchy/incomingCalls', timings.get('textDocument/prepareCallHierarchy'))} ms)")

    # 9. completion
    comp = request("textDocument/completion", {"textDocument": {"uri": file_uri}, "position": {"line": 2, "character": 20}})
    comp_count = len(comp.get("items", [])) if isinstance(comp, dict) and "items" in comp else len(comp or [])
    log("completion", f"{comp_count} 件 ({timings.get('textDocument/completion')} ms)")

    # 10. shutdown & exit
    request("shutdown")
    notify("exit")
    log("shutdown", f"完了 ({timings.get('shutdown')} ms)")

    evidence["timings"] = timings
    if is_json:
        print(json.dumps(evidence, indent=2))
    else:
        print("\n================ 計測サマリー (Python) ================")
        print(f"LSP 実装: {server_info.get('name')} v{server_info.get('version')}")
        print(f"Python {sys.version.split()[0]} on {sys.platform}")
        for op, ms in timings.items():
            print(f"{op:<36}: {ms} ms")
        print("=======================================================\n")

    try:
        proc.terminate()
        proc.wait(timeout=0.5)
    except Exception:
        pass


if __name__ == "__main__":
    main()
