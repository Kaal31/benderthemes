import {chromium} from 'playwright';import {pathToFileURL} from 'node:url';import {resolve} from 'node:path';import {readFileSync,readdirSync} from 'node:fs';import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});const p=await browser.newPage({viewport:{width:1304,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(pathToFileURL(resolve('preview/dial-preview.html')).href);await p.locator('.alien-dial').waitFor();
await p.evaluate(()=>{
 window.__callbacks={};window.__nativeRuns=0;window.__unregisters=0;window.__focus=[];
 const reg=name=>fn=>{window.__callbacks[name]=fn;return{unregister(){window.__unregisters++;delete window.__callbacks[name];}};};
 window.SteamClient={Apps:{RunGame(){window.__nativeRuns++;},RegisterForGameActionTaskChange:reg('task'),RegisterForGameActionShowError:reg('error')},GameSessions:{RegisterForAppLifetimeNotifications:reg('life')},System:{UI:{RegisterForFocusChangeEvents:reg('focus')}},Overlay:{SetOverlayState(...args){window.__focus.push(args);}}};
 window.__beginNativeLaunch(window.__libraryGame(1000));window.__beginNativeLaunch(window.__libraryGame(1000));
});
assert.equal(await p.evaluate(()=>window.__nativeRuns),1);await p.locator('.dht-launch').waitFor();
await p.evaluate(()=>window.__callbacks.task(1,'1000','LaunchApp','SynchronizingCloud'));assert.match(await p.locator('.dht-launch').innerText(),/Synchronizing cloud/);
await p.evaluate(()=>window.__callbacks.task(1,'1000','LaunchApp','ShowEula'));assert.match(await p.locator('.dht-launch').innerText(),/launch prompt/);
await p.evaluate(()=>window.__callbacks.life({unAppID:1000,bRunning:true}));assert.equal(await p.locator('.dht-launch').count(),1);
await p.evaluate(()=>window.__callbacks.focus({focusedApp:{appid:0},rgFocusable:[{appid:1001,windowid:2}]}));assert.equal(await p.evaluate(()=>window.__focus.length),0);
await p.evaluate(()=>window.__callbacks.focus({focusedApp:{appid:0},rgFocusable:[{appid:1000,windowid:9}]}));assert.deepEqual(await p.evaluate(()=>window.__focus),[['1000',0]]);
await p.evaluate(()=>window.__callbacks.focus({focusedApp:{appid:1000},rgFocusable:[]}));await p.locator('.dht-launch').waitFor({state:'hidden'});assert.equal(await p.evaluate(()=>window.__unregisters),4);
await p.evaluate(()=>{window.__beginNativeLaunch(window.__libraryGame(1000));window.__callbacks.error(1,'9999','LaunchApp','Unrelated failure');});assert.equal(await p.evaluate(()=>window.__launchState().failed),false);
await p.evaluate(()=>window.__callbacks.error(1,'1000','LaunchApp','Launch failed: missing files'));assert.match(await p.locator('.dht-launch').innerText(),/missing files/);await p.keyboard.press('Escape');
await p.evaluate(()=>{window.SteamClient.Apps.RunGame=()=>{throw Error('Test launch exception');};window.__beginNativeLaunch(window.__libraryGame(1000));});assert.match(await p.locator('.dht-launch').innerText(),/Test launch exception/);await p.keyboard.press('Escape');
console.log('PASS native launch: single request, cloud/EULA/process/window states, focus handoff, unrelated events, error/exception, cleanup.');
const packs=[];for(const folder of readdirSync('bundle/sounds')){const path=`bundle/sounds/${folder}`;try{const meta=JSON.parse(readFileSync(`${path}/pack.json`));packs.push({...meta,folder,files:readdirSync(path),mappings:meta.mappings??{},ignore:meta.ignore??[]});}catch{}}
await p.evaluate(async packs=>{window.__testPacks=packs;await window.__refreshPacks();},packs);
for(const [theme,style,pattern] of [['psp',null,'PSP'],['ps4',null,'PS4'],['ps5',null,'PS5'],['ps2',null,'PS2'],['vita',null,'Vita'],['xbox',null,'Original Xbox'],['x360','metro','Metro'],['x360','blades','Blades'],['x360','nxe','NXE'],['x360','kinect','Kinect']]){
 const r=await p.evaluate(({theme,style})=>{window.__updateTheme({theme,...(style?{x360:{style}}:{})});const pack=window.__autoPack(theme);return{name:pack?.name,nav:window.__packFile(pack,'deck_ui_navigation.wav'),tile:window.__packFile(pack,'deck_ui_tile_scroll.wav'),back:window.__packFile(pack,'deck_ui_out_of_game_detail.wav'),launch:window.__packFile(pack,'deck_ui_launch_game.wav')};},{theme,style});
 assert.ok(r.name.includes(pattern),JSON.stringify(r));assert.equal(r.nav,r.tile);assert.ok(r.back&&r.launch);
}
console.log('PASS console sound selection and purpose mappings, including era-specific 360 packs.');assert.deepEqual(errors,[]);await browser.close();
