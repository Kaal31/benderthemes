"""Extract shipped visual styles for native React renderers; never compile legacy UI scripts."""
import json
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
IDS=('blue-glass','gameamp','gamecube','ios6','old-big-picture','santa-express','wiiflow-default')

def generate():
 styles={}
 for ident in IDS:
  folder=ROOT/'themes'/ident
  html=(folder/'index.html').read_text(encoding='utf-8')
  parts=[]
  for link in re.findall(r'<link\b[^>]*>',html,re.I):
   if re.search(r'rel=["\']stylesheet',link,re.I):
    href=re.search(r'href=["\']([^"\']+)',link)[1].split('?')[0]
    parts.append((folder/href).read_text(encoding='utf-8'))
  parts+=re.findall(r'<style[^>]*>(.*?)</style>',html,re.S|re.I)
  styles[ident]='\n'.join(parts)
 (ROOT/'src/engine/bundledStyles.generated.ts').write_text('// Generated visual styles only.\nexport const bundledStyles = '+json.dumps(styles)+';\n',encoding='utf-8')
 snow=(ROOT/'themes/santa-express/vendor/snowflakes.js').read_text(encoding='utf-8')
 (ROOT/'src/themes/santaSnow.generated.ts').write_text('// @ts-nocheck\n'+snow.replace('window.SantaSnowProgram = SnowProgram;','export default SnowProgram;'),encoding='utf-8')
if __name__=='__main__':generate()
