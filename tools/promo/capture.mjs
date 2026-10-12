// Records live footage of the browser preview for the promo video (tools/promo/README in handoff-notes/promo-video.md).
// CDP screencast frames (JPEG q95, with timestamps) of the 1280x800 stage, animations ON.
// Optional time dilation (SLOW=4): page clocks, rAF, timers, CSS/Web animations and videos run 4x slower,
// so a slow software-GL renderer still yields smooth footage; timestamps are divided back to real time.
//   node tools/promo/capture.mjs <out-dir> [shot,shot,...]
//   REAL_JSON (folder from dump_real_themes.py), SLOW (default 4)
import { launch } from '../../tests/browser.mjs';
import { startPreviewServer } from '../../preview/server.mjs';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
// own preview server (an outside one may be stopped by other sessions); build the preview first
const { server, url: SERVER_URL } = await startPreviewServer(0);
const BASE = SERVER_URL.replace(/preview\.html$/, '');
const out = process.argv[2]; const only = (process.argv[3] || '').split(',').filter(Boolean);
// per-shot slow-down, measured: raw grab rate x SLOW ~ 30-40 frames per footage second
const SLOWS = { ps1: 14, ps2: 22, ps3: 36, psp: 26, ps4: 36, ps5: 14, vita: 32, xbox: 26, blades: 20, nxe: 30, kinect: 18, metro: 4, wii: 16, wiiu: 24, plaza: 100, switch: 4, n3ds: 4, minecraft: 10, spotlight: 6, 'imp-switch': 4, 'imp-psp': 9, 'imp-wiiu': 4, 'imp-3ds': 4 };
let SLOW = 1;
const REAL = process.env.REAL_JSON;
const wait = (p, ms) => p.waitForTimeout(ms * SLOW);
const slowOf = (n) => Number(process.env.SLOW || SLOWS[n] || 4);
const key = async (p, k, ms = 500) => { await p.keyboard.press(k); await wait(p, ms); };
const preset = (p, id) => p.evaluate((i) => window.__applyPreset(i), id);

// [name, page url, seconds of warm-up (real-time, before recording), action during recording, real kinds needed]
const SHOTS = [
  ['ps1', 'preview.html?theme=ps1', 3, async (p) => { await wait(p, 600); await key(p, 'ArrowDown', 700); await key(p, 'ArrowUp', 700); }],
  ['ps2', 'preview.html?theme=ps2', 3, async (p) => { await wait(p, 900); await key(p, 'ArrowDown', 900); }],
  ['ps3', 'preview.html?theme=ps3', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowDown', 450); await key(p, 'ArrowDown', 450); await key(p, 'ArrowDown', 700); }, null, async (p) => { await p.evaluate(() => window.__updateTheme({ xmb: { ...window.__getThemeSettings().xmb, ps3Color: 7 } })); await p.waitForTimeout(1500); }],
  ['psp', 'preview.html?theme=psp', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowDown', 450); await key(p, 'ArrowDown', 450); await key(p, 'ArrowDown', 700); }, null, async (p) => { await p.evaluate(() => window.__updateTheme({ xmb: { ...window.__getThemeSettings().xmb, pspColor: 5 } })); await p.waitForTimeout(1500); }],
  ['ps4', 'preview.html?theme=ps4', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowRight', 500); await key(p, 'ArrowRight', 800); }],
  ['ps5', 'preview.html?theme=ps5', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowRight', 500); await key(p, 'ArrowRight', 800); }],
  ['vita', 'preview.html?theme=vita', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowRight', 600); await key(p, 'ArrowRight', 800); }],
  ['xbox', 'preview.html?theme=xbox', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowDown', 600); await key(p, 'ArrowDown', 800); }],
  ['blades', 'preview.html?theme=x360&xs=blades', 3, async (p) => { await wait(p, 200); await key(p, 'ArrowRight', 800); await key(p, 'ArrowDown', 500); }],
  ['nxe', 'preview.html?theme=x360&xs=nxe', 4, async (p) => { await wait(p, 200); await key(p, 'ArrowRight', 700); await key(p, 'ArrowRight', 700); }, null, async (p) => { for (let i = 0; i < 2; i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(1200); } await p.waitForTimeout(1500); }],
  ['kinect', 'preview.html?theme=x360&xs=kinect', 4, async (p) => { await wait(p, 200); await key(p, 'ArrowRight', 700); await key(p, 'ArrowRight', 700); }, null, async (p) => { for (let i = 0; i < 2; i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(1200); } await p.waitForTimeout(1500); }],
  ['metro', 'preview.html?theme=x360&xs=metro', 3, async (p) => { await wait(p, 200); await key(p, 'ArrowRight', 700); await key(p, 'ArrowRight', 700); }],
  ['wii', 'wii-preview.html?theme=wii', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowRight', 600); await key(p, 'ArrowRight', 700); }],
  ['wiiu', 'wiiu-preview.html?theme=wiiu', 4, async (p) => { await wait(p, 300); await key(p, 'ArrowRight', 500); await key(p, 'ArrowRight', 500); await key(p, 'ArrowDown', 600); }],
  ['plaza', 'wiiu-preview.html?theme=wiiu&plaza=1', 6, async (p) => { await wait(p, 2000); }],
  ['switch', 'preview.html?theme=switch', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowRight', 450); await key(p, 'ArrowRight', 450); await key(p, 'ArrowRight', 700); }],
  ['n3ds', 'preview.html?theme=n3ds', 3, async (p) => { await wait(p, 300); await key(p, 'ArrowRight', 500); await key(p, 'ArrowRight', 500); await key(p, 'ArrowDown', 700); }],
  ['minecraft', 'minecraft-preview.html?theme=minecraft', 5, async (p) => { await wait(p, 600); await key(p, 'ArrowRight', 700); await key(p, 'ArrowRight', 700); await key(p, 'ArrowDown', 900); }],
  // Hub -> Plugin Spotlight, type a query, results filter live
  ['spotlight', 'preview.html?theme=ps5', 3, async (p) => {
    await wait(p, 200);
    await p.evaluate(() => [...document.querySelectorAll('#bar button')].find((b) => b.textContent === 'Hub (from this home)').click());
    await wait(p, 900);
    await p.getByRole('tab', { name: 'Plugin Spotlight', exact: true }).click();
    await wait(p, 900);
    await p.keyboard.press('ArrowUp'); await wait(p, 250); await p.keyboard.press('Enter'); await wait(p, 300);
    for (const ch of 'tuner') { await p.keyboard.type(ch); await wait(p, 140); }
    await wait(p, 1000);
    await p.keyboard.press('ArrowDown'); await wait(p, 700);
  }],
  // theme importer: stock look, then the real theme file preset applied (before / after)
  ['imp-switch', 'preview.html?theme=switch', 3, async (p) => { await wait(p, 900); await preset(p, 'switch:Star Wars by la-lo-go/Star Wars by la-lo-go (homemenu).nxtheme'); await wait(p, 1800); await key(p, 'ArrowRight', 500); }, 'switch'],
  ['imp-psp', 'preview.html?theme=psp', 3, async (p) => { await wait(p, 900); await preset(p, 'psp:Persona 3.ctf'); await wait(p, 2200); }, 'psp'],
  ['imp-wiiu', 'wiiu-preview.html?theme=wiiu', 4, async (p) => { await wait(p, 900); await preset(p, 'wiiu:Chill Mario.utheme'); await wait(p, 2200); }, 'wiiu'],
  ['imp-3ds', 'preview.html?theme=n3ds', 3, async (p) => { await wait(p, 900); await preset(p, 'n3ds:TLOZ - Breath of the Wild.zip'); await wait(p, 2200); }, 'n3ds'],
].filter(([n]) => !only.length || only.includes(n));

const realLists = REAL && existsSync(`${REAL}/lists.json`) ? JSON.parse(readFileSync(`${REAL}/lists.json`, 'utf8')) : null;
if (realLists) realLists.switch = (realLists.switch || []).map((t) => ({ id: t.id, name: t.name, author: t.author, screens: Object.keys(t.files || {}).sort() }));

// time dilation: everything the page measures time with runs SLOW times slower
const dilate = (k) => {
  if (k === 1) return;
  const pn = performance.now.bind(performance), t0 = pn(), dn = Date.now, d0 = dn();
  let on = false; window.__dilate = (v) => { if (v && !on) { on = true; } };
  // time runs normally until __slowStart() (warm-up), then slows; keep it continuous
  let base = 0, startReal = null;
  const virt = () => (startReal === null ? pn() - t0 : base + (pn() - t0 - base) / k);
  window.__slowStart = () => { if (startReal === null) { base = pn() - t0; startReal = base; } };
  performance.now = () => t0 + virt();
  Date.now = () => d0 + virt();
  const RD = Date;
  // eslint-disable-next-line no-global-assign
  Date = class extends RD { constructor(...a) { if (a.length) super(...a); else super(d0 + virt()); } static now() { return d0 + virt(); } };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf(() => cb(t0 + virt()));
  const st = window.setTimeout.bind(window), si = window.setInterval.bind(window);
  window.setTimeout = (f, ms = 0, ...a) => st(f, startReal === null ? ms : ms * k, ...a);
  window.setInterval = (f, ms = 0, ...a) => si(f, startReal === null ? ms : ms * k, ...a);
};

const b = await launch();
mkdirSync(out, { recursive: true });
for (const [name, url, warm, act, realKind, prep] of SHOTS) {
  SLOW = slowOf(name);
  const dir = `${out}/${name}`;
  if (!process.env.FORCE && !only.length && existsSync(`${dir}/frames.json`)) { console.log(name, 'kept'); continue; } rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  if (realKind && realLists) {
    const skins = JSON.parse(readFileSync(`${REAL}/${realKind}.json`, 'utf8'));
    await p.route('**/__real.json', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ lists: realLists, skins: { [realKind]: skins } }) }));
    await p.addInitScript(() => { const x = new XMLHttpRequest(); x.open('GET', '/__real.json', false); x.send(); window.__real = JSON.parse(x.responseText); });
  }
  await p.addInitScript(dilate, SLOW);
  await p.goto(BASE + url + '&h=800');
  await p.locator('[data-dht-root]').first().waitFor();
  await p.evaluate(() => { document.body.style.margin = '0'; document.body.style.overflow = 'hidden'; const bar = document.getElementById('bar'); bar.style.position = 'fixed'; bar.style.top = '-200px'; const st = bar.nextElementSibling; Object.assign(st.style, { width: '1280px', height: '800px', margin: '0', borderRadius: '0', boxShadow: 'none' }); });
  if (realKind) { await p.waitForFunction(() => window.__refreshPresets); await p.evaluate(() => window.__refreshPresets()); }
  await p.waitForTimeout(warm * 1000);
  if (prep) await prep(p);
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Page.enable'); await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW });
  await p.evaluate((k) => { window.__slowStart?.(); document.querySelectorAll('video,audio').forEach((v) => { v.playbackRate = 1 / k; }); }, SLOW);
  // grab loop: CDP screenshots as fast as the renderer allows, stamped with the mid-point of each grab
  const frames = []; let n = 0, done = false;
  const t0 = performance.now();
  const grab = (async () => {
    while (!done) {
      const a = performance.now();
      const r = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 94 });
      const file = `${String(n++).padStart(5, '0')}.jpg`; writeFileSync(`${dir}/${file}`, Buffer.from(r.data, 'base64'));
      frames.push({ file, t: ((a + performance.now()) / 2 - t0) / 1000 / SLOW });
    }
  })();
  await act(p);
  done = true; await grab;
  writeFileSync(`${dir}/frames.json`, JSON.stringify(frames));
  const span = frames.length ? frames.at(-1).t : 0;
  console.log(name, 'x' + SLOW, frames.length, 'frames', span.toFixed(2), 's virtual', ((performance.now() - t0) / 1000).toFixed(1), 's real', (frames.length / Math.max(span, 0.01)).toFixed(1), 'fps', errs.join(' | '));
  await ctx.close();
}
await b.close();
server.close();
