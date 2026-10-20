import {useContext,useEffect,useMemo,useRef,useState} from 'react';
import type {ReactNode} from 'react';
import {SwitchPicture} from './SwitchPicture';
import {SwitchTextureMotionContext} from './switchTextureMotion';
/** Host images use the same native UV sampler as imported BNTX pictures. */
export function SwitchTexture({children,enabled}:{children:ReactNode;enabled:boolean}){
 const motion=useContext(SwitchTextureMotionContext),active=enabled&&motion.channels!==0;
 const host=useRef<HTMLSpanElement>(null),[source,setSource]=useState(''),[ready,setReady]=useState(false);
 useEffect(()=>{
  if(!active){setSource('');setReady(false);return;}
  const node=host.current;if(!node)return;
  const update=()=>{
   const image=node.querySelector('img');
   setSource(image?.complete&&image.naturalWidth?(image.currentSrc||image.src):'');
   setReady(node.querySelector('[data-nx-picture-status]')?.getAttribute('data-nx-picture-status')==='ready');
  };
  const observer=new MutationObserver(update);observer.observe(node,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset','data-nx-picture-status']});
  node.addEventListener('load',update,true);node.addEventListener('error',update,true);update();
  return()=>{observer.disconnect();node.removeEventListener('load',update,true);node.removeEventListener('error',update,true);};
 },[active]);
 const picture=useMemo(()=>({source,texture:'host-image',material:'host-image',uv:[0,0,1,0,0,1,1,1],transform:[0,0,0,1,1],wrapS:0,wrapT:4}),[source]);
 return <span ref={host} style={{display:'inline-flex',position:'relative',width:'100%',height:'100%'}}><span style={{display:'inline-flex',width:'100%',height:'100%',alignItems:'center',justifyContent:'center',opacity:ready?0:undefined}}>{children}</span>{active&&source&&<span data-nx-uv-texture="" style={{position:'absolute',inset:0,pointerEvents:'none'}}><SwitchPicture picture={picture}/></span>}</span>;
}
