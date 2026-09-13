# 実施計画とタスク — 自動実装 × AI（Issue #16）

推奨案（案 A を軸に B のインポータと C のガードレールを吸収）の実施計画。スライド `index.html` の 29〜31 枚目に対応。工数は 1 名専任の目安。

## フェーズ計画

| フェーズ | 目安 | ゴール | 主な成果物 | 完了条件 |
|---|---|---|---|---|
| Phase 0 規約の固定 | 1 週 | 生成器なしでも「同じ形」で書ける | 手書きゴールデン集約 `Order`（4 レイヤー + テスト）、`CONVENTIONS.md`、arch lint、レジストリ取り込みの 1 行 | arch lint が CI で通る。2 人目が Order を見て別集約を同じ形で書ける |
| Phase 1 生成器 MVP | 1〜2 週 | Domain + Infrastructure を決定論で生成 | `spec.schema.json`、`gen apply / check`、Domain / Infra テンプレート、レジストリ（di）、ゴールデンテスト | spec から生成した Order がゴールデンと一致。`gen check` が CI で通る |
| Phase 2 4 レイヤー化 | 1〜2 週 | Application + Presentation を生成 | ユースケース / slice / Hook / 3 画面 / stories テンプレート、レジストリ（store, routes）、テスト用バックエンドの handlers | 2 つ目の集約（Customer）を spec だけから生成し、画面が動く |
| Phase 3 TypeSpec 接続 | 1 週 | IDL-first と Domain-first の往復 | `gen import tsp`（openapi3 経由）、`gen export tsp`、`gen check` の API 整合チェック | 既存の tsp から spec 草案が出て、TODO(ai) を埋めれば生成できる |
| Phase 3b（任意） | 1 週 | デコレータで意味を IDL に載せる | `@myorg/typespec-ddd`、インポータ拡張 | デコレータ付き tsp から TODO(ai) 無しの spec が出る |
| Phase 4 AI 統合 | 1 週 | スキル 1 回で spec → 生成 → TODO 埋めまで | `.claude/skills/gen/SKILL.md`、Hook、3 起点のプロンプト、（任意）MCP ツール | 3 起点それぞれで新集約を AI 主導で追加できる。`.gen.ts` の手編集が Hook で止まる |
| Phase 5 展開と計測 | 継続 | 実案件で 3 集約に適用し改善 | 計測、テンプレート改訂、README | 新集約 1 つの 4 レイヤー骨格が 30 分以内。drift 0 |

Phase 1 の「ゴールデン一致」が全体の要。ここが通らないうちは Phase 2 に進まない。

## タスク一覧

### Phase 0 規約の固定

- [ ] **T-01** ゴールデン集約 `Order` の Domain を手書き（`OrderId` / `Money` / `Quantity` / `OrderLine` / `Order` / `OrderRepository` / `Order.spec.ts`）
- [ ] **T-02** 同 Application（`PlaceOrder` / `ListOrders` / `ports`）と Infrastructure（`OrderApiRepository` / `OrderTestRepository` / `OrderMapper`）　依存: T-01
- [ ] **T-03** 同 Presentation（`orderSlice` / `useOrders` / List / Detail / Form / stories）　依存: T-02
- [ ] **T-04** `CONVENTIONS.md`：命名・配置・依存の向き・ID / VO / DTO の作法・create-only と `.gen.ts` の扱い・「Zone 3 は生成しない」
- [ ] **T-05** arch lint 導入（eslint-plugin-boundaries または dependency-cruiser）と CI 組み込み
- [ ] **T-06** 手書き側に `registry/*.gen.ts` を spread する取り込み口を用意（DI / store / routes）
- [ ] **T-07** テスト用バックエンドの現状整理：形式（MSW / 別サーバー）、フィクスチャの置き場、DI の `mode` 切替方法
- [ ] **T-08** 未解決論点の決定（`notes.md` §10）：DI コンテナ、Redux の書き方、VO の表現、spec の配置

### Phase 1 生成器 MVP

- [ ] **T-10** `spec.schema.json` v1（集約 / Entity / VO / ID / ref / useCases / api / presentation / generate）。`examples/spec.schema.json` を叩き台に
- [ ] **T-11** `tools/gen` 雛形：CLI、spec 読み込み・ajv 検証・正規化（派生名 `OrderRepository` / `useOrders` / `orderSlice` の決定）
- [ ] **T-12** ライタ：create-only / always / registry の 3 戦略、`--dry-run`、`--json`
- [ ] **T-13** Domain テンプレート（Id / VO / Entity / Repository / spec）　依存: T-01
- [ ] **T-14** Infrastructure テンプレート（ApiRepository / TestRepository / `Mapper.gen` / `Dto.gen`）　依存: T-02
- [ ] **T-15** レジストリ生成（`di.gen.ts`）　依存: T-06
- [ ] **T-16** Prettier 固定・来歴ヘッダ・出力順序の固定
- [ ] **T-17** ゴールデンテスト：Order の spec → 生成物 == 手書き　依存: T-13, T-14
- [ ] **T-18** `gen check` と CI 組み込み、スナップショットテスト

### Phase 2 4 レイヤー化

- [ ] **T-20** Application テンプレート（UseCase / `ports.gen` / spec）　依存: T-17
- [ ] **T-21** Presentation テンプレート（slice / Hook / List / Detail / Form / stories）　依存: T-03
- [ ] **T-22** レジストリ生成（`store.gen.ts` / `routes.gen.ts`）
- [ ] **T-23** テスト用バックエンド `handlers.gen.ts` とフィクスチャ生成（決定論的な固定 ID）　依存: T-07
- [ ] **T-24** 結合テスト雛形（ApiRepository ⇄ テスト用バックエンド）
- [ ] **T-25** `--layers / --only / --skip / --force` の実装とテスト
- [ ] **T-26** 2 つ目の集約 `Customer` を spec だけから生成し、画面が動くことを確認。ゴールデンを Order + Customer に拡張
- [ ] **T-27** `.gen.ts` 手編集検出の lint ルール（来歴ヘッダ必須・変更禁止）

### Phase 3 TypeSpec 接続

- [ ] **T-30** `gen import tsp`：`tsp compile`（`@typespec/openapi3`）→ spec 草案。VO / ref / 集約境界は `TODO(ai)` 付きで空欄
- [ ] **T-31** `gen export tsp`：spec → `*.draft.tsp`
- [ ] **T-32** `gen check` に API 整合（operations の存在、DTO フィールド集合）を追加
- [ ] **T-33** 既存 tsp 1 本で import → 生成まで通す検証
- [ ] **T-34**（3b・任意）`@myorg/typespec-ddd` デコレータ（`@aggregate` `@valueObject` `@id` `@ref` `@useCase`）とインポータ拡張

### Phase 4 AI 統合

- [ ] **T-40** `.claude/skills/gen/SKILL.md`：3 起点の手順、禁止事項、`spec.schema.json` / `CONVENTIONS.md` への参照、TODO を埋める順序（Domain → Application → Presentation）
- [ ] **T-41** Hook：PostToolUse（Write/Edit）で prettier + `tsc --noEmit`、PreToolUse（Write）で `*.gen.ts` を拒否、Stop で `gen check` + 該当集約のテスト
- [ ] **T-42** 3 起点それぞれのプロンプト例と期待する spec の例（テストケースとして保存）
- [ ] **T-43**（任意）MCP ツール `gen_apply(spec, layers?, dryRun?)` / `gen_check()` / `gen_import_tsp(file)`。入力スキーマ = `spec.schema.json`
- [ ] **T-44** 3 起点で新集約を AI 主導で追加するリハーサル。所要時間と手直し行数を記録

### Phase 5 展開と計測

- [ ] **T-50** 実案件の 3 集約に適用
- [ ] **T-51** 計測：骨格生成の所要時間、TODO 埋めの所要時間、生成物への手直し行数、drift 件数
- [ ] **T-52** テンプレート改訂（手直しが多い箇所を規約に戻す）
- [ ] **T-53** README と導入手順

## 各フェーズ末の継続判断

| フェーズ末 | 継続の条件 | 止めた場合に残るもの |
|---|---|---|
| Phase 0 | 2 人目が同じ形で別集約を書けた | 規約付き AI 生成（案 C） |
| Phase 1 | ゴールデン一致が通った | Domain / Infra の決定論生成 |
| Phase 2 | Customer が spec だけで動いた | 4 レイヤー生成（spec は手書き） |
| Phase 3 | 既存 tsp から生成まで通った | IDL-first の高速化 |
| Phase 4 | 3 起点のリハーサルが通った | スキル 1 回で完結 |

## リスクと対策

| リスク | 対策 |
|---|---|
| 生成物が「貧血ドメイン」になる | 生成器は骨格と TODO のみ。invariants を spec の必須項目にし、failing test を出す |
| テンプレートと手書きの乖離 | ゴールデンテストを CI で常時実行。乖離したらどちらかを直す |
| 再生成で手編集が消える | create-only 既定、`--force` は名指し、dry-run の承認をワークフローに固定 |
| spec と TypeSpec の二重管理 | インポータ / エクスポータと `gen check` の API 整合チェック |
| AI が生成器を迂回して直接書く | Hook で `.gen.ts` 書き込みを拒否。骨格ファイルは arch lint と構造テストで検出 |
| テンプレートの肥大化 | 「Zone 3 は生成しない」を CONVENTIONS に明記。分岐を増やす前に spec の項目を疑う |
| 初期コストが回収できない | Phase 0 → 1 の順で、各フェーズ末に継続判断。Phase 0 は案 C としてそのまま使える |

## 成功指標

- ゴールデンテスト・スナップショット・`gen check` が CI で常時緑
- 新集約 1 つの 4 レイヤー骨格が 30 分以内（spec 作成 → dry-run 承認 → apply → tsc 緑）
- 生成物（create-only）への「骨格そのものの手直し」が集約あたり 10 行未満
- `.gen.ts` の手編集が 0 件（Hook と lint で検出）
- 3 起点（IDL / Domain / UI）のいずれからでも同じ手順で追加できる
