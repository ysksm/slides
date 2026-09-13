# Claude Code のトークン使用量と削減策 — 公式ドキュメントに基づく整理

Claude Code 公式ドキュメント（[code.claude.com/docs](https://code.claude.com/docs/en/costs)）に基づき、トークンがどう消費されるか、コンテキストウィンドウに何が乗るか、プロンプトキャッシュの仕組みと無効化条件、計測コマンド、削減策を **各スライド下部に出典 URL 付き** で整理した解説スライド（全 18 枚・自己完結型 HTML）。2026-09-13 時点のドキュメントを参照している。

## 閲覧方法

`index.html` をモダンブラウザで開くだけ。インストール・ビルド不要。

| 操作 | キー |
|---|---|
| 次へ / 前へ | `→` `Space` / `←` |
| 一覧表示 | `O` |
| 全画面 | `F` |
| 印刷 / PDF | `P` |

URL のハッシュ（`#7` など）でスライド番号を直接指定できる。

## 構成

| # | 内容 | 主な出典 |
|---|---|---|
| 1 | 表紙 | — |
| 2 | 結論を先に：コストは「コンテキストの大きさ × リクエスト回数」 | costs |
| 3 | トークンはどう消費されるか：エージェントループとリクエスト | costs, prompt-caching, how-claude-code-works |
| 4 | コンテキストウィンドウに何が乗るか（起動時の目安トークン数、機能別コスト） | context-window, features-overview |
| 5 | プロンプトキャッシュ①：先頭一致（3 層構造） | prompt-caching |
| 6 | プロンプトキャッシュ②：価格（読取 0.1×、Fable 5.1 は 0.025×） | platform pricing |
| 7 | プロンプトキャッシュ③：無効化する操作 / 維持される操作 | prompt-caching |
| 8 | プロンプトキャッシュ④：TTL（1 時間 / 5 分、`promptCacheTtl`） | prompt-caching |
| 9 | 使用量を計測する：`/usage`・`/context`・`/insights`・ステータスライン | costs |
| 10 | 削減策①：コンテキストを能動的に管理（`/clear`・`/compact`・`/rewind`・自動コンパクト） | costs, model-config |
| 11 | 削減策②：モデル・effort・extended thinking | costs, model-config |
| 12 | 削減策③：常駐コンテキストを削る（MCP・CLAUDE.md・スキル） | costs, features-overview |
| 13 | 削減策④：フック・スキル・サブエージェント・コードインテリジェンスにオフロード | costs |
| 14 | 削減策⑤：プロンプトと進め方（具体性・計画モード・早期修正・検証ターゲット） | costs |
| 15 | 長いセッションで使用量が膨らむ理由とバックグラウンド消費、エージェントチーム | costs, pricing |
| 16 | 組織での管理：支出の可視化・上限・レート制限目安 | costs |
| 17 | まとめ：チェックリスト | — |
| 18 | 出典一覧 | — |

## 主な参考資料

- [Manage costs effectively](https://code.claude.com/docs/en/costs)
- [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)
- [Explore the context window](https://code.claude.com/docs/en/context-window)
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [Extend Claude Code — Understand context costs](https://code.claude.com/docs/en/features-overview#understand-context-costs)
- [Model configuration](https://code.claude.com/docs/en/model-config)
- [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — Claude Platform
- 姉妹デッキ：[すぐ溶ける AI の利用枠 — キャッシュの仕組み（動画要約）](../ai-usage-cache/index.html)
