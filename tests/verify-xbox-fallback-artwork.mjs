import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch();try{
 for(const theme of ['xbox','blades','nxe','kinect','metro']){
  const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`http://127.0.0.1:8911/preview/xbox-fallback-review.html?theme=${theme==='xbox'?'xbox':'x360'}&xs=${theme}&still=1`,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(7500);
  const broken=await p.locator('img').evaluateAll(ns=>ns.filter(n=>n.src.startsWith('data:image/svg+xml')&&n.complete&&!n.naturalWidth).map(n=>n.src.slice(0,70)));
  assert.deepEqual(broken,[],theme+' authored SVG decode');assert.deepEqual(errors,[],theme+' browser errors');
  await p.screenshot({path:`preview/xbox-fallback-${theme}.png`});await p.close();
 }
 console.log('PASS all five Xbox themes without consoleArt: authored SVG loading and browser error checks');
}finally{await b.close();}
