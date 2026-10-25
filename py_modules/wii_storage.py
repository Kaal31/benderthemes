"""Read installed Steam manifests and classify their actual mounted storage."""
import os
import re
import shutil
from pathlib import Path


def mounted_volumes(path="/proc/self/mountinfo"):
    volumes = []
    try:
        for line in Path(path).read_text(encoding="utf-8").splitlines():
            left, right = line.split(" - ", 1)
            mount = re.sub(r"\\([0-7]{3})", lambda m: chr(int(m[1], 8)), left.split()[4])
            source = right.split()[1]
            volumes.append((os.path.realpath(mount), source))
    except (OSError, ValueError, IndexError):
        pass
    return volumes


def device_kind(source, sys_root="/sys/class/block"):
    if os.path.islink(source):
        source = os.path.realpath(source)
    match = re.match(r"/dev/(mmcblk\d+)(?:p\d+)?$", source)
    if match:
        try:
            # An internal eMMC also uses mmcblk names: check the actual card type.
            card_type = (Path(sys_root) / match[1] / "device" / "type").read_text().strip()
            return "sd" if card_type == "SD" else "internal" if card_type == "MMC" else "unknown"
        except OSError:
            return "unknown"
    return "internal" if source.startswith("/dev/nvme") else "unknown"


def scan_storage(libraries, volumes=None, sys_root="/sys/class/block"):
    volumes = mounted_volumes() if volumes is None else volumes
    games = {}
    free_bytes = {}
    counted = set()
    for mount, source in volumes:
        kind = device_kind(source, sys_root)
        identity = os.path.realpath(source) if os.path.islink(source) else source
        if kind not in ("internal", "sd") or identity in counted:
            continue
        try:
            available = shutil.disk_usage(mount).free
        except OSError:
            continue
        counted.add(identity)
        free_bytes[kind] = free_bytes.get(kind, 0) + available
    for steamapps in libraries:
        root = Path(steamapps).resolve()
        matches = [(mount, source) for mount, source in volumes if root.is_relative_to(Path(mount).resolve())]
        source = max(matches, key=lambda v: len(v[0]))[1] if matches else ""
        kind = device_kind(source, sys_root)
        for manifest in root.glob("appmanifest_*.acf"):
            try:
                data = manifest.read_text(encoding="utf-8", errors="replace")
                fields = dict(re.findall(r'"(appid|installdir|StateFlags)"\s+"([^"\n]+)"', data))
                appid = fields.get("appid", "")
                install = (root / "common" / fields.get("installdir", "")).resolve()
                if not appid.isdigit() or not fields.get("installdir") or not install.is_relative_to(root / "common"):
                    continue
                if int(fields.get("StateFlags", "0")) & 4 and install.is_dir():
                    games[appid] = kind
            except (OSError, ValueError):
                continue
    return {"games": games, "freeBytes": free_bytes, "sdDetected": any(device_kind(source, sys_root) == "sd" for _, source in volumes)}
