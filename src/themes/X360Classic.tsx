import { BladesAtmosphere } from "./BladesAtmosphere";
import { BladesGuide } from "./BladesGuide";
import { BLADES_FONT_CSS } from "./bladesFont";
// Earlier Xbox 360 dashboards, chosen with the "Xbox 360 dashboard" preset:
//  • Blades (2005): coloured blades that slide sideways, a menu on each.
//  • NXE (2008) / Kinect (2010): channels stacked vertically, each a row of
//    cards receding in perspective. Kinect is the white-and-green restyle.
// Layout is drawn here; in personal test builds the dashboards' own icons and
// button images (asset sets x360-blades / x360-nxe / x360-metro) are used.
import { CSSProperties, useState } from "react";
import { GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openAchievements, openSteam } from "../library";
import { showTitle, THEMES } from "../settings";
import { Badges } from "../badges";
import { fmtTime, playSound, useClock, useSteamStatus, useWallpaper } from "../steam";
import { useAssets } from "../assets";

type Entry = { key: string; label: string; sub?: string; icon?: IconName; img?: string; game?: Game; run: () => void };

function Btn({ img, letter, color }: { img?: string; letter: string; color: string }) {
  return img ? (
    <img src={img} style={{ width: 26, height: 26, display: "block" }} />
  ) : (
    <span style={{ width: 24, height: 24, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${color} 60%)`, color: "#000", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</span>
  );
}

// ═════════════════════════════ BLADES ═════════════════════════════
const BLADES = [
  { id: "market", label: "Marketplace", color: "#e46c0a", light: "#ffb36a" },
  { id: "live", label: "Xbox Live", color: "#bd7029", light: "#f0c466" },
  { id: "games", label: "Games", color: "#7aa516", light: "#d4f06a" },
  { id: "media", label: "Media", color: "#2575ab", light: "#7cc8e5" },
  { id: "system", label: "System", color: "#745389", light: "#c2a6cc" },
];

export function BladesHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const st = useSteamStatus();
  const a = useAssets("x360-blades");
  const original = useAssets("x360-blades-original");
  const menu = useMenu();
  const [blade, setBlade] = useRemembered("blades-blade", 1);
  const [sels, setSels] = useRemembered<Record<string, number>>("blades-sels", {});
  const [direction, setDirection] = useState(1);
  const changeBlade = (n: number) => { if(n === blade) return; setDirection(n > blade ? 1 : -1); setBlade(n); playSound("tab", Math.max(0,n-1)); };
  const b = BLADES[clamp(blade, 0, BLADES.length - 1)];
  const recent = api.lib.games.slice(0, 7);

  const entries: Record<string, Entry[]> = {
    market: [
      { key: "store", label: "Steam Store", sub: "New releases, deals and demos", img: a.store, icon: "store", run: () => openSteam("store") },
      { key: "dl", label: "Active Downloads", sub: "Downloads and updates", img: a.downloads, icon: "download", run: () => openSteam("downloads") },
      { key: "tiles", label: "Themes and Gamer Pictures", sub: "Presets for this home screen", img: a.themes, icon: "palette", run: () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "Presets") },
    ],
    live: [
      { key: "friends", label: "Friends", sub: st.friendsOnline !== undefined ? `${st.friendsOnline} online` : "Friends and chat", img: a.friends, icon: "friends", run: () => openSteam("friends") },
      { key: "msg", label: "Messages", sub: st.notifications ? `${st.notifications} new` : "Notifications", img: a.messages, icon: "bell", run: () => openSteam("notifications") },
      { key: "community", label: "Steam Community", sub: "Hubs, guides and workshop", img: a.live, icon: "globe", run: () => openSteam("community") },
    ],
    games: [
      ...recent.map((g) => ({ key: `g${g.appid}`, label: g.name, sub: fmtPlaytime(g.playtime), game: g, run: () => api.activate(g, () => api.launch(g)) })),
      { key: "lib", label: "Games Library", sub: `${api.lib.games.length} games`, img: a.controller, icon: "library" as IconName, run: () => openSteam("library") },
      { key: "ach", label: "Achievements", sub: "Your progress", img: a.trophy, icon: "trophy" as IconName, run: () => (recent[0] ? openAchievements(recent[0]) : openSteam("library")) },
    ],
    media: [
      { key: "shots", label: "Screenshots", sub: "Pictures from your games", icon: "photo", run: () => api.openMedia() },
      { key: "browser", label: "Web Browser", sub: "Open the browser", icon: "globe", run: () => openSteam("browser") },
    ],
    system: [
      { key: "settings", label: "Console Settings", sub: "Steam settings", icon: "gear", run: () => openSteam("settings") },
      { key: "home", label: "Home Screen Settings", sub: "Deck Home Themes options", icon: "home", run: api.openSettings },
      { key: "presets", label: "Dashboard", sub: "Switch presets", img: a.themes, icon: "palette", run: () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "Presets") },
      { key: "steamhome", label: "Home", sub: "Show Steam's own home", icon: "steam", run: api.showSteamHome },
      { key: "power", label: "Turn Off", sub: "Power options", icon: "power", run: () => openSteam("power") },
    ],
  };
  const list = entries[b.id];
  const sel = clamp(sels[b.id] ?? 0, 0, list.length - 1);
  const cur = list[sel];

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    const g = cur?.game;
    menu.open(g ? [{ label: "Play", action: () => api.launch(g) }, { label: "Game Details", action: () => api.details(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };
  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const k = p.btn;
    if (k === "y") return options(), true;
    if (k === "left" || k === "right" || k === "l1" || k === "r1") {
      const n = clamp(blade + (k === "left" || k === "l1" ? -1 : 1), 0, BLADES.length - 1);
      if (n !== blade) changeBlade(n);
      else playSound("end");
      return true;
    }
    if (k === "up" || k === "down") {
      const n = clamp(sel + (k === "up" ? -1 : 1), 0, list.length - 1);
      if (n !== sel) (setSels((m) => ({ ...m, [b.id]: n })), playSound("move"));
      return true;
    }
    if (k === "a" && cur) return playSound("select"), cur.run(), true;
    if (k === "x" && cur?.game) return api.launch(cur.game), true;
    if (k === "menu" && cur?.game) return api.nativeMenu(cur.game), true;
    return false;
  };

  const TAB = 52;
  const left = 64+blade*TAB;
  const right = 64+(BLADES.length-1-blade)*TAB;
  const bodyW = W-left-right;
  const pageOutline=`path("M 12 0 C 32 ${H*.2} 38 ${H*.36} 18 ${H*.6} C 3 ${H*.8} 0 ${H*.9} 12 ${H} L ${bodyW-12} ${H} C ${bodyW} ${H*.9} ${bodyW-3} ${H*.8} ${bodyW-18} ${H*.6} C ${bodyW-38} ${H*.36} ${bodyW-32} ${H*.2} ${bodyW-12} 0 Z")`;
  const rowH = 49;
  const visibleRows = b.id==="live"?3:Math.max(3,Math.floor((H*.34)/rowH));
  const firstRow=Math.max(0,Math.min(sel-visibleRows+1,list.length-visibleRows));
  const column = bodyW*.45;
  const gradient = ({market:"orange",live:"orange",games:"green",media:"blue",system:"purple"} as Record<string,string>)[b.id];
  const texture=(name:string)=>original[name]?`url("${original[name]}")`:undefined;
  return (
    <ThemeRoot onInput={onInput} hints={{a:"Select",y:"Options"}}>
      <Stage background="#c8c7ce">
        <style>{`${BLADES_FONT_CSS}
          .dht-blades{font-family:"DHT MC360",Tahoma,sans-serif;color:#39362d}
          .dht-blades button{font:inherit;cursor:pointer;color:inherit}
          .dht-blades button:focus-visible{outline:2px solid #333;outline-offset:-2px}
          @keyframes dhtBladeIn{from{transform:translateX(var(--blade-enter))}to{transform:translateX(0)}}
          .dht-x360b-item{background-size:100% 100%;background-repeat:no-repeat}.dht-x360b-item[data-selected=true]{color:#292820}
        `}</style>
        <div className="dht-blades" style={{position:"absolute",inset:0}}>
          <img src={original["blades-runner-left"]} aria-hidden="true" style={{position:"absolute",left:-83,top:0,width:180,height:H}}/>
          <img src={original["blades-runner-right"]} aria-hidden="true" style={{position:"absolute",right:-83,top:0,width:180,height:H}}/>
          {BLADES.map((bl,i)=>{
            
            const isLeft=i<=blade;
            const x=isLeft?26+i*TAB:W-100-(BLADES.length-1-i)*TAB;
            const side=isLeft?"left":"right";
            return <button key={bl.id} className="dht-x360b-tab" aria-label={bl.label} onClick={()=>changeBlade(i)} aria-hidden={i===blade} tabIndex={i===blade?-1:0} style={{position:"absolute",left:x,opacity:i===blade?0:1,pointerEvents:i===blade?"none":"auto",transition:s.animations?"left 100ms linear, opacity 100ms linear":undefined,top:0,width:94,height:H,border:0,padding:0,background:"transparent",zIndex:20+(isLeft?i+1:BLADES.length-i)}}>
              <img src={original[`blades-size${Math.min(3,isLeft?i+1:BLADES.length-i)}-${side}-nf`]} aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
              <span style={{position:"absolute",top:H*.22,left:isLeft?42:27,writingMode:"vertical-rl",fontSize:23,color:"#4c4c50",textTransform:"lowercase"}}>{bl.label}</span>
            </button>;
          })}
          <div className="dht-blades-active-edge" style={{position:"absolute",left:left-44,transition:s.animations?"left 100ms linear":undefined,top:0,width:78,height:H,zIndex:40,pointerEvents:"none"}}><img src={original["blades-size4-header"]} aria-hidden="true" style={{width:"100%",height:"100%",filter:b.id==="live"||b.id==="market"?"sepia(1) saturate(2) brightness(.85)":undefined}}/><span style={{position:"absolute",left:42,top:H*.205,writingMode:"vertical-rl",fontSize:22,color:"#4e473a",textTransform:"lowercase"}}>{b.label}</span></div>
          <div className="dht-x360b-blade" data-blade={b.id} style={{position:"absolute",left,top:0,width:bodyW,height:H,zIndex:10,clipPath:pageOutline,overflow:"hidden",backgroundImage:texture(`background-${gradient}`),backgroundSize:"100% 100%",backgroundColor:b.light,boxShadow:"0 0 12px #0008",transition:s.animations?"left 100ms linear":undefined}}>
            <BladesAtmosphere assets={original} animate={s.animations}/>
            <div aria-hidden style={{position:"absolute",inset:0,backgroundImage:texture(`background-${gradient}-alpha`),backgroundSize:"100% 100%",pointerEvents:"none"}}/>
            <div key={b.id} className="dht-blade-content" style={{position:"absolute",inset:0,["--blade-enter" as any]:`${direction*70*W/720}px`,animation:s.animations?"dhtBladeIn 100ms linear":undefined}}>
            {(["top","bottom"] as const).map(edge=><div key={edge} aria-hidden="true" className="dht-blades-glass" style={{position:"absolute",left:20,right:20,[edge]:0,height:H*64/576,display:"flex",pointerEvents:"none"}}>{["left","middle","right"].map(part=><img key={part} src={original[`bkgd-whitewash-glass-${edge}-${part}${part === "middle" ? "" : "-ws"}`]} style={{width:part === "middle"?undefined:25,flex:part === "middle"?1:undefined,height:"100%"}}/>)}</div>)}
            <div style={{position:"absolute",left:39,top:H*.06,fontSize:26,color:"#f7ede1",textShadow:"0 1px 2px #663d17"}}>{b.label=== "Xbox Live" ? "Xbox LIVE" : b.label}</div>
            <div className="dht-blades-profile" style={{position:"absolute",left:36,top:H*.135,width:column,height:H*.2,backgroundImage:texture("gamecard_home-silver"),backgroundSize:"100% 100%",boxSizing:"border-box",padding:"12px 28px"}}>
              <div style={{fontSize:24,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{api.user}</div>
              <div style={{display:"flex",alignItems:"center",gap:14,marginTop:6}}>
                {a.avatar?<img src={a.avatar} alt="" style={{width:58,height:58,objectFit:"contain",border:"2px solid #a58555",background:"#726f60"}}/>:<Icon name="user" size={52} color="#776648"/>}
                <div style={{flex:1,minWidth:0,fontSize:19,lineHeight:1.16}}><div style={{display:"flex",justifyContent:"space-between"}}><span>Games</span><span>{api.lib.games.length}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span>Friends online</span><span>{st.friendsOnline??"—"}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span>Notifications</span><span>{st.notifications??"—"}</span></div></div>
              </div>
            </div>
            {list.slice(firstRow,firstRow+visibleRows).map((e,k)=>{
              const i=firstRow+k,on=i===sel;
              return <button key={e.key} className="dht-x360b-item" data-selected={on} data-name={e.label} onClick={()=>{setSels(m=>({...m,[b.id]:i}));playSound("select");e.run();}} style={{position:"absolute",left:38,top:H*.355+k*rowH,width:column-4,height:rowH,border:0,padding:"0 13px",display:"flex",alignItems:"center",gap:14,textAlign:"left",backgroundImage:texture(on?"button-focus":"button-nofocus"),backgroundColor:"transparent"}}>
                {e.game?<GameArt g={e.game} kind="portrait" style={{width:31,height:39,objectFit:"cover"}}/>:<img src={original[({friends:"icon-network",msg:"icon-messages",community:"icon-connecttokai",store:"icon-apps",dl:"icon-update",tiles:"icon-custom",lib:"icon-games",ach:"icon-trophy",shots:"icon-pictures",browser:"icon-computer",settings:"icon-system",home:"icon-xbmc",presets:"icon-custom",steamhome:"icon-xbmc",power:"icon-power"} as Record<string,string>)[e.key]??"icon-games"]} style={{width:27,height:27,objectFit:"contain"}}/>}
                <span style={{fontSize:23,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.label}</span>
              </button>;
            })}
            {b.id==="live" && <button onClick={()=>{playSound("select");openSteam("community");}} style={{position:"absolute",left:38,top:H*.355+3*rowH+15,width:column-4,height:H*.14,border:0,backgroundImage:texture("ad-button-nf"),backgroundSize:"100% 100%",backgroundColor:"transparent",color:"#cfe692",fontSize:34,textShadow:"0 2px #463825"}} aria-label="Steam Community"/>}
            <div style={{position:"absolute",left:column+65,right:32,top:H*.18}}>
              {b.id==="live"?<><div style={{textAlign:"center",fontSize:44,lineHeight:.85,color:"#71824b",textShadow:"1px 2px #a88652"}}>XBOX<br/><span style={{color:"#ac652d",letterSpacing:5}}>LIVE</span></div><div style={{fontSize:25,lineHeight:1.25,marginTop:40}}>Friends. Games. Community.<br/>Stay connected with your Steam friends and discover what to play next.</div></>:cur?.game?<><GameArt g={cur.game} kind="hero" style={{width:"100%",height:H*.3,objectFit:"cover",border:"2px solid #716b4277"}}/><div style={{fontSize:25,marginTop:18}}>{cur.game.name}</div><div style={{fontSize:20,marginTop:8}}>Last played {fmtLastPlayed(cur.game.lastPlayed)}</div></>:<><Icon name={cur?.icon??"folder"} size={88} color="#ffffff99"/><div style={{fontSize:30,marginTop:25}}>{cur?.label}</div><div style={{fontSize:23,marginTop:14,lineHeight:1.2}}>{cur?.sub}</div></>}
            </div>
            <button className="dht-blades-disc" onClick={()=>{if(recent[0]){playSound("launch");api.launch(recent[0]);}}} disabled={!recent[0]} style={{position:"absolute",left:20,right:20,bottom:H*.13,height:H*71/576,border:0,backgroundImage:texture("dvdtray-nofocus"),backgroundSize:"100% 100%",backgroundColor:"transparent",display:"flex",alignItems:"center",gap:16,padding:"0 58px",fontSize:23,textAlign:"left"}}><span style={{width:26}}/>{recent[0]?.name??"No game selected"}</button>
            
            <div style={{position:"absolute",left:42,bottom:H*.065,display:"flex",alignItems:"center",gap:8,fontSize:22,color:"#f0e9d9",textShadow:"0 1px #705933"}}><Btn img={original["button-y"]??a.y} letter="Y" color="#e9c31d"/> Options</div>
            <div style={{position:"absolute",right:36,bottom:H*.065,display:"flex",alignItems:"center",gap:9,fontSize:22,color:"#f0e9d9",textShadow:"0 1px #705933"}}>Select <Btn img={original["button-a"]??a.a} letter="A" color="#3fb83f"/></div>
            </div>
          </div>
        </div>
        <BladesGuide menu={menu} assets={original} animate={s.animations}/>
      </Stage>
    </ThemeRoot>
  );
}

// ═════════════════════════════ NXE / KINECT ═════════════════════════════
type Channel = { id: string; label: string; cards: Entry[] };

export function NxeHome({ variant }: { variant: "nxe" | "kinect" }) {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const now = useClock(15000);
  const st = useSteamStatus();
  const wall = useWallpaper("x360");
  const a = useAssets(variant === "nxe" ? "x360-nxe" : "x360-metro");
  const btn = useAssets("x360-nxe");
  const metro = useAssets("x360-metro");
  const menu = useMenu();
  const light = variant === "kinect";
  const ink = light ? "#3a3a3a" : "#fff";
  const accent = light ? "#5dc21e" : "#8ee03a";
  const games = api.lib.games;

  const channels: Channel[] = [
    { id: "spotlight", label: "Spotlight", cards: [...games.slice(0, 1).map((g) => ({ key: `s${g.appid}`, label: g.name, sub: "Jump back in", game: g, run: () => api.activate(g, () => api.launch(g)) })), { key: "store", label: "Steam Store", sub: "Featured and specials", icon: "store", img: a.store, run: () => openSteam("store") }, { key: "dl", label: "Downloads", sub: "Queue and updates", icon: "download", img: a.downloads, run: () => openSteam("downloads") }] },
    { id: "games", label: "Games", cards: [...games.slice(0, 12).map((g) => ({ key: `g${g.appid}`, label: g.name, sub: fmtPlaytime(g.playtime), game: g, run: () => api.activate(g, () => api.launch(g)) })), { key: "lib", label: "Game Library", sub: `${games.length} games`, icon: "library", img: a.gamertiles ?? a.controller, run: () => openSteam("library") }] },
    { id: "media", label: "Pictures", cards: [{ key: "shots", label: "Screenshots", sub: "Your captures", icon: "photo", img: a.media, run: () => api.openMedia() }, { key: "web", label: "Internet", sub: "Web browser", icon: "globe", img: a.globe, run: () => openSteam("browser") }] },
    { id: "social", label: "Social", cards: [{ key: "friends", label: "Friends", sub: st.friendsOnline !== undefined ? `${st.friendsOnline} online` : "Friends and chat", icon: "friends", img: a.friends, run: () => openSteam("friends") }, { key: "msg", label: "Messages", sub: st.notifications ? `${st.notifications} new` : "Notifications", icon: "bell", img: a.messages, run: () => openSteam("notifications") }, { key: "community", label: "Community", sub: "Steam Community", icon: "globe", img: a.live, run: () => openSteam("community") }] },
    { id: "my", label: "My Xbox", cards: [{ key: "settings", label: "Settings", sub: "Steam settings", icon: "gear", img: a.settings ?? a.console, run: () => openSteam("settings") }, { key: "home", label: "Home Screen", sub: "Deck Home Themes options", icon: "home", img: a.themes, run: api.openSettings }, { key: "presets", label: "Dashboards", sub: "Switch presets", icon: "palette", run: () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "Presets") }, { key: "steamhome", label: "Home", sub: "Steam's own home", icon: "steam", run: api.showSteamHome }, { key: "power", label: "Turn Off", sub: "Power options", icon: "power", run: () => openSteam("power") }] },
  ];
  const [ch, setCh] = useRemembered("nxe-ch", 1);
  const [sels, setSels] = useRemembered<Record<string, number>>("nxe-sels", {});
  const chan = channels[clamp(ch, 0, channels.length - 1)];
  const sel = clamp(sels[chan.id] ?? 0, 0, chan.cards.length - 1);
  const cur = chan.cards[sel];

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    const g = cur?.game;
    menu.open(g ? [{ label: "Play", action: () => api.launch(g) }, { label: "Game Details", action: () => api.details(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };
  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const k = p.btn;
    if (k === "y") return options(), true;
    if (k === "up" || k === "down") {
      const n = clamp(ch + (k === "up" ? -1 : 1), 0, channels.length - 1);
      if (n !== ch) (setCh(n), playSound("tab"));
      else playSound("end");
      return true;
    }
    if (k === "left" || k === "right" || k === "l1" || k === "r1") {
      const d = k === "left" ? -1 : k === "right" ? 1 : k === "l1" ? -4 : 4;
      const n = clamp(sel + d, 0, chan.cards.length - 1);
      if (n !== sel) (setSels((m) => ({ ...m, [chan.id]: n })), playSound("move"));
      else playSound("end");
      return true;
    }
    if (k === "a" && cur) return playSound("select"), cur.run(), true;
    if (k === "x" && cur?.game) return api.launch(cur.game), true;
    if (k === "menu" && cur?.game) return api.nativeMenu(cur.game), true;
    return false;
  };

  // cards: the selected one big at the front, the rest receding to the right
  const CW = 470;
  const CH = 264;
  const cx = 230;
  const cy = H * 0.5 - CH / 2;
  const card = (e: Entry, i: number) => {
    const d = i - sel;
    if (d < -1 || d > 6) return null;
    const style: CSSProperties =
      d < 0
        ? { left: cx - CW * 0.55, top: cy, opacity: 0, transform: "perspective(900px) rotateY(30deg) scale(0.8)" }
        : d === 0
          ? { left: cx, top: cy, opacity: 1, transform: "none", zIndex: 20 }
          : { left: cx + CW + 30 + (d - 1) * 150, top: cy + 26, opacity: Math.max(0.25, 1 - d * 0.13), transform: `perspective(900px) rotateY(-32deg) scale(${0.82 - d * 0.03})`, zIndex: 20 - d };
    const on = d === 0;
    return (
      <div key={e.key} className="dht-x360n-card dht-tile" data-selected={on} data-name={e.label} onClick={() => (on ? e.run() : setSels((m) => ({ ...m, [chan.id]: i })))} style={{ position: "absolute", width: CW, height: CH, borderRadius: light ? 4 : 10, overflow: "hidden", transformOrigin: "0 50%", transition: "left 260ms ease-out, top 260ms, transform 260ms, opacity 260ms", background: light ? "#fff" : "linear-gradient(180deg, #3a3f4c, #20232b)", boxShadow: on ? `0 0 0 3px ${accent}, 0 16px 36px rgba(0,0,0,${light ? 0.25 : 0.6})` : `0 10px 24px rgba(0,0,0,${light ? 0.15 : 0.5})`, ...style }}>
        {e.game ? (
          <GameArt g={e.game} kind="landscape" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: light ? "linear-gradient(135deg, #ffffff, #e9efe4)" : `linear-gradient(135deg, ${accent}55, #20232b)` }}>
            {e.img ? <img src={e.img} style={{ width: 110, height: 110, filter: light ? "brightness(0.4)" : "none" }} /> : <Icon name={e.icon ?? "folder"} size={96} color={light ? "#666" : "#fff"} />}
          </div>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 16px", background: light ? "rgba(255,255,255,0.92)" : "linear-gradient(180deg, transparent, rgba(0,0,0,0.8))", color: light ? "#333" : "#fff" }}>
          <div style={{ fontSize: 20, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{!e.game || showTitle(s, "x360", on) ? e.label : ""}</div>
          {e.sub && <div style={{ fontSize: 13, opacity: 0.75 }}>{e.sub}</div>}
        </div>
      </div>
    );
  };

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", y: "Options" }}>
      <Stage background={light ? "#eee" : "#111"}>
        {wall ? (
          <img src={wall} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} />
        ) : (
          <div className="dht-x360n-bg" style={{ position: "absolute", inset: 0, background: light ? "radial-gradient(ellipse at 60% 30%, #ffffff 0%, #eef0ec 45%, #d6dad3 100%)" : "radial-gradient(ellipse at 60% 20%, #4a5266 0%, #262a35 45%, #0f1116 100%)" }}>
            <div style={{ position: "absolute", left: "-10%", right: "-10%", top: "55%", height: "40%", background: light ? "linear-gradient(180deg, rgba(93,194,30,0.10), transparent)" : "linear-gradient(180deg, rgba(142,224,58,0.10), transparent)", transform: "skewY(-6deg)" }} />
          </div>
        )}
        {/* channel names, the current one large */}
        {channels.map((c, i) => {
          const d = i - ch;
          if (Math.abs(d) > 2) return null;
          const on = d === 0;
          return (
            <div key={c.id} className="dht-x360n-channel" data-selected={on} onClick={() => setCh(i)} style={{ position: "absolute", left: on ? cx : cx + 6, top: on ? cy - 64 : d < 0 ? cy - 64 + d * 46 - 30 : cy + CH + 30 + (d - 1) * 40, color: on ? ink : light ? "#8a8a8a" : "rgba(255,255,255,0.45)", fontSize: on ? 40 : 24, fontWeight: on ? 300 : 400, transition: "top 260ms, font-size 260ms", whiteSpace: "nowrap" }}>
              {c.label}
            </div>
          );
        })}
        <div key={chan.id} style={{ position: "absolute", inset: 0, animation: "dhtNxeIn 280ms ease-out" }}>
          <style>{`@keyframes dhtNxeIn { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }`}</style>
          {chan.cards.map(card)}
        </div>
        {/* profile and clock */}
        <div style={{ position: "absolute", left: 40, top: 28, display: "flex", alignItems: "center", gap: 12, color: ink }}>
          <div style={{ width: 46, height: 46, borderRadius: 6, overflow: "hidden", background: accent }}>{st.avatar ? <img src={st.avatar} style={{ width: 46, height: 46 }} /> : a.avatar ?? metro.avatar ? <img src={a.avatar ?? metro.avatar} style={{ width: 46, height: 46 }} /> : null}</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 600 }}>{api.user}</div>
            <div style={{ fontSize: 13, color: st.online ? accent : "#999" }}>{st.online ? "Online" : "Offline"}</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 44, top: 34, color: ink, fontSize: 20 }}>{fmtTime(now, s.clock24)}</div>
        <div style={{ position: "absolute", left: cx, bottom: 34, display: "flex", gap: 22, alignItems: "center", color: ink, fontSize: 16 }}>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Btn img={btn.a} letter="A" color="#3fb83f" /> Select
          </span>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Btn img={btn.y} letter="Y" color="#e9c31d" /> Options
          </span>
          {cur?.game && (
            <span style={{ display: "flex", gap: 10, alignItems: "center", opacity: 0.85 }}>
              {cur.game.name} · Last played {fmtLastPlayed(cur.game.lastPlayed)} <Badges g={cur.game} size={12} />
            </span>
          )}
        </div>
        <MenuView menu={menu} variant="x360" />
      </Stage>
    </ThemeRoot>
  );
}

