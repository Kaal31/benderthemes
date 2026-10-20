import type {ReactNode} from 'react';
import type {SwitchEffect,SwitchAnimation} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchText} from './SwitchText';
import {SwitchWidgetTree} from './SwitchWidgetTree';
import {effectStyle,panelColor,SwitchMaterial} from './SwitchMaterial';
export function SwitchFooterController({children,effects,animations,dark,modern,enabled}:{children:ReactNode;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];dark:boolean;modern:boolean;enabled:boolean}){
 return <span style={{position:'relative',...effectStyle(effects.footerControllerRoot),...effectStyle(effects.footerController)}}>{children}
  {Object.keys(effects).some(k=>k.startsWith('widget:CntrIndicatorS:'))&&<div style={{position:'absolute',left:-14,top:'50%'}}><SwitchWidgetTree file="CntrIndicatorS" {...{effects,animations,dark,modern,enabled}} events={['enter']} render={(node,effect)=>({hidden:node.name==='N_Black'||node.name==='P_Valid_01'||node.name==='P_Valid_02'||node.name==='P_Valid_03',style:node.type==='pic1'?{background:panelColor(effect),borderRadius:'50%'}:{}})}/></div>}
  {effects.footerControllerKey&&<span style={{position:'absolute',right:-8,bottom:-4,width:16,height:16,borderRadius:'50%',background:panelColor(effects.footerControllerKey),...effectStyle(effects.footerControllerKey)}}/>}
 </span>;
}
export function SwitchDockLabel({label,effects,animations,active,enabled,dark,modern}:{label:string;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];active:boolean;enabled:boolean;dark:boolean;modern:boolean}){
 return <div data-native-applet-label="" style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}><SwitchNativeScene file="RdtBalloonSystemApplet" {...{effects,animations,modern,dark,enabled}} rootSize={[30,36]} events={[active?'enter':'exit']} render={(node,effect)=>node.type==='txt1'?{content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchText text={label} metrics={node.text} enabled={enabled}/></SwitchMaterial>}:{} }/></div>;
}

export function SwitchNewBadge({effects,animations,dark,modern,enabled}:{effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];dark:boolean;modern:boolean;enabled:boolean}){
 return <SwitchWidgetTree file="IconNew" {...{effects,animations,dark,modern,enabled}} events={['enter']} render={(node,effect)=>({style:node.type==='pic1'?{background:panelColor(effect),borderRadius:'50%'}:{}})}/>;
}
export function SwitchFooterKey({children,effect}:{children:ReactNode;effect?:SwitchEffect}){return <span style={{position:'relative',display:'inline-flex',...effectStyle(effect)}}><SwitchMaterial effect={effect}>{children}</SwitchMaterial></span>;}
