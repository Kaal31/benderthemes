import {CSSProperties,useEffect,useState} from "react";
import {BatteryGlyph,GameArt,Icon,IconName,MenuView,themeMenu,useHome,useMenu} from "../common";
import {Press,Stage,ThemeRoot,useStage} from "../input";
import {fmtLastPlayed,Game,openSteam} from "../library";
import {fmtTime,playSound,useBattery,useClock,useSteamStatus} from "../steam";
import {useAssets} from "../assets";
import {PAIN_CSS} from "./painStyles";
const NAV:{label:string;icon:IconName;place:"library"|"store"|"friends"|"downloads"|"settings"}[]=[{label:"Library",icon:"library",place:"library"},{label:"Store",icon:"store",place:"store"},{label:"Friends",icon:"friends",place:"friends"},{label:"Downloads",icon:"download",place:"downloads"},{label:"Settings",icon:"gear",place:"settings"}];
type Zone="hero"|"recent"|"installed"|"nav";
export function PainHome(){
 const api=useHome(),{settings:s,lib:{games}}=api,{W,H}=useStage(),assets=useAssets("pain"),menu=useMenu(),clock=useClock(),battery=useBattery(),status=useSteamStatus();
 const [zone,setZone]=useState<Zone>("nav"),[nav,setNav]=useState(0),[selected,setSelected]=useState(0),[installedIndex,setInstalledIndex]=useState(0),[page,setPage]=useState(0),[heroAction,setHeroAction]=useState(0);
 const recent=games.slice(1),installed=games.filter(g=>g.installed);
 const [featuredId,setFeaturedId]=useState<number|null>(null);
 const [featuredSource,setFeaturedSource]=useState<"recent"|"installed">("recent");
 const featured=games.find(g=>g.appid===featuredId)??games[0];
 const focusRecent=(i:number)=>{setFeaturedSource("recent");setSelected(i);if(recent[i])setFeaturedId(recent[i].appid);};
 const focusInstalled=(i:number)=>{setFeaturedSource("installed");setInstalledIndex(i);if(installed[i])setFeaturedId(installed[i].appid);};
 const visible=recent.slice(page*5,page*5+5),installedPage=Math.floor(installedIndex/4),installedVisible=installed.slice(installedPage*4,installedPage*4+4);
 const current=zone==="recent"?recent[selected]:zone==="installed"?installed[installedIndex]:featured;
 useEffect(()=>{setSelected(i=>Math.min(i,Math.max(0,recent.length-1)));setInstalledIndex(i=>Math.min(i,Math.max(0,installed.length-1)));setPage(p=>Math.min(p,Math.max(0,Math.ceil(recent.length/5)-1)));},[games.length,installed.length]);
 const options=()=>menu.open([{label:"Presets",sub:()=>themeMenu()},{label:"Home Screen Settings",action:api.openSettings},{label:"Steam Home",action:api.showSteamHome}],"Six Paths");
 const launch=(g?:Game)=>{if(g)api.activate(g,()=>api.launch(g));};
 const cycle=()=>{if(recent.length<=5)return;const next=(page+1)%Math.ceil(recent.length/5);setPage(next);focusRecent(next*5);setZone("recent");playSound("move");};
 const input=(p:Press)=>{
  if(menu.handle(p))return true;
  if(p.btn==="menu"||p.btn==="x"){options();return true;}
  if(p.btn==="y"){if(current)api.nativeMenu(current);return true;}
  if(p.btn==="b"){setZone("nav");playSound("back");return true;}
  if(p.btn==="a"){if(zone==="nav")openSteam(NAV[nav].place);else if(zone==="hero"&&heroAction===1){if(featured)api.nativeMenu(featured);}else launch(current);return true;}
  if(!["left","right","up","down"].includes(p.btn))return false;
  playSound("move");
  if(p.btn==="up"){if(zone==="nav"&&installed.length)focusInstalled(installedIndex);if(zone==="installed"&&recent.length)focusRecent(selected);setZone(zone==="nav"?(installed.length?"installed":"hero"):zone==="installed"?(recent.length?"recent":"hero"):"hero");return true;}
  if(p.btn==="down"){if(zone==="hero"&&recent.length)focusRecent(selected);if(zone==="recent"&&installed.length)focusInstalled(installedIndex);setZone(zone==="hero"?(recent.length?"recent":"nav"):zone==="recent"?(installed.length?"installed":"nav"):"nav");return true;}
  const d=p.btn==="left"?-1:1;
  if(zone==="nav")setNav(i=>Math.max(0,Math.min(4,i+d)));
  else if(zone==="hero"){if(d>0&&heroAction===1&&recent.length){focusRecent(selected);setZone("recent");}else setHeroAction(i=>Math.max(0,Math.min(1,i+d)));}
  else if(zone==="recent"){if(d<0&&selected===0)setZone("hero");else{const next=Math.max(0,Math.min(recent.length-1,selected+d));focusRecent(next);setPage(Math.floor(next/5));}}
  else if(zone==="installed"){if(d<0&&installedIndex===0)setZone("hero");else focusInstalled(Math.max(0,Math.min(installed.length-1,installedIndex+d)));}
  return true;
 };
 const tile=(g:Game,i:number,kind:"recent"|"installed")=><button key={g.appid} className="pain-card" aria-label={`Play ${g.name}`} data-selected={kind==="recent"?selected===i:zone==="installed"&&installedIndex===i} data-focus={zone===kind&&(kind==="recent"?selected===i:installedIndex===i)} title={g.name} onMouseEnter={()=>{setZone(kind);kind==="recent"?focusRecent(i):focusInstalled(i);}} onFocus={()=>{setZone(kind);kind==="recent"?focusRecent(i):focusInstalled(i);}} onClick={()=>{setZone(kind);kind==="recent"?focusRecent(i):focusInstalled(i);launch(g);}}><GameArt flat g={g} kind={kind==="recent"?"portrait":"landscape"} style={{width:"100%",height:"100%",objectFit:"cover"}}/>{kind==="recent"&&i===selected&&<span className="pain-star">★</span>}</button>;
 return <ThemeRoot onInput={input} hints={{a:"Select",b:"Back",x:"Options",y:"Game options"}}><Stage background="#08070d"><style>{PAIN_CSS}{!s.animations?".pain-home *,.dht-menu--pain,.dht-destination[data-theme=pain],.dht-store[data-dht-store-skin=pain]{animation:none!important;transition:none!important}":""}</style><div className="pain-home" data-motion={s.animations&&!api.busy} style={{transform:`scale(${W/1280},${H/800})`,backgroundImage:assets.background?`url("${assets.background}")`:undefined} as CSSProperties}>
 <header className="pain-top"><div className="pain-brand"><Icon name="steam" size={32}/><span>STEAM <b>DECK</b></span><i/></div><div className="pain-status"><button aria-label="Search library" onClick={()=>openSteam("search")}><Icon name="search" size={20}/></button><Icon name={status.online?"wifi":"network"} size={21}/>{battery&&<span>{Math.round(battery.level*100)}% <BatteryGlyph level={battery.level} charging={battery.charging} color="#c69aef" w={25}/></span>}<time>{fmtTime(clock,s.clock24)}</time><button className="pain-avatar" aria-label="Player profile" onClick={()=>openSteam("friends")}>{status.avatar?<img src={status.avatar} alt=""/>:<Icon name="user" size={25}/>}<i data-online={status.online}/></button></div></header>
 <div className="pain-inscription" aria-hidden="true"><div><small>ペイン</small><strong>天道</strong></div><span>PAIN<br/>TENDŌ<br/>RIKKUDŌ</span></div><aside className="pain-quote" aria-hidden="true"><div>すべての痛みは<br/>世界をひとつにする</div><small>ALL PAIN<br/>BRINGS THE WORLD<br/>TOGETHER</small></aside>
 <section className="pain-feature" aria-label="Featured game"><svg className="pain-orbits" viewBox="0 0 510 470" aria-hidden="true"><ellipse cx="255" cy="235" rx="250" ry="224"/><ellipse cx="255" cy="235" rx="236" ry="211"/><ellipse className="pain-orbit-light" cx="255" cy="235" rx="242" ry="217" pathLength="100" strokeDasharray="16 9 12 19 18 26"/>{[[255,12],[20,167],[480,291],[255,458]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="15"/><path className="pain-orbit-symbol" aria-label="遠" transform={`translate(${x-10} ${y-10})`} d="M8 3H19M13 1V6M6 6H20M8 9H18V13H8ZM13 13V20M12 14L6 18M15 14L20 19M17 16L20 14M1 2L4 5M1 9H4V16L1 19M4 16Q8 21 20 20"/></g>)}</svg><div className="pain-feature-disc">{featured?<><div className="pain-feature-art" key={featured.appid}><GameArt flat g={featured} kind="hero" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><div className="pain-feature-shade"/><p className="pain-eyebrow">{featuredSource==="installed"?"INSTALLED GAME":"RECENT GAME"}</p><div className="pain-feature-logo"><GameArt flat g={featured} kind="logo" logoFallback={<span className="pain-logo-name">{featured.name}</span>} style={{width:"100%",height:"100%",objectFit:"contain"}}/></div><div className="pain-feature-name"><strong>{featured.name}</strong><small>LAST PLAYED <b>{fmtLastPlayed(featured.lastPlayed)}</b></small></div><div className="pain-feature-actions"><button data-focus={zone==="hero"&&heroAction===0} onClick={()=>launch(featured)}><Icon name="play" size={21}/>Play Game</button><button aria-label="Featured game options" data-focus={zone==="hero"&&heroAction===1} onClick={()=>api.nativeMenu(featured)}><Icon name="dots" size={22}/></button></div></>:<div className="pain-empty">Your library awaits<button onClick={api.openSettings}>Choose library source</button></div>}</div></section>
 <section className="pain-recent" aria-label="Recent games"><h2>RECENT GAMES</h2><div className="pain-recent-row" key={page}>{visible.map((g,i)=>tile(g,page*5+i,"recent"))}</div>{!recent.length&&<p className="pain-no-games">More games will appear here.</p>}<button className="pain-next" disabled={recent.length<=5} aria-label="Next recent games" onClick={cycle}>›</button></section>
 <section className="pain-installed" aria-label="Installed games"><h2>INSTALLED GAMES</h2><div className="pain-installed-row" key={installedPage}>{installedVisible.map((g,i)=>tile(g,installedPage*4+i,"installed"))}</div>{!installed.length&&<p className="pain-no-games">No installed games.</p>}</section>
 <nav className="pain-nav" aria-label="Main navigation">{NAV.map((it,i)=><button key={it.place} data-selected={nav===i} data-focus={zone==="nav"&&nav===i} onFocus={()=>{setNav(i);setZone("nav");}} onClick={()=>{setNav(i);setZone("nav");openSteam(it.place);}}><span><Icon name={it.icon} size={27}/></span><b>{it.label}</b></button>)}</nav>
 </div><MenuView menu={menu} variant="pain"/></Stage></ThemeRoot>;
}
