"""Reads a few real theme files through the plugin's own Python readers (main.Plugin get_*_skin)
and writes <out>/lists.json + <out>/<kind>.json for the browser preview's window.__real stub.
Usage: python3 tools/promo/dump_real_themes.py <themes-root> <out-dir> [wiiu-stock-dir]
<themes-root> is local-material/test-release-themes (psp/, switch/, wiiu/, 3ds/ inside)."""
import asyncio, json, os, shutil, sys, tempfile, types
here = os.path.dirname(os.path.abspath(__file__))
repo = os.path.abspath(os.path.join(here, "..", ".."))
sys.path.insert(0, repo); sys.path.insert(0, os.path.join(repo, "py_modules"))
src, out = sys.argv[1], sys.argv[2]
stock = sys.argv[3] if len(sys.argv) > 3 else ""
os.makedirs(out, exist_ok=True)
PICK = {"psp": ["Persona 3.ctf", "Blackstorm.ctf"], "switch": ["Star Wars by la-lo-go", "NX_Makima"],
        "wiiu": ["Chill Mario.utheme", "Vaporwave.utheme"], "3ds": ["TLOZ - Breath of the Wild.zip", "Pokemon - Primal Kyogre.zip"]}
with tempfile.TemporaryDirectory() as t:
    plugin, data = os.path.join(t, "plugin"), os.path.join(t, "data")
    os.makedirs(plugin); os.makedirs(os.path.join(data, "skins"))
    d = types.ModuleType("decky")
    d.DECKY_PLUGIN_DIR = plugin; d.DECKY_PLUGIN_RUNTIME_DIR = data; d.DECKY_USER_HOME = t; d.DECKY_HOME = t
    d.DECKY_PLUGIN_SETTINGS_DIR = data; d.DECKY_PLUGIN_LOG_DIR = data
    d.logger = types.SimpleNamespace(info=lambda *a: None, warning=print, error=print, debug=lambda *a: None)
    d.emit = lambda *a, **k: None
    sys.modules["decky"] = d
    import main

    async def no_server(*a, **k):
        return False
    main._ensure_server = no_server  # no local media server: boot clips / sounds are left out
    for kind, names in PICK.items():
        dst = os.path.join(data, "skins", kind); os.makedirs(dst, exist_ok=True)
        for n in names:
            s = os.path.join(src, kind, n)
            (shutil.copytree if os.path.isdir(s) else shutil.copy)(s, os.path.join(dst, n))
    if stock:
        u = main._wiiu_stock_user_dir(); os.makedirs(u, exist_ok=True)
        for f in ("Men.pack", "Men2.pack"):
            os.symlink(os.path.join(stock, f), os.path.join(u, f))
    P = main.Plugin()

    async def run():
        lists = await P.list_skins()
        sw = await P.list_switch_themes()
        wu = await P.list_wiiu_themes()
        lists["switch"] = [{"id": x["id"], "name": x["name"], "author": x["author"], "files": {k: 1 for k in x["screens"]}} for x in sw["themes"]]
        lists["wiiu"] = wu["themes"]
        json.dump(lists, open(os.path.join(out, "lists.json"), "w"))
        res = {"psp": {}, "switch": {}, "wiiu": {}, "n3ds": {}}
        for n in lists.get("psp", []): res["psp"][n] = await P.get_psp_skin(n)
        for x in sw["themes"]: res["switch"][x["id"]] = await P.get_switch_skin(x["id"])
        for n in wu["themes"]: res["wiiu"][n] = await P.get_wiiu_skin(n)
        for n in lists.get("n3ds", []): res["n3ds"][n] = await P.get_3ds_skin(n)
        for k, v in res.items():
            json.dump(v, open(os.path.join(out, k + ".json"), "w"))
            print(k, {n: (len(json.dumps(s)) if s else None) for n, s in v.items()})
        print("lists", {k: v for k, v in lists.items() if k in ("psp", "n3ds", "wiiu")}, [x["id"] for x in lists["switch"]])
    asyncio.run(run())
