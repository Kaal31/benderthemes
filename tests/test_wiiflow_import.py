import importlib.util
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

spec = importlib.util.spec_from_file_location('wiiflow_import', Path(__file__).resolve().parents[1] / 'tools/import_wiiflow_theme.py')
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class ImportTests(unittest.TestCase):
    def test_zip_case_insensitive_assets_and_manifest(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / 'input.zip'
            with zipfile.ZipFile(source, 'w') as z:
                z.writestr('wiiflow/themes_lite/Test.ini', '[MAIN/BG]\ntexture=BG.PNG\n')
                z.writestr('wiiflow/themes_lite/Test/bg.png', b'asset')
                z.writestr('wiiflow/themes_lite/coverflows/Test.ini', '[_COVERFLOW_1]\nleft_angle=0,70,0\n')
            report = importer.convert(source, root / 'output.zip')
            self.assertEqual(report['assets']['background']['source'], 'BG.PNG')
            self.assertEqual(report['coverflow']['left_angle'], [0, 70, 0])
            with zipfile.ZipFile(root / 'output.zip') as z:
                self.assertTrue(json.loads(z.read('theme.json'))['id'].startswith('wiiflow-input-test-'))
                self.assertEqual(report['provenance']['archiveName'],'input.zip')
                self.assertIn('theme-config.js', z.namelist())

    def test_filename_and_content_identity_and_repository_id(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            for name,angle in [('Carbonik-v1.zip',10),('Carbonik-v2.zip',20)]:
                with zipfile.ZipFile(root/name,'w') as z:z.writestr('Carbonik.ini',f'[MAIN/BG]\n[_COVERFLOW_1]\nleft_angle=0,{angle},0\n')
            first=importer.convert(root/'Carbonik-v1.zip',root/'a.zip')
            again=importer.convert(root/'Carbonik-v1.zip',root/'b.zip')
            second=importer.convert(root/'Carbonik-v2.zip',root/'c.zip')
            self.assertEqual(first['provenance']['identity'],again['provenance']['identity'])
            self.assertNotEqual(first['provenance']['identity'],second['provenance']['identity'])
            with zipfile.ZipFile(root/'Carbonik-v1.zip','w') as z:z.writestr('Carbonik.ini','[MAIN/BG]\n[_COVERFLOW_1]\nleft_angle=0,99,0\n')
            changed=importer.convert(root/'Carbonik-v1.zip',root/'changed.zip')
            self.assertNotEqual(first['provenance']['identity'],changed['provenance']['identity'])
            repo=importer.convert(root/'Carbonik-v1.zip',root/'repo.zip',ident='existing-repo-theme',source_kind='repository')
            self.assertEqual(repo['provenance']['identity'],'existing-repo-theme')

    def test_companion_is_not_borrowed_from_another_release(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);source=root/'source';(source/'edition1').mkdir(parents=True);(source/'edition2').mkdir()
            (source/'edition1/Carbonik.ini').write_text('[MAIN/BG]\n')
            (source/'edition2/Carbonik.ini').write_text('[_COVERFLOW_1]\nleft_angle=0,40,0\n')
            with self.assertRaisesRegex(ValueError,'--coverflow'):importer.convert(source,root/'bad.zip',selected='Carbonik')
            result=importer.convert(source,root/'good.zip',selected='Carbonik',coverflow='edition2/Carbonik.ini')
            self.assertEqual(result['provenance']['coverflowIni'],'edition2/Carbonik.ini')

    def test_legacy_footer_info_and_user_overlays_are_preserved(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);source=root/'Legacy';source.mkdir()
            (source/'Legacy.ini').write_text('[MAIN/BG]\ntexture=bg.png\n[MAIN/QUIT_BTN]\ntexture_normal=quit.png\nx=145\ny=398\nwidth=92\nheight=92\n[MAIN/INFO_BTN]\ntexture_normal=info.png\nx=421\ny=398\nwidth=92\nheight=92\n[MAIN/USER1]\nbackground_texture=footer.png\nx=0\ny=340\nwidth=640\nheight=140\n[_COVERFLOW_1]\ncenter_pos=0,0,1\n')
            for name in ['bg.png','quit.png','info.png','footer.png']:(source/name).write_bytes(b'fixture')
            importer.convert(source,root/'output.zip')
            with zipfile.ZipFile(root/'output.zip') as z:
                config=json.loads(z.read('theme-config.js').decode().split('=',1)[1].rstrip(';'))
                self.assertTrue(config['ui']['infoButton'])
                self.assertEqual(config['ui']['overlays'][0]['y'],340)
                style=z.read('style.css').decode()
                self.assertIn('footer #imported-info{left:403px;top:-2px;width:92px;height:92px}',style)
                self.assertIn('MAIN/QUIT_BTN/texture_normal',json.loads(z.read('import-report.json'))['assets'])

    def test_rejects_traversal(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            with zipfile.ZipFile(root / 'bad.zip', 'w') as z:
                z.writestr('../escape.ini', 'bad')
            with self.assertRaises(ValueError):
                importer.unpack(root / 'bad.zip', root / 'unpack')
            self.assertFalse((root / 'escape.ini').exists())

    def test_legacy_embedded_modes_and_selected_motion(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / 'source'
            source.mkdir()
            (source / 'Legacy.ini').write_text('[MAIN/BG]\ntexture=\n[_COVERFLOW_1]\nrows=3\ncolumns=9\ncamera_pos=0,1,8\ncover_osc_amp=1,2,3\n[_COVERFLOW_1_S]\ncenter_angle=0,380,0\nflip_angle=0,160,0\n[_COVERFLOW_2]\nrows=1\nleft_angle=0,90,0\n')
            report = importer.convert(source, root / 'output.zip')
            self.assertEqual(len(report['modes']), 2)
            self.assertEqual(report['modes'][0]['browse']['rows'], 3)
            self.assertEqual(report['modes'][0]['selected']['center_angle'], [0, 380, 0])

    def test_reports_missing_assets(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / 'source'
            source.mkdir()
            (source / 'Test.ini').write_text('[MAIN/BG]\ntexture=missing.png\n')
            report = importer.convert(source, root / 'output.zip')
            self.assertTrue(any('missing.png' in w for w in report['warnings']))


if __name__ == '__main__':
    unittest.main()
