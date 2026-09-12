# slides

調査報告・解説スライドを集めたリポジトリです。各スライドは外部ライブラリ不要の自己完結型 HTML で、ブラウザで開くだけで閲覧できます。

## スライド一覧

### [Playwright 概要 — ライブラリ・CLI・MCP](playwright-overview/index.html)

Playwright の 3 つの利用形態（テストライブラリ/ランナー・CLI・MCP）を、利用シーン・メリット/デメリット・要素技術（Locator / auto-waiting / web-first assertion / アクセシビリティツリーなど）・確実性の高いテストコード作成の順序の観点で整理した解説スライド（全 16 枚）。

- `playwright-overview/index.html` を開き、← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF
- 詳細: [playwright-overview/README.md](playwright-overview/README.md)

### [Claude Code コマンド一覧](claude-code-commands/index.html)

Claude Code のスラッシュコマンド・CLI コマンド/フラグ・キー操作をジャンル別に整理し、1 コマンド 1 スライドで解説。公式ベストプラクティスに基づくユースケースと類似コマンドの使い分けもまとめた全 6 デッキ（約 200 枚）。（Issue [#2](https://github.com/ysksm/slides/issues/2)）

- Marp 製。`claude-code-commands/index.html` の目次から各デッキへ移動。矢印キーで送り、`F` で全画面、`P` でプレゼンターモード
- ソースは `claude-code-commands/src/*.md`。`./build.sh` で再生成可能
- 詳細: [claude-code-commands/README.md](claude-code-commands/README.md)

### [tsc --lsp 徹底調査 — 機能・利用ケースと AI エージェント活用の総合評価](antigravity-tsc-lsp-research/index.html)

TypeScript 7 の Go ネイティブ言語サーバー `tsc --lsp` のアーキテクチャ・通信プロトコル・実測性能・AI コーディングエージェント連携を徹底調査した報告スライド（全 20 枚）。実証クライアント（Node.js / Python）、Claude Code プラグイン雛形、MCP サーバー、実機計測ログを同梱。（Issue [#1](https://github.com/ysksm/slides/issues/1)）

- `antigravity-tsc-lsp-research/index.html` を開き、← → / Space で移動、O で一覧、N でノート、F で全画面、P で印刷/PDF
- 詳細技術報告書: [antigravity-tsc-lsp-research/research.md](antigravity-tsc-lsp-research/research.md)
- 詳細: [antigravity-tsc-lsp-research/README.md](antigravity-tsc-lsp-research/README.md)

### [tsc --lsp 調査報告（初版）](tsc-lsp/index.html)

上記徹底調査の元になった初版スライド。`tsc --lsp` の機能・用途・AI エージェント活用の概要と最小実証クライアントを収録。（Issue [#1](https://github.com/ysksm/slides/issues/1)）

- 詳細: [tsc-lsp/README.md](tsc-lsp/README.md)

## リポジトリ構成

```
slides/
├── playwright-overview/           # Playwright 概要スライド（ライブラリ・CLI・MCP）
├── claude-code-commands/          # Claude Code コマンド一覧スライド（Marp 製・全 6 デッキ）
├── antigravity-tsc-lsp-research/  # tsc --lsp 徹底調査スライド・実証コード・計測ログ
├── tsc-lsp/                       # tsc --lsp 調査報告（初版）
├── docs/                          # GitHub Pages 公開用（.github/workflows/deploy-pages.yml でデプロイ）
└── .github/workflows/             # GitHub Pages デプロイワークフロー
```

## 閲覧方法

各ディレクトリの `index.html` をモダンブラウザで開いてください。インストール・ビルド不要です。共通のキー操作:

| 操作 | キー |
|---|---|
| 次へ / 前へ | `→` `Space` / `←` |
| 一覧表示 | `O` |
| 全画面 | `F` |
| 印刷 / PDF | `P` |
