import {useEffect,useRef} from "react";
import {MenuState} from "../common";

/** MC360 guide uses its original sliced shell and button state textures. */
export function BladesGuide({menu,assets,animate}:{menu:MenuState;assets:Record<string,string>;animate:boolean}){
 const panel=useRef<HTMLDivElement>(null);
 const top=menu.stack[menu.stack.length-1];
 useEffect(()=>{panel.current?.querySelector('[data-selected=true]')?.scrollIntoView({block:"nearest"});},[top?.sel,menu.stack.length]);
 if(!menu.isOpen || !top)return null;
 const texture=(name:string)=>`url("${assets[name]??""}")`;
 return <div className="dht-menu-backdrop" onClick={e=>e.target===e.currentTarget&&menu.handle({btn:"b",repeat:false})} style={{position:"absolute",inset:0,zIndex:50,background:"#0006"}}>
  <style>{`@keyframes dhtBladesGuideIn{from{transform:translateX(-100%)}to{transform:none}}.dht-menu--blades .dht-menu-item{cursor:pointer;background-size:100% 100%}.dht-menu--blades .dht-menu-item:focus-visible{outline:2px solid #546d2d}`}</style>
  <div className="dht-menu dht-menu--blades" style={{position:"absolute",left:0,top:0,bottom:0,width:510,color:"#35382e",fontFamily:'"DHT MC360",Tahoma,sans-serif',animation:animate?"dhtBladesGuideIn 250ms ease-out":undefined,backgroundColor:"#b8bdb2",backgroundImage:texture("guide-blade-overlay-tile"),backgroundSize:"100% 100%"}}>
   <img src={assets["guide-blade-overlay-edge-right"]} aria-hidden style={{position:"absolute",right:-55,top:0,height:"100%",width:65,pointerEvents:"none"}}/>
   <div style={{position:"absolute",top:55,left:38,right:24,fontSize:32}}>{top.title??"Xbox Guide"}</div>
   <img src={assets["guide-panel-mc360ad"]} aria-hidden style={{position:"absolute",left:35,right:25,bottom:92,width:440,height:62,objectFit:"fill"}}/>
   <div ref={panel} style={{position:"absolute",left:26,right:14,top:120,bottom:178,overflowY:"auto"}}>
    {top.items.map((it,i)=><button key={i} className="dht-menu-item" data-selected={i===top.sel} disabled={it.disabled} onClick={()=>menu.clickItem(i)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,width:"100%",minHeight:48,border:0,padding:"10px 24px",textAlign:"left",font:"inherit",fontSize:23,color:"inherit",opacity:it.disabled?.4:1,backgroundColor:"transparent",backgroundImage:texture(i===top.sel?"guide-button-focus":"guide-button-nofocus")}}><span>{it.label}</span><span>{it.checked?"✓":it.sub?"›":""}</span></button>)}
   </div>
   <div style={{position:"absolute",bottom:37,left:40,display:"flex",alignItems:"center",gap:10,fontSize:22}}><img src={assets["button-b"]} style={{width:25,height:25}}/>Back <img src={assets["button-a"]} style={{width:25,height:25,marginLeft:195}}/>Select</div>
  </div>
 </div>;
}
