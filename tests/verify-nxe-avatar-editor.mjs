import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-avatar-reference.html?theme=x360&xs=nxe&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883');await p.waitForTimeout(7000);
 const press=async detail=>{await p.evaluate(detail=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail})),detail);await p.waitForTimeout(180);};
 await press(12);await press(1);const editor=p.getByRole('dialog',{name:'My Avatar',exact:true});await editor.waitFor();await editor.getByRole('button',{name:'Shoes',exact:true}).waitFor({timeout:60000});assert.equal(await p.locator('[data-nxe-avatar-grid] button').count(),9);
 await editor.locator('[data-avatar-engine=ready]').waitFor({timeout:90000});await p.screenshot({path:'preview/nxe-avatar-my-style.png'});
 await editor.getByRole('button',{name:'Shoes',exact:true}).click();assert(await p.locator('[data-nxe-avatar-grid] button').count()>0);await press(10);await press(1);await p.waitForTimeout(600);await p.screenshot({path:'preview/nxe-avatar-shoes.png'});
 await press(2);assert.equal(await editor.getByRole('button',{name:'Shoes',exact:true}).count(),1);await press(2);assert.equal(await p.locator('[data-nxe-avatar-editor]').count(),0);assert.deepEqual(errors,[]);console.log('PASS NXE My Style layout, nine categories, real avatar, shoe selection, back stack');
}finally{await b.close();}
