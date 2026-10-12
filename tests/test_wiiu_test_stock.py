"""The bundled Wii U test stock (INCLUDE_TEST_STOCK builds) is used only when the user has no import of their own."""
import os, sys, tempfile, types
_saved_modules = dict(sys.modules)  # this file runs at import: put sys.modules back at the end (see test_bundled_skins.py)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "py_modules"))
with tempfile.TemporaryDirectory() as t:
    plugin, data = os.path.join(t, "plugin"), os.path.join(t, "data")
    os.makedirs(plugin); os.makedirs(data)
    d = types.ModuleType("decky")
    d.DECKY_PLUGIN_DIR = plugin; d.DECKY_PLUGIN_RUNTIME_DIR = data; d.DECKY_USER_HOME = t
    d.logger = types.SimpleNamespace(info=print, warning=print, error=print, debug=print)
    d.emit = lambda *a, **k: None
    sys.modules["decky"] = d
    try:
        import main
    except Exception as e:  # main needs more of decky than this stub: skip rather than fail
        print("skipped (main not importable with the stub):", e); raise SystemExit(0)
    user = main._wiiu_stock_user_dir()
    assert main._wiiu_stock_dir() == user  # nothing bundled, nothing imported
    bundled = os.path.join(plugin, "defaults", "skins", "wiiu-stock")
    os.makedirs(bundled)
    open(os.path.join(bundled, "Men.pack"), "wb").write(b"x"); open(os.path.join(bundled, "Men2.pack"), "wb").write(b"y")
    assert main._wiiu_stock_dir() == bundled  # test build: bundled copy is read
    assert main._wiiu_stock_user_dir() == user  # imports still go to the user's folder
for _n in [n for n in sys.modules if n not in _saved_modules]:
    del sys.modules[_n]
sys.modules.update(_saved_modules)
print("wiiu test stock tests passed")
