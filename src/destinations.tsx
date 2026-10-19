import { style } from "./engine/themeStyles";
import {transitionPage} from "./pageTransition";
import {NazarickNavigation,NazarickPage,nextNazarickPage} from "./themes/NazarickNavigation";
import {NazarickBackdrop} from "./themes/NazarickBackdrop";
import {castleWindowAppearance,useCastleWindow} from "./themes/castleWindow";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { opensKeyboardOnTap, showSteamKeyboard } from "./steamKeyboard";
import { collectionMenu, GameArt, Icon, IconName, MenuView, themeMenu, useMenu } from "./common";
import { friendFullName } from "./steamData";
import { Game, Library, SteamPlace, achievements, fmtPlaytime, openNativeGamePage, openSteam } from "./library";
import { Navigation } from "@decky/ui";
import { Badges, protonDbEnabled } from "./badges";
import { useProtonDbPresent } from "./pluginPresence";
import { pluginGameActions } from "./pluginSupport";
import { Press, pushModalInput, spatial, Stage } from "./input";
import { Settings, updateSettings } from "./settings";
import { playSound, useSteamStatus } from "./steam";
import { storeSkin } from "./storeView";
import { pageOf, pageSettings } from "./engine/pages";
import { PAGE_LOOKS } from "./pageLooks";
import { iisuPageVars, iisuSchemeAttr } from "./themes/iisuStyles";
import { downloadLine, pauseDownload, removeDownload, resumeDownload, useDownloads } from "./downloads";
import { t, lang } from "./i18n";

export type Destination = {place: SteamPlace | "game" | "achievements" | "music"; game?:Game; url?:string};
let opener: ((destination:Destination)=>void)|null=null;
export const setDestinationOpener=(fn:typeof opener)=>{opener=fn;};
export const openDestination=(destination:Destination)=>{if(!opener)return false;opener(destination);return true;};
interface Row {label:string; sub?:string; icon?:IconName; game?:Game; run?:()=>void; state?:"on"|"off"; progress?:number}
const destinationNames = (): Record<Destination["place"], string> => ({
  library: t("destLibrary"),
  search: t("destSearch"),
  game: t("destGame"),
  achievements: t("destAchievements"),
  friends: t("destFriends"),
  settings: t("destSettings"),
  qam: t("destQam"),
  downloads: t("destDownloads"),
  media: t("destMedia"),
  store: t("destStore"),
  power: t("destPower"),
  mainmenu: t("destMainMenu"),
  browser: t("destBrowser"),
  community: t("destCommunity"),
  cloud: t("destCloud"),
  notifications: t("destNotifications"),
  music: t("destMusic"),
});
const names: Record<Destination["place"], string> = new Proxy({} as any, {
  get: (_, prop: string) => destinationNames()[prop as Destination["place"]] || prop,
});
const client=()=> (globalThis as any).SteamClient;

/** Theme-owned destinations use real library/client data. Missing data is explicit. */
export function DestinationView({destination,settings:homeSettings,lib,onClose,onLaunch,onMedia,onTrailer}:{destination:Destination;settings:Settings;lib:Library;onClose:()=>void;onLaunch:(g:Game)=>void;onMedia:()=>void;onTrailer:(g:Game)=>void}) {
  const menu=useMenu();
  const [page,setPage]=useState(destination);
  // each page can be drawn by another theme than the home (Theme options -> Pages)
  const settings=pageSettings(homeSettings,pageOf(page.place));
  const protonDbDetected = useProtonDbPresent();
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
    rows=all.games.filter(g=>g.name.toLowerCase().includes(query.toLowerCase())).map(g=>({label:g.name,sub:fmtPlaytime(g.playtime, g.lastPlayed)+(g.installed?` · ${t("installed")}`:` · ${t("notInstalled")}`),game:g,run:()=>go({place:"game",game:g})}));
    subtitle=lang("gamesCount", { count: rows.length });
  } else if(page.place==="game"&&game) {
    rows=[
      {label:game.installed?t("play"):t("installOrPlay"),icon:"play",run:()=>onLaunch(game)},
      {label:t("destAchievements"),icon:"trophy",run:()=>go({place:"achievements",game})},
      {label:t("destScreenshots"),icon:"photo",run:onMedia},
      {label:t("watchTrailer"),icon:"video",run:()=>onTrailer(game)},
      {label:t("browseStore"),icon:"store",run:()=>openSteam("store")}
    ];
    subtitle=fmtPlaytime(game.playtime, game.lastPlayed);
    if (protonDbDetected && protonDbEnabled(settings) && !game.shortcut) rows.push({label:t("protonDbReports"),icon:"info",run:()=>Navigation.NavigateToExternalWeb(`https://www.protondb.com/app/${game.appid}`)});
    rows.push(...pluginGameActions(game).map(action=>({label:action.label,run:action.run})));
    rows.push({label:t("steamGamePage"),sub:t("steamGamePageDesc"),icon:"info",run:()=>{openNativeGamePage(game);onClose();}});
  } else if(page.place==="achievements"&&game) {
    const progress=achievements(game);subtitle=progress?`${progress.unlocked} / ${progress.total} ${t("unlocked")}`:t("achievementProgress");
    rows=(ach??[]).map(a=>({label:a.strName??a.name??t("achievement"),sub:a.bAchieved?t("unlocked"):a.strDescription??a.description??t("locked"),icon:"trophy",state:a.bAchieved?"on":"off"}));
    if(!rows.length)subtitle+=` · ${t("noDetailedAchievements")}`;
  } else if(page.place==="qam"||page.place==="settings") {
    rows=[
      option(t("presets"),()=>themeMenu()),
      option(t("allCollections"),()=>collectionMenu(settings.theme).sub!()),
      option(t("iconSize"),()=>[75,85,100,110].map(size=>({label:`${size}%${size===100?` · ${t("default")}`:""}`,checked:(settings.iconSizes?.[settings.theme]??100)===size,action:()=>updateSettings(p=>({iconSizes:{...p.iconSizes,[settings.theme]:size}}))}))),
      option(t("gameOrder"),()=>["recent","alpha","playtime"].map(sort=>({label:sort==="recent"?t("sortRecent"):sort==="alpha"?t("sortAlpha"):t("sortPlaytime"),action:()=>updateSettings({sort:sort as any}),checked:settings.sort===sort}))),
      toggle(t("tvMode"),settings.tvMode,()=>updateSettings({tvMode:!settings.tvMode})),
      toggle(t("animations"),settings.animations,()=>updateSettings({animations:!settings.animations})),
      toggle(t("soundEffects"),settings.sounds,()=>updateSettings({sounds:!settings.sounds})),
      toggle(t("backgroundMusic"),settings.music[settings.theme]!==false,()=>updateSettings({music:{...settings.music,[settings.theme]:settings.music[settings.theme]===false}})),
      option(t("soundVolume"),()=>[0,20,40,60,80,100].map(sfxVolume=>({label:`${sfxVolume}%`,checked:settings.sfxVolume===sfxVolume,action:()=>updateSettings({sfxVolume})}))),
      option(t("musicVolume"),()=>[0,20,40,60,80,100].map(musicVolume=>({label:`${musicVolume}%`,checked:settings.musicVolume===musicVolume,action:()=>updateSettings({musicVolume})}))),
      toggle(t("clock24"),settings.clock24,()=>updateSettings({clock24:!settings.clock24})),
      browse("cloud","cloud"),
      browse("power","power")
    ];
  } else if(page.place==="friends") {
    const fs=(globalThis as any).friendStore;const friends=fs?.allFriends??fs?.m_FriendsUIFriendStore?.allFriends;
    rows=(Array.isArray(friends)?friends:[]).map(f=>{const p=f.persona??f;return{label:friendFullName(f,fs)||t("friend"),sub:p.m_strGameName??(p.is_online||p.m_ePersonaState>0?t("online"):t("offline")),icon:"friends",state:p.is_online||p.m_ePersonaState>0||p.m_strGameName?"on":"off"};});
    subtitle=rows.length?`${status.friendsOnline??0} ${t("online")}`:t("noFriendsData");
  } else if(page.place==="downloads") {
    // the live queue (src/downloads.ts): progress, speed and time left, with Steam's own controls
    const live=dls.items;const ds=(globalThis as any).downloadsStore;const raw=ds?.m_DownloadItems??ds?.downloadItems;
    rows=live.length?live.map(d=>({label:lib.byId.get(d.appid)?.name??`App ${d.appid}`,sub:downloadLine(d),game:lib.byId.get(d.appid),icon:"download" as IconName,state:(d.active&&!d.paused?"on":"off") as "on"|"off",progress:d.completed?1:d.progress,run:()=>menu.open([d.paused?{label:t("resumeDownload"),action:()=>resumeDownload(d.appid)}:{label:t("pauseDownload"),action:()=>pauseDownload(d.appid)},{label:t("removeFromQueue"),action:()=>removeDownload(d.appid)}],t("destDownloads"))})):(Array.isArray(raw)?raw:[]).map(d=>{const id=d.appid??d.nAppID;return{label:lib.byId.get(id)?.name??d.display_name??`App ${id}`,sub:d.completed?t("complete"):d.paused?t("paused"):t("downloadingOrQueued"),icon:"download" as IconName,run:()=>menu.open([{label:t("pauseDownload"),action:()=>pauseDownload(id)},{label:t("resumeDownload"),action:()=>resumeDownload(id)}],t("destDownloads"))};});
    subtitle=rows.length?dls.running?t("downloading"):t("downloadQueue"):Array.isArray(raw)||live.length||(globalThis as any).SteamClient?.Downloads?t("noActiveDownloads"):t("noDownloadsData");
  } else if(page.place==="notifications") {
    const ns=(globalThis as any).notificationStore;const items=ns?.m_rgNotificationTray??ns?.m_rgTrayNotifications;
    rows=(Array.isArray(items)?items:[]).map(n=>({label:n.title??n.strTitle??t("steamNotification"),sub:n.body??n.strBody??"",icon:"bell"}));
    subtitle=Array.isArray(items)?t("destNotifications"):t("noNotificationsData");
  } else if(page.place==="cloud") {
    subtitle=status.cloud===undefined?t("cloudUnavailable"):status.cloud?t("cloudEnabled"):t("cloudDisabled");
    rows=lib.games.filter(g=>!g.shortcut).map(g=>({label:g.name,sub:t("cloudManagedSub"),game:g,run:()=>go({place:"game",game:g})}));
  } else if(page.place==="power") {
    rows=[
      {label:t("powerSleep"),icon:"power",run:()=>menu.open([{label:t("sleepNow"),action:()=>call(client()?.System?.SuspendPC?.bind(client()?.System))}],t("sleepPrompt"))},
      {label:t("powerRestart"),icon:"power",run:()=>menu.open([{label:t("restartNow"),action:()=>call(client()?.System?.RestartPC?.bind(client()?.System))}],t("restartPrompt"))},
      {label:t("powerShutDown"),icon:"power",run:()=>menu.open([{label:t("shutDownNow"),action:()=>call(client()?.System?.ShutdownPC?.bind(client()?.System))}],t("shutDownPrompt"))}
    ];
  } else if(page.place==="music") {
    rows=[
      {label:t("playOrPause"),icon:"music",run:()=>call(client()?.Music?.TogglePlayPause?.bind(client()?.Music))},
      {label:t("prevTrack"),icon:"back",run:()=>call(client()?.Music?.PlayPrevious?.bind(client()?.Music))},
      {label:t("nextTrack"),icon:"play",run:()=>call(client()?.Music?.PlayNext?.bind(client()?.Music))}
    ];
    subtitle=t("steamSoundtrackPlayer");
  } else if(page.place==="browser"||page.place==="community") {
    rows=[browse("friends","friends"),browse("notifications","bell"),browse("library","library"),{label:t("destStore"),icon:"store",run:()=>openSteam("store")}];subtitle=t("steamCommunityDiscovery");
  } else rows=[browse("library","library"),{label:t("destStore"),icon:"store",run:()=>openSteam("store")},{label:t("destMusic"),icon:"music",run:()=>openDestination({place:"music"})},{label:t("captures"),icon:"photo",run:()=>openDestination({place:"media"})},browse("friends","friends"),browse("downloads","download"),browse("notifications","bell"),browse("settings","gear"),browse("power","power")];
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
  return <div ref={surfaceRef} className="dht-destination" data-theme={settings.theme} data-place={page.place} data-variant={settings.theme==="x360"?settings.x360?.style??"metro":undefined} data-switch-style={settings.theme==="switch"?style(settings, "switch", "themeColor"):undefined} data-n3ds-top={settings.theme==="n3ds"?(settings.n3dsTop==="hide"?"hide":"show"):undefined} data-scheme={iisuSchemeAttr(settings)} style={{position:"absolute",inset:0,zIndex:85,...iisuPageVars(settings),...(settings.theme==="castle"?castleWindowAppearance(settings):{})}}><Stage background={skin.bg}><style>{PAGE_LOOKS}</style>
    {settings.theme==="nazarick"&&<><NazarickBackdrop page={page.place} motion={settings.animations} settings={settings}/><NazarickNavigation page={page.place} settings={settings} onNavigate={navigateNazarick}/></>}
    <div className={settings.theme==="nazarick"?"naz-content dht-page-frame":"dht-page-frame"} style={{position:"absolute",inset:"5% 6%",color:skin.text,fontFamily:skin.font??'"Segoe UI",Arial,sans-serif',display:"flex",flexDirection:"column",gap:18}}>
      <header className="dht-page-header" style={{display:"flex",alignItems:"center",gap:24,color:skin.tabText??skin.text}}>{settings.theme!=="nazarick"&&<button className="dht-page-back" onClick={back} style={{...itemStyle,width:"auto",minHeight:48,background:skin.panel}}>‹ {t("back")}</button>}<h1 className="dht-page-title" data-focus-label={page.place==="library"||page.place==="search"?rows[current]?.label??"":undefined} style={{fontSize:38,fontWeight:400,margin:0}}>{game?.name??names[page.place]}</h1></header>
      <div className="dht-page-main">{settings.theme!=="nazarick"&&<nav className="dht-page-tabs" aria-label="Page tabs">{tabs.map(place=><button key={place} style={{borderRadius:skin.radius,...skin.ring(page.place===place)}} aria-current={page.place===place?"page":undefined} onClick={()=>switchTab(place)}>{names[place]}</button>)}</nav>}
      <div className="dht-page-content">{subtitle&&<div className="dht-page-subtitle" style={{fontSize:21,color:skin.tabText??skin.sub}}>{subtitle}</div>}
      {page.place==="game"&&game&&<Badges g={game} size={15} theme={settings.theme}/>}
      {(page.place==="search"||page.place==="library")&&<input ref={inputRef} {...opensKeyboardOnTap} aria-label="Search games" placeholder={t("searchGamesDots")} value={query} onChange={e=>{setQuery(e.target.value);setSel(0);}} onKeyDown={e=>e.stopPropagation()} style={{fontSize:24,padding:14,background:skin.panel,color:skin.text,border:`1px solid ${skin.sub}`,borderRadius:skin.radius}}/>}
      {notice&&<p role="status">{notice}</p>}
      {(page.place==="browser"||page.place==="community") ? <div style={{display:"flex",flexDirection:"column",gap:12,flex:1,minHeight:0}}><form onSubmit={e=>{e.preventDefault();try{const u=new URL(address.includes("://")?address:`https://${address}`);if(u.protocol!=="https:")throw new Error();setWebUrl(u.href);setNotice("");}catch{setNotice(t("enterValidHttps"));}}} style={{display:"flex",gap:12}}><input aria-label={t("webAddress")} value={address} onChange={e=>setAddress(e.target.value)} onKeyDown={e=>e.stopPropagation()} style={{flex:1,fontSize:21,padding:12}}/><button type="submit" style={{fontSize:20,padding:12}}>{t("go")}</button></form><iframe title={t("themedWebBrowser")} src={webUrl} sandbox="allow-scripts allow-forms allow-same-origin allow-popups" style={{border:0,background:"white",flex:1}}/><div style={{fontSize:17}}>{t("browserBlockedNotice")}</div><button onClick={()=>{const sc=client();if(sc?.System?.OpenInSystemBrowser)sc.System.OpenInSystemBrowser(webUrl);else setNotice(t("browserDeckOnly"));}} style={{...itemStyle,background:skin.panel,minHeight:45,fontSize:20}}>{t("openInSystemBrowser")}</button></div> : <div className="dht-page-body" style={{display:"flex",gap:38,minHeight:0,flex:1}}>
        {game&&<GameArt g={game} kind="portrait" style={{width:250,alignSelf:"flex-start",maxHeight:"85%",borderRadius:skin.radius}}/>}
        <div ref={listRef} className="dht-page-list" data-place={page.place} style={{overflowY:"auto",flex:1,padding:6}}>{rows.length?rows.map((r,i)=><button key={`${r.label}-${i}`} className="dht-destination-row" data-selected={current===i} data-state={r.state} onClick={()=>choose(i)} style={{...itemStyle,marginBottom:8,background:current===i?skin.accent:skin.panel,color:current===i?skin.accentText:skin.text,...(current===i?{outline:`2px solid ${skin.sub}`,outlineOffset:1}:{} )}}><span className="dht-row-icon">{r.game?<GameArt g={r.game} kind="portrait" style={{width:42,height:58,borderRadius:3}}/>:<Icon name={r.icon??"info"} size={32}/>}</span><span className="dht-row-text"><span className="dht-row-label" style={{display:"block",fontSize:settings.tvMode?27:24}}>{r.label}</span>{r.sub&&<span className="dht-row-sub" style={{display:"block",fontSize:18,marginTop:5}}>{r.sub}</span>}{r.progress!==undefined&&r.progress>=0&&<span className="dht-row-progress" style={{display:"block",height:6,marginTop:8,borderRadius:3,background:"#0003",overflow:"hidden",width:"min(420px,100%)"}}><i style={{display:"block",height:"100%",width:`${r.progress*100}%`,background:"currentColor"}}/></span>}</span></button>):<p style={{fontSize:24}}>{t("nothingToDisplay")}</p>}</div>
      </div>}</div></div>
      <footer className="dht-page-footer" style={{fontSize:19,color:skin.tabText??skin.text}}>{settings.theme==="nazarick"?t("hintsNazarickDest"):t("hintsStandardDest")}{page.place==="library"||page.place==="search"?t("hintSearch"):""}</footer>
    </div><MenuView menu={menu} variant={menuVariant}/>
  </Stage></div>;
}
