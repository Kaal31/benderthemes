from pathlib import Path
import struct,base64
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

def convert(filename,family):
 b=Path('work/theseus/Data/Fonts/'+filename).read_bytes();size,_,count,nranges=struct.unpack_from('<4I',b,40);base=40+size;codes=[]
 for i in range(nranges):
  start,n=struct.unpack_from('<2H',b,56+i*4);codes.extend(range(start,start+n))
 lookup={c:i for i,c in enumerate(codes)};chosen=list(range(32,127));order=['.notdef']+['uni%04X'%c for c in chosen];glyf={'.notdef':TTGlyphPen(None).glyph()};metrics={'.notdef':(500,0)}
 for c in chosen:
  name='uni%04X'%c;i=lookup[c];met=struct.unpack_from('<6fI',b,base+i*28);off=met[6];ni,nv=struct.unpack_from('<2H',b,off);ind=struct.unpack_from('<'+'H'*ni,b,off+4);pts=[tuple(round(x*1000) for x in struct.unpack_from('<2f',b,off+4+ni*2+j*8)) for j in range(nv)];edges={}
  for j in range(0,ni,3):
   tri=[pts[ind[j+k]] for k in range(3)]
   for a,z in zip(tri,tri[1:]+tri[:1]):
    if a==z:continue
    if (z,a) in edges:del edges[z,a]
    else:edges[a,z]=True
  pen=TTGlyphPen(None)
  while edges:
   a,z=next(iter(edges));del edges[a,z];start=a;pen.moveTo(a);pen.lineTo(z);cur=z
   while cur!=start:
    nxt=next((v for u,v in edges if u==cur),None)
    if nxt is None:break
    del edges[cur,nxt];pen.lineTo(nxt);cur=nxt
   pen.closePath()
  glyf[name]=pen.glyph();metrics[name]=(round(met[4]*1000),round(met[2]*1000))
 f=FontBuilder(1000,isTTF=True);f.setupGlyphOrder(order);f.setupCharacterMap({c:'uni%04X'%c for c in chosen});f.setupGlyf(glyf);f.setupHorizontalMetrics(metrics);f.setupHorizontalHeader(ascent=850,descent=-200);f.setupNameTable({'familyName':family,'styleName':'Regular','uniqueFontIdentifier':family,'fullName':family,'psName':family.replace(' ','')});f.setupOS2(sTypoAscender=850,sTypoDescender=-200,usWinAscent=1000,usWinDescent=250);f.setupPost();p=Path('work')/(family.replace(' ','')+'.ttf');f.save(p);return base64.b64encode(p.read_bytes()).decode()
css=''
for file,name in [('xbox.xtf','DHT Xbox Original'),('xbox book.xtf','DHT Xbox Book')]:
 data=convert(file,name);css+='@font-face{font-family:"'+name+'";src:url(data:font/ttf;base64,'+data+') format("truetype");font-weight:100 900;font-style:normal;}\n'
Path('src/themes/xboxOriginalFont.ts').write_text('// ASCII glyph outlines from Theseus Data/Fonts. See third-party/Theseus-ASSETS.txt.\nexport const XBOX_ORIGINAL_FONT_CSS = `'+css+'`;\n')
