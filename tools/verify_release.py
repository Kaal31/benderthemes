"""Check the Hub assets and lightweight installer before publishing a release."""
import hashlib
import json
from pathlib import Path
import zipfile
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
from theme_pack_names import asset_filename

root = Path(__file__).resolve().parents[1]
version = json.loads((root / "package.json").read_text())["version"]
catalog = json.loads((root / "out/themes/theme-catalog.json").read_text())
with zipfile.ZipFile(root / f"out/DeckHomeThemes-v{version}.zip") as plugin:
    assert plugin.testzip() is None
    assert not any(n.startswith(("DeckHomeThemes/defaults/", "DeckHomeThemes/bundle/")) for n in plugin.namelist()), "Bundled resources leaked into the installer"
    assert json.loads(plugin.read("DeckHomeThemes/theme-catalog.json")) == catalog
    assert json.loads(plugin.read("DeckHomeThemes/package.json"))["version"] == version
for theme in catalog["themes"]:
    archive = root / "out/themes" / asset_filename(theme['id'], theme['version'])
    assert theme["url"] == f"https://github.com/Kaal31/deckthemes-assets/releases/download/{theme['id']}-v{theme['version']}/{archive.name}"
    assert archive.stat().st_size == theme["size"]
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == theme["sha256"]
    with zipfile.ZipFile(archive) as pack:
        assert pack.testzip() is None
        assert sum(item.file_size for item in pack.infolist()) == theme["unpackedSize"]
    assert not any(name.startswith("assets/hub/") for name in pack.namelist())
with zipfile.ZipFile(root / f"out/DeckHomeThemes-v{version}.zip") as plugin:
    assert not any("hub-previews/" in n for n in plugin.namelist())
gallery = root / "out/themes/HubPreviews.zip"
assert hashlib.sha256(gallery.read_bytes()).hexdigest() == catalog["gallery"]["sha256"]
with zipfile.ZipFile(gallery) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == 32
print("Verified lightweight installer, independently versioned themes and separate preview gallery.")
