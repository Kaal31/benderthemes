import {useEffect,useRef,useState} from "react";

/** Swap only after loading, and never retry a broken fallback on every render. */
export function WiiuProfileImage({urls}:{urls:(string|undefined)[]}){
 const sources=JSON.stringify([...new Set(urls.filter((url):url is string=>!!url))]);
 const failed=useRef(new Set<string>()),[shown,setShown]=useState<string>();
 useEffect(()=>{
  let active=true,image:HTMLImageElement|undefined,index=0;
  const candidates=JSON.parse(sources) as string[];
  const next=()=>{
   let url:string|undefined;
   while(index<candidates.length){const candidate=candidates[index++];if(!failed.current.has(candidate)){url=candidate;break;}}
   if(!url){if(active)setShown(undefined);return;}
   const candidate=url;
   image=new Image();
   image.onload=()=>{if(active)setShown(candidate);};
   image.onerror=()=>{if(active){failed.current.add(candidate);next();}};
   image.src=candidate;
  };
  next();
  return()=>{active=false;if(image){image.onload=null;image.onerror=null;}};
 },[sources]);
 return shown?<img src={shown} alt="" draggable={false}/>:<svg className="nt-profile-placeholder" viewBox="0 0 48 56" aria-hidden="true"><circle cx="24" cy="16" r="10" fill="currentColor"/><path d="M5 53V43a19 19 0 0 1 38 0v10Z" fill="currentColor"/></svg>;
}
