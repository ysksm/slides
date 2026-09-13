# 自動実装と AI の組み合わせ

[Issue #16](https://github.com/ysksm/slides/issues/16) の検討資料。React / Hooks / Redux、DDD、レイヤードアーキテクチャ + DIP、Repository / DI、TypeSpec を前提に、AI と決定論的なコード生成の組み合わせを提案する。

- [HTML スライド](index.html)：28 枚。3 案の比較、推奨構成、部分生成・再生成、実施計画。
- [検討記録・詳細設計](design.md)：判断根拠、入力の正本、ID / VO、所有権、未決定事項。
- [実施タスク](tasks.md)：T01〜T12、依存関係、成果物、受け入れ条件。

`index.html` をブラウザで開く。ビルド・外部ライブラリ・Web フォントの取得は不要。すべてローカルで閲覧できる（外部の参照資料にはネット接続が必要）。

| 操作 | キー / ボタン |
|---|---|
| 次 / 前 | → / ←、Space、PageDown / PageUp |
| 最初 / 最後 | Home / End |
| 目次 | O（戻る：O / Escape、各スライドをクリック） |
| 全画面 | F |
| 印刷 / PDF 保存 | P |
| 直接指定 | URL の `#16` など |

画面下に操作ボタンを用意し、左右スワイプにも対応。印刷では全 28 枚を 1 ページずつ出力する。JavaScript 無効時は全スライドを縦に表示する。

スライドは手書き HTML。`scaffold` CLI と Feature Spec は将来の実装案であり、動作する生成器は同梱していない。タスクは Markdown の backlog として作成している。

作成・公式資料確認日：2026-09-13。
