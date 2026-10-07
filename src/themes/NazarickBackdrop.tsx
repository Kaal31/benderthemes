import {useEffect} from "react";
import {useAssets} from "../assets";
import {NAZARICK_CSS} from "./nazarickStyles";
const preloaded=new WeakSet<object>();
export function NazarickBackdrop({page="home"}:{page?:string;motion?:boolean}){
 const assets=useAssets("nazarick");
 useEffect(()=>{if(preloaded.has(assets))return;preloaded.add(assets);Object.values(assets).forEach(src=>{const image=new Image();image.src=src;image.decode?.().catch(()=>{});});},[assets]);
 const key=page==="qam"?"settings":["library","search","game","achievements"].includes(page)?"library":["friends","community"].includes(page)?"friends":page;
 return <><style>{NAZARICK_CSS}</style><div className="naz-backdrop" data-motion={false} data-wallpaper={key} key={key} style={{backgroundImage:assets[key]?`url("${assets[key]}")`:undefined}}/><div className="naz-vignette"/></>;
}
