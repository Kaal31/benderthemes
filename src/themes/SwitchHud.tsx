import {useEffect,useState,CSSProperties} from "react";
import type {SwitchEffect,SwitchAnimation} from "../switchThemes";
import {SwitchMaterial,effectStyle,nxColor} from "./SwitchMaterial";
import {animationFrame} from "./switchConversion";
export function SwitchNumber({level,effects,animation,scale}:{level:number;effects:Record<string,SwitchEffect>;animation?:SwitchAnimation;scale:number}){
 const text=String(Math.round(Math.max(0,Math.min(1,level))*100));
 const frame=animation?animationFrame(animation,Math.min(animation.frames,text.length)):{};
 return <span className="dht-switch-battery-number" style={{display:"inline-flex",alignItems:"baseline",...(frame as CSSProperties),width:animation?.tracks.some(t=>t.property===8)?parseFloat(String(frame.width))*scale:undefined}}>
 {text.split("").map((digit,i)=><span key={i} className="dht-switch-battery-digit" style={{...effectStyle(effects[`batteryDigit:L_GTNum_${String(i).padStart(2,"0")}`])}}><SwitchMaterial effect={effects["batteryDigit:P_GTNum_00"]}><SwitchMaterial effect={effects["number:GTNumM.bflyt"]??effects["number:GTNumL.bflyt"]}>{digit}</SwitchMaterial></SwitchMaterial></span>)}
 <span className="dht-switch-percent" style={{fontSize:15*scale,...effectStyle(effects.batteryPercent)}}><SwitchMaterial effect={effects.batteryPercent}>%</SwitchMaterial></span>
 </span>;
}
export function SwitchClock({now,effects,scale,hour12=false}:{now:Date;effects:Record<string,SwitchEffect>;scale:number;hour12?:boolean}){
 const separator=new Intl.DateTimeFormat(undefined,{hour:"numeric",minute:"2-digit",hour12}).formatToParts(now).find(p=>p.type==="literal")?.value.trim()||":";
 const separatorEffect=effects[separator===","?"clock:P_Comma":separator==="."?"clock:P_Dot":"clock:P_Colon"];
 const h=hour12?(now.getHours()%12||12):now.getHours();
 return <span className="dht-switch-clock-value" style={{display:"inline-flex",alignItems:"baseline"}}>{h}<span style={effectStyle(separatorEffect)}>{separator}</span>{String(now.getMinutes()).padStart(2,"0")}{hour12&&<span style={{fontSize:15*scale,marginLeft:5*scale}}><span style={effectStyle(effects[now.getHours()<12?"clock:P_A":"clock:P_P"])}>{now.getHours()<12?"A":"P"}</span><span style={effectStyle(effects["clock:P_M"])}>M</span></span>}</span>;
}
type Network="wifi"|"wired"|"airplane"|"local";
export function SwitchNetwork({effects,size,color}:{effects:Record<string,SwitchEffect>;size:number;color:string}){
 const read=():Network=>!navigator.onLine?"airplane":(navigator as Navigator&{connection?:{type?:string}}).connection?.type==="ethernet"?"wired":"wifi";
 const [mode,setMode]=useState<Network>(read);
 useEffect(()=>{const update=()=>setMode(read());window.addEventListener("online",update);window.addEventListener("offline",update);return()=>{window.removeEventListener("online",update);window.removeEventListener("offline",update);};},[]);
 const name=mode==="wifi"?"wifi":`network:${mode}`;const c=nxColor(effects[name]?.white??effects[name]?.corners?.ColorTL,color);
 return <span className="dht-switch-network" data-mode={mode} style={effectStyle(effects[name])}><svg width={size} height={size*.76} viewBox="0 0 34 26" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round">
 {mode==="wifi"?<><path d="M3 9.5a20 20 0 0 1 28 0M8 14.8a12.5 12.5 0 0 1 18 0M13 19.8a5.5 5.5 0 0 1 8 0"/><circle cx="17" cy="24" r="1"/></>:mode==="airplane"?<path d="M17 2v21M3 13l14-5 14 5M12 23l5-3 5 3"/>:mode==="wired"?<><rect x="9" y="2" width="16" height="14"/><path d="M17 16v8M7 24h20"/></>:<><rect x="2" y="6" width="12" height="14"/><rect x="20" y="6" width="12" height="14"/><path d="M14 13h6"/></>}
 </svg></span>;
}
