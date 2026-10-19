import {useLayoutEffect,useRef,useState} from 'react';
import type {CSSProperties,ReactNode} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchMaterial} from './SwitchMaterial';

/** Native surface remains outside the scrolling host panel, so rounded bounds
 * and its shadow do not scroll or get clipped with the menu items. */
export function SwitchMenuSurface({children,...shared}:{children:ReactNode;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const host=useRef<HTMLDivElement>(null),[surface,setSurface]=useState<CSSProperties>();
 useLayoutEffect(()=>{
  const panel=host.current?.querySelector<HTMLElement>('.dht-menu--switch');if(!panel)return;
  const update=()=>{
   const style=getComputedStyle(panel);
   const next:CSSProperties={position:'absolute',left:panel.offsetLeft,top:panel.offsetTop,width:panel.offsetWidth,height:panel.offsetHeight,transform:style.transform,transformOrigin:style.transformOrigin,pointerEvents:'none'};
   setSurface(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
  };
  const observer=new ResizeObserver(update),mutation=new MutationObserver(update);observer.observe(panel);mutation.observe(panel,{attributes:true,attributeFilter:['style']});update();
  window.addEventListener('resize',update);return()=>{observer.disconnect();mutation.disconnect();window.removeEventListener('resize',update);};
 },[children]);
 return <div ref={host} style={{position:'absolute',inset:0,pointerEvents:'none'}}>
  {surface&&<div data-native-menu-surface="" style={surface}><SwitchNativeScene file="DBaseNml" {...shared} root="P_Base" runtime={{'DBaseNml:P_Base':{Size:{X:Number(surface.width),Y:Number(surface.height)}}}} events={[]} render={(node,effect)=>node.name!=='P_Base'?{hidden:true}:({content:<div style={{position:'absolute',inset:0,borderRadius:effect.radius??0,overflow:'hidden'}}><SwitchMaterial surfaceStyle={false} effect={effect}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial></div>})}/></div>}
  {children}
 </div>;
}
