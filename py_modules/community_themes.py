"""User-selected public GitHub sources. Packages stay inside the external theme sandbox.

Catalog URLs are pinned to a commit; release ZIPs are constrained to the source repo.
No catalog: one release ZIP, or a ready-to-run theme at the repository root.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
import threading
import time
from urllib.error import HTTPError
from urllib.parse import quote, urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener, HTTPSHandler
import zipfile

import decky
import data_themes
from theme_network import ssl_context
from theme_updates import current_version, version_key

MAX_JSON = 2 * 1024 * 1024
MAX_SOURCES = 32
SDK_VERSION = 1
IDENT = re.compile(r"[a-z0-9][a-z0-9-]{0,47}")
LAYOUTS = set("native onyx silver frame wii wiiu switch n3ds vita ps2 ps3 psp ps4 ps5 x360 aero aero2 xbox dial castle republic minecraft pain nazarick ps1 iisu".split())
REPO = re.compile(r"[A-Za-z0-9][A-Za-z0-9-]{0,38}/[A-Za-z0-9_.-]{1,100}")
_lock = threading.RLock()
_check_lock = threading.Lock()
CHECK_INTERVAL = 6 * 60 * 60
RETRY_INTERVAL = 30 * 60
_progress = {"busy": False, "percent": 0, "message": ""}


def repository(value):
    if not isinstance(value, str):
        raise ValueError("Enter owner/repository or a public GitHub repository URL")
    value = value.strip().rstrip("/")
    if value.startswith("https://github.com/"):
        value = value[len("https://github.com/"):]
    if value.endswith(".git"):
        value = value[:-4]
    if not REPO.fullmatch(value) or value.split("/")[1] in (".", ".."):
        raise ValueError("Enter owner/repository or a public GitHub repository URL")
    return value.lower()


def _root():
    return Path(data_themes.user_root()) / ".community"


def _state_path():
    return Path(decky.DECKY_PLUGIN_SETTINGS_DIR) / "community-sources.json"


def _read(path, default=None):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {} if default is None else default


def _write(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(data), encoding="utf-8")
    os.replace(tmp, path)


def _key(repo, ident):
    return hashlib.sha256((repo + "/" + ident).encode()).hexdigest()[:24]


def _theme_id(repo, ident):
    return "community-" + _key(repo, ident)


def _allowed(url, repo, redirect=False):
    p = urlsplit(url)
    if p.scheme != "https" or p.username or p.password or p.port not in (None, 443) or p.fragment:
        return False
    host = p.hostname
    if host == "github.com":
        return p.path.lower().startswith("/" + repo + "/releases/download/") and not p.query
    if host == "api.github.com":
        return p.path.lower() == "/repos/" + repo or p.path.lower().startswith("/repos/" + repo + "/")
    if host == "raw.githubusercontent.com":
        return p.path.lower().startswith("/" + repo + "/") and not p.query
    if host == "codeload.github.com":
        return p.path.lower().startswith("/" + repo + "/")
    return redirect and host == "release-assets.githubusercontent.com"


class _Redirect(HTTPRedirectHandler):
    def __init__(self, repo):
        self.repo = repo

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not _allowed(newurl, self.repo, True):
            raise ValueError("Download redirected outside GitHub's package hosts")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _fetch(repo, url, dest=None, expected_size=None, sha256=None):
    if not _allowed(url, repo):
        raise ValueError("Download must belong to the selected GitHub repository")
    cap = data_themes.ZIP_MAX_BYTES if dest else MAX_JSON
    opener = build_opener(HTTPSHandler(context=ssl_context()), _Redirect(repo))
    digest = hashlib.sha256()
    payload = bytearray()
    count = 0
    out = open(dest, "wb") if dest else None
    try:
        with opener.open(Request(url, headers={"User-Agent": "ThemeHub/community", "Accept": "application/vnd.github+json"}), timeout=25) as response:
            while True:
                chunk = response.read(1 << 16)
                if not chunk:
                    break
                count += len(chunk)
                if count > cap or (expected_size is not None and count > expected_size):
                    raise ValueError("Download exceeds its size limit")
                digest.update(chunk)
                if out:
                    out.write(chunk)
                else:
                    payload.extend(chunk)
        if expected_size is not None and count != expected_size:
            raise ValueError("Download size does not match catalog")
        if sha256 and digest.hexdigest() != sha256:
            raise ValueError("Download checksum does not match catalog")
    finally:
        if out:
            out.close()
    return None if dest else json.loads(payload)


def _optional(repo, url):
    try:
        return _fetch(repo, url)
    except HTTPError as exc:
        if exc.code == 404:
            return None
        raise


def _package(repo, item, kind):
    if not isinstance(item, dict) or not isinstance(item.get("id"), str) or not IDENT.fullmatch(item["id"]):
        raise ValueError("Invalid catalog package ID")
    for field in ("version", "minPluginVersion"):
        version_key(item.get(field, ""))
    size = item.get("size")
    if type(size) is not int or not 0 < size <= data_themes.ZIP_MAX_BYTES:
        raise ValueError("Invalid package size")
    sha = item.get("sha256", "")
    if not isinstance(sha, str) or not re.fullmatch(r"[a-f0-9]{64}", sha):
        raise ValueError("Package needs a SHA-256 checksum")
    url = item.get("url", "")
    if not isinstance(url, str) or not _allowed(url, repo) or not url.lower().startswith(f"https://github.com/{repo}/releases/download/"):
        raise ValueError("Catalog packages must be release ZIPs in this repository")
    if not urlsplit(url).path.lower().endswith(".zip"):
        raise ValueError("Package must be a ZIP")
    result = {k: item[k] for k in ("id", "version", "minPluginVersion", "size", "sha256", "url")}
    result.update(kind=kind, name=str(item.get("name") or item["id"])[:120],
                  description=str(item.get("description") or "")[:1000], author=str(item.get("author") or repo.split("/")[0])[:100])
    sdk = item.get("minSdkVersion", 1)
    if type(sdk) is not int or not 1 <= sdk <= 10000:
        raise ValueError("Invalid minimum SDK version")
    result["minSdkVersion"] = sdk
    result["uiOverhaul"] = item.get("layout") == "native"
    preview = item.get("preview")
    if preview is not None:
        if not isinstance(preview, str) or not _allowed(preview, repo) or urlsplit(preview).hostname != "raw.githubusercontent.com":
            raise ValueError("Preview must be an image hosted in this repository on raw.githubusercontent.com")
        if Path(urlsplit(preview).path).suffix.lower() not in (".png", ".jpg", ".jpeg", ".webp", ".gif"):
            raise ValueError("Unsupported preview image")
        result["preview"] = preview
    deps = item.get("assets", [])
    if not isinstance(deps, list) or len(deps) > 16 or any(not isinstance(x, str) or not IDENT.fullmatch(x) for x in deps) or len(set(deps)) != len(deps):
        raise ValueError("Invalid asset dependencies")
    result["assets"] = deps
    return result


def discover(repo):
    meta = _fetch(repo, f"https://api.github.com/repos/{repo}")
    branch = meta["default_branch"]
    commit = _fetch(repo, f"https://api.github.com/repos/{repo}/commits/{quote(branch, safe='')}")["sha"]
    if not re.fullmatch(r"[a-f0-9]{40}", commit):
        raise ValueError("Invalid GitHub commit")
    catalog = _optional(repo, f"https://raw.githubusercontent.com/{repo}/{commit}/themehub-catalog.json")
    if catalog is not None:
        if not isinstance(catalog, dict) or catalog.get("schema") != 1 or not isinstance(catalog.get("themes"), list) or not catalog["themes"]:
            raise ValueError("Unsupported community catalog")
        assets = catalog.get("assets", [])
        if not isinstance(assets, list) or len(assets) + len(catalog["themes"]) > 200:
            raise ValueError("Catalog is too large")
        packages = [_package(repo, p, "theme") for p in catalog["themes"]] + [_package(repo, p, "asset") for p in assets]
        ids = [p["id"] for p in packages]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate catalog package IDs")
        asset_ids = {p["id"] for p in packages if p["kind"] == "asset"}
        if any(p["assets"] for p in packages if p["kind"] == "asset") or any(set(p["assets"]) - asset_ids for p in packages):
            raise ValueError("Unknown or nested asset dependency")
        return {"repo": repo, "mode": "catalog", "packages": packages, "error": ""}
    release = _optional(repo, f"https://api.github.com/repos/{repo}/releases/latest")
    zips = [p for p in (release or {}).get("assets", []) if str(p.get("name", "")).lower().endswith(".zip")]
    if len(zips) > 1:
        preferred = [p for p in zips if p["name"].lower() in ("theme.zip", repo.split("/")[1] + ".zip")]
        if len(preferred) != 1:
            raise ValueError("Multiple release ZIPs: name the theme theme.zip or add themehub-catalog.json")
        zips = preferred
    base = {"id": "theme", "kind": "theme", "name": str(meta.get("name") or repo)[:120], "author": repo.split("/")[0],
            "description": str(meta.get("description") or "")[:1000], "assets": [], "minPluginVersion": "1.10.8"}
    if zips:
        asset = zips[0]
        size = asset.get("size")
        if type(size) is not int or not 0 < size <= data_themes.ZIP_MAX_BYTES:
            raise ValueError("Release theme ZIP is too large")
        url = asset["browser_download_url"]
        if not _allowed(url, repo) or not url.lower().startswith(f"https://github.com/{repo}/releases/download/"):
            raise ValueError("Invalid release ZIP URL")
        digest = asset.get("digest") or ""
        sha = digest[7:] if re.fullmatch(r"sha256:[a-f0-9]{64}", digest) else None
        # Asset identity distinguishes replacement uploads under the same tag.
        base.update(url=url, size=size, sha256=sha, version=str(release["tag_name"])[:100], revision=str(asset["id"]) + ":" + str(asset.get("updated_at", "")))
    else:
        manifest = _optional(repo, f"https://raw.githubusercontent.com/{repo}/{commit}/theme.json")
        if not isinstance(manifest, dict) or manifest.get("schema") != 1:
            raise ValueError("No theme found: publish a compiled theme ZIP release or put a ready-to-run theme.json at the repository root")
        base["uiOverhaul"] = manifest.get("layout") == "native"
        base.update(name=str(manifest.get("name") or base["name"])[:120], url=f"https://api.github.com/repos/{repo}/zipball/{commit}",
                    size=None, sha256=None, version=commit[:12], revision=commit)
    return {"repo": repo, "mode": "single", "packages": [base], "error": ""}


def _revision(package, packages):
    refs = [package] + [p for p in packages if p["id"] in package.get("assets", [])]
    content = [{key: p.get(key) for key in ("id", "version", "url", "sha256", "revision")} for p in sorted(refs, key=lambda p: p["id"])]
    return hashlib.sha256(json.dumps(content, sort_keys=True).encode()).hexdigest()


def _installed(repo, ident, previous=False):
    return _read(_root() / ("previous" if previous else "current") / _key(repo, ident) / ".install.json")


def listing():
    with _lock:
        sources = []
        for source in _read(_state_path(), {"sources": []}).get("sources", []):
            packages = source.get("packages", [])
            themes = []
            for p in packages:
                if p["kind"] != "theme":
                    continue
                installed = _installed(source["repo"], p["id"])
                changed = bool(installed and installed.get("revision") != _revision(p, packages))
                if source["mode"] == "catalog" and installed:
                    try:
                        changed = changed and version_key(p["version"]) >= version_key(installed["version"])
                    except ValueError:
                        pass
                try:
                    compatible = all(version_key(current_version()) >= version_key(x["minPluginVersion"]) and x.get("minSdkVersion", 1) <= SDK_VERSION for x in [p] + [a for a in packages if a["id"] in p["assets"]])
                except ValueError:
                    compatible = False
                themes.append({"id": p["id"], "name": p["name"], "description": p["description"], "author": p["author"],
                               "version": p["version"], "size": p["size"], "compatible": compatible,
                               "preview": p.get("preview"),
                               "uiOverhaul": bool(p.get("uiOverhaul") or installed.get("nativeSha256")),
                               "layout": installed.get("layout") or ("native" if installed.get("nativeSha256") else "frame"),
                               "installedVersion": installed.get("version"), "themeId": installed.get("themeId"),
                               "updateAvailable": changed,
                               "canRollback": bool(_installed(source["repo"], p["id"], True))})
            sources.append({"repo": source["repo"], "mode": source["mode"], "error": source.get("error", ""), "themes": themes,
                            "featured": source["repo"] in featured_repositories(), "checkedAt": source.get("checkedAt"), "lastAttempt": source.get("lastAttempt")})
        return {"sources": sources}


def source_action(value, action):
    repo = repository(value)
    with _lock:
        state = _read(_state_path(), {"sources": []})
        sources = state["sources"]
        old = next((s for s in sources if s["repo"] == repo), None)
        if action == "remove":
            if repo in featured_repositories():
                raise ValueError("This repository is included by ThemeHub's maintainer")
            if any(_installed(repo, p["id"]) for p in (old or {}).get("packages", [])):
                raise ValueError("Uninstall this repository's themes before removing it")
            state["sources"] = [s for s in sources if s["repo"] != repo]
        elif action in ("add", "refresh"):
            if old is None and len(sources) >= MAX_SOURCES:
                raise ValueError("Repository limit reached")
            try:
                fresh = discover(repo)
                fresh.update(checkedAt=time.time(), lastAttempt=time.time())
                # Keep installed packages removed upstream visible for offline use/uninstall.
                if old:
                    present = {p["id"] for p in fresh["packages"]}
                    fresh["packages"] += [p for p in old["packages"] if p["id"] not in present and p["kind"] == "theme" and _installed(repo, p["id"])]
                    required = {a for p in fresh["packages"] for a in p["assets"]}
                    present = {p["id"] for p in fresh["packages"]}
                    fresh["packages"] += [p for p in old["packages"] if p["kind"] == "asset" and p["id"] in required and p["id"] not in present]
                state["sources"] = [fresh if s["repo"] == repo else s for s in sources] if old else sources + [fresh]
            except Exception as exc:
                if old is None:
                    raise
                old["error"] = f"Refresh failed; showing saved catalog: {str(exc)[:200]}"
                old["lastAttempt"] = time.time()
        else:
            raise ValueError("Unknown repository action")
        _write(_state_path(), state)
    return listing()


def featured_repositories():
    from community_catalog import REPOSITORIES
    return list(dict.fromkeys(repository(value) for value in REPOSITORIES))[:MAX_SOURCES]


def update_status():
    result = listing()
    updates = [{"repo": s["repo"], **t} for s in result["sources"] for t in s["themes"] if t["installedVersion"] and t["updateAvailable"]]
    result.update(updates=updates, updateCount=len(updates), checking=_check_lock.locked(),
                  errors=[{"repo": s["repo"], "error": s["error"]} for s in result["sources"] if s["error"]])
    return result


def check_updates(force=False):
    """Refresh installed sources at most every six hours; never install packages."""
    if not _check_lock.acquire(blocking=False):
        return update_status()
    try:
        with _lock:
            state = _read(_state_path(), {"sources": []})
            known = {s["repo"] for s in state["sources"]}
            for repo in featured_repositories():
                if repo not in known:
                    state["sources"].append({"repo": repo, "mode": "catalog", "packages": [], "error": ""})
            _write(_state_path(), state)
            sources = list(state["sources"])
        for source in sources:
            repo = source["repo"]
            installed = any(p["kind"] == "theme" and _installed(repo, p["id"]) for p in source["packages"])
            if not force and not installed and not (repo in featured_repositories() and not source["packages"]):
                continue
            interval = RETRY_INTERVAL if source.get("error") else CHECK_INTERVAL
            if not force and 0 <= time.time() - source.get("lastAttempt", 0) < interval:
                continue
            source_action(repo, "refresh")
    finally:
        _check_lock.release()
    return update_status()


def _extract_assets(archive, target, package):
    if target.exists():
        raise ValueError(f"Asset mount assets/{package['id']} is already supplied by the theme")
    with zipfile.ZipFile(archive) as z:
        plan = data_themes._zip_plan(z, "asset-pack.json")
        existing = [p for p in target.parent.parent.rglob("*") if p.is_file()]
        content = [(info, parts) for info, parts in plan if parts != ("asset-pack.json",)]
        if len(existing) + len(content) > data_themes.ZIP_MAX_FILES or sum(p.stat().st_size for p in existing) + sum(info.file_size for info, _ in content) > data_themes.ZIP_MAX_TOTAL:
            raise ValueError("Theme and assets exceed combined package limits")
        marker = next(info for info, parts in plan if parts == ("asset-pack.json",))
        if marker.file_size > data_themes.MAX_MANIFEST:
            raise ValueError("Asset manifest too large")
        manifest = json.loads(z.read(marker))
        if not isinstance(manifest, dict) or manifest.get("schema") != 1 or manifest.get("id") != package["id"] or manifest.get("version") != package["version"]:
            raise ValueError("Asset manifest does not match catalog")
        for info, parts in plan:
            if parts == ("asset-pack.json",):
                continue
            if Path(parts[-1]).suffix.lower() in (".html", ".htm", ".js", ".mjs") or parts[-1] == "theme.json":
                raise ValueError("Asset packs may contain media, fonts, CSS and data only")
            dest = target.joinpath(*parts)
            dest.parent.mkdir(parents=True, exist_ok=True)
            with z.open(info) as src, dest.open("wb") as out:
                shutil.copyfileobj(src, out)


def package_action(value, ident, action):
    repo = repository(value)
    if not isinstance(ident, str) or not IDENT.fullmatch(ident):
        raise ValueError("Invalid theme ID")
    if action not in ("install", "remove", "rollback"):
        raise ValueError("Unknown theme action")
    # Serialize repository changes and installs; no shared mutable package URLs from the frontend.
    with _lock:
        current = _root() / "current" / _key(repo, ident)
        previous = _root() / "previous" / _key(repo, ident)
        current.parent.mkdir(parents=True, exist_ok=True)
        previous.parent.mkdir(parents=True, exist_ok=True)
        if action == "remove":
            shutil.rmtree(current, ignore_errors=True)
            shutil.rmtree(previous, ignore_errors=True)
            data_themes._cache.clear()
            return {"ok": True}
        if action == "rollback":
            if not _installed(repo, ident, True):
                raise ValueError("No previous version available")
            swap = previous.with_name(previous.name + ".swap")
            os.rename(previous, swap)
            try:
                if current.exists():
                    os.rename(current, previous)
                os.rename(swap, current)
            except BaseException:
                if previous.exists() and not current.exists():
                    os.rename(previous, current)
                if swap.exists():
                    os.rename(swap, previous)
                raise
            data_themes._cache.clear()
            return {"ok": True, "themeId": _installed(repo, ident).get("themeId")}
        source = next((s for s in _read(_state_path(), {"sources": []})["sources"] if s["repo"] == repo), None)
        if not source:
            raise ValueError("Add this repository first")
        packages = source["packages"]
        package = next((p for p in packages if p["id"] == ident and p["kind"] == "theme"), None)
        if not package:
            raise ValueError("Theme not found")
        selected = [package] + [p for p in packages if p["id"] in package["assets"]]
        for p in selected:
            if version_key(current_version()) < version_key(p["minPluginVersion"]) or p.get("minSdkVersion", 1) > SDK_VERSION:
                raise ValueError("Update ThemeHub before installing this theme")
        if sum(p.get("size") or 0 for p in selected) > data_themes.ZIP_MAX_BYTES:
            raise ValueError("Theme and assets exceed combined download limits")
        _progress.update(busy=True, percent=0, message="Downloading theme")
        try:
            with tempfile.TemporaryDirectory(prefix=".install-", dir=_root()) as tmp:
                tmp = Path(tmp)
                stage = tmp / "theme"
                for index, p in enumerate(selected):
                    _progress.update(percent=int(index / len(selected) * 85), message=f"Downloading {p['name']}")
                    archive = tmp / f"{index}.zip"
                    _fetch(repo, p["url"], archive, p["size"], p["sha256"])
                    if index == 0:
                        data_themes._unpack(str(archive), str(stage))
                    else:
                        _extract_assets(archive, stage / "assets" / p["id"], p)
                files = [p for p in stage.rglob("*") if p.is_file()]
                if len(files) > data_themes.ZIP_MAX_FILES or sum(p.stat().st_size for p in files) > data_themes.ZIP_MAX_TOTAL:
                    raise ValueError("Theme and assets exceed combined package limits")
                manifest = data_themes._read_manifest(str(stage))
                # Native execution metadata is generated from validated installed contents.
                manifest.pop("nativeInstalled", None)
                manifest.pop("nativeSha256", None)
                if manifest.get("layout") not in LAYOUTS or not isinstance(manifest.get("name"), str) or not 0 < len(manifest["name"].strip()) <= 64:
                    raise ValueError("Theme needs a supported layout")
                if manifest["layout"] == "frame":
                    frame = manifest.get("frame")
                    entry = data_themes.safe_path(frame.get("entry")) if isinstance(frame, dict) else None
                    if not entry or Path(entry[-1]).suffix.lower() not in (".htm", ".html") or not stage.joinpath(*entry).is_file():
                        raise ValueError("Frame theme needs a compiled HTML entry file")
                if manifest["layout"] == "native":
                    native = manifest.get("native")
                    entry = data_themes.safe_path(native.get("entry")) if isinstance(native, dict) and native.get("api") == 1 else None
                    if not entry or Path(entry[-1]).suffix.lower() != ".js" or not stage.joinpath(*entry).is_file():
                        raise ValueError("Native theme needs native.api 1 and a compiled .js entry")
                    if stage.joinpath(*entry).stat().st_size > 8 * 1024 * 1024:
                        raise ValueError("Native entry exceeds 8 MB")
                    manifest["nativeInstalled"] = True
                    manifest["nativeSha256"] = hashlib.sha256(stage.joinpath(*entry).read_bytes()).hexdigest()
                theme_id = _theme_id(repo, ident)
                manifest["id"] = theme_id
                manifest["communityRevision"] = _revision(package, packages)
                _write(stage / "theme.json", manifest)
                _write(stage / ".install.json", {"repo": repo, "id": ident, "version": package["version"], "themeId": theme_id,
                                                  "nativeSha256": manifest.get("nativeSha256"), "layout": manifest["layout"],
                                                  "revision": _revision(package, packages)})
                if previous.exists():
                    shutil.rmtree(previous)
                if current.exists():
                    os.rename(current, previous)
                try:
                    os.rename(stage, current)
                except BaseException:
                    if previous.exists() and not current.exists():
                        os.rename(previous, current)
                    raise
            data_themes._cache.clear()
            _progress.update(percent=100, message="Installed")
            return {"ok": True, "themeId": theme_id}
        except Exception as exc:
            _progress.update(message=str(exc)[:200])
            raise
        finally:
            _progress["busy"] = False


def progress():
    return dict(_progress)


def recover():
    """Restore a complete version if shutdown interrupted a directory swap."""
    with _lock:
        previous = _root() / "previous"
        if not previous.is_dir():
            return
        current = _root() / "current"
        current.mkdir(parents=True, exist_ok=True)
        for swap in previous.glob("*.swap"):
            key = swap.name[:-5]
            if not re.fullmatch(r"[a-f0-9]{24}", key):
                continue
            target = current / key
            backup = previous / key
            if not target.exists():
                os.rename(swap, target)
            elif not backup.exists():
                os.rename(swap, backup)
        for backup in previous.iterdir():
            if re.fullmatch(r"[a-f0-9]{24}", backup.name) and not (current / backup.name).exists():
                os.rename(backup, current / backup.name)
        data_themes._cache.clear()
