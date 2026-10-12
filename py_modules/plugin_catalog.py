"""Plugin Spotlight search: the catalogue of all known Decky plugins.

Source: the public data file of "Decky Plugins Explorer" by safetzahirovic
(https://safetzahirovic.github.io/decky-plugins-explorer/). The project states no licence, so nothing of it is
copied or shipped with this plugin: the JSON is downloaded at runtime, reduced to the fields the Spotlight search
needs (README text cut to a short excerpt) and cached in the plugin's runtime folder for CACHE_TTL seconds. When the
download fails the cached copy is served with a short error note; with no cache the result is an empty list.

The official Decky store API is intentionally not used (owner decision).
"""
import json
import os
import re
import threading
import time

EXPLORER_URL = "https://safetzahirovic.github.io/decky-plugins-explorer/data/plugins.json?v=3"
EXPLORER_PAGE = "https://safetzahirovic.github.io/decky-plugins-explorer/"
ATTRIBUTION = "Plugin data: Decky Plugins Explorer by safetzahirovic"
CACHE_NAME = "plugin-explorer.json"
CACHE_TTL = 24 * 3600
MAX_DOWNLOAD = 16 * 1024 * 1024  # the file is ~4 MB today; refuse anything far bigger
TIMEOUT = 20
MAX_ENTRIES = 3000
README_CHARS = 1200  # 567 entries -> ~1 MB of JSON to the frontend
CACHE_VERSION = 1
_REPO = re.compile(r"https://github\.com/[A-Za-z0-9_.-]{1,100}/[A-Za-z0-9_.-]{1,100}")
_KEY = re.compile(r"(?:(?:https?://)?(?:www\.)?github\.com/)?([A-Za-z0-9_.-]{1,100})/([A-Za-z0-9_.-]{1,100})(?:[/?#].*)?", re.I)
_lock = threading.Lock()
# unedited copies of Decky's plugin template share one name; they are not forks of each other
TEMPLATE_NAMES = {"exampleplugin", "deckyplugintemplate", "plugintemplate", "template"}


def _text(value, limit):
    if not isinstance(value, str):
        return ""
    return re.sub(r"\s+", " ", value).strip()[:limit]


def strip_readme(markdown, limit=README_CHARS):
    """A short, plain-ish Markdown excerpt: no images, badges, HTML, tables of contents or link targets."""
    if not isinstance(markdown, str):
        return ""
    text = markdown[: limit * 20].replace("\r\n", "\n")
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    text = re.sub(r"(?m)^[ \t]*(?:[-*+]|\d+\.)[ \t]+\[[^\]\n]*\]\(#[^)\n]*\)[ \t]*(?:\n|$)", "", text)  # tables of contents
    text = re.sub(r"\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)", "", text)  # linked badges
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)  # images
    text = re.sub(r"<[^>\n]{0,400}>", "", text)  # HTML tags (kept text between them)
    text = re.sub(r"\[([^\]\n]*)\]\([^)\n]*\)", r"\1", text)  # links -> their text
    text = re.sub(r"\n{3,}", "\n\n", "\n".join(line.rstrip() for line in text.split("\n"))).strip()
    if len(text) > limit:
        cut = text[:limit]
        text = cut[: cut.rfind(" ")] if " " in cut[-80:] else cut
        text += " …"
    return text


def repo_key(value):
    """'owner/repo' (lowercase) from a GitHub URL in any common spelling: http(s), www, .git, trailing slash,
    /tree/<branch>, /releases/download/..., #readme, or a bare 'owner/repo'. '' when it is not a GitHub repo."""
    if not isinstance(value, str):
        return ""
    text = value.strip()
    if "://" in text or text.lower().startswith(("github.com/", "www.github.com/")):
        if not re.match(r"(?:https?://)?(?:www\.)?github\.com/", text, re.I):
            return ""
    match = _KEY.fullmatch(text)
    if not match:
        return ""
    owner, repo = match.group(1), re.sub(r"\.git$", "", match.group(2), flags=re.I)
    if not repo or owner in (".", "..") or repo in (".", ".."):
        return ""
    return f"{owner}/{repo}".lower()


def name_key(name, author=""):
    """Name + author, insensitive to case, spaces and punctuation ('Deck-Cord ' by 'Marios' == 'deckcord' by 'marios')."""
    squash = lambda v: re.sub(r"[^0-9a-z]+", "", v.lower()) if isinstance(v, str) else ""
    return f"{squash(name)}|{squash(author)}" if squash(name) else ""


def _dedupe(entries):
    """One entry per repo; entries sharing name + author but living in different repos are kept and the
    lesser one is marked as a fork of the other (owner == author wins, then stars)."""
    by_name = {}
    for entry in entries:
        key = name_key(entry["name"], entry["author"])
        if key:
            by_name.setdefault(key, []).append(entry)
    for key, group in by_name.items():
        if len(group) < 2 or key.split("|")[0] in TEMPLATE_NAMES:
            continue
        original = max(group, key=lambda e: (e["repo"].split("/")[0].lower() == e["author"].lower(), e["stars"], -len(e["repo"])))
        for entry in group:
            if entry is not original:
                entry["forkOf"] = original["repo"]
    return entries


def release_zip(release, key):
    """A release ZIP URL only when the data names one explicitly and it is a GitHub release download of the same
    repository (https://github.com/<owner>/<repo>/releases/download/<tag>/<file>.zip). The explorer data has no
    asset URLs today, so this is normally '' and the Spotlight shows no install button for explorer entries."""
    if not isinstance(release, dict):
        return ""
    candidates = [release.get("zip_url"), release.get("zipUrl")]
    assets = release.get("assets") if isinstance(release.get("assets"), list) else []
    candidates += [a.get("browser_download_url") for a in assets[:20] if isinstance(a, dict)]
    for url in candidates:
        if not isinstance(url, str) or len(url) > 400 or not url.startswith("https://github.com/"):
            continue
        match = re.fullmatch(r"https://github\.com/([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)/releases/download/[A-Za-z0-9_.+-]+/[A-Za-z0-9_.+ %-]+\.zip", url)
        if match and match.group(1).lower() == key:
            return url
    return ""


def _int(value):
    return value if isinstance(value, int) and not isinstance(value, bool) and value >= 0 else 0


def normalise(raw):
    """Explorer JSON (a list) -> compact entries. Unknown or malformed rows are skipped."""
    if isinstance(raw, dict):
        raw = raw.get("plugins")
    if not isinstance(raw, list):
        raise ValueError("unexpected catalogue format")
    out, seen = [], set()
    for row in raw[:MAX_ENTRIES]:
        if not isinstance(row, dict):
            continue
        url = row.get("url") if isinstance(row.get("url"), str) else ""
        key = repo_key(url) or repo_key(row.get("repo"))
        if not key or key in seen:
            continue
        # keep the original capitalisation of owner/repo for display; the key is lowercase
        spelled = re.sub(r"(?i)\.git$", "", (_KEY.fullmatch(url.strip()) or _KEY.fullmatch(str(row.get("repo")).strip())).expand(r"\1/\2"))
        url = "https://github.com/" + (spelled if spelled.lower() == key else key)
        if not _REPO.fullmatch(url):
            continue
        plugin = row.get("plugin") if isinstance(row.get("plugin"), dict) else {}
        publish = plugin.get("publish") if isinstance(plugin.get("publish"), dict) else {}
        name = _text(plugin.get("name"), 80) or url.rsplit("/", 1)[-1]
        flags = [f for f in plugin.get("flags") or [] if isinstance(f, str)] if isinstance(plugin.get("flags"), list) else []
        tags = [_text(t, 32) for t in publish.get("tags") or [] if isinstance(t, str) and t.strip()] if isinstance(publish.get("tags"), list) else []
        image = publish.get("image") if isinstance(publish.get("image"), str) else ""
        readme = row.get("readme") if isinstance(row.get("readme"), dict) else {}
        readme_url = readme.get("html_url") if isinstance(readme.get("html_url"), str) else ""
        release = row.get("latest_release") if isinstance(row.get("latest_release"), dict) else {}
        seen.add(key)
        out.append({
            "repo": url[len("https://github.com/"):],
            "key": key,
            "url": url,
            "name": name,
            "author": _text(plugin.get("author"), 60),
            "description": _text(publish.get("description"), 400),
            "tags": tags[:12],
            "image": image if image.startswith("https://") and len(image) < 500 else "",
            "stars": _int(row.get("stars")),
            "downloads": _int(row.get("downloads")),
            "archived": row.get("archived") is True,
            # "_root" is Decky's convention for a disabled flag; only "root" asks for root.
            "root": "root" in flags,
            "readme": strip_readme(readme.get("markdown")),
            "readmeUrl": readme_url if repo_key(readme_url) == key and readme_url.startswith("https://github.com/") else "",
            "release": _text(release.get("tag"), 40),
            "released": _text(release.get("published_at"), 25),
            "zipUrl": release_zip(release, key),
        })
    return _dedupe(out)


def fetch_explorer(urlopen=None):
    if urlopen is None:
        from theme_network import urlopen
    from urllib.request import Request
    request = Request(EXPLORER_URL, headers={"User-Agent": "DeckHomeThemes-Spotlight", "Accept": "application/json"})
    with urlopen(request, timeout=TIMEOUT) as response:
        body = response.read(MAX_DOWNLOAD + 1)
    if len(body) > MAX_DOWNLOAD:
        raise ValueError("catalogue is larger than expected")
    return json.loads(body.decode("utf-8"))


def _read_cache(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if data.get("version") == CACHE_VERSION and isinstance(data.get("entries"), list):
            return data
    except Exception:
        pass
    return None


def _write_cache(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    os.replace(tmp, path)


def installed_plugins(plugins_dir, limit=400):
    """Names (from plugin.json) and folder names of the plugins installed next to this one, lowercased."""
    names = set()
    try:
        folders = sorted(os.listdir(plugins_dir))[:limit]
    except OSError:
        return []
    for folder in folders:
        path = os.path.join(plugins_dir, folder)
        if not os.path.isdir(path):
            continue
        names.add(folder.lower())
        meta = os.path.join(path, "plugin.json")
        try:
            if os.path.getsize(meta) <= 65536:
                with open(meta, "r", encoding="utf-8") as f:
                    name = json.load(f).get("name")
                if isinstance(name, str) and name.strip():
                    names.add(name.strip().lower())
        except Exception:
            continue
    return sorted(names)


def catalog(cache_dir, refresh=False, plugins_dir=None, fetch=fetch_explorer, now=time.time):
    """{entries, fetchedAt, stale, error, installed, source}. Never raises."""
    path = os.path.join(cache_dir, CACHE_NAME)
    with _lock:
        cached = _read_cache(path)
        error = ""
        fresh = cached and 0 <= now() - cached.get("fetchedAt", 0) < CACHE_TTL
        if refresh or not fresh:
            try:
                entries = normalise(fetch())
                if not entries:
                    raise ValueError("the catalogue was empty")
                cached = {"version": CACHE_VERSION, "fetchedAt": int(now()), "entries": entries}
                try:
                    _write_cache(path, cached)
                except OSError:
                    pass
            except Exception as e:  # offline, moved, malformed: keep the saved copy
                error = "Could not update the plugin list" + (" (showing the saved copy)" if cached else "") + f": {type(e).__name__}"
        result = {
            "entries": cached["entries"] if cached else [],
            "fetchedAt": cached.get("fetchedAt", 0) if cached else 0,
            "stale": bool(error),
            "error": error,
            "installed": installed_plugins(plugins_dir) if plugins_dir else [],
            "source": {"name": ATTRIBUTION, "url": EXPLORER_PAGE},
        }
        return result
