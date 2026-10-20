import {useContext,useMemo} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SCENE_DEFAULTS,SCENE_MOTION} from './switchSceneDefaults';
import {SwitchSceneTree,SceneRender} from './SwitchSceneTree';
import {mergeSceneEffect} from './switchSceneLayout';
import {composeSwitchAnimations} from './switchAnimationFiles';

/** Shared binding for native resource identities and host-supplied service values. */
export function SwitchNativeScene({file,modern,dark,enabled,events,effects,animations,render,runtime={},postLayout={},rootSize,root,referencedParts=false}:{file:string;modern:boolean;dark:boolean;enabled:boolean;events:string[];effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];render:SceneRender;runtime?:Record<string,SwitchEffect>;postLayout?:Record<string,SwitchEffect>;rootSize?:number[];root?:string;referencedParts?:boolean}){
 const native=useContext(SwitchNativeContext),profile=modern?'modern':'classic',defaults=SCENE_DEFAULTS[profile],list=defaults[file];
 const patches=useMemo(()=>{
  const out:Record<string,SwitchEffect>={};
  for(const [resource,nodes] of Object.entries(defaults))for(const node of nodes){
   // A compatibility alias can refer to several files (for example footer).
   // Native records are complete; replaying the alias on each node copies an
   // instance transform into its referenced layout and applies it twice.
   const legacy=node.legacySlot??node.slot,base=native?.nativePanes?undefined:effects[legacy];
   out[node.slot]=mergeSceneEffect(mergeSceneEffect(mergeSceneEffect(runtime[node.slot],base),native?.nativePanes?.[resource]?.[node.name]),postLayout[node.slot]);
  }
  if(rootSize)out[list[0].slot]={...out[list[0].slot],Position:{X:0,Y:0},Scale:{X:1,Y:1},Rotation:{Z:0},Size:{X:rootSize[0],Y:rootSize[1]}};
  return out;
 },[native,effects,defaults,runtime,postLayout,rootSize,list]);
 const materials=useMemo(()=>Object.fromEntries(Object.entries(native?.nativeMaterials??{}).flatMap(([resource,values])=>Object.entries(values).map(([name,effect])=>[resource+':'+name,effect]))),[native]);
 const motion=useMemo(()=>{
  const imported=native?.nativeAnimations?Object.entries(native.nativeAnimations).flatMap(([resource,values])=>values.map(a=>({...a,pane:resource+':'+a.pane}))):animations.map(a=>{const node=Object.values(defaults).flat().find(p=>p.legacySlot===a.pane);return node?{...a,pane:node.slot}:a;});
  return composeSwitchAnimations(referencedParts?Object.values(SCENE_MOTION[profile]).flat():SCENE_MOTION[profile][file]??[],imported,native?.animationFiles);
 },[native,animations,defaults,profile,file,referencedParts]);
 return <SwitchSceneTree {...{list,root,effects:patches,animations:motion,materials,dark,enabled,events,render}} parts={referencedParts?defaults:undefined}/>;
}
