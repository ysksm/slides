# Claude Code コマンド一覧（スライド）

GitHub issue [#2 claude codeのコマンド一覧](https://github.com/ysksm/slides/issues/2) 対応のスライド群です。
Claude Code のスラッシュコマンド・CLI コマンド/フラグ・キー操作をジャンル別に整理し、1 コマンド 1 スライドで解説したうえで、公式ベストプラクティスに基づくユースケースと類似コマンドの使い分けをまとめています。

対象バージョン: Claude Code v2.1.269（2026-09 時点の公式ドキュメント `code.claude.com/docs` と `claude --help` に基づく）。

## デッキ構成

| ファイル | 内容 | スライド数 |
| --- | --- | --- |
| [index.html](index.html) | 目次ページ | - |
| [01-overview.html](01-overview.html) | コマンドの種類、全ジャンルの一覧と一行解説 | 18 |
| [02-session-context-model.html](02-session-context-model.html) | セッション管理 / コンテキスト・メモリ・計画 / モデル・性能（27 コマンド、1 コマンド 1 スライド） | 32 |
| [03-review-parallel-permissions.html](03-review-parallel-permissions.html) | レビュー・検証 / 並列・自動化・ワークフロー / 権限・設定・UI（33 コマンド） | 38 |
| [04-extensions-integrations-account.html](04-extensions-integrations-account.html) | 拡張（Skill / Plugin / MCP）/ 連携・リモート / アカウント・利用状況 / 診断 / 廃止（50 コマンド） | 53 |
| [05-cli-shortcuts-skills.html](05-cli-shortcuts-skills.html) | `claude` CLI サブコマンド、用途別フラグ、キー操作、SKILL.md による自作コマンド | 41 |
| [06-usecases.html](06-usecases.html) | ユースケース、`/advisor` やダイナミックワークフローの要否、類似コマンドの使い分け、失敗パターン | 19 |

HTML はそれぞれ単体で開けます（Marp で生成した自己完結型 HTML）。矢印キーで送り、`F` で全画面、`P` でプレゼンターモード。

## ビルド

ソースは `src/*.md`（[Marp](https://marp.app/) 形式）、テーマは `theme/claude.css` です。Node.js があれば次で再生成できます。

```bash
./build.sh            # src/*.md → ./*.html
./build.sh --pdf      # PDF も欲しい場合
```

## 情報源

- Commands reference: https://code.claude.com/docs/en/commands
- CLI reference: https://code.claude.com/docs/en/cli-reference
- Interactive mode: https://code.claude.com/docs/en/interactive-mode
- Skills: https://code.claude.com/docs/en/skills
- Best practices / Costs / Advisor / Workflows / Agents / Permission modes / Scheduled tasks / Routines / Memory / Headless / Worktrees（すべて `code.claude.com/docs/en/` 配下）
- 外部: claude.com/blog/the-advisor-strategy、Thoughtworks Technology Radar、simonwillison.net、Zenn / Qiita / ENECHANGE 技術ブログ（06 デッキの各スライドに出典を記載）
