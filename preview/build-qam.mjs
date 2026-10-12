// Builds preview/qam.html: the Quick Access panel with visible controls (see preview/qam.tsx).
//   node preview/build-qam.mjs   then open /preview/qam.html?theme=wiiu on the preview server
import { build } from "esbuild";
import { existsSync, readFileSync, writeFileSync } from "fs";
const r = await build({
  entryPoints: ["preview/qam.tsx"],
  bundle: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  minify: true,
  alias: { "@decky/ui": "./preview/stubs/qam-ui.tsx", "@decky/api": "./preview/stubs/api.ts" },
  define: { "process.env.NODE_ENV": '"production"' },
});
const js = r.outputFiles[0].text.replace(/<\/script/g, "<\\/script");
const p3t = existsSync("preview/zengarden.json") ? readFileSync("preview/zengarden.json", "utf8") : "null";
writeFileSync(
  "preview/qam.html",
  `<!doctype html><html><head><meta charset="utf-8"><title>Quick Access preview</title><style>html,body{margin:0;background:#0d0f13}</style></head><body><div id="root"></div><script>window.__testP3t=${p3t};window.__themeCatalog={themes:[]};</script><script>${js}</script></body></html>`,
);
console.log("preview/qam.html", (js.length / 1024).toFixed(0), "KB");
