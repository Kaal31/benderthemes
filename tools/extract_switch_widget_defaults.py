"""Regenerate numeric widget definitions from locally analyzed menu layouts.

No firmware downloads, keys, textures, strings or executable code are copied.
"""
import json
import struct
import sys
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from switch_effects import convert_effect
SUPPORTED_USD={'C_W','C_B','C_Id','S_RoundRadius','S_BorderSize','S_BorderDrawMode','S_BorderVolume','S_BorderColorSelect0','S_BorderColor0','S_DropShadowDrawMode','S_DropShadowVolume','S_DropShadowColorSelect','S_DropShadowColor','S_DropShadowAngle','S_DropShadowDistance','S_DropShadowSize','S_DropShadowFunction'}

FILES=['RdtBtnMyPage','RdtBalloonCtrl','RdtBtnFullLauncher','RdtBtnNtf','RdtBtnShop','RdtBtnPvr','RdtBtnCtrl','RdtBtnSet','RdtBtnPow','RdtBtnLR','RdtBtnSplay','RdtBtnVgc','BtnDialogNml','BtnOpt_Root','DBtmHeaderNml','DBtmHeaderSub','DCntIconLauncherText','DCntText','DCntTextWait','LineHeader_Root','LinePlateDlg','Line_Root','CntrIndicatorS','IconNew','DHdrSoft','DHdrText','DHdrUserIconNameStatus','HeadOptGroup','BtnListNml','BtnLineNml','BtnLinePlateNml','Waiticon','WaiticonS','WaiticonS_Sound','DBtnNml1','DBtnNml2','DBtnNml3','DBtnTop1Btm1','DBtnTop1Btm2','DBtnTop1ExBtm1','DBtnTop1ExBtm2','DBtnVertical3','DBtnUserIconNameStatus','DBtmSelBox2','LineSelBox','BtnLineNmlMini','ScrollIndicatorS','DCntImageText','DCntPictText','DCntTextOption','DCntSelectSaveData','DCntPclOnOff']
from read_switch_base_animation import read as read_animation

out={}; names={}; motion={}
for version,profile in [('19.0.1','classic'),('22.5.0','modern')]:
    root=Path('work/switch-base-analysis/firmware-'+version)
    analysis=json.loads((root/'base-layout-analysis.json').read_text())
    out[profile]={}; motion[profile]={}
    for file in FILES:
        found=next(((k,v) for k,v in analysis.items() if k.endswith('/'+file+'.bflyt')),None)
        if not found:
            continue
        key,layout=found
        from switch_numeric_layout import numeric_layout
        key,layout,definitions=numeric_layout(root,analysis,file,lambda f,n:'widget:'+f+':'+n)
        out[profile][file]=definitions
        motion[profile][file]=[]
        if file.startswith('RdtBtn') and file!='RdtBtnMyPage':
            for event in ['Active','Inactive']:
                anim=root/key.replace('/blyt/','/anim/').replace('.bflyt','_'+event+'.bflan')
                if not anim.exists():continue
                document=read_animation(anim)
                for entry in document['entries']:
                    tracks=[t for tag in entry['tags'] if tag['type']=='FLPA' for t in tag['tracks'] if (entry['name']=='P_PictBase' and t['property'] in (8,9)) or (entry['name']=='N_ScaleDecide' and t['property'] in (6,7))]
                    if tracks:motion[profile][file].append({'source':anim.name,'pane':'widget:'+file+':'+entry['name'],'event':event.lower(),'frames':document['frames'],'loop':document['loop'],'tracks':tracks})
        if file in ('Waiticon','WaiticonS','WaiticonS_Sound'):
            for suffix,event in [('In','enter'),('Out','exit'),('Wait','wait')]:
                anim=root/key.replace('/blyt/','/anim/').replace('.bflyt','_'+suffix+'.bflan')
                if not anim.exists():continue
                document=read_animation(anim)
                for entry in document['entries']:
                    tracks=[]
                    for tag in entry['tags']:
                        for track in tag['tracks']:
                            prop=track['property']
                            if tag['type']=='FLTS' and prop in (0,1,2,3,4):tracks.append({**track,'property':{0:23,1:24,2:22,3:19,4:20}[prop]})
                            elif tag['type']=='FLVC' and prop==16:tracks.append(track)
                    if tracks:motion[profile][file].append({'source':anim.name,'pane':'widget:'+file+':'+entry['name'],'event':event,'frames':document['frames'],'loop':document['loop'],'tracks':tracks})
        names.setdefault(file+'.bflyt',set()).update(p['name'] for p in definitions)
for file in FILES:
    for profile in ['classic','modern']:
        if file not in out[profile]:
            out[profile][file]=out['modern' if profile=='classic' else 'classic'][file]
            motion[profile][file]=motion['modern' if profile=='classic' else 'classic'][file]
Path('src/themes/switchWidgetDefaults.ts').write_text('import type {SwitchScenePane} from "./switchSceneTypes";\n/** Numeric widget bounds and colors; optional local resources supply glyph artwork. */\nexport const WIDGET_DEFAULTS:Record<string,Record<string,SwitchScenePane[]>>='+json.dumps(out,separators=(',',':'))+';\n')
Path('py_modules/switch_widget_panes.json').write_text(json.dumps({k:sorted(v) for k,v in names.items()},indent=2))
# Materials in embedded digit instances belong to the containing layout.
# Include only parts actually mounted by the widget adapter.
part_materials={}
def collect_part_materials(overrides):
    for override in overrides.values():
        if override.get('material'):
            resource,material=override['material'].split(':',1)
            part_materials.setdefault(resource+'.bflyt',set()).add(material)
        collect_part_materials(override.get('partOverrides',{}))
for layouts in out.values():
    for file,definitions in layouts.items():
        for pane in definitions:
            if (file=='RdtBtnMyPage' and pane.get('part')=='GTNumM') or file.startswith('DBtn') or file=='DBtmSelBox2':
                collect_part_materials(pane.get('partOverrides',{}))
Path('py_modules/switch_part_materials.json').write_text(json.dumps({k:sorted(v) for k,v in part_materials.items()},indent=2)+'\n')
Path('src/themes/switchWidgetMotionDefaults.ts').write_text('import type {SwitchAnimation} from \"../switchThemes\";\n/** Measured button state dimensions/scales; no textures or executable code. */\nexport const WIDGET_MOTION_DEFAULTS:Record<string,Record<string,SwitchAnimation[]>>='+json.dumps(motion,separators=(',',':'))+';\n',encoding='utf-8')
print('Generated',len(FILES),'widget layouts for both profiles')
