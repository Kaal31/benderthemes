import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
spec = importlib.util.spec_from_file_location("achievement_popups", Path(__file__).parents[1]/"py_modules"/"achievement_popups.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
class FinallyDetectionTests(unittest.TestCase):
    def test_manifest_name_and_unloaded_plugin(self):
        with tempfile.TemporaryDirectory() as path:
            root=Path(path)
            self.assertEqual(module.installed_finally(root), {"verified":True,"finallyInstalled":False})
            plugin=root/"renamed";plugin.mkdir()
            (plugin/"plugin.json").write_text(json.dumps({"name":"Finally Achievement Plugin"}))
            self.assertTrue(module.installed_finally(root)["finallyInstalled"])
    def test_missing_root_and_broken_manifest(self):
        with tempfile.TemporaryDirectory() as path:
            root=Path(path)
            self.assertFalse(module.installed_finally(root/"missing")["verified"])
            plugin=root/"plugin";plugin.mkdir();(plugin/"plugin.json").write_text("broken")
            self.assertFalse(module.installed_finally(root)["verified"])
    def test_folder_name(self):
        with tempfile.TemporaryDirectory() as path:
            (Path(path)/"finally-achievement-plugin").mkdir()
            self.assertTrue(module.installed_finally(path)["finallyInstalled"])
if __name__=="__main__":unittest.main()
