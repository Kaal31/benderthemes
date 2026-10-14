// Builds preview.html: every theme running in a normal browser with sample games.
import { build } from "esbuild";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { execFileSync } from "node:child_process";
if (existsSync("bundle")) execFileSync(process.env.PYTHON || "python", ["tools/package_themes.py"], { stdio: "inherit" });
const r = await build({
  entryPoints: ["preview/main.tsx"],
  bundle: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  minify: true,
  alias: { "@decky/ui": "./preview/stubs/ui.tsx", "@decky/api": "./preview/stubs/api.ts" },
  define: { "process.env.NODE_ENV": '"production"' },
});
const js = r.outputFiles[0].text.replace(/<\/script/g, "<\\/script");
const previewCatalog = JSON.parse(readFileSync(existsSync("theme-catalog.json") ? "theme-catalog.json" : "asset-catalog.json", "utf8"));
previewCatalog.themes = previewCatalog.themes.map((pack, i) => ({ ...pack, compatible: true, installedVersion: i < 3 ? pack.version : undefined, preview: `../out/theme-previews/${pack.id}.gif`, poster: `../out/theme-previews/${pack.id}.jpg` }));
// personal builds: bundled wallpapers (./bundle/wallpapers) show up in the preview too
const walls = {};
if (existsSync("bundle/wallpapers/aero-background.jpg")) walls["aero-background.jpg"] = "../bundle/wallpapers/aero-background.jpg";
const assets = {};
for (const root of ["assets", "bundle/assets", "defaults/assets"]) {
  if (!existsSync(root)) continue;
  for (const set of readdirSync(root)) {
    assets[set] = assets[set] ?? {};
    // PREVIEW_JPG_ASSETS=1: also .jpg / .gif, as the plugin's get_assets reads them (main.py IMAGE_EXT); off by default because
    // the preview serves them as plain URLs, and the 3D dashboards (Xbox 360 NXE / Kinect) then can't use them as WebGL textures
    // from a file:// page (verify-launch-audio). Presets v2's mixing sheets were shot with it on (Hub .jpg backgrounds).
    const ext = process.env.PREVIEW_JPG_ASSETS ? /\.(png|webp|jpe?g|gif|mp4)$/i : /\.(png|webp|mp4)$/i;
    for (const f of readdirSync(`${root}/${set}`)) if (ext.test(f)) assets[set][f.replace(ext, "")] = `../${root}/${set}/${f}`;
  }
}
const dialAssets = {};
if (existsSync("bundle/dial")) for (const file of readdirSync("bundle/dial")) {
  if (!/\.wav$/.test(file)) continue;
  dialAssets[file] = "data:"+(file.endsWith("glb")?"model/gltf-binary":"audio/wav")+";base64,"+readFileSync(`bundle/dial/${file}`).toString("base64");
}
// sound folders are optional, so the preview still builds from a source-only checkout
const soundPack = (folder) => existsSync(`bundle/sounds/${folder}/pack.json`) ? { ...JSON.parse(readFileSync(`bundle/sounds/${folder}/pack.json`, "utf8")), folder, files: readdirSync(`bundle/sounds/${folder}`) } : null;
const wavs = (folder) => existsSync(`bundle/sounds/${folder}`) ? Object.fromEntries(readdirSync(`bundle/sounds/${folder}`).filter((f) => f.endsWith(".wav")).map((f) => [f, "data:audio/wav;base64," + readFileSync(`bundle/sounds/${folder}/${f}`).toString("base64")])) : {};
const republicPack = soundPack("DHT Verified Republic");
const castleAudio = wavs("DHT Verified SAO");
const bladesAudio = wavs("DHT Verified MC360 Blades 1.7.2");
const p3t = existsSync("preview/zengarden.json") ? JSON.parse(readFileSync("preview/zengarden.json","utf8")) : null;
const suppliedPacks=["Minecraft Console Legacy","windows xp sounds","DHT Nazarick Music","DHT Floating Castle Music","DHT Six Paths Music"].map(soundPack).filter(Boolean).map(p=>({...p,mappings:p.mappings??{}}));
// data themes (themes/<id>/theme.json), listed the way py_modules/data_themes.py lists them
const AUDIO = /\.(wav|mp3|ogg|oga|flac|m4a|opus)$/i;
const dataThemes = existsSync("themes") ? readdirSync("themes").filter((d) => existsSync(`themes/${d}/theme.json`)).map((d) => {
  const m = JSON.parse(readFileSync(`themes/${d}/theme.json`, "utf8"));
  const packs = {};
  for (const slot of ["sounds", "music"]) {
    const rel = m.slots?.[slot];
    if (rel && existsSync(`themes/${d}/${rel}`)) packs[slot] = { files: readdirSync(`themes/${d}/${rel}`).filter((f) => AUDIO.test(f)).sort(), mappings: {}, ignore: [] };
  }
  // the same as py_modules/data_themes.py: _icons
  const iconRel = m.slots?.icons;
  const icons = iconRel && existsSync(`themes/${d}/${iconRel}`) ? Object.fromEntries(readdirSync(`themes/${d}/${iconRel}`).filter((f) => /^[a-z0-9][a-z0-9-]{0,40}\.(png|svg|webp|gif)$/i.test(f)).sort().map((f) => [f.replace(/\.[^.]+$/, ""), `${iconRel}/${f}`])) : undefined;
  return { ...m, source: "bundled", packs, ...(icons ? { icons } : {}) };
}) : [];
const wallJs = `window.__dataThemes={base:location.origin+"/themes",wrap:location.origin+"/frame-wrap",themes:${JSON.stringify(dataThemes)}};window.__testPacks=[${[republicPack, ...suppliedPacks].filter(Boolean).map(p=>JSON.stringify(p)).join(",")}];window.__castleAudio=${JSON.stringify(castleAudio)};window.__bladesAudio=${JSON.stringify(bladesAudio)};window.__testP3t=${JSON.stringify(p3t)};window.__dialAssets=${JSON.stringify(dialAssets)};window.__testWalls=${JSON.stringify(walls)};window.__testAssets=${JSON.stringify(assets)};`;
writeFileSync(
  "preview/preview.html",
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Deck Home Themes preview</title><style>html,body{margin:0;background:#0d0f13}</style></head><body><div id="root"></div><script>window.__themeCatalog=${JSON.stringify(previewCatalog)};window.__isThemePreview=true;</script><script>${wallJs}</script><script>${js}</script></body></html>`,
);
console.log("preview/preview.html", (js.length / 1024).toFixed(0), "KB");

// Self-contained reference previews: game artwork is demo-only, never part of the plugin.
const referenceGames = {
  "Baldur’s Gate 3":1086940,"DOOM Eternal":782330,"Persona 5 Royal":1687950,"Red Dead Redemption 2":1174180,
  "STAR WARS Jedi: Survivor":1774580,"STAR WARS Battlefront II":1237950,"SWORD ART ONLINE Fractured Daydream":1858630,
  "Cyberpunk 2077":1091500,"The Witcher 3":292030,"Portal 2":620,"Grand Theft Auto V":271590,
  "Elden Ring":1245620,"Hollow Knight":367520,
  "Hades":1145360,"Stardew Valley":413150,"Balatro":2379780,
};
const referenceArt = {};
for (const [name,id] of Object.entries(referenceGames)) {
  const art = {};
  for (const [kind,file] of Object.entries({portrait:"library_600x900.jpg",landscape:"header.jpg",hero:"library_hero.jpg",logo:"logo.png"})) {
    const path = `preview/art/${id}-${file}`;
    if (existsSync(path)) art[kind] = [`./art/${id}-${file}`];
  }
  referenceArt[name] = art;
}
for (const [theme,names] of Object.entries({
  republic:["STAR WARS Jedi: Survivor","STAR WARS Battlefront II","Elden Ring","Cyberpunk 2077","Hades","Balatro","Hollow Knight"],
  castle:["SWORD ART ONLINE Fractured Daydream","Elden Ring","Hades","Hollow Knight","Stardew Valley","Balatro"],
  dial:["Cyberpunk 2077","The Witcher 3","Portal 2","Grand Theft Auto V","Red Dead Redemption 2","Elden Ring","Hollow Knight"],
  nazarick:["Elden Ring","Baldur’s Gate 3","Hades","Hollow Knight","DOOM Eternal","The Witcher 3","Cyberpunk 2077"],
  pain:["Elden Ring","Baldur’s Gate 3","Hades","Hollow Knight","Cyberpunk 2077","DOOM Eternal","Stardew Valley","Red Dead Redemption 2","The Witcher 3","Persona 5 Royal"],
  aero2:["Cyberpunk 2077","Hades","Stardew Valley","Elden Ring","Balatro","Hollow Knight"],
  aero:["Cyberpunk 2077","Hades","Stardew Valley","Elden Ring","Balatro","Hollow Knight"],
})) {
  const init = `window.__themePreview=${JSON.stringify(theme)};window.__referenceTitles=${JSON.stringify(names)};window.__referenceArt=${JSON.stringify(referenceArt)};`;
  const html = readFileSync("preview/preview.html","utf8").replace("<script>",`<script>${init}</script><script>`).replace("<title>Deck Home Themes preview</title>",`<title>${theme === "dial" ? "Alien Dial" : theme === "castle" ? "Floating Castle" : theme === "republic" ? "Galactic Republic" : "Aero"} - preview</title>`);
  writeFileSync(`preview/${theme}-preview.html`,html);
}


const allTitles=["Cyberpunk 2077","Hades","Elden Ring","Hollow Knight","Stardew Valley","Balatro","Baldur’s Gate 3","DOOM Eternal","Persona 5 Royal","The Witcher 3","Portal 2","Red Dead Redemption 2","Grand Theft Auto V","STAR WARS Jedi: Survivor","STAR WARS Battlefront II","SWORD ART ONLINE Fractured Daydream"];
const baseHtml=readFileSync("preview/preview.html","utf8");
const defaultInit=`window.__referenceTitles=${JSON.stringify(allTitles)};window.__referenceArt=${JSON.stringify(referenceArt)};`;
writeFileSync("preview/preview.html",baseHtml.replace("<script>",`<script>${defaultInit}</script><script>`));
const mcInit=`window.__themePreview="minecraft";window.__referenceTitles=${JSON.stringify(allTitles.slice(0,5))};window.__referenceArt=${JSON.stringify(referenceArt)};`;
writeFileSync("preview/minecraft-preview.html",baseHtml.replace("<script>",`<script>${mcInit}</script><script>`));
// Wii U page used by tests/verify-wara-plaza.mjs, verify-wiiu-intro.mjs and friends (?plaza=1 opens the Plaza)
writeFileSync("preview/wiiu-preview.html",baseHtml.replace("<script>",`<script>window.__themePreview="wiiu";${defaultInit}</script><script>`));
writeFileSync("preview/wii-preview.html",baseHtml.replace("<script>",`<script>window.__themePreview="wii";${defaultInit}</script><script>`));

// Steam on-screen keyboard mock with the keyboard skins (preview/keyboard.ts, tests/verify-keyboard-skins.mjs)
{
  const kb = await build({ entryPoints: ["preview/keyboard.ts"], bundle: true, write: false, format: "iife", minify: true,
    alias: { "@decky/ui": "./preview/stubs/ui.tsx", "@decky/api": "./preview/stubs/api.ts" }, define: { "process.env.NODE_ENV": '"production"' } });
  writeFileSync("preview/keyboard.html", `<!doctype html><html><head><meta charset="utf-8"><title>Keyboard skins preview</title><style>html,body{margin:0;width:1280px;height:800px;background:#1b2838 linear-gradient(160deg,#2a475e,#171a21)}</style></head><body><script>window.__isThemePreview=true;</script><script>${kb.outputFiles[0].text.replace(/<\/script/g, "<\\/script")}</script></body></html>`);
  console.log("preview/keyboard.html");
}
