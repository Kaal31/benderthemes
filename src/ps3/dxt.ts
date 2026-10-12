// PS3 GTF texture data in the browser: DXT1/3/5 blocks or big-endian A8R8G8B8 → RGBA pixels.
// Used when the GPU can't take the compressed data directly (WEBGL_compressed_texture_s3tc).

function c565(c: number, out: number[], o: number) {
  const r = (c >> 11) & 31, g = (c >> 5) & 63, b = c & 31;
  out[o] = (r << 3) | (r >> 2); out[o + 1] = (g << 2) | (g >> 4); out[o + 2] = (b << 3) | (b >> 2);
}

export function decodeDxt(data: Uint8Array, w: number, h: number, kind: "dxt1" | "dxt3" | "dxt5"): Uint8Array {
  const out = new Uint8Array(w * h * 4);
  const bs = kind === "dxt1" ? 8 : 16;
  const bw = (w + 3) >> 2, bh = (h + 3) >> 2;
  const pal = new Array(16).fill(0);
  const alpha = new Uint8Array(16);
  for (let by = 0; by < bh; by++) {
    for (let bx = 0; bx < bw; bx++) {
      const o = (by * bw + bx) * bs;
      const co = kind === "dxt1" ? o : o + 8;
      // alpha
      if (kind === "dxt3") {
        for (let i = 0; i < 16; i++) alpha[i] = ((data[o + (i >> 1)] >> ((i & 1) * 4)) & 15) * 17;
      } else if (kind === "dxt5") {
        const a0 = data[o], a1 = data[o + 1];
        const ap = [a0, a1];
        if (a0 > a1) for (let i = 1; i < 7; i++) ap.push(((7 - i) * a0 + i * a1) / 7 | 0);
        else { for (let i = 1; i < 5; i++) ap.push(((5 - i) * a0 + i * a1) / 5 | 0); ap.push(0, 255); }
        let bits = 0;
        for (let i = 0; i < 6; i++) bits += data[o + 2 + i] * 2 ** (8 * i);
        for (let i = 0; i < 16; i++) alpha[i] = ap[Math.floor(bits / 2 ** (3 * i)) & 7];
      } else alpha.fill(255);
      // colour
      const c0 = data[co] | (data[co + 1] << 8), c1 = data[co + 2] | (data[co + 3] << 8);
      c565(c0, pal, 0); c565(c1, pal, 4);
      pal[3] = pal[7] = 255;
      if (c0 > c1 || kind !== "dxt1") {
        for (let k = 0; k < 3; k++) { pal[8 + k] = (2 * pal[k] + pal[4 + k]) / 3 | 0; pal[12 + k] = (pal[k] + 2 * pal[4 + k]) / 3 | 0; }
        pal[11] = pal[15] = 255;
      } else {
        for (let k = 0; k < 3; k++) { pal[8 + k] = (pal[k] + pal[4 + k]) >> 1; pal[12 + k] = 0; }
        pal[11] = 255; pal[15] = 0;
      }
      const bits = data[co + 4] | (data[co + 5] << 8) | (data[co + 6] << 16) | (data[co + 7] << 24);
      for (let i = 0; i < 16; i++) {
        const x = (bx << 2) + (i & 3), y = (by << 2) + (i >> 2);
        if (x >= w || y >= h) continue;
        const p = ((bits >>> (2 * i)) & 3) * 4, q = (y * w + x) * 4;
        out[q] = pal[p]; out[q + 1] = pal[p + 1]; out[q + 2] = pal[p + 2];
        out[q + 3] = kind === "dxt1" ? pal[p + 3] : alpha[i];
      }
    }
  }
  return out;
}

export function decodeArgb(data: Uint8Array, w: number, h: number, pitch: number): Uint8Array {
  const out = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = y * pitch + x * 4, d = (y * w + x) * 4;
    out[d] = data[s + 1]; out[d + 1] = data[s + 2]; out[d + 2] = data[s + 3]; out[d + 3] = data[s];
  }
  return out;
}

export function base64Bytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
