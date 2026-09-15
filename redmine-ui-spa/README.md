# Redmine の UI を SPA で作るための技術

[Issue #26](https://github.com/ysksm/slides/issues/26) の解説。Rails 製の Redmine を「API サーバー」として扱い、UI を自前の SPA に置き換える方法、間に別の Web サーバー（リバースプロキシ / BFF）を挟む方法、デスクトップアプリ化する方法を、REST API の制約・認証・CORS・実装パターンの観点で整理しています（全 16 枚、調査日: 2026-09-14）。

- [HTML スライド](index.html): 全 16 枚。ビルド不要。

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF。左右スワイプにも対応。`#9` のようなハッシュでページを直接指定できます。

HTML を直接編集します。表示・操作の構成は `playwright-overview/index.html` に合わせています。JavaScript ライブラリへの依存はなく、Web フォントが取得できない場合は代替フォントを使います。

## 構成

| # | 内容 |
|---|---|
| 1 | 表紙 |
| 2 | 結論を先に：3 つの問い（UI 置き換え / 別 Web サーバー経由 / デスクトップ化）への答え |
| 3 | 前提：Redmine のアーキテクチャ（Rails + ERB + jQuery、プラグイン / テーマ、REST API）と置き換えの 3 つの面 |
| 4 | 土台：REST API の使い方（有効化・認証・ページング・include・添付）と「API 呼び出しにセッションは使われない」仕様 |
| 5 | REST API のカバレッジ表と、足りない部分の埋め方 |
| 6 | ① UI 置き換えの 3 方式（A 部分注入 / B プラグイン同居 SPA / C 完全分離 SPA）の比較 |
| 7 | ① 方式 A・B の実装：テーマ `theme.js`、プラグインのルート・コントローラ・セッション認証 JSON |
| 8 | ① 方式 C の技術選定（Vite / TanStack Query / zod など）と Redmine 固有の注意点 |
| 9 | ① ブラウザ直結で当たる 4 つの壁（CORS / API キーの置き場 / テキスト整形 / N+1 と 100 件上限） |
| 10 | ② 別 Web サーバーを挟む理由：L0 静的配信 〜 L4 フルスタックの段階と nginx 最小構成 |
| 11 | ② BFF の認証設計：本人 API キーの預かり / SSO + 管理者キー + `X-Redmine-Switch-User` |
| 12 | ② BFF が担うもの：画面単位の集約 API、整形 API と添付中継、更新検知（ポーリング） |
| 13 | ③ デスクトップ化の選択肢：PWA / ガワアプリ / Electron / Tauri v2 の比較 |
| 14 | ③ デスクトップ固有の設計項目（接続・資格情報・証明書・通知・オフライン・更新・署名）の Tauri / Electron 対比 |
| 15 | 推奨構成と段階的な進め方（API 棚卸し → SPA + プロキシ → BFF → プラグイン補完 → Tauri） |
| 16 | まとめと参考資料 |

## 主な参考資料

- [Redmine REST API](https://www.redmine.org/projects/redmine/wiki/Rest_api) — 認証・形式・資源一覧と成熟度・User Impersonation・添付
- [Plugin Tutorial](https://www.redmine.org/projects/redmine/wiki/Plugin_Tutorial) / [Hooks](https://www.redmine.org/projects/redmine/wiki/Hooks) / [Themes](https://www.redmine.org/projects/redmine/wiki/Themes)
- [redmine/redmine](https://github.com/redmine/redmine) — `application_controller.rb`（`find_current_user` / `api_request?` / `accept_api_auth`）
- [rack-cors](https://github.com/cyu/rack-cors) / [TanStack Query](https://tanstack.com/query/latest) / [Vite](https://vite.dev/)
- [Tauri v2](https://v2.tauri.app/) / [Electron](https://www.electronjs.org/docs/latest)
- [OpenProject](https://www.openproject.org/) — Redmine フォークが Rails + Angular SPA に移行した実例
