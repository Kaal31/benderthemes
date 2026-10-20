import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchMaterial} from './SwitchMaterial';

export interface SwitchCapturedFrame{url:string;gpu?:boolean;kind:'applet'|'game';serial:number}
/** Capture textures are real host frames. Native transforms, material registers,
 * vertex colors and alpha apply to the image, never a stand-in solid panel. */
export function SwitchAppletCapture({frame,scale=1,onComplete,...shared}:{frame?:SwitchCapturedFrame;scale?:number;onComplete?:()=>void;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const [visible,setVisible]=useState(!!frame);
 const overlay=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!frame){setVisible(false);return;}setVisible(true);if(frame.gpu)return;const timer=setTimeout(()=>{setVisible(false);onComplete?.();},shared.enabled?(frame.kind==='game'?200:100):0);return()=>clearTimeout(timer);},[frame,shared.enabled]);
 useLayoutEffect(()=>{
  const element=overlay.current;if(!frame?.gpu||!element)return;
  const style=document.createElement('style');document.head.append(style);let raf=0,hold:Animation|undefined;
  const project=()=>{
   const name=frame.kind==='game'?'P_GameCapture':'P_Capture',probe=element.querySelector<SVGSVGElement>(`[data-native-capture-probe="${name}"]`),matrix=probe?.getScreenCTM(),pane=probe?.closest('[data-scene-paint]'),material=probe?.closest('.dht-nx-material')?.lastElementChild;
   const radius=pane?parseFloat(getComputedStyle(pane).borderTopLeftRadius)||0:0,roundX=pane?radius*1280/pane.clientWidth:0,roundY=pane?radius*720/pane.clientHeight:0;
   const opacity=pane&&probe?.getClientRects().length?getComputedStyle(pane).opacity:'0',filter=material?getComputedStyle(material).filter:'none';
   style.textContent=`::view-transition{pointer-events:none}::view-transition-old(root){display:none}::view-transition-new(root){animation:none}::view-transition-group(dht-switch-capture){animation:none;transform:none;inset:0;width:100vw;height:100vh}::view-transition-image-pair(dht-switch-capture){isolation:auto}::view-transition-new(dht-switch-capture){display:none}::view-transition-old(dht-switch-capture){animation:none;mix-blend-mode:normal;position:absolute;inset:auto;left:0;top:0;width:1280px;height:720px;transform-origin:0 0;transform:${matrix?`matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`:'scale(0)'};opacity:${opacity};filter:${filter};border-radius:${roundX}px / ${roundY}px;object-fit:fill}`;
   raf=requestAnimationFrame(project);
  };
  const ready=()=>{
   const players=element.getAnimations({subtree:true});for(const animation of players){animation.currentTime=0;animation.play();}
   const duration=Math.max(frame.kind==='game'?200:100,...players.map(a=>Number(a.effect?.getComputedTiming().endTime??0)).filter(Number.isFinite));
   hold=document.documentElement.animate([{opacity:1},{opacity:1}],{duration,pseudoElement:'::view-transition-group(dht-switch-capture)'});
  };
  project();window.addEventListener('dht:switch-capture-ready',ready);
  return()=>{cancelAnimationFrame(raf);hold?.cancel();style.remove();window.removeEventListener('dht:switch-capture-ready',ready);};
 },[frame]);
 if(!frame||!frame.gpu&&!visible)return null;
 return <div ref={overlay} data-native-capture-overlay={frame.kind} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:26}}><div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,transform:`scale(${scale})`}}><SwitchNativeScene file="SystemAppletFader" {...shared} rootSize={[0,0]} events={[frame.kind==='game'?'gameEnter':'exit']} render={(node,effect)=>{
  if(node.name==='P_Capture'||node.name==='P_GameCapture')return {content:<SwitchMaterial effect={effect} surfaceStyle={false}>{frame.gpu?<svg data-native-capture-probe={node.name} viewBox="0 0 1280 720" preserveAspectRatio="none" style={{display:'block',position:'absolute',inset:0,width:'100%',height:'100%',visibility:'hidden'}}/>:<img alt="" data-native-captured-picture={node.name} src={frame.url} style={{display:'block',width:'100%',height:'100%'}}/>}</SwitchMaterial>};
  if(node.name==='P_Base')return {content:<SwitchMaterial effect={effect} surfaceStyle={false}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial>};
  return {};
 }}/></div></div>;
}
