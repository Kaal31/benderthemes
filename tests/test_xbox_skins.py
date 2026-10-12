"""Original Xbox skin reader: UnleashX and XBMC skins as folders and zips, sloppy XML, bad input."""
import os, sys, tempfile, zipfile, base64
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "py_modules"))
import xbox_skins as X

PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")
UNLEASH = b'''\xef\xbb\xbf<Skin name="Demo">
<Information><Author>Me &amp; You</Author><Version>1.0</Version></Information>
<Main><Background>bg.png</Background><Text Color="0xFFAABBCC" Source="Time" />
<Menu><ItemPos Top="1" Left="2" Color="0xFF112233"></ItemPos></Menu></Main></Main>
<FileManager><BackGround>fm.png</BackGround></FileManager></Skin>'''
XBMC_SKIN = b"<skin><defaultresolution>720p</defaultresolution><credits><skinname>Cool</skinname><name>A & B</name></credits></skin>"
COLORS = b'<colors><color name="white">ffffffff</color><color name="blue">FF399EDA</color></colors>'


def put(root, rel, data):
    p = os.path.join(root, *rel.split("/"))
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "wb").write(data)


with tempfile.TemporaryDirectory() as t:
    u = os.path.join(t, "demo")
    put(u, "skin.xml", UNLEASH); put(u, "BG.PNG", PNG); put(u, "fm.png", PNG); put(u, "clip.wmv", b"x")
    assert X.peek(u) == "unleashx"
    r = X.read_xbox_skin(u)
    assert r["name"] == "Demo" and r["author"] == "Me & You" and r["kind"] == "unleashx", r["name"]
    assert r["background"].startswith("data:image/png;base64,") and r["colors"]["text"] == "#112233"

    x = os.path.join(t, "cool")
    put(x, "skin.xml", XBMC_SKIN); put(x, "colors/defaults.xml", COLORS); put(x, "backgrounds/default.png", PNG)
    put(x, "media/Textures.xpr", b"XPR0")
    assert X.peek(x) == "xbmc"
    r = X.read_xbox_skin(x)
    assert r["name"] == "Cool" and r["author"] == "A & B" and r["colors"]["text"] == "#ffffff" and r["colors"]["highlight"] == "#399eda", r

    z = os.path.join(t, "zipped.zip")  # skin one folder down inside a zip
    with zipfile.ZipFile(z, "w") as f:
        f.writestr("Inner/Skin.xml", UNLEASH); f.writestr("Inner/bg.png", PNG)
    assert X.peek(z) == "unleashx" and X.read_xbox_skin(z)["background"]

    # not skins: never raise, return None
    put(t, "plain/readme.txt", b"hi")
    for bad in (os.path.join(t, "plain"), os.path.join(t, "missing"), os.path.join(t, "plain", "readme.txt")):
        assert X.peek(bad) is None and X.read_xbox_skin(bad) is None
    notzip = os.path.join(t, "bad.zip"); open(notzip, "wb").write(b"not a zip")
    assert X.read_xbox_skin(notzip) is None
    put(t, "evil/skin.xml", b'<!DOCTYPE x [<!ENTITY a "b">]><Skin name="e"><Main/></Skin>')
    assert X.read_xbox_skin(os.path.join(t, "evil")) is None
    # broken picture next to a good skin: skin still loads
    put(u, "fm.png", b"\x89PNG-broken")
    assert X.read_xbox_skin(u)["background"]
print("xbox skin tests passed")
