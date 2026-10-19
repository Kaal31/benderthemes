import {useContext,useEffect,useId,useMemo,useState} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchMaterial,vertexImage} from './SwitchMaterial';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SCENE_MOTION} from './switchSceneDefaults';
import {composeSwitchAnimations} from './switchAnimationFiles';

/** Sample the live host composition, then apply the same two-register and
 * bilinear vertex remap as an ordinary native picture. No screenshot cache. */
export function SwitchBackdropMaterial({effect,blur=0}:{effect:SwitchEffect;blur?:number}){
 const id='nx-backdrop-'+useId().replace(/[^a-zA-Z0-9]/g,''),corners=Object.values(effect.corners??{}),uniform=corners.length>0&&corners.every(c=>c.join()===corners[0].join()),tint=uniform?corners[0]:[255,255,255,255],vertex=useMemo(()=>uniform?undefined:vertexImage(effect.corners),[effect.corners,uniform]);
 const white=effect.white??[255,255,255,255],black=effect.black??[0,0,0,0];
 return <><svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}><defs><filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
  {blur>0&&<feGaussianBlur stdDeviation={blur} edgeMode="duplicate"/>}
  <feComponentTransfer result="material"><feFuncR type="linear" slope={(white[0]-black[0])/255*tint[0]/255} intercept={black[0]/255*tint[0]/255}/><feFuncG type="linear" slope={(white[1]-black[1])/255*tint[1]/255} intercept={black[1]/255*tint[1]/255}/><feFuncB type="linear" slope={(white[2]-black[2])/255*tint[2]/255} intercept={black[2]/255*tint[2]/255}/><feFuncA type="linear" slope={white[3]/255*tint[3]/255}/></feComponentTransfer>
  {vertex&&<><feImage href={vertex} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="vertex"/><feComposite in="material" in2="vertex" operator="arithmetic" k1="1" k2="0" k3="0" k4="0"/></>}
 </filter></defs></svg><div data-native-backdrop-filter="" style={{position:'absolute',inset:0,backdropFilter:`url(#${id})`,borderRadius:effect.radius??0}}/></>;
}

export function SwitchMenuBackdrop({open,...shared}:{open:boolean;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const native=useContext(SwitchNativeContext),[retained,setRetained]=useState(open),profile=shared.modern?'modern':'classic';
 const motion=composeSwitchAnimations([...SCENE_MOTION[profile].BlurBg2,...SCENE_MOTION[profile].MaskBlack],Object.entries(native?.nativeAnimations??{}).flatMap(([file,values])=>['BlurBg2','MaskBlack'].includes(file)?values:[]),native?.animationFiles);
 const duration=Math.max(0,...motion.filter(a=>a.event==='exit').map(a=>a.frames*1000/60));
 useEffect(()=>{if(open){setRetained(true);return;}const timer=setTimeout(()=>setRetained(false),shared.enabled?duration:0);return()=>clearTimeout(timer);},[open,shared.enabled,duration]);
 return <div data-native-menu-backdrop="" style={{position:'absolute',inset:0,pointerEvents:'none',display:open||shared.enabled&&retained?undefined:'none'}}><div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}>
  {!shared.modern&&<SwitchNativeScene file="BlurBg" {...shared} rootSize={[0,0]} events={[]} render={(node,effect)=>node.name==='P_Image'?{content:<SwitchBackdropMaterial effect={effect} blur={8}/>}:{}}/>}
  {shared.modern&&<SwitchNativeScene file="BlurBg2" {...shared} rootSize={[0,0]} runtime={{'BlurBg2:P_Blur':{Visible:true}}} events={[open?'enter':'exit']} render={(node,effect)=>node.name==='P_Blur'?{content:<SwitchBackdropMaterial effect={effect} blur={8}/>}:{}}/>}
  <SwitchNativeScene file="MaskBlack" {...shared} rootSize={[0,0]} events={[open?'enter':'exit']} render={(node,effect)=>node.name==='P_Mask'?{content:<SwitchMaterial effect={effect} surfaceStyle={false}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial>}:{} }/>
 </div></div>;
}
