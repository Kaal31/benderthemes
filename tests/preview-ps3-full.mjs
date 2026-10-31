import { build } from "esbuild";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { startPreviewServer } from "../preview/server.mjs";

const bundle = await build({ stdin: { contents: `import {setSkinOverride} from './src/skins';setSkinOverride({p3t:()=>window.__importedSkin});await import('./preview/main');`, resolveDir: process.cwd(), loader: "tsx" }, bundle: true, write: false, format: "esm", jsx: "automatic", alias: { "@decky/ui": "./preview/stubs/ui.tsx", "@decky/api": "./preview/stubs/api.ts" }, define: { "process.env.NODE_ENV": '"production"' } });
const upstream = await startPreviewServer();
const themes = { evangelion: "Evangelion Snow", "heavy-rain": "Heavy Rain", miku: "Hatsune Miku", scarface: "Scarface", lbp: "LBP Dynamic V2 + Sounds", ps2: "PlayStation 2 Dynamic · original layers", batman: "Batman Arkham City", sly: "Sly 4 Thieves in Time", fallout: "Fallout New Vegas" };
const html = `<!doctype html><meta charset="utf-8"><title>PS3 · Full imported theme</title><style>body{margin:0;background:#0b101b;color:white;font:15px system-ui}header{padding:14px 22px;display:flex;align-items:center;gap:24px;flex-wrap:wrap}h1{font-size:19px;margin:0}label{display:flex;gap:7px}iframe{width:100%;height:calc(100vh - 90px);border:0}small{color:#b9c9e0}</style><header><h1>PS3 · Evangelion Snow · Full XMB</h1><label><input id="bg" type="checkbox" checked>Theme background</label><label><input id="fx" type="checkbox" checked>Animated effects</label><label><input id="anim" type="checkbox" checked>Animate</label><small>Click preview · Arrow keys / Enter / Escape · Imported icons + live RAF</small></header><iframe src="/app?p3t=evangelion.p3t" title="Full PS3 XMB"></iframe><script>function apply(){const win=document.querySelector('iframe').contentWindow;if(!win.__getThemeSettings)return;const settings=win.__getThemeSettings();win.__updateTheme({animations:document.querySelector('#anim').checked,styles:{...settings.styles,ps3:{...settings.styles?.ps3,themeBackground:document.querySelector('#bg').checked,themeEffects:document.querySelector('#fx').checked}});}for(const input of document.querySelectorAll('input'))input.onchange=apply;</script>`;
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const requested = new URL(request.url, 'http://localhost').searchParams.get('import') || 'evangelion';
  const theme = Object.hasOwn(themes, requested) ? requested : 'evangelion';
  const importedSkin = () => { const skin = JSON.parse(readFileSync(`out/ps3-layer-test/${theme}-skin.json`, 'utf8')); skin.rafScene = `/scene.json?import=${theme}`; return JSON.stringify(skin).replaceAll('</script', '<\\/script'); };
  response.setHeader('Cache-Control','no-store');
  if (pathname === '/') { response.setHeader('Content-Type','text/html; charset=utf-8');response.end(html.replace('PS3 · Evangelion Snow · Full XMB</h1>', `PS3 · Imported themes</h1><select onchange="document.querySelector('iframe').src='/app?import='+this.value+'&p3t='+this.value+'.p3t'">${Object.entries(themes).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select>`)); }
  else if (pathname === '/app') { response.setHeader('Content-Type','text/html; charset=utf-8');response.end(`<body style="margin:0"><div id="root"></div><script>window.__themePreview='ps3';window.__isThemePreview=true;window.__themeCatalog={themes:[]};window.__testInventory={ps3:'preview'};window.__importedSkin=${importedSkin()};</script><script type="module" src="/app.js"></script>`); }
  else if (pathname === '/app.js') { response.setHeader('Content-Type','text/javascript');response.end(bundle.outputFiles[0].text); }
  else if (pathname === '/scene.json') { response.setHeader('Content-Type','application/json');response.end(readFileSync(`out/ps3-layer-test/${theme}-scene.json`)); }
  else { try { const result=await fetch(new URL(request.url,upstream.url));response.statusCode=result.status;response.setHeader('Content-Type',result.headers.get('content-type')||'application/octet-stream');response.end(Buffer.from(await result.arrayBuffer())); } catch {response.statusCode=502;response.end();} }
});
server.listen(8789,'127.0.0.1',()=>console.log('Full PS3 imported preview: http://127.0.0.1:8789/'));
