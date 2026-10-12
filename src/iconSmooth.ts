// Edge reconstruction for theme icons. Vita themes must use 256-colour palette PNGs, and the
// bubble shading takes up almost the whole palette, so solid glyphs keep a single colour with
// no anti-aliasing: hard pixel steps that show once the 128 px icon is enlarged.
// Each solid single-colour shape is redrawn here from a smoothed coverage field (like a traced
// vector, sharp at any size); the pixels underneath are refilled from their surroundings, and
// the rest of the picture is upscaled normally. Runs once per icon in the UI and is cached;
// the original is shown until it is ready.
import { useEffect, useState } from "react";

const done = new Map<string, string>();
const pending = new Map<string, Promise<string>>();
const F = 3; // output scale (128 px → 384 px, ≥2× the on-screen bubble)
// edge smoothing strength (blur of the shape mask, in source px) per level: light / normal / strong
const SIGMA = [0, 0.8, 1.0, 1.35];
function kernel(sigma: number) {
  const r = Math.ceil(sigma * 2.5), k: number[] = [];
  for (let d = -r; d <= r; d++) k.push(Math.exp(-(d * d) / (2 * sigma * sigma)));
  const t = k.reduce((a, b) => a + b, 0);
  return k.map((v) => v / t);
}

type Up = (px: Uint8ClampedArray, w: number, h: number, W: number, H: number) => Uint8ClampedArray;

export function smoothPixels(data: Uint8ClampedArray, w: number, h: number, upscale: Up, sigma = 1) {
  const K = kernel(sigma), R = (K.length - 1) / 2;
  const N = w * h;
  const key = (i: number) => (data[i * 4] << 16) | (data[i * 4 + 1] << 8) | data[i * 4 + 2];
  const counts = new Map<number, number>();
  let opaque = 0;
  for (let i = 0; i < N; i++) {
    if (data[i * 4 + 3] !== 255) continue;
    opaque++;
    counts.set(key(i), (counts.get(key(i)) ?? 0) + 1);
  }
  // solid shapes: one exact colour covering a real area, but not the picture's background
  const layers = [...counts.entries()]
    .filter(([, n]) => n >= Math.max(48, opaque * 0.03) && n <= opaque * 0.5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k]) => k);
  if (!layers.length) return null;
  const owner = new Int8Array(N).fill(-1);
  for (let i = 0; i < N; i++) if (data[i * 4 + 3] === 255) owner[i] = layers.indexOf(key(i));

  // 1) the picture without those shapes: refill their pixels from the surrounding colours
  const base = new Float32Array(data);
  let known = new Uint8Array(N);
  for (let i = 0; i < N; i++) known[i] = owner[i] < 0 ? 1 : 0;
  for (let pass = 0; pass < 96; pass++) {
    const nk = known.slice();
    let left = 0;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (known[i]) continue;
        let r = 0, g = 0, b = 0, wa = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx, yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
            const j = yy * w + xx;
            if (!known[j]) continue;
            const a = base[j * 4 + 3] / 255;
            r += base[j * 4] * a; g += base[j * 4 + 1] * a; b += base[j * 4 + 2] * a; wa += a;
          }
        if (wa > 0) { base[i * 4] = r / wa; base[i * 4 + 1] = g / wa; base[i * 4 + 2] = b / wa; nk[i] = 1; } else left++;
      }
    known = nk;
    if (!left) break;
  }
  const W = w * F, H = h * F;
  const out = upscale(Uint8ClampedArray.from(base), w, h, W, H);

  // 2) each shape: blurred mask → smooth field (Catmull-Rom) → 1 px anti-aliased edge at output size
  const tmp = new Float32Array(N), fld = new Float32Array(N), big = new Float32Array(W * H);
  const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
    p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)));
  const at = (x: number, y: number) => fld[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  layers.forEach((col, L) => {
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let s = 0;
        for (let d = -R; d <= R; d++) s += K[d + R] * (owner[y * w + Math.min(w - 1, Math.max(0, x + d))] === L ? 1 : 0);
        tmp[y * w + x] = s;
      }
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let s = 0;
        for (let d = -R; d <= R; d++) s += K[d + R] * tmp[Math.min(h - 1, Math.max(0, y + d)) * w + x];
        fld[y * w + x] = s;
      }
    // thin strokes (1–2 px lines) would fade out under the blur: keep them at least half covered
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (owner[i] !== L || fld[i] >= 0.6) continue;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx, yy = y + dy;
            if (xx >= 0 && yy >= 0 && xx < w && yy < h && owner[yy * w + xx] === L) n++;
          }
        if (n <= 4) fld[i] = 0.6;
      }
    const row = [0, 0, 0, 0];
    for (let Y = 0; Y < H; Y++) {
      const sy = (Y + 0.5) / F - 0.5, y0 = Math.floor(sy), ty = sy - y0;
      for (let X = 0; X < W; X++) {
        const sx = (X + 0.5) / F - 0.5, x0 = Math.floor(sx), tx = sx - x0;
        for (let j = 0; j < 4; j++) row[j] = cr(at(x0 - 1, y0 + j - 1), at(x0, y0 + j - 1), at(x0 + 1, y0 + j - 1), at(x0 + 2, y0 + j - 1), tx);
        big[Y * W + X] = cr(row[0], row[1], row[2], row[3], ty);
      }
    }
    const cR = (col >> 16) & 255, cG = (col >> 8) & 255, cB = col & 255;
    for (let Y = 0; Y < H; Y++)
      for (let X = 0; X < W; X++) {
        const i = Y * W + X, f = big[i];
        if (f < 0.2) continue;
        const gx = big[Y * W + Math.min(W - 1, X + 1)] - big[Y * W + Math.max(0, X - 1)];
        const gy = big[Math.min(H - 1, Y + 1) * W + X] - big[Math.max(0, Y - 1) * W + X];
        const g = Math.hypot(gx, gy) / 2;
        const cov = g > 1e-4 ? Math.min(1, Math.max(0, (f - 0.5) / g + 0.5)) : f > 0.5 ? 1 : 0;
        if (!cov) continue;
        const o = i * 4, ba = out[o + 3] / 255, a = cov + ba * (1 - cov);
        out[o] = (cR * cov + out[o] * ba * (1 - cov)) / a;
        out[o + 1] = (cG * cov + out[o + 1] * ba * (1 - cov)) / a;
        out[o + 2] = (cB * cov + out[o + 2] * ba * (1 - cov)) / a;
        out[o + 3] = a * 255;
      }
  });
  return { out, W, H };
}

function load(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}
const canvasUp: Up = (px, w, h, W, H) => {
  const a = document.createElement("canvas");
  a.width = w; a.height = h;
  a.getContext("2d")!.putImageData(new ImageData(new Uint8ClampedArray(px.buffer as ArrayBuffer), w, h), 0, 0);
  const b = document.createElement("canvas");
  b.width = W; b.height = H;
  const g = b.getContext("2d")!;
  g.imageSmoothingEnabled = true;
  (g as any).imageSmoothingQuality = "high";
  g.drawImage(a, 0, 0, W, H);
  return g.getImageData(0, 0, W, H).data;
};

export function smoothIcon(src: string, level = 2): Promise<string> {
  if (!level) return Promise.resolve(src);
  const key = `${level}|${src}`;
  const ready = done.get(key);
  if (ready) return Promise.resolve(ready);
  let p = pending.get(key);
  if (!p) {
    p = (async () => {
      const img = await load(src);
      const w = img.naturalWidth, h = img.naturalHeight;
      if (!w || !h || w > 256 || h > 256) return src; // already detailed enough
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const g = c.getContext("2d");
      if (!g) return src;
      g.drawImage(img, 0, 0);
      const r = smoothPixels(g.getImageData(0, 0, w, h).data, w, h, canvasUp, SIGMA[level] ?? 1);
      const out = document.createElement("canvas");
      if (r) {
        out.width = r.W; out.height = r.H;
        out.getContext("2d")!.putImageData(new ImageData(new Uint8ClampedArray(r.out.buffer as ArrayBuffer), r.W, r.H), 0, 0);
      } else {
        // no solid shapes: a clean high-quality upscale only
        out.width = w * F; out.height = h * F;
        const og = out.getContext("2d")!;
        og.imageSmoothingEnabled = true;
        (og as any).imageSmoothingQuality = "high";
        og.drawImage(img, 0, 0, w * F, h * F);
      }
      return out.toDataURL("image/png");
    })().catch(() => src);
    pending.set(key, p);
  }
  return p.then((u) => { done.set(key, u); pending.delete(key); return u; });
}

/** The smoothed version of `src` once it is ready (the original until then). */
export function useSmoothIcon(src: string | undefined, level = 2): string | undefined {
  const cached = () => (src ? (level ? done.get(`${level}|${src}`) : src) ?? src : undefined);
  const [url, setUrl] = useState(cached);
  useEffect(() => {
    if (!src) return setUrl(undefined);
    setUrl(cached());
    let alive = true;
    smoothIcon(src, level).then((u) => alive && setUrl(u));
    return () => { alive = false; };
  }, [src, level]);
  return url;
}
