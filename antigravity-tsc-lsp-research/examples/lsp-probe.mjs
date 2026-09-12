#!/usr/bin/env node
/**
 * tsc-lsp 最小実証クライアント (LSP Probe)
 *
 * TypeScript 7 のネイティブ言語サーバー `tsc --lsp --stdio` を起動し、
 * AI エージェントが必要とする主要な LSP リクエスト（診断、hover、定義、参照、呼び出し階層、補完）
 * を送受信して応答時間と結果を計測・検証します。
 *
 * 使い方:
 *   node lsp-probe.mjs [project-root] [file.ts] [line] [character] [--json]
 *
 * 例:
 *   node lsp-probe.mjs ../evidence/fixture src/diagnostics-demo.ts 2 12
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const isJsonOutput = process.argv.includes('--json');

const rootArg = args[0] || path.join(path.dirname(fileURLToPath(import.meta.url)), '../evidence/fixture');
const fileArg = args[1] || 'src/diagnostics-demo.ts';
const lineArg = args[2] ?? '2'; // 0-based: line 2 = 3rd line "const totalAmount: number = processCheckout();"
const charArg = args[3] ?? '28'; // position on processCheckout

const root = path.resolve(rootArg);
const file = path.isAbsolute(fileArg) ? fileArg : path.resolve(root, fileArg);

if (!existsSync(file)) {
  console.error(`エラー: 対象ファイルが存在しません: ${file}`);
  process.exit(1);
}

// tsc バイナリの探索
const candidates = [
  path.join(root, 'node_modules', '.bin', 'tsc'),
  path.join(path.dirname(fileURLToPath(import.meta.url)), '../../node_modules', '.bin', 'tsc'),
  '/tmp/test-ts/node_modules/.bin/tsc',
  'tsc'
];

let tscBin = null;
for (const cand of candidates) {
  if (cand === 'tsc' || existsSync(cand)) {
    try {
      const ver = execSync(`${cand} --version`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (ver.includes('Version 7.') || ver.includes('7.0.') || ver.includes('7.1.')) {
        tscBin = cand;
        break;
      }
    } catch {
      // continue searching
    }
  }
}

if (!tscBin) {
  console.error('エラー: TypeScript 7 以上の tsc バイナリが見つかりませんでした。');
  console.error('解決策: `npm install typescript@7.0.2` を実行してください。');
  process.exit(1);
}

const pos = { line: parseInt(lineArg, 10), character: parseInt(charArg, 10) };
const t0 = Date.now();
const timings = {};
const rawEvidence = {
  environment: {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    tscBinary: tscBin,
  },
  requests: {}
};

// サーバー起動
const server = spawn(tscBin, ['--lsp', '--stdio'], {
  cwd: root,
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdoutBuf = Buffer.alloc(0);
let stderrBuf = '';
let nextId = 0;
const pending = new Map();
let isExiting = false;

function cleanRel(targetPath) {
  const p = path.resolve(targetPath);
  const r = path.resolve(root);
  if (p.toLowerCase().startsWith(r.toLowerCase())) {
    return p.slice(r.length).replace(/^[/\\]+/, '');
  }
  return path.basename(p);
}

function log(label, ...details) {
  if (!isJsonOutput) {
    const elapsed = String(Date.now() - t0).padStart(5);
    console.log(`[${elapsed}ms] ${label.padEnd(20)}`, ...details);
  }
}

function safeStringify(v, maxLen = 200) {
  if (v === undefined) return '(undefined)';
  if (v === null) return '(null)';
  try {
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    return s.length > maxLen ? s.slice(0, maxLen) + '…' : s;
  } catch {
    return String(v);
  }
}

function send(obj) {
  const s = JSON.stringify(obj);
  server.stdin.write(`Content-Length: ${Buffer.byteLength(s, 'utf8')}\r\n\r\n${s}`);
}

function notify(method, params) {
  send({ jsonrpc: '2.0', method, ...(params !== undefined ? { params } : {}) });
}

function request(method, params) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const reqStart = performance.now();
    pending.set(id, {
      resolve: res => {
        timings[method] = (performance.now() - reqStart).toFixed(2);
        resolve(res);
      },
      reject,
      method,
      params
    });
    send({ jsonrpc: '2.0', id, method, ...(params !== undefined ? { params } : {}) });
  });
}

// 早期エラーおよび終了ハンドラ
server.on('error', err => {
  console.error(`サーバープロセス起動エラー:`, err);
  for (const { reject } of pending.values()) reject(err);
  pending.clear();
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (!isExiting && code !== 0) {
    console.error(`サーバーが予期せず終了しました (code: ${code}, signal: ${signal})`);
    if (stderrBuf) console.error(`stderr: ${stderrBuf}`);
    for (const { reject } of pending.values()) reject(new Error(`Server exited prematurely: ${code}`));
    pending.clear();
    process.exit(code ?? 1);
  }
});

server.stderr.on('data', chunk => {
  stderrBuf += chunk.toString();
});

server.stdout.on('data', chunk => {
  stdoutBuf = Buffer.concat([stdoutBuf, chunk]);
  while (true) {
    const headerEnd = stdoutBuf.indexOf('\r\n\r\n');
    if (headerEnd < 0) break;
    const header = stdoutBuf.subarray(0, headerEnd).toString('ascii');
    const match = /Content-Length: (\d+)/i.exec(header);
    if (!match) break;
    const len = parseInt(match[1], 10);
    if (stdoutBuf.length < headerEnd + 4 + len) break;

    const bodyStr = stdoutBuf.subarray(headerEnd + 4, headerEnd + 4 + len).toString('utf8');
    stdoutBuf = stdoutBuf.subarray(headerEnd + 4 + len);

    let msg;
    try {
      msg = JSON.parse(bodyStr);
    } catch (e) {
      console.error('JSON パースエラー:', e, bodyStr);
      continue;
    }

    // 1. サーバーからクライアントへのリクエスト（id があり、かつ method がある）
    if (msg.id !== undefined && msg.method) {
      if (msg.method === 'workspace/configuration') {
        const items = msg.params?.items || [];
        send({ jsonrpc: '2.0', id: msg.id, result: items.map(() => null) });
      } else {
        send({ jsonrpc: '2.0', id: msg.id, result: null });
      }
      continue;
    }

    // 2. クライアントのリクエストに対するサーバーからのレスポンス
    if (msg.id !== undefined && pending.has(msg.id)) {
      const { resolve, reject, method } = pending.get(msg.id);
      pending.delete(msg.id);
      rawEvidence.requests[method] = {
        result: msg.result,
        error: msg.error
      };
      if (msg.error) {
        reject(new Error(`LSP Error [${method}]: ${msg.error.message} (${msg.error.code})`));
      } else {
        resolve(msg.result);
      }
      continue;
    }

    // 3. 通知 (Notification)
    if (msg.method) {
      if (msg.method === 'textDocument/publishDiagnostics') {
        const diagUri = msg.params.uri;
        const relPath = cleanRel(fileURLToPath(diagUri));
        log('pushDiagnostics', `${relPath}: ${msg.params.diagnostics.length} 件`);
      }
    }
  }
});

async function main() {
  const rootUri = pathToFileURL(root).href;
  const fileUri = pathToFileURL(file).href;
  const fileContent = readFileSync(file, 'utf8');

  // 1. initialize
  const initResult = await request('initialize', {
    processId: process.pid,
    rootUri,
    workspaceFolders: [{ uri: rootUri, name: path.basename(root) }],
    initializationOptions: {
      disablePushDiagnostics: false
    },
    capabilities: {
      textDocument: {
        diagnostic: { dynamicRegistration: true },
        hover: { contentFormat: ['markdown', 'plaintext'] },
        definition: { dynamicRegistration: true },
        references: { dynamicRegistration: true },
        documentSymbol: { hierarchicalDocumentSymbolSupport: true },
        completion: { completionItem: { snippetSupport: true, documentationFormat: ['markdown'] } }
      },
      workspace: {
        configuration: true
      }
    }
  });

  const serverInfo = initResult.serverInfo || { name: 'unknown', version: 'unknown' };
  log('initialize', `${serverInfo.name} v${serverInfo.version} (${timings['initialize']} ms)`);
  notify('initialized', {});

  // 2. didOpen
  const tOpen = performance.now();
  notify('textDocument/didOpen', {
    textDocument: {
      uri: fileUri,
      languageId: file.endsWith('x') ? 'typescriptreact' : 'typescript',
      version: 1,
      text: fileContent
    }
  });
  timings['didOpen'] = (performance.now() - tOpen).toFixed(2);
  log('didOpen', `${cleanRel(file)} opened (${timings['didOpen']} ms)`);

  // 3. textDocument/diagnostic (Pull 診断)
  const diagResult = await request('textDocument/diagnostic', {
    textDocument: { uri: fileUri }
  });
  const diagItems = diagResult?.items || [];
  log('diagnostic', `${diagItems.length} 件 (${timings['textDocument/diagnostic']} ms)`);
  for (const d of diagItems) {
    const range = `L${d.range.start.line + 1}:${d.range.start.character + 1}-L${d.range.end.line + 1}:${d.range.end.character + 1}`;
    log('  └─ diag item', `${range} [TS${d.code}] ${d.message}`);
  }

  // 4. textDocument/documentSymbol
  const symResult = await request('textDocument/documentSymbol', {
    textDocument: { uri: fileUri }
  });
  const topSymbols = (symResult || []).map(s => s.name).join(', ');
  log('documentSymbol', `${symResult?.length || 0} 件 [${topSymbols}] (${timings['textDocument/documentSymbol']} ms)`);

  // 5. textDocument/hover
  const hoverResult = await request('textDocument/hover', {
    textDocument: { uri: fileUri },
    position: pos
  });
  const hoverVal = hoverResult?.contents?.value ?? hoverResult?.contents ?? '(なし)';
  log('hover', `@ L${pos.line + 1}:${pos.character + 1} -> ${safeStringify(hoverVal, 80)} (${timings['textDocument/hover']} ms)`);

  // 6. textDocument/definition
  const defResult = await request('textDocument/definition', {
    textDocument: { uri: fileUri },
    position: pos
  });
  const defs = Array.isArray(defResult) ? defResult : (defResult ? [defResult] : []);
  const defStr = defs.map(d => {
    const p = cleanRel(fileURLToPath(d.uri));
    return `${p}:L${d.range.start.line + 1}:${d.range.start.character + 1}`;
  }).join(', ') || '(none)';
  log('definition', `-> ${defStr} (${timings['textDocument/definition']} ms)`);

  // 7. textDocument/references
  const refResult = await request('textDocument/references', {
    textDocument: { uri: fileUri },
    position: pos,
    context: { includeDeclaration: true }
  });
  const refs = refResult || [];
  log('references', `${refs.length} 箇所 (${timings['textDocument/references']} ms)`);

  // 8. textDocument/prepareCallHierarchy & incomingCalls
  const prepCall = await request('textDocument/prepareCallHierarchy', {
    textDocument: { uri: fileUri },
    position: pos
  });
  if (prepCall && prepCall.length > 0) {
    const incoming = await request('callHierarchy/incomingCalls', { item: prepCall[0] });
    const inList = (incoming || []).map(ic => {
      const p = cleanRel(fileURLToPath(ic.from.uri));
      const name = ic.from.name.includes('/') ? '(module scope)' : ic.from.name;
      return `${name} (${p}:L${ic.from.range.start.line + 1})`;
    }).join(', ') || '(なし)';
    log('callHierarchy', `${prepCall[0].name} ← [${inList}] (${timings['callHierarchy/incomingCalls'] || timings['textDocument/prepareCallHierarchy']} ms)`);
  } else {
    log('callHierarchy', '(呼び出し対象シンボルなし)');
  }

  // 9. textDocument/completion
  const compResult = await request('textDocument/completion', {
    textDocument: { uri: fileUri },
    position: { line: 2, character: 20 } // process... 補完候補
  });
  const compItemsCount = compResult?.items?.length ?? (Array.isArray(compResult) ? compResult.length : 0);
  log('completion', `${compItemsCount} 件 (${timings['textDocument/completion']} ms)`);

  // 10. shutdown (引数は省略: null を渡すと InvalidParams エラーになる)
  await request('shutdown');
  log('shutdown', `成功 (${timings['shutdown']} ms)`);

  // 11. exit 通知
  isExiting = true;
  notify('exit');

  rawEvidence.timings = timings;

  if (isJsonOutput) {
    console.log(JSON.stringify(rawEvidence, null, 2));
  } else {
    console.log('\n================ 計測サマリー ================');
    console.log(`LSP 実装: ${serverInfo.name} v${serverInfo.version}`);
    console.log(`プラットフォーム: ${process.platform} (${process.arch}), Node ${process.version}`);
    console.table(
      Object.entries(timings).map(([op, ms]) => ({
        'LSP 操作': op,
        '所要時間': `${ms} ms`
      }))
    );
    console.log('==============================================\n');
  }

  setTimeout(() => process.exit(0), 100);
}

main().catch(err => {
  console.error('実行エラー:', err);
  process.exit(1);
});
