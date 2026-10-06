"""Create a self-contained Decky installation ZIP after npm run build."""
from pathlib import Path
import json, zipfile, py_compile
root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
py_compile.compile(str(root/'main.py'),doraise=True)
assert (root/'dist/index.js').is_file(), 'Run npm run build first'
out=root/'out'; out.mkdir(exist_ok=True)
target=out/f'DeckHomeThemes-v{version}.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for name in ['main.py','plugin.json','package.json','README.md','dist/index.js']:
        z.write(root/name,'DeckHomeThemes/'+name)
    for folder,destination in [('bundle','defaults'),('third-party','third-party')]:
        for p in sorted((root/folder).rglob('*')):
            if p.is_file() and '__pycache__' not in p.parts:
                z.write(p,'DeckHomeThemes/'+destination+'/'+p.relative_to(root/folder).as_posix())
with zipfile.ZipFile(target) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(set(z.namelist()))
    assert 'DeckHomeThemes/LICENSE' not in z.namelist()
print(target)
print(f'{target.stat().st_size/1048576:.1f} MB; archive verified')
