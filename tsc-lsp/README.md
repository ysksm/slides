# tsc --lsp 調査報告

TypeScript 7 のネイティブ言語サーバー `tsc --lsp` について、機能・用途・AI エージェント活用の観点で調査したスライド (ysksm/slides#1)。

- `index.html` — スライド本体。ブラウザで開く。← → で移動、O で一覧、F で全画面
- `examples/lsp-probe.mjs` — `tsc --lsp` を起動して診断・hover・定義・参照・callHierarchy を叩く最小クライアント
- `examples/claude-code-plugin/` — Claude Code に `tsc --lsp --stdio` を接続する `.lsp.json` 雛形
