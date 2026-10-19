import {useContext} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SwitchMaterial} from './SwitchMaterial';
import {SwitchPicture} from './SwitchPicture';

/** The owning service controls visibility; the referenced layout paints the badge. */
export function SwitchStatusBadge({file,size,effects,animations,modern,dark,enabled}:{file:'IconError'|'RdtIconNewFrd';size:number[];effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const native=useContext(SwitchNativeContext);
 return <div data-native-status-badge={file} style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}><SwitchNativeScene {...{file,effects,animations,modern,dark,enabled}} rootSize={size} events={['enter','rest','attention','icon']} render={(node,effect)=>{
  if(node.type!=='pic1')return {};
  const picture=native?.nativePictures?.[file]?.[node.name];
  return {alphaMask:true,content:<SwitchMaterial surfaceStyle={false} effect={effect}>{picture?<SwitchPicture picture={picture}/>:<span style={{display:'block',width:'100%',height:'100%',background:'white',borderRadius:effect.radius??(node.name==='P_Base'?'50%':0)}}/>}</SwitchMaterial>};
 }}/></div>;
}
