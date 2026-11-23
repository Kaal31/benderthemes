"""The real catalog RPC remains usable when an importer cannot be imported."""
import asyncio
import builtins
import importlib.util
import json
import logging
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'py_modules'))


class CatalogRpcTests(unittest.TestCase):
    def test_catalog_is_independent_and_browse_reports_import_failure(self):
        fake = types.SimpleNamespace(logger=logging.getLogger('catalog-rpc-test'))
        spec = importlib.util.spec_from_file_location('catalog_rpc_main', ROOT / 'main.py')
        module = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, {'decky': fake}):
            spec.loader.exec_module(module)
        original_import = builtins.__import__

        def blocked_import(name, *args, **kwargs):
            if name in ('theme_sources', 'html', 'urllib.request', 'unicodedata'):
                raise ModuleNotFoundError('No module named ' + repr(name))
            return original_import(name, *args, **kwargs)

        with patch('builtins.__import__', side_effect=blocked_import):
            result = asyncio.run(module.Plugin().theme_sources())
            self.assertEqual(len(result['kinds']), 11)
            ps3 = next(k for k in result['kinds'] if k['id'] == 'p3t')
            self.assertIn('themezer', ps3['sources'])
            self.assertEqual(result['sources']['themezer']['name'], 'Themezer')
            json.dumps(result)
            with self.assertLogs('catalog-rpc-test', level='ERROR'):
                page = asyncio.run(module.Plugin().theme_sources_browse('p3t', 'themezer'))
            self.assertIn('ModuleNotFoundError', page['error'])
            self.assertIn('theme_sources', page['error'])
            self.assertEqual(page['items'], [])
            self.assertEqual(page['source']['name'], 'Themezer')
