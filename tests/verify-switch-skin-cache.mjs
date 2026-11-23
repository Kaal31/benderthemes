import assert from 'node:assert/strict';
import {build} from 'esbuild';
const built=await build({entryPoints:['src/switchSkinCache.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {createSwitchSkinLoader}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].text).toString('base64'));
const requests=[];
const loader=createSwitchSkinLoader(name=>new Promise((resolve,reject)=>requests.push({name,resolve,reject})));
const skin=name=>({file:name});
const first=loader.load('a'),duplicate=loader.load('a');
assert.equal(first,duplicate);await Promise.resolve();assert.equal(requests.length,1);
requests[0].resolve(skin('a'));assert.equal((await first).file,'a');assert.equal((await loader.load('a')).file,'a');assert.equal(requests.length,1);
for(const name of ['b','c']){const p=loader.load(name);await Promise.resolve();requests.at(-1).resolve(skin(name));await p;}
assert.equal(loader.peek('a'),undefined);assert.equal(loader.peek('b').file,'b');
const stale=loader.load('old');await Promise.resolve();const staleRequest=requests.at(-1);loader.clear();
const fresh=loader.load('old');await Promise.resolve();staleRequest.resolve(skin('old'));assert.equal(await stale,null);assert.equal(loader.peek('old'),undefined);
assert.equal(loader.load('old'),fresh);requests.at(-1).resolve(skin('old'));await fresh;
const failed=loader.load('retry');await Promise.resolve();requests.at(-1).reject(Error('temporary'));assert.equal(await failed,null);
const retry=loader.load('retry');await Promise.resolve();requests.at(-1).resolve(skin('retry'));assert.equal((await retry).file,'retry');
console.log('PASS Switch pending-read deduplication, bounded cache, resource invalidation and retry');
