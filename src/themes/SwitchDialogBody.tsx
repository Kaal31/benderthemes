import {useContext,useLayoutEffect,useRef,useState} from 'react';
import type {ReactNode} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SCENE_DEFAULTS} from './switchSceneDefaults';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchMaterial} from './SwitchMaterial';

/** Bind the dialog's content bounds to the actual scrolling/hit-test viewport.
 * The backing and header stay in their authored hierarchy outside that clip. */
export function SwitchDialogBody({header,title,items,headerHeight,size,open,file='DBaseNml',...shared}:{file?:'DBaseNml'|'DBtmBaseNml';header:ReactNode;title:ReactNode;items:ReactNode;headerHeight:number;size:number[];open:boolean;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const native=useContext(SwitchNativeContext),[contentHeight,setContentHeight]=useState(size[1]);
 const viewport=useRef<HTMLDivElement>(null),content=useRef<HTMLDivElement>(null),[scroll,setScroll]=useState({ratio:1,position:0});
 useLayoutEffect(()=>{
  const view=viewport.current,body=content.current;if(!view||!body)return;
  const update=()=>{
   const range=view.scrollHeight-view.clientHeight;
   setContentHeight(Math.min(size[1],body.scrollHeight));
   const next={ratio:view.scrollHeight>0?Math.min(1,view.clientHeight/view.scrollHeight):1,position:range>0?view.scrollTop/range:0};
   setScroll(old=>old.ratio===next.ratio&&old.position===next.position?old:next);
  };
  const observer=new ResizeObserver(update);observer.observe(view);observer.observe(body);view.addEventListener('scroll',update);update();
  return()=>{observer.disconnect();view.removeEventListener('scroll',update);};
 },[header,items,size[1]]);
 const maskOffset=native?.nativePanes?.DBtmBaseNml?.N_BgMaskOffset?.Size?.Y??SCENE_DEFAULTS[shared.modern?'modern':'classic'].DBtmBaseNml.find(node=>node.name==='N_BgMaskOffset')!.size[1];
 const postLayout:Record<string,SwitchEffect>=file==='DBtmBaseNml'?{'DBtmBaseNml:P_Base':{Size:{X:size[0],Y:contentHeight}},'DBtmBaseNml:P_Shdw':{Position:{X:0,Y:contentHeight}},'DBtmBaseNml:P_DummyBgMask':{Size:{X:size[0],Y:size[1]-contentHeight+maskOffset}},'DBtmBaseNml:B_Content':{Size:{X:size[0],Y:contentHeight}}}:{};
 return <><SwitchNativeScene file={file} {...shared} postLayout={postLayout} rootSize={size} events={[open?'enter':'exit']} render={(node,effect)=>{
  if(node.name==='P_Base'||node.name==='P_DummyBgMask'||node.name==='P_Shdw')return {attrs:{'data-native-menu-surface':''},content:<div style={{position:'absolute',inset:0,borderRadius:effect.radius??0,overflow:'hidden'}}><SwitchMaterial surfaceStyle={false} effect={effect}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial></div>};
  if(node.name==='L_Mask')return {hidden:native?.nativePanes?.DBaseNml?.L_Mask?.Visible!==true,content:<div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}><SwitchNativeScene file="BgMask" {...shared} rootSize={[effect.Size?.X??node.size[0],effect.Size?.Y??node.size[1]]} runtime={{'BgMask:P_Mask':{Size:{X:effect.Size?.X??node.size[0],Y:effect.Size?.Y??node.size[1]}}}} events={[open?'enter':'exit']} render={(part,ink)=>part.name==='P_Mask'?{content:<SwitchMaterial surfaceStyle={false} effect={ink}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial>}:{} }/></div>};
  if(node.name==='N_Header')return {content:title};
  if(node.name==='B_Content')return {content:<div ref={viewport} data-native-menu-viewport="" style={{position:'absolute',inset:0,overflowY:'auto',overflowX:'hidden',scrollbarWidth:'none',pointerEvents:open?'auto':'none'}}><div ref={content} style={{paddingTop:headerHeight,paddingBottom:12}}>{header}{items}</div></div>};
  if(node.name==='L_Indicator')return {hidden:scroll.ratio>=1,content:<div data-native-menu-indicator="" style={{position:'absolute',left:0,right:0,top:`${scroll.position*(1-scroll.ratio)*100}%`,height:`${scroll.ratio*100}%`,background:shared.dark?'#ffffff80':'#00000050',borderRadius:2}}/>};
  return {};
 }}/>{file==='DBtmBaseNml'&&<div data-native-bottom-header="" style={{position:'absolute',left:0,right:0,top:size[1]-contentHeight,height:0}}>{title}</div>}</>;
}
