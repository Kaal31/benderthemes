"""Hub > Theme files backend (py_modules/theme_sources.py). No network: every fetch is an invented fixture."""
import io
import json
import os
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import theme_sources as ts

PSPUNK_HTML = """
<figure class="aligncenter size-large"><img decoding="async" src="https://pspunk.com/files/alpha.jpg" alt=""/>
<figcaption><a href="https://www.pspunk.com/files/theme/ctf/alpha.660.ctf">Alpha &amp; Co</a></figcaption></figure>
<figure><img src="https://pspunk.com/files/beta.jpg"/><figcaption><a href="https://www.pspunk.com/files/theme/ptf/Beta%20One.ptf">Beta One</a></figcaption></figure>
<figure><img src="https://evil.example/x.jpg"/><figcaption><a href="https://www.pspunk.com/files/theme/ctf/../../etc.ctf">Bad</a></figcaption></figure>
<figure><img src="https://pspunk.com/files/gamma.jpg"/><figcaption><a href="https://other.example/files/theme/ctf/gamma.ctf">Elsewhere</a></figcaption></figure>
"""


def themezer_reply(kind, n=2):
    nodes = [{"name": f"Theme {i}", "hexId": f"1A{i}", "pageUrl": f"https://themezer.net/x/themes/t-1A{i}", "downloadCount": 10 - i,
              "updatedAt": "2024-01-01", "creator": {"username": "maker"}, "preview": {"thumbUrl": "https://img.themezer.net/t.jpg", "sdUrl": "https://img.themezer.net/s.jpg"},
              "screenshotPreview": {"sdUrl": "https://img.themezer.net/s.jpg"}, "launcherScreenshot": {"sdUrl": "http://insecure/x.jpg"},
              "collagePreview": {"sdUrl": "https://img.themezer.net/c.jpg"}} for i in range(n)]
    nodes.append({"name": "bad id", "hexId": "../x"})
    body = {"themes": {"pageInfo": {"itemCount": 50, "pageCount": 3}, "nodes": nodes}}
    ns = ts.THEMEZER_NS[kind][0]
    return {"data": {"threeDs": {"theme": body}} if kind == "3ds" else {ns: body}}


class FakeResponse(io.BytesIO):
    def __init__(self, body, url, headers=None):
        super().__init__(body)
        self.url, self.headers = url, headers or {}

    def geturl(self):
        return self.url

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


class FakeOpener:
    def __init__(self, body, final=None, headers=None):
        self.body, self.final, self.headers, self.seen = body, final, headers, []

    def open(self, req, timeout=None):
        self.seen.append(req.full_url)
        return FakeResponse(self.body, self.final or req.full_url, self.headers or {"Content-Length": str(len(self.body))})


def zip_bytes(members):
    b = io.BytesIO()
    with zipfile.ZipFile(b, "w") as z:
        for k, v in members.items():
            z.writestr(k, v)
    return b.getvalue()


def blob(path, size=1000):
    return {"path": path, "mode": "100644", "type": "blob", "sha": "0" * 40, "size": size}


# shaped like api.github.com/repos/<o>/<r>/git/trees/<branch>?recursive=1 (synthetic names, the real layouts of the two repositories)
PS3PRO_TREE = {"sha": "x", "truncated": False, "tree": [
    blob(".gitattributes", 66), blob("README.md", 541), blob("files/Alpha_One.p3t", 890608), blob("files/Beta.2.p3t", 5762560),
    blob("files/Huge.p3t", 400 << 20), blob("files/Mustache.rar"), blob("files/sub/Nested.p3t"), blob("files/.hidden.p3t"),
    blob("files/bad;name.p3t"), blob("icons/Alpha_One.png", 6411), blob("other/Gamma.p3t"), {"path": "files", "type": "tree", "mode": "040000"}]}
SHENRON_TREE = {"truncated": False, "tree": [
    blob("README.md"), blob("_config.yml"), blob("Allure v2.ctf", 7183768), blob("Black Eclipse.ptf", 59308), blob("Dragonball Z 1.PTF", 488240),
    blob("folder/Inner.ptf"), blob("Odd$name.ctf")]}


class GitHubSourceTests(unittest.TestCase):
    def setUp(self):
        ts._cache.clear()

    def test_ps3pro_listing(self):
        seen = []
        def fetch(source, url, data=None):
            seen.append((source, url))
            return PS3PRO_TREE
        r = ts.browse("p3t", "ps3pro", fetch_json=fetch)
        self.assertEqual(seen, [("ps3pro", "https://api.github.com/repos/PS3-Pro/Themes/git/trees/main?recursive=1")])
        self.assertEqual([i["id"] for i in r["items"]], ["files/Alpha_One.p3t", "files/Beta.2.p3t"], "only plain .p3t files of files/, within the size cap")
        a = r["items"][0]
        self.assertEqual((a["name"], a["file"]["size"]), ("Alpha One", 890608))
        self.assertEqual(a["image"], "https://raw.githubusercontent.com/PS3-Pro/Themes/main/icons/Alpha_One.png")
        self.assertEqual(r["items"][1]["image"], "", "no preview in the tree, no picture")
        self.assertEqual(r["source"]["id"], "ps3pro")
        r = ts.browse("p3t", "ps3pro", "beta", fetch_json=fetch)
        self.assertEqual([i["id"] for i in r["items"]], ["files/Beta.2.p3t"])
        self.assertEqual(len(seen), 1, "the tree is cached")

    def test_shenron_listing_and_paging(self):
        r = ts.browse("psp", "shenron0", fetch_json=lambda s, u, d=None: SHENRON_TREE)
        self.assertEqual([i["id"] for i in r["items"]], ["Allure v2.ctf", "Black Eclipse.ptf", "Dragonball Z 1.PTF"])
        self.assertEqual([i["tag"] for i in r["items"]], ["CTF (custom firmware)", "PTF", "PTF"])
        big = {"tree": [blob(f"T{i:03}.ptf") for i in range(60)]}
        ts._cache.clear()
        r = ts.browse("psp", "shenron0", page=3, fetch_json=lambda s, u, d=None: big)
        self.assertEqual((r["total"], r["pages"], len(r["items"])), (60, 3, 12))

    def test_truncated_tree_and_errors_are_reported(self):
        r = ts.browse("psp", "shenron0", fetch_json=lambda s, u, d=None: {"truncated": True, "tree": []})
        self.assertIn("could not be reached", r["error"])
        self.assertEqual(r["items"], [])
        def boom(*a, **k):
            raise OSError("offline")
        ts._cache.clear()
        self.assertIn("could not be reached", ts.browse("p3t", "ps3pro", fetch_json=boom)["error"])
        self.assertIn("error", ts.browse("switch", "ps3pro"), "a source only serves its own kind")
        self.assertIn("error", ts.browse("psp", "ps3pro"))

    def test_download_url_rebuilt_and_checked(self):
        self.assertEqual(ts.download_url("p3t", "ps3pro", "files/Alpha_One.p3t"), "https://raw.githubusercontent.com/PS3-Pro/Themes/main/files/Alpha_One.p3t")
        self.assertEqual(ts.download_url("psp", "shenron0", "Black Eclipse.ptf"), "https://raw.githubusercontent.com/Shenron0/PSP-Themes/master/Black%20Eclipse.ptf")
        for bad in [("p3t", "ps3pro", "files/../x.p3t"), ("p3t", "ps3pro", "x.p3t"), ("p3t", "ps3pro", "files/a/b.p3t"), ("p3t", "ps3pro", "files/a.exe"),
                    ("p3t", "ps3pro", "https://evil.example/files/a.p3t"), ("psp", "shenron0", "../x.ptf"), ("psp", "shenron0", "d/x.ptf"),
                    ("psp", "shenron0", ".x.ptf"), ("psp", "ps3pro", "files/a.p3t"), ("p3t", "shenron0", "a.ptf")]:
            with self.assertRaises(ValueError, msg=bad):
                ts.download_url(*bad)

    def test_download_and_hosts(self):
        with tempfile.TemporaryDirectory() as d:
            body = b"P3TF\x00\x00\x01\x10" + b"0" * 64
            op = FakeOpener(body)
            r = ts.download(d, "p3t", "ps3pro", "files/Alpha_One.p3t", opener=op)
            self.assertEqual(r, {"success": True, "name": "Alpha_One.p3t"})
            self.assertEqual(ts.saved_downloads(d, "p3t"), {"p3t:ps3pro:files/Alpha_One.p3t:":"Alpha_One.p3t"})
            os.remove(os.path.join(d,"p3t","Alpha_One.p3t"))
            self.assertEqual(ts.saved_downloads(d,"p3t"), {})
            self.assertEqual(op.seen, ["https://raw.githubusercontent.com/PS3-Pro/Themes/main/files/Alpha_One.p3t"])
            bad = ts.download(d, "p3t", "ps3pro", "files/B.p3t", opener=FakeOpener(body, "https://evil.example/B.p3t"))
            self.assertIn("unexpected download host", bad["error"])
            html = ts.download(d, "psp", "shenron0", "A.ptf", opener=FakeOpener(b"<html>404</html>"))
            self.assertIn("not a PSP theme file", html["error"])
            ok = ts.download(d, "psp", "shenron0", "Black Eclipse.ptf", opener=FakeOpener(b"\x00PTF\x00\x01\x00\x00" + b"x" * 40))
            self.assertEqual(ok["name"], "Black Eclipse.ptf")
            big = FakeOpener(b"P3TF", headers={"Content-Length": str(ts.KINDS["p3t"]["max"] + 1)})
            self.assertIn("too large", ts.download(d, "p3t", "ps3pro", "files/C.p3t", opener=big)["error"])
        h = ts._Redirects("ps3pro")
        import urllib.request
        req = urllib.request.Request("https://raw.githubusercontent.com/PS3-Pro/Themes/main/files/a.p3t")
        for evil in ("https://evil.example/a.p3t", "http://raw.githubusercontent.com/a.p3t", "https://github.com/PS3-Pro/Themes/raw/main/a.p3t"):
            with self.assertRaises(ValueError, msg=evil):
                h.redirect_request(req, None, 302, "Found", {}, evil)
        self.assertIsNotNone(h.redirect_request(req, None, 302, "Found", {}, "https://media.githubusercontent.com/media/PS3-Pro/Themes/main/files/a.p3t"))

    def test_credit_and_vitashell_not_listed(self):
        k = ts.kinds()
        self.assertIn("ps3pro", k["sources"])
        self.assertIn("github.com/PS3-Pro/Themes", k["sources"]["ps3pro"]["url"])
        self.assertIn("Shenron0", k["sources"]["shenron0"]["credit"])
        vita = [x for x in k["kinds"] if x["id"] == "vita"][0]
        self.assertEqual(vita["sources"], ["archive"], "VitaShell skins are not Vita home themes")
        self.assertTrue(any("VitaShell" in n["name"] for n in k["notBuilt"]))


class ParseTests(unittest.TestCase):
    def test_pspunk_figures(self):
        rows = ts._pspunk_parse(PSPUNK_HTML)
        self.assertEqual(rows[0], ("ctf/alpha.660.ctf", "Alpha & Co", "https://pspunk.com/files/alpha.jpg"))
        self.assertEqual(rows[1][0], "ptf/Beta One.ptf")
        self.assertEqual(len(rows), 2, "path tricks and other hosts are dropped")

    def test_pspunk_browse_search_and_pages(self):
        calls = []
        def fetch(source, url, data=None):
            calls.append(url)
            return [{"content": {"rendered": PSPUNK_HTML}}]
        ts._cache.clear()
        r = ts.browse("psp", "pspunk", fetch_json=fetch)
        self.assertEqual(r["total"], 2)  # the same figures on both pages are listed once
        self.assertEqual(len(calls), 2)
        self.assertTrue(all(u.startswith("https://www.pspunk.com/wp-json/wp/v2/pages?slug=") for u in calls))
        self.assertEqual(r["items"][0]["tag"], "CTF (custom firmware)")
        r = ts.browse("psp", "pspunk", "beta", fetch_json=fetch)
        self.assertEqual([i["id"] for i in r["items"]], ["ptf/Beta One.ptf"])
        self.assertEqual(len(calls), 2, "the list is cached")

    def test_themezer_every_kind(self):
        for kind in ("p3t", "switch", "wiiu", "3ds"):
            ts._cache.clear()
            seen = {}
            def fetch(source, url, data=None):
                seen["q"] = json.loads(data)["query"]
                return themezer_reply(kind)
            r = ts.browse(kind, "themezer", 'zel"da', page=2, fetch_json=fetch)
            self.assertNotIn("error", r, kind)
            self.assertEqual([i["id"] for i in r["items"]], ["1A0", "1A1"], kind)
            self.assertEqual((r["total"], r["pages"]), (50, 3))
            self.assertIn("isNSFW:false", seen["q"])
            self.assertIn('query:"zel\\"da"', seen["q"], "the search text is JSON-quoted")
            self.assertIn("page:2", seen["q"])
            if kind == "switch":
                self.assertIn("target:ResidentMenu", seen["q"])
            if kind == "wiiu":
                self.assertEqual(r["items"][0]["image"], "", "http pictures are dropped")

    def test_archive_items_and_files(self):
        ts._cache.clear()
        def fetch(source, url, data=None):
            self.assertEqual(source, "archive")
            if "advancedsearch" in url:
                return {"response": {"numFound": 30, "docs": [{"identifier": "good-item", "title": "Wii themes", "creator": ["me"]},
                                                              {"identifier": "empty-item", "title": "Nothing"}, {"identifier": "../bad"}]}}
            if "good-item" in url:
                return {"result": [{"name": "a/One.mym", "size": "100"}, {"name": "two.csm", "size": "200"}, {"name": "x.jpg"},
                                   {"name": "../evil.mym"}, {"name": "huge.csm", "size": str(1 << 30)}]}
            return {"result": [{"name": "readme.txt"}]}
        r = ts.browse("wii", "archive", fetch_json=fetch)
        self.assertEqual([i["id"] for i in r["items"]], ["good-item"])
        self.assertEqual([f["name"] for f in r["items"][0]["files"]], ["a/One.mym", "two.csm"])
        self.assertEqual(r["skipped"], 1)
        self.assertEqual(r["pages"], 2)

    def test_errors_never_raise(self):
        ts._cache.clear()
        def boom(*a, **k):
            raise OSError("offline")
        r = ts.browse("switch", "themezer", fetch_json=boom)
        self.assertEqual(r["items"], [])
        self.assertIn("could not be reached", r["error"])
        self.assertIn("error", ts.browse("switch", "pspunk"))
        self.assertIn("error", ts.browse("nope", "themezer"))

    def test_kinds_listing(self):
        k = ts.kinds()
        self.assertEqual({x["id"] for x in k["kinds"]}, {"wiiflow", "psp", "p3t", "vita", "switch", "wiiu", "3ds", "wii", "xbox"})
        for x in k["kinds"]:
            self.assertTrue(all(s in k["sources"] for s in x["sources"]))


class DownloadTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = self.tmp.name

    def tearDown(self):
        self.tmp.cleanup()

    def test_download_url_is_rebuilt_from_ids(self):
        self.assertEqual(ts.download_url("p3t", "themezer", "1b9e3"), "https://api.themezer.net/ps3/themes/1B9E3/download")
        self.assertEqual(ts.download_url("3ds", "themezer", "1AB16"), "https://api.themezer.net/3ds/themes/1AB16/download")
        self.assertEqual(ts.download_url("psp", "pspunk", "ptf/Beta One.ptf"), "https://www.pspunk.com/files/theme/ptf/Beta%20One.ptf")
        self.assertEqual(ts.download_url("wii", "archive", "good-item", "a/One.mym"), "https://archive.org/download/good-item/a/One.mym")
        for bad in [("p3t", "themezer", "1B9E3/../x"), ("psp", "pspunk", "ctf/../../x.ctf"), ("psp", "pspunk", "https://evil/x.ctf"),
                    ("wii", "archive", "good-item", "../x.mym"), ("wii", "archive", "good-item", "x.exe"), ("wii", "archive", "a/b", "x.mym"),
                    ("switch", "archive", "x", "y.nxtheme"), ("x360", "archive", "x", "y")]:
            with self.assertRaises(ValueError, msg=bad):
                ts.download_url(*bad)

    def test_downloads_into_the_kind_folder(self):
        body = b"\x00PTF\x00\x01\x00\x00" + b"x" * 100
        r = ts.download(self.dir, "psp", "pspunk", "ctf/alpha.660.ctf", opener=FakeOpener(body))
        self.assertEqual(r, {"success": True, "name": "alpha.660.ctf"})
        self.assertEqual(Path(self.dir, "psp", "alpha.660.ctf").read_bytes(), body)
        self.assertEqual(ts.download(self.dir, "psp", "pspunk", "ctf/alpha.660.ctf", opener=FakeOpener(body))["already"], True)
        r = ts.download(self.dir, "psp", "pspunk", "ctf/alpha.660.ctf", opener=FakeOpener(body + b"!"))
        self.assertEqual(r["name"], "alpha.660 (2).ctf", "a different file of the same name is kept next to it")
        self.assertEqual(sorted(os.listdir(Path(self.dir, "psp"))), ["alpha.660 (2).ctf", "alpha.660.ctf"], "no .part left behind")

    def test_themezer_name_and_redirect_host(self):
        body = b"P3TF\x00\x00\x01\x10" + b"0" * 64
        final = "https://themezer.abc.r2.cloudflarestorage.com/ps3/x/theme.p3t?response-content-disposition=attachment%3B%20filename%3D%22Long%20name.p3t%22"
        r = ts.download(self.dir, "p3t", "themezer", "1B9E3", name="Windows: XP/2", opener=FakeOpener(body, final))
        self.assertEqual(r["name"], "Windows XP 2 (Themezer 1B9E3).p3t")
        r = ts.download(self.dir, "p3t", "themezer", "1B9E3", opener=FakeOpener(body, "https://evil.example/theme.p3t"))
        self.assertFalse(r["success"])
        self.assertIn("unexpected download host", r["error"])

    def test_redirect_handler_refuses_other_hosts(self):
        h = ts._Redirects("archive")
        import urllib.request
        req = urllib.request.Request("https://archive.org/download/x/y.mym")
        with self.assertRaises(ValueError):
            h.redirect_request(req, None, 302, "Found", {}, "https://evil.example/y.mym")
        with self.assertRaises(ValueError):
            h.redirect_request(req, None, 302, "Found", {}, "http://ia800.us.archive.org/y.mym")
        self.assertIsNotNone(h.redirect_request(req, None, 302, "Found", {}, "https://ia800.us.archive.org/y.mym"))

    def test_wrong_content_and_size_are_refused(self):
        r = ts.download(self.dir, "psp", "pspunk", "ctf/alpha.ctf", opener=FakeOpener(b"<html>not found</html>"))
        self.assertFalse(r["success"])
        self.assertIn("not a PSP theme file", r["error"])
        big = FakeOpener(b"\x00PTF", headers={"Content-Length": str(ts.KINDS["psp"]["max"] + 1)})
        self.assertIn("too large", ts.download(self.dir, "psp", "pspunk", "ctf/alpha.ctf", opener=big)["error"])
        cut = FakeOpener(b"\x00PTF....", headers={"Content-Length": "999"})
        self.assertIn("cut off", ts.download(self.dir, "psp", "pspunk", "ctf/alpha.ctf", opener=cut)["error"])
        self.assertEqual(os.listdir(Path(self.dir, "psp")), [])
        self.assertFalse(ts.progress()["busy"])

    def test_zip_kinds_are_checked(self):
        vita = zip_bytes({"MyTheme/theme.xml": "<theme/>"})
        self.assertTrue(ts.download(self.dir, "vita", "archive", "item", "My Theme.zip", opener=FakeOpener(vita))["success"])
        self.assertFalse(ts.download(self.dir, "vita", "archive", "item", "Other.zip", opener=FakeOpener(zip_bytes({"a.txt": "x"})))["success"])
        nx = zip_bytes({"info.json": "{}", "image.jpg": "x"})
        self.assertTrue(ts.download(self.dir, "switch", "themezer", "E87B", name="Clean", opener=FakeOpener(nx))["success"])

    def test_safe_file_name(self):
        self.assertEqual(ts.safe_file_name("../../a\\b:c.ctf", ".ctf", "T"), "b c.ctf")
        self.assertEqual(ts.safe_file_name("", ".mym", "Theme"), "Theme.mym")
        self.assertEqual(ts.safe_file_name("x.exe", ".mym", "T"), "x.exe.mym")


class GbatempOfflineIndexTests(unittest.TestCase):
    def test_saved_index_needs_no_network_or_live_parser(self):
        from unittest.mock import patch
        import builtins
        real_import = builtins.__import__
        def guarded(name, *args, **kwargs):
            if name == "gbatemp_themes":
                raise ImportError("Live parser unavailable")
            return real_import(name, *args, **kwargs)
        ts._cache.clear()
        with patch("builtins.__import__", side_effect=guarded), patch.object(ts, "_fetch", side_effect=AssertionError("Must not fetch")):
            result = ts.browse("wiiflow", "gbatemp")
        self.assertNotIn("error", result)
        self.assertGreater(result["total"], 0)


if __name__ == "__main__":
    unittest.main()
