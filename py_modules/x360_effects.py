"""Recognize the released Aurora periodic wallpaper effect, not arbitrary HLSL execution."""
import math
import re

def wallpaper_effect(source):
    if len(source)>128*1024:return None
    text=source.decode('utf-8-sig',errors='replace') if isinstance(source,bytes) else source
    if not all(token in text for token in ('g_fColorFactor','g_fTimeScale','g_nEffectValue','0.008','250.0','cos(t - i.x)')):return None
    def scalar(name,default,low,high):
        match=re.search(r'\b'+name+r'\s*=\s*([-+\d.eE]+)f?\s*;',text)
        value=float(match[1]) if match else default
        return max(low,min(high,value)) if math.isfinite(value) else default
    match=re.search(r'g_fColorFactor\s*=\s*float4\s*\(([^)]*)\)',text)
    color=[.117647059,.901960784,.352941176,1.]
    if match:
        try:
            values=[float(v.strip().rstrip('fF')) for v in match[1].split(',')]
            if len(values)==4 and all(math.isfinite(v) and 0<=v<=4 for v in values):color=values
        except ValueError:pass
    return {'kind':'aurora-periodic','color':color,'timeScale':scalar('g_fTimeScale',1.75,0,8),'brightness':scalar('g_fBrightness',1.8,.1,4),'iterations':int(scalar('g_nEffectValue',3,0,5))+2}


def runtime_warnings(features):
    warnings=[]
    if features['scripts']:
        warnings.append('Imported Lua scripts require unimplemented dashboard APIs: '+', '.join(features['scripts']))
    if features['plugins']:
        warnings.append('Xbox-native binaries cannot run in the browser: '+', '.join(features['plugins']))
    unsupported=[item['path'] for item in features['shaders'] if item['status']=='unsupported']
    approximated=[item['path'] for item in features['shaders'] if item['status']=='material-approximation']
    if unsupported:warnings.append('Unsupported shader effects: '+', '.join(unsupported))
    if approximated:warnings.append('Cover material uses the renderer approximation: '+', '.join(approximated))
    return warnings
