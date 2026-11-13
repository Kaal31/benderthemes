import sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from x360_filebrowser import list_folder
class FileBrowserTests(unittest.TestCase):
 def test_listing_and_boundary(self):
  with tempfile.TemporaryDirectory() as home:
   root=Path(home);(root/'folder').mkdir();(root/'game.txt').write_text('test');(root/'.private').write_text('hidden')
   rows=list_folder(home);self.assertEqual([e['name'] for e in rows['entries']],['folder','game.txt']);self.assertEqual(rows['parent'],str(root.resolve()))
   self.assertEqual(list_folder(home,str(root/'folder'))['entries'],[])
   with self.assertRaises(ValueError):list_folder(home,str(root.parent))
