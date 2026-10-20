import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import { launch } from './browser.mjs';

const registry = await readFile(new URL('../src/pluginSupport.ts', import.meta.url), 'utf8');
const compiled = await transform(registry, { loader:'ts', format:'esm' });
const api = await import(`data:text/javascript;base64,${Buffer.from(compiled.code).toString('base64')}`);
assert.deepEqual(api.pluginSupport(['CSSLoader','ProtonDB Badges','DeckyXMB','Unknown']).map(p=>p.mode), ['shared','shared','conflict','unknown']);
assert.deepEqual(api.pluginSupport(['Steamder','Achievement Customizer']).map(p=>p.mode),['native','shared']);
let invoked = 0;
const off = api.registerPluginGameActions('example', game=>[{id:'reports',label:'Reports',run:()=>invoked+=game.appid}]);
const broken = api.registerPluginGameActions('broken',()=>{throw new Error('missing plugin API');});
const actions = api.pluginGameActions({appid:42});
assert.equal(actions.length,1); actions[0].run(); assert.equal(invoked,42);
assert.throws(()=>api.registerPluginGameActions('example',()=>[]));
off(); off(); broken(); assert.deepEqual(api.pluginGameActions({appid:42}),[]);

const steam = await readFile(new URL('../src/steam.ts', import.meta.url),'utf8');
const footer = steam.slice(steam.indexOf('const HIDDEN_ATTR'), steam.indexOf('// ───────────── live status'));
const keyboard = await readFile(new URL('../src/keyboardSkins.ts', import.meta.url),'utf8');
const detect = keyboard.slice(keyboard.indexOf('const loaderSeen'),keyboard.indexOf('\nfunction apply('));
const {code} = await transform(`const findClassModule=()=>({FooterLegend:'legend'}); const useEffect=()=>{}; const themeHomeOwnsRoute=()=>true; const keyboardClasses=()=>({classes:{Keyboard:"Keyboard"}});
${footer.replaceAll('export ','')}
${detect.replaceAll('export ','')}
window.check = () => {
 const header=document.querySelector('#header');
 header.style.setProperty('visibility','visible','important');hideHeader(document);restoreHeader(document);
 if(header.style.visibility!=='visible'||header.style.getPropertyPriority('visibility')!=='important')throw new Error('header priority lost');
 hideHeader(document);header.style.setProperty('visibility','collapse','important');restoreHeader(document);
 if(header.style.visibility!=='collapse')throw new Error('header external change overwritten');
 if(document.querySelector('#dialog').hasAttribute('data-dht-hidden'))throw new Error('plugin dialog hidden');
 const el=document.querySelector('#footer');
 el.style.setProperty('display','flex','important');markFooter(el,'display');restoreFooter(document);
 if(el.style.display!=='flex'||el.style.getPropertyPriority('display')!=='important')throw new Error('priority lost');
 markFooter(el,'display');el.style.setProperty('display','grid','important');restoreFooter(document);
 if(el.style.display!=='grid')throw new Error('other plugin overwritten');
 const st=document.createElement('style');st.className='css-loader-style';document.head.append(st);
 const c={KeyboardKey:'KeyboardKey',Keyboard:'Keyboard'};
 st.textContent='.aaaaaaaaaaa{color:red}';if(cssLoaderStylesKeyboard(document,c))throw new Error('unrelated theme');
 st.textContent='.KeyboardKey{color:red}';if(!cssLoaderStylesKeyboard(document,c))throw new Error('same length edit missed');
 st.textContent='.aaaaaaaaaaa{color:red}';if(cssLoaderStylesKeyboard(document,c))throw new Error('theme removed missed');
};`,{loader:'ts'});
const browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 await page.setContent('<div data-dht-root></div><div id="header" style="position:fixed;top:0;left:0;width:100%;height:40px">Header</div><div id="dialog" role="dialog" style="position:fixed;top:0;left:0;width:100%;height:40px">Plugin dialog</div><div id="footer">Footer</div>');
 await page.addScriptTag({content:code});await page.evaluate(()=>window.check());
} finally {await browser.close();}
console.log('PASS plugin policies, adapter isolation/cleanup, CSS Loader live edits, footer priority and external changes');
