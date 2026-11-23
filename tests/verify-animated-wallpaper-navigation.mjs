import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.__previewEmulateSteamFocus=true;
  window.__themeSourceKindsError=true;
  window.__animatedWallpapers={
   animated_wallpapers_list:()=>({items:Array.from({length:24},(_,i)=>({id:'local-'+i,name:'Wallpaper '+String(i).padStart(2,'0'),source:'local',kind:'video',format:'WebM',file:'example.webm',url:location.origin+'/tests/fixtures/media/animated-wallpaper.webm',poster:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><rect width="160" height="100" fill="#456"/></svg>')}))}),
   animated_wallpapers_browse:()=>({items:[],hasMore:false}),
   animated_wallpapers_progress:()=>({})
  };
 });
 await page.goto(url+'?theme=frame&still=1');await page.waitForFunction(()=>!!window.__updateTheme);
 await page.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-default',themeStartupIntros:{'wiiflow-default':false}}));
 await page.locator('[data-native-theme="wiiflow-default"]').locator('#covers .selected').waitFor({state:'attached'});
 await page.getByRole('button',{name:'Hub',exact:true}).first().click();
 const hub=page.locator('.dht-market');await hub.waitFor();
 await hub.getByRole('alert').filter({hasText:'Importer sources could not be loaded'}).waitFor();
 assert.match(await hub.getByRole('alert').innerText(),/Source catalog fixture unavailable/,'The backend/RPC reason must remain visible');
 for(const name of ['WiiFlow','PSP','PS3','PS4','PS Vita','Switch','Wii U','3DS','Wii','Xbox','Xbox 360'])assert.equal(await hub.getByRole('tab',{name,exact:true}).count(),1,'Source transport failure must not remove '+name);
 const categoryTop=await hub.locator('.dht-files-kinds').evaluate(e=>e.getBoundingClientRect().top);
 await page.evaluate(()=>window.__themeSourceKindsDelay=300);
 await hub.getByRole('button',{name:'Retry sources (X)',exact:true}).click();
 await hub.getByRole('button',{name:'Retrying sources…',exact:true}).waitFor();
 assert.equal(await hub.locator('.dht-files-kinds').evaluate(e=>e.getBoundingClientRect().top),categoryTop,'Retry must not remove its banner and jump the page upward');
 await hub.getByRole('button',{name:'Retry sources (X)',exact:true}).waitFor();
 assert.equal(await hub.locator('.dht-files-kinds').evaluate(e=>e.getBoundingClientRect().top),categoryTop);
 await page.evaluate(()=>window.__themeSourceKindsError=false);
 await hub.getByRole('button',{name:'Retry sources (X)',exact:true}).click();
 await hub.getByRole('alert').filter({hasText:'Importer sources could not be loaded'}).waitFor({state:'hidden'});
 await hub.getByRole('tab',{name:'PS3',exact:true}).click();await hub.getByRole('button',{name:'Themezer',exact:true}).waitFor();
 await hub.getByRole('tab',{name:'Animated backgrounds',exact:true}).click();await hub.locator('.aw-card').first().waitFor();
 await page.locator('[data-native-theme="wiiflow-default"]').evaluate(el=>el.closest('[tabindex="0"]').focus());
 const press=async detail=>{await page.evaluate(detail=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail})),detail);await page.waitForTimeout(60)};
 const focused=()=>hub.locator('[data-aw-focused=true]');
 await press(10);assert.match(await focused().innerText(),/Wallpaper 00/,'Down enters cards rather than Search');
 for(let i=0;i<6;i++)await press(10);
 assert.match(await focused().innerText(),/Wallpaper 18/,'Vertical input follows grid rows');
 assert(await hub.locator('.aw-grid').evaluate(e=>e.scrollTop>0),'Controller browsing scrolls the card grid');
 await press(12);await press(12);await press(12);assert.equal(await focused().innerText(),'Play preview','Right edge enters description actions');
 await press(1);await hub.locator('.aw-player video').waitFor();
 await press(10);assert.equal(await focused().innerText(),'Use as theme wallpaper');
 await press(1);await hub.getByRole('status').filter({hasText:'This theme does not support'}).waitFor();
 await press(11);assert.match(await focused().innerText(),/Wallpaper 20/,'Left returns to selected card');
 await press(1);assert.equal(await focused().innerText(),'Stop preview','A on a card opens its actions');
 await press(2);assert.match(await focused().innerText(),/Wallpaper 20/,'Back returns from actions to cards');
 for(let i=0;i<7;i++)await press(9);
 assert.equal(await focused().getAttribute('aria-label'),'Search animated backgrounds','Up from the first grid row enters toolbar');
 await press(12);await press(1);assert.equal(await hub.getByLabel('Background source').inputValue(),'local');
 assert.deepEqual(errors,[]);
 console.log('PASS importer category recovery and Animated backgrounds grid scrolling, logical focus, detail actions, preview, Back, search and filters from native WiiFlow');
}finally{await browser.close();server.closeAllConnections();server.close()}
