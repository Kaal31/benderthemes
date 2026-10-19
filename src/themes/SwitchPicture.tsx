import {useContext,useEffect,useRef} from 'react';
import type {SwitchPicture as Picture} from '../switchThemes';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {decodeSwitchASTC} from './switchASTC';
import {SwitchTextureMotionContext} from './switchTextureMotion';

export function useSwitchPicture(file:string,name:string){return useContext(SwitchNativeContext)?.nativePictures?.[file]?.[name];}
const images=new Map<string,Promise<HTMLImageElement|HTMLCanvasElement>>();
function load(source:string){let image=images.get(source);if(!image){if(source.startsWith('data:application/x-dht-astc;'))image=decodeSwitchASTC(source);else{const img=new Image();img.src=source;image=img.decode().then(()=>img);}if(images.size>512)images.delete(images.keys().next().value!);images.set(source,image);}return image;}
export function wrapSwitchUV(value:number,mode:number){
 if(mode===1)return ((value%1)+1)%1;
 if(mode===2){const period=((value%2)+2)%2;return period>1?2-period:period;}
 return Math.max(0,Math.min(1,value));
}
/** Wrap every filter tap, including neighbours across a repeat seam. */
export function switchTexelIndex(index:number,size:number,mode:number){
 if(mode===1)return ((index%size)+size)%size;
 if(mode===2){const period=((index%(2*size))+2*size)%(2*size);return period<size?period:2*size-1-period;}
 return Math.max(0,Math.min(size-1,index));
}
/** Sample native quad UVs; masks keep their channel/alpha swizzle from BNTX. */
export function SwitchPicture({picture,uv=picture.uv}:{picture:Picture;uv?:number[]}){
 const canvas=useRef<HTMLCanvasElement>(null),motion=useContext(SwitchTextureMotionContext);
 useEffect(()=>{
  let disposed=false,raf=0;
  if(motion.channels)for(const [name,value] of [['x','1'],['y','1'],['angle','0'],['offset-x','0'],['offset-y','0']])try{CSS.registerProperty({name:'--dht-nx-uv-'+name,syntax:'<number>',inherits:true,initialValue:value});}catch{/* Registered by another material. */}
  if(canvas.current){canvas.current.dataset.nxPictureStatus='loading';delete canvas.current.dataset.nxPictureError;}
  void load(picture.source).then(image=>{
   if(disposed)return;const target=canvas.current;if(!target)return;
   const iw=image instanceof HTMLImageElement?image.naturalWidth:image.width,ih=image instanceof HTMLImageElement?image.naturalHeight:image.height;
   const width=Math.min(1024,Math.max(1,Math.round(iw*Math.max(Math.abs(uv[2]-uv[0]),Math.abs(uv[6]-uv[4]))))),height=Math.min(1024,Math.max(1,Math.round(ih*Math.max(Math.abs(uv[5]-uv[1]),Math.abs(uv[7]-uv[3])))));
   target.width=width;target.height=height;
   const input=document.createElement('canvas');input.width=iw;input.height=ih;const source=input.getContext('2d'),context=target.getContext('2d');if(!source||!context)return;
   source.drawImage(image,0,0);const pixels=source.getImageData(0,0,input.width,input.height).data,output=context.createImageData(width,height),[baseTx,baseTy,baseAngle,baseSx,baseSy]=picture.transform,linear=((picture.wrapT>>2)&1)!==0;
   let previous='';
   const paint=()=>{
   if(disposed)return;
   const style=motion.channels?getComputedStyle(target):undefined;
   const value=(name:string,fallback:number)=>{const v=parseFloat(style?.getPropertyValue('--dht-nx-uv-'+name)??'');return Number.isFinite(v)?v:fallback;};
   const sx=motion.channels&1?value('x',baseSx):baseSx,sy=motion.channels&2?value('y',baseSy):baseSy,angle=motion.channels&4?value('angle',baseAngle):baseAngle,tx=motion.channels&8?value('offset-x',baseTx):baseTx,ty=motion.channels&16?value('offset-y',baseTy):baseTy,key=[sx,sy,angle,tx,ty].join();
   if(key!==previous){previous=key;
   const radians=angle*Math.PI/180,cos=Math.cos(radians),sin=Math.sin(radians);
   for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const u=(x+.5)/width,v=(y+.5)/height;
    const a=(uv[0]*(1-u)+uv[2]*u)*(1-v)+(uv[4]*(1-u)+uv[6]*u)*v,b=(uv[1]*(1-u)+uv[3]*u)*(1-v)+(uv[5]*(1-u)+uv[7]*u)*v;
    const px=wrapSwitchUV((a-.5)*sx*cos-(b-.5)*sy*sin+.5+tx,picture.wrapS&3)*input.width-.5,py=wrapSwitchUV((a-.5)*sx*sin+(b-.5)*sy*cos+.5+ty,picture.wrapT&3)*input.height-.5;
    const sample=(ix:number,iy:number,c:number)=>pixels[(switchTexelIndex(iy,input.height,picture.wrapT&3)*input.width+switchTexelIndex(ix,input.width,picture.wrapS&3))*4+c];
    for(let c=0;c<4;c++){
     const ix=Math.floor(px),iy=Math.floor(py),fx=px-ix,fy=py-iy;
     output.data[(y*width+x)*4+c]=linear?(sample(ix,iy,c)*(1-fx)+sample(ix+1,iy,c)*fx)*(1-fy)+(sample(ix,iy+1,c)*(1-fx)+sample(ix+1,iy+1,c)*fx)*fy:sample(Math.round(px),Math.round(py),c);
    }
   }
   context.putImageData(output,0,0);
   target.dataset.nxPictureStatus='ready';
   target.dataset.nxPictureUv=key;
   }
   if(motion.channels&&motion.enabled&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)raf=requestAnimationFrame(paint);
   };paint();
  }).catch(error=>{if(!disposed&&canvas.current){canvas.current.dataset.nxPictureStatus='error';canvas.current.dataset.nxPictureError=error instanceof Error?error.message:'Texture decode failed';canvas.current.getContext('2d')?.clearRect(0,0,canvas.current.width,canvas.current.height);}});
  return()=>{disposed=true;cancelAnimationFrame(raf);};
 },[picture,uv,motion.channels,motion.enabled]);
 return <canvas ref={canvas} data-nx-native-picture={picture.texture} style={{display:'block',width:'100%',height:'100%',objectFit:'fill'}}/>;
}
