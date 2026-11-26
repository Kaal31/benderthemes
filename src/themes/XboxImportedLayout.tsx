import {useEffect,useRef,useState} from "react";
import type {CSSProperties} from "react";
import {gameIconUrls,openSteam,type Game,type SteamPlace} from '../library';
import {resolveXboxLabel,xboxGameImageKind} from './xboxInfoLabels';
export interface XboxLayout {width:number;height:number;partial:boolean;warnings:string[];nodes:{kind:string;x:number;y:number;width:number;height:number;text:string;source:string;color:string;fontSize:number;fontWeight?:string;fontStyle?:string;align?:string;border?:string;direction?:string;motion?:{effect:string;start:number[];end:number[];duration:number;delay:number}[];image?:string;imageSource?:string;destination?:SteamPlace;shape?:string}[];menu:{x:number;y:number;width:number;height:number;spacing:number;color:string;focusColor:string;focusImage?:string;focusBackground?:string;focusBorder?:string;itemArt?:XboxMenuArt[];focusArt?:XboxMenuArt[]}}
interface XboxMenuArt{kind:string;x:number;y:number;width:number;height:number;text:string;color:string;image?:string;imageSource?:string;fontSize?:number;fontWeight?:string;fontStyle?:string;align?:string}
function XboxLayoutImage({image,source,game}:{image?:string;source?:string;game?:Game}){
 const kind=xboxGameImageKind(source??''),urls=image?[image]:game&&kind?[...new Set([...(kind==='icon'?gameIconUrls(game):[]),...game.art.portrait,...game.art.landscape])]:[];
 const key=urls.join('|'),[state,setState]=useState({key,index:0}),index=state.key===key?state.index:0;
 return urls[index]?<img src={urls[index]} alt="" draggable={false} onError={()=>setState({key,index:index+1})} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:null;
}
function XboxNode({node,style,children,animate,onActivate}:{node:XboxLayout["nodes"][number];style:CSSProperties;children:React.ReactNode;animate:boolean;onActivate?:()=>void}){
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
 return <div ref={ref} style={style} role={onActivate?'button':undefined} tabIndex={onActivate?0:undefined} onClick={onActivate} onKeyDown={onActivate?e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();onActivate();}}:undefined}>{children}</div>;
}
export function XboxImportedLayout({layout,width,height,items,selected,user,time,onPick,animate=true,onNavigate=openSteam}:{layout:XboxLayout;width:number;height:number;items:{label:string;game?:Game}[];selected:number;user:string;time:string;onPick:(index:number)=>void;animate?:boolean;onNavigate?:(destination:SteamPlace)=>void}){
 const scale=Math.min(width/layout.width,height/layout.height),menu=layout.menu;
 const visible=Math.max(1,Math.floor(menu.height/menu.spacing)),first=Math.max(0,Math.min(selected-Math.floor(visible/2),items.length-visible));
 const box=(node:{x:number;y:number;width:number;height:number}):CSSProperties=>({position:"absolute",left:node.x,top:node.y,width:node.width,height:node.height});
 const resolve=(text:string,source:string,label=items[selected]?.label)=>resolveXboxLabel(text,source,{user,time,date:new Date().toLocaleDateString(),label});
 const shape=(node:XboxLayout["nodes"][number]):CSSProperties=>({background:node.color,border:node.border?`1px solid ${node.border}`:undefined,boxSizing:"border-box",borderRadius:node.shape==="ellipse"?"50%":node.shape==="roundedbox"||node.shape==="roundrect"?8:0,...(node.shape==="triangle"?{clipPath:({up:"polygon(50% 0,100% 100%,0 100%)",down:"polygon(0 0,100% 0,50% 100%)",left:"polygon(0 50%,100% 0,100% 100%)",right:"polygon(0 0,100% 50%,0 100%)"} as Record<string,string>)[node.direction??"up"]}:{} )});

 return <div className="dht-xbox-imported-layout" data-partial={layout.partial} style={{position:"absolute",left:(width-layout.width*scale)/2,top:(height-layout.height*scale)/2,width:layout.width,height:layout.height,transform:`scale(${scale})`,transformOrigin:"0 0"}}>
  {layout.nodes.map((node,index)=>{const action=node.destination&&['library','settings','mainmenu','power'].includes(node.destination)?()=>onNavigate(node.destination!):undefined;return <XboxNode key={index} node={node} animate={animate} onActivate={action} style={{...box(node),color:node.color,fontSize:node.fontSize,fontWeight:node.fontWeight as CSSProperties["fontWeight"],fontStyle:node.fontStyle,textAlign:node.align as CSSProperties['textAlign'],overflow:'hidden',whiteSpace:'pre-wrap',pointerEvents:action?'auto':'none',cursor:action?'pointer':undefined,...(node.kind==='shape'?shape(node):{})}}>{node.kind==='image'?<XboxLayoutImage image={node.image} source={node.imageSource??node.source} game={items[selected]?.game}/>:node.kind==='text'?resolve(node.text,node.source):null}</XboxNode>})}
  <div className="dht-xbox-imported-menu" style={{...box(menu),overflow:"hidden"}}>{items.slice(first,first+visible).map((item,offset)=>{const index=first+offset,on=index===selected;return <div key={index} data-selected={on} onClick={()=>onPick(index)} style={{position:"absolute",left:0,right:0,top:offset*menu.spacing,height:menu.spacing,fontSize:Math.min(28,menu.spacing*.7),display:"flex",alignItems:"center",padding:(on?(menu.focusArt??menu.itemArt):menu.itemArt)?.length?0:"0 8px",color:on?menu.focusColor:menu.color,background:on?(menu.focusImage?`url(${menu.focusImage}) center/100% 100%`:menu.focusBackground??"#ffffff20"):undefined,border:on&&menu.focusBorder?`1px solid ${menu.focusBorder}`:undefined,cursor:"pointer",boxSizing:"border-box",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{(on?(menu.focusArt??menu.itemArt):menu.itemArt)?.length?(on?(menu.focusArt??menu.itemArt):menu.itemArt)!.map((part,index)=><span key={index} style={{...box(part),color:part.color,fontSize:part.fontSize,fontWeight:part.fontWeight as CSSProperties["fontWeight"],fontStyle:part.fontStyle,display:"flex",alignItems:"center",justifyContent:part.align==="right"?"flex-end":part.align==="center"?"center":"flex-start"}}>{part.kind==="image"?<XboxLayoutImage image={part.image} source={part.imageSource} game={item.game}/>:part.kind==="label"?resolve(part.text||"$INFO[ListItem.Label]","",item.label):null}</span>):item.label}</div>;})}</div>
 </div>;
}
