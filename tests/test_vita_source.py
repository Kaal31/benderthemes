import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import vita_source as V


class VitaSourceTests(unittest.TestCase):
    def test_nested_case_insensitive_folder_and_zip(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            folder = root / "Theme" / "Nested"
            folder.mkdir(parents=True)
            (folder / "Theme.XML").write_bytes(b"<theme/>")
            (folder / "Picture.PNG").write_bytes(b"art")
            archive = root / "Theme.zip"
            with zipfile.ZipFile(archive, "w") as out:
                out.writestr("Nested/Theme.XML", b"<theme/>")
                out.writestr("Nested/Picture.PNG", b"art")
            for path in (root / "Theme", archive):
                self.assertTrue(V.peek(path))
                with V.open_theme(path) as read:
                    self.assertEqual(read("theme.xml"), b"<theme/>")
                    self.assertEqual(read("picture.png"), b"art")
                    self.assertIsNone(read("../Theme-secret/secret.png"))
                    self.assertIsNone(read("C:\\secret.png"))
                    self.assertIsNone(read("/secret.png"))

    def test_neighbour_and_archive_limits(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            theme = root / "theme"
            theme.mkdir()
            neighbour = root / "theme-secret"
            neighbour.mkdir()
            (neighbour / "secret.png").write_bytes(b"private")
            with V.open_theme(theme) as read:
                self.assertIsNone(read("../theme-secret/secret.png"))
            archive = root / "Theme.zip"
            with zipfile.ZipFile(archive, "w") as out:
                out.writestr("theme.xml", b"<theme/>")
                out.writestr("large.png", b"x" * 10)
            with patch.object(V, "MAX_FILE", 9), V.open_theme(archive) as read:
                with self.assertRaises(ValueError):
                    read("large.png")
            with patch.object(V, "MAX_FILES", 1):
                self.assertFalse(V.peek(archive))


if __name__ == "__main__":
    unittest.main()
