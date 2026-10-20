import {useEffect, useRef, useState} from "react";
import {updateSettings} from "../settings";
import {useHome} from "../common";

/** Pointer gestures change React's ordered keys; no DOM moves or focus calls. */
export function useAppOrder(id:string,appKeys:string[],dockKeys:string[]){
 const {settings}=useHome();
 const saved=(settings.frameData[id]??{}) as {order?:string[];dockOrder?:string[]};
 const all=new Set([...appKeys,...dockKeys]);
 const normalize=(apps:string[],dock:string[])=>{const used=new Set<string>();const take=(keys:string[])=>keys.filter(k=>all.has(k)&&!used.has(k)&&!!used.add(k));const d=take(dock),a=take(apps);return{apps:[...a,...[...all].filter(k=>!used.has(k))],dock:d};};
 const [order,setOrder]=useState(()=>normalize(saved.order??appKeys,saved.dockOrder??dockKeys));
 const [held,setHeld]=useState<string|null>(null);
 const current=useRef(order);current.current=order;
 const gesture=useRef<{key:string;x:number;y:number;timer:ReturnType<typeof setTimeout>|null;drag:boolean}|null>(null),suppress=useRef(false);
 const signature=[...all].join("|");
 useEffect(()=>{setOrder(normalize(saved.order??appKeys,saved.dockOrder??dockKeys));},[signature,JSON.stringify(saved.order),JSON.stringify(saved.dockOrder)]);
 useEffect(()=>()=>{if(gesture.current?.timer)clearTimeout(gesture.current.timer);},[]);
 const down=(e:React.PointerEvent)=>{const key=(e.target as HTMLElement).closest<HTMLElement>("[data-layout-key]")?.dataset.layoutKey;if(!key)return;const g={key,x:e.clientX,y:e.clientY,timer:null as ReturnType<typeof setTimeout>|null,drag:false};suppress.current=false;g.timer=setTimeout(()=>{g.drag=true;suppress.current=true;setHeld(key);},500);gesture.current=g;};
 const move=(e:React.PointerEvent)=>{const g=gesture.current;if(!g)return;if(!g.drag){if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>12&&g.timer){clearTimeout(g.timer);g.timer=null;}return;}
  const key=e.currentTarget.ownerDocument.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>("[data-layout-key]")?.dataset.layoutKey;if(!key||key===g.key)return;
  const next={apps:[...current.current.apps],dock:[...current.current.dock]};
  const from=next.apps.includes(g.key)?next.apps:next.dock,to=next.apps.includes(key)?next.apps:next.dock;
  const a=from.indexOf(g.key),b=to.indexOf(key);if(a<0||b<0)return;from[a]=key;to[b]=g.key;current.current=next;setOrder(next);
 };
 const end=()=>{const g=gesture.current;if(!g)return false;if(g.timer)clearTimeout(g.timer);gesture.current=null;setHeld(null);if(g.drag){const next=current.current;updateSettings(s=>({frameData:{...s.frameData,[id]:{...(s.frameData[id] as object??{}),order:next.apps,dockOrder:next.dock}}}));}return g.drag;};
 const click=(e:React.MouseEvent)=>{if(suppress.current){e.preventDefault();e.stopPropagation();suppress.current=false;}};
 return{...order,held,down,move,end,click};
}
