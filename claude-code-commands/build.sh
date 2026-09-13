#!/usr/bin/env bash
# Build all Marp decks in src/ into standalone HTML files in this folder.
# Requires Node.js (uses npx to fetch @marp-team/marp-cli).
set -euo pipefail
cd "$(dirname "$0")"
npx -y @marp-team/marp-cli@4 --html --theme-set theme/claude.css --input-dir src --output . "$@"
