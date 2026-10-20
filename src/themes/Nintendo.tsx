
import { t } from "../i18n";
import {plazaPostInterval} from "./plazaPostTiming";
import {WallpaperVideo} from "../WallpaperMedia";
import {PersonalMiiCreator,miiPortraitUrl} from "./PersonalMii";
import {customProfilePicture} from "../profilePicture";
import {CSSProperties,useEffect,useMemo,useRef,useState} from "react";
import {GameArt,Icon,IconName,MenuView,themeMenu,useHome,useMenu} from "../common";
import {Press,Stage,ThemeRoot,useStage} from "../input";
import {Game,openAchievements,openGamePage,openSteam} from "../library";
import {fmtTime,playSound,useClock,useSteamStatus,userName,useWallpaper} from "../steam";
import {useFriends,useNotices} from "../activity";
import {WiiuDetail,WiiuNotifyBanners,WiiuNotifyBell} from "./wiiuPlazaActivity";
import {buildFeed} from "./wiiuPlazaFeed";
import {useAssets} from "../assets";
import {WaraWaraPlaza,PLAZA_SPOTS} from "./WaraWaraPlaza";
import {themeFx,updateSettings} from "../settings";
import {NINTENDO_CSS} from "./nintendoStyles";
import {WII_CSS} from "./wiiStyles";
import {setStyle,styleOf} from "../engine/themeStyles";
import {useReportFocus} from "../focus";
import {WiiClock,wiiDate} from "./wiiClock";
import {useWiiLook} from "../skins";
import {listWiiuThemes,useWiiuSkin,wiiuArt,wiiuFxKey,wiiuProblem} from "../wiiuThemes";
import {DockGlyph,DOCK_CSS,analyseDockArt,analyseTone,useAnalysed} from "./wiiuDock";
// Backgrounds from a Wii U custom theme: its Plaza sky behind the software grid, its Plaza floor
// behind the Plaza (the 3D floor stays translucent over it, as on the console).
// Words over a theme wallpaper turn white only when the wallpaper is dark (data-theme-tone, read from the picture).
const CUSTOM_THEME_CSS=`.nt-wiiu[data-theme-bg=true]{background:var(--nt-theme-bg) center/cover}.nt-wiiu[data-theme-bg=true]:before{display:none}.nt-wiiu[data-theme-bg=true]:not([data-theme-tone=light]) :is(.nt-wordmark,.nt-dock button span,.nt-user,.nt-user>button,.nt-selected-name,.nt-home-hint){color:#fff;text-shadow:0 1px 3px #000a}
.nt-wiiu[data-plaza=true][data-theme-floor=true]{background:var(--nt-theme-floor) center/cover}.nt-wiiu[data-theme-floor=true] .nt-plaza{background:transparent}.nt-wiiu[data-plaza=true][data-theme-floor=true] .nt-plaza:after{display:none}
/* Pictures from a Wii U theme file: page arrows, dock icons, profile frame / network mark, boot splash (each falls back to the built-in drawing when the slot is empty). */
.nt-profile-image{position:relative;overflow:visible}.nt-profile-image>img:first-child{border-radius:6px}.nt-profile-image>.nt-profile-frame{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none}.nt-profile-image>.nt-network-mark{position:absolute;right:-10px;top:-9px;width:36px;height:34px;object-fit:contain;pointer-events:none}
.nt-wiiu[data-theme-frame=true] .nt-profile-image{border-color:transparent;background:none;box-shadow:none}.nt-wiiu[data-theme-frame=true] .nt-profile-image>img:first-child{width:calc(100% - 14px);height:calc(100% - 14px);margin:auto}
.nt-wiiu[data-theme-arrows=true][data-plaza=false] .nt-arrow{width:110px;height:200px;top:calc(var(--wy) + 258px);left:23px;padding:0;font-size:0!important;text-shadow:none;background:none;clip-path:none}.nt-wiiu[data-theme-arrows=true][data-plaza=false] .nt-next{left:auto;right:23px}.nt-wiiu[data-theme-arrows=true] .nt-arrow>img{display:block;width:100%;height:100%;object-fit:contain}
.nt-boot[data-splash=true]{background:#000}.nt-boot-splash{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.nt-boot[data-splash=true] :is(.nt-boot-logo,.nt-boot-shapes){display:none}`;
// Dock entries a Wii U custom theme can restyle (its HOME Menu icons: HBMIconL_005 is the Friend List smiley,
// 003 the notifications bubble); the others (Library, Settings) are drawn in the theme's manner by wiiuDock.tsx.
// (icon-friends is Miiverse and icon-tvii Nintendo TVii: no counterpart here. icon-mii also stands in for a missing profile picture.)
const DOCK_ART:Record<string,string>={friends:"icon-mii",store:"icon-shop",browser:"icon-browser",notifications:"icon-messages",downloads:"downloads"};
// The theme pictures whose drawing decides the look of the buttons the theme has no picture for (first one found).
const LOOK_ART=["icon-shop","icon-browser","icon-mii","icon-messages","icon-friends","downloads"];

type ServiceItem = { name: string; icon: IconName; place: "library" | "friends" | "store" | "browser" | "notifications" | "downloads" | "settings"; color: string };
const servicesList = (): ServiceItem[] => [
  { name: t("destLibrary"), icon: "disc", place: "library", color: "#53add4" },
  { name: t("destFriends"), icon: "friends", place: "friends", color: "#ed9235" },
  { name: t("shop"), icon: "store", place: "store", color: "#efa121" },
  { name: t("destBrowser"), icon: "network", place: "browser", color: "#429adc" },
  // The Wii U dock's notifications bubble (the Wii's channel grid only takes the first four entries).
  { name: t("destNotifications"), icon: "bell", place: "notifications", color: "#17bfd4" },
  { name: t("destDownloads"), icon: "download", place: "downloads", color: "#71ad49" },
  { name: t("destSettings"), icon: "gear", place: "settings", color: "#939ba1" },
];
const SERVICES: ServiceItem[] = new Proxy([] as any, {
  get: (_, prop: string) => {
    const list = servicesList();
    if (prop === "length") return list.length;
    if (prop === "map") return list.map.bind(list);
    if (prop === "filter") return list.filter.bind(list);
    if (prop === "slice") return list.slice.bind(list);
    if (prop === "some") return list.some.bind(list);
    return (list as any)[prop];
  },
});
type Tile = { game?: Game; service?: ServiceItem };
// The boot logo plays once per session, the first time the Wii U menu appears.
let wiiuBooted=false;
// Activating the Wii U from the Hub plays its logo once more (the generic reveal would hide it).
export const resetWiiuBoot=()=>{wiiuBooted=false;};
// Loading shapes behind the logo: remotes, d-pads, rings and arrows drifting past.
const BOOT_PATHS=["M18 4h12a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6Zm6 12a4 4 0 1 0 0 .1M24 34v10","M17 4h14v13h13v14H31v13H17V31H4V17h13Z","M24 6a18 18 0 1 0 .1 0Zm0 10a8 8 0 1 1-.1 0Z","M8 30 30 8v12c12 0 16 8 16 18-4-6-8-8-16-8v12Z","M6 18c0-6 4-9 10-9h16c6 0 10 3 10 9l2 16c1 6-5 8-8 4l-5-6H17l-5 6c-3 4-9 2-8-4Z"];
const BOOT_SHAPES=Array.from({length:12},(_,i)=>({d:BOOT_PATHS[i%5],left:`${(i*41+7)%96}%`,top:`${(i*29+11)%90}%`,size:36+(i*13)%46,"--r":`${(i*67)%360}deg`,"--dx":`${((i*53)%160)-80}px`,"--dy":`${((i*37)%120)-90}px`}));
// The TV / GamePad swap picture. A theme file's own swap arrow (slot swap-arrow) replaces the cyan double arrow,
// its TV / GamePad picture (swap-icon) the drawn one.
const SwapIcon=({arrow,icon}:{arrow?:string;icon?:string})=><i className="nt-swap-icon" style={{position:"relative",display:"inline-block",width:58,lineHeight:0,fontStyle:"normal"}}>{icon?<img className="nt-swap-picture dht-wiiu-swap-icon" src={icon} alt="" style={{display:"block",width:"100%",height:"auto"}}/>:<svg viewBox="0 0 66 78" width="58" aria-hidden="true"><rect width="66" height="44" rx="4" fill="#7e8386"/><rect x="6" y="6" width="54" height="32" rx="1" fill="#f1f3f4"/><rect x="13" y="52" width="40" height="26" rx="7" fill="#868b8e"/><rect x="19" y="54" width="28" height="16" rx="1" fill="#f1f3f4"/>{!arrow&&<path d="M33 22v38M23 32l10-11 10 11M23 50l10 11 10-11" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>}{!arrow&&<path d="M33 22v38M23 32l10-11 10 11M23 50l10 11 10-11" fill="none" stroke="#18b9d8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>}</svg>}{arrow&&<img className="nt-swap-art dht-wiiu-swap-art" src={arrow} alt="" style={{position:"absolute",left:"50%",top:"43%",height:"58%",width:"auto",maxWidth:"60%",transform:"translate(-50%,-50%)",objectFit:"contain"}}/>}</i>;
// The Wii Remote pointer resting on the focused channel, with its player number.
// The pointer hand from a Wii theme file (open hand; the pressed one shows while the tile is held down).
const WiiThemeHand=({a,b}:{a:string;b?:string})=><span className="nt-wii-hand nt-wii-hand-skin dht-wii-pointer" data-dht-from-skin="wii" aria-hidden="true"><img className="nt-wii-hand-a" src={a} alt=""/>{b&&<img className="nt-wii-hand-b" src={b} alt=""/>}</span>;
const WiiHand=()=><svg className="nt-wii-hand" viewBox="0 0 40 52" width="46" aria-hidden="true"><path d="M13 3c3 0 4.5 2 4.5 5v12l2-.6c2.5-.6 4 .6 4.4 2l1.4-.3c2.4-.4 3.8.8 4.2 2.2l1.2-.2c2.6-.3 4.3 1.3 4.3 3.8v8.6C35 45 30 50 22 50h-3c-5 0-8-2.4-10.6-6.6L3.6 35c-1.4-2.4-.6-4.6 1.4-5.6 2-1 4-.2 5.3 1.6l-.3-23C10 5 11 3 13 3Z" fill="#fff" stroke="#3c4a52" strokeWidth="2.4" strokeLinejoin="round"/><text x="24" y="44" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2aa7d8">1</text></svg>;
// The SD Card button of System Menu 4.0+: a white card with a blue frame, the SD mark and a stripe.
const WiiSdCard=()=><svg className="nt-sd-card" viewBox="0 0 50 66" aria-hidden="true"><path d="M6 2h29l13 13v46a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z" fill="#eaf7fc" stroke="#4dbfe8" strokeWidth="3" strokeLinejoin="round"/><rect x="8" y="9" width="34" height="42" rx="2" fill="#fff"/><text x="25" y="37" textAnchor="middle" fontSize="17" fontWeight="800" textLength="26" lengthAdjust="spacingAndGlyphs" fill="#4dbfe8" fontFamily="Arial,sans-serif">SD</text><rect x="8" y="54" width="34" height="5" rx="1" fill="#8fd7f0"/></svg>;
export function NintendoHome({kind}:{kind:"wii"|"wiiu"}){
 const api=useHome(),s=api.settings,{W,H}=useStage(),menu=useMenu(),clock=useClock(),u=kind==="wiiu";
 // presets v2: the preset's Background (any installed picture) replaces the grid background / the Wii menu wallpaper
 const wall=useWallpaper(kind);
 const wl0=useWiiLook(),wl=wall&&!u?{...wl0,wallpaper:wall,fit:"cover" as const}:wl0,assets=useAssets("wiiu"),status=useSteamStatus(),skin=useWiiuSkin(),fx=themeFx(s,wiiuFxKey(s.wiiuTheme)),themeArt:Record<string,string>=u?wiiuArt(skin,fx):{},art:Record<string,string>={...assets,...themeArt,...(themeArt["plaza-floor"]&&!themeArt["plaza-background"]?{"plaza-background":themeArt["plaza-floor"]}:{}),...(wall&&u?{"grid-background":wall}:{})},splash=u&&fx.background?skin?.splash:undefined;
 const [miiOpen,setMiiOpen]=useState(false);
 const [customThemes,setCustomThemes]=useState<string[]>([]);
 useEffect(()=>{if(u)listWiiuThemes().then(r=>setCustomThemes(r?.themes??[])).catch(()=>{});},[u,s.wiiuTheme]);
 const themeItems=()=>[...(wiiuProblem(skin)?[{label:wiiuProblem(skin),disabled:true}]:[]),{label:t("noneBuiltInLook"),checked:!s.wiiuTheme,action:()=>updateSettings({wiiuTheme:""})},...customThemes.map(n=>({label:n.replace(/\.utheme$/i,""),checked:s.wiiuTheme===n,action:()=>updateSettings({wiiuTheme:n})}))];
 const profileFallback=(s.personalMii?(s.personalMii.portrait??miiPortraitUrl(s.personalMii)):undefined)??customProfilePicture()??art["profile-fallback"]??art["icon-mii"],plaza=u&&s.wiiuView==="plaza",st=styleOf(s,kind),w=(part:string)=>u?` dht-wiiu-${part}`:"";
// Dock look: the option, else the theme file's own dock pictures (round buttons or free pictograms), else the stock icons.
 const lookArt=u?LOOK_ART.map(k=>themeArt[k]).find(Boolean):undefined,dockArt=useAnalysed(lookArt,analyseDockArt),dockPref=u?st<string>("dock"):"auto";
 const dockLook=dockPref==="round"||dockPref==="icons"?dockPref:dockArt?.look??"icons",dockTint=dockLook==="round"&&dockPref!=="round"?dockArt:null;
 const tone=useAnalysed(u&&themeArt["grid-background"]?themeArt["grid-background"]:undefined,analyseTone);
 // A dock picture: the theme file's, or the bundled stock Downloads picture while the stock (icon) look is shown.
 const dockPic=(place:string)=>{const k=DOCK_ART[place];return k?themeArt[k]??(dockLook==="icons"?art[k]:undefined):undefined;};
const notifyOn=u&&st("notify")!=="off",detailOn=u&&st("detail")!=="off",notices=useNotices(u),friends=useFriends(u);
 // Real activity for the Plaza's posts: rebuilt only when the underlying lists change.
 const feedKey=JSON.stringify([notices.items.map(n=>n.id+n.unread),friends.map(f=>f.id+(f.game??""))]);
 const feed=useMemo(()=>notifyOn?buildFeed({friends,notices:notices.items,games:api.lib.games,user:userName()}):[],[feedKey,notifyOn,api.lib.games.length]);
 const zoom=u?st<number>("grid")===28:st<number>("grid")===20;
 const cols=u?(zoom?7:5):(zoom?5:4),rows=zoom?4:3,count=plaza?10:cols*rows;
 // Wii bottom bar: the Wii button, the SD Card button (System Menu 4.0+) and the Message Board.
 const wiiDock=["wii",...(st("menu")==="3"?[]:["sd"]),...(st("board")==="off"?[]:["mail"])];
 // Wii Screen Burn-in Reduction: dim after five idle minutes, wake on any input.
 const [dim,setDim]=useState(false),idleAt=useRef(Date.now()),burnIn=!u&&st("burnIn")==="on";
 useEffect(()=>{if(!burnIn){setDim(false);return;}idleAt.current=Date.now();const t=setInterval(()=>{if(Date.now()-idleAt.current>300000)setDim(true);},5000);return()=>clearInterval(t);},[burnIn]);
 const wake=()=>{idleAt.current=Date.now();if(dim){setDim(false);return true;}return false;};
 const swap=()=>{updateSettings({wiiuView:plaza?"grid":"plaza"});setPage(0);setSelected(0);setZone("grid");playSound("tab");};
 // Library and Settings are shortcuts the consoles never had here (the games are on the grid; Settings is a page
 // tab and an options entry): shown only with Global settings → Shortcut buttons.
 const extra=(x:typeof SERVICES[number])=>!!s.shortcutButtons||(x.place!=="library"&&x.place!=="settings");
 const dockServices=SERVICES.filter(extra);
 const tiles:Tile[]=u?api.lib.games.map(game=>({game})):[...SERVICES.slice(0,4).filter(extra).map(service=>({service})),...api.lib.games.map(game=>({game}))];
 const pages=Math.max(1,Math.ceil(tiles.length/count));
 const [moving,setMoving]=useState(false);
 // 2: logo, then loading shapes · 1: fading out while the icons pop in · 0: done.
 const [bootPhase,setBootPhase]=useState(()=>u&&s.animations&&!wiiuBooted&&st("boot")!=="off"?2:0),boot=bootPhase===2,setBoot=(on:boolean)=>setBootPhase(on?2:p=>p&&1);
 useEffect(()=>{if(!bootPhase)return;wiiuBooted=true;if(bootPhase===1){const done=setTimeout(()=>setBootPhase(0),520);return()=>clearTimeout(done);}const chime=setTimeout(()=>playSound("launch"),520),out=setTimeout(()=>setBoot(false),3200);return()=>{clearTimeout(chime);clearTimeout(out);};},[bootPhase]);
 const [page,setPage]=useState(0),[selected,setSelected]=useState(0),[zone,setZone]=useState<"grid"|"dock">("grid"),[dock,setDock]=useState(0),[banner,setBanner]=useState<Game|null>(null),[bannerStart,setBannerStart]=useState(true);
 useEffect(()=>{setPage(p=>Math.min(p,pages-1));},[pages]);
 // The Plaza only shows the games on the page, so focus never lands on an empty spot; the grid keeps its empty slots focusable.
 const last=(plaza?Math.max(1,Math.min(count,tiles.length-page*count)):count)-1;
 const focus=(i:number)=>{if(selected!==i||zone!=="grid")playSound("move");setSelected(i);setZone("grid");};
 const changePage=(d:number)=>{setPage(p=>Math.max(0,Math.min(pages-1,p+d)));setSelected(0);setZone("grid");playSound("tab");};
 const options=()=>menu.open([...(plaza?[{label:moving?t("finishMovingCover"):t("moveSelectedCover"),action:()=>setMoving(!moving)},{label:t("resetPlazaLayout"),action:()=>updateSettings({wiiuPlazaPositions:{}})},{label:t("plazaAdvice"),checked:s.wiiuPlazaTips!==false,action:()=>updateSettings({wiiuPlazaTips:s.wiiuPlazaTips===false})}]:[]),...(u?[{label:plaza?t("switchToGrid"):t("switchToPlaza"),action:swap},{label:`${t("destNotifications")}${notices.count?` (${notices.count})`:""}`,action:()=>openSteam("notifications")},{label:t("showNotifications"),checked:notifyOn,action:()=>setStyle("wiiu","notify",notifyOn?"off":"on")},{label:t("showGameDetails"),checked:detailOn,action:()=>setStyle("wiiu","detail",detailOn?"off":"on")},{label:t("customThemeNamed",{name:skin?.name??t("none")}),sub:themeItems}]:[]),{label:t("presets"),sub:()=>themeMenu()},{label:t("homeScreenSettings"),action:api.openSettings},{label:t("destDownloads"),action:()=>openSteam("downloads")},...(u&&!s.shortcutButtons?[{label:t("systemSettings"),action:()=>openSteam("settings")}]:[]),{label:t("destMainMenu"),action:api.showSteamHome}],u?t("wiiuMenu"):t("wiiMenu"));
 // Y: the focused game's details and full achievements page, then Steam's own game menu.
 const gameMenu=(game:Game)=>menu.open([{label:t("destGameDetails"),action:()=>openGamePage(game)},{label:t("destAchievements"),action:()=>openAchievements(game)},{label:t("gameOptions"),action:()=>api.nativeMenu(game)}],game.name);
 const pick=(i:number)=>{focus(i);const tile=tiles[page*count+i];if(tile?.service){playSound("open");openSteam(tile.service.place);}else if(tile?.game){const game=tile.game;api.activate(game,()=>{playSound("open");setBanner(game);setBannerStart(true);});}};
 const close=()=>{playSound("back");setBanner(null);};
 const start=()=>{if(banner)api.launch(banner);};
 const dockAction=(i:number)=>{playSound("open");if(u){const x=dockServices[i];if(x)openSteam(x.place);}else if(wiiDock[i]==="wii")options();else openSteam(wiiDock[i]==="sd"?"downloads":"notifications");};
 const input=(p:Press)=>{
  if(wake())return true;
  if(boot){setBoot(false);return true;}
  if(menu.handle(p))return true;
  if(moving){const game=tiles[page*count+selected]?.game;if(p.btn==="a"||p.btn==="b"){setMoving(false);return true;}const dx=p.btn==="left"?-.5:p.btn==="right"?.5:0,dz=p.btn==="up"?-.5:p.btn==="down"?.5:0;if(game&&(dx||dz)){const pos=s.wiiuPlazaPositions?.[game.appid]??PLAZA_SPOTS[selected];updateSettings({wiiuPlazaPositions:{...s.wiiuPlazaPositions,[game.appid]:{x:Math.max(-17,Math.min(17,pos.x+dx)),z:Math.max(-14,Math.min(13,pos.z+dz))}}});}return true;}
  if(banner){if(p.btn==="b")close();else if(p.btn==="left"||p.btn==="right"){setBannerStart(p.btn==="right");playSound("move");}else if(p.btn==="a"){if(bannerStart)start();else close();}return true;}
  if(p.btn==="x"||p.btn==="menu"){options();return true;}
  if(p.btn==="y"){const game=tiles[page*count+selected]?.game;if(game){if(detailOn)gameMenu(game);else api.nativeMenu(game);}return true;}
  if(p.btn==="l1"||p.btn==="r1"){changePage(p.btn==="l1"?-1:1);return true;}
  if(p.btn==="b"&&plaza){swap();return true;}
  if(p.btn==="b"){setZone("grid");return true;}
  if(p.btn==="a"){if(zone==="dock")dockAction(dock);else pick(selected);return true;}
  if(zone==="dock"){
   if(p.btn==="up"){setZone("grid");playSound("move");}
   else if(p.btn==="left"||p.btn==="right"){setDock(i=>Math.max(0,Math.min(u?dockServices.length-1:wiiDock.length-1,i+(p.btn==="left"?-1:1))));playSound("move");}return true;
  }
  if(p.btn==="down"&&selected>=count-cols&&!plaza){setZone("dock");playSound("move");return true;}
  if(p.btn==="left"&&(plaza?selected===0:selected%cols===0)&&page>0){changePage(-1);return true;}
  if(p.btn==="right"&&(plaza?selected===last:selected%cols===cols-1)&&page<pages-1){changePage(1);return true;}
  const delta=p.btn==="left"?-1:p.btn==="right"?1:p.btn==="up"?-cols:p.btn==="down"?cols:0;
  if(delta){focus(Math.max(0,Math.min(last,selected+delta)));return true;}return false;
 };
 useEffect(()=>{setDock(i=>Math.min(i,u?dockServices.length-1:wiiDock.length-1));},[wiiDock.length,dockServices.length]);
 useEffect(()=>{setSelected(i=>Math.min(i,last));},[last]);
 const current=tiles[page*count+selected];
 useReportFocus(zone==="grid"&&!banner?current?.game:undefined);
 return <ThemeRoot onInput={miiOpen?(key)=>{window.dispatchEvent(new CustomEvent("dht-mii-input",{detail:key}));}:input} hints={{a:"Select",b:"Back",x:"Options",y:"Game options"}}><Stage><style>{NINTENDO_CSS}{CUSTOM_THEME_CSS}{u?DOCK_CSS:WII_CSS}</style>
 <div className={`nt-home nt-${kind}${u?" dht-wiiu-home":" dht-wii"}`} data-wii-skin={!u&&(wl.wallpaper||wl.cursor)?"true":undefined} data-view={u?(plaza?"plaza":"grid"):undefined} data-motion={s.animations} data-plaza={plaza} data-boot={boot} data-theme-bg={!!art["grid-background"]} data-theme-floor={!!art["plaza-background"]} data-theme-dock={u&&SERVICES.some(x=>!!themeArt[DOCK_ART[x.place]])||undefined} data-dock-look={u?dockLook:undefined} data-theme-tone={u&&tone||undefined} data-theme-arrows={u&&!!art["page-arrow"]||undefined} data-theme-frame={u&&!!art["account-frame"]||undefined} data-theme-swap={u&&!!art["swap-button"]||undefined} data-zoom={zoom} data-detail={detailOn||undefined} data-highlight={st("highlight")} data-preview={st("preview")} data-colon={st("colon")} onPointerMove={burnIn?()=>{wake();}:undefined} style={{width:1280,height:800,"--dht-wii-skin-wallpaper":!u&&wl.wallpaper?`url("${wl.wallpaper}")`:undefined,"--dht-wii-wallpaper-size":wl.fit==="stretch"?"100% 100%":undefined,"--nt-theme-bg":art["grid-background"]?`url("${art["grid-background"]}")`:"none","--nt-theme-floor":art["plaza-background"]?`url("${art["plaza-background"]}")`:"none",transform:`scale(${W/1280},${H/800})`,"--nt-glass":art["tile-glass"]?`url("${art["tile-glass"]}")`:"none","--nt-empty":art["empty-slot"]?`url("${art["empty-slot"]}")`:"none","--nt-dock-rim":dockTint?.rim,"--nt-dock-body":dockTint?.body,"--nt-dock-ink":dockTint?.ink} as CSSProperties}>
 {!u&&<div className="dht-wii-wallpaper" data-dht-from-skin={wl.wallpaper?"wii":undefined} aria-hidden="true"/>}<WallpaperVideo src={wall}/>
 {miiOpen&&<PersonalMiiCreator games={api.lib.games} onClose={()=>setMiiOpen(false)}/>}
 {u&&<header className="nt-user dht-wiiu-user">{st("profile")==="off"?<span/>:<button aria-label="Create or edit personal Mii" onClick={()=>setMiiOpen(true)}><span className="nt-profile-image dht-wiiu-avatar">{profileFallback||status.avatar?<img src={profileFallback||status.avatar} alt="" onError={e=>{if(profileFallback&&e.currentTarget.src!==profileFallback)e.currentTarget.src=profileFallback;}}/>:<Icon name="friends" size={36}/>}{art["account-frame"]&&<img className="nt-profile-frame dht-wiiu-frame" src={art["account-frame"]} alt=""/>}{art["network-mark"]&&<img className="nt-network-mark dht-wiiu-network" src={art["network-mark"]} alt=""/>}</span><span>{api.user}</span></button>}{st("logo")!=="off"&&<span className="nt-wordmark dht-wiiu-logo">Wii <b>U</b></span>}<time className="dht-wiiu-clock">{fmtTime(clock,s.clock24)}</time></header>}
 {u&&<button className="nt-screen-swap dht-wiiu-swap" onClick={swap} aria-label={plaza?"Switch to software grid":"Switch to WaraWara Plaza"}>{art["swap-button"]&&<img className="nt-swap-body dht-wiiu-swap-body" src={art["swap-button"]} alt=""/>}<SwapIcon arrow={art["swap-arrow"]} icon={art["swap-icon"]}/><span>{plaza?"Software grid":"WaraWara Plaza"}</span></button>}
 {notifyOn&&!boot&&<><WiiuNotifyBell count={notices.count} onOpen={()=>{playSound("open");openSteam("notifications");}}/><WiiuNotifyBanners notices={notices.items} friends={friends} games={api.lib.games} paused={!!banner||menu.isOpen} onOpen={()=>{playSound("open");openSteam("notifications");}}/></>}
 {plaza?<WaraWaraPlaza feed={feed} iconGlass={st("iconGlass")==="glass"} hold={boot} posts={st("posts")!=="off"} postEvery={plazaPostInterval(st("postRate"))} drawings={st("drawings")!=="off"} crowd={st("crowd")==="small"?.5:st("crowd")==="large"?1.5:1} floorTexture={art["plaza-background"]?undefined:art["plaza-floor"]} flatFloor={!!art["plaza-background"]} positions={s.wiiuPlazaPositions??{}} tips={s.wiiuPlazaTips!==false} editing={moving} onMove={(id,pos)=>updateSettings({wiiuPlazaPositions:{...s.wiiuPlazaPositions,[id]:pos}})} games={api.lib.games.slice(page*count,(page+1)*count)} selected={selected} active={zone==="grid"} motion={s.animations&&!api.busy&&!banner&&!menu.isOpen} onFocus={focus} onPick={pick}/>:<div key={page} className={`nt-grid${w("grid")}`} style={{gridTemplateColumns:`repeat(${cols},1fr)`,gridTemplateRows:`repeat(${rows},1fr)`}} role="group" aria-label={u?"Wii U software":"Wii channels"}>
 {Array.from({length:count},(_,i)=>{const tile=tiles[page*count+i],on=zone==="grid"&&selected===i;return <button key={i} className={`nt-tile ${!tile?'nt-empty':''}${w("tile")}${u?"":" dht-wii-channel"}`} style={{"--i":i} as CSSProperties} data-focus={on} data-selected={u?on:undefined} data-name={u?(tile?.game?.name??tile?.service?.name):undefined} aria-label={tile?.game?.name??tile?.service?.name??`Empty slot ${i+1}`} aria-disabled={!tile} onPointerEnter={()=>focus(i)} onFocus={()=>focus(i)} onClick={()=>pick(i)}>
 {tile?.game?<>{u?<div className="nt-wiiu-art-frame"><GameArt flat g={tile.game} kind="landscape" fit="cover" style={{width:"100%",height:"100%"}}/></div>:<span className="nt-wii-art-frame"><span className="nt-wii-art"><GameArt flat g={tile.game} kind="landscape" fit="cover" style={{display:"block",width:"100%",height:"100%"}}/></span></span>}<span className="nt-game-label">{tile.game.name}</span></>:tile?.service?<div className={`nt-channel nt-channel-${tile.service.place}`} style={{'--channel':tile.service.color} as CSSProperties}><Icon name={tile.service.icon} size={64}/><strong>{tile.service.name}</strong><small>Channel</small></div>:<span className="nt-empty-word">{u?"":"Wii"}</span>}
 {!u&&on&&(wl.cursors.a?<WiiThemeHand a={wl.cursors.a} b={wl.cursors.b}/>:st("pointer")==="on"&&<WiiHand/>)}
 </button>})}
 </div>}
 {plaza&&detailOn&&zone==="grid"&&!banner&&!boot&&<WiiuDetail game={current?.game} variant="card"/>}
 {(()=>{const dots=<div className="nt-pages" aria-label="Pages">{Array.from({length:pages},(_,i)=><button key={i} aria-label={`Page ${i+1}`} aria-current={page===i?"page":undefined} onClick={()=>{setPage(i);setSelected(0);playSound("tab");}}/>)}</div>;
  const arrowArt=!plaza&&art["page-arrow"],prev=<button className={`nt-arrow nt-prev${w("arrow")}`} aria-label="Previous page" disabled={page===0} onClick={()=>changePage(-1)}>{plaza?"−":arrowArt?<img src={arrowArt} alt="" style={{transform:"scaleX(-1)"}}/>:"‹"}</button>,next=<button className={`nt-arrow nt-next${w("arrow")}`} aria-label="Next page" disabled={page===pages-1} onClick={()=>changePage(1)}>{plaza?"+":arrowArt?<img src={arrowArt} alt=""/>:"›"}</button>;
  // The Plaza pages with − / + bubbles in the bottom-left corner, as on the TV.
  return plaza?<div className="nt-plaza-pager dht-wiiu-pager">{prev}{dots}{next}</div>:<>{prev}{next}{dots}</>;})()}
 {u?<><div className="nt-selected-name dht-wiiu-title">{zone==="dock"?dockServices[dock]?.name:current?.game?.name??t("selectSoftware")}{detailOn&&!plaza&&zone==="grid"&&<WiiuDetail game={current?.game} variant="line"/>}</div><footer className="nt-dock dht-wiiu-dock">{dockServices.map((service,i)=><button key={service.name} className="dht-wiiu-dock-item" data-place={service.place} aria-label={service.name} data-focus={zone==="dock"&&dock===i} data-selected={zone==="dock"&&dock===i} data-name={service.name} style={{'--channel':service.color} as CSSProperties} onPointerEnter={()=>{setZone("dock");setDock(i);}} onClick={()=>dockAction(i)}>{dockPic(service.place)?<img className="nt-original-icon" src={dockPic(service.place)} alt=""/>:<DockGlyph place={service.place}/>}<span>{service.name}</span></button>)}</footer><div className="nt-home-hint">ⓧ HOME Menu</div></>:<footer className="nt-wii-footer dht-wii-bar"><div className="nt-footer-left"><button data-focus={zone==="dock"&&dock===0} onClick={()=>dockAction(0)}>Wii</button>{wiiDock.includes("sd")&&<button aria-label="Downloads" data-focus={zone==="dock"&&dock===1} onClick={()=>dockAction(1)}><WiiSdCard/></button>}</div><div className="nt-date"><WiiClock clock={clock} h24={s.clock24}/><span>{wiiDate(clock)}</span></div>{wiiDock.includes("mail")&&<button className="nt-mail" aria-label="Messages" data-focus={zone==="dock"&&dock===wiiDock.indexOf("mail")} onClick={()=>dockAction(wiiDock.indexOf("mail"))}><svg viewBox="0 0 64 44" width="55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"><rect x="2" y="2" width="60" height="40" rx="6" fill="#e3e5e7"/><path d="m3 5 29 23L61 5M3 40l19-19m20 0 19 19"/></svg></button>}</footer>}
 {burnIn&&<div className="nt-wii-dim" data-on={dim} aria-hidden="true" onPointerDown={()=>wake()}/>}
 {banner&&<div className={`nt-banner${w("banner")}`} role="dialog" aria-label={`${banner.name} channel`}><div className="nt-banner-art"><GameArt flat g={banner} kind="hero" fit="cover" style={{width:"100%",height:"100%"}}/><div className="nt-banner-title"><h1>{banner.name}</h1><span>{banner.installed?t("readyToPlay"):t("openWithSteam")}</span>{detailOn&&<WiiuDetail game={banner} variant="panel"/>}</div></div><div className="nt-banner-actions"><button data-focus={!bannerStart} onClick={close}>{u?t("wiiuMenu"):t("wiiMenu")}</button><button data-focus={bannerStart} onClick={start}>{t("start")}</button></div></div>}
 {bootPhase>0&&<div className={`nt-boot${w("boot")}`} data-leaving={!boot} data-splash={splash?true:undefined} role="presentation" onPointerDown={()=>setBoot(false)}>{splash&&<img className="nt-boot-splash dht-wiiu-splash" src={splash} alt=""/>}<div className="nt-boot-shapes" aria-hidden="true">{BOOT_SHAPES.map(({d,size,left,top,...v},i)=><svg key={i} viewBox="0 0 48 68" width={size} style={{left,top,...v} as CSSProperties} fill="currentColor" fillRule="evenodd"><path d={d}/></svg>)}</div><div className="nt-boot-logo" aria-label="Wii U"><span>Wii</span><b>U</b><small>™</small></div></div>}
 </div><MenuView menu={menu} variant={kind}/></Stage></ThemeRoot>;
}

