// Geometry/pixel panel detection plus verified guided shell support.
export function createPanelEngine({config,scene,profile=null,onReport,enabled=false}){
// Experimental detector: theme overlay geometry + pixels, no theme-name rules.
const panelScene=scene,panelSurfaces=[];let disposed=false;
const panelDetection=[];
const shellPixels=new WeakMap();
function drawContinuousShell(ctx,image,width,height,density,extra){
 let source=shellPixels.get(image);if(!source){const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const t=c.getContext('2d',{willReadFrequently:true});t.drawImage(image,0,0);source=t.getImageData(0,0,c.width,c.height);shellPixels.set(image,source);}
 const smooth=t=>t*t*(3-2*t),forward=x=>x+extra*(x<=180?0:x<250?smooth((x-180)/70):x<=390?1:x<460?1+smooth((x-390)/70):2);
 const coordinates=[];for(let x=0;x<width;x++){const dest=(x+.5)/density;let lo=0,hi=640;for(let i=0;i<22;i++){const mid=(lo+hi)/2;if(forward(mid)<dest)lo=mid;else hi=mid;}const sx=Math.max(0,Math.min(source.width-1,(lo+hi)/2/640*source.width-.5)),x0=Math.floor(sx);coordinates.push([x0,Math.min(source.width-1,x0+1),sx-x0]);}
 const output=ctx.createImageData(width,height),src=source.data,dst=output.data;
 for(let y=0;y<height;y++){const sy=Math.max(0,Math.min(source.height-1,(y+.5)/height*source.height-.5)),y0=Math.floor(sy),y1=Math.min(source.height-1,y0+1),fy=sy-y0;
  for(let x=0;x<width;x++){const[x0,x1,fx]=coordinates[x],indices=[(y0*source.width+x0)*4,(y0*source.width+x1)*4,(y1*source.width+x0)*4,(y1*source.width+x1)*4],weights=[(1-fx)*(1-fy),fx*(1-fy),(1-fx)*fy,fx*fy],offset=(y*width+x)*4;let alpha=0;for(let i=0;i<4;i++)alpha+=src[indices[i]+3]*weights[i];dst[offset+3]=alpha;for(let k=0;k<3;k++){let value=0;for(let i=0;i<4;i++)value+=src[indices[i]+k]*src[indices[i]+3]*weights[i];dst[offset+k]=alpha?value/alpha:0;}}
 }
 ctx.putImageData(output,0,0);
}
function softenBackgroundEdges(ctx,image,width,height,left,center,density){
 let source=shellPixels.get(image);if(!source){const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const t=c.getContext('2d',{willReadFrequently:true});t.drawImage(image,0,0);source=t.getImageData(0,0,c.width,c.height);shellPixels.set(image,source);}
 const output=ctx.getImageData(0,0,width,height),pixels=output.data,src=source.data,blend=32*density;
 for(let y=0;y<height;y++){const sy=Math.floor(y/height*source.height);for(const side of ['left','right']){let sums=[0,0,0],alpha=0,count=0;const x0=side==='left'?0:source.width-16;
  for(let yy=Math.max(0,sy-14);yy<=Math.min(source.height-1,sy+14);yy++)for(let xx=x0;xx<x0+16;xx++){const n=(yy*source.width+xx)*4,a=src[n+3];for(let k=0;k<3;k++)sums[k]+=src[n+k]*a;alpha+=a;count++;}
  const average=sums.map(v=>alpha?v/alpha:0),begin=side==='left'?0:left+center,end=side==='left'?left:width;
  for(let x=begin;x<end;x++){const distance=side==='left'?left-1-x:x-(left+center),t=Math.min(1,distance/blend),weight=.5*(1+Math.cos(Math.PI*t)),n=(y*width+x)*4;for(let k=0;k<3;k++)pixels[n+k]=pixels[n+k]*weight+average[k]*(1-weight);pixels[n+3]=pixels[n+3]*weight+(alpha/count)*(1-weight);}
 }}ctx.putImageData(output,0,0);
}
// Preserve the source top and bottom bands in tall viewports; grow the interior
// with one continuous coordinate map instead of exposing a second background.
function extendBackgroundVertically(ctx,width,height,density,extra){
 const source=ctx.getImageData(0,0,width,height),out=ctx.createImageData(width,Math.round(height+extra*density)),total=out.height/density;
 for(let y=0;y<out.height;y++){const dest=(y+.5)/density;let lo=0,hi=480;for(let n=0;n<22;n++){const mid=(lo+hi)/2,t=Math.max(0,Math.min(1,(mid-64)/316)),forward=mid+extra*t*t*(3-2*t);if(forward<dest)lo=mid;else hi=mid;}const sy=Math.max(0,Math.min(height-1,(lo+hi)/2/480*height-.5)),a=Math.floor(sy),b=Math.min(height-1,a+1),f=sy-a;for(let x=0;x<width*4;x++)out.data[y*width*4+x]=source.data[a*width*4+x]*(1-f)+source.data[b*width*4+x]*f;}
 ctx.canvas.height=out.height;ctx.putImageData(out,0,0);return total;
}
function reportPanel(){onReport?.(panelDetection);}
function drawPanelSurfaces(){const scale=Math.min(innerWidth/640,innerHeight/480),width=Math.max(640,innerWidth/scale),extra=(width-640)/2,density=scale*devicePixelRatio;
 for(const {canvas,image,overlay,method} of panelSurfaces){const height=Math.round(overlay.height*density);canvas.width=Math.round(width*density);canvas.height=height;canvas.style.width=width+'px';canvas.style.left=-extra+'px';canvas.style.top=overlay.y+'px';canvas.style.height=overlay.height+'px';const ctx=canvas.getContext('2d');
  if(method==='guided full-screen shell'){drawContinuousShell(ctx,image,canvas.width,height,density,extra);}
  else if(method==='continuous edges'||method==='preserved background frame'){const left=Math.round(extra*density),center=Math.round(640*density);ctx.drawImage(image,0,0,1,image.height,0,0,left,height);ctx.drawImage(image,0,0,image.width,image.height,left,0,center,height);ctx.drawImage(image,image.width-1,0,1,image.height,left+center,0,canvas.width-left-center,height);if(method==='preserved background frame')softenBackgroundEdges(ctx,image,canvas.width,height,left,center,density);}
  else{const cap=Math.min(24,Math.floor(image.width/8)),capWidth=Math.round(cap/image.width*overlay.width*density);ctx.drawImage(image,0,0,cap,image.height,0,0,capWidth,height);ctx.drawImage(image,Math.floor(image.width/2),0,1,image.height,capWidth,0,canvas.width-2*capWidth,height);ctx.drawImage(image,image.width-cap,0,cap,image.height,canvas.width-capWidth,0,capWidth,height);}
  if(method==='preserved background frame'){const verticalExtra=Math.max(0,innerHeight/scale-480);if(verticalExtra>0){extendBackgroundVertically(ctx,canvas.width,height,density,verticalExtra);canvas.style.top=-verticalExtra/2+'px';canvas.style.height=(480+verticalExtra)+'px';}}
 }
}
const overlayCandidates=[...(config.ui?.overlays||[])];if(profile==='frame-background'&&config.interfaceBackground)overlayCandidates.push({image:config.interfaceBackground,x:0,y:0,width:640,height:480,background:true});
const panelLoads=overlayCandidates.map(async(overlay,index)=>{
 const result={index,x:overlay.x,y:overlay.y,width:overlay.width,height:overlay.height,accepted:false};panelDetection.push(result);
 const guided=(profile==='wiigb'||overlay.background===true)&&overlay.width===640&&overlay.height===480;
 if(!guided&&(overlay.width<320||overlay.height>160||overlay.height<16)){result.reason='Not a horizontal panel band';return;}
 const image=new Image();image.src=overlay.image;await image.decode();if(disposed)return;const probe=document.createElement('canvas');probe.width=image.width;probe.height=image.height;const ctx=probe.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
 const col=x=>ctx.getImageData(x,0,1,image.height).data,alpha=values=>Array.from(values).filter((_,i)=>i%4===3).reduce((a,b)=>a+b,0)/(image.height*255);
 let method;
 if(guided){method=overlay.background?'preserved background frame':'guided full-screen shell';result.guided=true;}
 else if(overlay.x===0&&overlay.width===640){if(Math.min(alpha(col(0)),alpha(col(image.width-1)))<.12){result.reason='Transparent outer edges: likely centered decoration or prompts';return;}method='continuous edges';}
 else{const center=col(Math.floor(image.width/2));let difference=0;for(const fraction of [.25,.35,.65,.75]){const sample=col(Math.floor(image.width*fraction));for(let i=0;i<sample.length;i++)difference=Math.max(difference,i%4===3?Math.abs(sample[i]-center[i]):Math.abs(sample[i]*sample[i-i%4+3]/255-center[i]*center[i-i%4+3]/255));}result.centerVariation=Math.round(difference*100)/100;if(difference>16||alpha(center)<.2){result.reason='Inset artwork has nonuniform center; cannot safely stretch';return;}method='preserved end caps';}
 result.position=guided?'full-screen':overlay.y+overlay.height/2<160?'top':overlay.y+overlay.height/2>320?'bottom':'middle';result.accepted=true;result.method=method;

 const original=overlay.background?document.createElement('img'):[...panelScene.querySelectorAll(':scope > img')].find(node=>node.src===image.src);if(!original){result.accepted=false;result.reason='Original overlay element not found';return;}
 const canvas=document.createElement('canvas');canvas.className='wiiflow-interface-panel';canvas.style.position='absolute';canvas.style.pointerEvents='none';canvas.dataset.panelPosition=result.position;canvas.style.top=overlay.y+'px';canvas.style.height=overlay.height+'px';canvas.style.zIndex=overlay.background?'-1':''+(20+index);original.style.visibility=enabled?'hidden':'';canvas.style.display=enabled?'':'none';panelScene.append(canvas);let surfaceImage=image;if(method==='continuous edges'){const cleaned=document.createElement('canvas');cleaned.width=image.width;cleaned.height=image.height;const clean=cleaned.getContext('2d');clean.drawImage(image,0,0);const pad=8;clean.clearRect(0,0,pad,image.height);clean.clearRect(image.width-pad,0,pad,image.height);clean.drawImage(image,pad,0,1,image.height,0,0,pad,image.height);clean.drawImage(image,image.width-pad-1,0,1,image.height,image.width-pad,0,pad,image.height);surfaceImage=cleaned;}panelSurfaces.push({canvas,image:surfaceImage,overlay,method,original});
});
const ready=Promise.allSettled(panelLoads).then(()=>{if(enabled)drawPanelSurfaces();reportPanel();return panelDetection;});
return {ready,resize(){if(enabled)drawPanelSurfaces();},setEnabled(value){enabled=value;for(const p of panelSurfaces){p.original.style.visibility=enabled?'hidden':'';p.canvas.style.display=enabled?'':'none';}if(enabled)drawPanelSurfaces();},dispose(){disposed=true;for(const p of panelSurfaces){p.original.style.visibility='';p.canvas.remove();}}};

}
