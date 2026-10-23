import {SwitchFocusShadow} from './SwitchFocusShadow';
import {SwitchDockLabel} from './SwitchShared';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchWidgetTree} from './SwitchWidgetTree';
import {panelColor,SwitchMaterial,effectStyle,nxColor} from './SwitchMaterial';
import {useContext} from 'react';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SwitchPicture} from './SwitchPicture';
export function SwitchLauncherTree({effects,animations,modern,dark,enabled,active,pressed,size,height=size,onActivate}:{effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;active:boolean;pressed:boolean;size:number;height?:number;onActivate:()=>void}){
 const native=useContext(SwitchNativeContext);
 return <div className="dht-switch-launcher" style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,transform:`scale(${size/160},${height/160})`}}>
  <SwitchWidgetTree file="RdtBtnFullLauncher" {...{effects,animations,modern,dark,enabled}} events={[active?'active':'inactive',...(active?['focus']:[]),...(pressed?['decide','touch']:[])]} render={(node,effect)=>{
   if(node.name==='N_Tip')return {hidden:!active};
   if(node.name==='L_Balloon')return {content:<SwitchDockLabel label="All Software" {...{effects,animations,modern,dark,enabled,active}}/>};
   if(node.name==='B_Hit')return {style:{pointerEvents:'auto'},content:<button aria-label="All Software" onClick={event=>{event.stopPropagation();onActivate();}} style={{width:'100%',height:'100%',border:0,background:'transparent'}}/>};
   if(node.name==='UF_Cursor')return {content:<SwitchFocusShadow {...{effects,modern,dark}}/>,hidden:!active,style:{width:170,height:170,marginLeft:-85,marginTop:-85,border:`${effects.cursor?.borderWidth??3}px solid ${nxColor(effects.cursor?.white,'#00c3e3')}`,borderRadius:effect.radius??85,...effectStyle(effects.cursor)}};
   if(node.name==='P_Effect'||node.name==='P_BtnDecideKey'||node.name==='P_BtnTouch')return {hidden:node.name==='P_Effect'?!active:!pressed,style:{background:panelColor(effect),borderRadius:effect.radius??80}};
   if(node.name==='P_PictBase')return {style:{background:panelColor(effect),borderRadius:effect.radius??80}};
   if(/^P_Pict(?:Base)?(?:_\d{2})?$/.test(node.name)){
    const patch=effects[node.slot];
    // Rounded launcher primitives can be reshaped into rings and dots. Draw
    // their outline within the authored bounds, even for an oversized stroke.
    if(patch?.radius!==undefined&&patch.borderWidth!==undefined){
     const w=effect.Size?.X??node.size[0],h=effect.Size?.Y??node.size[1],stroke=Math.min(patch.borderWidth,Math.min(w,h)/2),solid=patch.borderWidth>=Math.min(w,h)/2;
     return {style:{border:0,background:'transparent'},content:<svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}><rect x={solid?0:stroke/2} y={solid?0:stroke/2} width={w-(solid?0:stroke)} height={h-(solid?0:stroke)} rx={patch.radius} fill={solid?panelColor(effect):'none'} stroke={solid?'none':panelColor(effect)} strokeWidth={stroke}/></svg>};
    }
    // Stock launcher squares are shader-generated outlines on an A0 quad.
    if(effect.borderDraw&&effect.borderWidth&&!patch?.borderWidth&&!(effect.black?.[3]))return {style:{border:0,background:'transparent'},content:<SwitchMaterial surfaceStyle={false} effect={effect}><svg width="100%" height="100%" viewBox={`0 0 ${node.size[0]} ${node.size[1]}`}><rect x={effect.borderWidth/2} y={effect.borderWidth/2} width={node.size[0]-effect.borderWidth} height={node.size[1]-effect.borderWidth} rx={effect.radius??0} fill="none" stroke="white" strokeWidth={effect.borderWidth}/></svg></SwitchMaterial>};
    const picture=native?.nativePictures?.RdtBtnFullLauncher?.[node.name];
    return picture?{alphaMask:true,content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchPicture picture={picture}/></SwitchMaterial>,style:{background:'transparent',borderRadius:effect.radius??0}}:{style:{background:panelColor(effect),borderRadius:effect.radius??0}};
   }
   return {};
  }}/>
 </div>;
}
