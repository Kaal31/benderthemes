import { build } from 'esbuild';
import { writeFileSync } from 'node:fs';
import { startPreviewServer } from '../preview/server.mjs';
const result = await build({ entryPoints: ['preview/community-updates.tsx'], bundle: true, write: false, format: 'iife', jsx: 'automatic', minify: true,
  alias: { '@decky/ui': './preview/stubs/ui.tsx', '@decky/api': './preview/stubs/api.ts' }, define: { 'process.env.NODE_ENV': '"production"' } });
writeFileSync('preview/community-updates.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ThemeHub community updates preview</title><style>body{margin:0;background:#0d1119}button{cursor:pointer;padding:7px 12px}</style></head><body><div id="root"></div><script>${result.outputFiles[0].text.replace(/<\/script/g, '<\\/script')}</script></body></html>`);
if (!process.argv.includes('--build-only')) {
  const { url } = await startPreviewServer();
  console.log(url.replace('preview.html', 'community-updates.html'));
}
