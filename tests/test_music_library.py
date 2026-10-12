"""The Music library (main.py _list_music / _music_album) and the media server that streams it: albums with tracks
in subfolders, a soundtrack shipped in two formats, stub files, the loose files of ~/Music, and a rescan that must not
make the tracks being played unreachable (it used to empty the served table first, so the next track 404'd)."""
import asyncio, os, sys, tempfile, types, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "py_modules"))
sys.path.insert(0, str(ROOT))


def snapshot_modules():
    """sys.modules as it is now; restore_modules() puts it back, so a test that installs its own fake `decky`
    (and re-imports main / py_modules against it) cannot leak that into the other test files of one process
    (`python -m unittest discover -s tests`)."""
    return dict(sys.modules)


def restore_modules(saved):
    for name in [n for n in sys.modules if n not in saved]:
        del sys.modules[name]
    sys.modules.update(saved)


def load(plugin_dir, data_dir):
    fake = types.ModuleType("decky")
    fake.DECKY_PLUGIN_DIR = plugin_dir
    for k in ("DECKY_PLUGIN_SETTINGS_DIR", "DECKY_PLUGIN_RUNTIME_DIR", "DECKY_PLUGIN_LOG_DIR", "DECKY_USER_HOME", "DECKY_HOME"):
        setattr(fake, k, data_dir)
    fake.logger = types.SimpleNamespace(**{k: (lambda *a, **k: None) for k in ("info", "error", "warning", "debug")})
    sys.modules["decky"] = fake
    for name, mod in list(sys.modules.items()):  # modules that captured an earlier fake decky
        # real paths: another test may have put "tests/../py_modules" on sys.path, which would never match a plain prefix
        if name == "main" or os.path.realpath(str(getattr(mod, "__file__", "") or "/nonexistent")).startswith(str(ROOT / "py_modules")):
            sys.modules.pop(name, None)
    import main
    return main


def write(path, data=b"x"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)



SONG = b"\0" * (20 * 1024)  # files under 16 KiB are skipped as stubs


class MusicLibraryTests(unittest.TestCase):
    def setUp(self):
        saved = snapshot_modules()
        self.addCleanup(restore_modules, saved)
        self.tmp = tempfile.TemporaryDirectory()
        self.data = os.path.join(self.tmp.name, "home")
        self.main = load(os.path.join(self.tmp.name, "plugin"), self.data)
        self.music = os.path.join(self.data, "Music")
        self.steam = os.path.join(self.data, ".local", "share", "Steam", "steamapps")
        os.makedirs(self.steam)

    def tearDown(self):
        self.tmp.cleanup()

    def albums(self):
        return {a["name"]: a for a in self.main._list_music()}

    def test_subfolders_and_order(self):
        write(os.path.join(self.music, "Album", "01 - Intro.mp3"), SONG)
        write(os.path.join(self.music, "Album", "CD2", "01 Second Disc.mp3"), SONG)
        write(os.path.join(self.music, "Album", "CD2", "02 Last.ogg"), SONG)
        write(os.path.join(self.music, "Album", "notes.txt"), SONG)
        write(os.path.join(self.music, "Album", "02 stub.mp3"), b"x")  # too small to be a song
        a = self.albums()["Album"]
        self.assertEqual([t["title"] for t in a["tracks"]], ["Intro", "Second Disc", "Last"])
        self.assertEqual([t["disc"] for t in a["tracks"]], ["", "CD2", "CD2"])

    def test_soundtrack_in_two_formats_is_listed_once(self):
        lib = os.path.join(self.steam, "music", "Game Soundtrack")
        for fmt, ext in (("MP3", "mp3"), ("FLAC", "flac")):
            for i, name in enumerate(("Theme", "Battle", "Ending"), 1):
                write(os.path.join(lib, fmt, f"{i:02d} {name}.{ext}"), SONG)
        write(os.path.join(lib, "MP3", "04 Bonus.mp3"), SONG)  # only in one format: kept
        a = self.albums()["Game Soundtrack"]
        self.assertEqual([t["title"] for t in a["tracks"]], ["Theme", "Battle", "Ending", "Bonus"])
        self.assertEqual([os.path.splitext(t["file"])[1] for t in a["tracks"]], [".flac", ".flac", ".flac", ".mp3"])

    def test_loose_files_and_folders_of_music(self):
        write(os.path.join(self.music, "a.mp3"), SONG)
        write(os.path.join(self.music, "Sub", "b.mp3"), SONG)
        write(os.path.join(self.music, "Sub", "a.flac"), SONG)  # same title as the loose a.mp3, other album: kept
        al = self.albums()
        self.assertEqual([t["file"] for t in al["Music"]["tracks"]], ["a.mp3"])
        self.assertEqual(sorted(t["file"] for t in al["Sub"]["tracks"]), ["a.flac", "b.mp3"])

    def test_rescan_keeps_tracks_reachable(self):
        write(os.path.join(self.music, "Album", "01 One.mp3"), SONG)
        write(os.path.join(self.music, "Album", "02 Two.mp3"), SONG)
        first = self.albums()["Album"]["tracks"]
        ids = [t["id"] for t in first]
        main = self.main
        seen_during = []
        real_scan = main._scan_music

        def slow_scan(found):  # what the server sees while a scan is running in its worker thread
            seen_during.append(all(main._music_files.get(i) for i in ids))
            return real_scan(found)

        main._scan_music = slow_scan
        try:
            again = self.albums()["Album"]["tracks"]
        finally:
            main._scan_music = real_scan
        self.assertEqual(seen_during, [True])
        self.assertEqual([t["id"] for t in again], ids)  # stable ids: the player's album still points at real files
        self.assertTrue(all(main._music_files.get(i) for i in ids))

    def test_server_streams_a_track_with_ranges(self):
        write(os.path.join(self.music, "Album", "01 One.mp3"), bytes(range(256)) * 100)
        main = self.main

        async def go():
            self.assertTrue(await main._ensure_server())
            t = self.albums()["Album"]["tracks"][0]
            path = t["url"].split(str(main._vi.port), 1)[1]
            r, w = await asyncio.open_connection("127.0.0.1", main._vi.port)
            w.write(f"GET {path} HTTP/1.1\r\nHost: x\r\nRange: bytes=256-511\r\n\r\n".encode())
            await w.drain()
            data = await r.read()
            w.close()
            head, _, body = data.partition(b"\r\n\r\n")
            self.assertIn(b"206 Partial Content", head)
            self.assertIn(b"Content-Type: audio/mpeg", head)
            self.assertEqual(body, bytes(range(256)))
            main._vi.server.close()
            main._vi.server = None

        asyncio.run(go())


if __name__ == "__main__":
    unittest.main()
