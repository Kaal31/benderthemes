// When the stored settings cannot be read at start (the backend does not answer in time), a change made on the defaults
// must NOT be written over the stored file. The load is retried; once it works the stored settings are merged first
// and the change made meanwhile is applied on top, then saved.
import { launch, BASE } from './browser.mjs';
import assert from 'node:assert/strict';
const b = await launch();
const p = await b.newPage({ viewport: { width: 1304, height: 890 } });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
try {
  await p.goto(BASE + '/preview/preview.html');
  await p.waitForFunction(() => window.__initSettings && window.__updateSettings);
  // the preview's backend: get_settings reads window.__previewSettings, set_settings assigns it
  await p.evaluate(() => {
    const stored = { theme: 'wii', wiiuTheme: 'Mine.utheme', userPresets: [{ id: 'my:1', name: 'Kept', look: { theme: 'ps4' } }], onboardingDone: true };
    window.__writes = [];
    window.__down = 1;
    Object.defineProperty(window, '__previewSettings', {
      configurable: true,
      get() { if (window.__down > 0) { window.__down--; throw new Error('backend not ready'); } return stored; },
      set(v) { window.__writes.push(v); },
    });
  });
  await p.evaluate(() => window.__initSettings()); // first read fails: running on defaults
  await p.evaluate(() => window.__updateSettings({ clock24: true }));
  await p.waitForTimeout(900); // longer than the save delay
  assert.deepEqual(await p.evaluate(() => window.__writes.length), 0, 'nothing is written while the stored settings were not read');
  // the retry (every 3 s) reads them
  await p.waitForFunction(() => window.__writes.length > 0, null, { timeout: 15000 });
  const w = await p.evaluate(() => window.__writes[window.__writes.length - 1]);
  assert.equal(w.wiiuTheme, 'Mine.utheme', 'the stored value survives');
  assert.equal(w.userPresets.length, 1);
  assert.equal(w.clock24, true, 'the change made meanwhile is kept');
  const s = await p.evaluate(() => window.__getThemeSettings());
  assert.equal(s.theme, 'wii');
  assert.equal(s.clock24, true);
  assert.deepEqual(errors.filter((e) => !/backend not ready/.test(e)), []);
  console.log('settings unread ok');
} finally { await b.close(); }
