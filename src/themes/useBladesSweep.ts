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
  const incomingFill=host.querySelector<HTMLElement>(":scope > .dht-blades-page-fill");
  const originalClip=incomingFill?.style.clipPath;
  if(forward){
   // The destination background must not creep beneath the old left stack
   // while its header travels across the screen from the right.
   if(incomingFill)incomingFill.style.clipPath=incomingFill.style.clipPath.split("var(--dht-blade-x)").join(`${64+to*52}px`);
   // Once the old selected spine collapses, its narrower resting texture is
   // the left boundary of the retained page, not the old wide header texture.
   const tab=host.querySelector<HTMLElement>(`.dht-x360b-tab[data-blade-index="${from}"]`);
   const image=tab?.querySelector("img"),fill=layer.querySelector<HTMLElement>(".dht-blades-page-fill");
   if(tab&&image?.complete&&image.naturalWidth&&fill){
    try{
     const sample=document.createElement("canvas");sample.width=image.naturalWidth;sample.height=129;
     const ctx=sample.getContext("2d");
     if(ctx){
      ctx.drawImage(image,0,0,sample.width,129);
      const pixels=ctx.getImageData(0,0,sample.width,129).data;
      const left=parseFloat(tab.style.left),leftPoints:string[]=[];
      for(let row=0;row<129;row++){
       let x=0;while(x<sample.width-1&&pixels[(row*sample.width+x)*4+3]<192)x++;
       leftPoints.push(`${left+x/sample.width*94+1}px ${row/128*host.clientHeight}px`);
      }
      const previous=fill.style.clipPath.slice(8,-1).split(",");
      fill.style.clipPath=`polygon(${[...leftPoints,...previous.slice(129)].join(",")})`;
     }
    }catch{/* Keep the original silhouette when an external image cannot be sampled. */}
   }
  }
  host.appendChild(layer);
  // Match the moving metal silhouette; a rectangular wipe leaves colored
  // wedges visible through the curved transparent shoulder of the blade.
  let contour=BLADE_BOUNDARIES[forward?"blades-size4-header":`blades-size${Math.min(3,5-from)}-right-nf`];
  const metalWidth=forward?78:94,height=host.clientHeight;
  if(!forward){
   // A returning blade uncovers the new page on its LEFT. Keep the old
   // page only beyond its trailing RIGHT silhouette, never under the metal
   // face/transparent shoulder where it becomes a colored inter-panel seam.
   const image=moving.querySelector("img");
   if(image?.complete&&image.naturalWidth){
    try{
     const sample=document.createElement("canvas");sample.width=image.naturalWidth;sample.height=129;
     const ctx=sample.getContext("2d");
     if(ctx){
      ctx.drawImage(image,0,0,sample.width,129);
      const pixels=ctx.getImageData(0,0,sample.width,129).data;
      contour=Array.from({length:129},(_,row)=>{
       let x=sample.width-1;while(x>0&&pixels[(row*sample.width+x)*4+3]<32)x--;
       return [row/128,(x+1)/sample.width];
      });
     }
    }catch{/* External artwork without canvas access keeps its supplied outline. */}
   }
  }
  const cut=(x:number)=>{
   const points=contour.map(([y,edge])=>`${x+edge*metalWidth+(forward?1:4)}px ${y*height}px`);
   return `polygon(${forward?["0px 0px",...points,`0px ${height}px`].join(","):[...points,`${width}px ${height}px`,`${width}px 0px`].join(",")})`;
  };
  const options={duration:200,easing:"cubic-bezier(.33,1,.68,1)",fill:"both" as FillMode};
  const cover=layer.animate([{clipPath:cut(start)},{clipPath:cut(end)}],options);
  const blade=moving.animate([{left:`${start}px`},{left:`${end}px`}],options);
  const previousZ=moving.style.zIndex;moving.style.zIndex="50";
  let done=false;
  const cleanup=()=>{if(done)return;done=true;layer.remove();cover.cancel();blade.cancel();moving.style.zIndex=previousZ;if(incomingFill&&originalClip!==undefined)incomingFill.style.clipPath=originalClip;};
  stop.current=cleanup;
  void cover.finished.then(cleanup,()=>{});
 });
 useLayoutEffect(()=>()=>stop.current(),[]);
 return {root,capture};
}
