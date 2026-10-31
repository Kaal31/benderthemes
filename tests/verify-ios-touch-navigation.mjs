import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita');await page.locator('[data-dht-root]').waitFor();
 // Match Steam's fixed fullscreen host; the preview toolbar otherwise scrolls the page during touch gestures.
 await page.evaluate(()=>{const screen=document.querySelector('[data-dht-root]').closest('div[style*="border-radius: 10px"]');Object.assign(screen.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',margin:'0',zIndex:'999'});document.body.style.overflow='hidden';});
 await page.evaluate(()=>window.__updateTheme({theme:'ios6',activeTheme:'ios6',animations:true}));
 const host=page.locator('[data-react-theme="ios6"],[data-native-theme="ios6"]');await host.waitFor();
 const panel=host.locator('.ios-notification-center'),pull=host.getByRole('button',{name:'Open Notification Center',exact:true});await pull.waitFor();
 const cdp=await page.context().newCDPSession(page);

 async function swipe(x,y,to){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=10;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+(to-y)*i/10}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 const box=await pull.boundingBox();await swipe(box.x+box.width/2,box.y+box.height/2,box.y+250);
 await panel.locator('.nc-done').waitFor();assert.equal(await panel.evaluate(n=>n.classList.contains('open')&&!n.inert),true,'touch pull opens notification center');
 await page.waitForFunction(()=>{const s=(document.querySelector('[data-react-theme],[data-native-theme]').shadowRoot??document.querySelector('[data-react-theme],[data-native-theme]')),p=s.querySelector('.ios-notification-center'),root=s.querySelector('#dashboard');return Math.abs(p.getBoundingClientRect().bottom-root.getBoundingClientRect().bottom)<1;});
 const handle=await panel.locator('.nc-handle').boundingBox();await swipe(handle.x+handle.width/2,handle.y+handle.height/2,handle.y-450);
 await page.waitForFunction(()=>!(document.querySelector('[data-react-theme],[data-native-theme]').shadowRoot??document.querySelector('[data-react-theme],[data-native-theme]')).querySelector('.ios-notification-center').classList.contains('open'));
 // A regular tap still opens/closes the panel after a gesture.
 await page.waitForTimeout(650);await pull.tap();await page.waitForFunction(()=>document.querySelector('[data-native-theme=ios6]').shadowRoot.querySelector('.ios-notification-center')?.classList.contains('open'));
 await panel.locator('.nc-done').tap();await page.waitForFunction(()=>!(document.querySelector('[data-react-theme],[data-native-theme]').shadowRoot??document.querySelector('[data-react-theme],[data-native-theme]')).querySelector('.ios-notification-center').classList.contains('open'));
 const dots=host.locator('.springboard-dots button');assert.ok(await dots.count()>1,'fixture has multiple home pages');
 await page.evaluate(()=>window.__firstDot=(document.querySelector('[data-react-theme],[data-native-theme]').shadowRoot??document.querySelector('[data-react-theme],[data-native-theme]')).querySelector('.springboard-dots button'));
 await dots.nth(1).tap();
 await page.waitForFunction(()=>{const s=(document.querySelector('[data-react-theme],[data-native-theme]').shadowRoot??document.querySelector('[data-react-theme],[data-native-theme]')),dots=s.querySelectorAll('.springboard-dots button');return dots[1].getAttribute('aria-current')==='true'&&new DOMMatrix(getComputedStyle(dots[1],'::before').transform).a>1.65&&new DOMMatrix(getComputedStyle(dots[0],'::before').transform).a<1.05;});
 assert.equal(await page.evaluate(()=>window.__firstDot===(document.querySelector('[data-react-theme],[data-native-theme]').shadowRoot??document.querySelector('[data-react-theme],[data-native-theme]')).querySelector('.springboard-dots button')),true,'dot nodes survive page change for animation');
 assert.equal(await dots.nth(1).evaluate(n=>getComputedStyle(n,'::before').transitionDuration),'0.22s, 0.22s');
 await dots.nth(0).tap();await page.waitForFunction(()=>{const s=(document.querySelector('[data-react-theme],[data-native-theme]').shadowRoot??document.querySelector('[data-react-theme],[data-native-theme]'));return s.querySelector('.springboard-dots button').getAttribute('aria-current')==='true';});
 assert.deepEqual(errors,[]);console.log('PASS: real touch notification pull/close/tap and stable animated page dot sizes');
}finally{await browser.close();server.closeAllConnections();server.close();}
