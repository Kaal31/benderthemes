import type {SwitchEffect} from "../switchThemes";
import {SwitchMaterial,effectStyle,panelColor,nxColor,resolvePalette} from "./SwitchMaterial";
/** The launcher is four independent glyph primitives, not a single merged tint. */
export function SwitchLauncher({effects,size,dark}:{effects:Record<string,SwitchEffect>;size:number;dark:boolean}){
 return <div className="dht-switch-launcher" style={{position:"absolute",left:"50%",top:"50%",width:160,height:160,transform:`translate(-50%,-50%) scale(${size/160})`}}>
  <div style={{position:"absolute",inset:0,...effectStyle(effects["dock:allSoftware:base"]),background:effects["dock:allSoftware:base"]?.Visible===false?"transparent":panelColor(resolvePalette({...effects["dock:allSoftware:base"],palette:effects["dock:allSoftware:base"]?.palette??{white:[31,0]}},dark)),borderRadius:effects["dock:allSoftware:base"]?.radius??80}}/>
  {[0,1,2,3].map(i=>{const name=`P_Pict_${String(i).padStart(2,"0")}`,part=effects[`allSoftwarePart:${name}`],base=effects[`allSoftwarePart:P_PictBase_${String(i).padStart(2,"0")}`];return <div key={name} className="dht-switch-launcher-part" style={{position:"absolute",left:`calc(50% + ${part?.Position?.X??(i%2?16:-16)}px)`,top:`calc(50% - ${part?.Position?.Y??(i<2?16:-16)}px)`,width:part?.Size?.X??28,height:part?.Size?.Y??28,transform:`translate(-50%,-50%) rotate(${-(part?.Rotation?.Z??0)}deg) scale(${part?.Scale?.X??1},${part?.Scale?.Y??1})`,display:part?.Visible===false?"none":undefined}}>
    {base&&base.Visible!==false&&<div style={{position:"absolute",inset:0,background:panelColor(base),...effectStyle(base)}}/>}
    <SwitchMaterial effect={part}><div style={{width:"100%",height:"100%",background:part?.black&&part.black[3]>0?nxColor(part.black):"#444"}}/></SwitchMaterial>
  </div>;})}
 </div>;
}
