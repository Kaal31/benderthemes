import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true});
try{
 for(const original of [false,true]){
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{const fixture={ok:true,albums:[
   {id:'local-test',name:'Local Album',source:'local',appid:0,artist:'Local Artist',cover:'',tracks:[{id:'track-a',title:'Local Track',file:'a.mp3',url:'/preview/test-music/evening.wav',size:100,disc:'1'}]},
   {id:'steam-test',name:'Steam Album',source:'steam',appid:1,cover:'',tracks:[{id:'track-b',title:'Steam Track',file:'b.mp3',url:'/preview/test-music/evening.wav',size:100,disc:'1'}]},
  ]};Object.defineProperty(window,'__testMusic',{get:()=>fixture,set:()=>{},configurable:true});});
  await page.goto('http://127.0.0.1:8911/preview/x360-card-pages.html?theme=x360&xs=nxe&menuAudit=2'+(original?'&consoleArt=1':''));
  await page.waitForTimeout(6500);
  const press=async button=>{await page.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);await page.waitForTimeout(350);};
  await press(1);
  const expanded=page.locator('[data-nxe-expanded=true]');await expanded.waitFor();
  assert.equal(await page.locator('[data-nxe-profile-popup]').count(),0,'First A expands the card');
  assert.equal(await expanded.evaluate(n=>n.style.width),'456px');
  assert.equal(await expanded.evaluate(n=>n.style.height),'492px');
  await page.waitForTimeout(300);await page.screenshot({path:`preview/nxe-menu-audit/updated-profile-card-${original?'original':'fallback'}.png`});
  await press(1);const profile=page.locator('[data-nxe-profile-popup]');await profile.waitFor();
  assert.equal(await profile.locator('[data-nxe-profile-tabs]').count(),0);
  assert.equal(await expanded.count(),1,'Expanded parent is retained behind dialog');
  await page.waitForTimeout(300);await page.screenshot({path:`preview/nxe-menu-audit/updated-profile-dialog-${original?'original':'fallback'}.png`});
  await press(2);assert.equal(await profile.count(),0);assert.equal(await expanded.count(),1);
  await press(2);assert.equal(await expanded.count(),0);
  for(let i=0;i<5;i++)await press(12);
  await press(1);let settings=page.getByRole('dialog',{name:'System Settings',exact:true});await settings.waitFor();
  await settings.getByRole('option',{name:'Console Settings',exact:true}).click();
  await page.getByRole('option',{name:'Display',exact:true}).click();
  const panel=page.locator('[data-nxe-page=display] .dht-nxe-page-panel');
  assert.deepEqual(await panel.evaluate(n=>[n.style.left,n.style.top,n.style.width,n.style.height]),['192px','110px','888px','482px']);
  await page.waitForTimeout(300);await page.screenshot({path:`preview/nxe-menu-audit/updated-settings-${original?'original':'fallback'}.png`});
  await press(2);await press(2);await press(2);
  for(let i=0;i<5;i++)await press(11);
  await press(9);await press(9);await press(1);
  const music=page.locator('[data-nxe-media=music]');await music.waitFor();
  assert.equal(await music.getAttribute('aria-label'),'Select Source');
  await music.getByRole('option',{name:'Local Music',exact:true}).click();
  assert.equal(await music.getByRole('option',{name:'Albums',exact:true}).count(),1);
  assert.equal(await music.getByRole('option',{name:'Artists',exact:true}).count(),1);
  assert.equal(await music.getByRole('option',{name:'Playlists',exact:true}).count(),0,'Do not invent unsupported metadata');
  await music.getByRole('option',{name:'Albums',exact:true}).click();
  assert.equal(await music.getByRole('option',{name:'Steam Album',exact:true}).count(),0,'Source filters albums');
  await music.getByRole('option',{name:'Local Album',exact:true}).click();
  assert.equal(await music.getByRole('option',{name:'Play All',exact:true}).count(),1);
  assert.equal(await music.getByRole('option',{name:'1. Local Track',exact:true}).count(),1);
  await page.waitForTimeout(300);await page.screenshot({path:`preview/nxe-menu-audit/updated-music-${original?'original':'fallback'}.png`});
  await press(12);assert.equal(await music.getByRole('option',{name:'1. Local Track',exact:true}).getAttribute('aria-selected'),'true');
  await press(1);assert.equal(await music.getAttribute('aria-label'),'Now Playing');
  await music.getByRole('option',{name:'Pause',exact:true}).click();
  await music.getByRole('option',{name:'Play',exact:true}).waitFor();
  await page.waitForTimeout(300);await page.screenshot({path:`preview/nxe-menu-audit/updated-now-playing-${original?'original':'fallback'}.png`});
  await press(2);assert.equal(await music.getAttribute('aria-label'),'Local Album');
  await press(2);assert.equal(await music.getAttribute('aria-label'),'Albums');
  await press(2);await press(2);assert.equal(await music.getAttribute('aria-label'),'Select Source');
  await music.getByRole('option',{name:'Steam Soundtracks',exact:true}).click();
  assert.equal(await music.getByRole('option',{name:'Artists',exact:true}).count(),0,'No artist category without metadata');
  await press(2);await press(2);assert.equal(await music.count(),0);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS both artwork modes: profile expansion/dialog/back, native settings geometry, detected music sources/categories/filtering/back stack');
}finally{await browser.close();}
