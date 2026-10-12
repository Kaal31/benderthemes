"""Composites the 20-second promo (1920x1080, 60 fps) from the live preview footage captured by capture.mjs.
Every frame is drawn here with Pillow + numpy (kinetic type, masks, whip pans with motion blur, glows, grade)
and piped to ffmpeg. Storyboard and timings: handoff-notes/promo-video.md.
Usage: python3 tools/promo/render.py <footage-dir> <audio.wav> <out.mp4> [--frames a:b] [--stills dir] [--crf 18]"""
import argparse, bisect, json, math, os, subprocess, sys
from functools import lru_cache
from multiprocessing import Pool
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

W, H, FPS, DUR = 1920, 1080, 60, 20.0
NFR = int(FPS * DUR)
FONT_DIR = "/usr/share/fonts/opentype/inter"
FOOT = ""

# ---------------------------------------------------------------- palette / type
BG0, BG1 = (9, 10, 22), (30, 16, 58)
CYAN, MAGENTA, AMBER, WHITE = (60, 220, 255), (255, 79, 216), (255, 184, 64), (255, 255, 255)
FAMILY = {"PlayStation": (70, 130, 255), "Xbox": (80, 215, 110), "Nintendo": (255, 80, 90), "Bonus": AMBER}


@lru_cache(None)
def font(weight, size):
    name = {"black": "InterDisplay-Black", "bold": "InterDisplay-Bold", "semi": "InterDisplay-SemiBold",
            "med": "InterDisplay-Medium", "reg": "InterDisplay-Regular", "light": "InterDisplay-Light"}[weight]
    return ImageFont.truetype(f"{FONT_DIR}/{name}.otf", size)


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def lin(t, a, b): return clamp((t - a) / (b - a)) if b > a else float(t >= a)
def out_cubic(x): return 1 - (1 - x) ** 3
def out_expo(x): return 1 if x >= 1 else 1 - 2 ** (-10 * x)
def in_out_cubic(x): return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
def in_cubic(x): return x ** 3
def out_back(x, s=1.7): x -= 1; return 1 + (s + 1) * x ** 3 + s * x ** 2
def mixc(a, b, k): return tuple(int(a[i] + (b[i] - a[i]) * k) for i in range(3))


# ---------------------------------------------------------------- footage
class Clip:
    def __init__(self, name):
        self.dir = os.path.join(FOOT, name)
        fr = json.load(open(os.path.join(self.dir, "frames.json")))
        self.ts = [f["t"] for f in fr]; self.files = [f["file"] for f in fr]

    def at(self, t):
        i = bisect.bisect_left(self.ts, t)
        if i >= len(self.ts): i = len(self.ts) - 1
        elif i > 0 and abs(self.ts[i - 1] - t) < abs(self.ts[i] - t): i -= 1
        return load(os.path.join(self.dir, self.files[i]))

    @property
    def span(self): return self.ts[-1]


@lru_cache(64)
def load(path): return Image.open(path).convert("RGB")


@lru_cache(None)
def clip(name): return Clip(name)


def foot(name, t): return clip(name).at(t)


def cover(img, w, h, zoom=1.0, dx=0.0, dy=0.0, anchor=(0.5, 0.5)):
    """Scale img to cover w x h (times zoom), offset by dx, dy pixels."""
    s = max(w / img.width, h / img.height) * zoom
    sw, sh = max(1, round(img.width * s)), max(1, round(img.height * s))
    im = img.resize((sw, sh), Image.LANCZOS if s < 1.6 else Image.BICUBIC)
    x = (sw - w) * anchor[0] - dx; y = (sh - h) * anchor[1] - dy
    x = clamp(x, 0, sw - w); y = clamp(y, 0, sh - h)
    return im.crop((round(x), round(y), round(x) + w, round(y) + h))


def hblur(img, amount):
    """Cheap horizontal motion blur (box) of `amount` pixels."""
    if amount < 2: return img
    k = max(1, int(amount))
    small = img.resize((max(8, img.width // k), img.height), Image.BILINEAR)
    return small.resize(img.size, Image.BILINEAR)


def vblur(img, amount):
    if amount < 2: return img
    k = max(1, int(amount))
    return img.resize((img.width, max(8, img.height // k)), Image.BILINEAR).resize(img.size, Image.BILINEAR)


# ---------------------------------------------------------------- backgrounds / grade
def _bg():
    y = np.linspace(0, 1, H)[:, None]; x = np.linspace(0, 1, W)[None, :]
    k = np.clip(0.55 * y + 0.45 * x, 0, 1)[..., None]
    a = np.array(BG0)[None, None]; b = np.array(BG1)[None, None]
    img = a * (1 - k) + b * k
    # soft cyan and magenta glows
    for cx, cy, r, col, g in ((0.15, 0.2, 0.55, CYAN, 0.18), (0.88, 0.85, 0.6, MAGENTA, 0.20)):
        d = np.sqrt(((x - cx) * W / H) ** 2 + (y - cy) ** 2) / r
        img += np.array(col)[None, None] * (np.exp(-d ** 2 * 2.5)[..., None] * g)
    return np.clip(img, 0, 255)


BG = None
VIGN = None


def background(t):
    global BG
    if BG is None: BG = _bg()
    arr = BG.copy()
    # slow diagonal light band
    x = np.linspace(0, 1, W)[None, :]; y = np.linspace(0, 1, H)[:, None]
    p = (t * 0.08) % 1.6 - 0.3
    band = np.exp(-(((x * 0.8 + y * 0.4) - p * 1.4) / 0.12) ** 2)[..., None] * 18
    return Image.fromarray(np.clip(arr + band, 0, 255).astype(np.uint8))


def grid_overlay(img, t, alpha=22):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay); step = 80; off = (t * 30) % step
    for gx in range(-step, W + step, step): d.line([(gx + off, 0), (gx + off, H)], fill=(255, 255, 255, alpha))
    for gy in range(-step, H + step, step): d.line([(0, gy + off * .5), (W, gy + off * .5)], fill=(255, 255, 255, alpha))
    # fade the grid towards the edges
    m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).ellipse((-200, -300, W + 200, H + 300), fill=255)
    lay.putalpha(ImageChops.multiply(lay.getchannel("A"), m.filter(ImageFilter.GaussianBlur(160))))
    img.alpha_composite(lay)
    return img


def grade(img):
    """One look for everything: gentle contrast, a touch of teal in the shadows / warmth in highlights, vignette."""
    global VIGN
    if VIGN is None:
        y = np.linspace(-1, 1, H)[:, None]; x = np.linspace(-1, 1, W)[None, :]
        VIGN = (1 - 0.28 * np.clip((x ** 2 * 0.8 + y ** 2) - 0.25, 0, 1.4) ** 1.2)[..., None].astype(np.float32)
    a = np.asarray(img).astype(np.float32) / 255
    a = a + (a - 0.5) * 0.06
    lum = a.mean(2, keepdims=True)
    a += (1 - lum) * np.array([-0.012, 0.004, 0.018]) + lum * np.array([0.012, 0.004, -0.01])
    a *= VIGN
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))


# ---------------------------------------------------------------- drawing helpers
def rrect_mask(w, h, r):
    m = Image.new("L", (w, h), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255); return m


def paste_card(base, img, x, y, radius=22, shadow=True, alpha=1.0, border=None):
    w, h = img.size
    if shadow:
        sh = Image.new("RGBA", (w + 160, h + 160), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((80, 100, 80 + w, 100 + h), radius, fill=(0, 0, 0, int(150 * alpha)))
        sh = sh.filter(ImageFilter.GaussianBlur(34))
        base.alpha_composite(sh, (int(x - 80), int(y - 80))) if base.mode == "RGBA" else base.paste(sh, (int(x - 80), int(y - 80)), sh)
    m = rrect_mask(w, h, radius)
    if alpha < 1: m = m.point(lambda v: int(v * alpha))
    base.paste(img, (int(x), int(y)), m)
    if border and alpha > 0.02:
        border = border[:3] + (int(border[3] * alpha),)
        lay = Image.new("RGBA", (w + 4, h + 4), (0, 0, 0, 0))
        ImageDraw.Draw(lay).rounded_rectangle((1, 1, w, h), radius, outline=border, width=2)
        if base.mode == "RGBA": base.alpha_composite(lay, (int(x) - 1, int(y) - 1))
        else: base.paste(lay, (int(x) - 1, int(y) - 1), lay)


def text_layer(txt, fnt, fill=WHITE, tracking=0):
    """RGBA image of text (with optional letter spacing)."""
    if tracking == 0:
        bb = fnt.getbbox(txt); w, h = bb[2] - bb[0] + 4, bb[3] + 8
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); ImageDraw.Draw(im).text((-bb[0] + 2, 0), txt, font=fnt, fill=fill)
        return im
    widths = [fnt.getlength(c) + tracking for c in txt]
    asc = fnt.getbbox("Ag")[3] + 8
    im = Image.new("RGBA", (int(sum(widths)) + 8, asc), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 2
    for c, cw in zip(txt, widths): d.text((x, 0), c, font=fnt, fill=fill); x += cw
    return im


def glow(layer, radius=18, strength=1.0):
    g = layer.filter(ImageFilter.GaussianBlur(radius))
    if strength != 1: g.putalpha(g.getchannel("A").point(lambda v: min(255, int(v * strength))))
    return g


def comp(base, layer, x, y, alpha=1.0):
    if alpha <= 0: return
    if alpha < 1:
        layer = layer.copy(); layer.putalpha(layer.getchannel("A").point(lambda v: int(v * alpha)))
    base.alpha_composite(layer, (int(round(x)), int(round(y))))


def kinetic(base, txt, fnt, x, y, t, start, stagger=0.03, dur=0.35, fill=WHITE, rise=40, tracking=0, out_at=None, out_dur=0.2):
    """Letters rise in with stagger + blur-in; optional exit (letters drop out)."""
    xx = x
    for i, c in enumerate(txt):
        cw = fnt.getlength(c) + tracking
        if c != " ":
            k = out_cubic(lin(t, start + i * stagger, start + i * stagger + dur))
            a = k
            if out_at is not None:
                ko = in_cubic(lin(t, out_at + i * stagger * 0.5, out_at + i * stagger * 0.5 + out_dur)); a *= 1 - ko
                yo = -rise * 0.6 * ko
            else:
                yo = 0
            if a > 0.01:
                L = text_layer(c, fnt, fill)
                if k < 0.6: L = L.filter(ImageFilter.GaussianBlur((0.6 - k) * 8))
                comp(base, L, xx, y + rise * (1 - k) + yo, a)
        xx += cw
    return xx - x


def text_w(txt, fnt, tracking=0): return sum(fnt.getlength(c) + tracking for c in txt)


# ---------------------------------------------------------------- logo mark (2x2 home tiles + roof chevron)
def logo(size, t_build=1.0, glow_amt=0.0):
    """RGBA logo mark; t_build 0..1 animates the tiles flying in."""
    pad = size * 0.22; S = int(size + pad * 2)
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    g = size * 0.08; tile = (size - g) / 2; r = tile * 0.24
    cols = [CYAN, (120, 140, 255), MAGENTA, AMBER]
    starts = [(-1, -1), (1, -1), (-1, 1), (1, 1)]
    for k in range(4):
        e = out_back(clamp((t_build - k * 0.12) / 0.55)) if t_build < 1 else 1
        ox, oy = starts[k]
        cx = pad + (k % 2) * (tile + g) + ox * (1 - e) * size * 0.9
        cy = pad + (k // 2) * (tile + g) + oy * (1 - e) * size * 0.9
        sc = 0.4 + 0.6 * clamp(e)
        tw = tile * sc
        x0 = cx + (tile - tw) / 2; y0 = cy + (tile - tw) / 2
        a = int(255 * clamp(e * 1.5))
        if k == 0:  # the "home" tile carries a roof chevron
            d.rounded_rectangle((x0, y0, x0 + tw, y0 + tw), r * sc, fill=cols[k] + (a,))
            m = tw * 0.22
            d.line([(x0 + m, y0 + tw * 0.56), (x0 + tw / 2, y0 + tw * 0.3), (x0 + tw - m, y0 + tw * 0.56)], fill=(10, 12, 30, a), width=max(2, int(tw * 0.11)), joint="curve")
            d.rectangle((x0 + tw * 0.34, y0 + tw * 0.56, x0 + tw * 0.66, y0 + tw * 0.74), fill=(10, 12, 30, a))
        else:
            d.rounded_rectangle((x0, y0, x0 + tw, y0 + tw), r * sc, fill=cols[k] + (int(a * 0.92),))
    if glow_amt > 0:
        g2 = glow(im, size * 0.12, glow_amt); g2.alpha_composite(im); im = g2
    return im


# ---------------------------------------------------------------- persistent overlays
def test_note(base, t, a=1.0):
    """Owner rule: legible note that the console assets in this footage will be remade."""
    if a <= 0: return
    f = font("semi", 24); txt = "TEST FOOTAGE · CONSOLE ASSETS WILL BE REMADE"
    tw = text_w(txt, f, 1.2); x1 = W - 56; x0 = x1 - tw - 46; y0 = 44
    L = Image.new("RGBA", (W, 120), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle((x0, y0, x1, y0 + 46), 23, fill=(8, 9, 20, 200), outline=(255, 255, 255, 70), width=1)
    d.ellipse((x0 + 16, y0 + 17, x0 + 26, y0 + 27), fill=AMBER + (255,))
    L.alpha_composite(text_layer(txt, f, (235, 238, 250), 1.2), (int(x0 + 34), y0 + 9))
    comp(base, L, 0, 0, a)


def brand_bug(base, t, a=1.0, n=None, total=17):
    if a <= 0: return
    L = Image.new("RGBA", (760, 130), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    # dark glass pill (matches the test-footage pill) so the bug reads on bright looks (Wii, Switch, Plaza)
    f = font("bold", 26); pw = 108 + f.getlength("Deck Home Themes") + (22 + font("med", 22).getlength("00 / 17") if n is not None else 0) + 22
    d.rounded_rectangle((38, 38, 38 + pw, 38 + 46 + 4), 25, fill=(8, 9, 20, 200), outline=(255, 255, 255, 70), width=1)
    m = logo(28); L.alpha_composite(m, (52, 44))
    L.alpha_composite(text_layer("Deck Home Themes", f), (100, 46))
    if n is not None:
        f2 = font("med", 22); s = f"{n:02d} / {total}"
        L.alpha_composite(text_layer(s, f2, (200, 205, 225)), (100 + int(f.getlength("Deck Home Themes")) + 22, 49))
    comp(base, L, 6, 6, a)


def name_tag(base, family, name, sub, u, dur, col):
    """Lower-left tag: accent bar grows, family label + name slide out from behind a mask."""
    k_in = out_expo(lin(u, 0.0, 0.16)); k_out = in_cubic(lin(u, dur - 0.1, dur))
    if k_in <= 0 or k_out >= 1: return
    x, y = 96, H - 236
    fam_f, name_f, sub_f = font("bold", 24), font("black", 76), font("med", 28)
    lay = Image.new("RGBA", (1300, 240), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    bar_h = int(178 * k_in)
    d.rounded_rectangle((0, 178 - bar_h, 9, 178), 4, fill=col + (255,))
    body = Image.new("RGBA", (1280, 240), (0, 0, 0, 0))
    body.alpha_composite(text_layer(family.upper(), fam_f, col, 4), (0, 6))
    body.alpha_composite(text_layer(name, name_f, WHITE), (-3, 34))
    if sub: body.alpha_composite(text_layer(sub, sub_f, (215, 220, 236)), (0, 132))
    off = int(-420 * (1 - k_in))
    mask = Image.new("L", body.size, 0); ImageDraw.Draw(mask).rectangle((0, 0, 1280, 240), fill=255)
    shifted = Image.new("RGBA", body.size, (0, 0, 0, 0)); shifted.alpha_composite(body, (max(0, off), 0)) if off >= 0 else shifted.alpha_composite(body.crop((-off, 0, 1280, 240)), (0, 0))
    lay.alpha_composite(shifted, (28, 0))
    # legibility: soft dark shadow behind the text
    sh = Image.new("RGBA", lay.size, (0, 0, 0, 0)); sh.putalpha(lay.getchannel("A").filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(min(255, v * 1.1))))
    a = 1 - k_out
    # soft dark glass panel behind the tag, grows with the bar
    pw = int((max(name_f.getlength(name), sub_f.getlength(sub or "")) + 110) * k_in)
    if pw > 20:
        pan = Image.new("RGBA", (pw + 120, 330), (0, 0, 0, 0))
        ImageDraw.Draw(pan).rounded_rectangle((60, 50, 60 + pw, 280), 26, fill=(6, 7, 18, 165))
        pan = pan.filter(ImageFilter.GaussianBlur(26))
        comp(base, pan, x - 96, y - 66 - 30 * k_out, a)
    comp(base, sh, x + 4, y + 6 - 30 * k_out, a * 0.85); comp(base, lay, x, y - 30 * k_out, a)


def bottom_scrim(img, strength=0.65, top=0.55):
    a = np.asarray(img).astype(np.float32)
    y = np.linspace(0, 1, H)[:, None, None]
    k = np.clip((y - 0.55) / 0.45, 0, 1) ** 1.6 * strength
    x = np.linspace(0, 1, W)[None, :, None]; k = k * (1 - 0.5 * x)
    a = a * (1 - k) + np.array([6, 7, 16]) * k
    y2 = np.clip((0.16 - y) / 0.16, 0, 1) ** 1.5 * top
    a = a * (1 - y2) + np.array([6, 7, 16]) * y2
    return Image.fromarray(a.astype(np.uint8))


def flash(img, k, col=(255, 255, 255)):
    if k <= 0: return img
    return Image.blend(img, Image.new("RGB", img.size, col), clamp(k))


def light_leak(img, t, k, hue=0):
    """Warm/cool light leak sweeping across (additive)."""
    if k <= 0: return img
    x = np.linspace(0, 1, W)[None, :]; y = np.linspace(0, 1, H)[:, None]
    cx = -0.2 + 1.4 * clamp(t); col = np.array([MAGENTA, AMBER, CYAN][hue % 3], np.float32)
    g = np.exp(-(((x - cx) * 1.6) ** 2 + ((y - 0.3) * 1.1) ** 2) / 0.08)[..., None] * col * 0.75 * k
    a = np.asarray(img).astype(np.float32) + g
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


# ---------------------------------------------------------------- storyboard
# montage slots: (start, end, family, name, sub, clip, clip offset, speed)
MONT = [
    (2.0, 2.5, "PlayStation", "PS1", "BIOS menu & memory cards", "ps1", 0.35, 1.2),
    (2.5, 3.0, "PlayStation", "PS2", "Orbiting lights browser", "ps2", 0.9, 1.3),
    (3.0, 3.5, "PlayStation", "PS3 · XMB", "XrossMediaBar with the wave", "ps3", 0.2, 1.5),
    (3.5, 4.0, "PlayStation", "PSP", "Compact XMB", "psp", 0.2, 1.4),
    (4.0, 4.5, "PlayStation", "PS4", "Tile row & function area", "ps4", 0.2, 1.4),
    (4.5, 5.0, "PlayStation", "PS5", "Games home with hero art", "ps5", 0.25, 1.4),
    (5.0, 5.5, "PlayStation", "PS Vita", "Bubbles & LiveArea", "vita", 0.2, 1.4),
    (5.5, 6.0, "Xbox", "Original Xbox", "The green orb dashboard", "xbox", 0.2, 1.4),
    (6.0, 7.0, "Xbox", "Xbox 360", "Blades · NXE · Kinect · Metro", "quad", 0, 1.0),
    (7.0, 7.5, "Nintendo", "Wii", "Channels & clock", "wii", 0.25, 1.4),
    (7.5, 8.0, "Nintendo", "Wii U", "Rounded software grid", "wiiu", 0.25, 1.4),
    (8.0, 9.0, "Nintendo", "WaraWara Plaza", "Your library, alive", "plaza", 0.2, 1.4),
    (9.0, 9.5, "Nintendo", "Switch", "Bright focus frame", "switch", 0.25, 1.4),
    (9.5, 10.0, "Nintendo", "Nintendo 3DS", "Two screens, one grid", "n3ds", 0.25, 1.4),
]
TRANS = ["whip", "zoom", "whipr", "wipe", "whip", "slide", "zoom", "wipe", "whipr", "zoom", "wipe", "whip", "slide", "zoom"]
NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17]  # 360 quad counts 4 looks
QUAD = [("blades", "Blades"), ("nxe", "NXE"), ("kinect", "Kinect"), ("metro", "Metro")]
MOSAIC = ["ps1", "ps2", "ps3", "psp", "ps4", "ps5", "vita", "xbox", "blades", "nxe", "kinect", "metro", "wii", "wiiu", "plaza", "switch", "n3ds", "minecraft", "imp-wiiu", "imp-3ds"]


def slot_frame(i, u):
    """Full-bleed 1920x1080 image of montage slot i at local time u (no overlays)."""
    s0, s1, fam, name, sub, cl, off, sp = MONT[i]
    dur = s1 - s0
    if cl == "quad": return quad_frame(u, dur)
    img = foot(cl, off + u * sp)
    z = 1.0 + 0.045 * (u / dur); drift = 24 * (u / dur - 0.5) * (1 if i % 2 else -1)
    return cover(img, W, H, z, dx=drift)


def quad_frame(u, dur):
    base = background(6 + u).convert("RGB")
    # 2x2 wall on the right two thirds, leaving the lower-left free for the name tag and the top for the bug / pill
    gw, gh, gap = 640, 360, 20; ox, oy = W - 2 * gw - gap - 64, (H - 2 * gh - gap) // 2 + 30
    for k, (cl, label) in enumerate(QUAD):
        e = out_expo(lin(u, 0.04 + k * 0.06, 0.34 + k * 0.06))
        if e <= 0: continue
        img = cover(foot(cl, 0.2 + u * 1.2), gw, gh, 1.02 + 0.03 * u)
        x = ox + (k % 2) * (gw + gap); y = oy + (k // 2) * (gh + gap)
        dx = (-1 if k % 2 == 0 else 1) * 300 * (1 - e); dy = (-1 if k < 2 else 1) * 160 * (1 - e)
        sc = 0.86 + 0.14 * e
        if sc < 0.999:
            img = img.resize((int(gw * sc), int(gh * sc)), Image.BILINEAR)
        paste_card(base, img, x + dx + (gw - img.width) / 2, y + dy + (gh - img.height) / 2, 16, shadow=True, alpha=clamp(e * 1.4))
        # dashboard label chip
        f = font("bold", 24); tw = f.getlength(label)
        L = Image.new("RGBA", (int(tw) + 40, 46), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        d.rounded_rectangle((0, 0, tw + 39, 45), 23, fill=(8, 9, 20, 215)); d.text((20, 7), label, font=f, fill=WHITE)
        base.paste(L, (int(x + dx + 16), int(y + dy + 16)), L) if e > 0.5 else None
    return base


def transition(a_img, b_img, p, kind, col):
    """p 0..1 across the cut (a = outgoing, b = incoming)."""
    if kind in ("whip", "whipr"):
        sgn = 1 if kind == "whip" else -1
        e = in_out_cubic(p); off = int(sgn * W * e)
        blur = 260 * math.sin(math.pi * p)
        out = Image.new("RGB", (W, H))
        out.paste(hblur(a_img, blur), (-off, 0)); out.paste(hblur(b_img, blur), (W * sgn - off, 0)) if sgn > 0 else out.paste(hblur(b_img, blur), (-W - off, 0))
        return out
    if kind == "zoom":
        if p < 0.5:
            k = in_cubic(p / 0.5); im = cover(a_img, W, H, 1 + 0.5 * k)
            im = im.filter(ImageFilter.GaussianBlur(10 * k)); return flash(im, k * 0.55)
        k = out_cubic((p - 0.5) / 0.5); im = cover(b_img, W, H, 1.35 - 0.35 * k)
        if k < 1: im = im.filter(ImageFilter.GaussianBlur(8 * (1 - k)))
        return flash(im, (1 - k) * 0.55)
    if kind == "slide":
        e = in_out_cubic(p); off = int(H * e); blur = 160 * math.sin(math.pi * p)
        out = Image.new("RGB", (W, H)); out.paste(vblur(a_img, blur), (0, -off)); out.paste(vblur(b_img, blur), (0, H - off)); return out
    # diagonal accent wipe
    e = in_out_cubic(p); edge = -500 + (W + 1000) * e
    m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m)
    d.polygon([(0, 0), (edge + 250, 0), (edge - 250, H), (0, H)], fill=255)
    out = Image.composite(b_img, a_img, m)
    d2 = ImageDraw.Draw(out, "RGBA")
    d2.polygon([(edge + 250, 0), (edge + 278, 0), (edge - 222, H), (edge - 250, H)], fill=col + (255,))
    d2.polygon([(edge + 290, 0), (edge + 298, 0), (edge - 202, H), (edge - 210, H)], fill=(255, 255, 255, 160))
    return out


# ---------------------------------------------------------------- sections
def draw_tiles(img, hx, hy, size, alpha=255, chevron=1.0):
    """The logo's four tiles drawn straight onto img, home tile centred on (hx, hy) (used for the zoom-through)."""
    d = ImageDraw.Draw(img, "RGBA"); tile = size * 0.46; g = size * 0.08; r = tile * 0.24
    cols = [CYAN, (120, 140, 255), MAGENTA, AMBER]
    x0, y0 = hx - tile / 2, hy - tile / 2
    for k in (1, 2, 3, 0):
        tx = x0 + (k % 2) * (tile + g); ty = y0 + (k // 2) * (tile + g)
        d.rounded_rectangle((tx, ty, tx + tile, ty + tile), r, fill=cols[k] + (alpha,))
    if chevron > 0:
        a = int(alpha * chevron); m = tile * 0.22
        d.line([(x0 + m, y0 + tile * 0.56), (x0 + tile / 2, y0 + tile * 0.3), (x0 + tile - m, y0 + tile * 0.56)], fill=(10, 12, 30, a), width=max(2, int(tile * 0.11)), joint="curve")
        d.rectangle((x0 + tile * 0.34, y0 + tile * 0.56, x0 + tile * 0.66, y0 + tile * 0.74), fill=(10, 12, 30, a))
    return (x0, y0, x0 + tile, y0 + tile, r)


def sec_title(t):
    img = background(t).convert("RGBA"); grid_overlay(img, t, 10)
    sz = 230; cy = 400 - 24 * out_cubic(lin(t, 0.5, 1.0))
    zt = in_out_cubic(lin(t, 1.5, 2.0))
    if zt <= 0:
        L = logo(sz, clamp(t / 0.9), glow_amt=0.6 * out_cubic(lin(t, 0.6, 1.0)))
        comp(img, L, W / 2 - L.width / 2, cy - L.height / 2)
    # wordmark + subtitle (letters drop out from 1.38 s)
    f = font("black", 120); txt = "Deck Home Themes"; tw = text_w(txt, f, -2)
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    kinetic(lay, txt, f, (W - tw) / 2, 590, t, 0.45, stagger=0.028, dur=0.42, rise=60, tracking=-2, out_at=1.38, out_dur=0.2)
    comp(img, glow(lay, 22, 0.55), 0, 0, 0.8); comp(img, lay, 0, 0)
    a_out = 1 - in_cubic(lin(t, 1.36, 1.56))
    f2 = font("med", 40); sub = "Console homes for your Steam Deck"
    k = out_cubic(lin(t, 1.0, 1.35))
    comp(img, text_layer(sub, f2, (200, 210, 240), 1), (W - text_w(sub, f2, 1)) / 2, 752 + 20 * (1 - k), k * a_out)
    k2 = out_expo(lin(t, 0.9, 1.4)); lw = 520 * k2 * a_out
    if lw > 6: ImageDraw.Draw(img).rounded_rectangle((W / 2 - lw / 2, 737, W / 2 + lw / 2, 743), 3, fill=CYAN + (255,))
    if zt > 0:  # zoom through the home tile onto the first console look
        s = sz * (W * 1.5 / (0.46 * sz)) ** (zt ** 1.6)
        hx0, hy0 = W / 2 - 0.27 * sz, cy - 0.27 * sz
        hx = hx0 + (W / 2 - hx0) * out_cubic(zt); hy = hy0 + (H / 2 - hy0) * out_cubic(zt)
        x0, y0, x1, y1, r = draw_tiles(img, hx, hy, s, 255, 1 - clamp((zt - 0.2) / 0.3))
        k = clamp((zt - 0.25) / 0.45)
        if k > 0:
            m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).rounded_rectangle((x0, y0, x1, y1), r, fill=int(255 * out_cubic(k)))
            first = slot_frame(0, 0).convert("RGBA")
            img.paste(first, (0, 0), m)
    out = img.convert("RGB")
    out = light_leak(out, lin(t, 0.3, 1.6), 0.5 * math.sin(math.pi * lin(t, 0.3, 1.6)), 0)
    if t < 0.12: out = Image.blend(Image.new("RGB", (W, H)), out, t / 0.12)
    return out


def sec_montage(t):
    # which slot
    i = max(k for k, m in enumerate(MONT) if m[0] <= t + 1e-9)
    s0, s1, fam, name, sub, cl, *_ = MONT[i]
    u = t - s0; col = FAMILY[fam]
    img = slot_frame(i, u)
    TW = 0.085
    if i + 1 < len(MONT) and t > s1 - TW:  # outgoing half of the transition
        p = (t - (s1 - TW)) / (2 * TW); img = transition(img, slot_frame(i + 1, 0), p, TRANS[i + 1], FAMILY[MONT[i + 1][2]])
    elif i > 0 and u < TW:
        p = 0.5 + u / (2 * TW); img = transition(slot_frame(i - 1, MONT[i - 1][1] - MONT[i - 1][0]), img, p, TRANS[i], col)
    if cl != "quad": img = bottom_scrim(img, 0.7)
    img = img.convert("RGBA")
    name_tag(img, fam, name, sub, u, s1 - s0, col)
    brand_bug(img, t, 1.0, NUMS[i])
    test_note(img, t)
    # family color edge glow when the family changes
    return img.convert("RGB")


def sec_mosaic(t):
    """10.0-11.0: zoom out from the last look into a wall of every look; '17 console homes'."""
    u = t - 10.0
    img = background(t).convert("RGB")
    cols, rows = 5, 4; cw, ch = 352, 220; gap = 18
    gwid = cols * cw + (cols - 1) * gap; ghei = rows * ch + (rows - 1) * gap
    wall = Image.new("RGB", (gwid + 200, ghei + 200), (10, 11, 24))
    wall.paste(background(t).resize(wall.size), (0, 0))
    for k, cl in enumerate(MOSAIC):
        r, c = divmod(k, cols)
        e = out_back(lin(u, 0.05 + 0.012 * k, 0.4 + 0.012 * k), 1.4)
        im = cover(foot(cl, 1.0 + u), cw, ch)
        x = 100 + c * (cw + gap); y = 100 + r * (ch + gap)
        if e < 0.999:
            s = max(0.05, 0.6 + 0.4 * e); im = im.resize((max(1, int(cw * s)), max(1, int(ch * s))))
        paste_card(wall, im, x + (cw - im.width) / 2, y + (ch - im.height) / 2, 12, shadow=False, alpha=clamp(e))
    # camera: start zoomed on the 3DS cell (index 16 -> row 3, col 1), pull back
    k = out_expo(lin(u, 0.0, 0.55))
    r, c = divmod(16, cols)
    fx = 100 + c * (cw + gap) + cw / 2; fy = 100 + r * (ch + gap) + ch / 2
    zoom_start = W / cw; zoom_end = min(W / wall.width, H / wall.height) * 1.12
    z = zoom_start * (1 - k) + zoom_end * k
    cxw = fx * (1 - k) + wall.width / 2 * k; cyw = fy * (1 - k) + wall.height / 2 * k
    vw, vh = W / z, H / z
    crop = wall.crop((int(cxw - vw / 2), int(cyw - vh / 2), int(cxw + vw / 2), int(cyw + vh / 2))).resize((W, H), Image.BILINEAR)
    img = crop
    if u < 0.12: img = Image.blend(slot_frame(13, 0.5), img, out_cubic(u / 0.12))
    # dark band + kinetic headline
    img = img.convert("RGBA")
    kb = out_expo(lin(u, 0.35, 0.6)); ko = in_cubic(lin(u, 0.86, 1.0))
    if kb > 0:
        band = Image.new("RGBA", (W, int(250 * kb)), (8, 9, 20, int(215 * (1 - ko))))
        comp(img, band, 0, H / 2 - band.height / 2)
        f = font("black", 110); txt = "17 console homes."; tw = text_w(txt, f, -1)
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        kinetic(lay, txt, f, (W - tw) / 2, H / 2 - 82, u, 0.4, stagger=0.018, dur=0.25, rise=50, tracking=-1)
        f2 = font("semi", 34); s2 = "ONE PLUGIN"; w2 = text_w(s2, f2, 10)
        comp(lay, text_layer(s2, f2, CYAN, 10), (W - w2) / 2, H / 2 + 50, out_cubic(lin(u, 0.55, 0.75)))
        comp(img, lay, 0, 0, 1 - ko)
    brand_bug(img, t, 1.0); test_note(img, t)
    return img.convert("RGB")


def sec_minecraft(t):
    """11.0-13.0: block-reveal into Block Worlds."""
    u = t - 11.0
    fr = cover(foot("minecraft", 0.4 + u * 1.15), W, H, 1.06 + 0.03 * u, anchor=(0.5, 1.0))  # crop past the header so the bug/pill sit on scenery
    prev = sec_mosaic(10.999) if u < 0.5 else None
    bs = 120; cols, rows = W // bs, math.ceil(H / bs)
    if u < 0.5:
        out = prev.copy(); d = ImageDraw.Draw(out)
        for gy in range(rows):
            for gx in range(cols):
                delay = ((gx + gy * 0.6) / (cols + rows * 0.6)) * 0.3
                e = out_back(lin(u, delay, delay + 0.16), 1.2)
                if e <= 0: continue
                s = int(bs * clamp(e, 0, 1.15))
                if s < 2: continue
                x0 = gx * bs + (bs - s) // 2; y0 = gy * bs + (bs - s) // 2
                tile = fr.crop((gx * bs, gy * bs, gx * bs + bs, gy * bs + bs)).resize((s, s))
                out.paste(tile, (x0, y0))
                if e < 1: d.rectangle((x0, y0, x0 + s - 1, y0 + s - 1), outline=(255, 255, 255), width=2)
        img = out
    else:
        img = fr
    img = bottom_scrim(img, 0.85, 0.9).convert("RGBA")
    name_tag(img, "Bonus looks", "Block Worlds", "Voxel sunset & a 3D player", max(0, u - 0.35), 1.65, AMBER)
    brand_bug(img, t, 1.0); test_note(img, t)
    # 'bonus' chip
    k = out_back(lin(u, 0.5, 0.8))
    if k > 0:
        f = font("black", 30); chip = "+ 9 BONUS LOOKS"; tw = text_w(chip, f, 3)
        L = Image.new("RGBA", (int(tw) + 50, 60), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        d.rounded_rectangle((0, 0, tw + 49, 59), 12, fill=AMBER + (255,)); L.alpha_composite(text_layer(chip, f, (20, 14, 6), 3), (25, 10))
        L = L.rotate(4 * (1 - k) - 3, expand=True, resample=Image.BICUBIC)
        comp(img, L, 96, H - 330 - 20 * (1 - k), clamp(k))
    out = img.convert("RGB")
    if u > 1.82:  # whoosh out
        k = in_cubic(lin(u, 1.82, 2.0)); out = flash(hblur(out, 200 * k), k * 0.2)
    return out


def headline(img, small, big, line2, u, x=110, y=330, col=CYAN, out_at=None):
    f1, f2, f3 = font("bold", 26), font("black", 92), font("med", 34)
    a_out = 1 - in_cubic(lin(u, out_at, out_at + 0.2)) if out_at else 1
    comp(img, text_layer(small.upper(), f1, col, 5), x, y + 20 * (1 - out_cubic(lin(u, 0.05, 0.3))), out_cubic(lin(u, 0.05, 0.3)) * a_out)
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    yy = y + 44
    for k, ln in enumerate(big.split("\n")):
        kinetic(lay, ln, f2, x - 4, yy, u, 0.12 + 0.12 * k, stagger=0.022, dur=0.32, rise=46, tracking=-1)
        yy += 104
    comp(img, glow(lay, 18, 0.4), 0, 0, 0.6 * a_out); comp(img, lay, 0, 0, a_out)
    k = out_cubic(lin(u, 0.45, 0.75))
    yy += 12
    for ln in line2.split("\n"):
        comp(img, text_layer(ln, f3, (205, 212, 236)), x, yy + 16 * (1 - k), k * a_out); yy += 46


def sec_spotlight(t):
    """13.0-16.0: Hub -> Plugin Spotlight, query typed, results filter. Card with push-in on the search box."""
    u = t - 13.0
    img = background(t).convert("RGBA"); grid_overlay(img, t, 9)
    headline(img, "Inside the Hub", "Plugin\nSpotlight", "Search every Decky plugin.\nOur picks first.", u, out_at=2.82)
    # footage timing: capture opens the Hub (0..), Spotlight list appears ~1.9 s, typing ~2.6-3.4 s, results ~3.4+
    ft = 1.55 + u * 1.15 if u < 1.0 else 2.7 + (u - 1.0) * 1.05
    fr = foot("spotlight", ft)
    k_in = out_expo(lin(u, 0.0, 0.45))
    cw, ch = 1120, 700
    x = 720 + 500 * (1 - k_in); y = 190
    # camera push-in on the search box while typing (u 0.9..2.1), then pull back to show the results
    push = in_out_cubic(lin(u, 0.85, 1.25)) * (1 - in_out_cubic(lin(u, 2.05, 2.45)))
    card = fr.resize((cw, ch), Image.LANCZOS)
    if push > 0:
        z = 1 + 0.55 * push
        # focus on the search field (upper part of the Spotlight page)
        fx, fy = 0.5 * cw, 0.30 * ch
        vw, vh = cw / z, ch / z
        x0 = clamp(fx - vw / 2, 0, cw - vw); y0 = clamp(fy - vh / 2, 0, ch - vh)
        card = fr.resize((int(cw * z), int(ch * z)), Image.LANCZOS).crop((int(x0 * z), int(y0 * z), int(x0 * z) + cw, int(y0 * z) + ch))
    if k_in < 1: card = hblur(card, 120 * (1 - k_in))
    paste_card(img, card, x, y, 20, border=(255, 255, 255, 60))
    # typed query callout
    q = "tuner"; nchar = int(clamp((u - 0.95) / 0.6) * len(q) + 0.001)
    k = out_back(lin(u, 0.9, 1.1)) * (1 - in_cubic(lin(u, 2.3, 2.5)))
    if k > 0:
        f = font("bold", 40); s = "“" + q[:nchar] + ("|" if int(u * 6) % 2 == 0 else " ") + "”"
        L = Image.new("RGBA", (420, 84), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        d.rounded_rectangle((0, 0, 419, 83), 42, fill=(255, 255, 255, 240)); d.text((34, 14), s, font=f, fill=(14, 16, 34))
        L2 = Image.new("RGBA", (420, 84)); L2 = L
        comp(img, L2, 110, 800 - 30 * (1 - k), clamp(k))
    brand_bug(img, t, 1.0)
    out = img.convert("RGB")
    if u > 2.86:
        k = in_cubic(lin(u, 2.86, 3.0)); out = hblur(out, 260 * k)
    return out


IMPORT_FILE = "Star Wars (homemenu).nxtheme"


def file_chip(name, ext_col=MAGENTA, sub="Your theme file"):
    f, f2 = font("bold", 30), font("med", 22)
    w = int(max(f.getlength(name), f2.getlength(sub))) + 130
    L = Image.new("RGBA", (w, 96), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle((0, 0, w - 1, 95), 18, fill=(250, 250, 255, 250))
    # document icon
    d.rounded_rectangle((22, 18, 72, 78), 8, fill=ext_col + (255,)); d.polygon([(56, 18), (72, 34), (56, 34)], fill=(255, 255, 255, 200))
    d.text((90, 14), name, font=f, fill=(16, 18, 36)); d.text((90, 54), sub, font=f2, fill=(90, 95, 120))
    return L


def sec_importer(t):
    """16.0-19.0: sneak peek. A theme file drops onto the Switch home; before/after wipe; then three more formats."""
    u = t - 16.0
    img = background(t).convert("RGBA"); grid_overlay(img, t, 9)
    cw, ch = 1120, 700; cx, cy = 720, 190
    if u < 1.75:
        headline(img, "Sneak peek", "Theme\nimporter", "Your theme files become\npresets, read on the Deck.", u, col=MAGENTA, out_at=1.6)
        k_in = out_expo(lin(u, 0.0, 0.4))
        before = foot("imp-switch", 0.5 + u * 0.3)
        after = foot("imp-switch", clip("imp-switch").span - 0.25)
        x = cx + 520 * (1 - k_in)
        # the file chip flies in from top-right and lands on the card at u=0.62
        chip = file_chip(IMPORT_FILE)
        kd = lin(u, 0.15, 0.62); e = out_cubic(kd)
        land = 0.62
        wipe = in_out_cubic(lin(u, 0.7, 1.25))
        card = before.resize((cw, ch), Image.LANCZOS)
        if wipe > 0:
            a2 = after.resize((cw, ch), Image.LANCZOS)
            m = Image.new("L", (cw, ch), 0); edge = int(cw * wipe)
            ImageDraw.Draw(m).rectangle((0, 0, edge, ch), fill=255)
            card = Image.composite(a2, card, m)
            if wipe < 1:
                d = ImageDraw.Draw(card, "RGBA")
                d.rectangle((edge - 3, 0, edge + 3, ch), fill=(255, 255, 255, 255))
                gl = Image.new("RGBA", (120, ch), (0, 0, 0, 0)); ImageDraw.Draw(gl).rectangle((50, 0, 70, ch), fill=MAGENTA + (200,))
                gl = gl.filter(ImageFilter.GaussianBlur(18)); card.paste(gl, (edge - 60, 0), gl)
        # landing pulse
        pulse = math.exp(-((u - land) / 0.08) ** 2) if u > land - 0.1 else 0
        sc = 1 + 0.025 * pulse
        if sc > 1.001: card = card.resize((int(cw * sc), int(ch * sc)), Image.BILINEAR)
        paste_card(img, card, x - (card.width - cw) / 2, cy - (card.height - ch) / 2, 20, border=(255, 255, 255, 60))
        # before / after labels
        for lab, lx, k in (("BEFORE", x, 1 - wipe), ("AFTER", x + cw - 130, wipe)):
            if k > 0.05 and u > 0.6:
                f = font("black", 24); L = Image.new("RGBA", (130, 44), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
                d.rounded_rectangle((0, 0, 129, 43), 10, fill=(8, 9, 20, 210)); d.text((65 - f.getlength(lab) / 2, 9), lab, font=f, fill=WHITE)
                comp(img, L, lx, cy + ch + 22, clamp(k * 2))
        if u < land + 0.25:
            sx, sy = W + 60, 760; ex, ey = cx + cw / 2 - chip.width / 2, cy + ch / 2 - 48
            px = sx + (ex - sx) * e; py = sy + (ey - sy) * e - math.sin(math.pi * kd) * 120
            rot = 18 * (1 - e)
            c2 = chip.rotate(rot, expand=True, resample=Image.BICUBIC)
            a = 1 - in_cubic(lin(u, land, land + 0.25))
            s = 1 - 0.5 * in_cubic(lin(u, land, land + 0.25))
            if s < 1: c2 = c2.resize((int(c2.width * s), int(c2.height * s)))
            sh = Image.new("RGBA", c2.size, (0, 0, 0, 0)); sh.putalpha(c2.getchannel("A").filter(ImageFilter.GaussianBlur(14)).point(lambda v: v // 2))
            comp(img, sh, px + 10, py + 24, a); comp(img, c2, px + (chip.width - c2.width) / 2, py, a)
        if land < u < land + 0.3:  # ring burst
            k = lin(u, land, land + 0.3); r = 60 + 380 * out_cubic(k)
            ring = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ccx, ccy = x + cw / 2, cy + ch / 2
            ImageDraw.Draw(ring).ellipse((ccx - r, ccy - r * 0.62, ccx + r, ccy + r * 0.62), outline=MAGENTA + (int(255 * (1 - k)),), width=6)
            img.alpha_composite(ring)
        out = img
        if u > 1.62: out = img.convert("RGB"); out = hblur(out, 300 * in_cubic(lin(u, 1.62, 1.75))).convert("RGBA")
    else:
        v = u - 1.75
        f = font("black", 64); tl = "Every format you love"
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        kinetic(lay, tl, f, 80, 130, v, 0.0, stagger=0.015, dur=0.26, rise=36, tracking=-1)
        comp(img, lay, 0, 0)
        items = [("imp-psp", "Persona 3.ctf", "PSP"), ("imp-wiiu", "Chill Mario.utheme", "Wii U"), ("imp-3ds", "Breath of the Wild", "3DS")]
        tw_, th_ = 560, 350; gap = 40; x0 = (W - 3 * tw_ - 2 * gap) / 2; y0 = 290
        for k, (cl, fname, cons) in enumerate(items):
            e = out_back(lin(v, 0.05 + 0.09 * k, 0.4 + 0.09 * k), 1.3)
            if e <= 0: continue
            fr = cover(foot(cl, clip(cl).span - 0.3 - 0.2 * (1 - v)), tw_, th_)
            yy = y0 + 220 * (1 - clamp(e)); a = clamp(e * 1.3)
            paste_card(img, fr, x0 + k * (tw_ + gap), yy, 16, alpha=a, border=(255, 255, 255, 50))
            chip = file_chip(fname, [CYAN, MAGENTA, AMBER][k], f"{cons} theme")
            comp(img, chip, x0 + k * (tw_ + gap) + 18, yy + th_ + 28, clamp((e - 0.3) * 2))
        f2 = font("med", 32); s2 = ".p3t  .ptf  .ctf  .nxtheme  .utheme  .mym  3DS  Xbox skins  360 themes"
        k = out_cubic(lin(v, 0.4, 0.7)); comp(img, text_layer(s2, f2, (190, 198, 228), 1), (W - text_w(s2, f2, 1)) / 2, 880 + 14 * (1 - k), k)
        out = img
        if v > 1.1:
            out = img.convert("RGB"); out = flash(out, in_cubic(lin(v, 1.1, 1.25)) * 0.9).convert("RGBA")
    brand_bug(out, t, 1.0); test_note(out, t)
    return out.convert("RGB")


def sec_end(t):
    u = t - 19.0
    img = background(t).convert("RGBA"); grid_overlay(img, t, 8)
    L = logo(150, 1.0, glow_amt=0.8)
    s = 0.9 + 0.1 * out_back(lin(u, 0, 0.35))
    L = L.resize((int(L.width * s), int(L.height * s)), Image.BICUBIC)
    comp(img, L, W / 2 - L.width / 2, 250 - L.height / 2 + 40, out_cubic(lin(u, 0, 0.2)))
    f = font("black", 104); txt = "Deck Home Themes"; tw = text_w(txt, f, -2)
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    kinetic(lay, txt, f, (W - tw) / 2, 400, u, 0.0, stagger=0.012, dur=0.22, rise=40, tracking=-2)
    comp(img, glow(lay, 20, 0.5), 0, 0, 0.7); comp(img, lay, 0, 0)
    f2 = font("med", 40); s2 = "Your Steam Deck, any console era."
    k = out_cubic(lin(u, 0.15, 0.4)); comp(img, text_layer(s2, f2, (215, 222, 245)), (W - text_w(s2, f2)) / 2, 552 + 14 * (1 - k), k)
    f3 = font("bold", 28); s3 = "A DECKY LOADER PLUGIN"; w3 = text_w(s3, f3, 6)
    k = out_cubic(lin(u, 0.25, 0.5)); comp(img, text_layer(s3, f3, CYAN, 6), (W - w3) / 2, 640, k)
    # the owner's note, readable on the end card too
    f4 = font("med", 26); s4 = "Test footage: console assets shown will be remade before release."
    w4 = text_w(s4, f4); k = out_cubic(lin(u, 0.3, 0.55))
    box = Image.new("RGBA", (int(w4) + 60, 56), (0, 0, 0, 0)); ImageDraw.Draw(box).rounded_rectangle((0, 0, w4 + 59, 55), 28, fill=(255, 255, 255, 22), outline=(255, 255, 255, 60))
    box.alpha_composite(text_layer(s4, f4, (225, 228, 240)), (30, 12))
    comp(img, box, (W - box.width) / 2, 900, k)
    out = img.convert("RGB")
    out = light_leak(out, lin(u, 0, 1.0), 0.45 * math.sin(math.pi * lin(u, 0, 1.0)), 2)
    if u < 0.1: out = flash(out, 1 - u / 0.1)
    if u > 0.9: out = Image.blend(out, Image.new("RGB", (W, H)), lin(u, 0.9, 1.0) * 0.6)
    return out


def frame(n):
    t = n / FPS
    if t < 2.0: img = sec_title(t)
    elif t < 10.0: img = sec_montage(t)
    elif t < 11.0: img = sec_mosaic(t)
    elif t < 13.0: img = sec_minecraft(t)
    elif t < 16.0: img = sec_spotlight(t)
    elif t < 19.0: img = sec_importer(t)
    else: img = sec_end(t)
    return grade(img).tobytes()


def init(foot_dir):
    global FOOT
    FOOT = foot_dir


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("footage"); ap.add_argument("audio"); ap.add_argument("out")
    ap.add_argument("--frames", default=""); ap.add_argument("--stills", default=""); ap.add_argument("--crf", default="18")
    ap.add_argument("--jobs", type=int, default=os.cpu_count())
    a = ap.parse_args()
    init(a.footage)
    rng = range(NFR)
    if a.frames:
        if "," in a.frames: rng = [int(x) for x in a.frames.split(",")]
        else: rng = range(*[int(x) for x in a.frames.split(":")])
    if a.stills:  # a few PNG stills for review
        os.makedirs(a.stills, exist_ok=True)
        with Pool(a.jobs, initializer=init, initargs=(a.footage,)) as pool:
            for n, buf in zip(rng, pool.imap(frame, rng)):
                Image.frombytes("RGB", (W, H), buf).save(f"{a.stills}/f{n:04d}.jpg", quality=92)
        return
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-i", a.audio, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", a.crf, "-pix_fmt", "yuv420p",
           "-profile:v", "high", "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-t", str(DUR), "-movflags", "+faststart", a.out]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool(a.jobs, initializer=init, initargs=(a.footage,)) as pool:
        for k, buf in enumerate(pool.imap(frame, rng, chunksize=4)):
            ff.stdin.write(buf)
            if k % 60 == 0: print("frame", k, flush=True)
    ff.stdin.close(); ff.wait()
    print("wrote", a.out)


if __name__ == "__main__":
    main()
