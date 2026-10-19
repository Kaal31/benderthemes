import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const result=await build({stdin:{contents:'export {installSpotlightPlugin} from "./src/PluginSpotlight";export {SPOTLIGHT_PLUGINS} from "./src/spotlightCatalog";',resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm',alias:{'@decky/ui':'./preview/stubs/ui.tsx','@decky/api':'./preview/stubs/api.ts'}});
let calls=[];globalThis.window={addEventListener(){},DeckyBackend:{call:async(...args)=>calls.push(args)}};
const m=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64')).catch(e=>{console.error(e.message);process.exit(1);});
assert.equal(m.SPOTLIGHT_PLUGINS.length,36);
assert.equal(m.SPOTLIGHT_PLUGINS.filter(p=>p.install).length,28);
const sources=JSON.parse(readFileSync('py_modules/spotlight_plugins.json','utf8'));
assert.equal(sources.length,28);
for(const pick of m.SPOTLIGHT_PLUGINS.filter(p=>p.install)) {
 const repo=new URL(pick.projectUrl).pathname.split('/').slice(1,3).join('/');
 assert.ok(sources.some(s=>s.repo===repo&&s.name===pick.install.pluginName),`missing updater source: ${pick.name}`);
}
assert.equal(new Set(m.SPOTLIGHT_PLUGINS.map(p=>new URL(p.projectUrl).pathname.split('/').slice(1,3).join('/').toLowerCase())).size,36,'one card per repository');
for(let i=0;i<m.SPOTLIGHT_PLUGINS.length;i++)await m.installSpotlightPlugin(i);
assert.equal(calls.length,28);calls=[];m.SPOTLIGHT_PLUGINS.splice(0);
m.SPOTLIGHT_PLUGINS.push({id:'test',name:'Test fixture',author:'Test',description:'',whyFeatured:'',projectUrl:'https://github.com/example/test',install:{pluginName:'Test fixture',version:'1.0.0',zipUrl:'https://github.com/example/test/releases/download/v1.0.0/plugin.zip'}});
await m.installSpotlightPlugin(0);assert.deepEqual(calls[0],['utilities/install_plugin','https://github.com/example/test/releases/download/v1.0.0/plugin.zip','Test fixture','1.0.0','',1]);
m.SPOTLIGHT_PLUGINS[0].install.zipUrl='https://github.com/other/test/releases/download/v1/plugin.zip';await assert.rejects(()=>m.installSpotlightPlugin(0));assert.equal(calls.length,1);
console.log('PASS: verified release handoff to Decky; foreign download rejected.');
