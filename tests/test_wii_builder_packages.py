"""Regression coverage for bounded WiiThemer import and ordered packages."""
import runpy,sys,os,io,zipfile,tempfile,struct
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import wii_themes as W
import wii_layout as L
fixtures=runpy.run_path(str(Path(__file__).with_name('test_wii_themes.py')))
make_zip=fixtures['make_zip'];u8_enc=fixtures['u8_enc'];picture_tpl=fixtures['picture_tpl']

def packed(files):
    out=io.BytesIO()
    with zipfile.ZipFile(out,'w') as z:
        for name,data in files.items():z.writestr(name,data)
    return out.getvalue()

def section(tag,body):return tag+struct.pack('>I',8+len(body))+body

def document(magic,parts):
    body=b''.join(parts);return magic+b'\xfe\xff'+struct.pack('>HIHH',8,len(body)+16,16,len(parts))+body

with tempfile.TemporaryDirectory() as t:
    # Last stage wins for the same target. Missing sources are visible diagnostics.
    a=picture_tpl(30,30,5)[0];b=picture_tpl(35,35,5)[0]
    def stage(data):return packed({'mym.ini':'[simg1]\nfile=\\layout\\common\\board_ash_out\\arc\\timg\\my_BackPic_a.tpl\nsource=\\wall.tpl\n','wall.tpl':data})
    path=os.path.join(t,'stages.zip');make_zip(path,{'theme_stage1.mym':stage(a),'theme_stage2.mym':stage(b)})
    result=W.read_wii_theme(path);assert result['wallpaperSize']==[35,35];assert len(result['stages'])==2
    assert W.peek(path)=='mym'
    csm=u8_enc({'layout':{'common':{'board.ash':u8_enc({'arc':{'timg':{'my_BackPic_a.tpl':a}}})}}})
    complete=os.path.join(t,'complete.zip');make_zip(complete,{'download/theme.csm':csm,'theme.mym':stage(b)})
    result=W.read_wii_theme(complete);assert result['kind']=='csm' and result['wallpaperSize']==[30,30]
    base=os.path.join(t,'base.app');Path(base).write_bytes(csm)
    inherited=os.path.join(t,'inherit.mym');make_zip(inherited,{'mym.ini':'[cont1]\nfile=layout/common/chansel.ash\ntype=ASH|U8'})
    assert not W.read_wii_theme(inherited)['wallpaper']
    result=W.read_wii_theme(inherited,base_path=base);assert result['wallpaperSize']==[30,30];assert result['baseApplied'];assert not result['compatibility']['baseRequired']
    assert W.read_wii_theme(inherited,base_path=os.path.join(t,'absent.app'))['errors']
    multiple=os.path.join(t,'menus.zip');make_zip(multiple,{'one.csm':csm,'two.csm':csm})
    result=W.read_wii_theme(multiple);assert len(result['variants'])==2 and result['errors']
    assert W.read_wii_theme(multiple,'two.csm')['wallpaper']
    assert W.read_wii_theme(multiple,'../two.csm')['errors']
    separate=os.path.join(t,'unrelated.zip');make_zip(separate,{'one.mym':stage(a),'two.mym':stage(b)})
    assert W.read_wii_theme(separate)['errors'];assert W.read_wii_theme(separate,'one.mym')['wallpaperSize']==[30,30]
    missing=os.path.join(t,'missing.mym');make_zip(missing,{'mym.ini':'[simg1]\nfile=layout/common/chansel_ash_out/arc/timg/foo.tpl\nsource=missing.png'})
    assert any('Missing patch resource' in e for e in W.read_wii_theme(missing)['errors'])
    # Panes preserve parent hierarchy and all transform axes.
    pane=bytes([3,4,255,0])+b'Root'+bytes(20)+struct.pack('>10f',1,2,3,4,5,6,1,1,170,96)
    doc=document(b'RLYT',[section(b'pan1',pane),section(b'pas1',b''),section(b'pic1',pane),section(b'pae1',b'')])
    layout=L.layout(doc);assert layout['panes'][1]['parent']==0;assert layout['panes'][0]['rotation']==[4,5,6]
    # A real-shaped RLAN pane track: key offsets are relative to their own records.
    keys=struct.pack('>3f',0,0,0)+struct.pack('>3f',60,360,0)
    track=struct.pack('>BBBBHHI',0,5,2,0,2,0,12)+keys
    tag=b'RLPA'+bytes([1,0,0,0])+struct.pack('>I',12)+track
    animator=b'Root'+bytes(16)+bytes([1,0,0,0])+struct.pack('>I',28)+tag
    pai=struct.pack('>HBBHHI',60,1,0,0,1,20)+struct.pack('>I',24)+animator
    clip=L.animation(document(b'RLAN',[section(b'pai1',pai)]));assert clip['loop'];assert clip['tracks'][0]['target']==5;assert clip['tracks'][0]['keys'][1][1]==360
    for bad in [b'RLYT',doc[:-1],doc[:12]+b'\xff\xff\xff\xff'+doc[16:]]:
        try:L.layout(bad)
        except (ValueError,struct.error):pass
        else:raise AssertionError('Malformed layout accepted')
print('PASS: source ZIPs, explicit variants, complete CSM preference, staged overrides, diagnostics and layout bounds')
