import type {CSSProperties} from 'react';
import type {SwitchEffect} from '../switchThemes';
import type {SwitchScenePane} from './switchSceneTypes';
import {switchPaneOrigin} from './switchPaneOrigin';
import {effectStyle,resolvePalette} from './SwitchMaterial';
/** Vectors replace whole vectors; palette/corner entries patch independently. */
export function mergeSceneEffect(base:SwitchEffect|undefined,patch:SwitchEffect|undefined):SwitchEffect{
 return {...base,...patch,palette:{...base?.palette,...patch?.palette},corners:{...base?.corners,...patch?.corners}};
}
const axis=(value:number)=>value===1?-.5:value===2?.5:0;
export function scenePaneLayout(node:SwitchScenePane,parent:SwitchScenePane|undefined,patch:SwitchEffect|undefined,parentPatch:SwitchEffect|undefined,dark:boolean){
 const effect=resolvePalette(mergeSceneEffect(node.effect,patch),dark)!;
 const position=effect.Position?[effect.Position.X??0,effect.Position.Y??0]:node.position,size=effect.Size?[effect.Size.X??0,effect.Size.Y??0]:node.size;
 const origin=switchPaneOrigin(node.origin),ox=effect.OriginX??origin.x,oy=effect.OriginY??origin.y,px=effect.ParentOriginX??origin.parentX,py=effect.ParentOriginY??origin.parentY;
 const parentSize=parent?(parentPatch?.Size?[parentPatch.Size.X??0,parentPatch.Size.Y??0]:parent.size):[0,0];
 const anchored=parent?.parent!=null;
 const base={Position:{X:position[0],Y:position[1]},Scale:{X:node.scale[0],Y:node.scale[1]},Rotation:{X:node.rotation[0],Y:node.rotation[1],Z:node.rotation[2]},...effect};
 const pivot={x:(.5+axis(ox))*100,y:(.5+axis(oy))*100};
 const style:CSSProperties={position:'absolute',boxSizing:'border-box',left:`calc(50% + ${position[0]+(anchored?axis(px)*parentSize[0]:0)}px)`,top:`calc(50% - ${position[1]-(anchored?axis(py)*parentSize[1]:0)}px)`,width:size[0],height:size[1],translate:`${-pivot.x}% ${-pivot.y}%`,opacity:node.alpha/255,visibility:(effect.Visible??node.visible)?'inherit':'hidden',transformOrigin:`${pivot.x}% ${pivot.y}%`,pointerEvents:'none',...effectStyle({...effect,Visible:undefined,Position:undefined,Scale:undefined,Rotation:undefined}),...(effect.borderWidth!==undefined?{borderWidth:Math.min(effect.borderWidth,Math.max(0,Math.min(...size)/2))}:{}),transform:`rotateX(${base.Rotation?.X??0}deg) rotateY(${base.Rotation?.Y??0}deg) rotate(${-(base.Rotation?.Z??0)}deg) scale(${base.Scale?.X??1},${base.Scale?.Y??1})`};
 return {effect,base,size,style,pivot};
}
