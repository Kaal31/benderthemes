import copy
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'py_modules'))
import psp_scene
import x360_coverflow
import xbox_layout
import ps4_scene
import xml.etree.ElementTree as ET

class ImporterResourceTests(unittest.TestCase):
    def test_ps4_overlapping_property_transitions_and_interruption(self):
        source='''<raf><material id="m"><texture file="a.png"/></material><actor id="a" material="m"/>
        <sequence><case wait="1"><actor id="a" position="8 0 0" trans_time="4"/></case>
        <case wait="1"><actor id="a" color="1 1 1 0" trans_time="2"/></case>
        <case wait="1"><actor id="a" position="10 0 0" trans_time="2"/></case><case wait="1"/></sequence></raf>'''
        result=ps4_scene.read_scene(ET.fromstring(source),lambda _: 'image')
        states={row['at']:row['state'] for row in result['layers'][0]['states']}
        self.assertEqual(states[1000]['position'],[2,0,0])
        self.assertEqual(states[2000]['position'],[4,0,0])
        self.assertEqual(states[3000]['position'],[7,0,0])
        self.assertEqual(states[2000]['color'],[1,1,1,.5])
        self.assertEqual(states[4000]['position'],[10,0,0])
        self.assertFalse(result['warnings'])

    def test_ps4_instant_changes_keep_a_discontinuous_key(self):
        source='<raf><material id="m"><texture file="a.png"/></material><actor id="a" material="m"/><case wait="1"/><case wait="1"><actor id="a" color="1 1 1 0"/></case></raf>'
        scene=ps4_scene.read_scene(ET.fromstring(source),lambda _: 'image')
        keys=[row['state']['color'][3] for row in scene['layers'][0]['states'] if row['at']==1000]
        self.assertEqual(keys,[1,0])
    def test_xbmc_named_colors_and_font_metrics(self):
        class Source:
            root=''
            names={n:n for n in ('720p/home.xml','720p/font.xml','colors/defaults.xml')}
        files={'720p/home.xml':'<window><controls><control type="label"><label>Title</label><font>titleFont</font><textcolor>accent</textcolor></control><control type="list"><width>100</width><height>100</height></control></controls></window>',
               '720p/font.xml':'<fonts><fontset><font><name>titleFont</name><size>32</size><style>bold italic</style></font></fontset></fonts>',
               'colors/defaults.xml':'<colors><color name="accent">base</color><color name="base">80204060</color></colors>'}
        result=xbox_layout.read_layout(Source(),'xbmc',lambda name:ET.fromstring(files[name]),lambda _:None)
        node=result['nodes'][0]
        self.assertEqual(node['color'],'#20406080')
        self.assertEqual(node['fontSize'],32)
        self.assertEqual((node['fontWeight'],node['fontStyle']),('bold','italic'))
    def test_xbmc_bindings_and_button_destinations(self):
        class Source:
            root=''
            names={'home.xml':'home.xml'}
        source='''<window><controls>
        <control type="image"><texture>$INFO[ListItem.Thumb]</texture></control>
        <control type="button"><label>Settings</label><onclick>ActivateWindow(Settings)</onclick></control>
        <control type="button"><label>Bad</label><onclick>RunScript(arbitrary.py)</onclick></control>
        <control type="list"><width>300</width><height>200</height><itemlayout><control type="image"><info>ListItem.Icon</info></control></itemlayout></control>
        </controls></window>'''
        result=xbox_layout.read_layout(Source(),'xbmc',lambda _:ET.fromstring(source),lambda _:None)
        self.assertEqual(result['nodes'][0]['imageSource'],'$INFO[ListItem.Thumb]')
        self.assertEqual(result['nodes'][1]['destination'],'settings')
        self.assertNotIn('destination',result['nodes'][2])
        self.assertEqual(result['menu']['itemArt'][0]['imageSource'],'ListItem.Icon')
        self.assertFalse(any('Missing layout image' in w for w in result['warnings']))
        self.assertTrue(any('Unsupported XBMC button command' in w for w in result['warnings']))
    def test_xbmc_shared_includes_and_constant_visibility(self):
        class Source:
            root=''
            names={'720p/home.xml':'720p/home.xml','720p/includes.xml':'720p/includes.xml'}
        files={'720p/home.xml':'<window><controls><include>shared</include><control type="label"><visible>false</visible><label>hidden</label></control></controls></window>',
               '720p/includes.xml':'<includes><include name="shared"><control type="group"><visible>Window.IsActive(home)</visible><control type="label"><label>shown</label></control><control type="list"><width>300</width><height>240</height></control></control></include></includes>'}
        result=xbox_layout.read_layout(Source(),'xbmc',lambda name:ET.fromstring(files[name]),lambda name:None)
        self.assertIsNotNone(result)
        self.assertEqual([node['text'] for node in result['nodes']],['shown'])
        self.assertFalse(result['partial'])
    def test_one_bad_psp_image_does_not_discard_good_resources(self):
        source = {'pages': {'page_bg': []}, 'anims': {}, 'images': {'bad': (7,b'x'), 'good': (1,b'y')}, 'models': {'mdl_bg': (0,b'z')}}
        def decode(fmt, raw):
            if fmt == 7:
                raise ValueError('truncated image')
            return 'data:good'
        with patch.object(psp_scene, 'rco_scene', return_value=source), patch.object(psp_scene, '_wave_json', return_value={'tex':None}):
            result = psp_scene.psp_scene(b'', decode, lambda *args:b'')
        self.assertEqual(result['images'], {'good':'data:good'})
        self.assertIn('bad (7)', result['warnings'][0])

    def test_coverflow_lighting_and_oscillation_vectors_are_validated(self):
        base = {'modes':[{'covers':{}}]}
        for field, value in [('light', {'material':{'diffuse':[1,1]}}), ('mirror', {'offset':'bad'}), ('covers', {'oscillation':{'angle':{'speed':[True,0,1]}}})]:
            data=copy.deepcopy(base);data['modes'][0][field]=value
            with self.subTest(field=field), self.assertRaises(ValueError):
                x360_coverflow.read_layout(json.dumps(data))
        data=copy.deepcopy(base);data['modes'][0]['light']={'material':{'diffuse':[.5,1,.7]}}
        self.assertEqual(x360_coverflow.read_layout(json.dumps(data)), data)

if __name__ == '__main__':
    unittest.main()
