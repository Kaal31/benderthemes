"""Check the Hub assets and lightweight installer before publishing a release."""
import hashlib
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1]
version = json.loads((root / "package.json").read_text())["version"]
catalog = json.loads((root / "out/themes/theme-catalog.json").read_text())
with zipfile.ZipFile(root / f"out/DeckHomeThemes-v{version}.zip") as plugin:
    assert plugin.testzip() is None
    assert not any(n.startswith(("DeckHomeThemes/defaults/", "DeckHomeThemes/bundle/")) for n in plugin.namelist()), "Bundled resources leaked into the installer"
    assert json.loads(plugin.read("DeckHomeThemes/theme-catalog.json")) == catalog
    assert json.loads(plugin.read("DeckHomeThemes/package.json"))["version"] == version
for theme in catalog["themes"]:
    archive = root / "out/themes" / f"theme-{theme['id']}-v{version}.zip"
    assert theme["version"] == version
    assert theme["url"] == f"https://github.com/Kaal31/benderthemes/releases/download/v{version}/{archive.name}"
    assert archive.stat().st_size == theme["size"]
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == theme["sha256"]
    with zipfile.ZipFile(archive) as pack:
        assert pack.testzip() is None
        assert sum(item.file_size for item in pack.infolist()) == theme["unpackedSize"]
    if theme.get("theme"):
        for ext in ("gif", "jpg"):
            assert (root / f"out/theme-previews/{theme['id']}.{ext}").is_file()
print(f"Verified installer and {len(catalog['themes'])} separate Hub packs for v{version}.")
