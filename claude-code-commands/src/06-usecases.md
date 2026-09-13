---
marp: true
theme: claude
paginate: true
header: "Claude Code コマンド一覧 ─ 06 ユースケースと使い分け"
footer: "出典: code.claude.com/docs（best-practices / costs / advisor / workflows / agents ほか）2026-09 時点"
---

<!-- _class: title -->
<!-- _paginate: false -->

# 06 ─ ユースケースと使い分け

## 「どのコマンドを、いつ使うか」

公式ドキュメント（Best practices / Costs / Advisor / Workflows / Agents / Permission modes / Scheduled tasks）と、
信頼性の高い外部記事（Anthropic ブログ、Thoughtworks Radar、Simon Willison、国内の技術ブログ）から要点を抽出しました。
各スライド末尾に出典を記載しています。

---

## 大原則: コンテキストウィンドウが最重要リソース

<div class="verdict"><strong>公式:</strong> 「ほとんどのベストプラクティスは 1 つの制約に基づく。Claude のコンテキストウィンドウはすぐ埋まり、埋まるほど性能が落ちる」</div>

- `/context` で使用率を見る習慣。ステータスラインに常時表示するのが公式推奨（`/statusline`）。
- 無関係なタスクの前に `/clear`。同じ会話を続けたいときだけ `/compact`。
- 調査・ログ読み・大量検索は **サブエージェントに委譲** して主会話を汚さない。
- 国内記事の目安: 50% 以下は余裕、50〜80% で整理を検討、80% 超は劣化リスク（著者の経験則）。

<p class="src">出典: code.claude.com/docs/en/best-practices ／ zenn.dev/sora_biz/articles/claude-code-context-management</p>

---

## ユースケース 1: 基本ワークフロー Explore → Plan → Code → Commit

| フェーズ | 使うもの | ポイント |
| --- | --- | --- |
| Explore | `Shift+Tab` で Plan / `claude --permission-mode plan` | 編集させずに関連ファイルを読ませる |
| Plan | `/plan` → 計画を `Ctrl+G` でエディタ編集 | 計画が承認できるまで実装させない |
| Code | 承認後に実装 + テスト | 「テストを書いてから実装」と指示 |
| Commit | 「説明的なメッセージでコミットして PR を開いて」 | `/diff` で確認、`/code-review` で仕上げ |

<div class="verdict"><strong>使い分け:</strong> 「差分を一文で説明できるならプランは省略」（公式）。タイポ修正・ログ追加・リネームは直接依頼。複数ファイルにまたがる変更、方針に迷う変更、知らないコードは Plan から。</div>

<p class="src">出典: code.claude.com/docs/en/best-practices ／ zenn.dev/tmasuyama1114/articles/claude_code_best_practice_guide</p>

---

<!-- _class: dense -->

## ユースケース 2: 「検証できないものは出荷しない」

<div class="verdict"><strong>公式:</strong> 「Claude が実行できるチェックを与える: テスト、ビルド、比較用スクリーンショット。見張るセッションと離席できるセッションの違いはそこにある」</div>

ゲートの強さは 4 段階。強いほどコストと拘束が増える。

1. **同一プロンプト内**: 「実装後にテストを回して通るまで直して」
2. **`/goal`**: 「全テスト通過かつ lint ゼロ」をゴールにしてターンをまたいで再評価
3. **Stop フック**: 条件を満たすまで終了をブロック（決定論的、8 回連続で解除）
4. **検証サブエージェント / ワークフロー**: 別コンテキストのモデルに反証させる

- 「成功したと言わせるのではなく証拠を出させる」。
- **Writer / Reviewer パターン**: セッション A が実装、別セッション B が `@src/...` をレビュー。新しいコンテキストは自分の書いたコードに甘くならない。

<p class="src">出典: code.claude.com/docs/en/best-practices</p>

---

<!-- _class: dense -->

## ユースケース 3: CLAUDE.md の育て方

- `/init` で雛形 → 使いながら磨く。**200 行以下** が目安（超えると遵守率が下がる）。
- 各行に「これを消したら Claude は間違えるか？」と問う。答えが No なら削る。肥大化した CLAUDE.md は指示を無視される原因。
- 書く: 推測できないビルド/テストコマンド、標準と違うスタイル、リポジトリ作法、環境の癖。
- 書かない: コードから分かること、言語の標準慣習、詳細 API、頻繁に変わる情報。
- 追加のタイミング: 同じ間違いを 2 回した / 前回と同じ訂正を打った。
- `/doctor` が「コードから導ける内容」の削除とスキルへの移行を提案してくれる。
- 国内事例: 「書くべきことより、書かなくていいことを削る方が重要」。`.claude/rules/` の `paths:` で TS 編集時だけ規約を読ませる。

<p class="src">出典: code.claude.com/docs/en/memory ／ best-practices ／ tech.enechange.co.jp/entry/2026/03/24/102016</p>

---

<!-- _class: dense -->

## ユースケース 4: 無人実行・CI（`claude -p`）

```bash
# CI / pre-commit / スクリプト
git diff main | claude -p --bare "typo リンターとして差分を検査し JSON で報告" --output-format json

# 大量ファイルへのファンアウト
for f in $(cat files.txt); do
  claude -p --bare "$f を移行して" --allowedTools "Edit,Bash(git commit *)" --max-turns 5
done
```

- **`--bare` が公式推奨**（将来 `-p` の既定に）。hooks / skills / MCP / CLAUDE.md / auto memory を読まず高速・再現的。`ANTHROPIC_API_KEY` 必須。
- 無人なら `--permission-prompts none` + `--max-turns` + `--max-budget-usd`（サブエージェント分も上限に含む）。
- `-p` は信頼ダイアログをスキップしてプロジェクトの hooks / `.mcp.json` を実行する。**未知のリポジトリでは必ず `--bare`**。

<p class="src">出典: code.claude.com/docs/en/headless ／ cli-reference ／ best-practices</p>

---

## ユースケース 5: git worktree で並列セッション

```bash
claude -w feature-auth            # .claude/worktrees/feature-auth に隔離
claude -w '#123'                  # PR/Issue 番号からブランチを切って worktree
claude -w feature-auth --tmux     # tmux / iTerm2 ペインで開く
```

- ブランチ `worktree-<name>` を作成。終了時にクリーンなら自動削除、変更があれば keep / remove を確認。
- `.worktreeinclude` に `.env` などを列挙すると gitignore 済みファイルもコピーされる。`.gitignore` に `.claude/worktrees/` を追加推奨。
- サブエージェントにも `isolation: worktree` で個別 worktree を持たせられる。
- 同時に複数のセッションやサブエージェントを回すと **トークン消費は掛け算**。

<p class="src">出典: code.claude.com/docs/en/worktrees ／ agents</p>

---

<!-- _class: dense -->

## 使い分け 1: `/advisor` を使うべきか

<div class="verdict"><strong>結論:</strong> 「大半のターンは定型だが、計画の質が結果を決める長いマルチステップ作業」なら ON。短いタスクや「毎ターン最強モデルが要る」作業は OFF にして <code>/model</code> で主モデルを上げる。</div>

- 仕組み: 実行モデルが「方針決定前」「同じエラーで詰まった時」「完了宣言前」に、より強いモデルへ **会話全体** を渡して助言を得るサーバー側ツール（実験的、Anthropic API 限定）。
- コスト: 助言のたびにアドバイザー単価で全会話を読む（キャッシュ不可）。それでも「速い主モデル + 強いアドバイザー」は「最初から強いモデル」より **通常は安い**。ON/OFF で主モデルのキャッシュは壊れない。
- 定番ペア: Sonnet + Opus advisor。最安: Haiku + Opus advisor。高リスク作業: Opus + Opus（独立チェック）。
- 公表ベンチ: Sonnet + Opus advisor は SWE-bench Multilingual で +2.7pt、コスト −11.9%。

| 手段 | 強いモデルが効く範囲 |
| --- | --- |
| `/advisor` | 作業中の判断ポイントだけ |
| `opusplan` | プランモード中だけ Opus |
| サブエージェントの `model:` | 委譲したタスク全体 |
| `/model opus` | 以降ずっと |

<p class="src">出典: code.claude.com/docs/en/advisor ／ claude.com/blog/the-advisor-strategy</p>

---

<!-- _class: dense -->

## 使い分け 2: ダイナミックワークフローを使うべきか

<div class="verdict"><strong>結論:</strong> 「1 つの会話で調整できる数を超えるエージェントが要る」か「オーケストレーションをスクリプトとして読める・再実行できる形にしたい」時だけ。数個の委譲で済むならサブエージェント。</div>

- 仕組み: Claude が JavaScript スクリプトを書き、ランタイムがバックグラウンドで多数のサブエージェントを決定論的に実行。進捗は `/workflows`。
- 向く例: コードベース全体の監査、500 ファイル移行、相互検証付きリサーチ（`/deep-research`）、複数角度からのプラン作成。
- 起動: プロンプトに `ultracode`、「ワークフローで」と依頼、または `/effort ultracode`（**全ての実質的タスクがワークフロー化** し、トークンと時間が増える。常用せず、戻すときは `/effort high`）。
- **Dynamic workflow size**（`/config workflowSizeGuideline=...`）: `small`(<5) / `medium`(<15, 既定) / `large`(<50) / `unrestricted`。「上限ではなく助言」。
- コスト: 1 回で大幅にトークンを使う。まず小さなスライスで試す。25 エージェント超 or 推定 150 万トークン超で `Large workflow` 警告。同時実行 16、1 run 1,000 エージェントが上限。
- 無効化: `/config` の Dynamic workflows、`disableWorkflows: true`、`CLAUDE_CODE_DISABLE_WORKFLOWS=1`。

<p class="src">出典: code.claude.com/docs/en/workflows ／ features-overview</p>

---

<!-- _class: dense -->

## 使い分け 3: 並列化の階段

| 手段 | 誰が調整するか | 使いどころ |
| --- | --- | --- |
| サブエージェント（Claude が委譲） | Claude、ターンごと | 検索結果・ログ・ファイル内容で主会話が溢れる副タスク |
| `/subtask` | Claude（会話を継承） | 文脈を全部知った上で裏で 1 つやらせ、結果を戻す |
| `/batch` | Claude（worktree + サブエージェントのパッケージ） | 5〜30 に分割できる機械的な大規模変更 → 各自 PR |
| `/background` / `claude --bg` | 自分が手を離し後で確認 | 見張らなくてよい独立タスク。`claude agents` で監視 |
| `claude --worktree` | 自分 | 手動で並列作業、ファイル衝突回避 |
| ダイナミックワークフロー | スクリプト | 数十〜数百エージェント、再実行可能な手順 |

- 判断軸は「**誰が仕事を調整するか**」。
- サブエージェント上限: 同時 20、ネスト 3 層。Simon Willison: 「サブエージェントの主な価値はルートのコンテキストを守ること。十数種の専門家に分割しすぎない」。
- 国内事例: 単発リファクタ・定型編集・調査だけなら単一エージェントで十分。本番機能追加で 3 エージェント程度。反復上限（3 回）を設ける。
- エージェントチームは plan モード時に **約 7 倍** のトークン。Thoughtworks Radar は「小さく意図的なチーム」と「大群」を区別し Assess 扱い。

<p class="src">出典: code.claude.com/docs/en/agents ／ sub-agents ／ costs ／ simonwillison.net/guides/agentic-engineering-patterns/subagents/ ／ qiita.com/nogataka/items/efe8eb9df612d2211221 ／ thoughtworks.com/radar/techniques/team-of-coding-agents</p>

---

<!-- _class: dense -->

## 使い分け 4: 会話の整理・分岐（`/compact` `/clear` `/resume` `/rewind` `/branch` `/fork`）

| コマンド | 何が起きる | 使う場面 |
| --- | --- | --- |
| `/clear` | 空コンテキストで新会話（前の会話は `/resume` 可） | 無関係タスクへ切替、**2 回直しても直らない時** |
| `/compact [指示]` | 履歴を要約に置換 | 同一タスク継続中で文脈を残したい時 |
| `/resume` | 別の保存済み会話へ切替 | 数日にまたがる作業（`/rename` で名前付け運用） |
| `/rewind`（`Esc Esc`） | チェックポイントへ会話 / コード / 両方を戻す、部分要約 | 失敗した試行の取消、危険な試行の前 |
| `/branch` | コピーに **自分が乗り換える** | 別アプローチを試す |
| `/fork` | コピーを **バックグラウンドで走らせ** 自分は残る | 並行で別作業 |

- `/compact` は会話全体を読む大きなリクエスト。「続きが要らないなら `/clear` はタダ」。
- 圧縮後も CLAUDE.md は再読込されるが、会話中だけで与えた指示は消える。CLAUDE.md に「圧縮時は変更ファイル一覧とテストコマンドを必ず残す」と書ける。
- チェックポイントは **Claude の編集ツール経由の変更のみ** 追跡。Bash での変更は対象外、git の代替ではない。

<p class="src">出典: code.claude.com/docs/en/best-practices ／ sessions ／ costs ／ checkpointing</p>

---

<!-- _class: dense -->

## 使い分け 5: レビュー系 4 コマンド（`/code-review` `/security-review` `ultra` `/simplify`）

| | 目的 | 場所 | コスト |
| --- | --- | --- | --- |
| `/code-review [low..max]` | 正確性バグ + 整理。差分 / PR / ブランチ / パス | ローカル（新しいサブエージェント） | 通常 |
| `/security-review` | インジェクション・認証・情報漏洩など脆弱性 | ローカル | 通常 |
| `/code-review ultra`（`/ultrareview`） | クラウドの多数レビュワーが全指摘を独立再現・検証 | クラウド（claude.ai ログイン、ZDR 組織不可） | Pro/Max 3 回無料、以後おおむね $5〜25、5〜10 分 |
| `/simplify` | 再利用・単純化・効率・抽象度を 4 エージェントで修正適用。**バグは探さない** | ローカル | 通常 |

<div class="verdict"><strong>公式:</strong> 「作業中の素早いフィードバックには <code>/code-review</code>、大きな変更をマージする前に <code>/code-review ultra</code>」。CI からは <code>claude ultrareview --json --post</code>。</div>

- レビュワーは「隙を探せ」と言われると健全なコードにも指摘を出す。**正確性か要件に影響する指摘だけ** 追う。全部追うと過剰設計になる。

<p class="src">出典: code.claude.com/docs/en/commands ／ ultrareview ／ best-practices</p>

---

<!-- _class: dense -->

## 使い分け 6: `/model` vs `/effort` vs `/fast` vs `--fallback-model`

| 手段 | 変わるもの | 使う場面 |
| --- | --- | --- |
| `/model` | モデル自体（`sonnet` 日常 / `opus` 複雑推論 / `haiku` 軽作業 / `opusplan` 計画だけ Opus） | 「Sonnet で大半をこなし、複雑な設計判断だけ Opus」が公式のコスト方針 |
| `/effort` | 推論量（`low` = 短く遅延重視、`high` = 既定、`max` = 考えすぎがち） | 単発で深く考えさせたいだけなら `ultrathink` をプロンプトに |
| `/fast` | 同じモデル・同じ品質で **最大 2.5 倍速、トークン単価は高い** | 高速反復・ライブデバッグ。長い自律タスク・バッチ・CI・コスト重視は標準モード |
| `--fallback-model sonnet,haiku` | 主モデルが過負荷・停止時に自動切替（最大 3 つ、そのターンのみ） | 認証・課金・レート制限では発動しない |

- fast と effort の違い: fast は「同品質・低遅延・高コスト」、effort 低下は「思考時間減・高速・品質低下の可能性」。
- **fast は会話の途中で ON にしない**: 全コンテキストが fast 単価で再課金される。使うならセッション開始時から。

<p class="src">出典: code.claude.com/docs/en/model-config ／ fast-mode ／ costs</p>

---

<!-- _class: dense -->

## 使い分け 7: 権限モードと起動モード

| モード / フラグ | 何が自動化されるか | 想定 |
| --- | --- | --- |
| `default`（Manual） | 読み取りのみ | 初期状態 |
| `acceptEdits` | 編集と mkdir / mv など | 信頼できる作業 |
| `plan` | 読み取りのみ | 調査・計画 |
| `auto` | 全部。バックグラウンドの安全分類器が危険操作を止める | Pro/Max/Team の既定 |
| `dontAsk` | 確認が要るものは自動拒否 | ロックダウンした CI |
| `bypassPermissions` = `--dangerously-skip-permissions` | 全部。deny ルールだけ有効 | **隔離コンテナ / VM のみ、非 root** |

- `/permissions` でルール管理、`/fewer-permission-prompts` で読み取り系を一括許可、`/sandbox` で隔離実行。
- `--restricted`: 共有マシンで評価ハーネスが動かす用途。コマンド実行ツールと WebFetch を除去、設定は managed のみ。
- `--safe-mode`: **設定が壊れた時の切り分け**（カスタマイズ全無効、認証・モデル・組み込みツールは通常）。
- `--bare`: **スクリプト・CI の高速再現実行**（自動検出をすべてスキップ）。

<p class="src">出典: code.claude.com/docs/en/permission-modes ／ cli-reference ／ best-practices</p>

---

<!-- _class: dense -->

## 使い分け 8: 機能を足すとき（CLAUDE.md / Skill / Hook / MCP / Plugin）

| こうなったら | こうする |
| --- | --- |
| 同じ間違いを 2 回した | CLAUDE.md に 1 行 |
| 同じプロンプトを繰り返し打っている | Skill（`.claude/skills/<name>/SKILL.md`） |
| ブラウザからコピペしている | MCP サーバー（ただし `gh` `aws` などの **CLI があればそちらが文脈効率で優位**） |
| 出力が会話を汚す | Subagent |
| 毎回必ず起こしたい | **Hook**（CLAUDE.md は「お願い」、Hook は「保証」） |
| 別リポジトリでも同じ設定 | Plugin（`.claude/` で試作 → 配布時に Plugin 化） |

- `.claude/commands/deploy.md` と `.claude/skills/deploy/SKILL.md` は **同じ `/deploy` を作る（統合済み）**。新規はスキル推奨（補助ファイルを持てる）。
- 副作用のあるスキル（deploy 等）は `disable-model-invocation: true` で手動のみに。
- ガードレール例: 「`.env` を編集するな」は CLAUDE.md では請願、`PreToolUse` フックでブロックすれば強制。フックのコンテキストコストは出力を返さない限りゼロ。
- 未使用の MCP は `/mcp` で無効化、`/context all` でツール別トークンを確認。

<p class="src">出典: code.claude.com/docs/en/features-overview ／ skills ／ hooks-guide ／ plugins ／ costs</p>

---

<!-- _class: dense -->

## 使い分け 9: 定期実行（`/loop` / `/schedule` / Desktop / GitHub Actions）

| | `/loop` | `/schedule` Routines | Desktop scheduled task | GitHub Actions |
| --- | --- | --- | --- | --- |
| 実行場所 | 今の CLI セッション | クラウド（Anthropic 管理） | 自分の PC | CI |
| PC / セッション | 両方必要 | 不要 | PC 必要 | 不要 |
| 最小間隔 | 1 分 | 1 時間 | 1 分 | ─ |
| ローカルファイル | 可 | 不可（fresh clone） | 可 | ─ |
| 寿命 | 7 日で失効 | 永続 | 永続 | 永続 |

<div class="verdict"><strong>公式:</strong> 「マシンなしで確実に動かすならクラウド、ローカルファイルとツールが要るなら Desktop、セッション中の手早いポーリングなら <code>/loop</code>」</div>

- `/loop` の落とし穴: セッションを閉じると止まる、取りこぼしの追い付き実行なし、毎回フルコンテキストを送るので待機中も消費。
- Routines は **権限プロンプトが一切ない**。コネクタ・リポジトリ・ネットワークを最小化。ローカルの `claude mcp add` は使えない。

<p class="src">出典: code.claude.com/docs/en/scheduled-tasks ／ routines ／ common-workflows</p>

---

<!-- _class: dense -->

## 使い分け 10: 状態を見る ─ `/btw` `/context` `/usage` `/insights`

| コマンド | 見えるもの | 使いどころ |
| --- | --- | --- |
| `/btw` | 会話が既に知っていることへの答え（ツール無し・履歴に残らない） | 「このセッションで何を変えた？」級の脇質問。**調べ物はサブエージェント** |
| `/context [all]` | 使用率グリッド、重いツール、メモリ肥大、CLAUDE.md の読込有無、MCP ツール別トークン | 圧縮 / クリアの判断 |
| `/usage`（`/cost` `/stats`） | セッションコスト、プラン上限、skills / subagents / plugins / MCP 別の帰属、`/loop` 別消費、cache miss 警告 | 何が高いかの特定 |
| `/insights` | 直近セッションの HTML レポート（摩擦点、提案） | 振り返り |

- 長時間セッションの隠れコスト: 一日中開いたセッションの一行質問でも **会話全体分** を消費。休憩後のキャッシュ失効（サブスク 1 時間、API 5 分）で全文再処理。
- 想定外の高額の典型: 「クリアされない長いセッション」と「Opus をデフォルトのまま」。

<p class="src">出典: code.claude.com/docs/en/commands ／ interactive-mode ／ costs</p>

---

<!-- _class: dense -->

## よくある失敗パターン（公式 5 つ + α）

1. **ごった煮セッション** ─ 無関係タスクを混ぜる → `/clear`。
2. **何度も訂正し続ける** ─ 2 回直して駄目なら `/clear` して最初のプロンプトを良くする。
3. **過剰仕様の CLAUDE.md** ─ 長いと半分無視される → 容赦なく削る、または Hook に変換。
4. **信じて検証しない** ─ 「検証できないなら出荷しない」。
5. **無限の探索** ─ 「調べて」を無限定に頼まない。スコープを切るかサブエージェントへ。

- **権限の出し過ぎ**: bypass は隔離環境のみ。`-p` は未知リポジトリで `--bare`。
- **サブエージェント / チーム / ワークフローの使い過ぎ**: トークンは掛け算。小さく試す。
- **レビュワーの指摘を全部追う**: 過剰設計。正確性・要件に関わるものだけ。
- **AI 生成コードへの安住**: Thoughtworks Radar は Claude Code を Adopt としつつ、「保守性低下」を警告。フィードバックセンサーとアーキテクチャ適合関数を推奨。
- **チェックポイントを git 代わりにする**: Bash 経由の変更は戻らない。

<p class="src">出典: code.claude.com/docs/en/best-practices ／ costs ／ headless ／ thoughtworks.com/radar/tools/claude-code</p>

---

## まとめ: 一言ルール

- **コンテキストは最重要資源** → `/clear` を惜しまず、`/context` を見て、調査はサブエージェントへ。
- **検証できないものは出荷しない** → テスト / ビルド / スクショ、Stop フック、`/code-review`、マージ前は `ultra`。
- **守らせたいルールは Hook、知っておいてほしいことは CLAUDE.md、時々必要な知識は Skill、外部接続は MCP、配布は Plugin**。
- **強いモデルは点で使う** → `/advisor`、`opusplan`、サブエージェントの `model:`。常時 Opus は最後の手段。
- **並列は手段** → サブエージェント → `/batch` / `--bg` → ワークフローの順に、コストを見ながら段階的に。
- **無人実行は `--bare -p` + 権限最小化 + コンテナ内でのみ bypass**。

> 迷ったら `/help`、調子が悪ければ `/doctor`、高いと思ったら `/usage`。
