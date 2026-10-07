import {BLADE_BOUNDARIES} from "./bladeBoundaries";
import {useEffect,useRef,useState} from "react";
import {MenuState} from "../common";
import {useStage} from "../input";

/** MC360 TheDialogs: right-hand 100px edge joined to its tile at x=388 (720x576). */
export function BladesGuide({menu,assets,animate}:{menu:MenuState;assets:Record<string,string>;animate:boolean}){
 const {W,H}=useStage(),sx=W/720,sy=H/576;
 const panel=useRef<HTMLDivElement>(null);
 const current=menu.stack[menu.stack.length-1];
 const [retained,setRetained]=useState<typeof current|undefined>(current);
 const open=menu.isOpen&&!!current;
 useEffect(()=>{if(open){setRetained(current);return;}const timer=setTimeout(()=>setRetained(undefined),animate?500:0);return()=>clearTimeout(timer);},[open,current,animate]);
 const top=open?current:retained;
 useEffect(()=>{const host=panel.current,item=host?.querySelector<HTMLElement>('[data-selected=true]');if(host&&item){if(item.offsetTop<host.scrollTop)host.scrollTop=item.offsetTop;else if(item.offsetTop+item.offsetHeight>host.scrollTop+host.clientHeight)host.scrollTop=item.offsetTop+item.offsetHeight-host.clientHeight;}},[top?.sel,menu.stack.length]);
 if(!top)return null;
 const outline=`polygon(${BLADE_BOUNDARIES["guide-blade-overlay-edge-right"].map(([y,x])=>`${x*100*sx+2}px ${y*H}px`).join(",")},100% 100%,100% 0)`;
 const texture=(name:string)=>`url("${assets[name]??""}")`;
 return <div className="dht-menu-backdrop" onClick={e=>e.target===e.currentTarget&&menu.handle({btn:"b",repeat:false})} style={{position:"absolute",inset:0,zIndex:50,background:"#0008",pointerEvents:open?"auto":"none"}}>
  <style>{`@keyframes dhtBladesGuideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes dhtBladesGuideOut{to{transform:translateX(100%)}}.dht-menu--blades .dht-menu-item{cursor:pointer;background-size:100% 100%}.dht-menu--blades .dht-menu-item:focus-visible{outline:2px solid #546d2d;outline-offset:-4px}@media(prefers-reduced-motion:reduce){.dht-menu--blades{animation:none!important}}`}</style>
  <div className="dht-menu dht-menu--blades" data-closing={!open} style={{position:"absolute",right:0,top:0,bottom:0,width:432*sx,color:"#35382e",fontFamily:'"DHT MC360",Tahoma,sans-serif',animation:animate?(open?"dhtBladesGuideIn 250ms linear":"dhtBladesGuideOut 250ms linear 250ms forwards"):undefined,boxSizing:"border-box",padding:0,margin:0,border:0,borderRadius:0,maxWidth:"none",background:"transparent"}}>
   <div className="dht-guide-fill" style={{position:"absolute",inset:0,clipPath:outline,backgroundImage:texture("background-grey"),backgroundSize:"100% 100%",backgroundColor:"#b6b9a9"}}/>
   <div className="dht-guide-tile" style={{position:"absolute",left:100*sx,right:0,top:0,bottom:0,backgroundImage:texture("guide-blade-overlay-tile"),backgroundSize:"100% 100%"}}/>
   <img className="dht-guide-edge" src={assets["guide-blade-overlay-edge-right"]} aria-hidden style={{position:"absolute",left:0,top:0,height:"100%",width:100*sx,pointerEvents:"none"}}/>
   <div style={{position:"absolute",top:50*sy,left:85*sx,right:30*sx,fontSize:28*sy,color:"#f2f4ec",textShadow:"0 1px 2px #182212"}}>{top.title??"Xbox Guide"}</div>
   <div ref={panel} style={{position:"absolute",left:52*sx,right:30*sx,top:140*sy,bottom:110*sy,overflowY:"auto",scrollbarWidth:"thin"}}>
    {top.items.map((it,i)=><button key={i} className="dht-menu-item" data-selected={i===top.sel} disabled={it.disabled||!open} onClick={()=>menu.clickItem(i)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,width:"100%",minHeight:48*sy,border:0,padding:`${8*sy}px ${30*sx}px`,textAlign:"left",font:"inherit",fontSize:20*sy,color:"inherit",opacity:it.disabled?.4:1,backgroundColor:"transparent",backgroundImage:texture(i===top.sel?"guide-button-focus":"guide-button-nofocus")}}><span>{it.label}</span><span>{it.checked?"✓":it.sub?"›":""}</span></button>)}
   </div>
   <div style={{position:"absolute",bottom:35*sy,left:85*sx,right:30*sx,display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:20*sy,color:"#eee"}}><span style={{display:"flex",gap:8,alignItems:"center"}}><img src={assets["button-b"]} style={{width:24*sy,height:24*sy}}/>Back</span><span style={{display:"flex",gap:8,alignItems:"center"}}>Select<img src={assets["button-a"]} style={{width:24*sy,height:24*sy}}/></span></div>
  </div>
 </div>;
}

