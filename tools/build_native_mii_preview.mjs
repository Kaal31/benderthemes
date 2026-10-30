import {build} from 'esbuild';import {writeFileSync} from 'fs';
const r=await build({entryPoints:['preview/native-mii-review.tsx'],bundle:true,write:false,format:'iife',jsx:'automatic',minify:true,alias:{'@decky/ui':'./preview/stubs/ui.tsx','@decky/api':'./preview/stubs/api.ts'},define:{'process.env.NODE_ENV':'"production"'}});
writeFileSync('preview/native-mii-maker.html','<!doctype html><meta charset="utf-8"><title>Native Mii models — GitFlic pack</title><div id="app"></div><script>'+r.outputFiles[0].text.replace(/<\/script/g,'<\\/script')+'</script>');
