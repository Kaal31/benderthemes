import {bladesSmallFallback} from "./xboxFallbackArtwork";
import {BladesPages,BladesPage} from "./BladesPages";
import {useBladesSweep} from "./useBladesSweep";
import {openMarketplace} from "../marketplaceState";
import {bladesFallback} from "./bladesFallback";
import {bladesThemeHubBanner} from "./bladesBanner.generated";
import {BackgroundMedia} from "../WallpaperMedia";
import {customProfilePicture} from "../profilePicture";
import { BLADE_BOUNDARIES } from "./bladeBoundaries";
import {BladesWashEdge} from "./BladesWashEdge";
import { BladesAtmosphere } from "./BladesAtmosphere";
import { BladesGuide } from "./BladesGuide";
import { BLADES_FONT_CSS } from "./bladesFont";
// Earlier Xbox 360 dashboards, chosen with the "Xbox 360 dashboard" preset:
//  • Blades (2005): coloured blades that slide sideways, a menu on each.
//  NXE and Kinect live in X360Nxe.tsx and X360Kinect.tsx.
// Layout is drawn here; in personal test builds the dashboards' own icons and
// button images (asset sets x360-blades / x360-nxe / x360-metro) are used.
import { useEffect, useMemo, useRef, useState } from "react";
import { GameArt, Icon, IconName, MenuItem, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, Game, openSteam } from "../library";
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
  const wall = useWallpaper("x360");
  const a = bladesSmallFallback;
  const pickedPic = useX360Gamerpic(); // gamer picture package chosen in Theme options
  const consoleAssets = useAssets("x360-blades-original");
  const original = useMemo(()=>({...bladesFallback,...consoleAssets}),[consoleAssets]);
  // Decode alternate surfaces before a slide, rather than midway through it.
  useEffect(()=>{
    const images=Object.entries(original).filter(([name])=>name.startsWith("background-")||name.startsWith("blades-")).map(([,src])=>{
      const image=new Image();image.src=src;void image.decode().catch(()=>{});return image;
    });
    return ()=>{images.length=0;};
  },[original]);
  const menu = useMenu();
  const [page,setPage]=useState<BladesPage|null>(null);
  const [pageClosing,setPageClosing]=useState(false);
  const pageInput=useRef<((p:Press)=>boolean)|null>(null);
  const openPage=(next:BladesPage)=>{setPageClosing(false);setPage(next);};
  const inPage=!!page&&!pageClosing;
  const [blade, setBlade] = useRemembered("blades-blade", 1);
  const [sels, setSels] = useRemembered<Record<string, number>>("blades-sels", {});
  const sweep=useBladesSweep(W);
  const changeBlade = (n: number) => { if(n === blade) return; sweep.capture(blade,n,s.animations); setBlade(n); playSound("tab", Math.max(0,n-1)); };
  const b = BLADES[clamp(blade, 0, BLADES.length - 1)];
  const recent = api.lib.games.slice(0, 7);

  const entries: Record<string, Entry[]> = {
    market: [
      { key: "store", label: "Steam Store", sub: "New releases, deals and demos", img: a.store, icon: "store", run: () => openSteam("store") },
      { key: "dl", label: "Active Downloads", sub: "Downloads and updates", img: a.downloads, icon: "download", run: () => openSteam("downloads") },
      { key: "tiles", label: "Themes and Gamer Pictures", sub: "Presets for this home screen", img: a.themes, icon: "palette", run: () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "Presets", { page: true }) },
    ],
    live: [
      { key: "friends", label: "Friends", sub: st.friendsOnline !== undefined ? `${st.friendsOnline} online` : "Friends and chat", img: a.friends, icon: "friends", run: () => openSteam("friends") },
      { key: "msg", label: "Messages", sub: st.notifications ? `${st.notifications} new` : "Notifications", img: a.messages, icon: "bell", run: () => openSteam("notifications") },
      { key: "community", label: "Steam Community", sub: "Hubs, guides and workshop", img: a.live, icon: "globe", run: () => openSteam("community") },
    ],
    games: [
      { key: "lib", label: "Games Library", sub: `${api.lib.games.length} games`, img: a.controller, icon: "library" as IconName, run: () => openPage("library") },
      { key: "ach", label: "Achievements", sub: "Your progress", img: a.trophy, icon: "trophy" as IconName, run: () => openPage("achievements") },
      { key: "played", label: "Played Games", sub: "Your play history", icon: "gamepad" as IconName, run:()=>openPage("played") },
    ],
    media: [
      { key: "shots", label: "Screenshots", sub: "Pictures from your games", icon: "photo", run: () => api.openMedia() },
      { key: "browser", label: "Web Browser", sub: "Open the browser", icon: "globe", run: () => openSteam("browser") },
    ],
    system: [
      { key: "settings", label: "Console Settings", sub: "Display, audio, themes and dashboard preferences", icon: "gear", run: () => openPage("settings") },
      { key: "home", label: "Home Screen Settings", sub: "ThemeHub options", icon: "home", run: api.openSettings },
      { key: "presets", label: "Dashboard", sub: "Switch presets", img: a.themes, icon: "palette", run: () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "Presets", { page: true }) },
      { key: "steamhome", label: "Home", sub: "Show Steam's own home", icon: "steam", run: api.showSteamHome },
      { key: "power", label: "Turn Off", sub: "Power options", icon: "power", run: () => openSteam("power") },
    ],
  };
  const list = entries[b.id];
  // Banner and disc tray belong to the same vertical focus path as the menu.
  const bannerIndex = b.id === "live" ? list.length : -1;
  const discIndex = list.length + (bannerIndex >= 0 ? 1 : 0);
  const lastIndex = recent[0] ? discIndex : discIndex - 1;
  const sel = clamp(sels[b.id] ?? 0, 0, lastIndex);
  const bannerSelected = sel === bannerIndex;
  const discSelected = sel === discIndex;
  const cur: Entry | undefined = bannerSelected
    ? {key:"hub",label:"Theme Hub",sub:"Browse themes for your home screen",icon:"palette",run:()=>openMarketplace("x360",{from:"x360"})}
    : discSelected && recent[0]
    ? {key:"disc",label:recent[0].name,game:recent[0],run:()=>api.launch(recent[0])}
    : list[sel];
  useReportFocus(cur?.game);

  const options = () => {
    const extra: MenuItem[] = [
      {label:"Options menu side",sub:()=>["right","left"].map(side=>({label:side==="right"?"Right side":"Left side",checked:(s.x360.guideSide??"right")===side,action:()=>updateSettings({x360:{...s.x360,guideSide:side as "left"|"right"}})}))},
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    const g = cur?.game;
    menu.open(g ? [{ label: "Play", action: () => api.launch(g) }, { label: "Game Details", action: () => api.details(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };
  const onInput = (p: Press): boolean => {
    if(page)return pageInput.current?.(p)??true;
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
      const n = clamp(sel + (k === "up" ? -1 : 1), 0, lastIndex);
      if (n !== sel) (setSels((m) => ({ ...m, [b.id]: n })), playSound("move"));
      else playSound("end");
      return true;
    }
    if (k === "a" && cur) return playSound("select"), cur.run(), true;
    if (k === "x" && cur?.game) return api.launch(cur.game), true;
    if (k === "menu" && cur?.game) return api.nativeMenu(cur.game), true;
    return false;
  };

  // DashX360's BladesArtworkHost uses a 0.200 s ease-out slide. This is a
  // secondary recreation reference, not a recovered stock-console timeline.
  const slide = "200ms cubic-bezier(.33,1,.68,1)";
  const TAB = 52;
  const left = 64+blade*TAB;
  const right = 64+(BLADES.length-1-blade)*TAB;
  const bodyW = W-left-right;
  // Follow the alpha silhouette of the original MC360 chrome, including its asymmetric waist.
  const edgeLeft=left-44;
  const edgeRight=blade<BLADES.length-1?W-100-(BLADES.length-2-blade)*TAB:W-97;
  const rightAsset=blade<BLADES.length-1?`blades-size${Math.min(3,BLADES.length-1-blade)}-right-nf`:"blades-runner-right";
  const rightWidth=blade<BLADES.length-1?94:180;
  const leftPoints=BLADE_BOUNDARIES["blades-size4-header"].map(([y,x])=>`calc(var(--dht-blade-x) + ${-44+x*78+1}px) ${y*H}px`);
  const rightPoints=BLADE_BOUNDARIES[rightAsset].map(([y,x])=>`${edgeRight+x*rightWidth+1}px ${y*H}px`).reverse();
  const pageOutline=`polygon(${[...leftPoints,...rightPoints].join(",")})`;
  const washLeft=left-2;
  const washInset=washLeft-(edgeLeft+BLADE_BOUNDARIES["blades-size4-header"][64][1]*78+1);
  // The outline above is the outer alpha silhouette, not the visible
  // inner metal seam. Compensate for the cap's transparent shoulder here.
  const washRight=W-(edgeRight+BLADE_BOUNDARIES[rightAsset][64][1]*rightWidth+1-washInset+38);
  const leftCurve=BLADE_BOUNDARIES["blades-size4-header"],rightCurve=BLADE_BOUNDARIES[rightAsset];
  const washOffsets=rightCurve.map(([,x])=>(x-rightCurve[64][1])*rightWidth);
  const washLeftOffsets=leftCurve.map(([,x])=>(x-leftCurve[64][1])*78);
  // Reserve the disc tray and legend before sizing rows on shorter displays.
  const rowH = Math.min(49, H*.065);
  const visibleRows = b.id==="live"?3:Math.max(1,Math.floor((H*.355)/rowH));
  const firstRow=Math.max(0,Math.min(Math.min(sel,list.length-1)-visibleRows+1,list.length-visibleRows));
  const column = bodyW*.45;
  const gradient = ({market:"orange",live:"orange",games:"green",media:"blue",system:"purple"} as Record<string,string>)[b.id];
  const texture=(name:string)=>original[name]?`url("${original[name]}")`:undefined;
  return (
    <ThemeRoot onInput={onInput} hints={{a:"Select",y:"Options"}}>
      <Stage background="#c8c7ce">
        <style>{`${BLADES_FONT_CSS}
          @property --dht-blade-x{syntax:"<length>";inherits:true;initial-value:116px}
          .dht-blades{font-family:"DHT Blades",Tahoma,sans-serif;color:#39362d}
          .dht-blades[data-in-page=true]>.dht-x360b-tab,.dht-blades[data-in-page=true]>.dht-blades-active-edge{transform:translateX(-1500px);pointer-events:none!important}
          .dht-blades[data-in-page=true]>.dht-x360b-tab[data-right=true]{transform:translateX(1500px)}
          .dht-blades>.dht-x360b-tab,.dht-blades>.dht-blades-active-edge{transition:transform 240ms ease-in}
          .dht-blades>.dht-x360b-blade{transition:opacity 140ms;}
          .dht-blades[data-in-page=true]>.dht-x360b-blade{opacity:0;pointer-events:none}
          .dht-blades>.dht-blades-outer-left,.dht-blades>.dht-blades-outer-right{transition:transform 240ms ease-in}
          .dht-blades[data-in-page=true]>.dht-blades-outer-left{transform:translateX(-200px)}
          .dht-blades[data-in-page=true]>.dht-blades-outer-right{transform:translateX(200px)}
          .dht-blades button{font:inherit;cursor:pointer;color:inherit}
          .dht-blades button:focus-visible{outline:2px solid #333;outline-offset:-2px}
          .dht-x360b-item{background-size:100% 100%;background-repeat:no-repeat}.dht-x360b-item[data-selected=true]{color:#292820}
          .dht-blades-hub[data-selected=true]{outline:2px solid #fff5cf;outline-offset:2px}
          @media (prefers-reduced-motion:reduce){.dht-blades *{animation:none!important;transition:none!important}}
        `}</style>
        <div ref={sweep.root} className="dht-blades" data-in-page={inPage} style={{position:"absolute",inset:0,["--dht-blade-x" as any]:`${left}px`,transition:s.animations?`--dht-blade-x ${slide}`:undefined}}>
          <div className="dht-blades-page-fill" data-blade={b.id} style={{position:"absolute",inset:0,clipPath:inPage?"inset(0)":pageOutline,backgroundImage:texture(`background-${gradient}`),backgroundSize:"100% 100%",backgroundColor:b.light,zIndex:10,pointerEvents:"none",transition:inPage&&s.animations?`clip-path ${slide}`:undefined,willChange:"clip-path",transform:"translateZ(0)"}}>
            {wall&&<BackgroundMedia src={wall} className="dht-blades-wall" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
            {!wall&&<BladesAtmosphere assets={original} animate={s.animations}/>}
            <div style={{position:"absolute",inset:0,backgroundImage:texture(`background-${gradient}-alpha`),backgroundSize:"100% 100%"}}/>
            {/* The pale center wash creates the header/footer boundaries;
                do not paint detached dark panels over the background. */}
            <div className="dht-blades-whitewash" aria-hidden="true" style={{opacity:inPage?0:1,transitionProperty:"opacity",position:"absolute",left:"calc(var(--dht-blade-x) - 2px)",right:washRight,top:0,bottom:0,display:"flex",transition:s.animations?`right ${slide}`:undefined}}>
              <BladesWashEdge cap={original["background-overlay-whitewash-left-ws"]} tile={original["background-overlay-whitewash-centertile-ws"]} offsets={washOffsets} leftOffsets={washLeftOffsets} width={W-washLeft-washRight}/>
            </div>
          </div>
          <img className="dht-blades-outer-left" src={original["blades-runner-left"]} aria-hidden="true" style={{position:"absolute",left:-83,top:0,width:180,height:H,zIndex:0}}/>
          <img className="dht-blades-outer-right" src={original["blades-runner-right"]} aria-hidden="true" style={{position:"absolute",right:-83,top:0,width:180,height:H,zIndex:19}}/>
          {BLADES.map((bl,i)=>{
            
            const isLeft=i<=blade;
            const x=isLeft?26+i*TAB:W-100-(BLADES.length-1-i)*TAB;
            const side=isLeft?"left":"right";
            return <button key={bl.id} className="dht-x360b-tab" data-blade-index={i} data-right={!isLeft} aria-label={bl.label} onClick={()=>changeBlade(i)} aria-hidden={i===blade} tabIndex={i===blade?-1:0} style={{position:"absolute",left:x,opacity:i===blade?0:1,pointerEvents:i===blade?"none":"auto",transition:s.animations?`left ${slide}`:undefined,top:0,width:94,height:H,border:0,padding:0,background:"transparent",zIndex:20+(isLeft?i+1:BLADES.length-i)}}>
              <img src={original[`blades-size${Math.min(3,isLeft?i+1:BLADES.length-i)}-${side}-nf`]} aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
              <span style={{position:"absolute",top:H*.275,left:isLeft?44:29,writingMode:"vertical-rl",fontSize:17,lineHeight:1,whiteSpace:"nowrap",letterSpacing:0,color:"#4c4c50",textTransform:"lowercase"}}>{bl.label}</span>
            </button>;
          })}
          <div className="dht-blades-active-edge" style={{position:"absolute",left:"calc(var(--dht-blade-x) - 44px)",top:0,width:78,height:H,zIndex:40,pointerEvents:"none"}}><img src={original["blades-size4-header"]} aria-hidden="true" style={{width:"100%",height:"100%",filter:"none"}}/><span className="dht-blades-active-label" style={{position:"absolute",left:38,top:H*.235,writingMode:"vertical-rl",fontSize:17,lineHeight:1,whiteSpace:"nowrap",letterSpacing:0,color:"#4c4c50",textTransform:"lowercase"}}>{b.label}</span></div>
          <div className="dht-x360b-blade" data-blade={b.id} style={{position:"absolute",left:"var(--dht-blade-x)",top:0,width:bodyW,height:H,zIndex:10,overflow:"hidden"}}>
            <div className="dht-blade-content" style={{position:"absolute",inset:0}}>
            <div style={{position:"absolute",left:39,top:H*.06,fontSize:26,color:"#f7ede1",textShadow:"0 1px 2px #663d17"}}>{b.label=== "Xbox Live" ? "Xbox LIVE" : b.label}</div>
            <div className="dht-blades-profile" style={{position:"absolute",left:36,top:H*.135,width:column,height:H*.2,backgroundImage:texture("gamecard_home-silver"),backgroundSize:"100% 100%",boxSizing:"border-box",padding:"12px 28px"}}>
              <div style={{fontSize:24,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{api.user}</div>
              <div style={{display:"flex",alignItems:"center",gap:14,marginTop:6}}>
                {customProfilePicture()||pickedPic||a.avatar?<img src={customProfilePicture()??pickedPic??a.avatar} alt="" style={{width:58,height:58,objectFit:"contain",border:"2px solid #a58555",background:"#726f60"}}/>:<Icon name="user" size={52} color="#776648"/>}
                <div style={{flex:1,minWidth:0,fontSize:19,lineHeight:1.16}}><div style={{display:"flex",justifyContent:"space-between"}}><span>Games</span><span>{api.lib.games.length}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span>Friends online</span><span>{st.friendsOnline??"—"}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span>Notifications</span><span>{st.notifications??"—"}</span></div></div>
              </div>
            </div>
            {list.slice(firstRow,firstRow+visibleRows).map((e,k)=>{
              const i=firstRow+k,on=i===sel;
              return <button key={e.key} className="dht-x360b-item" data-selected={on} aria-pressed={on} data-name={e.label} onClick={()=>{setSels(m=>({...m,[b.id]:i}));playSound("select");e.run();}} style={{position:"absolute",left:38,top:H*.355+k*rowH,width:column-4,height:rowH,border:0,padding:"0 13px",display:"flex",alignItems:"center",gap:14,textAlign:"left",backgroundImage:texture(on?"button-focus":"button-nofocus"),backgroundColor:"transparent"}}>
                {e.game?<GameArt g={e.game} kind="portrait" style={{width:31,height:39,objectFit:"cover"}}/>:original[({friends:"icon-network",msg:"icon-messages",community:"icon-connecttokai",store:"icon-apps",dl:"icon-update",tiles:"icon-custom",lib:"icon-games",ach:"icon-trophy",shots:"icon-pictures",browser:"icon-computer",settings:"icon-system",home:"icon-xbmc",presets:"icon-custom",steamhome:"icon-xbmc",power:"icon-power"} as Record<string,string>)[e.key]??"icon-games"]?<img src={original[({friends:"icon-network",msg:"icon-messages",community:"icon-connecttokai",store:"icon-apps",dl:"icon-update",tiles:"icon-custom",lib:"icon-games",ach:"icon-trophy",shots:"icon-pictures",browser:"icon-computer",settings:"icon-system",home:"icon-xbmc",presets:"icon-custom",steamhome:"icon-xbmc",power:"icon-power"} as Record<string,string>)[e.key]??"icon-games"]} style={{width:27,height:27,objectFit:"contain"}}/>:<Icon name={e.icon??"folder"} size={27} color="#fff7da"/>}
                <span style={{fontSize:23,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.label}</span>
              </button>;
            })}
            {b.id==="live" && <button className="dht-blades-hub" data-selected={bannerSelected} aria-pressed={bannerSelected} onClick={()=>{setSels(m=>({...m,[b.id]:bannerIndex}));playSound("select");openMarketplace("x360",{from:"x360"});}} style={{position:"absolute",left:38,top:H*.355+3*rowH+15,width:column-4,height:H*.14,border:0,backgroundImage:`url("${bladesThemeHubBanner}")`,backgroundSize:"100% 100%",backgroundColor:"transparent",color:"#cfe692",fontSize:34,textShadow:"0 2px #463825"}} aria-label="Theme Hub"/>}
            <div style={{position:"absolute",left:column+65,right:32,top:H*.18}}>
              {b.id==="live"&&!bannerSelected&&!discSelected?<><div style={{textAlign:"center",fontSize:44,lineHeight:.85,color:"#71824b",textShadow:"1px 2px #a88652"}}>XBOX<br/><span style={{color:"#ac652d",letterSpacing:5}}>LIVE</span></div><div style={{fontSize:25,lineHeight:1.25,marginTop:40}}>Friends. Games. Community.<br/>Stay connected with your Steam friends and discover what to play next.</div></>:cur?.game?<><GameArt g={cur.game} kind="hero" style={{width:"100%",height:H*.3,objectFit:"cover",border:"2px solid #716b4277"}}/><div style={{fontSize:25,marginTop:18}}>{cur.game.name}</div><div style={{fontSize:20,marginTop:8}}>Last played {fmtLastPlayed(cur.game.lastPlayed)}</div></>:<><Icon name={cur?.icon??"folder"} size={88} color="#ffffff99"/><div style={{fontSize:30,marginTop:25}}>{cur?.label}</div><div style={{fontSize:23,marginTop:14,lineHeight:1.2}}>{cur?.sub}</div></>}
            </div>
            <button className="dht-blades-disc" data-selected={discSelected} aria-pressed={discSelected} onClick={()=>{if(recent[0]){setSels(m=>({...m,[b.id]:discIndex}));playSound("launch");api.launch(recent[0]);}}} disabled={!recent[0]} style={{position:"absolute",left:20,right:20,bottom:H*.17,height:H*71/576,border:0,backgroundImage:texture(discSelected?"dvdtray-focus":"dvdtray-nofocus"),backgroundSize:"100% 100%",backgroundColor:"transparent",display:"flex",alignItems:"center",gap:16,padding:"0 58px",fontSize:23,textAlign:"left"}}><span style={{width:26}}/>{recent[0]?.name??"No game selected"}</button>
            
            <div style={{position:"absolute",left:42,bottom:H*.065,display:"flex",alignItems:"center",gap:8,fontSize:22,color:"#f0e9d9",textShadow:"0 1px #705933"}}><Btn img={original["button-y"]??a.y} letter="Y" color="#e9c31d"/> Options</div>
            <div style={{position:"absolute",right:36,bottom:H*.065,display:"flex",alignItems:"center",gap:9,fontSize:22,color:"#f0e9d9",textShadow:"0 1px #705933"}}>Select <Btn img={original["button-a"]??a.a} letter="A" color="#3fb83f"/></div>
            </div>
          </div>
        </div>
        {page&&<BladesPages initial={page} assets={original} animate={s.animations} handle={pageInput} onExitStart={()=>setPageClosing(true)} onClose={()=>{setPage(null);setPageClosing(false);}}/>}
        <BladesGuide menu={menu} assets={original} animate={s.animations} side={s.x360.guideSide}/>
      </Stage>
    </ThemeRoot>
  );
}
