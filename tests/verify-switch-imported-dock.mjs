import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
const source='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#303438"/></svg>');
const skin={file:'vertical.nxtheme',name:'Vertical navigation regression',author:'test',icons:{},otherScreens:[],screens:{home:{file:'vertical.nxtheme',name:'Vertical',author:'test',target:'home',background:source,icons:{},errors:[],conversion:{version:1,converted:1,warnings:[],effects:{background:{texture:{scaleX:12,scaleY:12,repeatX:true,repeatY:true,nearest:false}}},animations:[{pane:'background',event:'enter',frames:64000,loop:false,tracks:[{property:5,interpolation:'hermite',keys:[{frame:0,value:-360,slope:.2},{frame:64000,value:360,slope:.2}]},{property:6,interpolation:'step',keys:[{frame:0,value:3.9375,slope:0}]},{property:7,interpolation:'step',keys:[{frame:0,value:7,slope:0}]}]}],panes:{N_System:{Position:{X:-595,Y:-124},Size:{X:110,Y:80}},L_BtnNoti:{Visible:false},L_BtnShop:{Visible:false},L_BtnPvr:{Position:{X:0,Y:231}},L_BtnCtrl:{Position:{X:0,Y:154}},L_BtnSet:{Position:{X:0,Y:77}},L_BtnPow:{Position:{X:0,Y:0}}}}}}};
try{const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(s=>window.__testSwitch=s,skin);await page.goto(url+'?theme=switch&still=1&h=800');await page.locator('.dht-switch-dock-item[data-name="Album"]').waitFor();
const canvas=page.locator('[data-switch-tiled-background]');await canvas.waitFor();
await page.waitForFunction(()=>document.querySelector('[data-switch-tiled-background]')?.getContext('2d').getImageData(0,0,1,1).data[3]===255);
const surface=await canvas.evaluate(e=>({width:e.width,height:e.height,parentTransform:getComputedStyle(e.parentElement).transform}));assert.equal(surface.width,1280);assert.equal(surface.height,800);assert.equal(surface.parentTransform,'none');
await page.evaluate(()=>window.__updateTheme({animations:true}));await page.waitForTimeout(200);await page.evaluate(()=>window.__updateTheme({animations:false}));
const chosen=page.locator('.dht-switch-dock-item[data-selected="true"]');
await page.keyboard.press('ArrowDown');assert.equal(await chosen.getAttribute('data-name'),'Album');
await page.keyboard.press('ArrowDown');assert.equal(await chosen.getAttribute('data-name'),'Controllers');
await page.keyboard.press('ArrowUp');assert.equal(await chosen.getAttribute('data-name'),'Album');
await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');assert.equal(await chosen.getAttribute('data-name'),'Settings');
await page.keyboard.press('Enter');await page.locator('.dht-menu--switch').waitFor();await page.keyboard.press('Escape');await page.waitForTimeout(250);
await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name'),'Hades');
// Changing to a layout which hides the selected button must not leave input on it.
await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');assert.equal(await chosen.getAttribute('data-name'),'Controllers');
await page.evaluate(()=>{const next=structuredClone(window.__testSwitch);next.file='vertical-second.nxtheme';next.screens.home.conversion.panes.L_BtnCtrl.Visible=false;window.__testSwitch=next;window.__updateTheme({switchTheme:next.file});});
await page.waitForFunction(()=>document.querySelector('.dht-switch-dock-item[data-selected="true"]')?.getAttribute('data-name')==='Album');
await page.keyboard.press('ArrowDown');assert.equal(await chosen.getAttribute('data-name'),'Settings');
await page.keyboard.press('ArrowRight');await page.keyboard.press('y');await page.locator('.dht-menu--switch').waitFor();await page.keyboard.press('Escape');
await page.keyboard.press('Escape');
await page.evaluate(()=>{const next=structuredClone(window.__testSwitch);next.file='oversized-launcher.nxtheme';next.screens.home.conversion.panes.N_Icon_12={Position:{X:-890,Y:515},Scale:{X:230,Y:205}};window.__testSwitch=next;window.__updateTheme({switchTheme:next.file});});
await page.waitForFunction(()=>{const e=document.querySelector('.dht-switch-tile[data-name="All Software"]');return e&&getComputedStyle(e).zIndex==='-1';});
assert.deepEqual(errors,[]);console.log('PASS imported vertical dock navigation, hidden buttons, Settings return and continued input');
}finally{await browser.close();server.close();}
