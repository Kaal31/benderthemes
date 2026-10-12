import {transitionPage} from "./pageTransition";
import {NazarickNavigation,NazarickPage,nextNazarickPage} from "./themes/NazarickNavigation";
import {NazarickBackdrop} from "./themes/NazarickBackdrop";
import {castleWindowAppearance,useCastleWindow} from "./themes/castleWindow";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { opensKeyboardOnTap, showSteamKeyboard } from "./steamKeyboard";
import { collectionMenu, GameArt, Icon, IconName, MenuView, themeMenu, useMenu } from "./common";
import { friendFullName } from "./steamData";
import { Game, Library, SteamPlace, achievements, fmtPlaytime, openSteam } from "./library";
import { Press, pushModalInput, spatial, Stage } from "./input";
import { Settings, updateSettings } from "./settings";
import { playSound, useSteamStatus } from "./steam";
import { storeSkin } from "./storeView";
import { pageOf, pageSettings } from "./engine/pages";
import { PAGE_LOOKS } from "./pageLooks";
import { iisuPageVars, iisuSchemeAttr } from "./themes/iisuStyles";
import { downloadLine, pauseDownload, removeDownload, resumeDownload, useDownloads } from "./downloads";

export type Destination = {place: SteamPlace | "game" | "achievements" | "music"; game?:Game; url?:string};
let opener: ((destination:Destination)=>void)|null=null;
export const setDestinationOpener=(fn:typeof opener)=>{opener=fn;};
export const openDestination=(destination:Destination)=>{if(!opener)return false;opener(destination);return true;};
interface Row {label:string; sub?:string; icon?:IconName; game?:Game; run?:()=>void; state?:"on"|"off"; progress?:number}
const names:Record<Destination["place"],string>={library:"Game Library",search:"Search Library",game:"Game Details",achievements:"Achievements",friends:"Friends",settings:"Settings",qam:"Home Screen Settings",downloads:"Downloads",media:"Media",store:"Store",power:"Power",mainmenu:"Home",browser:"Internet Browser",community:"Community",cloud:"Cloud Saves",notifications:"Notifications",music:"Music"};
const client=()=> (globalThis as any).SteamClient;

/** Theme-owned destinations use real library/client data. Missing data is explicit. */
export function DestinationView({destination,settings:homeSettings,lib,onClose,onLaunch,onMedia,onTrailer}:{destination:Destination;settings:Settings;lib:Library;onClose:()=>void;onLaunch:(g:Game)=>void;onMedia:()=>void;onTrailer:(g:Game)=>void}) {
  const menu=useMenu();
  const [page,setPage]=useState(destination);
  // each page can be drawn by another theme than the home (Theme options -> Pages)
  const settings=pageSettings(homeSettings,pageOf(page.place));
  const skin=storeSkin(settings);
  const {ref:surfaceRef,close:closeSurface}=useCastleWindow(settings,onClose);
  const [history,setHistory]=useState<Destination[]>([]);
  const [sel,setSel]=useState(0);
  const [query,setQuery]=useState("");
  const [notice,setNotice]=useState("");
  const [webUrl,setWebUrl]=useState(destination.url??(destination.place==="community"?"https://steamcommunity.com/":"https://store.steampowered.com/"));
  const [address,setAddress]=useState(webUrl);
  const [,refresh]=useState(0);
  const [ach,setAch]=useState<any[]|null>(null);
  const listRef=useRef<HTMLDivElement>(null);
  const inputRef=useRef<HTMLInputElement>(null);
  const status=useSteamStatus();
  const dls=useDownloads();
  useEffect(()=>{const timer=setInterval(()=>refresh(n=>n+1),3000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{setPage(destination);setHistory([]);setSel(0);setNotice("");},[destination]);
  useEffect(()=>{setAch(null);let dead=false;if(page.place==="achievements"&&page.game)client()?.Apps?.GetMyAchievementsForApp?.(page.game.gameid)?.then((result:any)=>{if(!dead)setAch(result?.data?.rgAchievements??result?.rgAchievements??result?.achievements??[]);}).catch(()=>{});return()=>{dead=true;};},[page.place,page.game?.appid]);
  const go=(next:Destination)=>{setHistory(h=>[...h,page]);setPage(next);setSel(0);setNotice("");playSound("open");};
  const back=()=>{if(menu.isOpen){menu.handle({btn:"b",repeat:false});return;}if(history.length){setPage(history[history.length-1]);setHistory(h=>h.slice(0,-1));setSel(0);}else closeSurface();playSound("back");};
  const call=(fn:(...args:any[])=>any,...args:any[])=>{try{if(typeof fn!=="function")throw new Error();Promise.resolve(fn(...args)).catch(()=>setNotice("This action is unavailable in this Steam session."));}catch{setNotice("This action is unavailable in this Steam session.");}};
  const option=(label:string,items:()=>any[])=>({label,icon:"gear" as IconName,run:()=>menu.open(items(),label)});
  const toggle=(label:string,on:boolean,run:()=>void):Row=>({label,sub:on?"On":"Off",icon:"gear",run:()=>{run();playSound("toggle");}});
  const browse=(place:Destination["place"],icon:IconName):Row=>({label:names[place],icon,run:()=>go({place})});
  let rows:Row[]=[];
  const game=page.game;
  let subtitle="";
  const all=lib;
  if(page.place==="library"||page.place==="search") {
    rows=all.games.filter(g=>g.name.toLowerCase().includes(query.toLowerCase())).map(g=>({label:g.name,sub:fmtPlaytime(g.playtime, g.lastPlayed)+(g.installed?" · Installed":" · Not installed"),game:g,run:()=>go({place:"game",game:g})}));
    subtitle=`${rows.length} games`;
  } else if(page.place==="game"&&game) {
    rows=[{label:game.installed?"Play":"Install / Play",icon:"play",run:()=>onLaunch(game)},{label:"Achievements",icon:"trophy",run:()=>go({place:"achievements",game})},{label:"Screenshots",icon:"photo",run:onMedia},{label:"Watch Trailer",icon:"video",run:()=>onTrailer(game)},{label:"Browse Store",icon:"store",run:()=>openSteam("store")}];
    subtitle=fmtPlaytime(game.playtime, game.lastPlayed);
  } else if(page.place==="achievements"&&game) {
    const progress=achievements(game);subtitle=progress?`${progress.unlocked} / ${progress.total} unlocked`:"Achievement progress";
    rows=(ach??[]).map(a=>({label:a.strName??a.name??"Achievement",sub:a.bAchieved?"Unlocked":a.strDescription??a.description??"Locked",icon:"trophy",state:a.bAchieved?"on":"off"}));
    if(!rows.length)subtitle+=" · Detailed achievements are not available in this session.";
  } else if(page.place==="qam"||page.place==="settings") {
    rows=[option("Presets",()=>themeMenu()),option("Collections",()=>collectionMenu(settings.theme).sub!()),option("Icon size",()=>[75,85,100,110].map(size=>({label:`${size}%${size===100?" · Default":""}`,checked:(settings.iconSizes?.[settings.theme]??100)===size,action:()=>updateSettings(p=>({iconSizes:{...p.iconSizes,[settings.theme]:size}}))}))),option("Game order",()=>["recent","alpha","playtime"].map(sort=>({label:sort==="recent"?"Recently played":sort==="alpha"?"Alphabetical":"Play time",action:()=>updateSettings({sort:sort as any}),checked:settings.sort===sort}))),toggle("TV mode",settings.tvMode,()=>updateSettings({tvMode:!settings.tvMode})),toggle("Animations",settings.animations,()=>updateSettings({animations:!settings.animations})),toggle("Sound effects",settings.sounds,()=>updateSettings({sounds:!settings.sounds})),toggle("Background music",settings.music[settings.theme]!==false,()=>updateSettings({music:{...settings.music,[settings.theme]:settings.music[settings.theme]===false}})),option("Sound effects volume",()=>[0,20,40,60,80,100].map(sfxVolume=>({label:`${sfxVolume}%`,checked:settings.sfxVolume===sfxVolume,action:()=>updateSettings({sfxVolume})}))),option("Music volume",()=>[0,20,40,60,80,100].map(musicVolume=>({label:`${musicVolume}%`,checked:settings.musicVolume===musicVolume,action:()=>updateSettings({musicVolume})}))),toggle("24-hour clock",settings.clock24,()=>updateSettings({clock24:!settings.clock24})),browse("cloud","cloud"),browse("power","power")];
  } else if(page.place==="friends") {
    const fs=(globalThis as any).friendStore;const friends=fs?.allFriends??fs?.m_FriendsUIFriendStore?.allFriends;
    rows=(Array.isArray(friends)?friends:[]).map(f=>{const p=f.persona??f;return{label:friendFullName(f,fs)||"Friend",sub:p.m_strGameName??(p.is_online||p.m_ePersonaState>0?"Online":"Offline"),icon:"friends",state:p.is_online||p.m_ePersonaState>0||p.m_strGameName?"on":"off"};});
    subtitle=rows.length?`${status.friendsOnline??0} online`:"Friends data is not available in this Steam session.";
  } else if(page.place==="downloads") {
    // the live queue (src/downloads.ts): progress, speed and time left, with Steam's own controls
    const live=dls.items;const ds=(globalThis as any).downloadsStore;const raw=ds?.m_DownloadItems??ds?.downloadItems;
    rows=live.length?live.map(d=>({label:lib.byId.get(d.appid)?.name??`App ${d.appid}`,sub:downloadLine(d),game:lib.byId.get(d.appid),icon:"download" as IconName,state:(d.active&&!d.paused?"on":"off") as "on"|"off",progress:d.completed?1:d.progress,run:()=>menu.open([d.paused?{label:"Resume download",action:()=>resumeDownload(d.appid)}:{label:"Pause download",action:()=>pauseDownload(d.appid)},{label:"Remove from queue",action:()=>removeDownload(d.appid)}],"Download")})):(Array.isArray(raw)?raw:[]).map(d=>{const id=d.appid??d.nAppID;return{label:lib.byId.get(id)?.name??d.display_name??`App ${id}`,sub:d.completed?"Complete":d.paused?"Paused":"Downloading / queued",icon:"download" as IconName,run:()=>menu.open([{label:"Pause download",action:()=>pauseDownload(id)},{label:"Resume download",action:()=>resumeDownload(id)}],"Download")};});
    subtitle=rows.length?dls.running?"Downloading":"Download queue":Array.isArray(raw)||live.length||(globalThis as any).SteamClient?.Downloads?"No active downloads":"Download data is not available in this Steam session.";
  } else if(page.place==="notifications") {
    const ns=(globalThis as any).notificationStore;const items=ns?.m_rgNotificationTray??ns?.m_rgTrayNotifications;
    rows=(Array.isArray(items)?items:[]).map(n=>({label:n.title??n.strTitle??"Steam notification",sub:n.body??n.strBody??"",icon:"bell"}));
    subtitle=Array.isArray(items)?"Notifications":"Notifications are not available in this Steam session.";
  } else if(page.place==="cloud") {
    subtitle=status.cloud===undefined?"Cloud status is unavailable.":status.cloud?"Steam Cloud is enabled. Saves synchronize when games start and close.":"Steam Cloud is disabled.";
    rows=lib.games.filter(g=>!g.shortcut).map(g=>({label:g.name,sub:"Managed by Steam Cloud when supported by this game",game:g,run:()=>go({place:"game",game:g})}));
  } else if(page.place==="power") {
    rows=[{label:"Sleep",icon:"power",run:()=>menu.open([{label:"Sleep now",action:()=>call(client()?.System?.SuspendPC?.bind(client()?.System))}],"Put the device to sleep?")},{label:"Restart",icon:"power",run:()=>menu.open([{label:"Restart now",action:()=>call(client()?.System?.RestartPC?.bind(client()?.System))}],"Restart the device?")},{label:"Shut down",icon:"power",run:()=>menu.open([{label:"Shut down now",action:()=>call(client()?.System?.ShutdownPC?.bind(client()?.System))}],"Shut down the device?")}];
  } else if(page.place==="music") {
    rows=[{label:"Play / Pause",icon:"music",run:()=>call(client()?.Music?.TogglePlayPause?.bind(client()?.Music))},{label:"Previous track",icon:"back",run:()=>call(client()?.Music?.PlayPrevious?.bind(client()?.Music))},{label:"Next track",icon:"play",run:()=>call(client()?.Music?.PlayNext?.bind(client()?.Music))}];subtitle="Steam soundtrack player";
  } else if(page.place==="browser"||page.place==="community") {
    rows=[browse("friends","friends"),browse("notifications","bell"),browse("library","library"),{label:"Store",icon:"store",run:()=>openSteam("store")}];subtitle="Steam community and discovery";
  } else rows=[browse("library","library"),{label:"Store",icon:"store",run:()=>openSteam("store")},{label:"Music",icon:"music",run:()=>openDestination({place:"music"})},{label:"Captures",icon:"photo",run:()=>openDestination({place:"media"})},browse("friends","friends"),browse("downloads","download"),browse("notifications","bell"),browse("settings","gear"),browse("power","power")];
  const current=Math.min(sel,Math.max(0,rows.length-1));
  const choose=(i:number)=>{setSel(i);playSound("select");rows[i]?.run?.();};
  const navigateNazarick=(place:NazarickPage)=>{playSound("tab");if(place==="home")closeSurface();else if(place==="store")openSteam("store");else transitionPage(settings,()=>{setPage({place});setHistory([]);setSel(0);setQuery("");setNotice("");});};
  const tabs = ["library", "friends", "downloads", "settings"] as const;
  const switchTab = (place: typeof tabs[number]) => { setPage({place}); setHistory([]); setSel(0); setQuery(""); setNotice(""); playSound("tab"); };
  // lists a look lays out as a grid (Switch All Software, 3DS HOME icons): the d-pad moves to the nearest tile on screen
  const gridMove=(btn:"up"|"down"|"left"|"right")=>{const list=listRef.current;if(!list||getComputedStyle(list).display!=="grid")return false;const points=[...list.querySelectorAll<HTMLElement>(".dht-destination-row")].map(el=>{const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};});const next=spatial(points,current,btn);if(next>=0){setSel(next);playSound("move");}return true;};
  const handler=useRef<(p:Press)=>boolean>(()=>true);
  handler.current=p=>{if(menu.handle(p))return true;if(settings.theme!=="nazarick"&&(p.btn==="l1"||p.btn==="r1")){const index=tabs.indexOf(page.place as typeof tabs[number]);switchTab(tabs[(Math.max(0,index)+(p.btn==="l1"?tabs.length-1:1))%tabs.length]);return true;}if(settings.theme==="nazarick"&&(p.btn==="l1"||p.btn==="r1")){navigateNazarick(nextNazarickPage(page.place,p.btn==="l1"?-1:1));return true;}if(p.btn==="b")back();else if((p.btn==="up"||p.btn==="down"||p.btn==="left"||p.btn==="right")&&gridMove(p.btn)){}else if(p.btn==="up"||p.btn==="down"){setSel(Math.max(0,Math.min(rows.length-1,current+(p.btn==="up"?-1:1))));playSound("move");}else if(p.btn==="a")choose(current);else if(p.btn==="y"){showSteamKeyboard(inputRef.current);}return true;};
  useEffect(()=>pushModalInput(p=>handler.current(p)),[]);
  useEffect(()=>{listRef.current?.querySelector("[data-selected=true]")?.scrollIntoView({block:"nearest",inline:"nearest"});},[current,page.place]);
  const itemStyle:CSSProperties={display:"flex",alignItems:"center",gap:22,padding:"16px 22px",minHeight:68,boxSizing:"border-box",borderRadius:skin.radius,border:"1px solid transparent",color:skin.text,width:"100%",textAlign:"left",font:"inherit",cursor:"pointer"};
  const menuVariant=settings.theme==="ps3"||settings.theme==="psp"?"xmb":settings.theme;
  return <div ref={surfaceRef} className="dht-destination" data-theme={settings.theme} data-place={page.place} data-variant={settings.theme==="x360"?settings.x360?.style??"metro":undefined} data-n3ds-top={settings.theme==="n3ds"?(settings.n3dsTop==="hide"?"hide":"show"):undefined} data-scheme={iisuSchemeAttr(settings)} style={{position:"absolute",inset:0,zIndex:85,...iisuPageVars(settings),...(settings.theme==="castle"?castleWindowAppearance(settings):{})}}><Stage background={skin.bg}><style>{PAGE_LOOKS}</style>
    {settings.theme==="nazarick"&&<><NazarickBackdrop page={page.place} motion={settings.animations}/><NazarickNavigation page={page.place} settings={settings} onNavigate={navigateNazarick}/></>}
    <div className={settings.theme==="nazarick"?"naz-content dht-page-frame":"dht-page-frame"} style={{position:"absolute",inset:"5% 6%",color:skin.text,fontFamily:skin.font??'"Segoe UI",Arial,sans-serif',display:"flex",flexDirection:"column",gap:18}}>
      <header className="dht-page-header" style={{display:"flex",alignItems:"center",gap:24,color:skin.tabText??skin.text}}>{settings.theme!=="nazarick"&&<button className="dht-page-back" onClick={back} style={{...itemStyle,width:"auto",minHeight:48,background:skin.panel}}>‹ Back</button>}<h1 className="dht-page-title" data-focus-label={page.place==="library"||page.place==="search"?rows[current]?.label??"":undefined} style={{fontSize:38,fontWeight:400,margin:0}}>{game?.name??names[page.place]}</h1></header>
      <div className="dht-page-main">{settings.theme!=="nazarick"&&<nav className="dht-page-tabs" aria-label="Page tabs">{tabs.map(place=><button key={place} style={{borderRadius:skin.radius,...skin.ring(page.place===place)}} aria-current={page.place===place?"page":undefined} onClick={()=>switchTab(place)}>{names[place]}</button>)}</nav>}
      <div className="dht-page-content">{subtitle&&<div className="dht-page-subtitle" style={{fontSize:21,color:skin.tabText??skin.sub}}>{subtitle}</div>}
      {(page.place==="search"||page.place==="library")&&<input ref={inputRef} {...opensKeyboardOnTap} aria-label="Search games" placeholder="Search games…" value={query} onChange={e=>{setQuery(e.target.value);setSel(0);}} onKeyDown={e=>e.stopPropagation()} style={{fontSize:24,padding:14,background:skin.panel,color:skin.text,border:`1px solid ${skin.sub}`,borderRadius:skin.radius}}/>}
      {notice&&<p role="status">{notice}</p>}
      {(page.place==="browser"||page.place==="community") ? <div style={{display:"flex",flexDirection:"column",gap:12,flex:1,minHeight:0}}><form onSubmit={e=>{e.preventDefault();try{const u=new URL(address.includes("://")?address:`https://${address}`);if(u.protocol!=="https:")throw new Error();setWebUrl(u.href);setNotice("");}catch{setNotice("Enter a valid HTTPS address.");}}} style={{display:"flex",gap:12}}><input aria-label="Web address" value={address} onChange={e=>setAddress(e.target.value)} onKeyDown={e=>e.stopPropagation()} style={{flex:1,fontSize:21,padding:12}}/><button type="submit" style={{fontSize:20,padding:12}}>Go</button></form><iframe title="Themed web browser" src={webUrl} sandbox="allow-scripts allow-forms allow-same-origin allow-popups" style={{border:0,background:"white",flex:1}}/><div style={{fontSize:17}}>Some sites block embedded browsing. Checkout and sign-in use Steam’s browser.</div><button onClick={()=>{const sc=client();if(sc?.System?.OpenInSystemBrowser)sc.System.OpenInSystemBrowser(webUrl);else setNotice("The browser handoff is only available on Steam Deck.");}} style={{...itemStyle,background:skin.panel,minHeight:45,fontSize:20}}>Open in system browser</button></div> : <div className="dht-page-body" style={{display:"flex",gap:38,minHeight:0,flex:1}}>
        {game&&<GameArt g={game} kind="portrait" style={{width:250,alignSelf:"flex-start",maxHeight:"85%",borderRadius:skin.radius}}/>}
        <div ref={listRef} className="dht-page-list" data-place={page.place} style={{overflowY:"auto",flex:1,padding:6}}>{rows.length?rows.map((r,i)=><button key={`${r.label}-${i}`} className="dht-destination-row" data-selected={current===i} data-state={r.state} onClick={()=>choose(i)} style={{...itemStyle,marginBottom:8,background:current===i?skin.accent:skin.panel,color:current===i?skin.accentText:skin.text,...(current===i?{outline:`2px solid ${skin.sub}`,outlineOffset:1}:{} )}}><span className="dht-row-icon">{r.game?<GameArt g={r.game} kind="portrait" style={{width:42,height:58,borderRadius:3}}/>:<Icon name={r.icon??"info"} size={32}/>}</span><span className="dht-row-text"><span className="dht-row-label" style={{display:"block",fontSize:settings.tvMode?27:24}}>{r.label}</span>{r.sub&&<span className="dht-row-sub" style={{display:"block",fontSize:18,marginTop:5}}>{r.sub}</span>}{r.progress!==undefined&&r.progress>=0&&<span className="dht-row-progress" style={{display:"block",height:6,marginTop:8,borderRadius:3,background:"#0003",overflow:"hidden",width:"min(420px,100%)"}}><i style={{display:"block",height:"100%",width:`${r.progress*100}%`,background:"currentColor"}}/></span>}</span></button>):<p style={{fontSize:24}}>Nothing to display.</p>}</div>
      </div>}</div></div>
      <footer className="dht-page-footer" style={{fontSize:19,color:skin.tabText??skin.text}}>{settings.theme==="nazarick"?"A · Select　 L1 / R1 · Categories　":"A · Select　 B · Back　"}{page.place==="library"||page.place==="search"?"Y · Search":""}</footer>
    </div><MenuView menu={menu} variant={menuVariant}/>
  </Stage></div>;
}
