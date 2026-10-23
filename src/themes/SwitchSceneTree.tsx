import {SwitchMaterial} from "./SwitchMaterial";
import {SwitchShadow} from './SwitchShadow';
import {useId} from 'react';
import type {CSSProperties,ReactNode} from 'react';
import type {SwitchEffect,SwitchAnimation} from '../switchThemes';
import type {SwitchScenePane} from './switchSceneTypes';
import {mergeSceneEffect,scenePaneLayout} from './switchSceneLayout';
import {useSwitchPaneMotion} from './switchConversion';
import {SwitchTextureMotionContext} from './switchTextureMotion';
export type SceneRender=(node:SwitchScenePane,effect:SwitchEffect,path:SwitchScenePane[])=>{content?:ReactNode;style?:CSSProperties;hidden?:boolean;alphaMask?:boolean;partEvents?:string[];replacePart?:boolean;className?:string;attrs?:Record<string,string|number|boolean>};
type Props={list:SwitchScenePane[];effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];dark:boolean;events:string[];enabled:boolean;render:SceneRender;root?:string;kind?:'widget'|'scene';parts?:Record<string,SwitchScenePane[]>;depth?:number;order?:Record<string,number>;materials?:Record<string,SwitchEffect>;parentAlpha?:string;path?:SwitchScenePane[]};
function SceneNode({node,...props}:Omit<Props,'root'>&{node:SwitchScenePane}){
 const {list,effects,animations,dark,events,enabled,render,kind='scene',parts,depth=0,order,materials}=props;
 const path=[...(props.path??[]),node];
 const parent=list.find(p=>p.name===node.parent),materialNode=node.material&&materials?.[node.material]?{...node,effect:mergeSceneEffect(node.effect,materials[node.material])}:node,layout=scenePaneLayout(materialNode,parent,effects[node.slot],parent?effects[parent.slot]:undefined,dark),custom=render(node,layout.effect,path);
 const alphaVariable='--nx-alpha-'+useId().replace(/[^a-zA-Z0-9]/g,'').toLowerCase(),nativeAlpha=node.influenceAlpha!==undefined;
 // Nintendo panes can opt out of their parent's alpha. CSS group opacity cannot
 // express that: an opaque child cannot undo a composited transparent ancestor.
 const ownAlpha=`var(${alphaVariable})`,paintAlpha=node.influenceAlpha===false?ownAlpha:`calc(${ownAlpha} * (${props.parentAlpha??'1'}))`;
 const ref=useSwitchPaneMotion(animations,node.slot,events,enabled,layout.base,1,1,true,'',undefined,nativeAlpha?alphaVariable:'opacity');
 const attrs=kind==='widget'?{'data-widget-pane':node.name,'data-widget-slot':node.slot}:{'data-scene-pane':node.name,'data-scene-slot':node.slot};
 const partSource=!custom.replacePart&&node.part&&parts?.[node.part];
 const part=partSource&&node.partOverrides?partSource.map(child=>{
  const override=node.partOverrides?.[child.name];
  return override?{...child,alpha:override.alpha??child.alpha,material:override.material??child.material,effect:mergeSceneEffect(child.effect,override.effect),partOverrides:{...child.partOverrides,...override.partOverrides}}:child;
 }):partSource;
 const partEffects=part&&node.partOverrides?{...effects,...Object.fromEntries(part.filter(child=>node.partOverrides?.[child.name]?.geometry).map(child=>[child.slot,mergeSceneEffect(effects[child.slot],node.partOverrides?.[child.name]?.geometry)]))}:effects;
 const magnify=node.partMagnify??[1,1],partSize=layout.size.map((value,i)=>magnify[i]!==0?value/magnify[i]:value);
 const children=list.filter(p=>p.parent===node.name).sort((a,b)=>(order?.[a.name]??list.indexOf(a))-(order?.[b.name]??list.indexOf(b)));
 const style:CSSProperties={...layout.style,...(custom.style?.marginLeft!==undefined||custom.style?.marginTop!==undefined?{translate:'none'}:{}),...custom.style,...(custom.hidden?{display:'none'}:{})};
 // The native rounded-quad shader keeps circular corners when its quad is
 // stretched. CSS scales the corner ellipse unless its radii compensate.
 if(node.type==='pic1'&&layout.effect.radius){const sx=Math.abs(layout.base.Scale?.X??1),sy=Math.abs(layout.base.Scale?.Y??1);if(sx&&sy&&Math.abs(sx-sy)>.0001){const radius=Math.min(layout.effect.radius*Math.min(sx,sy),layout.size[0]*sx/2,layout.size[1]*sy/2);style.borderRadius=`${radius/sx}px / ${radius/sy}px`;}}
 const paintStyle:CSSProperties={position:'absolute',inset:0,boxSizing:'border-box',borderRadius:style.borderRadius,overflow:node.type==='pic1'&&(layout.effect.radius??0)>0?'hidden':undefined,opacity:paintAlpha};
 // Picture masks cast a silhouette shadow. A CSS box shadow would expose the
 // transparent quad around every glyph as a rectangular outline.
 const volumeMotion=animations.some(a=>a.pane===node.slot&&events.includes(a.event)&&a.tracks.some(t=>t.property===25));
 const nativeShadow=layout.effect.shadowFunction!==undefined||volumeMotion;
 if(nativeShadow)style.boxShadow='none';
 (style as Record<string,unknown>)['--dht-nx-shadow-volume']=layout.effect.shadowOpacity??1;
 if(custom.alphaMask&&!nativeShadow){
  style.boxShadow='none';
  const e=layout.effect,c=e.shadowColor??e.white??[0,0,0,136],angle=e.shadowAngle??0,distance=e.shadowDistance??0;
  if(e.shadowDraw!==false&&e.shadow){
   const alpha=Math.max(0,Math.min(255,(c[3]??255)*(e.shadowOpacity??1)))/255;
   const filter=`drop-shadow(${Math.cos(angle)*distance}px ${Math.sin(angle)*distance}px ${e.shadow}px rgba(${c[0]},${c[1]},${c[2]},${alpha}))`;
   if(nativeAlpha)paintStyle.filter=filter;else style.filter=filter;
  }
 }
 if(nativeAlpha){
  (style as Record<string,unknown>)[alphaVariable]=custom.style?.opacity??node.alpha/255;style.opacity=1;
  for(const key of Object.keys(style))if(key.startsWith('background')||key==='boxShadow'||key.startsWith('border')&&!key.includes('Radius')){(paintStyle as Record<string,unknown>)[key]=(style as Record<string,unknown>)[key];delete (style as Record<string,unknown>)[key];}
  const border=layout.effect.borderWidth??parseFloat(String(paintStyle.borderWidth??paintStyle.border??0));
  (style as Record<string,unknown>)['--dht-nx-border-width']=`${Number.isFinite(border)?border:0}px`;
  // Native borders overlay the picture; CSS borders must not shrink its texture.
  if(paintStyle.border){paintStyle.border='none';paintStyle.borderWidth=0;}
 }
 const childProps={...props,path,parentAlpha:nativeAlpha?paintAlpha:props.parentAlpha};
 const textureChannels=animations.filter(a=>a.pane===node.slot&&events.includes(a.event)).flatMap(a=>a.tracks).reduce((bits,t)=>bits|(t.property===19?1:t.property===20?2:t.property===22?4:t.property===23?8:t.property===24?16:0),0);
 const colorTracks=animations.filter(a=>a.pane===node.slot&&events.includes(a.event)).flatMap(a=>a.tracks),vertexMask=colorTracks.reduce((bits,t)=>bits|(t.property>=32&&t.property<48?1<<(t.property-32):0),0),materialMask=colorTracks.reduce((bits,t)=>bits|(t.property>=64&&t.property<72?1<<(t.property-64):0),0);
 const backgroundColor=paintStyle.background||paintStyle.backgroundColor||style.background||style.backgroundColor;
 const background=!!(vertexMask||materialMask)&&!!backgroundColor&&backgroundColor!=='transparent';
 if(background){paintStyle.background='transparent';delete paintStyle.backgroundColor;delete style.background;delete style.backgroundColor;}
 const source=<>{background&&<div style={{position:'absolute',inset:0,borderRadius:style.borderRadius,overflow:'hidden'}}><SwitchMaterial effect={layout.effect} surfaceStyle={false}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial></div>}{custom.content}</>;
 const content=textureChannels||vertexMask||materialMask?<SwitchTextureMotionContext.Provider value={{channels:textureChannels,vertexMask,materialMask,enabled}}>{source}</SwitchTextureMotionContext.Provider>:source;
 return <div {...attrs} {...custom.attrs} ref={ref} className={custom.className} style={style}>
  {nativeShadow&&<SwitchShadow effect={layout.effect} alpha={nativeAlpha?paintAlpha:undefined} animated={volumeMotion&&enabled} motionKey={events.join('|')} volumeProperty="--dht-nx-shadow-volume" silhouette={node.type==='pic1'&&(layout.effect.radius??0)>0&&!custom.alphaMask}/>}
  {nativeAlpha?<div data-scene-paint="" style={paintStyle}>{content}{layout.effect.borderDraw!==false&&(layout.effect.borderOpacity??1)>0&&(layout.effect.borderWidth??0)>0&&<span data-native-border="" style={{position:'absolute',inset:0,boxSizing:'border-box',pointerEvents:'none',borderRadius:style.borderRadius,border:String(layout.style.border??'none').replace(/^[\d.]+px/,'var(--dht-nx-border-width)')}}/>}</div>:content}
  <div data-scene-pivot="" style={{position:'absolute',left:`${layout.pivot.x}%`,top:`${layout.pivot.y}%`,width:0,height:0}}>
   {part&&depth<12&&<div data-native-part={node.part} style={{position:'absolute',width:0,height:0,transform:`scale(${magnify[0]},${magnify[1]})`}}><SwitchSceneTree {...childProps} events={custom.partEvents??events} root={undefined} effects={{...partEffects,[part[0].slot]:{...partEffects[part[0].slot],Position:{X:0,Y:0},Scale:{X:1,Y:1},Rotation:{Z:0},Size:{X:partSize[0],Y:partSize[1]}}}} list={[{...part[0],size:partSize},...part.slice(1)]} depth={depth+1}/></div>}
   {children.map(p=><SceneNode key={p.name} {...childProps} node={p}/>) }
  </div>
 </div>;
}
/** Referenced layouts and subtrees mount at pivots without flattening ancestors. */
export function SwitchSceneTree({root,...props}:Props){
 const node=root?props.list.find(p=>p.name===root):props.list[0];
 return node?<SceneNode {...props} node={node}/>:null;
}
