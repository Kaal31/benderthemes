import type {Layout,Pane,WiiScene} from './WiiNativeScene';
import {wiiWindowParts} from './WiiLayoutGeometry';

export const hasWindowParts=(p:Pane)=>!!p.window&&(p.window.contentMaterial!==undefined||p.window.frames.length===4||p.window.frames.length===8);
/** Append border panes so the source pane indexes and hierarchy remain stable. */
export function expandWiiWindows(layout:Layout){
 const panes=[...layout.panes];
 layout.panes.forEach((p,owner)=>{
  if(!hasWindowParts(p))return;
  const frames=p.window!.frames,count=frames.length===1?4:frames.length;
  if(![0,4,8].includes(count))return;
  for(let frame=0;frame<count;frame++)panes.push({
   name:`${p.name}:window-frame:${frame}`,kind:'pic1',parent:owner,visible:true,inheritAlpha:true,
   origin:0,alpha:1,position:[0,0,0],rotation:[0,0,0],scale:[1,1],size:[...p.size],
   material:frames[frames.length===1?0:frame].material,colors:Array.from({length:4},()=>[255,255,255,255]),windowPart:{owner,frame}
  });
 });
 return {...layout,panes};
}
export function windowPaneRect(p:Pane,pose:Pane[],layout:Layout,assets:WiiScene['assets']){
 const owner=p.windowPart?pose[p.windowPart.owner]:p;
 if(!hasWindowParts(owner))return undefined;
 const window=owner.window!,frames=window.frames.map(frame=>{
  const material=layout.materials[frame.material],name=layout.textures[material?.textures[0]]?.replace(/\.tpl$/i,'').toLowerCase(),asset=assets[layout.area+'/'+name];
  return {width:asset?.width??0,height:asset?.height??0,flip:frame.flip};
 });
 const parts=wiiWindowParts(owner.size[0],owner.size[1],owner.origin,window.inflation,frames);
 return p.windowPart?parts.frames[p.windowPart.frame]:parts.content;
}
