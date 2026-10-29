import {useNxeIcons,NxeOriginalIcon,NxeButtonHint,NxeWordmark} from './X360NxeIcons';
import {nxeRect,nxeReference,nxeRowPitch,nxeFocusDuration} from './X360NxeReference';
import {useNxeWindow} from './X360NxeWindow';
import {NxeFocus} from './X360NxeFocus';
import {BackgroundMedia} from "../WallpaperMedia";
import {customProfilePicture} from "../profilePicture";
// Xbox 360 New Xbox Experience (2008), rebuilt from the 9199 dashboard in
// thedev0ps/Xbox-360-Dashboard-Archive. Measurements come from its XUI scenes
// (controlp: MobyChannelScene, PanelScene, LegendScene, AuraScene) on a
// 1280×720 canvas: channel names at (96,48) with the current one lowest and the
// upcoming ones stacked above it 36px apart, a cascade of 420×320 panels that
// each cast PanelShadow onto the one behind, a description line at y 574 and
// the button legend at (96,632). Interface artwork prefers the optional console pack, with our SVG set as fallback.
import { CSSProperties, useState, useEffect, useRef } from "react";
import { GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { achievements, fmtLastPlayed, fmtPlaytime, Game, openSteam } from "../library";
import { showTitle, THEMES } from "../settings";
import { playSound, useClock, useSteamStatus, useWallpaper } from "../steam";
import { useAssets } from "../assets";
import { X360Avatar, avatarForName, AvatarSpec } from "./X360Avatar";
import { AvatarEditor, OWN_AVATAR_SET, savedAvatar, saveAvatar } from "./X360AvatarEditor";

import {NxeCardPages,isNxeCardPage} from './X360NxeCardPages';
import {NxeMediaBrowser} from './X360NxeMediaBrowser';
import {NxeMediaPage} from "./X360NxeMedia";
import {NxePages,NxePage} from "./X360NxePages";
import {MetroAvatar, MetroAvatarEditor} from "./X360MetroAvatar";

import { useX360Gamerpic, useX360Look, X360_SECTION } from "../skins";
import { useReportFocus } from "../focus";
type Slot = { key: string; label: string; sub?: string; game?: Game; tray?: string; icon?: string; glyph?: IconName; run: () => void };
type Channel = { id: string; label: string; slots: Slot[] };

const FONT = `var(--dht-font, "Segoe UI", "Segoe UI Semibold", "Helvetica Neue", Arial, sans-serif)`;
const TEXT_SHADOW = "0 1px 2px rgba(15,15,15,.5)";
// 1280×720 scene units
const SAFE_X = 96;
const PANEL_W = 420;
const PANEL_H = 320;
const PANEL_TOP = 230;

export function NxeHome() {
  const api = useHome();
  const nxeIcons=useNxeIcons(),consoleArt=useAssets("x360-nxe-dash");
  const s = api.settings;
  const { W, H } = useStage();
  const st = useSteamStatus();
  const now=useClock(15000);
  const wall = useWallpaper("x360");
  const look = useX360Look();
  const pickedPic = useX360Gamerpic(); // gamer picture package chosen in Theme options
  const menu = useMenu();
  const games = api.lib.games;
  const [avatarOpen,setAvatarOpen]=useState(false),[legacyOpen,setLegacyOpen]=useState(false),[avatarRevision,setAvatarRevision]=useState(0);
  const [page,setPage]=useState<NxePage|null>(null);
  const [pageClosing,setPageClosing]=useState(false);
  const [initialSection,setInitialSection]=useState('');
  const openSettingsSection=(section:string)=>{setInitialSection(section);setPage('settings');};
  const [previewGame,setPreviewGame]=useState<Game|undefined>();
  const openGamePreview=(game:Game)=>{setPreviewGame(game);setPage("library");setPageClosing(false);};
  const closePage=()=>{setInitialSection('');setPage(null);setPreviewGame(undefined);setPageClosing(false);};
  const mine=savedAvatar(s)??avatarForName(api.user);
  const fallbackAvatar=<LegacyNxeAvatar spec={mine} motion={s.animations}/>;
  const presets = () => setPage('dashboards');
  const play = (g: Game): Slot => ({ key: `g${g.appid}`, label: g.name, sub: `${fmtPlaytime(g.playtime, g.lastPlayed, true)} · Last played ${fmtLastPlayed(g.lastPlayed)}`, game: g, run: () => api.activate(g, () => openGamePreview(g)) });

  // NXE channel names; the panels behind them open Steam's equivalents.
  const channels: Channel[] = [
    { id: "spotlight", label: "Spotlight", slots: [
      ...games.slice(0, 1).map(play),
      { key: "store", label: "Steam Store", sub: "New releases, deals and demos", tray: "slot-orange", icon: nxeIcons["store-small"], glyph: "store", run: () => setPage("store") },
      { key: "community", label: "Community", sub: "Hubs, guides and workshop", tray: "slot-green", icon: nxeIcons["community-small"], glyph: "globe", run: () => setPage("community") },
    ] },
    { id: "games", label: "Games", slots: [
      ...games.slice(0, 10).map(play),
      { key: "lib", label: "Game Library", sub: `${games.length} games`, tray: "slot-games", icon: nxeIcons.games, glyph: "library", run: () => setPage("library") },
      { key: "ach", label: "Achievements", sub: "Your progress", tray: "slot-green", icon: nxeIcons["achievements-small"], glyph: "trophy", run: () => setPage("achievements") },
    ] },
    { id: "market", label: "Game Marketplace", slots: [
      { key: "store2", label: "Steam Store", sub: "Featured and specials", tray: "slot-orange", icon: nxeIcons["store-small"], glyph: "store", run: () => setPage("store") },
      { key: "dl", label: "Active Downloads", sub: st.downloads ? `${st.downloads} downloading` : "Queue and updates", tray: "slot-green", glyph: "download", run: () => setPage("downloads") },
    ] },
    { id: "friends", label: "Friends", slots: [
      { key: "friends", label: "Friends", sub: st.friendsOnline !== undefined ? `${st.friendsOnline} online` : "Friends and chat", tray: "slot-friends", icon:nxeIcons["friends-small"], run: () => setPage("friends") },
      { key: "msg", label: "Messages", sub: st.notifications ? `${st.notifications} new` : "Notifications", tray: "slot-green", icon: nxeIcons["mail-small"], glyph: "bell", run: () => setPage("messages") },
    ] },
    {id:'video',label:'Video Library',slots:[
      {key:'videos',label:'My Videos',icon:nxeIcons.video,sub:'Videos and screenshots on this device',glyph:'photo',run:()=>setPage("videos")},
      {key:'video-downloads',label:'Recently Downloaded',sub:'Your Steam downloads',glyph:'download',run:()=>setPage('downloads')},
      {key:'video-store',label:'Video Marketplace',sub:'Browse Steam videos and media',glyph:'store',run:()=>setPage('store')},
    ]},
    {id:'music',label:'Music Library',slots:[
      {key:'music',label:'Music Library',icon:nxeIcons.music,sub:'Your music and media',glyph:'music',run:()=>setPage('music')},
      {key:'music-settings',label:'Music Settings',icon:nxeIcons.settings,sub:'Background music and sound options',glyph:'gear',run:()=>openSettingsSection('audio')},
    ]},
    {id:'pictures',label:'Picture Library',slots:[
      {key:'pictures',label:'My Pictures',icon:nxeIcons.pictures,sub:'Screenshots and pictures on this device',glyph:'photo',run:()=>setPage('pictures')},
      {key:'picture-settings',label:'Theme Background',icon:nxeIcons['cast-themes-small'],sub:'Choose a dashboard theme',glyph:'palette',run:()=>setPage('themes')},
    ]},
    { id: "myxbox", label: "My Xbox", slots: [
      { key: "me", label: api.user, sub: st.online ? "Online" : "Offline", tray: "slot-profile", icon: customProfilePicture() ?? pickedPic ?? nxeIcons.avatar, glyph: "user", run: () => setPage("friends") },
      ...([{ key: "avatar", label: "My Avatar", sub: "Change your avatar's look and clothes", tray: "slot-profile", icon: nxeIcons.avatar, glyph: "user" as const, run: () => setAvatarOpen(true) }]),
      { key: "lib2", label: "Game Library", sub: `${games.length} games`, tray: "slot-games", icon: nxeIcons.games, glyph: "library", run: () => setPage("library") },
      { key: "pics", label: "Picture Library", sub: "Screenshots", tray: "slot-photos", icon: nxeIcons.pictures, glyph: "photo", run: () => setPage("pictures") },
      { key: "web", label: "Video Library", sub: "Local videos and Steam recordings", tray: "slot-videos", icon: nxeIcons.video, glyph: "photo", run: () => setPage("videos") },
      { key: "settings", label: "System Settings", sub: "Steam settings", tray: "slot-tray", icon: nxeIcons.settings, glyph: "gear", run: () => setPage("settings") },
      { key: "home", label: "Home Screen", sub: "ThemeHub options", icon:nxeIcons["theme-hub"], tray: "slot-tray", glyph: "home", run:()=>setPage('home') },
      { key: "presets", label: "Dashboards", sub: "Switch presets", tray: "slot-tray", icon: nxeIcons.dashboards, glyph: "palette", run: presets },
      { key: "internet", label: "Internet", sub: "Web browser", glyph: "globe", run:()=>setPage("browser") },
      { key: "steamhome", label: "Home", sub: "Steam's own home", tray: "slot-tray", icon: nxeIcons.home, glyph: "steam", run: api.showSteamHome },
      { key: "power", label: "Turn Off", sub: "Power options", tray: "slot-tray", glyph: "power", run: () => setPage("power") },
    ] },
  ];
  const [ch, setCh] = useRemembered("nxe-reference-ch", 7);
  const [sels, setSels] = useRemembered<Record<string, number>>("nxe2-sels", {});
  const ci = clamp(ch, 0, channels.length - 1);
  const chan = channels[ci];
  const sel = clamp(sels[chan.id] ?? 0, 0, chan.slots.length - 1);
  const cur = chan.slots[sel];
  const previousChannel=useRef({channel:chan,index:ci,selection:sel});
  const [outgoing,setOutgoing]=useState<{channel:Channel;selection:number;direction:number}|null>(null);
  const direction=ci===previousChannel.current.index?(outgoing?.direction??1):ci>previousChannel.current.index?1:-1;
  useEffect(()=>{
    const previous=previousChannel.current;
    if(previous.channel.id!==chan.id&&s.animations)setOutgoing({channel:previous.channel,selection:previous.selection,direction:ci>=previous.index?1:-1});
    previousChannel.current={channel:chan,index:ci,selection:sel};
  },[chan.id,ci,sel,s.animations]);
  useEffect(()=>{if(!outgoing)return;const timer=setTimeout(()=>setOutgoing(null),280);return()=>clearTimeout(timer);},[outgoing]);

  const [insideCard,setInsideCard]=useState(false),[profileRow,setProfileRow]=useState(0),[profileDialog,setProfileDialog]=useState(false);
  const profileActions=[
    {name:'View Games',run:()=>setPage('library')},
    {name:'Edit Profile',run:()=>openSteam('settings')},
    {name:'Game Defaults',run:()=>openSteam('settings')},
    {name:'Sign-In Settings',run:()=>openSteam('settings')},
    {name:'Steam Community',run:()=>openSteam('community')},
  ];
  const profileActive=insideCard&&cur?.key==='me';
  const cardActions=[{name:'Friends and Messages',run:()=>openSteam('friends')},{name:'Profile',run:()=>{setProfileDialog(true);setProfileRow(0);}},
    {name:'Customize Avatar',run:()=>setAvatarOpen(true)},{name:'Change Theme',run:()=>setPage('themes')},{name:'Switch Profile',run:()=>openSteam('settings')}];
  const knownProgress=games.map(achievements).filter((value):value is NonNullable<typeof value>=>!!value);
  const progress=knownProgress.length?{unlocked:knownProgress.reduce((n,p)=>n+p.unlocked,0),total:knownProgress.reduce((n,p)=>n+p.total,0)}:null;
  const activeProfileActions=profileDialog?profileActions:cardActions;
  const profileWindow=useNxeWindow(String(profileDialog),!!s.animations,true);
  useReportFocus(cur?.game);

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "My Avatar", action: () => setAvatarOpen(true) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    const g = cur?.game;
    menu.open(g ? [{ label: "Play", action: () => api.launch(g) }, { label: "Game Details", action: () => openGamePreview(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };
  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const k = p.btn;
    if (k === "y") return options(), true;
    if(profileActive){
      if(profileWindow.isClosing())return true;
      if(k==='b'){if(profileDialog)profileWindow.close(()=>{setProfileDialog(false);setProfileRow(1);});else setInsideCard(false);playSound('back');return true;}
      if(k==='up'||k==='down'){
        const next=clamp(profileRow+(k==='down'?1:-1),0,activeProfileActions.length-1);
        setProfileRow(next);playSound(next===profileRow?'end':'move');return true;
      }
      if(k==='a'){playSound('select');activeProfileActions[profileRow].run();return true;}
      return true;
    }
    if(page)return true;
    // the queue above the current name holds the following channels, so ↓ brings the next one down
    if (k === "up" || k === "down") {
      const n = clamp(ci + (k === "down" ? 1 : -1), 0, channels.length - 1);
      if (n !== ci) (setInsideCard(false),setCh(n), playSound("tab"));
      else playSound("end");
      return true;
    }
    if (k === "left" || k === "right" || k === "l1" || k === "r1") {
      const d = k === "left" ? -1 : k === "right" ? 1 : k === "l1" ? -4 : 4;
      const n = clamp(sel + d, 0, chan.slots.length - 1);
      if (n !== sel) (setInsideCard(false),setSels((m) => ({ ...m, [chan.id]: n })), playSound("move"));
      else playSound("end");
      return true;
    }
    if(k==='a'&&cur?.key==='me'){setInsideCard(true);setProfileRow(1);playSound('select');return true;}
    if (k === "a" && cur) return playSound("select"), cur.run(), true;
    if (k === "x" && cur?.game) return api.launch(cur.game), true;
    if (k === "menu" && cur?.game) return api.nativeMenu(cur.game), true;
    return false;
  };

  // the 1280×720 scene, fitted into the stage and centred
  const k = Math.min(W / 1280, H / 720);
  const ox = (W - 1280 * k) / 2;
  const oy = (H - 720 * k) / 2;
  const anim = s.animations ? "320ms cubic-bezier(.18,.72,.24,1)" : "0ms";

  // panel d places after the current one recedes up and to the right, overlapped by the one in front
  const place = (d: number): CSSProperties => {
    if(d<0)return {left:0,top:0,opacity:0,transform:`translate3d(${SAFE_X-PANEL_W*.9}px,${PANEL_TOP+24}px,0) scale(.94)`,zIndex:31,pointerEvents:"none"};
    const scale = Math.pow(0.8, d);
    const left = SAFE_X + [0, 330, 548, 700, 812, 900, 970][Math.min(d, 6)];
    const top = PANEL_TOP - [0, 18, 32, 42, 50, 56, 60][Math.min(d, 6)];
    return {left:0,top:0,opacity:d>5?0:1,transform:`translate3d(${left}px,${top+PANEL_H*(1-scale)}px,0) scale(${scale})`,zIndex:30-d,filter:`brightness(${Math.max(.90,1-d*.018)})`,pointerEvents:d>5?"none":"auto"};
  };
  const panel = (e: Slot, i: number, selection=sel,exiting=false) => {
    const d = i - selection;
    if (d < -1 || d > 6 || (profileActive&&d!==0)) return null;
    const on = d === 0;
    const expanded=on&&!exiting&&profileActive&&e.key==='me';
    const height=expanded?492:PANEL_H;
    const titleVisible=!e.game||showTitle(s,"x360",on);
    return (
      <div key={e.key} className="dht-x360n-card dht-tile" data-selected={on&&!exiting} data-name={e.label} role="button" tabIndex={on&&!exiting?0:-1} data-nxe-expanded={expanded||undefined} aria-label={e.label+' card'} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();if(!on)setSels(m=>({...m,[chan.id]:i}));else onInput({btn:'a',repeat:event.repeat});}}} onClick={() => {if(!on){setInsideCard(false);setSels(m=>({...m,[chan.id]:i}));}else if(e.key==='me'){setInsideCard(true);setProfileRow(1);}else e.run();}}
        style={{ position: "absolute", width: expanded?456:PANEL_W, height, transformOrigin: "0 0", transition: `transform ${anim}, opacity ${anim}, filter ${anim}, width ${anim}, height ${anim}`, willChange:s.animations?"transform":undefined, cursor: "pointer", WebkitBoxReflect: "below 2px linear-gradient(transparent 85%, rgba(255,255,255,.12))", ...place(d),...(expanded?{transform:'translate3d(96px,104px,0)'}:profileActive&&d>0?{transform:`translate3d(${552+(d-1)*340}px,${145+(d-1)*30}px,0) scale(${Math.pow(.835,d)})`}:{}),...(exiting?{pointerEvents:"none" as const}:{} ) } as CSSProperties}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background:expanded?"linear-gradient(#3b515a,#253740)":"radial-gradient(ellipse at 50% 5%,#d2f75655,transparent 65%),linear-gradient(180deg,#92cd11 0%,#78b706 72%,#3d7102 100%)", borderRadius:2,boxShadow:on?"inset 0 0 0 1px #c1d0d34d,0 3px 10px #00000014":"inset 0 0 0 1px #9fb1b326,0 2px 8px #00000010" }}>
          {e.key==='me'?<div style={{position:'absolute',left:24,right:24,top:expanded?64:28}}>
            <div style={{display:'flex',gap:14,alignItems:'center'}}>{pickedPic?<img src={pickedPic} alt="" style={{width:64,height:64}}/>:<NxeOriginalIcon name="achievements-small" size={56}/>}<span style={{fontSize:20}}>{st.online?'Signed In':'Offline'}{expanded&&<><div style={{fontSize:18,marginTop:6}}>Games: {games.length}</div>{progress&&<div style={{fontSize:18}}>Achievements: {progress.unlocked} / {progress.total}</div>}</>}</span></div>
            {expanded?<div data-nxe-profile-card-actions style={{position:'relative',marginTop:25}}><NxeFocus selected={profileDialog?1:profileRow} motion={!!s.animations}/>{cardActions.map((action,n)=><button key={action.name} aria-selected={!profileDialog&&profileRow===n} onFocus={()=>setProfileRow(n)} onMouseEnter={()=>{if(!profileDialog)setProfileRow(n);}} onClick={event=>{event.stopPropagation();action.run();}} style={{position:'relative',display:'block',height:45,width:'100%',border:0,borderBottom:'1px solid #82949b33',background:'transparent',color:'inherit',font:'inherit',fontSize:21,textAlign:'left',cursor:'pointer'}}>{action.name}</button>)}</div>:<><div style={{fontSize:15,opacity:.85,marginTop:22,marginBottom:8}}>Last Games</div>
            <div style={{display:'flex',gap:8}}>{games.slice(0,3).map(game=><GameArt key={game.appid} g={game} kind="portrait" style={{width:52,height:70,objectFit:'cover'}}/>)}</div></>}
          </div>:e.game ? (
            <GameArt g={e.game} kind="landscape" style={{ position: "absolute", left:0,top:0, width: "100%", height:titleVisible?235:320, objectFit: "cover" }} />
          ) : e.icon ? (
            <img data-nxe-card-icon={e.key} src={e.icon} style={{ position: "absolute", left: 105, top: 35, height: 180, width:210, objectFit: "contain" }} />
          ) : (
            <div style={{ position: "absolute", left: 122, top: 48, opacity: 0.95 }}><Icon name={e.glyph ?? "folder"} size={150} color="#f4ffe0" /></div>
          )}
          <div aria-hidden="true" style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(115deg,#ffffff0b,transparent 35%),linear-gradient(180deg,#ffffff08,transparent 12%,#0000000c)',boxShadow:'inset 0 1px #ffffff33'}}/>

          {titleVisible && (
            <div style={{ position: "absolute", left: 0, right: 0, ...(expanded?{top:0}:{bottom:0}), padding: expanded?"16px 20px":"16px 20px 18px", background: expanded?undefined:"linear-gradient(180deg,#5a970000,#37630266)", color: "#fff", fontSize: 23, textShadow: TEXT_SHADOW, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</div>
          )}
        </div>
        {/* Soft contact shadow onto the next panel, without a hard rectangular strip. */}
        {d >= 0 && <div aria-hidden="true" style={{position:'absolute',left:(expanded?456:PANEL_W)-3,top:3,width:24,height:height-6,background:'linear-gradient(90deg,#16270820,transparent)',filter:'blur(4px)',pointerEvents:'none'}}/>}
      </div>
    );
  };

  const legend=(button:'a'|'b'|'x'|'y',text:string)=><NxeButtonHint button={button} label={text} size={32}/>;

  return (
    <ThemeRoot onInput={onInput} hints={{ a: profileActive?"Select action":"Select", b:profileActive?"Back":undefined, y: "Options" }}>
      <div data-nxe-surface style={{position:'absolute',inset:0}}><style>{`[data-nxe-surface],[data-nxe-surface] *{scrollbar-width:none!important}[data-nxe-profile-row],[data-nxe-page] [role=option],[data-nxe-media] [role=option]{opacity:.7;transition:opacity ${nxeFocusDuration}ms linear}[data-nxe-profile-row][data-selected=true],[data-nxe-page] [aria-selected=true],[data-nxe-media] [aria-selected=true]{opacity:1}[data-nxe-surface]::-webkit-scrollbar,[data-nxe-surface] *::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}`}</style>
      <Stage background="#9fb98c">
        {wall || look.bg || consoleArt.background ? <BackgroundMedia src={wall ?? look.bgFor(X360_SECTION[chan.id] ?? "home") ?? look.bg ?? consoleArt.background ?? ""} className="dht-x360n-bg" data-dht-from-skin={!wall && look.bg ? "x360" : undefined} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} /> : <div className="dht-x360n-bg" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 24% 0%,#67a60099,transparent 55%),radial-gradient(ellipse at 95% 48%,#e6ed9d88,transparent 40%),linear-gradient(180deg,#364b2e 0%,#789a64 27%,#cfddda 47%,#ecf5f1 57%,#9da7a8 100%)" }} />}
        {!wall && !look.bg && !consoleArt.background && <svg data-nxe-floor="true" aria-hidden="true" viewBox="0 0 1280 720" preserveAspectRatio="none" style={{position:"absolute",left:ox,top:oy,width:1280*k,height:720*k,pointerEvents:"none"}}><defs><filter id="nxe-horizon-soft"><feGaussianBlur stdDeviation="7"/></filter><radialGradient id="nxe-floor-light" cx="38%" cy="13%" r="95%"><stop offset="0" stopColor="#c3cfd0"/><stop offset=".43" stopColor="#7e8c90"/><stop offset="1" stopColor="#38464b"/></radialGradient><linearGradient id="nxe-horizon-light" x2="0" y2="1"><stop stopColor="#f3ffff" stopOpacity=".8"/><stop offset="1" stopColor="#f3ffff" stopOpacity="0"/></linearGradient></defs><path d="M0 414 Q640 346 1280 414 L1280 720 L0 720Z" fill="url(#nxe-floor-light)"/><path d="M0 414 Q640 346 1280 414 L1280 433 Q640 365 0 433Z" fill="url(#nxe-horizon-light)" filter="url(#nxe-horizon-soft)"/></svg>}
        <div data-nxe-dashboard ref={node=>{node?.toggleAttribute('inert',!!page);}} aria-hidden={!!page} style={{ position: "absolute", left: ox, top: oy, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: "0 0", opacity:page&&page!=='power'&&!pageClosing?0:1,transition:s.animations?"opacity 150ms ease-out":undefined,pointerEvents:page?"none":"auto", fontFamily: FONT, color: "#fff" }}>
          {/* Horizon: the light band the panels stand on */}


          {/* channel queue: current lowest, the following channels above it, clipped to the 512×164 scene */}
          <div style={{ position: "absolute", opacity:profileActive?0:1,pointerEvents:profileActive?"none":"auto",left: SAFE_X, top: 28, width: 800, height: 144, overflow: "hidden", zIndex:65 }}>
            {channels.map((c, i) => {
              const d = i - ci;
              if (d < -1 || d > 4) return null;
              return (
                <div key={c.id} className="dht-x360n-channel" data-selected={d === 0} onClick={() => (setInsideCard(false),setCh(i), playSound("tab"))}
                  style={{ position: "absolute", left: 0, top: 80 - d * 32, height: 36, lineHeight: "36px", fontSize: d===0?34:27, whiteSpace: "nowrap", textShadow: "0 1px 3px rgba(0,0,0,.27)", opacity: d === 0 ? 1 : d < 0 ? 0 : Math.max(0.25, 0.7 - (d - 1) * 0.18), transition: `top ${anim}, opacity ${anim}`, cursor: "pointer" }}>
                  {d===0&&<NxeOriginalIcon name="channel-small" size={17} style={{position:"absolute",left:0,top:9}}/>}<span style={{paddingLeft:d===0?22:0}}>{c.label}</span>
                </div>
              );
            })}
          </div>

          <style>{`
            ${!s.animations?'.dht-nxe-page-panel{animation:none!important}':''}
            @keyframes dhtNxeIn {from{opacity:0;transform:translate3d(0,var(--nxe-slide),0)}to{opacity:1;transform:translate3d(0,0,0)}}
            @keyframes dhtNxePageIn {from{opacity:0;transform:translate3d(0,12px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
            .dht-nxe-page-panel{animation:none}
            @keyframes dhtNxeOut {from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(0,var(--nxe-slide),0)}}
            @media(prefers-reduced-motion:reduce){.dht-x360n-card,.dht-nxe-channel-row,.dht-x360n-channel,.dht-nxe-page-panel,[data-nxe-focus]{animation:none!important;transition:none!important}}
          `}</style>
          {outgoing&&s.animations&&<div data-nxe-outgoing aria-hidden="true" className="dht-nxe-channel-row" style={{position:'absolute',inset:0,pointerEvents:'none',animation:'dhtNxeOut 260ms ease-in both','--nxe-slide':`${-outgoing.direction*24}px`} as CSSProperties}>
            {outgoing.channel.slots.map((entry,i)=>panel(entry,i,outgoing.selection,true))}
          </div>}
          <div key={chan.id} data-nxe-channel={chan.id} className="dht-nxe-channel-row" style={{position:'absolute',inset:0,animation:s.animations?'dhtNxeIn 320ms cubic-bezier(.18,.72,.24,1) both':undefined,'--nxe-slide':`${direction*32}px`} as CSSProperties}>
            {chan.slots.map((entry,i)=>panel(entry,i))}
            {profileActive&&<div data-nxe-profile-progress style={{position:'absolute',left:552,top:146,width:376,height:412,boxSizing:'border-box',padding:20,background:'linear-gradient(#3b515a,#253740)',boxShadow:'inset 0 0 0 1px #81949b66',fontSize:22}}><div>Achievement Progress</div><div style={{marginTop:22,fontSize:19}}>{progress?`${progress.unlocked} / ${progress.total} achievements`:'View achievement progress in Steam'}</div>{progress&&<progress aria-label="Achievement progress" value={progress.unlocked} max={Math.max(1,progress.total)} style={{width:'100%',marginTop:12,accentColor:'#8ac421'}}/>}<p style={{fontSize:17,marginTop:65}}>View your games and achievement details from Profile.</p></div>}

          </div>

          {/* Reference count line; titles and descriptions belong inside cards. */}
          <div data-nxe-caption style={{ position: "absolute", left: SAFE_X, top: 570, width: 720, height: 26, fontSize: 18, color: "#ebebeb", textShadow: "0 1px 2px rgba(15,15,15,.8)", display:profileActive?"none":"flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", overflow: "hidden" }}>
            <span style={{fontSize:14,opacity:.8,flexShrink:0}}>{sel+1} of {chan.slots.length}</span>
          </div>

          {/* button legend */}
          <div style={{ position: "absolute", left: SAFE_X, top: 670, height: 32, display: "flex", gap: 34, alignItems: "center", fontSize: 18, color: "#ebebeb", textShadow: "0 1px 1px rgba(15,15,15,.5)" }}>
            {legend("a","Select")}
            {profileActive?legend("b","Back"):legend("y","Options")}
          </div>

          <NxeWordmark/>
          {/* your avatar, standing on the floor in front of the far panels */}
          {(chan.id==="myxbox"||chan.id==="friends")&&<div aria-hidden="true" style={{ position: "absolute", left: 842, top: 140, width: 310, height: 510, zIndex: 50, pointerEvents: "none" }}>
            {customProfilePicture()?<img src={customProfilePicture()} alt="Custom profile picture" style={{width:"100%",height:"100%",objectFit:"contain"}}/>:(!avatarOpen&&!legacyOpen&&<MetroAvatar revision={avatarRevision} fallback={fallbackAvatar} framing="nxe"/>)}
          </div>}
        </div>
        {profileActive&&profileDialog&&<div data-nxe-profile-popup role="dialog" aria-modal="true" aria-label="Profile" style={{position:'absolute',inset:0,zIndex:80,background:'#000b'}}>
          <div style={{position:'absolute',left:ox,top:oy,width:1280,height:720,transform:`scale(${k})`,transformOrigin:'0 0',fontFamily:FONT,color:'#e5ecee'}}>
            <div ref={profileWindow.ref} style={{position:'absolute',left:208,top:90,width:864,height:526,transformOrigin:'50% 50%'}}>
              <div style={{position:'absolute',top:-36,left:22,fontSize:30}}>Profile</div>
              <div style={{position:'absolute',left:406,top:-56,width:46,height:46}}>{pickedPic?<img src={pickedPic} alt="Gamer picture" style={{width:46,height:46}}/>:<NxeOriginalIcon name="achievements-small" size={46}/>}</div>
              <div style={{position:'absolute',right:22,top:-32,fontSize:23}}>{now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:!s.clock24})}</div>
              <div style={{position:'absolute',inset:0,borderRadius:3,padding:14,background:'#2d3f49',boxShadow:'inset 0 0 0 1px #81939b66',display:'flex',gap:14}}>
                <div data-nxe-profile-list style={{position:'absolute',...nxeRect(nxeReference.profile.list),left:nxeRect(nxeReference.profile.list).left-208,top:20,overflowY:'auto'}}><NxeFocus selected={profileRow} motion={!!s.animations}/>
                  {profileActions.map((action,n)=><button key={action.name} data-nxe-profile-row={n} data-selected={profileRow===n} onFocus={()=>setProfileRow(n)} onMouseEnter={()=>setProfileRow(n)} onClick={action.run} onKeyDown={event=>{const btn=({ArrowUp:'up',ArrowDown:'down',Enter:'a',Escape:'b'} as Record<string,Press['btn']>)[event.key];if(btn){event.preventDefault();event.stopPropagation();onInput({btn,repeat:event.repeat});}}} style={{position:'relative',display:'block',width:'100%',height:nxeRowPitch,padding:'0 6px',boxSizing:'border-box',font:'inherit',fontSize:nxeReference.row.fontPt*1.5,textAlign:'left',color:'inherit',background:'transparent',border:0,borderBottom:'1px solid #83959c22',outline:0,cursor:'pointer'}}>{action.name}</button>)}
                </div>
                <div data-nxe-profile-detail style={{position:'absolute',...nxeRect(nxeReference.profile.detail),left:nxeRect(nxeReference.profile.detail).left-208,top:20,boxSizing:'border-box',overflow:'auto',background:'#1e303a',borderRadius:5,padding:12,fontSize:21}}><div style={{padding:'0 6px 10px',background:'#182b34',borderBottom:'1px solid #91a2aa33'}}>{api.user}</div><div style={{display:'flex',alignItems:'center',gap:12,marginTop:12}}>{pickedPic?<img src={pickedPic} alt="" style={{width:64,height:64}}/>:<NxeOriginalIcon name="achievements-small" size={64}/>}<div>{st.online?'Online':'Offline'}<div style={{fontSize:18,marginTop:6}}>{`${games.length} games`}</div>{progress&&<div style={{fontSize:18}}>Achievements: {progress.unlocked} / {progress.total}</div>}</div></div><div style={{marginTop:26,fontSize:19}}><NxeOriginalIcon name="dashboards" size={64}/><div>Theme Hub Dashboard</div></div><div style={{position:'absolute',left:12,bottom:12,display:'flex',gap:10}}>{games.slice(0,4).map(game=><GameArt key={game.appid} g={game} kind="portrait" style={{width:56,height:56,objectFit:'cover'}}/>)}</div></div>
              </div>
              <div style={{position:'absolute',top:538,left:10,display:'flex',gap:24,fontSize:17}}>{legend("a","Select")}<button onClick={()=>profileWindow.close(()=>{setProfileDialog(false);setProfileRow(1);})} style={{font:'inherit',color:'inherit',background:'transparent',border:0,cursor:'pointer'}}>{legend("b","Back")}</button></div>
            </div>
          </div>
        </div>}
        {avatarOpen&&<MetroAvatarEditor variant="nxe" name={api.user} fallback={fallbackAvatar} onClose={()=>{setAvatarOpen(false);setAvatarRevision(v=>v+1);}} onLegacy={()=>{setAvatarOpen(false);setAvatarRevision(v=>v+1);setLegacyOpen(true);}}/>}
        {legacyOpen&&<LegacyNxeEditor name={api.user} spec={mine} motion={s.animations} onDone={spec=>{if(spec)saveAvatar(spec);setLegacyOpen(false);setAvatarRevision(v=>v+1);}}/>}
        {page&&(page==='pictures'||page==='videos'?<NxeMediaBrowser key={page} page={page} onClose={closePage} onExitStart={()=>setPageClosing(true)}/>:page==='music'?<NxeMediaPage key={page} page={page} onClose={closePage} onExitStart={()=>setPageClosing(true)}/>:isNxeCardPage(page)?<NxeCardPages key={page} page={page} onClose={closePage} onExitStart={()=>setPageClosing(true)}/>:<NxePages key={page} page={page} initialGame={previewGame} initialSection={initialSection} onClose={closePage} onExitStart={()=>setPageClosing(true)} onLibrary={()=>setPage("library")} onAvatar={()=>{setPage(null);setAvatarOpen(true);}}/>)}
        <MenuView menu={menu} variant="x360" appearance={{backdrop:{background:'#0009'},panel:{position:'absolute',left:ox+96*k,top:oy+100*k,right:'auto',bottom:'auto',transform:'none',width:460*k,minHeight:490*k,padding:20*k,borderRadius:4,border:'1px solid #7f949b66',background:'linear-gradient(115deg,#344750,#23343f)',boxShadow:'0 2px 6px #0006',color:'#e7edef'},item:{width:'100%',boxSizing:'border-box',fontSize:20*k,padding:`${8*k}px ${10*k}px`,borderRadius:3,borderBottom:'1px solid #81949b33'},selectedItem:{background:'linear-gradient(#d4ec98,#6aab13 60%,#83bd25)',color:'#fff'},text:{color:'#e7edef'}}} renderTitle={title=><div style={{fontSize:23*k,fontWeight:400,marginBottom:18*k}}>{title}</div>}/>
      </Stage>
      </div>
    </ThemeRoot>
  );
}

// Load imported fallback models only when the fallback is actually mounted.
function LegacyNxeAvatar({spec,motion}:{spec:AvatarSpec;motion:boolean}) {
 const own=useAssets(OWN_AVATAR_SET);
 return <X360Avatar spec={spec} model={own.avatar} motion={motion} faceX={-0.6}/>;
}
function LegacyNxeEditor({name,spec,motion,onDone}:{name:string;spec:AvatarSpec;motion:boolean;onDone:(spec?:AvatarSpec)=>void}) {
 const own=useAssets(OWN_AVATAR_SET);
 return <AvatarEditor name={name} initial={spec} firstRun={false} model={own.avatar} motion={motion} onDone={onDone}/>;
}
