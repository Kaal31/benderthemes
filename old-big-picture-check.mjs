import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {startThemeViewer} from './sdk/viewer/server.mjs';
import {launch} from './tests/browser.mjs';
const {server,url}=await startThemeViewer({folders:[resolve('themes/old-big-picture')]});
const browser=await launch();
try{
 const p=await browser.newPage({viewport:{width:1540,height:1050}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));await p.goto(url);
 const f=p.frameLocator('#frame').frameLocator('iframe');
 await f.locator('.carousel .game').first().waitFor();
 assert.equal(await f.locator('.carousel .game').count(),3);
 await f.locator('.carousel .game').first().focus();
 await p.locator('[data-btn="right"]').evaluate(n=>n.click());
 await f.locator('.recommendation:nth-child(2) .game:focus').waitFor();
 await p.locator('[data-btn="a"]').evaluate(n=>n.click());await f.locator('.classic-play').waitFor();
 assert.equal(await f.locator('#page-title').textContent(),'Night Voyage');
 await p.locator('[data-btn="b"]').click();await f.locator('.carousel').waitFor();
 await f.locator('.carousel .game').first().focus();
 await f.locator('body').press('Enter');await f.locator('.classic-play').waitFor();
 await f.getByRole('button',{name:'▶ Play',exact:true}).click();await p.locator('#action').getByText(/Simulated launch/).waitFor();
 await f.locator('body').press('Escape');await f.locator('.carousel').waitFor();
 await f.locator('.home-tile.library').click();
 await f.getByRole('searchbox').fill('Mountain');assert.equal(await f.locator('.grid .game').count(),1);
 await f.getByRole('searchbox').fill('missing-game');await f.getByText('No games match this view.').waitFor();
 await f.getByRole('searchbox').fill('');await f.getByRole('combobox').selectOption('installed');assert.equal(await f.locator('.grid .game').count(),5);
 await f.getByRole('combobox').selectOption('all');
 await p.locator('[data-btn="l1"]').evaluate(n=>n.click());await f.locator('.grid .game').first().waitFor();
 await f.locator('.grid .game').first().click();await f.getByRole('button',{name:'View in Steam Store',exact:true}).click();await p.locator('#action').getByText(/Sample checkout/).waitFor();
 await f.locator('body').press('Escape');await f.locator('.grid .game').first().waitFor();
 await p.locator('[data-btn="l1"]').evaluate(n=>n.click());await f.locator('.friend').first().waitFor();assert.equal(await f.locator('.friend').count(),2);
 await f.locator('body').press('Escape');await f.locator('.carousel').waitFor();
 await p.locator('#empty').check();await f.getByText('Your Steam games will appear here.',{exact:false}).waitFor();
 await p.locator('#empty').uncheck();await f.locator('.carousel .game').first().waitFor();
 await p.locator('#busy').check();assert.equal(await f.locator('body').evaluate(()=>ThemeHub.active),false);await p.locator('#busy').uncheck();
 for(const size of ['1280x800','1280x720']){
  await p.locator('#size').selectOption(size);
  const bounds=await f.locator('body').evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,footer:document.querySelector('footer').getBoundingClientRect().bottom,height:innerHeight}));
  assert.ok(bounds.scroll<=bounds.width);assert.ok(bounds.footer<=bounds.height+1);
 }
 await p.locator('#size').selectOption('1280x800');await f.locator('.carousel .game').first().focus();
 await f.locator('body').screenshot({path:'out/old-big-picture-sdk-preview.png'});
 await f.locator('header [data-open="settings"]').click();await f.getByRole('button',{name:'Interface',exact:true}).click();await f.locator('.preference-form').waitFor();
 await f.getByLabel('24-hour clock',{exact:true}).uncheck();await f.getByText('Saved 24-hour clock').waitFor();
 await f.locator('header [data-open="downloads"]').click();await f.locator('.download-card').first().getByRole('button',{name:'Pause',exact:true}).click();await f.locator('.download-card').first().getByRole('button',{name:'Resume',exact:true}).waitFor();
 await f.locator('footer [data-page="home"]').click();await f.locator('.home-tile.library').click();await f.getByRole('button',{name:'Videos',exact:true}).click();await f.locator('.media-item').first().waitFor();
 await f.locator('footer [data-page="home"]').click();await f.locator('.home-tile.library').click();await f.getByRole('button',{name:'Local Music',exact:true}).click();await f.locator('.track-list button').first().click();await f.getByRole('button',{name:'Pause',exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('PASS: library/search/collections, launch, store checkout handoff, friends, keyboard/controller mapping, empty library, lifecycle, 800p/720p layout.');
}finally{await browser.close();server.close();}
