import {useId,useLayoutEffect,useRef} from 'react';
import type {SwitchEffect} from '../switchThemes';
import {switchShadowAlpha} from './switchShadowKernel';

/** Analytic native shadow pass. Its alpha follows the pane's paint alpha,
 * independently of the pane's content and its descendants. */
export function SwitchShadow({effect,alpha,animated=false,motionKey='',volumeProperty}:{effect:SwitchEffect;alpha?:string;animated?:boolean;motionKey?:string;volumeProperty?:string}){
 const signature=[effect.shadow,effect.radius,effect.shadowFunction,effect.shadowDraw,effect.shadowColor?.join(','),effect.shadowOpacity,effect.shadowAngle,effect.shadowDistance].join('|');
 const host=useRef<HTMLSpanElement>(null),canvas=useRef<HTMLCanvasElement>(null),volume=useRef<SVGFEFuncAElement>(null),filterId='nx-shadow-'+useId().replace(/[^a-zA-Z0-9]/g,'');
 useLayoutEffect(()=>{
  let frame=0;
  const update=()=>{
   const target=host.current,transfer=volume.current;if(!target||!transfer)return;
   const value=volumeProperty?getComputedStyle(target).getPropertyValue(volumeProperty).trim():'';
   transfer.setAttribute('slope',String(value?Math.max(0,Number(value)):effect.shadowOpacity??1));
   if(animated)frame=requestAnimationFrame(update);
  };
  // Parent layout effects install the animation/disabled terminal pose after
  // child effects. Read once on the next frame in either mode.
  frame=requestAnimationFrame(update);return()=>cancelAnimationFrame(frame);
 },[animated,motionKey,volumeProperty,effect.shadowOpacity,effect.shadowDraw,effect.shadow]);
 useLayoutEffect(()=>{
  const parent=host.current,target=canvas.current;if(!parent||!target)return;
  const context=target.getContext('2d');if(!context)return;
  let previous='';
  const paint=()=>{
   const width=parent.clientWidth,height=parent.clientHeight,size=effect.shadow??0;
   const key=[width,height].join();if(key===previous)return;previous=key;
   if(width<=0||height<=0||size<=0){target.width=target.height=1;return;}
   const fullWidth=width+size*2,fullHeight=height+size*2,density=Math.min(1,1024/fullWidth,1024/fullHeight);
   target.width=Math.max(1,Math.ceil(fullWidth*density));target.height=Math.max(1,Math.ceil(fullHeight*density));
   const image=context.createImageData(target.width,target.height),color=effect.shadowColor??[0,0,0,136];
   for(let y=0;y<target.height;y++)for(let x=0;x<target.width;x++){
    const at=(y*target.width+x)*4,a=switchShadowAlpha((x+.5)*fullWidth/target.width-fullWidth/2,(y+.5)*fullHeight/target.height-fullHeight/2,width,height,size,effect.radius??0,effect.shadowFunction??0);
    for(let c=0;c<3;c++)image.data[at+c]=color[c]??0;
    image.data[at+3]=a*(color[3]??255);
   }
   context.putImageData(image,0,0);
   const angle=effect.shadowAngle??0,distance=effect.shadowDistance??0;
   Object.assign(target.style,{left:`${-size+Math.cos(angle)*distance}px`,top:`${-size+Math.sin(angle)*distance}px`,width:`${fullWidth}px`,height:`${fullHeight}px`});
  };
  const observer=new ResizeObserver(paint);observer.observe(parent);paint();return()=>observer.disconnect();
 },[signature]);
 if(effect.shadowDraw===false||!effect.shadow)return null;
 return <span ref={host} data-nx-shadow-function={effect.shadowFunction??0} style={{position:'absolute',inset:0,pointerEvents:'none',opacity:alpha}}><svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}><defs><filter id={filterId} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA ref={volume} type="linear" slope={effect.shadowOpacity??1}/></feComponentTransfer></filter></defs></svg><canvas ref={canvas} aria-hidden="true" style={{position:'absolute',pointerEvents:'none',filter:`url(#${filterId})`}}/></span>;
}
