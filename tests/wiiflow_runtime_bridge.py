"""Serve a real converted import with main.py HTTP handling and sandbox policies."""
import ast,asyncio,json,os,re,sys,tempfile,types,zipfile,mimetypes,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'py_modules'))
fixture=tempfile.TemporaryDirectory();data=Path(fixture.name)
sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_RUNTIME_DIR=str(data),DECKY_PLUGIN_DIR=str(ROOT),logger=types.SimpleNamespace(warning=lambda *a:None))
import data_themes
from wiiflow_convert import convert
src=Path(os.environ['WIIFLOW_SOURCE']) if os.environ.get('WIIFLOW_SOURCE') else data/'source'
if not src.exists():
 src.mkdir();(src/'Fixture.ini').write_text('[MAIN/BG]\n[_COVERFLOW_1]\ncolumns=9\n')
convert(src,data/'converted.zip',ident='wiiflow-handshake-fixture');folder=Path(data_themes.user_root())/'wiiflow-handshake-fixture';zipfile.ZipFile(data/'converted.zip').extractall(folder)
# Existing imports can contain a broken or obsolete private renderer.
(folder/'app.js').write_text('throw new Error("stale private runtime must not run")')
tree=ast.parse((ROOT/'main.py').read_text(encoding='utf8'));nodes=[]
for node in tree.body:
 if isinstance(node,(ast.AsyncFunctionDef,ast.FunctionDef)) and node.name in ['_send','_serve','_mime']:nodes.append(node)
 if isinstance(node,ast.Assign) and any(isinstance(t,ast.Name) and t.id in ['WEB_EXT','VIDEO_EXT','AUDIO_EXT'] for t in node.targets):nodes.append(node)
_vi=types.SimpleNamespace(token='integration-test',port=0)
exec(compile(ast.Module(body=nodes,type_ignores=[]),'main.py','exec'))
async def run():
 server=await asyncio.start_server(_serve,'127.0.0.1',0);_vi.port=server.sockets[0].getsockname()[1];origin=f'http://127.0.0.1:{_vi.port}/{_vi.token}'
 print(json.dumps({'base':origin+'/t','wrap':origin+'/w','themes':data_themes.list_themes()}),flush=True)
 async with server:await server.serve_forever()
try:asyncio.run(run())
finally:fixture.cleanup()
