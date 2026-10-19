from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import base64,json
source=Path(r'C:/Users/levmi/AppData/Local/Temp/codex-clipboard-32a9e042-c4d0-4ab2-bd40-d3cb7239c0d0.png')
im=Image.open(source).convert('RGBA');print(im.size)
out=Path('assets/silver-reference');out.mkdir(parents=True,exist_ok=True)
assets={}
def save(name,img):
 img.save(out/(name+'.png'));assets[name]='data:image/png;base64,'+base64.b64encode((out/(name+'.png')).read_bytes()).decode()
def clean_cap(img):
 # The source shell's dark seam crosses the cropped cap. Replace only those
 # stray dark pixels with nearby original brushed-metal pixels.
 original=img.copy()
 for y in range(24):
  for x in range(img.width):
   r,g,b,a=original.getpixel((x,y))
   if (r+g+b)/3<150:
    img.putpixel((x,y),original.getpixel((x,y+28)))
 return img

def crop(name,box):
 fragment=im.crop(box)
 if name in {"search","wifi","home","library","store","friends","gear"}:
  # Keep original dark glyph pixels; remove the silver rectangle surrounding them.
  alpha=fragment.convert('L').point(lambda luminance:max(0,min(255,(165-luminance)*5)))
  fragment.putalpha(alpha)
 elif name=="deck":
  mask=Image.new('L',(fragment.width*4,fragment.height*4),0)
  ImageDraw.Draw(mask).rounded_rectangle((4,4,fragment.width*4-5,fragment.height*4-5),radius=13*4,fill=255)
  fragment.putalpha(mask.resize(fragment.size,Image.Resampling.LANCZOS))
 elif name=="steam":
  alpha=Image.new('L',fragment.size,0);ImageDraw.Draw(alpha).ellipse((1,1,fragment.width-2,fragment.height-2),fill=255);fragment.putalpha(alpha)
 save(name,fragment)
# The device surface itself, including the printed controls. Only alpha is edited.
wheel=im.crop((588,392,998,802));mask=Image.new('L',wheel.size);ImageDraw.Draw(mask).ellipse((0,0,409,409),fill=255);wheel.putalpha(mask);save('wheel',wheel)
crop('metal',(360,8,900,27))
crop('previewAvatar',(1460,13,1523,75))
crop('panelMetal',(106,690,138,745))
# Preserve the entire original left housing and its raised button faces.
left=clean_cap(im.crop((0,104,186,894)))
# Remove the rectangular exterior; retain the original curved housing pixels.
left_mask=Image.new('L',(left.width*4,left.height*4),0)
ImageDraw.Draw(left_mask).rounded_rectangle((4,4,left.width*4-5,left.height*4-5),radius=76*4,fill=255)
left.putalpha(left_mask.resize(left.size,Image.Resampling.LANCZOS));save('leftPanel',left)
# Preserve actual sculpted window edges; erase content to transparent slots.
for name,box,slot in [('journey',(975,444,1405,667),(30,23,410,210)),('feature',(965,668,1405,861),(4,50,417,190)),('now',(186,444,613,669),(19,22,407,201)),('recent',(186,668,650,866),(18,21,448,190))]:
 panel=im.crop(box)
 # Retain only the two-pixel reference rim. All surrounding backing/padding is alpha zero.
 m=Image.new('L',panel.size,0);d=ImageDraw.Draw(m)
 if name=="feature":
  d.line([(52,1),(panel.width-24,1),(panel.width-2,22),(panel.width-2,panel.height-24),(panel.width-24,panel.height-2),(24,panel.height-2),(2,panel.height-24),(2,76),(52,1)],fill=255,width=2)
 else:d.rounded_rectangle((1,1,panel.width-2,panel.height-2),radius=24,outline=255,width=2)
 panel.putalpha(m);save(name+'Frame',panel)

# Smooth feature rim made only from the original window's clean silver edge.
# Reuse its horizontal rim pixels rather than sampling through the game artwork.
feature=Image.new('RGBA',(355,159))
edge=im.crop((1080,668,1350,672)).resize((355,4),Image.Resampling.LANCZOS)
feature=edge.resize((355,159),Image.Resampling.LANCZOS)
scale=4
outer=Image.new('L',(355*scale,159*scale),0)
d=ImageDraw.Draw(outer)
points=[(54,1),(331,1),(346,5),(354,24),(354,135),(348,151),(331,158),(24,158),(7,152),(1,135),(1,76),(4,64),(14,48),(44,10),(54,1)]
d.line([(x*scale,y*scale) for x,y in points],fill=255,width=6,joint='curve')
feature.putalpha(outer.resize(feature.size,Image.Resampling.LANCZOS));save('featureContour',feature)

# Raw blank textured button face, reusable at the reference aspect ratio.
crop('button',(1450,414,1530,424))
for name,box in {'steam':(71,21,115,66),'search':(1124,28,1155,59),'wifi':(1177,29,1209,54),'home':(43,220,70,248),'library':(38,320,73,350),'store':(40,426,70,458),'friends':(38,533,73,564),'gear':(38,642,74,678),'deck':(1440,217,1550,265)}.items():crop(name,box)
# Actual raised button cutouts. Transparency removes only the exterior corners.
for name,box in {"playButton":(326,590,487,648),"moreButton":(492,590,554,648),"capsuleButton":(1420,407,1570,477)}.items():
 fragment=im.crop(box)
 if name=="capsuleButton":
  # Keep the reference perimeter; replace its baked Sleep label with blank texture
  # sampled from the same face, so the application's label remains live.
  face=im.crop((1450,414,1530,424)).resize((126,44))
  fragment.alpha_composite(face,(12,13))
 alpha=Image.new('L',fragment.size,0);ImageDraw.Draw(alpha).rounded_rectangle((1,1,fragment.width-2,fragment.height-2),radius=fragment.height//2,fill=255)
 fragment.putalpha(alpha);save(name,fragment)
# Thin original recessed outlines on the right, without rectangular backing.
for name,box,radius in [('rightDeviceFrame',(1420,193,1570,391),48),('rightTipFrame',(1420,648,1570,861),40)]:
 frame=im.crop(box);mask=Image.new('L',(frame.width*4,frame.height*4),0)
 ImageDraw.Draw(mask).rounded_rectangle((4,4,frame.width*4-5,frame.height*4-5),radius=radius*4,outline=255,width=6)
 frame.putalpha(mask.resize(frame.size,Image.Resampling.LANCZOS));save(name,frame)
# Outer silhouette of the right vertical housing, retaining original contour pixels.
right_box=(1403,102,1586,894)
right=clean_cap(im.crop(right_box))
# A continuous original metal surface, rather than a transparent central hole.
# This clean band between the reference's Home and Library buttons contains no UI.
strip=im.crop((22,280,172,300)).resize((right.width,24),Image.Resampling.LANCZOS)
face=Image.new('RGBA',right.size)
for y in range(0,right.height,24):
 tile=strip if (y//24)%2==0 else strip.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
 face.paste(tile,(0,y))
# Keep the source cap and side/bottom highlights; feather only the internal join.
rim_mask=Image.new('L',right.size,255)
ImageDraw.Draw(rim_mask).rounded_rectangle((12,76,right.width-12,right.height-20),radius=48,fill=0)
rim_mask=rim_mask.filter(ImageFilter.GaussianBlur(3))
face=Image.composite(right,face,rim_mask)
alpha=Image.new('L',(right.width*4,right.height*4),0)
ImageDraw.Draw(alpha).rounded_rectangle((4,4,right.width*4-5,right.height*4-5),radius=76*4,fill=255)
face.putalpha(alpha.resize(right.size,Image.Resampling.LANCZOS));save('rightHousing',face)
# Outer shell strips are taken from the reference, with the interior opened for live UI.
frame=im.copy();mask=Image.new('L',im.size,0);d=ImageDraw.Draw(mask)
d.line([(0,145),(16,119),(60,104),(200,94),(400,74),(650,48),(800,44),(1000,58),(1200,80),(1450,100),(1540,112),(1585,140)],fill=255,width=16)
d.line([(0,838),(18,872),(70,895),(250,912),(600,921),(1000,922),(1350,907),(1510,891),(1568,870),(1585,843)],fill=255,width=18)
d.line([(3,145),(3,838)],fill=255,width=12);d.line([(1582,140),(1582,843)],fill=255,width=12)
frame.putalpha(mask);save('frame',frame)

Path('src/themes/silverReference.ts').write_text('// Pixel fragments extracted from the user-supplied reference. Regenerate with tools/extract_silver_reference.py.\nexport const SILVER_REFERENCE='+json.dumps(assets)+' as const;\n',encoding='utf-8')
