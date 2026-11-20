"""Build a separate outline fallback font from user-extracted FNTASCII pixels.

This preserves the ROM's glyph silhouettes; the PNG atlas also retains its
original palette and antialiasing for bitmap renderers. No BIOS is bundled.
"""
import argparse,hashlib,json
from pathlib import Path
from PIL import Image
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

def prepare(source,output):
    assets=output/'assets'/'ps2-stock-menu';assets.mkdir(parents=True,exist_ok=True)
    raw=(source/'FNTASCII_EXP').read_bytes()
    if len(raw)!=61440:raise ValueError('Expected 256x480 4-bit FNTASCII')
    indices=[n for b in raw for n in (b&15,b>>4)]
    palette=[(0,0),(0,50),(0,100),(0,150),(0,200),(51,100),(51,150),(51,200),(51,250),(102,150),(102,200),(102,250),(153,200),(153,250),(204,250),(255,250)]
    rgba=bytes(v for n in indices for v in (*([palette[n][0]]*3),palette[n][1]))
    Image.frombytes('RGBA',(256,480),rgba).save(assets/'font-ascii.png')
    glyphs={};metrics={};mapping={};names=['.notdef']+[f'uni{c:04X}' for c in range(32,127)]
    for c,name in [(0,'.notdef')]+[(c,f'uni{c:04X}') for c in range(32,127)]:
        pen=TTGlyphPen(None);points=[]
        if c:
            col=(c-32)%8*32;row=(c-32)//8*40
            for y in range(40):
                x=0
                while x<32:
                    if indices[(row+y)*256+col+x]<12:x+=1;continue
                    start=x
                    while x<32 and indices[(row+y)*256+col+x]>=12:x+=1
                    points.append((start,x,y))
            left=min((a for a,b,y in points),default=0);right=max((b for a,b,y in points),default=11)
            for a,b,y in points:
                x0=(a-left)*25;x1=(b-left)*25;y0=(32-y)*25;y1=y0-25
                pen.moveTo((x0,y0));pen.lineTo((x1,y0));pen.lineTo((x1,y1));pen.lineTo((x0,y1));pen.closePath()
            mapping[c]=name;metrics[name]=((right-left+2)*25,0)
        else:metrics[name]=(600,0)
        glyphs[name]=pen.glyph()
    font=FontBuilder(800,isTTF=True);font.setupGlyphOrder(names);font.setupCharacterMap(mapping);font.setupGlyf(glyphs);font.setupHorizontalMetrics(metrics);font.setupHorizontalHeader(ascent=900,descent=-100);font.setupNameTable({'familyName':'PS2 User Firmware','styleName':'Regular','uniqueFontIdentifier':'PS2UserFirmware','fullName':'PS2 User Firmware','psName':'PS2UserFirmware'});font.setupOS2(sTypoAscender=900,sTypoDescender=-100,usWinAscent=1000,usWinDescent=200);font.setupPost();font.setupMaxp();font.save(assets/'font-ascii.ttf')
    symbols=source/'FNTEXOSD_EXP'
    if symbols.exists():
        raw_symbols=symbols.read_bytes();pixels=bytes(v for b in raw_symbols for n in (b&15,b>>4) for v in (*([palette[n][0]]*3),palette[n][1]))
        Image.frombytes('RGBA',(512,len(raw_symbols)*2//512),pixels).save(assets/'font-symbols.png')
    (output/'ps2-font-provenance.json').write_text(json.dumps({'resource':'FNTASCII','sha256':hashlib.sha256(raw).hexdigest(),'atlas':'original palette','outline':'thresholded row-run silhouettes; not identical to the bitmap antialiasing'},indent=2))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('source',type=Path);ap.add_argument('output',type=Path);a=ap.parse_args();prepare(a.source,a.output)
