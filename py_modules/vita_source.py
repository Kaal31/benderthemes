"""Bounded, case-insensitive access to user-supplied Vita theme folders and ZIPs."""
import os
import zipfile
from contextlib import contextmanager

MAX_FILE = 32 * 1024 * 1024
MAX_FILES = 4096


def peek(path):
    try:
        with open_theme(path) as read:
            return bool(read("theme.xml"))
    except (OSError, ValueError, zipfile.BadZipFile):
        return False


def _relative(name):
    if not isinstance(name, str):
        return None
    name = name.strip().replace("\\", "/")
    parts = name.split("/")
    if not name or any(p in ("", ".", "..") or ":" in p for p in parts):
        return None
    return name


@contextmanager
def open_theme(path):
    archive = None
    try:
        if os.path.isdir(path):
            base = os.path.realpath(path)
            names = {}
            for folder, dirs, files in os.walk(base, followlinks=False):
                if os.path.relpath(folder, base).count(os.sep) >= 8:
                    dirs[:] = []
                for filename in files:
                    full = os.path.join(folder, filename)
                    rel = os.path.relpath(full, base).replace(os.sep, "/")
                    names[rel.lower()] = full
                    if len(names) > MAX_FILES:
                        raise ValueError("Too many files in Vita theme")
            def read_file(name):
                full = names.get(name.lower())
                if not full:
                    return None
                full = os.path.realpath(full)
                if os.path.commonpath((base, full)) != base or not os.path.isfile(full):
                    return None
                if os.path.getsize(full) > MAX_FILE:
                    raise ValueError("Vita theme file too large")
                with open(full, "rb") as stream:
                    data = stream.read(MAX_FILE + 1)
                if len(data) > MAX_FILE:
                    raise ValueError("Vita theme file too large")
                return data
        elif zipfile.is_zipfile(path):
            archive = zipfile.ZipFile(path)
            entries = archive.infolist()
            if len(entries) > MAX_FILES:
                raise ValueError("Too many files in Vita theme")
            names = {i.filename.lower(): i for i in entries if not i.is_dir() and _relative(i.filename)}
            def read_file(name):
                entry = names.get(name.lower())
                if entry is None:
                    return None
                if entry.file_size > MAX_FILE:
                    raise ValueError("Vita theme file too large")
                return archive.read(entry)
        else:
            yield lambda name: None
            return
        xml = min((n for n in names if n.rsplit("/", 1)[-1] == "theme.xml"), key=lambda n: (n.count("/"), n), default="")
        prefix = xml[:-len("theme.xml")] if xml else ""
        def read(name):
            name = _relative(name)
            if name is None:
                return None
            result = read_file(prefix + name)
            return result if result is not None or not prefix else read_file(name)
        yield read
    finally:
        if archive is not None:
            archive.close()
