# Redmine SPA 化の調査メモ

[Issue #26](https://github.com/ysksm/slides/issues/26) の技術検討。調査日: 2026-09-14。対象バージョン、認証基盤、導入プラグインは未指定で、実環境への接続・負荷測定は未実施です。以下の推奨は仕様を組み合わせた設計提案です。

## 構成案と UI の置き換え

チケット一覧・詳細・コメント・状態変更から始め、管理・プラグイン固有画面は既存 UI にリンクします。Redmine の DB への直接書き込みは避け、既存の権限・検証・履歴・通知を維持する経路を使います。

Web 版は `tasks.example` で静的 SPA と `/api/` を公開し、NGINX が `/api/` を BFF（UI 専用のバックエンド）へ中継します。BFF が利用者の資格情報を付けて Redmine を呼び、既存 UI は `redmine.example` で併用します。ホスト名は説明用です。NGINX は中継、BFF は認証情報の管理・本人の対応付け・応答整形を担当します。

UI は React または Vue と TypeScript、ビルドは Vite などを候補とし、チームの経験を優先します。画面と API 接続アダプターを分けると、Web の BFF 接続と Desktop の IPC 接続で UI を共用できます。Vite の通常の成果物は `dist`。サブパス配信は `base` と Router の設定を合わせ、開発プロキシや `vite preview` を本番配信に使わない方針です。[Vite static deploy](https://vite.dev/guide/static-deploy.html)

テーマは外観の調整に向きます。独自ページ・メニュー・エンドポイントはプラグインの controller・view・routes とメニュー登録で追加できます。既存 HTML の DOM 置換やビュー上書きは本体更新への追従が必要になるため、専用ページと小さな API 追加を優先します。[Themes](https://www.redmine.org/projects/redmine/wiki/Themes)、[Plugin Tutorial](https://www.redmine.org/projects/redmine/wiki/Plugin_Tutorial)

プラグインの専用 API は、ログイン確認・プロジェクト権限・CSRF 対策を実装します。本体モデルの操作だけで標準画面の認可・履歴・通知がすべて実行されると仮定せず、対象版の呼び出し経路を調べます。

## API の対応範囲

Redmine は JSON / XML の REST API を提供します。API 認証は管理設定で有効化し、利用者キーを `X-Redmine-API-Key` に指定できます。キーを URL に含めるとログ等へ残り得るためヘッダー利用を推奨します。一覧のページングは `offset` と `limit` を扱い、既定件数は 25、上限は 100 です。[REST API](https://www.redmine.org/projects/redmine/wiki/Rest_api)

| 操作 | API の例 | 実環境での確認 |
|---|---|---|
| チケット一覧 | GET /issues.json | 既定は未完了。全状態は status_id=* |
| 詳細・履歴・添付情報 | GET /issues/42.json?include=journals,attachments | 関連情報と可視性 |
| 作成 | POST /issues.json | 必須項目・カスタムフィールド |
| 更新・コメント | PUT /issues/42.json | notes・状態変更・履歴・通知 |
| 変更可能状態 | 詳細に include=allowed_statuses | 5.0.x 以降。利用者とチケットに依存 |
| 管理・プラグイン固有機能 | 専用 API または既存 UI | 標準 API の対応を個別確認 |

一覧・詳細・更新の仕様は [Issues API](https://www.redmine.org/projects/redmine/wiki/Rest_Issues) を参照します。全ステータスの一覧を、誰でも遷移できる編集候補として扱わないようにします。入力候補・必須条件・読み取り専用条件が API だけで再現できない場合、専用 API か既存画面を利用します。

添付は `/uploads.json` に `application/octet-stream` でバイナリを送り、返された token をチケットの uploads に指定します。JSON 更新では `application/json` を指定します。入力不備の応答は 422 とエラー本文です。[REST API](https://www.redmine.org/projects/redmine/wiki/Rest_api)

公式 Wiki には将来版の記述も含まれます。7.1.0 と書かれた仕様を既存の稼働版に適用できるとみなさず、対象バージョンを固定して確認します。

## 認証と BFF

BFF 方式の設計例です。

1. 利用者が BFF にログインする。
2. 自分の Redmine API キーを登録するなどして、承認された連携方法で資格情報を準備する。
3. BFF が Redmine の本人情報と照合してアカウントを対応付ける。
4. キーをサーバー側で暗号化・アクセス制限して保管し、通常の API 応答に返さない。
5. ブラウザは HttpOnly・Secure のセッション Cookie で BFF を呼ぶ。SameSite と CSRF トークン / Origin 検証を運用に合わせて設定する。
6. BFF は利用者ごとのキーで API を呼び、ログアウト・キー失効・再登録を処理する。

SSO で BFF にログインできても Redmine の権限は自動では引き継がれません。SSO の ID トークンをそのまま API キーとして扱う構成や、標準 OAuth / OIDC の存在は前提にしていません。

`X-Redmine-Switch-User` は管理者の API 認証で使える代理実行機能です。採用するなら検証済みの本人をサーバーが指定し、利用者が持ち込んだ代理実行ヘッダーは受け付けません。共有管理者キーの常用は初期案に含めません。[REST API](https://www.redmine.org/projects/redmine/wiki/Rest_api)

BFF は接続先 URL を固定し、パス・メソッド・引数を制限します。任意 URL を受け付けるプロキシにはしません。認証情報をログに出さず、キャッシュも利用者の境界を維持します。ブラウザが利用者キーを直接送る方式は小規模 PoC の候補ですが、実行メモリへの露出と再入力が必要になり、永続的な localStorage 保管は推奨しません。

## NGINX 設定例

説明用の設定です。証明書パス、最大添付サイズ、タイムアウトなどは環境で設定してください。BFF は `/api/*` を受け付け、内部で `/api/issues` を `/issues.json` などに変換する設計です。NGINX 自体はこの変換をしません。

```nginx
server {
    listen 443 ssl;
    server_name tasks.example;
    ssl_certificate     /etc/nginx/tls/tasks.crt;
    ssl_certificate_key /etc/nginx/tls/tasks.key;

    root /srv/redmine-spa/dist;
    index index.html;

    location /api/ {
        # URI 部分なし: /api/ を保持して BFF に転送
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

TLS を NGINX で終端し、BFF を同じホストの loopback に限定する想定です。BFF が転送ヘッダーを信頼するのはこのプロキシからの通信に限ります。別サーバーの Redmine への通信は TLS・証明書検証・接続先制限を適用します。

`proxy_pass http://127.0.0.1:3001/;` と URI `/` を加えると、この例では一致した `/api/` 部分が `/` に置換されます。BFF のルートと整合させます。[NGINX proxy module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

SPA の直リンクは index.html に戻し、API の 404 を HTML に変えないようルートを分離します。添付ダウンロードは認証付き BFF 経由か既存 UI のログインを利用するかを決めます。

同じ公開オリジンの `/api/` を呼ぶ場合、ブラウザから Redmine へのクロスオリジン要求を避けられます。直接別オリジンを呼ぶ場合は許可 Origin・メソッド・ヘッダーと OPTIONS 応答を設定します。Cookie 付き CORS では明示的な Origin と credentials の許可が必要です。CORS は認証・認可や CSRF 対策の代わりではありません。[MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

## Desktop の選択

### Electron

Renderer に同じ SPA を載せ、preload の contextBridge から目的別 IPC を公開します。main が通信・キー管理を担当し、UI は listIssues / updateIssue などの操作を呼ぶ構成です。[Process model](https://www.electronjs.org/docs/latest/tutorial/process-model)

Node integration は無効、context isolation と sandbox は有効を維持します。IPC の送信元・引数・接続先、外部リンクのスキームと URL を検証します。CSP とナビゲーション制限を設け、任意コマンドや任意 URL を扱う窓口を公開しません。[Security](https://www.electronjs.org/docs/latest/tutorial/security)

safeStorage は OS の機能を使いますが、Linux では `basic_text` が選ばれる場合があります。暗号化の可用性と backend を確認し、条件を満たさなければキーを永続保存しない方針にします。[safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage)

### Tauri 2

OS の WebView に SPA を表示し、Rust command に通信と秘密情報を集約する提案です。対象 OS の WebView で描画・挙動を確認します。[Tauri overview](https://v2.tauri.app/start/)

capabilities / permissions でウィンドウ等から利用できる機能を絞ります。独自 command にも権限設定・引数検証が必要です。capability ファイルを作るだけで任意の独自 command が自動的に制限されると考えないでください。[Capabilities](https://v2.tauri.app/security/capabilities/)

HTTP plugin では接続先スコープを限定します。独自 Rust HTTP クライアントはそのコード内で URL を制限します。標準 fetch とネイティブ HTTP を区別し、キーを WebView に返さない構成にします。[HTTP client](https://v2.tauri.app/plugin/http-client/)

Stronghold は秘密情報保管の候補ですが、解除用パスワード等の管理が必要です。OS キーチェーンにすべて自動的に任せる機能とは区別します。[Stronghold](https://v2.tauri.app/plugin/stronghold/)

### PWA と配布

Web 配信中心でアプリ風の起動が必要なら PWA を検討します。manifest・HTTPS など対象ブラウザのインストール条件を確認します。Service Worker によるキャッシュはオフライン実装の候補ですが、インストール可能にするだけでは更新の同期は実現しません。[PWA installability](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

Electron / Tauri は OS ごとのビルド、署名、必要な notarization、更新配布・復旧を計画します。同梱 UI は版を固定できますがアプリ更新が必要です。リモート Web UI を表示するラッパー方式は配信しやすい一方、公開するネイティブ機能を最小限にします。

## PoC の受け入れ条件

今後アプリを実装するときの確認項目です。実施済みの接続テストではありません。

- 一般利用者・閲覧のみ・管理者で可視性と権限が既存 UI と一致する。
- 状態遷移、必須項目、カスタムフィールド、履歴・通知が既存運用と整合する。
- 入力エラー、認証切れ、権限不足、タイムアウトを区別して表示する。
- 同時編集時の挙動を調べ、変更通知・再読込・競合表示の方法を決める。
- 結果不明時に作成やコメントを無条件に再送しない。再取得して重複を確認する。
- 添付の往復と途中失敗を本人の権限で処理する。
- API キー・Cookie が URL、ログ、配布ファイルに含まれない。
- 直リンク、再認証、キー再生成、既存 UI への切り戻しを確認する。
- Desktop では OS ごとの表示、社内プロキシ・証明書、鍵の保管、署名・更新を確認する。

対象 Redmine の版を固定した API 契約テストと主要な操作の E2E を実装し、アップグレード時に再確認する方針です。
