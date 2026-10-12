"""Plugin Spotlight search backend: download, normalise, dedupe, cache. No network: every fetch is a fixture."""
import io
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import plugin_catalog as pc


def row(repo, name, author="", **extra):
    base = {
        "repo": repo, "url": f"https://github.com/{repo}",
        "plugin": {"name": name, "author": author, "flags": extra.pop("flags", []),
                   "publish": {"tags": extra.pop("tags", ["audio"]), "description": extra.pop("description", "A plugin."),
                               "image": extra.pop("image", "https://example.com/i.png")}},
        "plugin_path": "plugin.json", "default_branch": "main", "stars": extra.pop("stars", 1), "archived": False,
        "readme": {"path": "README.md", "html_url": f"https://github.com/{repo}/blob/main/README.md", "markdown": extra.pop("markdown", "# Hi")},
        "install_script": None, "downloads": 3, "latest_release": {"tag": "v1", "published_at": "2025-01-01T00:00:00Z"},
    }
    base.update(extra)
    return base


FIXTURE = [
    row("Alice/Tuner", "Tuner", "Alice", flags=["root"], stars=40),
    row("bob/Lights", "Lights", "bob", flags=["debug", "_root"], archived=True),
    # the same repository spelled differently: dropped
    dict(row("alice/tuner", "Tuner (copy)", "Alice"), url="https://www.github.com/ALICE/Tuner.git/"),
    # a fork: same name and author, another repository
    row("someone/Tuner", "tuner", "alice", stars=2),
    # not GitHub / malformed rows: skipped
    dict(row("x/y", "Elsewhere"), url="https://gitlab.com/x/y", repo="https://gitlab.com/x/y"),
    "nonsense", {"url": 5},
    # unedited template copies are not forks of one another
    row("t1/a", "Example Plugin", "Template Author"), row("t2/b", "Example Plugin", "Template Author"),
]


class Normalise(unittest.TestCase):
    def setUp(self):
        self.entries = pc.normalise(json.loads(json.dumps(FIXTURE)))
        self.by_repo = {e["repo"]: e for e in self.entries}

    def test_fields_and_flags(self):
        self.assertEqual(set(self.by_repo), {"Alice/Tuner", "bob/Lights", "someone/Tuner", "t1/a", "t2/b"})
        tuner = self.by_repo["Alice/Tuner"]
        self.assertEqual((tuner["name"], tuner["author"], tuner["stars"], tuner["root"], tuner["key"]), ("Tuner", "Alice", 40, True, "alice/tuner"))
        self.assertEqual(tuner["url"], "https://github.com/Alice/Tuner")
        self.assertEqual(tuner["readmeUrl"], "https://github.com/Alice/Tuner/blob/main/README.md")
        lights = self.by_repo["bob/Lights"]
        self.assertFalse(lights["root"], "_root is a disabled flag")
        self.assertTrue(lights["archived"])

    def test_dedupe_by_repo_spelling_and_forks(self):
        self.assertEqual(sum(e["key"] == "alice/tuner" for e in self.entries), 1)
        self.assertEqual(self.by_repo["someone/Tuner"]["forkOf"], "Alice/Tuner")
        self.assertNotIn("forkOf", self.by_repo["Alice/Tuner"])
        self.assertNotIn("forkOf", self.by_repo["t1/a"])
        self.assertNotIn("forkOf", self.by_repo["t2/b"])

    def test_unsafe_values_dropped(self):
        bad = row("a/b", "B", image="http://insecure.example/i.png")
        bad["readme"]["html_url"] = "https://evil.example/a/b"
        entry = pc.normalise([bad])[0]
        self.assertEqual((entry["image"], entry["readmeUrl"]), ("", ""))
        with self.assertRaises(ValueError):
            pc.normalise("not a list")

    def test_release_zip_only_from_same_repo(self):
        self.assertEqual(self.by_repo["Alice/Tuner"]["zipUrl"], "", "the explorer data names no assets today")
        ok = "https://github.com/Alice/Tuner/releases/download/v1.2/Tuner.zip"
        self.assertEqual(pc.release_zip({"assets": [{"browser_download_url": "https://github.com/Alice/Tuner/releases/download/v1.2/x.tar.gz"},
                                                    {"browser_download_url": ok}]}, "alice/tuner"), ok)
        for bad in ("https://github.com/Mallory/Tuner/releases/download/v1/Tuner.zip", "http://github.com/Alice/Tuner/releases/download/v1/Tuner.zip",
                    "https://example.com/Alice/Tuner/releases/download/v1/Tuner.zip", "https://github.com/Alice/Tuner/archive/main.zip"):
            self.assertEqual(pc.release_zip({"zip_url": bad}, "alice/tuner"), "", bad)
        self.assertEqual(pc.release_zip(None, "alice/tuner"), "")
        entry = pc.normalise([dict(row("Alice/Tuner", "Tuner"), latest_release={"tag": "v1.2", "zip_url": ok})])[0]
        self.assertEqual((entry["zipUrl"], entry["release"]), (ok, "v1.2"))

    def test_repo_key_spellings(self):
        for spelling in ("https://github.com/Owner/Repo", "https://www.github.com/owner/repo.git/", "http://github.com/OWNER/repo/tree/main/sub",
                         "github.com/owner/repo#readme", "owner/repo", "https://github.com/owner/repo/releases/download/v1/x.zip"):
            self.assertEqual(pc.repo_key(spelling), "owner/repo", spelling)
        for other in ("https://gitlab.com/owner/repo", "https://github.com/owner", "", None):
            self.assertEqual(pc.repo_key(other), "")
        self.assertEqual(pc.name_key(" Deck-Cord ", "Marios"), pc.name_key("deckcord", "marios"))


class Readme(unittest.TestCase):
    def test_strip(self):
        md = ("# Title\n\n[![badge](https://img.shields.io/x.svg)](https://x)\n![shot](https://i/x.png)\n<p align=center>Hello <b>world</b></p>\n"
              "<!-- hidden -->\n- [Install](#install)\n- [Usage](#usage)\n\nSee [the docs](https://docs.example) now.\n\n\n\nEnd")
        text = pc.strip_readme(md)
        for gone in ("shields", "x.png", "<", "hidden", "#install", "https://docs"):
            self.assertNotIn(gone, text)
        self.assertIn("Hello world", text)
        self.assertIn("See the docs now.", text)
        self.assertNotIn("\n\n\n", text)

    def test_truncated(self):
        text = pc.strip_readme("word " * 2000)
        self.assertLessEqual(len(text), pc.README_CHARS + 2)
        self.assertTrue(text.endswith("…"))
        self.assertEqual(pc.strip_readme(None), "")


class Cache(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = self.tmp.name
        self.calls = 0
        self.clock = 1_000_000.0

    def tearDown(self):
        self.tmp.cleanup()

    def fetch_ok(self):
        self.calls += 1
        return json.loads(json.dumps(FIXTURE))

    def fetch_fail(self):
        self.calls += 1
        raise OSError("offline")

    def run_catalog(self, fetch, refresh=False):
        return pc.catalog(self.dir, refresh, fetch=fetch, now=lambda: self.clock)

    def test_fetch_cache_ttl_and_offline(self):
        first = self.run_catalog(self.fetch_ok)
        self.assertEqual((len(first["entries"]), first["error"], self.calls), (5, "", 1))
        self.assertIn("safetzahirovic", first["source"]["name"])
        self.assertTrue(os.path.isfile(os.path.join(self.dir, pc.CACHE_NAME)))
        self.clock += 3600  # within the TTL: served from the cache
        self.assertEqual(len(self.run_catalog(self.fetch_fail)["entries"]), 5)
        self.assertEqual(self.calls, 1)
        self.clock += pc.CACHE_TTL  # expired and offline: the saved copy with a note
        stale = self.run_catalog(self.fetch_fail)
        self.assertEqual((len(stale["entries"]), stale["stale"], self.calls), (5, True, 2))
        self.assertIn("saved copy", stale["error"])
        self.run_catalog(self.fetch_ok, refresh=True)  # refresh always downloads
        self.assertEqual(self.calls, 3)

    def test_no_cache_and_offline(self):
        result = self.run_catalog(self.fetch_fail)
        self.assertEqual((result["entries"], result["stale"]), ([], True))
        self.assertIn("Could not update", result["error"])

    def test_bad_payload_keeps_cache(self):
        self.run_catalog(self.fetch_ok)
        self.clock += pc.CACHE_TTL + 1
        result = self.run_catalog(lambda: {"unexpected": True})
        self.assertEqual(len(result["entries"]), 5)
        self.assertTrue(result["error"])

    def test_download_size_cap(self):
        class Response(io.BytesIO):
            def __enter__(self): return self
            def __exit__(self, *a): return False
        big = lambda request, timeout: Response(b"[" + b" " * (pc.MAX_DOWNLOAD + 10) + b"]")
        with self.assertRaises(ValueError):
            pc.fetch_explorer(urlopen=big)
        ok = lambda request, timeout: Response(json.dumps(FIXTURE[:1]).encode())
        self.assertEqual(len(pc.fetch_explorer(urlopen=ok)), 1)

    def test_installed_plugins(self):
        plugins = os.path.join(self.dir, "plugins")
        os.makedirs(os.path.join(plugins, "tuner-folder"))
        with open(os.path.join(plugins, "tuner-folder", "plugin.json"), "w") as f:
            json.dump({"name": "Tuner"}, f)
        os.makedirs(os.path.join(plugins, "broken"))
        with open(os.path.join(plugins, "broken", "plugin.json"), "w") as f:
            f.write("{")
        self.assertEqual(pc.installed_plugins(plugins), ["broken", "tuner", "tuner-folder"])
        self.assertEqual(pc.installed_plugins(os.path.join(self.dir, "missing")), [])
        result = pc.catalog(self.dir, False, plugins_dir=plugins, fetch=self.fetch_ok, now=lambda: self.clock)
        self.assertIn("tuner", result["installed"])


if __name__ == "__main__":
    unittest.main()
