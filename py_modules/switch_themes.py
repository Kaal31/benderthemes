"""Nintendo Switch home-menu themes (.nxtheme, made with NXThemes Installer / Themezer).

A .nxtheme is a Yaz0-compressed SARC archive (the same containers as the Wii U's .szs, see
wiiu_themes.py) or, as Themezer serves them today, a plain zip with the same members. It holds, for ONE Switch screen:
  info.json    {"Version", "ThemeName", "Author", "LayoutInfo", "Target"}   Target: home, lock, apps,
               news, psl (player select), set (settings), user (my page) ...
  image.jpg / image.png / image.dds   the wallpaper (DDS: DXT1, 1280x720 in practice)
  layout.json / common.json: differential layout and animation patches, converted by switch_layout.py
               for recognized Home Menu panes; unsupported properties are reported
  album.dds ... small round-icon pictures of the home screen (album, news, shop, controller, settings, power)
Everything in the file is the theme author's own art: nothing from Nintendo is needed or bundled.

A full theme is usually several files (one per screen) sharing a ThemeName and Author, so the reader
groups the files in a folder that way. Nothing here ever raises: a broken part is just left out.
"""
import io
import json
import os
import re
import struct
try:
    import zipfile
except Exception:  # pragma: no cover
    zipfile = None

try:
    import wiiu_themes
except Exception:  # pragma: no cover
    wiiu_themes = None

READER_VERSION = 39  # Native dialog families, nested parts, capture panes and cursor shadows.
MAX_FILE = 48 * 1024 * 1024
ICON_NAMES = ("album", "news", "shop", "controller", "settings", "power", "nso", "card", "share")
TARGET_LABELS = {"home": "Home menu", "lock": "Lock screen", "apps": "All software", "news": "News", "psl": "Player select",
                 "set": "Settings", "user": "User page", "shop": "eShop", "album": "Album"}
_IMG_EXT = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png"}


def _archive(path):
    if os.path.getsize(path) > MAX_FILE:
        return None
    with open(path, "rb") as f:
        d = f.read()
    if d[:4] == b"PK\x03\x04":
        a = _zip_members(d)
        return a if a and "info.json" in a else None
    if d[:4] not in (b"Yaz0", b"SARC"):
        return None
    try:
        a = wiiu_themes.sarc(d)
    except Exception:
        return None
    return a if "info.json" in a else None


def _zip_members(d, limit=MAX_FILE, count=64):
    """{name: bytes} of a zip-packed .nxtheme: top-level members only, at most `count` of them and `limit` bytes in all."""
    if zipfile is None:
        return None
    try:
        with zipfile.ZipFile(io.BytesIO(d)) as z:
            out, total = {}, 0
            for i in z.infolist()[:count]:
                if i.is_dir() or "/" in i.filename.strip("/") or "\\" in i.filename:
                    continue
                total += i.file_size
                if total > limit:
                    return None
                out[i.filename] = z.read(i)
            return out
    except Exception:
        return None


def _info(a):
    try:
        i = json.loads(a["info.json"].decode("utf-8", "replace"))
    except Exception:
        return None
    if not isinstance(i, dict):
        return None
    return {"name": str(i.get("ThemeName") or "")[:80], "author": str(i.get("Author") or "")[:80],
            "target": str(i.get("Target") or "")[:20].lower(), "layoutInfo": str(i.get("LayoutInfo") or "")[:120],
            "version": i.get("Version") if isinstance(i.get("Version"), int) else 0}


def file_info(path):
    """{name, author, target, layoutInfo, version} of one .nxtheme, or None if it isn't one."""
    try:
        a = _archive(path)
        i = _info(a) if a else None
        if i and not i["name"]:
            i["name"] = os.path.splitext(os.path.basename(path))[0]
        return i
    except Exception:
        return None


# ───────────── DDS ─────────────

def dds_rgba(d):
    """(w, h, RGBA bytes) of the first picture in a DDS file, or None for formats not handled."""
    if len(d) < 128 or d[:4] != b"DDS ":
        return None
    h, w = struct.unpack("<II", d[12:20])
    if not (0 < w <= 4096 and 0 < h <= 4096):
        return None
    flags = struct.unpack("<I", d[80:84])[0]
    fourcc = d[84:88]
    body = d[128:]
    if flags & 4:  # compressed
        kinds = {b"DXT1": "bc1", b"DXT2": "bc2", b"DXT3": "bc2", b"DXT4": "bc3", b"DXT5": "bc3"}
        k = kinds.get(fourcc)
        if not k:
            return None
        need = ((w + 3) // 4) * ((h + 3) // 4) * (8 if k == "bc1" else 16)
        if len(body) < need:
            return None
        return w, h, wiiu_themes._blocks_to_rgba(body, w, h, k)
    bits, rm, gm, bm, am = struct.unpack("<IIIII", d[88:108])
    if bits == 32 and len(body) >= w * h * 4 and rm and gm and bm:
        out = bytearray(w * h * 4)
        sh = lambda m: (m & -m).bit_length() - 1 if m else 0
        sr, sg, sb, sa = sh(rm), sh(gm), sh(bm), sh(am)
        for i in range(w * h):
            v = struct.unpack_from("<I", body, i * 4)[0]
            out[i * 4:i * 4 + 4] = bytes(((v & rm) >> sr, (v & gm) >> sg, (v & bm) >> sb, ((v & am) >> sa) if am else 255))
        return w, h, bytes(out)
    return None


def _rgb_dxt1_png(d):
    """Big opaque DXT1 wallpapers: the fast RGB path, written as a PNG."""
    import console_themes
    h, w = struct.unpack("<II", d[12:20])
    if d[84:88] != b"DXT1" or not (0 < w <= 4096 and 0 < h <= 4096):
        return None
    if len(d) - 128 < ((w + 3) // 4) * ((h + 3) // 4) * 8:
        return None
    return console_themes.png(w, h, console_themes._dxt_rgb(d[128:], w, h), 3), w, h


def picture(name, raw):
    """(PNG or JPEG bytes, mime, width, height, average brightness 0..1) for an image member, or None."""
    low = name.lower()
    ext = os.path.splitext(low)[1]
    if ext in _IMG_EXT:
        if ext == ".png" and raw[:4] != b"\x89PNG":
            return (raw, "image/jpeg", 0, 0, None) if raw[:2] == b"\xff\xd8" else None
        if ext != ".png" and raw[:2] != b"\xff\xd8":
            return (raw, "image/png", 0, 0, None) if raw[:4] == b"\x89PNG" else None
        return raw, _IMG_EXT[ext], 0, 0, None
    if ext == ".dds":
        if raw[84:88] == b"DXT1":
            r = _rgb_dxt1_png(raw)
            if r:
                png, w, h = r
                return png, "image/png", w, h, _dxt1_brightness(raw)
        r = dds_rgba(raw)
        if r:
            w, h, rgba = r
            return wiiu_themes.png(w, h, rgba), "image/png", w, h, None
    return None


def _dxt1_brightness(raw):
    """Average brightness of a DXT1 picture from its block end colours (cheap, no full decode)."""
    h, w = struct.unpack("<II", raw[12:20])
    n = ((w + 3) // 4) * ((h + 3) // 4)
    body = raw[128:128 + n * 8]
    tot = cnt = 0
    for o in range(0, len(body) - 7, 8 * 7):  # every 7th block is plenty
        c0, c1 = struct.unpack_from("<HH", body, o)
        for c in (c0, c1):
            tot += ((c >> 11 & 31) * 255 // 31) * 0.299 + ((c >> 5 & 63) * 255 // 63) * 0.587 + ((c & 31) * 255 // 31) * 0.114
            cnt += 1
    return round(tot / cnt / 255, 3) if cnt else None


# ───────────── one file / a whole theme ─────────────

def read_screen(path, data_url):
    """One .nxtheme as a dict the frontend uses directly, or None if it isn't a Switch theme."""
    try:
        a = _archive(path)
    except Exception:
        return None
    if not a:
        return None
    info = _info(a)
    if not info:
        return None
    if not info["name"]:
        info["name"] = os.path.splitext(os.path.basename(path))[0]
    res = {"file": os.path.basename(path), **info, "label": TARGET_LABELS.get(info["target"], info["target"] or "Screen"),
           "background": None, "icons": {}, "extras": [], "errors": []}
    for member, raw in a.items():
        base = os.path.splitext(member.lower())[0]
        if base not in ("image", "preview") and base not in ICON_NAMES:
            if member not in ("info.json", "layout.json", "common.json") and not member.lower().endswith((".json", ".bflyt", ".bflan")):
                res["extras"].append(member)
            continue
        try:
            p = picture(member, raw)
            if not p:
                if base == "image":
                    res["errors"].append(f"{member}: format not supported")
                continue
            png, mime, w, h, lum = p
            url = data_url(png, mime)
            if base == "image":
                res["background"] = url
                res["size"] = [w, h] if w else None
                if lum is not None:
                    res["brightness"] = lum
            elif base == "preview":
                res["preview"] = url
            else:
                res["icons"][{"nso":"online", "card":"virtualCards", "share":"gameShare"}.get(base, base)] = url
        except Exception as e:  # one broken picture never loses the theme
            res["errors"].append(f"{member}: {e}"[:120])
    try:
        lay = json.loads(a["layout.json"].decode("utf-8", "replace")) if "layout.json" in a else {}
        res["patches"] = len(lay.get("Files", [])) if isinstance(lay, dict) else 0
    except Exception:
        res["patches"] = 0
    from switch_layout import convert_layout
    try:
        res["conversion"] = convert_layout(a, info["target"])
    except (ValueError, TypeError, AttributeError, KeyError, OverflowError):
        res["conversion"] = {"version": 1, "panes": {}, "animations": [], "converted": 0,
                             "warnings": ["Layout conversion could not read this patch; artwork remains available."]}
    return res


_TAIL = re.compile(r"[\s\-_:|]*(all ?(apps|software|games)|apps?( screen)?|home ?(screen|menu)?|menu|lock ?screen( alt)? ?\d*|lock|player ?select(ion)?|user( ?(page|screen))?|settings?( screen)?|news|select|psl|album|shop)\s*\d*\s*$", re.I)


def group_key(name, author, folder=""):
    """Files of one theme share a folder, or a name once screen words ('[Lock]', '- All Apps' ...) are removed."""
    if folder:
        return "dir:" + folder.lower()
    n = re.sub(r"[\[(][^\])]*[\])]", " ", name or "")
    for _ in range(3):
        m = _TAIL.sub("", n)
        if m == n or not m.strip():
            break
        n = m
    return re.sub(r"\W+", " ", n).strip().lower() + "|" + (author or "").strip().lower()


def _list_files(folder):
    """Relative paths ('a.nxtheme' or 'Theme folder/a.nxtheme') of the .nxtheme files, one folder level deep."""
    out = []
    try:
        for n in sorted(os.listdir(folder)):
            p = os.path.join(folder, n)
            if os.path.isdir(p):
                try:
                    out += [n + "/" + m for m in sorted(os.listdir(p)) if m.lower().endswith(".nxtheme")]
                except OSError:
                    pass
            elif n.lower().endswith(".nxtheme"):
                out.append(n)
    except OSError:
        pass
    return out


def safe_rel(folder, rel):
    """Absolute path of a listed file, or None when `rel` tries to leave the folder."""
    parts = [x for x in str(rel or "").replace("\\", "/").split("/") if x]
    if not parts or len(parts) > 2 or any(x in (".", "..") for x in parts):
        return None
    p = os.path.join(folder, *parts)
    return p if os.path.isfile(p) else None


def scan_folder(folder, cache_path=None):
    """Every .nxtheme under a folder (and its sub-folders), grouped into themes.

    -> [{id, name, author, files: {target: relative path}, primary}], remembered in cache_path (size+mtime keyed)."""
    names = _list_files(folder)
    cache = {}
    if cache_path:
        try:
            with open(cache_path, encoding="utf-8") as f:
                cache = json.load(f)
            if cache.get("v") != READER_VERSION:
                cache = {}
        except Exception:
            cache = {}
    entries, out, dirty = cache.get("e", {}), {}, False
    for n in names:
        p = safe_rel(folder, n)
        try:
            st = os.stat(p)
        except (OSError, TypeError):
            continue
        key = f"{st.st_size}|{st.st_mtime_ns}"
        e = entries.get(n)
        if not e or e.get("key") != key:
            e = {"key": key, "info": file_info(p)}
            dirty = True
        out[n] = e
    if cache_path and (dirty or set(out) != set(entries)):
        try:
            os.makedirs(os.path.dirname(cache_path) or ".", exist_ok=True)
            with open(cache_path + ".tmp", "w", encoding="utf-8") as f:
                json.dump({"v": READER_VERSION, "e": out}, f)
            os.replace(cache_path + ".tmp", cache_path)
        except Exception:
            pass
    groups = {}
    for n in names:
        i = (out.get(n) or {}).get("info")
        if not i:
            continue
        folder_name = n.rsplit("/", 1)[0] if "/" in n else ""
        g = groups.setdefault(group_key(i["name"], i["author"], folder_name), {"name": i["name"], "author": i["author"], "files": {}})
        t = i["target"] or "?"
        g["files"].setdefault(t, n)
        if t == "home":
            g["name"] = i["name"]
    res = []
    for g in groups.values():
        g["primary"] = g["files"].get("home") or next(iter(g["files"].values()))
        g["id"] = g["primary"]
        if len(g["files"]) > 1:  # a shared name, without the screen word
            g["name"] = _TAIL.sub("", re.sub(r"\s*[\[(][^\])]*[\])]", "", g["name"])).strip() or g["name"]
        res.append(g)
    return sorted(res, key=lambda g: g["name"].lower())


USED_SCREENS = ("home", "apps", "set", "lock")  # the screens the home draws (lock: shown from the Y menu); the others are only listed (they would add MBs)


def read_theme(folder, name, data_url, cache_path=None, only=USED_SCREENS, resource_folder=None):
    """The theme that the file `name` belongs to: its screens by target (pictures only for `only`, all when None)."""
    path = safe_rel(folder, name)
    first = read_screen(path, data_url) if path else None
    if first is None:
        return None
    ftarget = first["target"] or "?"        # same key as scan_folder's groups (a file with no target is "?" everywhere)
    res = {"name": first["name"], "author": first["author"], "file": name, "screens": {ftarget: first}, "otherScreens": []}
    if only is not None and ftarget not in only:  # picked through e.g. its lock screen: keep its pictures out
        res["screens"] = {}
        res["otherScreens"].append(ftarget)
    try:
        for g in scan_folder(folder, cache_path):
            if name in g["files"].values():
                res["name"] = g["name"] or res["name"]
                for tgt, fn in g["files"].items():
                    if tgt not in res["screens"] and tgt not in res["otherScreens"]:
                        if only is not None and tgt not in only:
                            res["otherScreens"].append(tgt)
                            continue
                        s = read_screen(safe_rel(folder, fn), data_url)
                        if s:
                            res["screens"][s["target"] or tgt] = s
                break
    except Exception:
        pass
    # shared icon set: the first screen that has each icon
    icons = {}
    for s in res["screens"].values():
        for k, v in s["icons"].items():
            icons.setdefault(k, v)
    res["icons"] = icons
    # Menu picture resources are optional, user-imported local inputs. They are
    # independent of third-party theme archives and never bundled in a release.
    try:
        from switch_resources import read_resources
        resources=read_resources(resource_folder or folder,data_url)
        if resource_folder and os.path.realpath(resource_folder)!=os.path.realpath(folder):
            local=read_resources(folder,data_url)
            resources['textures'].update(local['textures'])
            resources['fonts'].update(local['fonts'])
            for file,panes in local['pictures'].items():resources['pictures'].setdefault(file,{}).update(panes)
            resources['warnings']+=local['warnings']
        for screen in res['screens'].values():
            if screen.get('conversion') is not None:
                screen['conversion']['nativePictures']=resources['pictures']
                screen['conversion']['nativeTextures']=resources['textures']
                screen['conversion']['nativeFonts']=resources['fonts']
                screen['conversion']['resourceWarnings']=resources['warnings']
    except (ImportError,OSError,ValueError):
        pass
    return res
