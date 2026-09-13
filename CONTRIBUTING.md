# 運用ルール（CONTRIBUTING）

[Issue #23](https://github.com/ysksm/slides/issues/23) で決めた、このリポジトリの運用ルールです。人間・Claude Code・Codex のいずれで作業する場合も同じルールに従います。

## 背景と問題

- スライドは 1 本ごとに Issue を立て、ブランチ（git worktree）を切って並行に作業している。
- これまでは「スライド作成」と「目次（ルート `README.md` / `index.html`）への登録」を同じ PR で行っていた。
- 目次は全 PR が同じ行の周辺（一覧の先頭）を編集するため、並行作業では **ほぼ必ず競合** し、main を取り込んで解消する作業が毎回発生していた。

## 方針（結論）

**スライド作成の PR では目次を更新しない。目次の更新は「目次更新」専用の Issue・PR で単独に行う。**

| 作業 | 触ってよいファイル | 触ってはいけないファイル |
|---|---|---|
| スライド作成・修正（デッキ Issue） | `<deck>/` 配下のみ（`index.html`, `README.md`, 資料, `examples/` など） | ルートの `README.md`、ルートの `index.html` |
| 目次更新（目次 Issue） | ルートの `README.md`、ルートの `index.html` | `<deck>/` 配下 |
| 運用ルール・ツール類の変更 | `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `.claude/`, `.agents/`, `.github/` | 目次・デッキ（同時に触らない） |

「目次」とは、次の 2 ファイルを指します。

- ルート `README.md` — 「スライド一覧」の表、各スライドの節、「リポジトリ構成」のツリー、「ビルド」「閲覧方法」のデッキ列挙
- ルート `index.html` — GitHub Pages のトップページ。`.deck` カードの一覧と `<meta name="description">`

## 作業の流れ

```
デッキ Issue #N ──▶ ブランチ ──▶ <deck>/ を作成・PR ──▶ merge
                                                      │
                                                      ▼
                                        目次 Issue にコメント（またはラベル）
                                                      │
目次 Issue #M ──▶ ブランチ（main 最新）──▶ 目次だけ更新・PR ──▶ merge ──▶ Pages 公開
```

1. **デッキ作成**: `<deck>/index.html` と `<deck>/README.md` を作る。`README.md` の先頭は「H1 = スライド題名」「リード文に Issue リンクと `全 N 枚`」の形にし、目次更新の材料をそろえておく。目次は触らない。
2. **PR**: 変更が `<deck>/` 配下だけであることを確認して PR を出す。CI（`.github/workflows/check-toc-separation.yml`）が、目次とデッキを同時に変更している PR を落とす。
3. **目次更新の依頼**: マージ後、「目次更新」Issue に「`<deck>/` を登録してほしい」とコメントする（未登録デッキが複数あればまとめて 1 回でよい）。
4. **目次更新**: 目次 Issue のブランチを main の最新から切り、未登録デッキをすべて登録する。この PR の差分はルート `README.md` と `index.html` のみ。
5. main へのマージで GitHub Pages が再公開される。

目次更新は「main にあるが目次に載っていないデッキを全部載せる」作業なので、どのタイミングで何回やっても結果は同じになります（冪等）。デッキ側の PR がいくつ並行していても目次では競合しません。

## エージェントへの徹底手段

ルールを文書に書くだけでは守られないため、次の 3 段で担保します。

| 段 | 仕組み | 対象 |
|---|---|---|
| 1. ルール文書 | `CLAUDE.md`（Claude Code）、`AGENTS.md`（Codex） | 各エージェントが毎セッション読む |
| 2. Skill | `.claude/skills/update-toc`, `.claude/skills/new-deck`（Claude Code）、`.agents/skills/update-toc`, `.agents/skills/new-deck`（Codex） | 手順を固定し、目次更新を機械的にする |
| 3. 強制 | Claude Code の PreToolUse フック（`.claude/hooks/guard-toc.sh`）が目次ファイルの編集を拒否。CI が目次とデッキの同時変更 PR を落とす | エージェント・人間の両方 |

フックは、`.toc-update` マーカーファイルがリポジトリルートにあるか、ブランチ名に `toc` を含む場合のみ目次の編集を許可します。`update-toc` Skill は開始時にマーカーを作り、終了時に消します。**デッキ Issue の作業中にマーカーを作ってはいけません。**

Codex 用の `AGENTS.md` と `.agents/skills/` は別セッションで作成します（内容は Claude Code 用と同一にする）。

## 将来の改善案（今回は実施しない）

- 各デッキに `deck.json`（題名・枚数・形式・Issue・概要・同梱物）を置き、スクリプトでルート `README.md` と `index.html` を生成する。目次更新が完全に自動化され、Skill も「スクリプトを実行する」だけになる。
