# 自動実装と AI の組み合わせ — 検討記録・詳細設計

対象：[Issue #16](https://github.com/ysksm/slides/issues/16)。作成・公式資料確認日：2026-09-13。

この文書は設計提案であり、生成器の実装報告ではない。`scaffold` CLI、Feature Spec、ファイル構成、型名は提案上の名称。既存の業務アプリは本リポジトリに含まれず、採用済みライブラリやコード規約は未確認。

## 1. 目的と前提

モデルの情報を与えて、Rails の generate のように必要な UI、モデル、Controller、Repository を生成する。AI は入力の不足を整理して構造化設定と生成対象を提案し、ファイル出力は固定したスクリプトに任せる。IDL が先行しない機能にも対応し、生成範囲は実行ごとに選択する。

Issue の指定は、React・Hooks・Redux、ドメイン駆動設計、レイヤードアーキテクチャと DIP、厳密な ID / Value Object、Entity 中心のモデル、Repository パターンと DI、テスト用 backend、TypeSpec。`Reduxl` は Redux と解釈した。TypeScript の利用と、Product の一覧・詳細を最初の例にすることは本提案の仮定。

初期対象は単純な 1 集約の読み取り機能。作成・更新・削除、集約間の業務フロー、複雑な権限、楽観更新、既存ファイルへの AST 変更は後続段階とする。

## 2. 検討記録

以下は論点・選択肢・判断根拠の記録。未知の事項は決定済みとして扱わない。

| 論点 | 比較した選択肢 | 暫定判断と理由 | 再検討条件 |
|---|---|---|---|
| 入力の中心 | CLI 引数、TypeSpec 拡張、共通生成定義 | 共通定義を採用。IDL の確定順に依存せず入力を受けられる | 全機能が IDL 先行で固定された場合 |
| API と domain の関係 | DTO を Entity にする、別定義を対応付ける | 別定義。API の形だけでは ID の意味や集約境界を決められない | 単純な参照専用 DTO 画面は別 recipe として許容可能 |
| 部分生成 | 不足依存を自動生成、停止して選択を求める | 不足を plan に列挙して停止。選択外への暗黙の書き込みを避ける | 明示された「依存も生成」オプションを導入する場合 |
| 再生成 | 上書き、AST 更新、所有領域の分離 | 生成専用領域と初回のみの雛形を分離 | 更新パターンが安定し、AST 変換の検証が可能になった場合 |
| TypeSpec 連携 | OpenAPI 経由、独自 emitter | 初期は OpenAPI adapter。独自意味情報は補助定義に置く | 必須の型・decorator 情報が OpenAPI で欠落する場合 |
| AI の実行単位 | 自由な shell、JSON 引数 | schema 検証済み引数を許可された実行ファイルに渡す | 生成器にない例外実装は別のレビュー対象として扱う |
| UI 生成範囲 | CRUD 全自動、一覧・詳細の定型骨格 | 一覧・詳細を先行。業務操作や権限を勝手に補わない | 2 機能目で規約の再利用を確認した後 |

## 3. 複数案の比較

### A. テンプレート CLI

AI がモデル名、フィールド、対象を引数に変換し、テンプレートでコードを出力する。Rails の generators が持つ引数・オプション・テンプレートという構造を参考にする。導入が軽く、既存の 1 機能からテンプレートを抽出しやすい。一方で引数の増加、複数コマンド間の整合性、再生成の更新管理は自作が必要になる。

採用に向くのは、生成対象が少なく、規約を短期間で試したい場合。推奨 C の内部実装も、まずこのような小さなテンプレート処理から始められる。A と C の差はテンプレートエンジンの有無ではなく、共通 schema と依存・差分計画を持つかどうか。

### B. TypeSpec の独自 decorator / emitter

TypeSpec に補助情報を定義し、独自 emitter で各レイヤーを生成する。API 契約に参照をまとめやすいが、UI・domain の都合が契約定義に入り込みやすい。IDL なしの着手には別の仕組みが要る。compiler API と独自 decorator の互換性維持も必要。

採用に向くのは、IDL 先行が必須で、契約と生成物の対応が強く安定している場合。TypeSpec には emitter の拡張機構があるが、本件の React / DDD / DI 一式を生成する機能が標準で提供されるという意味ではない。[TypeSpec Emitters](https://typespec.io/docs/extending-typespec/emitters-basics/)

### C. 共通生成定義 + 入力 adapter + recipe（推奨）

TypeSpec / OpenAPI または手動の定義を Feature Spec に正規化し、同じ検証・依存計画・生成器を利用する。入力順や生成範囲が異なる本件に適合する。初期には schema、adapter、manifest の実装コストがかかり、共通定義の変更管理も必要。

評価は定性的な設計判断。開発工数や生成速度の比較実験は実施していない。

## 4. 推奨アーキテクチャ

```text
TypeSpec → OpenAPI → contract adapter ─┐
                                      ├→ Feature Spec → validator
手動 domain / UI 定義 ─────────────────┘                   ↓
                                                dependency planner
                                                          ↓
                                               plan.json + diff
                                                          ↓
                                                  apply → verify
```

TypeSpec の公式 OpenAPI 3 emitter は `tsp compile . --emit=@typespec/openapi3` で利用できる。導入時には compiler と emitter の互換バージョンを lockfile で固定する。OpenAPI は通信契約の入口に使い、集約・VO・UI を自動的に決定するものとして扱わない。[Emitter usage](https://typespec.io/docs/emitters/openapi3/reference/emitter/)

Feature Spec は本提案の中間形式。自動抽出する契約情報と、手動の意味定義を物理的に分け、正規化処理で参照を解決する。正規化結果はレビュー用に保存できるが、手編集する正本にはしない。各項目には入力ファイル・シンボル等の provenance を持たせる。

### 入力と正本

| 情報 | 正本 | 例 |
|---|---|---|
| HTTP 操作、DTO、必須・nullable | IDL 確定後は TypeSpec | `getProduct`、`ProductDto` |
| Entity、集約、ID / VO の意味 | domain 補助定義 | `ProductId`、採番主体、`ProductName` のルール |
| UI 設定・状態管理 | UI 補助定義 | 列・ラベル・list / detail・Redux |
| DTO と domain の変換 | mapping 補助定義 | `display_name → ProductName` |
| 生成対象・既存実装の利用 | 実行設定 | targets、existing bindings |

IDL がないときは contract binding を未解決のまま、domain・port・fake・UI を先行可能にする。HTTP 実装を要求した場合は未解決エラーとする。IDL 取り込み後に、フィールド名だけで自動的に既存 Entity へ統合しない。対応を明示し、型・nullable・enum・操作の差分を確認する。

## 5. Feature Spec と検証

スライドの YAML は読みやすさを優先した抜粋。正式 schema は T03 で定義する。少なくとも次を表現する。

- `schemaVersion`、feature の安定した識別子、利用する recipe とその version。
- Entity、ID の型・形式・採番主体、VO の constructor / parser と確定した制約。
- Repository の操作、引数、戻り値、not-found / 通信失敗等の結果契約。
- 契約の参照、DTO・operation の対応、入出力 mapper。
- UI の列、表示、画面種別、ViewModel、状態管理、エラーの見せ方。
- 対象 targets、対象外の既存実装の module / export / 型契約。
- 未解決事項 `unresolved` と、どの対象の生成を妨げるか。

schema で未知キー・不正な enum・識別子を拒否し、その後の意味検証で重複、参照切れ、循環依存、矛盾する ID ルールを検出する。出力パスは規約から算出して出力ルート内に限定し、`..`、絶対パス、symlink 経由の逸脱、大小文字を無視した衝突も拒否する。AI が指定したテンプレートパスや任意の executable をそのまま利用しない。

規約で未定義のルールは AI が候補として提示する。仕様として合意されるまでは unresolved とし、必要な対象の apply を許可しない。nullable と optional は区別する。独自 scalar の意味を失う場合は mapping を必須にし、adapter で表現できない契約を黙って string に落とさない。

## 6. レイヤー別の出力

| レイヤー / 領域 | 対象例 | 所有権 |
|---|---|---|
| Domain | Entity、ID / VO、Repository interface | 業務コードは初回雛形、その後手書き。反復可能な機械的型は生成専用にもできる |
| Application | `ListProducts`、`GetProduct`、出力型 | 初回雛形。個別 orchestration は手書き |
| Infrastructure | API client、DTO validator、mapper 雛形、HTTP Repository | client / validator は生成専用。業務意味を含む mapper は手書き拡張 |
| Presentation | 一覧・詳細、Hook / Controller、Redux slice 雛形、ViewModel | 初回雛形。定型表示部の専用生成は recipe で選択可能 |
| Composition Root | Repository と UseCase の組み立て | 手書き。生成した登録一覧を明示的に取り込む |
| Test | fake、fixtures、契約テスト雛形 | 定型 fixture は生成可能。業務期待値は人が定義 |

生成器を作っただけで業務実装が完成するとはしない。初回雛形の未実装箇所は未完了として一覧化し、本番完了判定には含めない。MVP の P2 では一覧・詳細を実際に接続して完了する。

### DIP と Controller

Presentation は Application を、Application は Domain を参照する。Infrastructure は Domain の Repository interface を実装する。Domain は React、Redux、HTTP client、DI ライブラリに依存しない。Composition Root のみが具体実装を知って注入する。

frontend の Controller は Hook 等の画面操作の窓口とし、入力や loading / error を扱う。UseCase は UI 非依存で業務操作を実行する。HTTP 通信は Repository 実装、DTO の構造変換は mapper に置く。レイヤー間の import 禁止を lint / 依存ルールで検証する。

### ID / VO と API 境界

`ProductId` と `UserId` の混用を型で拒否する。TypeScript の brand は実行時検証の代わりにならないため、API・URL・保存データの入口で parser を通す。server 採番の作成入力に擬似 ID を付けない。Entity の復元と新規作成は別経路にできるよう設計し、既存データの取り扱いも合意する。

VO の制約を型名から推測しない。`ProductName` の長さ・空文字・正規化、日時の timezone、数値の丸め等は業務定義とする。DTO validator と VO parser が別の責務を持ち、通信型を検証しただけでは業務的に有効とは見なさない。

Redux に Entity や Repository インスタンスを置かず、UseCase の結果をシリアライズ可能な ViewModel に変換する。Domain 側の厳密な型と、画面側の保存形式を分ける。[Redux Style Guide](https://redux.js.org/style-guide/)

## 7. 部分生成と CLI

以下は将来実装する CLI の仕様例。現在このリポジトリで実行できるコマンドではない。

```sh
scaffold plan --spec product.yaml --targets domain,repository-port
scaffold apply --plan plan.json
scaffold verify --spec product.yaml
```

`targets` は正規化した許可リストで扱い、AI から受けた文字列を shell に展開しない。選択された recipe の依存グラフを解決し、必要なものを「今回生成」「既存 binding で充足」「不足」に分類する。既存 binding は module の実在・export・型互換を検証する。依存が不足していても、別レイヤーを暗黙に生成しない。

plan の提案例：

```json
{
  "schemaVersion": 1,
  "targets": ["ui"],
  "status": "blocked",
  "changes": [],
  "existing": [],
  "missing": [{ "dependency": "GetProduct", "requiredBy": "ui" }]
}
```

実際の ready plan には、各ファイルの create / update / delete / unchanged、旧・新 hash、所有権、入力 hash、既存 binding の hash、schema / recipe / toolchain の version を含める。表示した差分と apply の対象を一致させるため、plan 内容自体の hash も保存する。新規ファイルも「存在しないこと」を前提条件に含める。

## 8. 決定論と再生成

再現性の単位は AI の会話ではなく、確定した正規化入力・固定ツール・テンプレート。依存 lockfile、Node、TypeSpec / emitter、formatter、template を固定し、UTF-8 / LF、列挙順、文字列化の規則を固定する。生成時に日時、乱数、環境変数、作業ディレクトリ絶対パス、外部ネットワークを結果へ混入させない。実行ログの日時は生成物と分離する。

`generated/` は生成器の所有領域とし、manifest にファイル一覧と hash を保存する。更新対象の現ファイルが旧 manifest と違えば手編集競合として停止する。初回雛形は生成後に人の所有へ移し、以後の生成対象から外す。定義の変更によって必要になった手修正は migration report と型エラーで通知する。

削除も plan の明示的な変更とする。旧 manifest で所有していないファイルは削除しない。所有ファイルでも内容が違えば停止する。schemaVersion の変更には専用 migration を用意し、実装がない version を暗黙変換しない。

apply は全条件を再確認した後、一時領域に出力を完成させ、排他を取り、対象を変更する。個別ファイルの rename だけでは複数ファイルの原子性は保証できないため、復旧 journal / backup 等で途中失敗とプロセス中断から戻せる方式を T05 で実装・検証する。復旧未完了の状態で次の apply を進めない。

## 9. テスト戦略

| 層 | 確認事項 | 失敗させる例 |
|---|---|---|
| schema / 意味検証 | 入力の完全性と整合性 | 未解決 VO 制約、重複 ID、参照切れ |
| 型 / 依存 | ID 区別、DIP、既存 binding | UserId を ProductId として渡す、Domain → Infra import |
| 生成器 | 再現性、部分生成、所有権 | 不足依存、手編集、古い plan、不要ファイル、途中失敗 |
| domain / mapper | 業務制約と境界変換 | 空値、未知 enum、不正 ID、nullable 差分 |
| Repository 契約 | fake / HTTP の共通動作 | not-found、エラー、結果順序、ページング |
| 結合 | テスト用 backend 接続 | DTO drift、timeout、想定外 status |
| UI / E2E | ユースケースの完遂 | loading / empty / error、一覧 → 詳細 |

テスト用 backend は既存のものを使用する前提で、起動・URL・seed・reset・起動待機を T01 / T09 で確定する。fake は単体・画面試作向けであり、backend の代替証明にはしない。固定 fixture と注入可能な時計等で再現性を担保し、複数テストが同じデータを壊さないようにする。

生成器と同じ定義から生成したテストだけでは同じ誤りを見落とし得る。ID 混用、DTO の不正応答、業務期待値、backend 接続の期待結果は独立した fixture / 手書きテストで確認する。

## 10. 実施計画と採用判断

P0 で既存規約を確定し、P1 で schema と plan / apply の安全性を実装する。P2 で Product の一覧・詳細を全レイヤーに接続し、テスト用 backend で確認する。P3 で TypeSpec adapter と AI 設定提案を加える。P4 で書き込み操作と migration の対象を広げる。工数は T01 の調査後に見積もる。

最初の完了単位は P2。再生成差分ゼロ・手書き保持・依存不足時に無変更・古い plan 拒否・ID 型と実行時検証・backend 結合・UI E2E をすべて通す。2 機能目で、定型部分の手修正、差分レビュー時間、生成後の不具合を記録し、継続採用を判断する。速度改善や生成率の目標数値はまだ置かない。

[実施タスクと依存関係](tasks.md) に、成果物と受け入れ条件を記載する。ここでのタスク生成はリポジトリ内の Markdown 作成を指し、GitHub Issue の追加投稿は行っていない。

## 11. 未決定事項

- frontend 担当：DI ライブラリ、Redux の既存規約、UI 部品、フォルダ構成、フォーム設計。
- domain 担当：集約境界、ID 形式・採番、VO の不変条件、Repository の意味とエラー契約。
- API 担当：TypeSpec の構成・認証・versioning、テスト用 backend の起動とデータ分離。
- 生成器担当：OpenAPI 経由で必要情報が保存されるか、テンプレート処理方式、複数ファイル更新の復旧方式。

## 12. 一次資料

- [Issue #16](https://github.com/ysksm/slides/issues/16)：要求とアーキテクチャ上のコンテキスト。
- [Rails — Creating and Customizing Generators & Templates](https://guides.rubyonrails.org/generators.html)：引数・オプション・テンプレートを使った生成器の参照例。
- [TypeSpec — OpenAPI 3 emitter usage](https://typespec.io/docs/emitters/openapi3/reference/emitter/)：公式 emitter の呼び出しと出力設定。
- [TypeSpec — Emitters](https://typespec.io/docs/extending-typespec/emitters-basics/)：独自 emitter の拡張点。
- [Redux — Style Guide](https://redux.js.org/style-guide/)：シリアライズ可能な state / action の指針。

共通定義、所有権、CLI、部分生成の依存解決、実施計画はこれらの公式機能の説明ではなく、本件向けの設計提案。
