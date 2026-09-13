# 推奨案 C — 実施タスク

[設計](design.md) / [スライド](index.html#24) / [Issue #16](https://github.com/ysksm/slides/issues/16)

以下は今後の実装 backlog。すべて未着手。担当は役割の提案であり、個人への割当ではない。期間は T01 完了後に見積もる。GitHub Issue を作成・投稿したものではない。

## 依存関係とマイルストーン

```text
P0  T01 → T02
P1  T02 → T03 → T04 → T05
P2  T05 → T06 → T07 → T08
                 └→ T09（完了には T08 も必要）
P3  T09 → T10 → T11
P4  T11 → T12
```

P2 完了が最初の PoC。P3 は入力経路の拡張。P4 は継続採用判断後の追加開発。

## P0：既存規約を確定

- [ ] **T01：代表機能と開発環境を調査** — frontend / API 担当
  - 依存：なし。
  - 成果物：既存 1 機能のフォルダ・依存図、命名規則、DI と Redux の使い方、UI 部品、backend 起動・seed・reset 手順。
  - 受け入れ条件：既存の一覧・詳細がローカルで動き、型検査と既存テストを実行できる。実際の代表 Entity を確定し、Product は必要に応じて置き換える。
- [ ] **T02：ドメイン契約と生成所有権を決定** — domain / frontend 担当
  - 依存：T01。
  - 成果物：ID 採番・形式、VO 制約、Repository の操作・結果型、Controller / UseCase 分担、ファイル別の所有区分。
  - 受け入れ条件：一覧・詳細に必要な業務ルールとエラーが確定し、すべての対象ファイルに「生成専用 / 初回のみ / 手書き」が付く。保留事項に生成を止める対象を付記する。

## P1：決定論的な生成器の中核

- [ ] **T03：Feature Spec schema と正規化を実装** — 生成器担当
  - 依存：T02。
  - 成果物：version 付き schema、手動入力 adapter、provenance、正規化処理、診断形式。
  - 受け入れ条件：未知キー・重複識別子・不正 enum・未解決参照・必須の業務ルール欠落を拒否する。入力順が変わっても正規化結果が同一になる。
- [ ] **T04：依存解決と plan を実装** — 生成器担当
  - 依存：T03。
  - 成果物：targets の依存グラフ、existing binding 検証、plan.json、レビュー用 diff。
  - 受け入れ条件：domain のみ、UI のみ、全レイヤーを検証する。不足依存を列挙して書き込みゼロ。既存 binding で充足できる場合は対象外ファイルを変更しない。循環と型不一致を拒否する。
- [ ] **T05：apply、所有 manifest、復旧を実装** — 生成器担当
  - 依存：T04。
  - 成果物：入力・toolchain・template・対象内容の hash、所有一覧、排他、事前検証、一時出力、復旧処理。
  - 受け入れ条件：同一入力を 2 回実行して所有ファイルと bytes が一致する。手編集・古い plan・新規パス衝突・出力範囲外のパスで無変更。所有ファイル削除を plan に表示し、他のファイルを削除しない。書き込み失敗とプロセス中断から復旧できる。

## P2：1 機能を縦に接続

- [ ] **T06：Domain と Repository port の recipe を作成** — domain / 生成器担当
  - 依存：T05。
  - 成果物：Entity、ID / VO、Repository interface、独立した業務 fixture。
  - 受け入れ条件：ProductId と別 Entity の ID の混用を型エラーにする。不正 ID / VO を実行時に拒否する。Domain が React / Redux / HTTP / DI ライブラリを import しない。
- [ ] **T07：UseCase、HTTP Repository、mapper と DI を接続** — frontend / API 担当
  - 依存：T06。
  - 成果物：一覧・詳細の UseCase、DTO 検証、mapper、HTTP Repository、fake、Composition Root。初期は手動の contract binding を利用可能。
  - 受け入れ条件：UseCase は interface のみを参照する。同じ port を fake / HTTP で差し替えられる。不正 DTO・404・通信失敗が合意した結果に変換される。
- [ ] **T08：一覧・詳細 UI の recipe を作成** — frontend 担当
  - 依存：T07。
  - 成果物：React 画面、Hook / Controller、ViewModel、必要な Redux 接続、初回雛形の拡張箇所。
  - 受け入れ条件：loading / empty / error を表示でき、一覧から詳細へ移動できる。Redux に Entity / Repository のインスタンスを保存しない。手書き UI 拡張が再生成で保持される。
- [ ] **T09：テスト用 backend と CI の受け入れ検証を整備** — frontend / API / 生成器担当
  - 依存：T07、完了時に T08。
  - 成果物：backend の起動待機・seed / reset、fake と HTTP の共通 port 契約テスト、E2E、固定 toolchain の CI。
  - 受け入れ条件：一覧・詳細の成功と異常系がテスト用 backend で通る。型・依存方向・再生成差分ゼロ・手書き保持・途中失敗からの復旧を CI で確認する。同じ定義から作ったテストだけに頼らず、不正応答 fixture も確認する。

## P3：TypeSpec と AI の入力経路

- [ ] **T10：TypeSpec → OpenAPI adapter と後追い IDL を検証** — API / 生成器担当
  - 依存：T09。
  - 成果物：version 固定の compiler / emitter 設定、OpenAPI adapter、明示 mapping、contract 差分レポート。
  - 受け入れ条件：同じ意味の手動入力と IDL 入力から、同一の正規化内容と生成物を得る（provenance の違いは別管理）。IDL 後追いで fake から HTTP に差し替えられる。nullable・enum・独自 scalar・破壊的変更を黙って変換しない。情報欠落時は独自 emitter の要否を記録する。
- [ ] **T11：AI の構造化設定提案を接続** — 生成器 / frontend 担当
  - 依存：T10。
  - 成果物：入力 schema、対象選択のガイド、診断を使う修正フロー、確定 Spec / plan の保存。
  - 受け入れ条件：AI が生成対象と不足情報を提案できる。未解決業務ルールや未知のオプションで実行を止める。任意 shell や対象外の書き込みを許可せず、AI を呼ばなくても確定入力から再生成できる。

## P4：拡張と継続採用判断

- [ ] **T12：2 機能目で評価し、書き込み操作と migration を計画** — frontend / domain / 生成器担当
  - 依存：T11。
  - 成果物：2 機能目の結果、手修正の分類、レビュー時間・不具合記録、CRUD / schema migration の次期 backlog。
  - 受け入れ条件：生成後の差分ゼロ・手書き保持を満たし、規約を再利用して定型作業が減ることを確認する。作成時の採番、更新競合、削除確認、権限、schema 変更の扱いを決めてから書き込み recipe に着手する。

## PoC の完了チェック（P2）

- [ ] 確定入力と固定 toolchain から 2 回生成し、差分がゼロ。
- [ ] 手書き domain / UI / DI を維持し、生成専用ファイルへの手編集は競合として停止。
- [ ] 部分生成の不足依存を検出し、対象外のファイルを変更しない。
- [ ] plan 後の編集・衝突・途中失敗から、意図しない部分更新を防止・復旧できる。
- [ ] ID 混用・不正 API 応答を検出し、レイヤーの依存方向を検査できる。
- [ ] fake と HTTP の契約が一致し、テスト用 backend で一覧 → 詳細が完了。
