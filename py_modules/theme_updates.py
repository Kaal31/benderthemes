"""Numbered GitHub releases, installed through Decky (adapted from SLSDeck)."""
import json
import os
import re
import time
from urllib.request import Request, urlopen

import decky

REPO = "Kaal31/benderthemes"
TAG = re.compile(r"^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
MARKER_TTL = 300


def _path(name):
    return os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, name)


def _read(path):
    try:
        with open(path, encoding="utf-8") as f:
            value = json.load(f)
        return value if isinstance(value, dict) else {}
    except (OSError, ValueError):
        return {}


def _write(path, value):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path + ".tmp", "w", encoding="utf-8") as f:
        json.dump(value, f)
    os.replace(path + ".tmp", path)


def current_version():
    return str(_read(os.path.join(decky.DECKY_PLUGIN_DIR, "package.json")).get("version", "unknown"))


def version_key(version):
    match = TAG.fullmatch("v" + version)
    if not match:
        raise ValueError("Invalid numbered version")
    return tuple(map(int, match.groups()))


def asset_url(version):
    version_key(version)
    return f"https://github.com/{REPO}/releases/download/v{version}/DeckHomeThemes-v{version}.zip"


def normalise(raw):
    releases = {}
    for release in raw:
        if not isinstance(release, dict):
            continue
        tag = str(release.get("tag_name", ""))
        if not TAG.fullmatch(tag) or release.get("draft") or release.get("prerelease"):
            continue
        version = tag[1:]
        url = asset_url(version)
        asset = next((a for a in (release.get("assets") or [])
                      if a.get("name") == f"DeckHomeThemes-v{version}.zip"
                      and a.get("browser_download_url") == url), None)
        if asset is None:
            continue
        releases[tag] = {"tag": tag, "version": version, "assetUrl": url,
                         "notes": str(release.get("body") or ""),
                         "publishedAt": str(release.get("published_at") or "")}
    return sorted(releases.values(), key=lambda r: version_key(r["version"]), reverse=True)


def status():
    current = current_version()
    result = {"success": False, "currentVersion": current, "releases": [],
              "latest": None, "updateAvailable": False, "stale": False}
    try:
        raw = []
        # Include historical numbered releases; never infer a ZIP from a source archive.
        for page in range(1, 11):
            req = Request(f"https://api.github.com/repos/{REPO}/releases?per_page=100&page={page}",
                          headers={"Accept": "application/vnd.github+json", "User-Agent": "DeckHomeThemes/updater"})
            with urlopen(req, timeout=20) as response:
                batch = json.load(response)
            if not isinstance(batch, list):
                raise ValueError("GitHub returned an invalid release list")
            raw.extend(batch)
            if len(batch) < 100:
                break
        releases = normalise(raw)
        result.update(success=True, releases=releases)
        try:
            _write(_path("plugin-releases-cache.json"), {"raw": raw, "checkedAt": time.time()})
        except OSError:
            pass  # A cache write failure must not discard a successful check.
    except Exception as exc:
        cached = _read(_path("plugin-releases-cache.json"))
        result.update(error=f"Could not check GitHub: {exc}", stale=True,
                      releases=normalise(cached.get("raw", [])), checkedAt=cached.get("checkedAt"))
    releases = result["releases"]
    if releases:
        result["latest"] = releases[0]
        try:
            result["updateAvailable"] = version_key(releases[0]["version"]) > version_key(current)
        except ValueError:
            pass
    return result


def prepare_replacement(version, url):
    try:
        if url != asset_url(version):
            raise ValueError("Refusing an untrusted plugin package URL")
        _write(_path("decky-replacement.json"), {"createdAt": time.time(), "version": version, "url": url})
        return {"success": True}
    except Exception as exc:
        return {"success": False, "error": str(exc)}


def clear_replacement():
    try:
        os.remove(_path("decky-replacement.json"))
    except FileNotFoundError:
        pass


def replacement_pending():
    marker = _read(_path("decky-replacement.json"))
    try:
        valid = (0 <= time.time() - float(marker["createdAt"]) <= MARKER_TTL
                 and marker["url"] == asset_url(marker["version"]))
    except (KeyError, TypeError, ValueError):
        valid = False
    if not valid:
        clear_replacement()
    return valid
