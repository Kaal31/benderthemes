// Presets v2 migration: settings saved before v2 (real-looking blobs, as the plugin wrote them: presets that copy 39
// look keys) load, every saved preset becomes {id, name, base, theme, diff} and, applied, shows exactly what it
// showed before on its own look (theme file, slots, options, effects, pages). Run: node tests/verify-presets-migration.mjs
import { build } from "esbuild";
import assert from "node:assert/strict";
const code = await build({
  stdin: {
    contents: 'export * from "./src/presets"; export { seedSettings, getSettings, getRawSettings, updateSettings, cleanSettings, cleanLook, DEFAULTS } from "./src/settings"; export { lookPaths, getPath, lookIdOf, fileOf, FILE_KINDS } from "./src/lookState";',
    resolveDir: process.cwd(),
  },
  bundle: true, write: false, platform: "node", format: "esm", alias: { "@decky/api": "./preview/stubs/api.ts" },
});
globalThis.window = {};
const m = await import("data:text/javascript;base64," + Buffer.from(code.outputFiles[0].text).toString("base64"));

// A look as a v1.10 preset stored it: every look key, copied (other looks' records included).
const common = {
  pages: {}, iconPicks: {}, themeOptions: { ps4: { clock24: true } }, styles: { iisu: { scheme: "dark" }, ps2: { rows: 2 } },
  packs: { ps2: "PS2 System Sounds" }, musicPacks: {}, music: { ps3: false, psp: false, x360: false }, wallpapers: {}, wallpaperDim: 25,
  coverStyles: {}, titles: {}, iconSizes: {}, videoBackgrounds: {}, ps4GameBackgrounds: true, castleWeather: false, castleWindows: "replace",
  minecraftFollowFocus: true, minecraftWaitForSwipe: false, minecraftSlim: false, hubStyle: "auto", mix: {},
  vita: { collectionFolders: true, systemBubbles: true, art: "portrait", skin: "", look: "", bubbleStyle: "lens", stockIcons: "image", artEdge: "blend", motion: true, sway: "gentle", gyro: true, focus: "vita", touch: true, lock: "off" },
  xmb: { ps3Color: -1, pspColor: -1, collectionFolders: true, p3t: "", psp: "", pspAccurate: false, pspSize: "auto" },
  x360: { style: "metro", guideSide: "right" },
  dial: { look: "classic", motion: "rotate", activation: "on-browse", reflections: true, projectionLight: true, floatingCover: true, sound: "reference" },
  themeFx: {}, wiiuView: "grid", wiiuTheme: "", xboxSkin: "", wiiSkin: "", switchTheme: "", wiiuPlazaTips: true, wiiuPlazaPositions: {},
  n3dsSkin: "", n3dsCursor: "3ds", n3dsTop: "show", n3dsLayout: { rows: 3, slots: {}, folders: [], next: 1, collections: true },
};
const look = (patch) => JSON.parse(JSON.stringify({ ...common, ...patch }));
const OLD = {
  version: 1, theme: "ps3", activeTheme: "", enabled: true, clock24: false, sfxVolume: 60, onboardingDone: true, keyboardSkin: true,
  ...look({ xmb: { ...common.xmb, p3t: "ZenGarden.p3t", ps3Color: 4 }, themeFx: { "p3t:ZenGarden.p3t": { ...{ icons: true, background: true }, slideSec: 20, glowCat: 40 } } }),
  userPreset: "my:2",
  userPresets: [
    // a PS3 .p3t theme file with tuned effects, a month colour and its pages (saved from a theme-file preset: activeTheme "")
    { id: "my:1", name: "Zen evenings", look: look({ theme: "ps3", activeTheme: "", pages: { store: "ps4" }, xmb: { ...common.xmb, p3t: "ZenGarden.p3t", ps3Color: 9 }, themeFx: { "p3t:ZenGarden.p3t": { slideSec: 30, fadeMs: 2500, kenBurns: false, glowItem: 150 }, "psp:Other.ptf": { wave: false } }, music: { ps3: true, psp: false, x360: false } }) },
    // Wii U with a .utheme, Plaza view, Miis placed by hand and a Mix-and-match slot (data theme's music)
    { id: "my:2", name: "Plaza night", look: look({ theme: "wiiu", activeTheme: "wiiu", wiiuTheme: "Splatoon.utheme", wiiuView: "plaza", wiiuPlazaPositions: { "1003": { x: 4.5, z: -2 } }, wiiuPlazaTips: false, styles: { wiiu: { posts: "off", crowd: "large" }, iisu: { scheme: "dark" } }, themeFx: { "wiiu:Splatoon.utheme": { icons: false } }, mix: { wiiu: { music: "midnight-ps4", wallpaper: "none" } }, shortcutButtons: true }) },
    // Xbox 360 NXE era with a theme package, the guide on the left, a folder wallpaper and game titles hidden
    { id: "my:3", name: "NXE orange", look: look({ theme: "x360", activeTheme: "x360:nxe", x360: { style: "nxe", guideSide: "left", skin: "F8E5B41D0000", gamerpic: "Pic.pkg" }, wallpapers: { x360: "orange.jpg" }, titles: { x360: "selected" }, themeFx: { "x360:F8E5B41D0000": { labels: false } } }) },
    // PS Vita Sakura with a custom theme, bubble style and per-theme standard options (Vita folders must stay the user's)
    { id: "my:4", name: "Pink bubbles", look: look({ theme: "vita", activeTheme: "vita-look:sakura", vita: { ...common.vita, look: "sakura", skin: "Persona4.zip", bubbleStyle: "glass", sway: "lively", folders: [{ id: "x", name: "X", apps: [1], color: "#fff" }] }, themeOptions: { vita: { clockShown: false, bgBrightness: 70 } }, iconSizes: { vita: 85 } }) },
    // 3DS with a theme file and an arranged home (folders, a badge)
    { id: "my:5", name: "3DS arranged", look: look({ theme: "n3ds", activeTheme: "n3ds", n3dsSkin: "Cherry.zip", n3dsCursor: "simple", n3dsLayout: { rows: 4, slots: { "0": { f: "f1" }, "5": { b: "set/star.png", w: 2 } }, folders: [{ id: "f1", name: "RPG", rows: 2, slots: { "0": { g: 1003 } } }], next: 2, collections: false } }) },
    // a community data theme (registered by the engine after the settings load) with icons picked one by one
    { id: "my:6", name: "Midnight", look: look({ theme: "ps4", activeTheme: "midnight-ps4", iconPicks: { ps4: { store: "midnight-ps4/moon" } }, ps4GameBackgrounds: false, mix: { "midnight-ps4": { sounds: "x360:metro" } } }) },
    // Alien Dial and PS4 with every option changed
    { id: "my:7", name: "Crimson dial", look: look({ theme: "dial", activeTheme: "dial", dial: { ...common.dial, look: "crimson", motions: ["pulse", "hologram"], sound: "pack" }, packs: { dial: "DHT Alien Dial" } }) },
    // PS2 with the box art shape option and the in-theme store's sections (both added on 2026-10-12)
    { id: "my:8", name: "PS2 boxes", look: look({ theme: "ps2", activeTheme: "ps2", styles: { ps2: { boxArt: "portrait" } }, storeSections: { ps2: { themes: true, plugins: true }, ps4: { themes: true } } }) },
  ],
};
m.seedSettings(OLD);
const s = m.getRawSettings();
assert.equal(s.version, 2);
assert.equal(s.userPresets.length, 8, "every saved preset is kept");
assert.equal(s.keyboardSkin, true, "the keyboard skin switch (global, not part of a preset) is kept");
const by = Object.fromEntries(s.userPresets.map((u) => [u.id, u]));
for (const u of s.userPresets) {
  assert.equal(u.look, undefined, `${u.id}: the copy of every look is gone`);
  assert.equal(typeof u.base, "string");
  assert.ok(JSON.stringify(u.diff).length < JSON.stringify(OLD.userPresets.find((o) => o.id === u.id).look).length / 2, `${u.id}: only differences are stored`);
}
assert.deepEqual([by["my:1"].base, by["my:2"].base, by["my:3"].base, by["my:4"].base, by["my:5"].base, by["my:6"].base, by["my:7"].base, by["my:8"].base], ["ps3", "wiiu", "x360:nxe", "vita-look:sakura", "n3ds", "midnight-ps4", "dial", "ps2"]);
assert.deepEqual(by["my:8"].diff, { styles: { ps2: { boxArt: "portrait" } }, packs: { ps2: "PS2 System Sounds" }, storeSections: { ps2: { themes: true, plugins: true } } }, "PS2 box art and store sections belong to the PS2 preset");
assert.equal(by["my:6"].theme, "ps4", "a data theme not loaded yet keeps the layout it was saved with");
assert.equal(by["my:1"].name, "Zen evenings");
// what each preset stores
assert.deepEqual(by["my:1"].diff.xmb, { p3t: "ZenGarden.p3t", ps3Color: 9 });
assert.deepEqual(by["my:1"].diff.themeFx, { "p3t:ZenGarden.p3t": { slideSec: 30, fadeMs: 2500, kenBurns: false, glowItem: 150 } }, "only this file's own effects, as differences");
assert.deepEqual(by["my:1"].diff.music, { ps3: true });
assert.equal(by["my:1"].diff.styles, undefined, "other looks' options are not part of a PS3 preset");
assert.deepEqual(by["my:2"].diff.mix, { wiiu: { music: "midnight-ps4", wallpaper: "none" } });
assert.deepEqual(by["my:3"].diff.x360, { guideSide: "left", skin: "F8E5B41D0000", gamerpic: "Pic.pkg" });
assert.equal(by["my:4"].diff.vita.folders, undefined, "Vita folders are the user's library");
assert.deepEqual(by["my:5"].diff.n3dsLayout.folders[0].name, "RPG");

// Applying a migrated preset shows on its own look exactly what the old preset showed.
const legacyApply = (old) => m.cleanSettings({ ...m.getRawSettings(), ...m.cleanLook(old) });
for (const old of OLD.userPresets) {
  m.seedSettings(OLD);
  const expect = legacyApply(old.look);
  const p = m.getPresets().find((x) => x.id === old.id) ?? { id: old.id, look: by[old.id].base, theme: by[old.id].theme, origin: "saved", file: "", label: old.name, company: "Community", dataTheme: "", user: m.getRawSettings().userPresets.find((u) => u.id === old.id) };
  m.applyPreset(p);
  const got = m.getRawSettings();
  assert.equal(got.theme, expect.theme, old.id);
  // (a community data theme is only known once the engine lists it, which this test does not do)
  if (old.id !== "my:6") assert.equal(m.currentPresetId(got), old.id, `${old.id} is the preset in use`);
  const layout = got.theme;
  for (const path of m.lookPaths(p.look, m.fileOf(got, layout), layout)) {
    const a = m.getPath(got, path), b = m.getPath(expect, path);
    if (path[0] === "vita") continue; // compared below without the folders
    if (path[0] === "themeFx") {
      assert.deepEqual(a ?? {}, b ?? a ?? {}, `${old.id} ${path.join(".")}`);
      continue;
    }
    if (path[0] === "mix" && b && Object.keys(b).length === 0) continue;
    assert.deepEqual(a ?? null, b ?? a ?? null, `${old.id} ${path.join(".")}`);
  }
  if (layout === "vita") {
    const { folders: _f, order: _o, ...va } = got.vita, { folders: _g, order: _p, ...vb } = expect.vita;
    assert.deepEqual(va, vb);
    assert.deepEqual(got.vita.folders, OLD.vita?.folders ?? m.DEFAULTS.vita.folders, "the user's folders stay");
  }
  // the user's own preferences are untouched
  assert.equal(got.clock24, false);
  assert.equal(got.sfxVolume, 60);
  assert.equal(got.keyboardSkin, true);
}
m.seedSettings(OLD);
m.applyPreset(m.getPresets().find((x) => x.id === "my:8"));
assert.equal(m.getRawSettings().styles.ps2.boxArt, "portrait");
assert.deepEqual(m.getRawSettings().storeSections.ps2, { themes: true, plugins: true });
// the live settings of the look on screen at migration (PS3 with ZenGarden, month 4) are kept as that preset's start
m.seedSettings(OLD);
m.updateSettings({ userPreset: "" });
m.applyPreset(m.getPresets().find((x) => x.id === "ps3:ZenGarden.p3t") ?? { id: "ps3:ZenGarden.p3t", look: "ps3", theme: "ps3", origin: "file", file: "ZenGarden.p3t", label: "", company: "Sony", dataTheme: "ps3" });
assert.equal(m.getRawSettings().xmb.ps3Color, 4, "the month colour chosen before v2 stays");
assert.equal(m.getRawSettings().themeFx["p3t:ZenGarden.p3t"].slideSec, 20, "the file's effects chosen before v2 stay");
// a second load of migrated settings changes nothing
const once = JSON.stringify(m.getRawSettings().userPresets);
m.seedSettings(JSON.parse(JSON.stringify(m.getRawSettings())));
assert.equal(JSON.stringify(m.getRawSettings().userPresets), once, "migration runs once");
console.log("PASS presets migration: 8 real-looking v1 presets load as v2 {base, diff}, keep their look exactly, user preferences and Vita folders stay, migration is idempotent");
