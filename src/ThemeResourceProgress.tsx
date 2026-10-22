import {hubStyle,hubThemeName} from "./hubStyles";
import {HubLogo} from "./hubLogo";
import type {ResourceProgress} from "./themeResources";

/** First-open recovery uses the Hub's palette and a readable download card. */
export function ThemeResourceProgress({id,progress,error,retry}:{id:string;progress?:ResourceProgress;error?:string;retry:()=>void}){
 const skin=hubStyle(id);
 return <div data-theme-resource-progress={id} role="status" style={{position:"absolute",inset:0,display:"grid",placeItems:"center",background:skin.bg,color:skin.text,fontFamily:skin.font,padding:32}}>
  <section style={{width:"min(560px,100%)",boxSizing:"border-box",padding:32,background:skin.panel,border:`1px solid ${skin.line}`,borderRadius:skin.radius,boxShadow:skin.shadow}}>
   <HubLogo/><h2 style={{fontSize:28,margin:"24px 0 12px"}}>{error?"Download needs attention":`Preparing ${hubThemeName(id)}`}</h2>
   <p style={{fontSize:18,lineHeight:1.5,color:skin.sub}}>{error??progress?.message??"Downloading theme media…"}</p>
   {!error&&<progress aria-label="Theme download progress" max={100} value={progress?.percent??0} style={{width:"100%",height:14,accentColor:skin.glow}}/>}
   {error&&<button onClick={retry} style={{font:"inherit",fontSize:18,padding:"12px 24px",background:skin.accent,color:skin.accentText,border:0,borderRadius:skin.pill}}>Retry download</button>}
  </section>
 </div>;
}
