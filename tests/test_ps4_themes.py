import base64
import asyncio
import struct
import sys
import tempfile
import unittest
import zipfile
import types
import shutil
import zlib
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import ps4_themes

PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")
XML = b'<theme><format-version>4.0</format-version><themecolor>0</themecolor><label>Demo</label><fontcolor>#80402010</fontcolor><focuscolor>#FF00BAFF</focuscolor></theme>'


class Ps4ThemesTest(unittest.TestCase):
    def rar_archive(self, folder, entries):
        def vint(value):
            encoded = bytearray()
            while value >= 128:
                encoded.append((value & 127) | 128)
                value >>= 7
            encoded.append(value)
            return bytes(encoded)

        def block(body):
            header = vint(len(body)) + body
            return struct.pack("<I", zlib.crc32(header)) + header

        raw = b"Rar!\x1a\x07\x01\x00" + block(b"\x01\x00\x00")
        for name, data in entries.items():
            filename = name.encode("utf-8")
            header = b"\x02\x02" + vint(len(data)) + b"\x04" + vint(len(data)) + vint(0o100644)
            header += struct.pack("<I", zlib.crc32(data)) + b"\x00\x01" + vint(len(filename)) + filename
            raw += block(header) + data
        raw += block(b"\x05\x00\x00")
        path = Path(folder, "theme.rar")
        path.write_bytes(raw)
        return path

    def require_rar_reader(self):
        reader = shutil.which("bsdtar") or shutil.which("tar")
        if not reader:
            self.skipTest("bsdtar is not installed")
        import subprocess
        version = subprocess.run([reader, "--version"], capture_output=True).stdout.lower()
        if b"bsdtar" not in version and b"libarchive" not in version:
            self.skipTest("system tar is not libarchive")

    def test_rar_assets_import_repeatability_and_original_preserved(self):
        self.require_rar_reader()
        with tempfile.TemporaryDirectory() as folder:
            downloads = Path(folder, "Downloads-テーマ")
            downloads.mkdir()
            source = self.rar_archive(downloads, {"Wrapped/theme.xml": XML, "Wrapped/texture/background/homescreen.png": PNG})
            original = source.read_bytes()
            skin = ps4_themes.read_ps4_theme(source)
            self.assertEqual(skin["name"], "Demo")
            self.assertTrue(skin["background"].startswith("data:image/png"))
            destination = Path(folder, "skins")
            first = ps4_themes.import_downloads(downloads, destination)
            self.assertEqual(first["errors"], [])
            self.assertEqual(first["imported"], ["theme.zip"])
            self.assertTrue(zipfile.is_zipfile(destination / "theme.zip"))
            self.assertEqual(ps4_themes.fingerprint(source), ps4_themes.fingerprint(destination / "theme.zip"))
            self.assertEqual(ps4_themes.import_downloads(downloads, destination)["existing"], ["theme.zip"])
            self.assertEqual(source.read_bytes(), original)

    def test_rar_rejects_unsafe_paths_and_resource_limits(self):
        self.require_rar_reader()
        with tempfile.TemporaryDirectory() as folder:
            for name in ("../escape", "/escape", "C:/escape", "THEME.XML"):
                source = self.rar_archive(folder, {"theme.xml": XML, name: b"unsafe"})
                self.assertFalse(ps4_themes.peek(source), name)
            source = self.rar_archive(folder, {"theme.xml": XML})
            with patch.object(ps4_themes, "MAX_FILE", 8):
                self.assertFalse(ps4_themes.peek(source))

    def test_rar_missing_reader_and_pkg_only_are_reported(self):
        with tempfile.TemporaryDirectory() as folder:
            source = self.rar_archive(folder, {"theme.xml": XML})
            with patch.object(ps4_themes.shutil, "which", return_value=None):
                result = ps4_themes.import_downloads(folder, Path(folder, "installed"))
                self.assertTrue(any("requires bsdtar" in error for error in result["errors"]))
        self.require_rar_reader()
        with tempfile.TemporaryDirectory() as folder:
            self.rar_archive(folder, {"theme.pkg": b"not extracted"})
            result = ps4_themes.import_downloads(folder, Path(folder, "installed"))
            self.assertEqual(result["imported"], [])
            self.assertTrue(any("theme.xml" in error for error in result["errors"]))

    def test_rar4_archive_is_supported(self):
        self.require_rar_reader()
        def header(kind, flags, data):
            body = struct.pack("<BHH", kind, flags, 7 + len(data)) + data
            return struct.pack("<H", zlib.crc32(body) & 65535) + body
        with tempfile.TemporaryDirectory() as folder:
            filename = b"theme.xml"
            file_data = struct.pack("<IIBIIBBHI", len(XML), len(XML), 3, zlib.crc32(XML), 0, 20, 0x30, len(filename), 0o100644) + filename
            raw = b"Rar!\x1a\x07\x00" + header(0x73, 0, bytes(6)) + header(0x74, 0x8000, file_data) + XML + header(0x7b, 0x4000, b"")
            source = Path(folder, "old.rar")
            source.write_bytes(raw)
            self.assertTrue(ps4_themes.peek(source))

    def test_rar_corruption_and_entry_limits(self):
        self.require_rar_reader()
        with tempfile.TemporaryDirectory() as folder:
            source = self.rar_archive(folder, {"theme.xml": XML, "extra": b"content"})
            with patch.object(ps4_themes, "MAX_FILES", 1):
                self.assertFalse(ps4_themes.peek(source))
            source.write_bytes(b"Rar!\x1a\x07\x01\x00damaged")
            result = ps4_themes.import_downloads(folder, Path(folder, "installed"))
            self.assertFalse(result["imported"])
            self.assertTrue(result["errors"])

    def archive(self, folder, entries):
        path = Path(folder) / "theme.zip"
        with zipfile.ZipFile(path, "w") as archive:
            for name, data in entries.items():
                archive.writestr(name, data)
        return path

    def test_wrapped_zip_assets_and_colors(self):
        with tempfile.TemporaryDirectory() as folder:
            path = self.archive(folder, {"Demo/theme.xml": XML, "Demo/texture/background/HOMESCREEN.PNG": PNG,
                                        "Demo/texture/function_icon/setting.png": PNG,
                                        "Demo/texture/function_icon/setting_glow.png": PNG})
            self.assertTrue(ps4_themes.peek(path))
            skin = ps4_themes.read_ps4_theme(path)
            self.assertEqual(skin["name"], "Demo")
            self.assertEqual(skin["colors"]["text"], "#40201080")
            self.assertEqual(skin["colors"]["focus"], "#00BAFFFF")
            self.assertEqual(skin["icons"]["gear"], skin["background"])
            self.assertIn("gear", skin["glows"])

    def test_folder_fingerprint_changes_with_asset(self):
        with tempfile.TemporaryDirectory() as folder:
            Path(folder, "theme.xml").write_bytes(XML)
            asset = Path(folder, "extra.png")
            asset.write_bytes(PNG)
            first = ps4_themes.fingerprint(folder)
            asset.write_bytes(PNG + b"changed")
            self.assertNotEqual(first, ps4_themes.fingerprint(folder))

    def test_rejects_traversal_and_non_ps4_descriptor(self):
        with tempfile.TemporaryDirectory() as folder:
            for entries in ({"theme.xml": XML, "../escape": b"bad"}, {"theme.xml": b"<theme/>"},
                            {"theme.xml": XML, "other/theme.xml": XML},
                            {"theme.xml": XML, "THEME.XML": XML}):
                self.assertFalse(ps4_themes.peek(self.archive(folder, entries)))

    def test_dynamic_fallback_and_music_disabled(self):
        with tempfile.TemporaryDirectory() as folder:
            path = self.archive(folder, {"theme.xml": XML.replace(b"</theme>", b"<homebgm-enable>False</homebgm-enable></theme>"),
                                        "texture/preview.png": PNG, "scene/background.raf": b"unsupported",
                                        "sound/bgm_home.at9": b"music"})
            skin = ps4_themes.read_ps4_theme(path)
            self.assertTrue(skin["dynamic"])
            self.assertEqual(skin["background"], skin["preview"])
            self.assertTrue(skin["errors"])
            self.assertIsNone(skin["_music"])

    def test_rejects_symlink(self):
        with tempfile.TemporaryDirectory() as folder:
            entry = zipfile.ZipInfo("texture/link.png")
            entry.create_system = 3
            entry.external_attr = 0o120777 << 16
            path = self.archive(folder, {"theme.xml": XML})
            with zipfile.ZipFile(path, "a") as archive:
                archive.writestr(entry, "outside")
            self.assertFalse(ps4_themes.peek(path))

    def test_audio_and_dds(self):
        with tempfile.TemporaryDirectory() as folder:
            header = bytearray(128)
            header[:4] = b"DDS "
            struct.pack_into("<I", header, 4, 124)
            struct.pack_into("<II", header, 12, 4, 4)
            header[84:88] = b"DXT1"
            texture = bytes(header) + struct.pack("<HHI", 0xF800, 0, 0)
            vag = bytearray(48)
            vag[:4] = b"VAGp"
            struct.pack_into(">I", vag, 16, 48000)
            path = self.archive(folder, {"theme.xml": XML, "texture/background/homescreen.dds": texture,
                                        "sound/se_cursor.vag": bytes(vag) + bytes(16), "sound/bgm_home.at9": b"music"})
            skin = ps4_themes.read_ps4_theme(path)
            self.assertTrue(skin["background"].startswith("data:image/png;base64,"))
            self.assertTrue(skin["_sounds"]["se_cursor"].startswith(b"RIFF"))
            self.assertEqual(skin["_music"], b"music")

    def test_rejects_xml_entities_and_oversized_entry(self):
        with tempfile.TemporaryDirectory() as folder:
            path = self.archive(folder, {"theme.xml": b'<!DOCTYPE theme [<!ENTITY name "demo">]>' + XML})
            self.assertFalse(ps4_themes.peek(path))
            path = self.archive(folder, {"theme.xml": XML, "texture/preview.png": PNG})
            original = ps4_themes.MAX_FILE
            try:
                ps4_themes.MAX_FILE = len(XML) - 1
                self.assertFalse(ps4_themes.peek(path))
            finally:
                ps4_themes.MAX_FILE = original

    def test_frame_sequence_order_timing_and_repeated_texture(self):
        with tempfile.TemporaryDirectory() as folder:
            entries = {"theme.xml": XML, "scene/background.raf/first.png": PNG,
                       "scene/background.raf/second.png": PNG,
                       "scene/background.raf/index.xml": b'<raf><case wait="0.04" target="second.png"/><case wait="0.2" target="first.png"/><case wait="1" target="second.png"/></raf>'}
            saved = []
            skin = ps4_themes.read_ps4_theme(self.archive(folder, entries), lambda raw: saved.append(raw) or f"frame{len(saved)}")
            self.assertFalse(skin["errors"])
            self.assertEqual([frame["durationMs"] for frame in skin["animation"]], [40, 200, 1000])
            self.assertEqual([frame["image"] for frame in skin["animation"]], ["frame1", "frame2", "frame1"])
            self.assertEqual(len(saved), 2)
            self.assertEqual(skin["background"], "frame1")

    def test_actor_visibility_sequence(self):
        descriptor = b'''<raf><material id="one"><texture file="one.png"/></material>
        <material id="two"><texture file="two.png"/></material>
        <actor id="first" model="BG" material="one" color="1 1 1 0"/>
        <actor id="second" model="BG" material="two" color="1 1 1 0"/>
        <sequence><case wait="0.041667"><actor id="second" color="1 1 1 0"/><actor id="first" color="1 1 1 1"/></case>
        <case wait="0.1"><actor id="first" color="1 1 1 0"/><actor id="second" color="1 1 1 1"/></case></sequence></raf>'''
        with tempfile.TemporaryDirectory() as folder:
            path = self.archive(folder, {"theme.xml": XML, "scene/background.raf/index.xml": descriptor,
                                        "scene/background.raf/one.png": PNG, "scene/background.raf/two.png": PNG})
            skin = ps4_themes.read_ps4_theme(path)
            self.assertEqual(len(skin["animation"]), 2)
            self.assertEqual(skin["animation"][0]["durationMs"], 41.667)
            self.assertFalse(skin["errors"])

    def test_bad_sequence_keeps_static_fallback(self):
        with tempfile.TemporaryDirectory() as folder:
            for case in (b'<case wait="NaN" target="one.png"/>', b'<case wait="0" target="one.png"/>',
                         b'<case wait="0.1" target="../one.png"/>', b'<case wait="0.1" target="missing.png"/>'):
                path = self.archive(folder, {"theme.xml": XML, "texture/preview.png": PNG,
                                            "scene/background.raf/index.xml": b"<raf>" + case + b"</raf>",
                                            "scene/background.raf/one.png": PNG})
                skin = ps4_themes.read_ps4_theme(path)
                self.assertEqual(skin["animation"], [])
                self.assertEqual(skin["background"], skin["preview"])
                self.assertTrue(skin["errors"])

    def test_sequence_memory_budget(self):
        with tempfile.TemporaryDirectory() as folder:
            path = self.archive(folder, {"theme.xml": XML, "scene/background.raf/one.png": PNG,
                                        "scene/background.raf/index.xml": b'<raf><case wait="1" target="one.png"/></raf>'})
            original = ps4_themes.MAX_FRAME_PIXELS
            try:
                ps4_themes.MAX_FRAME_PIXELS = 0
                skin = ps4_themes.read_ps4_theme(path)
                self.assertEqual(skin["animation"], [])
                self.assertIn("decoded image limits", skin["errors"][0])
            finally:
                ps4_themes.MAX_FRAME_PIXELS = original

    def test_import_downloads_is_repeatable_and_preserves_originals(self):
        with tempfile.TemporaryDirectory() as folder:
            downloads = Path(folder, "Downloads")
            downloads.mkdir()
            source = self.archive(downloads, {"Theme/theme.xml": XML, "Theme/texture/preview.png": PNG})
            original = source.read_bytes()
            extracted = downloads / "Extracted"
            extracted.mkdir()
            (extracted / "theme.xml").write_bytes(XML)
            (downloads / "not-a-theme.zip").write_bytes(b"unrelated")
            destination = Path(folder, "skins", "ps4")
            first = ps4_themes.import_downloads(downloads, destination)
            self.assertEqual(first["imported"], ["Extracted.zip", "theme.zip"])
            self.assertEqual(first["errors"], [])
            self.assertEqual(source.read_bytes(), original)
            self.assertTrue((extracted / "theme.xml").is_file())
            second = ps4_themes.import_downloads(downloads, destination)
            self.assertEqual(second["imported"], [])
            self.assertEqual(second["existing"], first["imported"])
            self.assertEqual(len(list(destination.iterdir())), 2)

    def test_import_downloads_keeps_conflicting_installed_files(self):
        with tempfile.TemporaryDirectory() as folder:
            downloads = Path(folder, "Downloads")
            downloads.mkdir()
            self.archive(downloads, {"theme.xml": XML})
            destination = Path(folder, "ps4")
            destination.mkdir()
            (destination / "theme.zip").write_bytes(b"keep this file")
            result = ps4_themes.import_downloads(downloads, destination)
            self.assertEqual(result["imported"], ["theme (2).zip"])
            self.assertEqual((destination / "theme.zip").read_bytes(), b"keep this file")
            repeated = ps4_themes.import_downloads(downloads, destination)
            self.assertEqual(repeated["existing"], ["theme (2).zip"])
            self.assertFalse(any(name.name.startswith(".ps4-import-") for name in destination.iterdir()))

    def test_import_downloads_rejects_unsafe_archive(self):
        with tempfile.TemporaryDirectory() as folder:
            downloads = Path(folder, "Downloads")
            downloads.mkdir()
            self.archive(downloads, {"theme.xml": XML, "../escape": b"bad"})
            destination = Path(folder, "ps4")
            result = ps4_themes.import_downloads(downloads, destination)
            self.assertEqual(result["imported"], [])
            self.assertFalse(list(destination.iterdir()))

    def test_shared_plane_placement_is_supported(self):
        descriptor = b'''<raf><material id="one"><texture file="one.png"/></material>
        <actor id="first" model="plane" material="one" color="1 1 1 1" position="0 0 9" zsort="back_to_front"/>
        <sequence><case wait="0.06"><actor id="first" color="1 1 1 1"/></case></sequence></raf>'''
        with tempfile.TemporaryDirectory() as folder:
            path = self.archive(folder, {"theme.xml": XML, "scene/background.raf/index.xml": descriptor,
                                        "scene/background.raf/one.png": PNG})
            skin = ps4_themes.read_ps4_theme(path)
            self.assertFalse(skin["errors"])
            self.assertEqual(len(skin["animation"]), 1)

    def test_backend_serves_cached_frames_and_repairs_missing_files(self):
        from test_bundled_skins import load, snapshot_modules, restore_modules
        saved = snapshot_modules()
        try:
            with tempfile.TemporaryDirectory() as folder:
                path = self.archive(folder, {"theme.xml": XML, "scene/background.raf/one.png": PNG,
                                            "scene/background.raf/index.xml": b'<raf><case wait="1" target="one.png"/></raf>'})
                backend = load(folder, folder)
                backend._skin_path = lambda kind, name: str(path)

                async def ready():
                    return True

                backend._ensure_server = ready
                backend._vi = types.SimpleNamespace(url=lambda rel: "http://localhost/" + rel)
                plugin = backend.Plugin()
                first = asyncio.run(plugin.get_ps4_skin("theme.zip"))
                self.assertNotIn("error", first)
                url = first["animation"][0]["image"]
                self.assertTrue(url.startswith("http://localhost/k/ps4-"))
                cached = Path(backend._cache_root(), *url.split("/k/")[1].split("/"))
                self.assertEqual(cached.read_bytes(), PNG)
                cached.unlink()
                second = asyncio.run(plugin.get_ps4_skin("theme.zip"))
                self.assertEqual(second["animation"], first["animation"])
                self.assertEqual(cached.read_bytes(), PNG)

                async def unavailable():
                    return False

                backend._ensure_server = unavailable
                third = asyncio.run(plugin.get_ps4_skin("theme.zip"))
                self.assertEqual(third["animation"], [])
                self.assertIsNone(third["background"])
                self.assertIn("media server", third["errors"][-1])
        finally:
            restore_modules(saved)


if __name__ == "__main__":
    unittest.main()
