import {useEffect,useRef,useState} from 'react';
import {HomeCtx,useHome} from '../common';
import {FrameHome} from '../engine/FrameHome';
import {Game,Library} from '../library';
import {pushModalInput} from '../input';
/** Reuse the live Home renderer, retaining the Library underneath for a precise return. */
export function WiiFlowLibraryPreview({game,rect,library,onClose}:{game:Game;rect:DOMRect;library:Library;onClose:()=>void}){
 const api=useHome(),root=useRef<HTMLDivElement>(null),flight=useRef<HTMLDivElement>(null),[ready,setReady]=useState(false),closing=useRef(false);
 const destination=useRef<{x:number;y:number;width:number;height:number;image:string}|undefined>(undefined),origin=useRef(rect);
 const animate=async(reverse=false)=>{const host=root.current!,node=flight.current!,target=destination.current!,bounds=host.getBoundingClientRect(),start=origin.current;
 const small={transform:`translate(${start.x-target.x}px,${start.y-target.y}px) scale(${start.width/target.width},${start.height/target.height})`,opacity:1},large={transform:'translate(0,0) scale(1)',opacity:1};
 node.getAnimations().forEach(a=>a.cancel());node.style.cssText=`position:absolute;left:${target.x-bounds.x}px;top:${target.y-bounds.y}px;width:${target.width}px;height:${target.height}px;transform-origin:0 0;z-index:2;pointer-events:none`;node.hidden=false;
 if(api.settings.animations)await node.animate(reverse?[large,small]:[small,large],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'}).finished.catch(()=>{});
 if(reverse)node.hidden=true;
 };
 const close=()=>{if(closing.current)return;closing.current=true;setReady(false);if(destination.current)void animate(true).then(onClose);else onClose();};
 useEffect(()=>{let cancelled=false,raf=0;const source=root.current?.parentElement?.querySelector('.dht-destination-row[data-selected=true] .dht-case-stage');
 const face=source?.querySelector('.dht-case-front');if(face)origin.current=face.getBoundingClientRect();
 const check=()=>{if(cancelled||closing.current)return;const shadow=root.current?.querySelector('[data-native-theme]')?.shadowRoot,model=shadow?.querySelector<HTMLElement>('[data-preview-model]')?.dataset.previewModel;
 if(!model){raf=requestAnimationFrame(check);return;}
 destination.current=JSON.parse(model);const image=new Image();image.src=destination.current!.image;image.style.cssText='width:100%;height:100%;display:block';
 void image.decode().then(async()=>{if(cancelled||closing.current)return;flight.current!.replaceChildren(image);await animate();if(cancelled||closing.current)return;setReady(true);
 const node=flight.current!;if(api.settings.animations)await node.animate([{opacity:1},{opacity:0}],{duration:120,fill:'forwards'}).finished.catch(()=>{});if(!cancelled)node.hidden=true;});
 };check();return()=>{cancelled=true;cancelAnimationFrame(raf);};},[]);
 useEffect(()=>pushModalInput(p=>{if(p.btn==='b'){close();return true;}return !ready;}),[ready]);
 return <div ref={root} data-wiiflow-library-preview style={{position:'absolute',inset:0,zIndex:90,background:ready?'#161a1e':'#161a1ed9'}}>
 <div style={{opacity:ready?1:0,transition:api.settings.animations?"opacity 120ms ease":"none",pointerEvents:ready?"auto":"none",position:"absolute",inset:0}}><HomeCtx.Provider value={{...api,busy:false,lib:{...library,games:library.all},settings:api.settings}}><FrameHome previewAppid={game.appid} onPreviewClose={close}/><button aria-label="Return to Library grid" onClick={close} style={{position:'absolute',right:20,top:16,zIndex:10,color:'white',background:'#273038',border:'1px solid #aebac4',borderRadius:4,padding:'8px 14px'}}>B · Library grid</button></HomeCtx.Provider></div>
 <div ref={flight} data-selected="true"/>
 </div>;
}
