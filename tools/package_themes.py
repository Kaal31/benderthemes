"""Build theme ZIPs and their checksum catalog for the existing GitHub release."""
from pathlib import Path
import hashlib
import json
import re
import zipfile
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
from theme_pack_names import asset_filename

ROOT = Path(__file__).resolve().parents[1]
LABELS = {"vita": "PS Vita", "ps2": "PS2", "ps3": "PS3", "psp": "PSP", "ps4": "PS4", "ps5": "PS5",
          "xbox": "Original Xbox", "x360": "Xbox 360 dashboards", "aero": "Aero", "aero2": "Aero V2",
          "dial": "Alien Dial", "castle": "Floating Castle", "republic": "Republic Office",
          "minecraft": "Minecraft", "pain": "Six Paths", "nazarick": "Nazarick", "extras": "Extra resources"}


def owners(relative):
    parts = relative.parts
    name = relative.as_posix().lower()
    if parts[0] in ("notices",):
        return []  # Notices are included in every pack below.
    if parts[0] == "skins":
        return ["ps3" if parts[1] == "p3t" else "vita"]
    if parts[0] == "wallpapers":
        return ["aero", "aero2"]
    if parts[0] == "dial":
        return ["dial"]
    if parts[0] == "cinematic":
        return [relative.stem]
    if parts[0] == "assets":
        group = parts[1]
        if group.startswith("xmb-"): return ["ps3", "psp"]
        if group.startswith("x360-"): return ["x360"]
        return [{"xbox-original": "xbox", "dial-skins": "dial"}.get(group, group) if group in ("xbox-original", "dial-skins", "minecraft", "nazarick", "pain") else "extras"]
    if parts[0] == "sounds":
        folder = parts[1].lower()
        for pattern, theme in [(r"mc360|360", "x360"), (r"minecraft", "minecraft"), (r"nazarick", "nazarick"),
                               (r"six paths", "pain"), (r"castle|sao", "castle"), (r"republic", "republic"),
                               (r"vita", "vita"), (r"ps2", "ps2"), (r"ps3", "ps3"), (r"ps4|playstation 4", "ps4"),
                               (r"ps5", "ps5"), (r"psp", "psp"), (r"xbox|theseus", "xbox"), (r"alien dial", "dial")]:
            if re.search(pattern, folder): return [theme]
        if "windows" in folder: return ["aero", "aero2"]
    return ["extras"]


def build():
    version = json.loads((ROOT / "package.json").read_text())["version"]
    out = ROOT / "out/themes"
    out.mkdir(parents=True, exist_ok=True)
    groups = {key: [] for key in LABELS}
    notices = []
    for path in sorted((ROOT / "bundle").rglob("*")):
        if not path.is_file() or "__pycache__" in path.parts:
            continue
        relative = path.relative_to(ROOT / "bundle")
        assigned = owners(relative)
        if not assigned:
            notices.append((path, relative.as_posix()))
        for key in assigned:
            groups[key].append((path, relative.as_posix()))
    for path in sorted((ROOT / "third-party").rglob("*")):
        if path.is_file():
            notices.append((path, "notices/third-party/" + path.relative_to(ROOT / "third-party").as_posix()))
    lock_path = ROOT / "asset-catalog.json"
    previous = json.loads(lock_path.read_text(encoding="utf-8")) if lock_path.exists() else {"themes": []}
    old = {p["id"]: p for p in previous["themes"]}
    catalog = {"schema": 1, "themes": []}
    for ident, files in groups.items():
        if not files:
            continue
        target = out / asset_filename(ident, version)
        # Previews are published separately and cached by the Hub.
        all_files = files + notices
        with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
            for path, name in all_files:
                info = zipfile.ZipInfo(name, (2020, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                z.writestr(info, path.read_bytes())
        digest = hashlib.sha256(target.read_bytes()).hexdigest()
        prior = old.get(ident)
        pack_version = prior["version"] if prior else "1.0.0"
        if prior and prior["sha256"] != digest:
            major, minor, patch = map(int, pack_version.split("."))
            pack_version = f"{major}.{minor}.{patch + 1}"
        renamed = out / asset_filename(ident, pack_version)
        if renamed != target:
            target.replace(renamed)
        target = renamed
        catalog["themes"].append({"id": ident, "name": LABELS[ident], "version": pack_version,
            "theme": ident if ident != "extras" else None,
            "description": "Artwork, sounds and optional skins for " + LABELS[ident] + ".",
            "minPluginVersion": "1.10.2", "size": target.stat().st_size,
            "resources": [name for _, name in files],
            "unpackedSize": sum(p.stat().st_size for p, _ in all_files),
            "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
            "url": f"https://github.com/Kaal31/deckthemes-assets/releases/download/{ident}-v{pack_version}/{target.name}",
            "preview": None,
            "poster": None})
    preview_zip = out / "HubPreviews.zip"
    with zipfile.ZipFile(preview_zip, "w", zipfile.ZIP_DEFLATED) as z:
        for ident in LABELS:
            for ext in ("gif", "jpg"):
                path = ROOT / f"out/theme-previews/{ident}.{ext}"
                if path.is_file():
                    info = zipfile.ZipInfo(f"{ident}.{ext}", (2020,1,1,0,0,0))
                    info.compress_type = zipfile.ZIP_DEFLATED
                    z.writestr(info, path.read_bytes())
    preview_hash = hashlib.sha256(preview_zip.read_bytes()).hexdigest()
    catalog["gallery"] = {"sha256": preview_hash, "size": preview_zip.stat().st_size,
        "url": f"https://github.com/Kaal31/deckthemes-assets/releases/download/gallery-{preview_hash[:16]}/HubPreviews.zip"}
    payload = json.dumps(catalog, indent=2) + "\n"
    (out / "theme-catalog.json").write_text(payload, encoding="utf-8")
    (ROOT / "theme-catalog.json").write_text(payload, encoding="utf-8")
    print(f"Built {len(catalog['themes'])} downloadable packs in {out}")


if __name__ == "__main__":
    build()
