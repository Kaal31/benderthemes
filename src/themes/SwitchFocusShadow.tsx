import {useContext} from 'react';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SwitchShadow} from './SwitchShadow';
import {CURSOR_DEFAULTS} from './switchCursorDefaults';
import {mergeSceneEffect} from './switchSceneLayout';
import {resolvePalette} from './SwitchMaterial';
import type {SwitchEffect} from '../switchThemes';

/** Native cursor shadow passes follow the actual focus adapter bounds. The
 * cursor's outline/texture composition is a separate paint operation. */
export function SwitchFocusShadow({effects,modern,dark}:{effects:Record<string,SwitchEffect>;modern:boolean;dark:boolean}){
 const native=useContext(SwitchNativeContext),defaults=CURSOR_DEFAULTS[modern?'modern':'classic'];
 if((native?.nativePanes?.Cursor3?.RootPane??effects.cursorRoot)?.Visible===false)return null;
 return <span data-native-focus-shadow="" style={{position:'absolute',inset:0,pointerEvents:'none'}}>{(['P_Main','P_Grow'] as const).map(name=>{
  const node=defaults[name],legacy=name==='P_Main'?'cursor':'cursorGlow',pane=native?.nativePanes?.Cursor3?.[name]??effects[legacy];
  const effect=resolvePalette(mergeSceneEffect(mergeSceneEffect(node.effect,native?.nativeMaterials?.Cursor3?.[name]),pane),dark)!;
  return effect.Visible===false?null:<SwitchShadow key={name} effect={{...effect,shadowFunction:effect.shadowFunction??0}} alpha={String(node.alpha/255)}/>;
 })}</span>;
}
