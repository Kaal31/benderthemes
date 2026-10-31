import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try {
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url+'?theme=nazarick&still=1');await p.locator('.naz-home').waitFor();
 await p.evaluate(()=>{
  window.__runs=[];window.__regs=0;window.__releases=[];window.__callbacks={};
  const reg=name=>fn=>{window.__regs++;window.__callbacks[name]=fn;return{unregister(){delete window.__callbacks[name];}};};
  window.SteamClient={Apps:{RunGame(id){window.__runs.push(id);return Promise.resolve();},RegisterForGameActionTaskChange:reg('task'),RegisterForGameActionShowError:reg('error')},GameSessions:{RegisterForAppLifetimeNotifications:reg('life')},System:{UI:{RegisterForFocusChangeEvents:reg('focus')}},Overlay:{SetOverlayState(...args){window.__releases.push(args);}}};
  window.__shell={...window.__libraryGame(1000),appid:3999999999,gameid:'17179869179999999999',shortcut:true,name:'WebUI launcher.sh'};
  window.__beginNativeLaunch(window.__shell);
 });
 await p.waitForFunction(()=>window.__launchState()===null);
 assert.deepEqual(await p.evaluate(()=>window.__runs),['17179869179999999999']);
 assert.equal(await p.evaluate(()=>window.__regs),0);
 assert.deepEqual(await p.evaluate(()=>window.__releases),[['17179869179999999999',0]]);
 await p.evaluate(()=>{window.SteamClient.Apps.RunGame=()=>Promise.reject(Error('Shortcut launch rejected'));window.__beginNativeLaunch(window.__shell);});
 await p.waitForFunction(()=>window.__launchState()?.failed===true);assert.match(await p.locator('.dht-launch').innerText(),/Shortcut launch rejected/);await p.keyboard.press('Escape');
 await p.evaluate(()=>{window.SteamClient.Apps.RunGame=()=>{throw Error('Script missing');};window.__beginNativeLaunch(window.__shell);});
 await p.waitForFunction(()=>window.__launchState()?.failed===true);assert.match(await p.locator('.dht-launch').innerText(),/Script missing/);await p.keyboard.press('Escape');
 await p.evaluate(()=>{window.SteamClient.Apps.RunGame=id=>{window.__runs.push(id);return Promise.resolve();};window.__beginNativeLaunch(window.__libraryGame(1000));});
 await p.waitForFunction(()=>window.__regs===4);assert.equal(await p.evaluate(()=>window.__launchState().failed),false);
 await p.evaluate(()=>window.__callbacks.life({unAppID:1000,bRunning:true}));assert.notEqual(await p.evaluate(()=>window.__launchState()),null);
 await p.evaluate(()=>window.__callbacks.task(1,'1000','LaunchApp','Completed'));assert.notEqual(await p.evaluate(()=>window.__launchState()),null);
 await p.evaluate(()=>window.__callbacks.focus({focusedApp:{appid:1000},rgFocusable:[]}));await p.waitForFunction(()=>window.__launchState()===null);
 assert.deepEqual(errors,[]);console.log('PASS shortcuts hand off without window subscriptions; request errors remain visible; Steam games still wait for focus.');
}finally{await browser.close();server.closeAllConnections();server.close();}
