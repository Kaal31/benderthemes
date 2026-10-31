import {X360PageEra} from './X360PageEra';
import {useAssets} from '../assets';
import {useContext,CSSProperties,ReactNode} from 'react';
import {nxeIcons,NxeIconName} from './nxeIcons.generated';
import {useHome} from '../common';
export {nxeIcons};
const referenceNames:Partial<Record<NxeIconName,string>>={disc:'icon-disc',games:'icon-gamelib',music:'icon-musiclib',pictures:'icon-picturelib',video:'icon-videolib',settings:'icon-settings',avatar:'avatar-silhouette',guide:'legend-menu','button-a':'legend-a','button-b':'legend-b','button-x':'legend-x','button-y':'legend-y','channel-small':'mobychannelzero'};
export function useNxeIcons(){
 const era=useContext(X360PageEra);
 const original=useAssets(era==='kinect'?'x360-kinect-dash':'x360-nxe-dash');
 return Object.fromEntries(Object.entries(nxeIcons).map(([key,value])=>[key,original[referenceNames[key as NxeIconName]??'']??value])) as Record<NxeIconName,string>;
}
export function NxeOriginalIcon({name,size=32,style}:{name:NxeIconName;size?:number;style?:CSSProperties}){
 const icons=useNxeIcons();
 return <img data-nxe-original-icon={name} data-nxe-artwork={icons[name]===nxeIcons[name]?"fallback":"original"} src={icons[name]} alt="" aria-hidden="true" draggable={false} style={{width:size,height:size,objectFit:'contain',flexShrink:0,...style}}/>;
}
export function NxeButtonHint({button,label,size=24}:{button:'a'|'b'|'x'|'y';label:ReactNode;size?:number}){
 return <span style={{display:'inline-flex',alignItems:'center',gap:5,verticalAlign:'middle',whiteSpace:'nowrap'}}><NxeOriginalIcon name={`button-${button}`} size={size}/><span>{label}</span></span>;
}
export function NxeWordmark(){const {settings}=useHome(),era=useContext(X360PageEra);return era==='kinect'||settings.x360.showThemeHubLogo===false?null:<NxeOriginalIcon name="online" style={{position:'absolute',right:88,top:603,width:145,height:108,pointerEvents:'none'}}/>;}
