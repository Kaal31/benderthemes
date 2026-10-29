import base64
import io
import json
import struct
import sys
from collections import Counter
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / "py_modules"))
import console_themes

scene = json.loads((root / "out/ps3-layer-test/ps2-scene.json").read_text(encoding="utf-8"))
assert {"MidPlane", "FrontRocks"}.issubset({actor["id"] for actor in scene["actors"]})
report = {}
for name in ["_SOT_Theme_MidPlane.gtf", "_SOT_Theme_FrontRocks.gtf"]:
    texture = scene["textures"][name]
    width, height = texture["width"], texture["height"]
    data = base64.b64decode(texture["data"])
    header = b"DDS " + struct.pack("<7I", 124, 0x81007, height, width, len(data), 0, 1) + bytes(44)
    header += struct.pack("<8I", 32, 4, struct.unpack("<I", b"DXT5")[0], 0, 0, 0, 0, 0) + struct.pack("<5I", 0x1000, 0, 0, 0, 0)
    independent = Image.open(io.BytesIO(header + data)).convert("RGBA")
    alpha = console_themes._dxt_alpha(data, width, height, 5)
    assert independent.getchannel("A").tobytes() == bytes(alpha), "Independent decoder disagrees on source transparency"
    counts = Counter(alpha)
    report[name] = {"width": width, "height": height, "transparent": counts[0], "opaque": counts[255], "intermediateAlpha": len(alpha) - counts[0] - counts[255]}
output = root / "out/ps3-layer-test/source-alpha-report.json"
output.write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report))
print("PASS: original layers retained; Pillow independently confirms the source DXT5 alpha")
