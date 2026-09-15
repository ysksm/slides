# Yocto ビルドホストの構築手順 — ディストリビューションの選択とインストール

[Issue #40](https://github.com/ysksm/slides/issues/40) の解説スライド。[Yocto 入門（Issue #32）](../yocto-intro/README.md)の付録として、**ビルドホストに使う Linux ディストリビューションの選び方**と、**インストールから最初のビルドが通るまでの手順**だけを単独で扱います。サポート対象ディストロの選定基準、ベアメタル / VM / WSL 2 / コンテナの選択、ディスクとファイルシステムの設計、インストール直後の初期設定、ホスト依存パッケージ、`core-image-minimal` での動作確認までを通します（全 18 枚、調査日: 2026-09-15）。

- [HTML スライド](index.html): 全 18 枚。ビルド不要。

## 構成

| # | 内容 |
|---|---|
| 1–2 | 表紙 / 結論を先に（サポート対象ディストロから選ぶ・ディスクと置き場所・インストール直後の 5 項目） |
| 3 | ビルドホストに求められる要件（ディスク・メモリ・ロケール・ファイルシステムの必須条件） |
| 4–5 | **ディストロの選択基準**（サポート対象・サポート期間・CI との一致・情報量・組織の制約）、対象ディストロの例とリリースとの対応 |
| 6 | 候補の比較（Ubuntu LTS / Debian / Fedora / AlmaLinux・Rocky / openSUSE Leap） |
| 7 | サポート対象外の環境（Arch・古い RHEL・macOS・Windows・コンテナ・NAS）の扱い |
| 8 | 設置形態の選択（ベアメタル / VM / クラウド / コンテナ / WSL 2） |
| 9 | **ディスクとパーティションの設計**（容量の内訳、ext4・LVM・スワップ、btrfs/ZFS の注意） |
| 10–11 | **インストール手順**：メディア作成とインストーラの選択肢、初回起動後の初期設定（ロケール・時刻・SSH・プロキシ） |
| 12 | ホスト依存パッケージの導入（ディストロ別の要点） |
| 13 | ホストのツールが古いときの救済（`buildtools-tarball` / `buildtools-extended-tarball`） |
| 14–15 | 環境別の追加手順：VM（スナップショット・ディスク拡張・共有フォルダ）、WSL 2 とコンテナ |
| 16 | 動作確認：`core-image-minimal` を 1 回通す。よく出るエラーと原因 |
| 17 | 運用とチューニング（並列度・`DL_DIR` / `SSTATE_DIR`・`rm_work`・`BB_DISKMON_DIRS`） |
| 18 | まとめ（構築チェックリスト 10 項目）と参考資料 |

## Yocto 入門（Issue #32）との関係

本編の 6–7 枚目「なぜ macOS では直接ビルドできないのか」「VMware Fusion に Ubuntu を立てる」を、**ディストリビューションの選定とインストール手順**の観点から単独で詳しくしたものです。本編は仕組みとイメージの作り分けを扱い、本資料はその手前のホスト構築だけを扱います。

## 主な参考資料

スライド内の出典は 18 枚目に記載しています。

- [Reference Manual — System Requirements](https://docs.yoctoproject.org/ref-manual/system-requirements.html) — サポート対象ディストロ、必要ディスク容量、ホスト依存パッケージ、ホストツールの最低バージョン
- [Yocto Project Quick Build](https://docs.yoctoproject.org/brief-yoctoprojectqs/index.html) — 最短の導入手順
- [Variables Glossary](https://docs.yoctoproject.org/ref-manual/variables.html) — `DL_DIR` / `SSTATE_DIR` / `BB_NUMBER_THREADS` / `BB_DISKMON_DIRS` ほか
- [Development Tasks Manual — Setting Up to Use ...](https://docs.yoctoproject.org/dev-manual/start.html) — WSL 2・CROPS コンテナなど環境別の手順
- [Yocto Project Releases](https://wiki.yoctoproject.org/wiki/Releases) — リリースとコードネーム、LTS のサポート期限
- [downloads.yoctoproject.org](https://downloads.yoctoproject.org/releases/yocto/) — 各リリースの成果物と `buildtools` の配布元

サポート対象ディストロ・必要パッケージ・容量の要件は **Yocto のリリースごとに変わります**。スライド中の一覧やコマンド例は `scarthgap`（5.0 LTS）系を想定した解説用のもので、実際に使うリリースの System Requirements を必ず確認してください。容量・時間の数値は環境依存の目安です。

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF。左右スワイプと画面端のクリックにも対応。`#9` のようなハッシュでページを直接指定できます。

HTML を直接編集します。表示・操作の構成は既存の `playwright-overview/index.html`・`yocto-intro/index.html` に合わせています。JavaScript ライブラリへの依存はなく、Web フォントが取得できない場合は代替フォントを使います。
