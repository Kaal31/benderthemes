import hashlib
import importlib.util
import struct
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('wad_inspector', Path(__file__).resolve().parents[1] / 'tools/inspect_wii_wad.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def fixture():
    content = b'original test payload'
    ticket = bytearray(0x2a4)
    ticket[:4] = b'\x00\x01\x00\x01'
    ticket[0x1dc:0x1e4] = bytes.fromhex('0000000100000002')
    tmd = bytearray(0x1e4 + 36)
    tmd[:4] = ticket[:4]
    tmd[0x18c:0x194] = ticket[0x1dc:0x1e4]
    struct.pack_into('>HH', tmd, 0x1dc, 514, 1)
    struct.pack_into('>IHHQ', tmd, 0x1e4, 42, 7, 1, len(content))
    tmd[-20:] = hashlib.sha1(content).digest()
    pad = lambda x: bytes(x) + bytes((-len(x)) % 64)
    header = struct.pack('>I4s6I', 32, b'Is\x00\x00', 0, 0, len(ticket), len(tmd), 64, 0)
    return pad(header) + pad(ticket) + pad(tmd) + pad(content), content


class WadInspectorTests(unittest.TestCase):
    def test_index_and_integrity(self):
        data, content = fixture()
        calls = []
        def decrypt(key, iv, encrypted):
            calls.append(iv)
            return encrypted
        metadata, records = module.unpack(data, bytes(16), decrypt)
        self.assertEqual(metadata['version'], 514)
        self.assertEqual(records[0][1], content)
        self.assertEqual(calls[1], b'\x00\x07' + bytes(14))

    def test_corrupt_content_rejected(self):
        data, _ = fixture()
        damaged = bytearray(data)
        damaged[-64] ^= 1
        with self.assertRaisesRegex(ValueError, 'integrity'):
            module.unpack(damaged, bytes(16), lambda k, iv, d: d)

    def test_truncated_sections_rejected(self):
        data, _ = fixture()
        with self.assertRaisesRegex(ValueError, 'Truncated'):
            module.unpack(data[:-20], bytes(16), lambda k, iv, d: d)


if __name__ == '__main__':
    unittest.main()
