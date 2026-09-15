# slides

調査報告・解説スライドを集めたリポジトリです。各スライドはビルド不要の HTML で、`index.html` をブラウザで開くだけで閲覧できます（JavaScript ライブラリへの依存なし。Web フォントのみ CDN を参照するため、オフラインでは代替フォントで表示されます）。

スライドは 7 つのカテゴリに分けて並べています。[公開サイト](https://ysksm.github.io/slides/)のトップページでは、カテゴリのボタンとキーワード検索（題名・概要・タグ・ディレクトリ名が対象）で絞り込めます。

## スライド一覧

カテゴリ別に並べています。[公開サイト](https://ysksm.github.io/slides/)ではカテゴリのボタンとキーワード検索で絞り込めます（`?cat=<カテゴリキー>` `?q=<キーワード>` を付けた URL で絞り込んだ状態を共有できます）。

| カテゴリ | キー | 本数 | 内容 |
|---|---|---:|---|
| [AI エージェント運用](#ai) | `ai` | 4 | Claude Code などの AI コーディングエージェントの使い方・コスト・実行環境。 |
| [AI × 自動生成・設計](#codegen) | `codegen` | 2 | モデル情報からコードを生成する仕組みと、AI をその設計に組み込む検討。 |
| [テスト・品質](#testing) | `testing` | 2 | ブラウザ自動化によるテスト・資料づくりとデグレ防止。 |
| [開発ツール・言語基盤](#devtools) | `devtools` | 4 | リンタ・検索・言語サーバーなど、日々の開発を支えるツールの中身。 |
| [Web アプリ開発](#web) | `web` | 2 | 既存 Web アプリの UI を作り替えるための構成・API・配信の検討。 |
| [組み込み Linux](#embedded) | `embedded` | 2 | Yocto Project による組み込み Linux ディストリビューションづくり。 |
| [セキュリティ・データ](#security) | `security` | 1 | 脆弱性情報の収集・分類と、時系列での可視化の設計。 |

<a id="ai"></a>

### AI エージェント運用

Claude Code などの AI コーディングエージェントの使い方・コスト・実行環境。

| スライド | 枚数 | 形式 | 関連 Issue |
|---|---:|---|---|
| [Claude Code のトークン使用量と削減策](claude-code-token-usage/index.html) | 18 | 手書き HTML | [#15](https://github.com/ysksm/slides/issues/15) |
| [すぐ溶ける AI の利用枠 — キャッシュの仕組み（動画要約）](ai-usage-cache/index.html) | 15 | 手書き HTML | [#15](https://github.com/ysksm/slides/issues/15) |
| [Orca 解説 — AI エージェント時代のオーケストレーター IDE](orca/index.html) | 42 | 手書き HTML | [#3](https://github.com/ysksm/slides/issues/3) |
| [Claude Code コマンド一覧](claude-code-commands/index.html) | 201（6 デッキ） | Marp（`src/*.md` から生成） | [#2](https://github.com/ysksm/slides/issues/2) |

<a id="codegen"></a>

### AI × 自動生成・設計

モデル情報からコードを生成する仕組みと、AI をその設計に組み込む検討。

| スライド | 枚数 | 形式 | 関連 Issue |
|---|---:|---|---|
| [自動実装 × AI — Rails generate を DDD フロントエンドで再現する](ai-scaffold/index.html) | 32 | 手書き HTML | [#16](https://github.com/ysksm/slides/issues/16) |
| [自動実装と AI の組み合わせ](ai-scaffolding/index.html) | 28 | 手書き HTML + 設計・タスク | [#16](https://github.com/ysksm/slides/issues/16) |

<a id="testing"></a>

### テスト・品質

ブラウザ自動化によるテスト・資料づくりとデグレ防止。

| スライド | 枚数 | 形式 | 関連 Issue |
|---|---:|---|---|
| [Playwright 活用方法 — 画面遷移図・デグレ防止・ローカライズ資料](playwright-practices/index.html) | 18 | 手書き HTML | [#34](https://github.com/ysksm/slides/issues/34) |
| [Playwright 概要 — ライブラリ・CLI・MCP](playwright-overview/index.html) | 16 | 手書き HTML | — |

<a id="devtools"></a>

### 開発ツール・言語基盤

リンタ・検索・言語サーバーなど、日々の開発を支えるツールの中身。

| スライド | 枚数 | 形式 | 関連 Issue |
|---|---:|---|---|
| [Oxlint で独自の Lint ルールを作る — JS プラグイン実践](oxlint-custom-rules/index.html) | 21 | 手書き HTML | [#33](https://github.com/ysksm/slides/issues/33) |
| [tgrep 解説 — トライグラム索引・AI エージェント連携・プラグイン化](tgrep-overview/index.html) | 21 | 手書き HTML | [#29](https://github.com/ysksm/slides/issues/29) |
| [tsc --lsp 徹底調査](antigravity-tsc-lsp-research/index.html) | 20 | 手書き HTML + 実証コード | [#1](https://github.com/ysksm/slides/issues/1) |
| [tsc --lsp 調査報告（初版）](tsc-lsp/index.html) | 16 | 手書き HTML | [#1](https://github.com/ysksm/slides/issues/1) |

<a id="web"></a>

### Web アプリ開発

既存 Web アプリの UI を作り替えるための構成・API・配信の検討。

| スライド | 枚数 | 形式 | 関連 Issue |
|---|---:|---|---|
| [Redmine の UI を SPA で作る（構成・導入編）](redmine-ui-spa-2/index.html) | 19 | 手書き HTML + 調査メモ | [#26](https://github.com/ysksm/slides/issues/26) |
| [Redmine の UI を SPA で作るための技術](redmine-ui-spa/index.html) | 16 | 手書き HTML | [#26](https://github.com/ysksm/slides/issues/26) |

<a id="embedded"></a>

### 組み込み Linux

Yocto Project による組み込み Linux ディストリビューションづくり。

| スライド | 枚数 | 形式 | 関連 Issue |
|---|---:|---|---|
| [Yocto ビルドホストの構築手順 — ディストリビューションの選択とインストール](yocto-build-host/index.html) | 18 | 手書き HTML | [#40](https://github.com/ysksm/slides/issues/40) |
| [Yocto 入門 — macOS/VM で作る Raspberry Pi・ルーター・x86_64 の Linux イメージ](yocto-intro/index.html) | 20 | 手書き HTML | [#32](https://github.com/ysksm/slides/issues/32) |

<a id="security"></a>

### セキュリティ・データ

脆弱性情報の収集・分類と、時系列での可視化の設計。

| スライド | 枚数 | 形式 | 関連 Issue |
|---|---:|---|---|
| [npm ライブラリの不具合・脆弱性の時系列集計](npm-vulnerability-trends/index.html) | 14 | 手書き HTML + 設計資料 | [#18](https://github.com/ysksm/slides/issues/18) |

## 各スライドの詳細

上の一覧と同じカテゴリ順（カテゴリ内は新しい順）で並べています。

### [Claude Code のトークン使用量と削減策](claude-code-token-usage/index.html)

Claude Code 公式ドキュメント（code.claude.com/docs）に基づき、トークンがどう消費されるか（毎リクエストで会話全体を送信、ツール使用ごとにリクエストが増える）、コンテキストウィンドウに何が乗るか、プロンプトキャッシュの 3 層構造・無効化する操作・TTL、`/usage` `/context` `/insights` による計測、削減策（`/clear` `/compact`、モデル・effort・thinking、MCP・CLAUDE.md・スキル、フック・サブエージェント、プロンプトの書き方）、組織での管理を、各スライドに出典 URL 付きで整理した解説スライド（全 18 枚）。

- `claude-code-token-usage/index.html` を開き、← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#7` など）でスライド番号を直接指定可能
- 詳細: [claude-code-token-usage/README.md](claude-code-token-usage/README.md)

### [すぐ溶ける AI の利用枠 — キャッシュの仕組み（動画要約）](ai-usage-cache/index.html)

YouTube 動画「[AIの使用枠がすぐになくなる？ChatGPTとClaudeの利用枠を節約するキャッシュの仕組みを解説してみた](https://www.youtube.com/watch?v=t22FELAl-BM)」（にゃんたのAIチャンネル）の要約スライド（全 15 枚）。会話履歴が毎回送り直される仕組み、プロンプトキャッシュ（先頭一致）の考え方、キャッシュを切らさない 3 原則、ChatGPT のチャット/ワーク・Claude のプロジェクト機能の使い分け、ツール呼び出し回数の抑制を図解付きで整理し、Claude 側の数値は公式ドキュメントで裏取りしている。

- `ai-usage-cache/index.html` を開き、← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF
- 詳細: [ai-usage-cache/README.md](ai-usage-cache/README.md)

### [Orca 解説 — AI エージェント時代のオーケストレーター IDE](orca/index.html)

Claude Code・Codex・Cursor CLI などの CLI エージェントをタスクごとの git worktree で並列に走らせる IDE「Orca」（stablyai/orca）の解説スライド（全 42 枚）。機能一覧（1 行解説）、機能ごとの設定場所、オーケストレーション・オートメーション・タスク管理、リポジトリ／ワークスペースの切り方、マルチリポで 1 タスクを回す手順、組み合わせレシピ 5 本をまとめている。

- `orca/index.html` を開き、← → / Space で移動、O または T で目次、F で全画面、P で印刷/PDF
- URL のハッシュ（`#12` など）でスライド番号を直接指定可能
- 詳細: [orca/README.md](orca/README.md)

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

### [自動実装 × AI — Rails generate を DDD フロントエンドで再現する](ai-scaffold/index.html)

Rails の `generate` のようにモデル情報から UI・モデル・ユースケース・リポジトリを生成する仕組みを、DDD レイヤードアーキテクチャ（React・Hooks・Redux / DIP / Repository パターン / TypeSpec）の Web フロントエンド向けに検討した設計提案スライド（全 32 枚）。「スクリプトが決定論的に生成し、AI がその引数（生成仕様ファイル）を考える」を軸に、検討メモ、4 案（自作ジェネレーター / TypeSpec 単一ソース / 規約 + ガードレール / 既存テンプレート CLI）の比較、推奨案の設計、6 フェーズの実施計画とタスクをまとめている。同じ Issue #16 を別の切り口で検討した [ai-scaffolding](ai-scaffolding/index.html) と併せて参照。

- `ai-scaffold/index.html` を開き、← → / Space で移動、O または T で目次、F で全画面、P で印刷/PDF
- URL のハッシュ（`#12` など）でスライド番号を直接指定可能
- 同梱物: [notes.md](ai-scaffold/notes.md)（検討メモ全文）、[plan.md](ai-scaffold/plan.md)（実施計画とタスク）、`examples/order.spec.yaml`（生成仕様の例）、`examples/spec.schema.json`（JSON Schema の叩き台）
- 詳細: [ai-scaffold/README.md](ai-scaffold/README.md)

### [自動実装と AI の組み合わせ](ai-scaffolding/index.html)

モデル情報から UI・Domain・UseCase・Repository を生成する仕組みを検討したスライド（全 28 枚）。テンプレート CLI、TypeSpec 拡張、共通生成定義の 3 案を比較し、推奨案の入力設計・部分生成・再生成・ID / VO・DI・テスト用 backend 接続・実施計画をまとめている。

- `ai-scaffolding/index.html` を開き、← → / Space で移動、O で目次、F で全画面、P で印刷/PDF
- [検討記録・詳細設計](ai-scaffolding/design.md) / [実施タスクと受け入れ条件](ai-scaffolding/tasks.md)
- 詳細: [ai-scaffolding/README.md](ai-scaffolding/README.md)

### [Playwright 活用方法 — 画面遷移図・デグレ防止・ローカライズ資料](playwright-practices/index.html)

Playwright を「テストを書く道具」ではなく「実物のブラウザから資料と安全網を作る道具」として使う手順をまとめた解説資料（全 18 枚）。React アプリの画面一覧の作り方、実キャプチャ付きの画面遷移図（メイン＝ツリー／補助線＝横断リンク）の生成、遷移パラメータの洗い出し、リファクタのデグレを止めるスポット UI テスト、ヘッドレス実行、ローカライズ時の UI 資料づくりまでを、1 本の探索コードから 4 つの成果物を作る流れとして扱っている。

- `playwright-practices/index.html` を開き、← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#9` など）でスライド番号を直接指定可能
- 詳細: [playwright-practices/README.md](playwright-practices/README.md)

### [Playwright 概要 — ライブラリ・CLI・MCP](playwright-overview/index.html)

Playwright の 3 つの利用形態（テストライブラリ/ランナー・CLI・MCP）を、利用シーン・メリット/デメリット・要素技術（Locator / auto-waiting / web-first assertion / アクセシビリティツリーなど）・確実性の高いテストコード作成の順序の観点で整理した解説スライド（全 16 枚）。

- `playwright-overview/index.html` を開き、← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#5` など）でスライド番号を直接指定可能
- 詳細: [playwright-overview/README.md](playwright-overview/README.md)

### [Oxlint で独自の Lint ルールを作る — JS プラグイン実践](oxlint-custom-rules/index.html)

Rust 製リンタ Oxlint で独自の Lint ルールを作る方法を、ESLint 互換の JS プラグイン API を軸に整理した解説スライド（全 21 枚）。最小構成・AST とセレクタ・context API・オプションと自動修正・高速版 `createOnce` API・RuleTester・設定（`jsPlugins`）・制限事項・性能を押さえたうえで、既存 ESLint 資産の再利用、ルールの設計指針と運用、参考として Rust ネイティブルールの書き方までを収録。

- `oxlint-custom-rules/index.html` を開き、← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#9` など）でスライド番号を直接指定可能
- 詳細: [oxlint-custom-rules/README.md](oxlint-custom-rules/README.md)

### [tgrep 解説 — トライグラム索引・AI エージェント連携・プラグイン化](tgrep-overview/index.html)

Microsoft の [tgrep](https://github.com/microsoft/tgrep)（トライグラム索引付き grep）の解説スライド（全 21 枚）。トライグラム転置索引の原理・3 層インデックス・常駐サーバーによる速さの仕組み、`index` / `serve` / `status` とコマンド体系、ripgrep との違いと落とし穴を押さえたうえで、AI コーディングエージェントへの組み込み方（公式 `AGENTS.md` の作法、ツール定義と安全設計、実運用ワークフロー）と、Claude Code プラグインとして配布して使わせる方法（`plugin.json`、SessionStart フックと Skill、Skill + Bash と MCP の比較、検証と配布）までをまとめている。

- `tgrep-overview/index.html` を開き、← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#12` など）でスライド番号を直接指定可能
- 詳細: [tgrep-overview/README.md](tgrep-overview/README.md)

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

### [Redmine の UI を SPA で作る（構成・導入編）](redmine-ui-spa-2/index.html)

同じ Issue #26 を構成の選択と導入手順の側から検討した技術検討資料（全 19 枚）。UI の置き換え、別 Web サーバー（リバースプロキシ / BFF）経由の配信と認証、Electron・Tauri・PWA によるデスクトップアプリ化を整理している。API の仕様と置き換え方式の整理は [redmine-ui-spa](redmine-ui-spa/index.html) にあり、本デッキはその続きにあたる。稼働バージョン・認証基盤・導入プラグインは未指定のため、推奨構成は設計案。

- `redmine-ui-spa-2/index.html` を開き、← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#9` など）でスライド番号を直接指定可能
- 同梱物: [research.md](redmine-ui-spa-2/research.md)（構成案、NGINX 設定例、認証・API の確認項目、公式出典）
- 詳細: [redmine-ui-spa-2/README.md](redmine-ui-spa-2/README.md)

### [Redmine の UI を SPA で作るための技術](redmine-ui-spa/index.html)

Rails 製の Redmine を「API サーバー」として扱い、UI を自前の SPA に置き換える方法、間に別の Web サーバー（リバースプロキシ / BFF）を挟む方法、デスクトップアプリ化する方法を整理した解説スライド（全 16 枚）。REST API の使い方とカバレッジ、UI 置き換えの 3 方式（部分注入 / プラグイン同居 SPA / 完全分離 SPA）の比較、ブラウザ直結で当たる 4 つの壁（CORS・API キーの置き場・テキスト整形・N+1 と 100 件上限）、BFF の段階と認証設計、PWA / ガワアプリ / Electron / Tauri v2 の比較、推奨構成と段階的な進め方を収録。

- `redmine-ui-spa/index.html` を開き、← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#9` など）でスライド番号を直接指定可能
- 詳細: [redmine-ui-spa/README.md](redmine-ui-spa/README.md)

### [Yocto ビルドホストの構築手順 — ディストリビューションの選択とインストール](yocto-build-host/index.html)

[Yocto 入門](yocto-intro/index.html)の付録として、ビルドホストに使う Linux ディストリビューションの選び方と、インストールから最初のビルドが通るまでの手順だけを単独で扱う解説スライド（全 18 枚）。サポート対象ディストロの選定基準とリリースとの対応、候補の比較、ベアメタル / VM / クラウド / コンテナ / WSL 2 の選択、ディスクとパーティションの設計、インストール直後の初期設定、ホスト依存パッケージ、`buildtools-tarball` による救済、`core-image-minimal` での動作確認、運用とチューニングまでを収録。

- `yocto-build-host/index.html` を開き、← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#9` など）でスライド番号を直接指定可能
- 詳細: [yocto-build-host/README.md](yocto-build-host/README.md)

### [Yocto 入門 — macOS/VM で作る Raspberry Pi・ルーター・x86_64 の Linux イメージ](yocto-intro/index.html)

Yocto Project で組み込み Linux ディストリビューションを「自分で作る」ための仕組みを整理した解説スライド（全 20 枚）。Poky / BitBake / OpenEmbedded とレイヤーの関係、macOS (Apple Silicon) + VMware Fusion でのビルド環境づくりから、GUI あり/なしのイメージ、Raspberry Pi、ルーター用 Linux、Intel NUC (x86_64) 向けイメージの作り分け、1 つの作業ツリーで 4 機種を回す方法、カスタムレイヤーと `devtool` / SDK による開発ループまでを扱う。

- `yocto-intro/index.html` を開き、← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF
- URL のハッシュ（`#9` など）でスライド番号を直接指定可能
- 詳細: [yocto-intro/README.md](yocto-intro/README.md)

### [npm ライブラリの不具合・脆弱性の時系列集計](npm-vulnerability-trends/index.html)

公式情報の収集、通常の不具合と脆弱性の区別、更新・撤回・重複排除、CWE による内容別分類、月次集計と可視化を検討した設計提案（全 14 枚）。グラフは架空データで、実データの集計結果ではありません。

- [詳細設計資料](npm-vulnerability-trends/research.md) / [README](npm-vulnerability-trends/README.md)
- ← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF。ボタン・スワイプにも対応。

## リポジトリ構成

```
slides/
├── claude-code-token-usage/       # [ai] Claude Code のトークン使用量と削減策（公式ドキュメント整理）
├── ai-usage-cache/                # [ai] AI の利用枠とキャッシュの仕組み（YouTube 動画要約）
├── orca/                          # [ai] Orca（AI エージェント IDE）解説スライド
├── claude-code-commands/          # [ai] Claude Code コマンド一覧スライド（Marp 製・全 6 デッキ）
│   ├── src/                       #   Marp ソース（*.md）
│   ├── theme/                     #   Marp テーマ（claude.css）
│   └── build.sh                   #   src/*.md → ./*.html のビルドスクリプト
├── ai-scaffold/                   # [codegen] 自動実装 × AI（DDD フロントエンドの generate 設計）
│   ├── notes.md                   #   検討メモ全文
│   ├── plan.md                    #   実施計画とタスク
│   └── examples/                  #   生成仕様の例と JSON Schema
├── ai-scaffolding/                # [codegen] AI + 決定論的コード生成の検討（Issue #16）
├── playwright-practices/          # [testing] Playwright 活用方法（画面遷移図・デグレ防止・ローカライズ資料）
├── playwright-overview/           # [testing] Playwright 概要スライド（ライブラリ・CLI・MCP）
├── oxlint-custom-rules/           # [devtools] Oxlint で独自の Lint ルールを作る（JS プラグイン実践）
├── tgrep-overview/                # [devtools] tgrep 解説（トライグラム索引・エージェント連携・プラグイン化）
├── antigravity-tsc-lsp-research/  # [devtools] tsc --lsp 徹底調査スライド
│   ├── research.md                #   詳細技術報告書
│   ├── examples/                  #   実証クライアント・Claude Code プラグイン・MCP サーバー
│   └── evidence/                  #   実機計測ログ・検証用フィクスチャ
├── tsc-lsp/                       # [devtools] tsc --lsp 調査報告（初版）
├── redmine-ui-spa-2/              # [web] Redmine の UI を SPA で作る（構成・導入編）
│   └── research.md                #   構成案・NGINX 設定例・認証と API の確認項目
├── redmine-ui-spa/                # [web] Redmine の UI を SPA で作るための技術（REST API / BFF / デスクトップ化）
├── yocto-build-host/              # [embedded] Yocto ビルドホストの構築手順（ディストロ選択とインストール）
├── yocto-intro/                   # [embedded] Yocto 入門（macOS/VM で作る Raspberry Pi・ルーター・x86_64 イメージ）
├── npm-vulnerability-trends/      # [security] npm 不具合・脆弱性の時系列集計（設計提案）
├── index.html                     # GitHub Pages のトップページ（カテゴリ + 検索つきの目次）
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
| 印刷 / PDF | `P` | `playwright-practices`、`oxlint-custom-rules`、`yocto-build-host`、`yocto-intro`、`redmine-ui-spa-2`、`tgrep-overview`、`redmine-ui-spa`、`playwright-overview`、`antigravity-tsc-lsp-research`、`orca`、`ai-scaffolding`、`npm-vulnerability-trends` |

※ Marp 製の `claude-code-commands` では `P` はプレゼンターモードです。`tsc-lsp`（初版）は `P` に未対応のため、ブラウザの印刷機能を使ってください。

## ビルド

手書き HTML のスライド（`playwright-practices` / `oxlint-custom-rules` / `yocto-build-host` / `yocto-intro` / `redmine-ui-spa-2` / `tgrep-overview` / `redmine-ui-spa` / `npm-vulnerability-trends` / `ai-scaffolding` / `orca` / `playwright-overview` / `antigravity-tsc-lsp-research` / `tsc-lsp`）はビルド不要で、HTML を直接編集します。

Marp 製の `claude-code-commands` のみ、ソース（`src/*.md`）を編集したら再生成が必要です。

```bash
cd claude-code-commands
./build.sh            # src/*.md → ./*.html
./build.sh --pdf      # PDF も併せて出力
```

## 公開サイト

<https://ysksm.github.io/slides/>

`main` への push で `.github/workflows/deploy-pages.yml` が動き、リポジトリルートがそのまま GitHub Pages に公開されます。ルートの `index.html` が全スライドの目次で、各スライドは `https://ysksm.github.io/slides/<ディレクトリ名>/` で開けます。

`.nojekyll` を置いて Jekyll による変換を無効化しているため、HTML・CSS・JS はリポジトリ内のファイルがそのまま配信されます。

新しいスライドの目次（この `README.md` とルートの `index.html`）への登録は、デッキの PR では行わず、**目次更新の Issue で単独に**行います（[CONTRIBUTING.md](CONTRIBUTING.md)）。登録時は上記のカテゴリのいずれかに必ず割り当て、`index.html` のカードには `data-cat`（カテゴリキー）と `data-keywords`（検索用の別名・英名）を付けます。
