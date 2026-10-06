import {useEffect,useRef} from "react";

/** MC360 Background-animation-commons: ordered frames, 70 ms crossfade. */
export function BladesAtmosphere({assets,animate}:{assets:Record<string,string>;animate:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext("2d");if(!canvas||!ctx)return;
  let alive=true,raf=0,last=-100,elapsed=0,previous=performance.now();const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const frames=Object.keys(assets).filter(k=>k.startsWith("bkgd_frames_background-")).sort().map(k=>{const img=new Image();img.src=assets[k];return img;});
  if(!frames.length)return;
  const paint=(now:number)=>{if(!alive)return;const moving=animate&&!media.matches&&!document.hidden;if(moving&&now-last<32){raf=requestAnimationFrame(paint);return;}if(moving)elapsed+=Math.min(100,now-previous);previous=now;last=now;
   const f=elapsed/70,i=Math.floor(f)%frames.length,a=frames[i],b=frames[(i+1)%frames.length];ctx.clearRect(0,0,256,256);if(a?.complete&&a.naturalWidth){ctx.globalAlpha=1;ctx.drawImage(a,0,0,256,256);}if(b?.complete&&b.naturalWidth){ctx.globalAlpha=f%1;ctx.drawImage(b,0,0,256,256);ctx.globalAlpha=1;}canvas.dataset.frame=String(i);if(moving)raf=requestAnimationFrame(paint);
  };
  const restart=()=>{cancelAnimationFrame(raf);previous=performance.now();paint(previous);};
  Promise.all(frames.map(f=>f.decode().catch(()=>{}))).then(()=>alive&&restart());document.addEventListener("visibilitychange",restart);media.addEventListener("change",restart);
  return()=>{alive=false;cancelAnimationFrame(raf);document.removeEventListener("visibilitychange",restart);media.removeEventListener("change",restart);};
 },[assets,animate]);
 return <canvas ref={ref} className="dht-blades-atmosphere" width={256} height={256} aria-hidden style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}
