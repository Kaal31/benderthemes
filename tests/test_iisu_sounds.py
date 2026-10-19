"""The owner-supplied iiSU sound pack: valid WAVs, mappings point at real flat files, the pack belongs to the iiSU theme pack."""
import json
import sys
import unittest
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
import package_themes  # noqa: E402

PACK = ROOT / "bundle" / "sounds" / "iisu SFX"


class IisuSounds(unittest.TestCase):
    def test_wavs_valid_and_small(self):
        files = sorted(PACK.glob("*.wav"))
        self.assertGreater(len(files), 30)
        for f in files:
            self.assertLess(f.stat().st_size, 800 * 1024, f.name)
            with wave.open(str(f)) as w:
                self.assertGreater(w.getnframes(), 0, f.name)
                self.assertLess(w.getnframes() / w.getframerate(), 8, f.name)

    def test_mappings(self):
        meta = json.loads((PACK / "pack.json").read_text(encoding="utf-8"))
        self.assertEqual(meta["name"], "iisu SFX")
        counts = {"ui_steam_smoother_friend_online.m4a": 6, "ui_steam_smoother_friend_join.m4a": 7, "ui_steam_message_old_smooth.m4a": 11}
        for key, n in counts.items():
            self.assertEqual(len(meta["mappings"][key]), n, key)
            for name in meta["mappings"][key]:
                self.assertNotIn("/", name)  # list_sound_packs lists one folder level
                self.assertTrue((PACK / name).is_file(), name)

    def test_owner(self):
        self.assertEqual(package_themes.owners(Path("sounds/iisu SFX/pack.json")), ["iisu"])
        self.assertEqual(package_themes.owners(Path("sounds/iisu SFX/deck_ui_toast.wav")), ["iisu"])
        self.assertIn("iisu", package_themes.LABELS)
        catalog = json.loads((ROOT / "theme-catalog.json").read_text(encoding="utf-8"))
        pack = [t for t in catalog["themes"] if t["id"] == "iisu"]
        self.assertTrue(pack and pack[0]["theme"] == "iisu")
        remote = next((a for a in package_themes.audio_catalog() if "iisu SFX" in a.get("folders", [])), None)
        if remote:
            self.assertIn(remote["id"], pack[0].get("audioPacks", []))
        else:
            self.assertIn("sounds/iisu SFX/pack.json", pack[0]["resources"])


if __name__ == "__main__":
    unittest.main()
