import {useAssets} from "../assets";
import {NAZARICK_CSS} from "./nazarickStyles";
export function NazarickBackdrop({page="home",motion=true}:{page?:string;motion?:boolean}){
 const assets=useAssets("nazarick");
 const key=page==="qam"?"settings":["library","search","game","achievements"].includes(page)?"library":["friends","community"].includes(page)?"friends":page;
 return <><style>{NAZARICK_CSS}</style><div className="naz-backdrop" data-motion={motion} data-wallpaper={key} key={key} style={{backgroundImage:assets[key]?`url("${assets[key]}")`:undefined}}/><div className="naz-vignette"/></>;
}
