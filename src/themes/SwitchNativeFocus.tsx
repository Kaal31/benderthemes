import {useContext} from 'react';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {CURSOR_DEFAULTS} from './switchCursorDefaults';
import {mergeSceneEffect} from './switchSceneLayout';
import {SwitchMaterial,resolvePalette} from './SwitchMaterial';
import {SwitchFocusShadow} from './SwitchFocusShadow';
import type {SwitchEffect} from '../switchThemes';

/** The owning button sizes Cursor3 at runtime; its root file size is a template. */
export function SwitchNativeFocus({effects,modern,dark,width,height}:{effects:Record<string,SwitchEffect>;modern:boolean;dark:boolean;width:number;height:number}){
 const native=useContext(SwitchNativeContext),defaults=CURSOR_DEFAULTS[modern?'modern':'classic'];
 if((native?.nativePanes?.Cursor3?.RootPane??effects.cursorRoot)?.Visible===false)return null;
 const node=defaults.P_Main;
 const effect=resolvePalette(mergeSceneEffect(mergeSceneEffect(node.effect,native?.nativeMaterials?.Cursor3?.P_Main),native?.nativePanes?.Cursor3?.P_Main??effects.cursor),dark)!;
 const stroke=Math.max(0,Math.min(effect.borderWidth??5,width/2,height/2)),radius=Math.min(effect.radius??0,width/2,height/2);
 const outline=`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect x="${stroke/2}" y="${stroke/2}" width="${width-stroke}" height="${height-stroke}" rx="${Math.max(0,radius-stroke/2)}" fill="none" stroke="white" stroke-width="${stroke}"/></svg>`)}`;
 return <div data-native-focus="" style={{position:'absolute',left:'50%',top:'50%',translate:'-50% -50%',width,height,pointerEvents:'none'}}>
  <SwitchFocusShadow {...{effects,modern,dark}}/>
  {effect.Visible!==false&&<div style={{position:'absolute',inset:0,maskImage:`url("${outline}")`,maskSize:'100% 100%'}}><SwitchMaterial surfaceStyle={false} effect={{...effect,borderWidth:undefined,shadow:undefined,radius:undefined}}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial></div>}
 </div>;
}
