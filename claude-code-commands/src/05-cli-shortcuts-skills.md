---
marp: true
theme: claude
paginate: true
header: "Claude Code コマンド一覧 ─ 05 CLI・ショートカット・カスタムコマンド"
footer: "対象: Claude Code v2.1.269 / claude --help と公式 CLI reference / Interactive mode / Skills 2026-09 時点"
---

<!-- _class: title -->
<!-- _paginate: false -->

# 05 ─ CLI・ショートカット・カスタムコマンド

## ターミナルから起動するときの選択肢

- **L. CLI コマンド**（`claude <subcommand>`）─ 16 スライド
- **M. CLI フラグ**（`claude --flag`）─ 用途別 11 スライド
- **N. キー操作・入力プレフィックス** ─ 5 スライド
- **O. 自作コマンド（Skill）** ─ 6 スライド

> `claude --help` は全フラグを列挙しない。ヘルプに無いフラグも公式 CLI reference には載っている。

---

<!-- _class: divider -->

# L. CLI コマンド

`claude` に続けて打つサブコマンド

---

<!-- _class: cmd -->

# claude ／ claude "query"
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">対話セッションを開始する。引数に文字列を渡すとそれを最初のプロンプトとして開始。</p>

- 既定では現在ディレクトリの CLAUDE.md、`.claude/` 設定、フック、スキル、MCP を自動検出。
- 起動時のカスタマイズはフラグで: `--model` `--effort` `--permission-mode` `--worktree` など。

```bash
claude
claude "explain this project"
claude --model sonnet --permission-mode plan "audit the auth flow"
```

<p class="rel">関連: claude -p claude -c / -r claude --worktree</p>

---

<!-- _class: cmd -->

# claude -p "query"（--print）
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">非対話モード。応答を出力して終了する。パイプ・CI・スクリプト向け。</p>

- `--output-format text|json|stream-json`、`--json-schema` で構造化出力、`--max-turns` `--max-budget-usd` で上限。
- 信頼ダイアログが **スキップされる** ので信頼できるディレクトリでのみ。未知のリポジトリは `--bare` を付ける。
- 標準入力を渡せる: `cat app.log | claude -p "find errors"`。
- `--permission-prompts none` で確認が要る操作を自動拒否（無人実行）。

```bash
claude -p "summarize the failing tests" --output-format json
git diff main | claude -p --bare "review this diff for typos"
```

<p class="rel">関連: --bare --output-format --max-turns --max-budget-usd --permission-prompts</p>

---

<!-- _class: cmd -->

# claude -c ／ claude -r &lt;session&gt;
<span class="genre">L. CLI コマンド</span>

<p class="oneliner"><code>-c</code>（--continue）は現在ディレクトリの直近の会話を再開。<code>-r</code>（--resume）は ID・名前・トランスクリプトのパスで指定、または対話ピッカー。</p>

- `-c` は `-p` / SDK / `/loop` 起点のセッションを飛ばす（`-p -c` なら含む）。
- `-r <id>` は現在プロジェクトと worktree → 他プロジェクトの順に検索（v2.1.223+）。
- `--fork-session` を付けると再開時に新しいセッション ID を作る。
- `--from-pr 123` で PR に紐づいたセッションを絞り込み。

```bash
claude -c
claude -r "auth-refactor" "finish the PR"
claude -r abc123 --fork-session
```

<p class="rel">関連: /resume /rename claude --name --from-pr</p>

---

<!-- _class: cmd -->

# claude update ／ claude install [version]
<span class="genre">L. CLI コマンド</span>

<p class="oneliner"><code>update</code>（別名 <code>upgrade</code>）は更新を確認して適用。<code>install</code> はネイティブバイナリを <code>stable</code> / <code>latest</code> / 特定バージョンで再インストール。</p>

```bash
claude update
claude install stable
claude install 2.1.118
```

<p class="rel">関連: /release-notes claude doctor</p>

---

<!-- _class: cmd -->

# claude doctor
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">セッションを開始せずに、インストール状態と設定ファイルの検証結果を読み取り専用で出力する。</p>

- 信頼プロンプトなしで現在ディレクトリの設定を読む。
- 修正まで行うフル診断はセッション内の `/doctor`。

```bash
claude doctor
```

<p class="rel">関連: /doctor --safe-mode --debug</p>

---

<!-- _class: cmd -->

# claude auth login ／ logout ／ status
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">認証を管理する。<code>login</code> は <code>--email</code> <code>--sso</code> <code>--console</code> を取り、<code>status</code> は JSON（<code>--text</code> で可読）を出力し、ログイン済みなら終了コード 0。</p>

- CI 用の長期 OAuth トークンは `claude setup-token`（保存せず端末に表示、サブスクリプション必須）。

```bash
claude auth login --console
claude auth status --text
claude setup-token
```

<p class="rel">関連: /login /logout claude setup-token</p>

---

<!-- _class: cmd dense -->

# claude mcp &lt;subcommand&gt;
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">MCP サーバーの設定を管理する。<code>add</code> / <code>add-json</code> / <code>list</code> / <code>get</code> / <code>remove</code> / <code>login</code> / <code>logout</code> / <code>serve</code> / <code>add-from-claude-desktop</code> / <code>reset-project-choices</code>。</p>

- スコープ: `local`（既定）/ `project`（`.mcp.json` を VCS 共有）/ `user`。
- 接続状態の確認や一時無効化はセッション内の `/mcp`。

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
claude mcp add my-server -e API_KEY=xxx -- npx my-mcp-server
claude mcp add --scope project github ...      # チーム共有
claude mcp login sentry                        # OAuth のみ
claude mcp list
```

<p class="rel">関連: /mcp --mcp-config --strict-mcp-config</p>

---

<!-- _class: cmd dense -->

# claude plugin &lt;subcommand&gt;
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">プラグインを管理する（別名 <code>plugins</code>）。<code>install</code> / <code>uninstall</code> / <code>enable</code> / <code>disable</code> / <code>list</code> / <code>update</code> / <code>details</code> / <code>marketplace</code> / <code>init</code> / <code>validate</code> / <code>eval</code> / <code>tag</code> / <code>prune</code>。</p>

- `details <name>` でコンポーネント一覧と **推定トークンコスト** を表示。
- `init <name>` で `~/.claude/skills/<name>/` に雛形を作成。`validate` でマニフェストとスキルを検証。
- `eval` はプラグインの評価スイートをローカル実行（信頼できるプラグインのみ）。

```bash
claude plugin install code-review@marketplace
claude plugin marketplace add <owner/repo>
claude plugin details code-review
```

<p class="rel">関連: /plugin /reload-plugins --plugin-dir --plugin-url</p>

---

<!-- _class: cmd dense -->

# claude agents ／ attach ／ logs ／ stop ／ respawn ／ rm
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">バックグラウンドセッションを管理する。<code>agents</code> は監視・ディスパッチ用の agent view（<code>--json</code> で機械出力、<code>--cwd</code> で絞り込み）。</p>

| コマンド | 動作 |
| --- | --- |
| `claude attach <id>` | このターミナルにアタッチ（`/exit` か `←` でデタッチ） |
| `claude logs <id>` | 直近の出力を表示 |
| `claude stop <id>`（`kill`） | 停止。会話は保持され `claude --resume` 可 |
| `claude respawn <id>`（`--all`） | 会話を保ったまま現在のバージョンで再起動 |
| `claude rm <id>` | 一覧から削除（安全なら worktree も） |

```bash
claude --bg "investigate the flaky test"   # 起動して ID を表示
claude agents
```

<p class="rel">関連: /background /fork /stop claude --bg</p>

---

<!-- _class: cmd -->

# claude daemon status ／ daemon stop --any
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">バックグラウンドセッションを束ねるスーパーバイザープロセスの状態確認と停止。</p>

- `status` は状態・バージョン・ソケットディレクトリ・ワーカー数を表示（診断用）。
- `stop --any` はスーパーバイザーとホストするセッションを停止。`--keep-workers` でセッションは残す。

```bash
claude daemon status
claude daemon stop --any --keep-workers
```

<p class="rel">関連: claude agents claude respawn</p>

---

<!-- _class: cmd -->

# claude project purge [path]
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">プロジェクトのローカル状態（トランスクリプト、タスク一覧、デバッグログ、編集履歴、プロンプト履歴、<code>~/.claude.json</code> のエントリ）をすべて削除する。</p>

- **取り消せない**。まず `--dry-run` で対象を確認。

```bash
claude project purge ~/work/repo --dry-run
claude project purge ~/work/repo
```

<p class="rel">関連: /resume claude -c</p>

---

<!-- _class: cmd -->

# claude import [source]
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">対話セッションを開いて <code>/import</code> を実行し、Codex / Gemini CLI / Cursor の設定を取り込む。</p>

```bash
claude import codex --dry-run
claude import cursor --yes
```

<p class="rel">関連: /import /init</p>

---

<!-- _class: cmd -->

# claude remote-control
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">ローカルの対話セッションを持たない **サーバーモード** で起動し、claude.ai / Claude アプリから操作できるようにする。</p>

- 自分もローカルで対話しつつリモートからも触るなら `claude --remote-control [name]`（`--rc`）。
- 自動生成名の接頭辞は `--remote-control-session-name-prefix` か環境変数 `CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX`。

```bash
claude remote-control --name "My Project"
claude --rc "My Project"
```

<p class="rel">関連: /remote-control /teleport --cloud</p>

---

<!-- _class: cmd -->

# claude ultrareview [target]
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">ultrareview（クラウド多エージェントレビュー）を非対話で実行し、結果を標準出力へ。成功 0 / 失敗 1 で終了。</p>

- `--json` で機械可読、`--timeout` で上限、`--post` で PR にコメント投稿（v2.1.227+）。
- CI のマージ前ゲートに組み込める。

```bash
claude ultrareview 1234 --json
claude ultrareview --post
```

<p class="rel">関連: /code-review ultra /ultrareview</p>

---

<!-- _class: cmd dense -->

# claude auto-mode ／ gateway ／ self-hosted-runner
<span class="genre">L. CLI コマンド</span>

<p class="oneliner">運用・管理向けのサブコマンド。</p>

| コマンド | 内容 |
| --- | --- |
| `claude auto-mode defaults` | Auto mode の組み込みクラシファイア規則を JSON で表示（`config` で実効値） |
| `claude auto-mode reset` | ユーザー設定の `autoMode` セクションを削除して既定に戻す |
| `claude gateway` | SSO・ポリシーを前段に置く自己ホスト型 Claude apps gateway を起動（管理者向け） |
| `claude self-hosted-runner` | このマシン / コンテナをセルフホスト環境に登録し、クラウドセッションをホスト |

<p class="rel">関連: /auto-mode-setup /permissions --environment</p>

---

<!-- _class: divider -->

# M. CLI フラグ

用途別にまとめて解説

---

<!-- _class: cmd dense -->

# 非対話モード用フラグ（`-p` と併用）
<span class="genre">M. CLI フラグ</span>

| フラグ | 内容 |
| --- | --- |
| `--output-format text\|json\|stream-json` | 出力形式。`stream-json` はリアルタイム |
| `--input-format text\|stream-json` | 入力形式（ストリーミング入力） |
| `--json-schema '<schema>'` | 完了後に JSON Schema で検証した構造化出力 |
| `--max-turns N` | エージェントターン数の上限（超過でエラー終了） |
| `--max-budget-usd 5.00` | API 支出の上限。サブエージェント分も含む |
| `--permission-prompts host\|none` | 誰が権限確認に答えるか。`none` は自動拒否 |
| `--permission-prompt-tool <mcp tool>` | 権限確認を MCP ツールに委ねる |
| `--no-session-persistence` | セッションをディスクに保存しない |
| `--include-partial-messages` / `--include-hook-events` / `--forward-subagent-text` / `--replay-user-messages` | stream-json に含める情報を増やす |
| `--prompt-suggestions` | 各ターン後に次のプロンプト予測を出力 |
| `--init` / `--maintenance` / `--init-only` | Setup フックの実行（`init-only` は会話を始めず終了） |

---

<!-- _class: cmd dense -->

# セッション制御フラグ
<span class="genre">M. CLI フラグ</span>

| フラグ | 内容 |
| --- | --- |
| `-c, --continue` | 現在ディレクトリの直近の会話を再開 |
| `-r, --resume [id\|name\|path]` | 指定セッションを再開、または対話ピッカー |
| `--fork-session` | 再開時に新しいセッション ID を作る |
| `-n, --name <name>` | 表示名を設定（`/resume` と `-r <name>` で使える） |
| `--session-id <uuid>` | セッション ID を固定 |
| `--from-pr [番号\|URL]` | PR に紐づくセッションを絞り込んでピッカーを開く |
| `--autocompact auto\|<tokens>` | 自動圧縮ウィンドウをこのセッションだけ変更 |
| `--teleport [session]` | Web セッションをローカルで再開 |
| `--system-prompt-snapshot on\|off` | システムプロンプトを初回に記録して使い回すか（`off` で毎回再構築） |

```bash
claude -n "payment-webhook" --autocompact 500k
```

---

<!-- _class: cmd dense -->

# モデル・性能フラグ
<span class="genre">M. CLI フラグ</span>

| フラグ | 内容 |
| --- | --- |
| `--model <alias\|id>` | `fable` `opus` `sonnet` `haiku` またはフル ID。設定と `ANTHROPIC_MODEL` を上書き |
| `--effort low\|medium\|high\|xhigh\|max\|ultracode` | 努力レベル。`ultracode` は xhigh + ダイナミックワークフロー |
| `--fallback-model a,b` | 主モデルが過負荷・停止時に順に試す（設定 `fallbackModel` を上書き） |
| `--advisor <model>` | アドバイザーツールを有効化（設定 `advisorModel` を上書き） |
| `--betas <headers>` | API のベータヘッダー（API キー利用者のみ） |
| `--exclude-dynamic-system-prompt-sections` | マシン固有情報を最初のユーザーメッセージへ移し、複数ユーザー間のプロンプトキャッシュ共有率を上げる |

```bash
claude --model sonnet --advisor opus --fallback-model sonnet,haiku
```

---

<!-- _class: cmd dense -->

# 権限・ツール制御フラグ
<span class="genre">M. CLI フラグ</span>

| フラグ | 内容 |
| --- | --- |
| `--permission-mode default\|acceptEdits\|plan\|auto\|dontAsk\|bypassPermissions` | 開始時の権限モード（`manual` は `default` の別名） |
| `--allowedTools "<rules>"` | 確認なしで実行できるツール。例 `"Bash(git log *)" "Edit"` |
| `--disallowedTools "<rules>"` | 拒否ルール。裸のツール名はコンテキストから除去、`Bash(rm *)` は該当呼び出しだけ拒否 |
| `--tools "Bash,Edit,Read"` | 使える組み込みツール自体を制限（`""` で全無効、`default` で既定） |
| `--dangerously-skip-permissions` | 全確認をスキップ（= bypassPermissions）。**隔離コンテナ / VM のみ** |
| `--allow-dangerously-skip-permissions` | bypass を `Shift+Tab` の巡回に加えるだけで、開始はしない |
| `--restricted` | コマンド実行ツールと WebFetch を除去し、ファイルツールを作業ディレクトリに限定、設定は managed のみ |

```bash
claude --permission-mode plan --allow-dangerously-skip-permissions
claude -p --allowedTools "Read" "Bash(git diff *)" "summarize the diff"
```

---

<!-- _class: cmd -->

# ディレクトリ・worktree フラグ
<span class="genre">M. CLI フラグ</span>

| フラグ | 内容 |
| --- | --- |
| `--add-dir <dirs...>` | 追加の作業ディレクトリ（存在チェックあり、ネットワークパス不可）。永続化は設定 `permissions.additionalDirectories` |
| `-w, --worktree [name]` | `<repo>/.claude/worktrees/<name>` に隔離 worktree を作って開始。`#123` や PR URL でその PR から分岐 |
| `--tmux[=classic]` | `--worktree` と併用し tmux（iTerm2 ならネイティブペイン）で開く |

```bash
claude --add-dir ../apps ../lib
claude -w feature-auth --tmux
claude -w '#123'
```

<p class="rel">関連: /add-dir /cd /batch（worktree を自動利用）</p>

---

<!-- _class: cmd dense -->

# バックグラウンド・クラウド実行フラグ
<span class="genre">M. CLI フラグ</span>

| フラグ | 内容 |
| --- | --- |
| `--bg, --background` | バックグラウンドエージェントとして起動し ID を表示。`-p` とは併用不可 |
| `--exec '<cmd>'` | `--bg` と併用し、Claude ではなくシェルコマンドを PTY 付きバックグラウンドジョブとして実行 |
| `--agent <name>` / `--agents '<json>'` | セッションのエージェント指定 / サブエージェントを JSON で動的定義 |
| `--cloud [description\|session\|url]` | claude.ai に Web セッションを作成、または既存セッションへメッセージ投入（`-p` と併用） |
| `--environment ccpool_...` / `--ref <branch>` | セルフホスト環境でクラウドセッションを作成 / チェックアウト元の ref |
| `--remote-control [name]`（`--rc`） | Remote Control を有効にして対話開始 |
| `--teammate-mode in-process\|auto\|tmux\|iterm2` | エージェントチームのメンバー表示方法 |

```bash
claude --bg --exec 'pytest -x'
claude --cloud "Fix the login bug"
```

---

<!-- _class: cmd dense -->

# システムプロンプト系フラグ
<span class="genre">M. CLI フラグ</span>

| フラグ | 動作 |
| --- | --- |
| `--system-prompt "<text>"` / `--system-prompt-file <path>` | 既定のシステムプロンプトを **置換**（互いに排他） |
| `--append-system-prompt "<text>"` / `--append-system-prompt-file <path>` | 既定に **追記**（置換系と併用可） |
| `--append-subagent-system-prompt[-file]` | 全サブエージェントの system prompt に追記（`-p` のみ） |
| `--system-prompt-snapshot on\|off` | 初回に記録して使い回す（既定 on）か毎回再構築か |

- **追記** = Claude Code のコーディングアシスタントとしての性格を保ちつつルールを足す（通常はこちら）。
- **置換** = 別の用途・別の権限モデルにする時。永続的なペルソナは output style、プロジェクト規約は CLAUDE.md。

```bash
claude --append-system-prompt "Always use TypeScript"
```

---

<!-- _class: cmd dense -->

# MCP・プラグイン・設定読み込みフラグ
<span class="genre">M. CLI フラグ</span>

| フラグ | 内容 |
| --- | --- |
| `--mcp-config <files\|json...>` | MCP サーバーを JSON から読み込む（`-p` では接続完了を待つ） |
| `--strict-mcp-config` | `--mcp-config` 以外の MCP 設定を無視 |
| `--plugin-dir <path>` / `--plugin-url <url>` | このセッション限定でプラグインを読み込む（繰り返し可） |
| `--settings <file\|json>` | 設定を上書き（省略キーはファイル値を維持、2 MiB 以下） |
| `--setting-sources user,project,local` | 読み込む設定ソースを限定 |
| `--channels plugin:<name>@<marketplace>` | （研究プレビュー）チャネル通知を購読 |
| `--disable-slash-commands` | すべてのスキル・コマンドを無効化 |

```bash
claude --strict-mcp-config --mcp-config ./mcp.json
claude --plugin-dir ./my-plugin --setting-sources user
```

---

<!-- _class: cmd dense -->

# 起動モードフラグ: --bare / --safe-mode / --restricted
<span class="genre">M. CLI フラグ</span>

| フラグ | 読み込まないもの | 用途 |
| --- | --- | --- |
| `--bare` | hooks, LSP, plugins, 自動メモリ, キーチェーン, CLAUDE.md 自動検出（`--add-dir` のスキルは可）。認証は `ANTHROPIC_API_KEY` のみ | **スクリプト・CI の高速再現実行**（将来 `-p` の既定） |
| `--safe-mode` | CLAUDE.md, skills, plugins, hooks, MCP, カスタムコマンド/エージェント, テーマ, キーバインド, ステータスライン, LSP, 自動メモリ。認証・モデル・組み込みツール・権限は通常 | **壊れた設定の切り分け** |
| `--restricted` | ユーザー/プロジェクト/ローカル設定、コマンド実行系ツール、WebFetch。bypass を拒否 | **共有マシンで評価ハーネスが動かす** |

```bash
claude --bare -p "query"
claude --safe-mode
```

---

<!-- _class: cmd dense -->

# デバッグ・表示・連携フラグ
<span class="genre">M. CLI フラグ</span>

| フラグ | 内容 |
| --- | --- |
| `-d, --debug[=filter]` | デバッグモード。`--debug='mcp,startup'` や `--debug='!1p'` でカテゴリ絞り込み（`=` 形式のみ） |
| `--debug-file <path>` | デバッグログの出力先（暗黙にデバッグ有効） |
| `--verbose` | ターンごとの詳細出力（設定 `viewMode` を上書き） |
| `--ax-screen-reader` | スクリーンリーダー向けの平文描画 |
| `--chrome` / `--no-chrome` | Claude in Chrome の有効 / 無効 |
| `--ide` | 有効な IDE がちょうど 1 つなら自動接続 |
| `--brief` | エージェントからユーザーへの短信ツールを有効化 |
| `--file file_id:path` | 起動時にファイルリソースをダウンロード |
| `-v, --version` / `-h, --help` | バージョン / ヘルプ |

```bash
claude --debug='mcp,hooks' --debug-file /tmp/claude-debug.log
```

---

<!-- _class: divider -->

# N. キー操作・入力プレフィックス

対話モードで速く動くために

---

<!-- _class: dense -->

## 基本操作

| キー | 動作 |
| --- | --- |
| `Ctrl+C` | 実行中の操作を中断。何もなければ入力クリア、もう一度で終了 |
| `Ctrl+D` | 終了（800ms 以内に 2 回）。入力があればカーソル後ろの 1 文字削除 |
| `Esc` | 応答・ツール呼び出しを中断（それまでの作業は保持）、ダイアログを閉じる、権限確認は No |
| `Esc` `Esc` | 入力があれば下書きをクリア（履歴に保存）。空なら **rewind メニュー** |
| `Shift+Tab`（Windows で効かなければ `Alt+M`） | 権限モードを巡回: default(Manual) → acceptEdits → plan →（bypass）→ auto |
| `Ctrl+G` / `Ctrl+X Ctrl+E` | プロンプトを既定のテキストエディタで編集 |
| `Ctrl+L` | 画面を再描画 / クリア（表示が崩れた時） |
| `Ctrl+O` | トランスクリプトビューア（ツール詳細・タイムスタンプ・モデル名）切替 |
| `Ctrl+R` | コマンド履歴の逆検索 |
| `Ctrl+V`（iTerm2 は `Cmd+V`、Windows/WSL は `Alt+V`） | クリップボードの画像を貼り付け（`[Image #N]`） |
| `Ctrl+B` | 実行中の Bash / エージェントをバックグラウンド化（tmux は 2 回） |
| `Ctrl+T` | Claude の TODO チェックリスト表示切替 |
| `Ctrl+S` | 入力を退避 / 復元 |
| `Ctrl+X Ctrl+K` | 実行中のバックグラウンドサブエージェントを全停止（3 秒以内に 2 回） |
| `Option/Alt+P` / `+T` / `+O` | モデル切替 / 拡張思考の切替 / fast mode 切替 |
| `Ctrl+Z` | プロセスを一時停止（`fg` で復帰、Unix） |

---

<!-- _class: dense -->

## テキスト編集（Emacs 風）と改行

<div class="cols">
<div>

| キー | 動作 |
| --- | --- |
| `Ctrl+A` / `Ctrl+E` | 行頭 / 行末へ |
| `Ctrl+K` | カーソルから行末まで削除 |
| `Ctrl+U` | カーソルから行頭まで削除（macOS は `Cmd+Backspace` も） |
| `Ctrl+W` | 直前の空白まで削除（パスや `--flag=value` を丸ごと） |
| `Ctrl+Y` / `Alt+Y` | 削除したテキストを貼り付け / 貼り付け履歴を巡回 |
| `Alt+B` / `Alt+F` | 単語単位で移動（macOS は Option を Meta に設定） |
| `Alt+D` | 単語末まで削除 |
| `Ctrl+_` | 入力編集の取り消し |
| `↑` `↓` / `Ctrl+P` `Ctrl+N` | カーソル移動、端に達したら履歴 |

</div>
<div>

### 改行（送信しない）

| キー | 対応 |
| --- | --- |
| `Shift+Enter` | Ghostty / Kitty / iTerm2 / WezTerm / Warp / Apple Terminal / Windows Terminal は標準対応。VS Code / Cursor / Zed / Alacritty は `/terminal-setup` |
| `Ctrl+J` | どこでも使える |
| `\` + `Enter` | どこでも使える |

### macOS で Option を Meta に

- Apple Terminal: Profiles → Keyboard → Use Option as Meta Key
- iTerm2: Profiles → Keys → Option key: Esc+
- VS Code: `terminal.integrated.macOptionIsMeta: true`

</div>
</div>

---

<!-- _class: dense -->

## 入力プレフィックス（クイックコマンド）

| 入力 | 意味 | 例 |
| --- | --- | --- |
| `/` を先頭に | スラッシュコマンド / スキル | `/model opus` |
| `!` を先頭に | **シェルモード**。コマンドを直接実行し、出力をセッションに追加して Claude に応答させる | `!git status` `!npm test` |
| `@` | ファイルパス補完・参照。行範囲は `@file#5-10`。他の稼働セッション名も候補に出る | `Explain @src/auth.ts` |
| `:name:` | 絵文字ショートコード（v2.1.217+） | `:rocket:` |
| `?`（空の入力で） | ショートカットヘルプパネルの切替 | |

- ファイルは `@` で渡す方が、Claude に検索させるよりコンテキストを節約できる。
- `!` で実行した出力は会話に入る。長い出力は `| tail` などで絞る。

---

## Vim モード

- 有効化: `/config` → Editor mode → `vim`、または設定 `"editorMode": "vim"`。旧 `/vim` は廃止。

| モード | 主な操作 |
| --- | --- |
| NORMAL | `h j k l` 移動、`w b e` 単語、`0 $` 行頭末、`gg G` 先頭末、`dd dw cw yy` 編集、`x` 削除、`.` 繰り返し |
| INSERT | `i I a A o O` で入る。Emacs 系キーも併用可。`vimInsertModeRemaps` でリマップ |
| VISUAL | `v` / `V` で選択し `d c y` |
| COMMAND | `:q` `:w`（既定では未マップ） |

---

<!-- _class: dense -->

## IDE・Desktop のショートカット

<div class="cols">
<div>

### VS Code 拡張

| キー | 動作 |
| --- | --- |
| `Option+K` / `Alt+K` | `@file#5-10` の参照を挿入 |
| `Ctrl+Option+F` / `Ctrl+Alt+F` | Focus view 切替 |
| `Shift+Enter` | 改行（`/terminal-setup` 後） |

### JetBrains

| キー | 動作 |
| --- | --- |
| `Cmd+Esc` / `Ctrl+Esc` | エディタから Claude Code を開く |
| `Cmd+Option+K` / `Alt+Ctrl+K` | ファイル参照を挿入 |

</div>
<div>

### Desktop アプリ（Cmd = macOS / Ctrl = Windows）

| キー | 動作 |
| --- | --- |
| `Cmd+/` | ショートカット一覧 |
| `Cmd+N` / `Cmd+W` | セッション作成 / 閉じる |
| `Ctrl+Tab` | セッション切替 |
| `Cmd+Shift+D` / `B` | diff ペイン / ブラウザペイン |
| `Cmd+Shift+M` / `I` / `E` | 権限モード / モデル / effort メニュー |
| `Ctrl+バッククォート` | ターミナルペイン |
| `Cmd+;` | サイドチャット |

</div>
</div>

---

<!-- _class: divider -->

# O. 自作コマンド（Skill）

自分のワークフローを `/名前` にする

---

## Skill の置き場所と構造

| スコープ | パス | 共有範囲 |
| --- | --- | --- |
| 個人 | `~/.claude/skills/<name>/SKILL.md` | 自分の全プロジェクト |
| プロジェクト | `.claude/skills/<name>/SKILL.md` | git 経由でチーム |
| プラグイン | `<plugin>/skills/<name>/SKILL.md` | `/plugin:skill` の名前空間 |
| 組織 | managed settings / `/etc/claude-code/` | 組織全員 |

```text
my-skill/
├── SKILL.md          # 本体（必須）。frontmatter + 指示
├── reference.md      # 補助資料（必要時に読まれる）
└── scripts/helper.sh # スクリプト（コンテキストには乗らない）
```

- 旧 `.claude/commands/<name>.md` と **同じ `/name` を作り同じように動く（統合済み）**。新規はスキル推奨。
- 追加・変更後は `/reload-skills`。一覧と可視性は `/skills`、コストは `/skill-doctor`。

---

<!-- _class: dense -->

## SKILL.md の frontmatter

```yaml
---
name: fix-issue                       # /fix-issue で呼ぶ
description: GitHub issue を調査して修正する   # Claude が使うか判断する説明（≤1536 文字）
arguments: [issue-number]             # 名前付き引数 → $issue-number
disable-model-invocation: true        # true: 手動でのみ実行（deploy など副作用のあるもの）
user-invocable: true                  # false: / メニューに出さず Claude だけが使う
allowed-tools: Bash(gh *) Bash(git *) # 確認なしで使えるツール
context: fork                         # 隔離したサブエージェントで実行
agent: Explore                        # fork 時のサブエージェント種別
paths: ["src/**/*.ts"]                # 該当ファイルを扱う時だけ自動ロード
shell: bash                           # bash | powershell
---
Investigate and fix GitHub issue $issue-number. Run the tests before finishing.
```

- `description` は常時コンテキストに乗る。短く、いつ使うかが分かる文にする。

---

## 引数と変数展開

| 変数 | 内容 |
| --- | --- |
| `$ARGUMENTS` | 呼び出し時の引数すべて（空白区切り） |
| `$0` `$1` … | 位置引数 |
| `$name` | `arguments:` で宣言した名前付き引数 |
| `${CLAUDE_SESSION_ID}` | セッション ID |
| `${CLAUDE_SKILL_DIR}` | SKILL.md のあるディレクトリ |
| `${CLAUDE_PROJECT_DIR}` | プロジェクトルート |
| `${CLAUDE_PLUGIN_ROOT}` | プラグインのルート（プラグインスキルのみ） |

```text
/fix-issue 123        → $issue-number = 123
/deploy staging now   → $ARGUMENTS = "staging now", $0 = staging, $1 = now
```

---

## 動的コンテンツの注入

Claude が読む前にシェルコマンドを実行して結果を埋め込める。実行結果はプロンプトの一部になるので、長すぎる出力は絞る。

<div class="cols">
<div>

````markdown
---
name: pr-summary
description: Summarize the current PR
---
## Current PR
- Diff: !`gh pr diff`
- Files: !`gh pr diff --name-only`

Summarize these changes concisely.
````

</div>
<div>

複数行は fenced block で:

````markdown
```!
git status --short
node --version
```
````

</div>
</div>

---

<!-- _class: dense -->

## 呼び出し方と使い分け

| 方法 | 書き方 |
| --- | --- |
| 手動 | `/fix-issue 123` |
| 連鎖（最大 6 つ） | `/code-review /security-review show me the diff` |
| 自動 | 「これをデプロイして」→ Claude が `description` を見て `/deploy` を選ぶ（`disable-model-invocation` が無い場合） |

<div class="verdict"><strong>使い分け:</strong> 同じプロンプトを繰り返し打っている → Skill。毎回必ず起こしたい → Hook。プロジェクトの前提知識 → CLAUDE.md。別リポジトリにも配りたい → Plugin。</div>

- 手軽に始めるなら `.claude/` に置いて反復、共有段階で `claude plugin init` でプラグイン化。
- 500 行を超える SKILL.md は補助ファイルに分割する（個人ブログの検証記事、未検証）。

---

## このデッキのまとめ

| やりたいこと | 使うもの |
| --- | --- |
| CI・スクリプトから使う | `claude -p --bare` + `--output-format json` + `--max-turns` + `--max-budget-usd` |
| 昨日の続き | `claude -c` / `claude -r <name>` |
| 並列で安全に | `claude -w <name>`、`claude --bg`、`claude agents` |
| 権限を絞る | `--permission-mode` `--allowedTools` `--tools` `--restricted` |
| MCP / プラグインを足す | `claude mcp add` `claude plugin install` |
| 設定が壊れた | `claude doctor` → `claude --safe-mode` |
| 速く打つ | `Shift+Tab` `Esc Esc` `!cmd` `@file` `Ctrl+G` |
| 自分の定型作業 | `.claude/skills/<name>/SKILL.md` |
