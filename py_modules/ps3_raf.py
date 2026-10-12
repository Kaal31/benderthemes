"""PS3 dynamic themes: the .raf scene inside a .p3t → a scene the home screen can run.

A .raf is '_RAF' + zlib('RAFO' tree + files). The tree lists actors (model + material), models
(Sony Edge geometry, skeleton, animation), materials (effect + textures), camera, lights and one
script: VSMX bytecode (compiled PlayStation JavaScript), which the frontend runs.
"""
import base64
import math
import struct
import zlib

# Edge attribute ids: 1 position, 2 normal, 3 tangent, 4 binormal, 5–8 UV0–UV3, 9 colour
EDGE_POSITION, EDGE_NORMAL, EDGE_UV0, EDGE_COLOR = 1, 2, 5, 9


# ───────────── Edge geometry ─────────────

class _Bits:
    def __init__(self, b):
        self.b, self.p = b, 0

    def get(self, n):
        v = 0
        for _ in range(n):
            i = self.p >> 3
            byte = self.b[i] if i < len(self.b) else 0
            v = (v << 1) | ((byte >> (7 - (self.p & 7))) & 1)
            self.p += 1
        return v


def edge_indexes(blob, ntri):
    """Sony Edge compressed triangle list → [(a, b, c)]; also returns whether it looks sound.

    Layout (big-endian): u16 explicitCount, u16 explicitBias, u16 flagBytes, u8 explicitBits, u8 0;
    then one bit per vertex reference (0 = next new vertex, 1 = next value of the explicit list),
    then 2 bits per triangle (3 = three new references; 0/1/2 = shares an edge of the previous
    triangle plus one new reference), then the explicit list.
    """
    nexp, bias, flen, eb = struct.unpack(">HHHH", blob[:8])
    eb >>= 8
    flags = _Bits(blob[8:8 + flen])
    rest = _Bits(blob[8 + flen:])
    codes = [rest.get(2) for _ in range(ntri)]
    rest.p = (rest.p + 7) // 8 * 8  # the explicit list starts on a byte boundary
    exp = [rest.get(eb) for _ in range(nexp)] if eb else [0] * nexp
    # explicit indexes are deltas against the value 8 entries earlier (8 SIMD lanes), biased to stay positive
    for k in range(nexp):
        exp[k] += (exp[k - 8] if k >= 8 else 0) - bias
    seq = 0
    ei = 0
    tris = []
    prev = None

    def ref():
        nonlocal seq, ei
        if flags.get(1):
            v = exp[ei] if ei < len(exp) else -1
            ei += 1
            return v
        seq += 1
        return seq - 1

    for c in codes:
        if c == 3 or prev is None:
            t = (ref(), ref(), ref())
        else:
            a, b, cc = prev
            n = ref()
            t = {0: (a, cc, n), 1: (cc, b, n), 2: (b, a, n)}[c]
        tris.append(t)
        prev = t
    return tris, True


def _half(h):
    s, e, m = (h >> 15) & 1, (h >> 10) & 31, h & 1023
    if e == 0:
        v = (m / 1024.0) * 2 ** -14
    elif e == 31:
        v = 0.0
    else:
        v = (1 + m / 1024.0) * 2 ** (e - 15)
    return -v if s else v


def _desc(b, ptr):
    """An Edge vertex stream description: stride and {attribute id: (offset, format, count)}."""
    if not ptr or ptr + 8 > len(b):
        return None
    n, stride = b[ptr], b[ptr + 1]
    if not (0 < n < 16) or not stride:
        return None
    attrs = {}
    for i in range(n):
        q = ptr + 8 + i * 8
        off, fmt, cnt, aid = b[q], b[q + 1], b[q + 2], b[q + 3]
        attrs[aid] = (off, fmt, cnt)
    return stride, attrs


def _read_attr(b, base, count, stride, off, fmt, cnt):
    out = []
    for i in range(count):
        p = base + i * stride + off
        if fmt == 2:  # float32
            out.extend(struct.unpack(">%df" % cnt, b[p:p + 4 * cnt]))
        elif fmt == 3:  # float16
            out.extend(_half(x) for x in struct.unpack(">%dH" % cnt, b[p:p + 2 * cnt]))
        elif fmt == 1:  # unsigned byte, normalised
            out.extend(x / 255.0 for x in b[p:p + cnt])
        elif fmt == 6:  # 11:11:10 normal
            v = struct.unpack(">I", b[p:p + 4])[0]
            x, y, z = v & 0x7FF, (v >> 11) & 0x7FF, v >> 22  # X in the low bits

            def sn(val, bits):
                m = 1 << (bits - 1)
                return (val - (1 << bits) if val & m else val) / (m - 1)
            out.extend((sn(x, 11), sn(y, 11), sn(z, 10)))
        else:
            out.extend([0.0] * cnt)
    return out


def _edge_segment(b, h):
    """One EdgeGeom segment; its 0x80-byte header sits at h, pointers are from the file start."""
    u32 = lambda o: struct.unpack(">I", b[o:o + 4])[0]
    u16 = lambda o: struct.unpack(">H", b[o:o + 2])[0]
    nv, ni = u16(h + 8), u16(h + 10)
    flavor = b[h + 6]
    ip, isz = u32(h + 0x10), u16(h + 0x14)
    spu0, spu1, rsx = u32(h + 0x18), u32(h + 0x1C), u32(h + 0x2C)
    out = {"vertexes": nv, "skinned": (flavor & 0x0F) != 0}
    out["positions"] = list(struct.unpack(">%df" % (3 * nv), b[spu0:spu0 + 12 * nv]))
    sec, rsxd = _desc(b, u32(h + 0x6C)), _desc(b, u32(h + 0x74))
    for desc, base in ((sec, spu1), (rsxd, rsx)):
        if not desc or not base:
            continue
        stride, attrs = desc
        for aid, key in ((EDGE_NORMAL, "normals"), (EDGE_UV0, "uvs"), (EDGE_COLOR, "colors")):
            if aid in attrs and key not in out:
                off, fmt, cnt = attrs[aid]
                out[key] = _read_attr(b, base, nv, stride, off, fmt, cnt)
    # skinning: matrix palette ranges (u16 byte offsets @0x34, u16 sizes @0x38; 48 bytes per joint),
    # then per vertex 4 × (u8 weight, u8 palette index) @0x40 (size u16 @0x3C)
    if out["skinned"]:
        palette = []
        for k in range(2):
            off, size = u16(h + 0x34 + 2 * k), u16(h + 0x38 + 2 * k)
            palette.extend(range(off // 48, off // 48 + size // 48))
        wp, wsz = u32(h + 0x40), u16(h + 0x3C)
        if palette and wp and wsz >= nv * 8 and wp + nv * 8 <= len(b):
            jo, we = [], []
            for v in range(nv):
                q = wp + v * 8
                for k in range(4):
                    w, ix = b[q + 2 * k], b[q + 2 * k + 1]
                    jo.append(palette[ix] if w and ix < len(palette) else 0)
                    we.append(round(w / 255.0, 4))
            out["joints"], out["weights"] = jo, we
    blob = b[ip:ip + isz]
    pos = out["positions"]
    if len({tuple(pos[i:i + 3]) for i in range(0, len(pos), 3)}) < 3:
        # a blanked-out mesh: themes made from one widespread template zero the models they don't
        # use (positions and index list), so every triangle has no area and the PS3 draws nothing
        out["indexes"], out["ok"], out["empty"] = [], True, True
    elif len(blob) >= 8 and ni % 3 == 0:  # an all-zero list is valid: every reference is the next new vertex
        tris, sound = edge_indexes(blob, ni // 3)
        # degenerate triangles (a repeated corner) are valid Edge output and draw nothing: drop them
        bad = sum(1 for t in tris if min(t) < 0 or max(t) >= nv)
        out["indexes"] = [i for t in tris if not (min(t) < 0 or max(t) >= nv or len(set(t)) < 3) for i in t]
        # triangles out of range would mean a decoding error: they are dropped, and a mesh that
        # is mostly whole still counts (none in the 428 test themes since blanked meshes are known)
        out["ok"] = sound and bad <= len(tris) // 4
        if bad:
            out["partial"] = bad
    else:
        out["indexes"] = []
        out["ok"] = False
    return out


def edge_geometry(b):
    """.edge file → {positions, normals?, uvs?, colors?, joints?, weights?, indexes, ok, skinned}.
    The file is u32 segment count @0, then one 0x80-byte segment header per segment from 0x10."""
    if len(b) < 0x90:
        return None
    n = struct.unpack(">I", b[0:4])[0]
    if not 0 < n <= 4096 or 0x10 + 0x80 * n > len(b):
        n = 1
    out = None
    for i in range(n):
        seg = _edge_segment(b, 0x10 + 0x80 * i)
        if out is None:
            out = seg
            continue
        base = out["vertexes"]
        for key, size in (("positions", 3), ("normals", 3), ("uvs", 2), ("colors", 4), ("joints", 4), ("weights", 4)):
            if key in out or key in seg:
                a = out.setdefault(key, [0.0] * (size * base) if key != "joints" else [0] * (4 * base))
                a.extend(seg.get(key) or ([0] * (size * seg["vertexes"]) if key == "joints" else [0.0] * (size * seg["vertexes"])))
        out["indexes"].extend(x + base for x in seg["indexes"])
        out["vertexes"] += seg["vertexes"]
        out["ok"] = out["ok"] and seg["ok"]
        out["empty"] = out.get("empty", False) and seg.get("empty", False)
        if seg.get("partial"):
            out["partial"] = out.get("partial", 0) + seg["partial"]
        out["skinned"] = out["skinned"] or seg["skinned"]
    out["segments"] = n
    return out


# ───────────── Edge animation: skeletons ─────────────

def edge_skeleton(b):
    """.skel ('ES01', big-endian) → [{parent, rot (x, y, z, w), pos, scale}], local to the parent.
    Header: u16 joints at 0x0C; self-relative offsets at 0x14 (base pose, 48 bytes per joint:
    quaternion, translation, scale) and 0x18 (u16 parent per joint, 0xFFFF = root)."""
    if len(b) < 0x30 or b[:4] != b"ES01":
        return []
    n = struct.unpack(">H", b[0x0C:0x0E])[0]
    if not n or n > 1024:
        return []
    pose = 0x14 + struct.unpack(">I", b[0x14:0x18])[0]
    par = 0x18 + struct.unpack(">I", b[0x18:0x1C])[0]
    joints = []
    for i in range(n):
        p = pose + i * 48
        if p + 48 > len(b):
            break
        q = struct.unpack(">4f", b[p:p + 16])
        t = struct.unpack(">3f", b[p + 16:p + 28])
        sc = struct.unpack(">3f", b[p + 32:p + 44])
        parent = struct.unpack(">H", b[par + 2 * i:par + 2 * i + 2])[0] if par + 2 * i + 2 <= len(b) else 0xFFFF
        joints.append({"parent": -1 if parent == 0xFFFF else parent, "rot": _round(q), "pos": _round(t), "scale": _round(sc)})
    return joints



# ───────────── Edge animation: .anim ('EA03', big-endian) ─────────────
# Header: f32 duration @4, f32 sample rate @8, u16 header size @0xC, joints @0xE, frames @0x10,
# frame sets @0x12; u16 channel counts @0x16: const R, const T, const S, const user, anim R,
# anim T, anim S. Self-relative u32 offsets @0x34..0x4C: frame-set DMA list (size, offset),
# frame-set info (u16 base frame, u16 intra frames), const R / T / S data, packing specs.
# Joint lists (u16, padded to 4 with numJoints) start at 0x60 in the same channel order.
# Packing specs: per kind, one shared spec for the constants then one per animated channel.
# A spec is 3 × (sign:1, exponent bits:4, mantissa bits:5) + 2 bits: the quaternion component
# left out (rebuilt as +sqrt(1 − rest²)). Exponent bits 0 → two's-complement fixed point over
# 2^m − 1; otherwise a float with bias 2^(e−1) − 1 and no denormals.
# Each frame set: u16[4] key-frame bytes (R, T, S, pad), u16[4] intra bytes (R, T, S, pad), the
# key frame (all animated channels, MSB-first bits), then 1 flag bit per channel per intra frame
# (channel-major), then full keys for the flagged frames. Values in between are interpolated.

class _MsbBits:
    __slots__ = ("b", "p")

    def __init__(self, b, o):
        self.b, self.p = b, o * 8

    def get(self, n):
        if not n:
            return 0
        p = self.p
        a, e = p >> 3, (p + n + 7) >> 3
        self.p = p + n
        return (int.from_bytes(self.b[a:e], "big") >> ((e << 3) - p - n)) & ((1 << n) - 1)


def _ea_spec(s):
    return [((s >> (31 - 10 * i)) & 1, (s >> (27 - 10 * i)) & 15, (s >> (22 - 10 * i)) & 31) for i in range(3)], s & 3


def _ea_val(bits, sb, eb, mb):
    s = bits.get(sb) if sb else 0
    e = bits.get(eb) if eb else 0
    m = bits.get(mb) if mb else 0
    if eb == 0:
        if not mb:
            return -1.0 if s else 0.0
        return (m - (1 << mb) if s else m) / float((1 << mb) - 1)
    v = (1 + m / float(1 << mb)) * 2.0 ** (e - ((1 << (eb - 1)) - 1))
    return -v if s else v


def _ea_read(bits, spec, rot):
    comps, omit = spec
    v = [_ea_val(bits, *c) for c in comps]
    if rot:
        v.insert(omit, math.sqrt(max(0.0, 1.0 - v[0] * v[0] - v[1] * v[1] - v[2] * v[2])))
    return v


def edge_animation(b):
    """.anim → {fps, frames, duration, tracks: [[joint, 'r'|'t'|'s', [frame...], [values...]]]}.
    Rotations are quaternions (x, y, z, w); frames are sample indexes (time × fps)."""
    if len(b) < 0x60 or b[:4] != b"EA03":
        return None
    u16 = lambda o: struct.unpack(">H", b[o:o + 2])[0]
    u32 = lambda o: struct.unpack(">I", b[o:o + 4])[0]
    dur, hz = struct.unpack(">ff", b[4:12])
    nj, nf, nfs = u16(14), u16(16), u16(18)
    c = struct.unpack(">7H", b[0x16:0x24])
    offs = [(0x30 + 4 * i + v if v else 0) for i, v in enumerate(struct.unpack(">8I", b[0x30:0x50]))]
    total = (offs[3] - 0x60) // 2
    raw = [u16(0x60 + 2 * i) for i in range(total)]
    pads = [(n + 3) // 4 * 4 for n in c]
    extra = max(0, total - sum(pads))  # some files pad the first list further
    lists, o = [], 0
    for i, n in enumerate(c):
        lists.append(raw[o:o + n])
        o += pads[i] + (extra if i == 0 else 0)
    o = offs[7]
    specs = []
    for an in c[4:7]:
        cs = _ea_spec(u32(o))
        specs.append((cs, [_ea_spec(u32(o + 4 + 4 * i)) for i in range(an)]))
        o += 4 + 4 * an
    keys = {}

    def add(j, k, f, v):
        if j < nj:
            keys.setdefault((j, k), []).append((f, v))
    for g, (k, rot) in enumerate((("r", True), ("t", False), ("s", False))):
        bits = _MsbBits(b, offs[3 + g])
        for j in lists[g]:
            add(j, k, 0, _ea_read(bits, specs[g][0], rot))
    chans = []
    for g, (k, rot) in enumerate((("r", True), ("t", False), ("s", False))):
        chans.append([(j, k, sp, rot) for j, sp in zip(lists[4 + g], specs[g][1])])
    allc = chans[0] + chans[1] + chans[2]
    for i in range(nfs):
        p = u32(offs[1] + 8 * i + 4)
        base, nint = struct.unpack(">HH", b[offs[2] + 4 * i:offs[2] + 4 * i + 4])
        q1 = struct.unpack(">4H", b[p:p + 8])
        q2 = struct.unpack(">4H", b[p + 8:p + 16])
        o = p + 16
        for g in range(3):
            bits = _MsbBits(b, o)
            for j, k, sp, rot in chans[g]:
                add(j, k, base, _ea_read(bits, sp, rot))
            o += q1[g]
        if nint:
            fl = _MsbBits(b, o)
            flags = [[fl.get(1) for _ in range(nint)] for _ in allc]
            o += (nint * len(allc) + 7) // 8
            ci = 0
            for g in range(3):
                bits = _MsbBits(b, o)
                for j, k, sp, rot in chans[g]:
                    for fi in range(nint):
                        if flags[ci][fi]:
                            add(j, k, base + 1 + fi, _ea_read(bits, sp, rot))
                    ci += 1
                o += q2[g]
    tracks = []
    for (j, k), kv in sorted(keys.items()):
        kv.sort(key=lambda x: x[0])
        tracks.append([j, k, [f for f, _ in kv], [float("%.5g" % x) for _, v in kv for x in v]])
    return {"fps": round(hz, 4), "frames": nf, "duration": round(dur, 5), "tracks": tracks}

# ───────────── scene ─────────────

def _round(v):
    return [round(x, 5) for x in v]


GTF_FORMATS = {0x86: "dxt1", 0x87: "dxt3", 0x88: "dxt5", 0x85: "argb"}


def gtf_raw(g):
    """GTF → {format, width, height, data (base64 of the first mip level)} for the frontend, or None."""
    if len(g) < 128:
        return None
    off = struct.unpack(">I", g[16:20])[0]
    fmt = g[24] & 0x9F
    w, h = struct.unpack(">HH", g[32:36])
    pitch = struct.unpack(">I", g[40:44])[0]
    kind = GTF_FORMATS.get(fmt)
    if not kind or not w or not h:
        return None
    if kind == "argb":
        size = (pitch or w * 4) * h
    else:
        size = ((w + 3) // 4) * ((h + 3) // 4) * (8 if kind == "dxt1" else 16)
    data = g[off:off + size]
    if len(data) < size:
        return None
    return {"format": kind, "width": w, "height": h, "pitch": pitch or (w * 4 if kind == "argb" else 0), "data": base64.b64encode(data).decode("ascii")}


def read_raf(blob, xml_tree, gtf_png, data_url, raw_textures=True):
    """blob = the .raf file. xml_tree(d, off) parses Sony's binary XML (console_themes._xml_tree)."""
    if blob[:4] != b"_RAF":
        return None
    d = zlib.decompress(blob[8:])
    if d[:4] != b"RAFO":
        return None
    nodes, file_off = xml_tree(d, 15)
    files = {}
    for tag, a in nodes:
        if tag == "file" and isinstance(a.get("src"), tuple) and isinstance(a.get("id"), str):
            _, off, ln = a["src"]
            files[a["id"]] = d[file_off + off:file_off + off + ln]
    clean = lambda a: {k: v for k, v in a.items() if not isinstance(v, tuple)}
    scene = {"actors": [], "models": {}, "materials": {}, "textures": {}, "cameras": [], "lights": [], "script": None, "info": {}}
    model = material = None
    for tag, a in nodes:
        if tag == "scene":
            scene["info"] = clean(a)
        elif tag == "actor":
            scene["actors"].append(clean(a))
        elif tag == "camera":
            scene["cameras"].append(clean(a))
        elif tag == "light":
            scene["lights"].append(clean(a))
        elif tag == "model" and "id" in a:
            model = scene["models"].setdefault(a["id"], {"anims": []})
        elif tag == "geometry" and model is not None:
            model["geometry"] = a.get("fileref")
        elif tag == "skeleton" and model is not None:
            model["skeleton"] = a.get("fileref")
        elif tag == "inv-bind" and model is not None:
            model["invbindFile"] = a.get("fileref")
        elif tag == "animation" and model is not None:
            model["anims"].append({"id": a.get("id"), "file": a.get("fileref")})
        elif tag == "material" and "id" in a:
            material = scene["materials"].setdefault(a["id"], {"effect": (a.get("effect") or "").strip(), "textures": []})
        elif tag == "_texture" and material is not None:
            material["textures"].append(a.get("texref"))
        elif tag == "texture" and "id" in a:
            scene["textures"][a["id"]] = {"file": a.get("fileref"), **{k: v for k, v in clean(a).items() if k not in ("id", "fileref")}}
        elif tag == "script":
            scene["script"] = a.get("fileref")
    # decode what the scene uses
    geoms = {}
    for m in scene["models"].values():
        g = m.get("geometry")
        if g and g not in geoms and g in files:
            try:
                geoms[g] = edge_geometry(files[g])
            except Exception:
                geoms[g] = None
        m["mesh"] = g
        ib = m.pop("invbindFile", None)
        if ib and ib in files:  # one 3×4 row-major matrix per joint: joint space ← bind space
            raw = files[ib]
            m["invbind"] = [_round(struct.unpack(">12f", raw[i:i + 48])) for i in range(0, len(raw) - 47, 48)]
        for an in m.get("anims", []):
            if an.get("file") in files:
                try:
                    an["data"] = edge_animation(files[an["file"]])
                except Exception:
                    an["data"] = None
        sk = m.get("skeleton")
        if sk and sk in files:
            try:
                m["joints"] = edge_skeleton(files[sk])
            except Exception:
                m["joints"] = []
    scene["meshes"] = {k: {kk: (_round(vv) if isinstance(vv, list) and kk != "indexes" else vv) for kk, vv in v.items()} for k, v in geoms.items() if v}
    for tid, t in scene["textures"].items():
        raw = files.get(t.get("file") or "")
        url = None
        info = gtf_raw(raw) if raw and raw_textures else None
        if info:  # the GPU (or the frontend) decodes it: much faster than doing it here
            t.update(info)
            t["url"] = None
            continue
        if raw:
            if raw[:3] == b"\xff\xd8\xff":
                url = data_url(raw, "image/jpeg")
            elif raw[:8] == b"\x89PNG\r\n\x1a\n":
                url = data_url(raw, "image/png")
            else:
                try:
                    png = gtf_png(raw, True)
                except Exception:
                    png = None
                url = data_url(png, "image/png") if png else None
        t["url"] = url
    if scene["script"] and scene["script"] in files:
        scene["script"] = vsmx_program(files[scene["script"]])
    else:
        scene["script"] = None
    return scene


# ───────────── VSMX (compiled PlayStation JavaScript) ─────────────

def vsmx_program(b):
    """VSMX → {code: [[op, value]...], text, prop, names}; the frontend's interpreter runs it.
    Version 1 (PSP RCOs) and 2 (PS3 .jsx) share the layout: string and property tables are
    UTF-16LE, the name table is UTF-8 (table sizes need not be multiples of 4)."""
    if b[:4] != b"VSMX":
        return None
    _, ver, co, cl, to, tl, te, po, pl, pe, no, nl, ne = struct.unpack("<13I", b[:52])
    code = []
    for i in range(cl // 8):
        op, val = struct.unpack("<II", b[co + i * 8:co + i * 8 + 8])
        o = op & 0xFF
        if o == 0x27:  # float constant
            val = struct.unpack("<f", struct.pack("<I", val))[0]
        code.append([op, val])
    wide = lambda o, l: b[o:o + l].decode("utf-16-le", "replace").split("\0") if l else []
    names = [x.decode("utf-8", "replace") for x in b[no:no + nl].split(b"\0")] if nl else []
    return {"version": ver, "code": code, "text": wide(to, tl), "prop": wide(po, pl), "names": names}


def to_json_ready(scene):
    return scene
