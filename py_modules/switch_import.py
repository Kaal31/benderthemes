"""Import actual console themes and Themezer pack ZIPs, without extracting paths."""
import io
import os
import re
import tempfile
import zipfile
from pathlib import Path
import switch_themes

def import_theme(source, destination):
    source = Path(source)
    if source.suffix.lower() not in (".nxtheme", ".zip") or not source.is_file():
        return {"success": False, "error": "Choose a .nxtheme file or a Themezer pack ZIP."}
    if source.stat().st_size > switch_themes.MAX_FILE:
        return {"success": False, "error": "Theme file exceeds 48 MB."}
    pending = []
    try:
        if source.suffix.lower() == ".nxtheme":
            pending = [(source.name, source.read_bytes())]
        else:
            with zipfile.ZipFile(source) as archive:
                total = 0
                for entry in archive.infolist():
                    if entry.is_dir() or not entry.filename.lower().endswith(".nxtheme"):
                        continue
                    total += entry.file_size
                    if len(pending) >= 32 or total > switch_themes.MAX_FILE:
                        raise ValueError("Theme pack exceeds 32 themes or 48 MB unpacked.")
                    pending.append((Path(entry.filename.replace("\\", "/")).name, archive.read(entry)))
        if not pending:
            raise ValueError("No .nxtheme files were found in this pack.")
        with tempfile.TemporaryDirectory() as temporary:
            staged = []
            names = set()
            for name, data in pending:
                name = re.sub(r"[^\w .()&+,-]", "_", name).strip(" .")
                if not name.lower().endswith(".nxtheme") or name.lower() in names:
                    raise ValueError("The pack has duplicate or invalid theme filenames.")
                names.add(name.lower())
                path = Path(temporary) / name
                path.write_bytes(data)
                if not switch_themes.file_info(path):
                    raise ValueError("Invalid NXTheme: " + name)
                staged.append(path)
            folder = Path(destination)
            folder.mkdir(parents=True, exist_ok=True)
            # An import never overwrites a theme already on disk.
            targets = [folder / path.name for path in staged]
            if any(path.exists() for path in targets):
                raise ValueError("A theme with that filename already exists. Rename the file before importing.")
            committed = []
            try:
                for path, target in zip(staged, targets):
                    with target.open("xb") as out:
                        out.write(path.read_bytes())
                    committed.append(target)
            except Exception:
                for target in committed:
                    target.unlink(missing_ok=True)
                raise
        return {"success": True, "file": targets[0].name, "count": len(targets)}
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        return {"success": False, "error": str(error)[:200]}
