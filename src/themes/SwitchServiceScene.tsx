import {useContext,useMemo} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SwitchPicture} from './SwitchPicture';
import {SwitchMaterial,panelColor} from './SwitchMaterial';
import {SwitchLoading} from './SwitchLoading';
import {switchProgressMask} from './switchProgressMask';
import {SCENE_DEFAULTS} from './switchSceneDefaults';
import {mergeSceneEffect} from './switchSceneLayout';
import {resolvePalette} from './SwitchMaterial';
import {SwitchText} from './SwitchText';

export function SwitchServiceScene({file,size,effects,animations,modern,dark,enabled,progress=0,label='Install',pressed=false,onActivate}:{file:string;size:number[];effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;progress?:number;label?:string;pressed?:boolean;onActivate?:()=>void}){
 const native=useContext(SwitchNativeContext),runtime:Record<string,SwitchEffect>=file==='RdtBtnChangeUser'?{'RdtBtnChangeUser:N_L':{Position:{X:-98,Y:0}},'RdtBtnChangeUser:N_R':{Position:{X:15,Y:0}}}:{};
 const progressMask=useMemo(()=>{
  const nodes=SCENE_DEFAULTS[modern?'modern':'classic'].ProgressBar,mask=nodes.find(n=>n.name==='P_ProgressMask')!,fill=nodes.find(n=>n.name==='P_Progress')!;
  const effect=resolvePalette(mergeSceneEffect(mergeSceneEffect(mask.effect,native?.nativeMaterials?.ProgressBar?.P_ProgressMask),native?.nativePanes?.ProgressBar?.P_ProgressMask),dark)!;
  return switchProgressMask(mask,effect,fill);
 },[native,modern,dark]);
 return <div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}><SwitchNativeScene {...{file,effects,animations,modern,dark,enabled}} referencedParts runtime={runtime} rootSize={size} events={['enter','rest',...(pressed?['touch']:[])]} render={(node,effect)=>{
  const resource=node.slot.split(':')[0],picture=native?.nativePictures?.[resource]?.[node.name];
  if(node.part==='WaiticonS_Sound')return {content:<SwitchLoading {...{effects,animations,modern,dark,enabled}} file="WaiticonS_Sound" magnify={node.partMagnify}/>};
  if(node.name==='B_Hit')return {content:<button aria-label={label} onClick={onActivate} style={{position:'absolute',inset:0,width:'100%',height:'100%',background:'transparent',border:0,pointerEvents:'auto'}}/>};
  if(node.name==='T_TimeLimit')return {hidden:true};
  if(node.name==='P_BtnTouch')return {hidden:!pressed,style:{background:panelColor(effect),opacity:pressed?1:0}};
  if(node.type==='txt1')return {content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchText text={label} metrics={node.text} enabled={enabled}/></SwitchMaterial>};
  if(node.name==='P_ProgressMask')return {hidden:true};
  const style=node.name==='P_Progress'?{...(resource==='ProgressBar'?progressMask:{}),clipPath:`inset(0 ${100-Math.max(0,Math.min(100,progress))}% 0 0)`}:undefined;
  if(picture&&node.type==='pic1')return {alphaMask:true,style,content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchPicture picture={picture}/></SwitchMaterial>};
  if(node.type==='pic1')return {style:{...style,background:panelColor(effect)}};
  return {};
 }}/></div>;
}
