import { CSSProperties, useEffect, useRef, useState } from "react";
import { checkFirmware, installFirmware, onFirmwareStatus, releaseLabel, releaseOrder, Status } from "./Updates";
import { installSpotlightUpdate, useSpotlightUpdates } from "./SpotlightUpdates";
import { pushModalInput } from "./input";
import { updateSettings, useSettings } from "./settings";
import { useAssets } from "./assets";
import { FIRMWARE_SKINS } from "./firmwareSkins";
const identities: Record<string,[string,string]> = {
 onyx:["Onyx update","#eeeeee"],silver:["Silver system update","#92cfff"],"blue-glass":["Blue Glass Update","#78dfff"],gameamp:["GAMEAMP / UPDATE","#b6ee65"],gamecube:["System Update","#c7a7ff"],ios6:["Software Update","#b8d8ff"],"old-big-picture":["Big Picture Update","#76c8f1"],"santa-express":["Santa Express Delivery","#f4d28a"],"wiiflow-default":["WiiFlow Update","#d8efff"],

 reading:["A little update","#d4ac6e"],
 wii:["Wii System Update","#208fb9"],switch:["System Update","#00c3e3"],n3ds:["System Update","#3fe3b5"],ps1:["SYSTEM UPDATE","#8fd0ff"],iisu:["Update ready","#8fd2ff"],wiiu:["Wii U System Update","#009ac7"], vita:["System Software Update","#83dcff"],ps2:["SYSTEM CONFIGURATION","#92bfff"],ps3:["System Update","#fff"],psp:["System Software","#fce69f"],ps4:["System Software Update","#79d1ff"],ps5:["System software update","#91b9ff"],xbox:["SYSTEM UPDATE","#a8ff35"],x360:["System Update","#9cec46"],aero:["Updates are ready to install","#dcff91"],aero2:["Aero System Update","#aff1ff"],dial:["FIRMWARE TRANSMISSION","#ff493b"],castle:["SYSTEM MESSAGE","#8ddeff"],republic:["REPUBLIC SYSTEMS / FIRMWARE","#e0c58e"],minecraft:["UPDATE AVAILABLE","#a4df6d"],pain:["A NEW TRANSMISSION","#cca9ee"],nazarick:["DECREE OF THE GREAT TOMB","#dbc17b"]
};
let previewStatus:Status|null=null;
const listeners=new Set<()=>void>();
export function showFirmwarePreview(){previewStatus={success:true,currentVersion:"1.10.0",releases:[],latest:{tag:"v1.10.1",version:"1.10.1",assetUrl:"",notes:"Preview only"},updateAvailable:true,stale:false};listeners.forEach(fn=>fn());}
export function FirmwareNotice({paused=false}:{paused?:boolean}){
 const settings=useSettings(),theme=settings.theme==="frame"&&settings.activeTheme&&Object.prototype.hasOwnProperty.call(identities,settings.activeTheme)?settings.activeTheme:settings.theme;
 const art=useAssets(theme==="nazarick"?"nazarick":theme==="xbox"?"xbox-original":"xmb-monochrome");
 const emblem=theme==="nazarick"?art.downloads:theme==="xbox"?art.orb:["vita","ps3","psp"].includes(theme)?art.gear:undefined;
 const [firmwareStatus,setStatus]=useState<Status|null>(previewStatus),[selection,setSelection]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[handedOff,setHandedOff]=useState(false);
 const mounted=useRef(true);
 useEffect(()=>{mounted.current=true;const preview=()=>{setStatus(previewStatus);setMessage("");setBusy(false);setSelection(0);updateSettings({dismissedFirmware:""});};listeners.add(preview);const off=onFirmwareStatus(v=>{if(mounted.current&&!previewStatus)setStatus(v);});const check=()=>void checkFirmware().then(v=>{if(mounted.current&&!previewStatus)setStatus(v);}).catch(()=>{});check();const timer=setInterval(check,1800000);return()=>{mounted.current=false;listeners.delete(preview);off();clearInterval(timer);};},[]);
 const spotlight=useSpotlightUpdates();
 const [dismissedPlugins,setDismissedPlugins]=useState<Record<string,boolean>>(()=>{try{return JSON.parse(localStorage.getItem("dht-dismissed-spotlight-updates")||"{}");}catch{return {};}});
 const plugin=(!firmwareStatus?.updateAvailable||firmwareStatus.stale||settings.dismissedFirmware===firmwareStatus.latest?.tag)?spotlight.plugins.find(p=>p.updateAvailable&&!p.error&&!dismissedPlugins[`${p.repo}@${p.version}`]):undefined;
 const status:Status|null=plugin?{success:true,currentVersion:plugin.currentVersion,releases:[],latest:{tag:plugin.version!,version:plugin.version!,assetUrl:plugin.zipUrl!,notes:""},updateAvailable:true,stale:false}:firmwareStatus;
 const release=status?.latest;
 useEffect(()=>{setHandedOff(false);setSelection(0);setMessage("");},[plugin?.repo,release?.tag]);
 const installedLabel=status?releaseLabel({tag:"",version:status.currentVersion,assetUrl:"",notes:"",build:status.currentBuild,attempt:status.currentAttempt}):"";
 const visible=(!!previewStatus||(spotlight.ready&&!spotlight.deckyUpInstalled))&&!handedOff&&!paused&&settings.firmwareNotifications!==false&&status?.success&&!status.stale&&status.updateAvailable&&release&&(!!plugin||(releaseOrder(release,status)>0&&settings.dismissedFirmware!==release.tag));
 const dismiss=()=>{if(plugin){const next={...dismissedPlugins,[`${plugin.repo}@${plugin.version}`]:true};setDismissedPlugins(next);try{localStorage.setItem("dht-dismissed-spotlight-updates",JSON.stringify(next));}catch{}}else if(release)updateSettings({dismissedFirmware:release.tag});setMessage("");};
 // Decky's own confirmation opens on top of everything at once: hand over and step aside (for this session; cancelling
 // in Decky brings the notice back next time)
 const accept=async()=>{if(!release||busy)return;setBusy(true);setMessage("");try{if(!release.assetUrl){setMessage("Preview: Decky would now ask you to confirm the update.");return;}if(plugin)await installSpotlightUpdate(plugin);else await installFirmware(release,status!.currentVersion);if(mounted.current){setMessage("");setHandedOff(true);}}catch(e){if(mounted.current)setMessage(String(e));}finally{if(mounted.current)setBusy(false);}};
 const latest=useRef({accept,dismiss,busy,selection,message});latest.current={accept,dismiss,busy,selection,message};
 useEffect(()=>{if(!visible)return;return pushModalInput(p=>{const s=latest.current;if(p.btn==="b"&&!s.busy)s.dismiss();if(["left","right","up","down"].includes(p.btn))setSelection(s.selection?0:1);if(p.btn==="a"&&!p.repeat&&!s.busy){if(s.selection||s.message)s.dismiss();else void s.accept();}return true;});},[!!visible]);
 if(!visible)return null;
 if(theme==="psp")return <PspUpdateDialog pluginName={plugin?.name} from={installedLabel} to={releaseLabel(release)} selection={selection} busy={busy} message={message} onSelect={setSelection} onYes={()=>void accept()} onNo={dismiss}/>;
 const [label,baseColor]=identities[theme]??["System Update","#7fd3ff"]; // a look without its own wording (a community theme)
 const color=theme==="dial"?({classic:"#85ff00",chrome:"#85ff00",crimson:"#ff344e",arctic:"#42ddff"}[settings.dial.look]):baseColor;
 const headline:Record<string,string>={switch:"A system update is available.",n3ds:"A system update is available.",ps1:"New system data found.",iisu:"Something new is here!",minecraft:"A new world awaits.",nazarick:"An invitation to ascend.",republic:"System upgrade authorized.",pain:"The next evolution.",dial:"New firmware detected.",castle:"A message from your system.",ps2:"Update data found.",xbox:"UPGRADE YOUR SYSTEM"};
 return <div style={{position:"absolute",inset:0,zIndex:500}}><div className="dht-firmware" data-firmware-theme={theme} data-dashboard={settings.x360.style} data-animated={settings.animations} role="dialog" aria-label="Firmware update" aria-modal="true" style={{"--fw-accent":color,fontFamily:theme==="republic"?"AurebeshEnglish,sans-serif":theme==="nazarick"?"Georgia,serif":"system-ui,sans-serif"} as CSSProperties}>
 <style>{BASE}{FIRMWARE_SKINS}</style>
 <div className="fw-top"><span className="fw-symbol">{emblem?<img src={emblem} alt=""/>:theme==="pain"?"◎":["castle","republic","nazarick"].includes(theme)?"✦":"↓"}</span><span>{label}</span></div>
 <h2>{plugin?`${plugin.name} update available.`:headline[theme]||"A new version is ready."}</h2><p>{plugin?`Update ${plugin.name} from its developer. Confirm installation in Decky.${plugin.root?" This plugin needs root access.":""}`:"Update ThemeHub to get the latest improvements. Your installed themes and settings stay with you."}</p>
 <div className="fw-version"><span>{installedLabel}</span><span>→</span><strong>{releaseLabel(release)}</strong><span style={{marginLeft:"auto",opacity:.6}}>{plugin?"Spotlight plugin":"Plugin firmware"}</span></div>
 <div className="fw-actions"><button data-selected={selection===0} disabled={busy} onMouseEnter={()=>setSelection(0)} onClick={()=>void accept()}>{busy?"Preparing…":"A  Accept update"}</button><button data-selected={selection===1} disabled={busy} onMouseEnter={()=>setSelection(1)} onClick={dismiss}>B  Not now</button></div>
 {message&&<div className="fw-note" role="status">{message}</div>}
 </div></div>;
}
const BASE=`.dht-firmware{position:absolute;right:4%;bottom:9%;width:min(460px,86%);z-index:500;padding:25px 27px;border:1px solid var(--fw-accent);border-top:3px solid var(--fw-accent);border-radius:12px;background:#141b29f5;box-shadow:0 20px 70px #0009;backdrop-filter:blur(22px);color:white;box-sizing:border-box}.dht-firmware .fw-top{display:flex;align-items:center;gap:13px;font-size:11px;letter-spacing:1.7px;color:var(--fw-accent)}.fw-symbol{display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--fw-accent);border-radius:50%;font-size:21px}.dht-firmware h2{font-size:23px;letter-spacing:-.5px;font-weight:500;margin:18px 0 8px}.dht-firmware p{font-size:13px;line-height:1.65;opacity:.8;margin:0 0 18px}.fw-version{display:flex;gap:12px;align-items:center;font-size:12px;border-top:1px solid #ffffff24;padding-top:13px;margin-bottom:18px}.fw-version strong{color:var(--fw-accent)}.fw-actions{display:flex;gap:10px}.fw-actions button{border:1px solid #ffffff50;color:white;background:transparent;font:inherit;font-size:12px;padding:11px 15px;flex:1;cursor:pointer}.fw-actions button[data-selected=true],.fw-actions button:focus-visible{background:var(--fw-accent);color:#111;outline:2px solid var(--fw-accent);outline-offset:2px}.fw-actions button:disabled{opacity:.45}.fw-note{margin-top:10px;font-size:11px;opacity:.8;line-height:1.4}`;

/** The PSP's own message dialog: the XMB dims, two thin lines frame the message across the whole
 *  screen, Yes / No sit side by side under it and the button guide is in the bottom-right corner
 *  (✕ Enter · ○ Back). Sizes follow the PSP's 480 × 272 screen. */
function PspUpdateDialog({pluginName,from,to,selection,busy,message,onSelect,onYes,onNo}:{pluginName?:string;from:string;to:string;selection:number;busy:boolean;message:string;onSelect:(i:number)=>void;onYes:()=>void;onNo:()=>void}){
 const lines=message?[message]:busy?["Please wait..."]:[pluginName?`${pluginName}: a plugin update is available.`:"A system software update is available.",`Update to version ${to}? (installed: ${from})`,pluginName?"Confirm installation in Decky.":"Your themes and settings will be kept."];
 return <div className="dht-psp-dialog" role="dialog" aria-label="System software update" aria-modal="true" style={{position:"absolute",inset:0,zIndex:500,containerType:"size",fontFamily:"var(--dht-xmb-font, inherit)"} as CSSProperties}>
  <style>{PSP_DIALOG}</style>
  <div className="pd-dim"/>
  <div className="pd-band">
   <div className="pd-text">{lines.map((l,i)=><div key={i}>{l}</div>)}{busy&&!message&&<div className="pd-busy"><i/><i/><i/><i/></div>}</div>
   {!busy&&!message&&<div className="pd-buttons">{["Yes","No"].map((t,i)=><button key={t} data-selected={selection===i} onMouseEnter={()=>onSelect(i)} onClick={i?onNo:onYes}>{t}</button>)}</div>}
  </div>
  <div className="pd-guide"><span><b className="pd-x">✕</b> {message?"OK":"Enter"}</span><span><b className="pd-o">○</b> Back</span></div>
 </div>;
}
// u = one pixel of the PSP's 480 × 272 screen, scaled to the home's size
const PSP_DIALOG=`.dht-psp-dialog{--u:min(100cqw/480,100cqh/272);color:#fff;text-shadow:0 0 calc(var(--u)*2) #0008}
.dht-psp-dialog .pd-dim{position:absolute;inset:0;background:#000;opacity:.72;animation:pdDim .25s ease-out both}
.dht-psp-dialog .pd-band{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);min-height:calc(var(--u)*120);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--u)*14);padding:calc(var(--u)*14) calc(var(--u)*40);box-sizing:border-box;animation:pdIn .25s ease-out both}
.dht-psp-dialog .pd-band::before,.dht-psp-dialog .pd-band::after{content:"";position:absolute;left:0;right:0;height:max(1px,calc(var(--u)*1));background:linear-gradient(90deg,#fff0,#fffc 12%,#fff 50%,#fffc 88%,#fff0);box-shadow:0 0 calc(var(--u)*3) #fff8}
.dht-psp-dialog .pd-band::before{top:0}.dht-psp-dialog .pd-band::after{bottom:0}
.dht-psp-dialog .pd-text{font-size:calc(var(--u)*12.5);line-height:1.55;text-align:center}
.dht-psp-dialog .pd-buttons{display:flex;gap:calc(var(--u)*28)}
.dht-psp-dialog button{font:inherit;font-size:calc(var(--u)*12.5);color:#fff;opacity:.6;background:none;border:0;min-width:calc(var(--u)*72);padding:calc(var(--u)*3) calc(var(--u)*14);border-radius:calc(var(--u)*3);cursor:pointer;text-shadow:inherit}
.dht-psp-dialog button[data-selected=true]{opacity:1;background:linear-gradient(#ffffff40,#ffffff14);box-shadow:inset 0 0 0 max(1px,calc(var(--u)*.8)) #ffffffb0,0 0 calc(var(--u)*8) #ffffff70}
.dht-psp-dialog .pd-guide{position:absolute;right:calc(var(--u)*14);bottom:calc(var(--u)*8);display:flex;gap:calc(var(--u)*14);font-size:calc(var(--u)*10);align-items:center}
.dht-psp-dialog .pd-guide b{display:inline-grid;place-items:center;width:calc(var(--u)*12);height:calc(var(--u)*12);border-radius:50%;background:#fff;color:#000;font-size:calc(var(--u)*8);text-shadow:none;margin-right:calc(var(--u)*2)}
.dht-psp-dialog .pd-busy{display:flex;gap:calc(var(--u)*4);justify-content:center;margin-top:calc(var(--u)*8)}
.dht-psp-dialog .pd-busy i{width:calc(var(--u)*5);height:calc(var(--u)*5);border-radius:50%;background:#fff;animation:pdBusy 1s infinite}
.dht-psp-dialog .pd-busy i:nth-child(2){animation-delay:.25s}.dht-psp-dialog .pd-busy i:nth-child(3){animation-delay:.5s}.dht-psp-dialog .pd-busy i:nth-child(4){animation-delay:.75s}
@keyframes pdDim{from{opacity:0}}@keyframes pdIn{from{opacity:0}}@keyframes pdBusy{0%,100%{opacity:.25}50%{opacity:1}}`;
