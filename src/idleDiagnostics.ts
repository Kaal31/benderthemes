import { logInfo } from "./diag";
import { steamDocuments } from "./keyboardSkins";
import { getSettings, onSettingsChange } from "./settings";

// Read-only snapshots: no text, image URLs, input values or account/app IDs.
export function idleLayers(doc: Document) {
  const view = doc.defaultView;
  if (!view) return [];
  const width = view.innerWidth, height = view.innerHeight;
  const points = [[.5,.5],[.15,.15],[.85,.15],[.15,.85],[.85,.85]];
  const hits = points.map(([x,y]) => doc.elementFromPoint(x * width, y * height));
  return Array.from(doc.querySelectorAll("body *")).filter(el => {
    const r = el.getBoundingClientRect();
    const css = view.getComputedStyle(el);
    return r.width >= width * .85 && r.height >= height * .85 && r.left < width * .15 && r.top < height * .15 && r.right > width * .85 && r.bottom > height * .85
      && css.display !== "none" && css.visibility !== "hidden" && Number(css.opacity) > 0;
  }).slice(-40).map(el => {
    const r = el.getBoundingClientRect(), css = view.getComputedStyle(el);
    return { tag:el.tagName, classes:Array.from(el.classList).slice(0,12),
      rect:[r.x,r.y,r.width,r.height].map(Math.round), display:css.display, visibility:css.visibility,
      opacity:css.opacity, position:css.position, zIndex:css.zIndex, pointerEvents:css.pointerEvents,
      themeRoot:el.hasAttribute("data-dht-root"), insideTheme:!!el.closest("[data-dht-root]"),
      hitPoints:hits.map(hit => !!hit && (el === hit || el.contains(hit))),
      images:el.querySelectorAll("img").length, videos:el.querySelectorAll("video").length,
      ancestors:Array.from((function* () { for(let p=el.parentElement,n=0;p&&n<6;p=p.parentElement,n++) yield p; })()).map(p => {
        const s=view.getComputedStyle(p);
        return {tag:p.tagName,classes:Array.from(p.classList).slice(0,8),position:s.position,zIndex:s.zIndex,visibility:s.visibility,opacity:s.opacity};
      }) };
  });
}

export function startIdleDiagnostics(automatic = false): () => void {
  let active=false, timer:ReturnType<typeof setInterval>|undefined, budget=360;
  let lastInput=Date.now(), nextId=1;
  const ids=new WeakMap<Document,number>();
  const watched=new Map<Document,()=>void>(), previous=new Map<number,string>();
  const input=()=>{lastInput=Date.now();}; // event type only; no keys or coordinates
  const stop=()=>{clearInterval(timer);timer=undefined;watched.forEach(off=>off());watched.clear();previous.clear();};
  const capture=()=>{
    if(budget--<=0){stop();logInfo("[idle-diagnostics] thirty-minute capture finished");return;}
    const docs=new Set(steamDocuments());
    for(const [doc,off] of watched) if(!docs.has(doc)){logInfo(`[idle-diagnostics] window-removed ${ids.get(doc)}`);off();watched.delete(doc);}
    for(const doc of docs) try {
      let id=ids.get(doc);if(!id){id=nextId++;ids.set(doc,id);}
      if(!watched.has(doc)){
        const events=["pointerdown","pointermove","keydown","touchstart","gamepadbuttondown"];
        events.forEach(e=>doc.addEventListener(e,input,{capture:true,passive:true}));
        watched.set(doc,()=>events.forEach(e=>doc.removeEventListener(e,input,true)));
      }
      const settings=getSettings();
      const state={window:id,viewport:[doc.defaultView?.innerWidth,doc.defaultView?.innerHeight],enabled:settings.enabled,theme:settings.theme,layers:idleLayers(doc)};
      const signature=JSON.stringify(state);
      if(previous.get(id)!==signature){previous.set(id,signature);logInfo(`[idle-diagnostics] ${JSON.stringify({...state,secondsSinceObservedInput:Math.round((Date.now()-lastInput)/1000)})}`);}
    }catch{/* Steam window closed */}
  };
  const refresh=()=>{
    const enabled=automatic;if(enabled===active)return;
    active=enabled;stop();logInfo(`[idle-diagnostics] ${enabled?"enabled (read-only, thirty minutes)":"disabled"}`);
    if(enabled){budget=360;lastInput=Date.now();capture();timer=setInterval(capture,5000);}
  };
  refresh();const off=onSettingsChange(refresh);
  return ()=>{off();stop();};
}
