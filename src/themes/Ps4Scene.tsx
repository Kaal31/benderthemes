import {useEffect,useRef} from "react";
import {logInfo} from '../diag';
import {canvasImageTint} from './canvasImageTint';

type ActorState={color:number[];position:number[];rotation:number[];scale:number[]};
export interface Ps4SceneData{durationMs:number;span:number;warnings:string[];layers:{id:string;image:string;initial:ActorState;states:{at:number;state:ActorState}[]}[]}
export function actorState(layer:Ps4SceneData["layers"][number],time:number):ActorState{
 const states=layer.states;let previous=states[0];
 for(const next of states){
  if(next.at>time){const ratio=(time-previous.at)/Math.max(1,next.at-previous.at);return Object.fromEntries(Object.keys(previous.state).map(key=>[key,previous.state[key as keyof ActorState].map((value,index)=>value+(next.state[key as keyof ActorState][index]-value)*ratio)])) as ActorState;}
  previous=next;
 }
 return previous.state;
}
export function Ps4Scene({scene,animate}:{scene:Ps4SceneData;animate:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;
  let stopped=false,request=0,started=0,lastDraw=-Infinity,paused:number|undefined,ready=false;
  const issues=new Set(scene.warnings??[]);canvas.dataset.importIssues=JSON.stringify([...issues]);
  const tint=canvasImageTint(canvas.ownerDocument);
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const images=scene.layers.map(layer=>{const image=new Image();image.crossOrigin='anonymous';image.src=layer.image;return image;});
  const draw=(time:number)=>{
   if(stopped)return;
   ctx.clearRect(0,0,1280,720);
   scene.layers.forEach((layer,index)=>{
    const image=images[index],state=actorState(layer,time);if(!image.complete||!image.naturalWidth||state.color[3]<=0)return;
    const size=Math.max(1280/image.naturalWidth,720/image.naturalHeight),w=image.naturalWidth*size,h=image.naturalHeight*size;
    ctx.save();ctx.translate(640+state.position[0]*720/scene.span,360-state.position[1]*720/scene.span);ctx.rotate(-state.rotation[2]*Math.PI/180);ctx.scale(state.scale[0],state.scale[1]);ctx.globalAlpha=state.color[3];
    if(state.color.slice(0,3).every(value=>value===1))ctx.drawImage(image,-w/2,-h/2,w,h);
    else tint.draw(ctx,image,-w/2,-h/2,w,h,state.color);
    ctx.restore();
   });
  };
  const tick=()=>{if(stopped||document.hidden||!ready)return;const time=performance.now()-started;if(time-lastDraw>=1000/30||!animate||reduced?.matches){lastDraw=time;draw(animate&&!reduced?.matches?time%scene.durationMs:0);}if(animate&&!reduced?.matches)request=requestAnimationFrame(tick);};
  const visibility=()=>{cancelAnimationFrame(request);if(document.hidden)paused??=performance.now();else{if(paused!==undefined)started+=performance.now()-paused;paused=undefined;tick();}};
  document.addEventListener("visibilitychange",visibility);reduced?.addEventListener?.("change",visibility);
  images.forEach((image,index)=>{void image.decode().then(()=>{
   if(stopped)return;if(!ready){ready=true;started=performance.now();paused=document.hidden?started:undefined;}
   lastDraw=-Infinity;cancelAnimationFrame(request);tick();
  }).catch(()=>{if(stopped)return;const message=`Layer ${scene.layers[index].id}: image failed to decode`;issues.add(message);canvas.dataset.importIssues=JSON.stringify([...issues]);logInfo(`PS4 scene: ${message}`);});});
  return()=>{stopped=true;cancelAnimationFrame(request);tint.dispose();images.forEach(image=>{image.src='';});document.removeEventListener("visibilitychange",visibility);reduced?.removeEventListener?.("change",visibility);};
 },[scene,animate]);
 return <canvas ref={ref} className="dht-ps4-scene" width={1280} height={720} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}
