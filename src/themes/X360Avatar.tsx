// Xbox 360-style avatars for the NXE and Kinect dashboards. The console drew
// avatars live with its own engine, so there is no model in the dashboard
// archive; these are our own: one smooth skinned body on a small skeleton,
// a lathe head with a painted face, in the console's proportions, with the
// creator's choices from 2008: body
// type, height and build, skin, face shape, hairstyle and colour, eyes,
// eyebrows, nose, mouth, ears, facial hair, and tops, bottoms and shoes.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { alongPart, BodyShape, buildBodyShape, dressBody, Group, hairShell, paintFace, Part, softShade } from "./X360AvatarMesh";
import { modelKey } from "./modelKey";

// ───────────────────────── choices ─────────────────────────
export const SKIN_COLORS = [0xf8dcc4, 0xf2c9a5, 0xe9b98f, 0xe0ac85, 0xcf9a6c, 0xc68a5f, 0xa8704a, 0x9a6440, 0x7a4c2e, 0x5a3620];
export const HAIR_COLORS = [0x1d1a18, 0x3b2416, 0x5a3a22, 0x6b4423, 0x8a5a2e, 0xb98a4a, 0xd9b36a, 0xe8d39a, 0x8a3b1c, 0xb5502a, 0x9a9a9a, 0xe6e6e6];
export const EYE_COLORS = [0x4a3020, 0x6b4a2a, 0x2e5a8a, 0x4a8ac0, 0x3f6b33, 0x6a8a4a, 0x555555, 0x7a5aa0];
export const CLOTH_COLORS = [0xf0f0f0, 0x2b2b2b, 0x6bb120, 0x2f6fc4, 0x1f3a6b, 0xd23a2a, 0x8a1e2e, 0xf2a01e, 0x7a3fb0, 0xc85aa0, 0x6b5a45, 0x3a5c8c];

export const OPTIONS = {
  body: ["Male", "Female"],
  height: ["Shortest", "Shorter", "Average", "Taller", "Tallest"],
  build: ["Slim", "Average", "Broad", "Heavy"],
  face: ["Oval", "Round", "Long", "Square", "Heart"],
  hair: ["Short", "Buzz Cut", "Flat Top", "Spiky", "Pompadour", "Swept Back", "Bob", "Long", "Ponytail", "Mohawk", "Balding", "Bald", "Afro", "Curly Top"],
  eyes: ["Round", "Almond", "Wide", "Narrow", "Sleepy", "Rounded", "Slender", "Thick Lashed"],
  brows: ["Natural", "Thin", "Thick", "Arched", "Angry", "Worried", "Straight", "None"],
  nose: ["Button", "Small", "Long", "Wide", "Pointed", "Round", "Hooked"],
  mouth: ["Smile", "Grin", "Cheeky", "Flat", "Unhappy", "Toothy", "Small", "Open"],
  ears: ["Round", "Small", "Big", "Pointy", "Fantasy"],
  facialHair: ["None", "Stubble", "Moustache", "Round Moustache", "Goatee", "Chin Strap", "Full Beard", "Long Beard"],
  top: ["T-Shirt", "Long Sleeve", "Hoodie", "Jacket", "Tank Top", "Polo"],
  bottom: ["Jeans", "Trousers", "Shorts", "Cargo Shorts", "Skirt", "Long Skirt"],
  shoes: ["Sneakers", "High Tops", "Boots", "Dress Shoes"],
} as const;

export type AvatarSpec = {
  body: number; height: number; build: number; skin: number; face: number;
  hair: number; hairColor: number; eyes: number; eyeColor: number; brows: number;
  nose: number; mouth: number; ears: number; facialHair: number;
  top: number; topColor: number; top2Color: number; bottom: number; bottomColor: number; shoes: number; shoeColor: number;
};
type Key = keyof AvatarSpec;
// how many choices each field has
export const RANGE: Record<Key, number> = {
  body: 2, height: 5, build: 4, skin: SKIN_COLORS.length, face: 5, hair: OPTIONS.hair.length, hairColor: HAIR_COLORS.length,
  eyes: OPTIONS.eyes.length, eyeColor: EYE_COLORS.length, brows: OPTIONS.brows.length, nose: OPTIONS.nose.length, mouth: OPTIONS.mouth.length,
  ears: OPTIONS.ears.length, facialHair: OPTIONS.facialHair.length, top: OPTIONS.top.length, topColor: CLOTH_COLORS.length,
  top2Color: CLOTH_COLORS.length, bottom: OPTIONS.bottom.length, bottomColor: CLOTH_COLORS.length, shoes: OPTIONS.shoes.length, shoeColor: CLOTH_COLORS.length,
};
const KEYS = Object.keys(RANGE) as Key[];

/** A random avatar; `rng` returns 0…1. Women get longer hair and no beard more often, like the console's starting line-up. */
export function randomAvatar(rng: () => number = Math.random): AvatarSpec {
  const n = (k: Key) => Math.floor(rng() * RANGE[k]);
  const body = n("body");
  const fem = body === 1;
  const pick = (a: number[]) => a[Math.floor(rng() * a.length)];
  return {
    body, height: pick([1, 2, 2, 3]), build: pick([0, 1, 1, 2]), skin: n("skin"), face: n("face"),
    hair: fem ? pick([0, 5, 6, 7, 7, 8, 13]) : pick([0, 0, 1, 2, 3, 4, 5, 10, 11, 12, 13]),
    hairColor: pick([0, 1, 2, 3, 4, 5, 6, 8, 9, ...(rng() < 0.15 ? [10, 11] : [])]),
    eyes: n("eyes"), eyeColor: n("eyeColor"), brows: pick([0, 0, 1, 2, 3, 6]), nose: n("nose"), mouth: pick([0, 0, 1, 1, 2, 5, 6]),
    ears: pick([0, 0, 1, 2]), facialHair: fem || rng() < 0.55 ? 0 : pick([1, 2, 3, 4, 5, 6, 7]),
    top: pick([0, 0, 1, 2, 3, 5]), topColor: n("topColor"), top2Color: n("top2Color"),
    bottom: fem ? pick([0, 1, 2, 4, 5]) : pick([0, 0, 1, 2, 3]), bottomColor: pick([11, 11, 1, 4, 10, 0]), shoes: pick([0, 0, 1, 2, 3]), shoeColor: pick([0, 0, 1, 5, 3, 10]),
  };
}

/** The avatar a name gets before its owner has made one. */
export function avatarForName(name: string): AvatarSpec {
  let h = 2166136261;
  for (const c of name || "Player") h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return randomAvatar(() => ((h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0), h / 4294967296));
}

/** A saved avatar with every field checked, or undefined. */
export function normalizeAvatar(raw: unknown): AvatarSpec | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out = {} as AvatarSpec;
  for (const k of KEYS) {
    const v = r[k];
    if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v >= RANGE[k]) return undefined;
    out[k] = v;
  }
  return out;
}

// ───────────────────────── model ─────────────────────────
// Proportions follow the console's avatars (measured on NXE/Kinect captures):
// about 3.8 heads tall, crotch a little under half the height, a short thick
// neck, broad shoulders, arms reaching the upper thigh and big hands.
/** How much bigger than the face outlines below the head is drawn. */
const HEAD = 1.06;
function dims(s: AvatarSpec) {
  const hF = [0.88, 0.94, 1, 1.06, 1.12][s.height];
  const wF = [0.86, 1, 1.14, 1.32][s.build];
  const ankle = 0.2;
  const knee = ankle + 0.62 * hF;
  const hip = knee + 0.64 * hF;
  const torso = 0.74 * hF;
  const shoulder = hip + torso;
  const head = shoulder + 0.15 + 0.39 * HEAD;
  return { hF, wF, ankle, knee, hip, torso, shoulder, head, top: head + 0.44 * HEAD };
}
export function avatarHeadY(s: AvatarSpec) {
  return dims(s).head;
}

// head outline per face shape: half height, radius, how narrow the chin is
const FACE = [
  { a: 0.39, b: 0.335, jaw: 0.76 },
  { a: 0.36, b: 0.35, jaw: 0.9 },
  { a: 0.42, b: 0.32, jaw: 0.74 },
  { a: 0.38, b: 0.34, jaw: 0.96 },
  { a: 0.39, b: 0.34, jaw: 0.6 },
];
/** Points up the head's outline, θ from 0 (chin) to π (crown), between fractions `from` and `to`, grown by `grow`. */
function headLine(face: number, from = 0, to = 1, grow = 1) {
  const f = FACE[face];
  const pts: THREE.Vector2[] = [];
  const n = 28;
  for (let i = 0; i <= n; i++) {
    const th = Math.PI * (from + ((to - from) * i) / n);
    const s = Math.sin(th);
    const narrow = th < Math.PI / 2 ? f.jaw + (1 - f.jaw) * Math.pow(s, 1.6) : 1;
    pts.push(new THREE.Vector2(Math.max(0.0001, f.b * grow * s * narrow), -f.a * grow * Math.cos(th)));
  }
  return pts;
}

export type AvatarRig = {
  root: THREE.Group; hips: THREE.Object3D; chest: THREE.Object3D; head: THREE.Object3D;
  arms: THREE.Object3D[]; elbows: THREE.Object3D[]; legs: THREE.Object3D[]; knees: THREE.Object3D[];
  blink: (closed: boolean) => void;
  /** hip height at rest, and hip-to-ankle length (to keep the feet planted while the hips sway) */
  hipY: number; legLen: number;
};

// bones, in skin-index order
const B = { root: 0, hips: 1, chest: 2, head: 3, armL: 4, elbowL: 5, armR: 6, elbowR: 7, legL: 8, kneeL: 9, legR: 10, kneeR: 11 };
type Region = "waist" | "chest" | "pelvis" | "neck" | "shoulder" | "bust" | "upper" | "fore" | "hand" | "thigh" | "shin";
const REGIONS: Region[] = ["waist", "chest", "pelvis", "neck", "shoulder", "bust", "upper", "fore", "hand", "thigh", "shin"];

// The body surface is built and bound with the arms held out (an A pose) and
// the legs a little apart, the way rigged characters are modelled: arms that
// hang against the torso would be fused to it by the blend and drag the
// torso's side along (long stretched triangles) whenever they lift.
const BIND_ARM = 0.78;
const BIND_LEG = 0.07;
/** Arm angle at rest (outwards from hanging straight down). */
export const REST_ARM = 0.25;
/** Feet a little apart and knees a touch in, the console's stance. */
const STANCE = 0.065;
const KNOCK = 0.04;

/** The skeleton, in the bind pose or at rest; the same for every avatar of one body type, height and build. */
function skeleton(s: AvatarSpec, bind = false) {
  const { hF, wF, ankle, knee, hip, shoulder } = dims(s);
  const fem = s.body === 1;
  const bones = Array.from({ length: 12 }, () => new THREE.Bone());
  const at = (b: number, parent: number | null, p: number[], r: number[] = [0, 0, 0]) => {
    bones[b].position.set(p[0], p[1], p[2]);
    bones[b].rotation.set(r[0], r[1], r[2]);
    if (parent !== null) bones[parent].add(bones[b]);
  };
  const shX = (fem ? 0.32 : 0.375) * Math.sqrt(wF);
  const up = 0.54 * hF;
  const fore = 0.44 * hF;
  at(B.root, null, [0, 0, 0]);
  at(B.hips, B.root, [0, hip, 0]);
  at(B.chest, B.hips, [0, 0.1, 0]);
  at(B.head, B.chest, [0, shoulder + 0.08 - hip - 0.1, 0]);
  for (const [arm, elbow, side] of [[B.armL, B.elbowL, -1], [B.armR, B.elbowR, 1]]) {
    at(arm, B.chest, [side * shX, shoulder - 0.09 - hip - 0.1, 0], [0, 0, side * (bind ? BIND_ARM : REST_ARM)]);
    at(elbow, arm, [0, -up, 0], [bind ? 0 : -0.18, 0, 0]);
  }
  const legX = (fem ? 0.15 : 0.155) * wF;
  for (const [leg, kn, side] of [[B.legL, B.kneeL, -1], [B.legR, B.kneeR, 1]]) {
    at(leg, B.hips, [side * legX, -0.06, 0], [0, 0, bind ? side * BIND_LEG : 0]);
    at(kn, leg, [0, -(hip - 0.06 - knee), 0]);
  }
  bones[B.root].updateMatrixWorld(true);
  return { bones, up, fore, shin: knee - ankle, shX, fem };
}

const shapes = new Map<string, BodyShape>();
/** The blended body surface for this body type, height and build (cached; clothes only recolour it). */
function bodyShape(s: AvatarSpec) {
  const key = `${s.body}:${s.height}:${s.build}`;
  let shape = shapes.get(key);
  if (shape) return shape;
  const { wF, hip, shoulder } = dims(s);
  const { bones, up, fore, shin, shX, fem } = skeleton(s, true);
  const w = (b: number, local: number[] = [0, 0, 0]): [number, number, number] => {
    const v = new THREE.Vector3(local[0], local[1], local[2]).applyMatrix4(bones[b].matrixWorld);
    return [v.x, v.y, v.z];
  };
  const parts: Part[] = [];
  const part = (region: Region, bone: number, a: [number, number, number], b: [number, number, number], ra: number, rb: number, flat?: [number, number]) =>
    parts.push({ a, b, ra, rb, bone, region: REGIONS.indexOf(region), flat }) - 1;
  // torso: waist up into a broad, square-ish chest with rounded shoulders and a short thick neck
  const sw = Math.sqrt(wF); // shoulders and arms grow slower than the belly
  const torso = [
    part("waist", B.chest, [0, hip + 0.06, 0], [0, shoulder - 0.3, 0], (fem ? 0.195 : 0.215) * wF, (fem ? 0.2 : 0.24) * wF, [1, 0.76]),
    part("chest", B.chest, [-shX * 0.55, shoulder - 0.16, -0.005], [shX * 0.55, shoulder - 0.16, -0.005], (fem ? 0.12 : 0.14) * sw, (fem ? 0.12 : 0.14) * sw, [1, 0.88]),
    part("pelvis", B.hips, [-0.08 * wF, hip - 0.01, 0], [0.08 * wF, hip - 0.01, 0], (fem ? 0.19 : 0.165) * wF, (fem ? 0.19 : 0.165) * wF, [1, 0.8]),
    part("neck", B.chest, [0, shoulder - 0.12, -0.015], [0, shoulder + 0.22, -0.015], fem ? 0.066 : 0.078, fem ? 0.06 : 0.07),
    part("shoulder", B.chest, w(B.armL, [0.02, 0.0, 0]), w(B.armL, [0.02, 0.0, 0]), 0.088 * sw, 0.088 * sw),
    part("shoulder", B.chest, w(B.armR, [-0.02, 0.0, 0]), w(B.armR, [-0.02, 0.0, 0]), 0.088 * sw, 0.088 * sw),
  ];
  if (fem) for (const side of [-1, 1]) torso.push(part("bust", B.chest, [side * 0.1 * wF, shoulder - 0.27, 0.075], [side * 0.1 * wF, shoulder - 0.29, 0.085], 0.085 * wF, 0.08 * wF));
  const groups: Group[] = [{ parts: torso, k: 0.11, join: 0 }];
  for (const [arm, elbow] of [[B.armL, B.elbowL], [B.armR, B.elbowR]]) {
    groups.push({
      parts: [
        part("upper", arm, w(arm), w(arm, [0, -up, 0]), (fem ? 0.084 : 0.096) * sw, (fem ? 0.068 : 0.078) * sw),
        part("fore", elbow, w(elbow), w(elbow, [0, -fore, 0]), (fem ? 0.066 : 0.075) * sw, (fem ? 0.052 : 0.058) * sw),
        // a big mitten palm and the thumb; the fingers are separate pieces (too thin for the body's grid)
        part("hand", elbow, w(elbow, [0, -fore - 0.045, 0.004]), w(elbow, [0, -fore - 0.1, 0.01]), 0.068, 0.064, [0.55, 1]),
        part("hand", elbow, w(elbow, [0, -fore - 0.055, 0.055]), w(elbow, [0, -fore - 0.12, 0.095]), 0.03, 0.026),
      ],
      k: 0.04,
      join: 0.03,
    });
  }
  for (const [leg, kn] of [[B.legL, B.kneeL], [B.legR, B.kneeR]]) {
    const kneeY = bones[kn].position.y;
    groups.push({
      parts: [
        part("thigh", leg, w(leg), w(leg, [0, kneeY, 0]), 0.135 * wF, 0.095 * wF),
        part("shin", kn, w(kn), w(kn, [0, -shin, 0]), 0.09 * wF, 0.07 * wF),
        part("shin", kn, w(kn, [0, -0.1, -0.02]), w(kn, [0, -0.32, -0.02]), 0.082 * wF, 0.074 * wF),
      ],
      k: 0.05,
      join: 0.06,
    });
  }
  shape = buildBodyShape(parts, groups, 0.02, bones.map((b) => bones.indexOf(b.parent as THREE.Bone)));
  (shape as BodyShape & { parts?: Part[] }).parts = parts;
  shapes.set(key, shape);
  return shape;
}

export function buildAvatar(s: AvatarSpec): AvatarRig {
  const { hF, wF, ankle, hip, torso, shoulder, head: headY } = dims(s);
  const { bones, shin, fore } = skeleton(s, true);
  const fem = s.body === 1;
  const mats = new Map<string, THREE.MeshStandardMaterial>();
  const mat = (color: number, rough = 0.75, extra?: Partial<THREE.MeshStandardMaterialParameters>) => {
    const key = `${color}:${rough}:${JSON.stringify(extra ?? {})}`;
    if (!mats.has(key)) mats.set(key, softShade(new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra })));
    return mats.get(key)!;
  };
  const skinC = SKIN_COLORS[s.skin];
  const skin = mat(skinC, 0.55);
  const hairM = mat(HAIR_COLORS[s.hairColor], 0.8);
  const topC = CLOTH_COLORS[s.topColor];
  const top2C = CLOTH_COLORS[s.top2Color];
  const botC = CLOTH_COLORS[s.bottomColor];
  const topM = mat(topC, 0.85);
  const top2M = mat(top2C, 0.85);
  const shoeM = s.shoes === 3 ? mat(CLOTH_COLORS[s.shoeColor] === 0xf0f0f0 ? 0x222222 : CLOTH_COLORS[s.shoeColor], 0.25) : mat(CLOTH_COLORS[s.shoeColor], 0.6);
  const soleM = mat(s.shoes === 0 || s.shoes === 1 ? 0xf4f4f4 : 0x2a2420, 0.7);
  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, p: number[] = [0, 0, 0], sc: number[] = [1, 1, 1], r: number[] = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(p[0], p[1], p[2]);
    mesh.scale.set(sc[0], sc[1], sc[2]);
    mesh.rotation.set(r[0], r[1], r[2]);
    parent.add(mesh);
    return mesh;
  };
  const sphere = (r: number, ws = 24, hs = 16) => new THREE.SphereGeometry(r, ws, hs);
  const limb = (r: number, len: number) => new THREE.CapsuleGeometry(r, Math.max(0.01, len), 6, 14);
  const group = (parent: THREE.Object3D, p: number[]) => {
    const g = new THREE.Group();
    g.position.set(p[0], p[1], p[2]);
    parent.add(g);
    return g;
  };

  const root = new THREE.Group();
  root.add(bones[B.root]);
  const hips = bones[B.hips];
  const chest = bones[B.chest];
  const head = bones[B.head];
  const arms = [bones[B.armL], bones[B.armR]];
  const elbows = [bones[B.elbowL], bones[B.elbowR]];
  const legs = [bones[B.legL], bones[B.legR]];
  const knees = [bones[B.kneeL], bones[B.kneeR]];

  // ── the body, with the clothes coloured on ──
  const shape = bodyShape(s) as BodyShape & { parts: Part[] };
  const long = s.top === 1 || s.top === 2 || s.top === 3;
  const short = s.top === 0 || s.top === 5;
  const belt = 0x2a2420;
  const paintAt = (v: number, p: THREE.Vector3, t: number) => {
    const region = REGIONS[shape.parts[shape.part[v]].region];
    const cloth = (c: number) => ({ color: c, skin: false });
    const bare = { color: skinC, skin: true };
    const legsCovered = (tt: number, onShin: boolean) => {
      if (s.bottom <= 1) return true;
      if (s.bottom === 2 || s.bottom === 3) return !onShin && tt < (s.bottom === 3 ? 0.8 : 0.62);
      return false; // skirts are separate pieces over bare legs
    };
    // one neckline for the neck and the torso, so the collar is a clean curve:
    // round at the back, dipping at the front (a V for the polo and the jacket's shirt)
    // a smooth surface (low round the neck, rising steeply away from it) cut by the body gives a clean collar line
    const nr = Math.hypot(p.x, (p.z + 0.015) * 1.1);
    const fz = Math.max(0, (p.z + 0.015) / Math.max(nr, 1e-3)); // 1 straight ahead
    const vNeck = s.top === 5 || s.top === 3;
    const collar = shoulder - 0.05 - (vNeck ? 0.15 * Math.pow(fz, 6) : 0.045 * fz * fz) + Math.max(0, nr - (fem ? 0.095 : 0.11)) * 3;
    const inNeck = p.y > collar;
    switch (region) {
      case "neck": // the same rule as the torso: the blend makes neck and torso share the collar
        if (p.y > shoulder + 0.03 || (s.top === 4 && p.y > shoulder - 0.12)) return bare;
      // falls through
      case "waist": case "chest": case "bust": case "shoulder": case "pelvis": {
        if (region === "shoulder" && s.top === 4) return bare;
        if (inNeck) return bare;
        const waist = hip + 0.05;
        if (p.y < waist) {
          return cloth(botC);
        }
        if (s.bottom <= 3 && p.y < waist + 0.045) return cloth(belt);
        // jacket: the shirt shows down the front
        if (s.top === 3 && p.z > 0.05 && Math.abs(p.x) < 0.07 * wF + (p.y - waist) * 0.05) return cloth(top2C);
        // tank top: bare round the arms and a scoop at the front
        if (s.top === 4 && (Math.abs(p.x) > 0.2 * wF || (p.z > 0 && p.y > shoulder - 0.12 && Math.abs(p.x) < 0.12))) return bare;
        // hoodie pocket
        if (s.top === 2 && p.z > 0.05 && p.y > waist + 0.09 && p.y < waist + 0.24 && Math.abs(p.x) < 0.15 * wF - (p.y - waist - 0.09) * 0.25) return cloth(top2C);
        // polo collar band
        if (s.top === 5 && p.y > shoulder - 0.08 && Math.abs(p.x) < 0.13) return cloth(top2C);
        return cloth(topC);
      }
      case "upper":
        if (s.top === 4) return bare;
        if (short) return t < 0.5 ? cloth(topC) : bare;
        return cloth(topC);
      case "fore":
        if (long) return t > 0.94 ? bare : t > 0.83 && s.top !== 3 ? cloth(top2C) : cloth(topC);
        return bare;
      case "hand": {
        // measured along the forearm, so the cuff ends on the same line on both pieces
        if (!long) return bare;
        let fi = shape.part[v];
        while (fi > 0 && REGIONS[shape.parts[fi].region] !== "fore") fi--;
        const tf = alongPart(p, shape.parts[fi]);
        return tf > 0.94 ? bare : tf > 0.83 && s.top !== 3 ? cloth(top2C) : cloth(topC);
      }
      case "thigh":
        return legsCovered(t, false) ? cloth(botC) : bare;
      case "shin":
        return legsCovered(t, true) ? cloth(t > 0.86 ? new THREE.Color(botC).multiplyScalar(0.85).getHex() : botC) : bare;
    }
    return bare;
  };
  // loose clothes: the top stands off the body (fading out at the collar, cuffs and sleeve ends),
  // long trousers widen towards the ankle. Position only, never colour (see dressBody).
  const ease = (a: number, b: number, x: number) => {
    const k = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return k * k * (3 - 2 * k);
  };
  const topPuff = s.top === 4 ? 0.006 : s.top === 2 || s.top === 3 ? 0.02 : 0.013;
  const legPuff = s.bottom <= 1 ? 0.008 : s.bottom === 3 ? 0.012 : 0.004;
  const waistY = hip + 0.05;
  const puffAt = (v: number, p: THREE.Vector3, t: number) => {
    const region = REGIONS[shape.parts[shape.part[v]].region];
    switch (region) {
      case "neck": case "waist": case "chest": case "bust": case "shoulder": case "pelvis": {
        const top = topPuff * (1 - ease(shoulder - 0.17, shoulder - 0.05, p.y));
        return p.y < waistY ? legPuff : legPuff + (top - legPuff) * ease(waistY, waistY + 0.07, p.y);
      }
      case "upper":
        return s.top === 4 ? topPuff * (1 - ease(0, 0.12, t)) : long ? topPuff : topPuff * (1 - ease(0.2, 0.46, t));
      case "fore":
        return long ? topPuff * (1 - ease(0.72, 0.9, t)) : 0;
      case "thigh":
        return legPuff;
      case "shin":
        return s.bottom <= 1 ? legPuff + 0.024 * ease(0.25, 1, t) : s.bottom === 3 ? legPuff * (1 - ease(0, 0.3, t)) : legPuff;
    }
    return 0;
  };
  const geo = dressBody(shape, (v, p) => {
    const pi = shape.part[v];
    const t = alongPart(p, shape.parts[pi]);
    // the calf piece measures along the shin it hangs from, so both agree on the puff
    const main = REGIONS[shape.parts[pi].region] === "shin" && pi > 0 && REGIONS[shape.parts[pi - 1].region] === "shin" ? pi - 1 : pi;
    return { ...paintAt(v, p, t), puff: puffAt(v, p, main === pi ? t : alongPart(p, shape.parts[main])) };
  });
  const clothBody = softShade(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 }));
  const skinBody = softShade(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0 }));
  const body = new THREE.SkinnedMesh(geo, [clothBody, skinBody]);
  body.frustumCulled = false;
  root.add(body);
  body.bind(new THREE.Skeleton(bones));
  // from the bind pose to standing at rest
  arms[0].rotation.set(0, 0, -REST_ARM);
  arms[1].rotation.set(0, 0, REST_ARM);
  for (const e of elbows) e.rotation.set(-0.18, 0, 0);
  legs.forEach((l, i) => l.rotation.set(0, 0, (i ? 1 : -1) * STANCE));
  knees.forEach((k, i) => k.rotation.set(0, 0, (i ? -1 : 1) * KNOCK));

  // ── pieces that ride on a bone: skirts, collars, hood, shoes ──
  if (s.bottom === 4) add(hips, new THREE.CylinderGeometry(0.27 * wF, 0.4 * wF, 0.46, 28, 1, true), mat(botC, 0.9, { side: THREE.DoubleSide }), [0, -0.2, 0], [1, 1, 0.8]);
  if (s.bottom === 5) add(hips, new THREE.CylinderGeometry(0.27 * wF, 0.44 * wF, (hip - ankle) * 0.9, 28, 1, true), mat(botC, 0.9, { side: THREE.DoubleSide }), [0, -(hip - ankle) * 0.45 + 0.02, 0], [1, 1, 0.8]);
  const neckY = shoulder - (hip + 0.1);
  if (s.top === 2) add(chest, new THREE.TorusGeometry(0.15, 0.07, 10, 22), topM, [0, neckY - 0.02, -0.1], [1.15, 1, 1], [Math.PI / 2 + 0.7, 0, 0]); // hood
  if (s.top === 3) {
    for (const side of [-1, 1]) add(chest, new THREE.BoxGeometry(0.1, 0.32, 0.03), topM, [side * 0.1, neckY - 0.14, 0.16 * wF], [1, 1, 1], [-0.35, side * 0.25, side * 0.35]); // lapels
  }
  if (s.top === 5) add(chest, new THREE.TorusGeometry(0.1, 0.03, 8, 20), top2M, [0, neckY + 0.02, 0.005], [1, 1, 1], [Math.PI / 2 - 0.2, 0, 0]);
  for (const [i, side] of [[0, -1], [1, 1]]) {
    const foot = group(knees[i], [0, -shin, 0]);
    // the console's shoes are big and chunky, flat on the floor and turned out a little
    foot.scale.setScalar(1.16);
    foot.rotation.set(0, side * 0.14, -(side * STANCE - side * KNOCK));
    add(foot, sphere(0.12), shoeM, [0, -0.05, 0.08], [0.95, 0.66, 1.7]);
    add(foot, sphere(0.12), soleM, [0, -0.1, 0.08], [1.02, 0.25, 1.75]);
    add(foot, new THREE.CylinderGeometry(0.075, 0.105, 0.12, 16), shoeM, [0, 0.0, -0.01]);
    if (s.shoes === 0 || s.shoes === 1) add(foot, new THREE.BoxGeometry(0.1, 0.012, 0.12), soleM, [0, 0.025, 0.11], [1, 1, 1], [0.45, 0, 0]); // laces
    if (s.shoes === 1) add(foot, new THREE.CylinderGeometry(0.085, 0.1, 0.18, 16), shoeM, [0, 0.08, 0]);
    if (s.shoes === 2) add(foot, new THREE.CylinderGeometry(0.09, 0.105, 0.3, 16), shoeM, [0, 0.12, 0]);
  }
  // fingers, slightly curled in towards the leg
  for (const [i, side] of [[0, -1], [1, 1]]) {
    const hand = group(elbows[i], [0, -fore - 0.125, 0.01]);
    [[0.045, 0.1], [0.016, 0.115], [-0.014, 0.11], [-0.042, 0.088]].forEach(([z, len], k) => {
      // two joints each, the tips curling in more than the knuckles
      const finger = group(hand, [0, 0, z]);
      finger.rotation.set((k - 1.5) * 0.07, 0, -side * 0.2);
      const seg = len / 2;
      add(finger, limb(0.021, seg - 0.012), skin, [0, -seg / 2, 0]);
      const tip = group(finger, [0, -seg, 0]);
      tip.rotation.z = -side * 0.55;
      add(tip, limb(0.019, seg - 0.014), skin, [0, -seg / 2 + 0.004, 0]);
    });
  }
  // a watch on the left wrist, like the console's default outfit
  if (!long) add(elbows[0], new THREE.CylinderGeometry(...[0, 0].map(() => (fem ? 0.056 : 0.062) * Math.sqrt(wF) + 0.007) as [number, number], 0.05, 16), mat(0x1c1c1c, 0.4), [0, -fore + 0.04, 0]);

  // ── head ──
  const f = FACE[s.face];
  const faceAt = group(head, [0, headY - shoulder - 0.08, 0]);
  faceAt.scale.setScalar(HEAD);
  const skull = group(faceAt, [0, 0, 0]);
  skull.scale.set(1, 1, 0.97);
  const look = {
    skin: skinC, hair: HAIR_COLORS[s.hairColor], brow: HAIR_COLORS[s.hairColor] === 0xe6e6e6 ? 0xbbbbbb : HAIR_COLORS[s.hairColor], iris: EYE_COLORS[s.eyeColor],
    eyes: s.eyes, brows: s.brows, mouth: s.mouth, facialHair: s.facialHair,
    hairline: (s.hair === 11 ? "bald" : s.hair === 10 ? "balding" : s.hair === 1 || s.hair === 9 ? "short" : "full") as "full" | "balding" | "bald" | "short",
  };
  const tex = (closed: boolean) => {
    const t = new THREE.CanvasTexture(paintFace(look, f, closed));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };
  const open = tex(false);
  const shut = tex(true);
  const faceM = softShade(new THREE.MeshStandardMaterial({ map: open, roughness: 0.62, metalness: 0 }));
  faceM.userData.textures = [open, shut];
  add(skull, new THREE.LatheGeometry(headLine(s.face), 48, Math.PI, Math.PI * 2), faceM);
  let closedNow = false;
  const blink = (closed: boolean) => {
    if (closed === closedNow) return;
    closedNow = closed;
    faceM.map = closed ? shut : open;
  };
  // nose
  const nose = group(faceAt, [0, -0.06, f.b * 0.95]);
  switch (s.nose) {
    case 0: add(nose, limb(0.024, 0.06), skin, [0, 0.035, -0.012], [1, 1, 0.8], [-0.3, 0, 0]); add(nose, sphere(0.04), skin, [0, 0, 0], [1, 0.9, 0.9]); break; // a soft bridge down to a button tip
    case 1: add(nose, sphere(0.03), skin); break;
    case 2: add(nose, limb(0.032, 0.07), skin, [0, 0.015, 0.0], [1, 1, 1], [-0.35, 0, 0]); add(nose, sphere(0.038), skin, [0, -0.025, 0.025]); break;
    case 3: add(nose, sphere(0.045), skin, [0, 0, 0], [1.5, 0.85, 0.9]); break;
    case 4: add(nose, new THREE.ConeGeometry(0.036, 0.11, 14), skin, [0, -0.005, 0.03], [1, 1, 0.8], [Math.PI / 2 + 0.25, 0, 0]); break;
    case 5: add(nose, sphere(0.055), skin, [0, -0.01, 0], [1, 0.95, 0.85]); break;
    default: add(nose, limb(0.03, 0.08), skin, [0, 0.02, 0.01], [1, 1, 1], [-0.6, 0, 0]); add(nose, sphere(0.034), skin, [0, -0.03, 0.04]);
  }
  // ears
  for (const side of [-1, 1]) {
    const ear = group(faceAt, [side * f.b * 0.98, 0.01, -0.03]);
    if (s.ears === 3 || s.ears === 4) {
      const h = s.ears === 4 ? 0.28 : 0.17;
      add(ear, new THREE.ConeGeometry(0.06, h, 14), skin, [side * h * 0.35, h * 0.3, -0.02], [0.5, 1, 1], [0, 0, -side * 1.0]);
    } else {
      const rr = [0.075, 0.058, 0.098][s.ears];
      add(ear, sphere(rr), skin, [0, 0, 0], [0.42, 1, 0.72]);
    }
  }
  // hair pieces over the painted hairline
  const hair = group(skull, [0, 0, 0]);
  const hairSide = mat(HAIR_COLORS[s.hairColor], 0.8, { side: THREE.DoubleSide });
  // the shell over the scalp, its edge on the painted hairline
  const cap = (opt: Parameters<typeof hairShell>[2] = {}) => add(hair, hairShell(f, look.hairline, opt), hairSide);
  const fringe = (phi: number, sv: number) => Math.exp(-phi * phi * 1.6) * Math.sin(Math.PI * Math.min(1, sv * 1.6)) * 0.035;
  const back = (from: number, to: number, grow = 1.07) => add(hair, new THREE.LatheGeometry(headLine(s.face, 1 - to, 1 - from, grow), 40, 1.05, Math.PI * 2 - 2.1), hairSide);
  const top = f.a;
  switch (s.hair) {
    case 0: cap({ crown: 0.05, shape: fringe }); break;
    case 1: break; // painted only
    case 2: cap({ grow: 1.035, crown: 0.02 }); add(hair, new THREE.CylinderGeometry(f.b * 0.8, f.b * 0.86, 0.18, 28), hairM, [0, top * 0.78, -0.02]); break;
    case 3: {
      // spiky: clumps of hair over the whole crown, swept up and back, not a ring of thorns
      cap({ crown: 0.06 });
      const spike = new THREE.ConeGeometry(0.1, 0.3, 8);
      const rings: [number, number][] = [[0, 1], [0.38, 6], [0.72, 10], [1.05, 12]]; // polar angle from the crown (in head units), how many
      rings.forEach(([th, n], ri) => {
        for (let i = 0; i < n; i++) {
          const az = (i / n) * Math.PI * 2 + ri * 0.4;
          if (th > 1 && Math.cos(az) > 0.3) continue; // keep the forehead clear
          const dir = new THREE.Vector3(Math.sin(th) * Math.sin(az), Math.cos(th), Math.sin(th) * Math.cos(az));
          const m = add(hair, spike, hairM, [dir.x * f.b * 0.95, dir.y * top * 0.95, dir.z * f.b * 0.95]);
          // point outwards, leaning back
          m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.add(new THREE.Vector3(0, 0.25, -0.45)).normalize());
        }
      });
      break;
    }
    case 4: cap({ crown: 0.05, shape: (phi, sv) => Math.exp(-phi * phi * 1.2) * Math.sin(Math.PI * Math.min(1, sv * 1.4)) * 0.22 }); break;
    case 5: cap({ crown: 0.07, shape: (phi, sv) => (1 - Math.cos(phi)) * 0.5 * Math.sin(Math.PI * sv * 0.8) * 0.12 + fringe(phi, sv) }); break;
    case 6: cap({ crown: 0.06, shape: fringe }); back(0.3, 0.72, 1.09); break;
    case 7: cap({ crown: 0.06, shape: fringe }); back(0.3, 0.78, 1.09); add(hair, sphere(0.28), hairM, [0, -top * 0.8, -0.15], [1.1, 1.5, 0.5]); break;
    case 8: cap({ crown: 0.05, shape: fringe }); add(hair, sphere(0.1), hairM, [0, top * 0.3, -f.b * 1.05]); add(hair, limb(0.065, 0.25), hairM, [0, -top * 0.25, -f.b * 1.1], [1, 1, 1], [0.25, 0, 0]); break;
    case 9: add(hair, sphere(0.19), hairM, [0, top * 0.75, -0.03], [0.3, 1, 1.7]); break;
    case 10: break; // painted fringe
    case 11: break;
    case 12: cap({ grow: 1.06, crown: 0, ball: { c: [0, top * 0.18, -0.07], r: 0.5, ramp: 0.16 }, rows: 22 }); break;
    default: cap({ crown: 0.04 }); for (let i = 0; i < 16; i++) { const a = i * 2.4; const rr = 0.07 + (i % 4) * 0.055; add(hair, sphere(0.08), hairM, [Math.cos(a) * rr, top * 0.84 + (i % 3) * 0.02, Math.sin(a) * rr]); }
  }
  // facial hair (stubble is painted)
  const fh = mat(HAIR_COLORS[s.hairColor], 0.9);
  const lower = (to: number, wide: number, grow = 1.03) => add(skull, new THREE.LatheGeometry(headLine(s.face, 0, to, grow), 40, -wide / 2, wide), fh);
  const lipY = -0.17;
  switch (s.facialHair) {
    case 2: for (const side of [-1, 1]) add(faceAt, limb(0.022, 0.065), fh, [side * 0.042, lipY + 0.05, f.b * 0.92], [1, 1, 0.7], [0, side * 0.2, Math.PI / 2 + side * 0.35]); break;
    case 3: add(faceAt, new THREE.TorusGeometry(0.08, 0.02, 8, 20, Math.PI), fh, [0, lipY + 0.01, f.b * 0.88], [1, 0.9, 0.7], [-0.2, 0, 0]); break;
    case 4: add(faceAt, sphere(0.06), fh, [0, -f.a * 0.8, f.b * 0.62], [1, 1.25, 0.65]); add(faceAt, limb(0.019, 0.065), fh, [0, lipY + 0.05, f.b * 0.92], [1, 1, 0.7], [0, 0, Math.PI / 2]); break;
    case 5: lower(0.22, 3.4); break;
    case 6: case 7:
      lower(0.25, 3.5, 1.04); // the volume under the mouth; the cheeks and round the mouth are painted
      add(faceAt, limb(0.022, 0.09), fh, [0, lipY + 0.05, f.b * 0.93], [1, 1, 0.7], [0, 0, Math.PI / 2]);
      if (s.facialHair === 7) add(faceAt, sphere(0.15), fh, [0, -f.a * 1.1, f.b * 0.5], [1, 1.5, 0.6]);
      break;
  }
  void hF;
  void torso;
  void fem;
  return { root, hips, chest, head, arms, elbows, legs, knees, blink, hipY: hip, legLen: hip - 0.06 - ankle };
}

function disposeTree(o: THREE.Object3D) {
  const mats = new Set<THREE.Material>();
  o.traverse((x) => {
    if (x instanceof THREE.Mesh) {
      x.geometry.dispose();
      (Array.isArray(x.material) ? x.material : [x.material]).forEach((m) => mats.add(m));
    }
  });
  mats.forEach((m) => {
    (m.userData.textures as THREE.Texture[] | undefined)?.forEach((t) => t.dispose());
    m.dispose();
  });
}

// ───────────────────────── animation ─────────────────────────
// Idle fidgets every so often, picked from the time so every avatar on screen
// does something different: look around, stretch, check the watch, shift weight.
const FIDGET = 13;
function fidget(t: number, phase: number) {
  const n = Math.floor((t + phase * 7) / FIDGET);
  const kind = (Math.imul(n + Math.floor(phase * 1000), 2654435761) >>> 0) % 4;
  const lt = (t + phase * 7) % FIDGET;
  const len = [3.2, 2.8, 2.6, 3][kind];
  if (lt > len) return null;
  // eased in and out
  const k = Math.sin(Math.PI * (lt / len));
  return { kind, k: k * k * (3 - 2 * k), lt, len };
}

/**
 * Idle pose at time t (seconds); `wave` starts a wave when true, `cheer` bounces.
 * The idle is the console's: the weight drifts from foot to foot every few
 * seconds (hips over the standing leg, the other knee easing, shoulders
 * leaning back the other way), the arms hang from the shoulders and swing a
 * little, the chest breathes and the head wanders. Feet stay planted.
 */
function animate(rig: AvatarRig, t: number, opts: { wave?: boolean; cheer?: boolean; still?: boolean; phase?: number }) {
  const { hips, chest, head, arms, elbows, legs, knees } = rig;
  if (opts.still) return;
  const ph = opts.phase ?? 0;
  const sway = Math.sin((t * Math.PI * 2) / 5.2 + ph) * 0.8 + Math.sin(t * 0.53 + ph * 2) * 0.2; // -1…1, slow
  const breath = Math.sin(t * 1.7);
  // hips over the standing leg, dipping a touch and tilting up on that side
  const dx = sway * 0.03;
  hips.position.set(dx, rig.hipY - Math.abs(sway) * 0.006, 0);
  hips.rotation.set(0, sway * 0.04, sway * 0.035);
  // legs lean back in so the feet stay where they are; the free knee bends a little
  const lean = -Math.asin(Math.max(-0.5, Math.min(0.5, dx / rig.legLen)));
  for (let i = 0; i < 2; i++) {
    const free = Math.max(0, (i === 0 ? 1 : -1) * sway); // leg 0 rests when the hips go right
    const side = i === 0 ? -1 : 1;
    knees[i].rotation.set(free * 0.16, 0, -side * KNOCK);
    legs[i].rotation.set(-free * 0.08, -hips.rotation.y, side * STANCE + lean - hips.rotation.z);
  }
  // shoulders lean back against the hips; breathing lifts the chest
  chest.rotation.set(breath * 0.012, -sway * 0.05, -sway * 0.05);
  const lift = -(hips.rotation.z + chest.rotation.z); // keeps the arms hanging straight down
  head.rotation.set(Math.sin(t * 0.6 + ph) * 0.04 - breath * 0.01, Math.sin(t * 0.41 + ph) * 0.2 + Math.sin(t * 1.3) * 0.03, lift * 0.7 + Math.sin(t * 0.33) * 0.03);
  rig.blink(t % 4.3 < 0.12);
  for (let i = 0; i < 2; i++) {
    const side = i === 0 ? -1 : 1;
    const swing = Math.sin((t * Math.PI * 2) / 5.2 + ph + i * 0.6);
    arms[i].rotation.set(swing * 0.035 - breath * 0.01, 0, side * (REST_ARM + breath * 0.012) + lift);
    elbows[i].rotation.set(-0.2 - swing * 0.04, 0, 0);
  }
  rig.root.position.y = 0;
  if (opts.wave) {
    const w = (t % 6) / 2.2;
    if (w < 1) {
      // the right arm up beside the head, forearm upright, hand waving from the elbow
      const up = Math.sin(Math.PI * Math.min(1, w * 1.25));
      const e = up * up * (3 - 2 * up);
      arms[1].rotation.set(-e * 0.25, 0, REST_ARM + e * 1.45);
      elbows[1].rotation.set(-0.2 * (1 - e), e * 0.3, e * (1.5 + Math.sin(t * 11) * 0.3));
      head.rotation.y = 0.15 * e + head.rotation.y * (1 - e);
      return;
    }
  }
  if (opts.cheer) {
    const j = Math.max(0, Math.sin(t * 6));
    hips.position.set(0, rig.hipY, 0);
    hips.rotation.set(0, 0, 0);
    legs.forEach((l, i) => l.rotation.set(-0.15 * (1 - j), 0, (i ? 1 : -1) * STANCE));
    rig.root.position.y = j * 0.18;
    knees[0].rotation.x = knees[1].rotation.x = 0.3 * (1 - j);
    arms[0].rotation.set(0, 0, -REST_ARM - j * 2.1);
    arms[1].rotation.set(0, 0, REST_ARM + j * 2.1);
    return;
  }
  const fg = fidget(t, ph);
  if (!fg) return;
  const { kind, k, lt, len } = fg;
  switch (kind) {
    case 0: // look around: left, then right
      head.rotation.y = Math.sin((lt / len) * Math.PI * 2) * 0.75 * Math.min(1, k * 2);
      chest.rotation.y += head.rotation.y * 0.25;
      break;
    case 1: // stretch, arms up and back
      arms[0].rotation.z += -k * 2.3;
      arms[1].rotation.z += k * 2.3;
      elbows[0].rotation.set(-0.2 - k * 0.35, 0, 0);
      elbows[1].rotation.set(-0.2 - k * 0.35, 0, 0);
      chest.rotation.x += -k * 0.12;
      head.rotation.x = -k * 0.25;
      if (k > 0.8) rig.blink(true);
      break;
    case 2: // check the watch: left forearm across, head down to it
      arms[0].rotation.set(-k * 0.55, 0, -REST_ARM - k * 0.05 + lift);
      elbows[0].rotation.set(-0.2 - k * 1.5, 0, k * 0.45);
      head.rotation.set(k * 0.38, -k * 0.35, 0);
      break;
    default: // settle onto one leg: a bigger version of the sway
      hips.position.x += k * 0.025;
      hips.rotation.z += k * 0.035;
      for (let i = 0; i < 2; i++) legs[i].rotation.z += -Math.asin(Math.min(0.5, (k * 0.025) / rig.legLen)) - k * 0.035;
      knees[0].rotation.x += k * 0.14;
      legs[0].rotation.x += -k * 0.07;
      chest.rotation.z -= k * 0.05;
      arms[0].rotation.z += k * 0.085;
      arms[1].rotation.z += k * 0.085;
      head.rotation.z += k * 0.08;
  }
}

// ───────────────────────── scene ─────────────────────────
/** Soft, bright light like the dashboard's: a big sky light, a gentle key from the front right, a fill and a warm back light. */
function addAvatarLights(scene: THREE.Scene, light: "dash" | "studio") {
  scene.add(new THREE.HemisphereLight(0xffffff, light === "studio" ? 0x9aa2b4 : 0xa6b48a, 2.1));
  const key = new THREE.DirectionalLight(0xfff6ec, 1.25);
  key.position.set(2.5, 4.5, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe6eeff, 0.45);
  fill.position.set(-5, 2, 3);
  scene.add(fill);
  const back = new THREE.DirectionalLight(light === "studio" ? 0xffe2c4 : 0xeaffd6, 0.9);
  back.position.set(-3, 4, -5);
  scene.add(back);
}
export type Cam = { x: number; y: number; z: number; lx: number; ly: number; lz: number; fov: number };
export type Placed = { spec: AvatarSpec; model?: string; x: number; z?: number; ry?: number; wave?: boolean; cheer?: boolean; phase?: number; dim?: boolean };

/** One WebGL canvas filling its parent with any number of avatars; the camera eases to `cam`. Renders nothing if WebGL fails. */
export function AvatarScene({ avatars, cam, motion = true, light = "dash", className }: { avatars: Placed[]; cam: Cam; motion?: boolean; light?: "dash" | "studio"; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ avatars, cam, motion });
  live.current = { avatars, cam, motion };
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const c0 = live.current.cam;
    const camera = new THREE.PerspectiveCamera(c0.fov, 1, 0.1, 80);
    const at = new THREE.Vector3(c0.lx, c0.ly, c0.lz);
    camera.position.set(c0.x, c0.y, c0.z);
    addAvatarLights(scene, light);

    type Built = { key: string; root: THREE.Object3D; rig?: AvatarRig; mixer?: THREE.AnimationMixer; moves?: Moves; proc?: ConsoleRig; dead?: boolean };
    const built: Built[] = [];
    const drop = (b: Built) => {
      b.dead = true;
      scene.remove(b.root);
      if (b.rig) disposeTree(b.root); // a loaded model shares geometry with its cached original
      b.mixer?.stopAllAction();
    };
    const size = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    let raf = 0;
    const t0 = performance.now();
    let last = t0;
    const frame = (now: number) => {
      const { avatars: list, cam, motion: m } = live.current;
      const still = !m || matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t = (now - t0) / 1000;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // keep the built avatars in step with the list; a new body takes a moment, so past a few
      // milliseconds the rest wait for the next frame
      const budget = performance.now() + 20;
      let buildFirst = true;
      list.forEach((p, i) => {
        const k = p.model ? `glb:${modelKey(p.model)}` : JSON.stringify(p.spec);
        if (built[i]?.key !== k) {
          if (!p.model && !buildFirst && performance.now() > budget) return;
          buildFirst = false;
          if (built[i]) drop(built[i]);
          if (p.model) {
            // your own exported avatar: shown once it has loaded
            const b: Built = { key: k, root: new THREE.Group() };
            built[i] = b;
            loadModel(p.model).then((m) => {
              if (b.dead || !m) return;
              b.root.add(m.scene);
              if (m.idle) {
                b.mixer = new THREE.AnimationMixer(m.scene);
                b.moves = startMoves(b.mixer, m.idle, m.emotes, m.hello);
              } else b.proc = m.proc; // exported without animations: our own idle on the console skeleton
            });
          } else {
            const rig = buildAvatar(p.spec);
            built[i] = { key: k, root: rig.root, rig };
          }
          scene.add(built[i].root);
        }
      });
      while (built.length > list.length) {
        const b = built.pop();
        if (b) drop(b);
      }
      const ease = still ? 1 : 1 - Math.pow(0.002, dt);
      built.forEach((b, i) => {
        const p = list[i];
        const r = b.root;
        r.position.x += ((p.x ?? 0) - r.position.x) * ease;
        r.position.z += ((p.z ?? 0) - r.position.z) * ease;
        const ry = p.ry ?? 0;
        r.rotation.y += (ry + (still ? 0 : Math.sin(t * 0.35 + (p.phase ?? 0)) * 0.05) - r.rotation.y) * ease;
        if (b.mixer && !still) (b.moves?.tick(dt), b.mixer.update(dt));
        if (b.proc && !still) animateConsoleRig(b.proc, t + (p.phase ?? 0), p.phase ?? i * 0.37);
        if (!b.rig) return;
        const y = r.position.y;
        animate(b.rig, t + (p.phase ?? 0), { wave: p.wave, cheer: p.cheer, still, phase: p.phase ?? i * 0.37 });
        if (!still) r.position.y = Math.max(r.position.y, y * 0.8);
      });
      camera.position.x += (cam.x - camera.position.x) * ease;
      camera.position.y += (cam.y - camera.position.y) * ease;
      camera.position.z += (cam.z - camera.position.z) * ease;
      at.x += (cam.lx - at.x) * ease;
      at.y += (cam.ly - at.y) * ease;
      at.z += (cam.lz - at.z) * ease;
      if (camera.fov !== cam.fov) ((camera.fov += (cam.fov - camera.fov) * ease), camera.updateProjectionMatrix());
      camera.lookAt(at);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const vis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", vis);
      ro.disconnect();
      built.forEach(drop);
      renderer.dispose();
    };
  }, [light]);

  if (failed) return null;
  return <canvas ref={canvas} className={className} aria-hidden="true" style={{ width: "100%", height: "100%", display: "block" }} />;
}

/** Your avatar standing on the dashboard, turned a little towards `faceX` (-1 left … 1 right). */
export function X360Avatar({ spec, model, motion = true, faceX = 0 }: { spec: AvatarSpec; model?: string; motion?: boolean; faceX?: number }) {
  const d = dims(spec);
  return <AvatarScene className="dht-x360-avatar" motion={motion} avatars={[{ spec, model, x: 0, ry: faceX * 0.6, wave: !model }]} cam={{ x: 0, y: 1.6, z: 8.1, lx: 0, ly: d.top / 2 - 0.12, lz: 0, fov: 24 }} />;
}

// ───────────────────────── your own exported model ─────────────────────────
const MODEL_HEIGHT = 3.15; // about as tall as the built avatars
const models = new Map<string, Promise<{ raw: THREE.Group; clips: THREE.AnimationClip[] } | undefined>>();
/** A rigged .glb (for example an avatar exported from 360sona) as a data URL: scaled to avatar height, feet on the floor, with its idle clip if it has one. */
type Loaded = { scene: THREE.Group; idle?: THREE.AnimationClip; hello?: THREE.AnimationClip; emotes: THREE.AnimationClip[]; proc?: ConsoleRig };
function loadModel(url: string): Promise<Loaded | undefined> {
  const key = modelKey(url);
  let p = models.get(key);
  if (!p) {
    p = (async () => {
      try {
        const bin = Uint8Array.from(atob(url.slice(url.indexOf(",") + 1)), (c) => c.charCodeAt(0));
        const gltf = await new GLTFLoader().parseAsync(bin.buffer, "");
        return { raw: gltf.scene, clips: gltf.animations };
      } catch (e) {
        console.error("[DeckHomeThemes] couldn't load the avatar model", e);
        return undefined;
      }
    })();
    models.set(key, p);
  }
  return p.then((g) => {
    if (!g) return undefined;
    const scene = cloneSkinned(g.raw) as THREE.Group; // each canvas gets its own copy, skeletons rebound
    const holder = new THREE.Group();
    holder.add(scene);
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const s = size.y > 0 ? MODEL_HEIGHT / size.y : 1;
    scene.scale.multiplyScalar(s);
    scene.position.set(-((box.min.x + box.max.x) / 2) * s, -box.min.y * s, -((box.min.z + box.max.z) / 2) * s);
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) o.frustumCulled = false;
    });
    const named = (re: RegExp) => g.clips.find((c) => re.test(c.name));
    const idle = named(/idle|standing around|breath/i) ?? g.clips[0];
    // calm emotes only; 360sona exports also carry sleeping, crying, stage exits and so on
    const emotes = g.clips.filter((c) => c !== idle && /look around|stretch|yawn|check me out|bling check|what's that down there/i.test(c.name));
    holder.updateMatrixWorld(true);
    return { scene: holder, idle, hello: named(/hello there|wave/i), emotes, proc: idle ? undefined : consoleRig(scene) };
  });
}

// The console's avatar skeleton, as 360sona exports it: 71 joints named joint_00…joint_70 in a
// fixed order (measured on an export: 0 pelvis, 5 chest, 19 head, 20/22 upper arms, 25/28
// forearms, 2/3 thighs, 6/8 shins). When an export carries no animations we move these with
// the same weight-shift idle as the built avatars, as rotations about the avatar's own axes.
type ConsoleRig = { bones: THREE.Object3D[]; rest: THREE.Quaternion[]; parentRest: THREE.Quaternion[] };
const CJ = { pelvis: 0, chest: 5, neck: 14, head: 19, armL: 20, armR: 22, foreL: 25, foreR: 28, thighL: 2, thighR: 3, shinL: 6, shinR: 8 };
function consoleRig(scene: THREE.Object3D): ConsoleRig | undefined {
  const bones: THREE.Object3D[] = [];
  for (let i = 0; i <= 70; i++) {
    const b = scene.getObjectByName(`joint_${String(i).padStart(2, "0")}`);
    if (!b) return undefined;
    bones.push(b);
  }
  // a sanity check that this is that skeleton: the head above the chest above the pelvis, thighs below it
  const y = (i: number) => bones[i].getWorldPosition(new THREE.Vector3()).y;
  if (!(y(CJ.head) > y(CJ.chest) && y(CJ.chest) > y(CJ.pelvis) && y(CJ.shinL) < y(CJ.pelvis) && y(CJ.shinR) < y(CJ.pelvis))) return undefined;
  return { bones, rest: bones.map((b) => b.quaternion.clone()), parentRest: bones.map((b) => (b.parent ? b.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion())) };
}
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _pi = new THREE.Quaternion();
/** Sets joint i to its rest pose turned by (x, y, z) radians about the avatar's own axes (x across, y up, z forward). */
function turn(r: ConsoleRig, i: number, x: number, y: number, z: number) {
  _q.setFromEuler(_e.set(x, y, z));
  const P = r.parentRest[i];
  _pi.copy(P).invert();
  r.bones[i].quaternion.copy(_pi).multiply(_q).multiply(P).multiply(r.rest[i]);
}
function animateConsoleRig(r: ConsoleRig, t: number, ph: number) {
  const sway = Math.sin((t * Math.PI * 2) / 5.2 + ph) * 0.8 + Math.sin(t * 0.53 + ph * 2) * 0.2;
  const breath = Math.sin(t * 1.7);
  const hz = sway * 0.035;
  const cz = -sway * 0.05;
  turn(r, CJ.pelvis, 0, sway * 0.04, hz);
  turn(r, CJ.chest, breath * 0.012, -sway * 0.05, cz);
  turn(r, CJ.head, Math.sin(t * 0.6 + ph) * 0.04, Math.sin(t * 0.41 + ph) * 0.2 + Math.sin(t * 1.3) * 0.03, -(hz + cz) * 0.7);
  for (const [arm, fore, side] of [[CJ.armL, CJ.foreL, 1], [CJ.armR, CJ.foreR, -1]] as const) {
    const swing = Math.sin((t * Math.PI * 2) / 5.2 + ph + (side > 0 ? 0 : 0.6));
    turn(r, arm, swing * 0.035, 0, -(hz + cz) + side * breath * 0.012);
    turn(r, fore, -swing * 0.04, 0, 0);
  }
  // the legs lean back against the pelvis so the feet stay put; the free knee eases
  for (const [thigh, shin, sgn] of [[CJ.thighL, CJ.shinL, 1], [CJ.thighR, CJ.shinR, -1]] as const) {
    const free = Math.max(0, sgn * -sway);
    turn(r, thigh, -free * 0.08, -sway * 0.04, -hz);
    turn(r, shin, free * 0.16, 0, 0);
  }
}

type Moves = { tick: (dt: number) => void };
/** Loops the idle clip and now and then crossfades into one of the emotes and back, like the dashboard avatar fidgeting. */
function startMoves(mixer: THREE.AnimationMixer, idleClip: THREE.AnimationClip, emotes: THREE.AnimationClip[], hello?: THREE.AnimationClip): Moves {
  const idle = mixer.clipAction(idleClip).play();
  let current: THREE.AnimationAction | null = null;
  let wait = 9 + Math.random() * 6;
  const play = (clip: THREE.AnimationClip) => {
    const a = mixer.clipAction(clip);
    a.reset().setLoop(THREE.LoopOnce, 1);
    a.clampWhenFinished = true;
    a.play();
    idle.crossFadeTo(a, 0.4, false);
    current = a;
  };
  mixer.addEventListener("finished", (e) => {
    if (e.action !== current) return;
    idle.reset().play();
    current.crossFadeTo(idle, 0.5, false);
    current = null;
    wait = 10 + Math.random() * 10;
  });
  if (hello) play(hello);
  return {
    tick(dt) {
      if (current || !emotes.length) return;
      wait -= dt;
      if (wait <= 0) play(emotes[Math.floor(Math.random() * emotes.length)]);
    },
  };
}

// ───────────────────────── thumbnails ─────────────────────────
let thumbR: { renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera } | null | false = null;
const thumbCache = new Map<string, string>();
/** A small picture of `spec`, head or full body, as a data URL; "" when WebGL is unavailable. */
export function avatarThumb(spec: AvatarSpec, framing: "head" | "body", size = 112): string {
  const key = `${framing}:${size}:${JSON.stringify(spec)}`;
  const hit = thumbCache.get(key);
  if (hit !== undefined) return hit;
  if (thumbR === false) return "";
  if (!thumbR) {
    try {
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      addAvatarLights(scene, "studio");
      thumbR = { renderer, scene, camera: new THREE.PerspectiveCamera(22, 1, 0.1, 50) };
    } catch {
      thumbR = false;
      return "";
    }
  }
  const { renderer, scene, camera } = thumbR;
  renderer.setSize(size, size, false);
  const rig = buildAvatar(spec);
  scene.add(rig.root);
  const d = dims(spec);
  if (framing === "head") {
    camera.position.set(0.25, d.head + 0.05, 2.9);
    camera.lookAt(0, d.head - 0.02, 0);
  } else {
    camera.position.set(0.3, d.top / 2 + 0.15, 8.2);
    camera.lookAt(0, d.top / 2, 0);
  }
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  scene.remove(rig.root);
  disposeTree(rig.root);
  if (thumbCache.size > 400) thumbCache.clear();
  thumbCache.set(key, url);
  return url;
}
