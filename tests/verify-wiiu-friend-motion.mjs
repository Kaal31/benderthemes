import{execFileSync}from'node:child_process';import{startPreviewServer}from'../preview/server.mjs';import{launch}from'./browser.mjs';import assert from'node:assert/strict';
execFileSync(process.execPath,['tools/preview_wiiu_social.mjs'],{stdio:'inherit'});
const{server}=await startPreviewServer(),browser=await launch();
try{
 const p=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:${server.address().port}/preview/wiiu-social-demo.html`,{waitUntil:'domcontentloaded'});
 const d=p.getByRole('dialog',{name:'Friend List',exact:true}),alex=d.locator('.wu-friend-row').filter({has:p.locator('strong',{hasText:/^Alex$/})});
 await p.waitForFunction(()=>document.querySelector('.wu-friend-mii canvas')?.dataset.rendered==='true');
 for(const [status,pose,actions]of[['Playing','playing',['cheer','clap','idle']],['Away','idle',['sit']],['Snooze','sleeping',['sit']],['Online','online',['wave','idle']],['Busy','busy',['idle']],['Offline','offline',['idle']]]){
  await p.getByRole('combobox').selectOption(status);await p.waitForTimeout(180);
  assert.equal(await alex.locator('.wu-friend-mii').getAttribute('data-pose'),pose);
  await p.waitForFunction(actions=>{const row=[...document.querySelectorAll('.wu-friend-row')].find(e=>e.querySelector('strong')?.textContent==='Alex');return actions.includes(row?.querySelector('canvas')?.getAttribute('data-action'));},actions);
 }
 const rows=await d.locator('.wu-friend-id').evaluateAll(items=>items.slice(0,5).map(e=>{const r=e.getBoundingClientRect();return{x:r.x,height:r.height,scroll:e.scrollWidth,width:e.clientWidth}}));
 assert.ok(rows.every(r=>r.x===rows[0].x&&r.height===rows[0].height&&r.scroll<=r.width),'long London location remains aligned and fits');
 await p.getByRole('combobox').selectOption('Playing');await p.getByRole('checkbox').uncheck();await p.waitForTimeout(200);
 const stopped=await alex.locator('canvas').evaluate(e=>e.toDataURL());await p.waitForTimeout(400);assert.equal(await alex.locator('canvas').evaluate(e=>e.toDataURL()),stopped,'disabled animations remain still');
 await p.getByRole('checkbox').check();const before=await alex.locator('canvas').evaluate(e=>e.toDataURL());await p.waitForTimeout(550);assert.notEqual(await alex.locator('canvas').evaluate(e=>e.toDataURL()),before,'animated Mii pixels change');
 await p.getByRole('button',{name:'Miiverse',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.wu-globe-canvas')?.dataset.rendered==='true');
 assert.equal(await p.getByRole('tab',{name:'Friends around the world'}).getAttribute('aria-selected'),'true');
 const locations=await p.locator('.wu-location').evaluateAll(items=>items.map(e=>{const r=e.getBoundingClientRect();return{width:r.width,height:r.height,scroll:e.scrollWidth,client:e.clientWidth}}));assert.ok(locations.every(r=>r.width===locations[0].width&&r.height===locations[0].height&&r.scroll<=r.client),'world labels have consistent dimensions');
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.querySelector('.wu-globe-canvas')?.dataset.motion==='false');
 assert.deepEqual(errors,[]);console.log('PASS: Plaza 3D status clips, animated/static canvas output, London alignment, globe opens first, reduced motion, no browser exceptions.');
}finally{await browser.close();server.closeAllConnections();server.close()}
