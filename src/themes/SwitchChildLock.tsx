import {useEffect,useRef,useState} from "react";
import type {CSSProperties} from "react";
import type {SwitchAnimation,SwitchEffect} from "../switchThemes";
import {CHILD_LOCK_DEFAULTS} from "./switchChildLockDefaults";
import {animationFrame,sampleTrack} from "./switchConversion";
import {switchPaneOrigin} from "./switchPaneOrigin";
import {effectStyle,panelColor,resolvePalette,SwitchMaterial} from "./SwitchMaterial";

export type ParentalAppearance="hidden"|"on"|"off"|"timer"|"limit";
/** Presentation input only. The host remains responsible for parental-control enforcement. */
export function useParentalAppearance(){
 const [state,setState]=useState<{mode:ParentalAppearance;minutes:number}>({mode:"hidden",minutes:0});
 useEffect(()=>{
  const receive=(event:Event)=>{
   const detail=(event as CustomEvent).detail;
   if(detail&&["hidden","on","off","timer","limit"].includes(detail.mode))setState({mode:detail.mode,minutes:Math.max(0,Math.trunc(Number(detail.minutes)||0))});
  };
  window.addEventListener("dht:switch-parental-state",receive);
  return()=>window.removeEventListener("dht:switch-parental-state",receive);
 },[]);
 return state;
}

type Pane={name:string;parent:string|null;type:string;position:number[];size:number[];alpha:number;visible:boolean;origin:number;effect?:SwitchEffect};
function PaneView({pane,panes,effects,animations,events,dark,animate,mode,minutes,focused,pressed}: {
 pane:Pane;panes:Pane[];effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];events:string[];dark:boolean;animate:boolean;mode:ParentalAppearance;minutes:number;focused:boolean;pressed:boolean;
}){
 const patch=effects["childLock:"+pane.name];
 const effect:SwitchEffect={...pane.effect,...patch};
 const [paletteState,setPaletteState]=useState(effect.paletteState??0);
 const ref=useRef<HTMLDivElement>(null);
 // Separate property sets compose on the same pane: entrance alpha, focus scale,
 // timer visibility and integer USD controller animation do not replace one another.
 const binding=events.join("|");
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const players:Animation[]=[];let frameId=0;let alive=true;
  const selected=events.map(event=>animations.find(a=>a.pane==="childLock:"+pane.name&&a.event===event)).filter((a):a is SwitchAnimation=>!!a);
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  for(const a of selected){
   const visual={...a,tracks:a.tracks.filter(t=>t.property!==18)};
   if(visual.tracks.length){
    const count=Math.min(2048,Math.max(2,Math.ceil(a.frames/2)));
    const keys=Array.from({length:count+1},(_,i)=>({...animationFrame(visual,a.frames*i/count),offset:i/count}));
    const player=el.animate(keys,{duration:a.frames*1000/60,fill:"forwards",iterations:a.loop?Infinity:1});
    if(!animate||reduced){player.pause();player.currentTime=a.frames*1000/60;}
    players.push(player);
   }
  }
  const controller=[...selected].reverse().find(a=>a.tracks.some(t=>t.property===18));
  const track=controller?.tracks.find(t=>t.property===18);
  if(track&&controller){
   const start=performance.now();
   const update=()=>{
    if(!alive)return;
    const elapsed=animate&&!reduced?(performance.now()-start)*60/1000:controller.frames;
    const frame=controller.loop?elapsed%controller.frames:Math.min(elapsed,controller.frames);
    setPaletteState(Math.max(0,Math.min(3,Math.trunc(sampleTrack(track,frame)))));
    if(elapsed<controller.frames||controller.loop)frameId=requestAnimationFrame(update);
   };
   update();
  }else setPaletteState(effect.paletteState??0);
  return()=>{alive=false;cancelAnimationFrame(frameId);players.forEach(p=>p.cancel());};
 },[animations,binding,animate,pane.name,effect.paletteState]);
 const parent=panes.find(p=>p.name===pane.parent);
 const size=patch?.Size? [patch.Size.X??0,patch.Size.Y??0]:pane.size;
 const position=patch?.Position?[patch.Position.X??0,patch.Position.Y??0]:pane.position;
 const origin=switchPaneOrigin(pane.origin);
 const originX=patch?.OriginX??origin.x,originY=patch?.OriginY??origin.y;
 const anchor=(origin:number)=>origin===1?-.5:origin===2?.5:0;
 const px=position[0]+anchor(patch?.ParentOriginX??origin.parentX)*(parent?.size[0]??0);
 const py=position[1]-anchor(patch?.ParentOriginY??origin.parentY)*(parent?.size[1]??0);
 const resolved=resolvePalette(effect,dark,paletteState);
 const style:CSSProperties={position:"absolute",left:`calc(50% + ${px}px)`,top:`calc(50% - ${py}px)`,width:size[0],height:size[1],marginLeft:-(.5+anchor(originX))*size[0],marginTop:-(.5+anchor(originY))*size[1],opacity:pane.alpha/255,visibility:(patch?.Visible??pane.visible)?"inherit":"hidden",pointerEvents:"none",...effectStyle({...resolved,Position:undefined,Size:undefined,Visible:undefined})};
 // Service visibility is distinct from a theme's static backing pane. Splatoon
 // deliberately leaves P_BaseOn outside the entrance group to make a sidebar.
 if(mode==="hidden"&&pane.name!=="P_BaseOn"&&pane.parent==="N_DecideTouch")style.filter="opacity(0)";
 if(pane.name==="N_BtnFocusKey"&&!focused)style.filter="opacity(0)";
 if(pane.name.startsWith("P_EffectDecide")&&!pressed)style.filter="opacity(0)";
 if(pane.name==="N_Tip"&&!focused)style.filter="opacity(0)";
 if(pane.name==="N_ChildLock"&&!animations.some(a=>a.pane==="childLock:"+pane.name))style.opacity=mode==="on"||mode==="off"?1:0;
 if(pane.name==="N_PlayTimer"&&!animations.some(a=>a.pane==="childLock:"+pane.name))style.opacity=mode==="timer"||mode==="limit"?1:0;
 if(pane.name.startsWith("P_EffectDecide")&&pressed)style.visibility="inherit";
 if(pane.name==="UF_Cursor"&&focused)style.border="3px solid #00c3e3";
 const children=panes.filter(p=>p.parent===pane.name);
 let content:React.ReactNode=null;
 if(pane.type==="pic1"){
  if(pane.name==="P_BaseOn"||pane.name.startsWith("P_BaseIco")||pane.name.startsWith("P_Effect")||pane.name.startsWith("P_Btn"))style.background=panelColor(resolved);
  else if(pane.name.includes("Ico"))content=<SwitchMaterial effect={resolved}><svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.5"><circle cx="16" cy="16" r="13"/>{pane.name.includes("PlayTimer")?<path d="M16 7v10l6 3"/>:<><circle cx="16" cy="12" r="4"/><path d="M8 25v-3a8 8 0 0 1 16 0v3"/></>}</svg></SwitchMaterial>;
 }else if(pane.type==="txt1"){
  content=pane.name==="T_Over"?(mode==="limit"?"Time is up":`${Math.floor(minutes/60)}:${String(minutes%60).padStart(2,"0")}`):pane.name==="T_On"?"Parental controls":pane.name==="T_Off"?"Controls off":"Alarm disabled";
  Object.assign(style,{display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:panelColor(resolved),whiteSpace:"nowrap"});
  if(pane.name==="T_On"&&mode==="off")style.visibility="hidden";
  if(pane.name==="T_Off"&&mode==="off")style.visibility="visible";
 }
 return <div ref={ref} data-child-lock-pane={pane.name} data-palette-state={paletteState} style={style}>{content}{children.map(child=><PaneView key={child.name} {...{panes,effects,animations,events,dark,animate,mode,minutes,focused,pressed}} pane={child}/>)}</div>;
}

export function SwitchChildLock({effects,animations,dark,animate,modern,scale,rootY,onActivate,backingBehindGames}: {backingBehindGames:boolean;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];dark:boolean;animate:boolean;modern:boolean;scale:number;rootY:number;onActivate:()=>void}){
 const {mode,minutes}=useParentalAppearance();
 const [focused,setFocused]=useState(false),[pressed,setPressed]=useState(false);
 const root=effects.childLock;
 const panes=(modern?CHILD_LOCK_DEFAULTS.modern:CHILD_LOCK_DEFAULTS.classic) as Pane[];
 const timer=mode==="timer"||mode==="limit";
 const events=["In",focused?"Active":"Inactive",timer?"PlayTimerIn":"PlayTimerOut",mode==="limit"?"ColorOver":mode==="off"?"ColorOff":"ColorOn"];
 const x=root?.Position?.X??0,y=root?.Position?.Y??295;
 return <div className="dht-switch-child-lock" style={{position:"absolute",left:`calc(50% + ${x*scale}px)`,top:`calc(50% - ${(y+rootY)*scale}px)`,width:0,height:0,transform:`scale(${scale*(root?.Scale?.X??1)},${scale*(root?.Scale?.Y??1)})`,display:root?.Visible===false||(mode==="hidden"&&!effects["childLock:P_BaseOn"])?"none":undefined,pointerEvents:"none",zIndex:backingBehindGames?0:undefined}}>
  <PaneView pane={panes[0]} {...{panes,effects,animations,events,dark,animate,mode,minutes,focused,pressed}}/>
  {mode!=="hidden"&&<button aria-label="Parental controls" onClick={onActivate} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onPointerEnter={()=>setFocused(true)} onPointerLeave={()=>{setFocused(false);setPressed(false);}} onPointerDown={()=>setPressed(true)} onPointerUp={()=>setPressed(false)} style={{position:"absolute",left:-131,top:-40,width:262,height:80,background:"transparent",border:0,pointerEvents:"auto"}}/>}
 </div>;
}
