# 動かして確かめる Linux のしくみ — プロセス・メモリ・I/O・コンテナの実験ノート

[Issue #49](https://github.com/ysksm/slides/issues/49) の解説スライド。Linux カーネルの中核機能（システムコール、プロセス、スケジューラ、仮想メモリ、ページキャッシュ、デバイス、ファイルシステム、ブロック層、仮想化、コンテナ、cgroup）を「問い → 実験 → 仕組み」の順に、実際に実行したコマンドと出力から読み解きます。全体を「多重化・隔離・階層化」の 3 語で貫き、最後に 1 回の `read()` が通る道で全部をつなげます（全 20 枚、調査日: 2026-09-16）。

- [HTML スライド](index.html): 全 20 枚。ビルド不要。

## 構成

| # | 内容 |
|---|---|
| 1–3 | 表紙 / 結論を先に（多重化・隔離・階層化と実験の数字）/ 読み方・実験環境・道具箱・20 枚の地図 |
| 4 | **境界**: `strace` で見るシステムコール、ユーザー空間とカーネル空間 |
| 5 | **プロセスの一生**: fork / execve / exit / wait、状態 R/S/D/T/Z、200 回の生成コスト |
| 6–7 | **スケジューラ**: 1 CPU を 2 プロセスで共有する実験（経過時間 vs CPU 時間）、nice、強制コンテキストスイッチの回数、EEVDF |
| 8 | **仮想メモリ**: ページテーブル・MMU・ページフォルト、`/proc/PID/maps`、ページサイズ |
| 9 | **メモリ実験**: デマンドページング（mmap 1 GiB で RSS が増えない）と Copy on Write（fork 直後は +0、書くと +256 MiB） |
| 10 | **メモリ不足**: ページキャッシュ回収 → スワップ → OOM killer、`free` の available の読み方 |
| 11–12 | **記憶階層とページキャッシュ**: 2 回目の読み込みが速い実験、書き込みの遅延と `fsync` |
| 13 | **デバイス**: デバイスファイル・sysfs・割り込み・DMA |
| 14 | **ファイルシステム**: VFS、inode、ジャーナリング、ext4 / XFS / Btrfs / tmpfs / overlayfs |
| 15 | **ブロック層**: I/O スケジューラ、先読み、HDD と SSD の違い |
| 16 | **仮想化**: KVM + QEMU、VM Exit、2 段アドレス変換、virtio |
| 17 | **コンテナ**: namespace、`unshare`、cgroup + overlayfs との組み合わせ、VM との比較 |
| 18 | **cgroup v2**: `cpu.max` / `memory.max`、systemd・Kubernetes との対応、v1 との違い |
| 19–20 | 1 回の `read()` が通る道（全体図と切り分け表）/ まとめ・次の一歩・参考資料 |

## 実験について

出力はすべて本デッキの作成環境（Linux 6.18、x86_64、4 論理 CPU、15 GiB、KVM ゲスト、virtio ディスク、ext4）で 2026-09-16 に実際に得たものです。数値は環境で変わります。root 権限が要る操作（cgroup の作成、`unshare`、`drop_caches`）は手順と期待される結果を示しています。

主な実験:

- `strace` によるシステムコールの観察（`cat /etc/hostname`）
- `taskset` / `nice` による CPU 分配の観察（経過時間と CPU 時間、`vmstat`、`nonvoluntary_ctxt_switches`）
- `mmap` によるデマンドページングと、`fork` による Copy on Write の観察（`/proc/self/status`、`/proc/meminfo`）
- `dd` によるページキャッシュの効果の観察（`Cached` の増加と 2 回目の読み込み速度）
- `/sys/block/*/queue/` によるブロック層設定の観察

## 参考にした構成と出典

章立ての発想は武内覚『[試して理解]Linuxのしくみ ―実験と図解で学ぶOS、仮想マシン、コンテナの基礎知識【増補改訂版】』（技術評論社, 2022, ISBN 978-4-297-13148-7、<https://gihyo.jp/book/2022/978-4-297-13148-7>）の「実験して確かめる」進め方に学びました。本デッキの文章・図・実験コード・出力は独自に作成したもので、書籍の内容の要約・転載ではありません。体系的に学ぶには原典を薦めます。

スライド内の出典は各スライドの末尾と 20 枚目に記載しています。

- [man7.org — Linux man pages](https://man7.org/linux/man-pages/) — fork(2), execve(2), mmap(2), fsync(2), proc(5), sched(7), namespaces(7), cgroups(7)
- [The Linux Kernel documentation](https://docs.kernel.org/) — scheduler/sched-eevdf, admin-guide/sysctl/vm, admin-guide/cgroup-v2, filesystems/vfs, block/, virt/kvm/
- [Concepts overview — Memory Management](https://docs.kernel.org/admin-guide/mm/concepts.html)
- [Overlay Filesystem](https://www.kernel.org/doc/html/latest/filesystems/overlayfs.html)
- [Virtual I/O Device (VIRTIO) Version 1.3](https://docs.oasis-open.org/virtio/virtio/v1.3/virtio-v1.3.html)
- [systemd — Control Group APIs and Delegation](https://systemd.io/CGROUP_DELEGATION/)

## 閲覧・編集

`index.html` をブラウザで開きます。← → / Space で移動、Home / End で最初・最後、O で一覧、F で全画面、P で印刷/PDF。左右スワイプと画面端のクリックにも対応。`#9` のようなハッシュでページを直接指定できます。

HTML を直接編集します。表示・操作の構成は既存の `playwright-overview/index.html` に合わせています。JavaScript ライブラリへの依存はなく、Web フォントが取得できない場合は代替フォントを使います。
