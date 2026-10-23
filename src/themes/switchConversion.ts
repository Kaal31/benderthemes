import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { SwitchAnimation, SwitchEffect, SwitchPane, SwitchTrack } from "../switchThemes";
const registeredAlphaProperties=new Set<string>();
function registerMotionProperty(name:string,syntax:string,initialValue:string){
 if(typeof CSS==='undefined'||!CSS.registerProperty||registeredAlphaProperties.has(name))return;
 try{CSS.registerProperty({name,syntax,inherits:true,initialValue});}
 catch(error){
  // CSS registrations survive plugin reloads; the module-local Set does not.
  if((error as {name?:string})?.name!=='InvalidModificationError')throw error;
 }
 registeredAlphaProperties.add(name);
}

export type SwitchBackgroundRaster={width:number;height:number;texture:NonNullable<SwitchEffect['texture']>};
/** Atlas transforms must paint into the viewport rather than an enlarged GPU
 * layer: Chromium otherwise down-rasters the live animation at narrow sizes. */
export function backgroundRaster(animations:SwitchAnimation[],effect:SwitchEffect|undefined,base:SwitchPane|undefined,width:number,height:number):SwitchBackgroundRaster|undefined{
 const tracks=animations.filter(a=>a.pane==='background').flatMap(a=>a.tracks),texture=effect?.texture;
 if(!texture||!texture.repeatX||!texture.repeatY||!tracks.some(isFrameSequence)||tracks.some(t=>![0,1,6,7,16,17].includes(t.property))||Object.values(base?.Rotation??{}).some(v=>v!==0))return;
 return {width,height,texture};
}

/** Atlas authors hold each pose, then move to the next cell in one console frame. */
export function isFrameSequence(track:SwitchTrack):boolean{
 return (track.property===0||track.property===1)&&track.keys.length>=8&&track.keys.every((key,i,keys)=>key.slope===0&&(!i||key.value===keys[i-1].value||key.frame-keys[i-1].frame<=1));
}

/** Merge event channels, retaining independent focus, loading and active tracks. */
export function paneMotionFrame(animations:SwitchAnimation[],frame:number,base:SwitchPane={},unitX=1,unitY=1,relativePosition=false,raster?:SwitchBackgroundRaster,alphaProperty='opacity'):Keyframe{
 const values=new Map<number,number>();
 const end=Math.max(0,...animations.map(animation=>animation.frames));
 for(const animation of animations){
  const wrapped=animation.frames>0?frame%animation.frames:0;
  // Keep the terminal pose in the final compositor key. Repeating the first
  // key here would interpolate a long hold back to the initial pose.
  const at=animation.loop&&animation.frames>0?(frame===end&&frame>0&&wrapped===0?animation.frames:wrapped):Math.min(frame,animation.frames);
  for(const track of animation.tracks)values.set(track.property,sampleTrack(track,at));
 }
 const result:Keyframe={};
 if([0,1,3,4,5,6,7].some(p=>values.has(p)))result.transform=`translate(${((values.get(0)??base.Position?.X??0)-(relativePosition?(base.Position?.X??0):0))*unitX}px,${-((values.get(1)??base.Position?.Y??0)-(relativePosition?(base.Position?.Y??0):0))*unitY}px) rotateX(${values.get(3)??base.Rotation?.X??0}deg) rotateY(${values.get(4)??base.Rotation?.Y??0}deg) rotate(${-(values.get(5)??base.Rotation?.Z??0)}deg) scale(${values.get(6)??base.Scale?.X??1},${values.get(7)??base.Scale?.Y??1})`;
 if(values.has(16))result[alphaProperty]=Math.max(0,Math.min(1,values.get(16)!/255));
 if(values.has(17))result.visibility=values.get(17)!>=1?'inherit':'hidden';
 if(values.has(8))result.width=`${values.get(8)!*unitX}px`;
 if(values.has(9))result.height=`${values.get(9)!*unitY}px`;
 if(values.has(19))result['--dht-nx-uv-x']=String(values.get(19)!);
 if(values.has(20))result['--dht-nx-uv-y']=String(values.get(20)!);
 if(values.has(21))result[alphaProperty.startsWith('--')?'--dht-nx-border-width':'borderWidth']=`${Math.max(0,values.get(21)!)*unitX}px`;
 if(values.has(25))result['--dht-nx-shadow-volume']=String(Math.max(0,values.get(25)!));
 if(values.has(22))result['--dht-nx-uv-angle']=String(values.get(22)!);
 if(values.has(23))result['--dht-nx-uv-offset-x']=String(values.get(23)!);
 if(values.has(24))result['--dht-nx-uv-offset-y']=String(values.get(24)!);
 if(raster){
  const {width:w,height:h,texture:t}=raster,x=values.get(0)??base.Position?.X??0,y=values.get(1)??base.Position?.Y??0,sx=values.get(6)??base.Scale?.X??1,sy=values.get(7)??base.Scale?.Y??1;
  result.transform='none';
  result.backgroundSize=`${Math.max(0,w*sx*(t.mirrorX?2:1)/t.scaleX)}px ${Math.max(0,h*sy*(t.mirrorY?2:1)/t.scaleY)}px`;
  result.backgroundPosition=`calc(50% + ${x}px) calc(50% - ${y}px)`;
  result.clipPath=`inset(${Math.max(0,h/2-y-h*sy/2)}px ${Math.max(0,w/2-x-w*sx/2)}px ${Math.max(0,h/2+y-h*sy/2)}px ${Math.max(0,w/2+x-w*sx/2)}px)`;
 }
 return result;
}

export function motionTimes(animations:SwitchAnimation[]):number[]{
 const duration=Math.max(1,...animations.map(a=>a.frames));
 const times=new Set([0,duration]);
 for(const animation of animations)for(const track of animation.tracks){
  const end=Math.min(animation.frames,track.keys[track.keys.length-1]?.frame??0);
  // Sample changing Hermite spans, not thousands of frames of a constant hold.
  for(let frame=0;frame<end;frame+=Math.max(2,end/1024))times.add(frame);
  // Pre-roll/post-roll keys shape boundary interpolation, but are not valid
  // Web Animations offsets. Keep them in the track sampled at 0/duration.
  for(let i=0;i<track.keys.length;i++){
   const key=track.keys[i];if(key.frame<0||key.frame>Math.min(animation.frames,duration))continue;
   times.add(key.frame);
   // Native curves use repeated frame numbers for instantaneous jumps.
   // Preserve the left limit instead of fading through the preceding span.
   const previous=track.keys[i-1];
   if(previous?.frame===key.frame&&previous.value!==key.value&&key.frame>0)times.add(Math.max(0,key.frame-1e-4));
  }
 }
 return [...times].sort((a,b)=>a-b);
}

export function useSwitchPaneMotion(animations:SwitchAnimation[],pane:string,events:string[],enabled:boolean,base:SwitchPane={},unitX=1,unitY=1,relativePosition=false,playbackKey:string|number="",raster?:SwitchBackgroundRaster,alphaProperty='opacity'){
 const ref=useRef<HTMLDivElement>(null),binding=events.join('|'),geometry=JSON.stringify(base),rasterGeometry=JSON.stringify(raster);
 // Pane and UV scales often cancel each other. Install the initial pose before
 // paint so the compressed atlas is never exposed during startup.
 useLayoutEffect(()=>{
  const el=ref.current;if(!el)return;
  if(alphaProperty.startsWith('--')){
   registerMotionProperty(alphaProperty,'<number>','1');
   registerMotionProperty('--dht-nx-border-width','<length>','0px');
  }
  registerMotionProperty('--dht-nx-shadow-volume','<number>','1');
  const selected=events.flatMap(event=>animations.filter(a=>a.pane===pane&&a.event===event));
  if(!selected.length)return;
  const duration=Math.max(1,...selected.map(a=>a.frames));
  const discrete=selected.some(animation=>animation.tracks.some(isFrameSequence));
  const frames=motionTimes(selected).map(frame=>({...paneMotionFrame(selected,frame,base,unitX,unitY,relativePosition,raster,alphaProperty),offset:frame/duration,...(discrete?{easing:'steps(1,end)'}:{})}));
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if(!enabled||reduced?.matches){
   const final=paneMotionFrame(selected,duration,base,unitX,unitY,relativePosition,raster,alphaProperty),previous=new Map<string,string>();
   for(const [key,value] of Object.entries(final)){const cssKey=key.replace(/[A-Z]/g,c=>"-"+c.toLowerCase());previous.set(cssKey,el.style.getPropertyValue(cssKey));el.style.setProperty(cssKey,String(value));}
   return()=>{for(const [key,value] of previous)el.style.setProperty(key,value);};
  }
  const player=el.animate(frames,{duration:duration*1000/60,iterations:selected.some(a=>a.loop)?Infinity:1,fill:'both',easing:'linear'});
  const stop=()=>{if(reduced?.matches){player.pause();player.currentTime=duration*1000/60;}};
  reduced?.addEventListener?.('change',stop);
  return()=>{player.cancel();reduced?.removeEventListener?.('change',stop);};
 },[animations,pane,binding,enabled,geometry,unitX,unitY,relativePosition,playbackKey,rasterGeometry,alphaProperty]);
 return ref;
}

export function sampleTrack(track: SwitchTrack, frame: number): number {
  const keys = track.keys;
  if (frame < keys[0].frame) return keys[0].value;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i-1], b = keys[i];
    if (frame >= b.frame) continue;
    const span = b.frame-a.frame, t = span > 0 ? (frame-a.frame)/span : 1;
    if (track.interpolation === "step") return frame < b.frame ? a.value : b.value;
    if (span<=1&&isFrameSequence(track)) return a.value;
    return (2*t*t*t-3*t*t+1)*a.value+(t*t*t-2*t*t+t)*span*a.slope+(-2*t*t*t+3*t*t)*b.value+(t*t*t-t*t)*span*b.slope;
  }
  return keys[keys.length-1].value;
}
export function animationFrame(animation: SwitchAnimation, frame: number): Keyframe {
  const values = new Map(animation.tracks.map(t => [t.property,sampleTrack(t,frame)]));
  return { ...(values.has(16)?{opacity:Math.max(0,Math.min(1,values.get(16)!/255))}:{}), ...(values.has(17)?{visibility:values.get(17)!>=1?"visible":"hidden"}:{}), ...([0,1,5,6,7].some(p=>values.has(p))?{transform: `translate(${values.get(0)??0}px,${-(values.get(1)??0)}px) rotate(${-(values.get(5)??0)}deg) scale(${values.get(6)??1},${values.get(7)??1})`}:{}), ...(values.has(8)?{width:`${values.get(8)}px`}:{}), ...(values.has(9)?{height:`${values.get(9)}px`}:{}) };
}
/** Preserve frame tangents by sampling Hermite channels, then let the compositor play. */
export function useSwitchAnimation(animation: SwitchAnimation | undefined, enabled: boolean, key: string | number = "") {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !animation || !enabled || typeof el.animate !== "function") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) return;
    const count = Math.min(2048,Math.max(2,Math.ceil(animation.frames/2)));
    const frames = Array.from({length:count+1},(_,i)=>({...animationFrame(animation,animation.frames*i/count),offset:i/count}));
    const player = el.animate(frames,{duration:animation.frames*1000/60,iterations:animation.loop?Infinity:1,fill:"forwards",easing:"linear"});
    const stopOnPreference = () => { if (reduced?.matches) player.cancel(); };
    reduced?.addEventListener?.("change", stopOnPreference);
    return () => { player.cancel(); reduced?.removeEventListener?.("change", stopOnPreference); };
  },[animation,enabled,key]);
  return ref;
}
export function paneStyle(pane: SwitchPane | undefined): CSSProperties {
  if (!pane) return {};
  return { ...(pane.Visible === false ? {display:"none"}:{}), transform:`rotate(${-(pane.Rotation?.Z??0)}deg) scale(${pane.Scale?.X??1},${pane.Scale?.Y??1})` };
}
