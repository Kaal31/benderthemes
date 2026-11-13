"""PS4 imports must also work on Decky's Python without xml.etree."""
import subprocess
import sys
import unittest
from pathlib import Path


class Ps4WithoutXml(unittest.TestCase):
    def test_static_and_animation_metadata(self):
        code = '''
import sys
sys.modules['xml.etree'] = None
import ps4_themes as P
r = P._xml(b'<theme><format-version>1</format-version><themecolor>0</themecolor><label>A &amp; B</label></theme>')
assert r.findtext('label') == 'A & B'
assert r.find('format-version') is not None
files = {'scene/background.raf/index.xml': b'<raf><material id="m"><texture file="f.png"/></material><actor id="a" material="m"/><sequence><case wait="1" target="f.png"/></sequence></raf>'}
files['scene/background.raf/f.png'] = b'frame'
assert P._sequence(files.get, list(files)) == [('scene/background.raf/f.png', 1000)]
try:
 P._parse_xml(b'<theme><bad></theme>')
except P.ET.ParseError:
 pass
else:
 raise AssertionError('Malformed XML accepted')
'''
        root = Path(__file__).resolve().parents[1]
        result = subprocess.run([sys.executable, "-c", "import sys;sys.path.insert(0,'py_modules');" + code], cwd=root, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
