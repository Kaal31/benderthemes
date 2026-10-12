import { launch, BASE } from './browser.mjs';
import assert from 'node:assert/strict';
// The Wii U contextual music packs ("Wii U Download Management", "Wii U Friends theme", "Wii U Settings") are the
// owner's own audio and are not in the repository, so the test registers empty stand-ins with the same names;
// only the file name the home asks the browser to play is checked.
const b = await launch();
const p = await b.newPage();
await p.addInitScript(() => { window.__audio = []; window.Audio = class { constructor(url) { window.__audio.push(url); this.volume = 0; } play() { return Promise.resolve(); } pause() {} }; });
try {
  await p.goto(BASE + '/preview/wiiu-preview.html?h=800&plaza=1');
  await p.waitForTimeout(500);
  await p.evaluate(async () => {
    const stand = (name) => ({ name, folder: name, files: ['menu_music.mp3'], mappings: {}, ignore: [] });
    window.__testPacks = [...(window.__testPacks ?? []), ...['Wii U Download Management', 'Wii U Friends theme', 'Wii U Settings'].map(stand)];
    await window.__refreshPacks();
  });
  for (const [place, pack] of [['downloads', 'Download%20Management'], ['friends', 'Friends%20theme'], ['settings', 'Settings']]) {
    await p.evaluate((place) => window.__openPlace(place), place);
    await p.waitForTimeout(400);
    const heard = await p.evaluate(() => window.__audio);
    assert(heard.some((u) => u.includes(pack) && u.includes('menu_music')), `${place}: expected ${pack} menu_music, played ${JSON.stringify(heard)}`);
  }
  console.log('PASS three contextual music tracks selected.');
} finally { await b.close(); }
