import {SwitchFocusShadow} from './SwitchFocusShadow';
import {SwitchPicture} from './SwitchPicture';
import {useContext} from 'react';
import {SwitchNativeContext} from './SwitchWidgetTree';
import type {ReactNode} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchDockLabel,SwitchNewBadge} from './SwitchShared';
import {SwitchWidgetTree} from './SwitchWidgetTree';
import {SwitchMaterial,panelColor,nxColor,effectStyle} from './SwitchMaterial';
import {sampleTrack} from './switchConversion';
import {Icon} from '../common';

const FILES:Record<string,string>={news:'RdtBtnNtf',shop:'RdtBtnShop',album:'RdtBtnPvr',controller:'RdtBtnCtrl',settings:'RdtBtnSet',power:'RdtBtnPow',online:'RdtBtnLR',gameShare:'RdtBtnSplay',virtualCards:'RdtBtnVgc'};
function glyph(id:string,name:string):ReactNode{
 const svg=(body:ReactNode)=><svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{body}</svg>;
 if(id==='controller'){
  if(name==='P_Form')return svg(<g transform="rotate(45 24 24)"><rect x="15" y="2" width="18" height="44" rx="9"/></g>);
  return <svg width="100%" height="100%" viewBox="0 0 10 10"><circle cx="5" cy="5" r={name==='P_Stick'?3.5:3} fill={name==='P_Stick'?'none':'white'} stroke="white" strokeWidth="1.5"/></svg>;
 }
 if(id==='power')return svg(<><path d="M24 5v21"/><path d="M15 10a17 17 0 1 0 18 0"/></>);
 if(id==='news')return name==='P_PictNtf_01'?<div style={{width:'100%',height:'100%',background:'white'}}/>:svg(<path d="M7 8h34v27H26l-10 8v-8H7z"/>);
 if(id==='album')return svg(<><rect x="4" y="7" width="40" height="34" rx="2"/><path d="M7 37l12-14 8 10 6-7 8 11"/><circle cx="14" cy="16" r="3"/></>);
 if(id==='shop')return svg(<><path d="M8 18h32l2 24H6z"/><path d="M16 18v-4a8 8 0 0 1 16 0v4"/></>);
 if(id==='settings')return <Icon name="gear" size={40} color="white"/>;
 if(id==='online')return svg(name==='P_LR_01'?<><circle cx="14" cy="17" r="2"/><circle cx="34" cy="30" r="2"/></>:<><rect x="4" y="6" width="17" height="36" rx="8"/><rect x="27" y="6" width="17" height="36" rx="8"/></>);
 if(id==='gameShare')return name==='P_Pict_00'?svg(<><rect x="3" y="14" width="16" height="28" rx="3"/><rect x="29" y="14" width="16" height="28" rx="3"/></>):svg(<path d="M3 24q21-18 42 0"/>);
 if(id==='virtualCards')return name==='P_Pict_00'?svg(<><rect x="7" y="3" width="34" height="42" rx="3"/><path d="M13 7h22v10H13z"/></>):<div style={{width:'100%',height:'100%',background:'white'}}/>;
 return null;
}

export function SwitchAppletTree({id,label,art,effects,animations,modern,dark,enabled,active,pressed,scale,onActivate}:{id:string;label:string;art?:string;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;active:boolean;pressed:boolean;scale:number;onActivate:()=>void}){
 const file=FILES[id],native=useContext(SwitchNativeContext),pictures=native?.nativePictures?.[file];
 const legacy=effects[`dock:${id}`];
 const main:Record<string,string>={news:'P_PictNtf_00',shop:'P_Pict',album:'P_Pict_00',controller:'P_Form',settings:'P_Pict',power:'P_Pict_00',online:'P_LR_00',gameShare:'P_Pict_00',virtualCards:'P_Pict_00'};
 const resolved=legacy?{...effects,[`widget:${file}:${main[id]}`]:{...legacy,palette:legacy.palette??{white:[0,0,0,0],black:[0,0,0,0]}}}:effects;
 return <div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,transform:`scale(${scale})`}}>
  <div style={{position:"absolute",inset:0,...effectStyle(effects[`widget:${file}:legacyPosition`])}}><SwitchWidgetTree {...{animations,modern,dark,enabled}} effects={resolved} file={file} events={[active?'active':'inactive',...(active?['focus','effect']:[]),...(pressed?['decide','touch']:[])]} render={(node,effect)=>{
   if(node.name==='N_Tip'){
    const exit=animations.filter(a=>a.pane==='dockLabelRoot'&&a.event==='exit').flatMap(a=>a.tracks.filter(t=>t.property===16).map(t=>sampleTrack(t,a.frames)));
    const controlled=animations.some(a=>a.pane===node.slot&&a.tracks.some(t=>t.property===16||t.property===17));
    return {hidden:!active&&!controlled&&!exit.some(alpha=>alpha>0)};
   }
   if(node.name==='L_Balloon')return {content:<SwitchDockLabel {...{label,effects,animations,enabled,active,dark,modern}}/>};
   if(node.name==='L_New')return {hidden:true,content:<SwitchNewBadge {...{effects,animations,dark,modern,enabled}}/>};
   if(node.name==='B_Hit')return {style:{pointerEvents:'auto'},content:<button aria-label={label} onClick={e=>{e.stopPropagation();onActivate();}} style={{width:'100%',height:'100%',background:'transparent',border:0}}/>};
   if(node.name==='UF_Cursor')return {content:<SwitchFocusShadow {...{effects,modern,dark}}/>,hidden:!active,style:{width:80,height:80,marginLeft:-40,marginTop:-40,border:`${effects.cursor?.borderWidth??3}px solid ${nxColor(effects.cursor?.white,'#00c3e3')}`,borderRadius:40}};
   if(node.name==='P_PictBase')return {className:'dht-switch-dock-base',style:{background:panelColor(effect),borderRadius:effect.radius??36}};
   if(['P_Effect','P_BtnDecideKey','P_BtnTouch'].includes(node.name))return {hidden:node.name==='P_Effect'?!active:!pressed,style:{background:panelColor(effect),borderRadius:effect.radius??36}};
   if(node.type==='pic1'){
    if(node.name==='P_PictMask')return {hidden:true};
   // P_Color is composited through the applet's picture mask on the console.
   // A CSS background paints an opaque rectangle when native colors are used.
   if(node.name==='P_Color')return {hidden:!!pictures?.P_PictMask,attrs:{'data-nx-color-mask':true},content:<SwitchMaterial surfaceStyle={false} effect={effect}>{glyph(id,node.name)}</SwitchMaterial>};
    const primary=node.name===main[id];
    const picture=pictures?.[node.name];
    const shape=art?(primary?<img src={art} alt="" style={{width:'100%',height:'100%',objectFit:'fill'}}/>:null):picture?<SwitchPicture picture={picture}/>:glyph(id,node.name);
    // Picture panes use a quad, not an inline text baseline. A one-pixel mask
    // scaled to screen size amplifies even a small baseline offset enormously.
    return {alphaMask:true,content:shape&&<div style={{position:'absolute',inset:0,display:'flex'}}><SwitchMaterial surfaceStyle={false} effect={{...effect,Position:undefined,Scale:undefined,Rotation:undefined,Size:undefined}}>{shape}</SwitchMaterial></div>};
   }
   return {};
  }}/></div>
 </div>;
}
