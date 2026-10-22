import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import frame_media


class FrameMediaTests(unittest.TestCase):
    def test_registry_contains_only_media(self):
        allowed={".png", ".jpg", ".jpeg", ".gif", ".webp", ".wav", ".mp3", ".ogg", ".oga", ".opus", ".flac", ".m4a", ".mp4", ".webm", ".ttf", ".otf", ".woff", ".woff2"}
        for ident,spec in frame_media.catalog().items():
            self.assertEqual(spec["pack"],ident)
            self.assertTrue(spec["files"])
            for name in spec["files"]:
                self.assertNotIn("..",Path(name).parts)
                # Provenance for the user-provided intro is the sole non-media file in this pack.
                if ident == "old-big-picture" and name == "intro-source.json":
                    continue
                self.assertIn(Path(name).suffix.lower(),allowed)

    def test_download_cached_reuse_and_missing_file_repair(self):
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/"texture.png"
            fake=types.SimpleNamespace(resource=lambda _:str(path),local_inventory=lambda:{"gamecube":"1.0.0"},install=lambda ident:{"success":True,"id":ident})
            with patch.dict(sys.modules,{"theme_store":fake}),patch.object(frame_media,"catalog",return_value={"gamecube":{"pack":"gamecube","version":"1.0.0","files":["texture.png"]}}):
                self.assertEqual(frame_media.ensure("gamecube")["id"],"gamecube")
                path.write_bytes(b"texture")
                self.assertEqual(frame_media.ensure("gamecube"),{"success":True})
                self.assertIsNone(frame_media.resolve("gamecube","../../secret"))
                self.assertIsNone(frame_media.resolve("gamecube","app.js"))
                self.assertEqual(frame_media.ensure("other"),{"success":True})

    def test_missing_native_ui_sound_repairs_the_shared_pack(self):
        with tempfile.TemporaryDirectory() as temp:
            media = Path(temp) / "image.png"
            media.write_bytes(b"image")
            sound = Path(temp) / "navigation.wav"
            installed = []
            fake = types.SimpleNamespace(resource=lambda _: str(sound), local_inventory=lambda: {"old-big-picture": "1.0.1"},
                                         install=lambda ident: installed.append(ident) or {"success": True})
            spec = {"old-big-picture": {"pack": "old-big-picture", "version": "1.0.1", "files": ["image.png"], "soundResources": ["sounds/Old Big Picture UI/navigation.wav"]}}
            with patch.dict(sys.modules, {"theme_store": fake}), patch.object(frame_media, "catalog", return_value=spec), patch.object(frame_media, "resolve", return_value=str(media)):
                self.assertEqual(frame_media.ensure("old-big-picture"), {"success": True})
                self.assertEqual(installed, ["old-big-picture"])
                sound.write_bytes(b"sound")
                frame_media.ensure("old-big-picture")
                self.assertEqual(installed, ["old-big-picture"])

    def test_catalog_media_match_integrity_manifests(self):
        root=Path(__file__).resolve().parents[1]
        packs={p["id"]:p for p in json.loads((root/"asset-catalog.json").read_text())["themes"]}
        for ident,spec in frame_media.catalog().items():
            pack=packs[spec["pack"]]
            self.assertEqual(spec.get("soundResources",[]),pack.get("soundResources",[]))
            self.assertEqual(pack["frameTheme"],ident)
            self.assertEqual(set(pack["resources"]),{"assets/frame-themes/"+ident+"/"+rel for rel in spec["files"]} | set(pack.get("soundResources",[])))


if __name__=="__main__":
    unittest.main()
