// A user preset's saved look is data from a file: a damaged or hand-edited one must not be able to set keys outside the
// look (enabled, userPresets, onboardingDone ...), give the home an unknown theme or a value of the wrong type,
// neither when settings load nor when the preset is applied.
import { launch, BASE } from './browser.mjs';
import assert from 'node:assert/strict';
const b = await launch();
const p = await b.newPage({ viewport: { width: 1304, height: 890 } });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
try {
  await p.goto(BASE + '/preview/preview.html');
  await p.waitForFunction(() => window.__seedSettings && window.__getThemeSettings);
  await p.evaluate(() => window.__seedSettings({
    theme: 'ps4', enabled: true, xmb: { p3t: 5 }, vita: { skin: {} },
    userPresets: [
      { id: 'my:1', name: 'Hostile', look: { theme: 'nope', activeTheme: 'x'.repeat(200), enabled: false, onboardingDone: false, userPresets: [], pages: [1, 2], wiiuTheme: 7, switchTheme: 'Aqua.nxtheme', wallpaperDim: 'high', hubStyle: 'x'.repeat(400), vita: 'str', n3dsSkin: 'Cherry' } },
      { id: 'my:2', name: 'Fine', look: { theme: 'wii', wiiSkin: 'Night.csm', pages: { home: 'wii' } } },
      { id: 'my:3', name: 'Not an object', look: 'oops' },
      { id: 'my:4', name: 'Array', look: [1] },
      { id: 'my:2', name: 'Duplicate id', look: {} },
    ],
  }));
  const s = await p.evaluate(() => window.__getThemeSettings());
  assert.equal(s.xmb.p3t, '');
  assert.equal(s.vita.skin, '');
  assert.equal(s.userPresets.length, 3); // the duplicate id and the preset whose look is not an object are dropped
  const [h, f, a] = s.userPresets;
  // presets saved before v2 are migrated to {id, name, base, theme, diff}: a preset belongs to one look and keeps only
  // its differences from that look's defaults. The hostile one has no valid theme: it belongs to the theme on screen
  // (PS4), so the Switch / 3DS theme files it named are not part of it.
  assert.equal(h.base, 'ps4');
  assert.deepEqual(h.diff, {}, JSON.stringify(h.diff));
  assert.equal(f.base, 'wii');
  assert.deepEqual(f.diff, { wiiSkin: 'Night.csm', pages: { home: 'wii' } });
  assert.equal(a.base, 'ps4');
  assert.deepEqual(a.diff, {});
  for (const u of s.userPresets) assert.equal(u.look, undefined, 'the old copy of every look is gone');
  // applying the hostile preset changes only what survived the check
  await p.evaluate(() => window.__refreshPresets());
  await p.evaluate(() => window.__applyPreset('my:1'));
  const t = await p.evaluate(() => window.__getThemeSettings());
  assert.equal(t.enabled, true);
  assert.equal(t.theme, 'ps4');
  assert.equal(t.userPresets.filter((u) => u.id.startsWith('my:')).length, 3);
  assert.equal(t.onboardingDone, true);
  assert.equal(t.userPreset, 'my:1');
  // a stored state that was edited by hand can only set values of the right type
  await p.evaluate(() => window.__seedSettings({ theme: 'ps4', userPresets: [{ id: 'my:5', name: 'Edited', base: 'wii', theme: 'wii', diff: { wiiSkin: 7, enabled: false, styles: { wii: { a: 1 } }, pages: 'x' } }] }));
  await p.evaluate(() => window.__applyPreset('my:5'));
  const e = await p.evaluate(() => window.__getThemeSettings());
  assert.equal(e.theme, 'wii');
  assert.equal(e.enabled, true);
  assert.equal(e.wiiSkin, '');
  assert.deepEqual(e.pages, {});
  assert.deepEqual(e.styles.wii, { a: 1 });
  // "Reset this theme's settings" keeps the theme package and gamer picture in use (as for the other consoles) but resets their switches
  await p.evaluate(() => window.__seedSettings({ theme: 'x360', x360: { style: 'blades', guideSide: 'left', skin: 'F8E5.pkg', gamerpic: 'Pic.pkg' }, themeFx: { 'x360:F8E5.pkg': { labels: false }, 'x360:Other.pkg': { labels: false } } }));
  await p.evaluate(() => window.__resetThemeSettings('x360'));
  const r = await p.evaluate(() => window.__getThemeSettings());
  assert.deepEqual(r.x360, { style: 'metro', guideSide: 'right', skin: 'F8E5.pkg', gamerpic: 'Pic.pkg' });
  assert.deepEqual(Object.keys(r.themeFx), ['x360:Other.pkg']);
  assert.deepEqual(errors, []);
  console.log('settings hardening ok');
} finally { await b.close(); }
