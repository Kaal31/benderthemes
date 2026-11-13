"""Local-only integration fixture: real imports/storage and real frame CSP, mock online catalog."""
import json,os,re,sys,tempfile,types,shutil
from pathlib import Path
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
from urllib.parse import unquote,urlparse
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'py_modules'))
import animated_wallpapers as aw
fixture=tempfile.TemporaryDirectory(prefix='themehub-aw-');data=Path(fixture.name);source=data/'fixtures';source.mkdir()
for name in ['animated-wallpaper.gif','animated-wallpaper.webm']:shutil.copyfile(ROOT/'tests/fixtures/media'/name,source/name)
(source/'Panel.ini').write_text('[Rainmeter]\nUpdate=1000\n[Clock]\nMeasure=Time\nFormat=%H:%M:%S\n[Heading]\nMeter=String\nText=Rainmeter Steam layout\nX=80\nY=100\nFontSize=32\n[Library]\nMeter=String\nText=Open library\nX=80\nY=200\nW=300\nH=50\nFontSize=24\n[Time]\nMeter=String\nMeasureName=Clock\nX=80\nY=300\nFontSize=22\n')
(source/'Alternate.ini').write_text('[Rainmeter]\n[Text]\nMeter=String\nText=Alternative variant\n')
import zipfile
with zipfile.ZipFile(source/'sample.rmskin','w') as z:
 z.write(source/'Panel.ini','Panel.ini');z.write(source/'Alternate.ini','Alternate.ini')
sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_RUNTIME_DIR=str(data),DECKY_PLUGIN_DIR=str(ROOT),logger=types.SimpleNamespace(warning=lambda *a:None))
import data_themes
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*a):pass
 def headers_(self,code=200,mime='application/json',extra=None):
  self.send_response(code);self.send_header('Content-Type',mime);self.send_header('Access-Control-Allow-Origin','*');self.send_header('Access-Control-Allow-Headers','Content-Type,Range');self.send_header('Cache-Control','no-store')
  for k,v in (extra or {}).items():self.send_header(k,str(v))
  self.end_headers()
 def do_OPTIONS(self):self.headers_(204)
 def do_POST(self):
  try:
   args=json.loads(self.rfile.read(int(self.headers.get('Content-Length',0))));name=self.path[1:]
   if name=='animated_wallpapers_list':
    items=aw.list_items(data)
    for item in items:
     if item.pop('_mediaPath',None):item['url']=origin+'/media/'+item['file']
     if item.pop('_posterPath',None):item['poster']=origin+'/poster/'+item['id']
    result={'items':items}
   elif name=='animated_wallpapers_inspect':result={'ok':True,**aw.inspect_source(args[0])}
   elif name=='animated_wallpapers_import':
    result={'ok':True,'item':aw.import_source(data,*args)};data_themes._cache.clear()
   elif name=='animated_wallpapers_poster':result=aw.save_poster(data,*args)
   elif name=='animated_wallpapers_remove':result=aw.remove(data,args[0]);data_themes._cache.clear()
   elif name=='animated_wallpapers_browse':
    q,page,provider=args;rows=[{'id':'wallspace:demo','providerId':'123456','name':'Example Wallspace video','source':'wallspace','kind':'video','format':'MP4','note':'Browser test fixture','downloadable':False},{'id':'workshop:demo','providerId':'234567','name':'Example Workshop video','source':'wallpaper-engine','kind':'video','format':'Video','note':'Browser test fixture','downloadable':True}]
    rows=[r for r in rows if provider in ('all',r['source']) and q.lower() in r['name'].lower()]
    result={'items':rows if page==1 else [],'hasMore':page==1,'errors':[]}
   elif name=='animated_wallpapers_progress':result={}
   elif name=='animated_wallpapers_workshop':result={'items':[]}
   elif name=='list_data_themes':result={'base':origin+'/t','wrap':origin+'/w','themes':data_themes.list_themes()}
   else:raise ValueError('Unknown fixture call')
   self.headers_();self.wfile.write(json.dumps(result).encode())
  except Exception as e:self.headers_(400);self.wfile.write(json.dumps({'error':str(e)}).encode())
 def do_GET(self):
  path=urlparse(self.path).path
  if path.startswith('/w/'):
   _,_,ident,*parts=path.split('/');html,csp=data_themes.frame_wrapper(origin,ident,'/'.join(parts));self.headers_(200,'text/html',{'Content-Security-Policy':csp});self.wfile.write(html.encode());return
  if path.startswith('/t/'):
   _,_,ident,*parts=path.split('/');file=data_themes.resolve(ident,'/'.join(parts));p=Path(file) if file else None
  elif path.startswith('/poster/'):
   ident=path[len('/poster/'):];p=data/'animated-wallpapers'/ident/'poster.png' if aw.ID.fullmatch(ident) else None;ident=None
  elif path.startswith('/media/'):
   name=unquote(path[len('/media/'):]);p=data/'wallpapers'/name if '/' not in name else None;ident=None
  else:self.headers_(404);return
  if not p or not p.is_file():self.headers_(404);return
  types_={'.png':'image/png','.html':'text/html','.js':'text/javascript','.gif':'image/gif','.webm':'video/webm','.mp4':'video/mp4','.json':'application/json'}
  size=p.stat().st_size;headers={};start=0;end=size-1;code=200
  if p.suffix=='.html' and ident:headers['Content-Security-Policy']=data_themes.frame_csp(origin,ident)
  range_=self.headers.get('Range','');m=re.match(r'bytes=(\d+)-(\d*)',range_)
  if m:start=int(m[1]);end=min(int(m[2]) if m[2] else end,end);code=206;headers['Content-Range']=f'bytes {start}-{end}/{size}'
  headers['Content-Length']=end-start+1;headers['Accept-Ranges']='bytes';self.headers_(code,types_.get(p.suffix,'application/octet-stream'),headers)
  with p.open('rb') as f:f.seek(start);self.wfile.write(f.read(end-start+1))
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);origin='http://127.0.0.1:'+str(server.server_port)
print(json.dumps({'url':origin,'fixtures':str(source),'data':str(data)}),flush=True)
try:server.serve_forever()
finally:server.server_close();fixture.cleanup()
