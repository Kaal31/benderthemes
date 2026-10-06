import asyncio, importlib.util, sys,types,tempfile,logging,json
from unittest.mock import patch
sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_DIR='.',DECKY_PLUGIN_SETTINGS_DIR=tempfile.gettempdir(),DECKY_PLUGIN_RUNTIME_DIR=tempfile.gettempdir(),logger=logging.getLogger('test'))
spec=importlib.util.spec_from_file_location('weather_test','main.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Response:
 def __init__(self,d):self.d=d
 def __enter__(self):return self
 def __exit__(self,*a):pass
 def read(self,*a):return json.dumps(self.d).encode()
async def test():
 p=m.Plugin()
 with patch('urllib.request.urlopen',side_effect=[Response({'success':True,'city':'Test City','latitude':32,'longitude':35}),Response({'current':{'temperature_2m':21.5,'weather_code':3,'is_day':1,'time':'2026-10-07T12:00'}})]) as request:
  r=await p.castle_weather();assert r['temperature']==21.5 and r['city']=='Test City';assert await p.castle_weather()==r;assert request.call_count==2
 p=m.Plugin()
 with patch('urllib.request.urlopen',side_effect=OSError('offline')):assert (await p.castle_weather())['error']=='Weather unavailable'
 print('PASS weather current Celsius data, caching and offline response')
asyncio.run(test())
