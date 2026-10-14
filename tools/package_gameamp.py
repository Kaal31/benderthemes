"""Package the local GameAmp theme and its companion host, without changing catalogs."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
destination = root.parent
theme = root / "themes/gameamp"
with zipfile.ZipFile(destination / "GameAmp-theme.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(theme.rglob("*")):
        if p.is_file():
            z.write(p, p.relative_to(theme).as_posix())
with zipfile.ZipFile(destination / "ThemeHub-GameAmp.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for name in ["main.py", "plugin.json", "package.json", "README.md", "dist/index.js", "theme-catalog.json"]:
        z.write(root / name, "DeckHomeThemes/" + name)
    for name in ["third-party", "py_modules", "defaults", "themes"]:
        for p in sorted((root / name).rglob("*")):
            if p.is_file() and "__pycache__" not in p.parts and not p.name.startswith("."):
                z.write(p, "DeckHomeThemes/" + p.relative_to(root).as_posix())
for name in ["GameAmp-theme.zip", "ThemeHub-GameAmp.zip"]:
    with zipfile.ZipFile(destination / name) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(set(z.namelist()))
    print(name, (destination / name).stat().st_size, "bytes; verified")
