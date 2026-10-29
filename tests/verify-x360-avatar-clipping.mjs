import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});
try{
 for(const style of ['metro','nxe','kinect']){
  const p=await b.newPage({viewport:{width:1280,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{
   window.clipChecks={frames:0,borderHits:0};let last=0;
   const proto=WebGL2RenderingContext.prototype,draw=proto.drawArrays;
   proto.drawArrays=function(...args){const r=draw.apply(this,args);
    if(performance.now()-last>150&&!this.getParameter(this.FRAMEBUFFER_BINDING)&&this.canvas.closest('[data-avatar-engine=ready]')){
     last=performance.now();const w=this.drawingBufferWidth,h=this.drawingBufferHeight,pixels=new Uint8Array(Math.max(w,h)*4);
     for(const x of [0,w-1]){this.readPixels(x,0,1,h,this.RGBA,this.UNSIGNED_BYTE,pixels);for(let i=3;i<h*4;i+=4)if(pixels[i]>10)window.clipChecks.borderHits++;}
     for(const y of [0,h-1]){this.readPixels(0,y,w,1,this.RGBA,this.UNSIGNED_BYTE,pixels);for(let i=3;i<w*4;i+=4)if(pixels[i]>10)window.clipChecks.borderHits++;}
     window.clipChecks.frames++;
    }return r;};
  });
  await p.goto('http://127.0.0.1:8911/preview/x360-reference-corrected.html?theme=x360&xs='+style+'&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883');
  if(style==='metro')await p.getByRole('button',{name:'social',exact:true}).click();
  await p.locator('[data-avatar-engine=ready]').waitFor({timeout:60000});await p.waitForTimeout(12000);
  const result=await p.evaluate(()=>window.clipChecks);assert(result.frames>10);assert.equal(result.borderHits,0,style+' moving avatar must not touch any of the four canvas edges');assert.deepEqual(errors,[]);
  const shadow=p.locator('[data-avatar-floor-shadow]');assert.equal(await shadow.count(),1);const shadowBox=await shadow.boundingBox();assert(shadowBox.width>20&&shadowBox.height>=8);assert.equal(await shadow.evaluate(el=>getComputedStyle(el).mixBlendMode),'multiply');await p.screenshot({path:'preview/'+style+'-avatar-unclipped.png'});console.log('PASS',style,result);await p.close();
 }
}finally{await b.close();}
