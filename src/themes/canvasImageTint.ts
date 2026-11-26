let nextId=0;
/** Channel multiplication without changing source alpha or cropping to a scratch viewport. */
export function canvasImageTint(document:Document){
 const ns='http://www.w3.org/2000/svg',host=document.createElementNS(ns,'svg'),defs=document.createElementNS(ns,'defs'),filter=document.createElementNS(ns,'filter'),matrix=document.createElementNS(ns,'feColorMatrix'),id=`dht-image-tint-${++nextId}`;
 host.setAttribute('width','0');host.setAttribute('height','0');host.setAttribute('aria-hidden','true');host.style.cssText='position:absolute;pointer-events:none';
 filter.id=id;filter.setAttribute('color-interpolation-filters','sRGB');matrix.setAttribute('type','matrix');
 filter.appendChild(matrix);defs.appendChild(filter);host.appendChild(defs);(document.body??document.documentElement).appendChild(host);
 let previous='';
 return {
  draw(ctx:CanvasRenderingContext2D,image:CanvasImageSource,x:number,y:number,width:number,height:number,color:number[]){
   const key=color.slice(0,3).join(',');
   if(key!==previous){const [r,g,b]=color;matrix.setAttribute('values',`${r} 0 0 0 0 0 ${g} 0 0 0 0 0 ${b} 0 0 0 0 0 1 0`);previous=key;}
   ctx.save();ctx.filter=`url(#${id})`;ctx.drawImage(image,x,y,width,height);ctx.restore();
  },
  dispose(){host.remove();}
 };
}
