import {useContext} from 'react';
import type {ReactNode} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeContext,SwitchWidgetTree} from './SwitchWidgetTree';
import {WIDGET_DEFAULTS} from './switchWidgetDefaults';
import {SwitchMaterial} from './SwitchMaterial';
import {SwitchPicture} from './SwitchPicture';
import {SwitchText} from './SwitchText';

export interface SwitchSaveChoice{label:string;detail?:string;available:boolean;onActivate:()=>void}
export type SwitchContentFile='DCntImageText'|'DCntPictText'|'DCntTextOption'|'DCntSelectSaveData'|'DCntPclOnOff';
/** Native dialog content paints only host-supplied text, images and actions.
 * Missing save timestamps/account services never become invented console data. */
export function SwitchDialogContent({file,text,image,secondaryImage,imageVariant='primary',saveData,...shared}:{file:SwitchContentFile;text:string;image?:ReactNode;secondaryImage?:ReactNode;imageVariant?:'primary'|'secondary';saveData?:{cloud:SwitchSaveChoice;local:SwitchSaveChoice};effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const native=useContext(SwitchNativeContext),parts=WIDGET_DEFAULTS[shared.modern?'modern':'classic'],nodes=parts[file],height=Math.abs(native?.nativePanes?.[file]?.N_Btn?.Position?.Y??nodes.find(n=>n.name==='N_Btn')?.position[1]??400);
 const runtime={...Object.fromEntries(['T_TimeCloud','T_TimeLocal','T_NoDataCloud','T_NoDataLocal'].map(name=>['widget:'+file+':'+name,{Visible:true}])),['widget:'+file+':P_00']:{Visible:imageVariant==='primary'},['widget:'+file+':P_01']:{Visible:imageVariant==='secondary'}};
 return <div data-native-dialog-content={file} style={{position:'relative',height}}><div style={{position:'absolute',left:0,right:0,top:0,height:0}}><SwitchWidgetTree file={file} {...shared} parts={parts} runtime={runtime} rootSize={[0,0]} events={['enter']} render={(node,effect,path)=>{
  const cloud=path.some(p=>p.name==='N_Cloud'||p.name==='N_StatusCloud'),local=path.some(p=>p.name==='N_Local'||p.name==='N_StatusLocal'),choice=cloud?saveData?.cloud:local?saveData?.local:undefined;
  if(file==='DCntSelectSaveData'&&node.name==='N_Select')return {hidden:!saveData};
  if(node.name==='B_Hit'&&choice)return {content:<button aria-label={choice.label} disabled={!choice.available} onClick={choice.onActivate} style={{position:'absolute',inset:0,opacity:0,pointerEvents:choice.available?'auto':'none'}}/>};
  if(node.name==='N_BtnFocusKey'||node.name==='P_BtnTouch'||node.name==='P_BtnDecideKey')return {hidden:true};
  if(node.type==='txt1'){
   if(node.name.startsWith('T_Time'))return {hidden:!choice?.detail,content:<SwitchMaterial effect={effect} surfaceStyle={false}><SwitchText text={choice?.detail??''} metrics={node.text} enabled={shared.enabled}/></SwitchMaterial>};
   if(node.name.startsWith('T_NoData'))return {hidden:!!choice?.detail,content:<SwitchMaterial effect={effect} surfaceStyle={false}><SwitchText text={choice?.available?'Available':'Unavailable'} metrics={node.text} enabled={shared.enabled}/></SwitchMaterial>};
   return {content:<SwitchMaterial effect={effect} surfaceStyle={false}><SwitchText text={choice?.label??text} metrics={node.text} enabled={shared.enabled} multiline/></SwitchMaterial>};
  }
  const resource=node.slot.split(':')[1],picture=native?.nativePictures?.[resource]?.[node.name];
  if(node.name==='P_00'||node.name==='P_01'){
   const content=node.name==='P_00'?image:secondaryImage;
   return {hidden:(node.name==='P_00'?imageVariant!=='primary':imageVariant!=='secondary')||!content&&!picture,alphaMask:true,content:<div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:effect.radius??0}}><SwitchMaterial effect={effect} surfaceStyle={false}>{content??(picture?<SwitchPicture picture={picture}/>:undefined)}</SwitchMaterial></div>};
  }
  if(node.type==='pic1')return {alphaMask:!!picture,content:<SwitchMaterial effect={effect} surfaceStyle={false}>{picture?<SwitchPicture picture={picture}/>:<span style={{display:'block',width:'100%',height:'100%',background:'white'}}/>}</SwitchMaterial>};
  return {};
 }}/></div></div>;
}
