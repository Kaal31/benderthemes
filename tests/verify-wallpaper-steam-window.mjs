import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {launch} from './browser.mjs';

// Decky runs the component in one window and portals its DOM into Steam's window.
const script=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {BackgroundMedia} from './src/WallpaperMedia';let root;window.showWallpaper=(target,src,paused=false)=>{root??=createRoot(target.document.getElementById('surface'));root.render(React.createElement(BackgroundMedia,{src,paused}));};window.clearWallpaper=()=>root.unmount();`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic'});
const movie='data:video/webm;base64,'+readFileSync('tests/fixtures/media/animated-wallpaper.webm').toString('base64');
const browser=await launch();
try{
 const context=await browser.newContext(),host=await context.newPage();
 await host.setContent('<button onclick="window.steamWindow=window.open(\'about:blank\')">Steam window</button>');
 await host.addScriptTag({content:script.outputFiles[0].text});
 const opened=context.waitForEvent('page');await host.getByRole('button').click();const steam=await opened;
 await steam.setContent('<div id="surface" style="position:relative;width:400px;height:300px"></div>');
 await host.evaluate(src=>window.showWallpaper(window.steamWindow,src),movie);
 const video=steam.locator('video');await video.waitFor();
 await steam.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>.1;},null,{timeout:5000});
 const before=await video.evaluate(v=>v.currentTime);await steam.waitForTimeout(200);assert.notEqual(await video.evaluate(v=>v.currentTime),before,'Video advances in the Steam window');
 await steam.emulateMedia({reducedMotion:'reduce'});await steam.waitForTimeout(200);assert.equal(await video.evaluate(v=>v.paused),false,'Enabled video is independent of UI reduced motion');
 await host.evaluate(src=>window.showWallpaper(window.steamWindow,src,true),movie);await steam.waitForFunction(()=>document.querySelector('video').paused);
 await host.evaluate(src=>window.showWallpaper(window.steamWindow,src),movie);await steam.waitForFunction(()=>!document.querySelector('video').paused);
 await host.evaluate(()=>window.clearWallpaper());assert.equal(await steam.locator('video').count(),0);
 console.log('PASS real video playback in a separate Steam window, reduced UI motion, explicit pause, resume and teardown');
}finally{await browser.close();}
