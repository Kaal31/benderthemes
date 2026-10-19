"""Build the standalone Blue Glass community-theme asset, without rebuilding other packs."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def build(output, version, showcase=None, poster=None):
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        raise ValueError("Use a semantic version, e.g. 1.0.0")
    source = ROOT / "themes/blue-glass"
    output.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((source / "theme.json").read_text(encoding="utf-8"))
    assert manifest["id"] == "blue-glass" and manifest["layout"] == "frame"
    target = output / f"BlueGlass-theme-v{version}.zip"
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(source.rglob("*")):
            if not path.is_file() or any(part.startswith(".") for part in path.relative_to(source).parts):
                continue
            info = zipfile.ZipInfo(path.relative_to(source).as_posix(), (2020, 1, 1, 0, 0, 0))
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, path.read_bytes())
    with zipfile.ZipFile(target) as archive:
        assert archive.testzip() is None
        for name in ["theme.json", "index.html", "style.css", "app.js", "pages.js", "audio.js", "video.js", "test-video.mp4"]:
            assert name in archive.namelist(), name
    files = [target]
    for path, name in [(showcase, "showcase.gif"), (poster, "poster.png")]:
        if path:
            dest = output / name
            shutil.copyfile(path, dest)
            files.append(dest)
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    data = {"schema": 1, "id": "blue-glass", "name": "Blue Glass", "version": version,
            "tag": f"blue-glass-v{version}", "source": {"repo": "Kaal31/benderthemes", "branch": "experimental", "commit": commit},
            "files": [{"name": p.name, "size": p.stat().st_size, "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]}
    (output / "manifest.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"Built {target.name} ({target.stat().st_size} bytes); archive verified")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "out/community/blue-glass")
    parser.add_argument("--version", default="1.0.0")
    parser.add_argument("--showcase", type=Path)
    parser.add_argument("--poster", type=Path)
    args = parser.parse_args()
    build(args.output, args.version, args.showcase, args.poster)
