import {useXboxArtwork} from "./xboxFallbackArtwork";
import {cabinetWallpapers,useCabinetWallpaper} from "../x360Cabinet";
import {KinectPages,KinectPage} from "./X360KinectPages";
import {BackgroundMedia} from "../WallpaperMedia";
import {customProfilePicture} from "../profilePicture";
// Xbox 360 Kinect dashboard (2010), rebuilt from the Kinect-era dashboard in
// thedev0ps/Xbox-360-Dashboard-Archive. Layout follows its XUI scenes on a
// 1280×720 canvas: ChannelListScene at (144,154) with the channel names about
// 35px apart and the current one scaled 1.2, a flat row of glass slots (420×320
// postcards and 234×320 box art) with SlotSideShadow, the green aura behind,
// and the button legend. Artwork is the asset set
// x360-kinect-dash.
import { CSSProperties, useState } from "react";
import { GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game } from "../library";
import { showTitle, THEMES } from "../settings";
import { Badges } from "../badges";
import { playSound, useSteamStatus, useWallpaper } from "../steam";
import { useAssets } from "../assets";
import { X360Avatar, avatarForName, AvatarSpec } from "./X360Avatar";
import { AvatarEditor, OWN_AVATAR_SET, savedAvatar, saveAvatar } from "./X360AvatarEditor";

import {MetroAvatar, MetroAvatarEditor} from "./X360MetroAvatar";

import { useX360Gamerpic, useX360Look, X360_SECTION } from "../skins";
import { useReportFocus } from "../focus";
type Slot = { key: string; label: string; sub?: string; game?: Game; art?: string; glyph?: IconName; run: () => void };
type Channel = { id: string; label: string; slots: Slot[] };

const FONT = `var(--dht-font, "Segoe UI", "Helvetica Neue", Arial, sans-serif)`;
const INK = "#ebebeb";
const TEXT_SHADOW = "0 1px 2px rgba(15,15,15,.5)";
// 1280×720 scene units
const LIST_X = 144;
const LIST_Y = 154;
const ROW_Y = 226;
const SLOT_H = 320;
const POSTCARD_W = 420;
const PORTRAIT_W = 234;
const ART_H = 200;
const GAP = 18;

export function KinectHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const st = useSteamStatus();
  const gamerPicture=useX360Gamerpic();
  const profilePicture=gamerPicture??st.avatar;
  const wall = useWallpaper("x360");
  const a = useXboxArtwork("x360-kinect-dash");
  const look = useX360Look();
  const cabinet=useCabinetWallpaper(s.x360.cabinetWallpaper??"");
  const cabinetInk=cabinet.background?cabinetWallpapers.find(item=>item.id===s.x360.cabinetWallpaper)?.ink:undefined;
  const menu = useMenu();
  const [page,setPage]=useState<KinectPage|null>(null),[previewGame,setPreviewGame]=useState<Game|undefined>();
  const openPage=(next:KinectPage,game?:Game)=>{setPreviewGame(game);setPage(next);playSound('select');};
  const openVideos=()=>openPage('videos'),openMusic=()=>openPage('music');
  const games = api.lib.games;
  const [avatarOpen,setAvatarOpen]=useState(false),[legacyOpen,setLegacyOpen]=useState(false),[avatarRevision,setAvatarRevision]=useState(0);
  const mine=savedAvatar(s)??avatarForName(api.user);
  const fallbackAvatar=<LegacyKinectAvatar spec={mine} motion={s.animations}/>;
  const presets = () => openPage("dashboards");
  const play = (g: Game): Slot => ({ key: `g${g.appid}`, label: g.name, sub: `${fmtPlaytime(g.playtime, g.lastPlayed, true)} · Last played ${fmtLastPlayed(g.lastPlayed)}`, game: g, run: () => api.activate(g, () => openPage("library",g)) });

  // Kinect-era channel names; the slots open Steam's equivalents.
  const originalChannels: Channel[] = [
    { id: "home", label: "home", slots: [
      ...games.slice(0, 1).map(play),
      { key: "kinect", label: "Steam Store", sub: "New releases, deals and demos", art: "slot-xboxlive", glyph: "store", run: () => openPage("info") },
      { key: "basics", label: "Downloads", sub: st.downloads ? `${st.downloads} downloading` : "Queue and updates", art: "slot-xboxbasicsslot", glyph: "download", run: () => openPage("downloads") },
    ] },
    { id: "games", label: "games", slots: [
      ...games.slice(0, 10).map(play),
      { key: "lib", label: "Game Library", sub: `${games.length} games`, art: "slot-games", glyph: "library", run: () => openPage("library") },
      { key: "ach", label: "Achievements", sub: "Your progress", art: "slot-kinect", glyph: "trophy", run: () => openPage("achievements") },
    ] },
    { id: "video", label: "video", slots: [
      { key: "shots", label: "Screenshots", sub: "Your captures", glyph: "photo", run: () => openPage("pictures") },
      { key: "web", label: "Internet", sub: "Web browser", glyph: "globe", run: () => openPage("browser") },
    ] },
    { id: "social", label: "social", slots: [
      { key: "friends", label: "Friends", sub: st.friendsOnline !== undefined ? `${st.friendsOnline} online` : "Friends and chat", art: "slot-friends", glyph: "friends", run: () => openPage("friends") },
      { key: "msg", label: "Messages", sub: st.notifications ? `${st.notifications} new` : "Notifications", glyph: "bell", run: () => openPage("messages") },
      { key: "community", label: "Community", sub: "Hubs, guides and workshop", art: "slot-family", glyph: "globe", run: () => openPage("community") },
    ] },
    { id: "settings", label: "settings", slots: [
      ...([{ key: "avatar", label: "My Avatar", sub: "Change your avatar's look and clothes", art: "slot-avatars", glyph: "user" as const, run: () => setAvatarOpen(true) }]),
      { key: "settings", label: "System Settings", sub: "Steam settings", glyph: "gear", run: () => openPage("settings") },
      { key: "home", label: "Home Screen", sub: "ThemeHub options", glyph: "home", run: () => openPage("home") },
      { key: "presets", label: "Dashboards", sub: "Switch presets", glyph: "palette", run: presets },
      { key: "steamhome", label: "Home", sub: "Steam's own home", glyph: "steam", run: api.showSteamHome },
      { key: "power", label: "Turn Off", sub: "Power options", glyph: "power", run: () => openPage("power") },
    ] },
  ];
  const byId=(id:string)=>originalChannels.find(channel=>channel.id===id)!;
  const channels:Channel[]=[
    {...byId('home'),id:'welcome',label:'Welcome'},
    {id:'spotlight',label:'Spotlight',slots:[...games.slice(0,4).map(play),{key:'spotlight-store',label:'Steam Store',glyph:'store',run:()=>openPage("store")}]},
    {id:'myxbox',label:'My Xbox',slots:[
      {key:'profile',label:api.user,sub:st.online?'Online':'Offline',art:'slot-avatars',glyph:'user',run:()=>openPage('profile')},
      {key:'my-games',label:'Game Library',glyph:'game',run:()=>openPage("library")},
      {key:'my-videos',label:'Video Library',glyph:'photo',run:openVideos},
      {key:'my-music',label:'Music Library',glyph:'music',run:openMusic},
      ...byId('settings').slots,
    ]},
    {...byId('games'),label:'Game Marketplace'},
    {...byId('video'),label:'Video Marketplace'},
    {id:'music',label:'Music Marketplace',slots:[{key:'music',label:'Music Library',glyph:'music',run:openMusic},{key:'music-settings',label:'Music Settings',glyph:'gear',run:()=>openPage("home")}]},
    {...byId('social'),label:'Friends'},
    {...byId('settings'),label:'Settings'},
  ];
  const [ch, setCh] = useRemembered("kinect-reference-channel", 2);
  const [sels, setSels] = useRemembered<Record<string, number>>("kinect-sels", {});
  const ci = clamp(ch, 0, channels.length - 1);
  const chan = channels[ci];
  const sel = clamp(sels[chan.id] ?? 0, 0, chan.slots.length - 1);
  const cur = chan.slots[sel];
  useReportFocus(cur?.game);

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "My Avatar", action: () => setAvatarOpen(true) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    const g = cur?.game;
    menu.open(g ? [{ label: "Play", action: () => api.launch(g) }, { label: "Game Details", action: () => api.details(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };
  const onInput = (p: Press): boolean => {
    if(page||avatarOpen||legacyOpen)return true;
    if (menu.handle(p)) return true;
    const k = p.btn;
    if (k === "y") return options(), true;
    // the names above the current one are the following channels, so ↓ brings the next one down
    if (k === "up" || k === "down") {
      const n = clamp(ci + (k === "up" ? 1 : -1), 0, channels.length - 1);
      if (n !== ci) (setCh(n), playSound("tab"));
      else playSound("end");
      return true;
    }
    if (k === "left" || k === "right" || k === "l1" || k === "r1") {
      const d = k === "left" ? -1 : k === "right" ? 1 : k === "l1" ? -4 : 4;
      const n = clamp(sel + d, 0, chan.slots.length - 1);
      if (n !== sel) (setSels((m) => ({ ...m, [chan.id]: n })), playSound("move"));
      else playSound("end");
      return true;
    }
    if (k === "a" && cur) return playSound("select"), cur.run(), true;
    if (k === "x" && cur?.game) return api.launch(cur.game), true;
    if (k === "menu" && cur?.game) return api.nativeMenu(cur.game), true;
    return false;
  };

  // the 1280×720 scene, fitted into the stage and centred
  const k = Math.min(W / 1280, H / 720);
  const ox = (W - 1280 * k) / 2;
  const oy = (H - 720 * k) / 2;
  const anim = s.animations ? "260ms cubic-bezier(.2,.7,.3,1)" : "0ms";

  // flat row: games are box art, everything else a postcard; the row slides so the selected slot sits at the left
  const widths = chan.slots.map((e) => (e.game ? PORTRAIT_W : POSTCARD_W));
  const xs = widths.reduce<number[]>((acc, _w, i) => (acc.push(i ? acc[i - 1] + widths[i - 1] + GAP : 0), acc), []);
  const shift = Math.max(0, xs[sel] - (sel > 0 ? 120 : 0));

  const slot = (e: Slot, i: number) => {
    const on = i === sel;
    const w = widths[i];
    const left = LIST_X + xs[i] - shift;
    // Keep outgoing cards mounted until the slide ends; the Stage clips them.
    const art = e.art ? a[e.art] : undefined;
    const glass = e.game ? a["portrait-placeholder-glass"] : a["postcard-placeholder-glass"];
    return (
      <div key={e.key} className="dht-x360n-card dht-tile" role="button" tabIndex={on?0:-1} aria-label={e.label} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();event.stopPropagation();e.run();}}} data-selected={on} data-name={e.label} onClick={() => (on ? e.run() : setSels((m) => ({ ...m, [chan.id]: i })))}
        style={{ position: "absolute", left, top: ROW_Y, width: w, height: SLOT_H, transition: `left ${anim}, transform ${anim}, opacity ${anim}`, transform: on ? "scale(1.04)" : "none", transformOrigin: "50% 60%", zIndex: on ? 10 : 1, opacity: i < sel ? 0.55 : 1, cursor: "pointer", WebkitBoxReflect: "below 2px linear-gradient(transparent 78%, rgba(255,255,255,.18))" } as CSSProperties}>
        {/* SlotSideShadow on the right edge */}
        {a.slotsideshadow && <img src={a.slotsideshadow} aria-hidden="true" style={{ position: "absolute", left: w - 74, top: 0, width: 148, height: SLOT_H, opacity: 0.6, pointerEvents: "none" }} />}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: glass ? `#f4f6f2 url("${glass}") center/100% 100%` : "linear-gradient(180deg,#ffffff,#e4e8e0)", boxShadow: on ? "0 0 0 3px #fff, 0 0 18px 4px rgba(190,255,90,.75)" : "0 2px 6px rgba(0,0,0,.25)" }}>
          {e.game ? (
            <GameArt g={e.game} kind="portrait" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <div style={{ position: "absolute", left: 0, top: 0, width: w, height: ART_H, overflow: "hidden", background: "linear-gradient(180deg,#bcd3e4,#e9f0f4)" }}>
                {e.key==="home"||e.key==="steamhome"?<div data-kinect-home-icon style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}><KinectHomeIcon/></div>:art ? <img src={art} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={e.glyph ?? "folder"} size={110} color="#5a8f17" /></div>}
                {a["slot-gradient"] && <img src={a["slot-gradient"]} aria-hidden="true" style={{ position: "absolute", left: -2, bottom: -2, width: w + 4, height: 154, opacity: 0.35 }} />}
              </div>
              <div style={{ position: "absolute", left: 18, right: 18, top: ART_H + 16, color: "#3a3a3a", fontSize: 24, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</div>
              {e.sub && <div style={{ position: "absolute", left: 18, right: 18, top: ART_H + 52, color: "#777", fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.sub}</div>}
            </>
          )}
        </div>
      </div>
    );
  };

  const legend = (img: string | undefined, letter: string, color: string, text: string) => (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {img ? <img src={img} style={{ width: 32, height: 32 }} /> : <span style={{ width: 28, height: 28, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${color} 60%)`, color: "#000", fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</span>}
      <span>{text}</span>
    </span>
  );

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", y: "Options" }}>
      <Stage background="#7fb21a">
        <style>{`@keyframes dhtKinectGuide{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}} @media(prefers-reduced-motion:reduce){.dht-x360n-card,.dht-x360n-channel,[data-kinect-channel]{animation:none!important;transition:none!important}}`}</style>
        {cabinet.background?<><div style={{position:"absolute",inset:0,background:"#242624"}}/><img className="dht-kinect-cabinet-wallpaper" src={cabinet.background} alt="" style={{position:"absolute",left:ox,top:oy,width:1280*k,height:720*k,objectFit:"contain"}}/></>:wall || look.bg || a.background ? <BackgroundMedia src={wall ?? look.bgFor(X360_SECTION[chan.id] ?? "home") ?? a.background} className="dht-x360n-bg" data-dht-from-skin={!wall && look.bg ? "x360" : undefined} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} /> : <div className="dht-x360n-bg" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, #d4ef2a 0%, #8cc21c 45%, #3f7d10 100%)" }} />}
        {!cabinet.background&&!wall&&!look.bg&&(a["aura-floor"]?<img aria-hidden="true" src={a["aura-floor"]} style={{position:'absolute',inset:0,width:W,height:H,pointerEvents:'none'}}/>:<div aria-hidden="true" style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 38%,#f0f3ed00 45%,#eff2eb 70%,#a0a5a0 100%)',pointerEvents:'none'}}/>)}
        {cabinet.error&&<div role="status" style={{position:"absolute",right:20,bottom:20,zIndex:80}}>Cabinet wallpaper unavailable. Try selecting it again.</div>}
        <div style={{ position: "absolute", left: ox, top: oy, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: "0 0", fontFamily: FONT, color: cabinetInk??INK }}>
          {/* Kinect reference: small signed-in name and gamer picture at
              x≈1173/y≈54 (right edge), independent of the full-body avatar. */}
          <button data-kinect-profile-header aria-label={`Profile: ${api.user}`} onClick={()=>openPage('profile')} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();openPage('profile');}}} style={{position:'absolute',right:106,top:52,height:64,maxWidth:360,display:'flex',alignItems:'flex-start',gap:10,padding:0,border:0,background:'transparent',font:'inherit',color:cabinetInk??INK,textAlign:'right',cursor:'pointer',zIndex:65,visibility:page?'hidden':undefined}}>
            <span style={{paddingTop:2,minWidth:0}}><span data-kinect-profile-name style={{display:'block',fontFamily:'"Segoe UI",Arial,sans-serif',fontSize:20,fontWeight:400,letterSpacing:'.1px',lineHeight:'25px',maxWidth:280,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',textShadow:cabinetInk==='#343c37'?'0 1px #fff5':TEXT_SHADOW}}>{api.user}</span><span data-kinect-profile-status style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:6,fontSize:14,lineHeight:'20px',opacity:.9}}><span aria-hidden="true" style={{fontSize:8}}>●</span>{st.online?'Online':'Offline'}{st.notifications!==undefined&&<><Icon name="bell" size={13}/><span aria-label={`${st.notifications} notifications`}>{st.notifications}</span></>}</span></span>
            <span style={{position:'relative',display:'grid',placeItems:'center',width:64,height:64,flexShrink:0,background:'#7b9869',border:'1px solid #39453888',boxSizing:'border-box',boxShadow:'inset 0 0 0 1px #fff5,0 1px 2px #0003',color:'#fff',fontSize:30}} aria-hidden={!profilePicture}>
              <span aria-hidden="true">{api.user.trim().charAt(0).toUpperCase()}</span>
              {profilePicture&&<img src={profilePicture} alt="Gamer picture" onError={event=>{event.currentTarget.style.visibility='hidden';}} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>}
            </span>
          </button>
          {/* channel list: current name lowest and 1.2× larger, the following ones above it about 35px apart */}
          <div style={{ position: "absolute", left: LIST_X, top: 0, width: 800, height: ROW_Y, overflow: "hidden", zIndex:60,visibility:page&&page!=="power"?"hidden":undefined }}>
            {channels.map((c, i) => {
              const d = i - ci;
              if (d < 0 || d > 5) return null;
              const on = d === 0;
              return (
                <div key={c.id} className="dht-x360n-channel" role="button" tabIndex={0} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();setCh(i);playSound("tab");}}} data-selected={on} onClick={() => (setCh(i), playSound("tab"))}
                  style={{ position: "absolute", left: 0, top: on ? LIST_Y + 14 : LIST_Y - 26 - (d - 1) * 35, fontSize: on ? 36 : 26, lineHeight: "44px", whiteSpace: "nowrap", textShadow: cabinetInk==="#343c37"?"0 1px 1px #fff5":TEXT_SHADOW, opacity: on ? 1 : d < 0 ? 0 : Math.max(0.3, 0.75 - (d - 1) * 0.12), transition: `top ${anim}, opacity ${anim}, font-size ${anim}`, cursor: "pointer" }}>
                  {c.label}
                </div>
              );
            })}
          </div>

          <div key={chan.id} data-kinect-channel={chan.id} style={{ position: "absolute", inset: 0, opacity:page&&page!=="power"?0:1,pointerEvents:page?"none":undefined, animation: s.animations ? "dhtKinectIn 300ms ease-out" : undefined }}>
            <style>{`@keyframes dhtKinectIn { from { opacity: 0; transform: translateY(-28px) } to { opacity: 1; transform: none } }`}</style>
            {chan.slots.map(slot)}
          </div>

          {/* game line under the row */}
          {cur?.game && (
            <div style={{ position: "absolute", left: LIST_X, top: 584, width: 900, height: 26, fontSize: 18, textShadow: "0 1px 2px rgba(15,15,15,.8)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", overflow: "hidden" }}>
              {showTitle(s, "x360", true) && <b style={{ fontWeight: 600 }}>{cur.game.name}</b>}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{cur.sub}</span>
              <Badges g={cur.game} size={13} />
            </div>
          )}

          {/* your avatar, standing on the floor in front of the far panels */}
          <div aria-hidden="true" style={{ position: "absolute", left: page==="profile"?620:970, top: 192, width: 280, height: 420, zIndex: 50, pointerEvents: "none" }}>
            {customProfilePicture()?<img src={customProfilePicture()} alt="Custom profile picture" style={{width:"100%",height:"100%",objectFit:"contain"}}/>:(!avatarOpen&&!legacyOpen&&(!page||page==="profile")&&<MetroAvatar revision={avatarRevision} fallback={fallbackAvatar} framing="nxe"/>)}
          </div>
          {/* button legend */}
          <div style={{ position: "absolute", left: LIST_X, top: 632, height: 32,visibility:page?"hidden":undefined, display: "flex", gap: 34, alignItems: "center", fontSize: 18, textShadow: TEXT_SHADOW }}>
            {legend(a["legend-a"], "A", "#3fb83f", "Select")}
            {legend(a["legend-y"], "Y", "#e9c31d", "Options")}
          </div>
        </div>
        {page&&<KinectPages key={page} page={page} game={previewGame} onClose={()=>{setPage(null);setPreviewGame(undefined);}} onPage={next=>openPage(next)} onAvatar={()=>{setPage(null);setAvatarOpen(true);}}/>}
        {avatarOpen&&<MetroAvatarEditor variant="kinect" fallback={fallbackAvatar} onClose={()=>{setAvatarOpen(false);setAvatarRevision(v=>v+1);}} onLegacy={()=>{setAvatarOpen(false);setAvatarRevision(v=>v+1);setLegacyOpen(true);}}/>}
        {legacyOpen&&<LegacyKinectEditor name={api.user} spec={mine} motion={s.animations} onDone={spec=>{if(spec)saveAvatar(spec);setLegacyOpen(false);setAvatarRevision(v=>v+1);}}/>}
        <MenuView menu={menu} variant="x360" appearance={{backdrop:{background:'#0009'},panel:{position:'absolute',left:ox+368*k,top:oy+148*k,width:544*k,minHeight:360*k,right:'auto',bottom:'auto',transform:'none',borderRadius:0,background:'linear-gradient(#f5f7f3,#d8dfd6)',color:'#414a40',padding:20*k,boxShadow:'0 4px 18px #0005',animation:s.animations?'dhtKinectGuide 220ms ease-out':undefined},item:{fontSize:21*k,padding:12*k,borderRadius:0},selectedItem:{background:'#78b918',color:'#fff'},text:{color:'#414a40'}}}/>
      </Stage>
    </ThemeRoot>
  );
}

function LegacyKinectAvatar({spec,motion}:{spec:AvatarSpec;motion:boolean}) {
 const own=useAssets(OWN_AVATAR_SET);
 return <X360Avatar spec={spec} model={own.avatar} motion={motion} faceX={-0.6}/>;
}
function LegacyKinectEditor({name,spec,motion,onDone}:{name:string;spec:AvatarSpec;motion:boolean;onDone:(spec?:AvatarSpec)=>void}) {
 const own=useAssets(OWN_AVATAR_SET);
 return <AvatarEditor name={name} initial={spec} firstRun={false} model={own.avatar} motion={motion} onDone={onDone}/>;
}

/** Independently drawn pictogram, following the flat Kinect card icon language. */
function KinectHomeIcon(){return <svg viewBox="0 0 160 130" width="140" height="118" aria-hidden="true">
 <path d="M18 58 80 10l62 48-10 13-52-40-52 40Z" fill="#729c27"/>
 <path d="M36 66 80 32l44 34v53H94V84H66v35H36Z" fill="#68736b"/>
 <path d="M99 30V16h16v26Z" fill="#68736b"/>
 <path d="M45 72h17v17H45zm53 0h17v17H98Z" fill="#e8f1e4"/>
 </svg>;}
