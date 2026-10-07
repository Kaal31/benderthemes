// Builds preview.html: every theme running in a normal browser with sample games.
import { build } from "esbuild";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
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
// personal builds: bundled wallpapers (./bundle/wallpapers) show up in the preview too
const walls = {};
if (existsSync("bundle/wallpapers/aero-background.jpg")) walls["aero-background.jpg"] = "data:image/jpeg;base64," + readFileSync("bundle/wallpapers/aero-background.jpg").toString("base64");
const assets = {};
for (const root of ["assets", "bundle/assets"]) {
  if (!existsSync(root)) continue;
  for (const set of readdirSync(root)) {
    assets[set] = assets[set] ?? {};
    for (const f of readdirSync(`${root}/${set}`)) if (/\.(png|webp)$/i.test(f)) assets[set][f.replace(/\.(png|webp)$/i, "")] = `data:image/${f.endsWith("webp")?"webp":"png"};base64,` + readFileSync(`${root}/${set}/${f}`).toString("base64");
  }
}
const dialAssets = {};
if (existsSync("bundle/dial")) for (const file of readdirSync("bundle/dial")) {
  if (!/\.wav$/.test(file)) continue;
  dialAssets[file] = "data:"+(file.endsWith("glb")?"model/gltf-binary":"audio/wav")+";base64,"+readFileSync(`bundle/dial/${file}`).toString("base64");
}
const republicPack=JSON.parse(readFileSync("bundle/sounds/DHT Verified Republic/pack.json","utf8"));
republicPack.folder="DHT Verified Republic";republicPack.files=readdirSync("bundle/sounds/DHT Verified Republic");
const castleAudio = {};
for(const file of readdirSync("bundle/sounds/DHT Verified SAO")) if(file.endsWith(".wav")) castleAudio[file]="data:audio/wav;base64,"+readFileSync(`bundle/sounds/DHT Verified SAO/${file}`).toString("base64");
const bladesAudio = {};
for(const file of readdirSync("bundle/sounds/DHT Verified MC360 Blades 1.7.2")) if(file.endsWith(".wav")) bladesAudio[file]="data:audio/wav;base64,"+readFileSync(`bundle/sounds/DHT Verified MC360 Blades 1.7.2/${file}`).toString("base64");
const p3t = existsSync("preview/zengarden.json") ? JSON.parse(readFileSync("preview/zengarden.json","utf8")) : null;
const suppliedPacks=["Minecraft Console Legacy","windows xp sounds","DHT Nazarick Music","DHT Floating Castle Music","DHT Six Paths Music"].map(folder=>({...JSON.parse(readFileSync(`bundle/sounds/${folder}/pack.json`,"utf8")),folder,files:readdirSync(`bundle/sounds/${folder}`),mappings:JSON.parse(readFileSync(`bundle/sounds/${folder}/pack.json`,"utf8")).mappings??{}}));
const wallJs = `window.__testPacks=[${JSON.stringify(republicPack)},${suppliedPacks.map(p=>JSON.stringify(p)).join(",")}];window.__castleAudio=${JSON.stringify(castleAudio)};window.__bladesAudio=${JSON.stringify(bladesAudio)};window.__testP3t=${JSON.stringify(p3t)};window.__dialAssets=${JSON.stringify(dialAssets)};window.__testWalls=${JSON.stringify(walls)};window.__testAssets=${JSON.stringify(assets)};`;
writeFileSync(
  "preview/preview.html",
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Deck Home Themes preview</title><style>html,body{margin:0;background:#0d0f13}</style></head><body><div id="root"></div><script>${wallJs}</script><script>${js}</script></body></html>`,
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
    if (existsSync(path)) art[kind] = ["data:image/"+(file.endsWith("png")?"png":"jpeg")+";base64,"+readFileSync(path).toString("base64")];
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
