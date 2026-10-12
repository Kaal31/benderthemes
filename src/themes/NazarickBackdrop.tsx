import {useEffect,useRef} from "react";
import {useAssets} from "../assets";
import {NAZARICK_CSS} from "./nazarickStyles";
const preloaded=new WeakSet<object>();
export function NazarickBackdrop({page="home",motion=true}:{page?:string;motion?:boolean}){
 const assets=useAssets("nazarick"),video=useRef<HTMLVideoElement>(null);
 useEffect(()=>{const el=video.current;if(!el)return;if(motion)el.play().catch(()=>{});else el.pause();},[motion,assets]);
 useEffect(()=>{if(preloaded.has(assets))return;preloaded.add(assets);Object.entries(assets).filter(([name])=>!name.endsWith("-video")).forEach(([,src])=>{const image=new Image();image.src=src;image.decode?.().catch(()=>{});});},[assets]);
 const key=page==="qam"?"settings":["library","search","game","achievements"].includes(page)?"library":["friends","community"].includes(page)?"friends":page;
 return <><style>{NAZARICK_CSS}</style><div className="naz-backdrop" data-motion={false} data-wallpaper={key} key={key} style={{backgroundImage:assets[key]?`url("${assets[key]}")`:undefined}}/>{assets[`${key}-video`]&&<video ref={video} className="naz-backdrop naz-backdrop-video" src={assets[`${key}-video`]} poster={assets[key]} autoPlay={motion} loop muted playsInline preload="auto" aria-hidden="true" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}<div className="naz-vignette"/></>;
}
