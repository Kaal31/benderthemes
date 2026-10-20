"""Read qlaunch library refresh tracks from the measured local bases."""
import json
from pathlib import Path
from read_switch_base_animation import read
out={};provenance={}
for version,profile in [('19.0.1','classic'),('22.5.0','modern')]:
 root=Path('work/switch-base-analysis/firmware-'+version);out[profile]=[];provenance[profile]={}
 for suffix,event in [('RefreshIn','refresh'),('RefreshOut','refreshExit')]:
  path=root/'ResidentMenu/anim'/('RdtBase_'+suffix+'.bflan');data=read(path)
  import hashlib
  provenance[profile][path.name]={'firmware':version,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
  for entry in data['entries']:
   tracks=[track for tag in entry['tags'] for track in tag['tracks'] if (tag['type']=='FLPA' and track['property'] in (0,1,3,4,5,6,7,8,9)) or (tag['type']=='FLVC' and track['property']==16)]
   if tracks:out[profile].append({'source':path.name,'pane':entry['name'],'event':event,'frames':data['frames'],'loop':data['loop'],'tracks':tracks})
Path('src/themes/switchRuntimeDefaults.ts').write_text('import type {SwitchAnimation} from "../switchThemes";\nexport const SWITCH_RUNTIME_MOTION:Record<string,SwitchAnimation[]>='+json.dumps(out,separators=(',',':'))+';\n',encoding='utf-8')
Path('tests/fixtures/switch/runtime-default-provenance.json').write_text(json.dumps(provenance,indent=2)+'\n',encoding='utf-8')
print('Extracted library refresh motion for both supported profiles')
