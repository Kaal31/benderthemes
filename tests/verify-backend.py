import asyncio, importlib.util, sys, types, tempfile, pathlib, shutil, base64, logging
root=pathlib.Path('.').resolve()
with tempfile.TemporaryDirectory() as td:
 temp=pathlib.Path(td);target=temp/'defaults/dial';target.mkdir(parents=True)
 for file in (root/'bundle/dial').glob('*'):
  if file.is_file():shutil.copy2(file,target/file.name)
 sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_DIR=str(temp),DECKY_PLUGIN_SETTINGS_DIR=str(temp/'settings'),DECKY_PLUGIN_RUNTIME_DIR=str(temp/'runtime'),logger=logging.getLogger('test'))
 spec=importlib.util.spec_from_file_location('plugin_under_test',root/'main.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
 async def check():
  plugin=module.Plugin()
  for name in ['wake.wav','switch.wav','launch.wav','back.wav']:
   result=await plugin.get_dial_asset(name);assert base64.b64decode(result.split(',')[1])==(target/name).read_bytes()
  for bad in ['../../main.py','SOURCES.txt','unknown.glb','/etc/passwd',[]]:assert await plugin.get_dial_asset(bad) is None
  (target/'wake.wav').unlink();assert await plugin.get_dial_asset('wake.wav') is None
  assert await plugin.get_dial_asset('prototype.glb') is None
  prefs={'theme':'dial','dial':{'look':'classic','motion':'hologram','activation':'on-browse','reflections':False,'sound':'off'}}
  assert await plugin.set_settings(prefs)
  assert await module.Plugin().get_settings()==prefs
 asyncio.run(check())
print('PASS: audio assets, allowlist, missing-file fallback, preference disk persistence.')
