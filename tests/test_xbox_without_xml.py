"""Run the actual folder/ZIP skin fixtures with Decky's missing XML module."""
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]


class XboxWithoutXmlTests(unittest.TestCase):
    def test_reader_without_elementtree(self):
        code = '''
import builtins, runpy
original = builtins.__import__
def without_xml(name, *args, **kwargs):
    if name == 'xml.etree' or name.startswith('xml.etree.'):
        raise ModuleNotFoundError("No module named 'xml.etree'")
    return original(name, *args, **kwargs)
builtins.__import__ = without_xml
runpy.run_path('tests/test_xbox_skins.py', run_name='__main__')
import xbox_skins
assert xbox_skins.ET is None
assert xbox_skins._parse('<Skin><Name>A &amp; B</Name></Skin>').tag == 'skin'
try:
    xbox_skins._parse('<x>' * 140)
except ValueError:
    pass
else:
    raise AssertionError('excessive nesting accepted')
'''
        result = subprocess.run([sys.executable, '-c', code], cwd=ROOT, capture_output=True, text=True, timeout=30)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn('xbox skin tests passed', result.stdout)
