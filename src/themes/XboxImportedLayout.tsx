import {useEffect,useRef} from "react";
import type {CSSProperties} from "react";
export interface XboxLayout {width:number;height:number;partial:boolean;warnings:string[];nodes:{kind:string;x:number;y:number;width:number;height:number;text:string;source:string;color:string;fontSize:number;align?:string;border?:string;direction?:string;motion?:{effect:string;start:number[];end:number[];duration:number;delay:number}[];image?:string;shape?:string}[];menu:{x:number;y:number;width:number;height:number;spacing:number;color:string;focusColor:string;focusImage?:string;focusBackground?:string;focusBorder?:string;itemArt?:XboxMenuArt[];focusArt?:XboxMenuArt[]}}
interface XboxMenuArt{kind:string;x:number;y:number;width:number;height:number;text:string;color:string;image?:string}
function XboxNode({node,style,children,animate}:{node:XboxLayout["nodes"][number];style:CSSProperties;children:React.ReactNode;animate:boolean}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!animate||reduced?.matches)return;
  const players=(node.motion??[]).map(motion=>{
   const frame=(value:number[]):Keyframe=>motion.effect==="fade"?{opacity:Math.max(0,Math.min(1,value[0]/100))}:motion.effect==="slide"?{transform:`translate(${value[0]}px,${value[1]}px)`}:{transform:`scale(${value[0]/100})`};
   return ref.current?.animate([frame(motion.start),frame(motion.end)],{duration:motion.duration,delay:motion.delay,fill:"both",easing:"linear"});
  });
  const stop=()=>{if(reduced?.matches)players.forEach(player=>player?.finish());else if(document.hidden)players.forEach(player=>player?.pause());else players.forEach(player=>player?.play());};
  document.addEventListener("visibilitychange",stop);reduced?.addEventListener?.("change",stop);
  return()=>{players.forEach(player=>player?.cancel());document.removeEventListener("visibilitychange",stop);reduced?.removeEventListener?.("change",stop);};
 },[node,animate]);
 return <div ref={ref} style={style}>{children}</div>;
}
export function XboxImportedLayout({layout,width,height,items,selected,user,time,onPick,animate=true}:{layout:XboxLayout;width:number;height:number;items:{label:string}[];selected:number;user:string;time:string;onPick:(index:number)=>void;animate?:boolean}){
 const scale=Math.min(width/layout.width,height/layout.height),menu=layout.menu;
 const visible=Math.max(1,Math.floor(menu.height/menu.spacing)),first=Math.max(0,Math.min(selected-Math.floor(visible/2),items.length-visible));
 const box=(node:{x:number;y:number;width:number;height:number}):CSSProperties=>({position:"absolute",left:node.x,top:node.y,width:node.width,height:node.height});
 const resolve=(text:string,source:string)=>{const original=source||text,key=original.replace(/\$/g,"").toLowerCase();if(key==="time"||key==="system.time")return time;if(key==="date"||key==="system.date")return new Date().toLocaleDateString();if(key.includes("profilename")||key==="user")return user;if(original.includes("$"))return original.replace(/\$[^$]+\$/g,"—");if(["ip","mbtemp","cputemp","dvdtitle"].includes(key))return "—";return original;};
 const shape=(node:XboxLayout["nodes"][number]):CSSProperties=>({background:node.color,border:node.border?`1px solid ${node.border}`:undefined,boxSizing:"border-box",borderRadius:node.shape==="ellipse"?"50%":node.shape==="roundedbox"||node.shape==="roundrect"?8:0,...(node.shape==="triangle"?{clipPath:({up:"polygon(50% 0,100% 100%,0 100%)",down:"polygon(0 0,100% 0,50% 100%)",left:"polygon(0 50%,100% 0,100% 100%)",right:"polygon(0 0,100% 50%,0 100%)"} as Record<string,string>)[node.direction??"up"]}:{} )});

 return <div className="dht-xbox-imported-layout" data-partial={layout.partial} style={{position:"absolute",left:(width-layout.width*scale)/2,top:(height-layout.height*scale)/2,width:layout.width,height:layout.height,transform:`scale(${scale})`,transformOrigin:"0 0"}}>
  {layout.nodes.map((node,index)=><XboxNode key={index} node={node} animate={animate} style={{...box(node),color:node.color,fontSize:node.fontSize,textAlign:node.align as CSSProperties["textAlign"],overflow:"hidden",whiteSpace:"pre-wrap",pointerEvents:"none",...(node.kind==="shape"?shape(node):{})}}>{node.image?<img src={node.image} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>:node.kind==="text"?resolve(node.text,node.source):null}</XboxNode>)}
  <div className="dht-xbox-imported-menu" style={{...box(menu),overflow:"hidden"}}>{items.slice(first,first+visible).map((item,offset)=>{const index=first+offset,on=index===selected;return <div key={index} data-selected={on} onClick={()=>onPick(index)} style={{position:"absolute",left:0,right:0,top:offset*menu.spacing,height:menu.spacing,fontSize:Math.min(28,menu.spacing*.7),display:"flex",alignItems:"center",padding:"0 8px",color:on?menu.focusColor:menu.color,background:on?(menu.focusImage?`url(${menu.focusImage}) center/100% 100%`:menu.focusBackground??"#ffffff20"):undefined,border:on&&menu.focusBorder?`1px solid ${menu.focusBorder}`:undefined,cursor:"pointer",boxSizing:"border-box",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{(on?menu.focusArt:menu.itemArt)?.length?(on?menu.focusArt:menu.itemArt)!.map((part,index)=><span key={index} style={{...box(part),color:part.color,display:"flex",alignItems:"center"}}>{part.image?<img src={part.image} alt="" style={{width:"100%",height:"100%"}}/>:part.kind==="label"?(part.text.toLowerCase().includes("listitem.label")||!part.text?item.label:part.text.startsWith("$")?"":part.text):null}</span>):item.label}</div>;})}</div>
 </div>;
}
