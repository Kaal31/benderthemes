import { t } from "../i18n";
import {BackgroundMedia} from "../WallpaperMedia";
import {customProfilePicture} from "../profilePicture";
import { BLADE_BOUNDARIES } from "./bladeBoundaries";
import { BladesAtmosphere } from "./BladesAtmosphere";
import { BladesGuide } from "./BladesGuide";
import { BLADES_FONT_CSS } from "./bladesFont";
// Earlier Xbox 360 dashboards, chosen with the "Xbox 360 dashboard" preset:
//  • Blades (2005): coloured blades that slide sideways, a menu on each.
//  NXE and Kinect live in X360Nxe.tsx and X360Kinect.tsx.
// Layout is drawn here; in personal test builds the dashboards' own icons and
// button images (asset sets x360-blades / x360-nxe / x360-metro) are used.
import { useState } from "react";
import { GameArt, Icon, IconName, MenuItem, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openAchievements, openSteam } from "../library";
import { THEMES, updateSettings } from "../settings";
import { playSound, useSteamStatus, useWallpaper } from "../steam";
import { useAssets } from "../assets";
import { useX360Gamerpic } from "../skins";

import { useReportFocus } from "../focus";
type Entry = { key: string; label: string; sub?: string; icon?: IconName; img?: string; game?: Game; run: () => void };

function Btn({ img, letter, color }: { img?: string; letter: string; color: string }) {
  return img ? (
    <img src={img} style={{ width: 26, height: 26, display: "block" }} />
  ) : (
    <span style={{ width: 24, height: 24, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${color} 60%)`, color: "#000", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</span>
  );
}

// ═════════════════════════════ BLADES ═════════════════════════════
const getBlades = () => [
  { id: "market", label: t("marketplace"), color: "#e46c0a", light: "#ffb36a" },
  { id: "live", label: "Xbox Live", color: "#bd7029", light: "#f0c466" },
  { id: "games", label: t("games"), color: "#7aa516", light: "#d4f06a" },
  { id: "media", label: t("media"), color: "#2575ab", light: "#7cc8e5" },
  { id: "system", label: t("system"), color: "#745389", light: "#c2a6cc" },
];

export function BladesHome() {
  const BLADES = getBlades();
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const st = useSteamStatus();
  const wall = useWallpaper("x360");
  const a = useAssets("x360-blades");
  const pickedPic = useX360Gamerpic(); // gamer picture package chosen in Theme options
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
      { key: "store", label: t("destSteamStore"), sub: t("storeDescNew"), img: a.store, icon: "store", run: () => openSteam("store") },
      { key: "dl", label: t("destDownloads"), sub: t("downloadsAndUpdates"), img: a.downloads, icon: "download", run: () => openSteam("downloads") },
      { key: "tiles", label: t("themesAndGamerPictures"), sub: t("presetsForHomeDesc"), img: a.themes, icon: "palette", run: () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), t("presets"), { page: true }) },
    ],
    live: [
      { key: "friends", label: t("destFriends"), sub: st.friendsOnline !== undefined ? t("friendsOnlineCount", { count: st.friendsOnline }) : t("friendsAndChat"), img: a.friends, icon: "friends", run: () => openSteam("friends") },
      { key: "msg", label: t("destNotifications"), sub: st.notifications ? t("messagesNewCount", { count: st.notifications }) : t("destNotifications"), img: a.messages, icon: "bell", run: () => openSteam("notifications") },
      { key: "community", label: t("destCommunity"), sub: t("communityDesc"), img: a.live, icon: "globe", run: () => openSteam("community") },
    ],
    games: [
      ...recent.map((g) => ({ key: `g${g.appid}`, label: g.name, sub: fmtPlaytime(g.playtime, g.lastPlayed), game: g, run: () => api.activate(g, () => api.launch(g)) })),
      { key: "lib", label: t("destLibrary"), sub: t("gamesCount", { count: api.lib.games.length }), img: a.controller, icon: "library" as IconName, run: () => openSteam("library") },
      { key: "ach", label: t("destAchievements"), sub: t("achievementsProgress"), img: a.trophy, icon: "trophy" as IconName, run: () => (recent[0] ? openAchievements(recent[0]) : openSteam("library")) },
    ],
    media: [
      { key: "shots", label: t("allScreenshots"), sub: t("screenshotsDesc"), icon: "photo", run: () => api.openMedia() },
      { key: "browser", label: t("destWebBrowser"), sub: t("openBrowserDesc"), icon: "globe", run: () => openSteam("browser") },
    ],
    system: [
      { key: "settings", label: t("systemSettings"), sub: t("steamSettingsDesc"), icon: "gear", run: () => openSteam("settings") },
      { key: "home", label: t("homeScreenSettings"), sub: t("themeOptionsDesc"), icon: "home", run: api.openSettings },
      { key: "presets", label: t("presets"), sub: t("switchPresetsDesc"), img: a.themes, icon: "palette", run: () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), t("presets"), { page: true }) },
      { key: "steamhome", label: t("destMainMenu"), sub: t("showSteamHomeDesc"), icon: "steam", run: api.showSteamHome },
      { key: "power", label: t("destPower"), sub: t("powerOptionsDesc"), icon: "power", run: () => openSteam("power") },
    ],
  };
  const list = entries[b.id];
  const sel = clamp(sels[b.id] ?? 0, 0, list.length - 1);
  const cur = list[sel];
  useReportFocus(cur?.game);

  const options = () => {
    const extra: MenuItem[] = [
      { settingsId:"native:options-menu-side", label:t("optionsMenuSide"),sub:()=>["right","left"].map(side=>({label:side==="right"?t("rightSide"):t("leftSide"),checked:(s.x360.guideSide??"right")===side,action:()=>updateSettings({x360:{...s.x360,guideSide:side as "left"|"right"}})}))},
      { label: t("presets"), sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: t("homeScreenSettings"), action: api.openSettings },
      { label: t("destMainMenu"), action: api.showSteamHome },
    ];
    const g = cur?.game;
    menu.open(g ? [{ label: t("play"), action: () => api.launch(g) }, { label: t("gameDetails"), action: () => api.details(g) }, { label: t("watchTrailer"), action: () => api.playTrailer(g) }, { label: t("gameOptions"), action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
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
  // Follow the alpha silhouette of the original MC360 chrome, including its asymmetric waist.
  const edgeLeft=left-44;
  const edgeRight=blade<BLADES.length-1?W-100-(BLADES.length-2-blade)*TAB:W-97;
  const rightAsset=blade<BLADES.length-1?`blades-size${Math.min(3,BLADES.length-1-blade)}-right-nf`:"blades-runner-right";
  const rightWidth=blade<BLADES.length-1?94:180;
  const leftPoints=BLADE_BOUNDARIES["blades-size4-header"].map(([y,x])=>`${edgeLeft+x*78+1}px ${y*H}px`);
  const rightPoints=BLADE_BOUNDARIES[rightAsset].map(([y,x])=>`${edgeRight+x*rightWidth+3}px ${y*H}px`).reverse();
  const pageOutline=`polygon(${[...leftPoints,...rightPoints].join(",")})`;
  const rowH = 49;
  const visibleRows = b.id==="live"?3:Math.max(3,Math.floor((H*.34)/rowH));
  const firstRow=Math.max(0,Math.min(sel-visibleRows+1,list.length-visibleRows));
  const column = bodyW*.45;
  const gradient = ({market:"orange",live:"orange",games:"green",media:"blue",system:"purple"} as Record<string,string>)[b.id];
  const texture=(name:string)=>original[name]?`url("${original[name]}")`:undefined;
  return (
    <ThemeRoot onInput={onInput} hints={{a:t("select"),y:t("options")}}>
      <Stage background="#c8c7ce">
        <style>{`${BLADES_FONT_CSS}
          .dht-blades{font-family:"DHT MC360",Tahoma,sans-serif;color:#39362d}
          .dht-blades button{font:inherit;cursor:pointer;color:inherit}
          .dht-blades button:focus-visible{outline:2px solid #333;outline-offset:-2px}
          @keyframes dhtBladeIn{from{transform:translateX(var(--blade-enter))}to{transform:translateX(0)}}
          .dht-x360b-item{background-size:100% 100%;background-repeat:no-repeat}.dht-x360b-item[data-selected=true]{color:#292820}
        `}</style>
        <div className="dht-blades" style={{position:"absolute",inset:0}}>
          <div className="dht-blades-page-fill" data-blade={b.id} style={{position:"absolute",inset:0,clipPath:pageOutline,backgroundImage:texture(`background-${gradient}`),backgroundSize:"100% 100%",backgroundColor:b.light,zIndex:10,pointerEvents:"none"}}>
            {wall&&<BackgroundMedia src={wall} className="dht-blades-wall" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
            {!wall&&<BladesAtmosphere assets={original} animate={s.animations}/>}
            <div style={{position:"absolute",inset:0,backgroundImage:texture(`background-${gradient}-alpha`),backgroundSize:"100% 100%"}}/>
          </div>
          <img src={original["blades-runner-left"]} aria-hidden="true" style={{position:"absolute",left:-83,top:0,width:180,height:H}}/>
          <img src={original["blades-runner-right"]} aria-hidden="true" style={{position:"absolute",right:-83,top:0,width:180,height:H}}/>
          {BLADES.map((bl,i)=>{
            
            const isLeft=i<=blade;
            const x=isLeft?26+i*TAB:W-100-(BLADES.length-1-i)*TAB;
            const side=isLeft?"left":"right";
            return <button key={bl.id} className="dht-x360b-tab" aria-label={bl.label} onClick={()=>changeBlade(i)} aria-hidden={i===blade} tabIndex={i===blade?-1:0} style={{position:"absolute",left:x,opacity:i===blade?0:1,pointerEvents:i===blade?"none":"auto",transition:s.animations?"left 100ms linear, opacity 100ms linear":undefined,top:0,width:94,height:H,border:0,padding:0,background:"transparent",zIndex:20+(isLeft?i+1:BLADES.length-i)}}>
              <img src={original[`blades-size${Math.min(3,isLeft?i+1:BLADES.length-i)}-${side}-nf`]} aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
              <span style={{position:"absolute",top:H*.275,left:isLeft?44:29,writingMode:"vertical-rl",fontSize:17,lineHeight:1,whiteSpace:"nowrap",letterSpacing:0,color:"#4c4c50",textTransform:"lowercase"}}>{bl.label}</span>
            </button>;
          })}
          <div className="dht-blades-active-edge" style={{position:"absolute",left:left-44,transition:s.animations?"left 100ms linear":undefined,top:0,width:78,height:H,zIndex:40,pointerEvents:"none"}}><img src={original["blades-size4-header"]} aria-hidden="true" style={{width:"100%",height:"100%",filter:"none"}}/><span style={{position:"absolute",left:44,top:H*.225,writingMode:"vertical-rl",fontSize:17,lineHeight:1,whiteSpace:"nowrap",letterSpacing:0,color:"#4c4c50",textTransform:"lowercase"}}>{b.label}</span></div>
          <div className="dht-x360b-blade" data-blade={b.id} style={{position:"absolute",left,top:0,width:bodyW,height:H,zIndex:10,overflow:"hidden",transition:s.animations?"left 100ms linear":undefined}}>
            <div key={b.id} className="dht-blade-content" style={{position:"absolute",inset:0,["--blade-enter" as any]:`${direction*70*W/720}px`,animation:s.animations?"dhtBladeIn 100ms linear":undefined}}>
            {(["top","bottom"] as const).map(edge=><div key={edge} aria-hidden="true" className="dht-blades-glass" style={{position:"absolute",left:20,right:20,[edge]:0,height:H*64/576,display:"flex",pointerEvents:"none"}}>{["left","middle","right"].map(part=><img key={part} src={original[`bkgd-whitewash-glass-${edge}-${part}${part === "middle" ? "" : "-ws"}`]} style={{width:part === "middle"?undefined:25,flex:part === "middle"?1:undefined,height:"100%"}}/>)}</div>)}
            <div style={{position:"absolute",left:39,top:H*.06,fontSize:26,color:"#f7ede1",textShadow:"0 1px 2px #663d17"}}>{b.label=== "Xbox Live" ? "Xbox LIVE" : b.label}</div>
            <div className="dht-blades-profile" style={{position:"absolute",left:36,top:H*.135,width:column,height:H*.2,backgroundImage:texture("gamecard_home-silver"),backgroundSize:"100% 100%",boxSizing:"border-box",padding:"12px 28px"}}>
              <div style={{fontSize:24,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{api.user}</div>
              <div style={{display:"flex",alignItems:"center",gap:14,marginTop:6}}>
                {customProfilePicture()||pickedPic||a.avatar?<img src={customProfilePicture()??pickedPic??a.avatar} alt="" style={{width:58,height:58,objectFit:"contain",border:"2px solid #a58555",background:"#726f60"}}/>:<Icon name="user" size={52} color="#776648"/>}
                <div style={{flex:1,minWidth:0,fontSize:19,lineHeight:1.16}}><div style={{display:"flex",justifyContent:"space-between"}}><span>{t("games")}</span><span>{api.lib.games.length}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span>{t("friendsOnline")}</span><span>{st.friendsOnline??"—"}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span>{t("notifications")}</span><span>{st.notifications??"—"}</span></div></div>
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
              {b.id==="live"?<><div style={{textAlign:"center",fontSize:44,lineHeight:.85,color:"#71824b",textShadow:"1px 2px #a88652"}}>XBOX<br/><span style={{color:"#ac652d",letterSpacing:5}}>LIVE</span></div><div style={{fontSize:25,lineHeight:1.25,marginTop:40}}>{t("x360LiveTagline")}<br/>{t("x360LiveDesc")}</div></>:cur?.game?<><GameArt g={cur.game} kind="hero" style={{width:"100%",height:H*.3,objectFit:"cover",border:"2px solid #716b4277"}}/><div style={{fontSize:25,marginTop:18}}>{cur.game.name}</div><div style={{fontSize:20,marginTop:8}}>{t("lastPlayedVal", { val: fmtLastPlayed(cur.game.lastPlayed) })}</div></>:<><Icon name={cur?.icon??"folder"} size={88} color="#ffffff99"/><div style={{fontSize:30,marginTop:25}}>{cur?.label}</div><div style={{fontSize:23,marginTop:14,lineHeight:1.2}}>{cur?.sub}</div></>}
            </div>
            <button className="dht-blades-disc" onClick={()=>{if(recent[0]){playSound("launch");api.launch(recent[0]);}}} disabled={!recent[0]} style={{position:"absolute",left:20,right:20,bottom:H*.13,height:H*71/576,border:0,backgroundImage:texture("dvdtray-nofocus"),backgroundSize:"100% 100%",backgroundColor:"transparent",display:"flex",alignItems:"center",gap:16,padding:"0 58px",fontSize:23,textAlign:"left"}}><span style={{width:26}}/>{recent[0]?.name??t("noGameSelected")}</button>
            
            <div style={{position:"absolute",left:42,bottom:H*.065,display:"flex",alignItems:"center",gap:8,fontSize:22,color:"#f0e9d9",textShadow:"0 1px #705933"}}><Btn img={original["button-y"]??a.y} letter="Y" color="#e9c31d"/> {t("options")}</div>
            <div style={{position:"absolute",right:36,bottom:H*.065,display:"flex",alignItems:"center",gap:9,fontSize:22,color:"#f0e9d9",textShadow:"0 1px #705933"}}>{t("select")} <Btn img={original["button-a"]??a.a} letter="A" color="#3fb83f"/></div>
            </div>
          </div>
        </div>
        <BladesGuide menu={menu} assets={original} animate={s.animations} side={s.x360.guideSide}/>
      </Stage>
    </ThemeRoot>
  );
}
