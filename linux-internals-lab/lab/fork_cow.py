import os, time
def anon(tag):
    for l in open('/proc/meminfo'):
        if l.startswith('AnonPages'):
            print(f'{tag:<20} システム全体の AnonPages = {int(l.split()[1])//1024:>5} MiB')
anon('起動直後')
data = bytearray(256 << 20)          # 256 MiB を確保して触る
anon('親: 256MiB 確保')
pid = os.fork()                       # 子は 256MiB のコピーを持つはず……？
if pid == 0:
    anon('子: fork 直後')
    for i in range(0, len(data), 4096): data[i] = 1   # 子が全ページに書く
    anon('子: 全ページ書込後')
    os._exit(0)
os.waitpid(pid, 0)
anon('親: 子の終了後')
