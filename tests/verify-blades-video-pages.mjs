import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch();
try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-blades-video-pages.html?theme=x360&xs=blades&consoleArt='+ (process.env.FALLBACK==='1'?'0':'1'),{waitUntil:'domcontentloaded'});
 await p.locator('.dht-blades-profile').waitFor();await p.waitForTimeout(7000);
 const press=async n=>{await p.evaluate(n=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:n})),n);};
 const tab=async name=>{await p.locator(`.dht-x360b-tab[aria-label="${name}"]`).evaluate(n=>n.click());await p.waitForTimeout(300);};
 await tab('System');await p.locator('.dht-x360b-item[data-name="Console Settings"]').click();
 let page=p.locator('[data-blades-page=settings]');await page.waitFor();await p.locator('.dht-blades-pages[data-phase=active]').waitFor();
 await p.locator('.dht-blades').screenshot({path:'preview/blades-settings-video.png'});
 const focusFrames=await p.evaluate(async()=>{
  const text=document.querySelector('.dht-blades-pages [role=option] span'),focus=document.querySelector('.dht-blades-page-focus');
  const rows=[[text.getBoundingClientRect().y,focus.getBoundingClientRect().y]];
  window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:10}));
  for(let i=0;i<24;i++){await new Promise(requestAnimationFrame);rows.push([text.getBoundingClientRect().y,focus.getBoundingClientRect().y]);}return rows;
 });assert(Math.max(...focusFrames.map(r=>r[0]))-Math.min(...focusFrames.map(r=>r[0]))<.1,'Row text must remain stationary');assert(Math.max(...focusFrames.map(r=>r[1]))-Math.min(...focusFrames.map(r=>r[1]))>20,'Recess/highlight must move');
 await p.waitForTimeout(300);assert(await page.getByRole('option',{name:'Audio'}).getAttribute('aria-selected')==='true');
 await page.getByRole('option',{name:'Clock',exact:false}).click();await p.locator('.dht-menu--blades[data-side=left]').waitFor();await p.waitForTimeout(350);
 await p.locator('.dht-blades').screenshot({path:'preview/blades-clock-video.png'});
 await p.locator('.dht-menu--blades').getByRole('button',{name:'Back',exact:true}).click();await p.locator('.dht-menu--blades').waitFor({state:'hidden'});assert(await page.getByRole('option',{name:/Clock/}).getAttribute('aria-selected')==='true');
 await page.getByRole('option',{name:'Audio',exact:true}).click();await p.locator('[data-blades-page=audio]').waitFor();
 const audio=p.locator('[data-blades-page=audio]');await audio.getByRole('option',{name:/Sound Effects Volume/}).click();await p.locator('.dht-menu--blades').waitFor();await p.waitForTimeout(300);
 await p.locator('.dht-menu--blades').getByRole('option',{name:'25%',exact:true}).click();await p.locator('.dht-menu--blades').waitFor({state:'hidden'});assert(await audio.getByRole('option',{name:/Sound Effects Volume/}).innerText().then(s=>s.includes('25%')));
 await audio.getByRole('button',{name:'Back',exact:true}).click();await page.waitFor();assert(await page.getByRole('option',{name:'Audio',exact:true}).getAttribute('aria-selected')==='true');
 await page.getByRole('option',{name:'Display',exact:true}).click();await p.locator('[data-blades-page=display]').waitFor();await p.locator('[data-blades-page=display]').getByRole('button',{name:'Back',exact:true}).click();await page.waitFor();
 await page.getByRole('option',{name:'Themes',exact:true}).click();await p.locator('.dht-menu--blades[data-side=left]').waitFor();await p.waitForTimeout(300);assert(await p.locator('.dht-menu--blades').getByRole('option').count()>0);await press(2);await p.locator('.dht-menu--blades').waitFor({state:'hidden'});
 await page.getByRole('button',{name:'Back',exact:true}).click();await p.locator('.dht-blades-pages').waitFor({state:'hidden'});
 await tab('Games');await p.locator('.dht-x360b-item[data-name="Games Library"]').click();
 page=p.locator('[data-blades-page=library]');await page.waitFor();await p.locator('.dht-blades-pages[data-phase=active]').waitFor();
 await page.getByRole('option',{name:/My Games/}).click();await p.locator('[data-blades-page=games]').waitFor();
 let games=p.locator('[data-blades-page=games]');await games.getByRole('option').first().click();await p.locator('[data-blades-page=game]').waitFor();
 await p.locator('[data-blades-page=game]').getByRole('button',{name:'Back',exact:true}).click();await games.waitFor();
 await p.locator('.dht-blades').screenshot({path:'preview/blades-library-video.png'});
 await games.getByRole('button',{name:'Back',exact:true}).click();await page.waitFor();
 await page.getByRole('option',{name:'Played Games',exact:true}).click();await p.locator('[data-blades-page=played]').waitFor();
 await p.setViewportSize({width:960,height:720});await p.waitForTimeout(300);const box=await p.locator('.dht-blades-pages').boundingBox(),stage=await p.locator('.dht-blades').boundingBox();assert(box.x>=stage.x&&box.x+box.width<=stage.x+stage.width+1);
 assert.deepEqual(errors,[]);console.log('PASS settings page, animated focus, left picker, parent selection, library/game detail/history/back, no page errors');
}finally{await b.close();}
