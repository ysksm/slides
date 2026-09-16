---
name: update-toc
description: 目次更新 Issue で、main にあるが目次（ルート README.md / index.html）に未登録のスライドデッキをすべて登録する。「目次を更新」「一覧に追加」「index.html にカードを追加」「README のスライド一覧」と言われたとき、または目次更新用の Issue・ブランチで作業しているときに使う。デッキ作成中（デッキディレクトリ配下での作業中）には使わない。
---

# 目次更新（update-toc）

ルートの `README.md` と `index.html` を、main に存在するデッキと一致させる。差分はこの 2 ファイルだけにする。デッキ側 `<deck>/` は一切触らない。

目次は **カテゴリ分け + キーワード検索** の構成になっている（Issue #44）。デッキは必ずどれか 1 つのカテゴリに属する。

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

`NG` 行が「登録すべきデッキ」「枚数のずれ」「カテゴリの不整合」「リンク切れ」。何も NG がなければ「目次は最新」と報告して終わる（マーカーを消すのを忘れない）。

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
| カテゴリ | 下のカテゴリ表から 1 つ選ぶ |
| 検索キーワード | 題名・概要に出てこない別名（英名、製品名、略語、日本語の言い換え） |

## 3. カテゴリを決める

| キー | 名称 | 内容 |
|---|---|---|
| `ai` | AI エージェント運用 | Claude Code などの AI コーディングエージェントの使い方・コスト・実行環境 |
| `codegen` | AI × 自動生成・設計 | モデル情報からコードを生成する仕組みと、AI をその設計に組み込む検討 |
| `testing` | テスト・品質 | ブラウザ自動化によるテスト・資料づくりとデグレ防止 |
| `devtools` | 開発ツール・言語基盤 | リンタ・検索・言語サーバーなど、日々の開発を支えるツールの中身 |
| `web` | Web アプリ開発 | 既存 Web アプリの UI を作り替えるための構成・API・配信の検討 |
| `embedded` | 組み込み Linux | Yocto Project による組み込み Linux ディストリビューションづくり |
| `security` | セキュリティ・データ | 脆弱性情報の収集・分類と、時系列での可視化の設計 |

- **1 デッキ = 1 カテゴリ**。迷ったら題材（何の話か）で選び、道具（HTML / Marp）では選ばない。
- 既存カテゴリのどれにも入らないときだけ新設する。新設時は英小文字とハイフンのキーを決め、**README のカテゴリ表・カテゴリ節、`index.html` のチップ・`<section class="cat">` の 4 か所**を追加する。カテゴリの並び順は既存を変えず、新しいカテゴリは末尾に足す。
- カテゴリ内の並びは新しい順（一覧・詳細・カードのすべてで同じ順）。

## 4. `README.md` を更新する（4 か所）

1. **カテゴリ表**（「スライド一覧」冒頭） — カテゴリを新設したときだけ行を足す。本数はデッキを足したカテゴリの分を数え直す。
2. **カテゴリごとの表** — 該当カテゴリの `### <名称>` の表の **先頭行** に `| [題名](<deck>/index.html) | 枚数 | 形式 | [#N](https://github.com/ysksm/slides/issues/N) |` を追加。カテゴリ節は `<a id="<キー>"></a>` のアンカー付き。
3. **「各スライドの詳細」の節** — 同じカテゴリのデッキが並んでいる位置（そのカテゴリの先頭）に `### [題名](<deck>/index.html)` の節を追加。概要 1 段落 + 箇条書き（開き方・キー操作、同梱物、`詳細: [<deck>/README.md](<deck>/README.md)`）。既存の節の書き方に合わせる。
4. **「リポジトリ構成」のツリー・「閲覧方法」・「ビルド」** — ツリーは同じカテゴリの行のとなりに `├── <deck>/` を追加し、コメントは `# [<カテゴリキー>] 概要` の形にする。列幅（`#` の位置）は既存行に合わせる。`P` キー対応デッキ、ビルド不要デッキの列挙にも必要なら追加する。

## 5. `index.html` を更新する（3 か所）

1. **該当カテゴリの `<section class="cat" data-cat="<キー>">` の `<ul class="decks">` 先頭** に `<li class="deck">` を追加。既存カードをコピーして差し替える:
   - `data-cat="<キー>"`、`data-keywords="..."`（検索用の別名。英名・製品名・略語・言い換えを半角スペース区切りで。題名と概要は自動で検索対象になるので重複は不要）
   - `<h3>` の題名、`<p>` の概要、`tag-cat`（カテゴリ名）・`tag-count`（`N 枚`）・`tag-kind`・`tag-issue`（`Issue #N`）、`.sub` のリンク（README / 同梱 md / 公式ドキュメントなど）
   - Issue が無ければ `tag-issue` を省く。
2. **絞り込みチップ** — カテゴリを新設したときだけ `<ul class="chips">` にボタンを 1 つ足す（件数はスクリプトが埋めるので `<span class="n"></span>` は空のまま）。
3. **`<meta name="description">`** の列挙に題名（短縮形）を追加。

絞り込みの JS（`<script>`）は件数・カテゴリをすべて DOM から数えるので、カードを足すだけで件数表示・検索・`?cat=` / `?q=` の共有 URL は追随する。**JS を書き換える必要はない。**

## 6. 検証する

```bash
scripts/check-toc.sh                                  # すべて ok になること（カテゴリの本数も見る）
git diff --name-only                                  # README.md と index.html だけであること
```

ヘッドレス Chrome でトップページを描画し、崩れがないこと・絞り込みが効くことを見る（`?q=` を付けた URL で件数が変わる）:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"   # Linux では chrome / chromium
"$CHROME" --headless=new --screenshot=/tmp/toc.png --window-size=1200,2400 "file://$PWD/index.html"
"$CHROME" --headless=new --dump-dom "file://$PWD/index.html?q=<キーワード>" | grep 'id="count"'
```

## 7. 後始末とコミット

```bash
rm .toc-update
git add README.md index.html
git commit -m "目次を更新: <deck1>, <deck2> を登録"
```

PR 本文には登録したデッキ・カテゴリと対応する Issue 番号を列挙する。目次 Issue に「登録済み」とコメントして閉じる。
