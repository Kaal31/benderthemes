import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import asyncio
import logging
import sys
import types
from urllib.parse import urlsplit

spec = importlib.util.spec_from_file_location('themedeck', Path(__file__).parents[1] / 'py_modules/themedeck.py')
td = importlib.util.module_from_spec(spec)
spec.loader.exec_module(td)


class Reader(unittest.TestCase):
    def test_assigned_only_readonly_and_revocation(self):
        with tempfile.TemporaryDirectory() as tmp:
            settings = Path(tmp) / 'DeckHomeThemes'
            folder = Path(tmp) / 'ThemeDeck'
            folder.mkdir()
            audio = Path(tmp) / 'song.mp3'
            audio.write_bytes(b'ID3 sample')
            manifest = folder / 'tracks.json'
            data = {'10': {'path': str(audio), 'volume': .6, 'start_offset': 4, 'loop': False}}
            manifest.write_text(json.dumps(data), encoding='utf-8')
            before = manifest.read_bytes()
            track = td.assignment(settings, 10)
            self.assertEqual(track['volume'], .6)
            self.assertEqual(track['startOffset'], 4)
            self.assertFalse(track['loop'])
            self.assertEqual(td.resolve(settings, 10, track['signature']), str(audio.resolve()))
            self.assertIsNone(td.resolve(settings, 10, 'wrong'))
            for value in [True, '10', '../10', -1, 0, 2**32, 11]:
                self.assertIsNone(td.assignment(settings, value))
            self.assertEqual(manifest.read_bytes(), before)
            manifest.write_text('{}', encoding='utf-8')
            self.assertIsNone(td.resolve(settings, 10, track['signature']))

    def test_bad_assignments_and_settings(self):
        with tempfile.TemporaryDirectory() as tmp:
            settings = Path(tmp) / 'DeckHomeThemes'
            manifest = td.manifest_path(settings)
            manifest.parent.mkdir()
            self.assertIsNone(td.assignment(settings, 10))
            for text in ['broken', '[]', '{"10":null}', '{"10":{"path":"missing.mp3"}}']:
                manifest.write_text(text, encoding='utf-8')
                self.assertIsNone(td.assignment(settings, 10))
            audio = Path(tmp) / 'song.wav'
            audio.write_bytes(b'RIFF sample')
            manifest.write_text(json.dumps({'10': {'path': str(audio), 'volume': -20, 'start_offset': 100}}), encoding='utf-8')
            track = td.assignment(settings, 10)
            self.assertEqual(track['volume'], 0)
            self.assertEqual(track['startOffset'], 30)
            self.assertTrue(track['loop'])
            secret = Path(tmp) / 'settings.json'
            secret.write_text('{}')
            manifest.write_text(json.dumps({'10': {'path': str(secret)}}))
            self.assertIsNone(td.assignment(settings, 10))


class Backend(unittest.IsolatedAsyncioTestCase):
    async def test_stream_range_and_revocation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(__file__).parents[1]
            settings = Path(tmp) / 'DeckHomeThemes'
            manifest = td.manifest_path(settings)
            manifest.parent.mkdir()
            audio = Path(tmp) / 'song.mp3'
            audio.write_bytes(b'ID3 bounded track bytes')
            manifest.write_text(json.dumps({'10': {'path': str(audio)}}), encoding='utf-8')
            sys.modules['decky'] = types.SimpleNamespace(DECKY_PLUGIN_DIR=str(root), DECKY_PLUGIN_SETTINGS_DIR=str(settings), DECKY_PLUGIN_RUNTIME_DIR=tmp, logger=logging.getLogger('test'))
            sys.path.insert(0, str(root / 'py_modules'))
            spec = importlib.util.spec_from_file_location('themedeck_host_test', root / 'main.py')
            host = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(host)
            try:
                track = await host.Plugin().themedeck_track(10)
                self.assertNotIn('path', track)
                self.assertNotIn('signature', track)
                url = urlsplit(track['url'])
                async def fetch(range_header=''):
                    reader, writer = await asyncio.open_connection('127.0.0.1', url.port)
                    writer.write(f'GET {url.path} HTTP/1.1\r\nHost: localhost\r\n{range_header}\r\n'.encode())
                    await writer.drain()
                    response = await reader.read()
                    writer.close()
                    await writer.wait_closed()
                    return response
                response = await fetch('Range: bytes=0-2\r\n')
                self.assertTrue(response.startswith(b'HTTP/1.1 206'))
                self.assertEqual(response.split(b'\r\n\r\n')[1], b'ID3')
                manifest.write_text('{}', encoding='utf-8')
                self.assertTrue((await fetch()).startswith(b'HTTP/1.1 404'))
            finally:
                if host._vi.server:
                    host._vi.server.close()
                    await host._vi.server.wait_closed()
                sys.path.pop(0)


if __name__ == '__main__': unittest.main()
