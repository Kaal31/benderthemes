// Bug-report fixes of 2026-10-12 (handoff-notes/bugfixes-2026-10-12.md), in the browser preview with ?bugs=1:
//   non-Steam playtime / last played, friend nicknames, hidden games, the keyboard next to the hidden bottom bar,
//   and the PS2 box-art shape. Screenshots go to out/bugfix-shots/ (set SHOTS=0 to skip them).
import { launch } from './browser.mjs';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { startPreviewServer } from '../preview/server.mjs';
const SHOTS = process.env.SHOTS !== '0', dir = 'out/bugfix-shots';
if (SHOTS) mkdirSync(dir, { recursive: true });
const { server, url } = await startPreviewServer();
const browser = await launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1304, height: 900 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  const open = async (theme, extra = '') => { await page.goto(`${url}?bugs=1&theme=${theme}&still=1${extra}`); await page.locator('[data-dht-root]').waitFor(); await page.waitForTimeout(500); };
  const shot = async (name) => { if (SHOTS) await page.screenshot({ path: `${dir}/${name}.png` }); };

  // 1-3: the shared library
  await open('ps4');
  const lib = await page.evaluate(() => { const l = window.__getThemeLibrary(); return { names: l.games.map((g) => g.name), all: l.all.map((g) => g.name), fav: l.collections.find((c) => c.id === 'favorite')?.games.map((g) => g.name) ?? [], dol: l.byId.get(5001), her: l.byId.get(5002), hid: l.byId.get(5003) }; });
  assert.ok(!lib.names.includes('Secret Hidden Game') && !lib.all.includes('Secret Hidden Game') && !lib.fav.includes('Secret Hidden Game'), 'hidden game leaked into a list');
  assert.equal(lib.hid, undefined);
  assert.equal(lib.dol.playtime, 185, 'shortcut playtime from the app details');
  assert.equal(lib.her.playtime, 0); assert.ok(lib.her.lastPlayed > 0);
  assert.ok(lib.names.includes('Dolphin Emulator') && lib.names.includes('Heroic Launcher'));
  console.log('library: hidden game filtered everywhere, shortcut playtime read');

  // the destination pages: game details (playtime line) and friends (nicknames)
  for (const theme of ['ps4', 'ps3', 'switch']) {
    await open(theme);
    await page.evaluate(() => window.__updateTheme({ source: 'all' }));
    await page.evaluate((id) => window.__openGame(id), 5001);
    await page.locator('.dht-destination').first().waitFor();
    const t1 = await page.locator('.dht-destination').first().innerText();
    assert.match(t1, /3\.1 hrs played/, `${theme}: shortcut playtime missing in: ${t1}`);
    await shot(`${theme}-shortcut-playtime`);
    await page.evaluate((id) => window.__openGame(id), 5002);
    await page.waitForTimeout(300);
    const t2 = await page.locator('.dht-destination').first().innerText();
    assert.ok(!/Never played/.test(t2) && /Last played/.test(t2), `${theme}: last played expected, got: ${t2}`);
    await shot(`${theme}-shortcut-lastplayed`);
    await page.evaluate(() => window.__openPlace('friends'));
    await page.waitForTimeout(400);
    const fr = await page.locator('.dht-destination[data-place=friends]').innerText();
    assert.match(fr, /Kai \(best buddy\) \(Kaida\)/); assert.match(fr, /Toby \(Tobias\)/); assert.match(fr, /Orrin/);
    await shot(`${theme}-friends-nicknames`);
  }
  console.log('details + friends pages ok');

  // 4: the keyboard guard. A fake Steam bottom strip is hidden, the keyboard's own strip is not.
  await open('x360');
  await page.evaluate(() => {
    const mk = (cls, parent) => { const d = document.createElement('div'); d.className = cls; parent.append(d); return d; };
    const strip = (parent, txt, id) => { const d = mk('footer_Strip', parent); d.id = id; Object.assign(d.style, { position: 'fixed', left: '0', right: '0', bottom: '0', height: '40px' }); d.textContent = txt; return d; };
    strip(document.body, 'STEAM Menu  A Select  B Back', 'fake-footer');
    const kb = mk('virtualkeyboard_Keyboard_x1', document.body);
    Object.assign(kb.style, { position: 'fixed', left: '0', right: '0', bottom: '0', height: '300px', zIndex: 9 });
    strip(kb, 'Y Backspace  X Space', 'kb-strip');
  });
  await page.waitForTimeout(2200);
  const hidden = await page.evaluate(() => ({ footer: getComputedStyle(document.getElementById('fake-footer')).display, kb: getComputedStyle(document.getElementById('kb-strip')).display, kbh: document.querySelector('.virtualkeyboard_Keyboard_x1').getBoundingClientRect().height }));
  assert.equal(hidden.footer, 'none', 'the bottom bar must still be hidden');
  assert.notEqual(hidden.kb, 'none', 'the keyboard strip must stay');
  assert.equal(hidden.kbh, 300, 'the keyboard keeps its height');
  // a text field gets focus: nothing new is hidden while it is focused
  await page.evaluate(() => { const i = document.createElement('input'); i.id = 'chat-input'; document.body.append(i); i.focus(); const f = document.createElement('div'); f.id = 'late-footer'; f.className = 'footer_Strip'; f.textContent = 'late strip'; Object.assign(f.style, { position: 'fixed', left: '0', right: '0', bottom: '0', height: '40px' }); document.body.append(f); });
  await page.waitForTimeout(2200);
  assert.notEqual(await page.evaluate(() => getComputedStyle(document.getElementById('late-footer')).display), 'none', 'nothing is hidden while a text field has focus');
  console.log('keyboard guard ok');

  // 6: the PS2 box art shapes
  for (const mode of ['square', 'portrait']) {
    await open('ps2');
    await page.evaluate((m) => window.__updateTheme({ styles: { ps2: { boxArt: m } } }), mode);
    for (const k of ['Enter', 'Enter']) { await page.keyboard.press(k); await page.waitForTimeout(350); }
    await page.waitForTimeout(500);
    const dims = await page.evaluate(() => Array.from(document.querySelectorAll('.dht-ps2-save-model')).map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
    assert.ok(dims.length > 5, `${mode}: icons shown (${dims.length})`);
    const [w, h] = dims[0];
    assert.ok(mode === 'portrait' ? Math.abs(h / w - 1.5) < 0.03 : Math.abs(h / w - 1.25) < 0.03, `${mode}: ratio ${h / w}`);
    const box = await page.evaluate(() => { const r = document.querySelector('[data-dht-root]').getBoundingClientRect(); const all = Array.from(document.querySelectorAll('.dht-ps2-save-model')).map((e) => e.getBoundingClientRect()); return { bottom: Math.max(...all.map((a) => a.bottom)), top: r.top, h: r.height, rootBottom: r.bottom }; });
    assert.ok(box.bottom < box.rootBottom - 90, `${mode}: icons clear the footer text (${box.bottom} vs ${box.rootBottom})`);
    await shot(`ps2-${mode}`);
    await page.keyboard.press('Enter'); await page.waitForTimeout(600);
    await shot(`ps2-${mode}-info`);
  }
  console.log('ps2 box art ok');
  assert.deepEqual(errors, []);
  console.log('PASS bugfixes-2026-10');
} finally {
  await browser.close();
  server.close();
}
