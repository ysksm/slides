#!/usr/bin/env bash
# 目次（ルート README.md / index.html）とデッキディレクトリの整合を確認する。
#   - main にある全デッキ（<deck>/index.html を持つディレクトリ）が README の表と index.html のカードに載っているか
#   - README の表の枚数が実際の <section class="slide"> の数と一致するか（手書き HTML デッキのみ）
#   - 全デッキがカテゴリに割り当てられ、README と index.html でカテゴリごとの本数が一致するか
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
cats=$(grep -o '<section class="cat" data-cat="[a-z-]*"' index.html | sed -E 's/.*data-cat="([a-z-]*)"/\1/')
if [ -z "$cats" ]; then
  fail "index.html にカテゴリ（<section class=\"cat\" data-cat=...>）が無い"
fi
for c in $cats; do
  grep -q "class=\"chip\" type=\"button\" data-cat=\"$c\"" index.html || fail "カテゴリ ${c} の絞り込みチップが index.html に無い"
  grep -q "| \`$c\` |" README.md || fail "カテゴリ ${c} が README のカテゴリ表に無い"
  n_html=$(grep -c "class=\"deck\" data-cat=\"$c\"" index.html)
  n_md=$(awk -v key="$c" '
    $0 == "<a id=\"" key "\"></a>" { in_block = 1; next }
    in_block && (/^<a id=/ || /^## /) { in_block = 0 }
    in_block && /^\| \[/ { n++ }
    END { print n + 0 }
  ' README.md)
  if [ "$n_html" -eq "$n_md" ] && [ "$n_html" -gt 0 ]; then
    ok "${c}: ${n_html} 本"
  else
    fail "${c}: index.html は ${n_html} 本、README は ${n_md} 本"
  fi
done
for d in "${decks[@]}"; do
  c=$(grep -B1 "href=\"$d/index.html\"" index.html | sed -nE 's/.*class="deck" data-cat="([a-z-]*)".*/\1/p' | head -1)
  if [ -z "$c" ]; then
    fail "${d} のカードに data-cat（カテゴリ）が無い"
  elif ! printf '%s\n' "$cats" | grep -qx "$c"; then
    fail "${d} のカテゴリ ${c} は index.html に定義されていない"
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
