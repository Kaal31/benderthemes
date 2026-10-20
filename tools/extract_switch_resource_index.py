"""Index target identities in measured bases; do not export firmware resources."""
import json
from pathlib import Path

out={}
for version,profile in [('19.0.1','classic'),('22.5.0','modern')]:
 analysis=json.loads(Path('work/switch-base-analysis/firmware-'+version+'/base-layout-analysis.json').read_text())
 for path,layout in analysis.items():
  file=path.rsplit('/',1)[-1];entry=out.setdefault(file,{'panes':set(),'materials':set(),'profiles':{}})
  entry['panes'].update(p['name'] for p in layout['panes']);entry['materials'].update(m['name'] for m in layout['materials']);entry['profiles'][profile]={'version':version,'sha256':layout['sha256']}
  entry.setdefault('_materialColors',{})[profile]={m['name']:{'white':m['white'],'black':m['black']} for m in layout['materials']}
for entry in out.values():
 entry['panes']=sorted(entry['panes']);entry['materials']=sorted(entry['materials'])
 # Only values identical in every measured profile can prove a redundant
 # assignment without selecting a firmware or implementing an unknown primitive.
 colors=list(entry.pop('_materialColors').values())
 entry['materialDefaults']={name:colors[0][name] for name in entry['materials'] if all(name in profile and profile[name]==colors[0].get(name) for profile in colors)}
Path('py_modules/switch_base_resources.json').write_text(json.dumps(out,separators=(',',':'))+'\n',encoding='utf-8')
print('Indexed',len(out),'base layout resources and target identities')
