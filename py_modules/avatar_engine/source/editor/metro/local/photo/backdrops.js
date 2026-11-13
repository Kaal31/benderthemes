// Photo backdrops. Studio and the solid colours are the site's photo backdrops (RENDER-PIPELINE.md §9); "console" is
// the Metro stage backdrop (metro.css #backdrop: olive/green/grey gradient, corner vignette, halftone dots fading out
// by mid-height) painted at the photo's size, reading the same --metro-* tokens.
export const BACKDROPS=[
  {id:'transparent',label:'Transparent (cut-out)'},
  {id:'studio',label:'Studio'},
  {id:'console',label:'Console green'},
  {id:'green',label:'Green screen'},
  {id:'white',label:'White'},
  {id:'black',label:'Black'},
];
const STUDIO=[[0,'#C1C1C1'],[0.22,'#D5D5D5'],[0.5,'#F6F6F6'],[0.57,'#FFFFFF'],[0.85,'#DFDFDF'],[1,'#DADADA']];
const SOLID={green:'#00FF00',white:'#FFFFFF',black:'#000000'};

function token(name,fallback){
  const v=getComputedStyle(document.documentElement).getPropertyValue(name).trim();return v||fallback;
}

function paintConsole(g,w,h){
  const lin=g.createLinearGradient(0,0,0,h);
  lin.addColorStop(0,token('--metro-bg-top','#506201'));lin.addColorStop(0.40,token('--metro-bg-mid','#62b02c'));
  lin.addColorStop(0.62,token('--metro-bg-low','#8ab07a'));lin.addColorStop(0.86,token('--metro-bg-bottom','#b4b8ae'));lin.addColorStop(1,token('--metro-bg-bottom','#b4b8ae'));
  g.fillStyle=lin;g.fillRect(0,0,w,h);
  // radial-gradient(ellipse 70% 75% at 50% 75%, transparent 62%, corner): an ellipse with radii 70%w x 75%h.
  g.save();g.translate(w*0.5,h*0.75);g.scale(0.70*w,0.75*h);
  const rad=g.createRadialGradient(0,0,0,0,0,1);rad.addColorStop(0,'rgba(0,0,0,0)');rad.addColorStop(0.62,'rgba(0,0,0,0)');rad.addColorStop(1,token('--metro-bg-corner','rgba(60,70,10,.45)'));
  g.fillStyle=rad;g.fillRect(-2,-2,4,4);g.restore();
  // Halftone: dots on a square grid (pitch 1.35vh, radius .42vh at 1080 lines), masked 1 -> .6 (30%) -> 0 (58%).
  const pitch=Math.max(3,h*0.0135),r=Math.max(0.6,h*0.0042);
  const dots=document.createElement('canvas');dots.width=w;dots.height=Math.ceil(h*0.58)+1;
  const d=dots.getContext('2d');d.fillStyle=token('--metro-halftone','rgba(20,60,0,.22)');
  for(let y=pitch/2;y<dots.height;y+=pitch)for(let x=pitch/2;x<w+pitch;x+=pitch){d.beginPath();d.arc(x,y,r,0,Math.PI*2);d.fill();}
  const mask=d.createLinearGradient(0,0,0,h);mask.addColorStop(0,'#000');mask.addColorStop(0.30,'rgba(0,0,0,.6)');mask.addColorStop(0.58,'rgba(0,0,0,0)');
  d.globalCompositeOperation='destination-in';d.fillStyle=mask;d.fillRect(0,0,w,dots.height);
  g.drawImage(dots,0,0);
}

export function paintBackdrop(g,w,h,id){
  if(id==='transparent'||!id){g.clearRect(0,0,w,h);return;}
  if(id==='studio'){const lin=g.createLinearGradient(0,0,0,h);for(const [o,c] of STUDIO)lin.addColorStop(o,c);g.fillStyle=lin;g.fillRect(0,0,w,h);return;}
  if(id==='console'){paintConsole(g,w,h);return;}
  g.fillStyle=SOLID[id]||'#DBDBDB';g.fillRect(0,0,w,h);
}
