# tsc --lsp AI Agent 連携用 MCP サーバー

TypeScript 7 のネイティブ言語サーバー `tsc --lsp --stdio` を、AI コーディングエージェント標準の **Model Context Protocol (MCP)** 経由で公開する最小サーバーです。

## 特徴

- **超低レイテンシ**: Go 製の `tsc --lsp` と通信し、診断・hover・定義ジャンプ・参照一覧を数ミリ秒で取得。
- **トークン節約**: 生の LSP レスポンス（数万トークンになることもある AST や Completion）を、LLM が判断に必要な最小限の要約テキストに変換して返却。
- **ゼロ外部依存**: Node.js 標準ライブラリのみで動作。`npm install` なしで起動可能。

## 提供ツール (Tools)

1. `ts_get_diagnostics({ file })`: 指定ファイルの型エラー・警告をミリ秒単位で返却。
2. `ts_hover_type({ file, line, character })`: 型定義と JSDoc コメントを取得。
3. `ts_get_definition({ file, line, character })`: 定義箇所のファイルパス・行番号を取得。
4. `ts_find_references({ file, line, character })`: 参照されている全ファイル・行番号を取得。

## 設定例 (Claude Desktop / Antigravity / Cursor / Orca 等)

設定ファイル (`claude_desktop_config.json` 等) に以下を追記します:

```json
{
  "mcpServers": {
    "typescript": {
      "command": "node",
      "args": ["/path/to/tsc-lsp/examples/agent-mcp/mcp-server.mjs"],
      "env": {
        "TS_PROJECT_ROOT": "/path/to/your/project"
      }
    }
  }
}
```
