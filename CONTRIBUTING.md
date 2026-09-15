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

- ルート `README.md` — 「スライド一覧」のカテゴリ表とカテゴリごとの表、「各スライドの詳細」の節、「リポジトリ構成」のツリー、「ビルド」「閲覧方法」のデッキ列挙
- ルート `index.html` — GitHub Pages のトップページ。絞り込み UI（検索ボックスとカテゴリのチップ）、カテゴリごとの `.deck` カードの一覧、`<meta name="description">`

## 目次の構成（カテゴリ + 検索）

[Issue #44](https://github.com/ysksm/slides/issues/44) で、目次をカテゴリ分けし、トップページに絞り込みを付けました。

- **1 デッキ = 1 カテゴリ**。カテゴリの一覧（キー・名称・内容）はルート `README.md` の「スライド一覧」冒頭の表が正で、`index.html` のチップと `<section class="cat" data-cat="...">` が同じキーを使います。
- `index.html` の各カードは `data-cat`（カテゴリキー）と `data-keywords`（検索用の別名。英名・略語・言い換え）を持ちます。検索はカードの本文（題名・概要・タグ）＋ `data-keywords` ＋ ディレクトリ名を対象に、空白区切りの AND で絞り込みます（全角・大文字小文字は同一視）。
- 絞り込みは外部ライブラリなしの素の JavaScript で、件数はすべて DOM から数えます。カードを追加するだけで件数表示・検索・カテゴリの絞り込みは追随するため、**スクリプトを書き換える必要はありません**。JavaScript が無効な環境ではカードが全件表示されます。
- 絞り込んだ状態は `?cat=<カテゴリキー>` `?q=<キーワード>` の URL で共有できます。
- `scripts/check-toc.sh` が、全デッキにカテゴリが付いていること、カテゴリごとの本数が `README.md` と `index.html` で一致することを確認します。
- カテゴリの新設・改名・デッキの付け替えも「目次」の変更なので、デッキの PR では行わず目次更新 Issue で行います。手順は `update-toc` Skill にあります。

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
3. **目次更新の依頼**: マージ後、「目次更新」Issue に「`<deck>/` を登録してほしい」とコメントする（未登録デッキが複数あればまとめて 1 回でよい）。カテゴリ案と検索キーワード案を添える。
4. **目次更新**: 目次 Issue のブランチを main の最新から切り、未登録デッキをすべて登録する。この PR の差分はルート `README.md` と `index.html` のみ。
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
- **目次更新**: リポジトリルートで `scripts/check-toc.sh` を実行し、未登録・枚数のずれ・カテゴリの不整合・リンク切れがないことを確認します。目次のみを変更する PR では CI も同じスクリプトを実行します。
- **デッキ作成・修正**: 変更を `<deck>/` 配下に限定します。新規デッキが目次に未登録なのは想定どおりなので、`scripts/check-toc.sh` の未登録エラーを解消するために目次を編集してはいけません。登録はマージ後の目次更新 Issue で行います。

## 将来の改善案（今回は実施しない）

- 各デッキに `deck.json`（題名・枚数・形式・Issue・概要・同梱物）を置き、スクリプトでルート `README.md` と `index.html` を生成する。目次更新が完全に自動化され、Skill も「スクリプトを実行する」だけになる。
