import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import console_themes


class Ps3Sounds(unittest.TestCase):
    def test_layouts_and_broken_entry(self):
        nodes = [("se", entry) for entry in [
            {"id": "mono", "src": "mono"},
            {"id": "left", "left": "left"},
            {"id": "stereo", "left": "left", "right": "right"},
            {"id": "broken", "src": "bad"},
            {"id": "empty"},
        ]]
        def blob(ref):
            if ref == "bad":
                raise ValueError("bad entry")
            return ref.encode()
        with patch.object(console_themes, "vag_to_wav", side_effect=lambda left, right=None: left + (right or b"")):
            result = console_themes.p3t_sounds(b"", nodes, blob)
        self.assertEqual(result, {"mono": b"mono", "left": b"left", "stereo": b"leftright"})


if __name__ == "__main__":
    unittest.main()
