import {SwitchPromptGlyph} from './SwitchPromptGlyph';
import {useSwitchReferenceHints} from "./useSwitchReferenceHints";
import {SwitchLibrary} from "./SwitchLibrary";
import {WallpaperVideo} from "../WallpaperMedia";
import {startSwitchCapture} from './switchCaptureTransition';
import {flushSync} from 'react-dom';
import {SwitchAppletCapture,SwitchCapturedFrame} from './SwitchAppletCapture';
import {SwitchDialogContent} from './SwitchDialogContent';
import {useSteamStatus} from '../steam';
import {SwitchNativeFocus} from "./SwitchNativeFocus";
import {SwitchEmptyLibrary} from './SwitchEmptyLibrary';
import {useDownloads} from '../downloads';
import {SWITCH_RUNTIME_MOTION} from './switchRuntimeDefaults';
import {composeSwitchAnimations} from './switchAnimationFiles';
import {SwitchServiceScene} from './SwitchServiceScene';
import {SwitchFooter} from './SwitchFooter';
import {SwitchGameTitle} from './SwitchGameTitle';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {useSwitchMirroredImage} from "./useSwitchMirroredImage";
import {SwitchFooterController,SwitchFooterKey} from "./SwitchShared";
import {SwitchMenu} from "./SwitchMenu";
import {useLaunchState} from "../launch";
import {useSwitchResume} from "./useSwitchResume";
import {SwitchAppletTree} from "./SwitchAppletTree";
import {SwitchLauncherTree} from "./SwitchLauncherTree";
import {SwitchProfile} from "./SwitchProfile";
import {SwitchControllerNotice} from "./SwitchControllerNotice";
import {SwitchHudTree} from "./SwitchHudTree";
import {SwitchGameMotion,SwitchMotionPane} from "./SwitchGameMotion";
import {SwitchChildLock} from "./SwitchChildLock";
import {SwitchNumber,SwitchClock,SwitchNetwork} from "./SwitchHud";
import {SwitchLauncher} from "./SwitchLauncher";
import {firmwarePanes,SwitchFirmwareProfile} from "./switchFirmware";
import { SwitchMaterial, effectStyle, nxColor, resolvePalette, panelColor } from "./SwitchMaterial";
import { style as themeStyle } from "../engine/themeStyles";
import type { ReactNode } from "react";
import type { SwitchAnimation } from "../switchThemes";
import { backgroundRaster, paneStyle, useSwitchAnimation, useSwitchPaneMotion } from "./switchConversion";
import {ProfileAvatar} from "../ProfileAvatar";
// Nintendo Switch home: a row of square game tiles with a bright focus frame, the game's name below,
// and a row of round system buttons (News, Shop, Album, Controllers, Settings, Power).
// A .nxtheme (see switchThemes.ts) supplies the wallpaper, optional wallpapers for "All Software" and
// "Settings", and the round button pictures; each part has its own toggle in Theme options.
import { CSSProperties, useEffect, useState, useRef, useMemo } from "react";
import { GameArt, Icon, IconName, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { Game, openSteam, SteamPlace } from "../library";
import { showTitle, THEMES } from "../settings";
import { playSound, useBattery, useClock, useWallpaper } from "../steam";
import { themeSettingsItems } from "../themeSettingsMenu";
import { switchParts, useSwitchSkin } from "../switchThemes";
import { useReportFocus } from "../focus";

type Dock = { id: string; label: string; icon: IconName; art?: string; place?: SteamPlace; action?: "settings" | "album" };
const DOCK: Dock[] = [
  { id: "news", label: "News", icon: "bell", art: "news", place: "community" },
  { id: "shop", label: "Shop", icon: "store", art: "shop", place: "store" },
  { id: "album", label: "Album", icon: "photo", art: "album", action: "album" },
  { id: "controller", label: "Controllers", icon: "game", art: "controller", place: "qam" },
  { id: "settings", label: "Settings", icon: "gear", art: "settings", action: "settings" },
  { id: "power", label: "Power", icon: "power", art: "power", place: "power" },
];
/** The console's own dock symbols, drawn as outlines (news, eShop bag, album, controller); settings and power use the shared icons. */
function DockGlyph({ id, size, color }: { id: string; size: number; color: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block" }}>
      {id === "news" && <><path {...p} d="M10 8h28a5 5 0 0 1 5 5v15a5 5 0 0 1-5 5H27l-7 8v-8H10a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5z" /><path {...p} d="M13 17h22M13 25h14" /></>}
      {id === "shop" && <><path {...p} d="M9 17h30l2 23H7z" /><path {...p} d="M16 17v-3a8 8 0 0 1 16 0v3" /></>}
      {id === "album" && <><rect {...p} x="5" y="8" width="38" height="32" rx="4" /><path {...p} d="M9 35l10-12 7 8 5-5 8 9" /><circle {...p} cx="16" cy="17" r="3" /></>}
      {id === "controller" && <g transform="rotate(-45 24 24)"><rect {...p} x="15" y="2" width="18" height="44" rx="9" /><circle {...p} cx="24" cy="14" r="4" /><circle {...p} cx="24" cy="27" r="1.6" fill={color} /><circle {...p} cx="24" cy="35" r="1.6" fill={color} /></g>}
    </svg>
  );
}
/** The handheld console symbol at the left of the footer line. */
function ConsoleGlyph({ w, color }: { w: number; color: string }) {
  return (
    <svg width={w} height={w * 0.47} viewBox="0 0 68 32" style={{ display: "block" }}>
      <rect x="1.5" y="1.5" width="65" height="29" rx="9" fill="none" stroke={color} strokeWidth="3" />
      <rect x="13" y="5" width="42" height="22" rx="2.5" fill={color} />
      <circle cx="7" cy="11" r="2.6" fill={color} /><circle cx="61" cy="21" r="2.6" fill={color} />
      <circle cx="59" cy="9" r="1.4" fill={color} /><circle cx="63" cy="9" r="1.4" fill={color} /><circle cx="61" cy="7" r="1.4" fill={color} /><circle cx="61" cy="11" r="1.4" fill={color} />
    </svg>
  );
}

/** The console's battery: square outline, green fill (red when low), contact nub and a bolt outside while charging. */
function SwitchBattery({ level, charging, color, w,effects }: {effects?:Record<string,import("../switchThemes").SwitchEffect>; level: number; charging?: boolean; color: string; w: number }) {
  const fill = Math.max(0.06, Math.min(1, level));
  return (
    <svg width={w * 1.35} height={w * 0.62} viewBox="0 0 54 25" style={{ display: "block" }}>
      <rect style={effectStyle(effects?.batteryBase)} x="1.5" y="1.5" width="38" height="22" rx="1.5" fill="none" stroke={color} strokeWidth="3" />
      <rect x="5" y="5" width={31 * fill} height="15" fill={fill < 0.2 && !charging ? "#ff4b3a" : "#5be300"} />
      <rect x="40.5" y="8" width="3.5" height="9" rx="1" fill={color} />
      {level<0&&<text style={effectStyle(effects?.batteryError)} x="15" y="19" fill={color}>!</text>}
      {charging && <path style={effectStyle(effects?.batteryCharge)} d="M51 1l-6 12h4.5l-2 11 7-14h-4.5z" fill={color} />}
    </svg>
  );
}

/** The console always shows the time as 24-hour H:MM in a narrow face (the Deck's 12/24 setting is not used here). */
const clock24h = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
const CLOCK_FONT = '"DIN Condensed", "Barlow Condensed", "Roboto Condensed", "Arial Narrow", sans-serif';
const DOCK_COLOR: Record<string, string> = { news: "#e8423f", shop: "#f5a623", album: "#2d7fe0", controller: "#777" }; // the console's coloured buttons; the others stay grey
const CSS = `.dht-switch-focus{box-shadow:inset 0 0 0 3px var(--dht-switch-accent,#00c3e3),inset 0 0 0 6px #fff,inset 0 0 0 7px var(--dht-switch-accent,#00c3e3);animation:dhtSwitchPulse 1.3s ease-in-out infinite alternate;pointer-events:none}
@keyframes dhtSwitchPulse{from{opacity:.82}to{opacity:1}}
.dht-switch-standard-track,.dht-switch-library-track{transition:transform 280ms cubic-bezier(.22,1,.36,1);will-change:transform}
.dht-switch-standard-focus{transition:transform 280ms cubic-bezier(.22,1,.36,1),width 220ms ease,height 220ms ease,border-radius 220ms ease;will-change:transform;pointer-events:none}
.dht-switch-standard-caption{animation:dhtSwitchCaption 160ms ease-out both}
.dht-switch-apps[data-entering="true"]>.dht-switch-tile{animation:dhtSwitchLibraryReveal 320ms cubic-bezier(.22,1,.36,1) both}
@keyframes dhtSwitchLibraryReveal{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes dhtSwitchCaption{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.dht-switch-root[data-standard="true"][data-motion="false"] *{transition:none!important;animation:none!important}
@media(prefers-reduced-motion:reduce){.dht-switch-root[data-standard="true"] *{transition:none!important;animation:none!important}}`;

/** Average brightness (0..1) of a picture, measured in the page for wallpapers the backend could not measure. */
export function useLuma(url: string | null, known?: number): number | undefined {
  const [v, setV] = useState<number | undefined>(known);
  useEffect(() => {
    setV(known);
    if (!url || known !== undefined) return;
    let alive = true;
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement("canvas"); c.width = 16; c.height = 9;
        const g = c.getContext("2d"); if (!g) return;
        g.drawImage(img, 0, 0, 16, 9);
        const d = g.getImageData(0, 0, 16, 9).data; let t = 0;
        for (let i = 0; i < d.length; i += 4) t += d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        if (alive) setV(t / (d.length / 4) / 255);
      } catch { /* leave the default text colour */ }
    };
    img.src = url;
    return () => { alive = false; };
  }, [url, known]);
  return v;
}

function AnimatedGameLayer({children,animations,pane,event,active,style}: {children?:ReactNode;animations:SwitchAnimation[];pane:string;event:string;active:boolean;style?:CSSProperties}) {
 const ref=useSwitchAnimation(animations.find(a=>a.pane===pane&&a.event===event),active,event);
 return <div ref={ref} className={`dht-switch-layer-${pane}`} style={{position:"absolute",inset:0,pointerEvents:"none",...style}}>{children}</div>;
}
export function SwitchHome() {
  const api = useHome(), s = api.settings, { W, H } = useStage(), menu = useMenu();
  const hostStatus=useSteamStatus();
  const now = useClock(15000), bat = useBattery(), skin = useSwitchSkin(), downloads = useDownloads();
  const [controllerNotice,setControllerNotice]=useState<string|null>(null);
  const [view, setView] = useState<"home" | "apps" | "set" | "lock">("home");
  const [libraryEntering,setLibraryEntering]=useState(false);
  // presets v2: the preset's Background (any installed picture) takes the theme wallpaper's place
  const wall = useWallpaper("switch");
  const parts0 = switchParts(skin, view);
  const parts = wall ? { ...parts0, background: wall, brightness: undefined, own: false } : parts0;
  const conversion = themeStyle<boolean>(s,"switch","consoleConversion") ? skin?.screens.home?.conversion : undefined;
  const referenceRoot=useSwitchReferenceHints(skin?.screens.home?.preview,conversion);
  const firmwareProfile=themeStyle<SwitchFirmwareProfile>(s,"switch","firmwareLayout");
  const panes = conversion?firmwarePanes(conversion.panes,firmwareProfile,conversion.targetFirmware,conversion.hideOnlineButton):{};
  const order:Record<string,number>={N_GameRoot:3,N_System:4,L_ChildLock:5,N_Balloon:6,N_MyPage:7,L_Hud:8,L_BalloonCtrl:9,...conversion?.paneOrder?.["RdtBase.bflyt"]},bgOrder=conversion?.paneOrder?.["BgNml.bflyt"]??{};
  const rawEffects = conversion?.effects ?? {};
  const animationOn = s.animations && view === "home";
  const launch=useLaunchState();
  const [capturedFrame,setCapturedFrame]=useState<SwitchCapturedFrame>();
  const captureSource=useRef<HTMLDivElement>(null),capturePending=useRef(false);
  const withCapture=(action:()=>void,kind:'applet'|'game'='applet')=>{
    if(capturePending.current)return;
    if(!conversion||!animationOn||!captureSource.current){action();return;}
    capturePending.current=true;
    const started=startSwitchCapture(captureSource.current,()=>flushSync(()=>{setCapturedFrame({url:'',gpu:true,kind,serial:Date.now()});action();}),()=>{capturePending.current=false;setCapturedFrame(undefined);});
    if(!started){capturePending.current=false;action();}
  };
  const launchGame=(game:Game)=>{void withCapture(()=>api.launch(game),'game');};
  const activateGame=(game:Game)=>api.activate(game,()=>skin?launchGame(game):api.details(game));
  const sceneRef=useSwitchPaneMotion(conversion?.animations??[],"scene",[launch?"launch":menu.isOpen?"exit":"enter"],animationOn);
  const resume=useSwitchResume(api.lib.games.map(game=>game.appid));
  const rootRef=useSwitchPaneMotion(conversion?.animations??[],"sceneRoot",[launch?"launch":menu.isOpen?"exit":"enter"],animationOn);
  const bgRaster=backgroundRaster(conversion?.animations??[],rawEffects.background,rawEffects.backgroundContainer,W,H);
  const bgRef=useSwitchPaneMotion(conversion?.animations??[],"background",[menu.isOpen?"exit":"enter",...(resume>0?["resume"]:[])],animationOn,rawEffects.backgroundContainer,1,1,false,resume,bgRaster);
  const footerRef=useSwitchPaneMotion(conversion?.animations??[],"footer",[launch?"exit":menu.isOpen?"exit":"enter"],animationOn,rawEffects.footer,1,1,true);
  const luma = useLuma(parts.background, parts.brightness);
  const colorMode=themeStyle<string>(s,"switch","firmwareColors");
  const standardSkin=themeStyle<string>(s,"switch","standardSkin");
  const dark = !skin ? standardSkin==="black" : colorMode==="dark" || (colorMode!=="light" && (conversion?true:parts.background ? (luma ?? 0.5) < 0.55 : false));
  const effects=Object.fromEntries(Object.entries(rawEffects).map(([key,effect])=>[key,resolvePalette(effect,dark)!]));
  const ink = dark ? "#fff" : "#2d2d2d";
  const dock:Dock[]=[
    ...(panes.L_BtnLR?[{id:"online",label:"Nintendo Switch Online",icon:"game" as IconName,place:"community" as SteamPlace}]:[]),
    ...DOCK.slice(0,3),
    ...(panes.L_BtnSplay?[{id:"gameShare",label:"GameShare",icon:"game" as IconName,place:"library" as SteamPlace}]:[]),
    DOCK[3],
    ...(panes.L_BtnVgc?[{id:"virtualCards",label:"Virtual Game Cards",icon:"apps" as IconName,place:"library" as SteamPlace}]:[]),
    ...DOCK.slice(4),
  ];
  const dockKeys:Record<string,string>={news:"L_BtnNoti",shop:"L_BtnShop",album:"L_BtnPvr",controller:"L_BtnCtrl",settings:"L_BtnSet",power:"L_BtnPow",online:"L_BtnLR",gameShare:"L_BtnSplay",virtualCards:"L_BtnVgc"};
  const visibleDock = dock.map((_,i)=>i).filter(i=>panes[dockKeys[dock[i].art??dock[i].id]]?.Visible!==false);

  const games = api.lib.games;
  const [sel, setSel] = useRemembered("switch-sel", 0);
  const [pressed,setPressed]=useState(false),[pointerPressed,setPointerPressed]=useState(false);
  const [row, setRow] = useState<"tiles" | "dock">("tiles");
  const [dsel, setDsel] = useState(0), [asel, setAsel] = useState(0);
  useEffect(()=>{
    let timer:ReturnType<typeof setTimeout>|undefined;
    const notify=(event:Event)=>{const connected=event.type==="gamepadconnected";setControllerNotice(connected?"Controller connected":"Controller disconnected");if(timer)clearTimeout(timer);timer=setTimeout(()=>setControllerNotice(null),2500);};
    window.addEventListener("gamepadconnected",notify);window.addEventListener("gamepaddisconnected",notify);
    return()=>{window.removeEventListener("gamepadconnected",notify);window.removeEventListener("gamepaddisconnected",notify);if(timer)clearTimeout(timer);};
  },[]);
  const userOptions=()=>menu.open([{label:api.user,disabled:true},{label:"Account settings",action:()=>openSteam("settings")}],"User");
  const n = games.length; // tiles: the games, then "All Software"
  const cur = clamp(sel, 0, n);
  const g: Game | undefined = games[cur];
  useReportFocus(view === "apps" ? games[asel] : view === "home" && row === "tiles" ? g : undefined);
  const COLS = 6;
  const openLibrary=()=>{
    setAsel(0);
    setLibraryEntering(!conversion&&s.animations&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setView("apps");
  };
  useEffect(()=>{
    if(!libraryEntering)return;
    if(view!=="apps"||!s.animations){setLibraryEntering(false);return;}
    // Six columns reveal in a short wave; clear the entrance before later
    // rows are mounted by navigation so paging never replays the effect.
    const timer=setTimeout(()=>setLibraryEntering(false),760);
    return()=>clearTimeout(timer);
  },[libraryEntering,view,s.animations]);


  useEffect(() => { if (view === "set" && !menu.isOpen) setView("home"); }, [menu.isOpen, view]);

  const dialogShared={effects,animations:conversion?.animations??[],modern:!!panes.L_BtnSplay,dark,enabled:animationOn};
  const showInformation=()=>g&&menu.open([{label:"Steam details",action:()=>api.details(g)},{label:"Close"}],g.name,{page:true,body:<SwitchDialogContent {...dialogShared} file="DCntImageText" text={g.name} image={<GameArt g={g} kind="portrait" style={{width:'100%',height:'100%'}}/>}/>});
  const showSaves=()=>g&&menu.open([{label:"Close"}],"Save data",{page:true,body:<SwitchDialogContent {...dialogShared} file="DCntSelectSaveData" text="Manage saves in Steam" saveData={{cloud:{label:"Steam Cloud settings",available:hostStatus.cloud===true,onActivate:()=>openSteam("settings")},local:{label:"Local game options",available:true,onActivate:()=>api.nativeMenu(g)}}}/>});
  const options = () => menu.open([
    ...(conversion ? [{label:`Import details (${conversion.warnings.length} unsupported)`,sub:()=>[
      {label:`${conversion.converted} converted operations`,disabled:true},
      ...(conversion.warnings.length?[{label:'Unsupported properties',sub:()=>conversion.warnings.map(w=>({label:w,disabled:true}))}]:[]),
      ...((conversion.notes?.length??0)?[{label:'Source layout notes',sub:()=>conversion.notes!.map(w=>({label:w,disabled:true}))}]:[]),
      ...((conversion.resourceWarnings?.length??0)?[{label:'Menu resource issues',sub:()=>conversion.resourceWarnings!.map(w=>({label:w,disabled:true}))}]:[]),
    ]}] : []),
    ...(g ? [{ label: "Start", action: () => launchGame(g) }, { label: "Information", action:showInformation },{label:"Save data",action:showSaves}, { label: "Game Options", action: () => api.nativeMenu(g) }] : []),
    ...(skin?.screens.lock?.background ? [{ label: "Lock screen", action: () => setView("lock") }] : []),
    { label: "Home", action: api.showSteamHome },
  ], g?.name ?? "Switch");
  const runDock = (i:number)=>{void withCapture(()=>runDockAction(i));};
  const runDockAction = (i: number) => {
    const d = dock[i]; playSound("select");setPressed(true);setTimeout(()=>setPressed(false),180);
    if (d.action === "album") api.openMedia();
    else if (d.action === "settings") { setView("set"); menu.open([...themeSettingsItems(), { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) }, { label: "Home Screen Settings", action: api.openSettings }], "Settings", { page: true }); }
    else if (d.place) openSteam(d.place);
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (view === "lock") return setView("home"), playSound("tab"), true; // any button wakes the console
    if (b === "y" || b === "menu") return options(), true;
    if (view === "apps") {
      if(["left","right","up","down","a","b"].includes(b))setLibraryEntering(false);
      const move = (d: number) => { const k = clamp(asel + d, 0, Math.max(0, n - 1)); if (k !== asel) (setAsel(k), playSound("move")); };
      if (b === "left") move(-1); else if (b === "right") move(1); else if (b === "up") move(-COLS); else if (b === "down") move(COLS);
      else if (b === "b") (setView("home"), playSound("tab"));
      else if (b === "a" && games[asel]) activateGame(games[asel]);
      return true;
    }
    if (row === "dock") {
      if (b === "left" || b === "right") { const k = visibleDock[clamp(visibleDock.indexOf(dsel) + (b === "left" ? -1 : 1), 0, visibleDock.length - 1)] ?? dsel; if (k !== dsel) (setDsel(k), playSound("move")); }
      else if (b === "up" || b === "b") (setRow("tiles"), playSound("tab"));
      else if (b === "a") runDock(dsel);
      return true;
    }
    if (b === "left" || b === "right" || b === "l1" || b === "r1") {
      const k = clamp(cur + (b === "left" ? -1 : b === "right" ? 1 : b === "l1" ? -4 : 4), 0, n);
      if (k !== cur) (setSel(k), playSound("tile"));
    } else if ((b === "up" || b === "down") && grid) {
      const here=slotFor(cur)?.Position;const candidates=pageSlots.map((x,j)=>({j,pos:x.slot?.Position})).filter(x=>b==="down"?(x.pos?.Y??0)<(here?.Y??0)-5:(x.pos?.Y??0)>(here?.Y??0)+5).sort((a,b)=>Math.abs((a.pos?.Y??0)-(here?.Y??0))-Math.abs((b.pos?.Y??0)-(here?.Y??0))||Math.abs((a.pos?.X??0)-(here?.X??0))-Math.abs((b.pos?.X??0)-(here?.X??0)));
      if(candidates.length){setSel(Math.min(n-1,pageStart+candidates[0].j));playSound("tile");}else if(b==="down"&&visibleDock.length){setDsel(visibleDock[0]);setRow("dock");}
    } else if (b === "down" && visibleDock.length) (setDsel(visibleDock[0]),setRow("dock"), playSound("tab"));
    else if (b === "a") {
      playSound("select");setPressed(true);setTimeout(()=>setPressed(false),180);
      if (g) activateGame(g); else openLibrary();
    } else if (b === "x" && g) launchGame(g);
    else return false;
    return true;
  };

  const k = W / 1280; // layout is drawn for 1280 wide, as on the console
  const iconPane = panes["game:P_IconGame"];
  const rootScale = panes["game:RootPane"]?.Scale;
  // ScrollArea/ScrollWindow are clipping/hit-test panes, not game transforms.
  // Each N_Icon is an individually placed slot; a custom grid must retain its Y.
  const gameScale = {X:(panes.N_GameRoot?.Scale?.X??1)*(panes.N_Game?.Scale?.X??1),Y:(panes.N_GameRoot?.Scale?.Y??1)*(panes.N_Game?.Scale?.Y??1)};
  const slots=Array.from({length:13},(_,i)=>panes[`N_Icon_${String(i).padStart(2,"0")}`]);
  const explicitSlots=slots.some(x=>x?.Position!==undefined);
  const visibleSlots=slots.map((slot,index)=>({slot,index})).filter(x=>x.slot?.Visible!==false);
  const grid=explicitSlots&&new Set(visibleSlots.filter(x=>x.index<12).map(x=>Math.round(x.slot?.Position?.Y??0))).size>1;
  const stationary=Math.abs(panes.N_GameRoot?.Scale?.X??1)<.001&&Math.abs(panes.N_Game?.Scale?.X??1)>1000;
  const fixedSlots=grid||stationary;
  const pageSlots=visibleSlots.filter(x=>x.index<12);
  const pageSize=Math.max(1,pageSlots.length);
  const lastGameSelection=useRef(0);
  if(cur<n)lastGameSelection.current=cur;
  const pageSelection=stationary&&cur===n?lastGameSelection.current:cur;
  const pageStart=fixedSlots?Math.floor(Math.min(pageSelection,Math.max(0,n-1))/pageSize)*pageSize:0;
  const launcherSlot=panes.N_Icon_12;
  const slotFor=(i:number)=>i===n?launcherSlot:slots[fixedSlots?pageSlots[(i-pageStart)%pageSize]?.index:i%12];
  const dimensions=(i:number)=>{
    const slot=slotFor(i);
    const sourceKey=i===n?-1:fixedSlots?pageSlots[(i-pageStart)%pageSize]?.index:i%12;
    const importedSlot=conversion?.panes[`N_Icon_${String(sourceKey).padStart(2,"0")}`];
    const sx=i===n?(slot?.Scale?.X??1)*(effects.allSoftwareRoot?.Scale?.X??1):(importedSlot?.Scale?.X??rootScale?.X??slot?.Scale?.X??1),sy=i===n?(slot?.Scale?.Y??1)*(effects.allSoftwareRoot?.Scale?.Y??1):(importedSlot?.Scale?.Y??rootScale?.Y??slot?.Scale?.Y??1);
    return {width:(i===n?160:iconPane?.Size?.X??262)*sx*gameScale.X*k,height:(i===n?160:iconPane?.Size?.Y??262)*sy*gameScale.Y*k};
  };
  const T=dimensions(cur).width,tileHeight=dimensions(cur).height;
  const F=conversion?T:T*276/262;
  const gameCenterX=(640+(panes.N_GameRoot?.Position?.X??0)+(panes.N_Game?.Position?.X??0)*(panes.N_GameRoot?.Scale?.X??1))*k;
  const startX=explicitSlots?gameCenterX+(slots[0]?.Position?.X??0)*gameScale.X*k-T/2:100*k;
  const pitch=explicitSlots?((slots[1]?.Position?.X??(slots[0]?.Position?.X??0)+266)-(slots[0]?.Position?.X??0))*gameScale.X*k:conversion?dimensions(0).width+4*k:280*k;
  // Fixed slots keep selection growth from pushing neighboring covers. Only the
  // standard row scrolls as a single composited track; imported layouts keep their geometry.
  const scroll=grid||stationary?0:Math.max(0,cur-3)*pitch;
  const centerY=H/2-((panes.N_Game?.Position?.Y??0)*(panes.N_GameRoot?.Scale?.Y??1)+(panes.N_GameRoot?.Position?.Y??0))*k;
  const gameBounds={width:(panes.N_Game?.Size?.X??10)*gameScale.X*k,height:(panes.N_Game?.Size?.Y??10)*gameScale.Y*k};
  const tileX=(i:number)=>i===n&&explicitSlots?gameCenterX+((launcherSlot?.Position?.X??2807)+(effects.allSoftwareRoot?.Position?.X??23)*(launcherSlot?.Scale?.X??1))*gameScale.X*k-dimensions(i).width/2-scroll:explicitSlots?gameCenterX+(slotFor(i)?.Position?.X??(slots[0]?.Position?.X??0)+i*(pitch/k))*gameScale.X*k-dimensions(i).width/2-scroll:startX+i*pitch-scroll+(conversion?(i>cur?F-T:0):(262*k-dimensions(i).width)/2);
  const tileTop=(i:number)=>i===n&&explicitSlots?centerY-((launcherSlot?.Position?.Y??0)+(effects.allSoftwareRoot?.Position?.Y??0)*(launcherSlot?.Scale?.Y??1))*gameScale.Y*k-dimensions(i).height/2:explicitSlots?centerY-(slotFor(i)?.Position?.Y??0)*gameScale.Y*k-dimensions(i).height/2:H*.29+(!conversion?(262*k-dimensions(i).height)/2:0);
  const tileY=tileTop(cur);
  const dockY = H * 0.7;
  const standardFocus:CSSProperties={
    position:"absolute",left:0,top:0,zIndex:10,pointerEvents:"none",
    width:row==="dock"?89.6*k:F,height:row==="dock"?89.6*k:F,
    borderRadius:row==="dock"||cur===n?"50%":0,
    transform:row==="dock"
      ? `translate3d(${W/2-(dock.length*88+(dock.length-1)*20)*k/2+dsel*108*k-.8*k}px,${dockY-4.8*k}px,0)`
      : `translate3d(${tileX(cur)-(F-T)/2}px,${tileTop(cur)-(F-T)/2}px,0)`,
    opacity:menu.isOpen?0:1,
  };
  const rotatedTitle = Math.abs((effects.gameTitle?.Rotation?.Z??0)%180)>45;
  const titleWidth = Math.min((effects.gameTitle?.Size?.X??400)*k,W-40*k);
  const titleHeight = (effects.gameTitle?.Size?.Y??40)*k;
  const titlePosition:CSSProperties = rotatedTitle ? {left:startX-38*k-titleWidth/2,top:Math.max(titleWidth/2+10*k,Math.min(H-titleWidth/2-10*k,tileY+tileHeight/2))-titleHeight/2,width:titleWidth,height:titleHeight,justifyContent:"center",transformOrigin:"center",boxSizing:"border-box"} : {};
  const label = (i: number) => i < n ? games[i].name : "All Software";
  const texture=effects.background?.texture;
  const backgroundImage=useSwitchMirroredImage(parts.background,texture?.mirrorX,texture?.mirrorY);
  const bg: CSSProperties = parts.background
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center",...(texture?{backgroundPosition:"center",backgroundSize:`${(texture.mirrorX?200:100)/texture.scaleX}% ${(texture.mirrorY?200:100)/texture.scaleY}%`,backgroundRepeat:`${texture.repeatX?"repeat":"no-repeat"} ${texture.repeatY?"repeat":"no-repeat"}`,imageRendering:texture.nearest?"pixelated":"auto"}:{}),...effectStyle(effects.backgroundContainer),...paneStyle(effects.background) }
    : { background: effects.backgroundPanel&&effects.backgroundPanel.Visible!==false?panelColor(effects.backgroundPanel):dark?"#2d2d2d":"var(--dht-switch-bg, linear-gradient(#ececec,#dcdcdc))" };

  const childLockLayer=effects.childLock?.Visible!==false&&(effects.childLock||Object.keys(effects).some(key=>key.startsWith("childLock:")))&&<SwitchChildLock backingBehindGames={conversion?.childLockBackingBehindGames??false} effects={effects} animations={conversion?.animations??[]} dark={dark} animate={animationOn} modern={!!panes.L_BtnSplay} scale={k} rootY={0} onActivate={()=>menu.open([{label:"Steam settings",action:()=>openSteam("settings")},{label:"Close"}],"Parental controls",{page:true,body:<SwitchDialogContent {...dialogShared} file="DCntPclOnOff" text="Manage parental controls in Steam settings."/>})}/>;
  const swipe=useRef<{x:number;y:number;pointerId:number;active:boolean;dragged:boolean}|null>(null);
  // Keep the drag marker through pointer-up to suppress its click, but stop
  // tracking movement as soon as the press ends or leaves the scene.
  const endSwipe=()=>{if(swipe.current)swipe.current.active=false;setPointerPressed(false);};
  const refreshMotion=useMemo(()=>conversion?composeSwitchAnimations(SWITCH_RUNTIME_MOTION[panes.L_BtnSplay?'modern':'classic'],conversion.nativeAnimations?.RdtBase??[],conversion.animationFiles):[],[conversion,!!panes.L_BtnSplay]);
  const refreshRef=useSwitchPaneMotion(refreshMotion,'N_Game',['refresh'],animationOn,{Position:panes.N_Game?.Position},k*(panes.N_GameRoot?.Scale?.X??1),k*(panes.N_GameRoot?.Scale?.Y??1),true,`${resume}:${api.lib.games.length}`);
  const cursorShadow=effects.cursorGlow?.shadowFunction!==undefined?"none":effectStyle(effects.cursor).boxShadow;
  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Open", y: "Options", b: view === "home" ? undefined : "Back" } as any}>
      <SwitchNativeContext.Provider value={conversion}><Stage background="#e6e6e6">
        <style>{CSS}</style>
        {effects.cursor && <style>{`.dht-switch-focus{box-sizing:border-box;border-style:solid;animation:none!important;border-color:${nxColor(effects.cursorGlow?.white??effects.cursor.white,"#19bcc4")}!important;border-width:calc(${effects.cursor.borderWidth??3}px * var(--dht-switch-focus-unit,1))!important;border-radius:calc(${effects.cursor.radius??0}px * var(--dht-switch-focus-unit,1));box-shadow:${cursorShadow??`0 0 ${effects.cursor.shadow??0}px ${nxColor(effects.cursorGlow?.white,effects.cursor.white?nxColor(effects.cursor.white):"#19bcc4")}`}!important;${effects.cursor.borderDraw===false?"border:none!important;":""}}`}</style>}
        <div ref={element=>{rootRef.current=element;captureSource.current=element;referenceRoot.current=element;}} className="dht-switch-root" data-standard={!conversion} data-standard-skin={!skin?standardSkin:undefined} data-motion={s.animations} data-resume-generation={resume} style={{position:"absolute",inset:0}}>
        {parts.background&&effects.backgroundContainer?.Visible===false&&<div className="dht-switch-wallpaper-backdrop" style={{position:"absolute",inset:0,backgroundImage:`url(${parts.background})`,backgroundSize:"cover",backgroundPosition:"center"}}/>}
        <div ref={bgRef} className="dht-switch-bg" data-raster-mode={bgRaster?'viewport':undefined} data-converted={!!conversion?.converted} data-dht-from-skin={parts.background ? "" : undefined} data-view={view} style={{ position: "absolute", inset: 0, ...bg,zIndex:bgOrder.exelixBG }} />
        <WallpaperVideo src={wall} style={{zIndex:bgOrder.exelixBG+.1}}/>{effects.backgroundPanel && (effects.backgroundPanel.Position||effects.backgroundPanel.Size) && effects.backgroundPanel.Visible!==false && <div className="dht-switch-background-panel" style={{position:"absolute",pointerEvents:"none",left:W/2+(effects.backgroundPanel.Position?.X??0)*k-(effects.backgroundPanel.Size?.X??1280)*k/2,top:H/2-(effects.backgroundPanel.Position?.Y??0)*k-(effects.backgroundPanel.Size?.Y??720)*k/2,width:(effects.backgroundPanel.Size?.X??1280)*k,height:(effects.backgroundPanel.Size?.Y??720)*k,background:panelColor(effects.backgroundPanel),zIndex:bgOrder.P_Bg_00,...paneStyle(effects.backgroundPanel)}}/>}
        {view === "lock" && (
          <div className="dht-switch-lock" style={{ position: "absolute", inset: 0, zIndex: 20, color: ink, textShadow: dark ? "0 1px 6px #000a" : "none", fontFamily: "inherit" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${parts.background})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.38, textAlign: "center", fontSize: 96, fontWeight: 300 }}>{clock24h(now)}</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: H * 0.08, textAlign: "center", fontSize: 20 }}>Press any button</div>
          </div>
        )}
        {effects.libraryLine&&<div className="dht-switch-library-line" style={{position:"absolute",left:30*k,right:30*k,bottom:72*k,height:k,background:panelColor(effects.libraryLine),...effectStyle(effects.libraryLine)}}/>}
        {effects.libraryBar&&<div className="dht-switch-library-bar" style={{position:"absolute",right:20*k,top:100*k,bottom:100*k,width:4*k,background:panelColor(effects.libraryBar),...effectStyle(effects.libraryBar)}}/>}
        {(view==="apps"||grid)&&effects.scrollIndicatorRoot&&<div className="dht-switch-scroll-indicator" style={{position:"absolute",left:(640+(effects.scrollIndicatorRoot.Position?.X??625))*k,top:(360-(effects.scrollIndicatorRoot.Position?.Y??-8)-277)*k,width:4*k,height:554*k,...effectStyle({...effects.scrollIndicatorRoot,Position:undefined})}}><div style={{position:"absolute",top:`${n>1?cur/(n-1)*80:0}%`,width:4*k,height:Math.max(12,554/Math.max(1,n))*k,background:panelColor(effects.scrollIndicator),...effectStyle(effects.scrollIndicator)}}/></div>}
        <div ref={sceneRef} className="dht-switch-scene" onPointerDown={event=>{
          if(!event.isPrimary||event.button!==0)return;
          const area=panes.N_ScrollArea,r=event.currentTarget.getBoundingClientRect(),x=(event.clientX-r.left)/k-640,y=360-(event.clientY-r.top)/k;
          const inside=area?.Visible!==false&&Math.abs(x-(area?.Position?.X??0))<=(area?.Size?.X??1280)*Math.abs(area?.Scale?.X??1)/2&&Math.abs(y-(area?.Position?.Y??0))<=(area?.Size?.Y??720)*Math.abs(area?.Scale?.Y??1)/2;
          swipe.current={x:event.clientX,y:event.clientY,pointerId:event.pointerId,active:inside&&view==="home",dragged:false};
        }} onPointerMove={event=>{
          const start=swipe.current;if(!start?.active||start.pointerId!==event.pointerId)return;
          if((event.buttons&1)===0){endSwipe();return;}
          if(start.dragged||Math.abs(event.clientX-start.x)<45*k)return;
          if(Math.abs(event.clientX-start.x)<Math.abs(event.clientY-start.y))return;
          start.dragged=true;setSel(clamp(cur+(event.clientX<start.x?1:-1),0,n));setRow("tiles");
        }} onPointerUp={endSwipe} onPointerLeave={endSwipe} onLostPointerCapture={endSwipe} onPointerCancel={()=>{swipe.current=null;setPointerPressed(false);}} data-scroll-enabled={panes.N_ScrollArea?.Visible!==false} style={{position:"absolute",inset:0,transformOrigin:"center",zIndex:3,...effectStyle(panes.N_Root)}}>

        {conversion?.childLockBackingBehindGames&&childLockLayer}
        <div className="dht-switch-status" style={{ zIndex:Math.min(order.N_MyPage,order.L_Hud),position: "absolute", top: 34 * k, left: 60 * k, right: 50 * k, display: "flex", alignItems: "center", gap: 24 * k, color: ink, fontSize: 26 * k, textShadow: dark ? "0 1px 4px #0008" : "none",pointerEvents:"none" }}>
          <div className="dht-switch-profile-group" style={panes.N_MyPage?{position:"absolute",left:(640+(panes.N_MyPage.Position?.X??0)-(panes.N_MyPage.Size?.X??60)/2)*k-60*k,top:H/2-((panes.N_MyPage.Position?.Y??0)+(panes.N_MyPage.Size?.Y??60)/2)*k-34*k,width:(panes.N_MyPage.Size?.X??60)*k,height:(panes.N_MyPage.Size?.Y??60)*k,transformOrigin:"center",zIndex:order.N_MyPage,pointerEvents:"auto",...paneStyle(panes.N_MyPage)}:{display:"contents"}}>
          {conversion?<div style={{position:"absolute",left:`calc(50% + ${(panes.L_BtnAccount_00?.Position?.X??0)*k}px)`,top:`calc(50% - ${(panes.L_BtnAccount_00?.Position?.Y??0)*k}px)`,width:0,height:0,transform:`scale(${(panes.L_BtnAccount_00?.Scale?.X??1)*k},${(panes.L_BtnAccount_00?.Scale?.Y??1)*k})`,display:panes.L_BtnAccount_00?.Visible===false?"none":undefined}}><SwitchProfile effects={effects} animations={conversion.animations} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} label={api.user} onActivate={userOptions}/></div>:<div className="dht-switch-profile" onClick={userOptions} style={{width:60*k,height:60*k,borderRadius:"50%"}}><ProfileAvatar size={56*k} fallback={<Icon name="user" size={34*k} color={ink}/>}/></div>}
          </div>
          <span style={{ fontSize: 20 * k, opacity: 0.8, display:panes.N_MyPage?"none":undefined }}>{api.user}</span><span style={{ flex: 1 }} />
          <div className="dht-switch-hud" style={{zIndex:order.L_Hud,pointerEvents:"auto",display:"flex",alignItems:"center",gap:24*k,...(panes.L_Hud?{position:"absolute",left:(640+(panes.L_Hud.Position?.X??0)+(conversion?0:(effects.hudRoot?.Position?.X??0)*(panes.L_Hud.Scale?.X??1)-270))*k-60*k,top:H/2-((panes.L_Hud.Position?.Y??0)+(conversion?0:(effects.hudRoot?.Position?.Y??0)*(panes.L_Hud.Scale?.Y??1)))*k-34*k,transformOrigin:"0 0",...paneStyle(panes.L_Hud)}:{})}}>
          {conversion?<SwitchHudTree effects={effects} animations={conversion.animations} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} open={menu.isOpen} now={now} level={bat?.level??1} charging={!!bat?.charging} hour12={themeStyle<string>(s,"switch","clockFormat")==="12"} scale={1} instanceSize={panes.L_Hud?.Size?[panes.L_Hud.Size.X??0,panes.L_Hud.Size.Y??0]:undefined}/>:<>
          <span className="dht-switch-clock" style={{ fontFamily: CLOCK_FONT, fontWeight: 600, fontSize: 29 * k, fontVariantNumeric: "tabular-nums", letterSpacing: 2, display: "inline-block", transform: "scaleX(0.84)", transformOrigin: "right center", marginLeft: -6 * k }}><SwitchClock now={now} effects={effects} scale={k} hour12={themeStyle<string>(s,"switch","clockFormat")==="12"}/></span>
          <SwitchNetwork effects={effects} size={34*k} color={ink}/>
          {bat && <><span className="dht-switch-battery-text" style={{ fontSize: 24 * k, ...effectStyle(effects.batteryText) }}><SwitchNumber level={bat.level} effects={effects} scale={k} animation={undefined}/></span><span className="dht-switch-battery" style={effectStyle(effects.batteryIcon)}><SwitchBattery level={bat.level} charging={bat.charging} color={nxColor(effects.batteryGauge?.corners?.ColorTL,ink)} w={42 * k} effects={effects}/></span></>}
          </>}
          </div>
        </div>
        {conversion?<SwitchFooter effects={effects} animations={conversion.animations} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} open={!!launch||menu.isOpen} pressed={pressed||pointerPressed} scale={k} height={H} view={view} controller={<ConsoleGlyph w={80} color="white"/>}/>:<>        <div ref={footerRef} className="dht-switch-footer" style={{ zIndex:4,position: "absolute", left: 30 * k, right: 30 * k, bottom: 0, height: 72 * k, borderTop: effects.footerLine?.Visible===false||effects.footerLineRoot?.Visible===false ? "none" : `1.5px solid ${dark ? "#fffb" : "#555"}`, color: ink, display: effects.footer?.Visible===false?"none":"flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${30 * k}px`, fontSize: 24 * k, textShadow: dark ? "0 1px 4px #0008" : "none", pointerEvents: "none",...effectStyle(effects.footer) }}>
          <SwitchFooterController effects={effects} animations={[]} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn}><ConsoleGlyph w={68 * k} color={ink} /></SwitchFooterController>
          <span style={{ display: "flex", gap: 36 * k, marginLeft:"auto",position:"relative" }}>{(pressed||pointerPressed)&&effects.footerTouch&&<span style={{position:"absolute",inset:0,background:panelColor(effects.footerTouch),...effectStyle(effects.footerTouch)}}/>}
            <span style={{ display: "flex", alignItems: "center", gap: 10 * k }}><SwitchFooterKey effect={effects.footerKey}><SwitchPromptGlyph symbol="+" size={28*k} ink={nxColor(effects.footerText?.white,ink)} symbolColor={dark?"#000":"#e8e8e8"}/></SwitchFooterKey><span style={effectStyle(effects["footer:T_00"])}>Options</span></span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 * k }}><SwitchFooterKey effect={effects.footerKey}><SwitchPromptGlyph symbol="A" size={28*k} ink={nxColor(effects.footerText?.white,ink)} symbolColor={dark?"#000":"#e8e8e8"}/></SwitchFooterKey><span style={effectStyle(effects["footer:T_01"])}>{view === "home" ? "Start" : "Open"}</span></span>
          </span>
        </div></>}


        {view === "apps" ? (!conversion?<SwitchLibrary games={games} selected={asel} entering={libraryEntering} width={W} height={H} onActivate={index=>{setLibraryEntering(false);setAsel(index);activateGame(games[index]);}}/>:
          <div className="dht-switch-apps" data-entering={libraryEntering} style={{ position: "absolute", left: 90, right: 90, top: H * 0.16, bottom: 40, display: "grid", gridTemplateColumns: `repeat(${COLS},1fr)`, gap: 18, alignContent: "start", overflowY: "hidden" }}>
            {games.slice(Math.floor(asel / COLS) * COLS, Math.floor(asel / COLS) * COLS + COLS * 4).map((gm, i) => {
              const idx = Math.floor(asel / COLS) * COLS + i, on = idx === asel;
              return <div key={gm.appid} className="dht-switch-tile" data-selected={on} data-name={gm.name} onClick={() => { setLibraryEntering(false);setAsel(idx); activateGame(gm); }} style={{animationDelay:libraryEntering?`${Math.floor(i/COLS)*70+(i%COLS)*40}ms`:undefined, aspectRatio: "1", position: "relative", overflow: "hidden", background: "#222" }}>
                <GameArt g={gm} kind="portrait" position="50% 22%" style={{ width: "100%", height: "100%" }} />
                {on && <div className="dht-switch-focus" style={{ position: "absolute", inset: 0 }} />}
              </div>;
            })}
          </div>
        ) : <>
          <div ref={refreshRef} className="dht-switch-game-stack" style={{position:"absolute",left:gameCenterX-gameBounds.width/2,top:centerY-gameBounds.height/2,width:gameBounds.width,height:gameBounds.height,transformOrigin:'50% 50%',zIndex:order.N_GameRoot??0,pointerEvents:"none"}}>
          <div className={conversion?"dht-switch-game-canvas":"dht-switch-game-canvas dht-switch-standard-track"} style={{transform:conversion?undefined:`translate3d(${-scroll}px,0,0)`,position:'absolute',left:gameBounds.width/2-gameCenterX,top:gameBounds.height/2-centerY,width:W,height:H}}>
          {Array.from({ length: n + 1 }, (_, i) => i).filter((i) => fixedSlots ? (i===n?(!grid||!!launcherSlot?.Position)&&launcherSlot?.Visible!==false:i>=pageStart&&i<pageStart+pageSize&&i<n) : (i===n&&explicitSlots || i >= cur - 4 && i <= cur + 8) && slotFor(i)?.Visible!==false).map((i) => {
            const hit=i===n?effects.allSoftwareHit:effects.gameHit;
            const on = i === cur, dim=dimensions(i), artRadius=(effects.gameArt?.radius??0)*dim.width/(iconPane?.Size?.X??262), size = dim.width, height = dim.height, game = games[i];
            const download=game?downloads.byApp.get(game.appid):undefined;
            const downloadProgress=download?(download.completed?undefined:Math.max(0,download.progress)*100):game?.overview?.percent_downloaded>0&&game.overview.percent_downloaded<100?game.overview.percent_downloaded:undefined;
            return <div key={i < n ? game.appid : "all"} className="dht-switch-tile" data-selected={on && row === "tiles"} data-name={label(i)}
              onPointerDown={()=>setPointerPressed(true)} onPointerUp={()=>setPointerPressed(false)} onPointerCancel={()=>setPointerPressed(false)} onPointerLeave={()=>setPointerPressed(false)} onClick={() => { if(swipe.current?.dragged){swipe.current=null;return;} setRow("tiles"); if (on) { if (game) activateGame(game); else openLibrary(); } else { setSel(i); playSound("move"); } }}
              style={{ position: "absolute", left: tileX(i)+(conversion?0:scroll), top: tileTop(i), width: size, height, transform:!conversion&&on&&row==="tiles"?`scale(${276/262})`:undefined, ...paneStyle(panes["game:RootPane"]?.Rotation ? {Rotation:panes["game:RootPane"].Rotation}:undefined), transition: conversion?"left 160ms ease-out, width 140ms, height 140ms, top 140ms":"transform 180ms cubic-bezier(.22,1,.36,1)", background: game||conversion ? "transparent" : dark?"#383838":"linear-gradient(145deg,#f5f5f5,#cfcfcf)", overflow: conversion||hit?"visible":"hidden",pointerEvents:hit?"none":"auto",borderRadius:game?artRadius:"50%",zIndex:on&&row==="tiles"?1:0 }}>
              {game&&conversion ? <SwitchGameMotion animations={conversion.animations} effects={effects} nativePanes={conversion.nativePanes} nativeAnimations={conversion.nativeAnimations} nativeMaterials={conversion.nativeMaterials} modern={!!panes.L_BtnSplay} dark={dark} active={on&&row==="tiles"} enabled={animationOn} unitX={size/(iconPane?.Size?.X??256)} unitY={height/(iconPane?.Size?.Y??256)} touch={pointerPressed||pressed} running={!!game.overview?.running} launching={!!launch&&on} downloadProgress={downloadProgress} installable={!game.installed}
                focus={<SwitchNativeFocus effects={effects} modern={!!panes.L_BtnSplay} dark={dark} width={effects.gameFocus?.Size?.X??iconPane?.Size?.X??256} height={effects.gameFocus?.Size?.Y??iconPane?.Size?.Y??256}/>}
              >
                <GameArt g={game} kind={size>height*1.1?"landscape":"portrait"} position="50% 22%" style={{width:"100%",height:"100%"}}/>
              </SwitchGameMotion> : <div style={{width:"100%",height:"100%",overflow:conversion?"visible":"hidden",borderRadius:game?artRadius:"50%"}}>
                {game?<GameArt g={game} kind="portrait" position="50% 22%" style={{width:"100%",height:"100%"}}/>:conversion?<SwitchMotionPane animations={conversion.animations} pane="scenePane:L_BtnFlc" events={resume>0?["resume"]:[]} playbackKey={resume} enabled={animationOn} relativePosition effect={{Position:effects.allSoftwareRoot?.Position}}><SwitchLauncherTree effects={effects} animations={conversion.animations} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} active={on&&row==="tiles"} pressed={pressed||pointerPressed} size={size} height={height} onActivate={openLibrary}/></SwitchMotionPane>:<SwitchLauncher effects={effects} size={size} dark={dark}/> }
              </div>}
              {conversion&&game&&on&&row==="tiles"&&showTitle(s,"switch",true)&&<SwitchGameTitle conversion={conversion} effects={effects} title={game.name} running={!!game.overview?.running} dark={dark} modern={!!panes.L_BtnSplay} enabled={animationOn} unitX={size/(iconPane?.Size?.X??256)} unitY={height/(iconPane?.Size?.Y??256)}/>}
              {hit&&hit.Visible!==false&&<SwitchMotionPane relativePosition className="dht-switch-hit" animations={conversion?.animations??[]} pane="gameHit" events={[on&&row==="tiles"?"active":"inactive"]} enabled={animationOn} effect={hit} unitX={dim.width/(iconPane?.Size?.X??256)} unitY={dim.height/(iconPane?.Size?.Y??256)} style={{position:"absolute",pointerEvents:"auto",left:`calc(50% + ${(hit.Position?.X??0)*dim.width/(iconPane?.Size?.X??256)}px)`,top:`calc(50% - ${(hit.Position?.Y??0)*dim.height/(iconPane?.Size?.Y??256)}px)`,width:(hit.Size?.X??264)*(hit.Scale?.X??1)*dim.width/(iconPane?.Size?.X??256),height:(hit.Size?.Y??264)*(hit.Scale?.Y??1)*dim.height/(iconPane?.Size?.Y??256),translate:"-50% -50%",transform:`rotate(${-(hit.Rotation?.Z??0)}deg)`,right:"auto",bottom:"auto"}}/>}
              {!game && on && row === "tiles" && (pressed||pointerPressed) && <div className="dht-switch-decide" style={{position:"absolute",inset:0,background:"#fff3",...effectStyle(effects.gameDecideEffect),...effectStyle({...effects[pointerPressed?"gameTouch":"gameDecide"],radius:(effects[pointerPressed?"gameTouch":"gameDecide"]?.radius??0)*dim.width/(iconPane?.Size?.X??256)})}}/>}
              {!conversion&&on&&row==="tiles"&&effects.gameInnerCursor?.Visible!==false&&effects.gameInnerCursor&&<div className="dht-switch-inner-cursor" style={{position:"absolute",inset:4,border:"1px solid #fff6",pointerEvents:"none",...effectStyle({...effects.gameInnerCursor,radius:(effects.gameInnerCursor.radius??0)*dim.width/256})}}/>}
              {!conversion&&on&&row==="tiles"&&<AnimatedGameLayer animations={[]} pane="gameFocus" event="focus" active={animationOn} style={{zIndex:3}}/>}
              {!conversion&&on&&pointerPressed&&<AnimatedGameLayer animations={[]} pane="gameTouch" event="touch" active={animationOn} style={{zIndex:4,background:"#fff3"}}/>}
              {!conversion&&game?.overview?.running&&<AnimatedGameLayer animations={[]} pane="gameSuspend" event="running" active={animationOn} style={{zIndex:5,inset:undefined,bottom:8,left:8,color:ink,...effectStyle(effects.gameSuspend)}}>Playing</AnimatedGameLayer>}
            </div>;
          })}
          </div></div>
          <div className="dht-switch-balloon-root" style={{position:"absolute",pointerEvents:"none",inset:0,zIndex:order.N_Balloon,...effectStyle(effects.balloonRoot)}}>
          <div style={{position:"absolute",inset:0,...effectStyle(effects.gameTitleRoot)}}>
          <div className="dht-switch-title" style={{ position: "absolute", left: conversion?startX-28*k:tileX(cur)-(F-T)/2, top: tileY - (F - T) / 2 - 56 * k, width: conversion?W-2*startX:Math.max(0,W-tileX(cur)-24*k), transition:conversion?undefined:"left 280ms cubic-bezier(.22,1,.36,1),opacity 140ms", opacity:!conversion&&row!=="tiles"?0:1, display: "flex", alignItems: "center", gap: 12 * k, fontSize: 26 * k, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textShadow: dark ? "0 1px 5px #000a" : "none",...effectStyle(effects.gameTitle),color:nxColor(effects.gameTitleText?.corners?.ColorTR,parts.background?ink:"var(--dht-switch-title, #19bcc4)"),...(effects.gameTitle?.Size?.X?{width:effects.gameTitle.Size.X*k}:{}),...(conversion&&!rotatedTitle?{left:tileX(cur),width:T,justifyContent:"center"}:{}),...titlePosition,...(conversion||effects.gameTooltip?.Visible===false?{display:"none"}:{}) }}>
            <span style={{ display:conversion?"none":undefined, width: 20 * k, height: 26 * k, background: "currentColor", borderRadius: 3, flex: "none", clipPath: "polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)" }} />
            {effects["gameTitle:P_Card"]&&<span style={effectStyle(effects.gameCardRoot)}><span className="dht-switch-title-card" style={{width:12*k,height:18*k,background:"currentColor",...effectStyle(effects["gameTitle:P_Card"])}}/></span>}
            {effects["gameTitle:P_Reset"]&&<span className="dht-switch-title-reset" style={{width:8*k,height:8*k,borderRadius:"50%",background:"currentColor",...effectStyle(effects["gameTitle:P_Reset"])}}/>}
            <span key={conversion?"native":cur} className={conversion?undefined:"dht-switch-standard-caption"} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{!g || showTitle(s, "switch", true) ? label(cur) : ""}</span>{g?.overview?.running&&<span className="dht-switch-title-sub" style={effectStyle(effects["gameTitle:T_Sub"])}>Playing</span>}
          </div>
          </div>
          {!conversion?.childLockBackingBehindGames&&childLockLayer}
          {effects.changeUser?.Visible!==false&&conversion&&effects.changeUser&&g?.overview?.running&&row==="tiles"&&<div className="dht-switch-change-user" style={{position:"absolute",left:tileX(cur)+T/2+(effects.changeUser.Position?.X??0)*k,top:tileTop(cur)+tileHeight/2-(effects.changeUser.Position?.Y??-159)*k,width:(effects.changeUser.Size?.X??384)*k,height:(effects.changeUser.Size?.Y??34)*k,transformOrigin:"0 0",background:"transparent",color:ink,border:0,...effectStyle({...effects.changeUser,Position:undefined})}}><SwitchServiceScene file="RdtBtnChangeUser" size={[effects.changeUser.Size?.X??384,effects.changeUser.Size?.Y??34]} effects={effects} animations={conversion.animations} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} label="User options" pressed={pressed||pointerPressed} onActivate={userOptions}/></div>}
          {n === 0 && (conversion?<SwitchEmptyLibrary effects={effects} animations={conversion.animations} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} scale={k}/>:<div style={{position:"absolute",left:startX,top:H*.62,color:ink,opacity:.7,fontSize:18}}>No games found for the selected library view.</div>)}
          </div>
          <div className="dht-switch-dock" style={{zIndex:order.N_System,position: "absolute", left: 0, right: 0, top: panes.N_System ? (panes.N_System.Size?H/2-(panes.N_System.Position?.Y??0)*k-(panes.N_System.Size.Y??80)*k/2:0) : dockY,...(panes.N_System?.Size?{left:(640+(panes.N_System.Position?.X??0)-(panes.N_System.Size.X??1160)/2)*k,right:undefined,width:(panes.N_System.Size.X??1160)*k,height:(panes.N_System.Size.Y??80)*k}:{}), display: "flex", justifyContent: "center", gap: 20 * k }}>
            {dock.map((d, i) => {
              const on = row === "dock" && i === dsel, art = parts.icons[d.art??d.id];
              const dockPane = panes[({news:"L_BtnNoti",shop:"L_BtnShop",album:"L_BtnPvr",controller:"L_BtnCtrl",settings:"L_BtnSet",power:"L_BtnPow",online:"L_BtnLR",gameShare:"L_BtnSplay",virtualCards:"L_BtnVgc"} as Record<string,string>)[d.art??d.id]];
              const convertedDock = panes.N_System;
              const bounds=convertedDock?.Size;
              const buttonWidth=(dockPane?.Size?.X??80)*k,buttonHeight=(dockPane?.Size?.Y??80)*k;
              const baseEffect=effects[`dock:${d.art??d.id}:base`];
              const dockStyle: CSSProperties = convertedDock ? {position:"absolute",left:(bounds?(bounds.X??1160)*k/2:(640+(convertedDock.Position?.X??0))*k)+(dockPane?.Position?.X??0)*(convertedDock.Scale?.X??1)*k-buttonWidth/2,top:(bounds?(bounds.Y??80)*k/2:H/2-(convertedDock.Position?.Y??0)*k)-(dockPane?.Position?.Y??0)*(convertedDock.Scale?.Y??1)*k-buttonHeight/2,...paneStyle({...dockPane,Scale:{X:(convertedDock.Scale?.X??1)*(dockPane?.Scale?.X??1),Y:(convertedDock.Scale?.Y??1)*(dockPane?.Scale?.Y??1)}})} : paneStyle(dockPane);
              return <SwitchMotionPane key={d.id} pane={`scenePane:${dockKeys[d.id]}`} animations={conversion?.animations??[]} events={['appletLayout',...(resume>0?["resume"]:[])]} playbackKey={resume} enabled={animationOn} relativePosition unitX={(convertedDock?.Scale?.X??1)*k} unitY={(convertedDock?.Scale?.Y??1)*k} effect={{...dockPane,Scale:{X:(convertedDock?.Scale?.X??1)*(dockPane?.Scale?.X??1),Y:(convertedDock?.Scale?.Y??1)*(dockPane?.Scale?.Y??1)}}} className="dht-switch-dock-item" data-selected={on} data-name={d.label} onPointerDown={()=>setPointerPressed(true)} onPointerUp={()=>setPointerPressed(false)} onPointerCancel={()=>setPointerPressed(false)} onPointerLeave={()=>setPointerPressed(false)} onClick={() => { setRow("dock"); setDsel(i); runDock(i); }} style={{ position:convertedDock?"absolute":"relative",inset:convertedDock?undefined:"auto",display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: convertedDock?buttonWidth:88*k,height:convertedDock?buttonHeight:undefined,justifyContent:convertedDock?"center":undefined,zIndex:order[dockKeys[d.id]], ...dockStyle }}>
                {conversion?<SwitchAppletTree id={d.id} label={d.label} art={art} effects={effects} animations={conversion.animations} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} active={on} pressed={on&&(pressed||pointerPressed)} scale={k} onActivate={()=>{setRow("dock");setDsel(i);runDock(i);}}/>:<>
                <div className="dht-switch-dock-base" style={{ position:"relative",boxSizing:"border-box",flexShrink:0,width: 80 * k, height: 80 * k, borderRadius: "50%", background: baseEffect?.Visible===false ? "transparent" : conversion ? panelColor(resolvePalette({...baseEffect,palette:baseEffect?.palette??{white:[31,0]}},dark)) : dark ? "#383838" : "#fff", border: conversion||baseEffect?.Visible===false ? "none" : `1.5px solid ${dark ? "#ffffff18" : "#d2d2d2"}`, display: "flex", alignItems: "center", justifyContent: "center", transform: on ? "scale(1.12)" : "none", transition: "transform 180ms cubic-bezier(.22,1,.36,1)" }}>
                  {on&&d.id==="album"&&effects["dock:album:cursor"]&&<span style={{position:"absolute",inset:0,pointerEvents:"none",...effectStyle(effects["dock:album:cursor"])}}/>}
                  {on&&effects[`dock:${d.id}:focus`]&&<span className="dht-switch-applet-effect" style={{position:"absolute",inset:0,borderRadius:"inherit",background:panelColor(effects[`dock:${d.id}:focus`]),...effectStyle(effects[`dock:${d.id}:focus`]),pointerEvents:"none"}}/>}
                  {on&&(pressed||pointerPressed)&&effects[`dock:${d.id}:${pointerPressed?"touch":"decide"}`]&&<span className="dht-switch-applet-press" style={{position:"absolute",inset:0,borderRadius:"inherit",background:panelColor(effects[`dock:${d.id}:${pointerPressed?"touch":"decide"}`]),...effectStyle(effects[`dock:${d.id}:${pointerPressed?"touch":"decide"}`]),pointerEvents:"none"}}/>}
                  <SwitchMaterial effect={effects[`dock:${d.id}:color`]}><SwitchMaterial effect={resolvePalette(rawEffects[`dock:${d.art??d.id}`],dark,on)}>{art ? <img src={art} alt="" style={{ width: 44, height: 38, objectFit: "contain" }} /> : (["settings","power","online","gameShare","virtualCards"].includes(d.id) ? <Icon name={d.icon} size={36 * k} color={dark ? "#fff" : DOCK_COLOR[d.id] ?? "#666"} /> : <DockGlyph id={d.id} size={40 * k} color={dark ? "#fff" : DOCK_COLOR[d.id] ?? "#666"} />)}</SwitchMaterial></SwitchMaterial>
                </div>
                <span style={{ ...(convertedDock?{position:"absolute",top:"100%"}:{}),color: ink, fontSize: 14*k, transition:"opacity 140ms", opacity: on ? 1 : 0, ...effectStyle(effects.dockLabel),...effectStyle(effects[`dock:${d.id}:label`]), textShadow: dark ? "0 1px 4px #000a" : "none" }}>{d.label}</span>
                </>}
              </SwitchMotionPane>;
            })}
          </div>
          {!conversion&&<div className="dht-switch-standard-focus" data-focus-row={row} style={standardFocus}><div className="dht-switch-focus" style={{position:"absolute",inset:0,borderRadius:"inherit"}}/></div>}
        </>}
        </div>
        {controllerNotice&&effects.controllerBalloon?.Visible!==false&&<div className="dht-switch-controller-notice" role="status" style={{position:"absolute",width:240*k,height:150*k,zIndex:25,left:(640+(effects.controllerBalloon?.Position?.X??-548))*k,top:H/2-(effects.controllerBalloon?.Position?.Y??-284)*k,color:ink,transform:`scale(${k})`,...effectStyle({...effects.controllerBalloon,Position:undefined})}}><SwitchControllerNotice effects={effects} animations={conversion?.animations??[]} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} text={controllerNotice}/></div>}
        </div>
        {conversion&&<SwitchAppletCapture frame={capturedFrame} onComplete={()=>setCapturedFrame(undefined)} scale={k} {...dialogShared} enabled={s.animations}/>}
        <SwitchMenu effects={effects} animations={conversion?.animations??[]} modern={!!panes.L_BtnSplay} dark={dark} enabled={animationOn} game={g} menu={menu} variant="switch" appearance={{header:<div className="dht-switch-menu-header" style={{display:"flex",alignItems:"center",gap:12}}>{g&&<div style={{width:72,height:72,...effectStyle(effects.menuGameIcon)}}><SwitchMaterial effect={effects.menuGameArt}><GameArt g={g} kind="portrait" style={{width:"100%",height:"100%"}}/></SwitchMaterial></div>}<span style={effectStyle(effects.menuUserIcon)}><ProfileAvatar size={40}/></span></div>,selectedItem:!conversion?{color:ink,background:dark?"#ffffff12":"#00000008"}:effects.menuSelected?{background:panelColor(effects.menuSelected),...effectStyle(effects.menuSelected)}:undefined,touchItem:effects.menuTouch?{background:panelColor(effects.menuTouch),...effectStyle(effects.menuTouch)}:undefined,text:{...(!conversion?{color:ink}:{}),...effectStyle(effects.menuText)},optionBase:effects.menuOptionBase?{background:panelColor(effects.menuOptionBase),...effectStyle(effects.menuOptionBase)}:undefined,bottomShadow:effects.menuBottomShadow?{background:panelColor(effects.menuBottomShadow),...effectStyle(effects.menuBottomShadow)}:undefined,capture:effects.menuCapture?{background:panelColor(effects.menuCapture),...effectStyle(effects.menuCapture)}:undefined,mask:effects.menuMask?{background:panelColor(effects.menuMask),...effectStyle(effects.menuMask)}:undefined,bottom:effects.menuBottom?{background:panelColor(effects.menuBottom),...effectStyle(effects.menuBottom)}:undefined,bottomMask:effects.menuBottomMask?{background:panelColor(effects.menuBottomMask),...effectStyle(effects.menuBottomMask)}:undefined,decoration:effects.menuAccount&&<div className="dht-switch-menu-account" style={{position:"absolute",left:"50%",top:"50%",width:(effects.menuAccount.Size?.X??56)*k,height:(effects.menuAccount.Size?.Y??56)*k,...effectStyle(effects.menuAccount)}}><ProfileAvatar size={56*k}/></div>,backdrop:effects.menuBackdrop?{background:panelColor(effects.menuBackdrop),...effectStyle(effects.menuBackdrop)}:undefined,panel:!conversion?{color:ink}:effects.menuPanel?{background:panelColor(effects.menuPanel),...effectStyle(effects.menuPanel)}:undefined,item:!conversion?{color:ink}:effects.menuButton?{background:panelColor(effects.menuButton),...effectStyle(effects.menuButton),...(effects.menuLineBase?.Visible===false?{background:"transparent"}:{})}:effects.menuLineBase?.Visible===false?{background:"transparent"}:undefined}}/>
      </Stage></SwitchNativeContext.Provider>
    </ThemeRoot>
  );
}
