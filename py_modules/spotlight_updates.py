"""Spotlight updates use Decky's installer; installed manifests are the version authority.

Only sources explicitly selected in Spotlight or matching a curated name AND author
are tracked. DeckyUp reads the same repository metadata. No DeckyUp private state is
read or written, and existing source metadata is never replaced.
"""
import io
import json
import os
import re
import stat
import threading
import tempfile
import time
import zipfile
from pathlib import Path
from urllib.parse import quote, unquote
from urllib.request import Request

from plugin_catalog import repo_key, release_zip

TTL = 4 * 3600
MAX_ZIP = 100 * 1024 * 1024
_lock = threading.RLock()


def read(path):
    path = Path(path)
    if path.is_symlink() or path.stat().st_size > 1024 * 1024:
        raise ValueError("Unsafe or oversized metadata")
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError("Invalid metadata")
    return value


def write(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    # A unique sibling also avoids following a plugin-provided .tmp symlink.
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent, delete=False) as stream:
        tmp = stream.name
        json.dump(value, stream, ensure_ascii=False, indent=2)
    try:
        if path.exists():
            previous = path.stat()
            os.chmod(tmp, stat.S_IMODE(previous.st_mode))
            if hasattr(os, "chown"):
                os.chown(tmp, previous.st_uid, previous.st_gid)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def sources():
    return json.loads(Path(__file__).with_name("spotlight_plugins.json").read_text(encoding="utf-8"))


def metadata_repo(value):
    if isinstance(value, dict):
        value = value.get("url")
    return repo_key(value.removeprefix("git+").removeprefix("github:")) if isinstance(value, str) else ""


def conflicting(manifest, package, key):
    for data in (manifest, package):
        bugs = data.get("bugs", {})
        for value in (data.get("repository"), data.get("homepage"), bugs.get("url") if isinstance(bugs, dict) else bugs):
            other = metadata_repo(value)
            if other and other != key:
                return True
    return False


def remember(cache_dir, repo, name, author, zip_url):
    key = repo_key(repo)
    if not key or not release_zip({"zipUrl": zip_url}, key) or not isinstance(name, str) or not name.strip() or not isinstance(author, str) or not author.strip():
        return {"success": False, "error": "Invalid Spotlight source"}
    with _lock:
        path = Path(cache_dir) / "sources.json"
        try:
            records = read(path)
        except (OSError, ValueError):
            records = {}
        records[key] = {"repo": key, "name": name[:100], "authors": [author[:200]], "asset": unquote(zip_url.rsplit("/", 1)[-1])}
        write(path, records)
    return {"success": True}


def installed(plugins_dir, records):
    result = []
    root = Path(plugins_dir)
    if not root.is_dir():
        return result
    for folder in sorted(root.iterdir())[:400]:
        if folder.is_symlink() or not folder.is_dir():
            continue
        try:
            manifest, package = read(folder / "plugin.json"), read(folder / "package.json")
        except (OSError, ValueError):
            continue
        name, author, version = manifest.get("name"), manifest.get("author"), package.get("version")
        if not isinstance(version, str):
            continue
        for source in records:
            key = repo_key(source["repo"])
            if name != source["name"] or author not in source["authors"] or conflicting(manifest, package, key):
                continue
            # Make the confirmed source visible to DeckyUp's installed-plugin scanner.
            # Preserve any existing metadata, including non-GitHub repository fields.
            if not manifest.get("repository") and not package.get("repository"):
                try:
                    manifest["repository"] = "https://github.com/" + source["repo"]
                    write(folder / "plugin.json", manifest)
                except OSError:
                    pass  # updates still work if metadata is read-only
            result.append({**source, "id": folder.name, "name": name, "author": author, "currentVersion": version,
                           "root": bool({"root", "_root"}.intersection(manifest.get("flags", [])))})
            break
    return result


def download(url, limit):
    from theme_network import urlopen
    with urlopen(Request(url, headers={"User-Agent": "ThemeHub-Spotlight", "Accept": "application/vnd.github+json"}), timeout=25) as response:
        raw = response.read(limit + 1)
    if len(raw) > limit:
        raise ValueError("Release exceeds the download limit")
    return raw


def version_key(value):
    match = re.fullmatch(r"v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?", value or "")
    if not match:
        return None
    prerelease = match.group(4)
    parts = tuple((0, int(p)) if p.isdigit() else (1, p) for p in prerelease.split(".")) if prerelease else ()
    return (*map(int, match.groups()[:3]), 0 if prerelease else 1, parts)


def inspect_zip(raw, plugin):
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        candidates = [n for n in archive.namelist() if n.endswith("/plugin.json") and n.count("/") == 1]
        if len(candidates) != 1:
            raise ValueError("Release is not a single Decky plugin package")
        prefix = candidates[0][:-len("plugin.json")]
        if prefix in ("../", "./") or "\\" in prefix:
            raise ValueError("Invalid plugin package path")
        def meta(name):
            info = archive.getinfo(prefix + name)
            if info.file_size > 1024 * 1024:
                raise ValueError("Oversized package manifest")
            return json.loads(archive.read(info))
        manifest, package = meta("plugin.json"), meta("package.json")
        if manifest.get("name") != plugin["name"] or manifest.get("author") != plugin["author"]:
            raise ValueError("Release plugin identity differs from the installed plugin")
        if conflicting(manifest, package, repo_key(plugin["repo"])):
            raise ValueError("Release metadata points to another repository")
        if prefix + "dist/index.js" not in archive.namelist():
            raise ValueError("Release has no built Decky frontend")
        version = package.get("version")
        if not version_key(version):
            raise ValueError("Release has no supported version")
        return version, bool({"root", "_root"}.intersection(manifest.get("flags", [])))


def latest(plugin, fetch=download):
    if not version_key(plugin["currentVersion"]):
        raise ValueError("Installed version is unsupported; use the project's updater")
    base = "https://api.github.com/repos/" + plugin["repo"]
    prefix = plugin.get("tagPrefix", "")
    if prefix:
        # OpenNOW publishes frequent app nightlies in the same repo. Its Decky
        # releases can fall outside the release listing's first hundred entries.
        refs = json.loads(fetch(base + "/git/matching-refs/tags/" + quote(prefix, safe=""), 4 * 1024 * 1024))
        if not isinstance(refs, list):
            raise ValueError("Invalid tag response")
        tags = [r.get("ref", "").removeprefix("refs/tags/") for r in refs]
        tags = [t for t in tags if t.startswith(prefix) and version_key(t[len(prefix):])]
        tags.sort(key=lambda t: version_key(t[len(prefix):]), reverse=True)
        releases = [json.loads(fetch(base + "/releases/tags/" + quote(tag, safe=""), 4 * 1024 * 1024)) for tag in tags[:10]]
    else:
        releases = json.loads(fetch(base + "/releases?per_page=100", 4 * 1024 * 1024))
    if not isinstance(releases, list):
        raise ValueError("Invalid release response")
    for release in releases:
        if release.get("draft") or (release.get("prerelease") and not (plugin.get("prerelease") or "-" in plugin["currentVersion"])):
            continue
        if not release.get("tag_name", "").startswith(plugin.get("tagPrefix", "")):
            continue
        assets = [a for a in release.get("assets", []) if a.get("name", "").lower().endswith(".zip")]
        exact = [a for a in assets if a["name"] == plugin.get("asset")]
        # For repos with multiple products never guess which ZIP contains this plugin.
        choices = exact or (assets if len(assets) == 1 else [])
        if not choices:
            continue
        asset = choices[0]
        url = release_zip({"assets": [asset]}, repo_key(plugin["repo"]))
        if not url:
            continue
        if asset.get("size", 0) > MAX_ZIP:
            raise ValueError("Release exceeds the download limit")
        version, root = inspect_zip(fetch(url, MAX_ZIP), plugin)
        return {"version": version, "zipUrl": url, "tag": release["tag_name"], "root": root,
                "updateAvailable": bool(version_key(plugin["currentVersion"]) and version_key(version) > version_key(plugin["currentVersion"]))}
    raise ValueError("No compatible release ZIP found")


def deckyup_installed(plugins_dir):
    """Read Decky's installed manifests, independent of folder naming."""
    try:
        folders = sorted(Path(plugins_dir).iterdir())[:400]
    except OSError:
        return False
    for folder in folders:
        if folder.is_symlink() or not folder.is_dir():
            continue
        try:
            manifest = read(folder / "plugin.json")
            if manifest.get("name") in ("Decky Direct Updater", "DeckyUp") and manifest.get("author") == "nukeador":
                return True
        except (OSError, ValueError):
            continue
    return False


def status(cache_dir, plugins_dir, refresh=False, fetch=download, now=time.time):
    with _lock:
        records = sources()
        try:
            tracked = read(Path(cache_dir) / "sources.json")
            known = {repo_key(s["repo"]) for s in records}
            records += [s for key, s in tracked.items() if key not in known]
        except (OSError, ValueError):
            pass
        plugins = installed(plugins_dir, records)
        try:
            cache = read(Path(cache_dir) / "updates.json")
        except (OSError, ValueError):
            cache = {}
        rows = []
        for plugin in plugins:
            identity = plugin["id"] + "|" + plugin["repo"] + "|" + plugin["currentVersion"]
            saved = cache.get(identity, {})
            fresh = 0 <= now() - saved.get("checkedAt", 0) < TTL
            if refresh or not fresh:
                try:
                    saved = {**latest(plugin, fetch), "checkedAt": now()}
                except Exception as error:
                    saved = {"checkedAt": now(), "error": str(error), "updateAvailable": False}
                cache[identity] = saved
            rows.append({**plugin, **saved})
        write(Path(cache_dir) / "updates.json", cache)
        return {"plugins": rows, "updateAvailable": any(r.get("updateAvailable") for r in rows),
                "deckyUpInstalled": deckyup_installed(plugins_dir)}


def prepare(cache_dir, plugins_dir, ident, version, url):
    """Re-read installed versions and validate the offered release before handoff."""
    result = status(cache_dir, plugins_dir)
    row = next((r for r in result["plugins"] if r["id"] == ident and r.get("version") == version and r.get("zipUrl") == url and r.get("updateAvailable") and not r.get("error")), None)
    if not row:
        return {"success": False, "error": "The update changed; check for updates again."}
    return {"success": True, "name": row["name"], "root": row["root"]}
