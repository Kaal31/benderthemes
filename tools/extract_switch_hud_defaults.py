"""Extract HUD hierarchy, parts, alpha flags and material identities locally."""
import json
from pathlib import Path
from switch_numeric_layout import numeric_layout
from switch_effects import slot

out={};provenance={}
for version,profile in [('19.0.1','classic'),('22.5.0','modern')]:
 root=Path('work/switch-base-analysis/firmware-'+version);analysis=json.loads((root/'base-layout-analysis.json').read_text())
 out[profile]={};provenance[profile]={}
 for file in ['Hud','HudTime','HudSignal','BatteryConsole','HudBatteryNum','GTNumL','GTNumM']:
  key,layout,panes=numeric_layout(root,analysis,file,lambda f,n:slot(f+'.bflyt',n))
  out[profile][file]=panes;provenance[profile][file]={'firmware':version,'sha256':layout['sha256'],'path':key}
Path('src/themes/switchHudDefaults.ts').write_text('import type {SwitchScenePane} from "./switchSceneTypes";\n/** Numeric HUD layout metadata; no picture/font resources. */\nexport const HUD_DEFAULTS:Record<string,Record<string,SwitchScenePane[]>>='+json.dumps(out,separators=(',',':'))+';\n',encoding='utf-8')
Path('tests/fixtures/switch/hud-default-provenance.json').write_text(json.dumps(provenance,indent=2)+'\n',encoding='utf-8')
print('Extracted native HUD metadata for',len(out),'profiles')
