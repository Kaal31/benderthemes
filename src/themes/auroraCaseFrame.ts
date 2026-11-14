import {artworkCrop} from './x360CoverMaterial';
import type {CoverPanel} from './x360CoverMaterial';

/** Map a conventional back–spine–front scan onto the imported paper-sleeve UVs.
 * Source spine width is inferred from the physical panel aspect, so DVD and
 * Blu-ray scans retain their original proportions without a new brand overlay.
 */
export function paintFullWrap(ctx:CanvasRenderingContext2D,image:HTMLImageElement,panels:CoverPanel[]){
 const width=ctx.canvas.width,height=ctx.canvas.height,iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;
 ctx.clearRect(0,0,width,height);
 if(panels.length!==2){ctx.drawImage(image,0,0,width,height);return;}
 const [back,front]=panels,aspect=(back.aspect+front.aspect)/2;
 // Typical wrap: two broad faces plus a narrow printed spine.
 const sourcePanel=Math.min(iw*.495,ih*aspect),spine=Math.max(0,iw-2*sourcePanel);
 for(const [panel,sourceX] of [[back,0],[front,iw-sourcePanel]] as const){
  ctx.drawImage(image,sourceX,0,sourcePanel,ih,panel.left*width,panel.top*height,(panel.right-panel.left)*width,(panel.bottom-panel.top)*height);
 }
 if(front.left>back.right&&spine>0)ctx.drawImage(image,sourcePanel,0,spine,ih,back.right*width,0,(front.left-back.right)*width,height);
}
// A single original, reusable template. No external template or per-game badges.
const frames=new Map<string,HTMLCanvasElement>();
export function auroraCaseFrame(width:number,height:number,template?:HTMLImageElement,face:'front'|'back'='front'):HTMLCanvasElement{
 const key=width+'x'+height+':'+(template?.src??'steam')+':'+face,cached=frames.get(key);if(cached)return cached;
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d')!;
 if(template){
  if(face==='front')ctx.drawImage(template,574,0,519,90,0,0,width,height*90/731);
  ctx.strokeStyle='#8fc332';ctx.lineWidth=Math.max(1,width/500);ctx.strokeRect(.5,.5,width-1,height-1);
  frames.set(key,canvas);return canvas;
 }
 const u=width/600;ctx.scale(u,u);const h=height/u;
 const band=ctx.createLinearGradient(0,0,600,86);band.addColorStop(0,'#203a50');band.addColorStop(1,'#10212e');ctx.fillStyle=band;ctx.fillRect(0,0,600,86);
 ctx.fillStyle='#72bce9';ctx.fillRect(0,82,600,4);
 // Mechanical joint mark, drawn for this frame rather than copied from a template.
 ctx.strokeStyle='#fff';ctx.fillStyle='#fff';ctx.lineWidth=7;ctx.beginPath();ctx.arc(57,42,21,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(57,42,10,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(40,57);ctx.lineTo(24,65);ctx.lineTo(8,57);ctx.lineTo(9,69);ctx.lineTo(26,77);ctx.lineTo(49,64);ctx.closePath();ctx.fill();
 ctx.font='600 36px Arial,sans-serif';ctx.textBaseline='middle';ctx.fillText('STEAM',98,44);ctx.fillStyle='#c8d6df';ctx.font='600 24px Arial,sans-serif';ctx.textAlign='right';ctx.fillText('PC',569,44);
 ctx.strokeStyle='rgba(0,0,0,.75)';ctx.lineWidth=8;ctx.strokeRect(4,4,592,h-8);ctx.strokeStyle='rgba(255,255,255,.26)';ctx.lineWidth=2;ctx.strokeRect(9,9,582,h-18);
 frames.set(key,canvas);return canvas;
}
export function paintAuroraCase(ctx:CanvasRenderingContext2D,image:HTMLImageElement,aspect:number,x:number,y:number,width:number,height:number,template?:HTMLImageElement,face:'front'|'back'='front'){
 const sheet=document.createElement('canvas');sheet.width=600;sheet.height=Math.round(600/aspect);const g=sheet.getContext('2d')!,inset=template?2:8,header=template?(face==='front'?Math.round(sheet.height*90/731):2):86,artWidth=600-inset*2,artHeight=sheet.height-header-inset;
 g.fillStyle='#17232f';g.fillRect(0,0,600,sheet.height);const crop=artworkCrop(image.naturalWidth||image.width,image.naturalHeight||image.height,artWidth,artHeight);g.drawImage(image,crop.x,crop.y,crop.width,crop.height,inset,header,artWidth,artHeight);g.drawImage(auroraCaseFrame(sheet.width,sheet.height,template,face),0,0);ctx.drawImage(sheet,x,y,width,height);
}

/** A generated back uses the game's hero art and title; no invented review copy. */
export function paintGeneratedBack(ctx:CanvasRenderingContext2D,image:HTMLImageElement,title:string,panel:CoverPanel){
 const x=panel.left*ctx.canvas.width,y=panel.top*ctx.canvas.height,w=(panel.right-panel.left)*ctx.canvas.width,h=(panel.bottom-panel.top)*ctx.canvas.height;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 const crop=artworkCrop(image.naturalWidth||image.width,image.naturalHeight||image.height,w,h);
 ctx.drawImage(image,crop.x,crop.y,crop.width,crop.height,x,y,w,h);
 // Keep the hero's colors. Only the title strip needs contrast for readability.
 ctx.fillStyle='rgba(10,17,24,.72)';ctx.fillRect(x,y+h*.83,w,h*.17);
 ctx.font=`600 ${Math.round(w*.065)}px Arial,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';
 ctx.fillText(title,x+w/2,y+h*.915,w*.9);ctx.restore();
}


/** Print the game's title in the wrap's spine strip, using the original case UVs. */
export function paintAuroraSpine(
 ctx:CanvasRenderingContext2D,
 title:string,
 image:HTMLImageElement,
 x:number,
 width:number,
 height:number,
 template?:HTMLImageElement
){
 if(width<=0)return;
 ctx.save();
 ctx.beginPath();
 ctx.rect(x,0,width,height);
 ctx.clip();
 // The paper sleeve inherits the cover's edge colors rather than bare plastic.
 ctx.drawImage(image,0,0,Math.max(1,image.naturalWidth*.08),image.naturalHeight,x,0,width,height);
 ctx.fillStyle='rgba(0,0,0,.24)';
 ctx.fillRect(x,0,width,height);
 const header=template?height*190/731:0;
 if(template)ctx.drawImage(template,518,0,56,190,x,0,width,header);
 ctx.translate(x+width/2,header+(height-header)/2);
 ctx.rotate(Math.PI/2);
 const fontSize=Math.max(10,Math.min(32,width*.62));
 ctx.font='600 '+fontSize+'px Arial,sans-serif';
 ctx.textAlign='center';
 ctx.textBaseline='middle';
 ctx.fillStyle='#fff';
 ctx.shadowColor='rgba(0,0,0,.8)';
 ctx.shadowBlur=2;
 ctx.fillText(title,0,0,Math.max(1,height-header-24));
 ctx.restore();
}
