import sys
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
from wii_storage import scan_storage, mounted_volumes, device_kind

class StorageTests(unittest.TestCase):
    def test_real_installs_and_device_types(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            libraries = []
            for name, appid in [("internal", "100"), ("sd", "200"), ("usb", "300")]:
                sa = root / name / "steamapps"
                (sa / "common" / "Game").mkdir(parents=True)
                (sa / f"appmanifest_{appid}.acf").write_text(f'"appid" "{appid}" "installdir" "Game" "StateFlags" "4"')
                libraries.append(str(sa))
            (Path(libraries[1]) / "appmanifest_999.acf").write_text('"appid" "999" "installdir" "Absent" "StateFlags" "4"')
            (root / "sys/mmcblk0/device").mkdir(parents=True)
            (root / "sys/mmcblk0/device/type").write_text("SD")
            mounts = [(str(root), "/dev/nvme0n1p8"), (str(root / "sd"), "/dev/mmcblk0p1"), (str(root / "usb"), "/dev/sda1")]
            with patch("wii_storage.shutil.disk_usage", return_value=SimpleNamespace(free=1310720)):
                result = scan_storage(libraries, mounts + [(str(root / "sd"), "/dev/mmcblk0p1")], root / "sys")
            self.assertEqual(result, {"games": {"100": "internal", "200": "sd", "300": "unknown"}, "sdDetected": True, "freeBytes": {"internal": 1310720, "sd": 1310720}})
            self.assertFalse(scan_storage(libraries, [])["sdDetected"])
            self.assertEqual(set(scan_storage(libraries, [])["games"].values()), {"unknown"})

    def test_internal_emmc_is_not_sd(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "mmcblk0/device"
            path.mkdir(parents=True)
            (path / "type").write_text("MMC")
            self.assertEqual(device_kind("/dev/mmcblk0p1", folder), "internal")
            self.assertEqual(device_kind("/dev/mmcblk1p1", folder), "unknown")

    def test_mountinfo_escaped_spaces(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "mountinfo"
            path.write_text(r"42 1 179:1 / /run/media/deck/My\040Card rw - ext4 /dev/mmcblk0p1 rw")
            volumes = mounted_volumes(path)
            self.assertTrue(volumes[0][0].endswith("My Card"))
            self.assertEqual(volumes[0][1], "/dev/mmcblk0p1")

if __name__ == "__main__":
    unittest.main()
