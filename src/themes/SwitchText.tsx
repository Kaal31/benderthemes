import {useLayoutEffect,useRef,useState} from 'react';
import {useSwitchFont} from './useSwitchFont';
import type {SwitchScenePane} from './switchSceneTypes';

/** Text bounds and alignment are local to the pane; ancestors supply scaling. */
export function SwitchText({text,metrics,enabled=false,marquee=false,multiline=false}:{text:string;metrics?:SwitchScenePane['text'];enabled?:boolean;marquee?:boolean;multiline?:boolean}){
 const {family,cellRatio}=useSwitchFont();
 const fontWidth=metrics?.fontSize[0]??24,cellHeight=metrics?.fontSize[1]??fontWidth*cellRatio,glyphScaleY=fontWidth>0?cellHeight/(fontWidth*cellRatio):1;
 const viewport=useRef<HTMLSpanElement>(null),ink=useRef<HTMLSpanElement>(null),[overflow,setOverflow]=useState(false);
 const horizontal=(metrics?.alignment??0)&3,vertical=((metrics?.alignment??0)>>2)&3;
 useLayoutEffect(()=>{
  const outer=viewport.current,inner=ink.current;if(!outer||!inner)return;
  let animation:Animation|undefined,disposed=false;
  const update=()=>{
   animation?.cancel();animation=undefined;
   const distance=Math.max(0,inner.scrollWidth-outer.clientWidth);setOverflow(distance>1);
   if(marquee&&enabled&&distance>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const hold=1500,travel=distance/40*1000,duration=2*hold+travel;
    animation=inner.animate([{transform:'translateX(0)',offset:0},{transform:'translateX(0)',offset:hold/duration},{transform:`translateX(${-distance}px)`,offset:(hold+travel)/duration},{transform:`translateX(${-distance}px)`,offset:1}],{duration,iterations:Infinity,easing:'linear'});
   }
  };
  const observer=new ResizeObserver(update);observer.observe(outer);observer.observe(inner);update();
  void document.fonts?.ready.then(()=>{if(!disposed)update();});
  return()=>{disposed=true;observer.disconnect();animation?.cancel();};
 },[text,metrics,enabled,marquee]);
 return <span ref={viewport} data-nx-text-viewport="" style={{position:'absolute',inset:0,display:'flex',overflow:'hidden',alignItems:vertical===1?'flex-start':vertical===2?'flex-end':'center',justifyContent:overflow?'flex-start':horizontal===1?'flex-start':horizontal===2?'flex-end':'center',color:'white'}}>
  <span ref={ink} data-nx-text-ink="" style={{display:'block',flexShrink:0,width:multiline?'100%':'max-content',maxWidth:multiline?'100%':undefined,whiteSpace:multiline?'pre-wrap':'pre',fontFamily:family,fontSize:fontWidth,lineHeight:`${cellHeight+(multiline?(metrics?.lineSpace??0):0)}px`,letterSpacing:metrics?.characterSpace??0,textAlign:metrics?.lineAlignment===1?'left':metrics?.lineAlignment===3?'right':'center'}}><span data-nx-text-glyphs="" style={{display:'inline-block',transform:`scaleY(${glyphScaleY})`,transformOrigin:'center'}}>{text}</span></span>
 </span>;
}
