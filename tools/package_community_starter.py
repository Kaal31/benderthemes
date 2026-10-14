"""Refresh the starter's SDK and package an importable theme ZIP."""
from pathlib import Path
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
THEME = ROOT / "themes" / "community-starter"
shutil.copyfile(ROOT / "sdk" / "theme-bridge.js", THEME / "theme-bridge.js")
OUT = ROOT / "out" / "CommunityTheme-Starter.zip"
OUT.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(THEME.rglob("*")):
        if path.is_file():
            archive.write(path, path.relative_to(THEME).as_posix())
print(OUT)
