# Go 言語チュートリアル ハンズオン ① 基礎編 — Hello, World からモジュール・テスト・ワークスペースまで

[Issue #45](https://github.com/ysksm/slides/issues/45) の解説スライド（ハンズオン形式）。[go.dev の公式チュートリアル](https://go.dev/doc/tutorial/)のうち前半 4 本（Getting started / Create a Go module（7 パート）/ Multi-module workspaces / Working with JSON）を、各ステップの「やってみよう」に沿って手を動かしながら進めます。コマンド・コード・実行結果はすべて実際に実行して確認したものを載せています（全 20 枚、調査日: 2026-09-15）。

- [HTML スライド](index.html): 全 20 枚。ビルド不要。
- 続編: [② 応用編](../go-tutorial-advanced/README.md)（データベース・Gin・ジェネリクス・ファジング・govulncheck）

## 構成

| # | 内容 |
|---|---|
| 1–2 | 表紙 / 公式チュートリアル 10 本と本デッキ①②の対応、進め方、前提と検証環境 |
| 3 | 準備：Go のインストール（Linux / macOS / Windows）、`go version`、PATH、ツールチェーンの自動切替 |
| 4–5 | **Getting started**：`go mod init` と Hello, World、外部パッケージ `rsc.io/quote` の取り込みと `go mod tidy` / `go.sum` |
| 6 | **Create a module** の全体像（greetings ライブラリ + hello 実行プログラム、7 パート） |
| 7 | Part 1：greetings モジュールを作る（パッケージ・公開/非公開・`:=`・`fmt.Sprintf`） |
| 8 | Part 2：別モジュールから呼ぶ（`go mod edit -replace`） |
| 9 | Part 3：エラーを返して処理する（多値返却・`errors.New`・`log.Fatal`） |
| 10 | Part 4：ランダムな挨拶（スライス・`math/rand`） |
| 11 | Part 5：複数人への挨拶（map・`for range`） |
| 12 | Part 6：テストを追加する（`_test.go`・`go test -v`・わざと壊す） |
| 13 | Part 7：コンパイルとインストール（`go build` / `go install` / `go list -f '{{.Target}}'`） |
| 14 | チェックポイント：ここまでで身についた言語要素の一覧 |
| 15–16 | **Multi-module workspaces**：`go work init` / `go work use`、依存先を clone して書き換える |
| 17–18 | **Working with JSON**：`Marshal` / `Unmarshal`、構造体タグ、`any` と型スイッチ、`encoding/json/v2`（Go 1.27 時点の扱い） |
| 19 | トラブルシューティング（`declared and not used`、PATH、ツールチェーン切替、`replace` 漏れなど） |
| 20 | まとめ・次のステップ・参考資料 |

## 検証環境

- Go 1.27.1（2026-09-01 リリース、調査時点の最新）と go1.24.7 の両方で全ステップを実行し、出力を確認した（Linux / amd64）。
- `encoding/json/v2` は Go 1.27 で `GOEXPERIMENT` なしに import できることを確認した。Go 1.24 以前では `encoding/json` に読み替える。
- 乱数の結果やモジュールの版番号、ツールチェーンの自動ダウンロードのメッセージは実行時期・環境で変わる。

## 主な参考資料

- [Tutorials](https://go.dev/doc/tutorial/) — 公式チュートリアル一覧
- [Tutorial: Get started with Go](https://go.dev/doc/tutorial/getting-started)
- [Tutorial: Create a Go module](https://go.dev/doc/tutorial/create-module)（7 パート）
- [Tutorial: Getting started with multi-module workspaces](https://go.dev/doc/tutorial/workspaces)
- [Tutorial: Working with JSON](https://go.dev/doc/tutorial/json)
- [Download and install](https://go.dev/doc/install)、[Go toolchains](https://go.dev/doc/toolchain)、[Go Modules Reference](https://go.dev/ref/mod)
- [Go 1.27 Release Notes](https://go.dev/doc/go1.27)

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF。左右スワイプと画面端のクリックにも対応。`#9` のようなハッシュでページを直接指定できます。

HTML を直接編集します。表示・操作の構成は既存の `playwright-overview/index.html` に合わせています。JavaScript ライブラリへの依存はなく、Web フォントが取得できない場合は代替フォントを使います。
