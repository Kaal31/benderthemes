"""Readers for real console theme files, in pure Python (Decky ships no imaging libs).

  * GIM textures (PSP/PS3): 16/32-bit, 4/8-bit indexed with palette, PSP swizzle
  * PSP themes: official .ptf and custom-firmware .ctf (same container; .ctf adds
    patched firmware .rco resources, read here by their texture names)
  * PS3 .p3t extras: slideshow/animated backgrounds stored as .raf scenes
    (DXT1/DXT5/ARGB textures) and the theme's sound effects (.vag)
  * PS-ADPCM (VAG) sound decoding to WAV

Nothing is written outside the folders the caller passes in.
"""
import io
import os
import struct
import wave
import zlib

# ───────────── PNG / WAV writers ─────────────

def png(w, h, pixels, channels=4):
    stride = w * channels
    raw = b"".join(b"\0" + pixels[y * stride:(y + 1) * stride] for y in range(h))

    def chunk(t, data):
        c = struct.pack(">I", len(data)) + t + data
        return c + struct.pack(">I", zlib.crc32(t + data) & 0xFFFFFFFF)

    ctype = 6 if channels == 4 else 2
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, ctype, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b""))


def wav(channels, rate, pcm):
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(channels)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm)
    return buf.getvalue()


# ───────────── GIM ─────────────
_GIM_BPP = {0: 16, 1: 16, 2: 16, 3: 32, 4: 4, 5: 8}


def _px16(v, fmt):
    if fmt == 0:
        return ((v & 31) << 3, ((v >> 5) & 63) << 2, ((v >> 11) & 31) << 3, 255)
    if fmt == 1:
        return ((v & 31) << 3, ((v >> 5) & 31) << 3, ((v >> 10) & 31) << 3, 255 if v >> 15 else 0)
    return ((v & 15) * 17, ((v >> 4) & 15) * 17, ((v >> 8) & 15) * 17, ((v >> 12) & 15) * 17)


def _gim_blocks(b, E):
    found = {}

    def walk(start, end, depth=0):
        p = start
        while p + 16 <= end and depth < 6:
            bid, _, size, _, doff = struct.unpack(E + "HHIII", b[p:p + 16])
            if bid in (2, 3):
                walk(p + doff, min(end, p + size), depth + 1)
            elif bid in (4, 5) and bid not in found:
                found[bid] = p + doff
            if size < 16:
                break
            p += size

    walk(16, len(b))
    return found


def _gim_plane(b, E, h0):
    _, _, fmt, order, w, h = struct.unpack(E + "HHHHHH", b[h0:h0 + 12])
    pix = h0 + struct.unpack(E + "I", b[h0 + 28:h0 + 32])[0]
    bits = _GIM_BPP.get(fmt)
    if bits is None or not w or not h:
        return None
    rowbytes = ((w * bits + 7) // 8 + 15) // 16 * 16
    rows = (h + 7) // 8 * 8
    data = b[pix:pix + rowbytes * rows]
    if len(data) < rowbytes * h:
        return None
    if order == 1:  # PSP swizzle: 16-byte x 8-row tiles
        data = data.ljust(rowbytes * rows, b"\0")
        out = bytearray(len(data))
        bw = rowbytes // 16
        i = 0
        for by in range(rows // 8):
            for bx in range(bw):
                for y in range(8):
                    o = (by * 8 + y) * rowbytes + bx * 16
                    out[o:o + 16] = data[i:i + 16]
                    i += 16
        data = bytes(out)
    return fmt, w, h, rowbytes, data


def gim_decode(b):
    """(w, h, rgba bytes) or None."""
    if len(b) < 32 or b[:4] not in (b"MIG.", b".GIM"):
        return None
    E = ">" if b[:4] == b".GIM" else "<"
    blocks = _gim_blocks(b, E)
    if 4 not in blocks:
        return None
    plane = _gim_plane(b, E, blocks[4])
    if not plane:
        return None
    fmt, w, h, rb, data = plane
    pal = None
    if fmt in (4, 5):
        if 5 not in blocks:
            return None
        pp = _gim_plane(b, E, blocks[5])
        if not pp or pp[0] not in (0, 1, 2, 3):
            return None
        pf, pw, ph, _, pd = pp
        n = pw * ph
        pal = [bytes(pd[i * 4:i * 4 + 4]) if pf == 3 else bytes(_px16(struct.unpack(E + "H", pd[i * 2:i * 2 + 2])[0], pf)) for i in range(n)]
        pal += [b"\0\0\0\0"] * (256 - len(pal))
    out = bytearray(w * h * 4)
    for y in range(h):
        row = data[y * rb:(y + 1) * rb]
        o = y * w * 4
        if fmt == 3:
            out[o:o + w * 4] = row[:w * 4]
        elif fmt == 5:
            out[o:o + w * 4] = b"".join(pal[v] for v in row[:w])
        elif fmt == 4:
            px = []
            for x in range(w):
                v = row[x >> 1]
                px.append(pal[(v >> 4) if x & 1 else (v & 15)])
            out[o:o + w * 4] = b"".join(px)
        else:
            for x in range(w):
                out[o + x * 4:o + x * 4 + 4] = bytes(_px16(struct.unpack(E + "H", row[x * 2:x * 2 + 2])[0], fmt))
    return w, h, bytes(out)


def gim_png(b, min_size=2):
    """PNG bytes; images smaller than min_size (1x1 'blank' patches) count as absent."""
    r = gim_decode(b)
    if not r or r[0] < min_size or r[1] < min_size:
        return None
    return png(*r)


# ───────────── PS-ADPCM (VAG) ─────────────
_ADPCM = ((0, 0), (60, 0), (115, -52), (98, -55), (122, -60))


def adpcm_decode(data):
    """Mono PS-ADPCM frames → list of int16 samples."""
    out = []
    s1 = s2 = 0
    for o in range(0, len(data) - 15, 16):
        sf = data[o]
        flags = data[o + 1]
        if flags == 7:
            break
        shift, filt = sf & 15, min(sf >> 4, 4)
        f0, f1 = _ADPCM[filt]
        for i in range(2, 16):
            byte = data[o + i]
            for nib in (byte & 15, byte >> 4):
                v = nib - 16 if nib & 8 else nib
                s = (v << 12) >> shift if shift <= 12 else 0
                s += (s1 * f0 + s2 * f1 + 32) >> 6
                s = -32768 if s < -32768 else 32767 if s > 32767 else s
                out.append(s)
                s2, s1 = s1, s
    return out


def vag_to_wav(left, right=None):
    """VAG file(s) (with 'VAGp' header) → WAV bytes, stereo when a right channel is given."""
    def one(v):
        if v[:4] != b"VAGp":
            return None, 0
        rate = struct.unpack(">I", v[16:20])[0] or 44100
        return adpcm_decode(v[48:]), rate
    l, rate = one(left)
    if not l:
        return None
    r = one(right)[0] if right else None
    if r:
        n = min(len(l), len(r))
        pcm = struct.pack("<%dh" % (2 * n), *[x for pair in zip(l[:n], r[:n]) for x in pair])
        return wav(2, rate, pcm)
    return wav(1, rate, struct.pack("<%dh" % len(l), *l))


def raw_adpcm_to_wav(data, channels, rate=44100):
    """Headerless PS-ADPCM (RCO sounds): channels stored one after another."""
    if channels < 1:
        return None
    part = len(data) // channels
    chans = [adpcm_decode(data[i * part:(i + 1) * part]) for i in range(channels)]
    n = min(len(c) for c in chans)
    if not n:
        return None
    if channels == 1:
        return wav(1, rate, struct.pack("<%dh" % n, *chans[0][:n]))
    pcm = struct.pack("<%dh" % (2 * n), *[x for pair in zip(chans[0][:n], chans[1][:n]) for x in pair])
    return wav(2, rate, pcm)


# Plugin sound cue (Steam file name) ← console cue names, best first.
SOUND_CUES = {
    "deck_ui_navigation.wav": ("snd_cursor", "se_cursor"),
    "deck_ui_tile_scroll.wav": ("snd_cursor", "se_cursor"),
    "deck_ui_default_activation.wav": ("snd_decide", "se_decide"),
    "deck_ui_into_game_detail.wav": ("snd_decide", "se_decide"),
    "deck_ui_out_of_game_detail.wav": ("snd_cancel", "se_cancel"),
    "deck_ui_launch_game.wav": ("snd_system_ok", "se_system_ok", "snd_decide", "se_decide"),
    "deck_ui_tab_transition_01.wav": ("snd_category_decide", "snd_cursor", "se_cursor"),
    "deck_ui_bumper_end_02.wav": ("snd_error", "snd_system_ng"),
    "deck_ui_show_modal.wav": ("snd_option", "se_optionmenu"),
    "deck_ui_hide_modal.wav": ("snd_cancel", "se_cancel"),
    "deck_ui_switch_toggle_on.wav": ("snd_decide", "se_decide"),
    # the PSP's own sounds for the Game, Music and Photo areas
    "dht_game_decide.wav": ("gam_decide",), "dht_game_cancel.wav": ("gam_cancel",),
    "dht_music_decide.wav": ("mus_decide",), "dht_music_cancel.wav": ("mus_cancel",),
    "dht_photo_decide.wav": ("pho_decide",), "dht_photo_cancel.wav": ("pho_cancel",),
}
SOUND_PACK_VERSION = 2  # packs written before the area sounds are rewritten once


def write_sound_pack(folder, name, cues):
    """cues: {console cue name: wav bytes}. Writes an AudioLoader-style pack; returns True if any file."""
    files = {}
    for target, wanted in SOUND_CUES.items():
        src = next((c for c in wanted if cues.get(c)), None)
        if src:
            files[target] = cues[src]
    if not files:
        return False
    os.makedirs(folder, exist_ok=True)
    for fname, data in files.items():
        with open(os.path.join(folder, fname), "wb") as f:
            f.write(data)
    import json
    with open(os.path.join(folder, "pack.json"), "w", encoding="utf-8") as f:
        json.dump({"name": name, "author": "theme file", "description": "Extracted from a console theme", "mappings": {}, "ignore": [], "dhtVersion": SOUND_PACK_VERSION}, f)
    return True


# ───────────── RCO (PSP firmware resources inside .ctf) ─────────────

def _rco_u32(c, o):
    return struct.unpack("<I", c[o:o + 4])[0]


def _rco_label(c, plab, o):
    if o == 0xFFFFFFFF or plab == 0xFFFFFFFF:
        return ""
    s = plab + o
    e = c.find(b"\0", s)
    return c[s:e].decode("latin1") if e > s else ""


def _rco_entries(c, table_off):
    if table_off == 0xFFFFFFFF or table_off + 0x28 > len(c):
        return
    n = _rco_u32(c, table_off + 0x10)
    p = table_off + 0x28
    for _ in range(min(n, 4096)):
        if p + 0x40 > len(c):
            return
        yield p, _rco_u32(c, p + 4)
        nxt = _rco_u32(c, p + 0x14)
        if not nxt:
            return
        p += nxt


def rco_unpack(c):
    """Firmware RCOs keep their tables zlib- or LZR-packed (header byte 0x0C); themes made by hex-editing
    Sony's files (CXMB, firmware 3.71 to 6.20) ship them that way. Returns the RCO with plain tables."""
    if c[:4] != b"\0PRF" or len(c) < 0xB0:
        return c
    mode = _rco_u32(c, 0x0C) & 0xF0
    if mode not in (0x10, 0x20):
        return c
    lp, lu = struct.unpack("<II", c[0xA4:0xAC])
    packed = c[0xB0:0xB0 + lp]
    try:
        if mode == 0x10:
            tables = zlib.decompressobj().decompress(packed)
        else:
            import psp_lzr
            tables = psp_lzr.lzr_decompress(packed)
    except Exception:
        tables = None
    if not tables or len(tables) < lu:
        return c
    u = bytearray(c[:0xA4]) + tables[:lu] + c[0xB0 + ((lp + 3) & ~3):]
    struct.pack_into("<I", u, 0x0C, _rco_u32(c, 0x0C) & ~0xF0)
    delta = lu - (12 + ((lp + 3) & ~3))
    for off in (0x80, 0x88, 0x90):  # picture / sound / model data: file positions after the packed tables
        if _rco_u32(u, off) != 0xFFFFFFFF:
            struct.pack_into("<I", u, off, _rco_u32(u, off) + delta)
    return bytes(u)


def rco_data(raw, comp):
    """One RCO resource, unpacked (compression 1 = zlib, 2 = LZR); None if it can't be read."""
    if comp & 0xFF == 1:
        try:  # tolerant: some theme tools cut the last bytes of a stream
            return zlib.decompressobj().decompress(raw) or None
        except Exception:
            return None
    if comp & 0xFF == 2:
        try:
            import psp_lzr
            return psp_lzr.lzr_decompress(raw)
        except Exception:
            return None
    return raw


class _RcoImages(dict):
    """{label: picture bytes}; each picture is unpacked the first time it is read (LZR is slow in Python)."""

    def __init__(self, packed):
        super().__init__((k, None) for k in packed)
        self._packed = packed

    def __getitem__(self, k):
        v = dict.__getitem__(self, k)
        if v is None:
            raw, comp = self._packed[k]
            v = rco_data(raw, comp) or b""
            dict.__setitem__(self, k, v)
        return v

    def get(self, k, default=None):
        return self[k] if k in self else default

    def values(self):
        return [self[k] for k in self]

    def items(self):
        return [(k, self[k]) for k in self]


def rco_images(c):
    """{label: decoded image bytes (GIM etc.)} for an RCO; entries without data are skipped."""
    if c[:4] != b"\0PRF":
        return {}
    plab, pdat = _rco_u32(c, 0x40), _rco_u32(c, 0x80)
    packed = {}
    for p, lab in _rco_entries(c, _rco_u32(c, 0x24)):
        comp = struct.unpack("<H", c[p + 0x2A:p + 0x2C])[0]
        size, off = _rco_u32(c, p + 0x2C), _rco_u32(c, p + 0x30)
        if not size or pdat == 0xFFFFFFFF or pdat + off + size > len(c):
            continue
        packed[_rco_label(c, plab, lab)] = (c[pdat + off:pdat + off + size], comp)
    return _RcoImages(packed)


def rco_sounds(c):
    """{label: wav bytes} for VAG sounds in an RCO."""
    if c[:4] != b"\0PRF":
        return {}
    plab, pdat = _rco_u32(c, 0x40), _rco_u32(c, 0x88)
    out = {}
    for p, lab in _rco_entries(c, _rco_u32(c, 0x1C)):
        fmt, ch = struct.unpack("<HH", c[p + 0x28:p + 0x2C])
        total, off = _rco_u32(c, p + 0x2C), _rco_u32(c, p + 0x30)
        if fmt != 1 or not total or pdat == 0xFFFFFFFF or pdat + off + total > len(c):
            continue
        data = c[pdat + off:pdat + off + total]
        try:
            if data[:4] == b"VAGp":  # one VAG file per channel, back to back
                part = total // max(ch, 1)
                w = vag_to_wav(data[:part], data[part:2 * part] if ch > 1 else None)
            else:
                w = raw_adpcm_to_wav(data, ch)
        except Exception:
            w = None
        if w:
            out[_rco_label(c, plab, lab)] = w
    return out


# Object tree (layout objects): slot counts per object kind, from RCOMage's attribute tables.
# References/events/images/texts take two 4-byte slots. Used for the theme's text styles.
_RCO_OBJ_SLOTS = {1: 9, 2: 18, 3: 41, 4: 26, 5: 5, 6: 32, 7: 24, 8: 32, 9: 22, 10: 4, 12: 4, 13: 49, 14: 18, 15: 38,
                  16: 2, 17: 40, 18: 16, 19: 35, 20: 6, 21: 42, 22: 41, 23: 26, 24: 4, 25: 22, 26: 33}


def rco_objects(c):
    """[(object kind, label, attribute bytes)] from an RCO's object tree (kind 13 = Text)."""
    if c[:4] != b"\0PRF":
        return []
    tbl, plab = _rco_u32(c, 0x30), _rco_u32(c, 0x40)
    out = []

    def entry(p, depth):
        if p + 0x28 > len(c) or depth > 40 or len(out) > 20000:
            return len(c)
        tid, lab, _ehs, esz, nsub, nxt = struct.unpack("<HxxIIIII", c[p:p + 0x18])
        kind, table = tid & 0xFF, tid >> 8
        extra = 0
        if table == 8 and kind:
            extra = esz - 0x28 if esz >= 0x28 else _RCO_OBJ_SLOTS.get(kind, 0) * 4
            out.append((kind, _rco_label(c, plab, lab), c[p + 0x28:p + 0x28 + extra]))
        q = p + 0x28 + extra
        for _ in range(min(nsub, 4096)):
            q = entry(q, depth + 1)
        return p + nxt if nxt else q

    if tbl != 0xFFFFFFFF:
        try:
            entry(tbl, 0)
        except struct.error:
            pass
    return out


def _rgb_css(r, g, b, a=1.0):
    k = lambda v: max(0, min(255, round(v * 255)))
    return "rgba(%d,%d,%d,%s)" % (k(r), k(g), k(b), round(max(0.0, min(1.0, a)), 3))


def rco_text_styles(c):
    """{label: {color, color2, shadow, shadowX, shadowY}} for the Text objects of an RCO."""
    out = {}
    for kind, label, a in rco_objects(c):
        if kind != 13 or len(a) < 41 * 4:
            continue
        f = struct.unpack("<41f", a[:41 * 4])
        # the object's own colour (floats 3-6) tints the text colour and sets how see-through it is: Large Original
        # Midnight Black and Organ draw their clock at 44% (the faded grey of the real console), Clear Black tints it black
        tint = [v if v == v and 0.0 <= v <= 1.0 else 1.0 for v in f[3:6]]
        alpha = f[6] if f[6] == f[6] and 0.0 <= f[6] <= 1.0 else 1.0
        out[label] = {"color": _rgb_css(f[23] * tint[0], f[24] * tint[1], f[25] * tint[2]), "color2": _rgb_css(f[26] * tint[0], f[27] * tint[1], f[28] * tint[2]),
                      "shadow": _rgb_css(f[37], f[38], f[39], f[40]), "shadowX": round(f[34], 2), "shadowY": round(-f[35], 2),
                      "x": round(f[0], 1), "y": round(f[1], 1), "size": round(f[22], 2)}
        if alpha < 0.999:
            out[label]["alpha"] = round(alpha, 3)
        # the object's own scale (floats 10-11): the console draws the text at size × scale, which is why one theme's clock is
        # 30% smaller than another's with the same "size" (Persona 3 draws it at 1.0, Large Original Midnight Black at 0.7)
        sx = f[10] if f[10] == f[10] and 0.2 <= f[10] <= 3.0 else 1.0
        if abs(sx - 1.0) > 0.01:
            out[label]["scale"] = round(sx, 2)
    return out


def battery_banner(blob, images):
    """A battery readout drawn as words sliding along a turned line (Persona 3: "BATTERY", "CHARGE" and the percentage,
    one after another from the top, sliding down-left at 17 degrees, repeating every 6 s), from system_plugin_fg.rco's
    layout: planes whose animations rotate them and loop a move. {"rot": degrees clockwise on screen, "bg": band | None,
    "items": [{img, x, y, w, h, dx, dy, dur, delay, show}]}, positions in layout units (centre origin, y up);
    None for the usual battery picture (no rotated planes)."""
    import math
    import psp_scene
    sc = psp_scene.rco_scene(blob)
    if not sc:
        return None
    anims, nodes = sc["anims"], {}

    def walk(ns, parent):
        for n in ns:
            nodes[n["n"]] = (n, parent)
            walk(n["ch"], n)

    for ns in sc["pages"].values():
        walk(ns, None)
    rot, moves = {}, {}  # object -> z rotation; object -> (target, duration, delay before the move starts)
    for n, _p in nodes.values():
        init = n.get("init")
        steps = anims.get(init[1]) if init and init[0] == "anim" else None
        wait = 0.0
        for st in steps or ():
            if st.get("t") == "rotate" and st.get("o") and st["v"][2]:
                rot[st["o"]] = st["v"][2]
            elif st.get("t") == "delay":
                wait += st["d"]
            elif st.get("t") == "fire" and st.get("kind") == "anim":
                for mv in anims.get(st["a"], ()):
                    if mv.get("t") == "move" and mv.get("o") and mv["d"] > 0:
                        moves.setdefault(mv["o"], (mv["v"][:2], mv["d"], wait))
                break
    objs = [o for o in moves if o in rot and o in nodes and o.startswith("bat")]
    if not objs:
        return None

    def colour_steps(anim):
        return [(s["o"], s["v"][3]) for s in anims.get(anim, ()) if s.get("t") == "color" and s.get("o") and len(s.get("v", ())) >= 4]

    idle_hide = {o for o, a in colour_steps("anim_battery_charging") if a < 0.01}
    charge_hide = {o for o, a in colour_steps("anim_battery_not_charging") if a < 0.01}

    def url(label):
        raw = images.get(label)
        if raw and raw[:4] in (b"MIG.", b".GIM"):
            p = gim_png(raw, 1)
            return _data_url(p, "image/png") if p else None
        return None

    items = []
    for o in objs:
        n, _ = nodes[o]
        pic = n
        sprite = False
        if not n.get("img"):  # a group (the percentage): its picture is the child, frames stacked
            kid = next((c for c in n["ch"] if c.get("img")), None)
            if not kid:
                continue
            pic, sprite = kid, True
        src = url(pic["img"])
        if not src:
            continue
        (x1, y1), dur, wait = moves[o]
        w, h = pic.get("w") or 0, pic.get("h") or 0
        if not w or not h:
            continue
        items.append({"img": src, "x": n["x"] + (pic["x"] if sprite else 0), "y": n["y"] + (pic["y"] if sprite else 0),
                      "w": round(w * pic.get("sx", 1), 1), "h": round(h * pic.get("sy", 1), 1), "rot": round(-math.degrees(rot[o]), 2),
                      "dx": round(x1 - n["x"], 1), "dy": round(y1 - n["y"], 1), "dur": dur, "delay": wait,
                      "show": "idle" if o in idle_hide else "charging" if o in charge_hide else "always", **({"frames": 4} if sprite else {})})
    if not items:
        return None
    out = {"items": items}
    bg = nodes.get("batbg", (None,))[0]
    if bg and bg.get("img") and "batbg" in rot:
        px = None
        raw = images.get(bg["img"])
        if raw and raw[:4] in (b"MIG.", b".GIM"):
            p = gim_png(raw, 1)
            px = _data_url(p, "image/png") if p else None
        if px:
            col = [bg.get(k, 1.0) for k in ("r", "g", "b", "a")]
            rows = _png_rows(px)  # the band's colour: its picture's middle row times the plane's own colour; the picture's edges fade it out
            mid = rows[2][rows[1] // 2][:3] if rows else (255, 255, 255)
            out["bg"] = {"img": px, "x": bg["x"], "y": bg["y"], "w": bg["w"], "h": bg["h"], "rot": round(-math.degrees(rot["batbg"]), 2),
                         "color": _rgb_css(mid[0] / 255 * col[0], mid[1] / 255 * col[1], mid[2] / 255 * col[2], col[3])}
    return out


# ───────────── PSP .ptf / .ctf ─────────────
# Category order in the PSP XMB (and in a .ptf's category section).
# .ptf slot numbers are fixed by Sony's theme converter, so slot N is the same XMB icon in
# every .ptf. Worked out from themes with recognisable stock-style icons; slot 0 is "default".
PTF_CATEGORIES = {1: "icon_setting", 2: "icon_photo", 3: "icon_music", 4: "icon_video", 5: "icon_tv",
                  6: "icon_game", 7: "icon_network", 8: "icon_extras"}  # 8: Extras (fw 6.20); .ptf has no PSN-category slot
PTF_ITEMS = {  # first-level icons; sub-item 2*N is the icon, 2*N+1 its focus glow
    1: "icon_gamedata", 2: "icon_umd", 3: "icon_camera", 4: "icon_gamesharing", 5: "icon_savedata",
    6: "icon_update", 7: "icon_network_update", 8: "icon_usb", 9: "icon_video_setting", 10: "icon_photo_setting",
    11: "icon_system_setting", 12: "icon_theme_setting", 13: "icon_datetime_setting", 14: "icon_powersave_setting",
    15: "icon_display_setting", 16: "icon_sound_setting", 17: "icon_security_setting", 18: "icon_rss_setting",
    19: "icon_network_setting", 20: "icon_onlinemanual", 21: "icon_remoteplay", 22: "icon_internet_radio",
    23: "icon_rss", 24: "icon_browser", 25: "icon_inet_search",
    26: "icon_psn_account",  # added with firmware 5.00
    27: "icon_system_storage", 28: "icon_resume_game", 29: "icon_savedata_folder",  # added with 6.20 (PSP Go)
}
# Firmware 6.6x topmenu_plugin.rco labels → the icon ids the XMB already asks .p3t themes for.
CTF_TOPMENU_66X = {
    "AJ": "icon_setting", "AK": "icon_extras", "AL": "icon_photo", "AM": "icon_music", "AN": "icon_video",
    "AO": "icon_game", "AP": "icon_network", "AQ": "icon_psn",
    "BH": "icon_umd", "BI": "icon_gamedata", "BJ": "icon_savedata", "BT": "icon_network_update", "BU": "icon_usb",
    "BV": "icon_video_setting", "BW": "icon_photo_setting", "BX": "icon_system_setting", "BY": "icon_theme_setting",
    "BZ": "icon_datetime_setting", "CA": "icon_powersave_setting", "CB": "icon_sound_setting", "CC": "icon_security_setting",
    "CD": "icon_network_setting", "CE": "icon_rss_setting", "CF": "icon_display_setting", "CG": "icon_bluetooth",
    "DJ": "icon_camera", "DM": "icon_sensme", "EV": "icon_rss", "EZ": "icon_skype",
    "EK": "icon_photo_album_default", "EU": "icon_browser", "EX": "icon_onlinemanual", "FB": "icon_inet_search",
    "FV": "icon_store",
}
# Browser textures used for the XMB's optional extras (focus glow, thumbnails…).
CTF_VISUALS = {
    "tex_focus": "focus", "tex_shadow": "shadow", "tex_default_thumb": "defaultThumb", "tex_loading": "loading",
    "tex_broken": "broken", "tex_unknown": "unknown", "tex_directory": "folder", "tex_parental": "parental",
    "tex_focus_line": "focusLine",  # the line under the selected row (video browser)
    "tex_optionmenu_base": "optionMenu",  # the △ options menu panel (a 480 × 1 strip, stretched)
    "tex_default_text_focus": "menuFocus",  # the highlight behind a selected text entry
    "photo_tex_album": "photoAlbum", "photo_tex_album_screenshot": "photoShots",
    "music_tex_album": "musicAlbum", "music_tex_track": "musicTrack",
    "tex_infobar": "infobar", "tex_busy": "busy",  # the notification bar sliding down from the top; the busy spinner
    "tex_dl_bar_base": "dlBase", "tex_dl_bar_indicate": "dlBar",  # download bar under an item (Video browser)
    "tex_default_progress_base": "progressBase", "tex_default_progress_slider": "progressBar",
}
# category icons in the order the XMB shows them, for firmware whose texture names aren't known
CTF_CATEGORY_ORDER_8 = ("icon_setting", "icon_extras", "icon_photo", "icon_music", "icon_video", "icon_game", "icon_network", "icon_psn")
CTF_CATEGORY_ORDER_7 = ("icon_setting", "icon_photo", "icon_music", "icon_video", "icon_game", "icon_network", "icon_psn")


def _data_url(raw, mime):
    import base64
    return "data:%s;base64,%s" % (mime, base64.b64encode(raw).decode("ascii"))


def category_bar(sizes, offsets=None):
    """Some themes draw the whole category row as ONE bar: every category's picture is the same wide
    strip (same width) with that category highlighted, all placed at the same spot (the layout's category
    container sits at x = 0 and the pictures bring their own spacing). Returns {"w", "h"} (native pixels of
    the tallest strip) when at least four category pictures are wide (aspect >= 3) and share one width, else None.
    A second kind (Large Original XMB): every picture holds ONE icon at its own baked place (widths 93..350, icon
    offset from the picture's centre growing from left to right); all are drawn at the same spot and together form
    the row. Needs offsets {key: icon centre x - picture centre x}; returns the same dict plus "row": True.
    sizes: {icon key: (w, h)}."""
    wide = [(w, h) for k, (w, h) in sizes.items() if k in CTF_CATEGORY_ORDER_8 and h and w >= 3 * h]
    if len(wide) >= 4 and len({w for w, _ in wide}) == 1:
        return {"w": wide[0][0], "h": max(h for _, h in wide)}
    if offsets:
        keys = [k for k in CTF_CATEGORY_ORDER_8 if k in offsets and k in sizes]
        xs = [offsets[k] for k in keys]
        if (len(keys) >= 6 and all(b > a + 8 for a, b in zip(xs, xs[1:])) and xs[-1] - xs[0] >= 120
                and sum(1 for x in xs if abs(x) >= 30) >= 4 and all(sizes[k][0] >= 3 * sizes[k][1] / 2 for k in keys)):
            return {"w": max(sizes[k][0] for k in keys), "h": max(sizes[k][1] for k in keys), "row": True}
    return None


def _png_rows(url):
    """(width, height, [unfiltered RGBA rows]) of a PNG data URL written by this module (8-bit RGBA, filter 0), else None."""
    import base64
    try:
        b = base64.b64decode(url.split(",", 1)[1])
        w, h = struct.unpack(">II", b[16:24])
        if b[:4] != b"\x89PNG" or b[24] != 8 or b[25] != 6:
            return None
        raw, pos = b"", 8
        while pos + 8 <= len(b):
            n, t = struct.unpack(">I4s", b[pos:pos + 8])
            if t == b"IDAT":
                raw += b[pos + 8:pos + 8 + n]
            pos += 12 + n
        raw = zlib.decompress(raw)
        rows = [raw[y * (w * 4 + 1):(y + 1) * (w * 4 + 1)] for y in range(h)]
        return None if any(r[0] != 0 for r in rows) else (w, h, [r[1:] for r in rows])
    except Exception:
        return None


def _png_icon_info(url):
    """For a picture holding one icon: (horizontal distance of the opaque pixels' centre from the picture's centre,
    row of the icon's top edge, its mean colour as CSS), in picture pixels; None when it can't be told."""
    px = _png_rows(url)
    if not px:
        return None
    w, h, rows = px
    lo, hi, top, n, rgb = w, -1, None, 0, [0, 0, 0]
    for y, row in enumerate(rows):
        for x in range(w):
            r, g, b, a = row[x * 4:x * 4 + 4]
            if a > 60:
                lo, hi = min(lo, x), max(hi, x)
                top = y if top is None else top
            if a > 230:  # the solid part, not the soft reflection under it
                n += 1
                rgb[0] += r
                rgb[1] += g
                rgb[2] += b
    if hi < 0:
        return None
    n = max(n, 1)
    return ((lo + hi + 1) / 2 - w / 2, top, "rgb(%d,%d,%d)" % tuple(round(c / n) for c in rgb))


def _baked_name(px):
    """For an item picture (w, h, rows) that carries its own name: {"top", "bottom", "color", "fill"?} in picture rows, else None.
    Two kinds on real themes: the name under the icon after a see-through gap (Large Original family: "Camera", "Memory Stick"),
    or light letters in the bottom of a dark tile (Organ: "CAMERA", "UMD")."""
    w, h, rows = px
    if h < 40 or w < 40:
        return None
    A = [[rows[y][x * 4 + 3] for x in range(w)] for y in range(h)]
    opaque = [sum(1 for a in r if a > 60) for r in A]
    # kind 1: the last run of opaque rows, 5..22 rows tall, after >= 2 clear rows, under a taller body
    y = h - 1
    while y >= 0 and not opaque[y]:
        y -= 1
    bottom = y
    while y >= 0 and opaque[y]:
        y -= 1
    top = y + 1
    gap = 0
    while y >= 0 and not opaque[y]:
        y -= 1; gap += 1
    body = sum(1 for v in opaque[:max(0, y + 1)] if v)
    if bottom >= 0 and 5 <= bottom - top + 1 <= 22 and gap >= 2 and body >= 2 * (bottom - top + 1):
        cols = [x for x in range(w) if any(A[r][x] > 60 for r in range(top, bottom + 1))]
        runs = sum(1 for i, x in enumerate(cols) if i == 0 or x != cols[i - 1] + 1)
        if runs >= 3:  # letters, not one solid shape (a shadow or a stand)
            rgb = [0, 0, 0]; n = 0
            for r in range(top, bottom + 1):
                for x in range(w):
                    if A[r][x] > 200:
                        p = rows[r][x * 4:x * 4 + 3]; rgb = [rgb[i] + p[i] for i in range(3)]; n += 1
            n = max(1, n)
            return {"h": h, "top": top, "bottom": bottom + 1, "color": "rgb(%d,%d,%d)" % tuple(round(c / n) for c in rgb)}
    # kind 2: a dark tile; in its lower third a band of bright letters, clear of the bright icon above by >= 2 rows
    # (the tile itself may be see-through: Organ's is about 60% opaque, its letters fully)
    lum = [[(rows[y][x * 4] * 3 + rows[y][x * 4 + 1] * 6 + rows[y][x * 4 + 2]) // 10 if A[y][x] > 20 else -1 for x in range(w)] for y in range(h)]
    solid = [sum(1 for v in r if v >= 0) for r in lum]
    tile_rows = [y for y in range(h) if solid[y] >= 0.8 * w]
    if len(tile_rows) < h // 2:
        return None
    dark = sorted(v for y in tile_rows for v in lum[y] if v >= 0)[len(tile_rows) * w // 4]
    lit = lambda y, x: lum[y][x] > dark + 70 and A[y][x] > 100
    bright = [sum(1 for x in range(w) if lit(y, x)) if y in tile_rows else 0 for y in range(h)]
    ys = [y for y in range(h * 2 // 3, h) if bright[y] >= 2]
    if not ys:
        return None
    b1 = ys[-1]; t1 = b1
    while t1 - 1 >= h * 2 // 3 and bright[t1 - 1] >= 2:
        t1 -= 1
    above = t1 - 1
    clear = 0
    while above >= 0 and bright[above] < 2 and above in tile_rows:
        above -= 1; clear += 1
    if not (4 <= b1 - t1 + 1 <= 14 and clear >= 2):
        return None
    cols = [x for x in range(w) if any(lit(r, x) for r in range(t1, b1 + 1))]
    runs = sum(1 for i, x in enumerate(cols) if i == 0 or x != cols[i - 1] + 1)
    if runs < 2:
        return None
    txt, bg = [0, 0, 0, 0], [0, 0, 0, 0]
    for r in range(t1, b1 + 1):
        for x in range(w):
            if A[r][x] > 20:
                p = rows[r][x * 4:x * 4 + 3]
                t = txt if lit(r, x) else bg
                t[0] += p[0]; t[1] += p[1]; t[2] += p[2]; t[3] += 1
    c = lambda t: "rgb(%d,%d,%d)" % tuple(round(t[i] / max(1, t[3])) for i in range(3))
    alpha = sum(A[r][x] for r in range(t1, b1 + 1) for x in range(w) if A[r][x] > 20 and not lit(r, x)) / max(1, bg[3]) / 255
    # the letters' rows plus one row of tile around them, across the tile's inner width (covered when another name is written there)
    mid = (t1 + b1) // 2
    inside = [x for x in range(w) if A[mid][x] > 20]
    x0, x1 = (inside[0] + 4, inside[-1] - 3) if inside and inside[-1] - inside[0] > 16 else (cols[0] - 1, cols[-1] + 2)
    x0, x1 = max(0, min(x0, cols[0] - 1)), min(w, max(x1, cols[-1] + 2))
    return {"h": h, "top": max(0, t1 - 1), "bottom": min(h, b1 + 2), "color": c(txt), "fill": c(bg)[:-1].replace("rgb", "rgba") + ",%.2f)" % alpha, "x0": x0, "x1": x1}



def _png_icon_offset(url):
    """Horizontal distance of a picture's opaque pixels' centre from the picture's centre (px), for the PNGs
    this module writes (unfiltered rows); None when it can't be told."""
    info = _png_icon_info(url)
    return info[0] if info else None


def _png_size(url):
    import base64
    b = base64.b64decode(url.split(",", 1)[1][:64])
    return struct.unpack(">II", b[16:24]) if b[:4] == b"\x89PNG" else (0, 0)


def _inflate(raw):
    """zlib data, or as much of it as a damaged / cut-off stream still yields (b"" when nothing)."""
    try:
        return zlib.decompress(raw)
    except Exception:
        pass
    try:
        return zlib.decompressobj().decompress(raw)
    except Exception:
        return b""


def _ptf_objects(d):
    """{object index: {sub-item index: decoded bytes}} from a .ptf/.ctf container.
    A theme only lists the sections it has (a wallpaper-only .ptf has two), and a damaged or cut-off file gives
    what could be read: a section that can't be parsed is skipped, the last sub-item may be partial."""
    if len(d) < 0x120:
        return {}
    secs = [o for o in struct.unpack("<8I", d[0x100:0x120]) if o and o + 4 <= len(d)]
    out = {}
    for s in secs:
        try:
            oi, cnt = struct.unpack("<HH", d[s:s + 4])
        except struct.error:
            continue
        subs = {}
        p = s + 0x20
        for _ in range(min(cnt, 1024)):
            if p + 0x20 > len(d):
                break
            sub, _, _, comp, cs, us = struct.unpack("<HHHHII", d[p:p + 16])
            raw = d[p + 0x20:p + 0x20 + cs]
            if comp == 2:
                raw = _inflate(raw)
            elif comp == 1:  # LZR: what Sony's own theme converter used
                try:
                    import psp_lzr
                    raw = psp_lzr.lzr_decompress(raw) or b""
                except Exception:
                    raw = b""
            subs[sub] = raw
            p += 0x20 + cs
        out.setdefault(oi, {}).update(subs)
    return out


_CTF_MAGIC = (b"\0PRF", b"BM", b"PSMF", b"PGF0", b"\0PGF", b"VAGp", b"RIFF", b"\x89PNG", b"MIG.")


def _ctf_files(d):
    """{'/vsh/resource/x.rco': bytes} from a .ctf's trailing file table.
    Each entry is a 64-byte path followed by [u32 offset][u32 size]. (Some tools write the
    pair in front of the path instead; whichever layout yields real files wins.)"""
    import re
    names = [m for m in re.finditer(rb"(?:flash0:)?/(?:vsh|font|kd|data)/[\w\-./]+", d) if m.start() > len(d) // 2]
    best, score = {}, -1
    for where in (64, -8):
        out, good = {}, 0
        for m in names:
            p = m.start() + where
            if p < 0 or p + 8 > len(d):
                continue
            off, size = struct.unpack("<II", d[p:p + 8])
            if size and off + size <= len(d):
                blob = d[off:off + size]
                out[m.group().decode("latin1")] = blob
                good += blob.startswith(_CTF_MAGIC)
        if good > score:
            best, score = out, good
    return best


def ctf_module_patches(d):
    """{'vshmain.prx': {offset: bytes}} from a .ctf: besides resources a CTF carries patches for the firmware's own modules
    (vshmain.prx, paf.prx, common_gui.prx...). Such an entry of the file table points at [u32 offset][u32 length][bytes]
    records and its size field holds the number of records. Most records change the upper half of a `lui` (the high 16 bits
    of a float constant): a place, a size or a spacing of the XMB."""
    import re
    out = {}
    for m in re.finditer(rb"/vsh/module/[\w\-.]+\.prx", d):
        p = m.start() + 64
        if m.start() < len(d) // 2 or p + 8 > len(d):
            continue
        off, n = struct.unpack("<II", d[p:p + 8])
        if not n or n > 4096 or off + 8 > len(d) or d[off:off + 4] in (b"\x7fELF", b"~PSP"):
            continue
        recs, q = {}, off
        for _ in range(n):
            if q + 8 > len(d):
                break
            o, ln = struct.unpack("<iI", d[q:q + 8])
            if ln > 64 or q + 8 + ln > len(d):
                break
            recs[o] = d[q + 8:q + 8 + ln]
            q += 8 + ln
        if recs:
            out[m.group().decode("latin1").rsplit("/", 1)[-1].lower()] = recs
    return out


def _patched_float(recs, offset, high=0x43):
    """The float a `lui` patch at offset sets (2 bytes: the whole upper half; 1 byte: its low byte under the given high byte,
    0x43 = the 128..511 range the stock positions sit in), or None when the theme leaves it alone."""
    b = recs.get(offset)
    if not b:
        return None
    v = b[0] | (b[1] << 8) if len(b) >= 2 else b[0] | (high << 8)
    f = struct.unpack("<f", struct.pack("<I", v << 16))[0]
    return f if f == f and abs(f) < 1e5 else None


def _scene_image(fmt, raw):
    if raw[:4] in (b"MIG.", b".GIM"):
        p = gim_png(raw, 1)
        return _data_url(p, "image/png") if p else None
    for magic, mime in ((b"\x89PNG", "image/png"), (b"BM", "image/bmp"), (b"\xff\xd8", "image/jpeg"), (b"GIF8", "image/gif")):
        if raw.startswith(magic):
            return _data_url(raw, mime)
    return None


READER_VERSION = 6  # bump when read_psp's output changes: cached results are read again


def read_psp(path):
    with open(path, "rb") as f:
        d = f.read()
    if d[:4] != b"\0PTF":
        return None
    raw_name = d[0x08:0x28].split(b"\0")[0]
    printable = raw_name and all(32 <= ch < 127 for ch in raw_name)
    name = raw_name.decode("ascii").strip() if printable and not raw_name.startswith(b"For CTF") else os.path.splitext(os.path.basename(path))[0]
    objs = _ptf_objects(d)
    tilt = origin = None
    res = {"name": name, "backgrounds": [], "icons": {}, "visuals": {}, "preview": None, "sounds": {}}
    tag = struct.unpack("<I", d[0x10:0x14])[0]
    fw = tag & 0xFFFF if tag >> 16 == 0xDEAD else 0  # CXMB / CTFTool write the firmware there (0xDEAD0500 = 5.00)
    if fw:
        res["firmware"] = "%x.%02x" % (fw >> 8, fw & 0xFF)

    def put_png(target, key, raw, min_size=2):
        try:
            p = gim_png(raw, min_size) if raw[:4] in (b"MIG.", b".GIM") else None
        except Exception:  # a damaged picture is skipped, the rest of the theme still reads
            p = None
        if p:
            target[key] = _data_url(p, "image/png")

    put_png(res, "preview", objs.get(0, {}).get(1, b""))
    wall = objs.get(1, {}).get(0, b"")
    if wall[:2] == b"BM":  # browsers show BMP natively
        res["backgrounds"].append(_data_url(wall, "image/bmp"))
        # the theme's wallpaper (not the month-colour strip 01-12.bmp the firmware tints its own background with): the console shows
        # it on the layout's wallpaper page, without the wave and without the default page's own pictures (real shots: Persona 3's
        # tower, never the city picture of its default page; Midnight Black's and Organ's wallpapers, no wave)
        res["wallpaper"] = True
    for slot, key in PTF_CATEGORIES.items():
        if slot in objs.get(2, {}):
            put_png(res["icons"], key, objs[2][slot])
    first = objs.get(3, {})
    for slot, key in PTF_ITEMS.items():
        if 2 * slot in first:
            put_png(res["icons"], key, first[2 * slot])
    focus = next((first[k] for k in sorted(first) if k % 2 == 1 and first[k]), None)
    if focus:
        put_png(res["visuals"], "focus", focus)
    if "icon_psn_account" in res["icons"]:  # the XMB's PlayStation Network "Account" entry
        res["icons"].setdefault("icon_user", res["icons"]["icon_psn_account"])
    second = objs.get(4, {})
    if 2 in second:  # the Settings wrench shown beside settings entries
        put_png(res["icons"], "icon_setting_item", second[2])
    files = _ctf_files(d)
    try:  # module patches name places in the 6.60/6.61 modules; other firmware has its code elsewhere
        vsh = ctf_module_patches(d).get("vshmain.prx", {}) if fw in (0x660, 0x661) else {}
    except Exception:
        vsh = {}
    if any(k.lower().endswith("/dht_stock_firmware") for k in files):
        res["stock"] = True  # converted from the PSP's own firmware: its background is tinted by the month colour
    for fname, blob in files.items():
        base = fname.rsplit("/", 1)[-1].lower()
        if base.endswith(".bmp") and not res["backgrounds"]:
            raw = blob
            if raw[:2] != b"BM":
                try:
                    raw = zlib.decompress(raw)
                except Exception:
                    raw = b""
            if raw[:2] == b"BM":
                res["backgrounds"].append(_data_url(raw, "image/bmp"))
            elif raw[:3] == b"\xff\xd8\xff":  # some themes ship a JPEG under the .bmp name
                res["backgrounds"].append(_data_url(raw, "image/jpeg"))
            elif raw[:4] == b"\x89PNG":
                res["backgrounds"].append(_data_url(raw, "image/png"))
        if base.endswith(".pmf") and "_gameboot" not in res:  # the clip played when a game starts
            res["_gameboot"] = blob
        if base in ("coldboot.at3", "gameboot.at3"):  # boot / game-start sounds, when a theme ships them
            res.setdefault("_bootsnd", {})[base[:-4]] = blob
        if not base.endswith(".rco"):
            continue
        blob = rco_unpack(blob)
        try:
            images = rco_images(blob)
        except Exception:
            images = {}
        if base in ("topmenu_icon.rco", "topmenu_plugin.rco"):
            for label, key in CTF_TOPMENU_66X.items():
                if label in images and key not in res["icons"]:
                    put_png(res["icons"], key, images[label])
        if base == "topmenu_icon.rco" and not any(l in CTF_TOPMENU_66X or l.startswith("icon_") for l in images):
            # other firmware versions name the category icons differently: they come in XMB order
            # the Extras column arrived with firmware 6.20; older themes have seven categories
            extras = len(images) >= 8 and (not fw or fw >= 0x620)
            order = CTF_CATEGORY_ORDER_8 if extras else CTF_CATEGORY_ORDER_7 if len(images) >= 7 else ()
            for key, label in zip(order, list(images)):
                raw = images[label]
                if key not in res["icons"]:
                    put_png(res["icons"], key, raw)
        for label in images:  # firmware with readable labels (no 6.6x renaming)
            if label.startswith("icon_") and label not in res["icons"]:
                put_png(res["icons"], label, images[label])
        if base == "system_plugin_bg.rco" and "scene" not in res:  # animated background + 3D wave
            try:
                import psp_scene
                sc = psp_scene.psp_scene(blob, _scene_image, png)
            except Exception:
                sc = None
            if sc:
                res["scene"] = sc
        if base == "topmenu_plugin.rco":  # a rotated parent of the category container tilts the whole bar
            try:
                import psp_scene
                tsc = psp_scene.rco_scene(blob)
                tilt = psp_scene.category_tilt(tsc)
                origin = psp_scene.category_origin(tsc)
            except Exception:
                tilt = origin = None
        if base == "opening_plugin.rco" and "intro" not in res:  # boot intro
            try:
                import psp_scene
                it = psp_scene.psp_intro(blob, _scene_image, png)
            except Exception:
                it = None
            if it:
                res["intro"] = it
        if base == "system_plugin_fg.rco":  # clock and information text: colour + shadow; battery picture
            bat = images.get("tex_battery")
            if bat and bat[:4] in (b"MIG.", b".GIM"):
                p = gim_png(bat, 4)
                if p:
                    res["status"] = {"battery": _data_url(p, "image/png"), "frames": 4}
                    try:
                        banner = battery_banner(blob, images)
                    except Exception:
                        banner = None
                    if banner:
                        res["status"]["banner"] = banner
            try:
                styles = rco_text_styles(blob)
            except Exception:
                styles = {}
            if "clock" in styles:
                res.setdefault("text", {})["clock"] = styles["clock"]
                # The clock's place is not the layout's: vshmain.prx holds it as two constants, the text's right end at 0x31108
                # (stock 203) and the middle of its line at 0x31044 (stock 123), layout units from the centre, y up, and a theme
                # moves the clock by patching them. The layout's own x/y are ignored. Checked on the real shots of 236 patched
                # and 40 unpatched pspunk.com themes: every unpatched clock ends at 443 of 480 whatever its layout x (Mgs.pw: 280),
                # patched ones end at 240 + the value (Midnight Black 215 → 455, Persona 3 235 → 474, Organ v2 -146 → 93, Modern Pro
                # 50 → 290, iOS 37 → 277), and 0x31044 sets the height (Organ v2 128 → 8 px from the top, Modern Pro 130 → 6;
                # Lucky Star's layout says -128 yet its clock is at the top). A one-byte patch changes the low byte only.
                right = _patched_float(vsh, 0x31108, 0x43)
                mid = _patched_float(vsh, 0x31044, 0x42)
                styles["clock"]["right"] = round(right, 1) if right is not None and -400 <= right <= 400 else 203.0
                styles["clock"]["mid"] = round(mid, 1) if mid is not None and -400 <= mid <= 400 else 123.0
            info = styles.get("infotext1") or styles.get("infotext2")
            if info:
                res.setdefault("text", {})["label"] = info
                res["text"]["info"] = info  # the notification bar's text: colour, size, place inside the bar
        for label, key in CTF_VISUALS.items():
            if label in images and key not in res["visuals"]:
                put_png(res["visuals"], key, images[label], 1)
        try:
            res["sounds"].update(rco_sounds(blob))
        except Exception:
            pass
    fonts = sorted((k.rsplit("/", 1)[-1].lower(), v) for k, v in files.items() if k.lower().endswith(".pgf"))
    if fonts:
        main = next((v for n, v in fonts if n.startswith("ltn0")), fonts[0][1])
        try:
            import psp_font
            wf = psp_font.pgf_webfont(main, [v for _, v in fonts if v is not main])
        except Exception:
            wf = None
        if wf:
            res["font"] = {"name": wf[0], "ttf": _data_url(wf[1], "font/ttf")}
    ic = res["icons"]
    sizes = {k: _png_size(v) for k, v in ic.items() if k in CTF_CATEGORY_ORDER_8}
    bar = category_bar(sizes)
    if not bar and len(sizes) >= 6 and len({w for w, _ in sizes.values()}) >= 5:  # per-icon baked places: look closer
        info = {k: i for k, i in ((k, _png_icon_info(ic[k])) for k in sizes) if i is not None}
        bar = category_bar(sizes, {k: i[0] for k, i in info.items()})
        if bar and bar.get("row"):
            # the pictures carry no pointer for the selected category: the row gets a small ▼ over its icon, in the icon's colour
            bar["marks"] = {k: {"x": i[0], "y": i[1], "c": i[2]} for k, i in info.items()}
    if bar:
        if tilt:
            bar.update(tilt)
        elif origin:  # the item list hangs from the category container (the selected row sits at its place)
            bar["ix"], bar["iy"] = round(origin[0] + 1, 1), round(origin[1], 1)
        # The "large" family (Large Original, Midnight Black, Blue Neon, Large Black/White, Organ): the item pictures carry their own
        # names (under the icon, or in the bottom of a tile) and the module patches push the console's own item names off the screen.
        # On every real shot of them (pspunk.com, YouTube: Settings, Photo, Network, Game) only the selected item is shown, its
        # picture centred on the category container (x 0: the screen's middle) at its own size. So a theme with a centred container
        # whose item pictures (at least five) carry names is drawn that way; the names' places let the UI write its own item names there.
        names = {}
        for k, v in ic.items():
            if k in CTF_CATEGORY_ORDER_8:
                continue
            px = _png_rows(v)
            nm = _baked_name(px) if px else None
            if nm:
                names[k] = nm
        if not tilt and abs(bar.get("ix", 99) - 1) <= 20 and len(names) >= 5:
            bar["big"] = True
            bar["names"] = names
        res["catBar"] = bar
    elif list(sizes) == ["icon_setting"] and 2.5 * sizes["icon_setting"][1] <= sizes["icon_setting"][0] <= 120:
        # the theme ships only the rounded frame of the selected category (Yuki Snow): the categories are plain words
        # in a row along the bottom, 60 px apart, the first at the container's x, the frame behind the selected one
        w, h = sizes["icon_setting"]
        res["catText"] = {"w": w, "h": h, "frame": ic.pop("icon_setting"), "x": origin[0] if origin else -210, "gap": 60}
    if "icon_download" not in ic and ("icon_network_update" in ic or "icon_update" in ic):
        ic["icon_download"] = ic.get("icon_network_update") or ic["icon_update"]  # Downloads ↔ update arrows
    if "icon_psn_account" in ic:
        ic.setdefault("icon_user", ic["icon_psn_account"])
    return res


# ───────────── PS3 .raf slideshow backgrounds ─────────────

def _c565(v):
    r, g, b = (v >> 11) & 31, (v >> 5) & 63, v & 31
    return (r << 3) | (r >> 2), (g << 2) | (g >> 4), (b << 3) | (b >> 2)


def _dxt_rgb(data, w, h, alpha_bytes=0):
    """DXT1 (alpha_bytes=0) or DXT3/5 colour part (alpha_bytes=8) → packed RGB."""
    out = bytearray(w * h * 3)
    bs = 8 + alpha_bytes
    bw = (w + 3) // 4
    unpack = struct.unpack_from
    cache = {}
    for by in range((h + 3) // 4):
        for bx in range(bw):
            o = (by * bw + bx) * bs + alpha_bytes
            c0, c1, bits = unpack("<HHI", data, o)
            pal = cache.get((c0, c1))
            if pal is None:
                r0, g0, b0 = _c565(c0)
                r1, g1, b1 = _c565(c1)
                if c0 > c1 or alpha_bytes:
                    pal = (bytes((r0, g0, b0)), bytes((r1, g1, b1)),
                           bytes(((2 * r0 + r1) // 3, (2 * g0 + g1) // 3, (2 * b0 + b1) // 3)),
                           bytes(((r0 + 2 * r1) // 3, (g0 + 2 * g1) // 3, (b0 + 2 * b1) // 3)))
                else:
                    pal = (bytes((r0, g0, b0)), bytes((r1, g1, b1)),
                           bytes(((r0 + r1) // 2, (g0 + g1) // 2, (b0 + b1) // 2)), b"\0\0\0")
                if len(cache) < 65536:
                    cache[(c0, c1)] = pal
            for py in range(4):
                y = by * 4 + py
                if y >= h:
                    break
                base = (y * w + bx * 4) * 3
                for px in range(4):
                    if bx * 4 + px >= w:
                        break
                    i = base + px * 3
                    out[i:i + 3] = pal[(bits >> (2 * (py * 4 + px))) & 3]
    return bytes(out)


def _dxt_alpha(data, w, h, kind):
    """Alpha of DXT1 (kind 1: transparent where c0 <= c1 and index 3), DXT3 (3) or DXT5 (5) → bytes."""
    out = bytearray(b"\xff" * (w * h))
    bs = 8 if kind == 1 else 16
    bw = (w + 3) // 4
    for by in range((h + 3) // 4):
        for bx in range(bw):
            o = (by * bw + bx) * bs
            if kind == 3:
                bits = int.from_bytes(data[o:o + 8], "little")
                vals = [((bits >> (4 * i)) & 15) * 17 for i in range(16)]
            elif kind == 5:
                a0, a1 = data[o], data[o + 1]
                bits = int.from_bytes(data[o + 2:o + 8], "little")
                if a0 > a1:
                    pal = [a0, a1] + [((7 - i) * a0 + i * a1) // 7 for i in range(1, 7)]
                else:
                    pal = [a0, a1] + [((5 - i) * a0 + i * a1) // 5 for i in range(1, 5)] + [0, 255]
                vals = [pal[(bits >> (3 * i)) & 7] for i in range(16)]
            else:
                c0, c1, bits = struct.unpack_from("<HHI", data, o)
                if c0 > c1:
                    continue
                vals = [0 if ((bits >> (2 * i)) & 3) == 3 else 255 for i in range(16)]
            for i in range(16):
                y, x = by * 4 + i // 4, bx * 4 + i % 4
                if y < h and x < w:
                    out[y * w + x] = vals[i]
    return bytes(out)


def _rgba(rgb, alpha):
    out = bytearray(len(alpha) * 4)
    out[0::4], out[1::4], out[2::4] = rgb[0::3], rgb[1::3], rgb[2::3]
    out[3::4] = alpha
    return bytes(out)


def gtf_png(g, alpha=False):
    """PS3 GTF texture → PNG bytes (DXT1/3/5 and A8R8G8B8), or None."""
    if len(g) < 128:
        return None
    off = struct.unpack(">I", g[16:20])[0]
    fmt = g[24] & 0x9F  # drop the linear/normalised flags
    w, h = struct.unpack(">HH", g[32:36])
    pitch = struct.unpack(">I", g[40:44])[0]
    data = g[off:]
    if fmt == 0x86 and len(data) >= ((w + 3) // 4) * ((h + 3) // 4) * 8:
        rgb = _dxt_rgb(data, w, h)
        if alpha:
            a = _dxt_alpha(data, w, h, 1)
            if a.count(255) != len(a):
                return png(w, h, _rgba(rgb, a))
        return png(w, h, rgb, 3)
    if fmt in (0x87, 0x88) and len(data) >= ((w + 3) // 4) * ((h + 3) // 4) * 16:
        rgb = _dxt_rgb(data, w, h, 8)
        if alpha:  # scenes need the alpha; slideshow pictures don't
            return png(w, h, _rgba(rgb, _dxt_alpha(data, w, h, 3 if fmt == 0x87 else 5)))
        return png(w, h, rgb, 3)
    if fmt == 0x85:  # A8R8G8B8, big-endian
        pitch = pitch or w * 4
        if len(data) < pitch * h:
            return None
        out = bytearray(w * h * 4)
        for y in range(h):
            row = data[y * pitch:y * pitch + w * 4]
            o = y * w * 4
            out[o + 0:o + w * 4:4] = row[1::4]
            out[o + 1:o + w * 4:4] = row[2::4]
            out[o + 2:o + w * 4:4] = row[3::4]
            out[o + 3:o + w * 4:4] = row[0::4]
        return png(w, h, bytes(out))
    return None


def _xml_tree(d, base_hdr):
    """Parse the P3T/RAF binary-XML tree. Returns [(tag, attrs)], file area offset."""
    vals = struct.unpack(">" + "I" * 13, d[4:56]) if base_hdr == 13 else struct.unpack(">" + "I" * 15, d[4:64])
    if base_hdr == 13:
        _, tree_off, _, id_off, _, str_off, _, _, _, _, _, file_off, _ = vals
        float_off = int_off = None
    else:
        _, tree_off, _, id_off, _, str_off, _, int_off, _, float_off, _, file_off, _, _, _ = vals

    def cstr(o):
        e = d.index(b"\0", o)
        return d[o:e].decode("latin1")

    nodes = []

    def elem(o, depth=0):
        p = tree_off + o
        name, nattr, _, _, nxt, fc, _ = struct.unpack(">7i", d[p:p + 28])
        attrs = {}
        for i in range(nattr):
            a = p + 28 + i * 16
            an, at, v1, v2 = struct.unpack(">4i", d[a:a + 16])
            key = cstr(str_off + an)
            if at == 1:
                attrs[key] = v1
            elif at == 3:
                attrs[key] = cstr(str_off + v1)
            elif at == 6:
                attrs[key] = ("file", v1, v2)
            elif at in (7, 8):
                attrs[key] = cstr(id_off + v1 + 4)
            elif at == 2:  # float
                attrs[key] = struct.unpack(">f", struct.pack(">i", v1))[0]
            elif at == 5 and float_off is not None and 0 <= v2 < 4096:  # float array (offset, count in floats)
                attrs[key] = list(struct.unpack(">%df" % v2, d[float_off + v1 * 4:float_off + (v1 + v2) * 4]))
            elif at == 4 and int_off is not None and 0 <= v2 < 4096:  # int array
                attrs[key] = list(struct.unpack(">%di" % v2, d[int_off + v1 * 4:int_off + (v1 + v2) * 4]))
        nodes.append((cstr(str_off + name), attrs))
        c = fc
        while c != -1 and depth < 32:
            c = elem(c, depth + 1)
        return nxt

    elem(0)
    return nodes, file_off


def raf_textures(blob):
    """Background images inside a .raf scene ('_RAF' + zlib 'RAFO'), in scene order, as GTF bytes."""
    if blob[:4] != b"_RAF":
        return []
    try:
        d = zlib.decompress(blob[8:])
    except Exception:
        return []
    if d[:4] != b"RAFO":
        return []
    nodes, file_off = _xml_tree(d, 15)
    files = {}
    for tag, a in nodes:
        if tag == "file" and isinstance(a.get("src"), tuple) and isinstance(a.get("id"), str):
            _, off, ln = a["src"]
            files[a["id"]] = d[file_off + off:file_off + off + ln]
    tex_by_id = {a["id"]: a.get("fileref") for tag, a in nodes if tag == "texture" and "id" in a}
    order = []
    for tag, a in nodes:  # actor → material → texture, keeps the slideshow order
        if tag == "_texture" and a.get("texref") in tex_by_id:
            ref = tex_by_id[a["texref"]]
            if ref in files and ref not in order:
                order.append(ref)
    for ref in (k for k in files if k.lower().endswith(".gtf")):
        if ref not in order:
            order.append(ref)
    return [files[r] for r in order]


def p3t_sounds(d, nodes, blob):
    """{se id: wav bytes} from a .p3t's <se left right> entries."""
    out = {}
    for tag, a in nodes:
        if tag != "se" or not isinstance(a.get("id"), str):
            continue
        left, right = a.get("left"), a.get("right")
        try:
            w = vag_to_wav(blob(left), blob(right) if right else None) if left else None
        except Exception:
            w = None
        if w:
            out[a["id"]] = w
    return out
