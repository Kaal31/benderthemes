import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch({headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900}});p.on('pageerror',e=>{throw e;});await p.goto('http://127.0.0.1:8911/preview/x360-kinect-reviewed.html?theme=x360&xs=kinect&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883',{waitUntil:'domcontentloaded',timeout:60000});await p.waitForTimeout(7500);
 const press=async button=>{await p.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);await p.waitForTimeout(300);};
 const active=()=>p.locator('[data-kinect-channel]').getAttribute('data-kinect-channel');
 assert.equal(await active(),'myxbox');await press(9);assert.equal(await active(),'games');await press(10);assert.equal(await active(),'myxbox');
 await press(12);const selected=await p.locator('.dht-tile[data-selected=true]').getAttribute('data-name');await press(9);await press(10);assert.equal(await p.locator('.dht-tile[data-selected=true]').getAttribute('data-name'),selected,'Each category remembers its selected cover');
 for(let i=0;i<10;i++)await press(9);assert.equal(await active(),'settings');await press(9);assert.equal(await active(),'settings');
 for(let i=0;i<10;i++)await press(10);assert.equal(await active(),'welcome');await press(10);assert.equal(await active(),'welcome');
 await p.getByRole('button',{name:'My Xbox',exact:true}).click();assert.equal(await active(),'myxbox');
 const label=await p.locator('.dht-x360n-channel[data-selected=true]').boundingBox(),card=await p.locator('.dht-tile[data-selected=true]').boundingBox();assert(label.y+label.height<card.y,'Active category label remains above its covers');
 await p.screenshot({path:'preview/kinect-category-corrected.png'});console.log('PASS Kinect category direction, boundaries, cover memory, pointer selection and label placement');
}finally{await b.close();}
