import {SwitchFocusShadow} from './SwitchFocusShadow';
import {SwitchDockLabel} from './SwitchShared';
import {SwitchStatusBadge} from './SwitchStatusBadge';
import {useContext,useMemo,useState} from 'react';
import type {SwitchEffect,SwitchAnimation} from '../switchThemes';
import {ProfileAvatar} from '../ProfileAvatar';
import {useSteamStatus} from '../steam';
import {SwitchNativeContext,SwitchWidgetTree} from './SwitchWidgetTree';
import {panelColor,SwitchMaterial} from './SwitchMaterial';
import {HUD_DEFAULTS} from './switchHudDefaults';
import {SwitchPicture} from './SwitchPicture';
export function SwitchProfile({effects,animations,modern,dark,enabled,label,onActivate}:{effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;label:string;onActivate:()=>void}){
 const status=useSteamStatus(),native=useContext(SwitchNativeContext),[focused,setFocused]=useState(false),[hovered,setHovered]=useState(false),[pressed,setPressed]=useState(false);
 const active=focused||hovered;
 const count=status.friendsOnline;
 const digits=String(Math.trunc(Math.max(0,Math.min(999,count??0)))).padStart(3,' ');
 const parts=useMemo(()=>({GTNumM:HUD_DEFAULTS[modern?'modern':'classic'].GTNumM}),[modern]);
 return <div className="dht-switch-profile" onPointerEnter={()=>setHovered(true)} onPointerLeave={()=>{setHovered(false);setPressed(false);}} style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}>
  <SwitchWidgetTree file="RdtBtnMyPage" {...{effects,animations,modern,dark,enabled,parts}} events={[active?'active':'inactive',...(active?['focus']:[]),...(pressed?['decide','touch']:[])]} render={(node,effect,path)=>{
   if(node.name==='P_PictBase')return {style:{borderRadius:effect.radius??30,overflow:'hidden'},content:<SwitchMaterial surfaceStyle={false} effect={effect} textureMotion><ProfileAvatar size={node.size[0]}/></SwitchMaterial>};
   if(node.name==='B_Hit')return {style:{pointerEvents:'auto'},content:<button aria-label={label} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onPointerDown={()=>setPressed(true)} onPointerUp={()=>setPressed(false)} onClick={onActivate} style={{width:'100%',height:'100%',background:'transparent',border:0}}/>};
   if(node.name==='N_Num')return {hidden:count===undefined||count===0};
   if(node.name.startsWith('L_Num_')){const digit=digits[Number(node.name.slice(-2))];return {hidden:digit===' ',style:{visibility:effect.Visible===false?'hidden':'inherit'}};}
   if(node.name==='P_GTNum_00'){
    const instance=[...path].reverse().find(p=>p.name.startsWith('L_Num_')),digit=digits[Number(instance?.name.slice(-2)??0)]??' ',picture=native?.nativePictures?.GTNumM?.P_GTNum_00;
    return {alphaMask:true,content:<SwitchMaterial surfaceStyle={false} effect={effect}>{picture?<SwitchPicture picture={picture} uv={picture.uv.map((v,i)=>i%2?v+Number(digit||0)/10:v)}/>:<span style={{color:'white',fontFamily:'"Arial Narrow",sans-serif',fontWeight:600,fontSize:effect.Size?.Y??node.size[1],lineHeight:1}}>{digit}</span>}</SwitchMaterial>};
   }
   if(node.name==='L_New'||node.name==='L_Error')return {hidden:node.name==='L_New'?!(status.notifications&&status.notifications>0):status.online,content:<SwitchStatusBadge file={node.name==='L_New'?'RdtIconNewFrd':'IconError'} size={[effect.Size?.X??node.size[0],effect.Size?.Y??node.size[1]]} {...{effects,animations,dark,modern,enabled}}/>};
   if(node.name==='N_Tip')return {hidden:!active};
   if(node.name==='L_Balloon')return {content:<SwitchDockLabel {...{label,effects,animations,modern,dark,enabled,active}}/>};
   if(node.name==='P_BtnDecideKey'||node.name==='P_BtnTouch')return {hidden:!pressed,style:{background:panelColor(effect),borderRadius:effect.radius??30}};
   if(node.name==='UF_Cursor')return {content:<SwitchFocusShadow {...{effects,modern,dark}}/>,hidden:!active,style:{border:'3px solid #00c3e3',borderRadius:35,width:64,height:64,marginLeft:-32,marginTop:-32}};
   if(node.name==='P_Effect')return {hidden:!active,style:{background:panelColor(effect),borderRadius:effect.radius??30}};
   return {};
  }}/>
 </div>;
}
