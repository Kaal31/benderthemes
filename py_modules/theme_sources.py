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
import io
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

SOURCES = {
    "gbatemp": {"name": "GBAtemp", "url": "https://gbatemp.net/threads/wiiflow-themes.180497/", "credit": "WiiFlow themes, descriptions and screenshots from public GBAtemp posts. Credits belong to the original creators; older image and download links may be unavailable."},
    "themezer": {"name": "Themezer", "url": "https://themezer.net",
                 "credit": "Themes and previews from Themezer (themezer.net) by their creators."},
    "pspunk": {"name": "PSPunk", "url": "https://www.pspunk.com/psp-themes/",
               "credit": "Themes and screenshots from PSPunk (pspunk.com), collected from their creators."},
    "ps3pro": {"name": "PS3-Pro Themes (GitHub)", "url": "https://github.com/PS3-Pro/Themes",
               "credit": "Themes from the PS3-Pro/Themes repository on GitHub (the PS3 4K Pro theme downloader's collection), made by their creators; credits go to them and @DeViL303."},
    "shenron0": {"name": "Shenron0 PSP-Themes (GitHub)", "url": "https://github.com/Shenron0/PSP-Themes",
                 "credit": "PSP and CFW themes from the Shenron0/PSP-Themes repository on GitHub, made by their creators."},
    "archive": {"name": "Internet Archive", "url": "https://archive.org",
                "credit": "Uploads on the Internet Archive (archive.org) by its users. Not checked by Deck Home Themes."},
}
# kind -> label, folder under <data>/skins, accepted extensions, size cap, sources (first = default)
KINDS = {
    "wiiflow": {"label": "WiiFlow", "dir": "wiiflow", "exts": (".zip", ".rar", ".7z"), "max": 256 << 20, "sources": ("gbatemp",)},
    "psp": {"label": "PSP", "dir": "psp", "exts": (".ptf", ".ctf"), "max": 24 << 20, "sources": ("pspunk", "shenron0", "archive")},
    "p3t": {"label": "PS3", "dir": "p3t", "exts": (".p3t",), "max": 160 << 20, "sources": ("themezer", "ps3pro", "archive")},
    "vita": {"label": "PS Vita", "dir": "vita", "exts": (".zip",), "max": 96 << 20, "sources": ("archive",)},
    "switch": {"label": "Switch", "dir": "switch", "exts": (".nxtheme",), "max": 24 << 20, "sources": ("themezer",)},
    "wiiu": {"label": "Wii U", "dir": "wiiu", "exts": (".utheme",), "max": 64 << 20, "sources": ("themezer",)},
    "3ds": {"label": "3DS", "dir": "3ds", "exts": (".zip",), "max": 24 << 20, "sources": ("themezer",)},
    "wii": {"label": "Wii", "dir": "wii", "exts": (".mym", ".csm"), "max": 32 << 20, "sources": ("archive",)},
    "xbox": {"label": "Xbox", "dir": "xbox", "exts": (".zip",), "max": 160 << 20, "sources": ("archive",)},
}
NOT_BUILT = [
    {"name": "ThemePlaza", "url": "https://themeplaza.art", "kinds": ["3ds"], "why": "Cloudflare browser check, no public API (its 3DS themes are mostly on Themezer too)."},
    {"name": "Xbox 360 themes", "url": "https://archive.org", "kinds": ["x360"], "why": "Only archives of Xbox Live Marketplace packages; not listed."},
    {"name": "VitaShell themes (Acemad/VitaShell-Themes)", "url": "https://github.com/Acemad/VitaShell-Themes", "kinds": ["vita"],
     "why": "Skins of the VitaShell file manager (colors.txt and PNG folders), not LiveArea / home themes (theme.xml) like the Vita importer reads."},
]

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
    "ps3pro": {"owner": "PS3-Pro", "repo": "Themes", "branch": "main", "dir": "files/", "kind": "p3t", "preview": "icons/", "preview_ext": ".png"},
    "shenron0": {"owner": "Shenron0", "repo": "PSP-Themes", "branch": "master", "dir": "", "kind": "psp", "preview": "", "preview_ext": ""},
}
_GH_PATH = re.compile(r"[A-Za-z0-9_.()+ '&,!-]{1,160}")


def _gh_file_ok(source, path):
    """A repo-relative path the source may list / download: right folder, one plain file name, the kind's extension."""
    g = GITHUB[source]
    if not isinstance(path, str) or not path.startswith(g["dir"]):
        return False
    name = path[len(g["dir"]):]
    return bool(_GH_PATH.fullmatch(name)) and not name.startswith(".") and ".." not in name and name.lower().endswith(KINDS[g["kind"]]["exts"])


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
        name = path[len(g["dir"]):]
        stem = os.path.splitext(name)[0]
        pic = f"{g['preview']}{stem}{g['preview_ext']}" if g["preview"] else ""
        image = _gh_raw_url(source, pic) if pic and pic in have and _gh_file_pic_ok(pic) else ""
        ext = os.path.splitext(name)[1].lower()
        out.append({"id": path, "name": _text(stem.replace("_", " "), 120) or stem, "author": "", "image": image, "page": page,
                    "tag": "CTF (custom firmware)" if ext == ".ctf" else "PTF" if ext == ".ptf" else "",
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
        if u.scheme != "https" or not _allowed_host(self.source, u.hostname):
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


def kinds():
    """What the Hub needs to draw the tab: kinds with their sources, the sources, and what is not built."""
    return {"kinds": [{"id": k, "label": v["label"], "dir": "skins/" + v["dir"], "exts": list(v["exts"]), "sources": list(v["sources"])} for k, v in KINDS.items()],
            "sources": {k: dict(v) for k, v in SOURCES.items()}, "notBuilt": NOT_BUILT}


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
    if kind not in KINDS or source not in KINDS[kind]["sources"]:
        return {**base, "error": "This source has no themes of that kind."}
    try:
        if source == "gbatemp":
            from gbatemp_themes import THREADS, parse
            def load():
                from pathlib import Path
                snapshot = json.loads(Path(__file__).with_name("gbatemp_wiiflow_index.json").read_text(encoding="utf-8"))
                if not live_gbatemp:
                    return snapshot["items"], list(THREADS)
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
                return items, failures
            every, failures = _cached(("gbatemp", live_gbatemp), load, now, refresh)
            words = query.lower().split()
            hits = [i for i in every if all(w in (i["name"]+" "+i["description"]+" "+i["author"]).lower() for w in words)]
            res = {"items": hits[(page-1)*PAGE_SIZE:page*PAGE_SIZE], "total": len(hits), "pages": max(1, -(-len(hits)//PAGE_SIZE)), "skipped": len(failures), "warning": "Showing the saved public GBAtemp index from 2026-10-17. Refresh tries live pages; older links may have expired." if not live_gbatemp else "Some GBAtemp pages are unavailable. Showing available entries or the saved index from 2026-10-17; older links may have expired." if failures else ""}
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
    if source == "gbatemp":
        raise ValueError("Open the original author download page; WiiFlow archives require separate import.")
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
            if not final.startswith("https://") or not _allowed_host(source, urllib.parse.urlsplit(final).hostname):
                raise ValueError("unexpected download host")
            total = _int(r.headers.get("Content-Length"))
            if total > spec["max"]:
                raise ValueError(f"the file is too large ({total >> 20} MB)")
            given = _disposition_name(final, r.headers) or (file if source == "archive" else os.path.basename(ident) if source in ("pspunk", *GITHUB) else "")
            ext = os.path.splitext(given)[1].lower()
            if ext not in spec["exts"]:
                ext = spec["exts"][0]
            if source == "themezer":  # "<name> (Themezer <id>)": Themezer's own names repeat the title and target
                given = f"{_text(re.sub(r'[/\\]+', ' ', name or ''), 80) or 'Theme'} (Themezer {ident.upper()}){ext}"
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
        target = os.path.join(folder, out_name)
        if os.path.exists(target):
            if os.path.isfile(target) and os.path.getsize(target) == done:
                os.remove(tmp)
                tmp = None
                _remember_download(skins_dir, kind, source, ident, file, out_name)
                return {"success": True, "name": out_name, "already": True}
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
