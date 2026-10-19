import {useContext,useState} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import type {MenuItem} from '../common';
import {SwitchNativeContext,SwitchWidgetTree} from './SwitchWidgetTree';
import {WIDGET_DEFAULTS} from './switchWidgetDefaults';
import {SwitchMaterial,panelColor} from './SwitchMaterial';
import {SwitchText} from './SwitchText';

export const SWITCH_ACTION_LAYOUTS=['DBtnNml1','DBtnNml2','DBtnNml3','DBtnTop1Btm1','DBtnTop1Btm2','DBtnTop1ExBtm1','DBtnTop1ExBtm2','DBtnVertical3','DBtnUserIconNameStatus'] as const;
/** Source parts determine button ordering, bounds, line geometry and hit areas. */
export function SwitchDialogActions({file,items,selected,onActivate,open=true,...shared}:{file:typeof SWITCH_ACTION_LAYOUTS[number];items:MenuItem[];selected:number;onActivate:(index:number)=>void;open?:boolean;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const native=useContext(SwitchNativeContext),[touched,setTouched]=useState<number>(),parts=WIDGET_DEFAULTS[shared.modern?'modern':'classic'],list=parts[file];
 const height=native?.nativePanes?.[file]?.N_Root?.Size?.Y??list.find(n=>n.name==='N_Root')?.size[1]??72;
 return <div data-native-dialog-actions={file} style={{position:'relative',height}}><div style={{position:'absolute',left:0,right:0,top:0,height:0}}><SwitchWidgetTree file={file} {...shared} parts={parts} rootSize={[0,0]} events={['enter']} render={(node,effect,path)=>{
  const instance=[...path].reverse().find(p=>/^L_Btn_\d+$/.test(p.name)),index=Number(instance?.name.slice(-2)??-1),item=items[index],active=index===selected;
  if(node===instance)return {hidden:!item,partEvents:['enter',active?'active':'inactive',...(active?['focus']:[]),...(index===touched?['touch']:[])]};
  if(node.name==='N_BtnFocusKey')return {hidden:!active,style:{outline:'3px solid var(--dht-switch-accent,#00c3e3)'}};
  if(node.name==='P_BtnTouch'||node.name==='P_BtnDecideKey')return {hidden:index!==touched,style:{background:panelColor(effect)}};
  if(node.name==='B_Hit'&&item)return {content:<button aria-label={item.label} disabled={item.disabled||!open} onPointerDown={()=>setTouched(index)} onPointerUp={()=>setTouched(undefined)} onPointerCancel={()=>setTouched(undefined)} onPointerLeave={()=>setTouched(undefined)} onClick={()=>onActivate(index)} style={{position:'absolute',inset:0,opacity:0,pointerEvents:open&&!item.disabled?'auto':'none'}}/>};
  if(node.type==='txt1')return {content:<SwitchMaterial effect={effect} surfaceStyle={false}><SwitchText text={item?.label??''} metrics={node.text} enabled={shared.enabled}/></SwitchMaterial>};
  if(node.type==='pic1')return {content:<SwitchMaterial effect={effect} surfaceStyle={false}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial>};
  return {};
 }}/></div></div>;
}
