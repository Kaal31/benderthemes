import os,sys,unittest
sys.path.insert(0,os.path.join(os.path.dirname(__file__),'..','py_modules'))
from x360_effects import runtime_warnings
class RuntimeWarningsTests(unittest.TestCase):
 def test_no_code_no_warning(self):self.assertEqual(runtime_warnings({'scripts':[],'plugins':[],'shaders':[]}),[])
 def test_supported_effect_no_warning(self):self.assertEqual(runtime_warnings({'scripts':[],'plugins':[],'shaders':[{'path':'Wallpaper.fx','status':'supported-periodic-effect'}]}),[])
 def test_only_present_features_reported(self):
  result=runtime_warnings({'scripts':[],'plugins':[],'shaders':[{'path':'Custom.fx','status':'unsupported'},{'path':'Cover.fx','status':'material-approximation'}]})
  self.assertEqual(len(result),2);self.assertIn('Custom.fx',result[0]);self.assertIn('approximation',result[1]);self.assertNotIn('binary',' '.join(result))
 def test_actual_code_paths_reported(self):
  result=runtime_warnings({'scripts':['a.lua'],'plugins':['b.xex'],'shaders':[]});self.assertIn('a.lua',result[0]);self.assertIn('b.xex',result[1])
if __name__=='__main__':unittest.main()
