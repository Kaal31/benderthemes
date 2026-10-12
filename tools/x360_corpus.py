"""Run the Xbox 360 reader over every STFS package (magic CON / LIVE / PIRS) under a folder.
Usage: python3 -I tools/x360_corpus.py <folder>
Prints counts, errors and timings; never executes the files."""
import os, sys, time
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "py_modules"))
import x360_themes as X


def main(root):
    seen = themes = pics = other = crashed = 0
    times = []
    for r, _, fs in os.walk(root):
        for f in sorted(fs):
            p = os.path.join(r, f)
            try:
                with open(p, "rb") as h:
                    magic = h.read(4)
            except OSError:
                continue
            if magic not in (b"CON ", b"LIVE", b"PIRS"):
                continue
            seen += 1
            t = time.time()
            try:
                res = X.read_x360(p)
            except Exception as e:      # read_x360 must never raise
                crashed += 1
                print("CRASH", p, e)
                continue
            dt = time.time() - t
            times.append(dt)
            if not res:
                other += 1
                print("not a theme/gamerpic:", p)
                continue
            themes += res["kind"] == "theme"
            pics += res["kind"] == "gamerpic"
            print(f"{dt*1000:7.0f} ms  {X.summary(res)}  errors={len(res['errors'])}  {p}")
    print(f"packages={seen} themes={themes} gamerpics={pics} other={other} crashes={crashed}"
          + (f" max={max(times)*1000:.0f}ms total={sum(times):.2f}s" if times else ""))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
