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
