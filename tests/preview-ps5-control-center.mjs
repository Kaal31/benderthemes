import { build } from "esbuild";
import { createServer, get } from "node:http";
import { startPreviewServer } from "../preview/server.mjs";

const options={bundle:true,write:false,format:"iife",jsx:"automatic",alias:{"@decky/ui":"./preview/stubs/ui.tsx","@decky/api":"./preview/stubs/api.ts"},define:{"process.env.NODE_ENV":'"production"'}};
const home=await build({...options,entryPoints:["preview/main.tsx"]});
const center=await build({...options,entryPoints:["preview/Ps5ControlCenter.tsx"]});
const upstream=await startPreviewServer();
const server=createServer((request,response)=>{
  const pathname=new URL(request.url,'http://localhost').pathname;
  if(pathname==='/'){
    response.setHeader('Content-Type','text/html; charset=utf-8');response.setHeader('Cache-Control','no-store');
    response.end(`<!doctype html><meta charset="utf-8"><title>PS5 Control Center · Uncommitted concept</title><body style="margin:0;background:#090e1b"><div id="root"></div><script>window.__themePreview='ps5';window.__isThemePreview=true;window.__themeCatalog={themes:[]};window.__testInventory={ps5:'preview'};</script><script src="/home.js"></script><script src="/center.js"></script></body>`);
  }else if(pathname==='/home.js'||pathname==='/center.js'){response.setHeader('Content-Type','text/javascript');response.end((pathname==='/home.js'?home:center).outputFiles[0].text);}
  else{const proxy=get(new URL(request.url,upstream.url),result=>{response.writeHead(result.statusCode,result.headers);result.pipe(response);});proxy.on('error',()=>{response.statusCode=502;response.end();});}
});
server.listen(8790,'127.0.0.1',()=>console.log('PS5 Control Center concept: http://127.0.0.1:8790/?still=1'));
