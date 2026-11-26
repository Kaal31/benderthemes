import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {launch} from './browser.mjs';
const bundle=await build({stdin:{contents:'export {WiiGpuScene} from "./src/themes/WiiLayoutGpu";',resolveDir:process.cwd()},bundle:true,write:false,format:'iife',globalName:'WiiTest'});
const browser=await launch();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<canvas></canvas>');await page.addScriptTag({content:bundle.outputFiles[0].text});
 const fixture=async options=>{
  await page.evaluate(options=>{
   window.gpu?.dispose();
   const assets={},image=(name,width,colors)=>{const c=document.createElement('canvas');c.width=width;c.height=1;const g=c.getContext('2d');colors.forEach((color,i)=>{g.fillStyle=color;g.fillRect(i,0,1,1)});assets['test/'+name]={url:c.toDataURL(),width,height:1}};
   image('direct',4,['red','lime','blue','white']);image('offset',4,options.ramp?Array.from({length:4},(_,i)=>`rgba(0,0,0,${i/255})`):Array(4).fill(options.offsetColor??`rgba(0,0,0,${(options.offset??1)/255})`));
   const stage={coord:0,channel:4,map:0,swapTex:0,swapRas:0,color:[143,252,0,1],alpha:[71,118,0,1],indirect:[0,8|(options.bias??0),options.wrap??0,options.format??0]};
   if(options.matrixOff)stage.indirect[1]=0;
   const material={name:'material',textures:[0,1],complex:true,channelControl:options.channel??null,color:options.channel?[128,64,255,51]:[255,255,255,255],indirectSrt:[[options.translateX??0,0,options.rotation??0,options.scale??2,options.scaleY??0]],indirectStages:[[0,1,options.indirectScale??0,0]],tev:[stage]};
   if(options.addPrevious)material.tev.push({...stage,indirect:[0,0,6|(6<<3),4]});
   if(options.bump){material.tev=[{...stage}, {...stage,channel:options.normalized?8:7,color:[175,252,0,1],alpha:[7,118,0,1],indirect:[0,options.bias??0,0,(options.format??0)|((options.component??1)<<4)]}];}
   if(options.channel){material.tev=[{...stage,color:[175,252,0,1],alpha:[87,118,0,1],indirect:[0,0,0,0]}];material.indirectStages=[];}
   const u=options.u??.125,pane={name:'pane',kind:'pic1',parent:-1,visible:true,inheritAlpha:false,origin:4,alpha:1,position:[0,0,0],rotation:[0,0,0],scale:[1,1],size:[200,80],material:0,colors:Array.from({length:4},()=>options.channel?[64,192,128,128]:[255,255,255,255]),uv:[u,.5,u,.5,u,.5,u,.5]};
   const data={assets,layouts:[{id:'fixture',area:'test',size:[608,456],textures:['direct.tpl','offset.tpl'],materials:[material],panes:[pane]}],animations:[{id:'indirectScale',tracks:[{pane:'material',material:true,type:'RLIM',index:0,target:3,interpolation:'step',keys:[[0,2],[1,3]]}]}]};
   window.gpu=new WiiTest.WiiGpuScene(document.querySelector('canvas'),data,false);window.actor=gpu.actor('fixture');
  },options);
  await page.waitForFunction(()=>[...gpu.textures.values()].every(t=>t.image?.complete));
  return page.evaluate(()=>{gpu.render();const gl=gpu.renderer.getContext(),pixel=new Uint8Array(4);gl.readPixels(640,400,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);return [...pixel]});
 };
 assert.deepEqual(await fixture({}),[0,0,255,255],'Static indirect matrix shifts the direct lookup by two texels');
 assert.deepEqual(await fixture({offset:129,bias:1}),[0,0,255,255],'8-bit signed bias occurs before the matrix');
 assert.deepEqual(await fixture({offset:8,format:1}),[0,0,255,255],'5-bit indirect offset extraction');
 assert.deepEqual(await fixture({offset:16,format:2}),[0,0,255,255],'4-bit indirect offset extraction');
 assert.deepEqual(await fixture({offset:32,format:3}),[0,0,255,255],'3-bit indirect offset extraction');
 assert.deepEqual(await fixture({offset:0,format:1,bias:1}),[0,0,255,255],'Reduced-bit signed bias uses +1');
 assert.deepEqual(await fixture({ramp:true,u:.375}),[255,255,255,255],'Indirect texture sampling uses its source coordinate');
 assert.deepEqual(await fixture({ramp:true,u:.375,indirectScale:1}),[0,255,0,255],'Indirect coordinate scale changes the offset lookup');
 assert.deepEqual(await fixture({offsetColor:'rgba(0,0,1,1)',rotation:-90,scale:0,scaleY:2}),[0,0,255,255],'Indirect matrix rotation transforms offset components');
 assert.deepEqual(await fixture({offsetColor:'rgba(0,1,0,1)',translateX:2,scale:0}),[0,0,255,255],'Indirect matrix third column uses the U component');
 assert.deepEqual(await fixture({matrixOff:true,wrap:1,u:64.125}),[255,0,0,255],'Indirect wrap applies in texel units');
 assert.deepEqual(await fixture({addPrevious:true}),[0,0,255,255],'A later stage can accumulate the previous adjusted coordinates');
 for(const [format,offset,expected] of [[0,255,248],[1,7,224],[2,15,240],[3,31,248]]){
  const pixel=await fixture({bump:true,format,offset});assert(pixel.slice(0,3).every(v=>Math.abs(v-expected)<=1),'Bump alpha extracts the correct low bits for format '+format+': '+pixel);
 }
 assert.deepEqual(await fixture({bump:true,offset:255,normalized:true}),[255,255,255,255],'Normalized bump alpha reaches full white');
 assert.deepEqual(await fixture({bump:true,offsetColor:'rgba(0,0,136,1)',component:2,bias:2}),[136,136,136,255],'T bump comes from blue before signed bias');
 assert.deepEqual(await fixture({bump:true,offsetColor:'rgba(0,200,0,1)',component:3}),[200,200,200,255],'U bump comes from green');
 await fixture({});
 const animated=await page.evaluate(()=>{actor.apply('indirectScale',1);actor.commit();gpu.render();const p=new Uint8Array(4);gpu.renderer.getContext().readPixels(640,400,1,1,6408,5121,p);return [...p]});
 assert.deepEqual(animated,[255,255,255,255],'RLIM animation changes the indirect matrix scale');
 const channel=await fixture({channel:[0,1]});assert(channel.every((v,i)=>Math.abs(v-[64,32,128,255][i])<=1),'Register RGB and vertex alpha are independent: '+channel);
 const inverse=await fixture({channel:[1,0]});assert(inverse.every((v,i)=>Math.abs(v-[13,38,26,255][i])<=1),'Vertex RGB and register alpha are independent: '+inverse);
 await page.evaluate(()=>gpu.dispose());assert.deepEqual(errors,[]);
 console.log('PASS Wii indirect offsets, bias, format, wrap, accumulation, RLIM animation and independent material/vertex channels');
}finally{await browser.close();}
