import ssl
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'py_modules'))
import theme_network as network

class NetworkTests(unittest.TestCase):
    def tearDown(self):
        network.ssl_context.cache_clear()

    def test_embedded_python_loads_system_ca(self):
        network.ssl_context.cache_clear()
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        with tempfile.TemporaryDirectory() as folder:
            cert = Path(folder) / 'system.pem'
            cert.touch()
            with patch.object(network, 'CA_FILES', (str(cert),)), patch.object(network.ssl, 'create_default_context', return_value=context), patch.object(ssl.SSLContext, 'load_verify_locations') as load:
                actual = network.ssl_context()
                load.assert_called_once_with(cafile=str(cert))
                self.assertTrue(actual.check_hostname)
                self.assertEqual(actual.verify_mode, ssl.CERT_REQUIRED)

    def test_download_uses_verified_context(self):
        with patch.object(network, '_urlopen') as request:
            network.urlopen('https://github.com', timeout=7)
            options = request.call_args.kwargs
            self.assertEqual(options['timeout'], 7)
            self.assertTrue(options['context'].check_hostname)
            self.assertEqual(options['context'].verify_mode, ssl.CERT_REQUIRED)

    def test_audio_download_uses_system_ca_helper(self):
        import deckthemes_audio as audio
        self.assertIs(audio.urlopen, network.urlopen)
        with patch.object(network, '_urlopen') as request:
            response = request.return_value.__enter__.return_value
            response.geturl.return_value = audio.API + '/themes/example'
            response.headers = {}
            response.read.return_value = b'{}'
            self.assertEqual(audio.request('/themes/example', 1024), b'{}')
            options = request.call_args.kwargs
            self.assertTrue(options['context'].check_hostname)
            self.assertEqual(options['context'].verify_mode, ssl.CERT_REQUIRED)
