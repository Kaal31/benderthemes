import {useEffect,useState} from 'react';
/** A mirrored period consists of the original tile followed by its reflection. */
export function useSwitchMirroredImage(source:string|null|undefined,mirrorX=false,mirrorY=false){
 const [rendered,setRendered]=useState<{source:string;image:string;key:string}>();
 const key=[mirrorX,mirrorY].join();
 useEffect(()=>{
  if(!source||(!mirrorX&&!mirrorY))return;
  let alive=true;const image=new Image();image.onload=()=>{
   if(!alive)return;
   const canvas=document.createElement('canvas'),cols=mirrorX?2:1,rows=mirrorY?2:1,w=image.naturalWidth,h=image.naturalHeight;canvas.width=w*cols;canvas.height=h*rows;
   const ctx=canvas.getContext('2d');if(!ctx)return;
   for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){ctx.save();ctx.translate(x?w*2:0,y?h*2:0);ctx.scale(x?-1:1,y?-1:1);ctx.drawImage(image,0,0);ctx.restore();}
   try{setRendered({source,image:canvas.toDataURL(),key});}catch{/* Keep the original if a user-supplied URL disallows canvas readback. */}
  };image.src=source;return()=>{alive=false;};
 },[source,key]);
 return rendered&&rendered.source===source&&rendered.key===key?rendered.image:source;
}
