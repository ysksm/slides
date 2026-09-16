# 実験スクリプト

スライド内の実験を再現するためのスクリプト。追加インストール不要（Python 3 と coreutils）。数値は環境で変わる。

| ファイル | スライド | 使い方 |
|---|---|---|
| `loop.py` | 6, 18 | `taskset -c 0 python3 loop.py`（引数でループ回数。既定 3,000 万） |
| `ctx.py` | 7 | `taskset -c 0 python3 ctx.py & taskset -c 0 python3 ctx.py` で強制コンテキストスイッチ回数を比べる |
| `mmap_demand.py` | 9（左） | `python3 mmap_demand.py`。mmap 直後と全ページ書き込み後の VmSize / VmRSS |
| `fork_cow.py` | 1, 9（右） | `python3 fork_cow.py`。fork 前後と子の書き込み後のシステム全体 AnonPages |
| `pagecache.sh` | 11 | `sudo sh pagecache.sh`。`drop_caches` に root が要る |
