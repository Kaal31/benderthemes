import os,sys,unittest
sys.path.insert(0,os.path.join(os.path.dirname(__file__),'..','py_modules'))
from theme_xml import parse_xml,ThemeXmlError
class XmlTests(unittest.TestCase):
 def test_metadata_case_and_entities(self):
  r=parse_xml(b'<skin><settings><Skin Min="2">A &amp; B</Skin></settings><fonts><font name="ConsoleFont" file="Fonts/a.ttf" /></fonts></skin>')
  self.assertEqual(r.findtext('.//Skin'),'A & B');self.assertEqual(r.findall('.//font')[0].get('file'),'Fonts/a.ttf')
 def test_comments_and_utf16(self):
  r=parse_xml('<skin><!-- info --><Author>Tester</Author></skin>'.encode('utf-16'));self.assertEqual(r.findtext('.//Author'),'Tester')
 def test_incomplete_rejected(self):
  for data in ['<skin><a></skin>','<skin>','<skin/><skin/>','<!DOCTYPE skin><skin/>']:
   with self.assertRaises(ThemeXmlError):parse_xml(data)
 def test_depth_limit(self):
  with self.assertRaises(ThemeXmlError):parse_xml('<n>'*100+'</n>'*100)
if __name__=='__main__':unittest.main()
