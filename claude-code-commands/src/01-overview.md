---
marp: true
theme: claude
paginate: true
header: "Claude Code コマンド一覧 ─ 01 概要・ジャンル別一覧"
footer: "対象: Claude Code v2.1.269 / 公式ドキュメント (code.claude.com/docs) 2026-09 時点"
---

<!-- _class: title -->
<!-- _paginate: false -->

# Claude Code コマンド一覧

## 01 ─ 概要とジャンル別一覧（一行解説）

`/` で始まるスラッシュコマンド、`claude` CLI のサブコマンド・フラグ、キーボード操作をジャンル別に整理します。
各コマンドの詳細は 02〜05 の各デッキで 1 コマンド 1 スライドで解説します。

---

## このスライド群の構成

| デッキ | 内容 |
| --- | --- |
| **01 概要** (このデッキ) | コマンドの種類、ジャンル別一覧と一行解説 |
| **02 セッション・コンテキスト・モデル** | `/clear` `/resume` `/compact` `/plan` `/model` `/effort` など |
| **03 レビュー・並列・権限** | `/code-review` `/batch` `/loop` `/permissions` `/hooks` など |
| **04 拡張・連携・アカウント・診断** | `/mcp` `/plugin` `/skills` `/ide` `/usage` `/doctor` など |
| **05 CLI・ショートカット・カスタムコマンド** | `claude -p` `--resume` `--worktree` などとキー操作、SKILL.md |
| **06 ユースケースと使い分け** | 公式ベストプラクティスと類似コマンドの使い分け |

> 情報源は公式ドキュメント（Commands / CLI reference / Interactive mode / Skills）と `claude --help` の出力です。

---

## コマンドの 3 つの種類

<div class="cols">
<div>

### 1. スラッシュコマンド `/xxx`

セッションの中で入力。
モデル切替、権限、コンテキスト整理、レビュー実行など。

- **組み込み**: CLI 本体に実装
- **Skill**: 同梱スキル（Claude へのプロンプト）
- **Workflow**: 複数サブエージェントに展開

</div>
<div>

### 2. CLI コマンド・フラグ

ターミナルから `claude ...` で起動時に指定。
`-p` で非対話、`-r` で再開、`--worktree` で隔離など。

### 3. キー操作・入力プレフィックス

`Shift+Tab` 権限モード切替、`!` シェル、`@` ファイル参照、`Esc Esc` 巻き戻し。

</div>
</div>

---

## スラッシュコマンドの基本ルール

- メッセージの **先頭** にあるときだけコマンドとして認識される。後続テキストは引数。
- スキルは最大 **6 つまで連鎖** 可能: `/skill-a /skill-b やること`
- Claude が応答中に送ると **キューされ**、ターン終了後に実行される（`/status` `/tasks` `/usage` などは即時実行）。
- `/` を入力するとメニューが開き、文字を打つとフィルタされる。区切り文字 `- _ :` は無視（`/adddir` → `/add-dir`）。
- **隠しコマンド**（`/heapdump` など）はフル名を打った時だけ表示される。
- プラン・プラットフォームによって表示されないコマンドがある（`/desktop` `/upgrade` など）。

```text
/code-review high 1234        # 引数付き
/simplify /security-review    # 連鎖
```

---

## ジャンル一覧（全 11 ジャンル）

| # | ジャンル | 主なコマンド | 解説デッキ |
| --- | --- | --- | --- |
| A | セッション管理 | `/clear` `/resume` `/branch` `/fork` `/rewind` | 02 |
| B | コンテキスト・メモリ・計画 | `/compact` `/context` `/memory` `/init` `/plan` | 02 |
| C | モデル・性能 | `/model` `/effort` `/fast` `/advisor` | 02 |
| D | レビュー・検証 | `/code-review` `/security-review` `/simplify` `/verify` | 03 |
| E | 並列・自動化・ワークフロー | `/batch` `/tasks` `/loop` `/schedule` `/workflows` | 03 |
| F | 権限・設定・UI | `/permissions` `/config` `/hooks` `/theme` `/tui` | 03 |
| G | 拡張（Skill / Plugin / MCP） | `/skills` `/plugin` `/mcp` `/import` `/claude-api` | 04 |
| H | 連携・リモート | `/ide` `/chrome` `/remote-control` `/teleport` | 04 |
| I | アカウント・利用状況 | `/login` `/usage` `/status` `/insights` | 04 |
| J | 診断・ヘルプ | `/help` `/doctor` `/debug` `/bug` `/release-notes` | 04 |
| K | 廃止・その他 | `/pr-comments` `/ultraplan` `/vim` `/radio` | 04 |

---

<!-- _class: dense -->

## A. セッション管理

| コマンド | 一行解説 |
| --- | --- |
| `/clear [name]` | 会話を空のコンテキストで新規開始（別名 `/new` `/reset`） |
| `/resume [session]` | 過去の会話を ID/名前で再開、または一覧から選択（別名 `/continue`） |
| `/branch [name]` | 現在の会話をこの時点で分岐し、別方向を試す |
| `/fork [prompt]` | 会話をコピーして新しいバックグラウンドセッションとして走らせる |
| `/subtask <task>` | 会話を継承したサブエージェントに副タスクを任せ、結果を戻す |
| `/background [prompt]` | セッションをバックグラウンド化してターミナルを解放（別名 `/bg`） |
| `/stop` | アタッチ中のバックグラウンドセッションを停止 |
| `/exit` | CLI を終了（バックグラウンドではデタッチ、別名 `/quit`） |
| `/rename [name]` | セッションに名前を付ける（無引数なら自動生成） |
| `/recap` | 現在のセッションの一行要約を生成 |
| `/rewind` | 会話・コードをチェックポイントへ巻き戻す（別名 `/undo` `/checkpoint`） |
| `/export [filename]` | 会話をテキストで書き出す |
| `/copy [N]` | 直近（N 番目）の応答をクリップボードへ |
| `/cd <path>` | 会話を保ったまま作業ディレクトリを移動 |
| `/add-dir <path>` | 追加の作業ディレクトリへアクセスを許可 |

---

<!-- _class: dense -->

## B. コンテキスト・メモリ・計画

| コマンド | 一行解説 |
| --- | --- |
| `/compact [instructions]` | 会話を要約してコンテキストを空ける（要約の焦点を指示可） |
| `/autocompact [auto\|tokens]` | 自動圧縮が走るしきい値（ウィンドウ）を設定 |
| `/context [all]` | コンテキスト使用量をグリッドで可視化し、最適化の提案を表示 |
| `/btw [question]` | 会話履歴に残さずに横道の質問をする |
| `/memory` | CLAUDE.md の編集、自動メモリの有効/無効と閲覧 |
| `/init` | プロジェクトに CLAUDE.md を生成する初期化 |
| `/plan [description]` | プランモードへ入る（説明を渡すとその課題で即開始） |
| `/goal [condition\|clear]` | 条件が満たされるまで Claude がターンをまたいで働き続ける目標を設定 |

## C. モデル・性能

| コマンド | 一行解説 |
| --- | --- |
| `/model [model]` | 使用モデルを切り替え、デフォルトとして保存 |
| `/effort [level\|auto\|status]` | 推論の努力レベル（low〜max, ultracode, auto）を設定 |
| `/fast [on\|off]` | 高速モード（低レイテンシ）の切替 |
| `/advisor [model\|off]` | 要所で第 2 のモデルに助言を求めるアドバイザーの有効化 |

---

<!-- _class: dense -->

## D. レビュー・検証

| コマンド | 一行解説 |
| --- | --- |
| `/code-review [level] [--fix] [--comment] [target]` | 差分や PR を正確性バグ・整理観点でレビュー（`ultra` でクラウド深層レビュー） |
| `/review ...` | `/code-review` の別名 |
| `/ultrareview [PR\|branch]` | クラウド上の多エージェント深層レビュー（`/code-review ultra` の旧名） |
| `/security-review` | ブランチ差分の脆弱性（インジェクション、認証、情報漏洩）を分析 |
| `/simplify [target]` | 変更コードの再利用・簡素化・効率・抽象度を 4 エージェントで見直して修正適用 |
| `/diff` | 作業ツリーの変更（Claude の編集含む）を確認 |
| `/verify` | アプリを実際にビルド・起動・観察して変更を確認 |
| `/run` | アプリを起動して操作し、変更の動作を目視確認 |
| `/run-skill-generator` | `/run` `/verify` にアプリの起動方法を教えるプロジェクト用スキルを生成 |

---

<!-- _class: dense -->

## E. 並列・自動化・ワークフロー

| コマンド | 一行解説 |
| --- | --- |
| `/batch <instruction>` | 大規模変更を 5〜30 の独立単位に分解し、worktree ごとにサブエージェントで並列実行 → PR |
| `/tasks` | セッション内のバックグラウンド作業・サブエージェントを一覧管理（別名 `/bashes`） |
| `/loop [interval] [prompt]` | プロンプトを一定間隔（または自己ペース）で繰り返し実行（別名 `/proactive`） |
| `/schedule [description]` | クラウドで動く定期実行ルーチンを作成・管理（別名 `/routines`） |
| `/deep-research <question>` | Web 検索を並列展開し、出典付きレポートを合成する同梱ワークフロー |
| `/workflows` | 実行中・完了したダイナミックワークフローの進捗を表示、一時停止・再開・保存 |
| `/workflow-authoring` | ワークフロースクリプトを書くためのリファレンスを読み込む |
| `/autofix-pr [prompt]` | PR の CI 失敗やレビューコメントを監視して修正をプッシュするクラウドセッションを起動 |
| `/agents` | サブエージェント定義（`.claude/agents/`）の作成・管理を案内 |
| `/list-agents` | メッセージ送信できるサブエージェント・チームメイト・他セッションを一覧（別名 `/peers`） |

---

<!-- _class: dense -->

## F. 権限・設定・UI

| コマンド | 一行解説 |
| --- | --- |
| `/permissions` | ツール権限の allow / ask / deny ルールを管理（別名 `/allowed-tools`） |
| `/config [key=value]` | 設定画面を開く、または `key=value` で直接設定（別名 `/settings`） |
| `/fewer-permission-prompts` | 過去ログから読み取り専用コマンドを抽出し、許可リストを自動追加 |
| `/auto-mode-setup` | オートモードの環境エントリを下書きしてユーザー設定に保存 |
| `/sandbox` | サンドボックスモードの切替 |
| `/hooks` | フック設定を表示 |
| `/keybindings` | キーバインド設定ファイルを開く |
| `/statusline` | ステータスラインを設定 |
| `/theme` | カラーテーマを変更（auto / 色覚配慮 / カスタム） |
| `/color [color\|default]` | プロンプトバーの色を設定 |
| `/tui [default\|fullscreen]` | ターミナル UI レンダラーを切替 |
| `/focus` | 最後のプロンプトと最終応答のみ表示するフォーカスビュー切替 |
| `/scroll-speed` | マウスホイールのスクロール速度調整 |
| `/terminal-setup` | Shift+Enter 改行などターミナル設定を導入 |

---

<!-- _class: dense -->

## G. 拡張（Skill / Plugin / MCP）

| コマンド | 一行解説 |
| --- | --- |
| `/skills` | 利用可能なスキルを一覧・フィルタし、表示/非表示を切替 |
| `/skill-doctor` | 各スキルのコンテキストコストと使用頻度を表示 |
| `/reload-skills` | ディスク上のスキル・コマンドを再スキャン |
| `/plugin [subcommand]` | プラグインの一覧・インストール・有効/無効 |
| `/reload-plugins [--force]` | 再起動なしでプラグインを再読み込み |
| `/mcp [reconnect\|enable\|disable]` | MCP サーバー接続と OAuth 認証を管理 |
| `/import [codex\|gemini\|cursor]` | 他の AI コーディングツールの設定を取り込む |
| `/claude-api [subcommand]` | Claude API リファレンスを読み込み、移行・監査・コスト最適化などを実行 |
| `/design [brief]` | UI モックやポスターをアートボードとして下書き（Artifact 公開） |
| `/design-sync [hint]` | リポジトリの React デザインシステムを Claude Design へアップロード |
| `/design-login` | `/design-sync` 用の認可 |
| `/dataviz [request]` | チャート・ダッシュボードの設計ガイダンス |
| `/artifacts` | 自分の Artifact を一覧し、添付・ブラウザで開く・リンクコピー |

---

<!-- _class: dense -->

## H. 連携・リモート

| コマンド | 一行解説 |
| --- | --- |
| `/ide` | IDE 連携の管理と状態表示 |
| `/chrome` | Claude in Chrome の設定 |
| `/desktop` | 現在のセッションを Desktop アプリで続ける（別名 `/app`） |
| `/mobile` | モバイルアプリの QR コードを表示（別名 `/ios` `/android`） |
| `/remote-control` | このセッションを claude.ai から操作可能にする（別名 `/rc`） |
| `/remote-env` | クラウドエージェントのデフォルト環境を選択 |
| `/teleport` | Web のセッションをこのターミナルへ引き込む（別名 `/tp`） |
| `/web-setup` | ローカルの `gh` 資格情報で Claude Code on the web に GitHub を接続 |
| `/install-github-app` | Claude GitHub App をリポジトリにインストール（GitHub Actions 設定も） |
| `/install-slack-app` | Claude Slack アプリをインストール |
| `/voice [hold\|tap\|off]` | 音声入力の切替 |

---

<!-- _class: dense -->

## I. アカウント・利用状況

| コマンド | 一行解説 |
| --- | --- |
| `/login` / `/logout` | Anthropic アカウントにサインイン / サインアウト |
| `/usage` | セッションコスト、プラン上限、活動統計（別名 `/cost` `/stats`） |
| `/usage-credits` | 利用上限に達した時に使用クレジットを設定・申請（旧 `/extra-usage`） |
| `/rate-limit-options` | 利用上限でブロックされた時の選択肢（待機・クレジット・アップグレード） |
| `/upgrade` | 上位プランへのアップグレードページを開く |
| `/privacy-settings` | プライバシー設定の表示・変更（Pro / Max） |
| `/passes` | 友人に Claude Code を 1 週間無料で共有（対象アカウントのみ） |
| `/status` | バージョン・モデル・アカウント・接続状態を表示 |
| `/insights` | 最近のセッションを分析した HTML レポートを生成 |
| `/team-onboarding` | 30 日の利用履歴からチーム向けオンボーディングガイドを生成 |

---

<!-- _class: dense -->

## J. 診断・ヘルプ　／　K. 廃止・その他

| コマンド | 一行解説 |
| --- | --- |
| `/help` | ヘルプと利用可能コマンドを表示 |
| `/doctor` | インストール・設定・スキル/MCP のコストなどを診断し修正提案（別名 `/checkup`） |
| `/debug [description]` | デバッグログを有効化し、ログを読んでトラブルシュート |
| `/bug [report]` | バグ報告 / 会話の共有（別名 `/share`） |
| `/feedback [report]` | 製品フィードバック送信、Claude が下書きした報告の確認 |
| `/heapdump` | メモリ診断用のヒープスナップショット出力（隠しコマンド） |
| `/release-notes` | 変更履歴をバージョン選択で表示 |
| `/powerup` | アニメーション付きの機能レッスン |
| `/setup-bedrock` / `/setup-vertex` | Amazon Bedrock / Google Cloud 向け設定ウィザード（環境変数で表示） |
| `/pr-comments` | **廃止**（v2.1.91）。PR コメントは Claude に直接依頼 |
| `/ultraplan` | **廃止**。プランモードを使う |
| `/vim` | **廃止**（v2.1.92）。`/config` → Editor mode で切替 |
| `/radio` / `/stickers` | Claude FM ラジオ / ステッカー注文 |

---

<!-- _class: dense -->

## CLI コマンド（`claude ...`）一覧

| コマンド | 一行解説 |
| --- | --- |
| `claude` / `claude "query"` | 対話セッション開始（初期プロンプト付きも可） |
| `claude -p "query"` | 非対話で応答を出力して終了（パイプ・CI 向け） |
| `claude -c` / `claude -r <session>` | 直近の会話を継続 / ID・名前で再開 |
| `claude update` / `claude install [ver]` | 更新 / ネイティブバイナリの再インストール |
| `claude doctor` | セッションを開始せずに読み取り専用診断 |
| `claude auth login/logout/status` | 認証の管理 |
| `claude setup-token` | CI 用の長期 OAuth トークン生成 |
| `claude mcp ...` | MCP サーバーの追加・一覧・削除・OAuth |
| `claude plugin ...` | プラグイン管理（別名 `plugins`） |
| `claude agents` / `attach` / `logs` / `stop` / `respawn` / `rm` | バックグラウンドセッションの管理 |
| `claude daemon status` / `daemon stop --any` | バックグラウンド用スーパーバイザーの管理 |
| `claude project purge [path]` | プロジェクトのローカル状態を全削除 |
| `claude import [source]` | 他ツールの設定を取り込み |
| `claude remote-control` | Remote Control サーバーとして起動 |
| `claude ultrareview [target]` | ultrareview を非対話で実行 |
| `claude gateway` / `self-hosted-runner` | エンタープライズ向けゲートウェイ / セルフホストランナー |

---

<!-- _class: dense -->

## 主要 CLI フラグ一覧

| フラグ | 一行解説 |
| --- | --- |
| `-p, --print` | 非対話モード（`--output-format json/stream-json`, `--json-schema`, `--max-turns`, `--max-budget-usd` と併用） |
| `-c, --continue` / `-r, --resume` / `--fork-session` | 会話の継続・再開・再開時に新 ID |
| `-n, --name` / `--session-id` | セッション名 / UUID 指定 |
| `--model` / `--effort` / `--fallback-model` / `--advisor` | モデル・努力レベル・フォールバック・アドバイザー |
| `--permission-mode` / `--dangerously-skip-permissions` / `--allowedTools` / `--disallowedTools` / `--tools` | 権限とツールの制御 |
| `--add-dir` / `-w, --worktree` / `--tmux` | 追加ディレクトリ / git worktree 隔離 / tmux |
| `--bg` / `--exec` / `--cloud` / `--environment` / `--teleport` | バックグラウンド・クラウド実行 |
| `--system-prompt[-file]` / `--append-system-prompt[-file]` | システムプロンプトの置換・追記 |
| `--mcp-config` / `--strict-mcp-config` / `--plugin-dir` / `--plugin-url` / `--agents` | MCP・プラグイン・サブエージェントの動的読み込み |
| `--settings` / `--setting-sources` | 設定の上書き・読み込み元の限定 |
| `--bare` / `--safe-mode` / `--restricted` | 最小起動 / カスタマイズ無効 / 制限モード |
| `--chrome` / `--no-chrome` / `--ide` / `--remote-control` | ブラウザ・IDE・リモート連携 |
| `--debug[=filter]` / `--debug-file` / `--verbose` | デバッグ・詳細ログ |
| `--autocompact` / `--from-pr` / `--init-only` | 自動圧縮しきい値 / PR に紐づくセッション / フックのみ実行 |

---

<!-- _class: dense -->

## キー操作・入力プレフィックス一覧

<div class="cols">
<div>

| キー | 動作 |
| --- | --- |
| `Ctrl+C` / `Esc` | 応答の中断 |
| `Esc Esc` | 入力とアクション両方を取消 / rewind メニュー |
| `Ctrl+D` ×2 | 終了 |
| `Ctrl+L` | 画面クリア |
| `Shift+Tab` | 権限モードの巡回（Auto → Manual → Accept edits → Plan） |
| `Tab` | コマンド・ファイル名補完 |
| `Ctrl+R` | 履歴検索 |
| `Shift+Enter` / `Ctrl+J` / `\`+`Enter` | 改行（送信しない） |

</div>
<div>

| プレフィックス | 意味 |
| --- | --- |
| `/` | スラッシュコマンド |
| `!cmd` | シェルコマンドを直接実行 |
| `@path` | ファイル・ディレクトリを参照（`@file#5-10` 行範囲） |
| `Ctrl+G` | プロンプトを外部エディタで編集 |

Emacs 風編集: `Ctrl+A/E` 行頭末、`Ctrl+U/K` 行削除、`Ctrl+W` 単語削除、`Alt+B/F` 単語移動。
Vim モード: `/config` → Editor mode。

</div>
</div>

---

## 次のデッキへ

- **02** セッション・コンテキスト・モデル ─ 日々の対話で最もよく使う 27 コマンド
- **03** レビュー・並列・権限 ─ 品質担保と自動化、権限設計
- **04** 拡張・連携・アカウント・診断 ─ 環境構築と運用
- **05** CLI・ショートカット・カスタムコマンド ─ 起動オプションと自作スキル
- **06** ユースケースと使い分け ─ 「どれを使うべきか」の指針

> まず覚えるなら: `/clear` `/compact` `/plan` `/model` `/code-review` `/permissions` と `claude -p` `claude -r`、そして `Shift+Tab`。
