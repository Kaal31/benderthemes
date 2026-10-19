// Local analysis only. Inputs and translated firmware programs remain in work/.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
const input=process.argv[2],decoder=process.argv[3],cross=process.argv[4];
if(!input||!decoder)throw new Error('Usage: node tools/analyze_switch_shaders.mjs LOCAL_BINARY BNSH_DECODER_BUNDLE [SPIRV_CROSS_EXE]');
const raw=readFileSync(input),bundle=readFileSync(decoder,'utf8');
if(raw.length>32*1024*1024||bundle.length>4*1024*1024)throw new Error('Analysis input exceeds limit');
const hash=data=>createHash('sha256').update(data).digest('hex'),out=resolve('work/switch-base-analysis/shader-analysis',basename(input));mkdirSync(out,{recursive:true});
// The old decoder's Node exit handler crashes the process on some shader
// paths. A disposable browser worker isolates failure and avoids that handler.
const boot=`const diagnostics=[];console.log=console.error=console.warn=(...args)=>diagnostics.push(args.map(String).join(' ').slice(0,2000));const exports={};const require=()=>({});\n${bundle}\nself.onmessage=e=>{try{const r=exports.decode(new Uint8Array(e.data));postMessage({ok:true,...r,spirv:[...r.spirv]});}catch(e){postMessage({ok:false,error:e?.message??JSON.stringify(e,Object.getOwnPropertyNames(e??{})),diagnostics});}};postMessage({ready:true});`;
const signature=Buffer.from('78563412','hex'),starts=[];
for(let pos=raw.indexOf(signature);pos>=0;pos=raw.indexOf(signature,pos+4)){
 if(pos+0x80>raw.length)continue;
 const sph=raw.readUInt32LE(pos+0x30),stage=(sph>>>10)&15;
 // NVN program headers have SPH type 2 for fragment stages. This excludes
 // unrelated 0x12345678 sentinels in the executable.
 if((sph&31)===2&&stage===5)starts.push(pos);
}
const browser=await chromium.launch(),records=[];
try{
 const page=await browser.newPage();await page.setContent('<body>');
 for(const start of starts){
  const next=raw.indexOf(signature,start+4),end=Math.min(raw.length,next<0?raw.length:next,start+64*1024);
  const result=await page.evaluate(({boot,data})=>new Promise(resolve=>{
   const url=URL.createObjectURL(new Blob([boot],{type:'text/javascript'})),worker=new Worker(url);
   const timer=setTimeout(()=>finish({ok:false,error:'Decoder timed out'}),8000);
   function finish(value){clearTimeout(timer);worker.terminate();URL.revokeObjectURL(url);resolve(value);}
   worker.onerror=e=>finish({ok:false,error:e.message});worker.onmessage=e=>{if(e.data.ready)worker.postMessage(data);else finish(e.data);};
  }),{boot,data:[...raw.subarray(start+0x30,end)]});
  const record={offset:start,stage:'fragment',ok:result.ok,error:result.error,diagnostics:result.diagnostics,constantBuffers:result.constantBuffers,samplers:result.samplers,inputAttributes:result.inputAttributes};
  if(result.ok){
   const spirv=Buffer.alloc(result.spirv.length*4);result.spirv.forEach((word,i)=>spirv.writeUInt32LE(word,i*4));const path=resolve(out,start.toString(16)+'.spv');writeFileSync(path,spirv);record.spirvSHA256=hash(spirv);
   if(cross)try{execFileSync(resolve(cross),[path,'--output',resolve(out,start.toString(16)+'.glsl'),'--version','330'],{stdio:'pipe',windowsHide:true});record.glsl=true;}catch(error){record.glsl=false;record.crossError=String(error.stderr??error.message);}
  }
  records.push(record);console.log(start.toString(16),record.ok?'decoded':'failed',record.glsl===true?'GLSL':'');
 }
}finally{await browser.close();}
writeFileSync(resolve(out,'analysis.json'),JSON.stringify({input:basename(input),inputSHA256:hash(raw),decoderSHA256:hash(bundle),translator:cross?basename(cross):null,programs:records},null,2));
console.log(`${records.filter(r=>r.ok).length}/${records.length} fragments decoded; local output: ${out}`);
if(records.some(r=>!r.ok||r.glsl===false))process.exitCode=1;
