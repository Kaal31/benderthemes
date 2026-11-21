"""Prepare a separate PS2 texture pack from user-supplied expanded TEXIMAGE resources.

Resource layout reference: https://github.com/aap/osdbits (format notes only).
Run its extract-res.py --raw against a BIOS first; this tool ships no BIOS data.
"""
import argparse,hashlib,json,zipfile
from pathlib import Path
from PIL import Image

SPECS={'TEXCNAVI':('orb-core',64,64),'TEXCBLUR':('orb-halo',64,64),'TEXCFLOW':('cloud-flow',64,64),'TEXCREFA':('clock-reflection',64,64),'TEXCMARU':('clock-disc',128,128),'TEXCBUMP':('clock-bump',64,64)}

def prepare(source, output):
    assets=output/'assets'/'ps2-stock-menu';assets.mkdir(parents=True,exist_ok=True)
    provenance=[]
    for resource,(name,w,h) in SPECS.items():
        path=source/(resource+'_EXP')
        if not path.exists():continue
        raw=path.read_bytes()
        if len(raw)!=w*h:raise ValueError('Unexpected resource dimensions: '+resource)
        # OSDSYS format 3 is white RGB with a GS 0..128 alpha channel.
        alpha=Image.frombytes('L',(w,h),bytes(min(255,v*2) for v in raw))
        image=Image.new('RGBA',(w,h),'white');image.putalpha(alpha);image.save(assets/(name+'.png'))
        provenance.append({'file':name+'.png','resource':resource,'sourceSha256':hashlib.sha256(raw).hexdigest()})
    raw=(source/'TEXCKABE_EXP').read_bytes()
    if len(raw)!=64*64*3:raise ValueError('Invalid TEXCKABE')
    Image.frombytes('RGB',(64,64),raw).save(assets/'menu-clouds.png')
    provenance.append({'file':'menu-clouds.png','resource':'TEXCKABE','sourceSha256':hashlib.sha256(raw).hexdigest()})
    import struct
    for resource,name,w,h in [('TEXOREF','cube-reflection',128,128),('TEXOFOG0','startup-fog',128,128),('TEXOWAL0','startup-wall',256,256)]:
        raw=(source/(resource+'_EXP')).read_bytes()
        if len(raw)!=w*h*2+24:raise ValueError('Unexpected PSMCT16 resource size')
        rgba=bytearray()
        for v, in struct.iter_unpack('<H',raw[20:20+w*h*2]):
            rgba.extend(((v&31)*255//31,((v>>5)&31)*255//31,((v>>10)&31)*255//31,255 if v&32768 else 0))
        Image.frombytes('RGBA',(w,h),bytes(rgba)).save(assets/(name+'.png'))
        provenance.append({'file':name+'.png','resource':resource,'format':'PSMCT16','sourceSha256':hashlib.sha256(raw).hexdigest()})
    raw=(source/'TEXBBTTN_EXP').read_bytes();pixels=bytes(v for i in range(20,20+64*64*4,4) for v in (*raw[i:i+3],min(255,raw[i+3]*2)))
    Image.frombytes('RGBA',(64,64),pixels).save(assets/'button-symbols.png')
    provenance.append({'file':'button-symbols.png','resource':'TEXBBTTN','format':'header type 4 / RGBA32'})
    # TEXOSCE uses interleaved luminance and GS alpha, not an RGB bitmap.
    raw=(source/'TEXOSCE_EXP').read_bytes()
    if len(raw)!=256*64*2:raise ValueError('Invalid TEXOSCE')
    pixels=bytes(v for i in range(0,len(raw),2) for v in (raw[i],raw[i],raw[i],min(255,raw[i+1]*2)))
    logo=Image.frombytes('RGBA',(256,64),pixels);logo.save(assets/'startup-logo.png')
    strips=[logo.crop((0,y,256,y+30)) for y in (1,33)]
    strips=[im.crop(im.getbbox()) for im in strips]
    wordmark=Image.new('RGBA',(sum(im.width for im in strips)+4,max(im.height for im in strips)),(0,0,0,0));x=0
    for im in strips:wordmark.paste(im,(x,0));x+=im.width+4
    wordmark.save(assets/'startup-wordmark.png')
    provenance.append({'file':'startup-wordmark.png','resource':'TEXOSCE','transform':'cropped alpha strips assembled horizontally'})
    provenance.append({'file':'startup-logo.png','resource':'TEXOSCE','format':'luminance+GS-alpha','sourceSha256':hashlib.sha256(raw).hexdigest()})
    for resource,name in [('TEXOCRLE','startup-light'),('TEXOCRBL','startup-bloom')]:
        raw=(source/(resource+'_EXP')).read_bytes()
        if len(raw)!=64*64*4:raise ValueError('Invalid opening light texture')
        pixels=bytes(v for i in range(0,len(raw),4) for v in (*raw[i:i+3],min(255,raw[i+3]*2)))
        Image.frombytes('RGBA',(64,64),pixels).save(assets/(name+'.png'))
        provenance.append({'file':name+'.png','resource':resource,'format':'RGBA+GS-alpha','sourceSha256':hashlib.sha256(raw).hexdigest()})
    archive=output/'ps2-stock-menu-v1.zip'
    with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
        for path in sorted(p for p in assets.iterdir() if p.suffix in ('.png','.webp','.ttf','.mp4')):z.write(path,path.relative_to(output).as_posix())
    files=[p for p in assets.iterdir() if p.suffix in ('.png','.webp','.ttf','.mp4')]
    manifest={'id':'ps2-stock-menu','name':'PS2 stock menu textures','file':archive.name,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'bytes':archive.stat().st_size,'files':len(files),'unpackedBytes':sum(p.stat().st_size for p in files),'url':None}
    (output/'ps2-stock-menu-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    (output/'ps2-stock-menu-provenance.json').write_text(json.dumps(provenance,indent=2),encoding='utf-8')
    print(json.dumps(manifest))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('expanded',type=Path);ap.add_argument('output',type=Path);a=ap.parse_args();prepare(a.expanded,a.output)
