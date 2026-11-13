import type {ReactNode,CSSProperties} from "react";
import type {SwitchConversion} from "../switchThemes";
import {useSwitchPaneMotion} from "./switchConversion";
import {effectStyle,SwitchMaterial} from "./SwitchMaterial";
export function SwitchSecondary({conversion,pane,enabled,scale,children,style}:{conversion?:SwitchConversion;pane:string;enabled:boolean;scale:number;children?:ReactNode;style?:CSSProperties}){
 const base={...conversion?.effects?.[pane],...conversion?.panes[pane]};
 const ref=useSwitchPaneMotion(conversion?.animations??[],pane,["enter","rest"],enabled,base,scale,scale);
 return <div ref={ref} className="dht-switch-secondary" data-pane={pane} style={{position:"absolute",inset:0,transformOrigin:"50% 50%",...(base.radius!==undefined?{overflow:"hidden",borderRadius:base.radius*scale}:{}),...effectStyle({...base,radius:undefined,Position:base.Position?{X:(base.Position.X??0)*scale,Y:(base.Position.Y??0)*scale}:undefined}),...(base.Size?{width:(base.Size.X??1280)*scale,height:(base.Size.Y??720)*scale}:{}),...style}}>{children}</div>;
}
export function SwitchSecondaryBackground({conversion,image,enabled,scale}:{conversion?:SwitchConversion;image?:string|null;enabled:boolean;scale:number}){
 return <SwitchSecondary conversion={conversion} pane="secondaryBackground" enabled={enabled} scale={scale} style={{pointerEvents:"none"}}><SwitchMaterial effect={conversion?.effects?.background}><div className="dht-switch-secondary-wallpaper" style={{position:"absolute",inset:0,backgroundImage:image?`url(${image})`:undefined,backgroundSize:"cover",backgroundPosition:"center"}}/></SwitchMaterial></SwitchSecondary>;
}
