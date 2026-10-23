import {SwitchPicture} from './SwitchPicture';
import {useContext,useEffect,useMemo,useState} from 'react';
import type {CSSProperties,ReactNode} from 'react';
import type {SwitchEffect,SwitchAnimation} from '../switchThemes';
import {HUD_DEFAULTS} from './switchHudDefaults';
import {SwitchMaterial} from './SwitchMaterial';
import {paneMotionFrame} from './switchConversion';
import {SwitchSceneTree} from './SwitchSceneTree';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {mergeSceneEffect} from './switchSceneLayout';

export function SwitchHudTree({effects,animations,modern,dark,enabled,open,now,level,charging,hour12,scale,instanceSize}:{effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;open:boolean;now:Date;level:number;charging:boolean;hour12:boolean;scale:number;instanceSize?:number[]}){
 const native=useContext(SwitchNativeContext),[offline,setOffline]=useState(!navigator.onLine),[percentage,setPercentage]=useState(true);
 useEffect(()=>{const update=()=>setOffline(!navigator.onLine);window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update);};},[]);
 const layouts=HUD_DEFAULTS[modern?'modern':'classic'];
 const patches=useMemo(()=>{
  const out:Record<string,SwitchEffect>={};for(const [file,list] of Object.entries(layouts))for(const node of list){
   const base=native?.nativePanes?undefined:effects[node.slot],patch=native?.nativePanes?.[file]?.[node.name];
   if(base||patch)out[node.slot]=mergeSceneEffect(base,patch);
  }
  if(instanceSize){const slot=layouts.Hud[0].slot;out[slot]={...out[slot],Position:{X:0,Y:0},Scale:{X:1,Y:1},Rotation:{Z:0},Size:{X:instanceSize[0],Y:instanceSize[1]}};}
  return out;
 },[native,effects,layouts,instanceSize]);
 const materials=useMemo(()=>Object.fromEntries(Object.entries(native?.nativeMaterials??{}).flatMap(([file,list])=>Object.entries(list).map(([name,effect])=>[file+':'+name,effect]))),[native]);
 const motion=useMemo(()=>{
  const compatible=animations.map(a=>a.pane==='batteryNumber'?{...a,pane:layouts.Hud.find(p=>p.name==='N_BatteryNum')!.slot}:a);
  if(!native?.nativeAnimations)return compatible;
  return Object.entries(native.nativeAnimations).flatMap(([file,list])=>list.flatMap(a=>{const node=layouts[file]?.find(p=>p.name===a.pane);return node?[{...a,pane:node.slot}]:[];}));
 },[animations,native,layouts]);
 const fileForSlot=new Map(Object.entries(layouts).flatMap(([file,list])=>list.map(node=>[node.slot,file] as const)));
 const values={now,level,charging,hour12,offline,percentage};
 const serviceFrames:Record<string,number>={battery:String(Math.round(level*100)).length,clockFormat:hour12?1:0,clockDigits:(hour12?(now.getHours()%12||12):now.getHours())>=10?1:0,networkState:offline?1:0,batteryState:charging?1:level<0?2:0};
 const percent=String(Math.round(Math.max(0,Math.min(1,level))*100)),h=String(hour12?(now.getHours()%12||12):now.getHours()).padStart(2,' '),clock=h+String(now.getMinutes()).padStart(2,'0');
 return <div className="dht-switch-hud-tree" style={{position:'absolute',left:0,top:0,width:0,height:0,transform:`scale(${scale})`,color:'#fff',pointerEvents:'none'}}><SwitchSceneTree list={layouts.Hud} parts={layouts} effects={patches} animations={motion} materials={materials} {...{dark,enabled}} events={[open?'exit':'enter']} render={(node,effect,path)=>{
  const file=fileForSlot.get(node.slot)!,patch=patches[node.slot],style:CSSProperties={};let content:ReactNode=null;
  for(const [event,frame] of Object.entries(serviceFrames)){
   const selected=motion.filter(a=>a.pane===node.slot&&a.event===event);
   if(selected.length)Object.assign(style,paneMotionFrame(selected,frame,{Position:{X:node.position[0],Y:node.position[1]},Scale:{X:node.scale[0],Y:node.scale[1]},Rotation:{X:node.rotation[0],Y:node.rotation[1],Z:node.rotation[2]},...effect},1,1,true));
  }
  const instance=[...path].reverse().find(p=>/^L_(?:GTNum|Num)_\d{2}$/.test(p.name)),index=instance?Number(instance.name.slice(-2)):0;
  const clockPart=path.some(p=>p.part==='HudTime'),digit=(clockPart?clock:percent.padStart(3,' '))[index]??' ';
  const numberMatch=node.name.match(/^L_(?:GTNum|Num)_(\d{2})$/);
  let digitClass=false;
  if(numberMatch){if(digit===' ')style.visibility='hidden';else if(patch?.Visible!==false)style.visibility='inherit';digitClass=file==='HudBatteryNum'&&digit!==' ';}
  if(file==='Hud'&&node.name==='N_BatteryNum'&&!percentage)style.visibility='hidden';
  if(file==='Hud'&&node.name==='L_Time'){style.left=`calc(50% + ${effect.Position?.X??node.position[0]}px + var(--dht-reference-clock-x, 0px))`;style.top=`calc(50% - ${effect.Position?.Y??node.position[1]}px + var(--dht-reference-clock-y, 0px))`;}
  if(file==='HudTime'){
   if(node.name==='N_AMPM'&&!motion.some(a=>a.pane===node.slot&&a.event==='clockFormat'))style.visibility=hour12?'inherit':'hidden';
   if(node.name==='P_A')style.visibility=now.getHours()<12?'inherit':'hidden';
   if(node.name==='P_P')style.visibility=now.getHours()>=12?'inherit':'hidden';
  }
  if(file==='HudSignal'){
   if(node.name==='P_Plane')style.visibility=offline?'inherit':'hidden';
   if(node.name==='N_Signal')style.visibility=offline?'hidden':'inherit';
  }
  if(file==='BatteryConsole'){
   if(node.name==='P_Charge')style.visibility=charging?'inherit':'hidden';
   if(node.name==='P_Error')style.visibility=level<0?'inherit':'hidden';
   if(node.name==='N_GaugeNml')style.visibility=charging||level<0?'hidden':'inherit';
  }
 const svg=(body:ReactNode)=><svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">{body}</svg>;
 if(node.type==='pic1'){
  if(file==='GTNumL'||file==='GTNumM')content=<span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%',fontFamily:'"Arial Narrow",sans-serif',fontWeight:600,fontSize:effect.Size?.Y??node.size[1],lineHeight:1,color:'white'}}>{digit}</span>;
  else if(node.name==='P_Per')content=<span style={{fontSize:effect.Size?.Y??node.size[1],color:'white'}}>%</span>;
  else if(file==='HudTime')content=<span style={{fontSize:effect.Size?.Y??node.size[1],color:'white'}}>{({P_Colon:':',P_Dot:'.',P_Comma:',',P_A:'A',P_M:'M',P_P:'P'} as Record<string,string>)[node.name]}</span>;
  else if(node.name==='P_Wifi')content=svg(<><path d="M3 10a20 20 0 0 1 26 0M8 16a12 12 0 0 1 16 0M13 22a5 5 0 0 1 6 0"/><circle cx="16" cy="28" r="1"/></>);
  else if(node.name==='P_Plane')content=svg(<path d="M16 2v28M2 16l14-6 14 6M10 29l6-4 6 4"/>);
  else if(node.name==='P_Local')content=svg(<><rect x="1" y="5" width="11" height="22"/><rect x="20" y="5" width="11" height="22"/><path d="M12 16h8"/></>);
  else if(node.name==='P_WireLine')content=svg(<><rect x="7" y="3" width="18" height="15"/><path d="M16 18v10M4 28h24"/></>);
  else if(node.name==='P_BatBase'||node.name==='P_Ico00')content=svg(<><rect x="1.5" y="8" width="26" height="16" rx="1"/><path d="M29 13v6"/></>);
  else if(node.name.startsWith('P_Gauge'))content=<div style={{width:`${Math.max(0,Math.min(1,values.level))*100}%`,height:'100%',background:values.level<.2?'#ff3428':'#95e700'}}/>;
  else if(node.name==='P_Charge')content=svg(<path d="M19 1L7 18h9l-4 13 13-19h-9z" fill="white"/>);
  else if(node.name==='P_Error')content=<span style={{fontSize:18,color:'white'}}>!</span>;
  const picture=native?.nativePictures?.[file]?.[node.name];
  if(picture&&content&&!node.name.startsWith('P_Gauge')){
   const number=file==='GTNumL'||file==='GTNumM',uv=number?picture.uv.map((v,i)=>i%2?v+Number(digit||0)/10:v):picture.uv;
   // The stock layout starts with the zero-bar texture. qlaunch selects the
   // live signal pattern; host online state supplies the connected pattern.
   const signal=file==='HudSignal'&&node.name==='P_Wifi'?native?.nativeTextures?.['IcoWifi_00_32^s']:undefined;
   content=<SwitchPicture picture={signal?{...picture,source:signal,texture:'IcoWifi_00_32^s'}:picture} uv={uv}/>;
  }
  if(content)content=<div style={{position:'absolute',inset:0,display:'flex'}}><SwitchMaterial surfaceStyle={false} effect={{...effect,Position:undefined,Size:undefined,Scale:undefined,Rotation:undefined,Visible:undefined}}>{content}</SwitchMaterial></div>;
 }
  const className=[digitClass?'dht-switch-battery-digit':'',file==='Hud'&&node.name==='N_BatteryNum'?'dht-switch-battery-number':'',node.type==='bnd1'?'dht-switch-battery-hit':''].filter(Boolean).join(' ');
  if(node.type==='bnd1'){style.pointerEvents='auto';content=<button aria-label="Toggle battery percentage" onClick={()=>setPercentage(v=>!v)} style={{position:'absolute',inset:0,width:'100%',height:'100%',border:0,background:'transparent',pointerEvents:'auto'}}/>;}
  return {content,style,alphaMask:node.type==='pic1'&&!!content&&!node.name.startsWith('P_Gauge'),className:className||undefined,attrs:{'data-hud-file':file,'data-hud-pane':node.name}};
 }}/></div>;
}
