import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage({viewport:{width:1280,height:900}});
await p.addInitScript(()=>{
 window.samples=[];window.edge=null;
 const proto=WebGL2RenderingContext.prototype;
 const storage=proto.renderbufferStorageMultisample;
 proto.renderbufferStorageMultisample=function(...args){window.samples.push(args[1]);return storage.apply(this,args);};
 const draw=proto.drawArrays;
 proto.drawArrays=function(...args){const r=draw.apply(this,args);if(!this.getParameter(this.FRAMEBUFFER_BINDING)&&this.canvas.closest('[data-avatar-engine]')){
 const w=this.drawingBufferWidth,h=this.drawingBufferHeight,buf=new Uint8Array(w*h*4);this.readPixels(0,0,w,h,this.RGBA,this.UNSIGNED_BYTE,buf);
 let partial=0,opaque=0;for(let i=3;i<buf.length;i+=4){if(buf[i]>0&&buf[i]<255)partial++;if(buf[i]===255)opaque++;}
 window.edge={w,h,partial,opaque,css:this.canvas.getBoundingClientRect().toJSON(),dpr:devicePixelRatio};
 }return r;};
});
await p.goto('http://127.0.0.1:8911/preview/metro-avatar-framing.html?theme=x360&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883');
await p.getByRole('button',{name:'social',exact:true}).click();await p.locator('[data-avatar-engine=ready]').waitFor({timeout:60000});await p.waitForTimeout(700);
const result=await p.evaluate(()=>({edge:window.edge,samples:[...new Set(window.samples)]}));assert(result.edge.w>=result.edge.css.width*1.98);assert(result.edge.h>=result.edge.css.height*1.98);assert(result.samples.includes(4));assert(result.edge.partial>500);assert(result.edge.opaque>20000);console.log('PASS 2x render resolution, 4x MSAA, smooth alpha edges and opaque body',result.edge);await p.screenshot({path:'preview/avatar-edges-fixed.png'});await b.close();
