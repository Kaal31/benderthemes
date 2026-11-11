"""Optional full-wrap artwork. Provider code is independent of dashboard skins.

Only exact normalized titles may be selected automatically. Fuzzy matches are
choices, never silent substitutions. Files and decisions stay in runtime data.
"""
import hashlib
import io
import json
import re
import struct
import threading
import time
import unicodedata
import zipfile
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request
import xml.etree.ElementTree as ET

from theme_network import urlopen

MAX_IMAGE = 16 * 1024 * 1024
LOCK = threading.RLock()
DATABASES = {"ps3": "ps3tdb.zip", "wii": "wiitdb.zip", "wiiu": "wiiutdb.zip"}
_indexes = {}


def normalized(title):
    title = unicodedata.normalize("NFKD", str(title).replace("\u2122", "").replace("\u00ae", "").replace("\u00a9", "")).encode("ascii", "ignore").decode().lower()
    return " ".join(re.findall(r"[a-z0-9]+", title.replace("&", " and ")))


def score(query, title):
    a, b = normalized(query), normalized(title)
    if not a or not b:
        return 0
    if a == b:
        return 1
    return round(SequenceMatcher(None, a, b).ratio(), 3)


def _key(appid):
    value = str(appid)
    if not re.fullmatch(r"[0-9]{1,20}", value):
        raise ValueError("Invalid library game ID")
    return value


def _root(root):
    folder = Path(root) / "cover-wraps"
    folder.mkdir(parents=True, exist_ok=True)
    return folder


def _atomic(path, raw):
    with LOCK:
        tmp = path.with_suffix(path.suffix + ".tmp")
        tmp.write_bytes(raw)
        tmp.replace(path)


def _read(path, default):
    try:
        return json.loads(path.read_text("utf-8"))
    except (OSError, ValueError):
        return default


def _fetch(url, limit=MAX_IMAGE):
    # All callers construct provider URLs; no arbitrary URL is accepted from UI.
    with urlopen(Request(url, headers={"User-Agent": "ThemeHub/1.10 (cover artwork)"}), timeout=12) as response:
        raw = response.read(limit + 1)
    if len(raw) > limit:
        raise ValueError("Artwork response is too large")
    return raw


def _json(url):
    return json.loads(_fetch(url, 2 * 1024 * 1024))


def image_info(raw):
    """Validate dimensions before the browser decodes a local/downloaded image."""
    if len(raw) > MAX_IMAGE:
        raise ValueError("Choose a wrap smaller than 16 MB")
    if raw.startswith(b"\x89PNG\r\n\x1a\n") and len(raw) >= 24:
        w, h = struct.unpack(">II", raw[16:24])
        ext = "png"
    elif raw.startswith(b"\xff\xd8"):
        stream = io.BytesIO(raw[2:])
        w = h = 0
        while stream.tell() < len(raw) - 2:
            if stream.read(1) != b"\xff":
                continue
            marker = stream.read(1)
            while marker == b"\xff":
                marker = stream.read(1)
            if marker in (b"\xd8", b"\xd9", b"\x00"):
                continue
            length = stream.read(2)
            if len(length) != 2:
                break
            size = struct.unpack(">H", length)[0]
            if size < 2:
                break
            if marker and marker[0] in (0xc0, 0xc1, 0xc2):
                data = stream.read(5)
                if len(data) == 5:
                    h, w = struct.unpack(">HH", data[1:])
                break
            stream.seek(size - 2, 1)
        ext = "jpg"
    else:
        raise ValueError("Use a PNG or JPEG full wrap (back, spine, front)")
    if not (256 <= h <= 8192 and 256 <= w <= 16384 and w * h <= 48_000_000):
        raise ValueError("Wrap dimensions are unsupported")
    if not 1.05 <= w / h <= 2.5:
        raise ValueError("Choose a landscape full wrap, with back on the left and front on the right")
    return ext, w, h


def _unity(query):
    data = _json("https://xboxunity.net/Resources/Lib/TitleList.php?" + urlencode({
        "page": 0, "count": 50, "search": query, "sort": 0, "direction": 0, "category": 0, "filter": 1}))
    items = []
    for item in data.get("Items", [])[:50]:
        ident = str(item.get("TitleID", "")).upper()
        name = str(item.get("Name", ""))
        if re.fullmatch(r"[0-9A-F]{8}", ident) and int(item.get("Covers") or 0):
            items.append({"provider": "xboxunity", "platform": "xbox360", "id": ident,
                          "name": name, "score": score(query, name)})
    return items


def _tdb_index(root, platform):
    path = _root(root) / (platform + "-titles-v2.json")
    cache_key = str(path.resolve())
    if path.exists() and time.time() - path.stat().st_mtime < 7 * 86400:
        version = path.stat().st_mtime_ns
        if _indexes.get(cache_key, (None,))[0] == version:
            return _indexes[cache_key][1]
        rows = _read(path, [])
    else:
        try:
            raw = _fetch("https://www.gametdb.com/" + DATABASES[platform] + "?LANG=EN", 24 * 1024 * 1024)
            with zipfile.ZipFile(io.BytesIO(raw)) as archive:
                entry = next(x for x in archive.infolist() if x.filename.lower().endswith(".xml"))
                if entry.file_size > 64 * 1024 * 1024:
                    raise ValueError("GameTDB database is too large")
                xml = archive.read(entry)
            if b"<!ENTITY" in xml.upper() or b"<!DOCTYPE" in xml.upper():
                raise ValueError("Unsupported database XML")
            rows = []
            for _, game in ET.iterparse(io.BytesIO(xml), events=("end",)):
                if game.tag != "game":
                    continue
                ident = (game.findtext("id") or "").strip()
                name = game.findtext("locale[@lang='EN']/title") or game.findtext("locale/title") or game.get("name") or ""
                if re.fullmatch(r"[A-Za-z0-9]{4,16}", ident) and name:
                    rows.append([ident, name])
                game.clear()
            _atomic(path, json.dumps(rows, ensure_ascii=False).encode())
        except Exception:
            rows = _read(path, [])
            if not rows:
                raise
    _indexes[cache_key] = (path.stat().st_mtime_ns, rows)
    return rows


def search(root, query, provider="all", refresh=False):
    query = str(query).strip()[:160]
    if len(query) < 2:
        return {"candidates": [], "errors": ["Enter at least two characters"]}
    if provider not in ("all", "xboxunity", "gametdb"):
        raise ValueError("Unknown artwork provider")
    folder = _root(root)
    key = hashlib.sha256((provider + ":" + normalized(query)).encode()).hexdigest()[:24]
    path = folder / ("search-" + key + ".json")
    cached = _read(path, {})
    if not refresh and cached.get("at", 0) > time.time() - 6 * 3600:
        return cached
    items, errors = [], []
    if provider in ("all", "xboxunity"):
        try:
            items.extend(_unity(query))
        except Exception as error:
            errors.append("XboxUnity: " + str(error)[:160])
    if provider in ("all", "gametdb"):
        for platform in DATABASES:
            try:
                for ident, name in _tdb_index(root, platform):
                    value = score(query, name)
                    if value >= .62:
                        items.append({"provider": "gametdb", "platform": platform,
                                      "id": ident, "name": name, "score": value})
            except Exception as error:
                errors.append("GameTDB " + platform + ": " + str(error)[:160])
    items.sort(key=lambda c: (-c["score"], c["provider"] != "xboxunity", c["id"]))
    result = {"at": time.time(), "candidates": items[:24], "errors": errors}
    _atomic(path, json.dumps(result).encode())
    return result


def _record(root, appid):
    return _root(root) / (_key(appid) + ".json")


def status(root, appid):
    with LOCK:
        data = _read(_record(root, appid), {"mode": "auto"})
        filename = data.get("file", "")
        if filename and re.fullmatch(r"[a-f0-9]{64}\.(png|jpg)", filename):
            file = _root(root) / filename
            if file.is_file():
                return {**data, "path": str(file)}
        return {**data, "file": None}


def _save(root, appid, raw, data):
    ext, width, height = image_info(raw)
    filename = hashlib.sha256(raw).hexdigest() + "." + ext
    with LOCK:
        if data.get("mode") == "auto":
            latest = status(root, appid)
            if latest.get("mode") != "auto" or latest.get("file"):
                return latest
        _atomic(_root(root) / filename, raw)
        record = {**data, "file": filename, "width": width, "height": height}
        _atomic(_record(root, appid), json.dumps(record).encode())
        return status(root, appid)


def import_file(root, appid, path):
    file = Path(path).expanduser()
    if not file.is_file() or file.stat().st_size > MAX_IMAGE:
        raise ValueError("Choose a PNG or JPEG wrap smaller than 16 MB")
    return _save(root, appid, file.read_bytes(), {"mode": "manual", "source": "Local wrap", "name": file.name})


def set_mode(root, appid, mode):
    if mode not in ("auto", "generated"):
        raise ValueError("Unknown cover mode")
    with LOCK:
        _atomic(_record(root, appid), json.dumps({"mode": mode}).encode())
    return status(root, appid)


def select(root, appid, provider, platform, ident, name="", automatic=False):
    ident = str(ident)
    urls = []
    if provider == "xboxunity" and platform == "xbox360" and re.fullmatch(r"[0-9a-fA-F]{8}", ident):
        info = _json("https://xboxunity.net/Resources/Lib/CoverInfo.php?" + urlencode({"titleid": ident}))
        covers = info.get("Covers", [])
        covers.sort(key=lambda c: str(c.get("Official", "")).lower() not in ("true", "1"))
        for cover in covers[:5]:
            cid = str(cover.get("CoverID", ""))
            if cid.isdigit():
                urls.append("https://xboxunity.net/Resources/Lib/Cover.php?" + urlencode({"size": "large", "cid": cid}))
    elif provider == "gametdb" and platform in DATABASES and re.fullmatch(r"[A-Za-z0-9]{4,16}", ident):
        # Language/region fallback follows the full-cover directory convention.
        extensions = ("jpg", "png") if platform == "ps3" else ("png",)
        for kind in ("coverfullHQ", "coverfull", "coverfullM"):
            for region in ("US", "EN", "FR", "DE", "JA"):
                for extension in extensions:
                    urls.append(f"https://art.gametdb.com/{platform}/{kind}/{region}/{ident}.{extension}")
    else:
        raise ValueError("Invalid provider game ID")
    errors = []
    deadline = time.monotonic() + 40
    for url in urls:
        if time.monotonic() > deadline:
            break
        try:
            raw = _fetch(url)
            return _save(root, appid, raw, {"mode": "auto" if automatic else "selected", "source": provider,
                         "platform": platform, "id": ident, "name": str(name)[:200], "sourceUrl": url})
        except Exception as error:
            errors.append(str(error))
    raise ValueError("No downloadable full wrap for this entry" + (": " + errors[-1][:120] if errors else ""))


def resolve(root, appid, name, discover=False):
    current = status(root, appid)
    if current.get("file") or current.get("mode") != "auto" or not discover:
        return current
    # Persist failed discovery too, avoiding repeated provider traffic while scrolling.
    if current.get("checkedAt", 0) > time.time() - 6 * 3600:
        return current
    results = search(root, name)
    exact = [c for c in results["candidates"] if c["score"] == 1]
    # Prefer a single Xbox identity; GameTDB regional IDs are ambiguous choices.
    unity = [c for c in exact if c["provider"] == "xboxunity"]
    tdb = [c for c in exact if c["provider"] == "gametdb"]
    choices = (unity if len(unity) == 1 else []) + (tdb if len(tdb) == 1 else [])
    for candidate in choices:
        try:
            return select(root, appid, candidate["provider"], candidate["platform"], candidate["id"], candidate["name"], True)
        except Exception as error:
            results["errors"].append(str(error))
    with LOCK:
        # A manual choice made while a slow lookup ran must win.
        latest = status(root, appid)
        if latest.get("mode") != "auto" or latest.get("file"):
            return latest
        latest.update({"checkedAt": time.time(), "matchCount": len(results["candidates"]), "errors": results["errors"]})
        _atomic(_record(root, appid), json.dumps(latest).encode())
    return latest
