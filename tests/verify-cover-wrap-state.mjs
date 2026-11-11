import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtemp,unlink,rmdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const directory=await mkdtemp(join(tmpdir(),'cover-wrap-state-')),file=join(directory,'state.mjs');
const calls=[],waiting=[];
globalThis.__wrapBackend=async(name,args)=>{
 assert.equal(name,'cover_wrap_get');
 if(!args[2])return {mode:'auto'};
 calls.push(args[0]);
 return new Promise(resolve=>waiting.push(resolve));
};
try{
 await build({entryPoints:['src/coverWraps.ts'],outfile:file,bundle:true,format:'esm',platform:'node',plugins:[{
  name:'mock-decky',setup(build){
   build.onResolve({filter:/^@decky\/api$/},()=>({path:'decky',namespace:'mock'}));
   build.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:'export const callable=name=>(...args)=>globalThis.__wrapBackend(name,args);'}));
  }
 }]});
 const wraps=await import(pathToFileURL(file)),game=appid=>({appid,name:'Game '+appid});
 const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
 const first=wraps.discoverCoverWrap(game(1));await tick();
 wraps.rememberWrap(1,{mode:'generated'});
 waiting.shift()({mode:'auto',url:'https://example.invalid/old.png'});await first;
 assert.equal((await wraps.getCoverWrap(game(1))).mode,'generated','Late automatic response cannot undo generated mode');
 const second=wraps.discoverCoverWrap(game(2));await tick();
 await wraps.discoverCoverWrap(game(3));await wraps.discoverCoverWrap(game(4));
 wraps.rememberWrap(2,{mode:'manual',url:'data:image/png;base64,manual'});
 waiting.shift()({mode:'auto',url:'https://example.invalid/stale.png'});await second;await tick();
 assert.deepEqual(calls,['1','2','4'],'A busy lookup keeps only the most recent pending selection');
 assert.equal((await wraps.getCoverWrap(game(2))).mode,'manual');
 waiting.shift()({mode:'auto'});await tick();
 console.log('PASS stale network replies preserve manual/generated choices; discovery queue downloads only the latest pending game');
}finally{delete globalThis.__wrapBackend;await unlink(file).catch(()=>{});await rmdir(directory)}
