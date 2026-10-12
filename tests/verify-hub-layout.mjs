// Hub layout on the Deck screen and other sizes: every tab, neutral and themed. Checks that poster/preview pictures keep
// their aspect ratio (no cropping), nothing overflows sideways, the selected card's focus ring is not clipped by its
// scroll box, and the Hub restyles live when the Hub style changes. Screenshots: out/hub-layout/<tag>-<size>-<tab>.png
//   HUB_SHOTS=<dir> writes the screenshots elsewhere (before/after comparisons); HUB_CHECKS=0 only takes screenshots.
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';
const OUT = process.env.HUB_SHOTS || 'out/hub-layout';
const CHECK = process.env.HUB_CHECKS !== '0';
// THEME_FILES_REAL=<dir with pages.json> (see tests/verify-theme-files.mjs): real Theme files pages instead of the invented ones
const REAL = process.env.THEME_FILES_REAL && existsSync(`${process.env.THEME_FILES_REAL}/pages.json`) ? JSON.parse(readFileSync(`${process.env.THEME_FILES_REAL}/pages.json`, 'utf8')) : null;
mkdirSync(OUT, { recursive: true });
const { server, url } = await startPreviewServer();
const browser = await launch();
// frame = the 1280 x 800 stage of the preview scaled to the window (preview/main.tsx); h = stage aspect (?h=)
const SIZES = [
  { tag: 'deck', vw: 1304, vh: 870, h: 800 },          // Steam Deck 1280 x 800
  { tag: 'small', vw: 878, vh: 604, h: 800 },          // 854 x 534
  { tag: 'bigpicture', vw: 1944, vh: 1150, h: 720 },   // 16:9 TV, 1920 x 1080 (Big Picture)
];
const errors = [];
const problems = [];
const TABS = ['Discover', 'Your themes', 'Theme files', 'Plugin Spotlight'];
async function shootHub(page, name) {
  await page.waitForTimeout(500);
  await page.locator('.dht-market').screenshot({ path: `${OUT}/${name}.png` });
}
async function layoutProblems(page, label) {
  return page.evaluate((label) => {
    const out = [];
    const hub = document.querySelector('.dht-market');
    const hb = hub.getBoundingClientRect();
    // nothing sticks out sideways
    for (const el of hub.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (!r.width || getComputedStyle(el).position === 'fixed' || el.closest('.dht-hub-deco')) continue;
      if (r.right > hb.right + 1 || r.left < hb.left - 1) { out.push(`${label}: ${el.className || el.tagName} overflows sideways (${Math.round(r.left)}..${Math.round(r.right)} of ${Math.round(hb.left)}..${Math.round(hb.right)})`); break; }
    }
    // pictures keep their aspect ratio inside their box (contain), or fill a box of the same ratio (cover, < 4 % crop)
    for (const img of hub.querySelectorAll('img')) {
      if (!img.complete || !img.naturalWidth || getComputedStyle(img).display === 'none') continue;
      const r = img.getBoundingClientRect(); if (r.width < 8) continue;
      const fit = getComputedStyle(img).objectFit;
      const box = r.width / r.height, nat = img.naturalWidth / img.naturalHeight;
      const pr = img.parentElement.getBoundingClientRect();
      if (r.height > pr.height + 2 || r.width > pr.width + 2) out.push(`${label}: ${img.className || img.parentElement.className} picture larger than its box (clipped)`);
      if (fit === 'cover' && Math.abs(box / nat - 1) > 0.04) out.push(`${label}: ${img.className || img.parentElement.className} picture cropped (box ${box.toFixed(2)} vs picture ${nat.toFixed(2)})`);
    }
    // cards show all of their content (picture, title, line), nothing squashed or cut off
    for (const card of hub.querySelectorAll('.dht-hub-card, .dht-files-card, .dht-spotlight-result')) {
      if (card.scrollHeight > card.clientHeight + 2) { out.push(`${label}: ${card.className} content cut off (${card.scrollHeight} > ${card.clientHeight})`); break; }
      const art = card.querySelector('.dht-hub-art, .dht-files-art');
      if (art) { const r = art.getBoundingClientRect(); if (Math.abs(r.width / r.height - (art.classList.contains('dht-files-art') ? 16 / 9 : 16 / 10)) > 0.05) { out.push(`${label}: ${art.className} box is ${r.width.toFixed(0)}x${r.height.toFixed(0)}`); break; } }
    }
    // the selected card's ring is inside the scroll box (not clipped by overflow)
    const sel = hub.querySelector('[data-selected="true"]');
    if (sel) {
      let box = sel.parentElement; while (box && box !== hub && !/(auto|scroll|hidden)/.test(getComputedStyle(box).overflowY)) box = box.parentElement;
      if (box && box !== hub) {
        const a = sel.getBoundingClientRect(), b = box.getBoundingClientRect();
        if (a.left - b.left < 3 || b.right - a.right < 3) out.push(`${label}: selected card touches its scroll box side (ring clipped)`);
      }
    }
    return out;
  }, label);
}
async function openHub(size, query, button) {
  const page = await browser.newPage({ viewport: { width: size.vw, height: size.vh } });
  page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(r => { if (r) window.__themeSources = r; }, REAL);
  await page.addInitScript(() => { window.__inventoryFromInstalled = true; window.__testInventory = { ps3: '1', switch: 'built-in', x360: '1', xbox: '1', wii: 'built-in', wiiu: 'built-in' }; });
  await page.goto(`${url}?h=${size.h}&${query}`);
  await page.locator('[data-dht-root]').waitFor();
  await page.getByRole('button', { name: button, exact: true }).click();
  await page.locator('.dht-market').waitFor();
  return page;
}
try {
  for (const size of SIZES) {
    for (const [tag, query, button] of [['neutral', 'theme=ps3', 'Hub'], ['ps3', 'theme=ps3', 'Hub (from this home)'], ['switch', 'theme=switch', 'Hub (from this home)']]) {
      if (tag !== 'neutral' && size.tag !== 'deck') continue;
      const page = await openHub(size, query, button);
      for (const tab of TABS) {
        const btn = page.locator('.dht-hub-tabs button', { hasText: tab });
        if (!(await btn.count())) continue;
        await btn.first().click();
        await page.waitForTimeout(tab === 'Theme files' ? 1200 : 400);
        await shootHub(page, `${tag}-${size.tag}-${tab.toLowerCase().replace(/ /g, '-')}`);
        if (CHECK) problems.push(...await layoutProblems(page, `${tag} ${size.tag} ${tab}`));
      }
      await page.close();
    }
  }
  if (CHECK) {
    // live restyle: the Hub style control applies at once
    const page = await openHub(SIZES[0], 'theme=ps3', 'Hub (from this home)');
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.dht-market').getAttribute('data-hub-theme'), 'ps3');
    await page.locator('.market-style').click(); // Auto -> Neutral
    await page.waitForTimeout(200);
    assert.equal(await page.locator('.dht-market').getAttribute('data-hub-theme'), 'default', 'Neutral applies at once');
    await page.locator('.market-style').click(); // -> first installed console theme
    await page.waitForTimeout(300);
    assert.notEqual(await page.locator('.dht-market').getAttribute('data-hub-theme'), 'default', 'a fixed theme applies at once');
    // switching the home theme while the Hub is open (Auto follows it)
    await page.locator('.market-style').click(); await page.waitForTimeout(100);
    while (!/Auto/.test(await page.locator('.market-style').textContent())) { await page.locator('.market-style').click(); await page.waitForTimeout(50); }
    await page.evaluate(() => window.__updateTheme({ theme: 'xbox' }));
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.dht-market').getAttribute('data-hub-theme'), 'xbox', 'Auto follows a theme switch at once');
    await page.close();
    assert.deepEqual(errors, []);
    assert.deepEqual(problems, []);
    console.log('PASS: Hub layout (Deck, 854 x 534, Big Picture; every tab; neutral + themed) and live restyle.');
  } else console.log(`Screenshots in ${OUT}`);
} finally { await browser.close(); server.close(); }
