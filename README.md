# slides

調査報告・解説スライドを集めたリポジトリです。各スライドはビルド不要の HTML で、`index.html` をブラウザで開くだけで閲覧できます（JavaScript ライブラリへの依存なし。Web フォントのみ CDN を参照するため、オフラインでは代替フォントで表示されます）。

## スライド一覧

| スライド | 枚数 | 形式 | 関連 Issue |
|---|---:|---|---|
| [自動実装 × AI — Rails generate を DDD フロントエンドで再現する](ai-scaffold/index.html) | 32 | 手書き HTML | [#16](https://github.com/ysksm/slides/issues/16) |
| [Orca 解説 — AI エージェント時代のオーケストレーター IDE](orca/index.html) | 42 | 手書き HTML | [#3](https://github.com/ysksm/slides/issues/3) |
| [Playwright 概要 — ライブラリ・CLI・MCP](playwright-overview/index.html) | 16 | 手書き HTML | — |
| [Claude Code コマンド一覧](claude-code-commands/index.html) | 201（6 デッキ） | Marp（`src/*.md` から生成） | [#2](https://github.com/ysksm/slides/issues/2) |
| [tsc --lsp 徹底調査](antigravity-tsc-lsp-research/index.html) | 20 | 手書き HTML + 実証コード | [#1](https://github.com/ysksm/slides/issues/1) |
| [tsc --lsp 調査報告（初版）](tsc-lsp/index.html) | 16 | 手書き HTML | [#1](https://github.com/ysksm/slides/issues/1) |

### [自動実装 × AI — Rails generate を DDD フロントエンドで再現する](ai-scaffold/index.html)

Rails の `generate` のようにモデル情報から UI・モデル・ユースケース・リポジトリを生成する仕組みを、DDD レイヤードアーキテクチャ（React・Hooks・Redux / DIP / Repository パターン / TypeSpec）の Web フロントエンド向けに検討した設計提案スライド（全 32 枚）。「スクリプトが決定論的に生成し、AI がその引数（生成仕様ファイル）を考える」を軸に、検討メモ、4 案（自作ジェネレーター / TypeSpec 単一ソース / 規約 + ガードレール / 既存テンプレート CLI）の比較、推奨案の設計、6 フェーズの実施計画とタスクをまとめている。

- `ai-scaffold/index.html` を開き、← → / Space で移動、O または T で目次、F で全画面、P で印刷/PDF
- URL のハッシュ（`#12` など）でスライド番号を直接指定可能
- 同梱物: [notes.md](ai-scaffold/notes.md)（検討メモ全文）、[plan.md](ai-scaffold/plan.md)（実施計画とタスク）、`examples/order.spec.yaml`（生成仕様の例）、`examples/spec.schema.json`（JSON Schema の叩き台）
- 詳細: [ai-scaffold/README.md](ai-scaffold/README.md)

### [Orca 解説 — AI エージェント時代のオーケストレーター IDE](orca/index.html)

Claude Code・Codex・Cursor CLI などの CLI エージェントをタスクごとの git worktree で並列に走らせる IDE「Orca」（stablyai/orca）の解説スライド（全 42 枚）。機能一覧（1 行解説）、機能ごとの設定場所、オーケストレーション・オートメーション・タスク管理、リポジトリ／ワークスペースの切り方、マルチリポで 1 タスクを回す手順、組み合わせレシピ 5 本をまとめている。

- `orca/index.html` を開き、← → / Space で移動、O または T で目次、F で全画面、P で印刷/PDF
- URL のハッシュ（`#12` など）でスライド番号を直接指定可能
- 詳細: [orca/README.md](orca/README.md)

### [Playwright 概要 — ライブラリ・CLI・MCP](playwright-overview/index.html)

Playwright の 3 つの利用形態（テストライブラリ/ランナー・CLI・MCP）を、利用シーン・メリット/デメリット・要素技術（Locator / auto-waiting / web-first assertion / アクセシビリティツリーなど）・確実性の高いテストコード作成の順序の観点で整理した解説スライド（全 16 枚）。

- `playwright-overview/index.html` を開き、← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#5` など）でスライド番号を直接指定可能
- 詳細: [playwright-overview/README.md](playwright-overview/README.md)

### [Claude Code コマンド一覧](claude-code-commands/index.html)

Claude Code のスラッシュコマンド・CLI コマンド/フラグ・キー操作をジャンル別に整理し、1 コマンド 1 スライドで解説。公式ベストプラクティスに基づくユースケースと類似コマンドの使い分けもまとめた全 6 デッキ・計 201 枚。対象バージョンは Claude Code v2.1.269。

| デッキ | 内容 | 枚数 |
|---|---|---:|
| [01-overview](claude-code-commands/01-overview.html) | コマンドの種類、全ジャンルの一覧と一行解説 | 18 |
| [02-session-context-model](claude-code-commands/02-session-context-model.html) | セッション管理 / コンテキスト・メモリ・計画 / モデル・性能 | 32 |
| [03-review-parallel-permissions](claude-code-commands/03-review-parallel-permissions.html) | レビュー・検証 / 並列・自動化・ワークフロー / 権限・設定・UI | 38 |
| [04-extensions-integrations-account](claude-code-commands/04-extensions-integrations-account.html) | 拡張（Skill / Plugin / MCP）/ 連携・リモート / アカウント / 診断 / 廃止 | 53 |
| [05-cli-shortcuts-skills](claude-code-commands/05-cli-shortcuts-skills.html) | `claude` CLI サブコマンド、用途別フラグ、キー操作、SKILL.md による自作コマンド | 41 |
| [06-usecases](claude-code-commands/06-usecases.html) | ユースケース、ダイナミックワークフローの要否、類似コマンドの使い分け、失敗パターン | 19 |

- `claude-code-commands/index.html` の目次から各デッキへ移動。矢印キーで送り、`F` で全画面、`P` でプレゼンターモード
- ソースは `claude-code-commands/src/*.md`（Marp 形式）、テーマは `theme/claude.css`。`./build.sh` で再生成
- 詳細: [claude-code-commands/README.md](claude-code-commands/README.md)

### [tsc --lsp 徹底調査 — 機能・利用ケースと AI エージェント活用の総合評価](antigravity-tsc-lsp-research/index.html)

TypeScript 7 の Go ネイティブ言語サーバー `tsc --lsp` のアーキテクチャ・通信プロトコル・実測性能・AI コーディングエージェント連携を徹底調査した報告スライド（全 20 枚）。

- `antigravity-tsc-lsp-research/index.html` を開き、← → / Space で移動、O で一覧、N でノート、F で全画面、P で印刷/PDF
- 詳細技術報告書: [antigravity-tsc-lsp-research/research.md](antigravity-tsc-lsp-research/research.md)
- 同梱物:
  - `examples/lsp-probe.mjs` — Node.js 版実証クライアント（診断・hover・定義・参照・callHierarchy を実測）
  - `examples/probe_lsp.py` — Python 3 版実証クライアント（標準ライブラリのみ）
  - `examples/claude-code-plugin/` — Claude Code へ `tsc --lsp --stdio` を接続する `.lsp.json` 雛形
  - `examples/agent-mcp/` — AI エージェント向け MCP サーバー
  - `evidence/` — TypeScript 7.0.2 の実機計測ログと検証用フィクスチャ
- 詳細: [antigravity-tsc-lsp-research/README.md](antigravity-tsc-lsp-research/README.md)

### [tsc --lsp 調査報告（初版）](tsc-lsp/index.html)

上記徹底調査の元になった初版スライド（全 16 枚）。`tsc --lsp` の機能・用途・AI エージェント活用の概要と、最小実証クライアント（`examples/lsp-probe.mjs`）・Claude Code プラグイン雛形を収録。

- 詳細: [tsc-lsp/README.md](tsc-lsp/README.md)

## リポジトリ構成

```
slides/
├── ai-scaffold/                   # 自動実装 × AI（DDD フロントエンドの generate 設計）スライド
│   ├── notes.md                   #   検討メモ全文
│   ├── plan.md                    #   実施計画とタスク
│   └── examples/                  #   生成仕様の例と JSON Schema
├── orca/                          # Orca（AI エージェント IDE）解説スライド
├── playwright-overview/           # Playwright 概要スライド（ライブラリ・CLI・MCP）
├── claude-code-commands/          # Claude Code コマンド一覧スライド（Marp 製・全 6 デッキ）
│   ├── src/                       #   Marp ソース（*.md）
│   ├── theme/                     #   Marp テーマ（claude.css）
│   └── build.sh                   #   src/*.md → ./*.html のビルドスクリプト
├── antigravity-tsc-lsp-research/  # tsc --lsp 徹底調査スライド
│   ├── research.md                #   詳細技術報告書
│   ├── examples/                  #   実証クライアント・Claude Code プラグイン・MCP サーバー
│   └── evidence/                  #   実機計測ログ・検証用フィクスチャ
├── tsc-lsp/                       # tsc --lsp 調査報告（初版）
├── index.html                     # GitHub Pages のトップページ（スライド目次）
├── .nojekyll                      # Pages で Jekyll 処理を無効化
└── .github/workflows/             # GitHub Pages デプロイワークフロー
```

## 閲覧方法

各ディレクトリの `index.html` をモダンブラウザで開いてください。インストール・ビルド不要です。共通のキー操作:

| 操作 | キー | 対応デッキ |
|---|---|---|
| 次へ / 前へ | `→` `Space` `PageDown` / `←` `Backspace` `PageUp` | すべて |
| 最初 / 最後へ | `Home` / `End` | Marp 製以外 |
| 一覧表示 | `O` | Marp 製以外 |
| 発表者ノート | `N` | `antigravity-tsc-lsp-research` |
| 全画面 | `F` | すべて |
| 印刷 / PDF | `P` | `playwright-overview`、`antigravity-tsc-lsp-research`、`orca` |

※ Marp 製の `claude-code-commands` では `P` はプレゼンターモードです。`tsc-lsp`（初版）は `P` に未対応のため、ブラウザの印刷機能を使ってください。

## ビルド

手書き HTML のスライド（`orca` / `playwright-overview` / `antigravity-tsc-lsp-research` / `tsc-lsp`）はビルド不要で、HTML を直接編集します。

Marp 製の `claude-code-commands` のみ、ソース（`src/*.md`）を編集したら再生成が必要です。

```bash
cd claude-code-commands
./build.sh            # src/*.md → ./*.html
./build.sh --pdf      # PDF も併せて出力
```

## 公開サイト

<https://ysksm.github.io/slides/>

`main` への push で `.github/workflows/deploy-pages.yml` が動き、リポジトリルートがそのまま GitHub Pages に公開されます。ルートの `index.html` が全スライドの目次で、各スライドは `https://ysksm.github.io/slides/<ディレクトリ名>/` で開けます。

`.nojekyll` を置いて Jekyll による変換を無効化しているため、HTML・CSS・JS はリポジトリ内のファイルがそのまま配信されます。新しいスライドを追加した場合は、ルートの `index.html` にもリンクを追加してください。
