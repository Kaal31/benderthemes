"""Extract optional UI artwork from user-supplied local Wii U Menu files."""
from pathlib import Path
import sys,json
sys.path.insert(0,'py_modules');import wiiu_themes as w
base=Path('C:/Users/levmi/Desktop/deckygamescreenplugin/publish/benderthemes/work/wiiu-inspection')
packs={n:w.sarc((base/(n+'.pack')).read_bytes()) for n in ['Men','Men2']}
out=Path('work/wiiu-native-ui');out.mkdir(exist_ok=True)
for slot,(pack,arc,tex) in w.SLOTS.items():
 try:
  b=w.layout_textures(packs[pack],arc).get(tex)
  if b:
   r=w.bflim_rgba(b)
   if r:(out/(slot+'.png')).write_bytes(w.png(*r));print(slot,r[:2])
 except Exception as e:print('ERROR',slot,str(e)[:100])
for slot,(arc,tex,maxw) in w.BACKGROUNDS.items():
 try:
  r=w.background_picture(packs['Men2'],arc,tex)
  if r:
   print('BG',slot,type(r),str(r)[:40]);(out/(slot+'.png')).write_bytes(w.png(*w._shrink(*r,maxw)))
 except Exception as e:print('ERROR',slot,str(e)[:80])
