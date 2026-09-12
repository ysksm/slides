# Playwright 概要 — ライブラリ・CLI・MCP

Playwright の 3 つの利用形態を整理した解説スライド（全 16 枚・自己完結型 HTML）。

- **① ライブラリ / テストランナー**（`@playwright/test`）— 通常の Playwright
- **② CLI**（`npx playwright ...`：install / codegen / test / UI モード / Trace Viewer など）
- **③ MCP**（`@playwright/mcp`：AI エージェント向けブラウザ操作サーバー）

それぞれについて **利用シーン・メリット/デメリット・関係する要素技術**（Locator / auto-waiting / web-first assertion / アクセシビリティツリー / CDP・独自プロトコル / BrowserContext / Trace）を解説し、最後に **確実性の高いテストコード作成の順序**（探索 → 雛形生成 → ロケータ堅牢化 → 検証設計 → 安定性の証明 → CI 固定・自己修復）をまとめている。

## 閲覧方法

`index.html` をモダンブラウザで開くだけ。インストール・ビルド不要。

| 操作 | キー |
|---|---|
| 次へ / 前へ | `→` `Space` / `←` |
| 一覧表示 | `O` |
| 全画面 | `F` |
| 印刷 / PDF | `P` |

URL のハッシュ（`#5` など）でスライド番号を直接指定できる。

## 構成

| # | 内容 |
|---|---|
| 1 | 表紙 |
| 2 | 結論を先に：3 つの顔の使い分け |
| 3 | Playwright とは何か（類似ツール比較含む） |
| 4 | アーキテクチャと要素技術 ①（プロトコル・BrowserContext・プロセス外自動化） |
| 5 | 要素技術 ②（Locator・auto-waiting・web-first assertion） |
| 6 | 3 つの利用形態の全体像 |
| 7–8 | ① ライブラリ/テストランナー：利用シーン・メリデメ |
| 9–10 | ② CLI：コマンド一覧・利用シーン・メリデメ |
| 11–13 | ③ MCP：仕組み・利用シーン・メリデメ |
| 14 | 使い分け早見表 |
| 15 | 確実性の高いテストコード作成の順序 |
| 16 | まとめ・参考資料 |

## 主な参考資料

- [playwright.dev](https://playwright.dev/) — 公式ドキュメント
- [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) — Playwright MCP サーバー
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Agents](https://playwright.dev/docs/test-agents)
