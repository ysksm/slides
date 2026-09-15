# Yocto 入門 — macOS/VM で作る Raspberry Pi・ルーター・x86_64 の Linux イメージ

[Issue #32](https://github.com/ysksm/slides/issues/32) の解説スライド。Yocto Project で組み込み Linux ディストリビューションを「自分で作る」ための仕組みを整理したうえで、**macOS (Apple Silicon) + VMware Fusion でのビルド環境づくり**から、**GUI あり/なしのイメージ**、**Raspberry Pi**、**ルーター用 Linux**、**Intel NUC (x86_64)** 向けイメージの作り分けまでを扱います（全 20 枚、調査日: 2026-09-15）。

- [HTML スライド](index.html): 全 20 枚。ビルド不要。

## 構成

| # | 内容 |
|---|---|
| 1–2 | 表紙 / 結論を先に（ディストロを作る工場・Linux ホスト必須・作り分けは 2 変数 + レイヤー） |
| 3–5 | 仕組み：Poky / BitBake / OpenEmbedded とレイヤー、用語とディレクトリ、ビルドの流れと成果物 |
| 6–7 | **M4 Mac でのビルド環境**：macOS で直接ビルドできない理由、VMware Fusion の VM スペックと落とし穴 |
| 8–9 | 最初のビルド（qemuarm64）、`local.conf` / `bblayers.conf` の要点 |
| 10–11 | **イメージの種類**：GUI なし（`core-image-minimal` / `base` / `full-cmdline`）、GUI あり（Weston / Sato / Qt） |
| 12 | **Raspberry Pi** 向けイメージの作成と書き込み（meta-raspberrypi、`MACHINE`、固有設定） |
| 13 | **Intel NUC / x86_64** 向け（`genericx86-64` / meta-intel、UEFI、ARM ホストからのクロスビルド） |
| 14 | **ルーター用 Linux**（meta-networking、read-only rootfs、更新方式） |
| 15 | 1 つの作業ツリーで 4 機種を回す（`DL_DIR` / `SSTATE_DIR` 共有、`kas`） |
| 16–17 | カスタムレイヤーとレシピ、`devtool` と SDK による日々の開発ループ |
| 18–19 | ビルド時間・ディスクの現実解、初心者が踏むところと製品化の宿題 |
| 20 | まとめ・学習ロードマップ・参考資料 |

## Issue #32 の 4 パターンとの対応

| やりたいこと | MACHINE | イメージ | スライド |
|---|---|---|---|
| Raspberry Pi・GUI なし | `raspberrypi5` | `core-image-base` | 10, 12 |
| Raspberry Pi・GUI あり | `raspberrypi5` + `vc4graphics` | `core-image-weston` | 11, 12 |
| ルーター用 Linux | `genericx86-64` など | 自作 `router-image` | 14 |
| Intel NUC (x86_64) | `genericx86-64` / `intel-corei7-64` | `core-image-base` | 13 |

## 主な参考資料

スライド内の出典は 20 枚目に記載しています。

- [Yocto Project Documentation](https://docs.yoctoproject.org/) — Quick Build / Reference Manual / Development Tasks Manual
- [System Requirements](https://docs.yoctoproject.org/ref-manual/system-requirements.html) — サポート対象ディストロとホスト依存パッケージ
- [Variables Glossary](https://docs.yoctoproject.org/ref-manual/variables.html) — `MACHINE` / `IMAGE_INSTALL` / `DISTRO_FEATURES` ほか
- [Yocto Project Releases](https://wiki.yoctoproject.org/wiki/Releases) — リリースとコードネーム、LTS のサポート期限
- [agherzan/meta-raspberrypi](https://github.com/agherzan/meta-raspberrypi) — Raspberry Pi BSP
- [meta-intel](https://git.yoctoproject.org/meta-intel/) — Intel プラットフォーム BSP
- [OpenEmbedded Layer Index](https://layers.openembedded.org/) — レシピ・レイヤーの横断検索
- [siemens/kas](https://github.com/siemens/kas) — レイヤー構成を YAML で固定するツール

コマンド例・変数名・対応機種は Yocto のリリースと各レイヤーのバージョンで変わります。スライドの例は `scarthgap`（5.0 LTS）系を想定した解説用のもので、実際に使うリリースの公式ドキュメントと各レイヤーの README で最新を確認してください。ビルド時間・ディスク容量の数値は環境依存の目安です。

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF。左右スワイプと画面端のクリックにも対応。`#9` のようなハッシュでページを直接指定できます。

HTML を直接編集します。表示・操作の構成は既存の `playwright-overview/index.html` に合わせています。JavaScript ライブラリへの依存はなく、Web フォントが取得できない場合は代替フォントを使います。
