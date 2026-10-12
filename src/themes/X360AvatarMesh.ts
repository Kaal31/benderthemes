// The smooth parts of the Xbox 360-style avatars: one skinned body mesh
// (torso, arms and legs blended into a single surface, clothes coloured onto
// it, bound to a skeleton so it bends at the joints) and the painted face,
// which like the console's avatars carries the eyes, brows, mouth and hairline
// as a texture rather than as separate pieces.
import * as THREE from "three";

// ───────────────────────── distance field ─────────────────────────
type V3 = [number, number, number];
/** A tapered capsule from a to b; `flat` squashes it along x and z (1 = round). */
export type Part = { a: V3; b: V3; ra: number; rb: number; bone: number; region: number; flat?: [number, number] };

function capsule(p: V3, c: Part): { d: number; t: number } {
  const fx = c.flat ? c.flat[0] : 1;
  const fz = c.flat ? c.flat[1] : 1;
  const px = p[0] / fx, py = p[1], pz = p[2] / fz;
  const ax = c.a[0] / fx, ay = c.a[1], az = c.a[2] / fz;
  const bx = c.b[0] / fx - ax, by = c.b[1] - ay, bz = c.b[2] / fz - az;
  const qx = px - ax, qy = py - ay, qz = pz - az;
  const len2 = bx * bx + by * by + bz * bz || 1e-9;
  const t = Math.max(0, Math.min(1, (qx * bx + qy * by + qz * bz) / len2));
  const dx = qx - bx * t, dy = qy - by * t, dz = qz - bz * t;
  const scale = Math.min(fx, fz); // keep the field roughly metric when squashed
  return { d: Math.sqrt(dx * dx + dy * dy + dz * dz) * scale - (c.ra + (c.rb - c.ra) * t), t };
}
const smin = (a: number, b: number, k: number) => {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

/** Groups blend among themselves with their own softness, then into the body with `join`. */
export type Group = { parts: number[]; k: number; join: number };

type Box = { lo: V3; hi: V3 };
const boxOf = (cs: Part[]): Box => {
  const lo: V3 = [Infinity, Infinity, Infinity];
  const hi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const c of cs)
    for (const q of [c.a, c.b])
      for (let e = 0; e < 3; e++) {
        const r = Math.max(c.ra, c.rb);
        lo[e] = Math.min(lo[e], q[e] - r);
        hi[e] = Math.max(hi[e], q[e] + r);
      }
  return { lo, hi };
};
/** How far p is outside the box: never more than the distance to anything inside it. */
const boxGap = (b: Box, p: V3) => {
  let s = 0;
  for (let e = 0; e < 3; e++) {
    const o = Math.max(b.lo[e] - p[e], 0, p[e] - b.hi[e]);
    s += o * o;
  }
  return Math.sqrt(s);
};

/** The blended distance; parts too far away to matter are skipped by their bounding boxes. */
function makeField(parts: Part[], groups: Group[]) {
  const partBox = parts.map((c) => boxOf([c]));
  const groupBox = groups.map((g) => boxOf(g.parts.map((i) => parts[i])));
  return (p: V3) => {
    let d = Infinity;
    groups.forEach((g, gi) => {
      if (d !== Infinity && boxGap(groupBox[gi], p) > d + g.join) return;
      let gd = Infinity;
      for (const i of g.parts) {
        if (gd !== Infinity && boxGap(partBox[i], p) > gd + g.k) continue;
        gd = smin(gd, capsule(p, parts[i]).d, g.k);
      }
      d = d === Infinity ? gd : smin(d, gd, g.join);
    });
    return d;
  };
}

// ───────────────────────── surface nets ─────────────────────────
/** Polygonises the zero level of the field over a box with cell size h. */
function surfaceNets(f: (p: V3) => number, min: V3, max: V3, h: number) {
  const nx = Math.ceil((max[0] - min[0]) / h) + 1;
  const ny = Math.ceil((max[1] - min[1]) / h) + 1;
  const nz = Math.ceil((max[2] - min[2]) / h) + 1;
  const vals = new Float32Array(nx * ny * nz);
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  const q: V3 = [0, 0, 0];
  // a coarse pass first: points far from the surface keep the coarse value, only those near it are worked out exactly
  const C = 3;
  const cx = Math.ceil(nx / C) + 1, cy = Math.ceil(ny / C) + 1, cz = Math.ceil(nz / C) + 1;
  const coarse = new Float32Array(cx * cy * cz);
  for (let k = 0; k < cz; k++)
    for (let j = 0; j < cy; j++)
      for (let i = 0; i < cx; i++) {
        q[0] = min[0] + i * C * h;
        q[1] = min[1] + j * C * h;
        q[2] = min[2] + k * C * h;
        coarse[i + cx * (j + cy * k)] = f(q);
      }
  const far = C * h * 1.5;
  for (let k = 0; k < nz; k++)
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const c = coarse[Math.round(i / C) + cx * (Math.round(j / C) + cy * Math.round(k / C))];
        if (Math.abs(c) > far) {
          vals[at(i, j, k)] = c;
          continue;
        }
        q[0] = min[0] + i * h;
        q[1] = min[1] + j * h;
        q[2] = min[2] + k * h;
        vals[at(i, j, k)] = f(q);
      }
  const cell = new Int32Array(nx * ny * nz).fill(-1);
  const pos: number[] = [];
  const corners = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const cv = new Float32Array(8);
  const off = corners.map(([x, y, z]) => x + nx * (y + ny * z));
  for (let k = 0; k < nz - 1; k++)
    for (let j = 0; j < ny - 1; j++)
      for (let i = 0; i < nx - 1; i++) {
        const base = at(i, j, k);
        let inside = 0;
        for (let c = 0; c < 8; c++) {
          const x = vals[base + off[c]];
          cv[c] = x;
          if (x < 0) inside |= 1 << c;
        }
        if (inside === 0 || inside === 255) continue;
        let sx = 0, sy = 0, sz = 0, n = 0;
        for (const [e0, e1] of edges) {
          const a = cv[e0], b = cv[e1];
          if (a < 0 === b < 0) continue;
          const t = a / (a - b);
          sx += corners[e0][0] + (corners[e1][0] - corners[e0][0]) * t;
          sy += corners[e0][1] + (corners[e1][1] - corners[e0][1]) * t;
          sz += corners[e0][2] + (corners[e1][2] - corners[e0][2]) * t;
          n++;
        }
        cell[at(i, j, k)] = pos.length / 3;
        pos.push(min[0] + (i + sx / n) * h, min[1] + (j + sy / n) * h, min[2] + (k + sz / n) * h);
      }
  const idx: number[] = [];
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) idx.push(a, c, b, a, d, c);
    else idx.push(a, b, c, a, c, d);
  };
  for (let k = 1; k < nz - 1; k++)
    for (let j = 1; j < ny - 1; j++)
      for (let i = 1; i < nx - 1; i++) {
        const v0 = vals[at(i, j, k)] < 0;
        // edge along x from (i,j,k) to (i+1,j,k): the four cells around it
        if (i < nx - 1 && v0 !== vals[at(i + 1, j, k)] < 0)
          quad(cell[at(i, j - 1, k - 1)], cell[at(i, j, k - 1)], cell[at(i, j, k)], cell[at(i, j - 1, k)], !v0);
        if (j < ny - 1 && v0 !== vals[at(i, j + 1, k)] < 0)
          quad(cell[at(i - 1, j, k - 1)], cell[at(i - 1, j, k)], cell[at(i, j, k)], cell[at(i, j, k - 1)], !v0);
        if (k < nz - 1 && v0 !== vals[at(i, j, k + 1)] < 0)
          quad(cell[at(i - 1, j - 1, k)], cell[at(i, j - 1, k)], cell[at(i, j, k)], cell[at(i - 1, j, k)], !v0);
      }
  return { pos: new Float32Array(pos), idx };
}

/** A couple of passes of neighbour averaging to take the grid out of the surface. */
function relax(pos: Float32Array, idx: number[], passes: number) {
  const n = pos.length / 3;
  const nb: number[][] = Array.from({ length: n }, () => []);
  for (let t = 0; t < idx.length; t += 3)
    for (let e = 0; e < 3; e++) {
      const a = idx[t + e], b = idx[t + ((e + 1) % 3)];
      nb[a].push(b);
      nb[b].push(a);
    }
  const tmp = new Float32Array(pos.length);
  for (let p = 0; p < passes; p++) {
    for (let v = 0; v < n; v++) {
      const list = nb[v];
      if (!list.length) {
        tmp.set(pos.subarray(v * 3, v * 3 + 3), v * 3);
        continue;
      }
      let x = 0, y = 0, z = 0;
      for (const u of list) (x += pos[u * 3]), (y += pos[u * 3 + 1]), (z += pos[u * 3 + 2]);
      const m = 0.5 / list.length;
      tmp[v * 3] = pos[v * 3] * 0.5 + x * m;
      tmp[v * 3 + 1] = pos[v * 3 + 1] * 0.5 + y * m;
      tmp[v * 3 + 2] = pos[v * 3 + 2] * 0.5 + z * m;
    }
    pos.set(tmp);
  }
}

export type BodyShape = {
  geometry: THREE.BufferGeometry; // positions, normals, skinIndex, skinWeight
  part: Uint8Array; // the part each vertex belongs to
  t: Float32Array; // how far along that part it lies, 0 at a, 1 at b
};

/**
 * Builds the blended surface and binds each vertex to the bones of the parts
 * nearest it. With `parent` (each bone's parent, -1 for none) a vertex only
 * takes weight from its own part's bone and the bones joined to it, so a
 * hand resting near the hip never pulls the hip along.
 */
export function buildBodyShape(parts: Part[], groups: Group[], h = 0.024, parent?: number[]): BodyShape {
  const lo: V3 = [Infinity, Infinity, Infinity];
  const hi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const c of parts)
    for (const p of [c.a, c.b])
      for (let e = 0; e < 3; e++) {
        const r = Math.max(c.ra, c.rb) + 3 * h;
        lo[e] = Math.min(lo[e], p[e] - r);
        hi[e] = Math.max(hi[e], p[e] + r);
      }
  const { pos, idx } = surfaceNets(makeField(parts, groups), lo, hi, h);
  relax(pos, idx, 2);
  const n = pos.length / 3;
  const skinIndex = new Uint16Array(n * 4);
  const skinWeight = new Float32Array(n * 4);
  const part = new Uint8Array(n);
  const tt = new Float32Array(n);
  const nb = Math.max(...parts.map((c) => c.bone)) + 1;
  const wb = new Float64Array(nb);
  const p: V3 = [0, 0, 0];
  const ds = new Float64Array(parts.length);
  for (let v = 0; v < n; v++) {
    p[0] = pos[v * 3];
    p[1] = pos[v * 3 + 1];
    p[2] = pos[v * 3 + 2];
    wb.fill(0);
    let near = Infinity;
    for (let i = 0; i < parts.length; i++) {
      const { d, t } = capsule(p, parts[i]);
      ds[i] = d;
      if (d < near) (near = d), (part[v] = i), (tt[v] = t);
    }
    // only parts about as close as the nearest one pull on this vertex, so
    // the side of a heavy torso doesn't follow an arm that hangs near it
    const own = parts[part[v]].bone;
    for (let i = 0; i < parts.length; i++) {
      if (ds[i] > near + 0.05) continue;
      const b = parts[i].bone;
      if (parent && b !== own && parent[b] !== own && parent[own] !== b) continue;
      const e = Math.max(ds[i], 0) + 0.012;
      wb[parts[i].bone] += 1 / (e * e * e * e);
    }
    // the four strongest bones
    let sum = 0;
    for (let k = 0; k < 4; k++) {
      let bi = 0;
      for (let b = 1; b < nb; b++) if (wb[b] > wb[bi]) bi = b;
      if (wb[bi] <= 0) break;
      skinIndex[v * 4 + k] = bi;
      skinWeight[v * 4 + k] = wb[bi];
      sum += wb[bi];
      wb[bi] = -1;
    }
    for (let k = 0; k < 4; k++) skinWeight[v * 4 + k] /= sum;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geometry.setIndex(idx);
  geometry.setAttribute("skinIndex", new THREE.BufferAttribute(skinIndex, 4));
  geometry.setAttribute("skinWeight", new THREE.BufferAttribute(skinWeight, 4));
  geometry.computeVertexNormals();
  return { geometry, part, t: tt };
}

/** Where along a part a point lies, 0 at its start and 1 at its end. */
export function alongPart(p: THREE.Vector3, c: Part) {
  return capsule([p.x, p.y, p.z], c).t;
}

/**
 * Colours the body and splits it into skin and cloth (so each gets its own
 * sheen). `paint` gives the colour at any point. Triangles that straddle a
 * hem, cuff or belt are cut along it, so clothes end in clean lines rather
 * than following the mesh's triangles.
 */
export function dressBody(shape: BodyShape, paint: (v: number, p: THREE.Vector3) => { color: number; skin: boolean; puff?: number }) {
  const src = shape.geometry;
  const P = src.getAttribute("position") as THREE.BufferAttribute;
  const N = src.getAttribute("normal") as THREE.BufferAttribute;
  const SI = src.getAttribute("skinIndex") as THREE.BufferAttribute;
  const SW = src.getAttribute("skinWeight") as THREE.BufferAttribute;
  const n0 = P.count;
  const pos: number[] = Array.from(P.array as Float32Array);
  const nrm: number[] = Array.from(N.array as Float32Array);
  const si: number[] = Array.from(SI.array as Uint16Array);
  const sw: number[] = Array.from(SW.array as Float32Array);
  const color = new Int32Array(n0);
  const bare = new Uint8Array(n0);
  const p = new THREE.Vector3();
  // `puff` moves a vertex out along its normal: loose clothes. It must depend on the
  // position only (never on the colour), so the two sides of a cut get the same value.
  const vPuff: number[] = [];
  for (let v = 0; v < n0; v++) {
    const r = paint(v, p.fromBufferAttribute(P, v));
    color[v] = r.color;
    bare[v] = r.skin ? 1 : 0;
    vPuff.push(r.puff ?? 0);
  }
  const vColor: number[] = Array.from(color);
  const vBare: number[] = Array.from(bare);
  const q = new THREE.Vector3();
  const a3 = new THREE.Vector3();
  const b3 = new THREE.Vector3();
  const weights = new Map<number, number>();
  /** A new vertex part way from u to w, coloured like `like`. */
  const between = (u: number, w: number, t: number, like: number) => {
    const k = pos.length / 3;
    for (let e = 0; e < 3; e++) {
      pos.push(pos[u * 3 + e] + (pos[w * 3 + e] - pos[u * 3 + e]) * t);
      nrm.push(nrm[u * 3 + e] + (nrm[w * 3 + e] - nrm[u * 3 + e]) * t);
    }
    weights.clear();
    for (let j = 0; j < 4; j++) {
      weights.set(si[u * 4 + j], (weights.get(si[u * 4 + j]) ?? 0) + sw[u * 4 + j] * (1 - t));
      weights.set(si[w * 4 + j], (weights.get(si[w * 4 + j]) ?? 0) + sw[w * 4 + j] * t);
    }
    const top = [...weights.entries()].sort((x, y) => y[1] - x[1]).slice(0, 4);
    const sum = top.reduce((acc, [, x]) => acc + x, 0) || 1;
    for (let j = 0; j < 4; j++) {
      si.push(top[j]?.[0] ?? 0);
      sw.push((top[j]?.[1] ?? 0) / sum);
    }
    vColor.push(vColor[like]);
    vBare.push(vBare[like]);
    vPuff.push(paint(like, q.set(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2])).puff ?? 0);
    return k;
  };
  // where along u→w the colour changes, found by halving
  const cuts = new Map<number, [number, number]>(); // edge → [vertex on u's side, vertex on w's side]
  const cut = (u: number, w: number) => {
    const key = u < w ? u * n0 + w : w * n0 + u;
    const hit = cuts.get(key);
    if (hit) return u < w ? hit : [hit[1], hit[0]];
    a3.set(pos[u * 3], pos[u * 3 + 1], pos[u * 3 + 2]);
    b3.set(pos[w * 3], pos[w * 3 + 1], pos[w * 3 + 2]);
    let lo = 0, hi = 1;
    for (let it = 0; it < 7; it++) {
      const mid = (lo + hi) / 2;
      if (paint(u, q.lerpVectors(a3, b3, mid)).color === color[u]) lo = mid;
      else hi = mid;
    }
    const t = (lo + hi) / 2;
    const pair: [number, number] = [between(u, w, t, u), between(u, w, t, w)];
    cuts.set(key, u < w ? pair : [pair[1], pair[0]]);
    return pair;
  };
  const src3 = src.getIndex()!.array;
  const tris: number[] = [];
  for (let i = 0; i < src3.length; i += 3) {
    let [a, b, c] = [src3[i], src3[i + 1], src3[i + 2]];
    const ca = color[a], cb = color[b], cc = color[c];
    if (ca === cb && cb === cc) {
      tris.push(a, b, c);
      continue;
    }
    if (ca !== cb && cb !== cc && ca !== cc) {
      tris.push(a, b, c); // three colours meet: rare, left as it is
      continue;
    }
    // turn the triangle so `a` is the odd one out, keeping the winding
    if (cb !== ca && cb !== cc) [a, b, c] = [b, c, a];
    else if (cc !== ca && cc !== cb) [a, b, c] = [c, a, b];
    const [ab, ba] = cut(a, b);
    const [ac, ca2] = cut(a, c);
    tris.push(a, ab, ac);
    tris.push(ba, b, c, ba, c, ca2);
  }
  for (let v = 0; v < vPuff.length; v++) {
    const k = vPuff[v];
    if (!k) continue;
    const nx = nrm[v * 3], ny = nrm[v * 3 + 1], nz = nrm[v * 3 + 2];
    const l = Math.hypot(nx, ny, nz) || 1;
    pos[v * 3] += (nx / l) * k;
    pos[v * 3 + 1] += (ny / l) * k;
    pos[v * 3 + 2] += (nz / l) * k;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute("skinWeight", new THREE.Float32BufferAttribute(sw, 4));
  const col = new Float32Array(vColor.length * 3);
  const cl = new THREE.Color();
  vColor.forEach((hex, v) => {
    cl.setHex(hex); // turned linear by three's colour management
    col[v * 3] = cl.r;
    col[v * 3 + 1] = cl.g;
    col[v * 3 + 2] = cl.b;
  });
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const skin: number[] = [];
  const cloth: number[] = [];
  for (let t = 0; t < tris.length; t += 3) {
    const sb = vBare[tris[t]] + vBare[tris[t + 1]] + vBare[tris[t + 2]];
    (sb >= 2 ? skin : cloth).push(tris[t], tris[t + 1], tris[t + 2]);
  }
  g.setIndex([...cloth, ...skin]);
  g.addGroup(0, cloth.length, 0);
  g.addGroup(cloth.length, skin.length, 1);
  return g;
}

// ───────────────────────── shading ─────────────────────────
/**
 * The console's avatar look: soft, low-contrast light that never goes dark on
 * the shadow side, and a pale rim where the surface turns away (the bright
 * dashboard behind the avatar wrapping round its edges). Cheap: a few lines
 * added to the standard shader, one program shared by every avatar material.
 */
export function softShade<T extends THREE.MeshStandardMaterial>(m: T, rim = 0.42): T {
  m.onBeforeCompile = (sh) => {
    sh.uniforms.rimK = { value: rim };
    sh.fragmentShader = "uniform float rimK;\n" + sh.fragmentShader.replace(
      "#include <opaque_fragment>",
      `{
        float facing = clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0);
        // lift the shadow side towards the plain colour, like the console's wrapped lighting
        outgoingLight = mix(outgoingLight, diffuseColor.rgb * 0.92, 0.18);
        outgoingLight += (diffuseColor.rgb * 0.55 + 0.25) * rimK * pow(1.0 - facing, 2.6);
      }
      #include <opaque_fragment>`,
    );
  };
  m.customProgramCacheKey = () => `dht-avatar-soft-${rim}`;
  return m;
}

// ───────────────────────── painted face ─────────────────────────
export type FaceLook = {
  skin: number; hair: number; brow: number; iris: number;
  eyes: number; brows: number; mouth: number; facialHair: number; hairline: "full" | "balding" | "bald" | "short";
};
export type FaceMap = { a: number; b: number; jaw: number };
export type Hairline = FaceLook["hairline"];

/** The head outline's radius at polar angle th (0 chin, π crown): the same curve as the head lathe. */
export function headRadius(shape: FaceMap, th: number) {
  const s = Math.sin(th);
  const narrow = th < Math.PI / 2 ? shape.jaw + (1 - shape.jaw) * Math.pow(s, 1.6) : 1;
  return Math.max(0.0001, shape.b * s * narrow);
}

/**
 * Height of the hairline round the head (phi 0 = front, ±π = back), in head
 * units. The painted scalp and the hair shell both follow it, so the shell's
 * edge always lands on painted hair and no skin shows through.
 */
export function hairlineY(kind: Hairline, phi: number) {
  const front = kind === "balding" ? 0.36 : 0.255;
  const back = kind === "short" ? -0.12 : -0.2;
  const facing = (1 + Math.cos(phi)) / 2;
  // temples dip lower at the sides, then the line drops to the nape
  const temple = Math.exp(-Math.pow((Math.abs(phi) - 1.2) / 0.3, 2)) * 0.07;
  return back + (front - back) * Math.pow(facing, 0.6) - temple;
}

/**
 * The hair as one shell over the scalp: it starts on the hairline (a little
 * lower, `drop`), tucks in to the scalp at its edge so it never shows a gap,
 * and swells by `grow` plus `crown` towards the top. `shape(phi, s)` can add
 * more swell anywhere (s 0 at the hairline, 1 at the crown).
 */
export function hairShell(
  face: FaceMap,
  kind: Hairline,
  opt: { grow?: number; crown?: number; drop?: number; shape?: (phi: number, s: number) => number; ball?: { c: V3; r: number; ramp: number }; cols?: number; rows?: number } = {},
) {
  const { grow = 1.045, crown = 0.03, drop = 0.012, shape, ball, cols = 48, rows = 16 } = opt;
  const pos: number[] = [];
  const idx: number[] = [];
  const R = rows + 2; // two rows of lip: on the scalp, then out to the shell
  for (let c = 0; c <= cols; c++) {
    const phi = -Math.PI + (c / cols) * Math.PI * 2;
    const y0 = hairlineY(kind, phi) - drop;
    const th0 = Math.acos(Math.max(-1, Math.min(1, -y0 / face.a)));
    for (let r = 0; r < R; r++) {
      const s = r < 2 ? 0 : (r - 2) / (rows - 1);
      const th = th0 + (Math.PI - th0) * (1 - Math.pow(1 - s, 1.35));
      let k = r === 0 ? 0.985 : grow + crown * Math.pow(s, 1.3) + (shape ? shape(phi, s) : 0);
      const r0 = headRadius(face, th);
      const px = r0 * Math.sin(phi), py = -face.a * Math.cos(th), pz = r0 * Math.cos(phi);
      if (ball && r > 0) {
        // out along the head's own direction until it meets the ball: |k·p − c| = r
        const pp = px * px + py * py + pz * pz;
        const pc = px * ball.c[0] + py * ball.c[1] + pz * ball.c[2];
        const cc = ball.c[0] ** 2 + ball.c[1] ** 2 + ball.c[2] ** 2;
        const disc = pc * pc - pp * (cc - ball.r * ball.r);
        if (disc > 0) {
          const kb = (pc + Math.sqrt(disc)) / pp;
          const e = Math.min(1, s / ball.ramp);
          k = Math.max(k, k + (kb - k) * e * e * (3 - 2 * e));
        }
      }
      if (r === 0) pos.push(px * k, py * 0.995, pz * k);
      else pos.push(px * k, py * k, pz * k);
    }
  }
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < R - 1; r++) {
      const a = c * R + r, b = (c + 1) * R + r;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * The head is a lathe whose seam sits at the back, so u 0.5 faces forward and v
 * runs chin (0) to crown (1). `toUV` turns a point on the face (x across,
 * y up from the head's centre) into canvas pixels.
 */
export function paintFace(look: FaceLook, shape: FaceMap, closed: boolean): HTMLCanvasElement {
  const W = 1024, H = 512;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  const hex = (n: number) => "#" + n.toString(16).padStart(6, "0");
  const shade = (n: number, f: number) => {
    const c = new THREE.Color(n);
    c.multiplyScalar(f);
    return "#" + c.getHexString();
  };
  // head outline radius at height y, same as the lathe
  const radiusAt = (y: number) => {
    const th = Math.acos(Math.max(-1, Math.min(1, -y / shape.a)));
    return { th, r: headRadius(shape, th) };
  };
  const toUV = (x: number, y: number): [number, number] => {
    const { th, r } = radiusAt(y);
    const phi = Math.asin(Math.max(-1, Math.min(1, x / r)));
    return [(0.5 + phi / (Math.PI * 2)) * W, (1 - th / Math.PI) * H];
  };
  const PX = 460; // pixels per unit near the middle of the face
  g.fillStyle = hex(look.skin);
  g.fillRect(0, 0, W, H);

  // soft cheeks and a little shading under the brow, like the console's baked faces
  const blob = (x: number, y: number, r: number, color: string) => {
    const [u, v] = toUV(x, y);
    const gr = g.createRadialGradient(u, v, 0, u, v, r * PX);
    gr.addColorStop(0, color);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(u - r * PX, v - r * PX, r * PX * 2, r * PX * 2);
  };
  for (const side of [-1, 1]) blob(side * 0.17, -0.07, 0.09, "rgba(220,90,80,0.08)");

  // hair painted onto the scalp so no skin shows through the hair pieces
  if (look.hairline !== "bald") {
    g.fillStyle = hex(look.hair);
    g.beginPath();
    for (let i = 0; i <= 128; i++) {
      const u = i / 128;
      const phi = (u - 0.5) * Math.PI * 2; // 0 = front
      const y = hairlineY(look.hairline, phi);
      const th = Math.acos(Math.max(-1, Math.min(1, -y / shape.a)));
      const v = (1 - th / Math.PI) * H;
      if (i === 0) g.moveTo(u * W, v);
      else g.lineTo(u * W, v);
    }
    g.lineTo(W, 0);
    g.lineTo(0, 0);
    g.closePath();
    if (look.hairline === "balding") {
      // a fringe round the sides and back only
      g.save();
      g.clip();
      g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = "destination-out";
      const [u0, v0] = toUV(0, shape.a * 0.92);
      g.beginPath();
      g.ellipse(u0, v0 - 10, W * 0.16, H * 0.22, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    } else g.fill();
  }

  // stubble
  if (look.facialHair === 1) {
    g.save();
    g.globalAlpha = 0.28;
    g.fillStyle = hex(look.hair);
    g.beginPath();
    for (let i = 0; i <= 40; i++) {
      const x = -0.3 + (0.6 * i) / 40;
      const [u, v] = toUV(x, -0.1 + Math.abs(x) * 0.25);
      if (i === 0) g.moveTo(u, v);
      else g.lineTo(u, v);
    }
    g.lineTo(...toUV(0.3, -shape.a));
    g.lineTo(...toUV(-0.3, -shape.a));
    g.closePath();
    g.fill();
    g.restore();
  }

  // a full beard: painted up the cheeks to the sideburns, round an opening for the mouth
  if (look.facialHair === 6 || look.facialHair === 7) {
    const at = (fx: number, y: number) => toUV(fx * radiusAt(y).r * 0.999, y);
    g.save();
    g.fillStyle = hex(look.hair);
    g.beginPath();
    const edge: [number, number][] = [[-1, 0.05], [-0.93, -0.02], [-0.78, -0.08], [-0.55, -0.12], [-0.38, -0.115], [-0.2, -0.105], [0, -0.1]];
    const pts = [...edge, ...edge.slice(0, -1).reverse().map(([x, y]) => [-x, y] as [number, number])];
    pts.forEach(([x, y], i) => (i ? g.lineTo(...at(x, y)) : g.moveTo(...at(x, y))));
    g.lineTo(toUV(0, -shape.a)[0] + W * 0.25, H);
    g.lineTo(toUV(0, -shape.a)[0] - W * 0.25, H);
    g.closePath();
    g.fill();
    // the mouth shows through
    const [mu, mv] = toUV(0, -0.172);
    g.fillStyle = hex(look.skin);
    g.beginPath();
    g.ellipse(mu, mv, 0.085 * PX, 0.032 * PX, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  // eyes: width, height, lid cover, lashes
  const eye = [
    { w: 0.105, h: 0.095, lid: 0, lash: 0 },
    { w: 0.115, h: 0.07, lid: 0, lash: 0 },
    { w: 0.12, h: 0.1, lid: 0, lash: 0 },
    { w: 0.11, h: 0.055, lid: 0, lash: 0 },
    { w: 0.105, h: 0.09, lid: 0.45, lash: 0 },
    { w: 0.11, h: 0.105, lid: 0, lash: 0 },
    { w: 0.12, h: 0.05, lid: 0.1, lash: 0 },
    { w: 0.105, h: 0.09, lid: 0, lash: 1 },
  ][look.eyes];
  for (const side of [-1, 1]) {
    // the console's eyes are big and set wide, a little above the head's middle
    const [u, v] = toUV(side * 0.137, 0.03);
    const w = (eye.w / 2) * PX * 1.08, h = (eye.h / 2) * PX * 0.98;
    g.save();
    g.translate(u, v);
    if (closed) {
      g.strokeStyle = shade(look.skin, 0.45);
      g.lineWidth = 4;
      g.beginPath();
      g.moveTo(-w, 2);
      g.quadraticCurveTo(0, h * 0.55, w, 2);
      g.stroke();
      g.restore();
      continue;
    }
    // almond white, slightly tilted up at the outer corner
    g.rotate(-side * 0.06);
    const outline = () => {
      g.beginPath();
      g.moveTo(-w, 0);
      g.bezierCurveTo(-w * 0.6, -h * 1.25, w * 0.6, -h * 1.25, w, 0);
      g.bezierCurveTo(w * 0.6, h * 1.15, -w * 0.6, h * 1.15, -w, 0);
      g.closePath();
    };
    outline();
    g.fillStyle = "#fbfbfb";
    g.fill();
    g.save();
    outline();
    g.clip();
    const ir = Math.min(w, h * 1.15) * 0.82;
    const gr = g.createRadialGradient(0, -ir * 0.15, ir * 0.2, 0, 0, ir);
    gr.addColorStop(0, shade(look.iris, 1.35));
    gr.addColorStop(1, shade(look.iris, 0.7));
    g.fillStyle = gr;
    g.beginPath();
    g.arc(0, h * 0.05, ir, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#111";
    g.beginPath();
    g.arc(0, h * 0.05, ir * 0.45, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(255,255,255,.9)";
    g.beginPath();
    g.arc(-ir * 0.32, -ir * 0.3, ir * 0.2, 0, Math.PI * 2);
    g.fill();
    // upper lid shadow and the sleepy lid
    g.fillStyle = "rgba(60,30,20,.18)";
    g.fillRect(-w, -h * 1.3, w * 2, h * 0.55);
    if (eye.lid) {
      g.fillStyle = shade(look.skin, 0.92);
      g.fillRect(-w, -h * 1.3, w * 2, h * (0.3 + eye.lid * 1.6));
    }
    g.restore();
    // upper lid line, heavier at the outer corner
    g.strokeStyle = "#2a1a14";
    g.lineWidth = eye.lash ? 6 : 3.5;
    g.lineCap = "round";
    g.beginPath();
    const lidY = eye.lid ? -h * 1.25 + h * (0.3 + eye.lid * 1.6) : 0;
    if (eye.lid) {
      g.moveTo(-w, lidY * 0.4);
      g.quadraticCurveTo(0, lidY - 2, w, lidY * 0.4);
    } else {
      g.moveTo(-w, 0);
      g.bezierCurveTo(-w * 0.6, -h * 1.25, w * 0.6, -h * 1.25, w, 0);
    }
    g.stroke();
    if (eye.lash) {
      g.lineWidth = 3;
      for (const k of [0.55, 0.8, 1]) {
        g.beginPath();
        g.moveTo(side * w * k * 0.95, -h * (1 - k) * 0.9 - 2);
        g.lineTo(side * (w * k + 8), -h * (1 - k) * 0.9 - 10);
        g.stroke();
      }
    }
    g.restore();
  }

  // eyebrows: thickness, outer tilt, arch
  if (look.brows !== 7) {
    const br = [
      { t: 0.03, tilt: 0.02, arch: 0.012 },
      { t: 0.016, tilt: 0.02, arch: 0.012 },
      { t: 0.045, tilt: 0.01, arch: 0.008 },
      { t: 0.026, tilt: 0.01, arch: 0.035 },
      { t: 0.032, tilt: 0.05, arch: -0.004 },
      { t: 0.028, tilt: -0.05, arch: 0.004 },
      { t: 0.03, tilt: 0, arch: 0 },
    ][look.brows];
    g.fillStyle = hex(look.brow);
    for (const side of [-1, 1]) {
      const inner = 0.05, outer = 0.225, y = 0.142;
      g.beginPath();
      const steps = 16;
      const at = (k: number, off: number) => {
        const x = inner + (outer - inner) * k;
        const yy = y + Math.sin(Math.PI * k) * br.arch + (k - 0.5) * br.tilt + off;
        return toUV(side * x, yy);
      };
      for (let i = 0; i <= steps; i++) {
        const k = i / steps;
        const th = br.t * 1.2 * (1 - k * 0.55);
        const [u, v] = at(k, th / 2);
        if (i === 0) g.moveTo(u, v);
        else g.lineTo(u, v);
      }
      for (let i = steps; i >= 0; i--) {
        const k = i / steps;
        const th = br.t * 1.2 * (1 - k * 0.55);
        const [u, v] = at(k, -th / 2);
        g.lineTo(u, v);
      }
      g.closePath();
      g.fill();
    }
  }

  // mouth
  const lip = shade(look.skin, 0.62);
  const [mu, mv] = toUV(0, -0.17);
  g.save();
  g.translate(mu, mv);
  g.lineCap = "round";
  const smile = (w: number, curve: number, width = 5, tilt = 0) => {
    g.save();
    g.rotate(tilt);
    g.strokeStyle = shade(look.skin, 0.45);
    g.lineWidth = width;
    g.beginPath();
    g.moveTo(-w * PX, 0);
    g.quadraticCurveTo(0, curve * PX, w * PX, 0);
    g.stroke();
    g.restore();
  };
  const open = (w: number, top: number, bottom: number, teeth: boolean) => {
    g.beginPath();
    g.moveTo(-w * PX, 0);
    g.quadraticCurveTo(0, top * PX, w * PX, 0);
    g.quadraticCurveTo(0, bottom * PX, -w * PX, 0);
    g.closePath();
    g.fillStyle = "#4a1a1a";
    g.fill();
    if (teeth) {
      g.save();
      g.clip();
      g.fillStyle = "#fafafa";
      g.fillRect(-w * PX, top * PX - 4, w * 2 * PX, (bottom - top) * PX * 0.42 + 4);
      g.restore();
    }
    g.strokeStyle = lip;
    g.lineWidth = 3;
    g.stroke();
  };
  switch (look.mouth) {
    case 0: smile(0.075, 0.035); break;
    case 1: open(0.085, 0.004, 0.06, true); break;
    case 2: smile(0.06, 0.03, 5, -0.25); break;
    case 3: smile(0.065, 0.002); break;
    case 4: smile(0.06, -0.03); break;
    case 5: open(0.095, -0.01, 0.07, true); break;
    case 6: smile(0.045, 0.02, 4.5); break;
    default: open(0.05, -0.04, 0.05, false);
  }
  // lower lip hint
  if (look.mouth !== 7) {
    g.strokeStyle = "rgba(120,40,40,.18)";
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(-0.035 * PX, 0.05 * PX);
    g.quadraticCurveTo(0, 0.065 * PX, 0.035 * PX, 0.05 * PX);
    g.stroke();
  }
  g.restore();
  return cv;
}
