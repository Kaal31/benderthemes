import {build} from 'esbuild';
import assert from 'node:assert/strict';
// Node workflow checks supply a small window fixture but have no browser location.
assert.equal(typeof globalThis.location,'undefined');
globalThis.window={addEventListener(){},removeEventListener(){},__testAssets:{sample:{icon:'sample.png'}}};
const bundled=await build({entryPoints:['preview/stubs/api.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {callable}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
assert.deepEqual(await callable('animated_wallpapers_list')(),{items:[]});
assert.deepEqual(await callable('get_assets')('sample'),{icon:'sample.png'});
assert.deepEqual(await callable('get_native_mii')(),{});
assert.equal(await callable('get_wii_standard')(true),null);
assert.deepEqual(await callable('x360_runtime_info')(),{});
assert.deepEqual((await callable('list_data_themes')()).themes,[]);
window.__communitySources=[{repo:'example/source',themes:[{id:'test',name:'Test theme',version:'1'}]}];
assert.equal((await callable('community_package')('example/source','test','install')).ok,true);
assert.equal(window.__dataThemes.base,'/themes');
console.log('PASS preview API routes and fixture fallback without browser location');
