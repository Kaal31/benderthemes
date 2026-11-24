import json,sys,tempfile,types,unittest
from pathlib import Path
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'py_modules'));sys.modules.setdefault('decky',types.SimpleNamespace())
import data_themes
class WiiFlowRuntime(unittest.TestCase):
 def test_only_converted_imports_use_maintained_scripts(self):
  with tempfile.TemporaryDirectory() as temp:
   folder=Path(temp);ident='wiiflow-runtime-fixture';local=folder/'app.js';local.write_text('stale copied renderer')
   (folder/'style.css').write_text('imported artwork rules')
   scan={ident:({},str(folder),'user')}
   with patch.object(data_themes,'_scan',return_value=scan):
    self.assertEqual(data_themes.resolve(ident,'app.js'),str(local))
    (folder/'import-report.json').write_text(json.dumps({'provenance':{'identity':ident,'kind':'community','themeIni':'Test.ini'}}))
    expected=ROOT/'themes/wiiflow-default/app.js'
    self.assertEqual(Path(data_themes.resolve(ident,'app.js')).resolve(),expected.resolve())
    self.assertEqual(data_themes.resolve(ident,'style.css'),str(folder/'style.css'))
    self.assertIsNone(data_themes.resolve(ident,'../app.js'))
    self.assertIsNone(data_themes.resolve(ident,'sub/app.js'))
 def test_mismatched_or_malformed_provenance_keeps_private_runtime(self):
  with tempfile.TemporaryDirectory() as temp:
   folder=Path(temp);ident='wiiflow-runtime-fixture';local=folder/'renderer.js';local.write_text('custom renderer')
   with patch.object(data_themes,'_scan',return_value={ident:({},str(folder),'user')}):
    for report in [{}, {'provenance':{'identity':'other','kind':'community','themeIni':'Test.ini'}},{'provenance':[]}]:
     (folder/'import-report.json').write_text(json.dumps(report));self.assertEqual(data_themes.resolve(ident,'renderer.js'),str(local))
if __name__=='__main__':unittest.main()
