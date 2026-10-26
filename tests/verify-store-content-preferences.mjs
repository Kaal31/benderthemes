import {build} from 'esbuild';
import {writeFileSync,mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
mkdirSync('out/store-preferences-test',{recursive:true});
const result=await build({entryPoints:['src/store.ts'],bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'store-api-fixture',setup(b){b.onResolve({filter:/^@decky\/api$/},()=>({path:'api',namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export const fetchNoCors=(...args)=>globalThis.__storeFetch(...args);',loader:'js'}));}}]});
const file=resolve('out/store-preferences-test/store.mjs');writeFileSync(file,result.outputFiles[0].text);const api=await import(pathToFileURL(file));
const plain={id:101,name:'General game'},adult={id:102,name:'Restricted game'},violent={id:103,name:'Violent game'},missing={id:104,name:'Missing classification'};
let requests=[],networkFailed=false,pending,changeDuringRequest=false;
globalThis.settingsStore={excludedStoreContentDescriptors:[3]};globalThis.SteamClient={User:{GetIPCountry:async()=> 'US'}};
globalThis.__storeFetch=async url=>{
 requests.push(url);let data;
 if(url.includes('GetItems')){
  if(networkFailed)throw Error('Network offline');
  const input=JSON.parse(new URL(url).searchParams.get('input_json'));assert.equal(input.context.country_code,'US');assert.ok(input.ids.length<=50);
  if(changeDuringRequest){await new Promise(resolve=>pending=resolve);changeDuringRequest=false;}
  data={response:{store_items:input.ids.filter(x=>x.appid!==104).map(({appid})=>({appid,id:appid,success:1,...(appid===102?{content_descriptorids:[3]}:appid===103||appid===106?{content_descriptorids:[2]}:{})}))}};
 }else if(url.includes('featuredcategories'))data={specials:{items:[plain,adult,violent,missing]},top_sellers:{items:[adult,plain]},new_releases:{items:[adult]},coming_soon:{items:[adult,violent]}};
 else if(url.includes('/featured?'))data={large_capsules:[adult,plain,violent,missing]};
 else if(url.includes('storesearch'))data={items:new URL(url).searchParams.get('term')==='fresh'?[{id:106,name:'Fresh'}]:[plain,adult,violent,missing]};
 else if(url.includes('appdetails')){const id=Number(new URL(url).searchParams.get('appids'));data={[id]:{data:{name:'Details '+id,screenshots:[],genres:[],platforms:{}}}};}
 else throw Error('Unexpected fixture URL');
 return{ok:true,json:async()=>data};
};
let lists=await api.loadStoreLists();assert.deepEqual(lists.featured.map(i=>i.id),[101,103]);assert.deepEqual(lists.new,[]);assert.deepEqual(lists.soon.map(i=>i.id),[103]);
assert.deepEqual((await api.searchStore('test')).map(i=>i.id),[101,103]);assert.equal(await api.loadStoreDetails(102),null);assert.ok(await api.loadStoreDetails(101));
const metadataCount=requests.filter(u=>u.includes('GetItems')).length;
globalThis.settingsStore.excludedStoreContentDescriptors=[2];lists=await api.loadStoreLists();assert.deepEqual(lists.featured.map(i=>i.id),[102,101]);assert.deepEqual((await api.searchStore('test')).map(i=>i.id),[101,102]);assert.equal(await api.loadStoreDetails(103),null);
// Same cached metadata, but a different account's live preferences apply.
assert.equal(requests.filter(u=>u.includes('GetItems')).length,metadataCount+2); // unknown item retried on each page
assert.equal(requests.filter(u=>u.includes('featuredcategories')).length,1);
globalThis.settingsStore.excludedStoreContentDescriptors=[];assert.deepEqual((await api.loadStoreLists()).featured.map(i=>i.id),[102,101,103,104]);assert.ok(await api.loadStoreDetails(103));
globalThis.settingsStore.excludedStoreContentDescriptors=[2];assert.equal(await api.loadStoreDetails(103),null);
delete globalThis.settingsStore;await assert.rejects(api.loadStoreLists(),/content preferences are unavailable/);
globalThis.settingsStore={storePreferences:{content_descriptor_preferences:{content_descriptors_to_exclude:[{content_descriptorid:3}]}}};assert.ok((await api.loadStoreLists()).featured.every(i=>i.id!==102));
globalThis.settingsStore={excludedStoreContentDescriptors:[3]};networkFailed=true;await assert.rejects(api.searchStore('fresh'),/Network offline/);networkFailed=false;
changeDuringRequest=true;const future=api.searchStore('fresh');while(!pending)await new Promise(r=>setTimeout(r,1));globalThis.settingsStore.excludedStoreContentDescriptors=[2];pending();assert.deepEqual(await future,[]);
console.log('PASS account exclusions across all Store lists, search, details, cached account changes, allow-all, missing metadata/preferences, network failure and mid-request changes.');
