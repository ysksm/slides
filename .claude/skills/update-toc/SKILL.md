---
name: update-toc
description: 目次更新 Issue で、main にあるが目次（ルート README.md / index.html）に未登録のスライドデッキをすべて登録する。「目次を更新」「一覧に追加」「index.html にカードを追加」「README のスライド一覧」と言われたとき、または目次更新用の Issue・ブランチで作業しているときに使う。デッキ作成中（<deck>/ の作業中）には使わない。
---

# 目次更新（update-toc）

ルートの `README.md` と `index.html` を、main に存在するデッキと一致させる。差分はこの 2 ファイルだけにする。デッキ側 `<deck>/` は一切触らない。

## 0. 前提を確認する

- 今のセッションが **目次更新の Issue** であること。デッキ作成の Issue なら中断し、「目次は目次 Issue で更新する」と報告して終わる（`CLAUDE.md` / `CONTRIBUTING.md`）。
- 目次に載せるデッキは **main にマージ済み** のものだけ。ブランチを最新の main に合わせる:

```bash
git fetch origin
git merge origin/main        # 目次ブランチは main の最新から作る（競合しないはず）
```

- フック解除用のマーカーを置く（このスキルの中でだけ許可される操作）:

```bash
touch .toc-update            # .gitignore 済み。作業が終わったら必ず消す
```

## 1. 未登録デッキと不整合を洗い出す

```bash
scripts/check-toc.sh
```

`NG` 行が「登録すべきデッキ」「枚数のずれ」「リンク切れ」。何も NG がなければ「目次は最新」と報告して終わる（マーカーを消すのを忘れない）。

## 2. 各デッキの登録情報を集める

未登録デッキごとに次を読む・数える。**内容は `<deck>/README.md` を正とし、勝手に要約を創作しない。**

| 項目 | 取り方 |
|---|---|
| 題名 | `<deck>/README.md` の H1 |
| 枚数 | `grep -c '<section class="slide' <deck>/index.html`（Marp 製は README の記載） |
| 形式 | 手書き HTML / 手書き HTML + 設計資料 / Marp など（同梱 md があれば「+ ○○」） |
| 関連 Issue | README のリード文のリンク。無ければ `—` |
| 概要（1〜3 文） | README のリード文を要約 |
| 同梱物 | `ls <deck>`（research.md, design.md, examples/ など） |
| キー操作 | README の「閲覧方法」（P 対応かどうか） |

## 3. `README.md` を更新する（4 か所）

新しいデッキは **一覧の先頭** に置く（既存の並びは新しい順）。

1. **「スライド一覧」の表** — `| [題名](<deck>/index.html) | 枚数 | 形式 | [#N](https://github.com/ysksm/slides/issues/N) |` を先頭行に追加。
2. **各スライドの節** — 表の直後、既存の先頭の節の前に `### [題名](<deck>/index.html)` の節を追加。概要 1 段落 + 箇条書き（開き方・キー操作、同梱物、`詳細: [<deck>/README.md](<deck>/README.md)`）。既存の節の書き方に合わせる。
3. **「リポジトリ構成」のツリー** — `├── <deck>/` の行を先頭に追加。同梱ディレクトリがあれば子要素も書く。列幅（`#` の位置）は既存行に合わせる。
4. **「閲覧方法」「ビルド」の列挙** — `P` キー対応デッキの列挙、ビルド不要デッキの列挙に必要なら追加する。

## 4. `index.html` を更新する（2 か所）

1. **`<ul class="decks">` の先頭** に `<li class="deck">` を追加。既存カードをコピーして題名・概要・`tag-count`（`N 枚`）・`tag-kind`・`tag-issue`（`Issue #N`）・`.sub` のリンク（README / 同梱 md / 元動画など）を差し替える。Issue が無ければ `tag-issue` を省く。
2. **`<meta name="description">`** の列挙に題名（短縮形）を追加。

## 5. 検証する

```bash
scripts/check-toc.sh                                  # すべて ok になること
git diff --name-only                                  # README.md と index.html だけであること
```

余裕があればヘッドレス Chrome でトップページを描画して崩れがないことを見る:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/tmp/toc.png --window-size=1200,2400 "file://$PWD/index.html"
```

## 6. 後始末とコミット

```bash
rm .toc-update
git add README.md index.html
git commit -m "目次を更新: <deck1>, <deck2> を登録"
```

PR 本文には登録したデッキと対応する Issue 番号を列挙する。目次 Issue に「登録済み」とコメントして閉じる。
