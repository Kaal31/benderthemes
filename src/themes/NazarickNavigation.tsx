import {BatteryGlyph,Icon} from "../common";
import {useStage} from "../input";
import {Settings} from "../settings";
import {fmtTime,useBattery,useClock,useSteamStatus,userName} from "../steam";
import {useAssets} from "../assets";
export const NAZARICK_PAGES=["home","library","store","friends","downloads","settings"] as const;
export type NazarickPage=typeof NAZARICK_PAGES[number];
export function nazarickPage(page:string):NazarickPage{return page==="qam"?"settings":["game","search","achievements"].includes(page)?"library":NAZARICK_PAGES.includes(page as NazarickPage)?page as NazarickPage:"home";}
export function nextNazarickPage(page:string,direction:number){return NAZARICK_PAGES[(NAZARICK_PAGES.indexOf(nazarickPage(page))+direction+6)%6];}
export function NazarickNavigation({page,settings,onNavigate}:{page:string;settings:Settings;onNavigate:(page:NazarickPage)=>void}){
 const {W,H}=useStage(),assets=useAssets("nazarick"),clock=useClock(),battery=useBattery(),status=useSteamStatus();
 return <div className="naz-page-header" style={{transform:`scale(${W/1536},${H/864})`}}><header className="naz-top"><button className="naz-profile" onClick={()=>onNavigate("friends")}><span className="naz-profile-seal" style={assets.home?{backgroundImage:`url("${assets.home}")`,backgroundSize:"980px auto",backgroundPosition:"60% 16%"}:undefined}/><span>{userName()}<small>Supreme Ruler of Nazarick</small><small className="naz-online">● {status.online?"Online":"Offline"}</small></span></button><nav aria-label="Nazarick categories">{NAZARICK_PAGES.map(p=><button key={p} aria-current={nazarickPage(page)===p?"page":undefined} data-active={nazarickPage(page)===p} onClick={()=>onNavigate(p)}>{p}</button>)}</nav><div className="naz-status"><Icon name={status.online?"wifi":"network"} size={23}/>{battery&&<span><BatteryGlyph level={battery.level} charging={battery.charging} w={30}/> {Math.round(battery.level*100)}%</span>}<time>{fmtTime(clock,settings.clock24)}</time></div></header></div>;
}
