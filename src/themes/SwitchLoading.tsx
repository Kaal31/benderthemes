import {useContext} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeContext,SwitchWidgetTree} from './SwitchWidgetTree';
import {SwitchMaterial} from './SwitchMaterial';
import {SwitchPicture} from './SwitchPicture';
const fallback={source:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84"><path d="M42 7a35 35 0 1 1-35 35" fill="none" stroke="white" stroke-width="7"/></svg>'),texture:'host-loading-fallback',material:'P_Wait',uv:[0,0,1,0,0,1,1,1],transform:[0,0,0,1,1],wrapS:0,wrapT:4};

/** Native loading glyph: its texture rotates while the pane stays in place. */
export function SwitchLoading({effects,animations,modern,dark,enabled,magnify=[1,1],file='Waiticon'}:{effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;magnify?:number[];file?:'Waiticon'|'WaiticonS'|'WaiticonS_Sound'}){
 const native=useContext(SwitchNativeContext),picture=native?.nativePictures?.[file]?.P_Wait;
 return <div role="progressbar" aria-label="Loading" style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,transform:`scale(${magnify[0]},${magnify[1]})`}}><SwitchWidgetTree file={file} {...{effects,animations,modern,dark,enabled}} events={['enter','wait']} render={(node,effect)=>node.name==='P_Wait'?{alphaMask:true,content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchPicture picture={picture??fallback}/></SwitchMaterial>}:{} }/></div>;
}
