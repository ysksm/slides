# Go 言語チュートリアル ハンズオン ② 応用編 — データベース・REST API・ジェネリクス・ファジング・govulncheck

[Issue #45](https://github.com/ysksm/slides/issues/45) の解説スライド（ハンズオン形式）。[go.dev の公式チュートリアル](https://go.dev/doc/tutorial/)のうち後半 6 本（Accessing a relational database / RESTful API with Go and Gin / Generics / Fuzzing / govulncheck / govulncheck with VS Code Go）を、各ステップの「やってみよう」に沿って手を動かしながら進めます。テーマごとに独立しているので、必要なところから始められます（全 19 枚、調査日: 2026-09-15）。

- [HTML スライド](index.html): 全 19 枚。ビルド不要。
- 前編: [① 基礎編](../go-tutorial-basics/README.md)（Hello, World・モジュール・テスト・ワークスペース・JSON）

## 構成

| # | 内容 |
|---|---|
| 1–2 | 表紙 / 応用編の全体像（5 テーマの独立性、前提、検証環境と所要時間） |
| 3–6 | **A. データベースアクセス**：MySQL の用意（Docker 可）とテーブル作成、`sql.Open` / `db.Ping`、`Query` / `QueryRow` と `Scan`、`Exec` と `LastInsertId` |
| 7–9 | **B. Gin で RESTful API**：エンドポイント設計と構造体タグ、ルーターとハンドラ、`curl` での GET / POST / パスパラメータ / 404 |
| 10–11 | **C. ジェネリクス**：非ジェネリック版から型パラメータへ、型推論、名前付き型制約 |
| 12–14 | **D. ファジング**：`Reverse` と単体テスト、`FuzzReverse` で 1 つ目のバグ、rune 反転 → 2 つ目のバグ → UTF-8 検証で修正 |
| 15–17 | **E. govulncheck**：脆弱な依存をわざと導入、Symbol Results の読み方、修正、VS Code Go と CI への組み込み |
| 18 | チェックポイント：応用編で使った道具と次に読む公式資料 |
| 19 | まとめ・参考資料 |

## 検証環境

- B〜E は go1.27.1 / go1.24.7、gin v1.12.0、govulncheck（2026-09 時点の脆弱性 DB）で実際に実行し、出力を確認した（Linux / amd64）。gin v1.12 は Go 1.25 以上を要求するため、古い Go ではツールチェーンの自動切替が起きる。
- A（データベース）は MySQL サーバーが必要なため、コードと SQL・期待出力は公式チュートリアルに沿って掲載した（本環境では未実行）。
- ファジングの失敗入力（`testdata/fuzz/` の内容）や govulncheck が報告する件数は実行時期・環境で変わる。

## 主な参考資料

- [Tutorials](https://go.dev/doc/tutorial/) — 公式チュートリアル一覧
- [Tutorial: Accessing a relational database](https://go.dev/doc/tutorial/database-access)
- [Tutorial: Developing a RESTful API with Go and Gin](https://go.dev/doc/tutorial/web-service-gin)
- [Tutorial: Getting started with generics](https://go.dev/doc/tutorial/generics)
- [Tutorial: Getting started with fuzzing](https://go.dev/doc/tutorial/fuzz)
- [Tutorial: Find and fix vulnerable dependencies with govulncheck](https://go.dev/doc/tutorial/govulncheck) / [… with VS Code Go](https://go.dev/doc/tutorial/govulncheck-ide)
- [Go Fuzzing](https://go.dev/doc/security/fuzz/)、[Go Vulnerability Management](https://go.dev/doc/security/vuln/)、[Accessing databases](https://go.dev/doc/database/)

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF。左右スワイプと画面端のクリックにも対応。`#9` のようなハッシュでページを直接指定できます。

HTML を直接編集します。表示・操作の構成は既存の `playwright-overview/index.html` に合わせています。JavaScript ライブラリへの依存はなく、Web フォントが取得できない場合は代替フォントを使います。
