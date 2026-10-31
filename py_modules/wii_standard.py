"""Original standard Wii-menu runtime resources. No console or custom-theme assets.
Names provide the resource interface MYM layouts expect; artwork/geometry is authored here.
"""
import copy
import functools
import math
import os

VERSION = 3


def _pane(name, kind="pan1", parent=-1, x=0, y=0, width=0, height=0, material=None):
    p = dict(name=name,kind=kind,parent=parent,visible=True,inheritAlpha=True,origin=4,alpha=1,position=[x,y,0],rotation=[0,0,0],scale=[1,1],size=[width,height])
    if material is not None:p.update(material=material,colors=[[255]*4 for _ in range(4)],uv=[0,0,1,0,0,1,1,1])
    return p


def _layout(ident, textures, panes, names=None):
    return dict(id=ident,area=ident.split('/')[0],size=[608,456],textures=[n+'.tpl' for n in textures],fonts=[],materials=[dict(name=(names or textures)[i],textures=[i],complex=False,registers=[[0]*4,[255]*4,[0]*4],color=[255]*4) for i in range(len(textures))],panes=panes)


def _round(x,y,w,h,r):
    return math.hypot(max(abs(x-w/2)-w/2+r,0),max(abs(y-h/2)-h/2+r,0))-r


@functools.lru_cache(maxsize=256)
def artwork(name,W):
    """Small neutral substitutes for standard resource roles, not invented theme artwork."""
    n=name.lower();w=h=64
    role='blank'
    if 'clock_a' in n:w,h=32,48;role='digit'
    elif 'clock_b' in n:w,h=40,24;role='period'
    elif 'tvsheet_b' in n:w,h=608,8;role='ramp'
    elif 'tvsheet_e' in n:w,h=256,64;role='ribbonmask'
    elif 'tvsheet_f' in n:w,h=256,64;role='ribbonedge'
    elif 'tvsheet_g' in n:w,h=256,96;role='ribbonshadow'
    elif 'standard_footer' in n:w,h=608,120;role='footer'
    elif 'standard_background' in n or 'grad' in n:w,h=32,128;role='gradient'
    elif 'ipltopmask' in n:w,h=(64 if '4x3' in n else 128),64;role='maskedge' if 'edge' in n or 'egde' in n else 'maskcorner'
    elif 'mask' in n:role='transparent'
    elif 'arw' in n:w,h=32,64;role='arrow'
    elif 'balloon' in n or 'fukidashi' in n:w,h=512,96;role='balloon'
    elif 'sdcard' in n:w,h=48,64;role='sd'
    elif 'topbtn_base_a' in n:w,h=64,128;role='dockcap'
    elif 'topbtn_base_b' in n:w,h=16,128;role='dockmiddle'
    elif n.endswith('/my_topbtn_a0'):w,h=48,32;role='envelope'
    elif 'topbtn' in n or 'combtn' in n:role='button'
    elif 'my_tv_d' in n:w,h=16,16;role='scanlines'
    elif 'my_tv_f' in n:w=h=64;role='focuscorner'
    elif 'standard_focus' in n:w,h=128,96;role='focus'
    elif 'my_tv' in n:w,h=128,96;role='tile'
    elif 'shade' in n:role='transparent'
    rgba=bytearray(w*h*4)
    segments=[(6,3,24,7),(24,6,28,22),(24,25,28,42),(6,41,24,45),(3,25,7,42),(3,6,7,22),(6,22,24,26)]
    masks=['abcdef','bc','abdeg','abcdg','bcfg','acdfg','acdefg','abc','abcdefg','abcdfg']
    for y in range(h):
        for x in range(w):
            c=(255,255,255,0)
            if role=='gradient':
                v=int(233+17*math.sin(y/h*math.pi));c=(v,min(255,v+2),min(255,v+3),255)
            elif role in ('maskcorner','maskedge','focuscorner'):
                # A quarter of a rounded rectangle, repeated with mirrored UVs.
                margin=3.5 if role=='focuscorner' else 5.5*(w/128)
                edge=margin+28*(w/128)*math.exp(-max(0,y-3)/4)
                distance=min(x-edge,y-3)
                alpha=max(0,min(1,.5-distance)) if role=='maskcorner' else max(0,min(1,2-abs(distance)))
                c=(255,255,255,int(alpha*255))
            elif role in ('ribbonmask','ribbonedge','ribbonshadow'):
                t=max(0,min(1,(x-42)/136));curve=5+54*(t*t*(3-2*t))
                alpha=max(0,min(1,curve-y+.5)) if role=='ribbonmask' else max(0,1-abs(y-curve)) if role=='ribbonedge' else .18*math.exp(-max(0,y-curve)/12) if y>curve else 0
                c=(255,255,255,int(alpha*255))
            elif role=='ramp':
                v=int(255-35*y/max(1,h-1));c=(v,v,v,255)
            elif role=='scanlines':c=(255,255,255,255 if y%4==0 else 0)
            elif role in ('dockcap','dockmiddle'):
                d=abs(math.hypot(x-63.5,y-63.5)-60) if role=='dockcap' else min(abs(y-3.5),abs(y-123.5))
                c=(255,255,255,int(max(0,1-d/2)*80))
            elif role=='envelope':
                border=5<x<43 and 6<y<27 and (x<7 or x>41 or y<8 or y>25 or abs(y-(8+abs(x-24)*.65))<1.4)
                if border:c=(255,255,255,255)
            elif role=='footer':
                top=8+35*math.exp(-((x-w/2)/145)**4)
                if y>=top:
                    v=int(225+15*(1-y/h));c=(v,v+2,min(255,v+5),255)
                    if y<top+2:c=(130,205,223,255)
            elif role in ('tile','focus','frame','balloon'):
                d=_round(x+.5,y+.5,w,h,24 if role=='balloon' else 12)
                if d<0:
                    if role=='frame':c=(235,240,244,255 if d>-1.5 else 0)
                    elif role=='focus':c=(45,199,231,255 if d>-3 else 0)
                    else:
                        v=int(239-17*y/h);c=(v,min(255,v+3),min(255,v+5),255)
                        if d>-2:c=(184,200,208,255)
            elif role=='button':
                if math.hypot(x-31.5,y-31.5)<31:
                    v=int(247-34*y/h);c=(v,min(255,v+3),min(255,v+5),255)
                    if math.hypot(x-31.5,y-31.5)>27:c=(152,201,216,255)
                    if n.endswith('/my_topbtn_b') and 15<=x<=49 and 20<=y<=44:
                        if x in (15,16,48,49) or y in (20,21,43,44) or abs(y-(21+abs(x-32)*.6))<1.5:c=(111,137,148,255)
                    if n.endswith('/my_topbtn_a'):
                        pattern=['1010101110111','1010100100010','1010100100010','1010100100010','0111001110111'];gx=(x-13)//3;gy=(y-24)//3
                        if 0<=gx<13 and 0<=gy<5 and pattern[gy][gx]=='1':c=(111,137,148,255)
            elif role=='arrow':
                if 4<x<29 and abs(y-h/2)<(29-x)*.9:c=(108,206,230,255)
            elif role=='sd':
                if 9<x<39 and 4<y<59 and not(x>29 and y<15):c=(130,199,216,255)
                if 15<x<33 and 20<y<44:c=(240,250,252,255)
            elif role=='digit':
                suffix=n.rsplit('clock_a',1)[-1];on=False
                if suffix.isdigit() and int(suffix)<10:
                    on=any(k in masks[int(suffix)] and a<=x<b and c0<=y<d for k,(a,c0,b,d) in zip('abcdefg',segments))
                elif suffix=='b':on=math.hypot(x-16,y-16)<3 or math.hypot(x-16,y-33)<3
                if on:c=(103,119,128,255)
            elif role=='period':
                # Minimal small AM/PM lettering from an original pixel alphabet.
                chars='PM' if n.endswith('1') else 'AM';patterns={'A':['010','101','111','101','101'],'P':['110','101','110','100','100'],'M':['101','111','111','101','101']}
                gx=(x-4)//3;gy=(y-4)//3
                if 0<=gy<5 and 0<=gx<8 and gx%4<3 and patterns[chars[gx//4]][gy][gx%4]=='1':c=(103,119,128,255)
            rgba[(y*w+x)*4:(y*w+x)*4+4]=bytes(c)
    opaque=[i for i in range(w*h) if rgba[i*4+3]>16]
    return dict(url=W._data_url(W.png_encode(w,h,rgba)),width=w,height=h,ink=[min(i%w for i in opaque)/w,min(i//w for i in opaque)/h,(max(i%w for i in opaque)+1)/w,(max(i//w for i in opaque)+1)/h] if opaque else [])


@functools.lru_cache(maxsize=1)
def _template():
    main=[_pane('Root'),_pane('MenuBackground','pic1',0,width=608,height=456,material=0),_pane('Footer','pic1',0,y=-168,width=608,height=120,material=1),_pane('N_Clock1',parent=0,y=-163)]
    for i in range(12):
        j=len(main);main.append(_pane('N_Ch_c'+str(i+1).zfill(2),parent=0,x=(-210+(i%4)*140),y=142-(i//4)*104,width=132,height=96));main.append(_pane('Tile'+str(i),'pic1',j,width=132,height=96,material=2))
    layouts=[_layout('chansel/my_ipltop_a',['standard_background','standard_footer','my_TV_a'],main,['base','board0','tile'])]
    layouts.append(_layout('chansel/my_ipltop_b',['my_TV_a'],[_pane('Root'),_pane('EmptyTile','pic1',0,width=168,height=88,material=0)]))
    layouts.append(_layout('chansel/my_ipltop_d',['standard_focus'],[_pane('Root'),_pane('Focus','pic1',0,width=134,height=98,material=0)]))
    controls=[_pane('Root')]
    for name,group,x,y,w,h,mat in [('B_Set','N_BtnL_a0_Set',-255,-192,49,49,0),('B_Bbs','N_BtnR_a0_Bbs',255,-192,49,49,1),('B_ArwL','N_ArwL',-286,35,23,42,2),('B_ArwR','N_ArwR',286,35,23,42,2)]:
        j=len(controls);controls.append(_pane(group,parent=0,x=x,y=y,width=w,height=h));controls.append(_pane(name,'pic1',j,width=w,height=h,material=mat))
        if name=='B_ArwL':controls[-1]['scale'][0]=-1
    layouts.append(_layout('cmnbtn/my_ipltop_e',['my_TopBtn_a','my_TopBtn_b','my_arw_a'],controls))
    layouts.append(_layout('cmnbtn/mn_sdcard_btn',['mn_Top_SdCard_a'],[_pane('Root'),_pane('Sdcard_00','pic1',0,width=34,height=42,material=0)]))
    textures=['my_Clock_a'+str(i) for i in range(10)]+['my_Clock_aa','my_Clock_ab','my_Clock_b0','my_Clock_b1']
    panes=[_pane('Root')];names=['Clock3','Clock2','ClockTen','Clock1','Clock0','AM_PM_R'];positions=[-34,-17,-2,13,30,54];indices=[10,0,11,0,0,12]
    for i,(name,x,index) in enumerate(zip(names,positions,indices)):panes.append(_pane(name,'pic1',0,x=x,width=4 if name=='ClockTen' else 14 if name!='AM_PM_R' else 20,height=24 if name!='AM_PM_R' else 12,material=i))
    clock=_layout('chansel/my_clock_a',textures,panes)
    clock['materials']=[dict(name=name,textures=[index],complex=False,registers=[[0]*4,[255]*4,[0]*4],color=[255]*4) for name,index in zip(names,indices)]
    layouts.append(clock)
    tooltip=_layout('chansel/my_ipltopballoon_a',['my_Balloon_a'],[_pane('Root'),_pane('Balloon','pic1',0,width=260,height=44,material=0),_pane('T_Balloon','txt1',0,width=240,height=34,material=0)])
    tooltip['fonts']=['ThemeHubSystem.brfnt'];tooltip['panes'][-1]['text']=dict(value='',font=0,alignment=1,metrics=[18,24,0,0]);tooltip['panes'][-1]['colors']=[[88,105,116,255] for _ in range(4)]
    layouts.append(tooltip)
    return dict(layouts=layouts,animations=[],assets={},fonts={},standardBase=dict(version=VERSION,origin='ThemeHub original standard menu'))


def complete(scene,W):
    """Complete only missing standard resources; a theme's supplied resource always wins."""
    base=copy.deepcopy(_template());imported={l['id']:l for l in scene['layouts']};used_layouts=[]
    for layout in base['layouts']:
        if layout['id'] not in imported:imported[layout['id']]=layout;used_layouts.append(layout['id'])
    scene['layouts']=list(imported.values());missing=[];unresolved=[]
    for layout in scene['layouts']:
        for name in layout.get('textures',[]):
            key=layout['area']+'/'+os.path.splitext(os.path.basename(name))[0].lower()
            if key not in scene['assets']:
                if len(missing)>=256:
                    unresolved.append(key);continue
                scene['assets'][key]=copy.deepcopy(artwork(key,W));missing.append(key)
    scene['standardBase']={**base['standardBase'],'layouts':used_layouts,'textures':missing,'unresolvedTextures':unresolved[:80]}
    return scene


def standard_skin():
    import wii_themes as W
    scene=complete(dict(assets={},layouts=[],animations=[],fonts={},background=None),W)
    return dict(kind='mym',name='Standard Wii',id='themehub-standard-wii',wallpaper=None,wallpaperSize=None,wallpaperFit='cover',stockWallpaper=True,cursors={},cursorSize=0,errors=[],warnings=[],scene=scene,defaultBaseApplied=True,baseType='built-in',compatibility=dict(textures=len(scene['assets']),layouts=len(scene['layouts']),animations=0,baseRequired=False,partial=False))
