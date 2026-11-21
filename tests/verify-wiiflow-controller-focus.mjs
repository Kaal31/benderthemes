import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1304,height:870}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__previewEmulateSteamFocus=true;window.__escapedDirections=0;document.addEventListener('vgp_ondirection',e=>{if(!e.defaultPrevented)window.__escapedDirections++});});
 await page.goto(url+'?theme=frame&still=1');await page.waitForFunction(()=>!!window.__updateTheme);
 await page.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-default',themeStartupIntros:{'wiiflow-default':false},animations:false}));
 const host=page.locator('[data-native-theme="wiiflow-default"]');await host.locator('#covers .selected').waitFor({state:'attached'});
 await host.evaluate(el=>el.closest('[tabindex="0"]').focus());
 const press=async button=>{await page.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);await page.waitForTimeout(220);};
 const selected=()=>host.locator('#covers .selected').getAttribute('data-appid');
 const waitOpacity=async(selector,value)=>{await page.waitForFunction(({selector,value})=>{const root=document.querySelector('[data-native-theme="wiiflow-default"]')?.shadowRoot;return root&&getComputedStyle(root.querySelector(selector)).opacity===value;},{selector,value});};
 const initial=await selected();
 assert.equal(await host.locator('header').evaluate(e=>getComputedStyle(e).opacity),'0','Top controls start hidden like the footer');
 await press(10);await waitOpacity('header','1');assert.equal(await host.locator('header').evaluate(e=>getComputedStyle(e).opacity),'1','Controller controls reveal the header');assert.equal(await host.locator('#options').getAttribute('data-wiiflow-focused'),'true');
 assert(await host.evaluate(el=>document.activeElement===el.closest('[tabindex="0"]')),'Steam input stays focused on the native theme root');
 let visual=await host.locator('#options').evaluate(e=>({outline:getComputedStyle(e).outlineStyle,image:getComputedStyle(e).backgroundImage,shadow:getComputedStyle(e).boxShadow,background:getComputedStyle(e).backgroundColor}));assert.equal(visual.outline,'none');assert.equal(visual.shadow,'none');assert.equal(visual.background,'rgba(0, 0, 0, 0)');assert.match(visual.image,/btnconfigs/);
 await press(12);assert.equal(await host.locator('#home').getAttribute('data-wiiflow-focused'),'true');
 await press(12);assert.equal(await host.locator('#layout').getAttribute('data-wiiflow-focused'),'true');
 const prior=await host.locator('#layout').getAttribute('aria-pressed');await press(1);assert.notEqual(await host.locator('#layout').getAttribute('aria-pressed'),prior);
 await press(9);assert.equal(await host.locator('[data-wiiflow-focused]').count(),0);
 assert(await host.evaluate(el=>document.activeElement===el.closest('[tabindex="0"]')),'Up must not blur the Steam input root');
 await press(12);assert.notEqual(await selected(),initial,'Next D-pad move browses theme games');
 await waitOpacity('header','0');
 assert.equal(await host.locator('header').evaluate(e=>getComputedStyle(e).opacity),'0','Top buttons and count hide during cover browsing');
 assert.equal(await host.locator('footer').evaluate(e=>getComputedStyle(e).opacity),'0');
 await host.locator('#case-renderer').dispatchEvent('pointermove',{clientX:200,clientY:10});await waitOpacity('header','1');
 assert.equal(await host.locator('header').evaluate(e=>getComputedStyle(e).opacity),'1','Top-edge pointer reveals controls');
 await press(12);await waitOpacity('header','0');assert.equal(await host.locator('header').evaluate(e=>getComputedStyle(e).opacity),'0','Browsing hides controls even while the pointer remains near the top');
 await press(9);await waitOpacity('header','1');assert.equal(await host.locator('#filter').getAttribute('data-wiiflow-focused'),'true','Up from covers selects the top filter');
 await press(12);assert.equal(await host.locator('#logo-style').getAttribute('data-wiiflow-focused'),'true');
 await press(12);assert.equal(await host.locator('#animation-speed').getAttribute('data-wiiflow-focused'),'true');
 await press(12);assert.equal(await host.locator('#filter').getAttribute('data-wiiflow-focused'),'true','Top row wraps independently');
 await press(1);assert.equal(await host.locator('#filter').getAttribute('data-wiiflow-focused'),'true','Filter activation retains focus');
 await press(10);await waitOpacity('header','0');assert.equal(await host.locator('[data-wiiflow-focused]').count(),0,'Down from top returns to covers');
 for(let i=0;i<3;i++){const before=await selected();await press(10);await press(9);await press(12);assert.notEqual(await selected(),before)}
 // Mouse/touch focus also hands Steam input ownership back from inside shadow DOM.
 await host.locator('#options').focus();await page.waitForTimeout(80);
 assert(await host.evaluate(el=>document.activeElement===el.closest('[tabindex="0"]')));
 await page.mouse.move(600,420);assert.equal(await host.locator('#options').getAttribute('data-wiiflow-focused'),'true');
 await press(12);assert.equal(await host.locator('#home').getAttribute('data-wiiflow-focused'),'true');
 assert.equal(await page.evaluate(()=>window.__escapedDirections),0,'No direction leaks into outer Steam navigation');
 mkdirSync('out/wiiflow-focus',{recursive:true});await host.screenshot({path:'out/wiiflow-focus/bottom-focus.png'});
 assert.deepEqual(errors,[]);console.log('PASS shadow-DOM native control focus, selected bottom artwork, star activation, Up return and subsequent browsing without outer-navigation leaks');
}finally{await browser.close();server.closeAllConnections();server.close()}
