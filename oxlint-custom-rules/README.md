# Oxlint で独自の Lint ルールを作る — JS プラグイン実践

[Issue #33](https://github.com/ysksm/slides/issues/33) の解説スライド。Rust 製リンタ [Oxlint](https://oxc.rs/docs/guide/usage/linter) で独自の Lint ルールを作る方法を、**ESLint 互換の JS プラグイン API** を軸に整理します。最小構成・AST とセレクタ・context API・オプションと自動修正・高速版 `createOnce` API・RuleTester・設定（`jsPlugins`）・制限事項・性能、そして参考として Rust ネイティブルールの書き方まで扱います（全 21 枚、調査日: 2026-09-15）。

- [HTML スライド](index.html): 全 21 枚。ビルド不要。

## 構成

| # | 内容 |
|---|---|
| 1–2 | 表紙 / 結論を先に（独自ルールは JS プラグインで書く・Rust は原則不要・現状は alpha） |
| 3–4 | 前提となる Oxlint の姿、「独自ルール」を実現する 4 つの手段の比較 |
| 5–6 | 最小構成（3 ファイル）、プラグインとルールの解剖（`meta` / `create` / ビジタ / `context.report`） |
| 7–8 | AST とセレクタ、context から使える API の実装済み範囲と未対応範囲 |
| 9–10 | **実践**：禁止 import を検出するルール（TypeScript）、オプションと自動修正の付け方 |
| 11–12 | 高速版 API `createOnce` と before / after フック、`eslintCompatPlugin` による ESLint 両対応 |
| 13–14 | `RuleTester` でのテスト、`jsPlugins` の設定リファレンス（パス・npm・エイリアス） |
| 15–16 | 既存 ESLint 資産の再利用（互換テスト結果・`no-restricted-syntax`）、ルールの設計指針と運用 |
| 17–18 | 制限と注意点（型情報なし・独自ファイル形式・alpha）、性能（Node.js 移行ベンチと raw transfer） |
| 19–20 | 参考：Rust でネイティブルールを書く（oxc への貢献）、既存プロジェクトへの導入手順 |
| 21 | まとめ・参考資料 |

## 主な参考資料

スライド内の仕様・数値の出典は各スライドおよび 21 枚目に記載しています。

- [JS Plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins) — `jsPlugins` の設定、エイリアス、API 対応状況、互換テスト済みプラグイン一覧
- [Writing JS Plugins](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins) — `create` / `createOnce` / `before` / `after` / `RuleTester` の一次情報
- [Oxlint JS Plugins Alpha](https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha)（2026-03-11）— 互換テスト結果、Node.js リポジトリのベンチマーク、制限事項
- [Oxlint JS Plugins Preview](https://oxc.rs/blog/2025-10-09-oxlint-js-plugins.html)（2025-10-09）— raw transfer と遅延デシリアライズの設計解説
- [Automatic fixes](https://oxc.rs/docs/guide/usage/linter/automatic-fixes) / [Type-aware linting](https://oxc.rs/docs/guide/usage/linter/type-aware) / [Built-in plugins](https://oxc.rs/docs/guide/usage/linter/plugins)
- [@oxlint/plugins](https://www.npmjs.com/package/@oxlint/plugins) — `definePlugin` / `defineRule` / `eslintCompatPlugin` と型定義
- [oxlint](https://www.npmjs.com/package/oxlint) — バージョン（1.83.0）と動作要件（Node.js `^20.19.0 || >=22.12.0`）の出典
- [ESLint: Custom Rules](https://eslint.org/docs/latest/extend/custom-rules) / [Selectors](https://eslint.org/docs/latest/extend/selectors) — 互換元の API 仕様
- [oxc: Adding Linter Rules](https://oxc.rs/docs/contribute/linter/adding-rules.html) — Rust ネイティブルールの実装手順（スライド 19）

JS プラグインは 2026-09 時点で alpha とされており、API と対応状況は変化します。スライド内のルール実装例は解説用のサンプルで、動作するプラグインとして同梱はしていません。ベンチマーク値は公式ブログの掲載値であり、環境や構成によって変わります。

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF。左右スワイプと画面端のクリックにも対応。`#9` のようなハッシュでページを直接指定できます。

HTML を直接編集します。表示・操作の構成は既存の `playwright-overview/index.html` に合わせています。JavaScript ライブラリへの依存はなく、Web フォントが取得できない場合は代替フォントを使います。
