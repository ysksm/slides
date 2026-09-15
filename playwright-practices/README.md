# Playwright 活用方法 — 画面遷移図・デグレ防止・ローカライズ資料

[Issue #34](https://github.com/ysksm/slides/issues/34) の解説資料。Playwright を「テストを書く道具」ではなく **「実物のブラウザから資料と安全網を作る道具」** として使う手順をまとめた。React アプリの画面一覧の作り方、実キャプチャ付きの画面遷移図（メイン＝ツリー／補助線＝横断リンク）の生成、遷移パラメータの洗い出し、リファクタのデグレを止めるスポット UI テスト、ヘッドレス実行、ローカライズ時の UI 資料づくりまでを扱う（全 18 枚、調査日: 2026-09-15）。

- [HTML スライド](index.html): 全 18 枚。ビルド不要。

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、O で一覧、F で全画面、P で印刷/PDF。`#9` のようなハッシュでページを直接指定できます。

## 構成

| # | 内容 |
|---|---|
| 1 | 表紙 |
| 2 | 結論を先に：4 つの成果物を「1 本の探索コード」から作る |
| 3 | 全体像：ルート定義 → 実測 → 中間 JSON → 成果物 |
| 4 | React アプリの画面一覧をどう作るか（静的抽出 / 実行時ダンプ / クロール） |
| 5 | 「画面」の単位を決める：ルート × 状態バリアント |
| 6 | 画面間の関係を洗い出す（Outlet・Link・navigate・redirect） |
| 7 | 遷移パラメータを洗い出す（path / query / location.state / loader） |
| 8 | 実キャプチャを撮る：決定性を先に作る |
| 9 | 図の前にデータを決める：graph.json |
| 10 | カスケード構造：メインは木、横断は補助線 |
| 11 | 図を生成する：Graphviz にキャプチャを埋め込む |
| 12 | リファクタのデグレ防止：スポット UI テスト |
| 13 | 金型を先に撮る：before / after の回し方 |
| 14 | ヘッドレスでの実行：ローカル・Docker・CI |
| 15 | ローカライズ時の UI 資料を作る |
| 16 | ベストプラクティス |
| 17 | 進め方：5 ステップで立ち上げる |
| 18 | まとめと参考資料 |

## 主な参考資料

- [Screenshots](https://playwright.dev/docs/screenshots) / [Visual comparisons](https://playwright.dev/docs/test-snapshots) / [Aria snapshots](https://playwright.dev/docs/aria-snapshots)
- [Emulation](https://playwright.dev/docs/emulation)（`locale` / `timezoneId` / `viewport`）・[Clock](https://playwright.dev/docs/clock)・[Mock APIs](https://playwright.dev/docs/mock)
- [Browsers](https://playwright.dev/docs/browsers)（Chromium Headless Shell）・[Docker](https://playwright.dev/docs/docker)・[CI](https://playwright.dev/docs/ci)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [React Router](https://reactrouter.com/) — ルート定義・`Outlet`・loader / action
- [Graphviz attributes](https://graphviz.org/doc/info/attrs.html) — `rank` / `constraint` / `image`

関連デッキ: [playwright-overview](../playwright-overview/) — Playwright の 3 つの利用形態（ライブラリ・CLI・MCP）の概要。
