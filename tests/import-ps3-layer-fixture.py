import ast
import base64
import json
import logging
import os
import struct
import sys
import types
import zlib
from pathlib import Path

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / "py_modules"))
import console_themes
import ps3_raf

source = ast.parse((root / "main.py").read_text(encoding="utf-8"))
functions = [node for node in source.body if isinstance(node, ast.FunctionDef) and node.name in ("_read_p3t", "_gim_to_png", "_data_url")]
scope = dict(os=os, struct=struct, zlib=zlib, base64=base64, io=__import__("io"), _b64=lambda raw: base64.b64encode(raw).decode(), decky=types.SimpleNamespace(logger=logging.getLogger("ps3-test")))
exec(compile(ast.Module(body=functions, type_ignores=[]), "main.py", "exec"), scope)
path = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "bundle/skins/p3t/ZenGarden.p3t"
skin = scope["_read_p3t"](str(path))
if not skin["_raf"]:
    print(json.dumps({"theme": skin["name"], "icons": len(skin["icons"]), "backgrounds": len(skin["backgrounds"]), "static": True, "sounds": len(skin["_sounds"])}))
    sys.exit(0)
offset, length = skin["_raf"]
scene = ps3_raf.read_raf(path.read_bytes()[offset:offset + length], console_themes._xml_tree, console_themes.gtf_png, scope["_data_url"], raw_textures=True)
output = root / "out/ps3-layer-test"
output.mkdir(parents=True, exist_ok=True)
(output / "scene.json").write_text(json.dumps(scene), encoding="utf-8")
sounds = {name: scope["_data_url"](data, "audio/wav") for name, data in skin.pop("_sounds").items()}
skin.pop("_raf", None)
skin.pop("_bgraw", None)
skin["rafScene"] = "/scene.json"
(output / "skin.json").write_text(json.dumps(skin), encoding="utf-8")
(output / "sounds.json").write_text(json.dumps(sounds), encoding="utf-8")
print(json.dumps({"theme": skin["name"], "icons": len(skin["icons"]), "actors": len(scene["actors"]), "sounds": len(sounds)}))
