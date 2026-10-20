import sys,json
from pathlib import Path
sys.path.insert(0,'tools');sys.path.insert(0,'py_modules');from switch_numeric_layout import numeric_layout
out={}
for version,profile in [('19.0.1','classic'),('22.5.0','modern')]:
 r=Path('work/switch-base-analysis/firmware-'+version);a=json.loads((r/'base-layout-analysis.json').read_text());key,layout,panes=numeric_layout(r,a,'Cursor3',lambda f,n:f+':'+n)
 out[profile]={p['name']:p for p in panes if p['name'] in ('P_Main','P_Grow')}
Path('src/themes/switchCursorDefaults.ts').write_text('import type {SwitchScenePane} from "./switchSceneTypes";\n/** Measured native cursor material and shadow defaults. */\nexport const CURSOR_DEFAULTS:Record<string,Record<string,SwitchScenePane>>='+json.dumps(out,separators=(',',':'))+';\n')
