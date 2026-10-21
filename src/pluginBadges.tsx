import { CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { Badges, protonDbEnabled } from "./badges";
import { useFocusedGame } from "./focus";
import { useProtonDbPresent } from "./pluginPresence";
import { Settings, ThemeId } from "./settings";

// Fallback slots belong to the layouts, rather than a universal corner overlay.
// Existing in-layout badges take precedence when they are visible for this game.
const slots: Record<ThemeId, CSSProperties> = {
  gameamp:{right:"4%",top:"14%"},
 "old-big-picture":{right:"4%",bottom:"12%"},
  onyx:{left:"50%",top:"56%",transform:"translateX(-50%)"}, silver:{left:"21%",top:"43%"},
  wii:{left:"50%",top:"2.5%",transform:"translateX(-50%)"},
  wiiu:{left:"50%",top:"75%",transform:"translateX(-50%)"},
  switch:{left:"8%",top:"64%"}, n3ds:{left:"50%",top:"38%",transform:"translateX(-50%)"},
  vita:{right:"5%",top:"14%"}, ps1:{left:"50%",bottom:"16%",transform:"translateX(-50%)"},
  ps2:{right:"5%",top:"14%"}, ps3:{right:"6%",bottom:"14%"}, psp:{right:"6%",bottom:"14%"},
  ps4:{left:"6%",bottom:"20%"}, ps5:{left:"6%",bottom:"24%"},
  xbox:{right:"8%",bottom:"18%"}, x360:{right:"6%",bottom:"14%"},
  aero:{left:"28%",top:"63%"}, aero2:{left:"28%",top:"63%"},
  dial:{left:"6%",bottom:"17%"}, castle:{left:"6%",top:"64%"}, republic:{left:"24%",top:"62%"},
  minecraft:{left:"5%",top:"11%"}, pain:{left:"31%",top:"44%"}, nazarick:{left:"34%",top:"54%"},
  iisu:{left:"5%",top:"23%"}, native:{right:"4%",top:"12%"}, frame:{right:"4%",top:"12%"},
};
const looks: Record<ThemeId, {bg:string; ink:string; radius:string; font?:string}> = {
  gameamp:{bg:"linear-gradient(#e5edf6,#9aabba)",ink:"#062652",radius:"8px"},
 "old-big-picture":{bg:"#12334d",ink:"#a5dcf0",radius:"2px"},
  onyx:{bg:"linear-gradient(#262b32ee,#101318ee)",ink:"#eef5ff",radius:"7px"},
  silver:{bg:"linear-gradient(#f4f5f8,#b7bcc6)",ink:"#262c35",radius:"6px"},
  wii:{bg:"linear-gradient(#fff,#e4f4fb)",ink:"#4c788a",radius:"999px"},
  wiiu:{bg:"#f4fcffff",ink:"#447a90",radius:"16px"},
  switch:{bg:"#ffffffed",ink:"#2d2d2d",radius:"3px"},
  n3ds:{bg:"linear-gradient(#fff,#f0f1ed)",ink:"#596969",radius:"8px"},
  vita:{bg:"#fffffff0",ink:"#0b4fb0",radius:"20px"},
  ps1:{bg:"#9b9da2",ink:"#141826",radius:"0px",font:"monospace"},
  ps2:{bg:"#061138dd",ink:"#b8cdff",radius:"0px"},
  ps3:{bg:"#ffffff18",ink:"#fff",radius:"2px"},
  psp:{bg:"#00000038",ink:"#fff",radius:"2px"},
  ps4:{bg:"#042c68cc",ink:"#fff",radius:"3px"},
  ps5:{bg:"#0b1326d9",ink:"#fff",radius:"14px"},
  xbox:{bg:"linear-gradient(#214512,#0b2505)",ink:"#c6ff6a",radius:"12px"},
  x360:{bg:"#fff",ink:"#243324",radius:"0px"},
  aero:{bg:"linear-gradient(#ffffffc9,#b6e0ffb3)",ink:"#194c78",radius:"12px"},
  aero2:{bg:"linear-gradient(#e9f9fff0,#83c1eef0)",ink:"#18456d",radius:"9px"},
  dial:{bg:"linear-gradient(#353c37,#151915)",ink:"#abff8d",radius:"4px",font:"monospace"},
  castle:{bg:"#ffffffda",ink:"#30536c",radius:"4px"},
  republic:{bg:"#0b1821eb",ink:"#e8d08f",radius:"2px"},
  minecraft:{bg:"#303236",ink:"#eee",radius:"0px",font:"BlockWorlds,monospace"},
  pain:{bg:"#24102de6",ink:"#e1baff",radius:"18px"},
  nazarick:{bg:"#130b1bea",ink:"#dec68e",radius:"2px",font:"Georgia,serif"},
  iisu:{bg:"#ffffffb8",ink:"#314350",radius:"999px"},
  native:{bg:"#171d29e8",ink:"#f4f6ff",radius:"8px"},
  frame:{bg:"#171d29e8",ink:"#f4f6ff",radius:"8px"},
};
export const PLUGIN_BADGE_CSS = Object.entries(looks).map(([theme,k]) =>
  `.dht-root[data-dht-theme=${theme}]{--dht-proton-bg:${k.bg};--dht-proton-ink:${k.ink};--dht-proton-radius:${k.radius};${k.font?`--dht-proton-font:${k.font};`:""}}`
).join("\n") + `
.dht-badge--protondb{background:var(--dht-proton-bg)!important;color:var(--dht-proton-ink)!important;border-radius:var(--dht-proton-radius)!important;font-family:var(--dht-proton-font,inherit)!important;min-height:28px;box-shadow:0 1px 5px #0002}
.dht-badge--protondb:focus-visible{outline:2px solid currentColor;outline-offset:3px}
.dht-root[data-dht-theme=xbox] .dht-badge--protondb{box-shadow:0 0 12px #79ff3244;text-transform:uppercase}
.dht-root[data-dht-theme=ps2] .dht-badge--protondb{letter-spacing:1px;text-shadow:0 0 8px #88aaff}
.dht-root[data-dht-theme=minecraft] .dht-badge--protondb{box-shadow:inset 2px 2px #ffffff38,inset -2px -2px #111;text-shadow:1px 1px #111}
.dht-root[data-dht-theme=x360]:has(.dht-blades) .dht-badge--protondb{background:linear-gradient(#fff,#ffe4c9)!important;color:#654122!important;border-radius:10px!important}
.dht-root[data-dht-theme=x360]:has(.dht-x360n) .dht-badge--protondb{background:linear-gradient(#3a3f4c,#20232b)!important;color:#fff!important;border-radius:10px!important}
.dht-root[data-dht-preset=blue-glass]{--dht-proton-bg:linear-gradient(#effaff,#83bbdf);--dht-proton-ink:#124c76;--dht-proton-radius:8px}
.dht-root[data-dht-preset=gameamp]{--dht-proton-bg:linear-gradient(#e4e8ee,#939eab);--dht-proton-ink:#142f47;--dht-proton-radius:3px;--dht-proton-font:monospace}
.dht-plugin-badge-host{position:absolute;z-index:59;max-width:45%;pointer-events:auto}
`;

/** All layouts, including sandboxed themes, get a selected-game fallback slot. */
export function HomePluginBadges({settings:s,hidden}:{settings:Settings;hidden:boolean}) {
  const game=useFocusedGame(), detected=useProtonDbPresent();
  const enabled=detected&&protonDbEnabled(s)&&!hidden;
  const host=useRef<HTMLDivElement>(null);
  const [native,setNative]=useState(false);
  useLayoutEffect(()=>{
    if(!enabled||!game){setNative(false);return;}
    const root=host.current?.closest("[data-dht-root]");
    if(!root)return;
    const check=()=>setNative(!!game&&Array.from(root.querySelectorAll<HTMLElement>(`.dht-badges[data-appid="${game.appid}"] .dht-badge--protondb`)).some(el=>!el.closest("[data-dht-plugin-badge-host]")&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=="hidden"));
    check();
    const observer=new MutationObserver(check);
    observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:["style","class","data-appid"]});
    return()=>observer.disconnect();
  },[game?.appid,enabled,s.theme,s.activeTheme]);
  const show=enabled&&!!game&&!native;
  const placement=s.activeTheme==="blue-glass"?{left:"6%",top:"19%"}:s.activeTheme==="gameamp"?{right:"6%",bottom:"18%"}:slots[s.theme];
  return <div ref={host} data-dht-plugin-badge-host="" data-theme={s.theme} style={{...placement,display:show?"block":"none"}} className="dht-plugin-badge-host">
    {show&&<Badges g={game} size={s.theme==="n3ds"?13:15} theme={s.theme} protonOnly/>}
  </div>;
}
