// Isolated Three.js 0.180 runtime; ThemeHub's existing renderer remains on its current version.
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {mkdirSync,writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const result=await build({absWorkingDir:root,entryPoints:['py_modules/avatar_engine/source/metro-adapter.js'],write:false,
  outfile:'py_modules/avatar_engine/client/engine.js',bundle:true,format:'esm',target:'chrome110',minify:true,
  alias:{three:'avatar-three'},legalComments:'eof'});
for(const file of result.outputFiles){mkdirSync(dirname(file.path),{recursive:true});writeFileSync(file.path,file.text.replace(/[ \t]+$/gm,''));}
