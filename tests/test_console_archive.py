import sys,types,tempfile,tarfile,io,ctypes.util,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import console_archive
@unittest.skipUnless(ctypes.util.find_library('archive'),'System libarchive is not installed')
class ArchiveTests(unittest.TestCase):
 def test_regular_files_and_traversal_rejection(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp)
   for name in ('theme/A.ini','../escape.ini'):
    source=root/'source.tar'
    with tarfile.open(source,'w') as archive:
     info=tarfile.TarInfo(name);info.size=3;archive.addfile(info,io.BytesIO(b'abc'))
    if '..' in name:
     with self.assertRaises(ValueError):console_archive.unpack(source,root/'unsafe')
    else:
     console_archive.unpack(source,root/'safe');self.assertEqual((root/'safe/theme/A.ini').read_bytes(),b'abc')
   self.assertFalse((root/'escape.ini').exists())
 def test_symlinks_are_rejected_before_writing(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);source=root/'links.tar'
   with tarfile.open(source,'w') as archive:
    info=tarfile.TarInfo('link');info.type=tarfile.SYMTYPE;info.linkname='../outside';archive.addfile(info)
   with self.assertRaises(ValueError):console_archive.unpack(source,root/'out')
if __name__=='__main__':unittest.main()
