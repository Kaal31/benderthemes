import assert from 'node:assert/strict';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';import {mkdirSync} from 'node:fs';
const {server,url}=await startPreviewServer(),browser=await launch();mkdirSync('out/native-themes',{recursive:true});
try{
 const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__backs=0;const fill=CanvasRenderingContext2D.prototype.fillRect;CanvasRenderingContext2D.prototype.fillRect=function(...args){if(this.canvas.width===768&&this.canvas.height===1152)window.__backs++;return fill.apply(this,args);};});
 await p.goto(url+'?theme=vita&still=1');await p.locator('[data-dht-root]').waitFor();
 await p.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-default',animations:false}));const w=p.locator('[data-react-theme=wiiflow-default]');await w.waitFor();await p.waitForFunction(()=>window.__backs>0);
 await p.keyboard.press('Enter');await w.locator('[aria-label="Game preview"]').waitFor();assert.equal(await p.locator('.dht-destination,.dht-launch-overlay').count(),0,'Selection previews without launching or opening Steam');
 await w.getByRole('button',{name:'Rotate case',exact:true}).click();await w.screenshot({path:'out/native-themes/wiiflow-native-back.png'});
 await w.getByRole('button',{name:'Back',exact:true}).click();assert.equal(await w.locator('[aria-label="Game preview"]').count(),0);
 for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
  await p.setViewportSize({width,height});const bounds=await w.boundingBox();const buttons=await w.locator('footer button').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return {left:r.left,right:r.right,width:r.width,image:s.backgroundImage,svg:n.querySelector('svg')?getComputedStyle(n.querySelector('svg')).display:'none'};}));
  for(const b of buttons){assert.ok(b.left>=bounds.x&&b.right<=bounds.x+bounds.width,'Bottom button stays inside screen');assert.notEqual(b.image,'none');assert.equal(b.svg,'none','Native glyph does not overlay themed button artwork');}
  assert.ok(buttons[0].right<buttons[1].left&&buttons[1].right<buttons[2].left,'Buttons retain left disc/right star and gear placement');
 }
 await w.getByRole('button',{name:'Change cover flow',exact:true}).click();assert.equal(await w.getByRole('button',{name:'Change cover flow',exact:true}).getAttribute('aria-pressed'),'true');
 await p.evaluate(()=>window.__updateTheme({activeTheme:'santa-express'}));const s=p.locator('[data-react-theme=santa-express]');await s.waitFor();
 for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
  await p.setViewportSize({width,height});await p.waitForTimeout(100);
  const avatar=await s.locator('.steam-avatar').boundingBox();assert.ok(Math.abs(avatar.width-avatar.height)<1,'Avatar remains round');
  const rect=await s.locator('#carousel').boundingBox(),cards=await s.locator('.card').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y,bottom:r.bottom,width:r.width,height:r.height,cssWidth:getComputedStyle(n).width,cssHeight:getComputedStyle(n).height};}));
  assert.equal(cards.length,5);for(const c of cards){assert.ok(c.x>=rect.x&&c.right<=rect.x+rect.width&&c.y>=rect.y&&c.bottom<=rect.y+rect.height,'Complete cover stays within carousel');assert.equal(c.cssWidth,'174px');assert.equal(c.cssHeight,'267px');}
  assert.equal(await s.locator('.cola-inset .cola-badge').count(),1,'Logo uses original recessed mount');
 }
 await s.screenshot({path:'out/native-themes/santa-native-covers.png'});assert.deepEqual(errors,[]);console.log('PASS WiiFlow generated backs, preview before launch, themed controls/layout and Santa complete fixed-size covers, round avatar and recessed badge');
}finally{await browser.close();server.closeAllConnections();server.close();}
