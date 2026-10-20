import type {ReactNode,CSSProperties,HTMLAttributes} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {useSwitchPaneMotion} from './switchConversion';
import {effectStyle} from './SwitchMaterial';

export function SwitchMotionPane({children,pane,animations,events,enabled,effect,style,unitX=1,unitY=1,className,relativePosition=false,playbackKey,...dom}: {
 children?:ReactNode;pane:string;animations:SwitchAnimation[];events:string[];enabled:boolean;effect?:SwitchEffect;style?:CSSProperties;unitX?:number;unitY?:number;className?:string;relativePosition?:boolean;playbackKey?:string|number;
}&Omit<HTMLAttributes<HTMLDivElement>,'children'|'style'>){
 const ref=useSwitchPaneMotion(animations,pane,events,enabled,effect,unitX,unitY,relativePosition,playbackKey);
 const animatedVisibility=animations.some(a=>a.pane===pane&&events.includes(a.event)&&a.tracks.some(t=>t.property===17));
 // FLVI replaces the authored visibility flag. Keeping display:none would
 // prevent the player from revealing a pane, even when visibility is animated.
 const base=animatedVisibility?{...effect,Visible:undefined}:effect;
 return <div {...dom} ref={ref} data-nx-pane={pane} className={className} style={{position:'absolute',inset:0,transformOrigin:'center',...effectStyle(relativePosition?{...base,Position:undefined}:base),...style,...(animatedVisibility?{display:style?.display==='none'?undefined:style?.display,visibility:effect?.Visible===false?'hidden':undefined}:{})}}>{children}</div>;
}
