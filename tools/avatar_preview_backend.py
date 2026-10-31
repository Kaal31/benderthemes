"""Local QA bridge using the real plugin methods and file server, with temporary Decky storage.

python tools/avatar_preview_backend.py --assets C:/path/to/Assets
The normal preview only uses this bridge when __avatarEngineCall is explicitly provided.
"""
import argparse
import asyncio
import http.server
import json
import logging
from pathlib import Path
import sys
import tempfile
import threading
import types
import os

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--assets',required=True)
parser.add_argument('--port',type=int,default=0)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
os.environ['AVATAR_ASSETS_DIR']=str(Path(args.assets).resolve())
temporary=tempfile.TemporaryDirectory(prefix='metro-avatar-preview-')
sys.path[:0]=[str(root),str(root/'py_modules')]
sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_RUNTIME_DIR=temporary.name,DECKY_PLUGIN_SETTINGS_DIR=temporary.name,DECKY_PLUGIN_DIR=str(root),logger=logging.getLogger('avatar-preview'))
import main
loop=asyncio.new_event_loop()
threading.Thread(target=loop.run_forever,daemon=True).start()
plugin=main.Plugin()
methods={'x360_engine_'+name for name in ['status','build','save','legacy','install']}


class Handler(http.server.BaseHTTPRequestHandler):
    def reply(self,status,value):
        body=json.dumps(value).encode()
        self.send_response(status);self.send_header('Access-Control-Allow-Origin','*');self.send_header('Access-Control-Allow-Headers','Content-Type');self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
    def do_OPTIONS(self):self.reply(200,{})
    def do_POST(self):
        name=self.path.strip('/')
        if name not in methods:return self.reply(404,{'error':'unknown method'})
        try:
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<=65536:raise ValueError('Request size')
            values=json.loads(self.rfile.read(length))
            result=asyncio.run_coroutine_threadsafe(getattr(plugin,name)(*values),loop).result(timeout=60)
            self.reply(200,result)
        except Exception as error:self.reply(400,{'error':str(error)})
    def log_message(self,*args):pass


server=http.server.ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
print(f'Avatar preview bridge: http://127.0.0.1:{server.server_port}',flush=True)
try:server.serve_forever()
finally:
    server.server_close();loop.call_soon_threadsafe(loop.stop);temporary.cleanup()
