import {CSSProperties,useEffect,useState} from "react";
import {BatteryGlyph,GameArt,Icon,IconName,MenuView,themeMenu,useHome,useMenu} from "../common";
import {Press,Stage,ThemeRoot,useStage} from "../input";
import {fmtLastPlayed,Game,openSteam} from "../library";
import {fmtTime,playSound,useBattery,useClock,useSteamStatus} from "../steam";
import {useAssets} from "../assets";
import {PAIN_CSS} from "./painStyles";
import {styleOf} from "../engine/themeStyles";
import {useReportFocus} from "../focus";
const PATHS:Record<string,[string,string]>={deva:["天道","TENDŌ"],asura:["修羅道","SHURADŌ"],human:["人間道","NINGENDŌ"],animal:["畜生道","CHIKUSHŌDŌ"],preta:["餓鬼道","GAKIDŌ"],naraka:["地獄道","JIGOKUDŌ"]};
const QUOTES:Record<string,[string[],string[]]>={world:[["すべての痛みは","世界をひとつにする"],["ALL PAIN","BRINGS THE WORLD","TOGETHER"]],know:[["痛みを感じろ","痛みを考えろ","痛みを受け取れ","痛みを知れ"],["FEEL PAIN","ACCEPT PAIN","KNOW PAIN"]],peace:[["痛みを知らぬ者に","平和は分からぬ"],["THOSE WHO DO NOT","KNOW PAIN CANNOT","KNOW PEACE"]]};
const SEALS:Record<string,number[][]>={four:[[255,12],[20,167],[480,291],[255,458]],six:[[255,18],[465,127],[465,344],[255,452],[45,344],[45,127]],bare:[]};
const NAV:{label:string;icon:IconName;place:"library"|"store"|"friends"|"downloads"|"settings"}[]=[{label:"Library",icon:"library",place:"library"},{label:"Store",icon:"store",place:"store"},{label:"Friends",icon:"friends",place:"friends"},{label:"Downloads",icon:"download",place:"downloads"},{label:"Settings",icon:"gear",place:"settings"}];
type Zone="hero"|"recent"|"installed"|"nav";
export function PainHome(){
 const api=useHome(),{settings:s,lib:{games}}=api,{W,H}=useStage(),assets=useAssets("pain"),menu=useMenu(),clock=useClock(),battery=useBattery(),status=useSteamStatus();
 const st=styleOf(s,"pain"),density=st<string>("density"),rows=st<string>("rows"),statusBar=st<string>("status"),rings=st<string>("rings"),path=PATHS[st<string>("path")]??PATHS.deva,quote=QUOTES[st<string>("quote")];
 const RP=density==="roomy"?4:density==="dense"?6:5,IP=RP-1;
 const [zone,setZone]=useState<Zone>("nav"),[nav,setNav]=useState(0),[selected,setSelected]=useState(0),[installedIndex,setInstalledIndex]=useState(0),[page,setPage]=useState(0),[heroAction,setHeroAction]=useState(0);
 const recent=rows==="installed"?[]:games.slice(1),installed=rows==="recent"?[]:games.filter(g=>g.installed);
 const [featuredId,setFeaturedId]=useState<number|null>(null);
 const [featuredSource,setFeaturedSource]=useState<"recent"|"installed">("recent");
 const featured=games.find(g=>g.appid===featuredId)??games[0];
 const focusRecent=(i:number)=>{setFeaturedSource("recent");setSelected(i);if(recent[i])setFeaturedId(recent[i].appid);};
 const focusInstalled=(i:number)=>{setFeaturedSource("installed");setInstalledIndex(i);if(installed[i])setFeaturedId(installed[i].appid);};
 const visible=recent.slice(page*RP,page*RP+RP),installedPage=Math.floor(installedIndex/IP),installedVisible=installed.slice(installedPage*IP,installedPage*IP+IP);
 const current=zone==="recent"?recent[selected]:zone==="installed"?installed[installedIndex]:featured;
 useReportFocus(zone==="nav"?undefined:current);
 useEffect(()=>{setSelected(i=>Math.min(i,Math.max(0,recent.length-1)));setInstalledIndex(i=>Math.min(i,Math.max(0,installed.length-1)));setPage(p=>Math.min(p,Math.max(0,Math.ceil(recent.length/RP)-1)));},[games.length,recent.length,installed.length,RP]);
 useEffect(()=>{setPage(Math.floor(selected/RP));},[RP]);
 const options=()=>menu.open([{label:"Presets",sub:()=>themeMenu()},{label:"Home Screen Settings",action:api.openSettings},{label:"Steam Home",action:api.showSteamHome}],"Six Paths");
 const launch=(g?:Game)=>{if(g)api.activate(g,()=>api.launch(g));};
 const cycle=()=>{if(recent.length<=RP)return;const next=(page+1)%Math.ceil(recent.length/RP);setPage(next);focusRecent(next*RP);setZone("recent");playSound("move");};
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
  else if(zone==="recent"){if(d<0&&selected===0)setZone("hero");else{const next=Math.max(0,Math.min(recent.length-1,selected+d));focusRecent(next);setPage(Math.floor(next/RP));}}
  else if(zone==="installed"){if(d<0&&installedIndex===0)setZone("hero");else focusInstalled(Math.max(0,Math.min(installed.length-1,installedIndex+d)));}
  return true;
 };
 const tile=(g:Game,i:number,kind:"recent"|"installed")=><button key={g.appid} className="pain-card" aria-label={`Play ${g.name}`} data-selected={kind==="recent"?selected===i:zone==="installed"&&installedIndex===i} data-focus={zone===kind&&(kind==="recent"?selected===i:installedIndex===i)} title={g.name} onMouseEnter={()=>{setZone(kind);kind==="recent"?focusRecent(i):focusInstalled(i);}} onFocus={()=>{setZone(kind);kind==="recent"?focusRecent(i):focusInstalled(i);}} onClick={()=>{setZone(kind);kind==="recent"?focusRecent(i):focusInstalled(i);launch(g);}}><GameArt flat g={g} kind={kind==="recent"?"portrait":"landscape"} style={{width:"100%",height:"100%",objectFit:"cover"}}/>{kind==="recent"&&i===selected&&<span className="pain-star">★</span>}</button>;
 return <ThemeRoot onInput={input} hints={{a:"Select",b:"Back",x:"Options",y:"Game options"}}><Stage background="#08070d"><style>{PAIN_CSS}{!s.animations?".pain-home *,.dht-menu--pain,.dht-destination[data-theme=pain],.dht-store[data-dht-store-skin=pain]{animation:none!important;transition:none!important}":""}</style><div className="pain-home" data-motion={s.animations&&!api.busy} data-palette={st("palette")} data-glow={st("glow")} data-ring={st("ringMotion")} data-rows={rows} data-status={statusBar} style={{transform:`scale(${W/1280},${H/800})`,backgroundImage:assets.background?`url("${assets.background}")`:undefined} as CSSProperties}>
 <header className="pain-top"><div className="pain-brand"><Icon name="steam" size={32}/><span>STEAM <b>DECK</b></span><i/></div><div className="pain-status">{statusBar!=="clock"&&<button aria-label="Search library" onClick={()=>openSteam("search")}><Icon name="search" size={20}/></button>}{statusBar!=="clock"&&<Icon name={status.online?"wifi":"network"} size={21}/>}{battery&&statusBar!=="clock"&&<span>{statusBar==="full"&&`${Math.round(battery.level*100)}% `}<BatteryGlyph level={battery.level} charging={battery.charging} color="#c69aef" w={25}/></span>}<time>{fmtTime(clock,s.clock24)}</time><button className="pain-avatar" aria-label="Player profile" onClick={()=>openSteam("friends")}>{status.avatar?<img src={status.avatar} alt=""/>:<Icon name="user" size={25}/>}<i data-online={status.online}/></button></div></header>
 <div className="pain-inscription" aria-hidden="true"><div><small>ペイン</small><strong>{path[0]}</strong></div><span>PAIN<br/>{path[1]}<br/>RIKKUDŌ</span></div>{quote&&<aside className="pain-quote" aria-hidden="true"><div>{quote[0].map((l,i)=><span key={i}>{i>0&&<br/>}{l}</span>)}</div><small>{quote[1].map((l,i)=><span key={i}>{i>0&&<br/>}{l}</span>)}</small></aside>}
 <section className="pain-feature" aria-label="Featured game">{rings!=="none"&&<svg className="pain-orbits" viewBox="0 0 510 470" aria-hidden="true"><ellipse cx="255" cy="235" rx="250" ry="224"/><ellipse cx="255" cy="235" rx="236" ry="211"/><ellipse className="pain-orbit-light" cx="255" cy="235" rx="242" ry="217" pathLength="100" strokeDasharray="16 9 12 19 18 26"/>{(SEALS[rings]??SEALS.four).map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="15"/><path className="pain-orbit-symbol" aria-label="遠" transform={`translate(${x-10} ${y-10})`} d="M8 3H19M13 1V6M6 6H20M8 9H18V13H8ZM13 13V20M12 14L6 18M15 14L20 19M17 16L20 14M1 2L4 5M1 9H4V16L1 19M4 16Q8 21 20 20"/></g>)}</svg>}<div className="pain-feature-disc">{featured?<><div className="pain-feature-art" key={featured.appid}><GameArt flat g={featured} kind="hero" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><div className="pain-feature-shade"/><p className="pain-eyebrow">{featuredSource==="installed"?"INSTALLED GAME":"RECENT GAME"}</p><div className="pain-feature-logo"><GameArt flat g={featured} kind="logo" logoFallback={<span className="pain-logo-name">{featured.name}</span>} style={{width:"100%",height:"100%",objectFit:"contain"}}/></div><div className="pain-feature-name"><strong>{featured.name}</strong><small>LAST PLAYED <b>{fmtLastPlayed(featured.lastPlayed)}</b></small></div><div className="pain-feature-actions"><button data-focus={zone==="hero"&&heroAction===0} onClick={()=>launch(featured)}><Icon name="play" size={21}/>Play Game</button><button aria-label="Featured game options" data-focus={zone==="hero"&&heroAction===1} onClick={()=>api.nativeMenu(featured)}><Icon name="dots" size={22}/></button></div></>:<div className="pain-empty">Your library awaits<button onClick={api.openSettings}>Choose library source</button></div>}</div></section>
 {rows!=="installed"&&<section className="pain-recent" aria-label="Recent games"><h2>RECENT GAMES</h2><div className="pain-recent-row" key={page} style={{gridTemplateColumns:`repeat(${RP},1fr)`}}>{visible.map((g,i)=>tile(g,page*5+i,"recent"))}</div>{!recent.length&&<p className="pain-no-games">More games will appear here.</p>}<button className="pain-next" disabled={recent.length<=RP} aria-label="Next recent games" onClick={cycle}>›</button></section>}
 {rows!=="recent"&&<section className="pain-installed" aria-label="Installed games"><h2>INSTALLED GAMES</h2><div className="pain-installed-row" key={installedPage} style={{gridTemplateColumns:`repeat(${IP},1fr)`}}>{installedVisible.map((g,i)=>tile(g,installedPage*IP+i,"installed"))}</div>{!installed.length&&<p className="pain-no-games">No installed games.</p>}</section>}
 <nav className="pain-nav" aria-label="Main navigation">{NAV.map((it,i)=><button key={it.place} data-selected={nav===i} data-focus={zone==="nav"&&nav===i} onFocus={()=>{setNav(i);setZone("nav");}} onClick={()=>{setNav(i);setZone("nav");openSteam(it.place);}}><span><Icon name={it.icon} size={27}/></span><b>{it.label}</b></button>)}</nav>
 </div><MenuView menu={menu} variant="pain"/></Stage></ThemeRoot>;
}
