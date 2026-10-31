"""Fetch the published, checksum-verified cinematic clips for browser validation."""
import hashlib
import json
from pathlib import Path
import urllib.request
import zipfile
ROOT = Path(__file__).resolve().parents[1]
def prepare():
    for pack in json.loads((ROOT/'asset-catalog.json').read_text(encoding='utf-8'))['themes']:
        files = pack.get('backgroundVideos')
        if not files: continue
        filename = pack['url'].rsplit('/',1)[-1]
        if pack['url'] != f"https://github.com/Kaal31/deckthemes-assets/releases/download/{pack['id']}-v{pack['version']}/{filename}": raise ValueError('Unexpected background media URL')
        archive = ROOT/'out/themes'/filename
        archive.parent.mkdir(parents=True, exist_ok=True)
        if not archive.is_file() or hashlib.sha256(archive.read_bytes()).hexdigest() != pack['sha256']:
            with urllib.request.urlopen(pack['url'], timeout=120) as response: raw = response.read(pack['size']+1)
            if len(raw) != pack['size'] or hashlib.sha256(raw).hexdigest() != pack['sha256']: raise ValueError('Background media checksum mismatch')
            archive.write_bytes(raw)
        with zipfile.ZipFile(archive) as source:
            for name in files:
                relative = Path(name)
                if relative.is_absolute() or '..' in relative.parts or '\\' in name or relative.suffix != '.webm': raise ValueError('Unexpected background path')
                output = ROOT/'out/compatible-backgrounds'/relative
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_bytes(source.read(name))
    print('Verified published WebM background clips ready')
if __name__ == '__main__': prepare()
