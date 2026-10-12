"""PSP theme background scenes (.ctf → system_plugin_bg.rco).

rco_scene(): the RCO layout objects (pages of planes / models) and their animation scripts.
gmo_wave(): the 3D XMB wave model (GMO): a cubic B-spline surface, its fcurve animation and
its reflection map, as plain data for the UI's WebGL renderer.
psp_scene(): both, as JSON-ready data with images as data URLs."""
import math
import struct


def _u32(c, o): return struct.unpack("<I", c[o:o + 4])[0]

def _cstr(c, o):
    e = c.find(b"\0", o)
    return c[o:e].decode("latin1") if e > o else ""

_OBJ_SLOTS = {1: 9, 2: 18, 3: 41, 4: 26, 5: 5, 6: 32, 7: 24, 8: 32, 9: 22, 10: 4, 12: 4, 13: 49, 14: 18, 15: 38,
              16: 2, 17: 40, 18: 16, 19: 35, 20: 6, 21: 42, 22: 41, 23: 26, 24: 4, 25: 22, 26: 33}
_ANIM_SLOTS = {1: 0, 2: 7, 3: 8, 4: 7, 5: 7, 6: 5, 7: 1, 8: 2, 9: 1, 10: 1, 11: 8}
_NONSTD = {1, 5, 10, 12, 16, 20, 24}  # object kinds without the standard position block
_KIND = {1: "page", 2: "plane", 13: "text", 14: "model", 18: "group"}
_STEP = {2: "move", 3: "color", 4: "rotate", 5: "resize", 6: "fade", 7: "delay", 8: "fire", 9: "lock", 10: "unlock", 11: "slide"}


def rco_scene(c):
    """Layout scene of an RCO: object pages (planes, groups, models) and their animations.
    {"pages": {name: [node]}, "anims": {name: [step]}, "images": {label: (fmt, raw)}, "models": {label: raw}}"""
    if c[:4] != b"\0PRF":
        return None
    H = struct.unpack("<38I", c[:38 * 4])
    p_obj, p_anim, p_img, p_model = H[12], H[13], H[9], H[8]
    p_lab, p_evt = H[16], H[18]
    p_imgdata, p_modeldata = H[32], H[36]
    labels = {}  # entry offset -> label

    def entries(tbl, visit, depth=0):
        if tbl == 0xFFFFFFFF or tbl + 0x28 > len(c):
            return

        def walk(p, depth, parent):
            if p + 0x28 > len(c) or depth > 48:
                return len(c)
            tid, lab, _ehs, esz, nsub, nxt = struct.unpack("<HxxIIIII", c[p:p + 0x18])
            kind, table = tid & 0xFF, tid >> 8
            name = _cstr(c, p_lab + lab) if lab != 0xFFFFFFFF and p_lab != 0xFFFFFFFF else ""
            labels[p] = name
            if esz >= 0x28:
                extra = esz - 0x28
            elif nxt and not nsub:
                extra = nxt - 0x28
            elif table in (4, 5) and kind:
                extra = 20 if (c[p + 0x2A] & 0xFF) else 16
            elif table == 9:
                extra = _ANIM_SLOTS.get(kind, 0) * 4
            elif table == 8:
                extra = _OBJ_SLOTS.get(kind, 0) * 4
            else:
                extra = 0
            node = visit(p, kind, table, name, c[p + 0x28:p + 0x28 + extra], parent)
            q = p + 0x28 + extra
            for _ in range(min(nsub, 8192)):
                q = walk(q, depth + 1, node)
            return p + nxt if nxt else q

        walk(tbl, depth, None)

    # pass 1: labels of everything (images, models, objects, anims)
    raw_images, raw_models = {}, {}

    def res_visit(store, pdata):
        def v(p, kind, table, name, attrs, parent):
            if kind and len(attrs) >= 12:
                fmt, comp = struct.unpack("<HH", attrs[:4])
                size, off = struct.unpack("<II", attrs[4:12])
                if pdata != 0xFFFFFFFF and size and pdata + off + size <= len(c):
                    from console_themes import rco_data
                    raw = rco_data(c[pdata + off:pdata + off + size], comp)
                    if raw:
                        store[name] = (fmt, raw)
            return None
        return v

    entries(p_img, res_visit(raw_images, p_imgdata))
    entries(p_model, res_visit(raw_models, p_modeldata))
    nodes_by_off = []
    entries(p_obj, lambda p, *a: nodes_by_off.append(p))
    entries(p_anim, lambda p, *a: None)

    def ref(attrs, slot):
        if len(attrs) < slot * 4 + 8:
            return None
        t, ptr = struct.unpack("<II", attrs[slot * 4:slot * 4 + 8])
        if t == 0xFFFF or ptr == 0xFFFFFFFF:
            return None
        if t == 0x400:
            return ("event", _cstr(c, p_evt + ptr) if p_evt != 0xFFFFFFFF else "")
        if t in (0x402, 0x403, 0x407, 0x408, 0x409):
            return ({0x402: "image", 0x403: "model", 0x408: "anim"}.get(t, "object"), labels.get(ptr, ""))
        return None

    # pass 2: object tree
    pages = {}

    def obj_visit(p, kind, table, name, attrs, parent):
        if table != 8 or not kind:
            return {"ch": []}
        node = {"k": _KIND.get(kind, "obj%d" % kind), "n": name, "ch": []}
        if kind not in _NONSTD and len(attrs) >= 64:
            f = struct.unpack("<13f", attrs[:52])
            node.update(x=f[0], y=f[1], z=f[2], r=f[3], g=f[4], b=f[5], a=f[6], w=f[7], h=f[8], d=f[9], sx=f[10], sy=f[11], sz=f[12])
            ini = ref(attrs, 14)
            if ini:
                node["init"] = ini
            if kind == 2:
                img = ref(attrs, 16)
                if img and img[0] == "image":
                    node["img"] = img[1]
            if kind == 14:
                m = ref(attrs, 16)
                if m and m[0] == "model":
                    node["model"] = m[1]
        elif kind == 1:
            ini = ref(attrs, 1)
            if ini:
                node["init"] = ini
        if kind == 1:
            pages[name] = node["ch"]
        elif parent is not None:
            parent["ch"].append(node)
        return node

    entries(p_obj, obj_visit)

    # pass 3: animations
    anims = {}

    def anim_visit(p, kind, table, name, attrs, parent):
        if table != 9 or not kind:
            return None
        if kind == 1:
            anims[name] = []
            return anims[name]
        if parent is None:
            return None
        t = _STEP.get(kind)
        if not t:
            return None
        if t == "delay":
            parent.append({"t": t, "d": struct.unpack("<f", attrs[:4])[0] if len(attrs) >= 4 else 0})
        elif t == "fire":
            r = ref(attrs, 0)
            parent.append({"t": t, "a": r[1] if r else None, "kind": r[0] if r else None})
        elif t in ("lock", "unlock"):
            parent.append({"t": t})
        else:
            r = ref(attrs, 0)
            n = {"move": 3, "color": 4, "rotate": 3, "resize": 3, "fade": 1, "slide": 4}[t]
            if len(attrs) >= 16 + 4 * n:
                dur, = struct.unpack("<f", attrs[8:12])
                acc, = struct.unpack("<I", attrs[12:16])
                vals = list(struct.unpack("<%df" % n, attrs[16:16 + 4 * n]))
                parent.append({"t": t, "o": r[1] if r else None, "d": dur, "e": acc, "v": vals})
        return None

    entries(p_anim, anim_visit)
    return {"pages": pages, "anims": anims, "images": raw_images, "models": raw_models}


_CONTAINERS = {0x02, 0x03, 0x04, 0x05, 0x06, 0x08, 0x09, 0x0A, 0x0B}


def category_tilt(scene):
    """Tilt of the category bar from topmenu_plugin.rco's scene (rco_scene output), or None.
    The category container (the object driven by the native "/U" event) may sit inside a parent plane that an
    animation rotates around Z (Persona 3: 'basetop' at y = -135, 'topRT' rotates it by -0.3 rad). Layout units are
    native pixels from the screen centre, y up. The console turns the pictures about their own centre and keeps
    the container's place unrotated (checked against a real Persona 3 screenshot), so this returns
    {"tilt": degrees clockwise on screen, "dx": px right of the centred bar, "dy": px below the bottom-flush bar}."""
    import math
    if not scene:
        return None

    def rotation(parent):
        init = parent.get("init")
        steps = scene["anims"].get(init[1]) if init and init[0] == "anim" else None
        z = None
        for s in steps or ():
            if s.get("t") == "rotate" and s.get("o") == parent.get("n") and len(s.get("v", ())) >= 3:
                z = s["v"][2]
        return z

    def walk(nodes, parent):
        for n in nodes:
            init = n.get("init")
            if parent is not None and n.get("k") == "obj4" and init and init[0] == "event" and str(init[1]).startswith("native:"):
                z = rotation(parent)
                if z and abs(z) > 0.01:
                    tx, ty = n.get("x", 0), n.get("y", 0)
                    return {"tilt": round(-math.degrees(z), 2),
                            "dx": round(parent.get("x", 0) + tx, 2),
                            "dy": round(-(parent.get("y", 0) + ty + 136), 2),
                            # where the item list hangs (the selected row's place): the container's x, and its height turned about
                            # the parent's place, so the row sits on the band at the left edge. Fitted to a real Persona 3
                            # screenshot (https://pspunk.com/files/P3P.jpg), where "Camera" starts at about x 8, y 197 of 480 × 272:
                            # (-264, -57) here; turning x as well put it 18 px too far right.
                            "ix": round(parent.get("x", 0) + tx, 1),
                            "iy": round(parent.get("y", 0) + tx * math.sin(z) + ty * math.cos(z), 1)}
            r = walk(n.get("ch", ()), n)
            if r:
                return r
        return None

    for nodes in scene.get("pages", {}).values():
        r = walk(nodes, None)
        if r:
            return r
    return None


def category_origin(scene):
    """(x, y) of the category container (layout units: px from the screen centre, y up; parent planes' places
    added), or None."""
    def walk(nodes, ox, oy):
        for n in nodes:
            init = n.get("init")
            if n.get("k") == "obj4" and init and init[0] == "event" and str(init[1]).startswith("native:"):
                return ox + n.get("x", 0), oy + n.get("y", 0)
            plane = n.get("k") == "plane"
            r = walk(n.get("ch", ()), ox + (n.get("x", 0) if plane else 0), oy + (n.get("y", 0) if plane else 0))
            if r:
                return r
        return None
    for nodes in (scene or {}).get("pages", {}).values():
        r = walk(nodes, 0, 0)
        if r:
            return r
    return None


def _ge_layout(fmt):
    """(stride, position offset, position type) of one GE vertex for one morph target."""
    off, align_max = 0, 1

    def place(size, align):
        nonlocal off, align_max
        off = (off + align - 1) & ~(align - 1)
        at = off
        off += size
        align_max = max(align_max, align)
        return at

    sz = {1: 1, 2: 2, 3: 4}
    wt, wc = (fmt >> 9) & 3, ((fmt >> 14) & 7) + 1
    if wt:
        place(sz[wt] * wc, sz[wt])
    tt = fmt & 3
    if tt:
        place(sz[tt] * 2, sz[tt])
    ct = (fmt >> 2) & 7
    if 4 <= ct <= 6:
        place(2, 2)
    elif ct == 7:
        place(4, 4)
    nt = (fmt >> 5) & 3
    if nt:
        place(sz[nt] * 3, sz[nt])
    pt = (fmt >> 7) & 3
    if not pt:
        return None
    po = place(sz[pt] * 3, sz[pt])
    stride = (off + align_max - 1) & ~(align_max - 1)
    return stride, po, pt


def _tga_rgba(d):
    """TGA (colour-mapped, truecolour or greyscale; raw or RLE) -> (w, h, RGBA bytes top-down)."""
    if len(d) < 18:
        return None
    idl, cmt, it = d[0], d[1], d[2]
    cfirst, clen, cbits = struct.unpack("<HHB", d[3:8])
    w, h, bpp, desc = struct.unpack("<HHBB", d[12:18])
    base = it - 8 if it >= 9 else it
    if base not in (1, 2, 3) or not (0 < w <= 1024 and 0 < h <= 1024):
        return None
    p = 18 + idl
    pal = []
    if cmt == 1:
        eb = (cbits + 7) // 8
        pal = [None] * cfirst
        for i in range(clen):
            e = d[p + i * eb:p + i * eb + eb]
            if eb >= 3:
                pal.append((e[2], e[1], e[0], e[3] if eb == 4 else 255))
            else:
                v = e[0] | (e[1] << 8)
                pal.append((((v >> 10) & 31) * 255 // 31, ((v >> 5) & 31) * 255 // 31, (v & 31) * 255 // 31, 255))
        p += eb * clen
    pb = (bpp + 7) // 8
    if pb not in (1, 2, 3, 4):
        return None
    n = w * h
    if it < 9:
        px = d[p:p + n * pb]
    else:
        out = bytearray()
        while len(out) < n * pb and p < len(d):
            hd = d[p]
            p += 1
            run = (hd & 0x7F) + 1
            if hd & 0x80:
                out += d[p:p + pb] * run
                p += pb
            else:
                out += d[p:p + run * pb]
                p += run * pb
        px = bytes(out[:n * pb])
    if len(px) < n * pb:
        return None
    rgba = bytearray(n * 4)
    top = bool(desc & 0x20)
    for y in range(h):
        sy = y if top else h - 1 - y
        for x in range(w):
            s = (sy * w + x) * pb
            if base == 1:
                i = px[s] if pb == 1 else px[s] | (px[s + 1] << 8)
                c = pal[i] if i < len(pal) and pal[i] else (0, 0, 0, 255)
            elif base == 3:
                c = (px[s], px[s], px[s], 255)
            elif pb >= 3:
                c = (px[s + 2], px[s + 1], px[s], px[s + 3] if pb == 4 else 255)
            else:
                v = px[s] | (px[s + 1] << 8)
                c = (((v >> 10) & 31) * 255 // 31, ((v >> 5) & 31) * 255 // 31, (v & 31) * 255 // 31, 255)
            o = (y * w + x) * 4
            rgba[o:o + 4] = bytes(c)
    return w, h, bytes(rgba)


def gmo_wave(g):
    if not g.startswith(b"OMG.00.1PSP"):
        return None
    st = {"arrays": [], "splines": [], "fcurves": [], "animates": [], "knotsU": None, "knotsV": None,
          "morph": None, "matrix": None, "diffuse": [0.588, 0.588, 0.588, 1.0], "alpha": 1.0,
          "blend": [0, 6, 1], "image": None, "loop": None, "rate": 30.0}
    f32 = lambda o: struct.unpack("<f", g[o:o + 4])[0]
    u32 = lambda o: struct.unpack("<I", g[o:o + 4])[0]

    def scan(off, end, depth):
        while off + 8 <= end and depth < 12:
            typ, ao, size = struct.unpack("<HHI", g[off:off + 8])
            if size < 8 or off + size > end:
                return
            a = off + 8
            if typ in _CONTAINERS:
                if ao >= 8:
                    scan(off + ao, off + size, depth + 1)
            elif typ == 0x07:
                b = off + ao
                fmt, n = u32(b), u32(b + 4)
                st["arrays"].append((fmt, n, ((fmt >> 18) & 7) + 1, b + 16, off + size))
            elif typ == 0x0C:
                b = off + ao
                st["fcurves"].append((u32(b), u32(b + 4), u32(b + 8), b + 16, off + size))
            elif typ == 0x8043:
                n = min(u32(a), 8)
                st["morph"] = [f32(a + 4 + 4 * i) for i in range(n)]
            elif typ == 0x8047 and size >= 72:
                st["matrix"] = [f32(a + 4 * i) for i in range(16)]
            elif typ in (0x8064, 0x8065) and size >= 14:
                k = [f32(off + 10 + 4 * i) for i in range((size - 10) // 4)]
                st["knotsU" if typ == 0x8064 else "knotsV"] = k
            elif typ == 0x8068:
                ref, uc, vc = u32(a), u32(a + 8), u32(a + 12)
                if 0 < uc * vc < 65536 and a + 16 + uc * vc * 2 <= len(g):
                    idx = list(struct.unpack("<%dH" % (uc * vc), g[a + 16:a + 16 + uc * vc * 2]))
                    st["splines"].append((ref, uc, vc, idx))
            elif typ == 0x8082:
                st["diffuse"] = [f32(a + 4 * i) for i in range(4)]
            elif typ == 0x8086:
                st["alpha"] = f32(a)
            elif typ == 0x8094:
                st["blend"] = [u32(a + 4 * i) for i in range(3)]
            elif typ == 0x8013 and st["image"] is None and size > 12:
                n = min(u32(a), size - 12)
                st["image"] = g[a + 4:a + 4 + n]
            elif typ == 0x80B1:
                st["loop"] = (f32(a), f32(a + 4))
            elif typ == 0x80B2:
                st["rate"] = f32(a)
            elif typ == 0x80B3:
                st["animates"].append((u32(a), u32(a + 4), u32(a + 8), u32(a + 12)))
            off += size

    scan(16, len(g), 0)
    if not st["splines"] or not st["arrays"]:
        return None
    ref, uc, vc, idx = st["splines"][0]
    fmt, nverts, morphs, data, dend = st["arrays"][min(ref & 0xFFF, len(st["arrays"]) - 1)]
    lay = _ge_layout(fmt)
    if not lay:
        return None
    stride, po, pt = lay
    vbytes = stride * morphs
    if nverts * vbytes > dend - data:
        return None
    if any(i >= nverts for i in idx):
        idx = list(range(len(idx)))
    scale = {1: 1 / 128, 2: 1 / 32768, 3: 1.0}[pt]
    ctrl = []
    for m in range(morphs):
        for v in range(vc):
            for u in range(uc):
                b = data + idx[v * uc + u] * vbytes + m * stride + po
                if pt == 3:
                    ctrl += struct.unpack("<3f", g[b:b + 12])
                elif pt == 2:
                    ctrl += [x * scale for x in struct.unpack("<3h", g[b:b + 6])]
                else:
                    ctrl += [x * scale for x in struct.unpack("<3b", g[b:b + 3])]

    def track(fc_ref):
        i = fc_ref & 0xFFF
        if i >= len(st["fcurves"]):
            return None
        _fmt, dims, keys, b, e = st["fcurves"][i]
        if not (0 < dims <= 64 and 0 < keys <= 100000):
            return None
        per = (e - b) // keys // 4
        if per < 1 + dims:
            return None
        times, vals = [], []
        for k in range(keys):
            o = b + k * per * 4
            t = f32(o)
            # a track can run past its real keys into other data (Organ Final's intro: NaN times at the end); stop at the first
            # key that is not a finite, rising time, and keep values finite (the UI gets JSON, which has no NaN)
            if not math.isfinite(t) or (times and t < times[-1]):
                break
            times.append(t)
            vals += [v if math.isfinite(v) else 0.0 for v in (f32(o + 4 + 4 * c) for c in range(dims))]
        if not times:
            return None
        return {"dims": dims, "t": times, "v": vals}

    mtrack = wtrack = None
    for _tgt, cmd, _ix, fc in st["animates"]:
        if cmd == 0x47 and not mtrack:
            t = track(fc)
            mtrack = t if t and t["dims"] == 16 else None
        elif cmd == 0x43 and not wtrack:
            wtrack = track(fc)

    def knots_ok(k, n):
        return k and n + 2 <= len(k) <= n + 4 and all(k[i] >= k[i - 1] for i in range(1, len(k))) and k[-1] > k[0]

    def uniform(n, p=3):
        out = []
        for i in range(n + p + 1):
            out.append(0.0 if i <= p else 1.0 if i >= n else (i - p) / (n - p))
        return out

    tex = _tga_rgba(st["image"]) if st["image"] else None
    end = 0.0
    for t in (mtrack, wtrack):
        if t:
            end = max(end, t["t"][-1])
    loop = st["loop"] if st["loop"] and st["loop"][1] > st["loop"][0] else (0.0, end)
    rest = st["morph"] or [1.0] + [0.0] * (morphs - 1)
    return {
        "u": uc, "v": vc, "morphs": morphs, "ctrl": [round(x, 4) for x in ctrl],
        "knotsU": st["knotsU"] if knots_ok(st["knotsU"], uc) else uniform(uc),
        "knotsV": st["knotsV"] if knots_ok(st["knotsV"], vc) else uniform(vc),
        "matrix": st["matrix"] or [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        "restMorph": (rest + [0.0] * morphs)[:morphs],
        "matrixTrack": mtrack, "morphTrack": wtrack,
        "frameStart": loop[0], "frameEnd": loop[1], "rate": st["rate"] if 1 < st["rate"] < 240 else 30.0,
        "diffuse": st["diffuse"], "alpha": st["alpha"] if 0 < st["alpha"] <= 1 else 1.0, "blend": st["blend"],
        "tex": tex,  # (w, h, rgba) – the caller turns it into a PNG
    }


_PAGES = ("page_default_theme", "page_default_theme_3D", "page_wallpaper_theme")


def _r(v):
    return round(v, 4) if isinstance(v, float) else v


def _clean(n):
    out = {k: _r(v) for k, v in n.items() if k != "ch"}
    out["ch"] = [_clean(c) for c in n.get("ch", [])]
    return out


def _wave_json(raw, png):
    import base64
    try:
        wave = gmo_wave(raw)
    except Exception:
        wave = None
    if not wave:
        return None
    t = wave.pop("tex")
    wave["tex"] = "data:image/png;base64," + base64.b64encode(png(t[0], t[1], t[2])).decode("ascii") if t else None
    for tr in ("matrixTrack", "morphTrack"):
        if wave[tr]:
            wave[tr]["t"] = [_r(x) for x in wave[tr]["t"]]
            wave[tr]["v"] = [_r(x) for x in wave[tr]["v"]]
    for k in ("knotsU", "knotsV", "matrix", "diffuse"):
        wave[k] = [_r(x) for x in wave[k]]
    return wave


def psp_scene(rco, image_url, png, pages_wanted=_PAGES, extra_anims=()):
    """JSON-ready scene of an RCO layout, or None.
    pages_wanted: which object pages to keep; extra_anims: scripts the firmware starts itself
    (e.g. a boot intro's), kept besides those the objects start.
    image_url(fmt, raw) -> data URL or None; png(w, h, rgba) -> PNG bytes."""
    s = rco_scene(rco)
    if not s:
        return None
    pages = {k: [_clean(n) for n in v] for k, v in s["pages"].items() if k in pages_wanted}
    used = set(a for a in extra_anims if a in s["anims"])
    models_used = set()

    def walk(n):
        if n.get("init") and n["init"][0] == "anim":
            used.add(n["init"][1])
        if n.get("model"):
            models_used.add(n["model"])
        for c in n["ch"]:
            walk(c)

    for v in pages.values():
        for n in v:
            walk(n)
    anims, todo = {}, list(used)
    while todo:  # scripts reachable from the objects (chains included)
        a = todo.pop()
        if a in anims or a not in s["anims"]:
            continue
        anims[a] = [{k: ([_r(x) for x in v] if isinstance(v, list) else _r(v)) for k, v in st.items()} for st in s["anims"][a]]
        todo += [st["a"] for st in anims[a] if st["t"] == "fire" and st.get("a")]
    images = {}
    for k, (fmt, raw) in s["images"].items():
        u = image_url(fmt, raw)
        if u:
            images[k] = u
    waves = {}
    for name, (_fmt, raw) in s["models"].items():
        if models_used and name not in models_used:
            continue
        w = _wave_json(raw, png)
        if w:
            waves[name] = w
    wave = waves.get("mdl_bg") or next(iter(waves.values()), None)
    if not any(pages.values()) and not wave:
        return None
    return {"pages": pages, "anims": anims, "images": images, "wave": wave, "waves": waves}


INTRO_PAGES = ("page_bg", "page_3d", "page_logo", "page_psp_logo")


def psp_intro(rco, image_url, png):
    """The boot intro of a theme's opening_plugin.rco: its pages and the scripts the firmware runs
    (logo, model, and the colour of each month)."""
    rs = rco_scene(rco)
    if not rs:
        return None
    extra = [a for a in rs["anims"] if a in ("anim_logo", "anim_model", "anim_camera") or a.startswith("anim_month_")]
    sc = psp_scene(rco, image_url, png, INTRO_PAGES, extra)
    if not sc or not sc["anims"].get("anim_logo"):
        return None
    return sc
