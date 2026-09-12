---
marp: true
theme: claude
paginate: true
header: "Claude Code コマンド一覧 ─ 02 セッション・コンテキスト・モデル"
footer: "対象: Claude Code v2.1.269 / 公式ドキュメント (code.claude.com/docs) 2026-09 時点"
---

<!-- _class: title -->
<!-- _paginate: false -->

# 02 ─ セッション・コンテキスト・モデル

## 1 コマンド 1 スライドで解説

- **A. セッション管理** ─ 15 コマンド
- **B. コンテキスト・メモリ・計画** ─ 8 コマンド
- **C. モデル・性能** ─ 4 コマンド

---

<!-- _class: divider -->

# A. セッション管理

会話を始める・分ける・戻す・保存する

---

<!-- _class: cmd -->

# /clear [name]
<span class="genre">A. セッション管理</span>

<p class="oneliner">会話を空のコンテキストで新規開始する。CLAUDE.md などのプロジェクトメモリは保持される。</p>

- 名前を渡すと **直前の会話に名前を付けて** `/resume` の一覧に残せる。
- 同じ会話を続けたままコンテキストだけ空けたいなら `/compact`。
- 直前の会話は `/resume` で戻れる。同じプロセス内なら `/rewind` メニューの「previous session」からも復元可。
- 別名: `/new` `/reset`

```text
/clear                    # 新しいタスクを始める
/clear auth-refactor      # 直前の会話に "auth-refactor" と名付けてから新規開始
```

<p class="rel">関連: /compact（同じ会話を圧縮） /resume（戻る） /rewind</p>

---

<!-- _class: cmd -->

# /resume [session]
<span class="genre">A. セッション管理</span>

<p class="oneliner">過去の会話を ID か名前で再開する。引数なしならセッション一覧（ピッカー）が開く。</p>

- バックグラウンドセッションは一覧に `bg` マークで表示。**実行中のものはここから再開できない** ので `claude agents` でアタッチするか停止してから。
- CLI からは `claude -r <id|name>` / `claude -c`（直近）と同等。
- 別名: `/continue`

```text
/resume                  # ピッカーを開く
/resume auth-refactor    # 名前で再開
```

<p class="rel">関連: /clear /branch /rename（名前を付けておくと探しやすい） claude --resume</p>

---

<!-- _class: cmd -->

# /branch [name]
<span class="genre">A. セッション管理</span>

<p class="oneliner">現在の会話をこの時点で分岐し、元の会話を残したまま別の方向を試す。</p>

- 分岐先に **自分が切り替わる**。元の会話には `/resume` で戻れる。
- 「コピーをバックグラウンドで走らせたい」なら `/fork`。
- 「副タスクをサブエージェントに任せて結果をこの会話に戻したい」なら `/subtask`。

```text
/branch try-redux        # Redux 版を試す分岐を作る
```

<p class="rel">関連: /fork /subtask /resume /rewind</p>

---

<!-- _class: cmd -->

# /fork [prompt]
<span class="genre">A. セッション管理</span>

<p class="oneliner">現在の会話をコピーして新しいバックグラウンドセッションとして走らせ、自分は元の会話で作業を続ける。</p>

- プロンプトを渡すとコピーがすぐ作業開始。渡さなければ agent view で最初の指示を待つ。
- コピーはコード変更前に **自前の worktree を作る** よう指示される（v2.1.221+）。
- v2.1.161〜2.1.211 や agent view 無効時は forked subagent（`/subtask` 相当）として動く。

```text
/fork write the migration tests     # テスト作成を別セッションに任せる
```

<p class="rel">関連: /subtask（結果がこの会話に戻る） /branch（自分が切り替わる） claude agents</p>

---

<!-- _class: cmd -->

# /subtask &lt;task&gt;
<span class="genre">A. セッション管理</span>

<p class="oneliner">会話全体を継承した forked subagent を裏で起動し、結果を完了時にこの会話へ戻す。</p>

- 自分は作業を続けられる。サブエージェントは会話の文脈をすべて知っている。
- 「別セッションとして独立させたい」なら `/fork`。
- agent view が無効な環境では使えない（その場合 `/fork` が forked subagent になる）。v2.1.212+。

```text
/subtask run the full test suite and summarize failures
```

<p class="rel">関連: /fork /branch /tasks（進捗確認）</p>

---

<!-- _class: cmd -->

# /background [prompt]
<span class="genre">A. セッション管理</span>

<p class="oneliner">現在のセッションをバックグラウンドエージェントとして切り離し、ターミナルを解放する。</p>

- プロンプトを渡すと、デタッチ前にもう 1 つ指示を送れる。
- 監視は `claude agents`、再アタッチは `claude attach <id>`、ログは `claude logs <id>`。
- 「コピーを裏で走らせて自分はここに残る」なら `/fork`。
- 別名: `/bg`

```text
/background keep going until all tests pass, then open a PR
```

<p class="rel">関連: /fork /stop /exit claude --bg / attach / logs</p>

---

<!-- _class: cmd -->

# /stop
<span class="genre">A. セッション管理</span>

<p class="oneliner">アタッチ中のバックグラウンドセッションを停止する。会話ログと worktree は保持される。</p>

- バックグラウンドセッションにアタッチしている時だけ使える。
- 停止せずにデタッチだけしたいなら `/exit` か `←` キー。
- シェルからは `claude stop <id>`（`claude kill` も可）。停止後は `claude --resume` で再開できる。

```text
/stop
```

<p class="rel">関連: /exit /background claude stop / respawn / rm</p>

---

<!-- _class: cmd -->

# /exit
<span class="genre">A. セッション管理</span>

<p class="oneliner">CLI を終了する。バックグラウンドセッションにアタッチ中はデタッチのみで、セッションは動き続ける。</p>

- `Ctrl+D` を 2 回でも終了。
- 別名: `/quit`

```text
/exit
```

<p class="rel">関連: /stop /background</p>

---

<!-- _class: cmd -->

# /rename [name]
<span class="genre">A. セッション管理</span>

<p class="oneliner">現在のセッションに名前を付け、プロンプトバーに表示する。無引数なら会話履歴から自動生成。</p>

- 名前は `/resume` のピッカーや `claude -r <name>` で使える。
- 起動時に付けるなら `claude -n "name"`。
- 200 文字上限。制御文字・不可視文字は空白に置換される。同名の稼働セッションがあると変種名が付く。
- 非対話モード（`-p`）でも利用可。

```text
/rename payment-webhook
```

<p class="rel">関連: /resume /clear [name] claude --name</p>

---

<!-- _class: cmd -->

# /recap
<span class="genre">A. セッション管理</span>

<p class="oneliner">現在のセッションの一行要約をその場で生成する。</p>

- 離席後に戻った時に自動表示される「セッション要約」を、任意のタイミングで出せる。
- 長い作業の途中で「今どこまでやったか」を確認するのに便利。

```text
/recap
```

<p class="rel">関連: /context /export /rename</p>

---

<!-- _class: cmd -->

# /rewind
<span class="genre">A. セッション管理</span>

<p class="oneliner">会話とコードを過去のチェックポイントへ巻き戻す。選んだメッセージ以降を要約することも可能。</p>

- `Esc` を 2 回押すとこのメニューが開く。
- 「会話だけ戻す」「コードだけ戻す」「両方戻す」を選べる（チェックポイント機能）。
- 直前に `/clear` した会話も、同一プロセス内なら previous-session エントリから復元できる。
- 別名: `/checkpoint` `/undo`

```text
/rewind
```

<p class="rel">関連: /compact /clear git stash（ファイル以外の外部状態は戻らない）</p>

---

<!-- _class: cmd -->

# /export [filename]
<span class="genre">A. セッション管理</span>

<p class="oneliner">会話をプレーンテキストで書き出す。ファイル名を渡せば直接保存、なければクリップボード/保存を選ぶダイアログ。</p>

- 議事録やレビュー記録、他の人への共有に。
- 応答 1 件だけ欲しいなら `/copy`。

```text
/export session-notes.txt
```

<p class="rel">関連: /copy /bug（会話を添えて報告）</p>

---

<!-- _class: cmd -->

# /copy [N]
<span class="genre">A. セッション管理</span>

<p class="oneliner">直近の応答をクリップボードへコピーする。N を渡すと N 番目に新しい応答。</p>

- コードブロックが含まれる場合は **ブロック単位で選べるピッカー** が開く。
- ピッカーで `w` を押すとクリップボードの代わりにファイルへ書き出す（SSH 越しで便利）。
- iTerm2 では `/terminal-setup` でクリップボードアクセスを有効化しておく。

```text
/copy      # 直近の応答
/copy 2    # 2 つ前の応答
```

<p class="rel">関連: /export /terminal-setup</p>

---

<!-- _class: cmd -->

# /cd &lt;path&gt;
<span class="genre">A. セッション管理</span>

<p class="oneliner">会話を保ったままセッションの作業ディレクトリを移動する。</p>

- 部分パスを打つと候補が出て `Tab` で確定（v2.1.206+）。
- 移動先の CLAUDE.md などがその時点から適用される。
- 「元の場所に加えて別ディレクトリも触りたい」なら `/add-dir`。

```text
/cd ../backend
```

<p class="rel">関連: /add-dir claude --add-dir</p>

---

<!-- _class: cmd -->

# /add-dir &lt;path&gt;
<span class="genre">A. セッション管理</span>

<p class="oneliner">現在のセッションに追加の作業ディレクトリを許可する（読み書き対象を広げる）。</p>

- 追加ディレクトリの `.claude/` 設定はほとんど読み込まれない。
- ネットワークパス（`\\server\share` など）は不可。追加後に `DirectoryAdded` フックが走る。
- 応答中に実行するとその場で確認され、同じターンの次のツール呼び出しからアクセス可能。
- 永続化したいなら設定の `permissions.additionalDirectories`。

```text
/add-dir ../shared-lib
```

<p class="rel">関連: /cd claude --add-dir /permissions</p>

---

<!-- _class: divider -->

# B. コンテキスト・メモリ・計画

限られたコンテキストを賢く使う

---

<!-- _class: cmd -->

# /compact [instructions]
<span class="genre">B. コンテキスト・メモリ・計画</span>

<p class="oneliner">これまでの会話を要約してコンテキストを空ける。要約の焦点を指示で指定できる。</p>

- 会話は続くが、細部は要約に置き換わる。ルール・スキル・メモリファイルは要約後も再読込される。
- 自動圧縮のしきい値は `/autocompact` で調整。
- 「そもそも別タスクを始める」なら `/clear` の方が安くて確実。

```text
/compact
/compact focus on the API design decisions and open TODOs
```

<p class="rel">関連: /clear /context /autocompact /rewind（メッセージ選択から要約）</p>

---

<!-- _class: cmd -->

# /autocompact [auto|&lt;tokens&gt;]
<span class="genre">B. コンテキスト・メモリ・計画</span>

<p class="oneliner">自動圧縮が発動するコンテキスト量（ウィンドウ）を設定する。ユーザー設定に保存され現在のセッションにも適用。</p>

- `500k` のようなサイズか、`auto` でモデルに合わせた既定値へ戻す。
- 無引数ならダイアログで現在値を確認。
- 起動時だけ変えるなら `claude --autocompact 500k`（設定は変更しない）。v2.1.221+。

```text
/autocompact 500k
/autocompact auto
```

<p class="rel">関連: /compact /context claude --autocompact</p>

---

<!-- _class: cmd -->

# /context [all]
<span class="genre">B. コンテキスト・メモリ・計画</span>

<p class="oneliner">現在のコンテキスト使用量を色付きグリッドで可視化し、肥大化しているツール出力やメモリを指摘する。</p>

- コンテキスト超過時は「どれだけ超えているか」「どのコマンドで空くか」を警告。
- フルスクリーンモードでは項目別内訳が折りたたまれる。`all` で展開。
- スキルの重さは `/skill-doctor`、MCP・プラグインの重さは `/doctor` でも確認できる。

```text
/context
/context all
```

<p class="rel">関連: /compact /skill-doctor /doctor /usage</p>

---

<!-- _class: cmd -->

# /btw [question]
<span class="genre">B. コンテキスト・メモリ・計画</span>

<p class="oneliner">会話履歴に残さずに、現在のセッションについて横道の質問をする。</p>

- 本筋のコンテキストを汚さない。「これ何のライブラリ？」程度の質問向き。
- 無引数なら直近の side question を表示し、過去の回答を辿れる（v2.1.212+）。

```text
/btw what does the retry logic in this file do?
```

<p class="rel">関連: /compact /context</p>

---

<!-- _class: cmd -->

# /memory
<span class="genre">B. コンテキスト・メモリ・計画</span>

<p class="oneliner">CLAUDE.md ファイル群を編集し、自動メモリの有効/無効の切替と内容の閲覧を行う。</p>

- メモリの階層: `~/.claude/CLAUDE.md`（個人・全プロジェクト）→ `./CLAUDE.md`（チーム共有）→ `CLAUDE.local.md`（個人・非コミット）→ `.claude/rules/`（トピック別）。
- 自動メモリは `~/.claude/projects/<project>/memory/` に Claude 自身が学びを蓄える。
- 「これを覚えて」と頼むと **自動メモリ** に、「CLAUDE.md に追加して」と頼むと CLAUDE.md に書かれる。

```text
/memory
```

<p class="rel">関連: /init /doctor（CLAUDE.md のトリム） /context（Memory files 欄で読込確認）</p>

---

<!-- _class: cmd -->

# /init
<span class="genre">B. コンテキスト・メモリ・計画</span>

<p class="oneliner">プロジェクトを解析して CLAUDE.md の雛形を生成する。リポジトリで最初にやること。</p>

- `CLAUDE_CODE_NEW_INIT=1` を設定すると、スキル・フック・個人メモリまで対話的に案内するフローになる。
- OpenAI Codex / Gemini CLI の設定を見つけると `/import` での取り込みを提案。
- 生成後は `/memory` で「ビルドコマンド」「規約」「やってはいけないこと」を磨く。

```text
/init
```

<p class="rel">関連: /memory /import /doctor</p>

---

<!-- _class: cmd -->

# /plan [description]
<span class="genre">B. コンテキスト・メモリ・計画</span>

<p class="oneliner">プランモードに入る。説明を渡すとその課題の計画立案をすぐ始める。Claude は読み取り専用で調査し、計画を提示する。</p>

- 大きな変更の前に **編集せずに調査→計画→承認** の流れを作る。
- `Shift+Tab` で権限モードを巡回しても Plan に入れる。起動時なら `claude --permission-mode plan`。
- 旧 `/ultraplan` は廃止され、こちらに統合。

```text
/plan fix the auth bug
```

<p class="rel">関連: Shift+Tab /goal /permissions</p>

---

<!-- _class: cmd -->

# /goal [condition|clear]
<span class="genre">B. コンテキスト・メモリ・計画</span>

<p class="oneliner">「条件が満たされるまで」Claude がターンをまたいで働き続けるゴールを設定する。</p>

- 無引数なら現在（または直近達成）のゴールを表示。
- `clear` `stop` `off` `reset` `none` `cancel` のいずれかで解除。
- 終了条件が明確なとき（テスト全通過、lint ゼロ など）に。

```text
/goal all unit tests pass and lint reports zero errors
/goal clear
```

<p class="rel">関連: /plan /loop（定期実行） /verify</p>

---

<!-- _class: divider -->

# C. モデル・性能

どのモデルで、どれだけ考えさせるか

---

<!-- _class: cmd -->

# /model [model]
<span class="genre">C. モデル・性能</span>

<p class="oneliner">使用モデルを切り替え、新しいセッションのデフォルトとして保存する。</p>

- 無引数でピッカー。行で `s` を押すと **このセッションだけ** 切替。左右キーで努力レベルも調整可。
- 応答中に実行しても、確認後すぐ次のリクエストから適用。
- `-p` モードでは引数必須で、そのセッション限りの適用（デフォルト保存なし）。
- エイリアス: `fable` `opus` `sonnet` `haiku`、またはフルの model ID。

```text
/model opus
/model claude-sonnet-5
```

<p class="rel">関連: /effort /fast /advisor claude --model / --fallback-model</p>

---

<!-- _class: cmd -->

# /effort [level|auto|status]
<span class="genre">C. モデル・性能</span>

<p class="oneliner">推論の努力レベルを設定する。low / medium / high / xhigh / max / ultracode / auto。status で現在値を表示。</p>

- `max` と `ultracode` は **セッション限り**。`ultracode` は xhigh + ダイナミックワークフロー有効。
- 応答中に実行すると（キャッシュ警告を確認後）同じターンの次のリクエストから適用。
- 起動時は `claude --effort high`。設定ファイルの `effortLevel` / `modelSettings` を上書き。

```text
/effort high
/effort status
```

<p class="rel">関連: /model /fast /workflows（ultracode）</p>

---

<!-- _class: cmd -->

# /fast [on|off]
<span class="genre">C. モデル・性能</span>

<p class="oneliner">高速モードを切り替える。同じモデルのまま出力速度を上げる（小さいモデルへの格下げではない）。</p>

- 応答中に実行しても即トグル（ただし進行中のターンは元の速度で完了）。
- Opus 系で利用可。`-p` での利用は限定的。v2.1.205+。

```text
/fast on
```

<p class="rel">関連: /model /effort</p>

---

<!-- _class: cmd -->

# /advisor [model|off]
<span class="genre">C. モデル・性能</span>

<p class="oneliner">要所で「第 2 のモデル」に助言を求めるアドバイザーツールを有効/無効にする。</p>

- `fable` `opus` `sonnet` またはフル model ID。`fable` は Fable アクセスが必要。
- 無引数ならピッカー。非対話や Remote Control では引数必須（無引数なら現在値を表示）。v2.1.260+。
- 起動時は `claude --advisor opus`。設定 `advisorModel` を上書き。

```text
/advisor opus
/advisor off
```

<p class="rel">関連: /model /effort /plan</p>

---

## このデッキのまとめ

| やりたいこと | 使うコマンド |
| --- | --- |
| 新しいタスクを始める | `/clear` |
| 会話を続けたまま軽くする | `/compact` → 効かなければ `/clear` |
| 失敗した変更をなかったことに | `/rewind`（`Esc Esc`） |
| 別案を試す / 裏で走らせる / 副タスクを任せる | `/branch` / `/fork` / `/subtask` |
| 大きな変更の前に計画 | `/plan` または `Shift+Tab` で Plan |
| 賢さと速さの調整 | `/model` `/effort` `/fast` `/advisor` |
| 今のコンテキストは重い？ | `/context` |
