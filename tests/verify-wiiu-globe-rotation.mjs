import{execFileSync}from'node:child_process';import{startPreviewServer}from'../preview/server.mjs';import{launch}from'./browser.mjs';import assert from'node:assert/strict';
execFileSync(process.execPath,['tools/preview_wiiu_social.mjs'],{stdio:'inherit'});
const{server}=await startPreviewServer(),browser=await launch();
try{
 const context=await browser.newContext({viewport:{width:1280,height:1000},hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/preview/wiiu-social-demo.html?view=miiverse`,{waitUntil:'domcontentloaded'});
 const canvas=page.locator('.wu-globe-canvas');await page.waitForFunction(()=>document.querySelector('.wu-globe-canvas')?.dataset.rendered==='true');
 const actions=(await canvas.getAttribute('data-actions')).split(',');assert.ok(['cheer','clap'].includes(actions[0]));assert.ok(['stretch','look'].includes(actions[1]));assert.equal(actions[2],'sit');assert.equal(actions[3],'wave');assert.equal(actions[4],'idle');
 await page.getByRole('checkbox').uncheck();await page.waitForFunction(()=>document.querySelector('.wu-globe-canvas')?.dataset.motion==='false');
 const yaw=()=>canvas.getAttribute('data-yaw').then(Number),labels=()=>page.locator('[data-world-friend]').evaluateAll(nodes=>nodes.map(n=>n.style.transform));
 const beforeYaw=await yaw(),beforeLabels=await labels(),rect=await canvas.boundingBox(),x=rect.x+rect.width/2,y=rect.y+rect.height/2;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+160,y+15,{steps:12});await page.mouse.up();await page.waitForTimeout(400);
 assert.ok(Math.abs(await yaw()-beforeYaw)>.9,'drag spins with animation disabled');assert.notDeepEqual(await labels(),beforeLabels,'friend labels follow their 3D anchors');
 assert.ok(await page.locator('[data-world-friend]').evaluateAll(nodes=>nodes.some(n=>n.style.visibility==='hidden')),'back-side labels are hidden');
 const wheelYaw=await yaw();await page.mouse.move(x,y);await page.mouse.wheel(110,0);await page.waitForTimeout(400);assert.ok(Math.abs(await yaw()-wheelYaw)>.2,'horizontal touchpad scrolling spins');
 await page.emulateMedia({reducedMotion:'reduce'});const touchYaw=await yaw(),cdp=await context.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-90,y:y-20}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(250);assert.ok(Math.abs(await yaw()-touchYaw)>.4,'touch drag works with reduced motion');
 assert.equal(await canvas.getAttribute('data-dragging'),'false');
 const cards=await page.locator('[data-world-friend]').evaluateAll(nodes=>nodes.filter(n=>n.style.visibility!=='hidden').map(n=>{const r=n.getBoundingClientRect(),p=n.parentElement.getBoundingClientRect();return r.left>=p.left&&r.right<=p.right&&r.top>=p.top&&r.bottom<=p.bottom}));assert.ok(cards.every(Boolean),'visible labels stay inside the globe panel');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.waitForTimeout(150);assert.ok(Math.abs(await yaw())<.01,'reset returns to the original view');
 for(let angle=0;angle<8;angle++){
  await page.mouse.move(x,y);await page.mouse.wheel(100,0);await page.waitForTimeout(100);
  const boxes=await page.locator('[data-world-friend]').evaluateAll(nodes=>nodes.filter(n=>Number(n.style.opacity)>.25).map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}}));
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert.ok(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top,'rotating labels do not overlap');}
 }
 assert.deepEqual(errors,[]);console.log('PASS: mouse drag, horizontal touchpad wheel, real touch drag, attached/occluded labels, reset, collision-free labels, reduced motion and disabled animation; no browser errors.');
}finally{await browser.close();server.closeAllConnections();server.close()}
