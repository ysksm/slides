# CLAUDE.md

調査報告・解説スライドを集めたリポジトリ。各デッキは `<deck>/index.html`（ビルド不要の自己完結 HTML）と `<deck>/README.md` で構成され、ルートの `README.md` と `index.html` が目次。運用ルールの全文は `CONTRIBUTING.md`。

## 最重要ルール: 目次はデッキ作業で触らない

- **デッキ Issue（スライドの作成・修正）では、ルートの `README.md` と `index.html` を編集しない。** 変更は `<deck>/` 配下だけに閉じる。
- 目次の更新は **目次更新の Issue で単独に行う**。デッキ作成後は「目次を更新してほしい」と目次 Issue にコメントする（なければ作る）。
- 理由: 並行作業する全 PR が目次の同じ行を編集して必ず競合するため（Issue #23）。
- PreToolUse フック（`.claude/hooks/guard-toc.sh`）が目次ファイルの編集をブロックする。ブロックされたら回避策を探さず、目次 Issue で行う旨を報告して作業を続ける。`.toc-update` マーカーは `update-toc` Skill 以外で作らない。
- CI（`check-toc-separation.yml`）は、目次とデッキを同時に変更した PR を落とす。

## Skill

- `/new-deck` — 新しいデッキを作る（テンプレートのコピー、README の必須形式、はみ出し確認、目次に触らない PR）。
- `/update-toc` — 目次更新 Issue で、main にあって目次に未登録のデッキをすべて登録する。

## デッキの作り方（要点）

- 手書き HTML デッキは `playwright-overview/index.html` をテンプレートにする（1280x720、← → / O / F / P キー、`#n` ハッシュ）。
- `<deck>/README.md` の先頭は「H1 = 題名」「リード文に Issue リンクと `全 N 枚`」。目次更新はここを材料にする。
- 全スライドをヘッドレス Chrome で描画し、スライド下端（フッター 44px を除く）からのはみ出しがないことを確認する。
- Marp 製の `claude-code-commands` だけは `src/*.md` を編集して `./build.sh` で再生成する。

## Git

- 1 Issue = 1 ブランチ = 1 PR。PR の差分が担当範囲（デッキ or 目次 or ルール類）の外に及んでいないか、`git diff --name-only origin/main...HEAD` で出す前に確認する。
- コミットメッセージ・PR は日本語。
