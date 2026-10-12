"""PSP movie (.pmf, e.g. a theme's GAMEBOOT.PMF) → MP4 the UI can play.

A PMF is a 2 KB PSMF header followed by an MPEG program stream: one H.264 video stream
(480 × 272, 29.97 fps) and, in most boot clips, an ATRAC3plus sound in private stream 1.
The H.264 data is copied as it is (no re-encoding): demuxed from the PES packets, cut into
access units and written to MP4. The sound is rewrapped as an .at3 (RIFF) file, which the
optional music decoder (vgmstream) turns into WAV; browsers can't play ATRAC3plus."""
import struct


def _pes_video(d, stream=0xE0):
    """[(pts or None, payload bytes)] of one stream (0xE0 = H.264, 0xBD = private 1) in an MPEG program stream."""
    out, p, n = [], 0, len(d)
    while p + 4 <= n:
        if d[p:p + 3] != b"\0\0\1":
            q = d.find(b"\0\0\1", p + 1)
            if q < 0:
                break
            p = q
            continue
        sid = d[p + 3]
        if sid == 0xBA:  # pack header (MPEG-2: 14 bytes + stuffing)
            if p + 14 > n:
                break
            p += 14 + (d[p + 13] & 7)
            continue
        if sid == 0xB9:  # end code
            break
        if p + 6 > n:
            break
        ln = struct.unpack(">H", d[p + 4:p + 6])[0]
        body = d[p + 6:p + 6 + ln]
        if sid == stream and len(body) >= 3:
            hl = body[2]
            pts = None
            if body[1] & 0x80 and hl >= 5:
                b = body[3:8]
                pts = ((b[0] >> 1) & 7) << 30 | b[1] << 22 | (b[2] >> 1) << 15 | b[3] << 7 | b[4] >> 1
            out.append((pts, body[3 + hl:]))
        p += 6 + ln
    return out


def _nals(es):
    """NAL units (without start codes) of an Annex-B byte stream."""
    out, i, n = [], 0, len(es)
    starts = []
    while True:
        j = es.find(b"\0\0\1", i)
        if j < 0:
            break
        starts.append(j + 3)
        i = j + 3
    for k, s in enumerate(starts):
        e = starts[k + 1] - 3 if k + 1 < len(starts) else n
        nal = es[s:e]
        while nal.endswith(b"\0"):  # trailing zero of a 4-byte start code
            nal = nal[:-1]
        if nal:
            out.append(nal)
    return out


def _box(t, *parts):
    b = b"".join(parts)
    return struct.pack(">I4s", 8 + len(b), t) + b


def _full(t, ver, flags, *parts):
    return _box(t, struct.pack(">I", (ver << 24) | flags), *parts)


def pmf_to_mp4(d, fps_num=30000, fps_den=1001):
    """MP4 bytes, or None when there is no usable H.264 stream."""
    if d[:4] != b"PSMF" or len(d) < 0x800 + 16:
        return None
    start = struct.unpack(">I", d[8:12])[0] or 0x800
    pes = _pes_video(d[start:])
    if not pes:
        return None
    es = b"".join(p for _, p in pes)
    nals = _nals(es)
    sps = next((x for x in nals if x[0] & 0x1F == 7), None)
    pps = next((x for x in nals if x[0] & 0x1F == 8), None)
    if not sps or not pps:
        return None
    # access units: a new one starts at an access unit delimiter, or at the first slice after a
    # slice of a different picture when the stream has no delimiters
    aus, cur, has_slice = [], [], False
    aud = any(x[0] & 0x1F == 9 for x in nals)
    for x in nals:
        t = x[0] & 0x1F
        if aud and t == 9:
            if cur:
                aus.append(cur)
            cur, has_slice = [], False
            continue
        if not aud and t in (1, 5) and has_slice and len(x) > 1 and x[1] & 0x80:  # first_mb_in_slice == 0
            aus.append(cur)
            cur, has_slice = [], False
        if t in (1, 5):
            has_slice = True
        if t == 12:  # filler data
            continue
        cur.append(x)  # parameter sets stay in-band too: the stream may switch PPS between pictures
    if cur:
        aus.append(cur)
    aus = [a for a in aus if any(x[0] & 0x1F in (1, 5) for x in a)]
    if not aus:
        return None
    samples = [b"".join(struct.pack(">I", len(x)) + x for x in a) for a in aus]
    sync = [i + 1 for i, a in enumerate(aus) if any(x[0] & 0x1F == 5 for x in a)] or [1]
    W, H = 480, 272
    ts, dur = fps_num, fps_den
    total = dur * len(samples)
    avcc = _box(b"avcC", bytes([1, sps[1], sps[2], sps[3], 0xFF, 0xE1]) + struct.pack(">H", len(sps)) + sps
                + bytes([1]) + struct.pack(">H", len(pps)) + pps)
    avc1 = _box(b"avc1", b"\0" * 6 + struct.pack(">H", 1) + b"\0" * 16 + struct.pack(">HHII", W, H, 0x00480000, 0x00480000)
                + struct.pack(">IH", 0, 1) + b"\0" * 32 + struct.pack(">Hh", 0x18, -1), avcc)
    stsd = _full(b"stsd", 0, 0, struct.pack(">I", 1), avc1)
    stts = _full(b"stts", 0, 0, struct.pack(">III", 1, len(samples), dur))
    stss = _full(b"stss", 0, 0, struct.pack(">I", len(sync)) + b"".join(struct.pack(">I", s) for s in sync))
    stsc = _full(b"stsc", 0, 0, struct.pack(">IIII", 1, 1, len(samples), 1))
    stsz = _full(b"stsz", 0, 0, struct.pack(">II", 0, len(samples)) + b"".join(struct.pack(">I", len(s)) for s in samples))
    ftyp = _box(b"ftyp", b"isom", struct.pack(">I", 0x200), b"isomiso2avc1mp41")

    def moov(chunk_off):
        stco = _full(b"stco", 0, 0, struct.pack(">II", 1, chunk_off))
        stbl = _box(b"stbl", stsd, stts, stss, stsc, stsz, stco)
        dinf = _box(b"dinf", _full(b"dref", 0, 0, struct.pack(">I", 1), _full(b"url ", 0, 1)))
        minf = _box(b"minf", _full(b"vmhd", 0, 1, b"\0" * 8), dinf, stbl)
        hdlr = _full(b"hdlr", 0, 0, b"\0" * 4 + b"vide" + b"\0" * 12 + b"VideoHandler\0")
        mdhd = _full(b"mdhd", 0, 0, struct.pack(">IIIIHH", 0, 0, ts, total, 0x55C4, 0))
        mdia = _box(b"mdia", mdhd, hdlr, minf)
        matrix = struct.pack(">9I", 0x10000, 0, 0, 0, 0x10000, 0, 0, 0, 0x40000000)
        tkhd = _full(b"tkhd", 0, 3, struct.pack(">IIIII", 0, 0, 1, 0, total * 1000 // ts) + b"\0" * 8
                     + struct.pack(">hhhH", 0, 0, 0, 0) + matrix + struct.pack(">II", W << 16, H << 16))
        trak = _box(b"trak", tkhd, mdia)
        mvhd = _full(b"mvhd", 0, 0, struct.pack(">IIII", 0, 0, 1000, total * 1000 // ts) + struct.pack(">IH", 0x10000, 0x100)
                     + b"\0" * 10 + matrix + b"\0" * 24 + struct.pack(">I", 2))
        return _box(b"moov", mvhd, trak)

    mdat_body = b"".join(samples)
    first = moov(0)
    off = len(ftyp) + len(first) + 8
    return ftyp + moov(off) + struct.pack(">I4s", 8 + len(mdat_body), b"mdat") + mdat_body


# RIFF/WAVE header of an ATRAC3plus file (WAVE_FORMAT_EXTENSIBLE + the ATRAC3plus GUID), as the
# PSP's own .at3 files have it; the frame size and the 2 codec config bytes vary per stream.
_AT3P_GUID = bytes.fromhex("bfaa23e958cb7144a119fffa01e4ce62")


def pmf_audio_at3(d):
    """The PMF's ATRAC3plus sound as an .at3 (RIFF) file, or None when it has none."""
    es = b"".join(pl[4:] for _, pl in _pes_video(d[0x800:] if d[:4] == b"PSMF" else d, 0xBD) if len(pl) > 4)
    frames, p, cfg, size = [], 0, None, 0
    while p + 8 <= len(es):
        if es[p:p + 2] != b"\x0f\xd0":  # every frame starts with 0F D0 <config, 2 bytes> 00 00 00 00
            q = es.find(b"\x0f\xd0", p + 1)
            if q < 0:
                break
            p = q
            continue
        c = es[p + 2:p + 4]
        fs = ((struct.unpack(">H", c)[0] & 0x3FF) * 8) + 8
        if cfg is None:
            cfg, size = c, fs
        if c != cfg or p + 8 + fs > len(es):
            break
        frames.append(es[p + 8:p + 8 + fs])
        p += 8 + fs
    if len(frames) < 4:
        return None
    ch = 2 if (cfg[0] >> 2) & 7 == 2 else 1  # channel-mode bits of the config
    rate = 44100
    data = b"".join(frames)
    fmt = struct.pack("<HHIIHH", 0xFFFE, ch, rate, rate * size // 2048, size, 0)
    fmt += struct.pack("<HHI", 34, 2048, 3 if ch == 2 else 4) + _AT3P_GUID + struct.pack("<H", 1) + cfg + b"\0" * 8
    fact = struct.pack("<II", len(frames) * 2048, 0)
    body = b"WAVE" + b"fmt " + struct.pack("<I", len(fmt)) + fmt + b"fact" + struct.pack("<I", len(fact)) + fact + b"data" + struct.pack("<I", len(data)) + data
    return b"RIFF" + struct.pack("<I", len(body)) + body
