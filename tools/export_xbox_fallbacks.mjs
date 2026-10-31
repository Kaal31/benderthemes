import {build} from 'esbuild';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const scratch=resolve('work/xbox-fallback-export.cjs');mkdirSync(resolve('work'),{recursive:true});
await build({entryPoints:['src/themes/xboxFallbackArtwork.ts'],outfile:scratch,bundle:true,platform:'node',format:'cjs',external:['react'],plugins:[{name:'no-runtime-assets',setup(api){api.onResolve({filter:/^\.\.\/assets$/},()=>({path:'asset-stub',namespace:'export'}));api.onLoad({filter:/.*/,namespace:'export'},()=>({contents:'export const useAssets=()=>({});'}));}}]});
const artwork=createRequire(import.meta.url)(scratch);
const groups={'xbox-original':artwork.xboxFallback,'x360-kinect':artwork.kinectFallback,'x360-metro':artwork.metroFallback,'x360-blades-small':artwork.bladesSmallFallback};
let count=0;for(const [group,images] of Object.entries(groups)){
 const dir=resolve('design/xbox-fallbacks',group);mkdirSync(dir,{recursive:true});
 for(const [name,url] of Object.entries(images)){writeFileSync(resolve(dir,name+'.svg'),Buffer.from(url.split(',')[1],'base64'));count++;}
}
writeFileSync(resolve('design/xbox-fallbacks/README.md'),'# Authored Xbox fallback artwork\n\nGenerated from src/themes/xboxFallbackArtwork.ts and the approved independent NXE SVG icon set. No extracted console images or fonts are used by this exporter. Run node tools/export_xbox_fallbacks.mjs to refresh. Original console artwork remains an optional external override.\n');
console.log(`Exported ${count} SVG fallback assets`);
