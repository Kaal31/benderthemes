"""Download verified theme media into ignored out/ for local previews and SDK tests."""
import hashlib
import json
from pathlib import Path
import urllib.request
import zipfile

ROOT=Path(__file__).resolve().parents[1]


def prepare():
    catalog=json.loads((ROOT/"asset-catalog.json").read_text())
    for pack in catalog["themes"]:
        ident=pack.get("frameTheme")
        if not ident or pack.get("codeOnly"):continue
        filename=pack["url"].rsplit("/",1)[-1]
        expected=f"https://github.com/Kaal31/deckthemes-assets/releases/download/{ident}-v{pack['version']}/{filename}"
        if pack["url"]!=expected or not ident.replace("-","").isalnum():raise ValueError("Invalid frame media source")
        archive=ROOT/"out/themes"/filename
        archive.parent.mkdir(parents=True,exist_ok=True)
        if not archive.is_file() or hashlib.sha256(archive.read_bytes()).hexdigest()!=pack["sha256"]:
            with urllib.request.urlopen(expected,timeout=120) as response:raw=response.read(pack["size"]+1)
            if len(raw)!=pack["size"] or hashlib.sha256(raw).hexdigest()!=pack["sha256"]:raise ValueError("Frame media integrity failure")
            archive.write_bytes(raw)
        prefix=f"assets/frame-themes/{ident}/"
        with zipfile.ZipFile(archive) as z:
            if set(z.namelist())!=set(pack["resources"]):raise ValueError("Unexpected archive contents")
            for entry in z.infolist():
                if not entry.filename.startswith(prefix):raise ValueError("Unexpected resource root")
                relative=entry.filename[len(prefix):]
                target=(ROOT/"out/frame-media"/ident/relative).resolve()
                if not target.is_relative_to((ROOT/"out/frame-media"/ident).resolve()):raise ValueError("Unsafe media path")
                if not target.exists():
                    target.parent.mkdir(parents=True,exist_ok=True)
                    target.write_bytes(z.read(entry))
    print("Verified frame media ready in out/frame-media",flush=True)


if __name__=="__main__":prepare()
