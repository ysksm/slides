---
name: new-deck
description: このリポジトリに新しいスライドデッキ（<deck>/index.html + README.md）を作る手順。「スライドを作って」「デッキを追加」「〜の解説スライド」「Issue #N のスライド」と言われたときに使う。目次（ルート README.md / index.html）は更新しない。
---

# 新しいデッキを作る（new-deck）

1 Issue = 1 デッキ = 1 PR。変更は `<deck>/` 配下だけに閉じる。**ルートの `README.md` と `index.html`（目次）は触らない。** フックがブロックするが、ブロックされたら回避策を探さず、目次は目次 Issue で更新する旨を最後に報告する。

## 1. ディレクトリと雛形

- ディレクトリ名は英小文字とハイフン（例 `npm-vulnerability-trends`）。既存と重複しないこと。
- `playwright-overview/index.html` をコピーして `<deck>/index.html` にする。1280x720 のステージ、← → / Space / Home / End で移動、O で一覧、F で全画面、P で印刷/PDF、`#n` ハッシュ、スワイプ対応、JS ライブラリ依存なし、Web フォントは CDN（取れなければ代替フォント）。
- 各スライドは `<section class="slide">`。1 枚目は `class="slide cover"`。枚数は `grep -c '<section class="slide' <deck>/index.html` で数える。

## 2. `<deck>/README.md`（目次更新の材料になるので形式を守る）

```markdown
# <題名>

[Issue #N](https://github.com/ysksm/slides/issues/N) の<調査報告|解説|検討資料>。<1〜3 文の概要>（全 N 枚、調査日: YYYY-MM-DD）。

- [HTML スライド](index.html): 全 N 枚。ビルド不要。
- [<同梱資料>](research.md): <内容>   ← あれば

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF。`#9` のようなハッシュでページを直接指定できます。
```

- 1 行目の H1 が目次の題名、リード文の Issue リンクと「全 N 枚」が目次の表の材料になる。
- 二次情報（動画要約など）は出典 URL を書く。数値・仕様は出典（公式ドキュメント URL）をスライド内にも書く。

## 3. はみ出し確認（必須）

全スライドをヘッドレス Chrome で描画し、スライド下端（フッター 44px を除く）からはみ出す要素がないことを確認する。

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
N=$(grep -c '<section class="slide' <deck>/index.html)
for i in $(seq 1 "$N"); do
  "$CHROME" --headless=new --window-size=1280,720 --screenshot="/tmp/<deck>-$i.png" "file://$PWD/<deck>/index.html#$i" 2>/dev/null
done
```

スクリーンショットを目視し、あふれた表は `class="tight xs"`、ラベル列に `white-space:nowrap` を使うなど詰める。長い日本語の表は特にあふれやすい。

## 4. PR

```bash
git diff --name-only origin/main...HEAD     # <deck>/ 配下だけであること
```

- コミットメッセージ・PR は日本語。PR 本文に Issue 番号と枚数を書く。
- **目次は更新しない。** PR 本文の末尾に「目次への登録は目次更新 Issue で行う」と書き、マージ後に目次更新 Issue へ「`<deck>/` を登録してほしい」とコメントする（Issue が無ければ「目次更新」の題で作る）。
