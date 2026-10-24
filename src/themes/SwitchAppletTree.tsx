import {originalAppletGlyph} from './SwitchOriginalGlyph';
import {SwitchFocusShadow} from './SwitchFocusShadow';
import {SwitchPicture} from './SwitchPicture';
import {useContext} from 'react';
import {SwitchNativeContext} from './SwitchWidgetTree';

import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchDockLabel,SwitchNewBadge} from './SwitchShared';
import {SwitchWidgetTree} from './SwitchWidgetTree';
import {SwitchMaterial,panelColor,nxColor,effectStyle,resolvePalette} from './SwitchMaterial';
import {sampleTrack} from './switchConversion';


const FILES:Record<string,string>={news:'RdtBtnNtf',shop:'RdtBtnShop',album:'RdtBtnPvr',controller:'RdtBtnCtrl',settings:'RdtBtnSet',power:'RdtBtnPow',online:'RdtBtnLR',gameShare:'RdtBtnSplay',virtualCards:'RdtBtnVgc'};
const glyph=originalAppletGlyph;

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
   if(node.name==='P_Color')return {hidden:!!art||!!pictures?.P_PictMask,attrs:{'data-nx-color-mask':true},content:<SwitchMaterial surfaceStyle={false} effect={effect}>{glyph(id,node.name)}</SwitchMaterial>};
    const primary=node.name===main[id];
    const picture=pictures?.[node.name];
    // NXThemes applet replacements use channel flags 0x05050505: source
    // alpha feeds every channel. Black RGB in the archive is not black ink.
    const shape=art?(primary?<img src={art} alt="" style={{width:'100%',height:'100%',objectFit:'fill',filter:'brightness(0) invert(1)'}}/>:null):picture?<SwitchPicture picture={picture}/>:glyph(id,node.name);
    // The installer's C_W=100 custom-picture binding uses the neutral glyph
    // color. It must not reuse slot 100's static button-backing gray. Keep
    // explicit registers and other palette indices intact.
    const pictureEffect=art&&primary?resolvePalette(effect,dark,false,{100:dark?[220,220,220,255]:[110,120,121,255]}):effect;
    // Picture panes use a quad, not an inline text baseline. A one-pixel mask
    // scaled to screen size amplifies even a small baseline offset enormously.
    return {alphaMask:true,content:shape&&<div style={{position:'absolute',inset:0,display:'flex'}}><SwitchMaterial surfaceStyle={false} effect={{...pictureEffect,Position:undefined,Scale:undefined,Rotation:undefined,Size:undefined}}>{shape}</SwitchMaterial></div>};
   }
   return {};
  }}/></div>
 </div>;
}
