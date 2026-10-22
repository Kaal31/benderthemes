import {launch} from './tests/browser.mjs';
import assert from 'node:assert/strict';
const browser=await launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');
  const root=page.locator('.dht-oldbeta');
  await root.waitFor();
  assert.equal(await root.locator('.beta-sheet-friend').first().evaluate(n=>getComputedStyle(n).animationPlayState),'paused');
  await root.locator('button[data-category="2"]').focus();
  await page.waitForTimeout(600);
  assert.equal(await root.locator('.beta-community-layer-0>.beta-sheet-friend:not(.beta-chat-panel)').count(),18);
  assert.equal(await root.locator('.beta-chat-panel').count(),0);
  assert.ok(await root.locator('.beta-friend-avatar').first().getAttribute('aria-label').then(label=>label.startsWith('Placeholder avatar')));
  assert.ok(await root.locator('.beta-community-layer-0 .beta-sheet-friend').first().innerText().then(text=>text.includes('Online')&&text.includes('Hades')));
  for(const layer of [0,1,2]) {
    const result=await root.locator(`.beta-community-layer-${layer} .beta-sheet-friend`).first().evaluate(n=>{
      const a=n.getAnimations().find(a=>a.effect.getTiming().iterations===Infinity);
      const running=getComputedStyle(n).animationPlayState;
      a.pause();a.effect.updateTiming({delay:0});
      a.currentTime=6000;
      const before=getComputedStyle(n).translate.split(' ').map(parseFloat);
      a.currentTime=9000;
      const style=getComputedStyle(n),after=style.translate.split(' ').map(parseFloat);
      return {dx:after[0]-before[0],dy:(after[1]||0)-(before[1]||0),opacity:Number(style.opacity),rotation:style.rotate,running};
    });
    assert.equal(result.running,'running');
    assert.ok(layer===0?result.dx<0:result.dx>0,`wrong layer ${layer} direction`);
    assert.equal(result.dy,0);
    assert.equal(result.rotation,'none');
    assert.equal(result.opacity,layer===2?.48:1);
  }
  await root.screenshot({path:'out/old-beta-big-picture/community-counterflow.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.dht-oldbeta').getAnimations({subtree:true}).length===0);
  await page.addInitScript(()=>{globalThis.friendStore={allFriends:[
    {persona:{m_strPlayerName:'Steam Friend',m_steamid:'123',m_ePersonaState:3,m_strGameName:'Portal 2',m_strAvatarHash:'a'.repeat(40)}},
    {persona:{m_strPlayerName:'Busy Friend',m_steamid:'456',m_ePersonaState:2}}
  ]};});
  await page.route('https://avatars.steamstatic.com/**',route=>route.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')}));
  await page.reload();await root.waitFor();await root.locator('button[data-category="2"]').focus();
  const front=root.locator('.beta-community-layer-0');
  assert.ok((await front.innerText()).includes('Away'));
  assert.ok((await front.innerText()).includes('Busy'));
  assert.ok((await front.innerText()).includes('Portal 2'));
  assert.equal(await front.locator('.beta-sheet-friend').count(),2,'Real friend data must not be padded with invented accounts');
  const avatar=front.locator('img').first();
  assert.equal(await avatar.getAttribute('src'),'https://avatars.steamstatic.com/'+ 'a'.repeat(40)+'_medium.jpg');
  await avatar.evaluate(n=>n.dispatchEvent(new Event('error')));
  assert.equal(await avatar.evaluate(n=>n.hidden),true);
  assert.equal(await avatar.locator('..').getAttribute('aria-label'),'Placeholder avatar for Steam Friend');
  console.log('PASS: Community front flows left, rear layers flow right, names stay level, deepest layer alone fades, and inactive/reduced motion is respected.');
} finally {await browser.close();}
