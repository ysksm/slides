# tsc --lsp 徹底調査：TypeScript 7 ネイティブ言語サーバーと AI エージェントの未来

GitHub Issue [#1 (tsc --lspについての調査)](https://github.com/ysksm/slides/issues/1) に対する調査報告スライドおよび実証コード一式です。

TypeScript 7.0 で導入された Go 言語ネイティブの言語サーバー `tsc --lsp --stdio` について、そのアーキテクチャ、通信プロトコル、機能、実測性能、AI コーディングエージェント（Claude Code / Antigravity / Orca 等）での活用手法、現時点の制約を徹底調査・実証しました。

---

## 📂 収録ファイル構成

```
antigravity-tsc-lsp-research/
├── index.html                  # プレゼンテーションスライド本体 (全20枚)
├── style.css                   # スライド・印刷・一覧表示用スタイルシート
├── slides.js                   # キーボード操作・一覧・発表者ノート・全画面制御スクリプト
├── research.md                 # 詳細技術調査報告書（仕様・実測・移行ガイド）
├── README.md                   # 本ドキュメント
├── examples/
│   ├── lsp-probe.mjs           # Node.js 版実証クライアント（全 LSP 操作を実測）
│   ├── probe_lsp.py            # Python 3 版実証クライアント（標準ライブラリのみで動作）
│   ├── claude-code-plugin/     # Claude Code 向け .lsp.json プラグイン雛形
│   └── agent-mcp/              # AI エージェント向け Model Context Protocol (MCP) サーバー
└── evidence/
    ├── probe-run.json          # TypeScript 7.0.2 実機計測ログ・Capabilities 全文
    └── fixture/                # 実機検証に用いたサンプルプロジェクト (tsconfig, ts ファイル群)
```

---

## 🖥️ スライドの閲覧方法

[index.html](index.html) を任意のモダンブラウザで開いてください。外部ライブラリのインストール不要で、そのまま閲覧できます。

### キーボードショートカット・操作一覧

| 操作 | キー / 操作方法 |
|---|---|
| **次へ** | `→` / `Space` / `PageDown` / `Enter` / 画面右側クリック |
| **前へ** | `←` / `Backspace` / `PageUp` / 画面左側クリック |
| **先頭 / 末尾** | `Home` / `End` |
| **一覧表示** | `O` キー / 画面下の「一覧」ボタン（クリックで直接ジャンプ可能） |
| **発表者ノート** | `N` キー / 画面下の「ノート」ボタン（各スライドの補足解説を表示） |
| **全画面表示** | `F` キー / 画面下の「全画面」ボタン |
| **印刷 / PDF** | `P` キー / ブラウザの印刷機能（全20枚がランドスケープで綺麗に出力されます） |
| **直接リンク** | `index.html#5` のようにハッシュで特定ページを指定可能 |

---

## 🚀 実証スクリプトの実行方法 (再現手順)

スライド内に掲載しているベンチマークおよびプロトコルトレースは、同梱のスクリプトで完全に手元で再現できます。

### 前提環境
- Node.js v20+ または Python 3.10+
- TypeScript 7.0+ (`npm install typescript@7.0.2`)

### 1. Node.js 版プローブの実行
```sh
# 付属の fixture を対象に実行
node antigravity-tsc-lsp-research/examples/lsp-probe.mjs

# JSON 形式で全トレースを取得
node antigravity-tsc-lsp-research/examples/lsp-probe.mjs --json
```

### 2. Python 3 版プローブの実行
```sh
python3 antigravity-tsc-lsp-research/examples/probe_lsp.py
```

### 3. AI エージェント向け MCP サーバーの起動
```sh
node antigravity-tsc-lsp-research/examples/agent-mcp/mcp-server.mjs
```

---

## 📊 調査の要点

1. **Go ネイティブ化による圧倒的高速化**:
   - 起動初期化時間は **27.8 ms**（TS 6 + Node.js の 410 ms から **約 15 倍高速**）。
   - 常駐メモリは **18.2 MB**（TS 6 の 239 MB から **約 1/13 に削減**）。
   - ナビゲーション・ホバー・参照検索はすべて **1 ms 未満**。
2. **標準 LSP 3.17 の全領域をサポート**:
   - Pull 型診断 (`textDocument/diagnostic`)、Push 診断 (`publishDiagnostics`)、定義、型定義、実装、参照、Call Hierarchy、リネーム、補完（2,000 件以上を 7.6 ms で返却）を完備。
3. **AI エージェントにとっての価値**:
   - 従来の `tsc --noEmit`（数秒）に代わり、編集したファイルだけを **1〜20 ms** でピンポイント Pull 診断。
   - LLM が自律的に「編集 → 即座診断 → 自己修正」の極小フィードバックループを回せる。
4. **現時点での制約と注意点**:
   - トランスポートは `--stdio` のみ（Socket や Pipe は未実装）。
   - `shutdown` に `params: null` を渡すと `InvalidParams` エラーになる厳格仕様。
   - Vue / Svelte / Astro 等の従来の Volar 言語サービスプラグインは TS 7 の Go バイナリでは動作しないため、混在プロジェクトでは TS 6 残留またはハイブリッド構成が推奨。
