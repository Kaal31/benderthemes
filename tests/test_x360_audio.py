import os,sys,tempfile,unittest,subprocess
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,'py_modules');import x360_audio as A
class AudioTests(unittest.TestCase):
 def tearDown(self):A.configure()
 def test_missing_decoder(self):
  with patch.dict(os.environ,{},clear=True),patch('shutil.which',return_value=None):self.assertIsNone(A.decode(b'RIFF'+b'0'*60,'a.xma'))
 def test_invalid_container(self):
  with self.assertRaises(ValueError):A.decode(b'not audio','a.xma')
 def test_conversion_is_cached(self):
  with tempfile.TemporaryDirectory() as folder:
   A.configure(ffmpeg='decoder',cache=folder)
   def run(command,**kwargs):Path(command[-1]).write_bytes(b'OggS'+b'0'*500);return subprocess.CompletedProcess(command,0)
   with patch('subprocess.run',side_effect=run) as decoder:
    first=A.decode(b'RIFF'+b'1'*60,'a.xma');second=A.decode(b'RIFF'+b'1'*60,'a.xma');self.assertEqual(first,second);self.assertTrue(first.startswith('data:audio/ogg;'));self.assertEqual(decoder.call_count,1)
 def test_failed_output_not_cached(self):
  with tempfile.TemporaryDirectory() as folder:
   A.configure(ffmpeg='decoder',cache=folder)
   with patch('subprocess.run',return_value=subprocess.CompletedProcess([],1)):
    with self.assertRaises(ValueError):A.decode(b'RIFF'+b'2'*60,'a.xma')
   self.assertFalse(list(Path(folder).glob('*.ogg')))
if __name__=='__main__':unittest.main()
