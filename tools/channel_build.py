"""Identity and checksummed manifest for numbered channel builds; no rolling tags."""
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def identity(version, channel, build, attempt, commit):
    if channel not in ("beta", "experimental", "optimization-testing") or not re.fullmatch(r"\d+\.\d+\.\d+", version):
        raise ValueError("Invalid release channel or numeric package version")
    if not re.fullmatch(r"[1-9]\d*", str(build)) or not re.fullmatch(r"[1-9]\d*", str(attempt)):
        raise ValueError("Invalid workflow build number or attempt")
    if not re.fullmatch(r"[0-9a-f]{40}", commit):
        raise ValueError("Invalid source commit")
    tag = f"{channel}-v{version}-{build}-{attempt}"
    asset = f"DeckHomeThemes-v{version}.zip"
    base = f"https://github.com/Kaal31/benderthemes/releases/download/{tag}"
    return {"schema": 1, "channel": channel, "version": version, "build": int(build), "attempt": int(attempt),
            "commit": commit, "tag": tag, "assetName": asset, "assetUrl": f"{base}/{asset}", "catalogUrl": f"{base}/asset-catalog.json"}


def manifest(root):
    metadata = json.loads((root / "release-channel.json").read_text(encoding="utf-8"))
    expected = identity(metadata["version"], metadata["channel"], metadata["build"], metadata["attempt"], metadata["commit"])
    if metadata != expected:
        raise ValueError("Invalid build identity")
    archive = root / "out" / metadata["assetName"]
    with zipfile.ZipFile(archive) as plugin:
        if json.loads(plugin.read("DeckHomeThemes/release-channel.json")) != metadata:
            raise ValueError("Package is missing its channel identity")
        if json.loads(plugin.read("DeckHomeThemes/package.json"))["version"] != metadata["version"]:
            raise ValueError("Package version does not match release identity")
        if json.loads(plugin.read("DeckHomeThemes/theme-catalog.json")) != json.loads((root / "asset-catalog.json").read_text()):
            raise ValueError("Package does not contain the published asset catalogue")
    result = {**metadata, "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(), "size": archive.stat().st_size}
    (root / "out/channel-release.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return result


if __name__ == "__main__":
    if sys.argv[1] == "prepare":
        version = json.loads((ROOT / "package.json").read_text())["version"]
        data = identity(version, os.environ["RELEASE_CHANNEL"], os.environ["GITHUB_RUN_NUMBER"], os.environ["GITHUB_RUN_ATTEMPT"], os.environ["GITHUB_SHA"])
        (ROOT / "release-channel.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
        print("tag=" + data["tag"])
    elif sys.argv[1] == "manifest":
        manifest(ROOT)
    else:
        raise SystemExit("Expected prepare or manifest")
