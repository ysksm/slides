#!/usr/bin/env bash
# 目次（ルート README.md / index.html）とデッキディレクトリの整合を確認する。
#   - main にある全デッキ（<deck>/index.html を持つディレクトリ）が README の表と index.html のカードに載っているか
#   - README の表の枚数が実際の <section class="slide"> の数と一致するか（手書き HTML デッキのみ）
#   - カテゴリ: index.html のセクション・カードの data-category が scripts/categories.tsv にあり、
#     README で同じデッキの行が対応するカテゴリ見出し（### 表示名）の下にあるか
#   - index.html / README.md 内の相対リンク先が存在するか
# 問題があれば 1 で終了する。update-toc Skill と CI から使う。
set -u
cd "$(git rev-parse --show-toplevel 2>/dev/null || dirname "$0")/." || exit 1

status=0
note() { printf '%s\n' "$*"; }
fail() { printf 'NG  %s\n' "$*"; status=1; }
ok()   { printf 'ok  %s\n' "$*"; }

decks=()
for d in */; do
  d=${d%/}
  case "$d" in .*|scripts|node_modules) continue ;; esac
  [ -f "$d/index.html" ] && decks+=("$d")
done

# ---- カテゴリ定義（id<TAB>表示名<TAB>説明。# 始まりと空行は無視。bash 3.2 でも動くよう連想配列は使わない）----
cat_file=scripts/categories.tsv
[ -f "$cat_file" ] || fail "$cat_file が無い"
cat_ids() { [ -f "$cat_file" ] && grep -v '^#' "$cat_file" | grep -v '^$' | cut -f1; }
cat_label() { [ -f "$cat_file" ] && grep -v '^#' "$cat_file" | awk -F'\t' -v id="$1" '$1 == id { print $2; exit }'; }

# index.html: <section class="cat" data-category="..."> の一覧
index_sections=$(grep -o '<section class="cat" data-category="[^"]*"' index.html | sed -E 's/.*data-category="([^"]*)"/\1/')
# index.html: デッキ → カードの data-category（<li class="deck" ...> の次に出る href="<deck>/index.html" で対応付ける）
index_cat_of() {
  awk -v deck="$1" '
    /<li class="deck"/ { cat = ""; if (match($0, /data-category="[^"]*"/)) { cat = substr($0, RSTART + 15, RLENGTH - 16) } inli = 1; next }
    inli && index($0, "href=\"" deck "/index.html\"") { print cat; exit }
  ' index.html
}
# README.md: デッキの表の行が、どの「### 見出し」の下にあるか
readme_heading_of() {
  awk -v deck="$1" '
    /^### / { h = substr($0, 5); sub(/[ \t]+$/, "", h) }
    index($0, "](" deck "/index.html) |") { print h; exit }
  ' README.md
}

note "== 登録状況 =="
for d in "${decks[@]}"; do
  in_readme=$(grep -c "]($d/index.html)" README.md)
  in_index=$(grep -c "href=\"$d/index.html\"" index.html)
  if [ "$in_readme" -ge 1 ] && [ "$in_index" -ge 1 ]; then
    ok "${d}（README: ${in_readme} 箇所, index.html: ${in_index} 箇所）"
  else
    fail "${d} は未登録（README: $in_readme, index.html: ${in_index}）"
  fi
  grep -q "^├── $d/\|^└── $d/" README.md || fail "${d} がリポジトリ構成ツリーに無い"
done

note "== 枚数 =="
for d in "${decks[@]}"; do
  actual=$(grep -c '<section class="slide' "$d/index.html")
  [ "$actual" -eq 0 ] && continue   # Marp 製などは対象外
  row=$(grep "]($d/index.html) |" README.md | head -1)
  [ -z "$row" ] && continue
  listed=$(printf '%s' "$row" | awk -F'|' '{gsub(/ /,"",$3); print $3}')
  if [ "$listed" = "$actual" ]; then ok "${d}: ${actual} 枚"; else fail "${d}: README は ${listed} 枚、実際は ${actual} 枚"; fi
done

note "== カテゴリ =="
for s in $index_sections; do
  [ -n "$(cat_label "$s")" ] || fail "index.html のセクション data-category=\"$s\" が $cat_file に無い"
done
for id in $(cat_ids); do
  label=$(cat_label "$id")
  printf '%s\n' "$index_sections" | grep -qx "$id" || fail "index.html にカテゴリ \"$id\"（${label}）のセクションが無い"
  grep -q "^### ${label}\$" README.md || fail "README.md にカテゴリ見出し「### ${label}」が無い"
done
for d in "${decks[@]}"; do
  icat=$(index_cat_of "$d")
  ilabel=$(cat_label "$icat")
  rhead=$(readme_heading_of "$d")
  if [ -z "$icat" ]; then
    fail "${d}: index.html のカードに data-category が無い"
  elif [ -z "$ilabel" ]; then
    fail "${d}: index.html の data-category=\"$icat\" が $cat_file に無い"
  elif [ -z "$rhead" ]; then
    fail "${d}: README.md の表の行が無い"
  elif [ "$rhead" != "$ilabel" ]; then
    fail "${d}: index.html は「${ilabel}」、README.md は「${rhead}」の下にある"
  else
    ok "${d}: ${ilabel}（$icat）"
  fi
done

note "== 相対リンク =="
for f in README.md index.html; do
  grep -o 'href="[^"#:]*"\|]([^)#:]*)' "$f" | sed -E 's/^href="//; s/"$//; s/^\]\(//; s/\)$//' | sort -u | while read -r p; do
    [ -z "$p" ] && continue
    [ -e "$p" ] || printf 'NG  %s: リンク切れ %s\n' "$f" "$p"
  done | tee /dev/stderr | grep -q . && status=1
done
[ "$status" -eq 0 ] && note "すべて OK" || note "問題があります"
exit $status
