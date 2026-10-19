import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {startPreviewServer} from '../preview/server.mjs';
const ids=process.argv.slice(2).length?process.argv.slice(2):['3595','13B5F','9A6'];
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
const template=readFileSync('preview/preview.html','utf8');
mkdirSync('work/themezer-validation/motion-check',{recursive:true});
try{for(const id of ids){
 const skin=JSON.parse(readFileSync(`work/themezer-validation/${id}.json`));
 const path=`preview/themezer-validation/motion-${id}.html`;
 writeFileSync(path,template.replace('<head>','<head><base href="/preview/"><script>window.__testSwitch='+JSON.stringify(skin).replaceAll('<','\\u003c')+';</script>').replace('</body>',`<script>window.addEventListener('load',()=>window.__updateTheme({theme:'switch',switchTheme:${JSON.stringify(skin.file)},animations:true}));</script></body>`));
 const p=await browser.newPage({viewport:{width:1304,height:960}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url.replace('preview.html',`themezer-validation/motion-${id}.html?theme=switch&still=1&h=720`));
 await p.locator('.dht-switch-game-root').first().waitFor();await p.waitForTimeout(5500);
 const roots=p.locator('.dht-switch-game-root');
 await roots.evaluateAll(els=>els.forEach(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=Math.min(2000,a.effect.getTiming().duration);})));
 const selectedBefore=await roots.first().evaluate(el=>getComputedStyle(el).transform);
 const dimensions=await p.locator('.dht-switch-tile:has(.dht-switch-game-root)').evaluateAll(els=>els.map(el=>({name:el.dataset.name,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})));
 assert(dimensions.every(x=>x.width<2000&&x.height<2000),'Game cover geometry must remain finite; launcher panes may intentionally form screen backings');
 await p.locator('.dht-switch-bg').locator('..').screenshot({path:`work/themezer-validation/motion-check/${id}-active.png`});
 await p.keyboard.press('ArrowRight');await p.waitForTimeout(700);
 const previousNow=await roots.first().evaluate(el=>getComputedStyle(el).transform);
 if(['13B5F','9A6'].includes(id))assert.notEqual(previousNow,selectedBefore,'Changing focus must apply the source inactive pose');
 await p.keyboard.press('ArrowDown');await p.waitForTimeout(700);
 await p.locator('.dht-switch-bg').locator('..').screenshot({path:`work/themezer-validation/motion-check/${id}-dock.png`});
 assert.deepEqual(errors,[]);console.log(id,JSON.stringify({selectedBefore,previousNow,tiles:dimensions.length,errors}));
 await p.close();
}}finally{await browser.close();server.close();}
