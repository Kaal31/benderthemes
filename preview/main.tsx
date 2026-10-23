import {previewPadButtons} from "./controllerInput";
import { startAchievementPopups, previewAchievementPopup, achievementPopupStatus } from "../src/achievementPopups";
import {SILVER_REFERENCE as PREVIEW_REFERENCE} from "../src/themes/silverReference";
import {openThemeSettings} from "../src/themeSettingsMenu";
import {ONYX_SOUND_PACK,ONYX_PREVIEW_CUES} from "./onyxSoundPack";
import {REAL_GAME_ART} from "./realGameArt";
import { THEME_STYLES } from "../src/engine/themeStyles";
import { beginLaunch, dismissLaunch, launchState } from "../src/launch";
import { openMarketplace, useMarketplace } from "../src/marketplaceState";
import { showFirmwarePreview } from "../src/FirmwareNotice";
import { autoPack, packFile, SOUND_FILES, playSound } from "../src/steam";
// Browser preview of every theme with an invented sample library.
import { createRoot } from "react-dom/client";
import { applyPreset, consoleRows, currentPresetId, cycleLook, cycleLookPreset, cyclePreset, getPresets, refreshPresets, usePresets, saveUserPreset, variantLabel } from "../src/presets";
import { l1Held } from "../src/input";
import { useEffect, useState } from "react";
import { ThemedHome } from "../src/Home";
import { openSteam as openSteamPreview, setLibrarySource, setPreviewAchievements, setPreviewActions, openGamePage, openAchievements, launchGame, loadLibrary as loadLibraryPreview } from "../src/library";
import { getSettings, initSettings, resetThemeSettings, seedSettings, THEMES, updateSettings, useSettings, ThemeId } from "../src/settings";
import { refreshPacks, setPreviewBattery, setPreviewSound, setPreviewStatus, setPreviewUser, setWallpaperOverride, soundDiag } from "../src/steam";
import { setPreviewTier } from "../src/badges";
import { setPreviewLoadedPlugins } from "../src/pluginPresence";
import { setPreviewShots, setPreviewTrailer } from "../src/media";
import { setPreviewStore } from "../src/store";
import { openDestination } from "../src/destinations";
import { musicPlayer } from "../src/musicPlayer";

const themedPreview = (window as any).__themePreview as ThemeId | undefined;
const referenceArt = (window as any).__referenceArt as Record<string, {portrait:string[];landscape?:string[];hero?:string[];logo?:string[]}> | undefined;
const referenceTitles: string[] | undefined = (window as any).__referenceTitles;
const TITLES = ["Cyberpunk 2077","Hades","Elden Ring","Hollow Knight","Stardew Valley","Balatro","Baldur’s Gate 3","DOOM Eternal","Persona 5 Royal","The Witcher 3","Portal 2","Red Dead Redemption 2"];
function hue(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
function svg(w: number, h: number, body: string) {
  return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
}
function art(name: string, i: number) {
  if (referenceArt?.[name] || REAL_GAME_ART[name]) {
    const a = referenceArt?.[name] ?? REAL_GAME_ART[name];
    return {portrait:a.portrait,landscape:a.landscape ?? a.portrait,hero:a.hero ?? a.portrait,logo:a.logo ?? []};
  }
  const a = hue(name);
  const b = (a + 50 + (i % 3) * 40) % 360;
  const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a},65%,45%)"/><stop offset="1" stop-color="hsl(${b},70%,18%)"/></linearGradient><radialGradient id="r" cx=".7" cy=".3" r=".6"><stop offset="0" stop-color="hsl(${(a + 180) % 360},90%,75%)" stop-opacity=".8"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`;
  const shapes = (w: number, h: number) =>
    `<rect width="${w}" height="${h}" fill="url(#g)"/><rect width="${w}" height="${h}" fill="url(#r)"/>` +
    `<path d="M0 ${h * 0.78} Q ${w * 0.3} ${h * 0.6} ${w * 0.55} ${h * 0.75} T ${w} ${h * 0.68} V ${h} H 0z" fill="hsl(${b},50%,10%)" opacity=".75"/>` +
    `<circle cx="${w * 0.72}" cy="${h * 0.32}" r="${Math.min(w, h) * 0.16}" fill="hsl(${(a + 30) % 360},90%,80%)" opacity=".85"/>`;
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const text = (w: number, h: number, size: number, y: number) =>
    `<text x="${w / 2}" y="${y}" font-family="Georgia, serif" font-weight="700" font-size="${size}" fill="#fff" text-anchor="middle" style="paint-order:stroke" stroke="rgba(0,0,0,.45)" stroke-width="${size / 10}">${esc(name)}</text>`;
  return {
    portrait: [svg(600, 900, grad + shapes(600, 900) + text(600, 900, name.length > 14 ? 52 : 64, 170))],
    landscape: [svg(460, 215, grad + shapes(460, 215) + text(460, 215, name.length > 14 ? 30 : 36, 120))],
    hero: [svg(1920, 620, grad + shapes(1920, 620))],
    logo: [svg(900, 260, `<text x="10" y="180" font-family="Georgia, serif" font-weight="700" font-size="${name.length > 14 ? 96 : 120}" fill="#fff" style="paint-order:stroke" stroke="rgba(0,0,0,.4)" stroke-width="8">${esc(name)}</text>`)],
  };
}
const now = Math.floor(Date.now() / 1000);
const apps = (referenceTitles ?? TITLES).map((name, i) => ({
  appid: 1000 + i,
  app_type: 1,
  display_name: name,
  rt_last_time_played: now - i * 86400 * 1.7 - (i % 5) * 3600,
  minutes_playtime_forever: ((i * 7919) % 6000) + (i % 4 === 0 ? 0 : 30),
  installed: themedPreview === "pain" ? i >= 6 : i % 4 !== 3,
  steam_deck_compat_category: [3, 2, 3, 1, 0][i % 5],
  __art: art(name, i),
}));


// ?bugs=1 adds the cases of the 2026-10-12 bug reports (handoff-notes/bugfixes-2026-10-12.md): a non-Steam game whose
// playtime only the app details know, a non-Steam game with a last-played time but no playtime, a hidden game
// (also in Favorites) and, below, friends with nicknames.
const bugCases = new URLSearchParams(location.search).has("bugs");
const HIDDEN_ID = 5003;
if (bugCases) {
  const mkShortcut = (appid: number, name: string, ago: number, mins: number) => ({
    appid, app_type: 1073741824, display_name: name, rt_last_time_played: now - ago, minutes_playtime_forever: mins, installed: true, steam_deck_compat_category: 0, __art: themedPreview === "ios6" ? {portrait:[],landscape:[],hero:[],logo:[]} : art(name, appid % 7),
  });
  apps.splice(1, 0,
    mkShortcut(5001, "Dolphin Emulator", 1800, 0), // playtime lives in the app details only
    mkShortcut(5002, "Heroic Launcher", 5400, 0), // no playtime anywhere, but it was played
    { ...mkShortcut(HIDDEN_ID, "Secret Hidden Game", 600, 900), app_type: 1 }, // in Steam's Hidden collection
  );
  (globalThis as any).appDetailsStore = { GetAppDetails: (id: number) => (id === 5001 ? { nPlaytimeForever: 185 } : null) };
}

// Feed the library reader with the fake apps; art comes from __art.
(globalThis as any).appStore = {
  GetCustomVerticalCapsuleURLs: (a: any) => a.__art?.portrait,
  GetCustomLandcapeImageURLs: (a: any) => a.__art?.landscape,
  GetCustomHeroImageURLs: (a: any) => a.__art?.hero,
  GetCustomLogoImageURLs: (a: any) => a.__art?.logo,
};
setLibrarySource({
  allApps: () => new URLSearchParams(location.search).has("empty") ? [] : apps.slice(0, Number(new URLSearchParams(location.search).get("count")) || 1000),
  hiddenIds: () => new Set(bugCases ? [HIDDEN_ID] : []),
  collections: () => [
    { id: "favorite", name: "Favorites", apps: apps.filter((a, i) => i % 6 === 1 || a.appid === HIDDEN_ID) },
    { id: "rpg", name: "RPGs", apps: apps.filter((_, i) => i % 5 === 2) },
  ],
});
setPreviewUser("DeckPlayer");
// sample store data (the real store is fetched from Steam on the Deck)
{
  const STORE_NAMES = referenceTitles ?? TITLES;
  const mk = (n: string, i: number, extra: any = {}) => ({ id: 900000 + i, name: n, header: (art(n, i + 3) as any).landscape[0], capsule: (art(n, i + 3) as any).hero[0], price: [1999, 2999, 999, 4999, 1499][i % 5], original: i % 3 === 0 ? [2999, 3999, 1999, 5999, 2499][i % 5] : undefined, discount: i % 3 === 0 ? [33, 25, 50, 17, 40][i % 5] : 0, currency: "USD", ...extra });
  const all = STORE_NAMES.map((n, i) => mk(n, i));
  const owned = apps.slice(0, 2).map((a, i) => ({ id: a.appid, name: a.display_name, header: a.__art.landscape[0], capsule: a.__art.hero[0], price: 1999, currency: "USD", discount: 0, ...(i ? {} : {}) }));
  setPreviewStore({
    lists: { featured: [...all.slice(0, 6), ...owned], specials: all.filter((x) => x.discount), top: [...all].reverse(), new: all.slice(4), soon: all.slice(2, 8).map((x) => ({ ...x, soon: true, price: undefined })) },
    search: (q) => all.filter((x) => x.name.toLowerCase().includes(q.toLowerCase())),
    details: (id) => {
      const it = [...all, ...owned].find((x) => x.id === id);
      if (!it) return null;
      return { id, name: it.name, short: "A hand-made sample description so the store page can be tried in the browser preview. On the Deck this text, the price, screenshots and trailer come straight from the Steam Store.", description: "Explore a world of adventure and discovery. This sample description lets you test the classic Store information panel in the browser preview.\n\nFeatures\nExplore memorable locations, discover new challenges, and build your own approach to each encounter.\n\nOn Steam Deck this panel shows the full description supplied by the Steam Store.", header: it.header, screenshots: [it.capsule, it.header, it.capsule], genres: ["Adventure", "Indie"], release: "Oct 5, 2026", developers: ["Sample Studio"], publishers: ["Sample Studio"], priceText: "$" + ((it.price ?? 0) / 100).toFixed(2), originalText: it.original ? "$" + (it.original / 100).toFixed(2) : undefined, discount: it.discount, free: false, hasTrailer: true, platforms: ["windows", "linux"] };
    },
  });
  (window as any).__previewPrompt = () => "Hades";
  (window as any).__openStore = () => openSteamPreview("store");
}
(window as any).__soundDiag = (t: any) => soundDiag(t);
(window as any).__openDestination = openDestination; // tests: open the shared music player / captures
(window as any).__musicPlayer = musicPlayer; // tests: drive the shared music player
(window as any).__refreshPacks = () => refreshPacks();
setWallpaperOverride((n) => (window as any).__testWalls?.[n] ?? null);
setPreviewStatus({ friendsOnline: 3, notifications: 3, downloads: 0, online: true, avatar: PREVIEW_REFERENCE.previewAvatar });
setPreviewAchievements((id) => (id % 3 === 2 ? null : { unlocked: (id * 7) % 40, total: 57 }));
// sample screenshots (drawn) and an optional local test trailer (?trailer=http://…/dash_h264.mpd)
setPreviewShots(
  apps.slice(0, 7).flatMap((a, k) => [0, 1, 2].slice(0, (k % 3) + 1).map((n) => ({ appid: a.appid, url: a.__art.hero[0], created: now - (k * 3 + n) * 7200, caption: "", w: 1280, h: 800 }))),
);
if (new URLSearchParams(location.search).get("trailer")) setPreviewTrailer(() => ({ name: "Test", thumb: "", mpd: new URLSearchParams(location.search).get("trailer")! }));
setPreviewTier((id) => (["platinum", "gold", "silver", "bronze", "borked", "native"] as const)[id % 6]);
setPreviewBattery({ level: 0.72, charging: false });
if (!new URLSearchParams(location.search).get("realsound")) setPreviewSound((kind,variation=0) => {
  const settings = getSettings();
  if(settings?.theme === "onyx"){
    if(!settings.sounds || ["none","steam"].includes(settings.packs.onyx??""))return;
    const names:Record<string,string>={move:"rotation-click",tile:"rotation-click",tab:"menu-press",select:"confirm-press",open:"confirm-press",launch:"confirm-press",back:"back-release",close:"back-release",menu:"menu-press",toggle:"wheel-press",end:"back-release"};
    const name=names[kind];if(!name)return;
    const audio=new Audio(ONYX_PREVIEW_CUES[name]);audio.volume=Math.max(0,Math.min(1,(settings.sfxVolume??80)/100));audio.play().catch(()=>{});return;
  }

  if(settings?.theme === "minecraft" || settings?.theme === "aero" || settings?.theme === "aero2"){
    if (["none","steam"].includes(settings.packs[settings.theme] ?? "")) return;
    const folder=settings.theme === "minecraft" ? "Minecraft Console Legacy" : "windows xp sounds";
    const file=SOUND_FILES[kind === "tile" ? "move" : kind];
    const audio=new Audio(`../bundle/sounds/${encodeURIComponent(folder)}/${file}`);
    audio.volume=Math.max(0,Math.min(1,(settings.sfxVolume??80)/100));audio.play().catch(()=>{});return;
  }
  if(settings?.theme === "republic"){
    const names:Record<string,string>={move:"move",tile:"move",tab:variation%2?"tab_alt":"tab",end:"error",select:"confirm",launch:"confirm",toggle:"slider",open:"confirm",back:"back",menu:"confirm",close:"back"};
    const audio=new Audio(`../bundle/sounds/DHT%20Verified%20Republic/${names[kind]}.wav`);audio.volume=Math.max(0,Math.min(1,(settings.sfxVolume??80)/100));audio.play().catch(()=>{});return;
  }
  if(settings?.theme === "castle"){
    const names:Record<string,string>={move:"MenuTick",tile:"MenuTick",tab:"MenuTick",end:"MenuTick",select:"ConfirmSound",launch:"ConfirmSound",toggle:"ConfirmSound",open:"ConfirmSound",back:"BackSound",menu:"EnterMenu",close:"ExitMenu"};
    const audio=new Audio((window as any).__castleAudio?.[names[kind]+".wav"]);audio.volume=Math.max(0,Math.min(1,(settings.sfxVolume??80)/100));audio.play().catch(()=>{});return;
  }
  if(settings?.theme !== "x360" || settings?.x360?.style !== "blades") return;
  const names:Record<string,string>={move:"cursor",tile:"cursor",select:"select",open:"tier2_enter",back:"back",launch:"select",menu:"guide_open",close:"guide_close",toggle:"select",end:"silence"};
  const file=kind==="tab"?`bladeslide_${variation%4+1}`:names[kind];
  const audio=new Audio((window as any).__bladesAudio?.[file+".wav"]);audio.volume=Math.max(0,Math.min(1,(settings.sfxVolume??80)/100));audio.play().catch(()=>{});
});

const params = new URLSearchParams(location.search);
if(params.has("protondb"))setPreviewLoadedPlugins(params.get("protondb")==="1"?["ProtonDB Badges"]:[]);
(window as any).__previewLoadedPlugins=setPreviewLoadedPlugins;
const initialTheme = (params.get("theme") as ThemeId) || themedPreview || "vita";
(window as any).__testPacks=[...((window as any).__testPacks??[]),ONYX_SOUND_PACK];
// Preview-only generated audio, never part of the Deck's scanned library.
(window as any).__testMusic={ok:true,albums:[
 {id:"demo-evening",name:"Evening Sessions",artist:"Preview Studio",cover:REAL_GAME_ART["Hollow Knight"].portrait[0],source:"local",appid:0,tracks:[{id:"demo-evening-1",title:"Evening Glow",file:"evening.wav",url:new URL("test-music/evening.wav",location.href).href,size:1323044,disc:"1"},{id:"demo-evening-2",title:"Slow Drift",file:"drift.wav",url:new URL("test-music/drift.wav",location.href).href,size:1323044,disc:"1"}]},
 {id:"demo-drift",name:"Quiet Horizons",artist:"Preview Studio",cover:REAL_GAME_ART["Stardew Valley"].portrait[0],source:"local",appid:0,tracks:[{id:"demo-drift-1",title:"Quiet Horizon",file:"drift.wav",url:new URL("test-music/drift.wav",location.href).href,size:1323044,disc:"1"}]},
 {id:"demo-orbit",name:"Night Orbit",artist:"Preview Studio",cover:REAL_GAME_ART["Cyberpunk 2077"].portrait[0],source:"local",appid:0,tracks:[{id:"demo-orbit-1",title:"Night Orbit",file:"orbit.wav",url:new URL("test-music/orbit.wav",location.href).href,size:1323044,disc:"1"}]}
]};

seedSettings({
  theme: initialTheme,
  ...(params.has("switchSkin") ? {styles:{switch:{standardSkin:params.get("switchSkin")==="black"?"black":"white"}}} : {}),
  ...(themedPreview === "ios6" && params.has("folders") ? {frameData:{ios6:{folders:[{id:"demo-games",name:"Games",items:["game:1000","game:1001","game:1002"]}],order:["system:settings","system:downloads","system:recent","folder:demo-games"]}}} : {}),
  onboardingDone: params.get("onboarding") !== "1",
  ...(params.get("hubstyle") ? { hubStyle: params.get("hubstyle")! } : {}),
  tvMode: params.get("tvMode")==="1",
  source: "all",
  vita: { folders: [{ id: "f1", name: "Adventures", apps: [1003, 1007, 1011, 1015], color: "#f5a623" }], order: [], collectionFolders: true, systemBubbles: true, art: "portrait", skin: params.get("vskin") ?? "", bubbleStyle: (params.get("bs") as any) ?? "lens" },
  animations: params.get("still") ? false : true,
  wiiuView: params.get("plaza") ? "plaza" : "grid",
  xmb: { ps3Color: -1, pspColor: -1, collectionFolders: true, p3t: params.get("p3t") ?? "" },
    trailers: { preview: params.get("trailers") === "1", sound: false, video: params.get("tv") === "1" },
  x360: { style: (params.get("xs") as any) ?? "metro", ...(params.get("x360skin") ? { skin: params.get("x360skin")! } : {}), ...(params.get("x360pic") ? { gamerpic: params.get("x360pic")! } : {}) },
  xboxSkin: params.get("xboxskin") ?? "",
  wiiSkin: params.get("wiiskin") ?? "",
  n3dsSkin: params.get("n3ds") ?? "",
  n3dsCursor: params.get("cursor") === "simple" ? "simple" : "3ds",
  n3dsTop: params.get("top") === "hide" ? "hide" : "show",
  // A supplied conversion fixture is the initial skin. Starting with an empty
  // selection makes browser checks race the first native scene subscription.
  switchTheme: params.get("switchTheme") ?? (window as any).__testSwitch?.file ?? "",
  ...(params.get("wall") ? { wallpapers: { x360: params.get("wall")! } } : {}),
});
(globalThis as any).__previewSettings = null;

Object.assign(window,{__openThemeSettings:openThemeSettings,__themeStyles:THEME_STYLES,__getThemeSettings:getSettings,__getThemeLibrary:()=>{const s=getSettings(),c=s.themeCollections?.[s.theme];return loadLibraryPreview(c?.source??s.source,s.sort,s.maxGames,c?.ids);},__beginNativeLaunch:beginLaunch,__dismissLaunch:dismissLaunch,__launchState:launchState,__autoPack:autoPack,__packFile:packFile,__refreshPacks:refreshPacks,__openPlace:openSteamPreview,__updateTheme:updateSettings,__openGame:(id:number)=>openGamePage((window as any).__libraryGame(id)),__openAchievements:()=>openAchievements(loadLibraryPreview("all","recent",400).games[0]),__launchGame:launchGame});
const stopAchievementPreview = startAchievementPopups();
Object.assign(window,{__previewAchievementPopup:previewAchievementPopup,__achievementPopupStatus:achievementPopupStatus,__stopAchievementPopups:stopAchievementPreview});
(window as any).__libraryGame=(id:number)=>loadLibraryPreview("all","recent",400).byId.get(id);
function Toast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let t: any;
    (window as any).__previewToast = (m: string) => {
      setMsg(m);
      clearTimeout(t);
      t = setTimeout(() => setMsg(""), 2200);
    };
  }, []);
  if (!msg) return null;
  return <div style={{ position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", background: "#111c", color: "#fff", padding: "10px 18px", borderRadius: 8, font: "14px system-ui", zIndex: 99999 }}>{msg}</div>;
}
setPreviewActions({
  launch: (g) => (window as any).__previewToast?.(`▶ Launching ${g.name}`),
  nav: (w) => (window as any).__previewToast?.(w.startsWith("game:") ? `Steam game page (${w.slice(5)})` : `Steam → ${w}`),
});

function ControllerTest() {
  const [status,setStatus]=useState('Press a button on your controller to connect'),[input,setInput]=useState({count:0,label:'No input yet'});
  useEffect(()=>{
    const labels:Record<number,string>={1:'A',2:'B',3:'X',4:'Y',5:'LB',6:'RB',9:'D-pad Up',10:'D-pad Down',11:'D-pad Left',12:'D-pad Right',14:'Menu'};
    const observe=(e:Event)=>{const {button,source}=(e as CustomEvent<{button:number;source:string}>).detail;setInput(v=>({count:v.count+1,label:source+': '+(labels[button]??'Button '+button)}));};
    const key=(e:KeyboardEvent)=>{if(e.repeat||(e.target as HTMLElement)?.closest('input,textarea,select'))return;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter','Escape'].includes(e.key))return;setInput(v=>({count:v.count+1,label:'Keyboard: '+e.key}));};
    window.addEventListener('preview-input-observed',observe);window.addEventListener('keydown',key);return()=>{window.removeEventListener('preview-input-observed',observe);window.removeEventListener('keydown',key);};
  },[]);
  useEffect(()=>{
    const update=()=>{
      try {
        const pads=Array.from(navigator.getGamepads?.()??[]).filter((p):p is Gamepad=>!!p?.connected);
        const pad=pads.find(p=>p.buttons.some(b=>b.pressed))??pads.find(p=>previewPadButtons(p).size>0)??pads[0];
        if(!pad){setStatus('No controller detected — press a controller button');return;}
        const held=pad.buttons.flatMap((b,i)=>b.pressed?[i]:[]);
        setStatus(`${pad.id}${held.length?' · Button '+held.join(', '):' · Connected'}`);
      } catch {setStatus('Controller access is unavailable in this browser');}
    };
    update();const timer=setInterval(update,100);return()=>clearInterval(timer);
  },[]);
  const focus=()=>{window.focus();document.querySelector<HTMLElement>('.dht-oldbeta[data-mode=sheet] .beta-categories button[aria-pressed=true], .dht-oldbeta:not([data-mode=sheet]) .beta-cover[data-selected=true], .dht-oldbigpicture:not([data-transition-snapshot]) .library-body .game, .dht-oldbigpicture:not([data-transition-snapshot]) .home-tile.library, .dht-oldbigpicture:not([data-transition-snapshot]) main button')?.focus({preventScroll:true});};
  return <div aria-label="Controller testing" style={{padding:'10px 14px',margin:'0 12px 10px',background:'#14374b',border:'1px solid #3b829d',display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
    <button onClick={focus}>Focus preview controls</button>
    <div aria-label="Preview navigation buttons" style={{display:'flex',gap:6,alignItems:'center'}}>
      {([[11,'←'],[9,'↑'],[10,'↓'],[12,'→'],[1,'A / Enter'],[2,'B / Back']] as const).map(([button,label])=><button key={button} aria-label={`Preview navigation ${label}`} title={button===11?'Scroll left':button===12?'Scroll right':label} onPointerDown={e=>e.preventDefault()} onClick={()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button}))} style={{minWidth:38,padding:'8px 12px',background:'#285c75',color:'#d9f4ff',border:'1px solid #6fa7bc',borderRadius:3,cursor:'pointer'}}>{label}</button>)}
    </div>
    <span role="status" aria-label="Controller status">{status}</span>
    <span role="status" aria-label="Last preview input">{input.label}{input.count?` · Press ${input.count}`:''}</span>
    <span>D-pad / left stick: move · A: select · B: back · X: play · Y: options</span>
    <span>Keyboard: hold ← / → to scroll · ↑ / ↓ to move · Enter to select · Escape to go back. Page Up / Page Down also scroll.</span>
  </div>;
}

function App() {
  const s = useSettings();
  const presets = usePresets();
  const marketplace = useMarketplace();
  const [size, setSize] = useState({ w: 1280, h: 800 });
  useEffect(() => {
    const fit = () => {
      const availW = window.innerWidth - (themedPreview === "ios6" ? 0 : 24);
      const availH = window.innerHeight - (themedPreview === "ios6" ? 0 : 70);
      const ah = Number(new URLSearchParams(location.search).get("h")) || (themedPreview === "ios6" ? 720 : 800); // ?h=960 previews a 4:3 screen
      const k = Math.min(availW / 1280, availH / ah, 1.5);
      setSize(themedPreview === "ios6" ? { w: window.innerWidth, h: window.innerHeight } : { w: Math.round(1280 * k), h: Math.round(ah * k) });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  useEffect(()=>{
    if(initialTheme!=="switch"||!params.has("switchGame"))return;
    const game=loadLibraryPreview("all","recent",400).byId.get(Number(params.get("switchGame")));
    if(!game)return;
    let attempts=0;
    const timer=setInterval(()=>{if(openDestination({place:"game",game})||++attempts>=100)clearInterval(timer);},50);
    return()=>clearInterval(timer);
  },[]);
  return (
    <div style={{ font: "14px system-ui", color: "#ddd" }}>
      <div id="bar" style={{ display: themedPreview === "ios6" ? "none" : "flex", gap: 6, alignItems: "center", padding: "10px 12px", flexWrap: "wrap" }}>
        <b style={{ marginRight: 8 }}>Deck Home Themes preview</b>
        <button onClick={() => openMarketplace()}>Hub</button>
        {s.theme === "silver" && <button onClick={() => window.dispatchEvent(new Event("preview-steam-button"))}>Steam button</button>}
        <button onClick={() => openMarketplace(undefined, { from: s.theme })}>Hub (from this home)</button>
        <button onClick={() => openSteamPreview("settings")}>Theme settings</button>
        <button onClick={showFirmwarePreview}>Preview firmware update</button>
        {s.theme === "switch" && !s.switchTheme && <><button onClick={()=>{const lib=loadLibraryPreview(s.source,s.sort,s.maxGames),name=document.querySelector('.dht-switch-tile[data-selected="true"]')?.getAttribute("data-name"),game=lib.games.find(g=>g.name===name)??lib.games[0];if(game)openGamePage(game);}}>Game preview</button><label>Standard skin <select aria-label="Preview Switch skin" value={String(s.styles?.switch?.standardSkin??"white")} onChange={e=>updateSettings({styles:{...s.styles,switch:{...s.styles?.switch,standardSkin:e.target.value}}})}><option value="white">Basic White</option><option value="black">Basic Black</option></select></label><label><input aria-label="Preview Switch animations" type="checkbox" checked={s.animations} onChange={e=>updateSettings({animations:e.target.checked})}/> Animations</label></>}
        {s.theme === "onyx" && <><label><input aria-label="Preview sound effects" type="checkbox" checked={s.sounds} onChange={e=>updateSettings({sounds:e.target.checked})}/> SFX</label><label>Volume <input aria-label="Preview SFX volume" type="range" min="0" max="100" value={s.sfxVolume} onChange={e=>updateSettings({sfxVolume:Number(e.target.value)})}/></label><button onClick={()=>{updateSettings({sounds:true,sfxVolume:Math.max(60,s.sfxVolume),packs:{...s.packs,onyx:""}});playSound("toggle");}}>Test wheel sound</button><label>Carousel <select aria-label="Preview carousel style" value={String(s.styles?.onyx?.carousel??"covers")} onChange={e=>updateSettings({styles:{...s.styles,onyx:{...s.styles?.onyx,carousel:e.target.value}}})}><option value="covers">Portrait covers</option><option value="square">Square capsules</option><option value="icons">Classic Cover Flow</option></select></label>{(["screenGlass","coverGlass"] as const).map(key=><label key={key}>{key==="screenGlass"?"Screen glass":"Cover glass"} <select aria-label={key==="screenGlass"?"Preview screen glass":"Preview cover glass"} value={String(s.styles?.onyx?.[key]??"off")} onChange={e=>updateSettings({styles:{...s.styles,onyx:{...s.styles?.onyx,[key]:e.target.value}}})}><option value="off">Off</option><option value="clear">Clear</option><option value="prism">Prismatic</option></select></label>)}<label><input aria-label="Preview animations" type="checkbox" checked={s.animations} onChange={e=>updateSettings({animations:e.target.checked})}/> Animations</label></>}

        {THEMES.filter((t) => t.id !== "frame").map((t, i) => (
          <button key={t.id} onClick={() => updateSettings({ theme: t.id, activeTheme: "", enabled: true })} style={{ padding: "5px 10px", borderRadius: 6, border: 0, cursor: "pointer", background: s.theme === t.id ? "#3d8bfd" : "#333", color: "#fff" }}>
            {i + 1}. {t.name}
          </button>
        ))}
        {presets.filter((p) => p.company === "Community").map((p) => (
          <button key={p.id} onClick={() => applyPreset(p)} style={{ padding: "5px 10px", borderRadius: 6, border: 0, cursor: "pointer", background: currentPresetId(s) === p.id ? "#8b5cf6" : "#3a2a55", color: "#fff" }}>
            {p.label}
          </button>
        ))}
        {(s.theme === 'old-big-picture'||s.theme === 'old-beta-big-picture') && <div aria-label="Preview controller" style={{display:'flex',gap:5}}>{([[9,'↑'],[10,'↓'],[11,'←'],[12,'→'],[1,'A'],[2,'B'],[3,'X'],[4,'Y']] as const).map(([button,label])=><button key={button} aria-label={`Controller ${label}`} onPointerDown={e=>e.preventDefault()} onClick={()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button}))}>{label}</button>)}</div>}
        <span style={{ opacity: 0.65, marginLeft: 10 }}>Arrows = D-pad · Enter = Ⓐ · Esc = Ⓑ · X · Y = △/Options · M = ≡ · Q/E = L1/R1 · Z/C = L2/R2 (presets). Old Big Picture: LB = Web · RB = Chat · Select Library to enter.</span>
      </div>
      {(s.theme==='old-big-picture'||s.theme==='old-beta-big-picture')&&<ControllerTest/>}
      <div style={{ position: "relative", width: size.w, height: size.h, margin: themedPreview === "ios6" ? "0" : "0 12px", transform: "translateZ(0)", overflow: "hidden", borderRadius: themedPreview === "ios6" ? 0 : 10, boxShadow: "0 10px 40px #000" }}>
        {s.enabled || marketplace.opened ? <ThemedHome standalone /> : <div style={{ padding: 70, background: "#162331", height: "100%", boxSizing: "border-box" }}><h1>Steam Home restored</h1><p>The deleted theme is hidden. Open Hub to download it again.</p><button onClick={() => openMarketplace()}>Open Hub</button></div>}
      </div>
      <Toast />
    </div>
  );
}

(window as any).__saveUserPreset = () => saveUserPreset();
(window as any).__applyPreset = (id: string) => { const p = getPresets().find((x) => x.id === id); if (p) applyPreset(p); return !!p; };
(window as any).__refreshPresets = () => refreshPresets();
(window as any).__seedSettings = (s: any) => seedSettings(s);
(window as any).__initSettings = () => initSettings();
(window as any).__updateSettings = (p: any) => updateSettings(p);
(window as any).__resetThemeSettings = (t: any) => resetThemeSettings(t);
(window as any).__presets = () => getPresets().map((p) => ({ id: p.id, label: p.label, company: p.company, theme: p.theme, look: p.look, origin: p.origin }));
(window as any).__cyclePreset = (d: number) => cyclePreset(d).id;
(window as any).__cycleLookPreset = (d: number) => cycleLookPreset(d).id;
(window as any).__cycleLook = (d: number) => cycleLook(d).id;
(window as any).__currentPreset = () => currentPresetId();
// tests: the hold-L1 switcher's consoles and their looks, and whether L1 is held for it
(window as any).__consoleRows = () => consoleRows().map((r) => ({ key: r.key, label: r.label, presets: r.presets.map((p) => ({ id: p.id, name: variantLabel(r, p) })) }));
(window as any).__l1Held = () => l1Held();
window.addEventListener("keydown", (e) => {
  if ((e.target as HTMLElement)?.closest?.('input,textarea,select,[contenteditable="true"]')) return;
  const layouts = THEMES.filter((t) => t.id !== "frame");
  const n = Number(e.key);
  if (n >= 1 && n <= layouts.length) updateSettings({ theme: layouts[n - 1].id, activeTheme: "" });
});
createRoot(document.getElementById("root")!).render(<App />);

(globalThis as any).__oldBetaPreview=initialTheme==='old-beta-big-picture';
// Sample friends and achievements, so the friends and trophy pages have something to draw in the preview.
(globalThis as any).friendStore ??= {
  allFriends: [
    ["Kaida", 1, "Hades"], ["Orrin", 1, ""], ["Mei", 0, ""], ["Tobias", 1, "Elden Ring"],
    ["Sable", 0, ""], ["Juno", 1, "Stardew Valley"], ["Rook", 0, ""], ["Wren", 1, ""],
    ...(initialTheme==='old-beta-big-picture' ? [
      ['Lumi',1,'Portal 2'],['Atlas',1,'Baldur’s Gate 3'],['Nova',1,''],['Rowan',1,'DOOM Eternal'],
      ['Iris',1,'Hollow Knight'],['Ash',1,''],['Echo',1,'Balatro'],['Finn',1,''],
      ['Cleo',1,'The Witcher 3'],['Sage',1,''],['Milo',1,'Red Dead Redemption 2'],['Skye',1,''],
      ['Nico',1,''],['Robin',1,''],['Ember',1,'']
    ] : []),
  ].map(([n, st, g]) => ({ persona: { m_strPlayerName: n, m_ePersonaState: st, m_strGameName: g || undefined, m_steamid: `7656119${n}`, ...(bugCases && n === "Kaida" ? { m_strNickname: "Kai (best buddy)" } : bugCases && n === "Tobias" ? { m_strNickname: "Toby" } : {}) } })),
};
{
  const sc = ((globalThis as any).SteamClient ??= {});
  sc.Apps ??= {};
  // Same numbers as setPreviewAchievements above: 57 achievements, the first (id * 7) % 40 unlocked, most recent last; every third game has none.
  const ACH = ["First Steps", "Night Owl", "Collector", "Untouchable", "Speedrunner", "Completionist", "Pacifist", "Treasure Hunter", "Lone Wolf", "Quick Draw", "Master Chef", "Explorer"];
  sc.Apps.GetMyAchievementsForApp ??= async (gameid: string | number) => {
    const id = Number(gameid), total = id % 3 === 2 ? 0 : 57, unlocked = (id * 7) % 40;
    return { data: { rgAchievements: Array.from({ length: total }, (_, i) => ({ strID: `ACH_${i}`, strName: i < 12 ? ACH[i] : `${ACH[i % 12]} ${Math.floor(i / 12) + 1}`, bAchieved: i < unlocked, strDescription: "Preview achievement", rtUnlocked: i < unlocked ? Math.floor(Date.now() / 1000) - (unlocked - i) * 86400 : 0 })) } };
  };
  // Steam's notification tray (unread items), so the Wii U / 3DS notification banners and bell have something to show.
  (globalThis as any).notificationStore ??= { m_rgNotificationTray: [
    { notificationID: "n1", title: "Kaida invited you to play", body: "Hades", appid: 1145360, rtCreated: 1 },
    { notificationID: "n2", title: "New message from Mei", body: "Are you free tonight?", rtCreated: 2 },
    { notificationID: "n3", title: "Download complete", body: "Stardew Valley is ready to play", appid: 413150, rtCreated: 3 },
  ] };
}
