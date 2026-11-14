import {useEffect,useRef} from "react";

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
  let stopped=false,request=0,started=0,lastDraw=-Infinity,paused:number|undefined;
  const tint=document.createElement("canvas");tint.width=1280;tint.height=720;const buffer=tint.getContext("2d");
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const images=scene.layers.map(layer=>{const image=new Image();image.src=layer.image;return image;});
  const draw=(time:number)=>{
   if(stopped)return;
   ctx.clearRect(0,0,1280,720);
   scene.layers.forEach((layer,index)=>{
    const image=images[index],state=actorState(layer,time);if(!image.complete||!image.naturalWidth||state.color[3]<=0)return;
    const size=Math.max(1280/image.naturalWidth,720/image.naturalHeight),w=image.naturalWidth*size,h=image.naturalHeight*size;
    ctx.save();ctx.translate(640+state.position[0]*720/scene.span,360-state.position[1]*720/scene.span);ctx.rotate(-state.rotation[2]*Math.PI/180);ctx.scale(state.scale[0],state.scale[1]);ctx.globalAlpha=state.color[3];
    if(state.color.slice(0,3).every(value=>value===1))ctx.drawImage(image,-w/2,-h/2,w,h);
    else{
     if(buffer){buffer.globalCompositeOperation="source-over";buffer.clearRect(0,0,1280,720);buffer.drawImage(image,(1280-w)/2,(720-h)/2,w,h);buffer.globalCompositeOperation="multiply";buffer.fillStyle=`rgb(${state.color.slice(0,3).map(value=>Math.round(value*255)).join(",")})`;buffer.fillRect(0,0,1280,720);buffer.globalCompositeOperation="destination-in";buffer.drawImage(image,(1280-w)/2,(720-h)/2,w,h);ctx.drawImage(tint,-640,-360);}
    }
    ctx.restore();
   });
  };
  const tick=()=>{if(stopped||document.hidden)return;const time=performance.now()-started;if(time-lastDraw>=1000/30||!animate||reduced?.matches){lastDraw=time;draw(animate&&!reduced?.matches?time%scene.durationMs:0);}if(animate&&!reduced?.matches)request=requestAnimationFrame(tick);};
  const visibility=()=>{cancelAnimationFrame(request);if(document.hidden)paused??=performance.now();else{if(paused!==undefined)started+=performance.now()-paused;paused=undefined;tick();}};
  document.addEventListener("visibilitychange",visibility);reduced?.addEventListener?.("change",visibility);
  Promise.all(images.map(image=>image.decode())).then(()=>{if(!stopped){started=performance.now();paused=document.hidden?started:undefined;tick();}}).catch(()=>{});
  return()=>{stopped=true;cancelAnimationFrame(request);document.removeEventListener("visibilitychange",visibility);reduced?.removeEventListener?.("change",visibility);};
 },[scene,animate]);
 return <canvas ref={ref} className="dht-ps4-scene" width={1280} height={720} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}
