import * as THREE from "three";
import {mergeGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Original Mii-style models for the WaraWara Plaza, built in code from simple shapes.
// Proportions follow real Wii U Miis at the default height and build (Mii Maker / Mii Studio full-body
// renders and WaraWara Plaza captures): the head is almost as tall as the whole body below it, the arms
// hang close to the sides and end in round hands in the shirt colour, male Miis wear a shirt over trousers,
// female Miis a flared A-line dress that ends above the knee with the trouser legs showing below.
// Units: feet at y 0, the neck (where the head sits) at MII_NECK_Y. The head's front is a flat plane at
// z = 2.3 so the face features drawn by the Plaza sit on it.
//
// Every body vertex carries a region (colour) and a bone:
//   regions: 0 shirt (torso, dress, arms, hands), 1 trousers, 2 skin (neck), 3 shoes (trouser colour, darker)
//   bones:   0 rigid body, 1 left arm, 2 right arm, 3 left leg, 4 right leg
//   balls:   centre of a hand or shoe (w = 1), which keeps its shape under the body scale like the console's wrists and ankles
// Each limb is its own closed tube that turns rigidly about its joint (MII_SHOULDER / MII_HIP), so posing never
// stretches the shirt, dress or trousers; the body is weighted 0 everywhere.
export type MiiShape = { positions: number[]; normals: number[]; indices: number[]; regions: number[]; bones: number[]; balls: number[] };
export const MII_NECK_Y = 7.4;
export const MII_SHOULDER = { x: 1.3, y: 6.75 };
export const MII_HIP = [{ x: .58, y: 3.7 }, { x: .5, y: 3.4 }]; // male, female

type Part = { g: THREE.BufferGeometry; region: number | ((p: THREE.Vector3) => number); bone?: number; ball?: THREE.Vector3 };
function build(parts: Part[]): MiiShape {
  const out: MiiShape = { positions: [], normals: [], indices: [], regions: [], bones: [], balls: [] };
  const v = new THREE.Vector3();
  for (const { g, region, bone = 0, ball } of parts) {
    if (!g.getAttribute("normal")) g.computeVertexNormals();
    const pos = g.getAttribute("position"), nrm = g.getAttribute("normal"), base = out.positions.length / 3;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      out.positions.push(v.x, v.y, v.z);
      out.normals.push(nrm.getX(i), nrm.getY(i), nrm.getZ(i));
      out.regions.push(typeof region === "function" ? region(v) : region);
      out.bones.push(bone);
      out.balls.push(ball?.x ?? 0, ball?.y ?? 0, ball?.z ?? 0, ball ? 1 : 0);
    }
    const index = g.getIndex();
    if (index) for (let i = 0; i < index.count; i++) out.indices.push(base + index.getX(i));
    else for (let i = 0; i < pos.count; i++) out.indices.push(base + i);
    g.dispose();
  }
  return out;
}

// A tapered limb from a to b, rounded at both ends.
function limb(a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number) {
  const len = a.distanceTo(b), g = new THREE.CylinderGeometry(rb, ra, len, 14, 3, true);
  const ends = [new THREE.SphereGeometry(ra, 14, 8), new THREE.SphereGeometry(rb, 14, 8)];
  ends[0].translate(0, -len / 2, 0); ends[1].translate(0, len / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), mid = a.clone().add(b).multiplyScalar(.5);
  return [g, ...ends].map(x => { x.applyQuaternion(q); x.translate(mid.x, mid.y, mid.z); return x; });
}
const lathe = (profile: number[][], depth: number, segments = 28) => { const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments); g.scale(1, 1, depth); return g; };

// Male torso: hips to shoulders, a little narrower than the head, squashed front to back.
const MALE_TORSO = [[0, 3.5], [.98, 3.53], [1.13, 3.8], [1.15, 3.93], [1.15, 3.97], [1.15, 4.6], [1.14, 5.4], [1.19, 6.2], [1.17, 6.7], [.95, 7.1], [.55, 7.38], [0, 7.45]];
// Female dress: narrow at the shoulders, flaring to a wide hem above the knee. Lathe profiles run bottom to top,
// or the faces wind inwards and get culled (the old skirt was drawn inside out).
const DRESS = [[0, 2.62], [1.9, 2.64], [1.98, 2.76], [1.93, 2.95], [1.66, 3.9], [1.36, 5.0], [1.18, 6.0], [1.17, 6.7], [.95, 7.1], [.55, 7.38], [0, 7.45]];

export function miiBody(female: boolean): MiiShape {
  const parts: Part[] = [];
  if (female) parts.push({ g: lathe(DRESS, .8, 32), region: 0 });
  // The shirt ends at the hips; the trousers start just above the legs.
  else parts.push({ g: lathe(MALE_TORSO, .78), region: p => (p.y < 3.95 ? 1 : 0) });
  const neck = new THREE.CylinderGeometry(.42, .46, 1.3, 12, 1, true); neck.translate(0, 7.65, 0);
  parts.push({ g: neck, region: 2 });
  const hip = MII_HIP[female ? 1 : 0], legR = female ? .42 : .48;
  for (const side of [-1, 1]) {
    const arm = side < 0 ? 1 : 2, leg = side < 0 ? 3 : 4;
    for (const g of limb(new THREE.Vector3(side * hip.x, hip.y, 0), new THREE.Vector3(side * hip.x, .55, .02), legR, legR * .88)) parts.push({ g, region: 1, bone: leg });
    const shoe = new THREE.SphereGeometry(1, 16, 10), foot = new THREE.Vector3(side * hip.x, .35, .16); shoe.scale(.47, .37, .72); shoe.translate(foot.x, foot.y, foot.z);
    parts.push({ g: shoe, region: 3, bone: leg, ball: foot });
    // Arms hang close to the body; a dress pushes the hands out to the sides of the hem.
    const hand = new THREE.Vector3(side * (female ? 2.28 : 1.95), 3.8, .05);
    for (const g of limb(new THREE.Vector3(side * MII_SHOULDER.x, MII_SHOULDER.y, 0), hand, .4, .36)) parts.push({ g, region: 0, bone: arm });
    const ball = new THREE.SphereGeometry(.47, 16, 12), palm = new THREE.Vector3(hand.x + side * .04, hand.y - .22, hand.z + .03); ball.translate(palm.x, palm.y, palm.z);
    parts.push({ g: ball, region: 0, bone: arm, ball: palm });
  }
  return build(parts);
}

// The body as a BufferGeometry with the per-vertex attributes the body material reads (aRegion, aBone, aBall).
export function miiBodyGeometry(female: boolean) {
  const s = miiBody(female), g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(s.positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(s.normals, 3));
  g.setAttribute("aRegion", new THREE.Float32BufferAttribute(s.regions, 1));
  g.setAttribute("aBone", new THREE.Float32BufferAttribute(s.bones, 1));
  g.setAttribute("aBall", new THREE.Float32BufferAttribute(s.balls, 4));
  g.setIndex(s.indices);
  return g;
}

// Head: a rounded block with a flat face at the front, and a small nose. Its origin is the neck joint.
export function miiHead(): MiiShape {
  const face = new THREE.SphereGeometry(1, 32, 22), p = face.getAttribute("position"), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // Squarer than a sphere (a superellipse), wider at the cheeks than at the chin.
    const sq = (x: number) => Math.sign(x) * Math.pow(Math.abs(x), .82);
    let x = sq(v.x) * 2.7, y = sq(v.y) * 2.35 + 2.38, z = sq(v.z) * 3.1;
    if (y < 1.4) x *= .82 + .18 * (y / 1.4);
    if (z > 2.3) z = 2.3;
    p.setXYZ(i, x, y, z);
  }
  face.computeVertexNormals();
  const nose = new THREE.SphereGeometry(1, 14, 10); nose.scale(.3, .36, .4); nose.translate(0, 2.02, 2.3);
  const ears = [-1, 1].map(side => { const e = new THREE.SphereGeometry(1, 12, 10); e.scale(.26, .46, .36); e.translate(side * 2.6, 2.6, .25); return { g: e, region: 2 }; });
  return build([{ g: face, region: 2 }, { g: nose, region: 2 }, ...ears]);
}

// Hair, two styles: 0 short (a cap over the top and back, a fringe at the brow, short sideburns down the sides of the face)
// and 1 a bob that hangs to the jaw at the sides and back (most female Miis in the Plaza have longer hair).
// The front stays clear of the face: there the hair stops at the brow line.
export function miiHair(style = 0): MiiShape {
  const bob = style === 1, cap = new THREE.SphereGeometry(1, 32, bob ? 22 : 16, 0, Math.PI * 2, 0, Math.PI * (bob ? .94 : .72)), p = cap.getAttribute("position"), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // A bob hangs nearly straight below the widest point instead of curling in under the head.
    const hang = bob && v.y < 0, ring = Math.hypot(v.x, v.z), widen = hang && ring > 1e-4 ? Math.max(ring, 1) / ring : 1;
    const x = v.x * (bob ? 3.45 : 2.98) * widen, z = v.z * (bob ? 3.55 : 3.35) * widen - .3;
    let y = hang ? 4.15 + v.y * 3.75 : v.y * (bob ? 2.62 : 2.55) + 4.15;
    if (z > (bob ? 2.0 : .9) || (z > -.6 && Math.abs(x) < (bob ? 2.25 : 2.2))) y = Math.max(y, 3.85 + Math.max(0, z) * .06);
    p.setXYZ(i, x, y, z);
  }
  cap.computeVertexNormals();
  return build([{ g: cap, region: 0 }]);
}

// Real Mii body scale from the Mii's height and build (0-127 each, 64 is the default), as computed by the
// console (nn::mii GetBodyScale): y from the height, x = z from both. Returned relative to the default Mii,
// which is what the model above is drawn at. The head is never scaled; it sits on the scaled neck.
export function miiBodyScale(height: number, buildValue: number) {
  const x = (h: number, b: number) => (b * (h * (.47 / 128) + .4)) / 128 + h * (.23 / 128) + .4, y = (h: number) => h * (.77 / 128) + .5;
  return { x: x(height, buildValue) / x(64, 64), y: y(height) / y(64) };
}

// Posing in the vertex shader. Per-instance attributes: aPose = (walk phase, cheer 0-1, wave 0-1, wave time),
// aBuild = (width, height) body scale. The scale is applied to the rest pose first (as the console scales the
// bones), then each limb turns rigidly about its scaled joint: legs and arms swing against each other while walking,
// cheering lifts both arms, waving lifts the right one. Normals get the same treatment, so lit arms stay lit right.
const SHADER_HEAD = `attribute vec4 aPose;
attribute vec2 aBuild;
attribute float aBone;
attribute vec4 aBall;
attribute float aRegion;
attribute vec3 aShirt;
attribute vec3 aPants;
attribute vec3 aSkin;
mat3 miiRotX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0, 0.0,c,s, 0.0,-s,c);}
mat3 miiRotZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.0, -s,c,0.0, 0.0,0.0,1.0);}
`;
const f = (n: number) => n.toFixed(3);
const SHADER_POSE = (female: boolean) => `#include <beginnormal_vertex>
 vec3 miiScale = vec3(aBuild.x, aBuild.y, aBuild.x);
 bool miiArm = aBone > 0.5 && aBone < 2.5, miiLeg = aBone > 2.5;
 float miiSide = (aBone > 0.5 && aBone < 1.5) || (aBone > 2.5 && aBone < 3.5) ? -1.0 : 1.0;
 vec3 miiPivot = (miiArm ? vec3(miiSide * ${f(MII_SHOULDER.x)}, ${f(MII_SHOULDER.y)}, 0.0) : vec3(miiSide * ${f(MII_HIP[female ? 1 : 0].x)}, ${f(MII_HIP[female ? 1 : 0].y)}, 0.0)) * miiScale;
 float miiSwing = sin(aPose.x + (miiSide > 0.0 ? 3.14159 : 0.0));
 float miiWave = miiSide > 0.0 ? aPose.z : 0.0;
 float miiRaise = miiArm ? miiSide * (aPose.y * 2.3 + miiWave * (1.95 + 0.35 * sin(aPose.w))) : 0.0;
 float miiPitch = miiLeg ? miiSwing * 0.36 : (miiArm ? -miiSwing * 0.3 * (1.0 - max(aPose.y, miiWave)) : 0.0);
 mat3 miiRot = miiRotZ(miiRaise) * miiRotX(miiPitch);
 if (aBall.w < 0.5) objectNormal = normalize(objectNormal / miiScale);
 if (miiArm || miiLeg) objectNormal = miiRot * objectNormal;`;
const SHADER_PLACE = `#include <begin_vertex>
 transformed = aBall.w > 0.5 ? aBall.xyz * miiScale + (transformed - aBall.xyz) * aBuild.x : transformed * miiScale;
 if (miiArm || miiLeg) transformed = miiPivot + miiRot * (transformed - miiPivot);`;
const SHADER_COLOR = `vColor = aRegion < 0.5 ? aShirt : (aRegion < 1.5 ? aPants : (aRegion < 2.5 ? aSkin : aPants * 0.72));`;

// The body material for one gender (the joints differ). Colours come from per-instance attributes picked by region.
export function miiBodyMaterial(female: boolean) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .85 });
  m.onBeforeCompile = shader => {
    shader.vertexShader = SHADER_HEAD + shader.vertexShader.replace("#include <beginnormal_vertex>", SHADER_POSE(female)).replace("#include <begin_vertex>", SHADER_PLACE).replace("#include <color_vertex>", SHADER_COLOR);
  };
  m.customProgramCacheKey = () => "mii-body-" + (female ? "f" : "m");
  return m;
}

// Face details are small layers (eyes, brows, mouth, beard, glasses), one geometry per variant. Each layer is drawn
// as one InstancedMesh for every Mii that uses it, so the whole crowd's faces cost about a dozen draw calls.
// Brows and beards are painted white and tinted per instance with the Mii's hair colour.
export type Look={glasses:number;brow:number;mouth:number;beard:number;eye:number};
export type Layer='eyes'|'brow'|'mouth'|'beard'|'glasses';
export function faceLayer(kind:Layer,v:number){
 const parts:THREE.BufferGeometry[]=[],paint=(g:THREE.BufferGeometry,color:string)=>{const c=new THREE.Color(color),n=g.getAttribute('position').count;g.setAttribute('color',new THREE.Float32BufferAttribute(Array.from({length:n},()=>c.toArray()).flat(),3));g.deleteAttribute('uv');parts.push(g.index?g.toNonIndexed():g);};
 const blob=(x:number,y:number,z:number,sx:number,sy:number,sz:number,color:string,rz=0)=>{const g=new THREE.SphereGeometry(1,10,8);g.scale(sx,sy,sz);g.rotateZ(rz);g.translate(x,y,z);paint(g,color);};
 // The face front is a near-flat plane at z ≈ 2.3, so features sit just on it.
 // Brows: level, angry (inner ends down) or worried (inner ends up); eyes in three sizes.
 const tilt=[.08,.32,-.22][v],eh=[.32,.26,.4][v];
 if(kind==='eyes')for(const x of [-.86,.86]){blob(x,3.4,2.29,.42,eh+.17,.05,'#fbfbf8');blob(x+.03,3.36,2.32,.28,eh*.98,.05,'#202429');blob(x+.11,3.36+eh*.38,2.36,.08,.09,.02,'#ffffff');}
 if(kind==='brow')for(const x of [-.8,.8])blob(x*1.08,4.04+(v===2?.08:0),2.32,.42,.085,.05,'#ffffff',x<0?-tilt:tilt);
 // Mouths: smile, open grin, small "o", or a flat line.
 if(kind==='mouth'){
  if(v===0){const smile=new THREE.TorusGeometry(.36,.075,5,14,Math.PI);smile.rotateZ(Math.PI);smile.scale(1,.7,.5);smile.translate(0,1.72,2.3);paint(smile,'#8d3b33');}
  else if(v===1){blob(0,1.62,2.31,.44,.24,.04,'#5c1f1b');blob(0,1.74,2.34,.36,.08,.02,'#ffffff');}
  else if(v===2)blob(0,1.66,2.31,.15,.19,.04,'#5c1f1b');
  else blob(0,1.7,2.31,.34,.06,.04,'#8d3b33');
 }
 // Facial hair: a moustache, or a full beard around the jaw.
 if(kind==='beard'){if(v===2)blob(0,1.65,1.75,1.55,1.05,.75,'#ffffff');blob(0,2.12,2.33,v===2?.62:.6,v===2?.16:.15,.07,'#ffffff');}
 // Glasses: thin round frames, thick black frames, or sunglasses.
 if(kind==='glasses'){const thick=v===2,dark=v===3;for(const x of [-.82,.82]){if(dark)blob(x,3.38,2.42,.55,.4,.05,'#16181b');const r=new THREE.TorusGeometry(.52,thick||dark?.12:.07,6,20);r.scale(1,dark?.8:1,1);r.translate(x,3.4,2.45);paint(r,'#2e3238');}const bridge=new THREE.BoxGeometry(.5,thick?.13:.08,.08);bridge.translate(0,3.5,2.48);paint(bridge,'#2e3238');}
 // Features are laid out on a grid 0.62 higher than where real Miis carry them (eyes at about 40% of the head's height
 // from the chin, mouth at about 17%); move them down as a whole.
 const merged=mergeGeometries(parts);parts.forEach(g=>g.dispose());merged.translate(0,-.62,0);return merged;
}
