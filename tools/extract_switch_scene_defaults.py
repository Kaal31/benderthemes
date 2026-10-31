"""Extract numeric scene hierarchy/metrics from local analyzed firmware files.
No texture pixels, text strings, font files, firmware binaries or keys are emitted.
"""
import json
import struct
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from switch_effects import convert_effect
from read_switch_base_animation import read as read_animation

FILES=['RdtBtnIconGame','RdtBalloon','Footer','FooterAll','FooterBtn','FooterCtrl','LineFooter','CntrIndicatorS','RdtBtnChangeUser','RdtProgressBarDl','RdtProgressBarErr','RdtProgressBarOffline','RdtProgressBar','RdtIconDl','RdtIconErr','RdtIconPromotion','ProgressBar','ProgressBarFraction','RdtBalloonSystemApplet','RdtBase','DBaseNml','IconError','RdtIconNewFrd','UserIconName','UserIconNameStatus','DCntUserIconNameStatus','DBtmBaseNml','BlurBg','BlurBg2','MaskBlack','SystemAppletFader','BgMask']
SUPPORTED_USD={'C_W','C_B','C_Id','S_RoundRadius','S_BorderSize','S_BorderDrawMode','S_BorderVolume','S_BorderColorSelect0','S_BorderColor0','S_DropShadowDrawMode','S_DropShadowVolume','S_DropShadowColorSelect','S_DropShadowColor','S_DropShadowAngle','S_DropShadowDistance','S_DropShadowSize','S_DropShadowFunction'}
base_root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('work/switch-base-analysis')
out={};motion={};provenance={}
for version,profile in [('19.0.1','classic'),('22.5.0','modern')]:
 root=base_root/('firmware-'+version)
 analysis=json.loads((root/'base-layout-analysis.json').read_text())
 out[profile]={};motion[profile]={};provenance[profile]={}
 for file in FILES:
  source_root,source_analysis,source_version=root,analysis,version
  if not any(k.endswith('/'+file+'.bflyt') for k in analysis):
   # Historical account layouts remain valid imported resources. Retain their
   # measured source version rather than inventing modern pane defaults.
   source_version='19.0.1';source_root=base_root/('firmware-'+source_version)
   source_analysis=json.loads((source_root/'base-layout-analysis.json').read_text())
  from switch_numeric_layout import numeric_layout
  key,layout,panes=numeric_layout(source_root,source_analysis,file,lambda f,n:f+':'+n)
  if file=='RdtBase':panes=[{**pane,'parent':None} for pane in panes if pane['name']=='T_Blank']
  # These dialog panes have real host bindings: fixed header, scrolling content
  # bounds and an indicator driven by that scroll position. The mask is a
  # referenced BgMask layout; the margin helper has no host binding yet.
  if file=='SystemAppletFader':panes=[pane for pane in panes if pane['name'] not in ('W_Mask','L_Bg')]
  if file=='DBaseNml':panes=[pane for pane in panes if pane['name'] not in ('N_IndicatorAreaMargin',)]
  out[profile][file]=panes;provenance[profile][file]={'firmware':source_version,'sha256':layout['sha256'],'path':key}
  motion[profile][file]=[]
  # State animation baselines run before authored replacement tracks.
  events=[] if file not in ('RdtBalloon','RdtBtnIconGame') else [('In','enter'),('Out','exit'),('Loop','rest')] if file=='RdtBalloon' else [('Active','active'),('Inactive','inactive'),('Blank','loading'),('BaseOut','ready'),('FocusKey','focus'),('FocusTouch','touch'),('SuspendIn','running'),('EffectLaunchOut','launch')]
  if file in ('BlurBg2','MaskBlack'):events=[('In','enter'),('Out','exit')]
  if file=='SystemAppletFader':events=[('In','enter'),('Out','exit'),('GameIn','gameEnter'),('GameOut','gameExit')]
  if file=='DBaseNml':events=[('In','enter'),('OutNo','exit')]
  if file=='RdtBalloonSystemApplet':events=[('In','enter'),('Out','exit')]
  if file in ('IconError','RdtIconNewFrd'):events=[('Icon','icon'),('Attention','attention')]
  for suffix,event in events:
   path=source_root/key.replace('/blyt/','/anim/').replace('.bflyt','_'+suffix+'.bflan')
   if not path.exists():continue
   doc=read_animation(path)
   for e in doc['entries']:
    tracks=[]
    for tag in e['tags']:
     for track in tag['tracks']:
      prop=track['property'];kind=tag['type']
      if kind=='FLEU' and track.get('usd')=='S_DropShadowVolume' and prop==0:prop=25
      elif kind=='FLVI' and prop==0:prop=17
      elif not ((kind=='FLPA' and prop in (0,1,3,4,5,6,7,8,9)) or (kind=='FLVC' and prop==16)):continue
      tracks.append({**{k:v for k,v in track.items() if k!='usd'},'property':prop})
    if tracks and any(pane['name']==e['name'] for pane in panes):motion[profile][file].append({'source':path.name,'pane':file+':'+e['name'],'event':event,'frames':doc['frames'],'loop':doc['loop'],'tracks':tracks})
Path('src/themes/switchSceneDefaults.ts').write_text('import type {SwitchScenePane} from "./switchSceneTypes";\nimport type {SwitchAnimation} from "../switchThemes";\nexport const SCENE_DEFAULTS:Record<string,Record<string,SwitchScenePane[]>>='+json.dumps(out,separators=(',',':'))+';\nexport const SCENE_MOTION:Record<string,Record<string,SwitchAnimation[]>>='+json.dumps(motion,separators=(',',':'))+';\n',encoding='utf-8')
Path('tests/fixtures/switch/scene-default-provenance.json').write_text(json.dumps(provenance,indent=2)+'\n',encoding='utf-8')
names={}
for layouts in out.values():
 for file,panes in layouts.items():names.setdefault(file+'.bflyt',set()).update(p['name'] for p in panes)
Path('py_modules/switch_scene_panes.json').write_text(json.dumps({k:sorted(v) for k,v in names.items()},indent=2)+'\n',encoding='utf-8')
print('Extracted',sum(len(v) for v in out.values()),'scene layouts with hierarchy, text metrics and material defaults')
