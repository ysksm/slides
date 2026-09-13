#!/usr/bin/env bash
# PreToolUse フック: ルートの README.md / index.html（目次）への編集を、
# 目次更新セッション以外ではブロックする（Issue #23）。
#
# 許可条件（いずれか）:
#   - リポジトリルートに .toc-update マーカーがある（update-toc Skill が作る）
#   - 現在のブランチ名に "toc" を含む
# 終了コード 2 でツール実行を拒否し、stderr の内容がエージェントに渡る。
set -u

input=$(cat)
root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

file=$(printf '%s' "$input" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
ti = d.get("tool_input", {}) or {}
print(ti.get("file_path") or ti.get("path") or "")
' 2>/dev/null)

[ -z "$file" ] && exit 0

# 相対パスならルート基準に正規化
case "$file" in
  /*) abs="$file" ;;
  *)  abs="$root/$file" ;;
esac
abs=$(python3 -c 'import os,sys; print(os.path.normpath(sys.argv[1]))' "$abs")

case "$abs" in
  "$root/README.md"|"$root/index.html") ;;
  *) exit 0 ;;
esac

if [ -f "$root/.toc-update" ]; then exit 0; fi
branch=$(git -C "$root" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
case "$branch" in *toc*) exit 0 ;; esac

cat >&2 <<MSG
[guard-toc] ルートの $(basename "$abs") は「目次」なので、このセッションでは編集できません。
目次（ルート README.md / index.html）の更新はデッキ作業と分け、目次更新 Issue で /update-toc Skill を使って単独に行います（CONTRIBUTING.md 参照）。
このセッションでは <deck>/ 配下の変更だけを PR にし、マージ後に目次 Issue へ「<deck>/ を登録してほしい」とコメントしてください。
.toc-update マーカーの作成やブランチ名の変更で回避しないでください。
MSG
exit 2
