import { readFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';
import { chromium } from 'playwright';

// Exercise the production footer code with a real DOM and synthetic Steam layout.
const source = await readFile(new URL('../src/steam.ts', import.meta.url), 'utf8');
const section = source.slice(source.indexOf('const FOOT_ATTR'), source.indexOf('// ───────────── live status'));
const { code } = await transform(`
const themeHomeOwnsRoute = () => window.routeOwnsHome !== false;
const findClassModule = () => ({ FooterLegend: 'steam-footer-legend' });
const steamDocuments = () => [];
const keyboardClasses = () => ({ classes: { Keyboard: 'hashed-keyboard', VirtualKeyboardContainer: 'hashed-container' } });
const useEffect = (effect) => { window.cleanup = effect(); };
${section.replaceAll('export ', '')}
window.start = (mode) => useHiddenFooter(document, mode);
`, { loader: 'ts' });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.setContent(`<div data-dht-root style="position:fixed;inset:0"></div>
    <input id="dm"><div id="footer" style="position:fixed;bottom:0;width:100%;height:40px">
    <span class="steam-footer-legend">A Select B Back</span></div>`);
  await page.addScriptTag({ content: code });
  const footer = page.locator('#footer');
  await page.evaluate(() => window.start('hide'));
  assert.equal(await footer.evaluate(el => el.style.visibility), 'hidden');
  await page.evaluate(()=>window.routeOwnsHome=false);
  await page.waitForFunction(()=>document.querySelector('#footer').style.visibility==='');
  await page.evaluate(()=>window.routeOwnsHome=true);
  await page.waitForFunction(()=>document.querySelector('#footer').style.visibility==='hidden');
  // Focus must restore synchronously, before the keyboard even mounts.
  assert.equal(await page.evaluate(() => {
    document.querySelector('#dm').focus();
    return document.querySelector('#footer').style.visibility;
  }), '');
  await page.evaluate(() => document.querySelector('#dm').blur());
  await page.waitForFunction(() => document.querySelector('#footer').style.visibility === 'hidden');
  // Controller opens a keyboard without a focused input, inside a hidden strip.
  await page.evaluate(() => {
    const keyboard = document.createElement('div');
    keyboard.className = 'virtualkeyboard_Keyboard';
    keyboard.textContent = 'Keyboard';
    document.querySelector('#footer').append(keyboard);
  });
  await page.waitForFunction(() => document.querySelector('#footer').style.visibility === '');
  await page.evaluate(() => document.querySelector('.virtualkeyboard_Keyboard').remove());
  await page.waitForFunction(() => document.querySelector('#footer').style.visibility === 'hidden');
  // Steam pages can hide the home while keeping the hook mounted.
  await page.evaluate(() => document.querySelector('[data-dht-root]').style.display = 'none');
  await page.waitForFunction(() => document.querySelector('#footer').style.visibility === '');
  await page.evaluate(() => {
    window.cleanup();
    document.querySelector('[data-dht-root]').style.display = '';
    window.start('hints');
  });
  assert.equal(await footer.evaluate(el => el.style.display), '');
  assert.equal(await page.locator('.steam-footer-legend').evaluate(el => el.style.visibility), 'hidden');
  await page.evaluate(() => document.querySelector('#dm').focus());
  assert.equal(await page.locator('.steam-footer-legend').evaluate(el => el.style.visibility), '');
  await page.evaluate(() => { window.cleanup(); window.start('show'); });
  assert.equal(await page.locator('[data-dht-foot]').count(), 0);
  console.log('PASS: focus, controller keyboard, keyboard close, native pages, hints, show and cleanup.');
  await page.close();

  // Deck-sized landscape/touch simulation. The keyboard position deliberately
  // depends on footer layout so collapsing the footer produces measurable drift.
  await mkdir(new URL('../out/footer-keyboard/', import.meta.url), { recursive: true });
  for (const destination of ['steam-dms', 'themed-search']) {
    for (const mode of ['hide', 'hints', 'show']) {
      const deck = await browser.newPage({ viewport: { width: 1280, height: 800 }, hasTouch: true, deviceScaleFactor: 1 });
      await deck.setContent(`<style>
        body { margin:0; background:#192634; color:white; font:22px sans-serif }
        [data-dht-root],main { position:fixed;inset:0;padding:40px }
        [data-dht-root] { background:#356b18 }
        input { display:block;margin-top:30px;font:inherit;padding:14px }
        #footer { position:fixed;bottom:0;width:100%;height:40px;background:#0b141c }
        #keyboard { position:fixed;left:0;width:100%;height:300px;background:#253b4e;box-sizing:border-box;padding:20px }
        #keys { display:grid;grid-template-columns:repeat(10,1fr);gap:10px }
        button { height:65px;font:inherit;background:#425c73;color:white;border:0 }
        small { display:block;margin:20px 0;color:#c9d4dc }
      </style>
      <div data-dht-root><h1>Xbox 360 Metro · simulated themed search</h1></div>
      <main><h1>${destination === 'steam-dms' ? 'Steam DMs · simulated native page' : 'Themed store search'}</h1>
      <small>Browser fixture · 1280 × 800 touch · footer setting: ${mode}</small><input id="dm" aria-label="Message or search" placeholder="Press A / tap to type"></main>
      <div id="footer"><span class="steam-footer-legend">STEAM Menu · A Select · B Back</span></div>`);
      await deck.addScriptTag({ content: code });
      await deck.evaluate(mode => window.start(mode), mode);
      await deck.evaluate(destination => {
        if (destination === 'steam-dms') document.querySelector('[data-dht-root]').style.display = 'none';
        document.querySelector('#dm').focus();
        const kb = document.createElement('div');
        kb.id = 'keyboard'; kb.className = 'virtualkeyboard_Keyboard';
        kb.innerHTML = '<div id="keys">' + [...'QWERTYUIOPASDFGHJKLZXCVBNM'].map(k => `<button>${k}</button>`).join('') + '</div>';
        document.body.append(kb);
        window.samples = [];
        window.sampleTimer = setInterval(() => {
          // Model a keyboard positioned relative to the bottom strip's height.
          kb.style.top = `${800 - 300 - document.querySelector('#footer').getBoundingClientRect().height}px`;
          const rect = kb.getBoundingClientRect();
          window.samples.push({ top:rect.top, bottom:rect.bottom, height:rect.height });
        }, 16);
      }, destination);
      // Cross two 1500ms footer polls to catch the reported slow slide.
      await deck.waitForFunction(() => window.samples.length >= 190);
      const samples = await deck.evaluate(() => { clearInterval(window.sampleTimer); return window.samples; });
      assert.ok(samples.every(r => r.top === 460 && r.bottom === 760 && r.height === 300), `${destination}/${mode}: keyboard drifts or clips`);
      assert.equal(await deck.locator('[data-dht-foot]').count(), 0, 'footer layout released during typing');
      await deck.screenshot({ path: new URL(`../out/footer-keyboard/${destination}-${mode}.png`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1') });
      await deck.evaluate(() => { document.querySelector('#keyboard').remove(); document.querySelector('#dm').blur(); });
      if (destination === 'themed-search' && mode === 'hide') {
        await deck.waitForFunction(() => document.querySelector('#footer').style.visibility === 'hidden');
      }
      await deck.evaluate(() => window.cleanup?.());
      await deck.close();
      console.log(`PASS Deck browser simulation: ${destination}/${mode}, ${samples.length} stable keyboard samples.`);
    }
  }
} finally {
  await browser.close();
}
