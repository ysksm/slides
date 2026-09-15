# tgrep 解説 — トライグラム索引・AI エージェント連携・プラグイン化

[Issue #29](https://github.com/ysksm/slides/issues/29) の解説スライド。Microsoft の [tgrep](https://github.com/microsoft/tgrep)（トライグラム索引付き grep）について、速さの仕組みとコマンド体系・ripgrep との違いを押さえたうえで、**AI コーディングエージェントへの組み込み方**と、**Claude Code プラグインとして配布して使わせる方法**までを扱います（全 21 枚、調査日: 2026-09-15）。

- [HTML スライド](index.html): 全 21 枚。ビルド不要。

## 構成

| # | 内容 |
|---|---|
| 1–2 | 表紙 / 結論を先に（索引付き grep・エージェント連携・プラグイン化） |
| 3 | tgrep とは何か（ripgrep・Zoekt との位置づけ） |
| 4–5 | 仕組み：トライグラム転置索引の原理、3 層インデックスと常駐サーバー |
| 6 | 実測ベンチマークと、その数字の読み方 |
| 7–8 | 導入・初期セットアップ、`index` / `serve` / `status` |
| 9–10 | 検索フラグ早見表、機械可読な出力と終了コード |
| 11 | ripgrep との違いと落とし穴（索引の鮮度・フラグ不整合・既定値） |
| 12–15 | **AI エージェント連携**：なぜ効くのか、公式 `AGENTS.md` の作法、ツール定義と安全設計、実運用ワークフロー |
| 16–20 | **プラグイン化**：目的、構成と `plugin.json`、SessionStart フックと Skill、Skill + Bash と MCP の比較、検証と配布 |
| 21 | まとめ・参考資料 |

## 主な参考資料

スライド内の仕様・数値の出典は各スライドおよび 21 枚目に記載しています。

- [microsoft/tgrep](https://github.com/microsoft/tgrep) — 本体リポジトリ。コマンド一覧とベンチマーク値の出典
- [tgrep/AGENTS.md](https://github.com/microsoft/tgrep/blob/main/AGENTS.md) — エージェント向けの作法（`--` の前置、フラグ整合、索引の鮮度、終了コード、ツールスキーマ）
- [github/copilot-cli](https://github.com/github/copilot-cli) — tgrep を検索基盤として統合している実例
- [Claude Code: Create plugins](https://code.claude.com/docs/en/plugins) / [Plugins reference](https://code.claude.com/docs/en/plugins-reference) / [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)

ベンチマーク値は tgrep README の掲載値であり、実測環境によって変わります。スライド内のプラグイン実装例（`plugin.json`、`hooks.json`、`SKILL.md`、`marketplace.json`）は解説用の設計例で、動作するプラグインとして同梱はしていません。

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF。左右スワイプと画面端のクリックにも対応。`#9` のようなハッシュでページを直接指定できます。

HTML を直接編集します。表示・操作の構成は既存の `playwright-overview/index.html` に合わせています。JavaScript ライブラリへの依存はなく、Web フォントが取得できない場合は代替フォントを使います。
