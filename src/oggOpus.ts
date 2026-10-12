// Theme music compression in the UI: Chromium's WebCodecs Opus encoder + a tiny Ogg writer.
// Used to turn a decoded theme track (16-bit WAV, ~27 MB) into Ogg Opus (~2 MB) once.
// Feature-detected: without WebCodecs (or outside a secure context) nothing happens and
// the WAV keeps playing.

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let r = i << 24;
    for (let j = 0; j < 8; j++) r = r & 0x80000000 ? (r << 1) ^ 0x04c11db7 : r << 1;
    t[i] = r >>> 0;
  }
  return t;
})();
function crc(b: Uint8Array) {
  let c = 0;
  for (let i = 0; i < b.length; i++) c = ((c << 8) ^ CRC[((c >>> 24) ^ b[i]) & 255]) >>> 0;
  return c;
}
function oggPage(packets: Uint8Array[], granule: number, serial: number, seq: number, flags: number) {
  const lacing: number[] = [];
  for (const p of packets) {
    let n = p.length;
    while (n >= 255) { lacing.push(255); n -= 255; }
    lacing.push(n);
  }
  const body = packets.reduce((a, p) => a + p.length, 0);
  const out = new Uint8Array(27 + lacing.length + body);
  const dv = new DataView(out.buffer);
  out.set([79, 103, 103, 83], 0); // "OggS"
  out[5] = flags;
  dv.setUint32(6, granule % 0x100000000, true);
  dv.setUint32(10, Math.floor(granule / 0x100000000), true);
  dv.setUint32(14, serial, true);
  dv.setUint32(18, seq, true);
  out[26] = lacing.length;
  out.set(lacing, 27);
  let o = 27 + lacing.length;
  for (const p of packets) { out.set(p, o); o += p.length; }
  dv.setUint32(22, crc(out), true);
  return out;
}

export async function opusSupported(sampleRate: number, channels: number): Promise<boolean> {
  try {
    const AE = (globalThis as any).AudioEncoder;
    if (!AE || !(globalThis as any).AudioData) return false;
    return !!(await AE.isConfigSupported({ codec: "opus", sampleRate, numberOfChannels: channels, bitrate: 128000 })).supported;
  } catch {
    return false;
  }
}

/** PCM16 WAV → { rate, channels: Float32Array[] } (null for anything else). */
export function parseWav(buf: ArrayBuffer): { rate: number; channels: Float32Array[] } | null {
  const dv = new DataView(buf);
  if (dv.byteLength < 44 || dv.getUint32(0, false) !== 0x52494646 || dv.getUint32(8, false) !== 0x57415645) return null;
  let p = 12, rate = 0, ch = 0, bits = 0, dataOff = -1, dataLen = 0;
  while (p + 8 <= dv.byteLength) {
    const id = dv.getUint32(p, false), len = dv.getUint32(p + 4, true);
    if (id === 0x666d7420) { ch = dv.getUint16(p + 10, true); rate = dv.getUint32(p + 12, true); bits = dv.getUint16(p + 22, true); }
    if (id === 0x64617461) { dataOff = p + 8; dataLen = Math.min(len, dv.byteLength - dataOff); break; }
    p += 8 + len + (len & 1);
  }
  if (bits !== 16 || !ch || !rate || dataOff < 0) return null;
  const frames = Math.floor(dataLen / (2 * ch));
  const out = Array.from({ length: ch }, () => new Float32Array(frames));
  // fast path: aligned little-endian samples read through a typed view
  const pcm = dataOff % 2 === 0 ? new Int16Array(buf, dataOff, frames * ch) : null;
  for (let c = 0; c < ch; c++) {
    const o = out[c];
    if (pcm) for (let f = 0, i = c; f < frames; f++, i += ch) o[f] = pcm[i] / 32768;
    else for (let f = 0; f < frames; f++) o[f] = dv.getInt16(dataOff + (f * ch + c) * 2, true) / 32768;
  }
  return { rate, channels: out };
}

export async function encodeOggOpus(channels: Float32Array[], sampleRate: number, bitrate = 128000): Promise<Uint8Array> {
  const AE = (globalThis as any).AudioEncoder, AD = (globalThis as any).AudioData;
  const ch = channels.length, total = channels[0].length;
  const chunks: { b: Uint8Array; dur: number }[] = [];
  let failure: unknown = null;
  const enc = new AE({
    output: (c: any) => { const b = new Uint8Array(c.byteLength); c.copyTo(b); chunks.push({ b, dur: c.duration ?? 20000 }); },
    error: (e: unknown) => { failure = e; },
  });
  enc.configure({ codec: "opus", sampleRate, numberOfChannels: ch, bitrate });
  for (let s = 0; s < total; s += sampleRate) {
    const n = Math.min(sampleRate, total - s);
    const buf = new Float32Array(n * ch);
    for (let c = 0; c < ch; c++) buf.set(channels[c].subarray(s, s + n), c * n);
    enc.encode(new AD({ format: "f32-planar", sampleRate, numberOfFrames: n, numberOfChannels: ch, timestamp: Math.round((s * 1e6) / sampleRate), data: buf }));
    if (failure) break;
  }
  await enc.flush();
  enc.close();
  if (failure) throw failure;
  const preSkip = 312, serial = 0x44485448, pages: Uint8Array[] = [];
  let seq = 0;
  const head = new Uint8Array(19);
  head.set([79, 112, 117, 115, 72, 101, 97, 100], 0); // "OpusHead"
  head[8] = 1; head[9] = ch;
  new DataView(head.buffer).setUint16(10, preSkip, true);
  new DataView(head.buffer).setUint32(12, sampleRate, true);
  pages.push(oggPage([head], 0, serial, seq++, 2));
  const vendor = new TextEncoder().encode("DeckHomeThemes");
  const tags = new Uint8Array(16 + vendor.length);
  tags.set(new TextEncoder().encode("OpusTags"), 0);
  new DataView(tags.buffer).setUint32(8, vendor.length, true);
  tags.set(vendor, 12);
  pages.push(oggPage([tags], 0, serial, seq++, 0));
  let granule = preSkip, batch: Uint8Array[] = [];
  for (let i = 0; i < chunks.length; i++) {
    granule += Math.round((chunks[i].dur * 48000) / 1e6);
    batch.push(chunks[i].b);
    const last = i === chunks.length - 1;
    if (batch.length >= 50 || last) {
      pages.push(oggPage(batch, last ? Math.round((total * 48000) / sampleRate) + preSkip : granule, serial, seq++, last ? 4 : 0));
      batch = [];
    }
  }
  const out = new Uint8Array(pages.reduce((a, p) => a + p.length, 0));
  let o = 0;
  for (const p of pages) { out.set(p, o); o += p.length; }
  return out;
}

export function toBase64(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i += 32768) s += String.fromCharCode.apply(null, Array.from(b.subarray(i, i + 32768)));
  return btoa(s);
}
