import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import type {SwitchScenePane} from './switchSceneTypes';
import {sampleTrack} from './switchConversion';
import {switchPaneOrigin} from './switchPaneOrigin';

/** qlaunch packs these boxes from right to left. Their file coordinates are
 * editor poses; battery width is selected by Hud_BatteryNum (0/32/48/64).
 * See LayoutDocs /examples/disabling-clock-movement-caused-by-battery/. */
export function switchHudFlow(list:SwitchScenePane[],patches:Record<string,SwitchEffect>,motion:SwitchAnimation[],percentage:boolean,level:number,replacedFiles:string[]=[]){
 const names=['L_BatteryConsole','N_BatteryNum','N_Margin_00','N_Signal','N_Margin_01','N_Time'];
 const panes=names.map(name=>list.find(p=>p.name===name&&p.parent==='N_Root'));
 if(panes.some(p=>!p))return {};
 const digits=String(Math.round(Math.max(0,Math.min(1,level))*100)).length;
 const battery=panes[1]!,effect=patches[battery.slot],state=percentage&&level>=0?digits:0;
 let width=[0,32,48,64][state];
 if(replacedFiles.some(f=>f.endsWith('Hud_BatteryNum.bflan')))width=effect?.Size?.X??battery.size[0];
 for(const a of motion)if(a.pane===battery.slot&&a.event==='battery')for(const t of a.tracks)if(t.property===8)width=sampleTrack(t,state);
 const out:Record<string,{x:number;width:number}>={};let right=0;
 for(const pane of panes){
  const p=pane!,patch=patches[p.slot],visible=patch?.Visible??p.visible;
  const w=visible?(p.name==='N_BatteryNum'?width:patch?.Size?.X??p.size[0]):0;
  const origin=patch?.OriginX??switchPaneOrigin(p.origin).x,pivot=origin===2?1:origin===1?0:.5;
  out[p.name]={x:-right-w*(1-pivot),width:w};right+=w;
 }
 return out;
}
