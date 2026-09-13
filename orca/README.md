# Orca 解説 — AI エージェント時代のオーケストレーター IDE

Claude Code・Codex・Cursor CLI などの CLI エージェントを、タスクごとに独立した git worktree で並列に走らせ、一か所で追跡・レビュー・出荷するデスクトップ IDE「Orca」（[stablyai/orca](https://github.com/stablyai/orca)、MIT）の解説スライド（全 42 枚・自己完結型 HTML）。GitHub Issue [#3](https://github.com/ysksm/slides/issues/3) に対応。

- **機能一覧** — 全機能を「機能 / 1 行解説 / 主な設定場所」の表で（6 枚）
- **機能ごとの解説と設定** — Worktree、リポジトリ／ワークスペースの切り方、エージェント状態、タスク管理、オーケストレーション、オートメーション、CLI、レビュー、実行環境
- **マルチリポで 1 タスク** — プロジェクトグループ + フォルダワークスペース、親子 worktree、オーケストレーション Run の 3 パターンと具体手順
- **組み合わせレシピ** — Issue 駆動の 1 タスク、3 エージェント競争、夜間オートメーション、オーケストレーション運用、マルチリポ運用

## 閲覧方法

`index.html` をモダンブラウザで開くだけ。インストール・ビルド不要（Web フォントのみ Google Fonts を参照）。

| 操作 | キー |
|---|---|
| 次へ / 前へ | `→` `Space` `PageDown` / `←` `PageUp` |
| 最初 / 最後へ | `Home` / `End` |
| 目次 | `O` または `T` |
| 全画面 | `F` |
| 印刷 / PDF | `P` |

URL のハッシュ（`#12` など）でスライド番号を直接指定できる。スライド面のクリック（右 60% で次へ、左 40% で前へ）とスワイプにも対応。

## 構成

| # | 章 | 内容 |
|---|---|---|
| 1–3 | はじめに | 表紙、Orca とは、基本フロー（add → worktree → agent → split → diff → ship） |
| 4–9 | 機能一覧 | ワークスペース / エージェント / レビューと出荷 / タスク管理・自動化・CLI / 実行環境・モバイル・端末 / エディタ・ブラウザ・その他 |
| 10–16 | ワークスペース設計 | Worktree モデル、リポジトリの切り方、ワークスペースの 5 種類、新規 worktree の初期化設定（`orca.yaml` / `.worktreeinclude` / Hooks / `--setup`）、マルチリポで 1 タスク（3 パターンと具体手順） |
| 17–21 | エージェントとタスク管理 | 状態検出と起動既定、Dashboard / Agents feed / 通知、GitHub・GitLab・Linear・Jira 連携、Workspace status とチェックポイント |
| 22–26 | オーケストレーション | コアモデル（Run / Task / Dispatch / Message / Gate）、監督ループのコマンド、ワーカー契約・質問・ゲート・復旧、3 段階の使い分け |
| 27–29 | オートメーション | 作成と設定項目、運用のコツ |
| 30–32 | CLI とレビュー | Orca CLI とスキル、Diff / Annotate AI Diff / Attribution、コミット・PR・チェック |
| 33–36 | 作業環境 | ターミナル・エディタ・ナビゲーション、ブラウザと Design Mode、実行環境 4 モード、モバイル・ハイバネーション・復元・使用量 |
| 37–40 | 組み合わせレシピ | ①② Issue 駆動 / 3 エージェント競争、③④ 夜間オートメーション / オーケストレーション運用、⑤ マルチリポ運用 |
| 41–42 | まとめ | 設定チートシート、まとめと参考リンク |

## 出典

- stablyai/orca の `README.md` と `docs/site/content/docs/*.mdx`（2026-09-12 時点のクローン）
- インストール済み Orca Desktop 1.4.200

Orchestration、Cloud VM、Agent hibernation、Agent Dashboard は実験的機能（Settings → Experimental）で、仕様が変わる可能性がある。
