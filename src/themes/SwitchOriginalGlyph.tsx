import type {ReactNode} from 'react';

/** Original geometric substitutes. These paths are authored here, not traced
 * from firmware images; each picture keeps its native pane and material. */
function art(name:string,body:ReactNode,width=48,height=48,label?:string){return <svg data-switch-original-glyph={name} aria-label={label} role={label?'img':undefined} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}>{body}</svg>;}
export function originalAppletGlyph(id:string,name:string):ReactNode{
 const key=id+':'+name;
 if(id==='controller'){
  if(name==='P_Form')return art(key,<g transform="rotate(45 24 24)"><rect x="14" y="3" width="20" height="42" rx="9"/></g>);
  if(name==='P_Stick')return art(key,<circle cx="5" cy="5" r="3.4"/>,10,10);
  if(/^P_[ABXY]$/.test(name))return art(key,<circle cx="3" cy="3" r="2.5" fill="white" stroke="none"/>,6,6);
 }
 if(id==='settings')return art(key,<><g>{Array.from({length:8},(_,i)=><path key={i} transform={`rotate(${i*45} 24 24)`} d="M21 10V5h6v5"/>)}</g><circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="6"/></>);
 if(id==='power')return art(key,<><path d="M24 5v19"/><path d="M14 11a17 17 0 1 0 20 0"/></>);
 if(id==='news')return name==='P_PictNtf_01'?art(key,<path d="M1 3h14"/>,16,6):art(key,<><path d="M5 7h38v28H27l-9 8v-8H5z"/><path d="M12 15h24M12 22h24"/></>);
 if(id==='shop')return art(key,<><path d="M7 17h34l2 28H5z"/><path d="M16 19V12a8 8 0 0 1 16 0v7"/></>,48,48);
 if(id==='album'){
  // The Album picture's pane includes transparent right/bottom padding.
  // Its parent offsets compensate that padding; filling the entire pane
  // makes the icon oversized and shifts it away from the button center.
  if(name==='P_Pict_00')return art(key,<rect x="1.5" y="1.5" width="47" height="31" rx="2"/>,62,54);
  if(name==='P_Pict_01')return art(key,<path d="M3 30l12-12 8 7 8-11 12 16"/>,50,35);
  if(name==='P_Color')return art(key,<><path d="M3 30l12-12 8 7 8-11 12 16z" fill="white" stroke="none"/><circle cx="12" cy="12" r="3" fill="white" stroke="none"/></>,50,35);
 }
 if(id==='online')return art(key,name==='P_LR_01'?<><circle cx="13" cy="18" r="2" fill="white"/><circle cx="35" cy="31" r="2" fill="white"/></>:<><rect x="4" y="5" width="17" height="38" rx="7"/><rect x="27" y="5" width="17" height="38" rx="7"/></>);
 if(id==='gameShare')return name==='P_Pict_00'?art(key,<><path d="M2 9v21h36V9M8 10v14h24V10"/></>,40,32):art(key,<path d="M3 2q13 6 26 0"/>,32,8);
 if(id==='virtualCards')return name==='P_Pict_00'?art(key,<><rect x="2" y="2" width="28" height="36" rx="1"/><rect x="7" y="7" width="18" height="19" rx="1"/><path d="M10 30h12l-6 5z" fill="white" stroke="none"/></>,32,40):art(key,<path d="M2 2h28"/>,32,4);
 return null;
}

const digits=[
 'M10 3C2 3 3 12 3 16s-1 13 7 13 7-9 7-13 1-13-7-13z',
 'M5 8l6-5v26M5 29h12',
 'M3 8c1-7 14-7 14 1 0 5-4 7-7 10l-7 10h14',
 'M3 5c5-4 14-2 14 4 0 5-4 7-8 7 5 0 9 1 9 7 0 7-11 9-16 4',
 'M14 29V3L2 21h17',
 'M17 3H4l-1 12c5-3 14-2 14 6 0 8-9 11-15 6',
 'M16 4C7-2 2 9 2 18c0 14 16 15 16 3 0-9-12-11-16-2',
 'M2 3h16L7 29',
 'M10 16C0 14 0 3 10 3s10 11 0 13c-11 2-11 13 0 13s11-11 0-13z',
 'M4 28c9 6 14-5 14-14C18 0 2-1 2 11c0 9 12 11 16 2',
];
export function originalHudGlyph(file:string,name:string,digit=''):ReactNode{
 const key=file+':'+name;
 if(file==='BatteryConsole'){
  // The battery is three composited parts, not two differently scaled icons.
  if(name==='P_BatBase')return art(key,<rect width="30" height="16" fill="white" stroke="none"/>,30,16);
  if(name==='P_Ico00')return art(key,<><rect x="1" y="1" width="30" height="18" strokeWidth="2"/><path d="M33 6h3v8h-3z" fill="white" stroke="none"/></>,36,20);
  if(name==='P_Charge')return art(key,<path d="M12 2L6 12h5l-1 8 6-11h-5z" fill="white" stroke="none"/>,22,22);
 }
 if(file==='GTNumL'||file==='GTNumM')return /^\d$/.test(digit)?art(key,<path d={digits[Number(digit)]}/>,20,32,digit):null;
 if(name==='P_Per')return art(key,<><circle cx="6" cy="8" r="4"/><circle cx="18" cy="24" r="4"/><path d="M3 29L21 3"/></>,24,32);
 if(file==='HudTime'){
  const letters:Record<string,string>={P_A:'M2 26L9 2l7 24M5 17h8',P_P:'M3 26V3h7c9 0 9 12 0 12H3',P_M:'M2 26V3l7 13 7-13v23'};
  if(letters[name])return art(key,<path d={letters[name]}/>,18,28);
  return art(key,name==='P_Colon'?<><circle cx="4" cy="9" r="1.8" fill="white" stroke="none"/><circle cx="4" cy="23" r="1.8" fill="white" stroke="none"/></>:name==='P_Comma'?<path d="M5 24l-2 5"/>:<circle cx="4" cy="27" r="1.8" fill="white" stroke="none"/>,8,32);
 }
 return null;
}
