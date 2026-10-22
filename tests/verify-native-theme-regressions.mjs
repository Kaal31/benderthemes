import assert from 'node:assert/strict';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';import {mkdirSync} from 'node:fs';
const {server,url}=await startPreviewServer(),browser=await launch();mkdirSync('out/native-themes',{recursive:true});
try{
 const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__backs=0;const fill=CanvasRenderingContext2D.prototype.fillRect;CanvasRenderingContext2D.prototype.fillRect=function(...args){if(this.canvas.width===768&&this.canvas.height===1152)window.__backs++;return fill.apply(this,args);};});
 await p.goto(url+'?theme=vita&still=1');await p.locator('[data-dht-root]').waitFor();
 await p.evaluate(()=>{const screen=document.querySelector('[data-dht-root]').closest('div[style*="border-radius: 10px"]');screen.dataset.regressionFullscreen='true';Object.assign(screen.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',margin:'0',zIndex:'999'});document.body.style.overflow='hidden';});
 await p.addStyleTag({content:'[data-regression-fullscreen]{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;margin:0!important}'});
 await p.evaluate(()=>window.__updateTheme({theme:'santa-express',activeTheme:'santa-express',animations:false}));const s=p.locator('[data-react-theme=santa-express]');await s.waitFor();
 for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
  await p.setViewportSize({width,height});await p.waitForTimeout(100);
  const avatar=await s.locator('.steam-avatar').boundingBox();assert.ok(Math.abs(avatar.width-avatar.height)<1,'Avatar remains round');
  const rect=await s.locator('#carousel').boundingBox(),cards=await s.locator('.card').evaluateAll(nodes=>nodes.filter(n=>Number(getComputedStyle(n).opacity)>0).map(n=>{const r=n.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y,bottom:r.bottom,width:r.width,height:r.height,cssWidth:getComputedStyle(n).width,cssHeight:getComputedStyle(n).height};}));
  assert.equal(cards.length,6);for(const c of cards){assert.ok(c.x>=rect.x&&c.right<=rect.x+rect.width&&c.y>=rect.y&&c.bottom<=rect.y+rect.height,'Complete cover stays within carousel');assert.ok(Math.abs(parseFloat(c.cssWidth)/parseFloat(c.cssHeight)-2/3)<.01,'Portrait covers retain their proportions along the curved shelf');}
  assert.equal(await s.locator('.cola-inset .native-cola-panel').count(),1,'Logo uses original recessed mount');
 }
 await p.evaluate(()=>window.__updateTheme({theme:'gameamp',activeTheme:'gameamp'}));const amp=p.locator('[data-react-theme=gameamp],[data-native-theme=gameamp]');await amp.waitFor();
 await p.waitForFunction(()=>{const host=document.querySelector('[data-native-theme=gameamp]'),dash=host?.shadowRoot?.querySelector('#dashboard');return dash&&Math.abs(dash.getBoundingClientRect().width-Math.min(innerWidth,innerHeight*1280/800))<1;});const before=await amp.locator('#dashboard').boundingBox();for(let i=0;i<9;i++)await p.keyboard.press('ArrowRight');const after=await amp.locator('#dashboard').boundingBox();assert.equal(after.width,before.width);assert.equal(after.height,before.height,'GameAmp size is independent of carousel content');
 await p.evaluate(()=>window.__updateTheme({theme:'santa-express',activeTheme:'santa-express'}));await s.waitFor();
 await s.screenshot({path:'out/native-themes/santa-native-covers.png'});assert.deepEqual(errors,[]);console.log('PASS Santa complete proportional covers, round avatar and recessed badge');
}finally{await browser.close();server.closeAllConnections();server.close();}
