import hashlib
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import x360_engine as engine


class EngineFallbackTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name)
        with patch.dict(os.environ,{'AVATAR_ASSETS_DIR':''}):self.engine=engine.Engine(self.root/'data',self.root/'settings')

    def test_missing_assets_keep_legacy_available(self):
        self.assertFalse(self.engine.status()['ready'])
        self.assertEqual(self.engine.status()['mode'],'auto')
        self.assertEqual(self.engine.save(mode='legacy')['mode'],'legacy')
        self.assertFalse(self.engine.status()['installing'])

    def test_explicit_fallback_is_preserved_after_assets_are_available(self):
        self.engine.save(mode='legacy')
        with patch.object(self.engine,'ready',return_value=True):
            self.assertTrue(self.engine.status()['ready'])
            self.assertEqual(self.engine.status()['mode'],'legacy')

    def test_corrupt_selection_returns_to_legacy(self):
        self.engine.state_file.parent.mkdir(parents=True)
        self.engine.state_file.write_text('{not-json')
        self.assertEqual(self.engine.status()['mode'],'legacy')

    def test_static_paths_cannot_escape_asset_root(self):
        with patch.object(self.engine,'ready',return_value=True):
            with self.assertRaises(ValueError):self.engine.resource('data/../../../../settings/metro-avatar.json')

    def download_fixture(self,member,expected_hash=None):
        buf=io.BytesIO()
        with zipfile.ZipFile(buf,'w') as z:z.writestr(member,b'payload')
        raw=buf.getvalue()
        manifest={'schema':'avatar-assets/packs@1','version':'assets-v1','packs':[{'name':'pack.zip','url':'https://gitflic.ru/pack','bytes':len(raw),'sha256':expected_hash or hashlib.sha256(raw).hexdigest()}]}
        out=io.BytesIO()
        with zipfile.ZipFile(out,'w') as z:z.writestr('packs.json',json.dumps(manifest))
        def request(url,**kwargs):return io.BytesIO(raw if url=='https://gitflic.ru/pack' else out.getvalue())
        return request

    def test_bad_checksum_never_marks_install_complete(self):
        with patch.object(engine.urllib.request,'urlopen',side_effect=self.download_fixture('safe.bin','0'*64)):
            self.engine._install()
        self.assertIn('checksum',self.engine.status()['error'])
        self.assertFalse((self.engine.root/'installed-release.json').exists())

    def test_zip_traversal_never_writes_outside_root(self):
        with patch.object(engine.urllib.request,'urlopen',side_effect=self.download_fixture('../escape.bin')):
            self.engine._install()
        self.assertIn('Invalid pack path',self.engine.status()['error'])
        self.assertFalse((self.engine.root.parent/'escape.bin').exists())


if __name__=='__main__':unittest.main()
