"""Shrinks AudioLoader packs in a staging folder (used by package.sh).

* .wav effects -> .ogg (Vorbis), and pack.json mappings point at the .ogg files,
  so both this plugin and AudioLoader still find every sound;
* menu music re-encoded to 80 kbit/s MP3 when it is bigger than that.
Run: python3 tools/shrink_packs.py <folder with pack folders>
"""
import json, os, subprocess, sys

root = sys.argv[1]


def ff(*args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *args], check=True)


for pack in sorted(os.listdir(root)):
    d = os.path.join(root, pack)
    pj = os.path.join(d, "pack.json")
    if not os.path.isfile(pj):
        continue
    meta = json.load(open(pj, encoding="utf-8"))
    maps = meta.get("mappings") or {}
    ignore = set(meta.get("ignore") or [])
    renamed = {}
    for f in os.listdir(d):
        p = os.path.join(d, f)
        if f.lower().endswith(".wav") and os.path.getsize(p) > 24000:
            o = f[:-4] + ".ogg"
            ff("-i", p, "-c:a", "libvorbis", "-q:a", "4", os.path.join(d, o))
            os.remove(p)
            renamed[f] = o
        elif f.lower().endswith(".mp3") and os.path.getsize(p) > 1_000_000:
            t = p + ".tmp.mp3"
            ff("-i", p, "-c:a", "libmp3lame", "-b:a", "80k", t)
            os.replace(t, p)
    # existing mappings now point at the .ogg files
    for k, v in list(maps.items()):
        maps[k] = [renamed.get(x, x) for x in (v if isinstance(v, list) else [v])]
    # files that were used under their own Steam name get a mapping to the .ogg
    for old, new in renamed.items():
        if old.startswith("deck_ui_") and old not in maps and old not in ignore:
            maps[old] = [new]
    meta["mappings"] = maps
    json.dump(meta, open(pj, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"{pack}: {len(renamed)} wav -> ogg")
