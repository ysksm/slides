import time, os
t0 = time.perf_counter(); x = 0
for i in range(30_000_000): x += i
el = time.perf_counter() - t0
v = nv = 0
for l in open('/proc/self/status'):
    if l.startswith('voluntary_ctxt_switches'): v = int(l.split()[1])
    if l.startswith('nonvoluntary_ctxt_switches'): nv = int(l.split()[1])
print(f'経過 {el:5.2f}s  voluntary={v}  nonvoluntary={nv}')
