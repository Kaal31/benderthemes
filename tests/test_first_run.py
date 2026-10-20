import asyncio
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'py_modules'))
sys.modules.setdefault('decky',types.SimpleNamespace())
spec=importlib.util.spec_from_file_location('first_run_backend',ROOT/'main.py')
backend=importlib.util.module_from_spec(spec);spec.loader.exec_module(backend)
import theme_store
class FirstRunTests(unittest.TestCase):
 def setUp(self):
  temp=tempfile.TemporaryDirectory();self.addCleanup(temp.cleanup);self.root=Path(temp.name)
  self.path=self.root/'settings.json'
  paths={'DECKY_PLUGIN_DIR':str(ROOT),'DECKY_PLUGIN_SETTINGS_DIR':str(self.root),'DECKY_PLUGIN_RUNTIME_DIR':str(self.root/'runtime')}
  for module in (backend,theme_store):
   stub=patch.dict(vars(module.decky),paths);stub.start();self.addCleanup(stub.stop)
 def test_fresh_setup_selects_psp_and_downloads_nothing_before_confirmation(self):
  first=asyncio.run(backend.Plugin().get_settings())
  self.assertEqual(first['theme'],'psp');self.assertFalse(first['onboardingDone'])
  self.assertEqual(theme_store.local_inventory(),{})
 def test_existing_active_code_only_theme_is_preserved_once(self):
  self.path.write_text(json.dumps({'theme':'wii','enabled':True,'onboardingDone':True,'customSetting':'keep'}))
  data=asyncio.run(backend.Plugin().get_settings())
  self.assertEqual(data['theme'],'wii');self.assertEqual(data['customSetting'],'keep')
  self.assertEqual(theme_store.local_inventory(),{'wii':'1.0.0'})
  import shutil;shutil.rmtree(theme_store.root()/'wii')
  asyncio.run(backend.Plugin().get_settings())
  self.assertEqual(theme_store.local_inventory(),{},'does not reinstall after explicit removal')
 def test_existing_console_choice_and_settings_remain_unchanged(self):
  self.path.write_text(json.dumps({'theme':'ps3','onboardingDone':True,'enabled':True}))
  data=asyncio.run(backend.Plugin().get_settings())
  self.assertEqual(data['theme'],'ps3');self.assertTrue(data['onboardingDone'])
  self.assertEqual(theme_store.local_inventory(),{})
