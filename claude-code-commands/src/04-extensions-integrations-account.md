---
marp: true
theme: claude
paginate: true
header: "Claude Code コマンド一覧 ─ 04 拡張・連携・アカウント・診断"
footer: "対象: Claude Code v2.1.269 / 公式ドキュメント (code.claude.com/docs) 2026-09 時点"
---

<!-- _class: title -->
<!-- _paginate: false -->

# 04 ─ 拡張・連携・アカウント・診断

## 1 コマンド 1 スライドで解説

- **G. 拡張（Skill / Plugin / MCP）** ─ 13 コマンド
- **H. 連携・リモート** ─ 11 コマンド
- **I. アカウント・利用状況** ─ 11 コマンド
- **J. 診断・ヘルプ** ─ 10 コマンド
- **K. 廃止・その他** ─ 5 コマンド

---

<!-- _class: divider -->

# G. 拡張（Skill / Plugin / MCP）

Claude Code に能力を足す

---

<!-- _class: cmd -->

# /skills
<span class="genre">G. 拡張</span>

<p class="oneliner">利用可能なスキルを一覧し、名前・説明・出所でフィルタする。Claude と <code>/</code> メニューへの表示/非表示を切り替えられる。</p>

- `t` でトークン数順にソート、`Space` / `Enter` で可視性を巡回、`Esc` で保存して閉じる。
- プラグインのスキル、`disable-model-invocation: true` のスキル、管理設定で `skillOverrides` されたスキルは切替不可。
- 自作スキルは `~/.claude/skills/<name>/SKILL.md`（個人）か `.claude/skills/<name>/SKILL.md`（プロジェクト）。

```text
/skills
```

<p class="rel">関連: /skill-doctor /reload-skills /plugin</p>

---

<!-- _class: cmd -->

# /skill-doctor
<span class="genre">G. 拡張</span>

<p class="oneliner">各スキルがコンテキストをどれだけ消費し、どれだけ使われているかを表示し、無効化候補を見つける。</p>

- スキルの説明文（description）は常時コンテキストに乗るため、使わないスキルはコスト。
- v2.1.252+、フィーチャーフラグ取得が必要。

```text
/skill-doctor
```

<p class="rel">関連: /skills /context /doctor</p>

---

<!-- _class: cmd -->

# /reload-skills
<span class="genre">G. 拡張</span>

<p class="oneliner">スキル・コマンドのディレクトリを再スキャンし、セッション中に追加・変更したスキルを再起動なしで使えるようにする。</p>

- 利用可能数と増減数を報告。
- プラグイン側の変更は `/reload-plugins`。

```text
/reload-skills
```

<p class="rel">関連: /skills /reload-plugins</p>

---

<!-- _class: cmd -->

# /plugin [subcommand]
<span class="genre">G. 拡張</span>

<p class="oneliner">プラグインを管理する。無引数でメニュー、<code>list</code> <code>install</code> <code>enable</code> <code>disable</code> などで直接操作。</p>

- プラグイン = スキル・フック・MCP サーバー・エージェント・テーマをまとめて配布する単位。マーケットプレイスから導入。
- インストール時に自動有効化されるかは概要に表示。されなければ `/reload-plugins`。
- CLI: `claude plugin install <name>@<marketplace>`。セッション限定なら `--plugin-dir` / `--plugin-url`。

```text
/plugin install code-review@marketplace
/plugin list
```

<p class="rel">関連: /reload-plugins claude plugin claude --plugin-dir</p>

---

<!-- _class: cmd -->

# /reload-plugins [--force]
<span class="genre">G. 拡張</span>

<p class="oneliner">有効なプラグインをすべて再読み込みし、再起動なしで変更を反映する。コンポーネント数と読み込みエラーを報告。</p>

- MCP ツール構成が変わってプロンプトキャッシュが無効になる場合は警告してスキップ。`--force` で強行。
- `-p` / SDK / Desktop でも使えるが、プラグインの MCP サーバー変更は反映されない。v2.1.260+。

```text
/reload-plugins
/reload-plugins --force
```

<p class="rel">関連: /plugin /reload-skills /mcp</p>

---

<!-- _class: cmd -->

# /mcp [reconnect &lt;server&gt;|enable|disable [&lt;server&gt;|all]]
<span class="genre">G. 拡張</span>

<p class="oneliner">MCP サーバーの接続状態と OAuth 認証を管理する。無引数で対話リスト。</p>

- `reconnect <server>` で切断中サーバーを再接続、`enable` / `disable` に名前か `all`。
- `-p` では無引数でテキストのサーバー状態を出力。v2.1.205+。
- サーバーの **追加・削除** は CLI の `claude mcp add / list / remove`、OAuth だけなら `claude mcp login <name>`。
- MCP サーバーが公開する prompt はコマンドとして `/` メニューに現れる。

```text
/mcp
/mcp disable all
```

<p class="rel">関連: claude mcp claude --mcp-config / --strict-mcp-config /doctor</p>

---

<!-- _class: cmd -->

# /import [codex|gemini|cursor] [--dry-run] [--yes]
<span class="genre">G. 拡張</span>

<p class="oneliner">OpenAI Codex / Google Gemini CLI / Cursor の設定（指示ファイル・MCP・コマンド・サブエージェント・スキル）を Claude Code に取り込む。</p>

- `--dry-run` で書き込まずにプレビュー、`--yes` でピッカーをスキップ。
- `-p` では検出結果と確定コマンドを表示。
- Bedrock / Vertex / Foundry / ゲートウェイ経由、フィーチャーフラグ無効時は不可。v2.1.213+（Cursor は v2.1.265+）。

```text
/import codex --dry-run
```

<p class="rel">関連: /init claude import</p>

---

<!-- _class: cmd -->

# /claude-api [subcommand]
<span class="genre">G. 拡張</span><span class="kind">Skill</span>

<p class="oneliner">Claude API / Managed Agents のリファレンスをプロジェクトの言語向けに読み込む。<code>anthropic</code> SDK を import しているコードでは自動で有効化。</p>

| サブコマンド | 内容 |
| --- | --- |
| `migrate` | 既存の API コードを新モデルへ更新 |
| `upgrade` | SDK のメジャーバージョン移行（Python 0.x → 1.x） |
| `managed-agents-onboard` | Managed Agent 作成のウォークスルー |
| `prompt-audit` | 旧モデル向けの指示を検出し diff で修正提案 |
| `cost-optimize` | API 支出のプロファイルと節約案（キャッシュ・バッチ・effort・モデル選択） |
| `build-eval` / `hillclimb` | 評価セット構築 / 評価に対する反復改善 |

<p class="rel">関連: /skills</p>

---

<!-- _class: cmd -->

# /design [brief]
<span class="genre">G. 拡張</span><span class="kind">Skill</span>

<p class="oneliner">UI モック・画面フロー・LP・ポスターを 1 つのキャンバス上のアートボードとして下書きし、Claude Design のエディタ付き Artifact として公開する。</p>

- 保存が有効なアカウントではキャンバス上で編集して新バージョンを公開。そうでなければ閲覧と PNG / PDF エクスポート。
- Artifact が使えるセッション（Anthropic API）限定。Bedrock / Vertex / Foundry では不可。v2.1.234+。

```text
/design a settings screen for a mobile banking app
```

<p class="rel">関連: /design-sync /artifacts /dataviz</p>

---

<!-- _class: cmd -->

# /design-sync [hint]
<span class="genre">G. 拡張</span><span class="kind">Skill</span>

<p class="oneliner">リポジトリの React デザインシステムを変換して Claude Design にアップロードし、生成されるデザインが実コンポーネントを使うようにする。</p>

- 初回同期は全コンポーネントを検証するため、大きなリポジトリでは数時間かかる。
- claude.ai への接続が必要（Bedrock / Vertex / Foundry / ゲートウェイ経由では不可）。

```text
/design-sync Acme DS
```

<p class="rel">関連: /design-login /design</p>

---

<!-- _class: cmd -->

# /design-login
<span class="genre">G. 拡張</span>

<p class="oneliner"><code>/design-sync</code> のためにデザインシステムへのアクセスを claude.ai アカウントで認可する。</p>

```text
/design-login
```

<p class="rel">関連: /design-sync</p>

---

<!-- _class: cmd -->

# /dataviz [request]
<span class="genre">G. 拡張</span><span class="kind">Skill</span>

<p class="oneliner">チャート・グラフ・ダッシュボードの設計ガイダンス。データに合ったチャート形式、役割別の配色、色覚安全性・コントラストの検証を行う。</p>

- ブランド中立のプレースホルダーパレットを使い、自分のパレットに差し替える前提。
- v2.1.198+。

```text
/dataviz monthly revenue by region as a dashboard
```

<p class="rel">関連: /design /artifacts</p>

---

<!-- _class: cmd -->

# /artifacts
<span class="genre">G. 拡張</span>

<p class="oneliner">自分が所有する / 共有された Artifact（claude.ai にホストされる Web ページ）を一覧し、セッションに添付・ブラウザで開く・リンクをコピーする。</p>

- Artifact が利用できる環境のみ。v2.1.208+（`Enter` で添付は v2.1.216+）。
- 端末では `Ctrl+]` で直近の Artifact を再表示。

```text
/artifacts
```

<p class="rel">関連: /design /dataviz</p>

---

<!-- _class: divider -->

# H. 連携・リモート

IDE・ブラウザ・別デバイスから使う

---

<!-- _class: cmd -->

# /ide
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">IDE 連携（VS Code / JetBrains）の管理と状態表示。</p>

- 起動時に自動接続するなら `claude --ide`（有効な IDE がちょうど 1 つの時）。
- VS Code: `Option/Alt+K` で `@file#5-10` 参照を挿入。JetBrains: `Cmd/Ctrl+Esc` で起動。

```text
/ide
```

<p class="rel">関連: claude --ide /terminal-setup</p>

---

<!-- _class: cmd -->

# /chrome
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">Claude in Chrome（ブラウザ自動化・Web テスト）の設定を行う。</p>

- 起動時に有効化 / 無効化するなら `claude --chrome` / `--no-chrome`。
- 拡張機能側でサイトごとの許可が必要。

```text
/chrome
```

<p class="rel">関連: claude --chrome / --no-chrome</p>

---

<!-- _class: cmd -->

# /desktop
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">現在のセッションを Claude Code Desktop アプリで続ける。</p>

- macOS または x64 Windows、Claude サブスクリプションが必要。
- 別名: `/app`

```text
/desktop
```

<p class="rel">関連: /remote-control /mobile</p>

---

<!-- _class: cmd -->

# /mobile
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">Claude モバイルアプリをダウンロードする QR コードを表示する。</p>

- モバイルからは Remote Control 経由で端末のセッションを操作できる。
- 別名: `/ios` `/android`

```text
/mobile
```

<p class="rel">関連: /remote-control</p>

---

<!-- _class: cmd -->

# /remote-control
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">このローカルセッションを claude.ai / Claude アプリから操作可能にする。</p>

- claude.ai サブスクリプションが必要。サインアウト中は案内を表示（v2.1.206+）。
- 起動時から有効にするなら `claude --remote-control [name]`（`--rc`）。ローカル対話なしのサーバーモードは `claude remote-control`。
- 別名: `/rc`

```text
/remote-control
```

<p class="rel">関連: claude --remote-control /teleport /color（同期）</p>

---

<!-- _class: cmd -->

# /remote-env
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">クラウドエージェント（Claude Code on the web）で使うデフォルト環境を選ぶ。</p>

- セルフホスト環境を使うなら起動時に `--environment ccpool_...`。

```text
/remote-env
```

<p class="rel">関連: /schedule /autofix-pr claude --cloud / --environment</p>

---

<!-- _class: cmd -->

# /teleport
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">Claude Code on the web のセッションをこのターミナルに引き込む。ピッカーで選ぶとブランチと会話を取得。</p>

- claude.ai サブスクリプションが必要。起動時なら `claude --teleport [session]`。
- 逆方向（ローカル → Web）は `claude --cloud "task"`。
- 別名: `/tp`

```text
/teleport
```

<p class="rel">関連: claude --teleport / --cloud /web-setup</p>

---

<!-- _class: cmd -->

# /web-setup
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">ローカルの <code>gh</code> CLI 資格情報を使って、GitHub アカウントを Claude Code on the web に接続する。</p>

- Web セッション・`/autofix-pr`・`/schedule` の前提になることが多い。

```text
/web-setup
```

<p class="rel">関連: /install-github-app /teleport /autofix-pr</p>

---

<!-- _class: cmd -->

# /install-github-app
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">Claude GitHub App をリポジトリにインストールし、任意で GitHub Actions のワークフローとシークレットも設定する。</p>

- github.com のみ。リモートが gitlab.com / bitbucket.org なら通知して終了。GitLab CI/CD は別ドキュメント。
- 導入後は PR で `@claude` メンションによるレビュー・修正が使える。

```text
/install-github-app
```

<p class="rel">関連: /web-setup /autofix-pr /code-review --comment</p>

---

<!-- _class: cmd -->

# /install-slack-app
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">Claude Slack アプリをインストールする。ブラウザで OAuth を完了。</p>

```text
/install-slack-app
```

<p class="rel">関連: /install-github-app</p>

---

<!-- _class: cmd -->

# /voice [hold|tap|off]
<span class="genre">H. 連携・リモート</span>

<p class="oneliner">音声入力を切り替える、または特定のモード（押し続ける / タップ）で有効化する。</p>

- Claude.ai アカウントが必要。

```text
/voice tap
```

<p class="rel">関連: /config</p>

---

<!-- _class: divider -->

# I. アカウント・利用状況

コストと上限を把握する

---

<!-- _class: cmd -->

# /login ／ /logout
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">Anthropic アカウントにサインイン / サインアウトする。</p>

- CLI からは `claude auth login`（`--email` `--sso` `--console`）/ `claude auth logout` / `claude auth status`。
- CI 用の長期トークンは `claude setup-token`。
- Bedrock / Vertex は `/setup-bedrock` `/setup-vertex`。

```text
/login
/logout
```

<p class="rel">関連: claude auth claude setup-token /status</p>

---

<!-- _class: cmd -->

# /usage
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">セッションコスト、プランの利用上限、活動統計を表示する。Pro / Max / Team / Enterprise では上限に対する内訳も。</p>

- 応答中でも即時実行。
- 別名: `/cost`、`/stats`（Stats タブで開く）。

```text
/usage
```

<p class="rel">関連: /cost /stats /usage-credits /rate-limit-options /context</p>

---

<!-- _class: cmd -->

# /cost ／ /stats
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">どちらも <code>/usage</code> の別名。<code>/stats</code> は Stats タブで開く。</p>

- `-p` で機械的にコストを取るなら `--output-format json` の結果に含まれる使用量を使う。
- 予算で止めたいなら `claude -p --max-budget-usd 5.00`。

```text
/cost
/stats
```

<p class="rel">関連: /usage claude --max-budget-usd</p>

---

<!-- _class: cmd -->

# /usage-credits
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">利用上限に達した時に、使用クレジットを設定する、または管理者へ申請する。</p>

- 通常はブラウザで課金設定を開く。Team / Enterprise で課金権限がないメンバーは CLI から管理者に申請（確認ダイアログあり）。
- ブラウザが開けない（SSH など）場合は URL を表示。旧名 `/extra-usage`。

```text
/usage-credits
```

<p class="rel">関連: /rate-limit-options /upgrade /ultrareview</p>

---

<!-- _class: cmd -->

# /rate-limit-options
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">claude.ai の利用上限でブロックされた時の選択肢を表示する: リセットまで待って自動継続、使用クレジット追加、プランのアップグレード。</p>

- 上限到達時に Claude Code が自動で開くこともある。自動継続はオフにできる。
- メニューに出ない隠しコマンド。フル名で入力。v2.1.234+。

```text
/rate-limit-options
```

<p class="rel">関連: /usage-credits /upgrade /usage</p>

---

<!-- _class: cmd -->

# /upgrade
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">上位プランへのアップグレードページをブラウザで開く。</p>

- Enterprise プランでは表示されない。

```text
/upgrade
```

<p class="rel">関連: /usage /passes</p>

---

<!-- _class: cmd -->

# /privacy-settings
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">プライバシー設定の表示と変更。Pro / Max 加入者のみ。</p>

```text
/privacy-settings
```

<p class="rel">関連: /config</p>

---

<!-- _class: cmd -->

# /passes
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">友人に Claude Code の 1 週間無料利用を共有する。対象アカウントにのみ表示。</p>

```text
/passes
```

<p class="rel">関連: /upgrade</p>

---

<!-- _class: cmd -->

# /status
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">設定画面の Status タブを開き、バージョン・モデル・アカウント・接続状態を表示する。</p>

- `Session kind` 行が `interactive` / `background job · attached` / `background job · unattended` を示す（v2.1.221+）。
- 応答中でも実行可。

```text
/status
```

<p class="rel">関連: /config /usage /doctor</p>

---

<!-- _class: cmd -->

# /insights
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">このマシンでの最近のセッションを分析し、作業プロジェクト・使い方・つまずき・試すべき機能をまとめた HTML レポートを生成する。</p>

- クラウドセッションでは不可。レポート生成にはトークンコストがかかる。

```text
/insights
```

<p class="rel">関連: /team-onboarding /usage</p>

---

<!-- _class: cmd -->

# /team-onboarding
<span class="genre">I. アカウント・利用状況</span>

<p class="oneliner">過去 30 日のセッション・コマンド・MCP 利用を分析し、チームメイトが最初のメッセージとして貼れる Markdown のオンボーディングガイドを生成する。</p>

- Pro / Max / Team / Enterprise では Claude Code で直接開ける共有リンクも返す。

```text
/team-onboarding
```

<p class="rel">関連: /insights /init /memory</p>

---

<!-- _class: divider -->

# J. 診断・ヘルプ

困った時に

---

<!-- _class: cmd -->

# /help
<span class="genre">J. 診断・ヘルプ</span>

<p class="oneliner">ヘルプと利用可能なコマンドを表示する。</p>

- プラン・環境で使えるコマンドだけが出る。
- 特定の機能の質問は Claude に直接聞くのも有効（Claude Code 自身のガイド用エージェントが答える）。

```text
/help
```

<p class="rel">関連: /powerup /release-notes</p>

---

<!-- _class: cmd -->

# /doctor
<span class="genre">J. 診断・ヘルプ</span><span class="kind">Skill</span>

<p class="oneliner">セットアップの健康診断。検出 → 確認 → 修正まで行う。</p>

- インストール（重複・PATH）、設定ファイルの破損、未使用のスキル / MCP / プラグインとそのコンテキストコスト、遅いフック、新バージョン。
- CLAUDE.md の重複排除・トリム・スキルへの移行提案。Auto mode 既定化と読み取り専用コマンドの事前許可も提案。
- 端末からは `claude doctor`（読み取り専用）。別名: `/checkup`

```text
/doctor
```

<p class="rel">関連: claude doctor /debug /skill-doctor /context</p>

---

<!-- _class: cmd -->

# /debug [description]
<span class="genre">J. 診断・ヘルプ</span><span class="kind">Skill</span>

<p class="oneliner">このセッションのデバッグログを有効化し、ログを読んで問題を分析する。</p>

- `claude --debug` で起動していない限り、`/debug` を打った時点からログ収集開始。
- 起動時のカテゴリ絞り込み: `claude --debug='mcp,startup'`、ファイル出力: `--debug-file <path>`。

```text
/debug MCP server keeps disconnecting
```

<p class="rel">関連: claude --debug /doctor /bug</p>

---

<!-- _class: cmd -->

# /bug [report]
<span class="genre">J. 診断・ヘルプ</span>

<p class="oneliner">バグ報告、または会話の共有。含めるセッション履歴の量を選び、同意画面で確認してから送信。</p>

- Anthropic に直接サインインしていれば Anthropic へ送信。サードパーティ経由なら `~/.claude/feedback-bundles/` にローカル保存して自分で転送。
- VS Code 拡張では拡張の独自ダイアログ。応答中でも即座に開く。
- 別名: `/share`

```text
/bug
```

<p class="rel">関連: /feedback /debug /heapdump</p>

---

<!-- _class: cmd -->

# /feedback [report]
<span class="genre">J. 診断・ヘルプ</span>

<p class="oneliner">製品フィードバックを送る。<code>/bug</code> と同じダイアログ・同意ステップ。</p>

- Claude が下書きしたフィードバックがあるセッションでは、無引数で **下書きキュー** が開き、確認・編集・送信・破棄できる。

```text
/feedback
```

<p class="rel">関連: /bug</p>

---

<!-- _class: cmd -->

# /heapdump
<span class="genre">J. 診断・ヘルプ</span>

<p class="oneliner">JavaScript のヒープスナップショットとメモリ内訳を <code>~/Desktop</code>（Linux はホーム）に書き出す。メモリ使用量の診断用。</p>

- 報告に添付するのは `-diagnostics.json` のみ。`.heapsnapshot` には **会話全文と資格情報** が含まれるので共有しない。
- メニューに出ない隠しコマンド。

```text
/heapdump
```

<p class="rel">関連: /bug /debug</p>

---

<!-- _class: cmd -->

# /release-notes
<span class="genre">J. 診断・ヘルプ</span>

<p class="oneliner">変更履歴をバージョン選択式で表示する。全バージョン表示も可。</p>

- 表示はトランスクリプトに出るだけで、Claude の会話コンテキストには入らない。

```text
/release-notes
```

<p class="rel">関連: claude update /status</p>

---

<!-- _class: cmd -->

# /powerup
<span class="genre">J. 診断・ヘルプ</span>

<p class="oneliner">アニメーション付きの短い対話レッスンで Claude Code の機能を発見する。</p>

```text
/powerup
```

<p class="rel">関連: /help</p>

---

<!-- _class: cmd -->

# /setup-bedrock ／ /setup-vertex
<span class="genre">J. 診断・ヘルプ</span>

<p class="oneliner">Amazon Bedrock / Google Cloud（Agent Platform）の認証・リージョン・プロジェクト・モデル固定を対話ウィザードで設定する。</p>

- `CLAUDE_CODE_USE_BEDROCK=1` / `CLAUDE_CODE_USE_VERTEX=1` を設定するまでメニューに出ない。フル名で入力。
- 初回利用時はログイン画面からも到達可能。

```text
/setup-bedrock
/setup-vertex
```

<p class="rel">関連: /login /status</p>

---

<!-- _class: divider -->

# K. 廃止・その他

知っておくと迷わない

---

<!-- _class: cmd -->

# /pr-comments [PR] ／ /ultraplan ／ /vim
<span class="genre">K. 廃止・その他</span>

<p class="oneliner">いずれも廃止済み。代替を覚えておく。</p>

| 旧コマンド | 状態 | 代替 |
| --- | --- | --- |
| `/pr-comments [PR]` | v2.1.91 で削除 | 「PR 1234 のコメントを見て」と Claude に直接依頼（`gh` CLI 経由） |
| `/ultraplan <prompt>` | 削除 | `/plan` またはプランモード（`Shift+Tab`） |
| `/vim` | v2.1.92 で削除 | `/config` → Editor mode（または `editorMode: "vim"`） |

<p class="rel">関連: /plan /config</p>

---

<!-- _class: cmd -->

# /radio ／ /stickers
<span class="genre">K. 廃止・その他</span>

<p class="oneliner">お楽しみ系コマンド。</p>

- `/radio` ─ Claude FM（lo-fi ラジオ）をブラウザで開く。ブラウザがなければストリーム URL を表示。
- `/stickers` ─ Claude Code のステッカーを注文する。

```text
/radio
/stickers
```

---

## このデッキのまとめ

| やりたいこと | 使うコマンド |
| --- | --- |
| スキルを管理・軽量化 | `/skills` `/skill-doctor` `/reload-skills` |
| プラグイン・MCP を管理 | `/plugin` `/reload-plugins` `/mcp`（追加は `claude mcp add`） |
| 他ツールから移行 | `/import codex|gemini|cursor` |
| 別デバイス・Web と行き来 | `/remote-control` `/teleport` `claude --cloud` |
| GitHub / Slack 連携 | `/install-github-app` `/web-setup` `/install-slack-app` |
| コストと上限 | `/usage` `/usage-credits` `/rate-limit-options` |
| 調子が悪い | `/doctor` → `/debug` → `/bug` |
| 何が変わった？ | `/release-notes` |
