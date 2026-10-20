import { CSSProperties, useEffect, useRef, useState } from "react";
import { backgroundMediaKind } from "./backgroundMedia";

/** Decorative video stays muted and pauses off-screen; GIFs remain animated images. */
export function BackgroundMedia({src,poster,paused=false,className,style,onError,...attributes}:{"data-dht-from-skin"?:string;src:string;poster?:string;paused?:boolean;className?:string;style?:CSSProperties;onError?:()=>void}) {
  const video=useRef<HTMLVideoElement>(null);
  const [loaded,setLoaded]=useState(false);
  const kind=backgroundMediaKind(src);
  useEffect(()=>{setLoaded(false);},[src]);
  useEffect(()=>{
    const el=video.current;
    if(!el||kind!=="video")return;
    const doc=el.ownerDocument,view=doc.defaultView;
    const reduced=view?.matchMedia("(prefers-reduced-motion: reduce)");
    let visible=true;
    const sync=()=>{
      if(paused||doc.hidden||reduced?.matches||!visible)el.pause();
      else {el.muted=true;el.play().catch(()=>{});}
    };
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync();});
    observer.observe(el);doc.addEventListener("visibilitychange",sync);reduced?.addEventListener("change",sync);el.addEventListener("loadeddata",sync);sync();
    return()=>{el.pause();observer.disconnect();doc.removeEventListener("visibilitychange",sync);reduced?.removeEventListener("change",sync);el.removeEventListener("loadeddata",sync);};
  },[kind,src,paused]);
  const surface:CSSProperties={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none",...style};
  if(kind!=="video")return <img {...attributes} src={src} className={className} alt="" aria-hidden draggable={false} style={surface} onError={onError}/>;
  return <><video {...attributes} autoPlay={!paused} ref={video} src={src} poster={poster} className={className} muted loop playsInline preload="auto" aria-hidden style={surface} onLoadedData={()=>setLoaded(true)} onError={onError}/>{poster&&!loaded&&<img src={poster} alt="" aria-hidden style={surface}/>}</>;
}

export function WallpaperVideo({src,style}:{src:string|null|undefined;style?:CSSProperties}){return src&&backgroundMediaKind(src)==="video"?<BackgroundMedia src={src} style={style}/>:null;}
