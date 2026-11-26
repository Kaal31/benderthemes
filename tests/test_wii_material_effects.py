import math
import struct
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import wii_layout

def document(material):
    section=b'mat1'+struct.pack('>IHHI',16+len(material),1,0,16)+material
    return b'RLYT'+struct.pack('>HHIHH',0xfeff,8,16+len(section),16,1)+section

def material(selector=1,truncate=0):
    flags=2|(1<<13)|(1<<15)|(1<<18)|(1<<25)|(1<<27)
    header=b'Effect'+bytes(14)+bytes(40)+struct.pack('>I',flags)
    maps=struct.pack('>HBBHBB',0,0,0,1,0,0)
    channel=bytes([0,1,0,0]);color=bytes([128,64,255,128])
    srt=struct.pack('>5f',.25,.5,45,1,2);indirect=bytes([0,1,1,2])
    tev=bytes([0,4,0,0,143,252,0,1,71,118,0,1,0,(selector<<3)|3,0,0])
    result=header+maps+channel+color+srt+indirect+tev
    return result[:-truncate] if truncate else result

class WiiMaterialEffectTests(unittest.TestCase):
    def test_indirect_matrix_animation_is_retained(self):
        keys=struct.pack('>3f',0,1,0)+struct.pack('>3f',60,2,0)
        track=struct.pack('>BBBBHHI',0,3,2,0,2,0,12)+keys
        tag=b'RLIM'+bytes([1,0,0,0])+struct.pack('>I',12)+track
        animator=b'Effect'+bytes(14)+bytes([1,1,0,0])+struct.pack('>I',28)+tag
        body=struct.pack('>HBBHHI',60,1,0,0,1,20)+struct.pack('>I',24)+animator
        section=b'pai1'+struct.pack('>I',8+len(body))+body
        source=b'RLAN'+struct.pack('>HHIHH',0xfeff,8,16+len(section),16,1)+section
        parsed=wii_layout.animation(source)
        self.assertFalse(parsed['warnings'])
        self.assertEqual(parsed['tracks'][0]['type'],'RLIM')
        self.assertTrue(parsed['tracks'][0]['material'])
        self.assertEqual(parsed['tracks'][0]['keys'][1],[60,2,0])

    def test_indirect_tables_and_channel_control_are_retained(self):
        parsed=wii_layout.layout(document(material()))
        data=parsed['materials'][0]
        self.assertEqual(data['channelControl'],[0,1])
        self.assertEqual(data['color'],[128,64,255,128])
        self.assertEqual(data['indirectSrt'],[[.25,.5,45,1,2]])
        self.assertEqual(data['indirectStages'],[[0,1,1,2]])
        self.assertEqual(data['tev'][0]['channel'],4)
        self.assertFalse(parsed['warnings'])

    def test_truncated_indirect_data_is_rejected(self):
        for cut in (17,21,23,30,40):
            with self.subTest(cut=cut),self.assertRaises(ValueError):
                wii_layout.layout(document(material(truncate=cut)))

    def test_nonfinite_indirect_matrix_is_rejected(self):
        raw=bytearray(material());struct.pack_into('>f',raw,80,math.nan)
        with self.assertRaises(ValueError):wii_layout.layout(document(raw))

    def test_dynamic_matrix_is_explicitly_reported(self):
        parsed=wii_layout.layout(document(material(selector=5)))
        self.assertTrue(any('dynamic indirect matrix' in value for value in parsed['warnings']))

    def test_supported_bump_alpha_does_not_report_a_false_gap(self):
        raw=bytearray(material());raw[-15]=8;raw[-1]=16
        parsed=wii_layout.layout(document(raw))
        self.assertFalse(any('bump' in warning for warning in parsed['warnings']))

    def test_logic_operation_is_named_when_present(self):
        raw=bytearray(material());flags=struct.unpack_from('>I',raw,60)[0]
        struct.pack_into('>I',raw,60,flags|(1<<24));raw.extend([2,1,0,6])
        parsed=wii_layout.layout(document(raw))
        self.assertTrue(any('logic operation 6' in warning for warning in parsed['warnings']))

if __name__=='__main__':unittest.main()
