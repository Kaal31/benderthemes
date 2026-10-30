import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch();
try{
 for(const cabinet of ['', 'NAC']){
  const page=await b.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:8911/preview/x360-kinect-cabinet.html?theme=x360&xs=kinect&consoleArt=1&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883${cabinet?'&cabinet='+cabinet:''}`,{waitUntil:'domcontentloaded'});
  const header=page.locator('[data-kinect-profile-header]');await header.waitFor();await page.waitForTimeout(7000);
  assert.equal(await page.locator('[data-kinect-profile-name]').innerText(),'DeckPlayer');
  const stage=await header.evaluate(n=>{const parent=n.parentElement;return {transform:getComputedStyle(parent).transform,picture:getComputedStyle(n).right,top:getComputedStyle(n).top};});assert.equal(stage.picture,'106px');assert.equal(stage.top,'52px');
  const picture=header.getByRole('img',{name:'Gamer picture'});assert.equal(await picture.count(),1);await picture.evaluate(n=>n.decode());
  await page.locator('[data-avatar-engine=ready]').waitFor({timeout:60000});
  await page.screenshot({path:`preview/kinect-profile-header-${cabinet?'cabinet':'standard'}.png`});
  await header.click();await page.locator('[data-kinect-profile]').waitFor();await page.locator('[data-kinect-profile] button',{hasText:'Back'}).click();await page.locator('[data-kinect-profile]').waitFor({state:'hidden'});await header.waitFor({state:'visible'});
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS standard and cabinet Kinect: reference-positioned name/picture, new full-body avatar ready, profile open/back');
}finally{await b.close();}
