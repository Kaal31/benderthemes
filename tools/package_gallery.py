"""Package previews without rebuilding or republishing any theme media packs."""
import hashlib
import json
from pathlib import Path
import zipfile
from compile_bundled_themes import IDS
from package_themes import LABELS
ROOT=Path(__file__).resolve().parents[1]
THEMES=sorted((set(LABELS)-{'extras'})|set(IDS)|{'onyx','silver','switch','n3ds','ps1'})
def package():
 target=ROOT/'out/themes/HubPreviews.zip';target.parent.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as archive:
  for ident in THEMES:
   for ext in ('gif','jpg'):
    source=ROOT/f'out/theme-previews/{ident}.{ext}'
    if not source.is_file():raise FileNotFoundError(f'Missing Hub preview: {source}')
    info=zipfile.ZipInfo(f'{ident}.{ext}',(2020,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
    archive.writestr(info,source.read_bytes())
 raw=target.read_bytes();digest=hashlib.sha256(raw).hexdigest()
 if len(raw)>24*1024*1024:raise ValueError('Gallery exceeds download limit')
 with zipfile.ZipFile(target) as archive:
  if len(archive.infolist())>64 or sum(i.file_size for i in archive.infolist())>32*1024*1024:raise ValueError('Gallery exceeds extraction limits')
 meta={'sha256':digest,'size':len(raw),'url':f'https://github.com/Kaal31/deckthemes-assets/releases/download/gallery-{digest[:16]}/HubPreviews.zip','themes':THEMES}
 for name in ('asset-catalog.json','theme-catalog.json'):
  path=ROOT/name;catalog=json.loads(path.read_text(encoding='utf-8'));catalog['gallery']=meta;path.write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
 print(f'Packaged {len(THEMES)} animated previews and posters ({len(raw)//1024} KB)')
if __name__=='__main__':package()
