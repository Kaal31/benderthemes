from pathlib import Path
import sys
root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / "work/preview-python"))
from PIL import Image

out = root / "out/theme-previews"
for folder in sorted((out / "frames").iterdir()):
    frames = []
    for source in sorted(folder.glob("*.png")):
        with Image.open(source) as img:
            frames.append(img.convert("RGB").resize((640, 400), Image.Resampling.LANCZOS).quantize(colors=128))
    frames[0].save(out / f"{folder.name}.gif", save_all=True, append_images=frames[1:], duration=220, loop=0, optimize=True)
    with Image.open(out / f"{folder.name}.png") as img:
        img.convert("RGB").resize((640, 400), Image.Resampling.LANCZOS).save(out / f"{folder.name}.jpg", quality=82)
    print(f"{folder.name}: {(out / (folder.name + '.gif')).stat().st_size // 1024} KB")
