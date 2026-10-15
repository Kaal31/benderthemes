import {CSSProperties, PointerEvent, useEffect, useRef, useState} from "react";
import {BatteryGlyph, GameArt, Icon, IconName, MenuView, useHome, useMenu} from "../common";
import {Press, Stage, ThemeRoot, useStage} from "../input";
import {fmtLastPlayed, openSteam} from "../library";
import {fmtTime, playSound, useBattery, useClock, useSteamStatus} from "../steam";
import {useReportFocus} from "../focus";
import {SILVER_REFERENCE as REF} from "./silverReference";
import {styleOf} from "../engine/themeStyles";
import {musicPlayer,useMusic,usePlayer,fmtClock,useFullMusicPlayer} from "../musicPlayer";
import {ONYX_REFERENCE} from "./onyxReference";
import {ONYX_CSS} from "./onyxStyles";
import {SILVER_CSS} from "./silverStyles";
import {subscribeSilverPad} from "./silverPad";
import {advanceWheel, WheelState} from "./silverWheel";
const ONYX_PAGES=["Now Playing","Games","Library","Discover","More"];
const NAV: {label:string;icon:IconName;action:"library"|"store"|"friends"|"settings"}[] = [
 {label:"Library",icon:"library",action:"library"},{label:"Discover",icon:"store",action:"store"},
 {label:"Friends",icon:"friends",action:"friends"},{label:"Settings",icon:"gear",action:"settings"}
];
function ReferenceIcon({name,size=24}:{name:IconName;size?:number}){
 const src=(REF as Partial<Record<IconName,string>>)[name];
 return src?<img src={src} alt="" style={{width:size,height:size,objectFit:"contain"}}/>:<Icon name={name} size={size}/>;
}
export function SilverHome({dark=false}:{dark?:boolean}={}){
 const [panelLight,setPanelLight]=useState<"home"|"steam"|null>(null);
 const [panelOpen,setPanelOpen]=useState(false),[panelPinned,setPanelPinned]=useState(false);
 const [page,setPage]=useState("Games");
 useFullMusicPlayer(dark&&page==="Now Playing");
 const screenRef=useRef<HTMLDivElement>(null),pageCursor=useRef(-1);
 useEffect(()=>{pageCursor.current=-1;screenRef.current?.querySelectorAll("[data-wheel-focus]").forEach(el=>el.removeAttribute("data-wheel-focus"));},[page]);
 const albums=useMusic(),player=usePlayer();

 const art=dark?{...REF,metal:ONYX_REFERENCE.body,wheel:ONYX_REFERENCE.wheel}:REF;
 const api=useHome(),{lib:{games},settings:s}=api,{W,H}=useStage(),menu=useMenu(),battery=useBattery(),clock=useClock(),status=useSteamStatus();
 const carousel=dark?styleOf(api.settings,"onyx")<string>("carousel"):"covers";
 const iconFlow=carousel==="icons",squareFlow=carousel!=="covers";
 const [selected,setSelected]=useState(0),[zone,setZone]=useState<"games"|"nav">("games"),[nav,setNav]=useState(0),[pressed,setPressed]=useState<string|null>(null);
 const gesture=useRef<WheelState>({angle:null,remainder:0}),drag=useRef<number|null>(null),moved=useRef(false),origin=useRef({x:0,y:0}),tapZone=useRef<string|null>(null);
 const index=games.length?Math.min(selected,games.length-1):0,game=games[index];
 useReportFocus(zone==="games"?game:undefined);
 useEffect(()=>{setSelected(i=>Math.min(i,Math.max(0,games.length-1)));},[games.length]);
 const blocked=api.busy||menu.isOpen;
 const step=(d:number)=>{if(dark&&page==="Now Playing"){if(!blocked)musicPlayer.seek(d*5);return;}if(dark&&page!=="Games"){
   if(blocked)return;
   const selector=page==="Now Playing"?".onyx-albums button":page==="Library"?".onyx-library button":page==="Discover"?".onyx-discover button":".onyx-more button";
   const items=Array.from(screenRef.current?.querySelectorAll<HTMLButtonElement>(selector)??[]);
   if(!items.length)return;
   const next=pageCursor.current<0?(d>0?0:items.length-1):(pageCursor.current+d%items.length+items.length)%items.length;
   items.forEach(el=>el.removeAttribute("data-wheel-focus"));pageCursor.current=next;
   const item=items[next];item.setAttribute("data-wheel-focus","true");item.focus({preventScroll:true});item.scrollIntoView({block:"nearest",inline:"nearest",behavior:"auto"});playSound("move");return;
  }if(blocked||games.length<2)return;setZone("games");setSelected(i=>(i+d%games.length+games.length)%games.length);playSound("move");};
 const stepRef=useRef(step);stepRef.current=step;
 const scroll=useRef({amount:0,queue:0,last:0,timer:null as ReturnType<typeof setTimeout>|null});
 useEffect(()=>()=>{if(scroll.current.timer)clearTimeout(scroll.current.timer);scroll.current={amount:0,queue:0,last:0,timer:null};},[blocked,page,carousel,s.animations]);
 const scrollCovers=(delta:number,mode:number)=>{
  if(!dark){step(delta>0?1:delta<0?-1:0);return;}
  if(!delta||blocked)return;
  const state=scroll.current,now=performance.now(),pixels=delta*(mode===1?16:mode===2?80:1);
  if(now-state.last>180||Math.sign(pixels)!==Math.sign(state.amount))state.amount=0;
  if(state.queue&&Math.sign(pixels)!==Math.sign(state.queue))state.queue=0;
  state.last=now;state.amount+=pixels;
  const n=Math.trunc(state.amount/80);if(!n)return;
  state.amount-=n*80;state.queue=Math.max(-6,Math.min(6,state.queue+n));
  const advance=()=>{
   if(!state.queue){state.timer=null;return;}
   const direction=Math.sign(state.queue);state.queue-=direction;stepRef.current(direction);
   state.timer=setTimeout(advance,s.animations?500:16);
  };
  if(!state.timer)advance();
 };

 useEffect(()=>{
  if(blocked)return;
  let stop=()=>{};
  const start=setTimeout(()=>{stop=subscribeSilverPad(d=>stepRef.current(d), (x,y)=>touchRef.current(x,y));},350);
  return ()=>{clearTimeout(start);stop();};
 },[blocked]);
 const launch=()=>{if(dark&&page==="Now Playing"){musicPlayer.toggle();return;}if(dark&&page!=="Games"){
  const focused=screenRef.current?.querySelector<HTMLButtonElement>("[data-wheel-focus=true]");
  if(focused)focused.click();else if(page==="Now Playing")musicPlayer.toggle();return;
 }if(game&&!blocked)api.activate(game,()=>api.launch(game));};
 const options=()=>menu.open([{label:"Home Screen Settings",action:api.openSettings},{label:"Steam Home",action:api.showSteamHome}],"Silver Wheel");
 const showLeftMenu=()=>{if(dark){playSound("tab");setPage(current=>ONYX_PAGES[(ONYX_PAGES.indexOf(current)+1)%ONYX_PAGES.length]);return;}setPanelLight("steam");setPanelPinned(p=>!p);setPanelOpen(true);setZone("nav");setNav(0);};
 useEffect(()=>{
  if(!(window as any).__isThemePreview)return;
  const press=()=>showLeftMenu();
  window.addEventListener("preview-steam-button",press);
  return()=>window.removeEventListener("preview-steam-button",press);
 },[]);
 const activateZone=(z:string|null)=>{if(dark&&z)playSound("toggle");if(dark&&page==="Now Playing"&&(z==="prev"||z==="next")){z==="prev"?musicPlayer.prev():musicPlayer.next();return;}if(z==="menu"){if(dark)showLeftMenu();else{setPanelOpen(p=>!p);setZone("nav");}}else if(z==="prev")step(dark?-1:-3);else if(z==="next")step(dark?1:3);else if(z==="play"||z==="center")launch();};
 const zoneAt=(x:number,y:number)=>Math.hypot(x,y)<.4?"center":Math.abs(y)>Math.abs(x)?y<0?"menu":"play":x<0?"prev":"next";
 const touchRef=useRef((_x:number,_y:number)=>{});touchRef.current=(x,y)=>{const z=zoneAt(x,y);setPressed(z);setTimeout(()=>setPressed(null),160);activateZone(z);};
 const input=(p:Press)=>{
  if(menu.handle(p))return true;
  if(p.btn==="menu"){showLeftMenu();return true;}
  if(p.btn==="x"){options();return true;}
  if(p.btn==="y"){if(game)api.nativeMenu(game);return true;}
  if(p.btn==="b"){if(zone==="nav"){setPanelOpen(false);setZone("games");return true;}return false;}
  if(p.btn==="a"){zone==="nav"?openSteam(NAV[nav].action):launch();return true;}
  if(p.btn==="up"||p.btn==="down"){if(zone!=="nav")return true;else setNav(i=>Math.max(0,Math.min(NAV.length-1,i+(p.btn==="up"?-1:1))));return true;}
  if(p.btn==="left"||p.btn==="right"){if(zone==="nav"&&p.btn==="right")setZone("games");else step(p.btn==="left"?-1:1);return true;}
  if(p.btn==="r1"||p.btn==="l1"){
   const direction=p.btn==="r1"?1:-1;
   if(dark){playSound("tab");setPage(current=>ONYX_PAGES[(ONYX_PAGES.indexOf(current)+direction+ONYX_PAGES.length)%ONYX_PAGES.length]);}
   else step(direction);
   return true;
  }return false;
 };
 const reset=()=>{setPressed(null);drag.current=null;gesture.current={angle:null,remainder:0};};
 const point=(e:PointerEvent<HTMLDivElement>)=>{
  const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*2-1,y=(e.clientY-r.top)/r.height*2-1;
  const next=advanceWheel(gesture.current,x,y);gesture.current=next.state;if(next.steps){moved.current=true;step(next.steps);}
 };
 useEffect(()=>{if(blocked)reset();},[blocked]);
 // Keep a stable keyed cover on both sides, including one invisible staging slot.
 // Covers crossing the circular boundary are repositioned only while hidden.
 const visible=games.map((_,i)=>{const d=(i-index+games.length)%games.length;return d>games.length/2?d-games.length:d;});
 return <ThemeRoot onInput={input} hints={{a:"Play",b:"Back",x:"Menu",y:"Game options"}}><Stage background="#d2d2d2"><style>{SILVER_CSS}{dark?ONYX_CSS:""}</style>
 <div className="silver-home" data-dark={dark} data-carousel={carousel} data-screen-glass={dark?styleOf(s,"onyx")("screenGlass"):"off"} data-cover-glass={dark?styleOf(s,"onyx")("coverGlass"):"off"} data-page={dark?page:undefined} data-motion={s.animations} style={{transform:`scale(${W/1280},${H/800})`,...Object.fromEntries(Object.entries(art).map(([key,value])=>[`--silver-${key}`,`url("${value}")`]))} as CSSProperties}>
 {dark&&<><div className="onyx-tabs">{ONYX_PAGES.map(name=><button key={name} data-active={page===name} onClick={()=>{playSound("tab");setPage(name);}}>{name}</button>)}</div><div ref={screenRef} className="onyx-screen" data-page={page}>
{page==="Now Playing"&&<div className="onyx-music">
 <div className="onyx-albums" aria-label="Music albums">{albums?.map(album=><button key={album.id} data-active={player.album?.id===album.id} onClick={()=>musicPlayer.play(album)}>{album.cover?<img src={album.cover} alt=""/>:<span>♫</span>}<small>{album.name}</small></button>)}{albums?.length===0&&<small>No albums yet</small>}</div>
 <div className="onyx-now-art">{player.album?.cover?<img src={player.album.cover} alt={player.album.name}/>:<span aria-hidden="true">♫</span>}</div>
 <div className="onyx-track"><small className="onyx-eyebrow">NOW PLAYING</small><h2>{player.album?.tracks[player.index]?.title??"Your music"}</h2><p>{player.album?.artist??player.album?.name??"Choose a soundtrack to begin"}</p>
 <div className="onyx-progress"><input aria-label="Track position" type="range" disabled={!player.duration} min={0} max={player.duration||1} value={player.time} onChange={e=>musicPlayer.seekTo(Number(e.target.value))}/><div><span>{fmtClock(player.time)}</span><span>−{fmtClock(Math.max(0,player.duration-player.time))}</span></div></div>

 {albums?.length===0&&<p className="onyx-music-note">Add music to your Music folder or install a Steam soundtrack.</p>}{player.error&&<p className="onyx-music-note" role="status">{player.error}</p>}</div>
 </div>}
{page==="Library"&&<div className="onyx-library">{games.map((g,i)=><button key={g.appid} onClick={()=>{setSelected(i);setPage("Games");}}><GameArt flat g={g} kind="portrait" style={{width:90,height:120,objectFit:"cover"}}/><span>{g.name}</span></button>)}</div>}
{page==="Discover"&&<div className="onyx-discover"><h2>Discover your next favorite</h2><div>{games.slice(0,3).map(g=><button key={g.appid} onClick={()=>api.details(g)}><GameArt flat g={g} kind="hero" style={{width:"100%",height:140,objectFit:"cover"}}/><span>{g.name}</span></button>)}</div><button onClick={()=>openSteam("store")}>Browse Steam Store →</button></div>}
{page==="More"&&<div className="onyx-more"><h2>Make it yours</h2>{[{name:"Customize theme",run:api.openSettings},{name:"Downloads",run:()=>openSteam("downloads")},{name:"Friends",run:()=>openSteam("friends")},{name:"Steam Home",run:api.showSteamHome}].map(item=><button key={item.name} onClick={item.run}>{item.name}<span>›</span></button>)}</div>}
</div></>}<header className="silver-top"><div/><div><button aria-label="Search library" onClick={()=>openSteam("search")}>{dark?<Icon name="search" size={19}/>:<ReferenceIcon name="search" size={23}/>}</button>{dark?<Icon name={status.online?"wifi":"network"} size={20}/>:<ReferenceIcon name={status.online?"wifi":"network"} size={23}/>}{dark&&battery&&<><BatteryGlyph level={battery.level} charging={battery.charging} color={dark?"#c6c8ce":"#333"} w={dark?24:28}/><span>{Math.round(battery.level*100)}%</span></>}<time>{fmtTime(clock,s.clock24)}</time><button className="silver-avatar" aria-label="Profile" onClick={()=>openSteam("friends")}>{status.avatar?<img src={status.avatar} alt=""/>:dark?<Icon name="user" size={18}/>:<ReferenceIcon name="user" size={24}/>}</button></div></header>
 <div className="silver-shell"/>{dark&&<div className="onyx-glass-screen" aria-hidden="true"/>}
 {!dark&&<div className="silver-panel-dock" aria-hidden="true"/>}{!dark&&<button className="silver-menu-edge" aria-label="Show left menu" onPointerEnter={()=>setPanelOpen(true)} onClick={()=>setPanelOpen(p=>!p)}/>}<nav className="silver-nav" data-open={panelOpen||panelPinned} data-pinned={panelPinned} onPointerLeave={()=>{if(!panelPinned)setPanelOpen(false);}} aria-label="Steam menu"><button className="silver-home-button" data-lit={panelLight==="home"} onPointerDown={()=>setPanelLight("home")} onClick={()=>{setPanelLight("home");setPanelOpen(false);setZone("games");}}><ReferenceIcon name="home" size={25}/>Home</button>{NAV.map((n,i)=><button key={n.label} data-focus={zone==="nav"&&nav===i} onClick={()=>{openSteam(n.action);}}><i><ReferenceIcon name={n.icon} size={25}/></i>{n.label}</button>)}<button className="silver-steam" data-lit={panelLight==="steam"} onPointerDown={()=>setPanelLight("steam")} onClick={showLeftMenu}><ReferenceIcon name="steam" size={25}/>STEAM</button></nav>

 {styleOf(s,"silver")("coverSurface")==="floor"&&<div className="silver-cover-floor" aria-hidden="true"/>}<section className="silver-carousel" aria-label="Game carousel">{visible.map(offset=>{const g=games[(index+offset+games.length)%games.length];return <button key={g.appid} className="silver-cover" data-selected={offset===0} aria-label={`Select ${g.name}`} aria-pressed={offset===0} style={{left:490+(iconFlow?(offset===0?0:Math.sign(offset)*(175+(Math.abs(offset)-1)*83)):offset*128),transition:Math.abs(offset)>(dark?5:4)?"none":undefined,pointerEvents:Math.abs(offset)>=(dark?5:4)?"none":undefined,opacity:dark?(Math.abs(offset)>=5?0:Math.abs(offset)===4?.12:Math.abs(offset)===3?.58:1):(Math.abs(offset)>=4?0:1),transform:`translateX(-50%) perspective(900px) rotateY(${offset===0?0:-Math.sign(offset)*(iconFlow?62:12+Math.abs(offset)*3)}deg) rotateZ(${offset===0?0:-Math.sign(offset)*(iconFlow?0:.7)}deg) scale(${offset===0?1:Math.max(.55,1-Math.abs(offset)*(iconFlow?.04:.09))})`,zIndex:10-Math.abs(offset)}} onClick={()=>{if(offset===0)launch();else step(offset);}}><GameArt flat g={g} kind="portrait" style={{width:"100%",height:"100%",objectFit:"cover"}}/><span className="silver-cover-reflection" aria-hidden="true" style={{width:128/(offset===0?1:Math.max(.55,1-Math.abs(offset)*(iconFlow?.04:.09)))}}><GameArt flat g={g} kind="portrait" style={{width:squareFlow?216:offset===0?189:178,height:squareFlow?216:offset===0?240:241,maxWidth:"none",objectFit:"cover"}}/></span></button>;})}{!game&&<div className="silver-empty"><h2>Your library awaits</h2><button onClick={()=>openSteam("library")}>Open Library</button></div>}</section>
 <section className="silver-now silver-panel">{game?<><GameArt flat g={game} kind="portrait" style={{width:84,height:137,borderRadius:12,objectFit:"cover"}}/><div><small>Ready to Play</small><h2>{game.name}</h2><p>{fmtLastPlayed(game.lastPlayed)}</p><div className="silver-actions"><button aria-label="Play Game" onClick={launch}>▶ &nbsp; Play Game</button><button aria-label="Game options" onClick={()=>api.nativeMenu(game)}>•••</button></div></div></>:<p>Select a game from your Steam library</p>}</section>
 <section className="silver-recent silver-panel"><p>Recently Played <span>›</span></p><div>{games.slice(0,5).map((g,i)=><button key={g.appid} aria-label={`Select ${g.name}`} onClick={()=>{setSelected(i);setZone("games");}}><GameArt flat g={g} kind="portrait" style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>)}</div></section>
 <div className="silver-wheel" data-pressed={pressed??""} role="group" aria-label="Stationary touch wheel. Circle to browse; tap a zone to press." onPointerDown={e=>{if(blocked)return;e.preventDefault();drag.current=e.pointerId;moved.current=false;origin.current={x:e.clientX,y:e.clientY};const r=e.currentTarget.getBoundingClientRect();tapZone.current=zoneAt((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1);setPressed(tapZone.current);gesture.current={angle:null,remainder:0};e.currentTarget.setPointerCapture(e.pointerId);point(e);}} onPointerMove={e=>{if(drag.current===e.pointerId&&!blocked){if(Math.hypot(e.clientX-origin.current.x,e.clientY-origin.current.y)>8){moved.current=true;setPressed(null);}point(e);}}} onPointerUp={e=>{if(drag.current!==e.pointerId)return;const tap=!moved.current,z=tapZone.current;reset();if(tap)activateZone(z);}} onPointerCancel={reset} onLostPointerCapture={reset} onWheel={e=>{if(blocked)return;e.stopPropagation();scrollCovers(e.deltaY,e.deltaMode);}}>
 <div className="silver-wheel-grain"/><button className="silver-wheel-menu" aria-label={dark?"Next page":"Open Steam menu"} onClick={e=>{if(e.detail===0)activateZone("menu");}}>MENU</button><button className="silver-wheel-prev" aria-label={dark?(page==="Now Playing"?"Previous track":"Previous item"):"Skip three games backward"} onClick={e=>{if(e.detail===0)activateZone("prev");}}>◀◀</button><button className="silver-wheel-next" aria-label={dark?(page==="Now Playing"?"Next track":"Next item"):"Skip three games forward"} onClick={e=>{if(e.detail===0)activateZone("next");}}>▶▶</button><button className="silver-wheel-play" aria-label={dark&&page==="Now Playing"?"Play or pause music":"Activate selected item"} onClick={e=>{if(e.detail===0)activateZone("play");}}>▶</button><button className="silver-wheel-center" aria-label={game?`Play ${game.name}`:"No game selected"} disabled={!game} onClick={e=>{if(e.detail===0)activateZone("play");}}/></div>

 <div className="silver-wheel-caption">{dark&&page==="Games"&&game&&<><strong>{game.name}</strong></>}<span>{games.length?`${index+1} / ${games.length}`:"0 / 0"}</span></div>
 <section className="silver-journey silver-panel">{game&&<button onClick={()=>api.details(game)}><GameArt flat g={game} kind="hero" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div><h3>Continue Your Journey</h3><p>{game.name}</p></div></button>}</section>
 <section className="silver-feature silver-panel"><p>Featured on Steam <span>›</span></p><button onClick={()=>openSteam("store")}>{games[1]&&<GameArt flat g={games[1]} kind="hero" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}<div><h3>Find your next favorite</h3><p>More worlds to discover.</p></div></button></section>
 <aside className="silver-right"><div className="silver-device silver-panel"><img src={REF.deck} alt="Steam Deck" style={{width:94,height:44,objectFit:"contain"}}/><p>Steam Deck</p>{battery?<><BatteryGlyph level={battery.level} charging={battery.charging} color="#333" w={25}/><p>{Math.round(battery.level*100)}% {battery.charging?"· Charging":""}</p></>:<p>Ready to play</p>}</div><button onClick={()=>openSteam("downloads")}><ReferenceIcon name="download" size={22}/>Downloads</button><button onClick={api.openSettings}><ReferenceIcon name="gear" size={23}/>Customize</button><div className="silver-tip silver-panel"><span>↻</span><p>Turn to explore</p><small>Drag around the wheel<br/>or use ← →</small></div></aside>
 <footer className="silver-footer"><span><b>A</b> SELECT</span><span><b>B</b> BACK</span></footer>
 </div><MenuView menu={menu} variant="silver"/></Stage></ThemeRoot>;
}
