"""Check the Hub assets and lightweight installer before publishing a release."""
import hashlib
import json
from pathlib import Path
import zipfile
import sys
import re
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
from theme_pack_names import asset_filename

root = Path(__file__).resolve().parents[1]
version = json.loads((root / "package.json").read_text())["version"]
# USE_PUBLISHED_ASSETS=1: the packs were published earlier on Kaal31/deckthemes-assets and the installer carries
# asset-catalog.json; only the installer is checked here (the packs were verified when they were published).
import os
PUBLISHED = os.environ.get("USE_PUBLISHED_ASSETS") == "1"
catalog = json.loads((root / ("asset-catalog.json" if PUBLISHED else "out/themes/theme-catalog.json")).read_text())
settings_source = (root / "src/settings.ts").read_text(encoding="utf-8")
theme_declaration = settings_source.split("export const THEMES:", 1)[1].split("];", 1)[0]
layouts = set(re.findall(r'id:\s*"([a-z0-9-]+)"', theme_declaration)) - {"frame", "native"}
builtins_source = (root / "src/presets.ts").read_text(encoding="utf-8")
builtins = set(json.loads(re.search(r'export const BUILT_IN_THEMES = (\[[^;]+?\]) as const;', builtins_source).group(1)))
available = {theme.get("theme") for theme in catalog["themes"]} | builtins
assert not layouts - available, f"Themes missing from the release Hub: {sorted(layouts - available)}"
with zipfile.ZipFile(root / f"out/DeckHomeThemes-v{version}.zip") as plugin:
    for name in ("screensaver-player/index.html", "screensaver-player/player.js", "py_modules/theme_screensavers.py"):
        assert "DeckHomeThemes/" + name in plugin.namelist(), f"Missing screensaver runtime: {name}"
    assert plugin.testzip() is None
    core_defaults = ("DeckHomeThemes/defaults/assets/console-intros/", "DeckHomeThemes/defaults/sounds/DHT Onyx iPod/")
    assert not any(n.startswith("DeckHomeThemes/bundle/") or (n.startswith("DeckHomeThemes/defaults/") and not n.startswith(core_defaults)) for n in plugin.namelist()), "Optional theme resources leaked into the installer"
    assert json.loads(plugin.read("DeckHomeThemes/theme-catalog.json")) == catalog
    assert json.loads(plugin.read("DeckHomeThemes/package.json"))["version"] == version
    for manifest in (root / "themes").glob("*/theme.json"):
        assert f"DeckHomeThemes/themes/{manifest.parent.name}/theme.json" in plugin.namelist(), f"Bundled theme missing: {manifest.parent.name}"
if PUBLISHED:
    for theme in catalog["themes"]:
        assert theme["url"] == f"https://github.com/Kaal31/deckthemes-assets/releases/download/{theme['id']}-v{theme['version']}/{asset_filename(theme['id'], theme['version'])}"
    print("installer verified against the published catalogue")
    sys.exit(0)
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
