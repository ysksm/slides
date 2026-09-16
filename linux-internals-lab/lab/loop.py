import sys, time
n = int(sys.argv[1]) if len(sys.argv) > 1 else 30_000_000
t0 = time.perf_counter(); c0 = time.process_time()
x = 0
for i in range(n): x += i
print(f"経過 {time.perf_counter()-t0:5.2f}s  CPU {time.process_time()-c0:5.2f}s")
