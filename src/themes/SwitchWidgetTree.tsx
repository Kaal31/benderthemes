import {createContext,useContext,useMemo} from 'react';
import type {SwitchEffect,SwitchAnimation,SwitchConversion} from '../switchThemes';
import {SwitchSceneTree,SceneRender} from './SwitchSceneTree';
import {WIDGET_DEFAULTS} from './switchWidgetDefaults';
import {WIDGET_MOTION_DEFAULTS} from './switchWidgetMotionDefaults';
import {mergeSceneEffect} from './switchSceneLayout';
import {composeSwitchAnimations} from './switchAnimationFiles';
import type {SwitchScenePane} from './switchSceneTypes';
export const SwitchNativeContext=createContext<SwitchConversion|undefined>(undefined);
export type WidgetRender=SceneRender;
export function SwitchWidgetTree({file,modern,effects,animations,dark,events,enabled,render,parts,runtime={},rootSize,root}:{file:string;modern:boolean;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];dark:boolean;events:string[];enabled:boolean;render:WidgetRender;parts?:Record<string,SwitchScenePane[]>;runtime?:Record<string,SwitchEffect>;rootSize?:number[];root?:string}){
 const profile=modern?'modern':'classic',list=WIDGET_DEFAULTS[profile][file];
 const native=useContext(SwitchNativeContext);
 const patches=useMemo(()=>{
  const out={...effects};for(const [resource,nodes] of Object.entries({[file]:list,...parts}))for(const node of nodes){
   const patch=native?.nativePanes?.[resource]?.[node.name];
   // Compatibility colors may already have a palette applied. Reusing those
   // registers would defeat a native C_W=0 patch or a material-register patch.
   const base=native?.nativePanes?native.effects?.[node.slot]:effects[node.slot];
   if(native?.nativePanes)delete out[node.slot];
   if(base||patch||runtime[node.slot])out[node.slot]=mergeSceneEffect(mergeSceneEffect(runtime[node.slot],base),patch);
  }
  // Referenced-layout roots are replaced by the owner's instance transform.
  // Keeping a standalone root Position moves repurposed applet backings away.
  out[list[0].slot]={...out[list[0].slot],Position:{X:0,Y:0}};
  if(rootSize)out[list[0].slot]={...out[list[0].slot],Size:{X:rootSize[0],Y:rootSize[1]}};return out;
 },[effects,native,file,list,parts,runtime,rootSize]);
 const materials=useMemo(()=>Object.fromEntries(Object.entries(native?.nativeMaterials??{}).flatMap(([resource,values])=>Object.entries(values).map(([name,effect])=>[resource+':'+name,effect]))),[native]);
 const motion=useMemo(()=>{
  const imported=native?.nativeAnimations?Object.entries({[file]:list,...parts}).flatMap(([resource,nodes])=>(native.nativeAnimations?.[resource]??[]).flatMap(a=>{const node=nodes.find(p=>p.name===a.pane);return node?[{...a,pane:node.slot}]:[];})):animations;
  return composeSwitchAnimations(WIDGET_MOTION_DEFAULTS[profile][file]??[],imported,native?.animationFiles);
 },[profile,file,list,parts,animations,native]);
 return <div data-widget-file={file} style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,pointerEvents:'none'}}><SwitchSceneTree root={root} {...{list,parts,dark,events,enabled,render,materials}} effects={patches} animations={motion} kind="widget"/></div>;
}
