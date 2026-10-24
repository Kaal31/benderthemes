"""Read extracted PS4 themes, ZIPs and RARs without executing theme content."""
import base64
import hashlib
import math
import os
import posixpath
import re
import shutil
import struct
import subprocess
import tempfile
import threading
import zipfile
import xml.etree.ElementTree as ET
from contextlib import contextmanager

READER_VERSION = 2
MAX_FRAMES = 120
MAX_FRAME_PIXELS = 32 * 1024 * 1024
MAX_FILES = 4096
MAX_TOTAL = 256 << 20
MAX_FILE = 32 << 20
_import_lock = threading.Lock()
RAR_TIMEOUT = 60
ICON_NAMES = {
    "function_icon": {"notification": "bell", "friend": "friends", "message": "message", "community": "community", "event": "calendar", "party": "party", "power": "power", "setting": "gear", "trophy": "trophy", "psstore": "store"},
    "content_icon": {"browser": "globe", "gallery": "photo", "library": "library", "folder": "folder", "tvvideo": "video", "usbmusic": "music", "livefromps": "video"},
}


def _safe_path(name):
    name = name.replace("\\", "/")
    if name.startswith("/") or any(part in ("", ".", "..") or ":" in part for part in name.split("/")):
        raise ValueError("Unsafe path in PS4 theme")
    return name


@contextmanager
def _rar_zip(path):
    with open(path, "rb") as stream:
        if not stream.read(8).startswith((b"Rar!\x1a\x07\x00", b"Rar!\x1a\x07\x01\x00")):
            raise ValueError("Invalid RAR archive")
    if os.path.getsize(path) > MAX_TOTAL:
        raise ValueError("PS4 RAR archive exceeds import limits")
    reader = shutil.which("bsdtar") or shutil.which("tar")
    if not reader:
        raise ValueError("RAR import requires bsdtar (libarchive); extract the RAR manually instead")
    try:
        version = subprocess.run([reader, "--version"], capture_output=True, timeout=5, check=True)
    except (OSError, subprocess.SubprocessError) as error:
        raise ValueError("Could not start the RAR reader; install bsdtar (libarchive)") from error
    if b"bsdtar" not in version.stdout.lower() and b"libarchive" not in version.stdout.lower():
        raise ValueError("RAR import requires bsdtar (libarchive), not GNU tar")
    with tempfile.TemporaryDirectory(prefix="dht-ps4-rar-") as directory:
        converted = os.path.join(directory, "theme.zip")
        with open(path, "rb") as source:
            process = subprocess.Popen([reader, "--format=zip", "--options", "zip:compression=store", "-cf", "-", "@-"],
                                       stdin=source, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        timer = threading.Timer(RAR_TIMEOUT, process.kill)
        timer.start()
        try:
            with open(converted, "wb") as output:
                while True:
                    chunk = process.stdout.read(65536)
                    if not chunk:
                        break
                    output.write(chunk)
                    if output.tell() > MAX_TOTAL + (MAX_FILES << 10):
                        raise ValueError("Expanded PS4 RAR exceeds import limits")
            if process.wait() != 0:
                raise ValueError("RAR could not be read: encrypted, damaged, multipart, or timed out; extract it manually")
            yield converted
        finally:
            timer.cancel()
            if process.poll() is None:
                process.kill()
            process.wait()
            process.stdout.close()


@contextmanager
def _source(path):
    if not os.path.isdir(path) and str(path).lower().endswith(".rar"):
        with _rar_zip(path) as converted, _source(converted) as source:
            yield source
        return
    archive = None
    entries = {}
    total = 0
    try:
        if os.path.isdir(path):
            base = os.path.realpath(path)
            for root, dirs, files in os.walk(base, followlinks=False):
                dirs[:] = sorted(name for name in dirs if not os.path.islink(os.path.join(root, name)))
                for name in sorted(files):
                    full = os.path.join(root, name)
                    if os.path.islink(full):
                        raise ValueError("Symlinks are not supported in PS4 themes")
                    rel = _safe_path(os.path.relpath(full, base).replace(os.sep, "/"))
                    size = os.path.getsize(full)
                    total += size
                    key = rel.lower()
                    if key in entries:
                        raise ValueError("Duplicate PS4 theme path")
                    entries[key] = (full, size)
                    if len(entries) > MAX_FILES or total > MAX_TOTAL:
                        raise ValueError("PS4 theme exceeds import limits")

            def read_entry(entry):
                full, size = entry
                if size > MAX_FILE or os.path.commonpath((base, os.path.realpath(full))) != base:
                    raise ValueError("PS4 resource exceeds import limits")
                with open(full, "rb") as stream:
                    raw = stream.read(MAX_FILE + 1)
                if len(raw) > MAX_FILE:
                    raise ValueError("PS4 resource exceeds import limits")
                return raw
        else:
            if not str(path).lower().endswith(".zip") or not zipfile.is_zipfile(path):
                raise ValueError("Use an extracted PS4 theme folder, ZIP or RAR; encrypted PKG files are not supported")
            archive = zipfile.ZipFile(path)
            members = archive.infolist()
            if len(members) > MAX_FILES:
                raise ValueError("Too many PS4 archive entries")
            for member in members:
                rel = _safe_path(member.filename.rstrip("/"))
                if member.is_dir():
                    continue
                if (member.external_attr >> 16) & 0o170000 == 0o120000:
                    raise ValueError("Symlinks are not supported in PS4 themes")
                total += member.file_size
                if total > MAX_TOTAL or member.flag_bits & 1:
                    raise ValueError("Encrypted or oversized PS4 archive")
                if rel.lower() in entries:
                    raise ValueError("Duplicate PS4 theme path")
                entries[rel.lower()] = (member, member.file_size)

            def read_entry(entry):
                member, size = entry
                if size > MAX_FILE:
                    raise ValueError("PS4 resource exceeds import limits")
                return archive.read(member)

        roots = [name for name in entries if name == "theme.xml" or name.endswith("/theme.xml")]
        if len(roots) != 1:
            raise ValueError("Expected exactly one PS4 theme.xml")
        prefix = roots[0][:-len("theme.xml")]

        def read(rel):
            entry = entries.get(prefix + _safe_path(rel).lower())
            return read_entry(entry) if entry else None

        yield read, sorted(name[len(prefix):] for name in entries if name.startswith(prefix))
    finally:
        if archive:
            archive.close()


def _parse_xml(raw):
    if not raw or len(raw) > 1 << 20 or b"\x00" in raw or re.search(br"<!\s*(?:DOCTYPE|ENTITY)", raw, re.I):
        raise ValueError("Invalid PS4 theme XML")
    return ET.fromstring(raw)


def _xml(raw):
    root = _parse_xml(raw)
    if root.tag != "theme" or root.find("format-version") is None or root.find("themecolor") is None:
        raise ValueError("Not a PS4 theme descriptor")
    return root


def _sequence(read, names):
    directory = "scene/background.raf/"
    if directory + "index.xml" not in names:
        return []
    root = _parse_xml(read(directory + "index.xml"))
    if root.tag != "raf":
        raise ValueError("Unsupported RAF descriptor")
    materials = {}
    for material in root.findall("material"):
        texture = material.find("texture")
        if texture is not None and len(material.findall("texture")) == 1:
            materials[material.get("id")] = texture.get("file")
    actors = {}
    visibility = {}
    placement = None
    for actor in root.findall("actor"):
        if set(actor.attrib) - {"id", "model", "material", "color", "position", "zsort"}:
            raise ValueError("RAF scene contains unsupported actor transforms")
        position = tuple(float(value) for value in actor.get("position", "0 0 0").split())
        if len(position) != 3 or not all(math.isfinite(value) for value in position):
            raise ValueError("Invalid RAF actor position")
        current = (actor.get("model"), position, actor.get("zsort", "back_to_front"))
        if placement is not None and current != placement:
            raise ValueError("RAF actors must share one plane and placement")
        placement = current
        actors[actor.get("id")] = materials.get(actor.get("material"))
        color = [float(value) for value in actor.get("color", "1 1 1 1").split()]
        if len(color) != 4 or color[:3] != [1, 1, 1] or color[3] not in (0, 1):
            raise ValueError("RAF scene contains unsupported actor colours")
        visibility[actor.get("id")] = color[3] == 1
    sequence = root.find("sequence")
    cases = list(sequence) if sequence is not None else list(root)
    cases = [case for case in cases if case.tag == "case"]
    if not cases or len(cases) > MAX_FRAMES:
        raise ValueError("Unsupported or oversized RAF sequence")
    frames = []
    for case in cases:
        seconds = float(case.get("wait", "0"))
        if not math.isfinite(seconds) or seconds < 1 / 60 or seconds > 60:
            raise ValueError("Unsupported RAF frame duration")
        target = case.get("target")
        if not target:
            for actor in case:
                if actor.tag != "actor" or set(actor.attrib) - {"id", "color", "trans_time", "trans_step"}:
                    raise ValueError("RAF sequence contains unsupported animation commands")
                color = [float(value) for value in actor.get("color", "").split()]
                if len(color) != 4 or color[:3] != [1, 1, 1] or color[3] not in (0, 1) or float(actor.get("trans_time", "0")) != 0:
                    raise ValueError("RAF sequence contains unsupported blending")
                if actor.get("id") not in actors:
                    raise ValueError("RAF sequence references an unknown actor")
                visibility[actor.get("id")] = color[3] == 1
            visible = [actors[actor] for actor, shown in visibility.items() if shown]
            if len(visible) != 1:
                raise ValueError("RAF sequence must display one texture per frame")
            target = visible[0]
        if not target:
            raise ValueError("RAF sequence references an unknown actor")
        target = directory + _safe_path(target).lower()
        if target not in names or not target.endswith((".png", ".dds")):
            raise ValueError("RAF frame is missing or unsupported")
        frames.append((target, round(seconds * 1000, 3)))
    return frames


def peek(path):
    try:
        with _source(path) as (read, names):
            _xml(read("theme.xml"))
        return True
    except (OSError, ValueError, ET.ParseError, zipfile.BadZipFile, RuntimeError):
        return False


def fingerprint(path):
    digest = hashlib.sha256(str(READER_VERSION).encode())
    with _source(path) as (read, names):
        for name in names:
            digest.update(name.encode())
            digest.update(read(name))
    return digest.hexdigest()


def import_downloads(downloads, destination):
    if not _import_lock.acquire(blocking=False):
        return {"success": False, "error": "A PS4 import is already running"}
    imported, existing, errors = [], [], []
    try:
        if not os.path.isdir(downloads):
            return {"success": True, "imported": [], "existing": [], "errors": []}
        os.makedirs(destination, exist_ok=True)
        with os.scandir(downloads) as entries:
            candidates = sorted((entry.name for entry in entries if not entry.name.startswith(".") and not entry.is_symlink()
                                 and (entry.is_dir() or entry.name.lower().endswith((".zip", ".rar")))), key=str.casefold)[:128]
        processed = 0
        copied_bytes = 0
        for name in candidates:
            source = os.path.join(downloads, name)
            if name.lower().endswith(".rar"):
                try:
                    with _source(source) as (read, names):
                        _xml(read("theme.xml"))
                except (OSError, ValueError, RuntimeError, zipfile.BadZipFile, ET.ParseError) as error:
                    errors.append(f"{name}: {error}")
                    continue
            elif not peek(source):
                continue
            temporary = None
            try:
                stem = os.path.splitext(name)[0] if os.path.isfile(source) else name
                stem = re.sub(r'[\x00-\x1f<>:"/\\|?*]', "_", stem).strip(" .")[:80] or "PS4 theme"
                digest = fingerprint(source)
                duplicate = None
                for suffix in range(1, 1001):
                    target_name = stem + (f" ({suffix})" if suffix > 1 else "") + ".zip"
                    target = os.path.join(destination, target_name)
                    if not os.path.lexists(target):
                        break
                    if not os.path.islink(target) and os.path.isfile(target):
                        try:
                            if fingerprint(target) == digest:
                                duplicate = target_name
                                break
                        except (ValueError, OSError, zipfile.BadZipFile):
                            pass
                else:
                    raise ValueError("Too many themes with the same name")
                if duplicate:
                    existing.append(duplicate)
                    continue
                if processed >= 16:
                    errors.append("Import limit reached; run again to import more themes")
                    break
                processed += 1
                with tempfile.NamedTemporaryFile(dir=destination, prefix=".ps4-import-", suffix=".zip", delete=False) as stream:
                    temporary = stream.name
                if os.path.isfile(source) and not name.lower().endswith(".rar"):
                    with open(source, "rb") as source_stream, open(temporary, "wb") as output:
                        while True:
                            chunk = source_stream.read(262144)
                            if not chunk:
                                break
                            copied_bytes += len(chunk)
                            if copied_bytes > 512 << 20 or output.tell() + len(chunk) > MAX_TOTAL:
                                raise ValueError("PS4 import size limit reached")
                            output.write(chunk)
                else:
                    with _source(source) as (read, names), zipfile.ZipFile(temporary, "w", zipfile.ZIP_DEFLATED) as archive:
                        for relative in names:
                            raw = read(relative)
                            copied_bytes += len(raw)
                            if copied_bytes > 512 << 20:
                                raise ValueError("PS4 import size limit reached")
                            archive.writestr(relative, raw)
                if not peek(temporary) or fingerprint(temporary) != digest:
                    raise ValueError("Theme changed while importing; try again")
                os.link(temporary, target)
                imported.append(target_name)
            except (OSError, ValueError, RuntimeError, zipfile.BadZipFile) as error:
                errors.append(f"{name}: {error}")
            finally:
                if temporary:
                    try:
                        os.remove(temporary)
                    except FileNotFoundError:
                        pass
        return {"success": True, "imported": imported, "existing": existing, "errors": errors}
    except OSError as error:
        return {"success": False, "error": str(error)}
    finally:
        _import_lock.release()


def read_ps4_theme(path, frame_sink=None):
    errors = []
    with _source(path) as (read, names):
        root = _xml(read("theme.xml"))

        def image(rel, frame=False):
            nonlocal frame_pixels
            raw = read(rel)
            if not raw:
                return None
            if frame:
                if raw.startswith(b"DDS ") and len(raw) >= 128:
                    height, width = struct.unpack_from("<II", raw, 12)
                elif raw.startswith(b"\x89PNG\r\n\x1a\n") and len(raw) >= 24:
                    width, height = struct.unpack_from(">II", raw, 16)
                else:
                    raise ValueError("Animated frames must be PNG or DDS")
                frame_pixels += width * height
                if not width or not height or width > 2048 or height > 2048 or frame_pixels > MAX_FRAME_PIXELS:
                    raise ValueError("RAF animation exceeds decoded image limits")
            if raw.startswith(b"DDS "):
                from x360_themes import dds_to_png
                raw = dds_to_png(raw)
                if not raw:
                    errors.append("Unsupported DDS texture: " + rel)
                    return None
            mime = "image/png" if raw.startswith(b"\x89PNG\r\n\x1a\n") else "image/jpeg" if raw.startswith(b"\xff\xd8\xff") else None
            if not mime:
                errors.append("Unsupported image: " + rel)
                return None
            if frame and frame_sink:
                return frame_sink(raw)
            return "data:" + mime + ";base64," + base64.b64encode(raw).decode("ascii")

        frame_pixels = 0
        def background(stem):
            for ext in ("png", "jpg", "jpeg", "dds"):
                result = image("texture/background/" + stem + "." + ext)
                if result:
                    return result
            return None

        colors = {}
        for field, tag in {"text": "fontcolor", "shadow": "fontshadowcolor", "focus": "focuscolor", "homeDimmer": "homescreen-dimmer", "functionDimmer": "functionscreen-dimmer", "titleDimmer": "titlename-dimmer"}.items():
            value = (root.findtext(tag) or "").strip()
            if re.fullmatch(r"#[0-9a-fA-F]{8}", value):
                colors[field] = "#" + value[3:] + value[1:3]
        icons, glows = {}, {}
        for directory, mapping in ICON_NAMES.items():
            for native, target in mapping.items():
                value = image(f"texture/{directory}/{native}.png")
                if value:
                    icons[target] = value
                value = image(f"texture/{directory}/{native}_glow.png")
                if value:
                    glows[target] = value
        dynamic = any(name.startswith("scene/") for name in names)
        home = background("homescreen")
        function = background("functionscreen")
        animation = []
        if dynamic:
            try:
                decoded = {}
                for target, duration in _sequence(read, names):
                    if target not in decoded:
                        decoded[target] = image(target, frame=True)
                    if not decoded[target]:
                        raise ValueError("Could not decode RAF frame: " + target)
                    animation.append({"image": decoded[target], "durationMs": duration})
                if not animation:
                    raise ValueError("Packed or complex RAF scenes are not supported yet")
            except (ValueError, ET.ParseError, struct.error) as error:
                animation = []
                errors.append(f"{error}; using a static background or preview")
        preview = image("texture/preview.png") or image("sce_sys/icon0.png")
        if not home and dynamic:
            home = animation[0]["image"] if animation else preview
        sounds = {}
        from console_themes import vag_to_wav
        for name in names:
            if name.startswith("sound/se_") and name.endswith(".vag"):
                try:
                    decoded = vag_to_wav(read(name))
                    if decoded:
                        sounds[posixpath.basename(name)[:-4]] = decoded
                except (ValueError, IndexError, KeyError, struct.error):
                    errors.append("Could not decode sound: " + name)
        music = read("sound/bgm_home.at9") if (root.findtext("homebgm-enable") or "true").strip().lower() != "false" else None
        return {"name": root.findtext("label") or os.path.splitext(os.path.basename(path))[0], "background": home,
                "functionBackground": function, "icons": icons, "glows": glows, "colors": colors,
                "preview": preview, "dynamic": dynamic, "animation": animation, "errors": errors, "_sounds": sounds, "_music": music}
