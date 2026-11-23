"""Hub > Theme files: theme files for the theme-file importers, listed from public online sources at runtime.

GBAtemp has a dated metadata-only index fallback; its images remain on their original hosts. Other sources: lists are fetched when the user opens the
tab (kept in memory for LIST_TTL), every entry carries its source page and the creator's name, and a file is only
downloaded after the user confirmed it in the Hub. Downloads land in <data>/skins/<kind>/ where the importers read
them (main.py list_skins / get_*_skin).

Sources (see handoff-notes/theme-sources.md):
  * Themezer (https://themezer.net), public GraphQL API: PS3 .p3t, Nintendo Switch .nxtheme (home menu),
    Wii U .utheme, Nintendo 3DS theme zips. Downloads: api.themezer.net/<console>/themes/<hexId>/download
    (redirects to Themezer's Cloudflare R2 storage).
  * PSPunk (https://www.pspunk.com), WordPress REST API of its two theme pages: PSP .ptf and CFW .ctf themes with
    direct file links (www.pspunk.com/files/theme/<ptf|ctf>/<name>).
  * Internet Archive (https://archive.org), advanced search + item metadata: PSP, PS3, PS Vita, Wii and original Xbox
    uploads. Items are uploaded by archive.org users (some are official console themes); the Hub says so.
  * GitHub collections (api.github.com tree listing + raw.githubusercontent.com): PS3-Pro/Themes (PS3 .p3t, `files/`) and
    Shenron0/PSP-Themes (PSP .ptf/.ctf in the repository root). The listing is one cached tree request per repository.
Not built: ThemePlaza (Cloudflare browser challenge, no API), Xbox 360 (archives of marketplace packages), VitaShell
themes (Acemad/VitaShell-Themes: skins of the VitaShell file manager, not Vita home themes the importer reads).

Every download URL is rebuilt here from validated ids (the frontend never passes a URL), redirects are only followed
to the source's own hosts, sizes are capped per kind, and the file is checked (magic bytes / the importer's own
`peek`) before it is moved into place.
"""
from theme_source_catalog import SOURCES, KINDS, NOT_BUILT, kinds

import io
import hashlib
import html
try:
    import unicodedata
except ImportError:  # Optional in Decky's trimmed Python runtime.
    unicodedata = None
import json
import os
import re
import threading
import time
import urllib.parse
import urllib.request

try:
    import zipfile
except Exception:  # pragma: no cover
    zipfile = None

TIMEOUT = 25
LIST_TTL = 3600
PAGE_SIZE = 24
MAX_JSON = 8 * 1024 * 1024
UA = "DeckHomeThemes/theme-files (+https://github.com/Kaal31)"

# kind -> label, folder under <data>/skins, accepted extensions, size cap, sources (first = default)

# --- Themezer --------------------------------------------------------------------------------------------------
THEMEZER_API = "https://api.themezer.net/graphql"
THEMEZER_NS = {"p3t": ("ps3", "ps3"), "switch": ("switch", "switch"), "wiiu": ("wiiu", "wiiu"), "3ds": ("threeDs", "3ds")}
_THEMEZER_FIELDS = {
    "p3t": "preview{thumbUrl sdUrl}",
    "switch": "screenshotPreview{thumbUrl sdUrl}",
    "wiiu": "launcherScreenshot{thumbUrl sdUrl}",
    "3ds": "collagePreview{thumbUrl sdUrl}",
}
_HEX = re.compile(r"[0-9A-Fa-f]{1,12}")


def _themezer_query(kind, query, page):
    ns, _ = THEMEZER_NS[kind]
    args = f'paginationArgs:{{page:{int(page)},limit:{PAGE_SIZE}}},sort:{"Relevance" if query else "Downloads"},order:Desc,isNSFW:false'
    if query:
        args += ",query:" + json.dumps(query[:80])
    if kind == "switch":
        args += ",target:ResidentMenu"
    body = f"themes({args}){{pageInfo{{itemCount pageCount}} nodes{{name hexId pageUrl downloadCount updatedAt creator{{username}} {_THEMEZER_FIELDS[kind]}}}}}"
    return "{" + ("threeDs{theme{" + body + "}}" if kind == "3ds" else f"{ns}{{{body}}}") + "}"


def _themezer_items(kind, data):
    ns, _ = THEMEZER_NS[kind]
    node = (data or {}).get("data") or {}
    node = (node.get("threeDs") or {}).get("theme") if kind == "3ds" else node.get(ns)
    themes = (node or {}).get("themes") or {}
    pic_key = _THEMEZER_FIELDS[kind].split("{", 1)[0]
    out = []
    for n in themes.get("nodes") or []:
        if not isinstance(n, dict) or not _HEX.fullmatch(str(n.get("hexId") or "")):
            continue
        pic = n.get(pic_key) or {}
        out.append({"id": str(n["hexId"]).upper(), "name": _text(n.get("name"), 120) or "Untitled",
                    "author": _text((n.get("creator") or {}).get("username"), 60),
                    "image": _https(pic.get("sdUrl") or pic.get("thumbUrl")), "page": _https(n.get("pageUrl"), "themezer.net"),
                    "downloads": _int(n.get("downloadCount")), "file": {"name": "", "size": 0}})
    info = themes.get("pageInfo") or {}
    return out, _int(info.get("itemCount")), _int(info.get("pageCount"))


# --- PSVita Custom Themes --------------------------------------------------------------------------------------
_PSVT_ID = re.compile(r"[0-9a-f]{40}")


def _psvt_items(html):
    items = []
    for card in re.split(r'<div class="card h-100', html)[1:]:
        name = re.search(r'class="card-header[^>]*title="([^"]+)"', card)
        page = re.search(r'href="theme.php\?id=(\d+)"', card)
        ident = re.search(r'psvt.ovh/themes/([0-9a-f]{40})\.png', card)
        author = re.search(r'Created by</span>\s*<a[^>]*>(.*?)</a>', card, re.S)
        if not (name and page and ident):
            continue
        key = ident[1]
        items.append({"id": key, "name": _unescape(name[1]), "author": _unescape(author[1]) if author else "",
                      "image": "https://psvt.ovh/themes/" + key + ".png", "page": "https://psvt.ovh/theme.php?id=" + page[1],
                      "file": {"name": _unescape(name[1]) + ".zip", "size": 0}})
    pages = re.search(r'title="Press Enter to go"[^>]*max="(\d+)"', html)
    total = re.search(r'Currently there are\s*<strong>([\d,]+)</strong>', html)
    return {"items": items, "pages": int(pages[1]) if pages else 1, "total": int(total[1].replace(",", "")) if total else len(items)}


# --- SuperPSX public catalog (external downloads, not importer-ready PKGs) ----------------------------------------
SUPERPSX_CATALOG = "https://www.superpsx.com/ps4_themes.json"


def _superpsx_items(data):
    out, seen = [], set()
    for row in data if isinstance(data, list) else []:
        if not isinstance(row, dict):
            continue
        name = _text(row.get("Theme_Name"), 120)
        if not name or name in seen:
            continue
        seen.add(name)
        links = []
        for key, host in (("VikingFile_Link", "vikingfile.com"), ("OneFile_Link", "1fichier.com")):
            url = _https(row.get(key))
            if url and urllib.parse.urlsplit(url).hostname == host:
                links.append(url)
        out.append({"id": name, "name": name, "author": "", "image": _https(row.get("Preview_Link")),
                    "page": SOURCES["superpsx"]["url"], "tag": "PS4 PKG · external download",
                    "externalOnly": True, "externalLinks": links, "files": [],
                    "description": "PKG packages cannot be applied directly. The PS4 importer accepts extracted theme folders or ZIP/RAR archives containing theme.xml."})
    return out


# --- PSPunk ----------------------------------------------------------------------------------------------------
PSPUNK_PAGES = ("psp-themes", "psp-ctf-themes")  # PTF (official firmware) and CTF (custom firmware) pages
_PSPUNK_FILE = re.compile(r"https?://(?:www\.)?pspunk\.com/files/theme/((?:ptf|ctf)/[^\"'<>?#]{1,160}\.(?:ptf|ctf))", re.I)
_PSPUNK_ID = re.compile(r"(?:ptf|ctf)/[A-Za-z0-9 ._()'+!&,~-]{1,160}\.(?:ptf|ctf)", re.I)


def _pspunk_parse(html):
    """[(file id, title, picture)] of one PSPunk page: each theme is a <figure> with a picture and a caption link."""
    out = []
    for fig in re.findall(r"<figure\b.*?</figure>", html or "", flags=re.S | re.I):
        m = _PSPUNK_FILE.search(fig)
        if not m:
            continue
        ident = urllib.parse.unquote(m.group(1))
        if not _PSPUNK_ID.fullmatch(ident):
            continue
        title = re.search(r"<a\b[^>]*>(.*?)</a>", fig, flags=re.S)
        img = re.search(r"<img\b[^>]*?\b(?:data-src|src)=\"(https?://(?:www\.)?pspunk\.com/[^\"]+?\.(?:jpe?g|png|gif|webp))", fig, flags=re.I)
        name = _text(re.sub(r"<[^>]+>", "", title.group(1)) if title else "", 120)
        out.append((ident, _unescape(name) or os.path.splitext(os.path.basename(ident))[0], _https(img.group(1)) if img else ""))
    return out


# --- GitHub collections ----------------------------------------------------------------------------------------
# source id -> repository, branch, the one folder the files live in ("" = the root), kind and picture folder.
GITHUB = {
    "auroracollection": {"owner": "StonedModder", "repo": "Aurora-Coverflow-Layouts", "branch": "main", "dir": "", "dirs": ("Aurora/Media/Layouts/", "Aurora/Skins/"), "kind": "x360", "preview": "", "preview_ext": ""},
    "ps3pro": {"owner": "PS3-Pro", "repo": "Themes", "branch": "main", "dir": "files/", "kind": "p3t", "preview": "icons/", "preview_ext": ".png"},
    "shenron0": {"owner": "Shenron0", "repo": "PSP-Themes", "branch": "master", "dir": "", "kind": "psp", "preview": "", "preview_ext": ""},
}
_GH_PATH = re.compile(r"[A-Za-z0-9_.()+ '&,!-]{1,160}")


def _gh_file_ok(source, path):
    """A repo-relative path the source may list / download: right folder, one plain file name, the kind's extension."""
    g = GITHUB[source]
    if not isinstance(path, str) or not path.startswith(g["dir"]):
        return False
    root = next((root for root in g.get("dirs", (g["dir"],)) if path.startswith(root)), None)
    if root is None:
        return False
    name = path[len(root):]
    allowed = bool(re.fullmatch(r"[^/\\\x00-\x1f]{1,160}", name)) if source == "auroracollection" else bool(_GH_PATH.fullmatch(name))
    return allowed and not name.startswith(".") and ".." not in name and name.lower().endswith(KINDS[g["kind"]]["exts"])


def _gh_tree_url(source):
    g = GITHUB[source]
    return f"https://api.github.com/repos/{g['owner']}/{g['repo']}/git/trees/{g['branch']}?recursive=1"


def _gh_raw_url(source, path):
    g = GITHUB[source]
    return f"https://raw.githubusercontent.com/{g['owner']}/{g['repo']}/{g['branch']}/" + urllib.parse.quote(path)


def _gh_items(source, data):
    """Entries of one repository from its git tree listing (/git/trees/<branch>?recursive=1)."""
    g = GITHUB[source]
    cap = KINDS[g["kind"]]["max"]
    tree = [t for t in (data or {}).get("tree") or [] if isinstance(t, dict) and t.get("type") == "blob" and isinstance(t.get("path"), str)]
    have = {t["path"] for t in tree}
    page = f"https://github.com/{g['owner']}/{g['repo']}"
    out = []
    for t in tree:
        path = t["path"]
        size = _int(t.get("size"))
        if not _gh_file_ok(source, path) or size > cap:
            continue
        name = os.path.basename(path) if g.get("dirs") else path[len(g["dir"]):]
        stem = os.path.splitext(name)[0]
        pic = f"{g['preview']}{stem}{g['preview_ext']}" if g["preview"] else ""
        image = _gh_raw_url(source, pic) if pic and pic in have and _gh_file_pic_ok(pic) else ""
        ext = os.path.splitext(name)[1].lower()
        out.append({"id": path, "name": _text(stem.replace("_", " "), 120) or stem, "author": "", "image": image, "page": page,
                    "tag": ("Aurora coverflow layout" if ext == ".cfljson" else "Aurora skin") if source == "auroracollection" else "CTF (custom firmware)" if ext == ".ctf" else "PTF" if ext == ".ptf" else "",
                    "file": {"name": name, "size": size}})
    out.sort(key=lambda i: i["name"].lower())
    return out


def _gh_file_pic_ok(pic):
    return bool(re.fullmatch(r"[A-Za-z0-9_./()+ '&,!-]{1,200}\.png", pic)) and ".." not in pic


# --- Internet Archive ------------------------------------------------------------------------------------------
ARCHIVE_QUERY = {
    "psp": "title:(psp) AND (title:(theme) OR title:(themes) OR title:(ptf) OR title:(ctf))",
    "p3t": "(title:(ps3) OR title:(playstation 3)) AND (title:(theme) OR title:(themes) OR title:(p3t))",
    "vita": "(title:(vita) OR title:(psvita)) AND (title:(theme) OR title:(themes))",
    "wii": "title:(wii) AND (title:(theme) OR title:(themes) OR title:(csm) OR title:(mym)) AND NOT title:(\"wii u\")",
    "xbox": "(title:(unleashx) OR title:(xbmc) OR title:(\"xbox dashboard\")) AND (title:(skin) OR title:(skins) OR title:(dashboard))",
}
_IA_ID = re.compile(r"[A-Za-z0-9][A-Za-z0-9._-]{0,99}")


def _archive_search_url(kind, query, page):
    q = "(" + ARCHIVE_QUERY[kind] + ") AND -collection:(web) AND mediatype:(software OR data OR image OR texts OR collection)"
    if query:
        q = f"({q}) AND ({_ia_escape(query)})"
    params = [("q", q), ("fl[]", "identifier"), ("fl[]", "title"), ("fl[]", "creator"), ("fl[]", "item_size"),
              ("fl[]", "downloads"), ("sort[]", "downloads desc"), ("rows", str(PAGE_SIZE)), ("page", str(int(page))), ("output", "json")]
    return "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode(params)


def _ia_escape(text):
    words = re.findall(r"[0-9A-Za-zÀ-￿]{1,40}", text)[:6]
    return " AND ".join(words) if words else "*"


def _archive_items(data):
    resp = (data or {}).get("response") or {}
    out = []
    for d in resp.get("docs") or []:
        ident = str(d.get("identifier") or "")
        if not _IA_ID.fullmatch(ident):
            continue
        creator = d.get("creator")
        creator = creator[0] if isinstance(creator, list) and creator else creator
        creator = "" if _text(creator, 60).lower() in ("none", "null", "unknown", "anonymous") else creator
        out.append({"id": ident, "name": _text(d.get("title"), 140) or ident, "author": _text(creator, 60),
                    "image": f"https://archive.org/services/img/{ident}", "page": f"https://archive.org/details/{ident}",
                    "downloads": _int(d.get("downloads")), "files": None})
    return out, _int(resp.get("numFound"))


def _archive_file_list(kind, meta):
    exts = KINDS[kind]["exts"]
    out = []
    for f in (meta or {}).get("result") or (meta or {}).get("files") or []:
        name = str(f.get("name") or "")
        if not name.lower().endswith(exts) or not _safe_archive_file(name):
            continue
        size = _int(f.get("size"))
        if size and size > KINDS[kind]["max"]:
            continue
        out.append({"name": name, "size": size})
    out.sort(key=lambda x: x["name"].lower())
    return out[:400]


def _safe_archive_file(name):
    parts = name.split("/")
    return 0 < len(name) <= 240 and all(p not in ("", ".", "..") for p in parts) and "\\" not in name and "\0" not in name


# --- helpers ---------------------------------------------------------------------------------------------------
def _text(v, limit):
    if not isinstance(v, str):
        return ""
    return re.sub(r"\s+", " ", v).strip()[:limit]


def _unescape(s):
    import html
    return html.unescape(s)


def _int(v):
    try:
        return max(0, int(v))
    except Exception:
        return 0


def _https(url, host=None):
    if not isinstance(url, str) or not url.startswith("https://") or len(url) > 1000:
        return ""
    h = urllib.parse.urlsplit(url).hostname or ""
    if host and not (h == host or h.endswith("." + host)):
        return ""
    return url


def _allowed_host(source, host):
    host = (host or "").lower()
    if source == "ps3themes":
        return host in ("www.ps3-themes.com", "ps3-themes.com", "download.ps3-themes.com")
    if source == "psvt":
        return host == "psvt.ovh"
    if source == "superpsx":
        return host in ("superpsx.com", "www.superpsx.com")
    if source == "wiithemer":
        return host in ("wiithemer.org", "www.wiithemer.org")
    if source == "gbatemp":
        return host == "gbatemp.net"
    if source == "themezer":
        return host == "api.themezer.net" or host.endswith(".r2.cloudflarestorage.com")
    if source == "pspunk":
        return host in ("pspunk.com", "www.pspunk.com")
    if source == "archive":
        return host == "archive.org" or host.endswith(".archive.org")
    if source in GITHUB:  # raw files; Git LFS files would come from media.githubusercontent.com
        return host in ("api.github.com", "raw.githubusercontent.com", "media.githubusercontent.com")
    return False


class _Redirects(urllib.request.HTTPRedirectHandler):
    def __init__(self, source):
        super().__init__()
        self.source = source

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        u = urllib.parse.urlsplit(newurl)
        if not _source_url_ok(self.source, newurl):
            raise ValueError(f"redirect to an unexpected host ({u.hostname})")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _opener(source):
    handlers = [_Redirects(source)]
    try:
        from theme_network import ssl_context
        handlers.append(urllib.request.HTTPSHandler(context=ssl_context()))
    except Exception:  # pragma: no cover (tests)
        pass
    return urllib.request.build_opener(*handlers)


def _fetch(source, url, data=None, limit=MAX_JSON):
    """GET (or POST JSON) -> bytes, refusing more than `limit` bytes and redirects off the source's hosts."""
    headers = {"User-Agent": "DeckHomeThemes/theme-files" if source == "gbatemp" else UA, "Accept": "application/json, text/html;q=0.8, */*;q=0.5"}
    if source == "superpsx":
        headers.update({"User-Agent": "Mozilla/5.0", "Referer": SOURCES[source]["url"]})
    if source == "gbatemp":
        headers.pop("Accept", None)
    if data is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers)
    with _opener(source).open(req, timeout=8 if source == "gbatemp" else TIMEOUT) as r:
        body = r.read(limit + 1)
    if len(body) > limit:
        raise ValueError("response too large")
    return body


def _fetch_json(source, url, data=None):
    return json.loads(_fetch(source, url, data).decode("utf-8", "replace"))


def _source_url_ok(source, url):
    u = urllib.parse.urlsplit(url)
    return _allowed_host(source, u.hostname) and (u.scheme == "https" or source == "ps3themes" and u.scheme == "http")


def _ps3themes_items(posts):
    out = []
    for post in posts if isinstance(posts, list) else []:
        content = (post.get("content") or {}).get("rendered", "")
        links = re.findall(r'href=["\']([^"\']+)', content, re.I)
        downloads = [urllib.parse.unquote(u) for u in links if _source_url_ok("ps3themes", u) and urllib.parse.urlsplit(u).path.lower().endswith(".p3t") and urllib.parse.urlsplit(u).hostname == "download.ps3-themes.com"]
        author = re.search(r'Theme by\s+([^<\r\n]+)', content, re.I)
        images = [u for u in re.findall(r'<img[^>]+src=["\']([^"\']+)', content, re.I) if _source_url_ok("ps3themes", u)]
        for url in downloads:
            ident = urllib.parse.urlsplit(url).path.lstrip("/")
            try: download_url("p3t", "ps3themes", ident)
            except ValueError: continue
            out.append({"id": ident, "name": _text(html.unescape((post.get("title") or {}).get("rendered", "")), 120), "author": _text(html.unescape(author.group(1)), 60) if author else "", "image": images[0] if images else "", "images": images, "page": post.get("link", "") if _source_url_ok("ps3themes", post.get("link", "")) else SOURCES["ps3themes"]["url"], "file": {"name": ident.rsplit("/", 1)[-1], "size": 0}})
    return out


def group_items(items, kind):
    groups = {}
    for item in items:
        normalize = lambda value: " ".join((unicodedata.normalize("NFKC", value or "") if unicodedata else (value or "")).casefold().split())
        author = normalize(item.get("author"))
        files = item.get("files")
        names = [f.get("name", "") for f in files] if files else [(item.get("file") or {}).get("name", "") or item["id"]]
        formats = tuple(sorted({os.path.splitext(n)[1].lower() for n in names if os.path.splitext(n)[1]}))
        if not formats and len(KINDS[kind]["exts"]) == 1: formats = KINDS[kind]["exts"]
        # Collections and uncredited uploads cannot be confidently matched by title.
        key = (normalize(item["name"]), author, formats) if author not in ("", "unknown", "anonymous") and not files and formats else (item["sourceId"], item["id"])
        if key not in groups:
            group_id = hashlib.sha256(repr((kind, key)).encode()).hexdigest()[:24]
            groups[key] = {**item, "id": group_id, "alternatives": []}
        variants = groups[key]["alternatives"]
        if not any(v["sourceId"] == item["sourceId"] and v["id"] == item["id"] for v in variants): variants.append(item)
    return list(groups.values())


# --- listing ---------------------------------------------------------------------------------------------------
_cache = {}
_cache_lock = threading.Lock()


def _cached(key, fn, now, refresh=False):
    with _cache_lock:
        hit = _cache.get(key)
    if hit and not refresh and 0 <= now() - hit[0] < LIST_TTL:
        return hit[1]
    value = fn()
    with _cache_lock:
        if len(_cache) > 200:
            _cache.clear()
        _cache[key] = (now(), value)
    return value




def browse(kind, source, query="", page=1, refresh=False, fetch_json=None, fetch_text=None, now=time.time):
    """One page of entries: {items, page, pages, total, source, error?}. Never raises."""
    live_gbatemp = refresh or fetch_text is not None
    fetch_json = fetch_json or _fetch_json
    fetch_text = fetch_text or (lambda s, u: _fetch(s, u).decode("utf-8", "replace"))
    query = _text(query, 80)
    try:
        page = max(1, min(int(page), 400))
    except Exception:
        page = 1
    base = {"kind": kind, "page": page, "pages": 1, "total": 0, "items": [], "source": dict(SOURCES.get(source) or {}, id=source)}
    if source == "all" and kind in KINDS:
        from concurrent.futures import ThreadPoolExecutor
        sources = KINDS[kind]["sources"]
        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(lambda src: browse(kind, src, query, page, refresh, fetch_json, fetch_text, now), sources))
        rows = [{**item, "sourceId": src} for src, result in zip(sources, results) for item in result["items"]]
        failures = [SOURCES[src]["name"] for src, result in zip(sources, results) if result.get("error")]
        return {**base, "items": group_items(rows, kind), "total": sum(r["total"] for r in results), "pages": max(r["pages"] for r in results), "warning": ("Unavailable sources: " + ", ".join(failures)) if failures else ""}
    if kind not in KINDS or source not in KINDS[kind]["sources"]:
        return {**base, "error": "This source has no themes of that kind."}
    try:
        if source == "ps3themes":
            url = "http://www.ps3-themes.com/wp-json/wp/v2/posts?" + urllib.parse.urlencode({"per_page": PAGE_SIZE + 1, "offset": (page - 1) * PAGE_SIZE, "search": query})
            posts = _cached((source, query, page), lambda: fetch_json(source, url), now, refresh)
            more = len(posts) > PAGE_SIZE
            res = {"items": _ps3themes_items(posts[:PAGE_SIZE]), "pages": page + int(more), "total": (page - 1) * PAGE_SIZE + len(posts)}
        elif source == "gbatemp":
            def load():
                from pathlib import Path
                snapshot = json.loads(Path(__file__).with_name("gbatemp_wiiflow_index.json").read_text(encoding="utf-8"))
                if not live_gbatemp:
                    return snapshot["items"], []
                from gbatemp_themes import THREADS, parse
                items, failures = [], []
                for thread in THREADS:
                    try:
                        items.extend(parse(fetch_text("gbatemp", thread), thread))
                    except Exception:
                        failures.append(thread)
                if not items:
                    from pathlib import Path
                    snapshot = json.loads(Path(__file__).with_name("gbatemp_wiiflow_index.json").read_text(encoding="utf-8"))
                    return snapshot["items"], failures
                from pathlib import Path
                saved = json.loads(Path(__file__).with_name("gbatemp_wiiflow_index.json").read_text(encoding="utf-8"))
                fallbacks = {i["id"]: i.get("fallbackImage") for i in saved["items"]}
                for item in items:
                    if fallbacks.get(item["id"]): item["fallbackImage"] = fallbacks[item["id"]]
                # A partial live response must never discard saved sources/themes.
                combined={item['id']:item for item in saved['items']}
                combined.update({item['id']:item for item in items})
                return list(combined.values()), failures
            every, failures = _cached(("gbatemp", live_gbatemp), load, now, refresh)
            words = query.lower().split()
            hits = [i for i in every if all(w in (i["name"]+" "+i["description"]+" "+i["author"]).lower() for w in words)]
            res = {"items": hits[(page-1)*PAGE_SIZE:page*PAGE_SIZE], "total": len(hits), "pages": max(1, -(-len(hits)//PAGE_SIZE)), "skipped": len(failures), "warning": "Showing the saved public GBAtemp index from 2026-10-23. Refresh tries live pages; older links may have expired." if not live_gbatemp else "Some GBAtemp pages are unavailable. Showing available entries or the saved index from 2026-10-23; older links may have expired." if failures else ""}
        elif source == "psvt":
            url = "https://psvt.ovh/index.php?" + urllib.parse.urlencode({"p": page, "s": query})
            res = _cached((source, query, page), lambda: _psvt_items(fetch_text(source, url)), now, refresh)
        elif source == "superpsx":
            every = _cached((source,), lambda: _superpsx_items(fetch_json(source, SUPERPSX_CATALOG + "?t=" + str(int(now() // LIST_TTL)))), now, refresh)
            words = query.lower().split()
            hits = [item for item in every if all(word in item["name"].lower() for word in words)]
            res = {"items": hits[(page-1)*PAGE_SIZE:page*PAGE_SIZE], "total": len(hits), "pages": max(1, -(-len(hits)//PAGE_SIZE))}
        elif source == "wiithemer":
            from wiithemer_catalog import parse, ROOT
            def load():return parse(fetch_text('wiithemer',ROOT+'index.js'))
            warning=''
            try:every=_cached(('wiithemer',),load,now,refresh)
            except Exception:
                from pathlib import Path
                snapshot=json.loads(Path(__file__).with_name('wiithemer_index.json').read_text(encoding='utf-8'))
                every=snapshot['items'];warning='WiiThemer is unavailable. Showing saved catalog metadata from '+snapshot['updated']+'. Preview and download links still require the source site.'
            words=query.lower().split()
            hits=[item for item in every if all(word in (item['name']+' '+item['id']).lower() for word in words)]
            res={'items':hits[(page-1)*PAGE_SIZE:page*PAGE_SIZE],'total':len(hits),'pages':max(1,-(-len(hits)//PAGE_SIZE)),'warning':warning}
        elif source == "themezer":
            def load():
                data = fetch_json("themezer", THEMEZER_API, json.dumps({"query": _themezer_query(kind, query, page)}).encode())
                if isinstance(data, dict) and data.get("errors") and not data.get("data"):
                    raise ValueError(_text(str((data["errors"][0] or {}).get("message")), 120))
                items, total, pages = _themezer_items(kind, data)
                return {"items": items, "total": total, "pages": max(1, pages)}
            res = _cached(("themezer", kind, query, page), load, now, refresh)
        elif source == "pspunk":
            def load():
                rows = []
                for slug in PSPUNK_PAGES:
                    data = fetch_json("pspunk", f"https://www.pspunk.com/wp-json/wp/v2/pages?slug={slug}&_fields=link,content")
                    for p in data if isinstance(data, list) else []:
                        rows += _pspunk_parse(((p or {}).get("content") or {}).get("rendered", ""))
                seen, items = set(), []
                for ident, name, img in rows:
                    if ident.lower() in seen:
                        continue
                    seen.add(ident.lower())
                    items.append({"id": ident, "name": name, "author": "", "image": img,
                                  "page": "https://www.pspunk.com/psp-ctf-themes/" if ident.lower().startswith("ctf/") else "https://www.pspunk.com/psp-themes/",
                                  "tag": "CTF (custom firmware)" if ident.lower().startswith("ctf/") else "PTF",
                                  "file": {"name": os.path.basename(ident), "size": 0}})
                return items
            every = _cached(("pspunk",), load, now, refresh)
            words = query.lower().split()
            hits = [i for i in every if all(w in (i["name"] + " " + i["id"]).lower() for w in words)]
            res = {"items": hits[(page - 1) * PAGE_SIZE: page * PAGE_SIZE], "total": len(hits), "pages": max(1, -(-len(hits) // PAGE_SIZE))}
        elif source in GITHUB:
            def load():
                data = fetch_json(source, _gh_tree_url(source))
                if isinstance(data, dict) and data.get("truncated"):
                    raise ValueError("the repository listing is too large")
                return _gh_items(source, data)
            every = _cached((source,), load, now, refresh)
            words = query.lower().split()
            hits = [i for i in every if all(w in (i["name"] + " " + i["id"]).lower() for w in words)]
            res = {"items": hits[(page - 1) * PAGE_SIZE: page * PAGE_SIZE], "total": len(hits), "pages": max(1, -(-len(hits) // PAGE_SIZE))}
        else:
            def load():
                items, total = _archive_items(fetch_json("archive", _archive_search_url(kind, query, page)))
                # each item's file list, fetched side by side; items without a usable theme file are left out
                from concurrent.futures import ThreadPoolExecutor
                with ThreadPoolExecutor(max_workers=6) as pool:
                    lists = list(pool.map(lambda i: archive_files(kind, i["id"], fetch_json, now), items))
                kept = []
                for item, got in zip(items, lists):
                    if got.get("error") or got["files"]:
                        kept.append({**item, "files": None if got.get("error") else got["files"]})
                return {"items": kept, "total": total, "pages": max(1, -(-total // PAGE_SIZE)), "skipped": len(items) - len(kept)}
            res = _cached(("archive", kind, query, page), load, now, refresh)
        return {**base, **res}
    except Exception as e:
        return {**base, "error": f"{SOURCES[source]['name']} could not be reached ({type(e).__name__}). Try again later."}


def archive_files(kind, ident, fetch_json=None, now=time.time):
    """The theme files of one Internet Archive item: {files: [{name, size}], error?}."""
    fetch_json = fetch_json or _fetch_json
    if kind not in KINDS or "archive" not in KINDS[kind]["sources"] or not _IA_ID.fullmatch(str(ident or "")):
        return {"files": [], "error": "Unknown item."}
    try:
        meta = _cached(("archive-files", ident), lambda: fetch_json("archive", f"https://archive.org/metadata/{ident}/files"), now)
        return {"files": _archive_file_list(kind, meta)}
    except Exception as e:
        return {"files": [], "error": f"The Internet Archive could not be reached ({type(e).__name__})."}


# --- download --------------------------------------------------------------------------------------------------
_progress = {"busy": False, "percent": 0, "message": "", "id": ""}
_dl_lock = threading.Lock()


def progress():
    return dict(_progress)


def download_url(kind, source, ident, file=""):
    """The one URL a (kind, source, id, file) may download, or raise ValueError."""
    if kind not in KINDS or source not in KINDS[kind]["sources"]:
        raise ValueError("unknown kind or source")
    if source == "ps3themes":
        if not re.fullmatch(r"downloads[0-9]*/[^/\\\x00-\x1f?#]+\.p3t", str(ident or ""), re.I) or ".." in ident:
            raise ValueError("Invalid PS3-Themes file")
        return "http://download.ps3-themes.com/" + urllib.parse.quote(ident)
    if source == "psvt":
        if not _PSVT_ID.fullmatch(str(ident or "")):
            raise ValueError("Invalid PSVita theme id")
        return "https://psvt.ovh/download.php?id=" + ident
    if source == "superpsx":
        raise ValueError("SuperPSX provides external PKG download pages, not direct importer-ready themes")
    if source == "gbatemp":
        raise ValueError("Open the original author download page; WiiFlow archives require separate import.")
    if source == "wiithemer":
        from wiithemer_catalog import valid_file, ROOT
        if not valid_file(ident) or re.search(r'stage[ _-]*\d+',ident,re.I):raise ValueError('Select a complete single-stage MYM from WiiThemer.')
        return ROOT+'resources/mym/'+urllib.parse.quote(ident)
    if source == "themezer":
        if not _HEX.fullmatch(str(ident or "")):
            raise ValueError("bad Themezer id")
        return f"https://api.themezer.net/{THEMEZER_NS[kind][1]}/themes/{ident.upper()}/download"
    if source == "pspunk":
        if not _PSPUNK_ID.fullmatch(str(ident or "")) or not ident.lower().endswith(KINDS[kind]["exts"]):
            raise ValueError("bad PSPunk file")
        return "https://www.pspunk.com/files/theme/" + urllib.parse.quote(ident)
    if source in GITHUB:
        if not _gh_file_ok(source, str(ident or "")) or GITHUB[source]["kind"] != kind:
            raise ValueError("bad GitHub file")
        return _gh_raw_url(source, ident)
    if not _IA_ID.fullmatch(str(ident or "")) or not _safe_archive_file(str(file or "")) or not file.lower().endswith(KINDS[kind]["exts"]):
        raise ValueError("bad archive.org file")
    return f"https://archive.org/download/{ident}/" + urllib.parse.quote(file)


def safe_file_name(name, ext, fallback):
    """A plain file name for <data>/skins/<kind>: no folders, no control or reserved characters, the right extension."""
    base = os.path.basename(str(name or "").replace("\\", "/"))
    stem, e = os.path.splitext(base)
    if e.lower() != ext:
        stem = base
    stem = re.sub(r"[\x00-\x1f<>:\"/\\|?*]+", " ", stem)
    stem = re.sub(r"\s+", " ", stem).strip(" .")[:96] or fallback
    return stem + ext


def _disposition_name(url, headers):
    cd = headers.get("Content-Disposition") or ""
    if not cd:
        q = urllib.parse.parse_qs(urllib.parse.urlsplit(url).query)
        cd = (q.get("response-content-disposition") or [""])[0]
    m = re.search(r"filename\*=UTF-8''([^;]+)", cd, re.I) or re.search(r'filename="([^"]+)"', cd) or re.search(r"filename=([^;]+)", cd)
    return urllib.parse.unquote(m.group(1)).strip() if m else ""


def check_file(kind, path):
    """True when the downloaded file is what the importer of `kind` reads (magic bytes, or the importer's own peek)."""
    try:
        with open(path, "rb") as f:
            head = f.read(8)
    except OSError:
        return False
    zipped = head[:4] == b"PK\x03\x04"
    if kind == "psp":
        return head[:4] == b"\x00PTF"
    if kind == "p3t":
        return head[:4] == b"P3TF"
    if kind == "switch":
        return head[:4] in (b"Yaz0", b"SARC") or (zipped and _zip_has(path, lambda n: n == "info.json"))
    if kind == "wiiu":
        return zipped
    if kind == "vita":
        return zipped and _zip_has(path, lambda n: n.rsplit("/", 1)[-1] == "theme.xml")
    if kind == "3ds":
        import n3ds_themes
        return bool(n3ds_themes.peek(path))
    if kind == "wii":
        import wii_themes
        return bool(wii_themes.peek(path))
    if kind == "x360":
        import x360_themes
        return bool(x360_themes.peek(path))
    if kind == "xbox":
        import xbox_skins
        return bool(xbox_skins.peek(path))
    return False


def _zip_has(path, test):
    if zipfile is None:
        return False
    try:
        with zipfile.ZipFile(path) as z:
            return any(test(n.lower()) for n in z.namelist()[:4000])
    except Exception:
        return False


def saved_downloads(skins_dir, kind):
    """Only report recorded downloads whose saved files still exist."""
    if kind not in KINDS: return {}
    try:
        with open(os.path.join(skins_dir, ".theme-source-downloads.json"), encoding="utf-8") as handle:
            rows = json.load(handle)
        if not isinstance(rows, dict): return {}
    except (OSError, ValueError):
        return {}
    root = os.path.realpath(skins_dir)
    saved = {}
    for key, value in rows.items():
        if not isinstance(key, str) or not key.startswith(kind + ":") or not isinstance(value, str): continue
        path = os.path.realpath(os.path.join(root, value))
        try:
            if os.path.commonpath([root, path]) == root and os.path.isfile(path): saved[key] = os.path.basename(path)
        except ValueError:
            continue
    return saved


def _remember_download(skins_dir, kind, source, ident, file, name):
    import tempfile
    target = os.path.join(skins_dir, ".theme-source-downloads.json")
    try:
        with open(target, encoding="utf-8") as handle: rows = json.load(handle)
        if not isinstance(rows, dict): rows = {}
    except (OSError, ValueError): rows = {}
    rows[f"{kind}:{source}:{ident}:{file if source == 'archive' else ''}"] = os.path.join(KINDS[kind]["dir"], name)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=skins_dir, prefix=".theme-source-", delete=False) as handle:
            temporary = handle.name
            json.dump(rows, handle)
        os.replace(temporary, target)
    except OSError:
        # The file is already installed; optional UI metadata must not turn it into a failed download.
        pass
    finally:
        if temporary and os.path.exists(temporary):
            try: os.remove(temporary)
            except OSError: pass


def download(skins_dir, kind, source, ident, file="", name="", opener=None):
    """Download one confirmed theme file into <skins_dir>/<kind dir>/. -> {success, name?, already?, error?}."""
    try:
        url = download_url(kind, source, ident, file)
    except ValueError as e:
        return {"success": False, "error": str(e)}
    if not _dl_lock.acquire(blocking=False):
        return {"success": False, "error": "Another theme file is downloading."}
    spec = KINDS[kind]
    folder = os.path.join(skins_dir, spec["dir"])
    tmp = None
    try:
        _progress.update(busy=True, percent=0, message="Connecting…", id=f"{source}:{ident}:{file}")
        os.makedirs(folder, exist_ok=True)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with (opener or _opener(source)).open(req, timeout=TIMEOUT) as r:
            final = r.geturl()
            if not _source_url_ok(source, final):
                raise ValueError("unexpected download host")
            total = _int(r.headers.get("Content-Length"))
            if total > spec["max"]:
                raise ValueError(f"the file is too large ({total >> 20} MB)")
            given = _disposition_name(final, r.headers) or (file if source == "archive" else os.path.basename(ident) if source in ("ps3themes", "wiithemer", "pspunk", *GITHUB) else "")
            ext = os.path.splitext(given)[1].lower()
            if ext not in spec["exts"]:
                ext = spec["exts"][0]
            if source == "themezer":  # "<name> (Themezer <id>)": Themezer's own names repeat the title and target
                theme_name = _text(re.sub(r'[/\\]+', ' ', name or ''), 80) or 'Theme'
                given = f"{theme_name} (Themezer {ident.upper()}){ext}"
            out_name = safe_file_name(given or name, ext, "Theme")
            tmp = os.path.join(folder, f".download-{os.getpid()}-{int(time.time() * 1000)}.part{ext}")
            done = 0
            with open(tmp, "wb") as f:
                while True:
                    chunk = r.read(262144)
                    if not chunk:
                        break
                    done += len(chunk)
                    if done > spec["max"]:
                        raise ValueError("the file is larger than expected")
                    f.write(chunk)
                    _progress.update(percent=int(done * 100 / total) if total else min(95, done >> 20), message=f"{done >> 20} MB")
        if total and done != total:
            raise ValueError("the download was cut off")
        if not check_file(kind, tmp):
            raise ValueError(f"this is not a {spec['label']} theme file the Hub can read")
        def digest(path):
            h = hashlib.sha256()
            with open(path, "rb") as existing:
                for chunk in iter(lambda: existing.read(262144), b""): h.update(chunk)
            return h.digest()
        downloaded_hash = digest(tmp)
        for entry in list(os.scandir(folder)):
            if entry.path == tmp or entry.is_symlink() or not entry.is_file() or os.path.splitext(entry.name)[1].lower() not in spec["exts"]: continue
            if entry.stat().st_size == done and digest(entry.path) == downloaded_hash:
                os.remove(tmp)
                tmp = None
                _remember_download(skins_dir, kind, source, ident, file, entry.name)
                return {"success": True, "name": entry.name, "already": True}
        target = os.path.join(folder, out_name)
        if os.path.exists(target):
            stem, ext2 = os.path.splitext(out_name)
            n = 2
            while os.path.exists(os.path.join(folder, f"{stem} ({n}){ext2}")):
                n += 1
            out_name = f"{stem} ({n}){ext2}"
            target = os.path.join(folder, out_name)
        os.replace(tmp, target)
        tmp = None
        _remember_download(skins_dir, kind, source, ident, file, out_name)
        return {"success": True, "name": out_name}
    except Exception as e:
        return {"success": False, "error": f"Download failed: {e}" if isinstance(e, ValueError) else f"Download failed ({type(e).__name__})."}
    finally:
        if tmp:
            try:
                os.remove(tmp)
            except OSError:
                pass
        _progress.update(busy=False, percent=100, message="")
        _dl_lock.release()
