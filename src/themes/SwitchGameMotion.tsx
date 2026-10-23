import {SwitchSceneTree} from './SwitchSceneTree';
import {SCENE_DEFAULTS,SCENE_MOTION} from './switchSceneDefaults';
import {useContext,useMemo,useState,useEffect} from "react";
import {SwitchNativeContext} from './SwitchWidgetTree';
import {composeSwitchAnimations} from './switchAnimationFiles';
import {SwitchPicture} from './SwitchPicture';
import {SwitchServiceScene} from './SwitchServiceScene';
import {SwitchText} from './SwitchText';
import {SwitchLoading} from './SwitchLoading';
import type {ReactNode} from "react";
import type {SwitchAnimation,SwitchEffect} from "../switchThemes";
import {effectStyle,panelColor,SwitchMaterial} from "./SwitchMaterial";
import {ProfileAvatar} from "../ProfileAvatar";

export {SwitchMotionPane} from './SwitchMotionPane';

export function SwitchGameMotion({children,animations,effects,nativePanes,nativeAnimations,nativeMaterials,modern,dark,active,enabled,unitX,unitY,focus,touch,running,launching=false,downloadProgress,installable=false}: {
 children:ReactNode;animations:SwitchAnimation[];effects:Record<string,SwitchEffect>;nativePanes?:Record<string,Record<string,SwitchEffect>>;nativeAnimations?:Record<string,SwitchAnimation[]>;nativeMaterials?:Record<string,Record<string,SwitchEffect>>;modern:boolean;dark:boolean;active:boolean;enabled:boolean;unitX:number;unitY:number;focus:ReactNode;touch:boolean;running:boolean;launching?:boolean;downloadProgress?:number;installable?:boolean;
}){
 const [ready,setReady]=useState(false),profile=modern?'modern':'classic',list=SCENE_DEFAULTS[profile].RdtBtnIconGame,native=useContext(SwitchNativeContext);
 const aliases:Record<string,string>={RootPane:'gameOuter',N_Root:'gameRoot',N_DecideKey:'gameDecideKeyRoot',N_Delete:'gameDelete',N_DecideTouch:'gameDecideRoot',P_IconGame:'game',P_BtnBase:'gameBase',P_Blank:'gameBlank',P_BtnTouch:'gameTouch',P_BtnDecideKey:'gameDecide',P_InnerCursor:'gameInnerCursor',N_BtnFocusKey:'gameFocus',UF_Cursor:'gameCursor',N_Suspend:'gameSuspend',N_TextPos:'gameTextRoot',P_Suspend_00:'gameSuspendBase',T_Suspend:'gameSuspendText',P_Account_00:'gameAccount',P_Account_01:'gameAccount1',P_Account_02:'gameAccount2',P_Account_03:'gameAccount3',N_DL:'gameDownload',L_Promotion:'gamePromotion'};
 const patches=useMemo(()=>{
  const out:Record<string,SwitchEffect>={};
  for(const node of list){const native=nativePanes?.RdtBtnIconGame?.[node.name],legacy=effects[aliases[node.name]];if(nativePanes?native:legacy)out[node.slot]=nativePanes?native!:legacy;}
  // The outer tile already applies the static root scale and rotation.
  const root=out['RdtBtnIconGame:RootPane'];if(root)out['RdtBtnIconGame:RootPane']={...root,Scale:{X:1,Y:1},Rotation:{X:0,Y:0,Z:0}};
  // Picture color/material patches use their own identity, never the root transform.
  if(!nativePanes)out['RdtBtnIconGame:P_IconGame']=effects.gameArt??{};
  return out;
 },[list,effects,nativePanes]);
 const motion=useMemo(()=>{
  const imported=nativeAnimations?.RdtBtnIconGame?.map(a=>({...a,pane:'RdtBtnIconGame:'+a.pane}))??animations.filter(a=>Object.values(aliases).includes(a.pane)).map(a=>({...a,pane:'RdtBtnIconGame:'+(Object.entries(aliases).find(([,v])=>v===a.pane)?.[0]??a.pane)}));
  const scale=nativePanes?.RdtBtnIconGame?.RootPane?.Scale??effects.game?.Scale;
  const normalized=imported.map(a=>a.pane==='RdtBtnIconGame:RootPane'?{...a,tracks:a.tracks.map(t=>[0,1,6,7].includes(t.property)?{...t,keys:t.keys.map(k=>{const divisor=(t.property===0||t.property===6?scale?.X:scale?.Y)??1;return divisor?{...k,value:k.value/divisor,slope:k.slope/divisor}:k;})}:t)}:a);
  return composeSwitchAnimations(SCENE_MOTION[profile].RdtBtnIconGame,normalized,native?.animationFiles);
 },[nativeAnimations,animations,profile,native?.animationFiles,nativePanes,effects]);
 const materials=useMemo(()=>Object.fromEntries(Object.entries(nativeMaterials??{}).flatMap(([file,list])=>Object.entries(list).map(([name,effect])=>[file+':'+name,effect]))),[nativeMaterials]);
 const [retainedRunning,setRetainedRunning]=useState(running);
 useEffect(()=>{if(running){setRetainedRunning(true);return;}const duration=Math.max(0,...motion.filter(a=>a.event==='stopped').map(a=>a.frames*1000/60));const timer=setTimeout(()=>setRetainedRunning(false),enabled?duration:0);return()=>clearTimeout(timer);},[running,enabled,motion]);
 const events=[ready?'ready':'loading',active?'active':'inactive',...(active?['focus']:[]),...(touch?['touch','decide']:[]),...(running?['running','runningText','user1']:retainedRunning?['stopped']:[]),...(launching?['launch']:[])];
 return <div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,transform:`scale(${unitX},${unitY})`}} onLoadCapture={()=>setReady(true)}>
  <SwitchSceneTree {...{list,events,enabled,materials}} root="RootPane" animations={motion} effects={patches} dark={dark} render={(node,effect)=>{
   const attrs=aliases[node.name]?{'data-nx-pane':aliases[node.name]}:undefined;
   if(node.name==='N_Root')return {className:'dht-switch-game-root',attrs};
   if(node.name==='L_Loading')return {hidden:ready,content:ready?undefined:<SwitchLoading {...{effects,animations,modern,dark,enabled}} magnify={node.partMagnify}/>};
   if(node.name==='N_Suspend')return {hidden:!running&&!retainedRunning,attrs};
   // The console enables the virtual-card shell from application state, not
   // pane alpha (its children can opt out of that alpha). Host Steam games
   // are digital, so do not paint the inactive shell over their artwork.
   if(node.name==='N_CardSet')return {hidden:nativePanes?.RdtBtnIconGame?.N_CardSet?.Visible!==true};
   if(node.name==='N_DL')return {hidden:downloadProgress===undefined,attrs,style:downloadProgress!==undefined?{opacity:1}:undefined};
   if(node.name==='N_DlErr'||node.name==='N_Offline')return {hidden:true};
   if(node.name.startsWith('L_ProgressBar'))return {content:downloadProgress!==undefined&&node.part?<div role="progressbar" aria-valuenow={downloadProgress} style={{position:'absolute',inset:0}}><SwitchServiceScene file={node.part} size={[effect.Size?.X??node.size[0],effect.Size?.Y??node.size[1]]} {...{effects,animations,modern,dark,enabled}} progress={downloadProgress}/></div>:undefined};
   if(node.name==='N_Promotion')return {hidden:!installable};
   if(node.name==='L_Promotion')return {hidden:!installable,attrs,content:<SwitchServiceScene file="RdtIconPromotion" size={[effect.Size?.X??node.size[0],effect.Size?.Y??node.size[1]]} {...{effects,animations,modern,dark,enabled}} label="Install"/>};
   if(node.name==='P_IconGame')return {attrs,content:<div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:effect.radius??0}}><SwitchMaterial surfaceStyle={false} effect={{...effect,Size:undefined,Position:undefined,Scale:undefined,Rotation:undefined,radius:undefined}}>{children}</SwitchMaterial></div>};
   if(node.name==='P_BtnBase'||node.name==='P_Blank')return {attrs,style:{background:node.name==='P_Blank'&&ready?'transparent':node.name==='P_BtnBase'?`var(--dht-reference-game-backing, ${panelColor(effect)})`:panelColor(effect),borderRadius:nativePanes?.RdtBtnIconGame?.[node.name]?.radius??effects.gameArt?.radius??effect.radius}};
   if(node.name==='UF_Cursor')return {attrs,hidden:!active,content:<div style={{position:'absolute',inset:0,...effectStyle(effects.cursorRoot)}}>{focus}</div>};
   if(node.name==='P_InnerCursor')return {attrs,hidden:!active,style:{border:'1px solid #fff6'}};
   if(node.name==='P_BtnDecideKey'||node.name==='P_BtnTouch'||node.name==='P_EffectDecide')return {attrs,hidden:!active||!touch,style:{background:'#fff3'}};
   if(node.name.startsWith('P_Account_'))return {attrs,hidden:!running||node.name!=='P_Account_00',content:running&&node.name==='P_Account_00'?<ProfileAvatar size={50}/>:undefined};
   const picture=native?.nativePictures?.RdtBtnIconGame?.[node.name];
   if(picture&&node.type==='pic1')return {attrs,alphaMask:true,content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchPicture picture={picture}/></SwitchMaterial>};
   if(node.name==='P_Suspend_00')return {attrs,style:{background:panelColor(effect)}};
   if(node.type==='txt1')return {attrs,content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchText text="Playing" metrics={node.text} enabled={enabled}/></SwitchMaterial>};
   return {attrs};
  }}/>
 </div>;
}
