"""Your own Xbox 360-style avatar model for the NXE and Kinect dashboards.

360sona (https://360sona.com, an independent rebuild of the console's avatar
editor) exports the avatar on its stage as one glTF binary: "Export a 3D
model" downloads MyAvatar.glb with the skeleton, the baked textures and the
console animations it was asked to include. Its "Save as gamerpic" saves a
PNG. Neither can be fetched from the site by a program (they are made in the
browser and handed over as a download), so the user saves them and we pick
them up: from Downloads/Desktop/SD cards, a path, or an https URL.

The model goes to <data>/assets/my-avatar/avatar.glb and the picture to
gamerpic.png, which is where the dashboards already look (get_assets). Exports
are for the user's own personal use (360sona terms, clause 7): nothing here
uploads, shares or bundles them.
"""
import json
import os
import struct
import tempfile

GLB_MAX = 96 * 1024 * 1024     # big outfits with every animation are 20-40 MB
PNG_MAX = 8 * 1024 * 1024
SET = "my-avatar"


def glb_info(data_or_path):
    """A short summary of a glTF 2.0 binary ({meshes, skins, animations, nodes, size}), or None if it isn't one.
    Reads only the header and the JSON chunk."""
    try:
        if isinstance(data_or_path, (bytes, bytearray)):
            head = bytes(data_or_path[:20])
            size = len(data_or_path)
            read_json = lambda n: bytes(data_or_path[20:20 + n])
        else:
            size = os.path.getsize(data_or_path)
            f = open(data_or_path, "rb")
            head = f.read(20)
            def read_json(n, f=f):
                return f.read(n)
        try:
            if len(head) < 20 or head[:4] != b"glTF":
                return None
            version, length, clen, ctype = struct.unpack_from("<IIII", head, 4)
            if version != 2 or length > size or length < 28 or ctype != 0x4E4F534A or clen > min(length - 20, 16 * 1024 * 1024):
                return None
            doc = json.loads(read_json(clen).decode("utf8"))
        finally:
            if not isinstance(data_or_path, (bytes, bytearray)):
                f.close()
        if not isinstance(doc, dict) or not isinstance(doc.get("asset"), dict) or str(doc["asset"].get("version", "")).split(".")[0] != "2":
            return None
        lst = lambda k: doc.get(k) if isinstance(doc.get(k), list) else []
        anims = [str(a.get("name") or "")[:60] for a in lst("animations") if isinstance(a, dict)]
        return {"meshes": len(lst("meshes")), "skins": len(lst("skins")), "nodes": len(lst("nodes")), "animations": anims[:200], "size": size,
                "generator": str(doc["asset"].get("generator") or "")[:80]}
    except (OSError, ValueError, UnicodeDecodeError, struct.error, RecursionError):
        return None


def _is_png(head):
    return head[:8] == b"\x89PNG\r\n\x1a\n"


def kind_of(path):
    """'model', 'picture' or '' for a candidate file."""
    low = path.lower()
    try:
        size = os.path.getsize(path)
        if low.endswith(".glb"):
            info = glb_info(path) if size <= GLB_MAX else None
            return "model" if info and info["meshes"] else ""
        if low.endswith(".png") and size <= PNG_MAX:
            with open(path, "rb") as f:
                return "picture" if _is_png(f.read(8)) else ""
    except OSError:
        pass
    return ""


def scan(roots, max_depth=2, limit=40):
    """Avatar models (any .glb with a mesh) and gamerpics (PNGs whose name says gamerpic/avatar/sona) under roots, newest first."""
    found = []
    for root in roots:
        base = root.rstrip(os.sep).count(os.sep)
        for cur, dirs, files in os.walk(root):
            depth = cur.rstrip(os.sep).count(os.sep) - base
            dirs[:] = [d for d in dirs if not d.startswith(".")] if depth < max_depth else []
            for n in files:
                low = n.lower()
                if not (low.endswith(".glb") or (low.endswith(".png") and any(w in low for w in ("gamerpic", "avatar", "sona")))):
                    continue
                p = os.path.join(cur, n)
                k = kind_of(p)
                if not k:
                    continue
                try:
                    st = os.stat(p)
                except OSError:
                    continue
                item = {"path": p, "name": n, "kind": k, "size": st.st_size, "mtime": int(st.st_mtime)}
                if k == "model":
                    info = glb_info(p) or {}
                    item["animations"] = len(info.get("animations", []))
                    item["sona"] = n.lower().startswith("myavatar") or "360sona" in info.get("generator", "").lower()
                found.append(item)
    found.sort(key=lambda x: -x["mtime"])
    return found[:limit]


def _atomic_write(dest, data):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(dest), prefix=".import-")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        os.replace(tmp, dest)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def install_bytes(data, name, dest_dir):
    """Stores a model or a picture given as bytes; {success, kind, info} or {success: False, error}."""
    if name.lower().endswith(".png") or _is_png(data[:8]):
        if len(data) > PNG_MAX or not _is_png(data[:8]):
            return {"success": False, "error": "Not a PNG picture (or over 8 MB)"}
        _atomic_write(os.path.join(dest_dir, "gamerpic.png"), data)
        return {"success": True, "kind": "picture"}
    if len(data) > GLB_MAX:
        return {"success": False, "error": "The model is over %d MB" % (GLB_MAX // 2 ** 20)}
    info = glb_info(data)
    if not info or not info["meshes"]:
        return {"success": False, "error": "Not a glTF 2.0 binary (.glb) with a model in it"}
    _atomic_write(os.path.join(dest_dir, "avatar.glb"), data)
    return {"success": True, "kind": "model", "info": info}


def install(path, dest_dir):
    """Copies a .glb model or a .png gamerpic from `path` into the avatar set."""
    try:
        size = os.path.getsize(path)
    except OSError:
        return {"success": False, "error": "File not found"}
    if size > GLB_MAX:
        return {"success": False, "error": "The file is over %d MB" % (GLB_MAX // 2 ** 20)}
    with open(path, "rb") as f:
        data = f.read(GLB_MAX + 1)
    return install_bytes(data, os.path.basename(path), dest_dir)


def install_url(url, dest_dir, urlopen, timeout=30):
    """Downloads an https .glb/.png (size-capped) and installs it. `urlopen(request, timeout)` is theme_network.urlopen."""
    from urllib.request import Request
    from urllib.parse import urlparse
    u = urlparse(url or "")
    if u.scheme != "https" or not u.netloc:
        return {"success": False, "error": "Only https links"}
    with urlopen(Request(url, headers={"User-Agent": "DeckHomeThemes"}), timeout=timeout) as r:
        data = r.read(GLB_MAX + 1)
    if len(data) > GLB_MAX:
        return {"success": False, "error": "The file is over %d MB" % (GLB_MAX // 2 ** 20)}
    return install_bytes(data, os.path.basename(u.path) or "avatar.glb", dest_dir)


def remove(dest_dir, what="all"):
    """Forgets the imported model and/or picture."""
    names = {"model": ["avatar.glb"], "picture": ["gamerpic.png"]}.get(what, ["avatar.glb", "gamerpic.png"])
    gone = []
    for n in names:
        try:
            os.unlink(os.path.join(dest_dir, n))
            gone.append(n)
        except OSError:
            pass
    return {"success": True, "removed": gone}


def status(dest_dir):
    out = {"model": None, "picture": False}
    p = os.path.join(dest_dir, "avatar.glb")
    if os.path.isfile(p):
        info = glb_info(p)
        out["model"] = {"size": os.path.getsize(p), "animations": len(info["animations"]) if info else 0, "mtime": int(os.path.getmtime(p))}
    out["picture"] = os.path.isfile(os.path.join(dest_dir, "gamerpic.png"))
    return out
