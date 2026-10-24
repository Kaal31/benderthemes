// Wii U dock (the bottom row of the GamePad menu): own drawings of its buttons, and how they follow a theme file.
//
// The stock 5.5 menu draws the dock as free-standing, coloured, glossy pictograms (Men2.pack OverlayAppBase.szs,
// HBMIconL_000..006: browser globe, eShop bag, Miiverse, notifications bubble, TVii, Friend List smiley, downloads).
// Theme files replace those pictures; many (e.g. "Wii Menu") draw them as round white buttons with a coloured rim.
// Buttons a theme file has no picture for (Library, Settings, which the console never had) are drawn here in the
// same manner: "icons" (coloured pictograms) or "round" (white glossy body, rim and grey pictogram), with the
// rim / body / pictogram colours read from the theme's own button pictures.
import {CSSProperties,ReactNode,useEffect,useId,useState} from "react";

export type DockPlace="library"|"miiverse"|"friends"|"store"|"browser"|"notifications"|"downloads"|"settings";
export type DockLook={look:"icons"|"round";rim?:string;body?:string;ink?:string};

// Pictograms on a 100 x 100 box. sil: the silhouette (base colour, gets the gloss), det: details in the detail
// colour (white on the coloured icons, the button body on round buttons), top: base-colour parts over the details.
const GLYPHS:Record<DockPlace,{sil?:ReactNode;det?:ReactNode;top?:ReactNode;color:string;side:string}>={
 miiverse:{color:"#68d331",side:"#349c14",sil:<><circle cx="50" cy="25" r="13"/><circle cx="24" cy="38" r="10"/><circle cx="76" cy="38" r="10"/><path d="M37 41q13-9 26 0l8 32-12 2v17H44V75L30 72Zm-23 9q10-6 20 0l-1 26-10 2v12H12V74H5Zm52 0q10-6 20 0l9 24h-7v16H77V78l-10-2Z"/></>,det:<><circle cx="50" cy="25" r="7"/><circle cx="24" cy="38" r="5"/><circle cx="76" cy="38" r="5"/></>},
 library:{color:"#6f9fbf",side:"#456f8a",sil:<circle cx="50" cy="50" r="36"/>,det:<><circle cx="50" cy="50" r="14"/><path className="s" d="M50 22a28 28 0 0 1 25 15" strokeWidth="5" strokeLinecap="round" opacity=".75"/></>,top:<circle cx="50" cy="50" r="6"/>},
 friends:{color:"#f6911f",side:"#c25e06",sil:<rect x="14" y="16" width="72" height="68" rx="16"/>,det:<rect x="25" y="27" width="50" height="46" rx="7"/>,top:<><rect x="36" y="37" width="8" height="14" rx="4"/><rect x="56" y="37" width="8" height="14" rx="4"/><path className="s" d="M35 58q15 13 30 0" strokeWidth="7" strokeLinecap="round"/></>},
 store:{color:"#ffbd17",side:"#d38200",sil:<><path d="M20 40h60l-5 42a6 6 0 0 1-6 5H31a6 6 0 0 1-6-5Z"/><path d="M32 42V32a18 18 0 0 1 36 0v10h-8V32a10 10 0 0 0-20 0v10Z"/></>},
 browser:{color:"#2463ea",side:"#0d3299",sil:<circle cx="50" cy="50" r="36"/>,det:<g className="s" strokeWidth="5"><ellipse cx="50" cy="50" rx="15" ry="35"/><path d="M50 15v70M15 50h70M21 32h58M21 68h58"/></g>},
 notifications:{color:"#17bfd4",side:"#0a8696",sil:<path d="M22 16h56a10 10 0 0 1 10 10v38a10 10 0 0 1-10 10H60L50 86 40 74H22a10 10 0 0 1-10-10V26a10 10 0 0 1 10-10Z"/>,det:<rect x="21" y="25" width="58" height="40" rx="4"/>,top:<><rect x="29" y="32" width="42" height="6" rx="3"/><rect x="29" y="42" width="42" height="6" rx="3"/><rect x="29" y="52" width="28" height="6" rx="3"/></>},
 downloads:{color:"#1fa3ef",side:"#0b5fb0",sil:<path d="M22 44h56v34a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8Z"/>,det:<rect x="31" y="56" width="24" height="22" rx="3"/>,top:<path className="o" d="M41 8h18v20h14L50 52 27 28h14Z" strokeWidth="5" strokeLinejoin="round"/>},
 settings:{color:"#97a2a8",side:"#626d73",sil:<g transform="rotate(45 50 50)"><path d="M40 10.7A20 20 0 1 0 60 10.7V24H40Z"/><rect x="42" y="38" width="16" height="54" rx="8"/></g>},
};

/** One dock pictogram (the round body is drawn too and shown only on the round look; CSS picks). */
export function DockGlyph({place}:{place:DockPlace}){
 const id=useId().replace(/[^a-zA-Z0-9_-]/g,""),g=GLYPHS[place];
 return <svg className="nt-dock-glyph" viewBox="0 0 100 100" aria-hidden="true" style={{"--g":g.color,"--gs":g.side} as CSSProperties}>
  <defs>
   <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".62"/><stop offset=".44" stopColor="#fff" stopOpacity=".16"/><stop offset=".5" stopColor="#fff" stopOpacity="0"/></linearGradient>
   <radialGradient id={`${id}f`} cx=".5" cy=".28" r=".8"><stop offset="0" stopColor="#fff"/><stop offset=".55" style={{stopColor:"var(--nt-dock-body,#f2f5f6)"}}/><stop offset="1" style={{stopColor:"var(--nt-dock-shade,#d3dce1)"}}/></radialGradient>
  </defs>
  <g className="nt-dock-face"><circle cx="50" cy="50" r="46" fill={`url(#${id}f)`}/><circle cx="50" cy="50" r="46" fill="none" className="nt-dock-rim"/><ellipse cx="50" cy="29" rx="31" ry="17" fill="#fff" opacity=".6"/></g>
  <g className="nt-dock-pict">
   {g.sil&&<g className="b">{g.sil}</g>}
   {g.sil&&<g className="gl" fill={`url(#${id}l)`}>{g.sil}</g>}
   {g.det&&<g className="d">{g.det}</g>}
   {g.top&&<g className="b">{g.top}</g>}
  </g>
 </svg>;
}

// Reading a theme file's pictures (data: URLs, so the canvas is never tainted). Results are kept per picture.
const memo=new Map<string,Promise<any>>();
const key=(url:string)=>`${url.length}:${url.slice(-64)}`;
function pixels(url:string,size:number):Promise<Uint8ClampedArray|null>{
 return new Promise(res=>{
  if(typeof Image==="undefined"||typeof document==="undefined"){res(null);return;}
  const img=new Image();
  img.onload=()=>{try{const c=document.createElement("canvas");c.width=c.height=size;const x=c.getContext("2d");if(!x){res(null);return;}x.drawImage(img,0,0,size,size);res(x.getImageData(0,0,size,size).data);}catch{res(null);}};
  img.onerror=()=>res(null);img.src=url;
 });
}
const hex=(r:number,g:number,b:number)=>"#"+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,"0")).join("");
const lum=(r:number,g:number,b:number)=>.299*r+.587*g+.114*b;
const avg=(px:number[][])=>px.length?hex(...px.reduce((a,p)=>[a[0]+p[0],a[1]+p[1],a[2]+p[2]],[0,0,0]).map(v=>v/px.length) as [number,number,number]):undefined;

/** Is this dock picture a round button (opaque all round its edge) or a free-standing pictogram; and its colours. */
export function analyseDockArt(url:string):Promise<DockLook|null>{
 const k="d"+key(url);
 if(!memo.has(k))memo.set(k,pixels(url,64).then(d=>{
  if(!d)return null;
  const N=64,c=31.5,at=(x:number,y:number)=>{const i=(y*N+x)*4;return [d[i],d[i+1],d[i+2],d[i+3]];};
  let edge=0,edgeOn=0;
  for(let a=0;a<48;a++){const t=a/48*Math.PI*2,x=Math.round(c+Math.cos(t)*N*.43),y=Math.round(c+Math.sin(t)*N*.43);edge++;if(at(x,y)[3]>150)edgeOn++;}
  const ring:number[][]=[],body:number[][]=[],mid:number[][]=[];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const p=at(x,y);if(p[3]<200)continue;const r=Math.hypot(x-c,y-c)/N;if(r>=.42&&r<=.5)ring.push(p);else if(r>=.3&&r<.38)body.push(p);else if(r<.3)mid.push(p);}
  if(edgeOn/edge<.85)return {look:"icons"} as DockLook;
  // rim: the most saturated third of the edge ring; body: the lighter half of the band inside it; ink: what is clearly darker in the middle
  const sat=(p:number[])=>Math.max(p[0],p[1],p[2])-Math.min(p[0],p[1],p[2]);
  const rim=[...ring].sort((a,b)=>sat(b)-sat(a)).slice(0,Math.max(1,Math.floor(ring.length/3)));
  const light=[...body].sort((a,b)=>lum(b[0],b[1],b[2])-lum(a[0],a[1],a[2])).slice(0,Math.max(1,Math.floor(body.length/2)));
  const bl=light.length?light.reduce((s,p)=>s+lum(p[0],p[1],p[2]),0)/light.length:230;
  const ink=mid.filter(p=>lum(p[0],p[1],p[2])<bl-45);
  return {look:"round",rim:avg(rim),body:avg(light),ink:ink.length>8?avg(ink):undefined} as DockLook;
 }));
 return memo.get(k)!;
}

/** "light" or "dark": the brightness of a theme wallpaper where the menu's words sit (top row, bottom band). */
export function analyseTone(url:string):Promise<"light"|"dark"|null>{
 const k="t"+key(url);
 if(!memo.has(k))memo.set(k,pixels(url,32).then(d=>{
  if(!d)return null;
  let s=0,n=0;
  for(let y=0;y<32;y++){if(y>6&&y<24)continue;for(let x=0;x<32;x++){const i=(y*32+x)*4;s+=lum(d[i],d[i+1],d[i+2]);n++;}}
  return s/n>150?"light":"dark";
 }));
 return memo.get(k)!;
}

export function useAnalysed<T>(url:string|undefined,fn:(u:string)=>Promise<T|null>):T|null{
 const [v,setV]=useState<T|null>(null);
 useEffect(()=>{let live=true;setV(null);if(url)fn(url).then(r=>{if(live)setV(r);}).catch(()=>{});return()=>{live=false;};},[url]);
 return v;
}

// Dock layout and both looks. Real menu, 1280 x 720 box: six buttons ~96 px across (the 154 px pictures drawn at ~100),
// centres every ~166 px from x 228, centre y 662, and the USB / disc indicator at the far left (centre x ~65), where
// the opt-in Library shortcut goes; nothing written under them (the focused name sits below the dock).
export const DOCK_CSS=`
.nt-wiiu .nt-dock{top:calc(var(--wy) + 612px);bottom:auto;height:100px;left:150px;right:150px;justify-content:center;gap:0 64px;border-radius:0}
.nt-wiiu .nt-dock button[data-place=library]{position:absolute;left:-133px;top:6px;width:88px;height:88px}
.nt-wiiu .nt-dock button[data-place=library] :is(.nt-dock-glyph,.nt-original-icon){width:88px;height:88px}
.nt-wiiu .nt-dock button{width:100px;height:100px;border:0;border-radius:50%;background:none;box-shadow:none;transform:none;transition:transform 90ms ease-out,box-shadow 90ms}
.nt-wiiu .nt-dock button>span{position:absolute;width:1px;height:1px;left:0;right:auto;top:0;overflow:hidden;clip-path:inset(50%)}
.nt-wiiu .nt-dock .nt-original-icon{width:100px;height:100px;object-fit:contain;filter:drop-shadow(0 3px 3px #34505e38)}
.nt-wiiu[data-theme-dock=true] .nt-dock .nt-original-icon{width:100px;height:100px}
.nt-dock-glyph{width:100px;height:100px;display:block;overflow:visible}
.nt-dock-glyph .b{fill:var(--g)}.nt-dock-glyph .b .s{fill:none;stroke:var(--g)}
.nt-dock-glyph .d{fill:var(--gd,#fff)}.nt-dock-glyph .d .s,.nt-dock-glyph .d.s,.nt-dock-glyph .d .s *{fill:none;stroke:var(--gd,#fff)}
.nt-dock-glyph .o{fill:var(--g);stroke:var(--gd,#fff);paint-order:stroke}
.nt-dock-glyph .nt-dock-face{display:none}.nt-dock-glyph .nt-dock-rim{stroke:var(--nt-dock-rim,#8fd3ee);stroke-width:2.6}
.nt-dock-glyph .nt-dock-pict{transform-origin:50px 50px}
.nt-wiiu[data-dock-look=icons] .nt-dock-glyph .nt-dock-pict{transform:scale(.92);filter:drop-shadow(0 4.5px 0 var(--gs)) drop-shadow(0 6px 5px #2a404c40)}
.nt-wiiu[data-dock-look=round] .nt-dock-glyph{--g:var(--nt-dock-ink,#8d969b);--gd:var(--nt-dock-body,#f2f5f6);filter:drop-shadow(0 3px 4px #3a586838)}
.nt-wiiu[data-dock-look=round] .nt-dock-glyph .nt-dock-face{display:inline}
.nt-wiiu[data-dock-look=round] .nt-dock-glyph .nt-dock-pict{transform:scale(.5)}
.nt-wiiu[data-dock-look=round] .nt-dock-glyph .gl{display:none}
.nt-wiiu .nt-dock button[data-focus=true]{transform:translateY(-3px) scale(1.08);box-shadow:0 0 0 3px #fff,0 0 0 7px var(--dht-wiiu-accent,#35c3ec),0 0 18px 4px #35c3ec80}
.nt-wiiu .nt-dock button:active{transform:scale(.96)}
.nt-wiiu .nt-selected-name{top:calc(var(--wy) + 716px)}
/* the theme file's swap body (BtnSwap_00, 226 px, the screen corner cut off) where the drawn circle is */
.nt-swap-body{display:none}
.nt-home.nt-wiiu[data-plaza=false][data-theme-swap=true] .nt-screen-swap{background:none;border-color:transparent;box-shadow:none}
.nt-wiiu[data-plaza=false] .nt-swap-body{display:block;position:absolute;left:-6px;top:-6px;width:226px;height:226px;max-width:none;pointer-events:none;z-index:-1}
`;
