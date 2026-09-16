import mmap, os, time
def rss():
    for l in open('/proc/self/status'):
        if l.startswith(('VmSize', 'VmRSS')): print('   ', l.strip())
print('確保前'); rss()
buf = mmap.mmap(-1, 1 << 30)       # 1 GiB を確保（まだ触らない）
print('1 GiB 確保直後 (mmap)'); rss()
for off in range(0, 1 << 30, 4096): buf[off] = 1   # 1 ページごとに書く
print('全ページに書き込み後'); rss()
