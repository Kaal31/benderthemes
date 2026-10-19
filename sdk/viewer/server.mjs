// Standalone SDK theme viewer. Requires Node only, not Decky or a plugin build.
import {createServer} from 'node:http';
import {createReadStream,existsSync,readdirSync,readFileSync,realpathSync,statSync} from 'node:fs';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html','.htm':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg','.mp4':'video/mp4','.webm':'video/webm','.glb':'model/gltf-binary','.bin':'application/octet-stream'};
const idPattern=/^[a-z0-9][a-z0-9:-]{0,63}$/;
export function safeFile(root,relative){
  if(typeof relative!=='string'||relative.length>300||!relative||relative.split('/').some(p=>!p||p.startsWith('.'))||relative.includes('\\'))return null;
  try{const base=realpathSync(root),path=realpathSync(resolve(base,relative));return path.startsWith(base+sep)&&statSync(path).isFile()?path:null;}catch{return null;}
}
export async function startThemeViewer({folders,port=0}={}){
  const defaultRoot=resolve(here,'../../themes');
  folders=folders?.length?folders:existsSync(defaultRoot)?readdirSync(defaultRoot).filter(n=>existsSync(resolve(defaultRoot,n,'theme.json'))&&JSON.parse(readFileSync(resolve(defaultRoot,n,'theme.json'),'utf8').replace(/^\uFEFF/,'')).layout==='frame').map(n=>resolve(defaultRoot,n)):[];
  const themes=new Map();
  for(const folder of folders){
    const path=realpathSync(resolve(folder)),manifest=JSON.parse(readFileSync(resolve(path,'theme.json'),'utf8').replace(/^\uFEFF/,''));
    if(manifest.schema!==1||!idPattern.test(manifest.id)||manifest.layout!=='frame'||typeof manifest.frame?.entry!=='string'||! /\.html?$/i.test(manifest.frame.entry)||!safeFile(path,manifest.frame.entry))throw Error(`Expected a schema-1 frame theme with an existing HTML entry: ${folder}`);
    if(themes.has(manifest.id))throw Error(`Duplicate theme id: ${manifest.id}`);
    themes.set(manifest.id,{manifest,folder:path});
  }
  if(!themes.size)throw Error('No frame themes found. Pass --theme PATH to a folder containing theme.json.');
  const server=createServer((req,res)=>{
    try{
      const url=new URL(req.url,'http://localhost');const path=decodeURIComponent(url.pathname);
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
      res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
      if(path==='/api/themes'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify([...themes.values()].map(t=>t.manifest)));return;}
      const match=path.match(/^\/(theme|wrap)\/([a-z0-9:-]+)\/(.+)$/);
      if(match){
        const [,kind,id,relative]=match,theme=themes.get(id);const file=theme&&(safeFile(theme.folder,relative)||safeFile(resolve(here,'../../out/frame-media',id),relative));
        if(!file)throw Error('missing');
        const own=`http://127.0.0.1:${server.address().port}/theme/${id}/`,all=`http://127.0.0.1:${server.address().port}/theme/`;
        if(kind==='wrap'){
          if(!/\.html?$/i.test(relative))throw Error('not HTML');
          const src=own+relative.split('/').map(encodeURIComponent).join('/');
          res.setHeader('Content-Type','text/html');res.setHeader('Content-Security-Policy',`sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; frame-src ${own}; connect-src 'none'; form-action 'none'; base-uri 'none'`);
          res.end(`<!doctype html><style>html,body{margin:0;height:100%;background:#000}iframe{position:absolute;inset:0;width:100%;height:100%;border:0}</style><iframe sandbox="allow-scripts" referrerpolicy="no-referrer" src="${src.replaceAll('&','&amp;').replaceAll('"','&quot;')}"></iframe><script>const f=document.querySelector('iframe');addEventListener('message',e=>{if(e.source===parent)f.contentWindow.postMessage(e.data,'*');else if(e.source===f.contentWindow)parent.postMessage(e.data,'*');});</script>`);return;
        }
        if(/\.html?$/i.test(relative))res.setHeader('Content-Security-Policy',`sandbox allow-scripts; default-src 'none'; script-src ${own} 'unsafe-inline'; style-src ${own} 'unsafe-inline'; img-src ${all} https://cdn.cloudflare.steamstatic.com https://shared.fastly.steamstatic.com data: blob:; media-src ${all} blob:; font-src ${all} data:; connect-src 'none'; frame-src 'none'; worker-src 'none'; form-action 'none'; base-uri 'none'`);
        res.setHeader('Content-Type',types[extname(file).toLowerCase()]||'application/octet-stream');if(req.method==='HEAD')res.end();else createReadStream(file).on('error',()=>res.destroy()).pipe(res);return;
      }
      const file=safeFile(here,path==='/'?'index.html':path.slice(1));
      if(!file||!['index.html','viewer.js','viewer.css'].includes(path==='/'?'index.html':path.slice(1)))throw Error('missing');
      res.setHeader('Content-Type',types[extname(file)]);if(req.method==='HEAD')res.end();else createReadStream(file).pipe(res);
    }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
  });
  await new Promise((ok,fail)=>{server.once('error',fail);server.listen(port,'127.0.0.1',ok);});
  return {server,url:`http://127.0.0.1:${server.address().port}`};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),folders=[];let port=8780;
  for(let i=0;i<args.length;i++){if(args[i]==='--theme')folders.push(resolve(args[++i]));else if(args[i]==='--port')port=Number(args[++i]);else throw Error(`Unknown argument ${args[i]}`);}
  const {url}=await startThemeViewer({folders,port});console.log(`Theme SDK viewer: ${url}\nSample data only. No Steam actions are executed. Ctrl+C to stop.`);
}
