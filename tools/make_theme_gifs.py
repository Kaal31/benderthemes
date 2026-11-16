from pathlib import Path
import sys
root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / "work/preview-python"))
from PIL import Image

out = root / "out/theme-previews"
import json
report=json.loads((out/"capture-report.json").read_text())
selected=set(sys.argv[1:])
for folder in [out/"frames"/r["theme"] for r in report if r["status"]=="captured" and (not selected or r["theme"] in selected)]:
    frames = []
    for source in sorted(folder.glob("*.png")):
        with Image.open(source) as img:
            frames.append(img.convert("RGB").resize((640, 400), Image.Resampling.LANCZOS))
    # One palette for the whole recording avoids colour shimmer between frames.
    sheet = Image.new("RGB", (640, ((len(frames) + 3) // 4) * 100))
    for index, frame in enumerate(frames):
        sheet.paste(frame.resize((160, 100), Image.Resampling.LANCZOS), ((index % 4) * 160, (index // 4) * 100))
    palette = sheet.quantize(colors=128)
    frames = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
    frames[0].save(out / f"{folder.name}.gif", save_all=True, append_images=frames[1:], duration=130, loop=0, optimize=True)
    with Image.open(out / f"{folder.name}.png") as img:
        img.convert("RGB").resize((640, 400), Image.Resampling.LANCZOS).save(out / f"{folder.name}.jpg", quality=82)
    print(f"{folder.name}: {(out / (folder.name + '.gif')).stat().st_size // 1024} KB",flush=True)
