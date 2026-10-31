import sys,types,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
sys.modules.setdefault('decky',types.SimpleNamespace())
import background_media
class BackgroundMediaTests(unittest.TestCase):
 def test_reuses_complete_current_pack_and_repairs_missing_video(self):
  with tempfile.TemporaryDirectory() as folder:
   clip=Path(folder)/'castle.webm';clip.write_bytes(b'clip');calls=[]
   store=types.SimpleNamespace(local_inventory=lambda:{'castle':'1.0.3'},resource=lambda _:str(clip),install=lambda ident:calls.append(ident) or {'success':True})
   with patch.dict(sys.modules,{'theme_store':store}),patch.object(background_media,'catalog',return_value={'castle':{'version':'1.0.3','backgroundVideos':['cinematic/castle.webm']}}):
    self.assertTrue(background_media.ensure('castle')['success']);self.assertEqual(calls,[])
    clip.unlink();background_media.ensure('castle');self.assertEqual(calls,['castle'])
    clip.write_bytes(b'clip');store.local_inventory=lambda:{'castle':'1.0.1'};background_media.ensure('castle');self.assertEqual(calls,['castle','castle'])
    background_media.ensure('other');self.assertEqual(calls,['castle','castle'])
if __name__=='__main__':unittest.main()
