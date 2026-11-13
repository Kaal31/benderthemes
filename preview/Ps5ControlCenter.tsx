import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

type Shortcut = "Home" | "Activities" | "Friends" | "Downloads" | "Audio" | "Profile" | "Power";
const shortcuts: { label: Shortcut; glyph: string }[] = [{label:"Home",glyph:"⌂"},{label:"Activities",glyph:"▣"},{label:"Friends",glyph:"♧"},{label:"Downloads",glyph:"↓"},{label:"Audio",glyph:"♫"},{label:"Profile",glyph:"◉"},{label:"Power",glyph:"⏻"}];

function ControlCenter() {
  const [open, setOpen] = useState(false);
  const [shortcut, setShortcut] = useState(1);
  const [card, setCard] = useState(-1);
  const [notice, setNotice] = useState("");
  const label = shortcuts[shortcut].label;
  const win = window as any;
  const game = win.__getThemeLibrary?.().games[0];
  const hero = game?.art.hero?.[0];
  const cards: { title: string; eyebrow: string; sub: string; image?: string }[] = label === "Activities" ? [
    {title:game?.name || "Selected game",eyebrow:"Resume",sub:"Return to your game",image:game?.art.portrait?.[0]},
    {title:"Achievement collection",eyebrow:"Achievements",sub:"View progress and unlocked achievements",image:hero},
    {title:"Game details",eyebrow:"Your library",sub:"Playtime, news and game options",image:hero},
  ] : label === "Friends" ? [{title:"Friends & chat",eyebrow:"Steam Social",sub:"Open Steam’s native friends interface"},{title:"Voice & party",eyebrow:"Native Steam fallback",sub:"Manage voice chat in Steam · no simulated connection"}] : [{title:label,eyebrow:"Steam shortcut",sub:label === "Audio" ? "Audio controls stay in Steam’s native Quick Access menu" : "Open the native Steam interface"}];
  const activate = (index: number) => {
    if(label === "Activities") {
      setNotice(index === 0 ? "Preview only — no game is launched." : index === 1 ? "Achievement cards use Steam data in the plugin. No unlocked achievements are fabricated here." : "Preview only — game details action.");
    } else if(label === "Home") {setOpen(false);setCard(-1);}
    else setNotice(`${label}: native Steam fallback in the plugin. This browser preview cannot control Steam.`);
  };
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if(event.key === "F2") {event.preventDefault();event.stopImmediatePropagation();setOpen(value=>!value);return;}
      if(!open)return;
      if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Escape"].includes(event.key))return;
      event.preventDefault();event.stopImmediatePropagation();
      if(event.key === "Escape") {if(notice)setNotice("");else if(card >= 0)setCard(-1);else setOpen(false);}
      if(event.key === "ArrowUp")setCard(0);
      if(event.key === "ArrowDown")setCard(-1);
      if(event.key === "ArrowLeft" || event.key === "ArrowRight") {const direction=event.key === "ArrowLeft"?-1:1;if(card >= 0)setCard(Math.max(0,Math.min(cards.length-1,card+direction)));else {setShortcut(value=>(value+direction+shortcuts.length)%shortcuts.length);setNotice("");}}
      if(event.key === "Enter") {if(card >= 0)activate(card);else if(label === "Home")setOpen(false);else setCard(0);}
    };
    window.addEventListener("keydown",handle,true);return()=>window.removeEventListener("keydown",handle,true);
  },[open,shortcut,card,notice,cards.length]);
  return <>
    <style>{`.ps5cc-open{position:fixed;bottom:16px;right:22px;z-index:99990;border:1px solid #ffffff55;border-radius:22px;padding:11px 20px;background:#17202c;color:white;cursor:pointer;font:14px system-ui}.ps5cc{position:fixed;inset:0;z-index:99999;color:#f5f6fa;background:linear-gradient(transparent,#050a12e8);backdrop-filter:blur(14px) brightness(.55);font-family:"Segoe UI",sans-serif}.ps5cc-time{position:absolute;right:5%;top:5%;font-size:20px}.ps5cc-content{position:absolute;left:6%;right:6%;bottom:25%}.ps5cc-heading{font-size:14px;color:#b9c3d1;letter-spacing:.08em;margin-bottom:18px}.ps5cc-cards{display:flex;gap:18px;overflow:auto;padding:6px}.ps5cc-card{position:relative;isolation:isolate;flex:0 0 240px;height:250px;border:1px solid #ffffff24;border-radius:18px;overflow:hidden;background:#15202e;text-align:left;padding:22px;display:flex;flex-direction:column;justify-content:flex-end;color:white;cursor:pointer;transition:transform .15s}.ps5cc-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}.ps5cc-card:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent,#09111beF 85%);z-index:-1}.ps5cc-card[data-selected=true]{outline:2px solid white;outline-offset:3px;transform:translateY(-3px)}.ps5cc-card small{font-size:12px;color:#d0d8e3;margin-bottom:9px}.ps5cc-card strong{font-size:20px;font-weight:500;line-height:1.3}.ps5cc-card span{font-size:12px;color:#c6cdd8;margin-top:10px;line-height:1.5}.ps5cc-nav{position:absolute;bottom:11%;left:6%;right:6%;display:flex;align-items:center;gap:clamp(10px,3vw,40px)}.ps5cc-nav button{position:relative;width:52px;height:52px;border:0;border-radius:50%;background:transparent;color:#e8edf6;font:28px system-ui;cursor:pointer}.ps5cc-nav button[data-selected=true]{outline:2px solid white;background:#ffffff16;box-shadow:0 0 18px #ffffff25}.ps5cc-nav button small{position:absolute;bottom:64px;left:50%;transform:translateX(-50%);white-space:nowrap;font:13px system-ui}.ps5cc-footer{position:absolute;bottom:4%;left:6%;right:6%;display:flex;justify-content:space-between;font-size:12px;color:#aeb8c7}.ps5cc-notice{margin-top:20px;max-width:720px;padding:14px 18px;border-radius:10px;background:#14273d;border:1px solid #ffffff33;font-size:14px;line-height:1.5}@media(max-height:650px){.ps5cc-card{height:185px}.ps5cc-content{bottom:29%}}`}</style>
    {!open && <button className="ps5cc-open" onClick={()=>{setOpen(true);setCard(-1);}}>Control Center · F2</button>}
    {open && <section className="ps5cc" role="dialog" aria-label="PS5 Control Center" aria-modal="true"><div className="ps5cc-time">{new Date().toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}</div><div className="ps5cc-content"><div className="ps5cc-heading">{label.toUpperCase()}</div><div className="ps5cc-cards">{cards.map((item,index)=><button className="ps5cc-card" data-selected={card===index} key={item.title} onFocus={()=>setCard(index)} onClick={()=>{setCard(index);activate(index);}}>{item.image&&<img src={item.image} alt=""/>}<small>{item.eyebrow}</small><strong>{item.title}</strong><span>{item.sub}</span></button>)}</div>{notice&&<div role="status" className="ps5cc-notice">{notice}</div>}</div><nav className="ps5cc-nav" aria-label="Control Center shortcuts">{shortcuts.map((item,index)=><button aria-label={item.label} data-selected={shortcut===index&&card<0} key={item.label} onClick={()=>{setShortcut(index);setCard(-1);setNotice("");}}>{shortcut===index&&<small>{item.label}</small>}{item.glyph}</button>)}</nav><div className="ps5cc-footer"><span>↑ Cards · ← → Navigate · Enter Select · Esc Back · F2 Close</span><span>Concept preview · Social and launch actions are not connected</span></div></section>}
  </>;
}

const mount = document.createElement("div");
document.body.appendChild(mount);
createRoot(mount).render(<ControlCenter/>);
