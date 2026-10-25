"""Carryable props (mask 0x1000): their own rig (STRB block 5) and their own clip (STRB block 1).

Independent implementation of PARITY-PLAN M5. Evidence (d@ = offset in the string-resolved bundle copy deob.js):
- eh (d@~199300): for every worn id with mask & 0x1000, prop rig = To(block 5) (LZX, d@58447 / Jy), prop clip =
  Me(block 1, wantJoints = rig.n) (d@54469); pose = ie(clip, posing.propT ?? (clipId ? t : 0)) (d@55252);
  palette = or(rig, pose).skin (d@58595) with every non-w element times Ds(avatar rig)[0][0]; result: propPalettes.
- Oh (d@259964): a part with mask & 0x1000 is skipped in every pass unless it has a prop palette UBO >= 0x380*4 bytes.
- Stage/photo/booth paths (d@348900, d@353300, d@443600 ld, d@555200, d@557000) all bind propPalettes the same way;
  ld hides props while the body-shape slider is dragged (Tr, d@470758).
- Show-off (d@581300-588500): ft.info = Ir(asset, 71) = the asset's body stream; mode 'prop' poses the body with
  ie(clip, t) and sets propT = t; at the end Hc returns to idle with propT 0. A newly worn carryable auto-plays after
  Ii = 1000 ms unless a wardrobe/appearance category is open (xd); button titles "Show off what you are holding",
  "Nothing in their hand yet", "Stop". The last worn carryable is the one played (In, d@~582900).
- GLB export skips props: "Props are not exported: their geometry is animated by their own clip" (d@~499000).

- A carryable asset carries a small rig of its own (block 5, LZX compressed) and a clip block (block 1, raw)
  with several pose streams: one for the 71-joint avatar body ("hold"/show-off clip) and one whose joint count
  equals the prop rig's joint count (the prop's own animation).
- The prop is skinned to its own rig only. Its palette is the prop rig posed by the prop stream at `propT`
  (0 while the avatar idles, the show-off time while the body plays the asset's body stream), then scaled
  uniformly by the avatar's root scale (body scaling profile, joint 0, x axis).
- The site draws a carryable part only when such a palette exists; a prop without a decodable rig is not drawn.

Coordinate conventions: positions have z negated, quaternions (x, y, z, w) become (-x, -y, z, w); matrices are
row-vector, row-major 4x4 (translation in elements 12..14), exactly the layout the renderer receives.

Usage:
    python reverse-engineering/avatar_props.py <guid> [--t SECONDS]      # summary + palette at t
    python reverse-engineering/avatar_props.py --selftest                 # decode every carryable in the catalogue
"""
import base64
import json
import math
import pathlib
import sqlite3
import struct
import sys
import threading

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from .avatar_decode import decompress  # noqa: E402  (same LZX chunk framing as the site's prop rig blocks)

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROP_MASK = 0x1000
BODY_JOINTS = 71           # avatar rig joints; the body stream of a prop clip has this count
MAX_JOINTS = 72            # slots in a rig / pose stream header
CLIP_HEADER = 40           # bytes before stream 0
LATTICE_Y = 1.6329931020736694
LATTICE_Z = 1.7320507764816284


# ----------------------------------------------------------------------------- bit stream
class Bits:
    """Least significant bit first within each byte; raises on overrun."""
    def __init__(self, data, byte=0, bit=0):
        self.data = data; self.bit = byte * 8 + bit

    def read(self, n):
        if n == 0: return 0
        if n > 32 or self.bit + n > len(self.data) * 8: raise ValueError('bit stream overrun')
        at = self.bit // 8; shift = self.bit % 8
        value = (int.from_bytes(self.data[at:(self.bit + n + 7) // 8], 'little') >> shift) & ((1 << n) - 1)
        self.bit += n; return value

    def f32(self): return struct.unpack('<f', struct.pack('<I', self.read(32)))[0]


def quant_header(bits):
    scale, ox, oy, oz = (bits.f32() for _ in range(4))
    bx, by, bz = (bits.read(6) for _ in range(3))
    return {'scale': scale, 'o': (ox, oy, oz), 'b': (bx, by, bz), 'constant': bx + by + bz == 0}


def header_ok(h):
    return (math.isfinite(h['scale']) and 0 <= h['scale'] < 10000 and all(math.isfinite(v) and abs(v) < 10000 for v in h['o'])
            and all(b <= 25 for b in h['b']))


def quant_vector(bits, h):
    """Same hexagonal-ish lattice as the mesh positions (x step 2s with odd-row shift, y 1.633s, z 1.732s)."""
    if h['constant']: return list(h['o'])
    s = h['scale']; x = bits.read(h['b'][0]); y = bits.read(h['b'][1]); z = bits.read(h['b'][2])
    return [x * s * 2 + h['o'][0] + (s if (y & 1) != (z & 1) else 0),
            y * s * LATTICE_Y + h['o'][1],
            z * s * LATTICE_Z + h['o'][2] + (s if y & 1 else 0)]


def rotation_vector(bits, h):
    """Stored as a rotation vector v; quaternion = (v * sin|v| / |v|, cos|v|) (the stored length is the half angle)."""
    v = quant_vector(bits, h); n = math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
    k = 1.0 if n <= 1.1920928955078125e-7 else math.sin(n) / n
    return [v[0] * k, v[1] * k, v[2] * k, math.cos(n)]


def flip_position(p): return [p[0], p[1], -p[2]]
def flip_rotation(q): return [-q[0], -q[1], q[2], q[3]]


# ----------------------------------------------------------------------------- row-vector matrices
def identity(): return [1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0]


def mul(a, b):
    """Row-major a*b (row vectors: apply a, then b)."""
    out = [0.0] * 16
    for r in range(4):
        a0, a1, a2, a3 = a[r * 4:r * 4 + 4]
        for c in range(4):
            out[r * 4 + c] = a0 * b[c] + a1 * b[4 + c] + a2 * b[8 + c] + a3 * b[12 + c]
    return out


def trs(t, q, s=(1, 1, 1)):
    x, y, z, w = q
    m = [1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w), 0,
         2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w), 0,
         2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y), 0,
         t[0], t[1], t[2], 1.0]
    for r in range(3):
        for c in range(3): m[r * 4 + c] *= s[r]
    return m


def inverse(m):
    rows = [m[i * 4:i * 4 + 4] + [float(i == j) for j in range(4)] for i in range(4)]
    for i in range(4):
        p = max(range(i, 4), key=lambda k: abs(rows[k][i]))
        rows[i], rows[p] = rows[p], rows[i]
        d = rows[i][i]
        if abs(d) < 1e-30: return None
        rows[i] = [v / d for v in rows[i]]
        for j in range(4):
            if j != i:
                f = rows[j][i]; rows[j] = [a - f * b for a, b in zip(rows[j], rows[i])]
    return [v for row in rows for v in row[4:]]


# ----------------------------------------------------------------------------- rig (block 5)
def decode_rig(block):
    """block: the raw (compressed) payload of STRB block type 5."""
    data = decompress(block)
    bits = Bits(data)
    count = bits.read(32)
    if count > 0x100000: raise ValueError('rig joint count')
    n = min(count, MAX_JOINTS)
    pos_h = quant_header(bits); rot_h = quant_header(bits)
    joints = []
    for _ in range(n):
        parent = bits.read(8)
        if parent != 0xff and parent >= MAX_JOINTS: raise ValueError('rig parent index')
        p = quant_vector(bits, pos_h); q = rotation_vector(bits, rot_h)
        joints.append({'parent': -1 if parent == 0xff else parent, 'position': flip_position(p), 'rotation': flip_rotation(q)})
    absolute = [trs(j['position'], j['rotation']) for j in joints]
    inv_abs = [inverse(m) or identity() for m in absolute]
    for i, j in enumerate(joints):
        par = j['parent']
        if i == 0 or par < 0 or par >= n:
            j['local'] = absolute[i][:]
        else:
            ip = inverse(absolute[par]); j['local'] = mul(absolute[i], ip) if ip else absolute[i][:]
    return {'count': count, 'n': n, 'joints': joints, 'inverseAbsolute': inv_abs,
            'roots': sum(1 for j in joints if j['parent'] < 0), 'endBit': bits.bit, 'blockBits': len(data) * 8}


# ----------------------------------------------------------------------------- clip (block 1)
def stream_header(data, bit):
    bits = Bits(data, 0, bit)
    count = bits.read(32)
    if count == 0 or count > 0x400: return None
    slots = []
    for _ in range(MAX_JOINTS):
        h = [quant_header(bits) for _ in range(3)]
        if not all(header_ok(x) for x in h): return None
        slots.append({'pos': h[0], 'rot': h[1], 'scl': h[2]})
    per = sum(sum(s[k]['b']) for s in slots[:count] for k in ('pos', 'rot', 'scl'))
    return {'count': count, 'slots': slots, 'dataBit': bits.bit, 'per': per}


def clip_streams(data):
    frames, fps, joints, a, b, c, pose_bytes, off1, off2, off3 = struct.unpack_from('<IfIIIIIIII', data, 0)
    header = {'frames': frames, 'fps': fps, 'joints': joints, 'poseBytes': pose_bytes, 'offsets': [off1, off2, off3]}
    streams = []; seen = set()
    starts = [CLIP_HEADER] + [CLIP_HEADER + o for o in sorted(x for x in (pose_bytes, off1, off2, off3) if x > 0)]
    for start in starts:
        if start in seen or (start != CLIP_HEADER and start + 8 >= len(data)): continue
        seen.add(start)
        try: s = stream_header(data, (start + 4) * 8)
        except ValueError: s = None
        if not s or not s['per']: continue
        s.update(index=len(streams), startByte=start, streamFrames=struct.unpack_from('<I', data, start)[0])
        streams.append(s)
    return header, streams


def decode_frames(data, stream, frames):
    bits = Bits(data, 0, stream['dataBit']); out = []
    for _ in range(frames):
        frame = []
        for j in range(stream['count']):
            slot = stream['slots'][stream['count'] - 1 - j]   # slots are stored last joint first
            p = quant_vector(bits, slot['pos']); q = rotation_vector(bits, slot['rot']); s = quant_vector(bits, slot['scl'])
            frame.append({'position': flip_position(p), 'rotation': flip_rotation(q), 'scale': s})
        out.append(frame)
    return out


def decode_clip(data, want_joints):
    """Returns {header, frames, matchedRig, counts} for the stream with `want_joints` joints, or None."""
    header, streams = clip_streams(data)
    if not streams: return None
    hit = next((s for s in streams if s['count'] == want_joints), None)
    counts = [s['count'] for s in streams]
    if hit is None:
        return {'header': header, 'frames': None, 'matchedRig': False, 'counts': counts,
                'reason': f'no pose stream with {want_joints} animated joints; found {counts}'}
    return {'header': header, 'frames': decode_frames(data, hit, header['frames']), 'matchedRig': True, 'counts': counts}


def clip_for(block, want_joints, expressions=False):
    """Prefer the M4 animation decoder (avatar_anim) so props and body clips share one implementation; the local
    decoder above is the fallback and was cross-checked against it (max difference 5.6e-16 on 26 carryables)."""
    try:
        import avatar_anim
    except ImportError:
        return decode_clip(block, want_joints)
    c = avatar_anim.decode_clip(block, want_joints)
    counts = [s['count'] for s in c.get('streams', [])]
    if not c.get('frames'):
        return {'header': c['header'], 'frames': None, 'matchedRig': False, 'counts': counts, 'reason': c.get('problem')}
    out = {'header': c['header'], 'frames': c['frames'], 'matchedRig': True, 'counts': counts}
    ex = c.get('expressions')
    if expressions and isinstance(ex, dict) and ex.get('frames'): out['expressions'] = ex['frames']
    return out


# ----------------------------------------------------------------------------- posing
def _lerp(a, b, t): return [a[i] + (b[i] - a[i]) * t for i in range(3)]


def _nlerp(a, b, t):
    sign = -1 if sum(a[i] * b[i] for i in range(4)) < 0 else 1
    q = [a[i] + (b[i] * sign - a[i]) * t for i in range(4)]; n = math.sqrt(sum(v * v for v in q)) or 1
    return [v / n for v in q]


def _f32(x): return struct.unpack('<f', struct.pack('<f', x))[0]


def sample(clip, t):
    """Non-looping sample: frame = trunc(fround(t*fps)), clamped to the last frame, linear blend to the next."""
    fps = clip['header']['fps']; frames = clip['frames']; last = len(frames) - 1
    s = _f32(_f32(t) * _f32(fps)); z = math.floor(s)
    i = last if (z < 0 or z >= last) else z
    j = min(i + 1, last); f = s - z
    if f <= 0: return frames[i]
    if f >= 1: return frames[j]
    return [{'position': _lerp(a['position'], b['position'], f), 'rotation': _nlerp(a['rotation'], b['rotation'], f),
             'scale': _lerp(a['scale'], b['scale'], f)} for a, b in zip(frames[i], frames[j])]


def pose(rig, frame=None):
    """World and skin matrices. frame[j] (if any) is applied in the joint's bind-local space before `local`."""
    n = len(rig['joints']); world = [None] * n; state = [0] * n

    def visit(i, depth=0):
        if world[i] is not None or depth > n: return
        j = rig['joints'][i]; par = j['parent']
        if 0 <= par < n and world[par] is None: visit(par, depth + 1)
        m = j['local']
        if frame is not None and i < len(frame) and frame[i] is not None:
            f = frame[i]; m = mul(trs(f['position'], f['rotation'], f.get('scale') or (1, 1, 1)), m)
        world[i] = mul(m, world[par]) if 0 <= par < n and world[par] is not None else m
    for i in range(n): visit(i)
    skin = [mul(rig['inverseAbsolute'][i], world[i]) for i in range(n)]
    return world, skin


def scale_palette(skin, root_scale):
    if root_scale == 1: return skin
    keep = {3, 7, 11, 15}
    return [[v if k in keep else v * root_scale for k, v in enumerate(m)] for m in skin]


# ----------------------------------------------------------------------------- catalogue access
class PropLibrary:
    """Reads carryable blocks from catalogue/ (read-only) and caches decoded rigs/clips."""
    def __init__(self, root=ROOT):
        self.root = root; self.lock = threading.Lock(); self.cache = {}

    def blocks(self, guid):
        db = sqlite3.connect(self.root / 'catalogue/index.sqlite')
        try:
            row = db.execute('SELECT path,strb_offset FROM assets WHERE id=?', (guid,)).fetchone()
            if not row: return None
            rows = db.execute('SELECT type,data_offset,size FROM blocks WHERE asset_id=? ORDER BY ordinal', (guid,)).fetchall()
        finally: db.close()
        raw = (self.root / 'catalogue' / row[0]).read_bytes(); base = row[1]
        return [(t, raw[base + at:base + at + size]) for t, at, size in rows]

    def prop(self, guid):
        """{rig, clip, body} or a dict with 'error'. body = the asset's 71-joint stream (show-off body clip)."""
        with self.lock:
            if guid in self.cache: return self.cache[guid]
        result = {'id': guid}
        try:
            blocks = self.blocks(guid)
            if blocks is None: raise LookupError('asset not in catalogue')
            rig_block = next((b for t, b in blocks if t == 5), None)
            clip_block = next((b for t, b in blocks if t == 1), None)
            if rig_block is None: raise LookupError('no prop rig (block 5)')
            rig = decode_rig(rig_block)
            if not rig['n']: raise ValueError('empty prop rig')
            result['rig'] = rig
            result['clip'] = clip_for(clip_block, rig['n']) if clip_block else None
            result['body'] = clip_for(clip_block, BODY_JOINTS, expressions=True) if clip_block else None
        except Exception as e:  # noqa: BLE001 -- the site also drops the prop silently on any failure
            result['error'] = f'{type(e).__name__}: {e}'
        with self.lock:
            if len(self.cache) >= 16: self.cache.pop(next(iter(self.cache)))   # small bound: decoded clips are large
            self.cache[guid] = result
        return result


def _round(v, n=6):
    if isinstance(v, float): return round(v, n)
    if isinstance(v, list): return [_round(x, n) for x in v]
    if isinstance(v, dict): return {k: _round(x, n) for k, x in v.items()}
    return v


def to_json(prop, include_body=True):
    """Compact JSON for the viewer (/api/prop/<guid>)."""
    if 'error' in prop: return {'id': prop['id'], 'error': prop['error']}
    rig = prop['rig']

    def clip_json(c):
        if not c: return None
        if not c.get('frames'): return {'header': c['header'], 'frames': None, 'reason': c.get('reason'), 'counts': c.get('counts')}
        flat = [v for frame in c['frames'] for f in frame for v in (*f['position'], *f['rotation'], *(f.get('scale') or (1, 1, 1)))]
        j = {'header': {'frames': c['header']['frames'], 'fps': c['header']['fps']}, 'joints': len(c['frames'][0]),
             'counts': c['counts'], 'frames': base64.b64encode(struct.pack(f'<{len(flat)}f', *flat)).decode()}
        if c.get('expressions'): j['expressions'] = c['expressions']
        return j
    out = {'id': prop['id'], 'format': 'avatar-prop@1',
           'convention': 'row-vector row-major 4x4; frames = base64 float32, per frame per joint [px,py,pz, qx,qy,qz,qw, sx,sy,sz] (z flipped)',
           'rig': {'n': rig['n'], 'parents': [j['parent'] for j in rig['joints']],
                   'local': [_round(j['local']) for j in rig['joints']], 'inverseAbsolute': [_round(m) for m in rig['inverseAbsolute']]},
           'clip': clip_json(prop.get('clip'))}
    if include_body: out['body'] = clip_json(prop.get('body'))
    return out


def _selftest(limit=None):
    db = sqlite3.connect(ROOT / 'catalogue/index.sqlite')
    ids = [r[0] for r in db.execute("SELECT id FROM assets WHERE substr(id,1,8)='00001000' ORDER BY id")]
    db.close()
    lib = PropLibrary(); stats = {'props': 0, 'rig': 0, 'propClip': 0, 'bodyClip': 0, 'errors': {}, 'jointCounts': {}}
    for guid in ids[:limit]:
        p = lib.prop(guid); stats['props'] += 1
        if 'error' in p:
            stats['errors'][p['error']] = stats['errors'].get(p['error'], 0) + 1; continue
        stats['rig'] += 1; n = p['rig']['n']; stats['jointCounts'][n] = stats['jointCounts'].get(n, 0) + 1
        if p['clip'] and p['clip'].get('frames'): stats['propClip'] += 1
        if p['body'] and p['body'].get('frames'): stats['bodyClip'] += 1
        with lib.lock: lib.cache.pop(guid, None)
    print(json.dumps(stats, indent=1))


def main(argv):
    if '--selftest' in argv:
        lim = int(argv[argv.index('--limit') + 1]) if '--limit' in argv else None
        return _selftest(lim)
    guid = argv[0]; t = float(argv[argv.index('--t') + 1]) if '--t' in argv else 0.0
    p = PropLibrary().prop(guid)
    if 'error' in p: print(p['error']); return
    rig = p['rig']; clip = p['clip']; body = p['body']
    print('rig joints', rig['n'], 'parents', [j['parent'] for j in rig['joints']])
    for name, c in (('prop', clip), ('body', body)):
        if c: print(name, 'clip', c['header']['frames'], 'frames @', round(c['header']['fps'], 4), 'fps; streams', c['counts'],
                    'matched' if c.get('frames') else c.get('reason'))
    frame = sample(clip, t) if clip and clip.get('frames') else None
    world, skin = pose(rig, frame)
    for i, w in enumerate(world):
        sc = math.sqrt(skin[i][0] ** 2 + skin[i][1] ** 2 + skin[i][2] ** 2)
        print(f'joint {i}: world t=({w[12]:.4f},{w[13]:.4f},{w[14]:.4f}) skin t=({skin[i][12]:.4f},{skin[i][13]:.4f},{skin[i][14]:.4f}) row0 scale={sc:.4f}')


if __name__ == '__main__':
    main(sys.argv[1:])
