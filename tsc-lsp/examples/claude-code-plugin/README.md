# typescript7-lsp (Claude Code プラグイン雛形)

TypeScript 7 のネイティブ言語サーバー `tsc --lsp --stdio` を Claude Code の LSP ツールに接続する。

## 前提

- `tsc` 7.x が PATH 上にあること (`npm i -g typescript@7`)、または `command` をプロジェクトの `node_modules/.bin/tsc` に書き換える
- 公式 `typescript-lsp` プラグイン (typescript-language-server 前提) は無効化する。同じ拡張子は先に登録されたサーバーが取る

## 使い方

```bash
claude --plugin-dir ./examples/claude-code-plugin
```

Claude が `.ts` を編集すると `textDocument/diagnostic` の結果がコンテキストに入り、
goToDefinition / findReferences / hover / documentSymbol / workspaceSymbol /
goToImplementation / incomingCalls / outgoingCalls が使えるようになる。
