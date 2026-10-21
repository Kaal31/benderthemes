import assert from 'node:assert/strict';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';import {mkdirSync} from 'node:fs';
const {server,url}=await startPreviewServer(),browser=await launch();mkdirSync('out/native-themes',{recursive:true});
try{
 const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__backs=0;const fill=CanvasRenderingContext2D.prototype.fillRect;CanvasRenderingContext2D.prototype.fillRect=function(...args){if(this.canvas.width===768&&this.canvas.height===1152)window.__backs++;return fill.apply(this,args);};});
 await p.goto(url+'?theme=vita&still=1');await p.locator('[data-dht-root]').waitFor();
 await p.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'santa-express',animations:false}));const s=p.locator('[data-react-theme=santa-express]');await s.waitFor();
 for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
  await p.setViewportSize({width,height});await p.waitForTimeout(100);
  const avatar=await s.locator('.steam-avatar').boundingBox();assert.ok(Math.abs(avatar.width-avatar.height)<1,'Avatar remains round');
  const rect=await s.locator('#carousel').boundingBox(),cards=await s.locator('.card').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y,bottom:r.bottom,width:r.width,height:r.height,cssWidth:getComputedStyle(n).width,cssHeight:getComputedStyle(n).height};}));
  assert.equal(cards.length,5);for(const c of cards){assert.ok(c.x>=rect.x&&c.right<=rect.x+rect.width&&c.y>=rect.y&&c.bottom<=rect.y+rect.height,'Complete cover stays within carousel');assert.equal(c.cssWidth,'174px');assert.equal(c.cssHeight,'267px');}
  assert.equal(await s.locator('.cola-inset .cola-badge').count(),1,'Logo uses original recessed mount');
 }
 await p.evaluate(()=>window.__updateTheme({activeTheme:'gameamp'}));const amp=p.locator('[data-react-theme=gameamp]');await amp.waitFor();
 const before=await amp.locator('#dashboard').boundingBox();for(let i=0;i<9;i++)await p.keyboard.press('ArrowRight');const after=await amp.locator('#dashboard').boundingBox();assert.equal(after.width,before.width);assert.equal(after.height,before.height,'GameAmp size is independent of carousel content');
 await p.evaluate(()=>window.__updateTheme({activeTheme:'santa-express'}));await s.waitFor();
 await s.screenshot({path:'out/native-themes/santa-native-covers.png'});assert.deepEqual(errors,[]);console.log('PASS Santa complete fixed-size covers, round avatar and recessed badge');
}finally{await browser.close();server.closeAllConnections();server.close();}
