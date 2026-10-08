import { CSSProperties, useEffect, useRef, useState } from "react";
import { checkFirmware, installFirmware, Status } from "./Updates";
import { pushModalInput } from "./input";
import { updateSettings, useSettings } from "./settings";
import { useAssets } from "./assets";
import { FIRMWARE_SKINS } from "./firmwareSkins";
const identities: Record<string,[string,string]> = {
 vita:["System Software Update","#83dcff"],ps2:["SYSTEM CONFIGURATION","#92bfff"],ps3:["System Update","#fff"],psp:["System Software","#fce69f"],ps4:["System Software Update","#79d1ff"],ps5:["System software update","#91b9ff"],xbox:["SYSTEM UPDATE","#a8ff35"],x360:["System Update","#9cec46"],aero:["Updates are ready to install","#dcff91"],aero2:["Aero System Update","#aff1ff"],dial:["FIRMWARE TRANSMISSION","#ff493b"],castle:["SYSTEM MESSAGE","#8ddeff"],republic:["REPUBLIC SYSTEMS / FIRMWARE","#e0c58e"],minecraft:["UPDATE AVAILABLE","#a4df6d"],pain:["A NEW TRANSMISSION","#cca9ee"],nazarick:["DECREE OF THE GREAT TOMB","#dbc17b"]
};
let previewStatus:Status|null=null;
const listeners=new Set<()=>void>();
export function showFirmwarePreview(){previewStatus={success:true,currentVersion:"1.10.0",releases:[],latest:{tag:"v1.10.1",version:"1.10.1",assetUrl:"",notes:"Preview only"},updateAvailable:true,stale:false};listeners.forEach(fn=>fn());}
export function FirmwareNotice({paused=false}:{paused?:boolean}){
 const settings=useSettings(),theme=settings.theme;
 const art=useAssets(theme==="nazarick"?"nazarick":theme==="xbox"?"xbox-original":"xmb-monochrome");
 const emblem=theme==="nazarick"?art.downloads:theme==="xbox"?art.orb:["vita","ps3","psp"].includes(theme)?art.gear:undefined;
 const [status,setStatus]=useState<Status|null>(previewStatus),[selection,setSelection]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const mounted=useRef(true);
 useEffect(()=>{mounted.current=true;const preview=()=>{setStatus(previewStatus);setMessage("");setBusy(false);setSelection(0);updateSettings({dismissedFirmware:""});};listeners.add(preview);const check=()=>checkFirmware().then(v=>{if(mounted.current&&!previewStatus)setStatus(v);}).catch(()=>{});void check();const timer=setInterval(check,1800000);return()=>{mounted.current=false;listeners.delete(preview);clearInterval(timer);};},[]);
 const release=status?.latest;
 const visible=!paused&&settings.firmwareNotifications!==false&&status?.success&&!status.stale&&status.updateAvailable&&release&&settings.dismissedFirmware!==release.version;
 const dismiss=()=>{if(release)updateSettings({dismissedFirmware:release.version});setMessage("");};
 const accept=async()=>{if(!release||busy)return;setBusy(true);try{if(!release.assetUrl){setMessage("Preview: Decky would now ask you to confirm the update.");return;}await installFirmware(release,status!.currentVersion);if(mounted.current)setMessage("Confirm the update in Decky Loader. Your themes and settings will be kept.");}catch(e){if(mounted.current)setMessage(String(e));}finally{if(mounted.current)setBusy(false);}};
 const latest=useRef({accept,dismiss,busy,selection});latest.current={accept,dismiss,busy,selection};
 useEffect(()=>{if(!visible)return;return pushModalInput(p=>{const s=latest.current;if(p.btn==="b"&&!s.busy)s.dismiss();if(["left","right","up","down"].includes(p.btn))setSelection(s.selection?0:1);if(p.btn==="a"&&!p.repeat&&!s.busy){if(s.selection)s.dismiss();else void s.accept();}return true;});},[!!visible]);
 if(!visible)return null;
 const [label,color]=identities[theme];
 const headline:Record<string,string>={minecraft:"A new world awaits.",nazarick:"An invitation to ascend.",republic:"System upgrade authorized.",pain:"The next evolution.",dial:"New firmware detected.",castle:"A message from your system.",ps2:"Update data found.",xbox:"UPGRADE YOUR SYSTEM"};
 return <div style={{position:"absolute",inset:0,zIndex:500}}><div className="dht-firmware" data-firmware-theme={theme} role="dialog" aria-label="Firmware update" aria-modal="true" style={{"--fw-accent":color,fontFamily:["republic","nazarick"].includes(theme)?"Georgia,serif":"system-ui,sans-serif"} as CSSProperties}>
 <style>{BASE}{FIRMWARE_SKINS}</style>
 <div className="fw-top"><span className="fw-symbol">{emblem?<img src={emblem} alt=""/>:theme==="pain"?"◎":["castle","republic","nazarick"].includes(theme)?"✦":"↓"}</span><span>{label}</span></div>
 <h2>{headline[theme]||"A new version is ready."}</h2><p>Update Deck Home Themes to get the latest improvements. Your installed themes and settings stay with you.</p>
 <div className="fw-version"><span>{status.currentVersion}</span><span>→</span><strong>{release.version}</strong><span style={{marginLeft:"auto",opacity:.6}}>Plugin firmware</span></div>
 <div className="fw-actions"><button data-selected={selection===0} disabled={busy} onMouseEnter={()=>setSelection(0)} onClick={()=>void accept()}>{busy?"Preparing…":"A  Accept update"}</button><button data-selected={selection===1} disabled={busy} onMouseEnter={()=>setSelection(1)} onClick={dismiss}>B  Not now</button></div>
 {message&&<div className="fw-note" role="status">{message}</div>}
 </div></div>;
}
const BASE=`.dht-firmware{position:absolute;right:4%;bottom:9%;width:min(460px,86%);z-index:500;padding:25px 27px;border:1px solid var(--fw-accent);border-top:3px solid var(--fw-accent);border-radius:12px;background:#141b29f5;box-shadow:0 20px 70px #0009;backdrop-filter:blur(22px);color:white;box-sizing:border-box}.dht-firmware .fw-top{display:flex;align-items:center;gap:13px;font-size:11px;letter-spacing:1.7px;color:var(--fw-accent)}.fw-symbol{display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--fw-accent);border-radius:50%;font-size:21px}.dht-firmware h2{font-size:23px;letter-spacing:-.5px;font-weight:500;margin:18px 0 8px}.dht-firmware p{font-size:13px;line-height:1.65;opacity:.8;margin:0 0 18px}.fw-version{display:flex;gap:12px;align-items:center;font-size:12px;border-top:1px solid #ffffff24;padding-top:13px;margin-bottom:18px}.fw-version strong{color:var(--fw-accent)}.fw-actions{display:flex;gap:10px}.fw-actions button{border:1px solid #ffffff50;color:white;background:transparent;font:inherit;font-size:12px;padding:11px 15px;flex:1;cursor:pointer}.fw-actions button[data-selected=true],.fw-actions button:focus-visible{background:var(--fw-accent);color:#111;outline:2px solid var(--fw-accent);outline-offset:2px}.fw-actions button:disabled{opacity:.45}.fw-note{margin-top:10px;font-size:11px;opacity:.8;line-height:1.4}`;
