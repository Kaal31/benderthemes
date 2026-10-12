// PS3 dynamic themes: plays Edge skeletal animations (decoded from .anim by the backend) on a
// model's skeleton. An actor has 8 animation slots (anim_time seconds, anim_speed, anim_weight);
// slot i plays the model's i-th animation, and the weighted slots are blended over the base pose.
import type { Joint } from "./rafRender";

/** [joint, "r" | "t" | "s", frames (ascending), values (4 per frame for "r", else 3)] */
export type Track = [number, string, number[], number[]];
export interface AnimData { fps: number; frames: number; duration: number; tracks: Track[] }

function sample(tr: Track, frame: number, out: number[]) {
  const f = tr[2], v = tr[3], n = tr[1] === "r" ? 4 : 3;
  let hi = f.length - 1;
  if (frame <= f[0] || hi === 0) { for (let i = 0; i < n; i++) out[i] = v[i]; return; }
  if (frame >= f[hi]) { for (let i = 0; i < n; i++) out[i] = v[hi * n + i]; return; }
  let lo = 0;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (f[mid] <= frame) lo = mid; else hi = mid; }
  const t = (frame - f[lo]) / (f[hi] - f[lo]), a = lo * n, b = hi * n;
  if (n === 4) {
    // nlerp along the shorter arc
    const d = v[a] * v[b] + v[a + 1] * v[b + 1] + v[a + 2] * v[b + 2] + v[a + 3] * v[b + 3];
    const s = d < 0 ? -1 : 1;
    let l = 0;
    for (let i = 0; i < 4; i++) { out[i] = v[a + i] * (1 - t) + s * v[b + i] * t; l += out[i] * out[i]; }
    l = Math.sqrt(l) || 1;
    for (let i = 0; i < 4; i++) out[i] /= l;
  } else for (let i = 0; i < 3; i++) out[i] = v[a + i] * (1 - t) + v[b + i] * t;
}

function blend(dst: number[], src: number[], w: number, rot: boolean) {
  if (w >= 1) { for (let i = 0; i < dst.length; i++) dst[i] = src[i]; return; }
  const s = rot && dst[0] * src[0] + dst[1] * src[1] + dst[2] * src[2] + dst[3] * src[3] < 0 ? -1 : 1;
  let l = 0;
  for (let i = 0; i < dst.length; i++) { dst[i] = dst[i] * (1 - w) + s * src[i] * w; l += dst[i] * dst[i]; }
  if (rot) { l = Math.sqrt(l) || 1; for (let i = 0; i < 4; i++) dst[i] /= l; }
}

/** Animation time (seconds) → frame index, looping over the clip. */
export function animFrame(a: AnimData, seconds: number): number {
  const len = a.frames > 1 ? (a.frames - 1) / (a.fps || 30) : 0;
  if (len <= 0) return 0;
  let t = seconds % len;
  if (t < 0) t += len;
  return t * (a.fps || 30);
}

/** The skeleton posed by the actor's weighted animation slots, or null when nothing plays. */
export function posedJoints(base: Joint[], anims: ({ data?: AnimData | null } | undefined)[], time: number[], weight: number[]): Joint[] | null {
  let any = false;
  for (let i = 0; i < anims.length && i < 8; i++) if (anims[i]?.data && (weight[i] ?? 0) > 0) { any = true; break; }
  if (!any) return null;
  const out = base.map((j) => ({ parent: j.parent, rot: j.rot.slice(), pos: j.pos.slice(), scale: j.scale.slice() }));
  const acc = new Float32Array(base.length * 3); // weight so far per joint and channel
  const tmp = [0, 0, 0, 0];
  for (let i = 0; i < anims.length && i < 8; i++) {
    const d = anims[i]?.data, w = weight[i] ?? 0;
    if (!d || w <= 0) continue;
    const frame = animFrame(d, time[i] ?? 0);
    for (const tr of d.tracks) {
      const j = tr[0];
      if (j >= out.length) continue;
      const k = tr[1] === "r" ? 0 : tr[1] === "t" ? 1 : 2;
      sample(tr, frame, tmp);
      const sum = acc[j * 3 + k] + w;
      acc[j * 3 + k] = sum;
      const dst = k === 0 ? out[j].rot : k === 1 ? out[j].pos : out[j].scale;
      blend(dst, k === 0 ? tmp : tmp.slice(0, 3), w / Math.max(sum, 1), k === 0);
    }
  }
  return out;
}
