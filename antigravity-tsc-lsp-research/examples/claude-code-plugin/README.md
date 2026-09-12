# Claude Code 向け TypeScript 7 ネイティブ LSP プラグイン

TypeScript 7 で導入されたネイティブ言語サーバー `tsc --lsp --stdio` を Claude Code に接続するための設定雛形です。

## 概要

従来の公式 `typescript-lsp` プラグインは `typescript-language-server` (Node.js ベース、TS 6 以前前提) を前提としており、TypeScript 7 の `tsc` とは互換性がありません。
本プラグインを使うことで、追加の npm ラッパーなしで Go ネイティブの超高速 LSP サーバーを直接利用できます。

## 導入方法

### 方法 1: リポジトリルートに配置（プロジェクト単位）

プロジェクトのルートディレクトリに `.lsp.json` を配置します。

```sh
cp .lsp.json /path/to/your-project/.lsp.json
```

### 方法 2: Claude Code プラグインとして登録

```sh
claude plugin add /path/to/tsc-lsp/examples/claude-code-plugin
```

## 前提条件

- プロジェクト内に `typescript@^7.0.0` がインストールされていること（`node_modules/.bin/tsc` が PATH または実行可能であること）
- Claude Code が LSP ツールを有効化していること
