import hashlib,io,json,logging,sys,tempfile,types,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
sys.modules.setdefault('decky',types.SimpleNamespace(logger=logging.getLogger('test')))
import theme_store as store

class GalleryTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        store.decky.DECKY_PLUGIN_SETTINGS_DIR=self.temp.name
        store.decky.logger=logging.getLogger('gallery-test')
        self.previous=store._catalog;self.addCleanup(setattr,store,'_catalog',self.previous)
    def payload(self,name='vita.gif'):
        stream=io.BytesIO()
        with zipfile.ZipFile(stream,'w') as z:z.writestr(name,b'GIF89a-test')
        data=stream.getvalue();digest=hashlib.sha256(data).hexdigest()
        store._catalog={'gallery':{'sha256':digest,'size':len(data),'url':f'https://github.com/{store.ASSET_REPO}/releases/download/gallery-{digest[:16]}/HubPreviews.zip'}}
        return data
    def test_verified_gallery_is_cached_offline(self):
        data=self.payload()
        with patch.object(store,'urlopen',return_value=io.BytesIO(data)) as request:
            folder=store.gallery();self.assertEqual((folder/'vita.gif').read_bytes(),b'GIF89a-test')
            self.assertEqual(store.gallery(),folder);self.assertEqual(request.call_count,1)
        with patch.object(store,'urlopen',side_effect=OSError('offline')):
            self.assertEqual(store.gallery(),folder)
    def test_bad_checksum_does_not_install(self):
        data=self.payload()
        with patch.object(store,'urlopen',return_value=io.BytesIO(data[:-1]+b'!')):
            self.assertIsNone(store.gallery())
    def test_path_escape_rejected(self):
        data=self.payload('../outside.gif')
        with patch.object(store,'urlopen',return_value=io.BytesIO(data)):
            self.assertIsNone(store.gallery())
        self.assertFalse((Path(self.temp.name)/'outside.gif').exists())
    def test_foreign_host_not_contacted(self):
        self.payload();store._catalog['gallery']['url']='https://example.com/HubPreviews.zip'
        with patch.object(store,'urlopen') as request:
            self.assertIsNone(store.gallery());request.assert_not_called()
