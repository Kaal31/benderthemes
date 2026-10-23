"""WiiThemer package composition and browser scene extraction (read only)."""
import io,os,re,zipfile,json
import wii_layout as L
MAX_SCENE_BYTES=20*1024*1024
AREAS=('chansel','cmnbtn','board','board2','cursor')

class Overlay:
    def __init__(self,sources,errors):self.sources=sources;self.err=errors
    def archive_files(self,ash):
        files={}
        for src in self.sources:files.update({k.lower():v for k,v in (src.archive_files(ash) or {}).items()})
        return files
    def pictures(self,stem,area):
        for src in reversed(self.sources):
            pics=src.pictures(stem,area)
            if pics:return pics
        return []
    def entries(self,area):
        files=self.archive_files(area+'.ash')
        for src in self.sources:
            z=getattr(src,'z',None)
            if z:
                for target,source in z.targets.items():
                    if area+'_ash_out/' not in target:continue
                    if source not in z.names:
                        self.err.append('Missing patch resource: '+source);continue
                    try:files[target.split(area+'_ash_out/',1)[1]]=z.read(z.names[source])
                    except Exception as e:self.err.append(str(e))
        return files

def scene(src,res,W):
    assets={};layouts=[];animations=[];warnings=[];budget=0;data_budget=0
    for area in AREAS:
        files=src.entries(area)
        for name,data in files.items():
            lower=name.lower();stem=os.path.splitext(os.path.basename(lower))[0]
            try:
                if lower.endswith(('.tpl','.png','.jpg','.jpeg')):
                    if area not in ('chansel','cmnbtn'):continue
                    ext=lower.rsplit('.',1)[-1];override=src.pictures(stem,area)
                    if override:ext,data=override[0]
                    if ext=='tpl':png,w,h,_=W.tpl_to_png(data);url=W._data_url(png)
                    else:
                        tmp={};W._wallpaper(tmp,ext,data);url=tmp.get('wallpaper');w,h=tmp.get('wallpaperSize',[0,0])
                    if url and budget+len(url)<MAX_SCENE_BYTES:
                        key=area+'/'+stem;assets[key]={"url":url,"width":w,"height":h};budget+=len(url)
                    elif url:warnings.append('Scene texture budget exceeded')
                elif lower.endswith('.brlyt') and area in ('chansel','cmnbtn'):
                    item=L.layout(data);item.update(id=area+'/'+stem,area=area);data_budget+=len(json.dumps(item))
                    if len(layouts)>=64 or data_budget>4*1024*1024:raise ValueError('layout data budget exceeded')
                    layouts.append(item);warnings.extend(item.pop('warnings'))
                elif lower.endswith('.brlan') and area in ('chansel','cmnbtn'):
                    item=L.animation(data);item.update(id=area+'/'+stem);data_budget+=len(json.dumps(item))
                    if len(animations)>=128 or data_budget>4*1024*1024:raise ValueError('animation data budget exceeded')
                    animations.append(item);warnings.extend(item.pop('warnings'))
            except Exception as e:warnings.append(name+': '+str(e))
    res['scene']={"assets":assets,"layouts":layouts,"animations":animations};res['warnings']=list(dict.fromkeys(warnings))[:80]
    res['compatibility']={"textures":len(assets),"layouts":len(layouts),"animations":len(animations),"baseRequired":res['kind']=='mym' and not res.get('baseApplied'),"partial":True}
    if res['kind']=='mym' and not res.get('baseApplied'):res['warnings'].append('Patch resources are overlaid in stage order; unchanged resources require your own matching System Menu base or a completed CSM.')
    if not assets and not res.get('wallpaper') and not res.get('cursors'):res['warnings'].append('No renderable artwork was found in this package.')
    res['warnings'].append('GPU TEV effects, text/window panes and console-specific actions use the built-in Wii fallback.')
    res['errors']=list(dict.fromkeys(res['errors']))[:80]

def read_package(path,member='',base_path=''):
    import wii_themes as W
    if not os.path.isfile(path) or os.path.getsize(path)>W.MAX_FILE:return None
    sources=[];opened=[];errors=[];variants=[];stage_names=[];kind=W._kind(path)
    if kind=='mym' and not W.peek(path):return None
    def mym(data,name):
        z=W._Zip(io.BytesIO(data));opened.append(z);sources.append(W._MymSource(z,errors));stage_names.append(name)
    def csm(data):sources.append(W._CsmSource(W._archive(data),errors))
    try:
        if base_path and kind=='mym':
            if not os.path.isfile(base_path) or os.path.getsize(base_path)>W.MAX_FILE or W._kind(base_path)!='csm':raise ValueError('Select a readable user-owned CSM or System Menu APP base')
            with open(base_path,'rb') as f:csm(f.read(W.MAX_FILE+1))
        if kind=='mym':
            outer=W._Zip(path);opened.append(outer)
            if 'mym.ini' in outer.names:
                if member:raise ValueError('This MYM is not a container package')
                sources.append(W._MymSource(outer,errors));stage_names.append(os.path.basename(path))
            else:
                complete=sorted(k for k in outer.names if k.endswith(('.csm','.app')))
                patches=sorted((k for k in outer.names if k.endswith('.mym')),key=lambda k:(int(re.search(r'stage[ _-]*(\d+)',k,re.I).group(1)) if re.search(r'stage[ _-]*(\d+)',k,re.I) else 0,k))
                variants=complete or patches
                if member:
                    key=W._norm(member)
                    if key not in variants:raise ValueError('Unknown package member')
                    data=outer.read(outer.names[key]);csm(data) if key in complete else mym(data,key);kind='csm' if key in complete else 'mym'
                elif len(complete)==1:csm(outer.read(outer.names[complete[0]]));kind='csm';stage_names=complete
                elif len(complete)>1:raise ValueError('Multiple completed menus: choose a package variant')
                elif patches:
                    if len(patches)>8:raise ValueError('Too many MYM stages')
                    # Only auto-compose explicitly numbered stages of one theme; unrelated themes require selection.
                    addons=[k for k in patches if os.path.basename(k).lower() in ('spin.mym','fastspin.mym','nospin.mym')]
                    patches=[k for k in patches if k not in addons]+addons
                    themes=[k for k in patches if k not in addons]
                    stems={re.sub(r'stage[ _-]*\d+','',os.path.basename(k),flags=re.I) for k in themes}
                    if len(themes)>1 and (len(stems)!=1 or not all(re.search('stage',k,re.I) for k in themes)):raise ValueError('Multiple themes: choose a package variant')
                    for key in patches:mym(outer.read(outer.names[key]),key)
                else:
                    sources.append(W._MymSource(outer,errors))
        elif kind=='csm':
            with open(path,'rb') as f:csm(f.read(W.MAX_FILE+1))
        else:return None
        res={"kind":kind,"name":W._clean_name(path),"id":"","wallpaper":None,"wallpaperSize":None,"wallpaperFit":"cover","stockWallpaper":False,"cursors":{},"cursorSize":0,"errors":errors,"variants":variants,"selectedMember":member,"stages":stage_names,"baseApplied":bool(base_path)}
        for z in opened:
            if 'id.txt' in z.names:
                text=z.read(z.names['id.txt'])[:64].decode('latin-1').strip()
                if text.isprintable():res['id']=text
        overlay=Overlay(sources,errors);W._fill(res,overlay,errors);scene(overlay,res,W);return res
    except Exception as e:
        if variants or base_path:return {"kind":"mym","name":W._clean_name(path),"id":"","wallpaper":None,"wallpaperSize":None,"wallpaperFit":"cover","stockWallpaper":False,"cursors":{},"cursorSize":0,"errors":[str(e)],"warnings":[str(e)],"variants":variants,"selectedMember":member}
        return None
    finally:
        for z in opened:z.close()
