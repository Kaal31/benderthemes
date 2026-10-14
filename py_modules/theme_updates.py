"""Numbered GitHub releases, installed through Decky (adapted from SLSDeck)."""
import json
import os
import re
import time
from urllib.request import Request
from theme_network import urlopen

import decky

REPO = "Kaal31/benderthemes"
TAG = re.compile(r"^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
CHANNEL_TAG = re.compile(r"^(beta|experimental|optimization-testing)-v((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))-([1-9]\d*)(?:-([1-9]\d*))?$")
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


def release_identity(tag):
    if TAG.fullmatch(tag):
        return {"channel": "stable", "version": tag[1:], "build": 0, "attempt": 0}
    match = CHANNEL_TAG.fullmatch(tag)
    if not match:
        raise ValueError("Invalid numbered release tag")
    channel, version, build, attempt = match.groups()
    return {"channel": channel, "version": version, "build": int(build), "attempt": int(attempt or 1)}


def asset_url(version, tag=None):
    version_key(version)
    tag = tag or "v" + version
    if release_identity(tag)["version"] != version:
        raise ValueError("Release tag/version mismatch")
    return f"https://github.com/{REPO}/releases/download/{tag}/DeckHomeThemes-v{version}.zip"


def trusted_tag(version, url):
    prefix = f"https://github.com/{REPO}/releases/download/"
    if not isinstance(url, str) or not url.startswith(prefix):
        raise ValueError("Refusing an untrusted plugin package URL")
    tag = url[len(prefix):].split("/", 1)[0]
    if url != asset_url(version, tag):
        raise ValueError("Refusing an untrusted plugin package URL")
    return tag


def installed_identity():
    data = _read(os.path.join(decky.DECKY_PLUGIN_DIR, "release-channel.json"))
    try:
        parsed = release_identity(data["tag"])
        if parsed["version"] == current_version() and parsed["channel"] == data.get("channel"):
            return {**parsed, "known": True}
    except (KeyError, TypeError, ValueError):
        pass
    return {"channel": "stable", "version": current_version(), "build": 0, "attempt": 0, "known": False}


def release_key(release):
    return (*version_key(release["version"]), release.get("build", 0), release.get("attempt", 0))


def normalise(raw):
    releases = {}
    for release in raw:
        if not isinstance(release, dict) or release.get("draft"):
            continue
        tag = str(release.get("tag_name", ""))
        try:
            parsed = release_identity(tag)
            if parsed["channel"] == "stable" and release.get("prerelease"):
                continue
            url = asset_url(parsed["version"], tag)
        except ValueError:
            continue
        asset = next((a for a in (release.get("assets") or [])
                      if isinstance(a, dict) and a.get("name") == f"DeckHomeThemes-v{parsed['version']}.zip"
                      and a.get("browser_download_url") == url), None)
        if asset is None:
            continue
        releases[tag] = {"tag": tag, **parsed, "assetUrl": url,
                         "notes": str(release.get("body") or ""),
                         "publishedAt": str(release.get("published_at") or "")}
    return sorted(releases.values(), key=release_key, reverse=True)


def status():
    current = current_version()
    installed = installed_identity()
    result = {"success": False, "currentVersion": current, "releases": [],
              "latest": None, "updateAvailable": False, "stale": False,
              "currentChannel": installed["channel"], "channelKnown": installed["known"],
              "currentBuild": installed["build"], "currentAttempt": installed["attempt"]}
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
    releases = [r for r in result["releases"] if r["channel"] == installed["channel"]]
    result["channels"] = [c for c in ("stable", "beta", "experimental", "optimization-testing") if any(r["channel"] == c for r in result["releases"])]
    if releases:
        result["latest"] = releases[0]
        try:
            result["updateAvailable"] = release_key(releases[0]) > release_key(installed)
        except ValueError:
            pass
    return result


def prepare_replacement(version, url):
    try:
        tag = trusted_tag(version, url)
        _write(_path("decky-replacement.json"), {"createdAt": time.time(), "version": version, "url": url, "tag": tag})
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
                 and bool(trusted_tag(marker["version"], marker["url"])))
    except (KeyError, TypeError, ValueError):
        valid = False
    if not valid:
        clear_replacement()
    return valid
