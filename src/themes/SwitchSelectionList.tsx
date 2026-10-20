import {useContext,useLayoutEffect,useRef,useState} from 'react';
import type {MenuItem} from '../common';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeContext,SwitchWidgetTree} from './SwitchWidgetTree';
import {WIDGET_DEFAULTS} from './switchWidgetDefaults';
import {SwitchMaterial} from './SwitchMaterial';
import {SwitchText} from './SwitchText';

export function SwitchSelectionList({title,subtitle='',items,selected,onActivate,onBack,open=true,...shared}:{title:string;subtitle?:string;items:MenuItem[];selected:number;onActivate:(index:number)=>void;onBack?:()=>void;open?:boolean;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const native=useContext(SwitchNativeContext),parts=WIDGET_DEFAULTS[shared.modern?'modern':'classic'],file='DBtmSelBox2',viewport=useRef<HTMLDivElement>(null),[ratio,setRatio]=useState(1),[position,setPosition]=useState(0);
 const rowHeight=native?.nativePanes?.[file]?.L_BtnOpt_00?.Size?.Y??parts[file].find(n=>n.name==='L_BtnOpt_00')!.size[1],footer=native?.nativePanes?.[file]?.z_FooterMemo?.Size?.Y??72;
 useLayoutEffect(()=>{const el=viewport.current;if(!el)return;const update=()=>{setRatio(el.clientHeight/Math.max(el.clientHeight,el.scrollHeight));setPosition(el.scrollTop/Math.max(1,el.scrollHeight-el.clientHeight));};const observer=new ResizeObserver(update);observer.observe(el);el.addEventListener('scroll',update);update();return()=>{observer.disconnect();el.removeEventListener('scroll',update);};},[items.length,rowHeight]);
 useLayoutEffect(()=>{viewport.current?.querySelector('[data-selected="true"]')?.scrollIntoView({block:'nearest'});},[selected]);
 const row=(item:MenuItem,index:number)=><div key={index} data-selected={selected===index} style={{position:'relative',height:rowHeight,pointerEvents:'none'}}><div style={{position:'absolute',left:0,right:0,top:0,height:0}}><SwitchWidgetTree file={file} root="L_BtnOpt_00" parts={parts} {...shared} events={['enter',selected===index?'active':'inactive',...(selected===index?['focus']:[])]} render={(node,effect)=>{
  if(node.name==='B_Hit')return {content:<button aria-label={item.label} aria-checked={!!item.checked} role="menuitemcheckbox" disabled={item.disabled||!open} onClick={()=>onActivate(index)} style={{position:'absolute',inset:0,opacity:0,pointerEvents:open&&!item.disabled?'auto':'none'}}/>};
  if(node.name==='N_BtnFocusKey')return {hidden:selected!==index,style:{outline:'3px solid var(--dht-switch-accent,#00c3e3)'}};
  if(node.name==='P_CheckBaseOff')return {hidden:!!item.checked};
  if(node.name==='P_CheckBaseOn'||node.name==='P_Check')return {hidden:!item.checked,content:node.name==='P_Check'?<span style={{fontSize:24}}>✓</span>:undefined};
  if(node.name==='P_BtnTouch'||node.name==='P_BtnDecideKey')return {hidden:true};
  if(node.type==='txt1')return {content:<SwitchMaterial effect={effect} surfaceStyle={false}><SwitchText text={item.label} metrics={node.text} enabled={shared.enabled}/></SwitchMaterial>};
  if(node.type==='pic1')return {content:<SwitchMaterial effect={effect} surfaceStyle={false}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial>};
  return {};
 }}/></div></div>;
 return <div data-native-selection-list="" style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}><SwitchWidgetTree file={file} {...shared} parts={parts} rootSize={[1280,720]} runtime={{'widget:DBtmSelBox2:L_BtnR':{Visible:!!onBack},'widget:DBtmSelBox2:L_ScrollIndicator':{Visible:true},'widget:DBtmSelBox2:L_Head':{Visible:true},'widget:DBtmSelBox2:L_HeadSub':{Visible:true}}} events={['enter']} render={(node,effect,path)=>{
  if(node.name==='L_BtnOpt_00'||node.name==='L_HeadOptGroup_00')return {hidden:true};
  if(node.name==='L_Head')return {hidden:!!subtitle};if(node.name==='L_HeadSub')return {hidden:!subtitle};
  if(node.name==='L_BtnR')return {hidden:!onBack};
  const back=path.some(p=>p.name==='L_BtnR');
  if(back&&node.name==='B_Hit')return {content:<button aria-label="Back" disabled={!open} onClick={onBack} style={{position:'absolute',inset:0,opacity:0,pointerEvents:open?'auto':'none'}}/>};
  if(back&&(node.name==='P_BtnTouch'||node.name==='P_BtnDecideKey'||node.name==='N_BtnFocusKey'))return {hidden:true};
  if(node.name==='B_Scroll')return {content:<div ref={viewport} data-native-selection-viewport="" style={{position:'absolute',inset:0,overflowY:'auto',overflowX:'hidden',scrollbarWidth:'none',pointerEvents:open?'auto':'none'}}>{items.map(row)}<div style={{height:footer}}/></div>};
  if(node.name==='L_Line_00')return {};
  if(node.name==='L_ScrollIndicator')return {replacePart:true,hidden:ratio>=1,content:<div data-native-selection-indicator="" style={{position:'absolute',left:0,right:0,top:`${position*(1-ratio)*100}%`,height:`${ratio*100}%`,background:shared.dark?'#ffffff80':'#00000050'}}/>};
  if(node.type==='txt1'){const sub=path.some(p=>p.name==='L_HeadSub')&&node.name==='T_01';return {content:<SwitchMaterial effect={effect} surfaceStyle={false}><SwitchText text={back?'Back':sub?subtitle:title} metrics={node.text} enabled={shared.enabled}/></SwitchMaterial>};}
  if(node.type==='pic1')return {content:<SwitchMaterial effect={effect} surfaceStyle={false}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial>};
  return {};
 }}/></div>;
}
