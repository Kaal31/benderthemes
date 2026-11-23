import {useEffect,useRef} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {sampleTrack} from './switchConversion';

/** Repeating, rotating wallpapers paint into a screen-sized surface. Scaling a
 * full-screen DOM layer sevenfold otherwise creates a very large GPU surface. */
export function SwitchTiledBackground({source,width,height,texture,animations,enabled}:{source:string;width:number;height:number;texture:NonNullable<SwitchEffect['texture']>;animations:SwitchAnimation[];enabled:boolean}){
 const ref=useRef<HTMLCanvasElement>(null),binding=JSON.stringify(animations),sampling=JSON.stringify(texture);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  canvas.width=Math.round(width);canvas.height=Math.round(height);
  const context=canvas.getContext('2d');if(!context)return;
  let stopped=false,raf=0,elapsed=0,last=0,lastPaint=-Infinity;
  const image=new Image(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const duration=Math.max(1,...animations.map(a=>a.frames));
  const paint=(frame:number)=>{
   const values=new Map<number,number>();
   for(const a of animations){const at=a.loop&&a.frames>0?frame%a.frames:Math.min(frame,a.frames);for(const t of a.tracks)if(t.keys.length)values.set(t.property,sampleTrack(t,at));}
   const sx=values.get(6)??1,sy=values.get(7)??1;
   const pattern=context.createPattern(image,'repeat');if(!pattern||!sx||!sy)return;
   const matrix=new DOMMatrix().translate(width/2+(values.get(0)??0),height/2-(values.get(1)??0)).rotate(-(values.get(5)??0)).scale(sx,sy).translate(-width/2,-height/2).scale(width/texture.scaleX/image.naturalWidth*(texture.mirrorX?2:1),height/texture.scaleY/image.naturalHeight*(texture.mirrorY?2:1));
   pattern.setTransform(matrix);context.clearRect(0,0,width,height);
   context.imageSmoothingEnabled=!texture.nearest;context.globalAlpha=Math.max(0,Math.min(1,(values.get(16)??255)/255));
   if((values.get(17)??1)>=1){context.fillStyle=pattern;context.fillRect(0,0,width,height);}
  };
  const tick=(now:number)=>{
   if(stopped)return;
   if(last)elapsed+=now-last;last=now;
   if(now-lastPaint>=1000/30){paint(elapsed*60/1000);lastPaint=now;}
   raf=requestAnimationFrame(tick);
  };
  const sync=()=>{
   cancelAnimationFrame(raf);last=0;
   if(!enabled||reduced.matches){paint(duration);return;}
   if(!document.hidden)raf=requestAnimationFrame(tick);
  };
  image.onload=()=>{if(!stopped){paint(enabled&&!reduced.matches?0:duration);sync();}};
  image.src=source;
  const visibility=()=>{if(image.complete&&image.naturalWidth)sync();};
  document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',visibility);
  return()=>{stopped=true;cancelAnimationFrame(raf);image.onload=null;document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',visibility);};
 },[source,width,height,binding,sampling,enabled]);
 return <canvas ref={ref} data-switch-tiled-background="" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}/>;
}
