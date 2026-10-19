import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchWidgetTree} from './SwitchWidgetTree';
import {panelColor} from './SwitchMaterial';
export function SwitchControllerNotice({effects,animations,modern,dark,enabled,text}:{effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;text:string}){
 return <div style={{position:'relative',width:0,height:0}}>
  <SwitchWidgetTree file="RdtBalloonCtrl" {...{effects,animations,modern,dark,enabled}} events={['enter']} render={(node,effect)=>{
   if(node.type==='pic1'){
    if(node.name==='P_Tip')return {style:{background:panelColor(effect),clipPath:'polygon(50% 0,100% 100%,0 100%)'}};
    return {style:{background:panelColor(effect),borderRadius:effect.radius??(node.name==='P_Base'?20:3)}};
   }
   if(node.name==='N_Ctrl')return {content:<svg width="48" height="28" viewBox="0 0 48 28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="1" width="12" height="26" rx="5"/><rect x="35" y="1" width="12" height="26" rx="5"/><circle cx="7" cy="9" r="2"/><circle cx="41" cy="18" r="2"/></svg>};
   return {};
  }}/>
  <span style={{position:'absolute',left:-60,top:105,width:200,fontSize:18,textAlign:'center'}}>{text}</span>
 </div>;
}
