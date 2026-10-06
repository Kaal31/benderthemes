import {useEffect,useRef} from "react";

/** Sample the stock cell-wall tile onto a curved screen once, without a continuous renderer. */
export function XboxCellWall({src,W,H}:{src:string;W:number;H:number}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  let alive=true;const image=new Image();image.onload=()=>{
   if(!alive||!ref.current)return;
   const tile=document.createElement('canvas');tile.width=image.width;tile.height=image.height;const tc=tile.getContext('2d')!;tc.drawImage(image,0,0);const pixels=tc.getImageData(0,0,tile.width,tile.height).data;
   const canvas=ref.current;const w=Math.round(W),h=Math.round(H);canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d')!;const out=ctx.createImageData(w,h);
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const nx=(x/w-.5)*1.7,ny=(y/h-.5)*1.5;
    const u=(Math.asin(Math.max(-.98,Math.min(.98,nx)))*4+ny*.7+20)%1;
    const v=(Math.asin(Math.max(-.98,Math.min(.98,ny)))*3-nx*.22+20)%1;
    const offset=(Math.floor(v*tile.height)*tile.width+Math.floor(u*tile.width))*4;
    const a=pixels[offset]*pixels[offset+3]/255;
    const fade=Math.min(1,Math.max(0,(Math.hypot((x/w-.45)*1.2,(y/h-.44))-.18)*2.1));
    const k=(y*w+x)*4;out.data[k]=80;out.data[k+1]=157;out.data[k+2]=35;out.data[k+3]=a*.20*fade;
   }
   ctx.putImageData(out,0,0);
  };image.src=src;return()=>{alive=false;};
 },[src,W,H]);
 return <canvas ref={ref} className="dht-xbox-cellwall" aria-hidden="true" style={{position:"absolute",inset:0,width:W,height:H}}/>;
}
