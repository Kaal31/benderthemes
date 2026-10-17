import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';
import { chromium } from 'playwright';

// A same-origin iframe gives the fixture a second real Document and Window.
// SteamUIStore exposes it using the same BrowserWindow.document shape as Steam.
// Steam's native compositor/keyboard manager are not emulated.
const ref = process.argv[2];
const source = ref ? execFileSync('git', ['show', `${ref}:src/steam.ts`], { encoding:'utf8' }) : await readFile('src/steam.ts', 'utf8');
const skins = await readFile('src/keyboardSkins.ts', 'utf8');
const docs = skins.slice(skins.indexOf('export function steamDocuments'), skins.indexOf('const loaderSeen'));
const section = source.slice(source.indexOf('const HIDDEN_ATTR'), source.indexOf('// ───────────── live status'));
const { code } = await transform(`
const getUiDocument = () => document;
const findClassModule = () => window.unknownFooter ? null : ({ FooterLegend:'steam-footer-legend' });
const keyboardClasses = () => ({ classes:{ Keyboard:'_45rH7-kY4P2uVEb3TxZhm', VirtualKeyboardContainer:'_33MO29eFMotoHmrmT1-6sw' } });
const useEffect = effect => { const stop=effect(); if(stop) window.stops.push(stop); };
${docs.replaceAll('export ', '')}
${section.replaceAll('export ', '')}
window.stops=[];
window.start = mode => { useHiddenHeader(document,true); useHiddenFooter(document,mode); };
window.cleanup = () => { window.stops.splice(0).forEach(stop=>stop()); };
`, { loader:'ts' });
const output = new URL('../out/quick-access-keyboard/', import.meta.url);
await mkdir(output,{recursive:true});
const browser = await chromium.launch();
const results=[];
try {
  for(const mode of (process.argv[3] ? [process.argv[3]] : ['hide','hints','show'])) {
    const page=await browser.newPage({viewport:{width:1280,height:800},hasTouch:true});
    await page.setContent(`<style>body{margin:0}#header,#footer{position:fixed;width:100%;height:40px;background:#345;color:white}
      #header{top:0}#footer{bottom:0}[data-dht-root]{position:fixed;inset:0;background:#356b18}
      iframe{position:fixed;inset:0;width:100%;height:100%;border:0;z-index:10;display:none}</style>
      <div id="header">Steam header</div><div data-dht-root>Metro home</div>
      <div id="footer"><span class="steam-footer-legend">A Select B Back</span></div><iframe id="qam"></iframe>`);
    await page.addScriptTag({content:code});
    await page.evaluate(mode=>window.start(mode),mode);
    // Even while hidden, the footer must retain its measured height.
    assert.equal(await page.locator('#footer').evaluate(el=>el.getBoundingClientRect().height),40,'whole-bar hiding must not collapse Steam layout');
    await page.evaluate(()=>{
      const frame=document.querySelector('#qam');frame.style.display='block';
      frame.contentDocument.body.innerHTML=`<style>body{margin:0;background:#192634;color:white;font:24px sans-serif}main{padding:40px}input{display:block;margin-top:20px;font:inherit}
      #keyboard{position:fixed;bottom:0;width:100%;height:300px;background:#345;padding:20px;box-sizing:border-box}button{width:80px;height:65px}</style>
      <main>Quick Access DMs<input id="dm" placeholder="Message"></main>`;
      window.SteamUIStore={WindowStore:{SteamUIWindows:[{BrowserWindow:frame.contentWindow}]}};
    });
    // Discovery must attach observers to a newly created Steam window.
    await page.waitForTimeout(300);
    const released=await page.evaluate(()=>{
      document.querySelector('#qam').contentDocument.querySelector('#dm').focus();
      return document.querySelectorAll('[data-dht-foot],[data-dht-hidden]').length;
    });
    assert.equal(released,0,'Quick Access focus must synchronously release both header and footer');
    await page.evaluate(()=>{
      const d=document.querySelector('#qam').contentDocument;
      d.querySelector('#dm').blur();
      const kb=d.createElement('div');kb.id='keyboard';kb.className='_45rH7-kY4P2uVEb3TxZhm';
      kb.innerHTML='<button>Q</button>';kb.onclick=()=>{d.querySelector('#dm').value+='Q';};d.body.append(kb);
      window.samples=[];window.timer=setInterval(()=>{
        const r=kb.getBoundingClientRect();const hit=d.elementFromPoint(60,540);
        window.samples.push({top:r.top,bottom:r.bottom,visible:d.defaultView.getComputedStyle(kb).visibility==='visible',hit:!!hit?.closest('#keyboard'),hidden:document.querySelectorAll('[data-dht-foot],[data-dht-hidden]').length});
      },16);
    });
    await page.waitForFunction(()=>window.samples.length>=190);
    const samples=await page.evaluate(()=>{clearInterval(window.timer);return window.samples;});
    assert.ok(samples.every(s=>s.top===500&&s.bottom===800&&s.visible&&s.hit&&s.hidden===0),'hashed keyboard must keep Steam chrome released without focused input');
    await page.frameLocator('#qam').getByRole('button',{name:'Q',exact:true}).tap();
    assert.equal(await page.frameLocator('#qam').locator('#dm').inputValue(),'Q');
    await page.screenshot({path:fileURLToPath(new URL(`fixed-beta-${mode}.png`,output))});
    await page.evaluate(()=>document.querySelector('#qam').contentDocument.querySelector('#keyboard').remove());
    await page.waitForFunction(()=>document.querySelector('#header').hasAttribute('data-dht-hidden'));
    if(mode!=='show') await page.waitForFunction(()=>document.querySelector('[data-dht-foot]'));
    // A closed/unregistered UI window must stop holding the home chrome open.
    await page.evaluate(()=>{
      document.querySelector('#qam').contentDocument.querySelector('#dm').focus();
      window.SteamUIStore.WindowStore.SteamUIWindows=[];
      document.querySelector('#qam').remove();
    });
    await page.waitForFunction(()=>document.querySelector('#header').hasAttribute('data-dht-hidden'));
    await page.evaluate(()=>window.cleanup());
    assert.equal(await page.locator('[data-dht-foot],[data-dht-hidden]').count(),0);
    // Hashed keyboard inserted beneath an already hidden top strip must recover.
    await page.evaluate(()=>{
      window.start('hide');
      const kb=document.createElement('div');kb.className='_45rH7-kY4P2uVEb3TxZhm';kb.textContent='Keyboard';
      document.querySelector('#header').append(kb);
    });
    await page.waitForFunction(()=>document.querySelectorAll('[data-dht-foot],[data-dht-hidden]').length===0);
    assert.equal(await page.locator('#header').evaluate(el=>getComputedStyle(el).visibility),'visible');
    await page.evaluate(()=>window.cleanup());
    results.push({mode,samples:samples.length,layoutPreserved:true,crossWindowFocus:true,hashedKeyboard:true,touchTyping:true,windowClose:true,headerRecovery:true});
    console.log(`PASS ${mode}: layout preserved, Quick Access focus/hashed keyboard, touch, close, header recovery, cleanup`);
    await page.close();
  }
  // Replay the log's actual failure: hashed keyboard and two ancestors all hidden.
  const recovery=await browser.newPage({viewport:{width:826,height:517}});
  await recovery.setContent('<div data-dht-root style="position:fixed;inset:0"></div><div class="_1NxeUlEV-_k2byQ5oYq-Gc"><div class="DefaultTheme Oel3OSshpNqQ5hIOrC1Z5"><div class="_45rH7-kY4P2uVEb3TxZhm" style="width:826px;height:250px">Keyboard</div></div></div>');
  await recovery.evaluate(()=>{for(const el of document.querySelectorAll('._1NxeUlEV-_k2byQ5oYq-Gc,.Oel3OSshpNqQ5hIOrC1Z5,._45rH7-kY4P2uVEb3TxZhm')){el.setAttribute('data-dht-foot',JSON.stringify({how:'display',value:'',priority:''}));el.style.setProperty('display','none','important');}});
  await recovery.addScriptTag({content:code});await recovery.evaluate(()=>window.start('hide'));
  assert.equal(await recovery.locator('[data-dht-foot]').count(),0,'all three logged hidden nodes restored');
  assert.equal(await recovery.locator('._45rH7-kY4P2uVEb3TxZhm').evaluate(el=>el.getBoundingClientRect().height),250);
  await recovery.evaluate(()=>window.cleanup());await recovery.close();
  console.log('PASS replay of real log: hashed keyboard and both hidden ancestors recover');
  // Main log regression: each 47px bottom row used to be hidden on the next poll.
  const rows=await browser.newPage({viewport:{width:826,height:517}});
  await rows.setContent('<div data-dht-root style="position:fixed;inset:0"></div><div class="_45rH7-kY4P2uVEb3TxZhm" style="position:fixed;bottom:0;width:826px;background:#345">'+Array.from({length:5},(_,i)=>`<div class="d-_DJF8LavBgxrCblp2Kb Row_${i}" style="height:47px">Keyboard row ${i}</div>`).join('')+'</div>');
  await rows.addScriptTag({content:code});await rows.evaluate(()=>window.start('hide'));
  await rows.clock.install();
  await rows.clock.fastForward(12000);
  assert.equal(await rows.locator('._45rH7-kY4P2uVEb3TxZhm').evaluate(el=>el.getBoundingClientRect().height),235);
  assert.equal(await rows.locator('[data-dht-foot]').count(),0,'keyboard rows never mistaken for footer');
  await rows.evaluate(()=>window.cleanup());await rows.close();
  console.log('PASS main log regression: all five 47px keyboard rows survive repeated footer polls');
  // Unknown footer mapping must never fall back to hiding arbitrary bottom rows.
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  await page.setContent('<div data-dht-root style="position:fixed;inset:0"></div><div id="unknown" style="position:fixed;bottom:0;height:40px;width:100%">Native chat controls</div>');
  await page.evaluate(()=>window.unknownFooter=true);
  await page.addScriptTag({content:code});await page.evaluate(()=>window.start('hide'));
  assert.equal(await page.locator('#unknown').evaluate(el=>getComputedStyle(el).visibility),'visible');
  assert.equal(await page.locator('#unknown').evaluate(el=>getComputedStyle(el).display),'block');
  await page.evaluate(()=>window.cleanup());await page.close();
  console.log('PASS unknown Steam footer: native controls untouched');
  await writeFile(new URL('results.json',output),JSON.stringify({limitation:'Synthetic DOM; actual Steam/Bazzite behavior requires device retest.',results},null,2));
} finally {await browser.close();}
