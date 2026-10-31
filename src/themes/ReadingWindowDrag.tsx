import { useEffect, useRef } from "react";
import { Settings, updateSettings } from "../settings";

/** Move pinned panels in their own scaled coordinate system. */
export function ReadingWindowDrag({settings}:{settings:Settings}){
 const latest=useRef(settings);latest.current=settings;
 useEffect(()=>{
  const applied=new WeakSet<HTMLElement>();
  let previewPositions:Settings["readingWindowPositions"]={};try{if((window as any).__isThemePreview)previewPositions=JSON.parse(localStorage.getItem("reading-window-positions")||"{}");}catch{}
  const bounds=(panel:HTMLElement)=>{const parent=panel.offsetParent as HTMLElement;const home=panel.closest<HTMLElement>('.rr-home');return {width:parent?.clientWidth??innerWidth,height:parent?.clientHeight??innerHeight,scale:home?home.getBoundingClientRect().width/1536:1};};
  const position=(panel:HTMLElement,x:number,y:number)=>{const b=bounds(panel);panel.style.left=`${Math.max(0,Math.min(x,b.width-panel.offsetWidth))}px`;panel.style.top=`${Math.max(20,Math.min(y,b.height-panel.offsetHeight))}px`;panel.style.right='auto';panel.style.bottom='auto';};
  const save=(panel:HTMLElement)=>{const b=bounds(panel),id=panel.dataset.readingWindow!,value={x:panel.offsetLeft/Math.max(1,b.width-panel.offsetWidth),y:panel.offsetTop/Math.max(1,b.height-panel.offsetHeight)};updateSettings(s=>({readingWindowPositions:{...s.readingWindowPositions,[id]:value}}));if((window as any).__isThemePreview){previewPositions={...previewPositions,[id]:value};try{localStorage.setItem("reading-window-positions",JSON.stringify(previewPositions));}catch{}}};
  const decorate=()=>{document.querySelectorAll<HTMLElement>('[data-reading-window]').forEach(panel=>{
   panel.querySelectorAll<HTMLElement>('.rr-pin,.rr-player-pin').forEach(pin=>{pin.setAttribute('role','button');pin.tabIndex=0;pin.setAttribute('aria-label',`Move ${panel.dataset.readingWindow} panel`);pin.title='Drag to move · arrow keys to adjust';});
   if(applied.has(panel))return;applied.add(panel);const saved=latest.current.readingWindowPositions?.[panel.dataset.readingWindow!]??previewPositions?.[panel.dataset.readingWindow!];if(saved){const b=bounds(panel);position(panel,saved.x*(b.width-panel.offsetWidth),saved.y*(b.height-panel.offsetHeight));}
  });};
  decorate();const observer=new MutationObserver(decorate);observer.observe(document.body,{childList:true,subtree:true});
  let drag:{panel:HTMLElement;pin:HTMLElement;pointer:number;x:number;y:number;left:number;top:number;scale:number}|null=null;
  const down=(e:PointerEvent)=>{const pin=(e.target as Element)?.closest<HTMLElement>('.rr-pin,.rr-player-pin');const panel=pin?.closest<HTMLElement>('[data-reading-window]');if(!pin||!panel||e.button!==0)return;e.preventDefault();e.stopImmediatePropagation();const b=bounds(panel);drag={panel,pin,pointer:e.pointerId,x:e.clientX,y:e.clientY,left:panel.offsetLeft,top:panel.offsetTop,scale:b.scale};pin.setPointerCapture(e.pointerId);panel.dataset.dragging='true';};
  const move=(e:PointerEvent)=>{if(!drag||e.pointerId!==drag.pointer)return;e.preventDefault();e.stopImmediatePropagation();position(drag.panel,drag.left+(e.clientX-drag.x)/drag.scale,drag.top+(e.clientY-drag.y)/drag.scale);};
  const up=(e:PointerEvent)=>{if(!drag||e.pointerId!==drag.pointer)return;e.preventDefault();e.stopImmediatePropagation();delete drag.panel.dataset.dragging;save(drag.panel);if(drag.pin.hasPointerCapture(e.pointerId))drag.pin.releasePointerCapture(e.pointerId);drag=null;};
  const click=(e:MouseEvent)=>{if((e.target as Element)?.closest('.rr-pin,.rr-player-pin')){e.preventDefault();e.stopImmediatePropagation();}};
  const key=(e:KeyboardEvent)=>{const pin=(e.target as Element)?.closest<HTMLElement>('.rr-pin,.rr-player-pin');const panel=pin?.closest<HTMLElement>('[data-reading-window]');if(!panel||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();e.stopImmediatePropagation();const step=e.shiftKey?20:8;position(panel,panel.offsetLeft+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0),panel.offsetTop+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0));save(panel);};
  document.addEventListener('pointerdown',down,true);document.addEventListener('pointermove',move,true);document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);document.addEventListener('click',click,true);document.addEventListener('keydown',key,true);
  return()=>{observer.disconnect();document.removeEventListener('pointerdown',down,true);document.removeEventListener('pointermove',move,true);document.removeEventListener('pointerup',up,true);document.removeEventListener('pointercancel',up,true);document.removeEventListener('click',click,true);document.removeEventListener('keydown',key,true);};
 },[]);
 return <style>{`
.rr-pin,.rr-player-pin{position:absolute;width:var(--rr-pin-size,44px)!important;height:var(--rr-pin-size,44px)!important;top:calc(var(--rr-pin-size,44px) / -2)!important;background:none!important;border:0!important;box-shadow:none!important;cursor:grab!important;touch-action:none;pointer-events:auto!important;z-index:8!important;display:block;isolation:isolate;--pin-light:#f6d9a2;--pin-mid:#bd8a48;--pin-dark:#79502c}
.rr-pin:before,.rr-player-pin:before{content:"";position:absolute;left:50%;top:39%;width:25px;height:20px;box-sizing:border-box;border-radius:48% 48% 43% 43%;background:radial-gradient(ellipse at 32% 22%,#fff5dba6 0 7%,transparent 24%),radial-gradient(ellipse at 44% 22%,var(--pin-light),var(--pin-mid) 54%,var(--pin-dark) 90%);border:1px solid #67462388;box-shadow:inset 0 2px 2px #fff3ce99,inset 0 -4px 3px #68402255,1px 3px 0 #805831,3px 8px 5px #38211066;transform:translate(-50%,-50%) rotate(-12deg);z-index:2;transition:transform .18s,box-shadow .18s}
.rr-pin:after,.rr-player-pin:after{content:"";position:absolute;left:calc(50% + 2px)!important;top:calc(39% + 10px)!important;width:3px!important;height:10px!important;background:linear-gradient(90deg,#554c42,#ede1ce 48%,#7c7368)!important;border-radius:0 0 2px 2px;transform:rotate(-18deg)!important;transform-origin:top;box-shadow:3px 3px 3px #40210d55!important;z-index:1}
.rr-pin-right{--pin-light:#d1d8ab;--pin-mid:#858e5c;--pin-dark:#4a5338}
.rr-pin-left{left:-5px!important}.rr-pin-right{right:-5px!important}.rr-player-pin{left:calc(50% - 22px)!important}
.rr-pin:hover:before,.rr-player-pin:hover:before{transform:translate(-50%,-53%) rotate(-8deg);box-shadow:inset 0 2px 2px #fff3ce99,inset 0 -4px 3px #68402255,1px 3px 0 #805831,4px 10px 6px #38211066}
.rr-pin:focus-visible,.rr-player-pin:focus-visible{outline:2px solid #506042;outline-offset:0;border-radius:50%}
[data-reading-window][data-dragging=true]{z-index:98!important;transition:none!important}[data-dragging=true] .rr-pin,[data-dragging=true] .rr-player-pin{cursor:grabbing!important}[data-dragging=true] .rr-pin:before,[data-dragging=true] .rr-player-pin:before{transform:translate(-50%,-60%) rotate(-8deg);box-shadow:inset 0 2px 2px #fff3ce99,inset 0 -4px 3px #68402255,1px 3px 0 #805831,5px 12px 7px #38211066}
@media(prefers-reduced-motion:reduce){.rr-pin:before,.rr-player-pin:before{transition:none}}
`}</style>;
}
