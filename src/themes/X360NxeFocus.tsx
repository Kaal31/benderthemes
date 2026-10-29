import {nxeFocusDuration,nxeReference} from './X360NxeReference';
import {useLayoutEffect,useRef,useState} from 'react';
/** ReLive btn_standard_list focuses the destination row with a linear opacity ramp. */
export function NxeFocus({selected,motion}:{selected:number;motion:boolean}){
 const ref=useRef<HTMLDivElement>(null),[box,setBox]=useState({top:0,height:0});
 useLayoutEffect(()=>{const node=ref.current;if(!node)return;
  node.getAnimations().forEach(a=>a.cancel());
  if(motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches)node.animate([{opacity:nxeReference.focus.fromOpacity},{opacity:nxeReference.focus.toOpacity}],{duration:nxeFocusDuration,easing:'linear'});
 },[selected,motion]);
 useLayoutEffect(()=>{const host=ref.current?.parentElement;if(!host)return;
 const measure=()=>{const row=host.querySelector<HTMLElement>('[aria-selected="true"], [data-selected="true"]');if(row)setBox({top:row.offsetTop,height:row.offsetHeight});};
 measure();const observer=new ResizeObserver(measure);observer.observe(host);return()=>observer.disconnect();},[selected]);
 return <div ref={ref} data-nxe-focus aria-hidden="true" style={{position:'absolute',left:nxeReference.focus.left*1280/nxeReference.canvas.width,right:0,top:0,height:box.height+nxeReference.focus.extraHeight*1.5,transform:`translateY(${box.top+nxeReference.focus.top*1.5}px)`,transition:'none',borderRadius:3,background:'linear-gradient(#d4ec98 0%,#9dce45 42%,#6aab13 55%,#83bd25 100%)',boxShadow:'inset 0 0 0 1px #d8ed9255',pointerEvents:'none'}}/>;
}
