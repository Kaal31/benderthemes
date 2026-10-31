import { READING_BACKGROUND, READING_SEQUENCE } from "./readingAssets";
import { useThemeActive } from "../performance";
import { LocalTrack, playLocalAudio, ReadingMusicPlayer } from "./ReadingMusicPlayer";
import { openDestination } from "../destinations";
import { Navigation, Router, replacePatch } from "@decky/ui";
import { useEffect, useRef, useState } from "react";
import { useAssets } from "../assets";
import { BatteryGlyph, GameArt, Icon, IconName, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { openSteam } from "../library";
import { updateSettings } from "../settings";
import { fmtTime, useBattery, useClock } from "../steam";
import { READING_CSS } from "./readingRoomStyles";


export function ReadingRoomHome() {
 const showMenuButton=!!(window as any).__isThemePreview;
 const api=useHome(), assets=useAssets("reading-room"), menu=useMenu();
 const {W,H}=useStage(), scale=Math.min(W/1536,H/864);
 const time=useClock(15000), battery=useBattery();
 const [friends,setFriends]=useState<{id:string;name:string;avatar:string;online:boolean}[]>([]);
 useEffect(()=>{const refresh=()=>{const store=(globalThis as any).friendStore;const raw=store?.allFriends??store?.m_FriendsUIFriendStore?.allFriends;const list=Array.isArray(raw)?raw:raw instanceof Map?[...raw.values()]:[];const data=list.map((f:any)=>{const p=f.persona??f;return {id:String(p.m_steamid?.ConvertTo64BitString?.()??p.steamid??f.steamid??""),name:p.m_strPlayerName??p.display_name??"Friend",avatar:p.m_strAvatarURL??p.m_strAvatarURLSmall??p.avatar_url??"",online:!!(p.is_online||p.m_ePersonaState>0)};});setFriends((data.length?data:(window as any).__isThemePreview?[{id:"",name:"Mika",avatar:"",online:true},{id:"",name:"Rowan",avatar:"",online:true},{id:"",name:"Alex",avatar:"",online:true},{id:"",name:"Jun",avatar:"",online:false}]:[]).sort((a:any,b:any)=>Number(b.online)-Number(a.online)).slice(0,4));};refresh();const timer=setInterval(refresh,5000);return()=>clearInterval(timer);},[]);
 const openFriend=(_id:string)=>openSteam("friends");
 const games=api.lib.games;
 const sequence=READING_SEQUENCE;
 const active=useThemeActive();
 const wallpaperVideo=useRef<HTMLVideoElement>(null);
 const [previousWallpaper,setPreviousWallpaper]=useState<number|null>(null);
 const [wallpaper,setWallpaper]=useState(0),[wallpaperPaused,setWallpaperPaused]=useState(false),[wallpaperReady,setWallpaperReady]=useState(false);

 useEffect(()=>{if(!wallpaperReady)return;const timer=setTimeout(()=>setPreviousWallpaper(null),previousWallpaper===sequence.length-1?1650:700);return()=>clearTimeout(timer);},[wallpaperReady,wallpaper,previousWallpaper]);

 useEffect(()=>{const video=wallpaperVideo.current;if(!video)return;if(wallpaperPaused||!active)video.pause();else void video.play().catch(()=>{});},[wallpaperPaused,wallpaper,active]);
 const changeWallpaper=(delta:number)=>{setPreviousWallpaper(wallpaper);setWallpaperReady(false);setWallpaper(i=>(i+delta+sequence.length)%sequence.length);};
 const [selected,setSelected]=useRemembered("reading-game",0);
 const index=clamp(selected,0,Math.max(0,games.length-1));
 const [zone,setZone]=useState<"nav"|"games"|"shelf">("games"),[nav,setNav]=useState(0),[shelfIndex,setShelfIndex]=useState(0);
 const [navOpen,setNavOpen]=useState(false);
 const toggleNav=()=>setNavOpen(open=>{setZone(open?"games":"nav");return !open;});
 const toggleRef=useRef(toggleNav);toggleRef.current=toggleNav;
 useEffect(()=>{
  const store=Router?.WindowStore?.GamepadUIMainWindowInstance?.MenuStore;
  const patches: {unpatch:()=>void}[]=[];
  if(store){
   patches.push(replacePatch(store,"OpenMainMenu",()=>{toggleRef.current();}));
   const original=store.OpenSideMenu;
   patches.push(replacePatch(store,"OpenSideMenu",args=>{if(args[0]===1){toggleRef.current();return;}return original.apply(store,args as [number]);}));
  }
  const key=(event:KeyboardEvent)=>{if(event.key!=="F1"||event.repeat)return;event.preventDefault();toggleRef.current();};
  window.addEventListener("keydown",key);
  return()=>{window.removeEventListener("keydown",key);patches.reverse().forEach(p=>p.unpatch());};
 },[]);
 const shelf=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const row=shelf.current,card=row?.querySelector<HTMLElement>(`[data-index="${index}"]`);
  if(!row||!card)return;
  const left=card.offsetLeft-row.offsetLeft,right=left+card.offsetWidth;
  if(left<row.scrollLeft+6)row.scrollTo({left:Math.max(0,left-6),behavior:api.settings.animations?"smooth":"auto"});
  else if(right>row.scrollLeft+row.clientWidth-6)row.scrollTo({left:right-row.clientWidth+6,behavior:api.settings.animations?"smooth":"auto"});
 },[index,api.settings.animations]);
 useEffect(()=>{
  const row=shelf.current;if(!row)return;
  const wheel=(e:WheelEvent)=>{if(e.ctrlKey)return;const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;const factor=e.deltaMode===1?24:e.deltaMode===2?row.clientWidth:1;if(delta){e.preventDefault();row.scrollLeft+=delta*factor;}};
  row.addEventListener("wheel",wheel,{passive:false});return()=>row.removeEventListener("wheel",wheel);
 },[]);
 const steamHome=()=>{updateSettings({enabled:false});Navigation.CloseSideMenus();Navigation.Navigate("/library/home");};
 const presets=()=>menu.open(themeMenu(),"Choose your atmosphere");
 const items:{label:string;icon:IconName;run:()=>void}[]=[
 {label:"Library",icon:"library",run:()=>openSteam("library")},
 {label:"Recently played",icon:"game",run:()=>setZone("games")},
 {label:"Collections",icon:"library",run:()=>{openDestination({place:"collections"});}},
 {label:"Friends",icon:"friends",run:()=>openSteam("friends")},
 {label:"Music & media",icon:"music",run:()=>openSteam("media")},
 {label:"Store",icon:"store",run:()=>openSteam("store")},
 {label:"Settings",icon:"gear",run:()=>api.openSettings()},
 {label:"Steam Home",icon:"home",run:steamHome}];
 const game=zone==="shelf"?games[shelfIndex]:games[index];
 const launch=()=>{if(game)api.activate(game,()=>api.launch(game));};
 const input=(p:Press):boolean=>{
 if(menu.isOpen)return menu.handle(p);
 if(p.btn==="a"){zone==="nav"?items[nav].run():launch();return true;}
 if(p.btn==="b"){if(navOpen){setNavOpen(false);setZone("games");}else zone!=="games"?setZone("games"):steamHome();return true;}
 if(p.btn==="y"){presets();return true;}
 if(p.btn==="x"&&game){api.details(game);return true;}
 if(p.btn==="menu"&&game){api.nativeMenu(game);return true;}
 if(!["up","down","left","right"].includes(p.btn))return false;
 if(zone==="nav"){
 if(p.btn==="up")setNav(clamp(nav-1,0,items.length-1));
 if(p.btn==="down")setNav(clamp(nav+1,0,items.length-1));
 if(p.btn==="right")setZone("games");
 }else{
 const current=zone==="games"?index:shelfIndex;
 if(p.btn==="left"){if(current===0){setNavOpen(true);setZone("nav");}else zone==="games"?setSelected(current-1):setShelfIndex(current-1);}
 if(p.btn==="right")zone==="games"?setSelected(clamp(current+1,0,games.length-1)):setShelfIndex(clamp(current+1,0,Math.min(5,games.length-1)));
 if(p.btn==="down")setZone("shelf");
 if(p.btn==="up")setZone("games");
 }return true;
 };
 return <ThemeRoot onInput={input} hints={{a:"Play",b:"Steam Home",x:"Details",y:"Themes",menu:"Game options"}}><Stage background="#30251c"><style>{READING_CSS}</style>
 <div className="rr-home" style={{["--rr-pin-size" as string]:`${44/scale}px`,left:(W-1536*scale)/2,top:(H-864*scale)/2,transform:`scale(${scale})`,backgroundImage:`url("${assets.background||READING_BACKGROUND}")`}}>
 {sequence.length>0&&[...(previousWallpaper!==null&&previousWallpaper!==wallpaper?[previousWallpaper]:[]),wallpaper].map(i=><video key={i} ref={i===wallpaper?wallpaperVideo:video=>{video?.pause();}} className="rr-wallpaper" src={sequence[i].videoSrc} muted playsInline autoPlay={i===wallpaper&&!wallpaperPaused&&active} preload="auto" style={{opacity:i===wallpaper&&!wallpaperReady?0:1,transition:i===wallpaper?`opacity ${previousWallpaper===sequence.length-1?1600:650}ms ease`:"none"}} onPlaying={()=>{if(i===wallpaper)setWallpaperReady(true);}} onLoadedData={()=>{if(i===wallpaper&&wallpaperPaused)setWallpaperReady(true);}} onEnded={()=>{if(i===wallpaper)changeWallpaper(1);}}/>)}
 {(window as any).__isThemePreview&&sequence.length>0&&<div className="rr-wallpaper-preview"><button onClick={()=>changeWallpaper(-1)} aria-label="Previous wallpaper">‹</button><span>{wallpaper+1} / {sequence.length} · {sequence[wallpaper].tag} · Clip {sequence[wallpaper].clip}</span><button onClick={()=>setWallpaperPaused(p=>!p)}>{wallpaperPaused?"Resume sequence":"Hold this wallpaper"}</button><button onClick={()=>changeWallpaper(1)} aria-label="Next wallpaper">›</button></div>}
 {showMenuButton && <button className="rr-menu-button" onClick={toggleNav} aria-label={navOpen?"Close menu":"Open menu"} aria-expanded={navOpen}><span className="rr-menu-seal"><Icon name="steam" size={24}/></span><span className="rr-menu-label">Menu<small>{navOpen?"Close notebook":"Open notebook"}</small></span><span className="rr-menu-lines" aria-hidden="true"><i/><i/><i/></span></button>}
 {(window as any).__isThemePreview&&<button className="rr-menu-button rr-audio-test" onClick={()=>{const tracks:LocalTrack[]=(window as any).__readingAudio??[];if(tracks.length)playLocalAudio(tracks,0);}} aria-label="Test audio"><span className="rr-menu-seal"><Icon name="music" size={24}/></span><span className="rr-menu-label">Test audio<small>Bundled sample track</small></span></button>}
 {(window as any).__isThemePreview&&games[index]&&<div className="rr-game-test"><button onClick={()=>api.details(games[index])}>Preview game page</button><button onClick={()=>api.launch(games[index])}>Preview launch screen</button></div>}
 <header className="rr-status"><Icon name="wifi" size={24}/><BatteryGlyph level={battery?.level??-1} charging={battery?.charging??false}/><span>{battery?`${Math.round(battery.level*100)}%`:"—"}</span><time>{fmtTime(time,api.settings.clock24)}</time><span className="rr-user">{api.user.slice(0,1)}</span></header>
 <nav className="rr-paper rr-nav" data-open={navOpen} aria-hidden={!navOpen} aria-label="Home navigation">{items.map((item,i)=><button key={item.label} tabIndex={navOpen?0:-1} data-selected={zone==="nav"&&nav===i} onFocus={()=>{setZone("nav");setNav(i);}} onClick={item.run}><Icon name={item.icon} size={29}/>{item.label}</button>)}</nav>

 <section className="rr-paper rr-recent" data-reading-window="recent"><i className="rr-pin rr-pin-left"/><h1>Recently Played <span>❧</span></h1><div className="rr-covers" ref={shelf}>{games.map((g,i)=><button key={g.appid} data-index={i} data-selected={zone==="games"&&index===i} onFocus={()=>{setZone("games");setSelected(i);}} onClick={()=>api.activate(g,()=>api.launch(g))} aria-label={`Play ${g.name}`}><GameArt g={g} kind="portrait" flat style={{width:"100%",height:250}}/><strong>{g.name}</strong><small>◷ {g.playtime>0?`${(g.playtime/60).toFixed(1)} hrs played`:"Ready to begin"}</small></button>)}{!games.length&&<button onClick={()=>openSteam("library")}>Find your next adventure →</button>}</div></section>
 <section className="rr-paper rr-shelf" data-reading-window="shelf"><i className="rr-pin rr-pin-left"/><h2>On your shelf <span>❧</span></h2><div>{games.slice(0,6).map((g,i)=><button key={g.appid} aria-label={`Play ${g.name}`} data-selected={zone==="shelf"&&shelfIndex===i} onFocus={()=>{setZone("shelf");setShelfIndex(i);}} onClick={()=>api.activate(g,()=>api.launch(g))}><GameArt g={g} kind="portrait" flat style={{width:68,height:75}}/></button>)}</div></section>
 <section className="rr-paper rr-card rr-friends" data-reading-window="friends" aria-label="Good Company"><i className="rr-pin rr-pin-left"/><header><strong>Good company{(window as any).__isThemePreview&&<small className="rr-preview-friend-label">Sample friends</small>}</strong><button aria-label="Open Friends and Chat" onClick={()=>openSteam("friends")}>›</button></header><div className="rr-friend-faces">{friends.map((friend,i)=><button key={friend.name+i} title={`${friend.name} · ${friend.online?"Online":"Offline"}`} aria-label={`Chat with ${friend.name}`} onClick={()=>openFriend(friend.id)}>{friend.avatar?<img src={friend.avatar} alt=""/>:<span>{friend.name.slice(0,1)}</span>}<i data-online={friend.online}/><em>{friend.name}</em><small>{friend.online?"Online":"Offline"}</small></button>)}{!friends.length&&<small>Open Steam Friends & Chat to see your friends.</small>}</div></section>
 <ReadingMusicPlayer settings={api.settings}/>
 <footer className="rr-footer"><span/><span>A Play · X Details · Y Themes · B Steam Home</span></footer>
 </div><MenuView menu={menu} variant="reading"/></Stage></ThemeRoot>;
}
