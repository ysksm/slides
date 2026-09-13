# Orca — AIエージェントのIDEを使いこなす

[HTMLスライド](./index.html)をブラウザで開いてください。35枚の日本語スライドです。

CSS・JavaScriptを含む単一HTMLで、ビルドや外部ライブラリ、ネットワーク接続は不要です。公式資料のリンクを開く際にはネットワーク接続が必要です。GitHub Pagesの公開対象である`docs/`内に配置しています。

## 内容

- 主要16機能の一覧と1行解説
- 各機能の使い方、設定画面、CLI例
- ワークスペースの分け方、Project group / Folder workspace
- 1つのタスクでAPI・UIの複数リポジトリを扱う構成と結合確認
- Tasks、Workspace status、Orchestration Taskの区別
- OrchestrationのRun / Task / Dispatch、依存関係、完了報告
- Automationsの登録、試運転、履歴確認、機能の組み合わせ

## 操作

| 操作 | キー・ボタン |
| --- | --- |
| 次 / 前のスライド | → / ←、PageDown / PageUp |
| 次のスライド | Space |
| 最初 / 最後 | Home / End |
| 目次 | O、目次ボタン |
| 現在のページの補足 | N、補足ボタン |
| 発表 / 一覧表示 | V、表示切替ボタン |
| ダイアログを閉じる | Esc |
| 全ページを印刷 | 印刷ボタン |

発表表示では横スワイプでも移動できます。狭い画面では一覧表示で開きます。URLの`#multi-group`や`#orchestration`などで個別のページへ直接移動できます。一覧表示の「補足説明」には設定上の留意点や実例の前提があります。

## 出典・バージョン

確認日: **2026年9月12日**。対象は[stablyai/orca](https://github.com/stablyai/orca)、公式資料は[Orca Docs](https://www.onorca.dev/docs/)。各ページと末尾に参照リンクがあります。

ローカルのOrca **1.4.200**同梱CLIで、掲載例に使用した`worktree create`、`automations create`、`orchestration worker-start`、`orchestration task-create`のヘルプ、および同梱CLI / orchestrationガイドを照合しています。コマンド例のエージェント起動・自動実行登録は実行していません。

`<...>`、リポジトリ名、ポート、プロジェクト固有のテストコマンドは実環境に合わせて置換してください。「運用例」「おすすめ」は本資料の提案であり、製品の自動処理を保証するものではありません。
