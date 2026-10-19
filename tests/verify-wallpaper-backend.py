import ast, asyncio, os, tempfile, types, base64
source=ast.parse(open('main.py',encoding='utf-8').read())
cls=next(n for n in source.body if isinstance(n,ast.ClassDef) and any(isinstance(x,ast.AsyncFunctionDef) and x.name=='get_wallpaper' for x in n.body))
methods=[n for n in cls.body if isinstance(n,ast.AsyncFunctionDef) and n.name in ('get_wallpaper','list_wallpapers')]
with tempfile.TemporaryDirectory() as folder:
    for name in ['a.gif','b.mp4','c.webm','d.txt']:
        open(os.path.join(folder,name),'wb').write(b'fixture')
    async def server(): return True
    vi=types.SimpleNamespace(files={},port=9999,token='test')
    scope=dict(os=os,IMAGE_EXT=('.png','.jpg','.jpeg','.webp','.gif'),WALLPAPER_VIDEO_EXT=('.mp4','.webm'),_wall_dir=lambda:folder,_resource_names=lambda k:[],_user_resource=lambda d,n,k:os.path.join(d,n),_ensure_server=server,_vi=vi,_mime=lambda p:'image/gif',_data_url=lambda b,m:'data:'+m+';base64,'+base64.b64encode(b).decode())
    module=ast.Module(body=methods,type_ignores=[]);exec(compile(module,'wallpaper-methods','exec'),scope)
    async def test():
        listing=await scope['list_wallpapers'](None)
        assert listing['files']==['a.gif','b.mp4','c.webm']
        assert (await scope['get_wallpaper'](None,'a.gif')).startswith('data:image/gif;')
        for name in ('b.mp4','c.webm'):
            url=await scope['get_wallpaper'](None,name)
            assert url.startswith('http://127.0.0.1:9999/test/f/') and url.endswith(os.path.splitext(name)[1])
            assert vi.files[url.rsplit('/',1)[1]]==os.path.join(folder,name)
        assert await scope['get_wallpaper'](None,'d.txt') is None
        assert await scope['get_wallpaper'](None,'missing.mp4') is None
    asyncio.run(test())
print('PASS wallpaper listing, GIF data URL, streamed MP4/WebM registration, unsupported and missing files')
