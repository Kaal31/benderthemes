import {useEffect,useState} from "react";
import {useAssets} from "../assets";
import {NAZARICK_CSS} from "./nazarickStyles";
import {BackgroundMedia} from "../WallpaperMedia";
import {useWallpaper} from "../steam";
import {getSettings,Settings} from "../settings";
const preloaded=new WeakSet<object>();
export function NazarickBackdrop({page="home",settings=getSettings()}:{page?:string;motion?:boolean;settings?:Settings}){
 const assets=useAssets("nazarick");
 const override=useWallpaper("nazarick",{raw:true,settings,gameArt:false,page});
 const [failed,setFailed]=useState<string|null>(null);
 useEffect(()=>{if(preloaded.has(assets))return;preloaded.add(assets);Object.entries(assets).filter(([name])=>!name.endsWith("-video")).forEach(([,src])=>{const image=new Image();image.src=src;image.decode?.().catch(()=>{});});},[assets]);
 const key=page==="qam"?"settings":["library","search","game","achievements"].includes(page)?"library":["friends","community"].includes(page)?"friends":page;
 const source=override&&override!==failed?override:assets[`${key}-video`];
 return <><style>{NAZARICK_CSS}</style><div className="naz-backdrop" data-motion={false} data-wallpaper={key} key={key} style={{backgroundImage:assets[key]?`url("${assets[key]}")`:undefined}}/>{source&&<BackgroundMedia src={source} mediaKind={override&&override!==failed?undefined:"video"} poster={assets[key]} className="naz-backdrop naz-backdrop-video" paused={settings.videoBackgrounds.nazarick===false} style={{filter:`brightness(${settings.bgBrightness/100})`}} onError={()=>{if(override)setFailed(override);}}/>}<div className="naz-vignette"/></>;
}

