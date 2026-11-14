"""Read LiveShell's public wallpaper catalogue; import media through the shared library."""
import hashlib,json,os,time
from pathlib import Path
from urllib.parse import urlparse,unquote,quote
from urllib.request import Request,urlopen,HTTPRedirectHandler,build_opener

CATALOGS=('https://raw.githubusercontent.com/Kanfium/Library/main/library/store.json','https://cdn.jsdelivr.net/gh/Kanfium/Library@main/library/store.json')
PAGE='https://github.com/Kanfium/Library'
LIMIT=4*1024*1024

def catalogue(data):
    cache=Path(data)/'animated-wallpapers/liveshell-catalog.json'
    def saved():
        if cache.stat().st_size>LIMIT:raise ValueError('Catalogue exceeds limit')
        return json.loads(cache.read_text(encoding='utf-8'))
    if cache.exists() and time.time()-cache.stat().st_mtime<21600:
        try:return saved()
        except (OSError,ValueError):pass
    for url in CATALOGS:
        try:
            with urlopen(Request(url,headers={'User-Agent':'ThemeHub'}),timeout=20) as response:raw=response.read(LIMIT+1)
            if len(raw)>LIMIT:raise ValueError('Catalogue exceeds limit')
            value=json.loads(raw)
            if value.get('v')!=2 or not isinstance(value.get('items'),list) or not isinstance(value.get('src'),dict):raise ValueError('Unsupported catalogue')
            cache.parent.mkdir(parents=True,exist_ok=True);tmp=cache.with_suffix('.tmp');tmp.write_bytes(raw);os.replace(tmp,cache)
            return value
        except (OSError,ValueError):continue
    if cache.exists():return saved()
    raise ValueError('LiveShell catalogue is unavailable')

def asset_url(base,path):
    if not isinstance(base,str) or not isinstance(path,str):raise ValueError('Invalid media path')
    allowed=('https://huggingface.co/datasets/ZiZc3/liveshell-community/resolve/main/','https://raw.githubusercontent.com/adiambassador/wallpapers/main/')
    decoded=unquote(path)
    if not base.startswith(allowed) or not base.endswith('/') or any(x in decoded for x in ('\\','?', '#',':','\x00')) or decoded.startswith('/') or any(x in ('','..','.') for x in decoded.split('/')):raise ValueError('Invalid media path')
    return base+quote(decoded,safe='/')

def entries(data):
    cat=catalogue(data);result=[]
    for item in cat['items'][:20000]:
        try:
            source=cat['src'][item['o']];url=asset_url(source['u'],item['u'])
            if not urlparse(url).path.lower().endswith('.mp4'):continue
            ident=hashlib.sha256((item['o']+':'+item['u']).encode()).hexdigest()[:24]
            poster=asset_url(source.get('j',source['u']),item['j']) if item.get('j') else ''
            result.append({'id':'liveshell:'+ident,'providerId':ident,'name':str(item['t'])[:160],'source':'liveshell','kind':'video','format':'MP4','poster':poster,'sourcePage':PAGE,'downloadable':True,'size':item.get('s',0),'category':str(item.get('c','')),'resolution':str(item.get('q','')),'note':'LiveShell community catalogue · '+str(item.get('q','')),'_url':url})
        except (KeyError,ValueError,TypeError):continue
    return result

def browse(data,query='',page=1):
    words=str(query).lower().split();items=[x for x in entries(data) if all(w in (x['name']+' '+x['category']).lower() for w in words)]
    page=max(1,min(500,int(page)));start=(page-1)*30
    return {'items':[{k:v for k,v in x.items() if k!='_url'} for x in items[start:start+30]],'hasMore':start+30<len(items)}

def media(data,ident):
    for item in entries(data):
        if item['providerId']==ident:return {'url':item['_url'],'name':item['name'],'poster':item['poster']}
    raise ValueError('Wallpaper no longer exists in the catalogue')

def allowed_download(url):
    p=urlparse(url);host=p.hostname or ''
    return p.scheme=='https' and not p.username and not p.password and p.port in (None,443) and (host in ('huggingface.co','raw.githubusercontent.com') or host.endswith('.hf.co') or host.endswith('.huggingface.co'))

class Redirect(HTTPRedirectHandler):
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        if not allowed_download(newurl):raise ValueError('Unexpected media redirect')
        return super().redirect_request(req,fp,code,msg,headers,newurl)

def open_media(url):
    if not allowed_download(url):raise ValueError('Unexpected media host')
    return build_opener(Redirect()).open(Request(url,headers={'User-Agent':'ThemeHub'}),timeout=30)
