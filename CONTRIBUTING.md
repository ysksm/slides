# 運用ルール（CONTRIBUTING）

[Issue #23](https://github.com/ysksm/slides/issues/23) で決めた、このリポジトリの運用ルールです。人間・Claude Code・Codex のいずれで作業する場合も同じルールに従います。

## 背景と問題

- スライドは 1 本ごとに Issue を立て、ブランチ（git worktree）を切って並行に作業している。
- これまでは「スライド作成」と「目次（ルート `README.md` / `index.html`）への登録」を同じ PR で行っていた。
- 目次は全 PR が同じ行の周辺（一覧の先頭）を編集するため、並行作業では **ほぼ必ず競合** し、main を取り込んで解消する作業が毎回発生していた。

## 方針（結論）

**スライド作成の PR では目次を更新しない。目次の更新は「目次更新」専用の Issue・PR で単独に行う。**

| 作業 | 触ってよいファイル | 触ってはいけないファイル |
|---|---|---|
| スライド作成・修正（デッキ Issue） | `<deck>/` 配下のみ（`index.html`, `README.md`, 資料, `examples/` など） | ルートの `README.md`、ルートの `index.html` |
| 目次更新（目次 Issue） | ルートの `README.md`、ルートの `index.html` | `<deck>/` 配下 |
| 運用ルール・ツール類の変更 | `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `.claude/`, `.agents/`, `.github/` | 目次・デッキ（同時に触らない） |

「目次」とは、次の 2 ファイルを指します。

- ルート `README.md` — 「スライド一覧」のカテゴリ別の表と各スライドの節、「リポジトリ構成」のツリー、「閲覧方法」の例外列挙
- ルート `index.html` — GitHub Pages のトップページ。カテゴリごとの `<section class="cat">` に `.deck` カードを置き、`<meta name="description">` に題名を列挙する

### 目次のカテゴリと検索（Issue #44）

- 目次は **カテゴリ別** です。カテゴリの定義（id・表示名・説明・並び順）は `scripts/categories.tsv` にあり、`index.html` のセクションとカードの `data-category`、`README.md` の `### 表示名` 見出しがこれに対応します。カテゴリ内は新しい順です。
- `index.html` の検索・絞り込みはページ内の JavaScript が、カードの本文と `data-tags`（検索用の語）から行います。登録時はカードを該当カテゴリのセクションに置き、`data-tags` を書くだけで、JS の変更は不要です。`?q=語&cat=id` の URL で状態を共有できます。
- `scripts/check-toc.sh` は未登録・枚数・リンク切れに加えて、カードの `data-category` が定義済みか、README の表の行が同じカテゴリの見出しの下にあるかも確認します。
- **カテゴリを増やす・改名する**のは目次の作り方の変更なので、`scripts/categories.tsv`・`README.md`・`index.html`（と必要なら本文書・`CLAUDE.md` / `AGENTS.md`）を同じ PR で更新します。デッキ作業の PR では `scripts/categories.tsv` を編集しません。
- デッキ作成者は、目次更新 Issue へのコメントにカテゴリ候補（id）と検索用タグの候補を添えます（`new-deck` Skill）。

## 作業の流れ

```
デッキ Issue #N ──▶ ブランチ ──▶ <deck>/ を作成・PR ──▶ merge
                                                      │
                                                      ▼
                                        目次 Issue にコメント（またはラベル）
                                                      │
目次 Issue #M ──▶ ブランチ（main 最新）──▶ 目次だけ更新・PR ──▶ merge ──▶ Pages 公開
```

1. **デッキ作成**: `<deck>/index.html` と `<deck>/README.md` を作る。`README.md` の先頭は「H1 = スライド題名」「リード文に Issue リンクと `全 N 枚`」の形にし、目次更新の材料をそろえておく。目次は触らない。
2. **PR**: 変更が `<deck>/` 配下だけであることを確認して PR を出す。CI（`.github/workflows/check-toc-separation.yml`）が、目次とデッキを同時に変更している PR を落とす。
3. **目次更新の依頼**: マージ後、「目次更新」Issue に「`<deck>/` を登録してほしい」とコメントする（未登録デッキが複数あればまとめて 1 回でよい）。
4. **目次更新**: 目次 Issue のブランチを main の最新から切り、未登録デッキをすべて登録する。各デッキはカテゴリ（`scripts/categories.tsv`）を 1 つ選んで、そのカテゴリの表・節・セクションに置く。この PR の差分はルート `README.md` と `index.html` のみ。
5. main へのマージで GitHub Pages が再公開される。

目次更新は「main にあるが目次に載っていないデッキを全部載せる」作業なので、どのタイミングで何回やっても結果は同じになります（冪等）。デッキ側の PR がいくつ並行していても目次では競合しません。

## エージェントへの徹底手段

ルールを文書に書くだけでは守られないため、次の 3 段で担保します。

| 段 | 仕組み | 対象 |
|---|---|---|
| 1. ルール文書 | `CLAUDE.md`（Claude Code）、`AGENTS.md`（Codex） | 各エージェントが毎セッション読む |
| 2. Skill | `.claude/skills/update-toc`, `.claude/skills/new-deck`（Claude Code）、`.agents/skills/update-toc`, `.agents/skills/new-deck`（Codex） | 手順を固定し、目次更新を機械的にする |
| 3. 強制 | Claude Code の PreToolUse フック（`.claude/hooks/guard-toc.sh`）が目次ファイルの編集を拒否。CI が目次とデッキの同時変更 PR を落とす | エージェント・人間の両方 |

フックは、`.toc-update` マーカーファイルがリポジトリルートにあるか、ブランチ名に `toc` を含む場合のみ目次の編集を許可します。`update-toc` Skill は開始時にマーカーを作り、終了時に消します。**デッキ Issue の作業中にマーカーを作ってはいけません。**

Codex は `AGENTS.md` と `.agents/skills/` を使います。`AGENTS.md` と `CLAUDE.md`、および両エージェントの同名 `SKILL.md` は、変更時に両方更新して同じ内容に保ちます。

### Codex での検証

Codex では Claude Code のフックによる編集拒否を前提にせず、ローカルでの差分確認と CI を検証手段にします。共有 Skill のフック・`.toc-update` マーカーの手順は Claude Code 用です。Codex 単独の作業ではマーカーの作成・削除は不要です。

- **すべての作業**: PR 作成前に `git diff --name-only origin/main...HEAD` でコミット済みの変更範囲を確認します。未コミットの変更は `git diff --name-only` と `git diff --cached --name-only`、未追跡ファイルは `git status --short` でも確認します。CI（`.github/workflows/check-toc-separation.yml`）が目次とデッキの同時変更を拒否します。
- **目次更新**: リポジトリルートで `scripts/check-toc.sh` を実行し、未登録・枚数のずれ・リンク切れがないことを確認します。目次のみを変更する PR では CI も同じスクリプトを実行します。
- **デッキ作成・修正**: 変更を `<deck>/` 配下に限定します。新規デッキが目次に未登録なのは想定どおりなので、`scripts/check-toc.sh` の未登録エラーを解消するために目次を編集してはいけません。登録はマージ後の目次更新 Issue で行います。

## 将来の改善案（今回は実施しない）

- 各デッキに `deck.json`（題名・枚数・形式・Issue・概要・カテゴリ・タグ・同梱物）を置き、スクリプトでルート `README.md` と `index.html` を生成する。目次更新が完全に自動化され、Skill も「スクリプトを実行する」だけになる。
