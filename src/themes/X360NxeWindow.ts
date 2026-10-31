import {X360PageEra} from './X360PageEra';
import {useContext,useLayoutEffect,useRef} from 'react';

/** A fixed NXE window shell: content travels horizontally through the page stack. */
export function useNxeWindow(revision:string,enabled:boolean,popup=false,onExitStart?:()=>void){
 const era=useContext(X360PageEra);
 const ref=useRef<HTMLDivElement>(null),direction=useRef(1),closing=useRef(false);
 const animate=(back:boolean,exit=false)=>{
  const node=ref.current;
  if(!node||!enabled||matchMedia('(prefers-reduced-motion: reduce)').matches)return null;
  node.getAnimations().forEach(a=>a.cancel());
  const offset=back?-48:48;
  if(era==='kinect'){
   const dialog=node.closest('[data-kinect-page-kind="dialog"]');
   const closed=dialog?{opacity:0,transform:'translateY(12px) scale(.96)'}:{opacity:0,transform:`translateX(${exit?-40:back?-40:40}px)`};
   const open={opacity:1,transform:'translateX(0) scale(1)'};
   return node.animate(exit?[open,closed]:[closed,open],{duration:exit?160:220,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'});
  }
  if(popup){const shade=node.closest<HTMLElement>('[data-nxe-profile-popup]');shade?.getAnimations().forEach(a=>a.cancel());shade?.animate(exit?[{backgroundColor:'#000b'},{backgroundColor:'#0000'}]:[{backgroundColor:'#0000'},{backgroundColor:'#000b'}],{duration:150,easing:'ease-out',fill:'both'});}
  // At 9:35 the Profile shell unfolds horizontally from the right over its retained card.
  // The sampled video bounds span about 0.2 s; this is an approximation, not an extracted timeline.
  if(popup){const folded={opacity:0,transform:'translateX(112px) scaleX(.55) scaleY(.9)'},open={opacity:1,transform:'translateX(0) scaleX(1) scaleY(1)'};return node.animate(exit?[open,folded]:[folded,open],{duration:exit?180:220,easing:'cubic-bezier(.15,.7,.25,1)',fill:'both'});}
  return node.animate(exit?[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${back?48:-48}px)`}]:[{opacity:0,transform:`translateX(${offset}px)`},{opacity:1,transform:'translateX(0)'}],{duration:exit?150:210,easing:'cubic-bezier(.2,.65,.3,1)',fill:'both'});
 };
 useLayoutEffect(()=>{closing.current=false;if(ref.current)ref.current.style.pointerEvents='';animate(direction.current<0);},[revision,enabled]);
 useLayoutEffect(()=>()=>{ref.current?.getAnimations().forEach(a=>a.cancel());},[]);
 return {ref,isClosing:()=>closing.current,move:(back:boolean)=>{direction.current=back?-1:1;},close:(done:()=>void)=>{
  if(closing.current)return;closing.current=true;onExitStart?.();
  const animation=animate(true,true);
  if(animation){ref.current!.style.pointerEvents='none';animation.finished.then(done,()=>{closing.current=false;});}else done();
 }};
}
