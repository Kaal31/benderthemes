import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('package_themes', ROOT / 'tools/package_themes.py')
packaging = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packaging)


class ThemePackagingTests(unittest.TestCase):
    def test_hidden_files_and_directories_are_excluded_from_zip_and_offline_catalog(self):
        with tempfile.TemporaryDirectory(prefix='.theme-packaging-') as directory:
            root = Path(directory)
            files = {
                'bundle/sounds/DHT Verified Xbox 360 UI/RareAchievementStart.wav': b'audio',
                'bundle/sounds/DHT Verified Xbox 360 UI/.RareAchievementStart.wav.i9JBV0': b'temp',
                'bundle/sounds/.cache/360/hidden.wav': b'hidden',
                'bundle/.hidden/sounds/360/hidden.wav': b'hidden',
                'bundle/notices/.hidden.txt': b'hidden',
                'third-party/LICENSE.txt': b'license',
                'third-party/.cache/LICENSE.txt': b'hidden',
                'third-party/.hidden.txt': b'hidden',
            }
            for name, content in files.items():
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(content)
            (root / 'package.json').write_text('{"version":"1.10.7"}')
            with patch.object(packaging, 'ROOT', root), patch.object(packaging, 'audio_catalog', return_value=[]):
                packaging.build()
                catalog = json.loads((root / 'theme-catalog.json').read_text())
                pack, = catalog['themes']
                self.assertEqual(pack['id'], 'x360')
                self.assertEqual(pack['resources'], ['sounds/DHT Verified Xbox 360 UI/RareAchievementStart.wav'])
                archive = root / 'out/themes' / packaging.asset_filename('x360', pack['version'])
                self.assertEqual(hashlib.sha256(archive.read_bytes()).hexdigest(), pack['sha256'])
                with zipfile.ZipFile(archive) as z:
                    self.assertEqual(set(z.namelist()), set(pack['resources'] + ['notices/third-party/LICENSE.txt']))
                    self.assertEqual(sum(i.file_size for i in z.infolist()), pack['unpackedSize'])
                offline = packaging.offline_catalog()
                self.assertEqual(offline['themes'][0]['resources'], pack['resources'])
