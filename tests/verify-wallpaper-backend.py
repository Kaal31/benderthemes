import ast, asyncio, os, tempfile, types, base64
source=ast.parse(open('main.py',encoding='utf-8').read())
cls=next(n for n in source.body if isinstance(n,ast.ClassDef) and any(isinstance(x,ast.AsyncFunctionDef) and x.name=='get_wallpaper' for x in n.body))
methods=[n for n in cls.body if isinstance(n,ast.AsyncFunctionDef) and n.name in ('get_wallpaper','list_wallpapers','cinematic_assets','get_assets')]
with tempfile.TemporaryDirectory() as folder:
    for name in ['a.gif','b.mp4','c.webm','d.txt']:
        open(os.path.join(folder,name),'wb').write(b'fixture')
    async def server(): return True
    vi=types.SimpleNamespace(files={},port=9999,token='test')
    scope=dict(os=os,asyncio=asyncio,_data_dir=lambda:folder,IMAGE_EXT=('.png','.jpg','.jpeg','.webp','.gif'),WALLPAPER_VIDEO_EXT=('.mp4','.webm'),_wall_dir=lambda:folder,_resource_names=lambda k:[],_user_resource=lambda d,n,k:os.path.join(d,n),_ensure_server=server,_vi=vi,_mime=lambda p:'image/gif',_data_url=lambda b,m:'data:'+m+';base64,'+base64.b64encode(b).decode())
    module=ast.Module(body=[next(n for n in source.body if isinstance(n,ast.FunctionDef) and n.name=="_mime"),*methods],type_ignores=[]);exec(compile(module,'wallpaper-methods','exec'),scope)
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
        scope['_resource'] = lambda name: os.path.join(folder, os.path.basename(name))
        for theme in ('castle', 'republic'):
            for ext in ('.mp4', '.jpg'):
                open(os.path.join(folder, theme + ext), 'wb').write(b'fixture')
            assets = await scope['cinematic_assets'](None, theme)
            assert assets['video'].endswith('.mp4'), assets
            assert assets['poster'].endswith('.jpg'), assets
            assert vi.files[assets['video'].rsplit('/', 1)[1]].endswith(theme + '.mp4')
        assert await scope['cinematic_assets'](None, 'unknown') == {}
        # A partial user set must not hide the downloaded pack's movies.
        asset_dir = os.path.join(folder, 'assets', 'nazarick')
        os.makedirs(asset_dir)
        downloaded = os.path.join(folder, 'downloaded', 'assets', 'nazarick')
        os.makedirs(downloaded)
        open(os.path.join(asset_dir, 'home.png'), 'wb').write(b'user poster')
        pages = ('home', 'library', 'store', 'friends', 'downloads', 'settings')
        for page in pages:
            open(os.path.join(downloaded, page + '-video.mp4'), 'wb').write(b'fixture')
        open(os.path.join(downloaded, 'home.png'), 'wb').write(b'downloaded poster')
        open(os.path.join(downloaded, 'custom-gif.gif'), 'wb').write(b'GIF89a')
        open(os.path.join(downloaded, 'custom-webm.webm'), 'wb').write(b'fixture')
        scope['_safe_name'] = lambda name: name
        scope['_resource_names'] = lambda name: os.listdir(downloaded)
        scope['_user_resource'] = lambda d,n,k: os.path.join(d,n) if os.path.isfile(os.path.join(d,n)) else os.path.join(downloaded,n)
        assets = await scope['get_assets'](None, 'nazarick')
        for page in pages:
            url = assets[page + '-video']
            assert url.startswith('http://127.0.0.1:9999/test/f/') and url.endswith('.mp4'), assets
            assert vi.files[url.rsplit('/', 1)[1]] == os.path.join(downloaded, page + '-video.mp4')
        for extension in ('gif','webm'):
            url = assets['custom-'+extension]
            assert url.endswith('.'+extension)
            assert vi.files[url.rsplit('/',1)[1]] == os.path.join(downloaded, 'custom-'+extension+'.'+extension)
        assert base64.b64decode(assets['home'].split(',',1)[1]) == b'user poster'
        assert await scope['get_assets'](None, 'nazarick') == assets

    asyncio.run(test())
print('PASS custom MP4/WebM/GIF sources, cinematic URLs, streamed Nazarick movies, partial user sets and per-file overrides')
