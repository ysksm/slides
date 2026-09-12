---
marp: true
theme: claude
paginate: true
header: "Claude Code コマンド一覧 ─ 03 レビュー・並列・権限"
footer: "対象: Claude Code v2.1.269 / 公式ドキュメント (code.claude.com/docs) 2026-09 時点"
---

<!-- _class: title -->
<!-- _paginate: false -->

# 03 ─ レビュー・並列・権限

## 1 コマンド 1 スライドで解説

- **D. レビュー・検証** ─ 9 コマンド
- **E. 並列・自動化・ワークフロー** ─ 10 コマンド
- **F. 権限・設定・UI** ─ 14 コマンド

---

<!-- _class: divider -->

# D. レビュー・検証

出荷前に品質を確かめる

---

<!-- _class: cmd -->

# /code-review [level] [flags] [target]
<span class="genre">D. レビュー・検証</span><span class="kind">Skill</span>

<p class="oneliner">現在の差分、または PR 番号・ブランチ・パスを、正確性バグと整理の観点でレビューする。</p>

- レベル: `low` `medium`（少数・高確信）→ `high` `xhigh` `max`（広く・不確実な指摘も）→ `ultra`（クラウド多エージェント）。
- `--fix` で指摘を作業ツリーに適用。`--comment` で GitHub PR / GitLab MR にインラインコメント。
- `ultra` + github.com PR では `--post` で結果を PR にまとめて投稿する選択肢を事前選択。
- バグ探索ではなく整理のみなら `/simplify`。別名: `/review`

```text
/code-review high
/code-review medium --fix
/code-review ultra 1234 --post
```

<p class="rel">関連: /review /simplify /security-review /ultrareview /diff</p>

---

<!-- _class: cmd -->

# /review [level] [flags] [target]
<span class="genre">D. レビュー・検証</span>

<p class="oneliner"><code>/code-review</code> の別名。同じレベル・フラグ・ターゲットを取る。</p>

- レベル省略時は **最後に打った low〜max のレベルを再利用**。
- 歴史: v2.1.223 より前は PR 番号を単発レビューする別コマンドだった。今は完全に統合。

```text
/review 1234
```

<p class="rel">関連: /code-review</p>

---

<!-- _class: cmd -->

# /ultrareview [PR|branch]
<span class="genre">D. レビュー・検証</span>

<p class="oneliner">クラウドサンドボックスで多エージェントの深層コードレビューを実行する。現在の推奨表記は <code>/code-review ultra</code>。</p>

- PR 参照を渡せばその PR、ブランチ名を渡せば比較ベースを変更。
- Pro / Max は 3 回まで無料、以降は使用クレジット。ユーザーがトリガーする課金操作で、Claude 自身は起動できない。
- 非対話なら `claude ultrareview [target] --json`（成功 0 / 失敗 1 で終了）。

```text
/ultrareview
/code-review ultra 1234
```

<p class="rel">関連: /code-review claude ultrareview /usage-credits</p>

---

<!-- _class: cmd -->

# /security-review
<span class="genre">D. レビュー・検証</span>

<p class="oneliner">現在のブランチと origin のデフォルトブランチの差分を、脆弱性（インジェクション・認証・情報漏洩など）の観点で分析する。</p>

- `origin` リモートが必要。`ambiguous argument` エラーが出たらデフォルトブランチの取得を確認。
- 正確性バグは `/code-review`、整理は `/simplify` と役割分担。
- スキル連鎖で `/code-review /security-review` のようにまとめて実行できる。

```text
/security-review
```

<p class="rel">関連: /code-review /simplify /diff</p>

---

<!-- _class: cmd -->

# /simplify [target]
<span class="genre">D. レビュー・検証</span><span class="kind">Skill</span>

<p class="oneliner">変更コードを「既存ヘルパーの再利用・簡素化・効率・抽象度」の 4 観点で並列レビューし、修正を適用する。</p>

- **バグは探さない**。バグ探索は `/code-review`。
- パスや PR 参照を渡すと対象を限定。
- コミット前の「仕上げ」フェーズに向く。

```text
/simplify
/simplify src/payments/
```

<p class="rel">関連: /code-review /diff</p>

---

<!-- _class: cmd -->

# /diff
<span class="genre">D. レビュー・検証</span>

<p class="oneliner">作業ツリーの変更（Claude がここまでに行った編集を含む）を確認する。</p>

- レビュー前に「何が変わったか」を自分の目で見る最短手段。
- 修正を戻したいなら `/rewind`、内容を精査したいなら `/code-review`。

```text
/diff
```

<p class="rel">関連: /code-review /rewind !git diff</p>

---

<!-- _class: cmd -->

# /verify
<span class="genre">D. レビュー・検証</span><span class="kind">Skill</span>

<p class="oneliner">テストや型チェックに頼らず、アプリを実際にビルド・起動・観察して変更が意図通りか確認する。</p>

- **自分で呼んだ時だけ動く**（v2.1.215 以降、Claude が勝手に起動しない）。
- 起動手順が複雑なプロジェクトは `/run-skill-generator` で手順スキルを作っておく。

```text
/verify
```

<p class="rel">関連: /run /run-skill-generator /code-review</p>

---

<!-- _class: cmd -->

# /run
<span class="genre">D. レビュー・検証</span><span class="kind">Skill</span>

<p class="oneliner">プロジェクトのアプリを起動して操作し、変更が動いているところを見る（スクリーンショット含む）。</p>

- 対象タイプ（CLI / サーバー / TUI / Electron / ブラウザ）ごとの組み込みパターンで起動。
- プロジェクト固有の起動スキルがあればそれを優先。

```text
/run
```

<p class="rel">関連: /verify /run-skill-generator</p>

---

<!-- _class: cmd -->

# /run-skill-generator
<span class="genre">D. レビュー・検証</span><span class="kind">Skill</span>

<p class="oneliner">クリーン環境でアプリをビルド・起動・操作する手順を、プロジェクト用スキルとして書き出す。</p>

- 一度作れば `/run` `/verify` がそのスキルを使って安定して起動できる。
- `.claude/skills/` に生成されるのでチームで共有可。

```text
/run-skill-generator
```

<p class="rel">関連: /run /verify /skills</p>

---

<!-- _class: divider -->

# E. 並列・自動化・ワークフロー

人手を離れて複数の作業を回す

---

<!-- _class: cmd -->

# /batch &lt;instruction&gt;
<span class="genre">E. 並列・自動化・ワークフロー</span><span class="kind">Skill</span>

<p class="oneliner">大規模変更をコードベース調査 → 5〜30 の独立ユニットに分解 → 計画提示 → 承認後に worktree ごとのサブエージェントで並列実行し、各自 PR を開く。</p>

- git リポジトリ必須。ユニットごとに **隔離された git worktree** で実装・テスト・PR。
- 「JS → TS 移行」「API 呼び出しの一括置換」のような機械的で分割可能な作業向き。

```text
/batch migrate src/ from JavaScript to TypeScript
```

<p class="rel">関連: /tasks /workflows claude --worktree</p>

---

<!-- _class: cmd -->

# /tasks
<span class="genre">E. 並列・自動化・ワークフロー</span>

<p class="oneliner">現在のセッションのバックグラウンド作業（完了したサブエージェント含む）を一覧・管理する。</p>

- 応答中でも即時実行される。
- Artifact の監視やモニターの停止もここから。
- 別名: `/bashes`

```text
/tasks
```

<p class="rel">関連: /subtask /workflows /list-agents claude agents（セッション横断）</p>

---

<!-- _class: cmd -->

# /loop [interval] [prompt]
<span class="genre">E. 並列・自動化・ワークフロー</span><span class="kind">Skill</span>

<p class="oneliner">セッションが開いている間、プロンプトを一定間隔で繰り返し実行する。</p>

- 間隔を省くと Claude が **自己ペース**（待つ対象に合わせて次の起床を決める）。
- プロンプトも省くと組み込みの保守プロンプト、または `loop.md` を実行。
- クラウドで定期実行したいなら `/schedule`。
- 別名: `/proactive`

```text
/loop 5m check if the deploy finished
/loop /babysit-prs
```

<p class="rel">関連: /schedule /goal /tasks</p>

---

<!-- _class: cmd -->

# /schedule [description]
<span class="genre">E. 並列・自動化・ワークフロー</span>

<p class="oneliner">クラウドで cron 実行されるルーチンを作成・更新・一覧・実行する。Claude が対話的に設定を案内。</p>

- ローカル端末を閉じても動く。「毎朝 9 時に依存関係の更新 PR を確認」など。
- 一度きり（「明日 15 時に実行」）も可。直近の実行結果も質問できる。
- Console API キーでは使えず、`Unknown command` と返る。
- 別名: `/routines`

```text
/schedule every weekday at 9am, triage new GitHub issues
```

<p class="rel">関連: /loop /autofix-pr /remote-env</p>

---

<!-- _class: cmd -->

# /deep-research &lt;question&gt;
<span class="genre">E. 並列・自動化・ワークフロー</span><span class="kind">Workflow</span>

<p class="oneliner">質問に対して Web 検索を並列に展開し、出典を突き合わせて引用付きレポートを合成する同梱ワークフロー。</p>

- バックグラウンドで多数のサブエージェントに展開される。
- **自分で呼んだ時だけ動く**（v2.1.218 以降）。進捗は `/workflows`。

```text
/deep-research What are the trade-offs of Postgres logical replication vs Debezium?
```

<p class="rel">関連: /workflows /workflow-authoring</p>

---

<!-- _class: cmd -->

# /workflows
<span class="genre">E. 並列・自動化・ワークフロー</span>

<p class="oneliner">実行中・完了したダイナミックワークフローの進捗ビューを開き、監視・一時停止・再開・保存を行う。</p>

- ダイナミックワークフロー = スクリプトで複数サブエージェントを決定的にオーケストレーションする仕組み。
- 起動はユーザーの明示的なオプトインが必要（`ultracode` キーワード、`/effort ultracode`、「ワークフローで」と依頼）。
- サイズ目安は設定 **Dynamic workflow size**（既定 medium = 15 エージェント以下）。

```text
/workflows
```

<p class="rel">関連: /workflow-authoring /effort ultracode /deep-research /tasks</p>

---

<!-- _class: cmd -->

# /workflow-authoring
<span class="genre">E. 並列・自動化・ワークフロー</span><span class="kind">Skill</span>

<p class="oneliner">ダイナミックワークフローのスクリプト API・再開動作・品質パターン・作例のリファレンスを読み込む。</p>

- 通常は Claude がスクリプトを書く前に自動で読む。**保存済みスクリプトを手で編集する前** に自分で呼ぶ。
- ダイナミックワークフローが有効な環境のみ。v2.1.248+。

```text
/workflow-authoring
```

<p class="rel">関連: /workflows</p>

---

<!-- _class: cmd -->

# /autofix-pr [prompt]
<span class="genre">E. 並列・自動化・ワークフロー</span>

<p class="oneliner">現在のブランチの PR を監視し、CI 失敗やレビューコメントに応じて修正をプッシュするクラウドセッションを起動する。</p>

- `gh pr view` で PR を検出。別 PR を対象にするならそのブランチをチェックアウト。
- 既定では全 CI 失敗・全コメントを直す。プロンプトで範囲を絞れる。
- `gh` CLI と Claude Code on the web へのアクセスが必要。

```text
/autofix-pr only fix lint and type errors
```

<p class="rel">関連: /schedule /install-github-app /code-review --comment</p>

---

<!-- _class: cmd -->

# /agents
<span class="genre">E. 並列・自動化・ワークフロー</span>

<p class="oneliner">サブエージェント定義の作成・管理方法を案内する（v2.1.198 以降）。</p>

- 実体は `.claude/agents/`（プロジェクト）と `~/.claude/agents/`（個人）の Markdown。Claude に「レビュー用サブエージェントを作って」と頼むのが早い。
- v2.1.197 以前は対話 UI が開いていた。
- 起動時に JSON で定義するなら `claude --agents '{...}'`。

```text
/agents
```

<p class="rel">関連: /list-agents claude --agents / --agent</p>

---

<!-- _class: cmd -->

# /list-agents
<span class="genre">E. 並列・自動化・ワークフロー</span>

<p class="oneliner">Claude がメッセージを送れるサブエージェント・エージェントチームのメンバー・他の Claude Code セッションを、宛先名付きで一覧する。</p>

- セッション横断メッセージングが有効な環境のみ。v2.1.224+。
- 別名: `/peers`

```text
/list-agents
```

<p class="rel">関連: /agents /tasks claude --teammate-mode</p>

---

<!-- _class: divider -->

# F. 権限・設定・UI

安全に、快適に動かす

---

<!-- _class: cmd -->

# /permissions
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">ツール権限の allow / ask / deny ルールをスコープ別に閲覧・追加・削除し、作業ディレクトリと Auto mode の拒否履歴も管理する。</p>

- **Auto mode** タブでクラシファイアのルールも編集可。
- 応答中に実行しても即座に開き、同じターンの次のツール呼び出しから適用。
- ルール例: `Bash(git log *)` `Edit` `mcp__github__*`。起動時は `--allowedTools` / `--disallowedTools`。
- 別名: `/allowed-tools`

```text
/permissions
```

<p class="rel">関連: /fewer-permission-prompts /auto-mode-setup Shift+Tab claude --permission-mode</p>

---

<!-- _class: cmd -->

# /config [key=value ...]
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">設定画面を開く。<code>key=value</code> を渡せば画面を開かずに直接設定できる。</p>

- 例: `/config thinking=false` `/config theme=dark` `/config model=sonnet`（v2.1.181/182+）。
- `-p` モードや Remote Control からも `key=value` 形式で使える。
- 確認が必要な設定（`autoContinueAtUsageLimit` など）は on にできない（off は可）。
- `/config --help` で受け付けるキー一覧。別名: `/settings`

```text
/config
/config theme=dark model=sonnet
```

<p class="rel">関連: /permissions /theme /model claude --settings</p>

---

<!-- _class: cmd -->

# /fewer-permission-prompts
<span class="genre">F. 権限・設定・UI</span><span class="kind">Skill</span>

<p class="oneliner">過去のセッション記録から頻出の読み取り専用 Bash / MCP 呼び出しを抽出し、優先度付きの許可リストをプロジェクトの <code>.claude/settings.json</code> に追加する。</p>

- 「毎回 `git status` の許可を聞かれる」を解消する。
- 書き込み系は含めない設計。`/doctor` からも同様の提案が出る。

```text
/fewer-permission-prompts
```

<p class="rel">関連: /permissions /doctor</p>

---

<!-- _class: cmd -->

# /auto-mode-setup
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">プロジェクトと最近のセッションから <code>autoMode.environment</code> エントリを下書きし、確認してユーザー設定に保存する。</p>

- Auto mode = クラシファイアが安全な操作を自動承認する権限モード。
- Pro / Max / Team プラン、v2.1.228+（Windows は v2.1.233+）。
- CLI から既定ルールを見るなら `claude auto-mode defaults`、リセットは `claude auto-mode reset`。

```text
/auto-mode-setup
```

<p class="rel">関連: /permissions claude --permission-mode auto claude auto-mode</p>

---

<!-- _class: cmd -->

# /sandbox
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">サンドボックスモードを切り替える（対応プラットフォームのみ）。</p>

- Bash などの実行をファイルシステム・ネットワーク面で隔離し、権限プロンプトを減らしつつ安全性を保つ。
- `--dangerously-skip-permissions` を使うなら、少なくともサンドボックス内で。

```text
/sandbox
```

<p class="rel">関連: /permissions claude --restricted</p>

---

<!-- _class: cmd -->

# /hooks
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">ツールイベント（PreToolUse / PostToolUse / SessionStart / Stop など）に対するフック設定を表示する。</p>

- 実体は `settings.json` の `hooks` キー。「保存時に必ず prettier」など **決定的に実行したい処理** はフックにする。
- CLAUDE.md の指示は「守ってほしい」、フックは「必ず実行される」。
- 遅いフックは `/doctor` が検出する。

```text
/hooks
```

<p class="rel">関連: /config /doctor /memory</p>

---

<!-- _class: cmd -->

# /keybindings
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">キーボードショートカット設定ファイル <code>~/.claude/keybindings.json</code> を開く。</p>

- 送信キーの変更、コードバインディングの追加などをカスタマイズ。
- `--safe-mode` 起動時はカスタムキーバインドが無効になる。

```text
/keybindings
```

<p class="rel">関連: /terminal-setup /config</p>

---

<!-- _class: cmd -->

# /statusline
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">ステータスラインを設定する。欲しい内容を自然言語で書くか、無引数でシェルプロンプトから自動構成。</p>

- モデル名、コンテキスト使用率、git ブランチなどを常時表示できる。

```text
/statusline show model, context usage and git branch
```

<p class="rel">関連: /config /context</p>

---

<!-- _class: cmd -->

# /theme
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">カラーテーマを変更する。auto（端末の明暗に追従）、ライト/ダーク、色覚配慮（daltonized）、ANSI、カスタムテーマ。</p>

- カスタムテーマは `~/.claude/themes/` またはプラグインから。**New custom theme…** で作成。
- フルスクリーン描画中は応答中でも即座に開く。

```text
/theme
```

<p class="rel">関連: /color /tui /config</p>

---

<!-- _class: cmd -->

# /color [color|default]
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">プロンプトバーの色をセッション単位で設定する。複数セッションの見分けに。</p>

- 色: `red` `blue` `green` `yellow` `purple` `orange` `pink` `cyan`。`default` でリセット、無引数でランダム。
- Remote Control 接続時は claude.ai/code にも同期。`-p` でも可。

```text
/color purple
```

<p class="rel">関連: /rename /theme</p>

---

<!-- _class: cmd -->

# /tui [default|fullscreen]
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">ターミナル UI レンダラーを切り替え、会話を保ったまま再起動する。</p>

- `fullscreen` はちらつきのない alt-screen レンダラー。`/focus` `/scroll-speed` はフルスクリーン専用。
- 無引数なら現在のレンダラーを表示。

```text
/tui fullscreen
```

<p class="rel">関連: /focus /scroll-speed /theme</p>

---

<!-- _class: cmd -->

# /focus
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">最後のプロンプト、ツール呼び出しの一行要約（編集 diffstat 付き）、最終応答だけを表示するフォーカスビューを切り替える。</p>

- サブエージェント数や完了通知はまとめてカウント表示。
- 選択はセッションをまたいで保持。設定 `viewMode` で上書き可。フルスクリーン専用。
- VS Code 拡張には独自の Focus view がある。

```text
/focus
```

<p class="rel">関連: /tui claude --verbose</p>

---

<!-- _class: cmd -->

# /scroll-speed
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">マウスホイールのスクロール速度を、ルーラーでプレビューしながら調整する。</p>

- フルスクリーン描画のみ。JetBrains IDE のターミナルでは不可。

```text
/scroll-speed
```

<p class="rel">関連: /tui</p>

---

<!-- _class: cmd -->

# /terminal-setup
<span class="genre">F. 権限・設定・UI</span>

<p class="oneliner">VS Code / Cursor / Devin Desktop / Alacritty / Zed に Shift+Enter 改行のキーバインドを導入する。</p>

- Apple Terminal では Option+Enter 改行とベル音オフ、iTerm2 では `/copy` 用のクリップボードアクセスを有効化。
- Ghostty / Kitty / iTerm2 / WezTerm / Warp / Windows Terminal は設定不要。gnome-terminal と JetBrains は `Ctrl+J` か `\`+`Enter` を使う。

```text
/terminal-setup
```

<p class="rel">関連: /keybindings /copy</p>

---

## このデッキのまとめ

| やりたいこと | 使うコマンド |
| --- | --- |
| バグを見つけたい | `/code-review [level]`（深く: `ultra`） |
| 脆弱性を見たい | `/security-review` |
| コードを整理したい | `/simplify` |
| 動くところを見たい | `/verify` `/run`（準備: `/run-skill-generator`） |
| 大量の機械的変更 | `/batch` |
| 繰り返し・定期実行 | `/loop`（ローカル） `/schedule`（クラウド） |
| 多エージェントで調査 | `/deep-research`、進捗は `/workflows` |
| 権限プロンプトが多い | `/permissions` `/fewer-permission-prompts` `/auto-mode-setup` |
| 必ず実行させたい処理 | `/hooks` |
