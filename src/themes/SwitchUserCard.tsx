import {useContext,useLayoutEffect,useState} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SwitchMaterial} from './SwitchMaterial';
import {SwitchPicture} from './SwitchPicture';
import {SwitchLoading} from './SwitchLoading';
import {SwitchText} from './SwitchText';

/** Account data comes from the host; layout, text and avatar primitives are native. */
export function SwitchUserCard({label,avatar,effects,animations,modern,dark,enabled,file='UserIconName',status,notice=false,syncing=false}:{file?:'UserIconName'|'UserIconNameStatus';status?:string;notice?:boolean;syncing?:boolean;label:string;avatar?:string;effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const native=useContext(SwitchNativeContext),[image,setImage]=useState<{source?:string;state:'loading'|'ready'|'missing'}>({state:'missing'});
 useLayoutEffect(()=>{
  if(!avatar){setImage({state:'missing'});return;}
  let disposed=false;const picture=new Image();setImage({source:avatar,state:'loading'});picture.src=avatar;
  void picture.decode().then(()=>{if(!disposed)setImage({source:avatar,state:'ready'});},()=>{if(!disposed)setImage({source:avatar,state:'missing'});});
  return()=>{disposed=true;};
 },[avatar]);
 const ready=image.source===avatar&&image.state==='ready',loading=image.source===avatar&&image.state==='loading';
 return <div data-native-user-card={file} style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}><SwitchNativeScene file={file} {...{effects,animations,modern,dark,enabled}} runtime={{[file+':N_NoImage']:{Visible:true},[file+':L_LoadingImage']:{Visible:true},[file+':P_Notice']:{Visible:true}}} rootSize={[0,0]} events={['enter']} render={(node,effect)=>{
  if(node.name==='N_NoImage')return {hidden:ready||loading};
  if(node.name==='L_LoadingImage')return {hidden:!loading,content:loading?<SwitchLoading {...{effects,animations,modern,dark,enabled}} file="WaiticonS" magnify={node.partMagnify}/>:undefined};
  const picture=native?.nativePictures?.[file]?.[node.name];
  if(node.name==='P_Notice')return {hidden:!notice,alphaMask:true,content:<SwitchMaterial surfaceStyle={false} effect={effect}>{picture?<SwitchPicture picture={picture}/>:<span style={{color:'white',fontSize:node.size[1],lineHeight:1}}>!</span>}</SwitchMaterial>};
  if(node.name==='P_IcoSyncBase')return {hidden:!syncing};
  if(node.type==='txt1')return {content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchText text={node.name==='T_Status'?status??'':label} metrics={node.text} enabled={enabled} marquee/></SwitchMaterial>};
  if(node.name==='P_Image')return {hidden:!ready,alphaMask:true,content:ready?<div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:effect.radius??0}}><SwitchMaterial surfaceStyle={false} effect={effect} textureMotion><img src={avatar} alt="Profile picture" style={{display:'block',width:'100%',height:'100%',objectFit:'cover'}}/></SwitchMaterial></div>:undefined};
  if(node.type==='pic1')return {alphaMask:!!picture,content:<SwitchMaterial surfaceStyle={false} effect={effect}>{picture?<SwitchPicture picture={picture}/>:node.name==='P_IcoQuestion'?<span style={{color:'white',fontSize:node.size[1],lineHeight:1}}>?</span>:<span style={{display:'block',width:'100%',height:'100%',background:'white',borderRadius:effect.radius??0}}/>}</SwitchMaterial>};
  return {};
 }}/></div>;
}
