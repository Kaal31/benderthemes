import {useEffect, useRef, useState} from "react";
import {GameArt, Icon, IconName, useHome} from "../common";
import {Press, Stage, ThemeRoot, useStage} from "../input";
import {useReportFocus} from "../focus";
import {openSteam, SteamPlace} from "../library";
import {fmtTime, playSound, useClock, useSteamStatus} from "../steam";
import {activeTheme, themeFileUrl} from "../engine/registry";
import {NativeVisuals} from "./NativeVisuals";
const tiles:{id:string;name:string;icon:IconName;place?:SteamPlace}[]=[{id:"web",name:"WEB",icon:"globe",place:"browser"},{id:"store",name:"STORE",icon:"store",place:"store"},{id:"library",name:"LIBRARY",icon:"library"},{id:"community",name:"COMMUNITY",icon:"friends",place:"community"},{id:"chat",name:"CHAT",icon:"friends",place:"friends"}];
export function BigPictureHome(){return <Stage><BigPictureSurface/></Stage>;}
function BigPictureSurface(){
 const api=useHome(),{W}=useStage(),clock=useClock(),status=useSteamStatus(),theme=activeTheme(api.settings)!;
 const file=(name:string)=>themeFileUrl(theme,name)!;
 const [failedAvatar,setFailedAvatar]=useState<string|null>(null);
 const [page,setPage]=useState<"home"|"library">("home"),[zone,setZone]=useState<"tiles"|"games"|"profile"|"utilities">("tiles"),[tile,setTile]=useState(2),[selected,setSelected]=useState(0),[utility,setUtility]=useState(0),[query,setQuery]=useState(""),[installed,setInstalled]=useState(false);
 const games=api.lib.games.filter(g=>(!installed||g.installed)&&g.name.toLowerCase().includes(query.toLowerCase()));
 const index=Math.min(selected,Math.max(0,games.length-1)),game=games[index],track=useRef<HTMLDivElement>(null),grid=useRef<HTMLDivElement>(null),swipe=useRef<number|null>(null),swiped=useRef(false);
 const [trackWidth,setTrackWidth]=useState(W*.9);
 useEffect(()=>{const el=track.current;if(!el)return;const observer=new ResizeObserver(()=>setTrackWidth(el.clientWidth));observer.observe(el);setTrackWidth(el.clientWidth);return()=>observer.disconnect();},[page]);
 const trackOffset=Math.max(Math.min(0,trackWidth-(tiles.length*306-12)),Math.min(0,trackWidth/2-tile*306-147));
 useReportFocus(zone==="games"?game:undefined);
 useEffect(()=>{if(page==="library")grid.current?.querySelector(`[data-appid="${game?.appid}"]`)?.scrollIntoView({block:"nearest",inline:"nearest",behavior:"auto"});},[game?.appid,page]);
 const chooseTile=(i:number)=>{setTile(Math.max(0,Math.min(4,i)));setZone("tiles");playSound("move");};
 const activateTile=(i:number)=>{if(tiles[i].place)openSteam(tiles[i].place!);else{setPage("library");setZone("games");setSelected(0);}};
 const launch=()=>{if(game)api.activate(game,()=>api.details(game));};
 const input=({btn}:Press)=>{
  if(api.busy)return false;
  if(btn==="menu"||btn==="y"){api.openSettings();return true;}
  if(btn==="b"){if(page!=="home"||zone!=="tiles"){setPage("home");setZone("tiles");return true;}return false;}
  if(btn==="x"){if(game)api.launch(game);return true;}
  if(btn==="l1"||btn==="r1"){setPage(page==="home"?"library":"home");setZone(page==="home"?"games":"tiles");return true;}
  if(zone==="profile"){if(btn==="down")setZone(page==="home"?"tiles":"games");else if(btn==="right")setZone("utilities");else if(btn==="a")openSteam("friends");return true;}
  if(zone==="utilities"){if(btn==="down")setZone(page==="home"?"tiles":"games");else if(btn==="left"){if(utility===0)setZone("profile");else setUtility(i=>i-1);}else if(btn==="right")setUtility(i=>Math.min(2,i+1));else if(btn==="a")openSteam((["downloads","settings","power"] as const)[utility]);return true;}
  if(zone==="tiles"){
   if(btn==="left"||btn==="right")chooseTile(tile+(btn==="right"?1:-1));else if(btn==="up")setZone("profile");else if(btn==="down"){setZone("games");setSelected(0);}else if(btn==="a")activateTile(tile);return true;
  }
  if(btn==="a"){launch();return true;}
  if(btn==="up"&&index<(page==="home"?3:3)){setZone(page==="home"?"tiles":"profile");return true;}
  if(["left","right","up","down"].includes(btn)){const d=btn==="left"?-1:btn==="right"?1:btn==="up"?-3:3;setSelected(i=>Math.max(0,Math.min(games.length-1,i+d)));playSound("move");return true;}return false;
 };
 const card=(g:typeof game,i:number)=><button key={g.appid} className="game" onFocus={()=>{setSelected(i);setZone("games");}} data-appid={g.appid} data-selected={zone==="games"&&index===i} aria-label={g.name} onClick={()=>{setZone("games");setSelected(i);api.activate(g,()=>api.details(g));}}><GameArt g={g} kind="landscape" flat style={{width:"100%",aspectRatio:"460/215"}}/><span className="label">{g.name}{g.shortcut?" · Non-Steam":""}</span></button>;
 return <ThemeRoot onInput={input} hints={{a:"Select",x:"Play",y:"Options",b:"Back"}}><NativeVisuals id="old-big-picture" page={page}>
  <style>{`.dht-native-old-big-picture .home-tiles{overflow:visible;padding:0;margin:0 0 70px;height:150px;mask-image:none;-webkit-mask-image:none;transform:translateX(${trackOffset}px);transition:transform ${api.settings.animations?"160ms ease":"none"}}.dht-native-old-big-picture .home-tiles .home-tile{flex:0 0 294px;height:150px}.dht-native-old-big-picture footer b{display:inline-grid;place-items:center;padding:0;line-height:1;vertical-align:middle}.dht-native-old-big-picture .profile-avatar{overflow:hidden}.dht-native-old-big-picture .profile-avatar img{width:100%;height:100%;object-fit:cover}.dht-native-old-big-picture main{overflow:hidden}.dht-native-old-big-picture .library-body{height:100%;overflow:auto}.dht-native-old-big-picture .home-recommendations{width:73%;overflow:visible}`}</style>
  <div className="glow"/>
  <header><button className="brand" onClick={()=>{setPage("home");setZone("tiles");}}><img src={file("assets/steam_home.png")} alt=""/>Big Picture</button><button className="profile" onFocus={()=>setZone("profile")} data-selected={zone==="profile"} onClick={()=>openSteam("friends")}><span className="profile-avatar">{status.avatar&&failedAvatar!==status.avatar?<img id="steam-avatar" src={status.avatar} alt={api.user} onError={()=>setFailedAvatar(status.avatar??null)}/>:api.user.slice(0,1)}</span><span><small>Online</small>{api.user}</span></button><div className="utilities">{(["downloads","settings","power"] as const).map((place,i)=><button key={place} data-selected={zone==="utilities"&&utility===i} aria-label={place} onClick={()=>openSteam(place)}><img src={file(`assets/${["downloads","settings","exit"][i]}.png`)} alt=""/></button>)}<time>{fmtTime(clock,api.settings.clock24)}</time></div></header>
  <nav>{["STORE","LIBRARY","COMMUNITY"].map((label,i)=><button key={label} onClick={()=>i===1?(setPage("library"),setZone("games")):openSteam(i===0?"store":"friends")}>{label}</button>)}</nav>
  <main style={page==="home"?{paddingTop:70}:undefined}>
   {page==="home"?<><div ref={track} className="home-tiles" onPointerDown={e=>{swipe.current=e.clientX;swiped.current=false;}} onPointerUp={e=>{if(swipe.current!==null&&Math.abs(e.clientX-swipe.current)>35){swiped.current=true;chooseTile(tile+(e.clientX<swipe.current?1:-1));}swipe.current=null;}} onWheel={e=>chooseTile(tile+((e.deltaX||e.deltaY)>0?1:-1))}>{tiles.map((t,i)=><button key={t.id} className={`home-tile ${t.id}`} onFocus={e=>{if(e.currentTarget.matches(":focus-visible")){setTile(i);setZone("tiles");}}} data-selected={zone==="tiles"&&tile===i} onClick={()=>{if(swiped.current){swiped.current=false;return;}chooseTile(i);activateTile(i);}}><span className="tile-icon"><Icon name={t.icon} size={W*.09}/></span><span>{t.name}</span></button>)}</div><div className="home-recommendations">{games.slice(0,3).map((g,i)=><section className="recommendation" key={g.appid}><h2>{["JUMP BACK IN","RESUME PLAYING","EXPLORE YOUR LIBRARY"][i]}</h2>{card(g,i)}</section>)}</div></>:<div className="library-shell"><aside className="library-sidebar"><button onClick={()=>setInstalled(false)}>All games</button><button onClick={()=>setInstalled(true)}>Installed</button><input type="search" aria-label="Search library" placeholder="Search Library…" value={query} onChange={e=>{setQuery(e.target.value);setSelected(0);}}/><button onClick={()=>openSteam("downloads")}>Downloads</button><button onClick={()=>openSteam("library")}>Steam Library</button></aside><div className="library-body" ref={grid}><h2>Your games</h2><div className="grid">{games.map(card)}</div></div></div>}
  </main>
  <footer><button onClick={()=>{setPage("home");setZone("tiles");}}>◉ Home</button><div><b>A</b> Select <b>X</b> Play <b>Y</b> Options <b>B</b> Back</div><button onClick={api.openSettings}>Theme options ☰</button></footer>
 </NativeVisuals></ThemeRoot>;
}
