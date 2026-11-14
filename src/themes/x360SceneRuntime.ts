export interface XuiNode{class:string;properties:Record<string,any>;children:XuiNode[];frames:{name:string;frame:number;command:number;parameter:string}[];timelines:XuiTimeline[]}
export interface XuiTimeline{target:string;keys:{frame:number;interpolation:number;ease:number[];values:{path:string[];index:number|null;value:any}[]}[]}
export interface XuiSceneSkin{sceneAudio?:Record<string,string>;audioNeedsDecoder?:string[];entryScene?:string|null;coverResources?:{mesh?:{positions:number[];normals:number[];uv:number[];indices:number[];matrix:number[];groups:{texture:string;start:number;count:number;diffuse:number[]}[]};textures:Record<string,string>;diagnostics:string[]};sceneEffects?:{wallpaper?:import("./XuiWallpaperEffect").AuroraWallpaperEffect};sceneSettings?:Record<string,{tag:string;attributes:Record<string,string>;text:string;values:Record<string,string>}[]>;sceneFonts?:Record<string,string>;sceneRoots?:Record<string,XuiNode>;sceneAssets?:Record<string,string>;sceneFailures?:{path:string;reason:string}[];missingSceneAssets?:string[]}
export const resourceKey=(name:string)=>name.replace(/\\/g,'/').replace(/^file:\/\//i,'').replace(/^.*#/,'').toLowerCase();
/** XUI maps geometry into brush coordinates; SVG needs that mapping inverted. */
export function brushTransform(fill:Record<string,any>):string{
 const sx=1/Math.max(.001,Math.abs(fill.Scale?.[0]??1)),sy=1/Math.max(.001,Math.abs(fill.Scale?.[1]??1));
 return `translate(.5 .5) scale(${sx} ${sy}) rotate(${- (fill.Rotation??0)}) translate(${- (fill.Translation?.[0]??0)} ${- (fill.Translation?.[1]??0)}) translate(-.5 -.5)`;
}
/** XUI stores an anchor followed by the two controls for its outgoing segment. */
export function figurePath(points:number[][],closed=true):string {
 if(!points.length)return '';
 let d=`M ${points[0][0]} ${points[0][1]}`;
 const segment=(previous:number[],current:number[])=>` C ${previous[2]} ${previous[3]} ${previous[4]} ${previous[5]} ${current[0]} ${current[1]}`;
 for(let i=1;i<points.length;i++)d+=segment(points[i-1],points[i]);
 if(closed)d+=segment(points[points.length-1],points[0])+' Z';
 return d;
}
/** Apply XUI's left/top/right/bottom anchors when an enclosing panel resizes. */
export function anchorProperties(properties:Record<string,any>,dx:number,dy:number):Record<string,any>{
 const anchor=properties.Anchor??0,patch:Record<string,any>={},position=[...(properties.Position??[0,0,0])];
 if((anchor&5)===5)patch.Width=Math.max(0,(properties.Width??0)+dx);
 else if(anchor&4)position[0]+=dx;
 if((anchor&10)===10)patch.Height=Math.max(0,(properties.Height??0)+dy);
 else if(anchor&8)position[1]+=dy;
 if(position[0]!==properties.Position?.[0]||position[1]!==properties.Position?.[1])patch.Position=position;
 return patch;
}
function mix(a:any,b:any,t:number):any{if(typeof a==='number'&&typeof b==='number')return a+(b-a)*t;if(Array.isArray(a)&&Array.isArray(b)&&a.length===b.length)return a.map((v,i)=>mix(v,b[i],t));if(typeof a==='string'&&typeof b==='string'&&/^#[\da-f]{8}$/i.test(a)&&/^#[\da-f]{8}$/i.test(b))return '#'+[0,1,2,3].map(i=>Math.round(parseInt(a.slice(1+i*2,3+i*2),16)+(parseInt(b.slice(1+i*2,3+i*2),16)-parseInt(a.slice(1+i*2,3+i*2),16))*t).toString(16).padStart(2,'0')).join('');return t<1?a:b}
/** XUI targets refer to direct children; duplicate IDs in descendants are independent. */
export function timelineProperties(node:XuiNode,frame:number):Map<string,Record<string,any>>{
 const result=new Map<string,Record<string,any>>();
 for(const timeline of node.timelines){const keys=timeline.keys;if(!keys.length)continue;let a=keys[0],b=keys[0];for(const key of keys){if(key.frame<=frame)a=key;if(key.frame>=frame){b=key;break}b=key}const t=b.frame===a.frame||a.interpolation===1?0:Math.max(0,Math.min(1,(frame-a.frame)/(b.frame-a.frame)));const properties=result.get(timeline.target)??{};
  for(const va of a.values){const vb=b.values.find(v=>v.path.join('.')===va.path.join('.')&&v.index===va.index)??va;let obj=properties;va.path.forEach((key,i)=>{if(i===va.path.length-1){if(va.index!==null){obj[key]=obj[key]??[];obj[key][va.index]=mix(va.value,vb.value,t)}else obj[key]=mix(va.value,vb.value,t)}else{obj[key]=obj[key]??{};obj=obj[key]}})}result.set(timeline.target,properties)
 }return result;
}
export function frameAt(node:XuiNode,name:string,elapsed:number,motion:boolean):number{
 const normalized=name.toLowerCase(),named=node.frames.find(f=>f.name.toLowerCase()===normalized)??node.frames.find(f=>f.name.toLowerCase()==='normal');
 // Custom skins name their automatic startup clips in several languages, or only mark the stop.
 const automatic=normalized==='normal'&&!named,first=node.frames[0];
 const start=named??(automatic&&first?(first.command===1?{...first,frame:0,command:0}:first):undefined);
 if(!start){
  // Wallpaper groups often put their frame keys directly on an unnamed nested group.
  if(!node.frames.length&&/anim|background|wallpaper/i.test(String(node.properties.Id??''))&&node.timelines.length){const end=Math.max(0,...node.timelines.flatMap(t=>t.keys.map(k=>k.frame)));return end?(motion?(elapsed*60)%end:Math.min(60,end)):0;}
  return 0;
 }
 const compact=(value:string)=>value.toLowerCase().replace(/\s/g,'');
 const end=node.frames.find(f=>f.frame>start.frame&&[1,3].includes(f.command)&&[compact('end'+start.name),compact(start.name+'end')].includes(compact(f.name)))??node.frames.find(f=>f.frame>=start.frame&&[1,3].includes(f.command)&&f!==start);
 if(!motion)return end?.frame??start.frame;
 const current=start.frame+elapsed*60;
 if(end?.command===3&&current>end.frame){const loop=node.frames.find(f=>f.name.toLowerCase()===end.parameter.toLowerCase());if(loop&&loop.frame<end.frame)return loop.frame+(current-end.frame)%(end.frame-loop.frame);}
 return Math.min(end?.frame??start.frame,current);
}
export function mergeProperties(base:Record<string,any>,patch?:Record<string,any>):Record<string,any>{if(!patch)return base;const out={...base};for(const [key,value]of Object.entries(patch)){out[key]=value&&typeof value==='object'&&!Array.isArray(value)&&value.constructor===Object?mergeProperties(base[key]??{},value):value}return out}

/** Resolve package-relative scene links without choosing an ambiguous same-name scene. */
export function resolveXuiScene(roots:Record<string,XuiNode>,current:string,requested:string):string|undefined{
 const normalize=(name:string)=>{const parts:string[]=[];for(const p of resourceKey(name).split('/')){if(p==='..')parts.pop();else if(p&&p!=='.')parts.push(p)}return parts.join('/')};
 const key=normalize(requested),relative=normalize(current.split('/').slice(0,-1).join('/')+'/'+requested),names=Object.keys(roots);
 const exact=names.find(n=>normalize(n)===key)??names.find(n=>normalize(n)===relative);if(exact)return exact;
 const candidates=names.filter(n=>normalize(n).split('/').pop()===key.split('/').pop());return candidates.length===1?candidates[0]:undefined;
}
