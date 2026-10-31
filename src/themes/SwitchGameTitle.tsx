import {useSwitchFont} from './useSwitchFont';
import {useMemo} from 'react';
import type {SwitchConversion,SwitchEffect} from '../switchThemes';
import {SwitchSceneTree} from './SwitchSceneTree';
import {SCENE_DEFAULTS,SCENE_MOTION} from './switchSceneDefaults';
import {mergeSceneEffect} from './switchSceneLayout';
import {SwitchMaterial,resolvePalette} from './SwitchMaterial';
import {composeSwitchAnimations} from './switchAnimationFiles';
import {SwitchText} from './SwitchText';
/** The host supplies the selected slot pivot; all title descendants remain native. */
export function SwitchGameTitle({conversion,effects,title,running,dark,modern,enabled,unitX,unitY}:{conversion:SwitchConversion;effects:Record<string,SwitchEffect>;title:string;running:boolean;dark:boolean;modern:boolean;enabled:boolean;unitX:number;unitY:number}){
 const {family,revision}=useSwitchFont();
 const profile=modern?'modern':'classic',defaults=SCENE_DEFAULTS[profile];
 const patches=useMemo(()=>{
  const result:Record<string,SwitchEffect>={};
  const aliases:Record<string,Record<string,string>>={RdtBtnIconGame:{N_Tip:'gameTooltip',L_Balloon:'gameBalloon'},RdtBalloon:{RootPane:'gameTitle',N_Root:'gameTitleRoot',N_Size:'gameTitle',T_Main:'gameTitleText',N_Card:'gameCardRoot',P_Card:'gameTitle:P_Card',P_Reset:'gameTitle:P_Reset',T_Sub:'gameTitle:T_Sub',P_Color:'gameTitleBackground'}};
  for(const [file,nodes] of Object.entries(defaults))for(const node of nodes){
   const native=conversion.nativePanes?.[file]?.[node.name];
   // Native identities take precedence. Compatibility aliases support old cached skins.
   const patch=conversion.nativePanes?native:effects[aliases[file]?.[node.name]];if(patch)result[node.slot]=patch;
  }
  // Static root scale is already included in the host's slot dimensions.
  const root=result['RdtBtnIconGame:RootPane'];if(root)result['RdtBtnIconGame:RootPane']={...root,Scale:{X:1,Y:1},Rotation:{X:0,Y:0,Z:0}};
  // qlaunch reserves card-prefix width only while a cartridge prefix is present.
  // The host library has no inserted-cartridge service, so its prefix is absent.
  const balloon=conversion.nativePanes?.RdtBtnIconGame?.L_Balloon??effects.gameBalloon;
  const canvas=document.createElement('canvas'),context=canvas.getContext('2d');
  const fontSize=defaults.RdtBalloon.find(node=>node.name==='T_Main')?.text?.fontSize[0]??28;
  if(context)context.font=`${fontSize}px ${family}`;
  const measured=(context?.measureText(title).width??title.length*fontSize*.6)+4;
  const limit=Math.min(balloon?.Size?.X??532,measured);
  if(limit<532){for(const name of ['N_Size','N_Scissor','P_Reset','W_Fade','P_Color'])result['RdtBalloon:'+name]=mergeSceneEffect({Size:{X:limit,Y:42}},result['RdtBalloon:'+name]);for(const name of ['N_Scroll','T_Main','T_Sub'])result['RdtBalloon:'+name]=mergeSceneEffect({Size:{X:limit,Y:42}},result['RdtBalloon:'+name]);}
  if(!running)result['RdtBalloon:T_Sub']=mergeSceneEffect(result['RdtBalloon:T_Sub'],{Visible:false});
  result['RdtBalloon:N_Card']=mergeSceneEffect(result['RdtBalloon:N_Card'],{Visible:false});
  result['RdtBalloon:N_Offset']=mergeSceneEffect({Size:{X:0,Y:42}},result['RdtBalloon:N_Offset']);
  return result;
 },[conversion,effects,defaults,running,title,family,revision]);
 const materials=useMemo(()=>Object.fromEntries(Object.entries(conversion.nativeMaterials??{}).flatMap(([file,list])=>Object.entries(list).map(([name,effect])=>[file+':'+name,effect]))),[conversion]);
 const animations=useMemo(()=>{
  const native=Object.entries(conversion.nativeAnimations??{}).filter(([file])=>file in defaults).flatMap(([file,list])=>list.map(a=>({...a,pane:file+':'+a.pane})));
  const compatible=conversion.nativeAnimations?[]:conversion.animations.filter(a=>a.pane==='gameTooltip'||a.pane==='gameBalloon').map(a=>({...a,pane:'RdtBtnIconGame:'+(a.pane==='gameTooltip'?'N_Tip':'L_Balloon')}));
  const scale=conversion.nativePanes?.RdtBtnIconGame?.RootPane?.Scale;
  const normalized=native.map(a=>a.pane==='RdtBtnIconGame:RootPane'?{...a,tracks:a.tracks.map(t=>[0,1,6,7].includes(t.property)?{...t,keys:t.keys.map(k=>{const divisor=(t.property===0||t.property===6?scale?.X:scale?.Y)??1;return divisor?{...k,value:k.value/divisor,slope:k.slope/divisor}:k;})}:t)}:a);
  return composeSwitchAnimations(SCENE_MOTION[profile].RdtBalloon,[...compatible,...normalized],conversion.animationFiles);
 },[conversion,defaults,profile]);
 return <div className="dht-switch-native-title" style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,transform:`scale(${unitX},${unitY})`,pointerEvents:'none'}}>
  <SwitchSceneTree list={defaults.RdtBtnIconGame.filter(node=>node.name==='RootPane'||node.name==='N_Tip'||node.parent==='N_Tip')} root="RootPane" parts={defaults} effects={patches} {...{animations,dark,enabled}} materials={materials} events={['active','enter','rest','focus']} render={(node,effect)=>{
   if(node.name==='N_Scissor')return {style:{clipPath:'inset(0)'}};
   if(node.name==='P_Reset'||node.name==='W_Fade'||node.name==='P_Color'||node.name==='P_Card')return {hidden:true};
   if(node.type==='txt1'){
    const text=node.name==='T_Main'?title:running?'Playing':'',metrics=node.text;
    // The native title uses the text as a mask for the P_Color pane.
    const mask=defaults.RdtBalloon.find(p=>p.name==='P_Color')!,maskInk=resolvePalette(mergeSceneEffect(mergeSceneEffect(mask.effect,mask.material?materials[mask.material]:undefined),patches[mask.slot]),dark);
    const corners=effect.corners?.ColorTR?{ColorTL:effect.corners.ColorTR,ColorTR:effect.corners.ColorTR,ColorBL:effect.corners.ColorBR??effect.corners.ColorTR,ColorBR:effect.corners.ColorBR??effect.corners.ColorTR}:undefined;
    return {className:node.name==='T_Main'?'dht-switch-native-title-text':undefined,content:<div style={{position:'absolute',inset:0,display:'flex'}}><SwitchMaterial surfaceStyle={false} effect={{...maskInk,corners:corners?Object.fromEntries(Object.entries(corners).map(([key,rgba])=>[key,rgba.map((value,i)=>value*(maskInk?.corners?.[key]?.[i]??255)/255)])):maskInk?.corners}}><SwitchText text={text} {...{metrics,enabled}} marquee={node.name==='T_Main'}/></SwitchMaterial></div>};
   }
   return {};
  }}/>
 </div>;
}
