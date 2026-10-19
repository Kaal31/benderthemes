"""Run after tools/package_themes.py. Confirm only matched audio leaves online ZIPs."""
import json
from pathlib import Path
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "py_modules"))
from deckthemes_audio import catalog
from theme_pack_names import asset_filename

specs = catalog()
ids = {p["id"] for p in specs}
folders = {folder for p in specs for folder in p.get("folders", [])}
packs = json.loads((ROOT / "out/themes/theme-catalog.json").read_text())["themes"]
assert len(packs) == 19
names, dependencies = set(), set()
for pack in packs:
    assert set(pack["audioPacks"]) <= ids
    dependencies.update(pack["audioPacks"])
    with zipfile.ZipFile(ROOT / "out/themes" / asset_filename(pack["id"], pack["version"])) as archive:
        for name in archive.namelist():
            names.add(name)
            assert not (name.startswith("sounds/") and name.split("/")[1] in folders), name
assert len(dependencies) == 20
for manifest in (ROOT / "bundle/sounds").glob("*/pack.json"):
    if manifest.parent.name not in folders:
        assert "sounds/" + manifest.parent.name + "/pack.json" in names, manifest.parent.name
print("PASS online packaging: all 20 source dependencies, matched audio omitted, every unmatched sound pack preserved")
