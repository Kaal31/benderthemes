import {useEffect,useLayoutEffect,useRef,useState} from "react";

/** Center glass with measured band corners and a narrow inset along the trim. */
export function BladesWashEdge({cap,tile,offsets,leftOffsets,width}:{cap:string;tile:string;offsets:number[];leftOffsets:number[];width:number}){
 const ref=useRef<HTMLCanvasElement>(null);
 const [images,setImages]=useState<HTMLImageElement[]>([]);
 useEffect(()=>{
  let alive=true;
  const pair=[cap,tile].map(src=>{const img=new Image();img.src=src;return img;});
  Promise.all(pair.map(img=>img.decode().catch(()=>{}))).then(()=>{if(alive)setImages(pair);});
  return()=>{alive=false;};
 },[cap,tile]);
 useLayoutEffect(()=>{
  const ctx=ref.current?.getContext("2d"),[edge,middle]=images;
  if(!ctx||!edge?.naturalWidth||!middle?.naturalWidth)return;
  const strip=document.createElement("canvas");strip.width=1;strip.height=512;
  const sample=strip.getContext("2d");if(!sample)return;
  sample.drawImage(middle,0,0,1,512);
  const middlePixels=sample.getImageData(0,0,1,512).data;
  const canvasWidth=Math.ceil(width+60);
  if(ref.current)ref.current.width=canvasWidth;
  const output=ctx.createImageData(canvasWidth,512);
  // Reference: a shallow 18/512-height turn with a broad 42px shoulder.
  // Keep the center sheet close to the trim; only the two band ends curve.
  const top=64,bottom=440,rx=42,ry=18,inset=24;
  for(let y=0;y<512;y++){
   if(y<top-ry||y>bottom+ry)continue;
   const i=Math.min(127,Math.floor(y/4)),t=(y%4+.5)/4;
   const end=width+offsets[i]*(1-t)+offsets[i+1]*t-inset;
   const start=inset+leftOffsets[i]*(1-t)+leftOffsets[i+1]*t;
   const outside=y<top||y>bottom;
   const progress=y<top?(y-(top-ry))/ry:((bottom+ry)-y)/ry;
   const shoulder=outside?rx*(1-Math.sqrt(Math.max(0,1-progress*progress))):0;
   const source=Math.max(80,Math.min(420,y))*4;
   for(let x=Math.max(0,Math.floor(start));x<Math.min(canvasWidth,end);x++){
    const cornerCoverage=outside?Math.max(0,Math.min(1,Math.max(start+shoulder-x+.5,x-end+shoulder+.5))):1;
    if(!cornerCoverage)continue;
    const dest=(y*canvasWidth+x)*4;
    output.data.set(middlePixels.subarray(source,source+4),dest);
    // One-pixel coverage softens the outer edge without a wide transparent rim.
    output.data[dest+3]*=cornerCoverage*Math.min(1,end-x,x-start+1);
   }
  }
  ctx.putImageData(output,0,0);
 },[images,offsets,leftOffsets,width]);
 return <div className="dht-blades-whitewash-right" aria-hidden="true" style={{position:"relative",width:"100%",height:"100%",flexShrink:0}}>
  <canvas ref={ref} width={200} height={512} style={{position:"absolute",left:0,top:0,width:Math.ceil(width+60),height:"100%"}}/>
 </div>;
}
