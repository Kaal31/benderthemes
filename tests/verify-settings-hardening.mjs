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
  assert.deepEqual(Object.keys(h.look).sort(), ['n3dsSkin', 'switchTheme'], JSON.stringify(h.look));
  assert.deepEqual(f.look, { theme: 'wii', wiiSkin: 'Night.csm', pages: { home: 'wii' } });
  assert.deepEqual(a.look, {});
  // applying the hostile preset changes only what survived the check
  await p.evaluate(() => window.__refreshPresets());
  await p.evaluate(() => window.__applyPreset('my:1'));
  const t = await p.evaluate(() => window.__getThemeSettings());
  assert.equal(t.enabled, true);
  assert.equal(t.theme, 'ps4');
  assert.equal(t.userPresets.length, 3);
  assert.equal(t.onboardingDone, true);
  assert.equal(t.switchTheme, 'Aqua.nxtheme');
  assert.equal(t.userPreset, 'my:1');
  // "Reset this theme's settings" keeps the theme package and gamer picture in use (as for the other consoles) but resets their switches
  await p.evaluate(() => window.__seedSettings({ theme: 'x360', x360: { style: 'blades', guideSide: 'left', skin: 'F8E5.pkg', gamerpic: 'Pic.pkg' }, themeFx: { 'x360:F8E5.pkg': { labels: false }, 'x360:Other.pkg': { labels: false } } }));
  await p.evaluate(() => window.__resetThemeSettings('x360'));
  const r = await p.evaluate(() => window.__getThemeSettings());
  assert.deepEqual(r.x360, { style: 'metro', guideSide: 'right', skin: 'F8E5.pkg', gamerpic: 'Pic.pkg' });
  assert.deepEqual(Object.keys(r.themeFx), ['x360:Other.pkg']);
  assert.deepEqual(errors, []);
  console.log('settings hardening ok');
} finally { await b.close(); }
