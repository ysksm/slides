#!/bin/sh
# ページキャッシュの効果を見る（スライド 11）。drop_caches に root が要る。
set -e
dd if=/dev/urandom of=big.bin bs=1M count=512 status=none; sync
echo 3 > /proc/sys/vm/drop_caches          # 書き込みで入ったキャッシュを捨てて基準にする
grep Cached /proc/meminfo
echo '1回目'; dd if=big.bin of=/dev/null bs=1M 2>&1 | tail -1
grep Cached /proc/meminfo
echo '2回目'; dd if=big.bin of=/dev/null bs=1M 2>&1 | tail -1
rm big.bin
