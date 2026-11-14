import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
try{for(const theme of ['gameamp','reading','castle','republic','nazarick','ios6','wiiu','ps4']){
 const p=await browser.newPage({viewport:{width:1304,height:940}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url+`?theme=${theme}&still=1&bugs=1`,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!!window.__updateTheme);await p.locator('[data-dht-root]').waitFor();
 await p.evaluate(theme=>window.__updateTheme({source:'installed',maxGames:2,themeCollections:{},libraryCollections:{},themeStartupIntros:{[theme]:false}}),theme);
 await p.evaluate(()=>window.__openPlace('library'));await p.locator('.dht-destination-row').first().waitFor();
 const installed=await p.locator('.dht-destination-row').count();assert(installed>2,theme+' Library is uncapped');assert.equal(await p.evaluate(()=>window.__getThemeLibrary().games.length),2);
 await p.evaluate(theme=>window.__updateTheme({libraryCollections:{[theme]:{source:'non-steam'}}}),theme);await p.waitForTimeout(120);let rows=await p.locator('.dht-destination-row').allTextContents();assert.equal(rows.length,2,theme+' non-Steam filter');
 await p.evaluate(theme=>window.__updateTheme({libraryCollections:{[theme]:{source:'col:rpg'}}}),theme);await p.waitForTimeout(120);assert.equal(await p.locator('.dht-destination-row').count(),4,theme+' explicit Library collection');
 await p.evaluate(theme=>window.__updateTheme({themeCollections:{[theme]:{source:'col:favorite'}},libraryCollections:{}}),theme);await p.waitForTimeout(120);assert.equal(await p.locator('.dht-destination-row').count(),3,theme+' Library follows Home collection');
 assert.equal(await p.evaluate(()=>window.__getThemeLibrary().games.length),2,theme+' Home cap remains');assert.deepEqual(errors,[]);console.log('PASS',theme,'same defaults, independent game types, collections, uncapped Library');await p.close();
}}finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
