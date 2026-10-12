// XMB / Vita places that theme files rely on (regression for the owner's Deck photos, October 2026).
//  1. PS3: the icon column follows the 16:9 wallpaper (375 of 1280, cover-cropped), not a fixed 300 px (Little Big Planet's
//     wallpaper draws a cross for the icons there).
//  2. PSP: with a theme file applied, "PSP size: Auto" uses the console's places (Persona 3 FES's wallpaper selector circle);
//     Compact keeps the smaller layout.
//  3. PSP: a one-bar theme whose bar has no "+" gets no Extras category (Large Original Midnight Black showed a lone "+").
//  4. Vita: bubble labels are one line, an open folder's name sits in the information bar, nothing covers a bubble.
// Synthetic theme data only (no third-party files). Build the preview first: PYTHON=python3 node preview/build.mjs
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';

function png(w, h, rgba = [255, 255, 255, 255]) {
  const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) raw.set(rgba, y * (w * 4 + 1) + 1 + x * 4);
  return 'data:image/png;base64,' + Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]).toString('base64');
}
const CATS = ['icon_setting', 'icon_photo', 'icon_music', 'icon_video', 'icon_game', 'icon_network', 'icon_psn'];
const icon = png(64, 64);
const p3t = { name: 'Places', author: '', look: {}, backgrounds: [png(16, 9, [40, 90, 60, 255])], icons: Object.fromEntries([...CATS, 'icon_tv', 'icon_user', 'icon_savedata', 'icon_default_h'].map((k) => [k, icon])), visuals: {} };
const pspPlain = { name: 'Plain', icons: Object.fromEntries([...CATS, 'icon_extras', 'icon_savedata'].map((k) => [k, icon])), backgrounds: [png(48, 27, [30, 30, 60, 255])], visuals: {} };
const bar = png(480, 80, [200, 200, 200, 255]);
const pspBar = { name: 'Bar', icons: { ...Object.fromEntries(CATS.map((k) => [k, bar])), icon_extras: png(40, 40) }, backgrounds: [png(48, 27)], visuals: {}, catBar: { w: 480, h: 80 } };

const { server, url } = await startPreviewServer(0);
const browser = await launch();
const errors = [];
async function page(query, real, h = 800, prep) {
  const p = await browser.newPage({ viewport: { width: 1280, height: h } });
  p.on('pageerror', (e) => errors.push(String(e)));
  if (real) await p.addInitScript((r) => { window.__real = r; }, real);
  await p.goto(`${url}?${query}&h=${h}`);
  await p.locator('[data-dht-root]').first().waitFor();
  await p.evaluate(([H]) => { document.body.style.margin = '0'; const b = document.getElementById('bar'); b.style.position = 'fixed'; b.style.top = '-300px'; Object.assign(b.nextElementSibling.style, { width: '1280px', height: H + 'px', margin: '0', borderRadius: '0', boxShadow: 'none' }); }, [h]);
  if (prep) await prep(p);
  await p.waitForTimeout(1500);
  return p;
}
// the target place from the inline style (the rows slide with a CSS transition, so a measured rect can be mid-way)
const catX = (p) => p.locator('.dht-xmb-cat[data-selected="true"]').first().evaluate((e) => parseFloat(e.style.left)); // centred by translate(-50%)
const itemX = (p) => p.locator('.dht-xmb-item[data-selected="true"]').first().evaluate((e) => parseFloat(e.style.left) + parseFloat(e.firstElementChild.style.width) / 2);
const setXmb = (patch) => (p) => p.evaluate((x) => window.__updateTheme({ xmb: { ...window.__getThemeSettings().xmb, ...x } }), patch);
try {
  // 1. PS3 column: 640 - 265 * max(1280/1280, 800/720) = 345.6
  let p = await page('theme=ps3&p3t=Places.p3t', { lists: { p3t: ['Places.p3t'] }, skins: { p3t: { 'Places.p3t': p3t } } });
  const ps3x = await catX(p);
  assert.ok(Math.abs(ps3x - 345.6) < 3, `PS3 column at ${ps3x}, expected ~345.6`);
  await p.close();

  // 2. PSP: Auto with a theme file = console places (catX 109 PSP px x 2.667 = 290.7); Compact = 250
  const real = { lists: { psp: ['Plain.ctf', 'Bar.ctf'] }, skins: { psp: { 'Plain.ctf': pspPlain, 'Bar.ctf': pspBar } } };
  p = await page('theme=psp', real, 800, setXmb({ psp: 'Plain.ctf', pspSize: 'auto' }));
  const autoX = await itemX(p);
  assert.ok(Math.abs(autoX - 290.7) < 3, `PSP Auto + theme file: column at ${autoX}, expected ~290.7`);
  await setXmb({ pspSize: 'compact' })(p); await p.waitForTimeout(2500);
  const compactX = await itemX(p);
  assert.ok(Math.abs(compactX - 250) < 3, `PSP Compact: column at ${compactX}, expected 250`);
  // a theme with its own lone "+" (not a bar) keeps Extras
  assert.equal(await p.locator('.dht-xmb-cat[data-name="Extras"]').count(), 1, 'a normal theme with a "+" icon has Extras');
  await p.close();

  // 3. one-bar theme without a "+" in its bar: no Extras
  p = await page('theme=psp', real, 800, setXmb({ psp: 'Bar.ctf' }));
  assert.equal(await p.locator('.dht-xmb-cat[data-name="Extras"]').count(), 0, 'one-bar theme without "+" must not get Extras');
  assert.ok(await p.locator('.dht-xmb-cat-bar').count() > 0, 'the bar is drawn');
  await p.close();

  // 4. Vita, 16:9 and 16:10: one-line labels, folder name in the bar, no label or title over a bubble
  for (const h of [720, 800]) {
    p = await page('theme=vita', null, h);
    await p.locator('.dht-bubble[data-name="Adventures"]').first().click();
    await p.waitForTimeout(3000);
    const r = await p.evaluate(() => {
      const vis = (e) => { let o = 1; for (let q = e; q; q = q.parentElement) o *= +getComputedStyle(q).opacity; return o > 0.05; };
      const b = [...document.querySelectorAll('.dht-bubble')].filter(vis).map((e) => ({ n: e.dataset.name, ic: e.querySelector('.dht-bubble-icon').getBoundingClientRect(), lb: e.querySelector('.dht-bubble-label') }));
      const hit = (a, c) => { const cx = (c.left + c.right) / 2, cy = (c.top + c.bottom) / 2, rr = (c.right - c.left) / 2 - 1; const px = Math.max(a.left, Math.min(cx, a.right)), py = Math.max(a.top, Math.min(cy, a.bottom)); return Math.hypot(px - cx, py - cy) < rr; };
      const bad = [];
      const title = document.querySelector('.dht-folder-title');
      for (const x of b) {
        const lr = x.lb.getBoundingClientRect();
        if (lr.height > parseFloat(getComputedStyle(x.lb).lineHeight) + 1) bad.push(`label of ${x.n} wraps`);
        for (const y of b) if (x !== y && lr.width && hit(lr, y.ic)) bad.push(`label of ${x.n} over ${y.n}`);
        if (title && hit(title.getBoundingClientRect(), x.ic)) bad.push(`folder title over ${x.n}`);
      }
      return { bad, n: b.length, titleBottom: title ? title.getBoundingClientRect().bottom : -1 };
    });
    assert.ok(r.n >= 4, `Vita ${h}: folder bubbles shown (${r.n})`);
    assert.deepEqual(r.bad, [], `Vita ${h}: ${r.bad.join('; ')}`);
    assert.ok(r.titleBottom > 0 && r.titleBottom <= 45, `Vita ${h}: folder name in the information bar (bottom ${r.titleBottom})`);
    await p.close();
  }
  assert.deepEqual(errors, []);
  console.log('verify-xmb-theme-places: ok');
} finally {
  await browser.close();
  server.close();
}
