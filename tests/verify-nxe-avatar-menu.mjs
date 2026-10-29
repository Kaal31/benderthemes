import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8911/preview/x360-card-pages.html?theme=x360&xs=nxe&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883&avatarMenu=15',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(7500);
 const press=async detail=>{await page.evaluate(detail=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail})),detail);await page.waitForTimeout(500);};
 await press(12);await press(1);const editor=page.locator('[data-nxe-avatar-editor]'),menu=editor.locator('[data-nxe-avatar-menu]');await menu.waitFor();
 for(const name of ['Change My Style','Choose Starting Avatar','Save and Exit','Use Current Avatar'])assert.equal(await menu.getByRole('button',{name,exact:true}).count(),1);
 await editor.locator('[data-avatar-engine=ready]').waitFor();
 await editor.screenshot({path:'preview/nxe-menu-audit/cards-avatar-menu.png'});
 await menu.getByRole('button',{name:'Change My Style',exact:true}).click();await editor.locator('[data-nxe-avatar-grid]').waitFor();await press(2);await menu.waitFor();
 await menu.getByRole('button',{name:'Choose Starting Avatar',exact:true}).click();await editor.locator('[data-nxe-avatar-grid]').waitFor();await press(2);await press(2);await menu.waitFor();
 await press(2);await editor.waitFor({state:'hidden'});assert.deepEqual(errors,[]);
 console.log('PASS new avatar bridge: root menu, style/start-avatar navigation, Back to menu/dashboard without saving changes');
}finally{await browser.close();}
