import {build} from 'esbuild';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
mkdirSync('out/store-preferences-test',{recursive:true});
const bundle=await build({stdin:{contents:"import './preview/main.tsx';import {setPreviewStore} from './src/store';setPreviewStore(null);",resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',minify:true,alias:{'@decky/ui':'./preview/stubs/ui.tsx','@decky/api':'./preview/stubs/api.ts'},define:{'process.env.NODE_ENV':'"production"'}});
writeFileSync('out/store-preferences-test/ui.html','<!doctype html><html><head><meta charset="utf-8"><style>html,body,#root{margin:0;width:100%;height:100%;overflow:hidden}</style></head><body><div id="root"></div><script>window.__isThemePreview=true;window.__testAssets={};window.__testWalls={};</script><script>'+bundle.outputFiles[0].text.replace(/<\/script/g,'<\\/script')+'</script></body></html>');
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 for(const theme of ['ps5','nazarick']){
  const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  p.setDefaultTimeout(15000);
  await p.addInitScript(()=>{window.__testInventory={ps5:"1.0.0",nazarick:"1.0.0"};window.settingsStore={excludedStoreContentDescriptors:[3]};window.SteamClient={User:{GetIPCountry:async()=> 'US'}};});
  const games=[{id:101,name:'General game'},{id:102,name:'Restricted game'}];
  await p.route('https://store.steampowered.com/api/**',async route=>{
   const u=route.request().url();let body;
   if(u.includes('featuredcategories'))body={specials:{items:games},top_sellers:{items:games},new_releases:{items:games},coming_soon:{items:games}};
   else if(u.includes('/featured?'))body={large_capsules:games};
   else if(u.includes('appdetails')){const id=Number(new URL(u).searchParams.get('appids'));body={[id]:{data:{name:games.find(g=>g.id===id).name,short_description:'Fixture details'}}};}
   else body={items:games};
   await route.fulfill({json:body,headers:{'access-control-allow-origin':'*'}});
  });
  await p.route('https://api.steampowered.com/IStoreBrowseService/**',async route=>{const ids=JSON.parse(new URL(route.request().url()).searchParams.get('input_json')).ids;await route.fulfill({json:{response:{store_items:ids.map(({appid})=>({appid,success:1,content_descriptorids:appid===102?[3]:[]}))}},headers:{'access-control-allow-origin':'*'}});});
  await p.goto(url.replace('/preview/preview.html','/out/store-preferences-test/ui.html')+'?theme='+theme+'&still=1');await p.locator('[data-dht-root][data-dht-theme]').waitFor();await p.evaluate(()=>{window.__updateTheme({themedStore:true,animations:false});});await p.waitForTimeout(200);await p.evaluate(()=>window.__openPlace('store'));
  await p.locator('.dht-store').waitFor();const tiles=p.locator('.dht-store-tile,.dht-store-row');await p.waitForFunction(()=>document.querySelectorAll('.dht-store-tile,.dht-store-row').length===1);assert.match(await tiles.innerText(),/General game/i);
  await p.evaluate(()=>window.settingsStore.excludedStoreContentDescriptors=[]);await p.waitForFunction(()=>document.querySelectorAll('.dht-store-tile,.dht-store-row').length===2);
  await p.evaluate(()=>window.settingsStore.excludedStoreContentDescriptors=[3]);await p.waitForFunction(()=>document.querySelectorAll('.dht-store-tile,.dht-store-row').length===1);assert.match(await tiles.innerText(),/General game/i);
  await p.evaluate(()=>delete window.settingsStore);await p.locator('.dht-store').getByText(/Steam content preferences are unavailable/).waitFor();assert.equal(await tiles.count(),0);
  assert.deepEqual(errors,[]);console.log('PASS live account content preference filtering and unavailable-state UI:',theme);await p.close();
 }
}finally{await browser.close();server.closeAllConnections();server.close();}
