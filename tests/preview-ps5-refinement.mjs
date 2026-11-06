import { build } from "esbuild";
import { createServer, get } from "node:http";
import { readFileSync } from "node:fs";
import { startPreviewServer } from "../preview/server.mjs";

const options={entryPoints:["preview/main.tsx"],bundle:true,write:false,format:"iife",jsx:"automatic",alias:{"@decky/ui":"./preview/stubs/ui.tsx","@decky/api":"./preview/stubs/api.ts"},define:{"process.env.NODE_ENV":'"production"'}};
const before=await build(options);
const after=await build({...options,plugins:[{name:"ps5-preview-only",setup(builder){builder.onLoad({filter:/[\\/]themes[\\/]Ps5\.tsx$/},args=>{
  let source=readFileSync(args.path,"utf8");
  source=source.replace('const [bg, setBg] = useState<Game | undefined>(g);','const [bg, setBg] = useState<Game | undefined>(g); const [previousBg, setPreviousBg] = useState<Game | undefined>();');
  source=source.replace('setTimeout(() => setBg(g), 250)','setTimeout(() => { setPreviousBg(bg); setBg(g); }, 90)');
  source=source.replace('const labelPos = st<string>("tileLabel");','const labelPos = st<string>("tileLabel") === "beside" ? "below" : st<string>("tileLabel");');
  source=source.replace('const fade = st<string>("transition");','const fade = st<string>("transition") === "zoom" ? "fade" : st<string>("transition");');
  source=source.replace('{bg && hubBg !== "solid" && (','{previousBg && bg && hubBg !== "solid" && <div className="ps5-preview-previous" style={{position:"absolute",inset:0}}><GameHero g={previousBg} theme="ps5" blurred={hubBg === "blur"}/></div>}\n        {bg && hubBg !== "solid" && (');
  source=source.replace('animation: fade === "cut" ? "none"','animation: !s.animations || fade === "cut" ? "none"');
  source=source.replace('top: rowY + (on ? 0 : (TS - T) / 2)','top: rowY');
  source=source.replace('borderRadius: on ? 22 : 16','borderRadius: on ? 16 : 12');
  source=source.replace('transition: "left 200ms ease-out, width 200ms, height 200ms, top 200ms"','transition: s.animations ? "left 260ms cubic-bezier(.22,.7,.2,1), width 260ms cubic-bezier(.22,.7,.2,1), height 260ms cubic-bezier(.22,.7,.2,1), box-shadow 180ms" : "none"');
  source=source.replace('"0 0 0 3px #fff, 0 8px 24px rgba(0,0,0,0.6)"','"0 0 0 2px rgba(255,255,255,.95), 0 0 0 6px rgba(255,255,255,.12), 0 8px 24px rgba(0,0,0,.35)"');
  source=source.replace('top: rowY + TS + 10, width: 360','top: rowY + TS + 14, width: 440');
  source=source.replace('{/* tiles */}', '<style>{`@keyframes ps5TabEnter {from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>{/* tiles */}');
  source=source.replace('<div key={t.key} onClick=', '<div key={tab+":"+t.key} onClick=');
  source=source.replace('background: "#1b1f27"','background: "#10151d", animation: s.animations ? "ps5TabEnter 220ms ease-out both" : "none"');
  return {contents:source,loader:"tsx"};
});}}]});
const upstream=await startPreviewServer();
const server=createServer((request,response)=>{
 const pathname=new URL(request.url,"http://localhost").pathname;
 response.setHeader("Cache-Control","no-store");
 if(pathname==="/refinement.css"){response.setHeader("Content-Type","text/css");response.end(readFileSync("preview/ps5Refinement.css","utf8").replaceAll('.dht-destination[data-theme=ps5]', '.dht-theme-ps5 .dht-destination[data-theme=ps5]'));return;}
 if(pathname==="/"){
  response.setHeader("Content-Type","text/html; charset=utf-8");response.end(`<!doctype html><meta charset="utf-8"><title>PS5 home · Before / After</title><style>body{margin:0;background:#0b101b;color:white;font:15px system-ui}header{padding:14px 22px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}h1{font-size:19px;margin:0}button{background:#26364c;border:1px solid #ffffff55;color:white;border-radius:8px;padding:9px 15px;cursor:pointer}button[aria-pressed=true]{background:#edf3ff;color:#162239}iframe{width:100%;height:calc(100vh - 100px);border:0}small{color:#bccadd}</style><header><h1>PS5 standard home · Preview only</h1><button id="before" aria-pressed="false">Before</button><button id="after" aria-pressed="true">After</button><small>Click inside · ← → switch covers · ↑ ↓ navigate · No Control Center</small></header><iframe src="/after" title="PS5 home"></iframe><script>for(const version of ['before','after'])document.getElementById(version).onclick=()=>{document.querySelector('iframe').src='/'+version;for(const other of ['before','after'])document.getElementById(other).setAttribute('aria-pressed',String(other===version));};</script>`);
 }else if(pathname==="/before"||pathname==="/after"){
  response.setHeader("Content-Type","text/html; charset=utf-8");response.end(`<!doctype html>${pathname==="/after"?'<link rel="stylesheet" href="/refinement.css">':''}<body style="margin:0;background:#0b101b"><div id="root"></div><script>window.__themePreview='ps5';window.__isThemePreview=true;window.__themeCatalog={themes:[]};window.__testInventory={ps5:'preview'};</script><script src="${pathname}.js"></script></body>`);
 }else if(pathname==="/before.js"||pathname==="/after.js"){response.setHeader("Content-Type","text/javascript");response.end((pathname==="/before.js"?before:after).outputFiles[0].text);}
 else{const proxy=get(new URL(request.url,upstream.url),result=>{response.writeHead(result.statusCode,result.headers);result.pipe(response);});proxy.on('error',()=>{response.statusCode=502;response.end();});}
});
server.listen(8791,"127.0.0.1",()=>console.log("PS5 refinement: http://127.0.0.1:8791/"));
