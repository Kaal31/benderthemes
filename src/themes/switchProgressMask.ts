import type {CSSProperties} from 'react';
import type {SwitchEffect} from '../switchThemes';
import type {SwitchScenePane} from './switchSceneTypes';
import {switchPaneOrigin} from './switchPaneOrigin';
import {vertexPixels} from './SwitchMaterial';

/** Native ProgressBar writes only destination alpha in P_ProgressMask (RGB
 * factors 0/1), then paints P_Progress with destination-alpha factors 6/7.
 * Consequently a mask's vertex RGB is not a tint for the visible fill. */
export function switchProgressMask(mask:SwitchScenePane,effect:SwitchEffect,fill:SwitchScenePane):CSSProperties{
 const width=Math.max(1,fill.size[0]),height=Math.max(1,fill.size[1]),canvas=document.createElement('canvas');
 canvas.width=Math.min(1024,Math.max(1,Math.ceil(width)));canvas.height=Math.min(1024,Math.max(1,Math.ceil(height)));
 const context=canvas.getContext('2d');if(!context)return {};
 const w=effect.Size?.X??mask.size[0],h=effect.Size?.Y??mask.size[1],origin=switchPaneOrigin(mask.origin),fillOrigin=switchPaneOrigin(fill.origin);
 const fraction=(axis:number)=>axis===1?0:axis===2?1:.5;
 const fillX=fill.position[0]-width*fraction(fillOrigin.x),fillY=-fill.position[1]-height*fraction(fillOrigin.y);
 const x=effect.Position?.X??mask.position[0],y=-(effect.Position?.Y??mask.position[1]);
 const corners=Object.fromEntries(Object.entries(effect.corners??{}).map(([name,color])=>[name,[255,255,255,color[3]??255]]));
 const pixels=document.createElement('canvas');pixels.width=pixels.height=32;const ink=pixels.getContext('2d');if(!ink)return {};
 const image=ink.createImageData(32,32);image.data.set(vertexPixels(corners));ink.putImageData(image,0,0);
 context.scale(canvas.width/width,canvas.height/height);context.translate(x-fillX,y-fillY);context.rotate(-(effect.Rotation?.Z??mask.rotation[2])*Math.PI/180);context.scale(effect.Scale?.X??mask.scale[0],effect.Scale?.Y??mask.scale[1]);
 const left=-w*fraction(effect.OriginX??origin.x),top=-h*fraction(effect.OriginY??origin.y);
 context.beginPath();context.roundRect(left,top,Math.max(0,w),Math.max(0,h),Math.max(0,Math.min(effect.radius??0,w/2,h/2)));context.clip();
 context.globalAlpha=effect.Visible===false?0:mask.alpha/255*Math.max(0,Math.min(255,effect.white?.[3]??255))/255;
 context.drawImage(pixels,left,top,w,h);
 const source=`url("${canvas.toDataURL()}")`;
 return {maskImage:source,WebkitMaskImage:source,maskSize:'100% 100%',WebkitMaskSize:'100% 100%'};
}
