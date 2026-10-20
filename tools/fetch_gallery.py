"""Verify the published, catalog-pinned Hub gallery for release browser checks."""
import hashlib
import io
import json
from pathlib import Path
import urllib.request
import zipfile

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def fetch_gallery():
    gallery = json.loads((ROOT / "asset-catalog.json").read_text(encoding="utf-8"))["gallery"]
    other = json.loads((ROOT / "theme-catalog.json").read_text(encoding="utf-8"))["gallery"]
    if gallery != other:
        raise ValueError("Theme and asset catalogs must pin the same gallery")
    expected = {f"{ident}.{ext}" for ident in gallery["themes"] for ext in ("gif", "jpg")}
    request = urllib.request.Request(gallery["url"], headers={"User-Agent": "ThemeHub-gallery-check"})
    with urllib.request.urlopen(request, timeout=180) as response:
        raw = response.read(24 * 1024 * 1024 + 1)
    if len(raw) != gallery["size"] or hashlib.sha256(raw).hexdigest() != gallery["sha256"]:
        raise ValueError("Published gallery size or SHA-256 mismatch")
    images = {}
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        entries = archive.infolist()
        if len(entries) != len(expected) or {entry.filename for entry in entries} != expected:
            raise ValueError("Gallery must contain exactly the cataloged previews and posters")
        if sum(entry.file_size for entry in entries) > 32 * 1024 * 1024:
            raise ValueError("Gallery exceeds extraction limit")
        for entry in entries:
            if Path(entry.filename).name != entry.filename:
                raise ValueError("Gallery paths must be plain filenames")
            data = archive.read(entry)
            with Image.open(io.BytesIO(data)) as picture:
                if picture.size != (640, 400):
                    raise ValueError(f"Wrong preview dimensions: {entry.filename}")
                if entry.filename.endswith(".gif") and picture.n_frames < 2:
                    raise ValueError(f"Preview must be animated: {entry.filename}")
                picture.verify()
            images[entry.filename] = data
    target = ROOT / "out/theme-previews"
    target.mkdir(parents=True, exist_ok=True)
    for name, data in images.items():
        (target / name).write_bytes(data)
    print(f"Verified published gallery: SHA-256, {len(images)} images, {len(gallery['themes'])} animated themes")


if __name__ == "__main__":
    fetch_gallery()
