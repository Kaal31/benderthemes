import {BLADE_BOUNDARIES} from "./bladeBoundaries";
import {useLayoutEffect,useRef} from "react";

/** Retain the outgoing page until the moving opaque blade uncovers its successor. */
export function useBladesSweep(width:number){
 const root=useRef<HTMLDivElement>(null);
 const pending=useRef<{from:number;to:number;layer:HTMLDivElement}|null>(null);
 const stop=useRef<()=>void>(()=>{});
 const capture=(from:number,to:number,animate:boolean)=>{
  stop.current();pending.current=null;
  const host=root.current;
  if(!host||!animate||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const layer=document.createElement("div");
  layer.className="dht-blades-outgoing";layer.setAttribute("aria-hidden","true");
  Object.assign(layer.style,{position:"absolute",inset:"0",zIndex:"15",pointerEvents:"none"});
  layer.style.setProperty("--dht-blade-x",`${64+from*52}px`);
  for(const selector of [".dht-blades-page-fill",".dht-x360b-blade"]){
   const source=host.querySelector(selector);if(!source)continue;
   const clone=source.cloneNode(true) as HTMLElement;
   [clone,...Array.from(clone.querySelectorAll<HTMLElement>("*"))].forEach(n=>{n.style.transition="none";n.style.animation="none";n.removeAttribute("id");});
   const originals=source.querySelectorAll("canvas"),copies=clone.querySelectorAll("canvas");
   copies.forEach((canvas,i)=>canvas.getContext("2d")?.drawImage(originals[i],0,0));
   layer.appendChild(clone);
  }
  pending.current={from,to,layer};
 };
 useLayoutEffect(()=>{
  const move=pending.current,host=root.current;if(!move||!host)return;
  pending.current=null;
  const {from,to,layer}=move,forward=to>from;
  const moving=forward?host.querySelector<HTMLElement>(".dht-blades-active-edge"):host.querySelector<HTMLElement>(`.dht-x360b-tab[data-blade-index="${from}"]`);
  if(!moving)return;
  const start=forward?width-100-(4-to)*52:64+from*52-44;
  const end=forward?64+to*52-44:width-100-(4-from)*52;
  host.appendChild(layer);
  // Match the moving metal silhouette; a rectangular wipe leaves colored
  // wedges visible through the curved transparent shoulder of the blade.
  const contour=BLADE_BOUNDARIES[forward?"blades-size4-header":`blades-size${Math.min(3,5-from)}-right-nf`];
  const metalWidth=forward?78:94,height=host.clientHeight;
  const cut=(x:number)=>{
   const points=contour.map(([y,edge])=>`${x+edge*metalWidth+1}px ${y*height}px`);
   return `polygon(${forward?["0px 0px",...points,`0px ${height}px`].join(","):[...points,`${width}px ${height}px`,`${width}px 0px`].join(",")})`;
  };
  const options={duration:200,easing:"cubic-bezier(.33,1,.68,1)",fill:"both" as FillMode};
  const cover=layer.animate([{clipPath:cut(start)},{clipPath:cut(end)}],options);
  const blade=moving.animate([{left:`${start}px`},{left:`${end}px`}],options);
  const previousZ=moving.style.zIndex;moving.style.zIndex="50";
  let done=false;
  const cleanup=()=>{if(done)return;done=true;layer.remove();cover.cancel();blade.cancel();moving.style.zIndex=previousZ;};
  stop.current=cleanup;
  void cover.finished.then(cleanup,()=>{});
 });
 useLayoutEffect(()=>()=>stop.current(),[]);
 return {root,capture};
}
