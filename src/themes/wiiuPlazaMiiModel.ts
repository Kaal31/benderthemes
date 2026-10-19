import * as THREE from "three";
import {mergeGeometries} from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Original Mii-style models for the WaraWara Plaza, built in code from simple shapes.
// Proportions follow real Wii U Miis at the default height and build (Mii Maker / Mii Studio full-body
// renders and WaraWara Plaza captures): the head is almost as tall as the whole body below it, the arms
// hang close to the sides and end in round fists in the shirt colour, male Miis wear a shirt over trousers,
// female Miis a flared A-line dress that ends above the knee with the trouser legs showing below.
// Units: feet at y 0, the neck (where the head sits) at MII_NECK_Y. The head's front is a flat plane at
// z = 2.3 so the face decals sit on it.
//
// Every body vertex carries a region (colour), a bone and an ambient-occlusion factor:
//   regions: 0 shirt (torso, dress, arms, hands), 1 trousers, 2 skin (neck), 3 shoe (trouser colour, darker), 4 sole
//   bones:   0 body (bends at the waist), 1/2 left/right upper arm, 3/4 left/right leg, 5/6 left/right forearm + hand
//   balls:   centre of a hand or shoe (w = 1), which keeps its shape under the body scale like the console's wrists and ankles
// Each limb is its own closed tube that turns rigidly about its joint (shoulder, elbow, hip), so posing never
// stretches the shirt, dress or trousers. The torso bends smoothly about the waist (weight rises from the hips
// to the chest), and the arms, neck and head follow it.
//
// Two levels of detail: 0 for Miis near the camera (smooth silhouettes), 1 for the rest of the crowd (about a
// fifth of the triangles). Both share the same joints, so a Mii can switch level from one frame to the next.
export type Lod = 0 | 1;
export type MiiShape = { positions: number[]; normals: number[]; indices: number[]; regions: number[]; bones: number[]; balls: number[]; ao: number[] };
export const MII_NECK_Y = 7.4;
export const MII_SHOULDER = { x: 1.3, y: 6.75 };
export const MII_HIP = [{ x: .58, y: 3.7 }, { x: .5, y: 3.4 }]; // male, female
export const MII_WRIST = [{ x: 1.93, y: 4.05 }, { x: 2.25, y: 4.1 }];
export const MII_ELBOW = MII_WRIST.map(w => ({ x: (MII_SHOULDER.x + w.x) / 2, y: (MII_SHOULDER.y + w.y) / 2 }));
// The torso bends about this point; the bend fades in from WAIST_FROM to WAIST_TO so the shirt curves instead of creasing.
export const MII_WAIST_Y = 3.9, MII_WAIST_FROM = 3.5, MII_WAIST_TO = 5.6;
const DETAIL = [
  { lathe: 32, limb: 12, limbRings: 2, cap: 6, ball: 14, ballRings: 10, head: [36, 26], hair: [36, 24], small: [12, 8] },
  { lathe: 12, limb: 7, limbRings: 1, cap: 4, ball: 8, ballRings: 6, head: [20, 14], hair: [20, 12], small: [7, 5] },
];

type Part = { g: THREE.BufferGeometry; region: number | ((p: THREE.Vector3) => number); bone?: number; ball?: THREE.Vector3; ao?: (p: THREE.Vector3) => number };
function build(parts: Part[]): MiiShape {
  const out: MiiShape = { positions: [], normals: [], indices: [], regions: [], bones: [], balls: [], ao: [] };
  const v = new THREE.Vector3();
  for (const { g, region, bone = 0, ball, ao } of parts) {
    if (!g.getAttribute("normal")) g.computeVertexNormals();
    const pos = g.getAttribute("position"), nrm = g.getAttribute("normal"), base = out.positions.length / 3;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      out.positions.push(v.x, v.y, v.z);
      out.normals.push(nrm.getX(i), nrm.getY(i), nrm.getZ(i));
      out.regions.push(typeof region === "function" ? region(v) : region);
      out.bones.push(bone);
      out.balls.push(ball?.x ?? 0, ball?.y ?? 0, ball?.z ?? 0, ball ? 1 : 0);
      out.ao.push(ao ? ao(v) : 1);
    }
    const index = g.getIndex();
    if (index) for (let i = 0; i < index.count; i++) out.indices.push(base + index.getX(i));
    else for (let i = 0; i < pos.count; i++) out.indices.push(base + i);
    g.dispose();
  }
  return out;
}
const smooth = (a: number, b: number, x: number) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

// A tapered limb from a to b, rounded at both ends.
function limb(a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number, lod: Lod) {
  const d = DETAIL[lod], len = a.distanceTo(b), g = new THREE.CylinderGeometry(rb, ra, len, d.limb, d.limbRings, true);
  const ends = [new THREE.SphereGeometry(ra, d.limb, d.cap), new THREE.SphereGeometry(rb, d.limb, d.cap)];
  ends[0].translate(0, -len / 2, 0); ends[1].translate(0, len / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), mid = a.clone().add(b).multiplyScalar(.5);
  return [g, ...ends].map(x => { x.applyQuaternion(q); x.translate(mid.x, mid.y, mid.z); return x; });
}
// A lathe from a [radius, y] profile; on the near level the profile is resampled along a smooth curve so the silhouette has no corners.
function lathe(profile: number[][], depth: number, lod: Lod) {
  let pts = profile.map(([r, y]) => new THREE.Vector2(r, y));
  if (lod === 0) { const curve = new THREE.SplineCurve(pts); pts = curve.getSpacedPoints(profile.length * 3); pts[0].x = 0; pts[pts.length - 1].x = 0; }
  const g = new THREE.LatheGeometry(pts, DETAIL[lod].lathe); g.scale(1, 1, depth); return g;
}

// Male torso: hips to shoulders, a little narrower than the head, squashed front to back.
const MALE_TORSO = [[0, 3.5], [.98, 3.53], [1.13, 3.8], [1.15, 3.97], [1.15, 4.6], [1.14, 5.4], [1.19, 6.2], [1.17, 6.7], [.95, 7.1], [.55, 7.38], [0, 7.45]];
// Female dress: narrow at the shoulders, flaring to a wide hem above the knee. Lathe profiles run bottom to top,
// or the faces wind inwards and get culled.
const DRESS = [[0, 2.62], [1.9, 2.64], [1.98, 2.76], [1.93, 2.95], [1.66, 3.9], [1.36, 5.0], [1.18, 6.0], [1.17, 6.7], [.95, 7.1], [.55, 7.38], [0, 7.45]];
// Shade under the head: the top of the chest and the neck sit in the head's shadow.
const chestAo = (p: THREE.Vector3) => 1 - .3 * smooth(6.1, 7.35, p.y);

// A fist: a round ball, slightly flattened at the sides, with a thumb on the front.
function hand(at: THREE.Vector3, side: number, lod: Lod) {
  const d = DETAIL[lod], palm = new THREE.SphereGeometry(1, d.ball, d.ballRings); palm.scale(.43, .5, .45); palm.translate(at.x, at.y, at.z);
  const thumb = new THREE.SphereGeometry(1, d.small[0], d.small[1]); thumb.scale(.17, .24, .17); thumb.rotateZ(side * .5); thumb.translate(at.x - side * .2, at.y + .14, at.z + .34);
  return [palm, thumb];
}
// A shoe: rounded toe in front, flat sole underneath.
function shoe(at: THREE.Vector3, lod: Lod) {
  const d = DETAIL[lod], g = new THREE.SphereGeometry(1, d.ball, d.ballRings), p = g.getAttribute("position"), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const front = Math.max(0, v.z);
    let x = v.x * (.46 + .06 * front), y = v.y * .36, z = v.z * (v.z > 0 ? .86 : .5) + .2;
    if (y < -.2) y = -.2 - (y + .2) * .15; // flat sole
    if (v.z > 0) y -= .06 * front; // toe drops a little
    p.setXYZ(i, x + at.x, y + at.y, z + at.z);
  }
  g.computeVertexNormals(); return g;
}

export function miiBody(female: boolean, lod: Lod = 0): MiiShape {
  const parts: Part[] = [], d = DETAIL[lod];
  if (female) parts.push({ g: lathe(DRESS, .8, lod), region: 0, ao: p => chestAo(p) * (p.y < 2.75 ? .82 : 1) });
  // The shirt ends at the hips; the trousers start just above the legs.
  else parts.push({ g: lathe(MALE_TORSO, .78, lod), region: p => (p.y < 3.95 ? 1 : 0), ao: p => chestAo(p) * (p.y < 3.95 ? .9 : 1) });
  const neck = new THREE.CylinderGeometry(.42, .46, 1.3, d.limb, 1, true); neck.translate(0, 7.65, 0);
  parts.push({ g: neck, region: 2, ao: () => .58 });
  const hip = MII_HIP[female ? 1 : 0], legR = female ? .42 : .48, wrist = MII_WRIST[female ? 1 : 0], elbow = MII_ELBOW[female ? 1 : 0];
  for (const side of [-1, 1]) {
    const upper = side < 0 ? 1 : 2, fore = side < 0 ? 5 : 6, leg = side < 0 ? 3 : 4;
    // Legs: darker high up where the dress or the shirt hangs over them.
    const knee=new THREE.Vector3(side*hip.x,(hip.y+.55)/2,.01),shin=side<0?7:8;
    for(const [a,b,bone,r1,r2] of [[new THREE.Vector3(side*hip.x,hip.y,0),knee,leg,legR,legR*.94],[knee,new THREE.Vector3(side*hip.x,.55,.02),shin,legR*.94,legR*.88]] as const)for(const g of limb(a,b,r1,r2,lod))parts.push({g,region:1,bone});
    const foot = new THREE.Vector3(side * hip.x, .37, .14);
    parts.push({ g: shoe(foot, lod), region: p => (p.y < foot.y - .17 ? 4 : 3), bone: shin, ball: foot });
    // Arms: upper arm and forearm meet at the elbow; the forearm and fist turn together.
    const s = new THREE.Vector3(side * MII_SHOULDER.x, MII_SHOULDER.y, 0), e = new THREE.Vector3(side * elbow.x, elbow.y, .02), w = new THREE.Vector3(side * wrist.x, wrist.y, .05);
    for (const g of limb(s, e, .4, .38, lod)) parts.push({ g, region: 0, bone: upper, ao: p => .86 + .14 * smooth(6.9, 6.2, p.y) });
    for (const g of limb(e, w, .38, .35, lod)) parts.push({ g, region: 0, bone: fore });
    const palm = new THREE.Vector3(w.x + side * .03, w.y - .3, w.z + .03);
    for (const g of hand(palm, side, lod)) parts.push({ g, region: 0, bone: fore, ball: palm });
  }
  return build(parts);
}

// The body as a BufferGeometry with the per-vertex attributes the body material reads (aPart = bone, region, occlusion; aBall).
export function miiBodyGeometry(female: boolean, lod: Lod = 0) {
  const s = miiBody(female, lod), g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(s.positions, 3));
  g.setAttribute("aClothRest", new THREE.Float32BufferAttribute(s.positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(s.normals, 3));
  // Bone, region and occlusion share one attribute (a vertex shader has only 16 attribute slots, and the instanced pose uses many).
  g.setAttribute("aPart", new THREE.Float32BufferAttribute(s.bones.flatMap((b, i) => [b, s.regions[i], s.ao[i]]), 3));
  g.setAttribute("aBall", new THREE.Float32BufferAttribute(s.balls, 4));
  g.setIndex(s.indices);
  return g;
}
// Head, hair and hats as BufferGeometry, with the ambient-occlusion factor as a grey vertex colour (multiplied with the instance tint).
export function shapeGeometry(s: MiiShape) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(s.positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(s.normals, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(s.ao.flatMap(a => [a, a, a]), 3));
  g.setIndex(s.indices);
  return g;
}

// Head: a rounded block with a flat face at the front, a small nose and ears. Its origin is the neck joint.
export function miiHead(lod: Lod = 0, flatFace=false,referenceShape=false): MiiShape {
  const d = DETAIL[lod], face = new THREE.SphereGeometry(1, d.head[0], d.head[1]), p = face.getAttribute("position"), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // Squarer than a sphere (a superellipse), wider at the cheeks than at the chin.
    const sq = (x: number) => Math.sign(x) * Math.pow(Math.abs(x), .82);
    let x = sq(v.x) * 2.7, y = sq(v.y) * 2.35 + 2.38, z = sq(v.z) * 3.1;
    // Our own procedural shape, guided by the broad cheeks, soft jaw and flat
    // front seen in the reference. No extracted vertices or UVs are used.
    if(referenceShape){x=Math.sign(v.x)*Math.pow(Math.abs(v.x),.9)*2.68;y=v.y*2.32+2.38;z=v.z*3.08;if(y<1.65)x*=.76+.24*Math.max(0,y)/1.65;}
    if (y < 1.4) x *= .82 + .18 * (y / 1.4);
    if (z > 2.3) z = 2.3;
    p.setXYZ(i, x, y, z);
  }
  face.computeVertexNormals();
  const nose = new THREE.SphereGeometry(1, d.small[0], d.small[1]); nose.scale(.3, .36, .4); nose.translate(0, 2.02, 2.3);
  const ears = [-1, 1].map(side => { const e = new THREE.SphereGeometry(1, d.small[0], d.small[1]); e.scale(.26, .46, .36); e.translate(side * 2.6, 2.6, .25); return { g: e, region: 2, ao: () => .9 }; });
  if(flatFace)nose.dispose();
  // Under the chin and at the back of the jaw the head is darker (soft occlusion against the neck and collar).
  return build([{ g: face, region: 2, ao: q => .78 + .22 * smooth(.15, 1.5, q.y) }, ...(flatFace?[]:[{ g: nose, region: 2 }]), ...ears]);
}

// Hair styles, each drawn as one instanced mesh for the whole crowd:
//   0 short   a cap over the top and back, a fringe at the brow, short sideburns
//   1 bob     hangs to the jaw at the sides and back
//   2 spiky   short, with tufts on top and a jagged fringe
//   3 long    falls past the shoulders at the back and sides
//   4 pigtails  a fuller short cap with a bunch on each side
//   5 curly   a round, bumpy mop
// The front stays clear of the face: there the hair stops at the brow line. The edge of the fringe is folded in
// towards the forehead, which closes the thin light seam that used to show between fringe and brow in close views.
export const HAIR_STYLES = 6;
export function miiHair(style = 0, lod: Lod = 0): MiiShape {
  const d = DETAIL[lod], bob = style === 1, long = style === 3, curly = style === 5, spiky = style === 2, hangs = bob || long;
  const rings = hangs ? Math.round(d.hair[1] * (long ? 1.2 : 1)) : Math.round(d.hair[1] * .75);
  const cap = new THREE.SphereGeometry(1, d.hair[0], rings, 0, Math.PI * 2, 0, Math.PI * (hangs ? .97 : curly ? .8 : .74)), p = cap.getAttribute("position"), v = new THREE.Vector3();
  const R = { short: [2.98, 2.55, 3.35], bob: [3.45, 2.62, 3.55], long: [3.4, 2.62, 3.5], spiky: [3.0, 2.6, 3.36], tails: [3.08, 2.6, 3.42], curly: [3.45, 2.95, 3.7] };
  const [rx, ry, rz] = [R.short, R.bob, R.spiky, R.long, R.tails, R.curly][style];
  const fringe = bob || long ? 2.25 : 2.2, edgeFront = bob || long ? 2.0 : .9;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const az = Math.atan2(v.x, v.z), el = Math.asin(Math.max(-1, Math.min(1, v.y)));
    let bump = 1;
    if (spiky) bump += .2 * Math.max(0, Math.sin(az * 7 + 1) * Math.sin(el * 6)) * smooth(-.1, .5, v.y);
    if (curly) bump += .07 * Math.sin(az * 9) * Math.sin(el * 9 + 1);
    // Bob and long hair hang nearly straight below the widest point instead of curling in under the head.
    const hang = hangs && v.y < 0, ring = Math.hypot(v.x, v.z), widen = hang && ring > 1e-4 ? Math.max(ring, 1) / ring : 1;
    const x = v.x * rx * widen * bump, z = v.z * rz * widen * bump - .3;
    let y = hang ? 4.15 + v.y * (long ? 5.6 : 3.75) : v.y * ry * bump + 4.15;
    if (long && hang && z > -.4) y = Math.max(y, 4.15 + v.y * 3.75 + (z > 1.2 ? 2.5 : 0)); // shorter at the front so the face stays clear
    // Clear the face: the front part stops at the brow (a jagged line for spiky hair).
    const brow = 3.85 + (spiky ? .22 * Math.abs(Math.sin(v.x * 5.5)) : 0);
    if (z > edgeFront || (z > -.6 && Math.abs(x) < fringe)) y = Math.max(y, brow + Math.max(0, z) * .06);
    p.setXYZ(i, x, y, z);
  }
  // Fold the lowest ring of the fringe in towards the forehead so no gap shows under it.
  cap.computeVertexNormals();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    if (v.z > 1.2 && v.y < 3.95 + v.z * .06 && Math.abs(v.x) < fringe) p.setZ(i, Math.min(v.z, 2.36 + (v.z - 2.36) * .25));
  }
  cap.computeVertexNormals(); // the folded edge faces the viewer now; stale normals lit it like a bright rim
  const parts: Part[] = [{ g: cap, region: 0, ao: q => .72 + .28 * smooth(hangs ? 2.2 : 3.7, hangs ? 4.6 : 5.2, q.y) }];
  if (style === 4) for (const side of [-1, 1]) {
    const tail = new THREE.SphereGeometry(1, d.small[0] + 4, d.small[1] + 2); tail.scale(.72, 1.55, .78); tail.rotateZ(side * .55); tail.translate(side * 3.55, 2.9, -.7);
    parts.push({ g: tail, region: 0, ao: q => .78 + .22 * smooth(1.7, 3.6, q.y) });
  }
  return build(parts);
}
/** The same fitted hair mesh is used by the creator, personal Mii and NPC crowd. */
export function miiFittedHair(style:number,hat:number,lod:Lod=0){
 const shape=miiHair(style,lod);
 if(hat<0||hat===3)return shape;
 const g=shapeGeometry(shape),p=g.getAttribute('position');
 for(let i=0;i<p.count;i++){
  let x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  if(y>3.85){const radius=Math.sqrt((x/3.05)**2+((z+.25)/3.35)**2);if(radius>1){x/=radius;z=(z+.25)/radius-.25;}y=Math.min(6.35,3.85+(y-3.85)*.7);}
  p.setXYZ(i,x,y,z);
 }
 g.computeVertexNormals();shape.positions=Array.from(p.array);shape.normals=Array.from(g.getAttribute('normal').array);g.dispose();return shape;
}
// Hats, worn over short hair: 0 a cap with a peak, 1 a knitted beanie with a turned-up band.
export const HAT_STYLES = 5;
export function miiHat(style = 0, lod: Lod = 0): MiiShape {
 const d=DETAIL[lod],parts:Part[]=[];
 const add=(g:THREE.BufferGeometry,ao=.9)=>parts.push({g,region:0,ao:()=>ao});
 const cap=(height:number)=>{const g=new THREE.SphereGeometry(1,d.hair[0],Math.round(d.hair[1]*.65),0,Math.PI*2,0,Math.PI*.51);g.scale(3.18,height,3.5);g.translate(0,3.95,-.25);add(g);};
 const band=(y:number,r=3.16)=>{const g=new THREE.TorusGeometry(r,.15,8,d.hair[0]);g.rotateX(Math.PI/2);g.scale(1,1,1.1);g.translate(0,y,-.25);add(g,.78);};
 if(style===0){cap(2.7);band(4.08);const peak=new THREE.CylinderGeometry(2.2,2.2,.14,d.hair[0],1,false,-Math.PI/2,Math.PI);peak.scale(1,1,.9);peak.rotateX(.08);peak.translate(0,4.04,2.4);add(peak,.8);const seam=new THREE.TorusGeometry(1,.035,5,24,Math.PI);seam.scale(3.2,2.68,1);seam.rotateX(Math.PI/2);seam.translate(0,4.05,-.25);add(seam,.72);}
 else if(style===1){cap(2.85);band(4.05,3.2);band(4.35,3.17);const pom=new THREE.SphereGeometry(.5,16,12);pom.translate(0,7.12,-.25);add(pom);}
 else if(style===2){const top=new THREE.CylinderGeometry(2.7,3.15,2.25,d.hair[0]);top.scale(1,1,1.1);top.translate(0,5.1,-.25);add(top);const brim=new THREE.CylinderGeometry(4.4,4.4,.17,d.hair[0]);brim.scale(1,1,1.08);brim.translate(0,3.98,-.25);add(brim,.82);band(4.25,3.09);}
 else if(style===3){const base=new THREE.CylinderGeometry(3.2,3.2,.8,d.hair[0],1,true);base.scale(1,1,1.1);base.translate(0,4.8,-.25);add(base);band(4.42);for(let i=0;i<7;i++){const a=i/7*Math.PI*2,g=new THREE.ConeGeometry(.6,1.45,4);g.translate(Math.cos(a)*3.1,5.8,Math.sin(a)*3.4-.25);add(g);const gem=new THREE.SphereGeometry(.22,8,6);gem.translate(Math.cos(a)*3.12,4.85,Math.sin(a)*3.44-.25);add(gem,.6);}}
 else {cap(2.9);band(4.05,3.21);for(const side of [-1,1]){const pad=new THREE.SphereGeometry(1,16,12);pad.scale(.38,.9,.85);pad.translate(side*2.95,3.7,.05);add(pad,.7);}const ridge=new THREE.BoxGeometry(.16,.25,5.5);ridge.translate(0,6.8,-.2);add(ridge,.76);}
 return build(parts);
}

// Real Mii body scale from the Mii's height and build (0-127 each, 64 is the default), as computed by the
// console (nn::mii GetBodyScale): y from the height, x = z from both. Returned relative to the default Mii,
// which is what the model above is drawn at. The head is never scaled; it sits on the scaled neck.
export function miiBodyScale(height: number, buildValue: number) {
  const x = (h: number, b: number) => (b * (h * (.47 / 128) + .4)) / 128 + h * (.23 / 128) + .4, y = (h: number) => h * (.77 / 128) + .5;
  return { x: x(height, buildValue) / x(64, 64), y: y(height) / y(64) };
}

// Pose channels, written per Mii per frame into three per-instance vec4 attributes:
//   aArmL / aArmR = (raise: away from the body, pitch: forward, elbow in: towards the body, elbow bend: forward)
//   aLegs = (left leg forward, right leg forward, torso lean forward, torso lean to the Mii's left)
// All angles in radians. The CPU only blends these numbers; the vertex shader turns every limb rigidly.
export const POSE = { LR: 0, LP: 1, LEZ: 2, LEX: 3, RR: 4, RP: 5, REZ: 6, REX: 7, LL: 8, RL: 9, TP: 10, TR: 11, HY: 12, HP: 13, HR: 14, Y: 15, LK:16, RK:17, LS:18, RS:19, LT:20, RT:21, TY:22 } as const;
export const POSE_SIZE = 23;
// Two signed angles in one exact 22-bit integer, keeping NPCs within 16 vertex attributes.
export const packMiiArm=(inward:number,twist:number)=>Math.round(Math.max(0,Math.min(2047,(inward+4)*256)))*2048+Math.round(Math.max(0,Math.min(2047,(twist+4)*256)));
export const packMiiOutfit=(outfit:number,yaw:number)=>outfit+Math.max(.001,Math.min(.999,(yaw+4)/8));

// Shared look for every Mii material: soft "toon" falloff of the sun (a wide, smooth terminator instead of a hard
// Lambert edge), a soft rim light that separates the Miis from the pale floor, and an optional faint highlight (hair).
export function miiShade(m: THREE.Material, opts: { gloss?: number; rim?: number } = {}) {
  const prev = m.onBeforeCompile.bind(m), prevKey = m.customProgramCacheKey.bind(m);
  m.customProgramCacheKey = () => prevKey() + "|mii-shade" + JSON.stringify(opts);
  m.onBeforeCompile = (shader, renderer) => {
    prev(shader, renderer);
    const lambert = THREE.ShaderChunk.lights_lambert_pars_fragment.replace(
      "float dotNL = saturate( dot( geometry.normal, directLight.direction ) );",
      `float miiNL = dot( geometry.normal, directLight.direction );
  float dotNL = mix( smoothstep( -0.25, 0.75, miiNL ), saturate( miiNL ), 0.35 );
  ${opts.gloss ? `reflectedLight.directDiffuse += pow( saturate( dot( geometry.normal, normalize( directLight.direction + geometry.viewDir ) ) ), 22.0 ) * ${opts.gloss.toFixed(3)} * directLight.color;` : ""}`);
    shader.fragmentShader = shader.fragmentShader.replace("#include <lights_lambert_pars_fragment>", lambert).replace("#include <opaque_fragment>",
      `float miiRim = pow( 1.0 - saturate( dot( normal, normalize( vViewPosition ) ) ), 2.6 );
  outgoingLight += vec3( 0.95, 0.98, 1.0 ) * miiRim * ${(opts.rim ?? .22).toFixed(3)} * ( 0.25 + 0.75 * diffuseColor.rgb );
  #include <opaque_fragment>`);
  };
  return m;
}

const SHADER_HEAD = `attribute vec3 aClothRest;
attribute vec4 aArmL;
attribute vec4 aArmR;
attribute vec4 aLegs;
attribute vec4 aKnees;
attribute vec3 aPart;
// Limb dimensions follow body scale; free one attribute slot for knee poses.
const vec4 aBall=vec4(0.0);
attribute vec4 aShirt;
attribute vec4 aPants;
attribute vec4 aSkin;
varying vec3 vOutfitPosition;
varying float vOutfit;
varying float vClothing;
mat3 miiRotX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0, 0.0,c,s, 0.0,-s,c);}
mat3 miiRotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.0,-s, 0.0,1.0,0.0, s,0.0,c);}
mat3 miiRotZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.0, -s,c,0.0, 0.0,0.0,1.0);}
`;
const f = (n: number) => n.toFixed(3);
// Posing: the body scale is applied to the rest pose first (as the console scales the bones), then the forearm turns
// about the elbow, the whole arm about the shoulder, each leg about its hip, and everything above the hips bends about
// the waist with a weight that grows from the hips to the chest. Normals get the same rotations.
const SHADER_POSE = (female: boolean) => {
  const hip = MII_HIP[female ? 1 : 0], el = MII_ELBOW[female ? 1 : 0];
  return `#include <beginnormal_vertex>
 float aBone = aPart.x, aRegion = aPart.y;
 vec2 aBuild = vec2(aShirt.w, aPants.w);
 vec3 miiScale = vec3(aBuild.x, aBuild.y, aBuild.x);
 bool miiUpper = aBone > 0.5 && aBone < 2.5, miiFore = aBone > 4.5 && aBone < 6.5, miiArm = miiUpper || miiFore, miiLeg = (aBone > 2.5 && aBone < 4.5) || aBone > 6.5;
 bool miiShin = aBone > 6.5;
 float miiSide = (aBone > 0.5 && aBone < 1.5) || (aBone > 2.5 && aBone < 3.5) || (aBone > 4.5 && aBone < 5.5) || (aBone > 6.5 && aBone < 7.5) ? -1.0 : 1.0;
 vec4 miiA = miiSide < 0.0 ? aArmL : aArmR;
 float miiTwist = mod(miiA.z,2048.0)/256.0-4.0;
 miiA.z = floor(miiA.z/2048.0)/256.0-4.0;
 mat3 miiRsh = miiRotZ(miiSide * miiA.x) * miiRotX(-miiA.y) * miiRotY(miiTwist);
 mat3 miiRel = miiRotZ(-miiSide * miiA.z) * miiRotX(-miiA.w);
 mat3 miiRleg = miiRotZ(miiSide * (miiSide < 0.0 ? aKnees.z : aKnees.w)) * miiRotX(-(miiSide < 0.0 ? aLegs.x : aLegs.y));
 vec3 miiSh = vec3(miiSide * ${f(MII_SHOULDER.x)}, ${f(MII_SHOULDER.y)}, 0.0) * miiScale;
 vec3 miiEl = vec3(miiSide * ${f(el.x)}, ${f(el.y)}, 0.02) * miiScale;
 vec3 miiHp = vec3(miiSide * ${f(hip.x)}, ${f(hip.y)}, 0.0) * miiScale;
 mat3 miiRknee = miiRotX(miiSide < 0.0 ? aKnees.x : aKnees.y);
 vec3 miiKn = vec3(miiSide * ${f(hip.x)}, ${f((hip.y+.55)/2)}, .01) * miiScale;
 vec3 miiWaist = vec3(0.0, ${f(MII_WAIST_Y)}, 0.0) * miiScale;
 float miiW = miiLeg ? 0.0 : (miiArm || aRegion > 1.5 && aRegion < 2.5 ? 1.0 : smoothstep(${f(MII_WAIST_FROM)}, ${f(MII_WAIST_TO)}, position.y));
 mat3 miiRt = miiRotY((fract(aSkin.w)*8.0-4.0)*miiW) * miiRotZ(aLegs.w * miiW) * miiRotX(aLegs.z * miiW);
 if (aBall.w < 0.5) objectNormal = normalize(objectNormal / miiScale);
 if (miiFore) objectNormal = miiRel * objectNormal;
 if (miiArm) objectNormal = miiRsh * objectNormal;
 if (miiShin) objectNormal = miiRknee * objectNormal;
 if (miiLeg) objectNormal = miiRleg * objectNormal;
 objectNormal = miiRt * objectNormal;`;
};
const SHADER_PLACE = `#include <begin_vertex>
 transformed = aBall.w > 0.5 ? aBall.xyz * miiScale + (transformed - aBall.xyz) * aBuild.x : transformed * miiScale;
 if (miiFore) transformed = miiEl + miiRel * (transformed - miiEl);
 if (miiArm) transformed = miiSh + miiRsh * (transformed - miiSh);
 if (miiShin) transformed = miiKn + miiRknee * (transformed - miiKn);
 if (miiLeg) transformed = miiHp + miiRleg * (transformed - miiHp);
 transformed = miiWaist + miiRt * (transformed - miiWaist);`;
const SHADER_COLOR = `vOutfitPosition=aClothRest;vOutfit=floor(aSkin.w);vClothing=1.0-step(0.5,aPart.y);vColor = (aPart.y < 0.5 ? aShirt.rgb : (aPart.y < 1.5 ? aPants.rgb : (aPart.y < 2.5 ? aSkin.rgb : (aPart.y < 3.5 ? aPants.rgb * 0.78 : aPants.rgb * 0.42)))) * aPart.z;`;

// The body material for one gender (the joints differ). Colours come from per-instance attributes picked by region.
export function miiBodyMaterial(female: boolean, branding?:THREE.Texture, accent="#e8f4fb", clothRest=false) {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true });
  m.onBeforeCompile = shader => {
    shader.uniforms.miiLogo={value:branding??null};shader.uniforms.miiHasLogo={value:branding?1:0};shader.uniforms.miiAccent={value:new THREE.Color(accent)};
    shader.fragmentShader = "uniform sampler2D miiLogo;uniform float miiHasLogo;uniform vec3 miiAccent;varying vec3 vOutfitPosition;varying float vOutfit;varying float vClothing;\n" + shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
 if(vClothing>.5){float mark=0.0;float style=mod(floor(vOutfit+.5),16.0);float host=step(15.5,vOutfit);float x=vOutfitPosition.x;float y=vOutfitPosition.y;
 if(style>.5&&style<1.5)mark=step(.55,fract(y*1.3));
 else if(style>1.5&&style<2.5)mark=1.0-step(.075,abs(x));
 else if(style>2.5&&style<3.5)mark=1.0-step(.12,abs(y-5.1-abs(x)*.6));
 else if(style>3.5&&style<4.5)mark=max(1.0-step(.07,abs(x)),1.0-step(.11,abs(y-4.2)));
 else if(style>4.5&&style<5.5)mark=step(6.25,y)*(1.0-step(.65,abs(x)));
 else if(style>5.5&&style<6.5)mark=max(step(.7,abs(x))*step(5.5,y),1.0-step(5.2,y));
 else if(style>6.5&&style<7.5)mark=max(1.0-step(.1,abs(abs(x)-.85)),1.0-step(.1,abs(y-4.3)));
 else if(style>7.5&&style<8.5)mark=1.0-step(.08,abs(abs(x)-(y-5.0)*.45));
 else if(style>8.5)mark=max(1.0-step(.13,abs(y-4.3)),1.0-step(.12,abs(y-6.6+abs(x)*.6)));
 vec3 trim=mix(vec3(.92),miiAccent,host);diffuseColor.rgb=mix(diffuseColor.rgb,trim,mark*.7);
 if(host>.5&&miiHasLogo>.5&&vOutfitPosition.z>.3){vec2 uv=vec2(x/1.55+.5,(y-5.65)/.78+.5);if(uv.x>0.0&&uv.x<1.0&&uv.y>0.0&&uv.y<1.0){vec4 badge=texture2D(miiLogo,uv);diffuseColor.rgb=mix(diffuseColor.rgb,badge.rgb,badge.a);}}
 }

 `);
    shader.vertexShader = (clothRest?SHADER_HEAD:SHADER_HEAD.replace("attribute vec3 aClothRest;", "")) + shader.vertexShader.replace("#include <beginnormal_vertex>", SHADER_POSE(female)).replace("#include <begin_vertex>", SHADER_PLACE).replace("#include <color_vertex>", clothRest?SHADER_COLOR:SHADER_COLOR.replace("vOutfitPosition=aClothRest;", "vOutfitPosition=position;"));
  };
  m.customProgramCacheKey = () => "mii-body-wardrobe-v3-" + (female ? "f" : "m")+String(clothRest);
  return miiShade(m);
}

// ---- Face decals ----------------------------------------------------------------------------------------------
// Eyes, brows, mouth, moustache and cheeks are small quads on the flat front of the head, textured from one
// 512 x 512 atlas of 64 px cells, all drawn in a single instanced draw call for the whole crowd. Which cell each
// part shows is a per-instance attribute, so blinking, talking, laughing and surprise only change numbers.
// The atlas is painted in three masks: red = white (eye whites, teeth, highlights), green = the part's tint
// (iris colour, hair colour for brows and moustaches, lip colour, blush), blue = the part's dark ink.
export const FACE = {
  eyes: 10, EYE_BLINK: 10, EYE_HAPPY: 11, EYE_WIDE: 12,
  brows: 8, BROW0: 13,
  mouths: 10, MOUTH0: 21, MOUTH_TALK: 31, MOUTH_O: 32, MOUTH_LAUGH: 33, MOUTH_SMILE_OPEN: 34,
  moustaches: 4, MOUSTACHE0: 35, NONE: 63,
  CHEEK_BLUSH: 39, CHEEK_FRECKLES: 40,
} as const;
const W = "#ff0000", T = "#00ff00", D = "#0000ff";
export function miiFaceAtlas(): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = c.height = 512;
  const x = c.getContext("2d")!;
  const cell = (i: number, draw: () => void) => { x.save(); x.translate((i % 8) * 64, Math.floor(i / 8) * 64); x.beginPath(); x.rect(2, 2, 60, 60); x.clip(); draw(); x.restore(); };
  const ell = (cx: number, cy: number, rx: number, ry: number, color: string, rot = 0) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); x.fillStyle = color; x.fill(); };
  const stroke = (color: string, w: number, path: () => void) => { x.beginPath(); path(); x.strokeStyle = color; x.lineWidth = w; x.lineCap = "round"; x.lineJoin = "round"; x.stroke(); };
  // Eyes (the Mii's right eye as seen from the front; the other side is mirrored). 32,32 is the eye centre.
  // [white rx, ry, iris r, tilt, lid weight, lashes, iris y]
  const EYES: [number, number, number, number, number, number, number][] = [
    [12, 14, 8.5, 0, 2.6, 0, 1], [13, 16, 10, 0, 2.2, 0, 1], [0, 0, 0, 0, 0, 0, 0], [13, 9, 7.5, 0, 3.4, 0, 2],
    [13, 12, 8, -.22, 2.6, 0, 1], [13, 12, 8, .2, 2.4, 0, 1], [12, 14, 8.5, -.1, 2.6, 1, 1], [12, 15, 10.5, 0, 2.2, 0, 2],
    [9, 15, 7, 0, 2.0, 0, 0], [14, 8, 6.5, -.12, 3.2, 1, 1]];
  EYES.forEach(([rx, ry, ir, tilt, lid, lash, iy], i) => cell(i, () => {
    if (!rx) { ell(32, 33, 6.5, 9.5, D); ell(30, 29, 2, 2.4, W); return; } // simple dot eyes
    x.save(); x.translate(32, 33); x.rotate(tilt); x.translate(-32, -33);
    ell(32, 33, rx, ry, W);
    x.save(); x.beginPath(); x.ellipse(32, 33, rx, ry, 0, 0, Math.PI * 2); x.clip();
    ell(32, 33 + iy, ir, ir * 1.08, T); ell(32, 33 + iy, ir * .5, ir * .56, D); ell(28.5, 29 + iy, ir * .26, ir * .3, W);
    x.restore();
    stroke(D, lid, () => x.ellipse(32, 33, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.95));
    stroke(D, 1.2, () => x.ellipse(32, 33, rx, ry, 0, 0, Math.PI * 2));
    if (lash) stroke(D, 2, () => { x.moveTo(32 - rx * .92, 33 - ry * .45); x.lineTo(32 - rx - 4, 33 - ry * .75); x.moveTo(32 - rx * .7, 33 - ry * .8); x.lineTo(32 - rx - 1, 33 - ry - 3); });
    x.restore();
  }));
  cell(FACE.EYE_BLINK, () => stroke(D, 3, () => { x.moveTo(20, 34); x.quadraticCurveTo(32, 39, 44, 34); }));
  cell(FACE.EYE_HAPPY, () => stroke(D, 3.4, () => { x.moveTo(20, 37); x.quadraticCurveTo(32, 22, 44, 37); }));
  cell(FACE.EYE_WIDE, () => { ell(32, 32, 14, 16, W); ell(32, 32, 4.5, 4.8, D); stroke(D, 1.6, () => x.ellipse(32, 32, 14, 16, 0, 0, Math.PI * 2)); });
  // Brows, in the hair colour: level, thick, arched, angry, worried, short, thin curve, bushy.
  const BROWS: [number, number, number, number, number][] = [[0, 0, 0, 3.2, 26], [0, 0, 0, 5.2, 26], [0, -6, 0, 3, 26], [-4, 0, 5, 4, 26], [4, 0, -5, 3.6, 26], [0, 0, 0, 5.4, 16], [0, -4, 0, 2.2, 28], [0, -2, 0, 6.6, 28]];
  BROWS.forEach(([outer, arch, inner, w, len], i) => cell(FACE.BROW0 + i, () => stroke(T, w, () => { const l = 32 - len / 2, r = 32 + len / 2; x.moveTo(l, 32 + outer); x.quadraticCurveTo(32, 30 + arch, r, 32 + inner); })));
  // Mouths: lips in the Mii's mouth colour, dark inside, white teeth.
  const mouths: (() => void)[] = [
    () => stroke(T, 3.2, () => { x.moveTo(20, 30); x.quadraticCurveTo(32, 40, 44, 30); }),
    () => { x.beginPath(); x.moveTo(17, 28); x.quadraticCurveTo(32, 50, 47, 28); x.closePath(); x.fillStyle = D; x.fill(); x.beginPath(); x.moveTo(19, 29); x.lineTo(45, 29); x.lineTo(43, 33); x.lineTo(21, 33); x.fillStyle = W; x.fill(); stroke(T, 2.4, () => { x.moveTo(17, 28); x.quadraticCurveTo(32, 50, 47, 28); x.closePath(); }); },
    () => { ell(32, 32, 4.5, 5.5, D); stroke(T, 2.2, () => x.ellipse(32, 32, 4.5, 5.5, 0, 0, Math.PI * 2)); },
    () => stroke(T, 3, () => { x.moveTo(22, 32); x.lineTo(42, 32); }),
    () => stroke(T, 3, () => { x.moveTo(21, 33); x.quadraticCurveTo(34, 36, 44, 28); }),
    () => { x.beginPath(); x.moveTo(20, 29); x.quadraticCurveTo(32, 44, 44, 29); x.quadraticCurveTo(32, 32, 20, 29); x.fillStyle = D; x.fill(); stroke(T, 2.4, () => { x.moveTo(20, 29); x.quadraticCurveTo(32, 44, 44, 29); x.quadraticCurveTo(32, 32, 20, 29); }); },
    () => { x.beginPath(); x.moveTo(14, 27); x.quadraticCurveTo(32, 48, 50, 27); x.closePath(); x.fillStyle = W; x.fill(); stroke(D, 1.4, () => { for (const t of [21, 27, 32, 37, 43]) { x.moveTo(t, 28); x.lineTo(t, 37); } x.moveTo(15, 33); x.lineTo(49, 33); }); stroke(T, 2.4, () => { x.moveTo(14, 27); x.quadraticCurveTo(32, 48, 50, 27); x.closePath(); }); },
    () => stroke(T, 3.2, () => { x.moveTo(21, 36); x.quadraticCurveTo(32, 26, 43, 36); }),
    () => stroke(T, 2.6, () => { x.moveTo(20, 30); x.quadraticCurveTo(26, 37, 32, 31); x.quadraticCurveTo(38, 37, 44, 30); }),
    () => stroke(T, 2.8, () => { x.moveTo(25, 31); x.quadraticCurveTo(32, 36, 39, 31); }),
  ];
  mouths.forEach((draw, i) => cell(FACE.MOUTH0 + i, draw));
  cell(FACE.MOUTH_TALK, () => { ell(32, 32, 8, 6.5, D); ell(32, 36, 5, 2.4, T); stroke(T, 2.2, () => x.ellipse(32, 32, 8, 6.5, 0, 0, Math.PI * 2)); });
  cell(FACE.MOUTH_O, () => { ell(32, 33, 6, 8, D); stroke(T, 2.4, () => x.ellipse(32, 33, 6, 8, 0, 0, Math.PI * 2)); });
  cell(FACE.MOUTH_LAUGH, () => { x.beginPath(); x.moveTo(16, 26); x.quadraticCurveTo(32, 54, 48, 26); x.closePath(); x.fillStyle = D; x.fill(); ell(32, 41, 7, 4, T); x.beginPath(); x.moveTo(18, 27); x.lineTo(46, 27); x.lineTo(44, 31); x.lineTo(20, 31); x.fillStyle = W; x.fill(); stroke(T, 2.4, () => { x.moveTo(16, 26); x.quadraticCurveTo(32, 54, 48, 26); x.closePath(); }); });
  cell(FACE.MOUTH_SMILE_OPEN, () => { x.beginPath(); x.moveTo(19, 29); x.quadraticCurveTo(32, 46, 45, 29); x.closePath(); x.fillStyle = D; x.fill(); ell(32, 38, 5, 2.5, T); stroke(T, 2.4, () => { x.moveTo(19, 29); x.quadraticCurveTo(32, 46, 45, 29); x.closePath(); }); });
  // Moustaches, in the hair colour: full, thin, handlebar, and the moustache of a full beard.
  const tache: (() => void)[] = [
    () => { x.beginPath(); x.moveTo(14, 36); x.quadraticCurveTo(22, 22, 32, 28); x.quadraticCurveTo(42, 22, 50, 36); x.quadraticCurveTo(32, 32, 14, 36); x.fillStyle = T; x.fill(); },
    () => stroke(T, 3, () => { x.moveTo(20, 33); x.quadraticCurveTo(32, 26, 44, 33); }),
    () => { stroke(T, 4, () => { x.moveTo(32, 29); x.quadraticCurveTo(20, 28, 14, 34); x.quadraticCurveTo(12, 37, 10, 33); x.moveTo(32, 29); x.quadraticCurveTo(44, 28, 50, 34); x.quadraticCurveTo(52, 37, 54, 33); }); },
    () => { x.beginPath(); x.moveTo(12, 38); x.quadraticCurveTo(22, 24, 32, 29); x.quadraticCurveTo(42, 24, 52, 38); x.lineTo(52, 42); x.quadraticCurveTo(32, 34, 12, 42); x.fillStyle = T; x.fill(); },
  ];
  tache.forEach((draw, i) => cell(FACE.MOUSTACHE0 + i, draw));
  cell(FACE.CHEEK_BLUSH, () => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 16); g.addColorStop(0, "rgba(0,255,0,.85)"); g.addColorStop(1, "rgba(0,255,0,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
  cell(FACE.CHEEK_FRECKLES, () => { for (const [a, b] of [[24, 28], [32, 30], [40, 28], [28, 36], [36, 36]]) ell(a, b, 1.6, 1.6, D); });
  return c;
}
// One quad per face part: [part, side, centre x, centre y, size, z]. Parts: 0 eye, 1 brow, 2 mouth, 3 moustache, 4 cheek.
const FACE_QUADS: [number, number, number, number, number, number][] = [
  [4, -1, -1.45, 1.86, 1.0, 2.304], [4, 1, 1.45, 1.86, 1.0, 2.304],
  [0, -1, -.86, 2.78, 1.2, 2.31], [0, 1, .86, 2.78, 1.2, 2.31],
  [1, -1, -.9, 3.42, 1.1, 2.312], [1, 1, .9, 3.42, 1.1, 2.312],
  [2, 0, 0, 1.12, 1.4, 2.31], [3, 0, 0, 1.46, 1.5, 2.316]];
export function miiFaceGeometry() {
  const pos: number[] = [], uv: number[] = [], part: number[] = [], side: number[] = [], idx: number[] = [], nrm: number[] = [];
  FACE_QUADS.forEach(([p, s, cx, cy, size, z], q) => {
    const h = size / 2;
    for (const [dx, dy, u, v] of [[-h, -h, 0, 0], [h, -h, 1, 0], [h, h, 1, 1], [-h, h, 0, 1]]) { pos.push(cx + dx, cy + dy, z); nrm.push(0, 0, 1); uv.push(s > 0 ? 1 - u : u, v); part.push(p); side.push(s); }
    idx.push(q * 4, q * 4 + 1, q * 4 + 2, q * 4, q * 4 + 2, q * 4 + 3);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute("aPart", new THREE.Float32BufferAttribute(part, 1)); g.setAttribute("aSide", new THREE.Float32BufferAttribute(side, 1)); g.setIndex(idx);
  return g;
}
// Per-instance: aFace = (eye cell, brow cell, mouth cell, moustache cell), aFace2 = (cheek cell, eye spacing, eye height, mouth height),
// aEyeCol, aHairCol, aLipCol. The eyes and brows move together; the moustache follows the mouth a little.
export function miiFaceMaterial(atlas: THREE.Texture) {
  const m = new THREE.MeshLambertMaterial({ map: atlas, alphaTest: .45, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  m.alphaToCoverage = true;
  m.onBeforeCompile = shader => {
    shader.vertexShader = `attribute float aPart;
attribute float aSide;
attribute vec4 aFace;
attribute vec4 aFace2;
attribute vec3 aEyeCol;
attribute vec3 aHairCol;
attribute vec3 aLipCol;
varying vec2 vFaceUv;
varying vec3 vTint;
varying vec3 vInk;
` + shader.vertexShader.replace("#include <uv_vertex>", `#include <uv_vertex>
 float miiCell = aPart < 0.5 ? aFace.x : aPart < 1.5 ? aFace.y : aPart < 2.5 ? aFace.z : aPart < 3.5 ? aFace.w : aFace2.x;
 vFaceUv = (vec2(mod(miiCell, 8.0), 7.0 - floor(miiCell / 8.0)) + uv) / 8.0;
 vTint = aPart < 0.5 ? aEyeCol : aPart < 1.5 || (aPart > 2.5 && aPart < 3.5) ? aHairCol : aPart < 2.5 ? aLipCol : vec3(0.94, 0.33, 0.3);
 vInk = aPart < 0.5 ? vec3(0.012, 0.012, 0.014) : aPart < 2.5 ? vec3(0.09, 0.012, 0.01) : vec3(0.2, 0.08, 0.03);`).replace("#include <begin_vertex>", `#include <begin_vertex>
 if (aPart < 1.5) { transformed.x += aSide * aFace2.y; transformed.y += aFace2.z; }
 else if (aPart < 2.5) transformed.y += aFace2.w;
 else if (aPart < 3.5) transformed.y += aFace2.w * 0.6;`);
    shader.fragmentShader = `varying vec2 vFaceUv;
varying vec3 vTint;
varying vec3 vInk;
` + shader.fragmentShader.replace("#include <map_fragment>", `vec4 miiTex = texture2D( map, vFaceUv );
 float miiSum = max( miiTex.r + miiTex.g + miiTex.b, 1e-3 );
 diffuseColor.rgb = ( miiTex.r * vec3( 1.0 ) + miiTex.g * vTint + miiTex.b * vInk ) / miiSum;
 diffuseColor.a *= miiTex.a;`);
  };
  m.customProgramCacheKey = () => "mii-face";
  return miiShade(m, { rim: .18 });
}

// 3D face extras that do not fit a flat decal: a full beard around the jaw and glasses (round, thick, sunglasses).
// Each variant is one InstancedMesh. Beards are painted white and tinted per instance with the Mii's hair colour.
export type Look = { glasses: number; beard: number };
export type Layer = 'beard' | 'glasses';
export function faceLayer(kind: Layer, v: number) {
  const parts: THREE.BufferGeometry[] = [], paint = (g: THREE.BufferGeometry, color: string) => { const c = new THREE.Color(color), n = g.getAttribute('position').count; g.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({ length: n }, () => c.toArray()).flat(), 3)); g.deleteAttribute('uv'); parts.push(g.index ? g.toNonIndexed() : g); };
  const blob = (x: number, y: number, z: number, sx: number, sy: number, sz: number, color: string) => { const g = new THREE.SphereGeometry(1, 16, 12); g.scale(sx, sy, sz); g.translate(x, y, z); paint(g, color); };
  if (kind === 'beard') {if(v===2)blob(0,.94,2.02,.55,.67,.35,'#ffffff');else if(v===3){blob(0,.68,1.8,1.35,.5,.6,'#ffffff');for(const side of [-1,1])blob(side*1.38,1.3,1.6,.27,.7,.35,'#ffffff');}else if(v===4){for(const side of [-1,1])blob(side*1.52,1.65,1.45,.22,.73,.4,'#ffffff');}else if(v===5)blob(0,.58,1.7,.8,1.18,.62,'#ffffff');else blob(0,1.03,1.75,1.6,1.08,.75,'#ffffff');}
  if (kind === 'glasses') {
    const thick = v === 2, dark = v === 3;
    for (const x of [-.82, .82]) { if (dark) blob(x, 2.76, 2.42, .55, .4, .05, '#16181b'); const r = new THREE.TorusGeometry(.52, thick || dark ? .12 : .07, 6, 22); r.scale(v===4?1.2:1, v===4?.65:dark ? .8 : 1, 1); r.translate(x, 2.78, 2.45); paint(r, '#2e3238'); }
    const bridge = new THREE.BoxGeometry(.5, thick ? .13 : .08, .08); bridge.translate(0, 2.88, 2.48); paint(bridge, '#2e3238');
  }
  const merged = mergeGeometries(parts); parts.forEach(g => g.dispose()); return merged;
}

// ---- Actions ----------------------------------------------------------------------------------------------------
// Each action is a pose clip: a function of its own time (seconds) that writes the pose channels above, plus optional
// face overrides (eye and mouth atlas cells). The Plaza blends from the previous clip to the next over a quarter of a
// second, so every change of state is smooth. Walking and running read the stride phase, which the Plaza advances by
// the distance actually covered, so the feet do not slide.
export type ActionName = 'idle' | 'walk' | 'run' | 'talk' | 'cheer' | 'wave' | 'jump' | 'nod' | 'clap' | 'look' | 'sit' | 'stretch' | 'surprise' | 'laugh' | 'point' | 'spin' | 'fall';
export type ClipState = { stride: number; phase: number; style: number };
type Clip = { dur?: [number, number]; pose: (o: Float32Array, t: number, k: ClipState) => void; eye?: (t: number, k: ClipState) => number | undefined; mouth?: (t: number, k: ClipState) => number | undefined; faces?: 'camera' | 'target' };
const P = POSE;
const arm = (o: Float32Array, side: number, raise: number, pitch: number, inward: number, bend: number) => { const b = side < 0 ? P.LR : P.RR; o[b] = raise; o[b + 1] = pitch; o[b + 2] = inward; o[b + 3] = bend; };
const ease = (x: number) => { const k = Math.max(0, Math.min(1, x)); return k * k * (3 - 2 * k); };
// In-and-out envelope for a clip of length d: 0 at both ends, 1 in the middle.
const env = (t: number, d: number, edge = .25) => Math.min(ease(t / edge), ease((d - t) / edge));
function idlePose(o: Float32Array, t: number, k: ClipState) {
  const breath = Math.sin(t * 1.6 + k.phase);
  o[P.TP] = .015 * breath; o[P.HY] = .06 * Math.sin(t * .37 + k.phase); o[P.HR] = .03 * Math.sin(t * .23 + k.phase * 2);
  arm(o, -1, .07 + .015 * breath, .02, 0, .14); arm(o, 1, .07 + .015 * breath, .02, 0, .14);
  if (k.style === 1) { arm(o, -1, .62, -.08, 1.9, .35); arm(o, 1, .62, -.08, 1.9, .35); } // hands on hips
  else if (k.style === 2) { arm(o, -1, .1, -.42, .55, .25); arm(o, 1, .1, -.42, .55, .25); } // hands behind the back
  else if (k.style === 3) { arm(o, 1, .12, .62, .35, 2.15); arm(o, -1, .08, .35, 1.0, 1.05); o[P.HR] += .1; o[P.HP] = .05; } // thinking, hand at the chin
  else if (k.style === 4) { const s = Math.sin(t * .7 + k.phase); o[P.TR] = .05 * s; o[P.LL] = .05 * s; o[P.RL] = -.03 * s; } // shifting weight
}
export const ACTIONS: Record<ActionName, Clip> = {
  idle: { pose: idlePose },
  walk: { pose: (o, _t, k) => { const s = Math.sin(k.stride); o[P.LL] = .42 * s; o[P.RL] = -.42 * s; arm(o, -1, .09, -.36 * s, .05, .25); arm(o, 1, .09, .36 * s, .05, .25); o[P.TP] = .05; o[P.TR] = .025 * s; o[P.HR] = -.015 * s; } },
  run: { pose: (o, _t, k) => { const s = Math.sin(k.stride); o[P.LL] = .78 * s; o[P.RL] = -.78 * s; arm(o, -1, .2, -.8 * s, .25, 1.45); arm(o, 1, .2, .8 * s, .25, 1.45); o[P.TP] = .2; o[P.HP] = -.1; o[P.Y] = .55 * Math.abs(Math.sin(k.stride)); } },
  // Talking under a speech bubble: a little bounce as the bubble pops up, then hand gestures, nods and a moving mouth.
  talk: { dur: [3, 5], pose: (o, t, k) => { idlePose(o, t, { ...k, style: 0 }); arm(o, 1, .22, .45 + .25 * Math.sin(t * 3.3 + k.phase), .3, 1.1 + .35 * Math.sin(t * 2.1)); arm(o, -1, .12, .2 + .15 * Math.sin(t * 2.7 + 1), .1, .5); o[P.Y] = t < .7 ? .55 * Math.abs(Math.sin(t * Math.PI / .35)) : .06 * Math.abs(Math.sin(t * 7)); o[P.HP] = .07 * Math.sin(t * 6.5); o[P.HR] = .05 * Math.sin(t * 1.9); },
    mouth: (t, k) => (Math.sin(t * 15 + k.phase) > -.25 && (t % 2.2) < 1.8 ? FACE.MOUTH_TALK : undefined) },
  cheer: { dur: [1.4, 2.2], faces: 'target', pose: (o, t) => { const s = Math.sin(t * 10); arm(o, -1, 1.95 + .2 * s, .15, -.5 - .25 * s, .2); arm(o, 1, 1.95 - .2 * s, .15, -.5 + .25 * s, .2); o[P.Y] = (t < 1 ? 1.5 : .3) * Math.max(0, Math.sin(t * Math.PI / .5)); o[P.TP] = -.06; o[P.HP] = -.18; }, eye: () => FACE.EYE_HAPPY, mouth: () => FACE.MOUTH_LAUGH },
  wave: { dur: [2, 3.4], faces: 'camera', pose: (o, t, k) => { idlePose(o, t, { ...k, style: 0 }); arm(o, 1, 1.3, .25, -1.55 + .42 * Math.sin(t * 9), .15); o[P.HR] = .08 * Math.sin(t * 2.2); o[P.HP] = -.12; o[P.TR] = -.04; }, mouth: () => FACE.MOUTH_SMILE_OPEN },
  jump: { dur: [1.15, 1.15], faces: 'target', pose: (o, t, k) => {
    idlePose(o, t, { ...k, style: 0 });
    if (t < .28) { const c = ease(t / .28); o[P.TP] = .22 * c; arm(o, -1, .15, -.6 * c, 0, .3); arm(o, 1, .15, -.6 * c, 0, .3); }
    else if (t < .8) { const a = (t - .28) / .52, up = Math.sin(Math.PI * a); o[P.Y] = 3 * up; arm(o, -1, 1.2 + .7 * up, .3, -.45, .3); arm(o, 1, 1.2 + .7 * up, .3, -.45, .3); o[P.LL] = .3 * up; o[P.RL] = -.15 * up; o[P.TP] = -.08; o[P.HP] = -.15; }
    else { const b = ease((t - .8) / .35); o[P.TP] = .15 * (1 - b); arm(o, -1, .07 + 1.33 * (1 - b), .02, 0, .14); arm(o, 1, .07 + 1.33 * (1 - b), .02, 0, .14); }
  }, eye: t => (t > .25 && t < .85 ? FACE.EYE_HAPPY : undefined), mouth: () => FACE.MOUTH_SMILE_OPEN },
  nod: { dur: [1.2, 1.8], pose: (o, t, k) => { idlePose(o, t, k); o[P.HP] = .26 * Math.max(0, Math.sin(t * 8.5)) * (t < 1.15 ? 1 : 0); o[P.TP] = .04; } },
  clap: { dur: [1.6, 2.6], faces: 'target', pose: (o, t) => { const s = Math.sin(t * 13); arm(o, -1, -.12, 1.0, .62 + .3 * s, .55); arm(o, 1, -.12, 1.0, .62 + .3 * s, .55); o[P.Y] = .05 * Math.abs(Math.sin(t * 6.5)); o[P.HP] = -.1; }, eye: t => (t % 1.4 < .7 ? FACE.EYE_HAPPY : undefined), mouth: () => FACE.MOUTH_SMILE_OPEN },
  look: { dur: [2.4, 3.6], pose: (o, t, k) => { idlePose(o, t, k); o[P.HY] = .85 * Math.sin(t * 1.5) * env(t, 3.4, .4); o[P.HP] = -.08; o[P.TR] = .03 * Math.sin(t * 1.5); } },
  sit: { dur: [7, 15], pose: (o, t, k) => { o[P.LL] = o[P.RL] = 1.48; arm(o, -1, .32, .42, 0, .15); arm(o, 1, .32, .42, 0, .15); o[P.TP] = -.06 + .015 * Math.sin(t * 1.6); o[P.HY] = .3 * Math.sin(t * .45 + k.phase); } },
  stretch: { dur: [2.6, 3.4], pose: (o, t) => { const e = env(t, 3, .5); arm(o, -1, .07 + 2.2 * e, .05, -.55 * e, .14 - .09 * e); arm(o, 1, .07 + 2.2 * e, .05, -.55 * e, .14 - .09 * e); o[P.TR] = .2 * Math.sin(t * 1.5) * e; o[P.TP] = -.1 * e; o[P.HP] = -.15 * e; }, eye: t => (t > .5 && t < 2.4 ? FACE.EYE_BLINK : undefined), mouth: t => (t > .6 && t < 2 ? FACE.MOUTH_O : undefined) },
  surprise: { dur: [1.2, 1.6], pose: (o, t, k) => { idlePose(o, t, k); const a = ease(t / .12) * env(t, 1.4, .1); o[P.TP] = -.16 * a; arm(o, -1, .95 * a, .25, -.55 * a, .55); arm(o, 1, .95 * a, .25, -.55 * a, .55); o[P.Y] = t < .36 ? .9 * Math.sin(Math.PI * t / .36) : 0; o[P.HP] = -.12 * a; }, eye: () => FACE.EYE_WIDE, mouth: () => FACE.MOUTH_O },
  laugh: { dur: [1.8, 2.6], pose: (o, t) => { const s = Math.sin(t * 12); o[P.TP] = .1 + .08 * s; o[P.HP] = -.22 + .08 * s; o[P.Y] = .08 * Math.abs(s); arm(o, -1, .06, .55, 1.05, 1.15); arm(o, 1, .06, .55, 1.05, 1.15); o[P.HR] = .1 * Math.sin(t * 2); }, eye: () => FACE.EYE_HAPPY, mouth: () => FACE.MOUTH_LAUGH },
  point: { dur: [1.8, 2.6], faces: 'target', pose: (o, t, k) => { idlePose(o, t, k); arm(o, 1, .12, 1.5 + .05 * Math.sin(t * 4), .05, .05); o[P.HP] = -.12; o[P.TR] = -.03; }, mouth: () => FACE.MOUTH_SMILE_OPEN },
  spin: { dur: [.7, .7], pose: (o, t) => { const up = Math.sin(Math.PI * t / .7); arm(o, -1, 1.1 * up + .07, .1, 0, .2); arm(o, 1, 1.1 * up + .07, .1, 0, .2); o[P.Y] = 1.4 * up; }, eye: () => FACE.EYE_HAPPY, mouth: () => FACE.MOUTH_SMILE_OPEN },
  fall: { pose: (o, t) => { const s = Math.sin(t * 9); arm(o, -1, 2.0 + .15 * s, .1, -.45, .2); arm(o, 1, 2.0 - .15 * s, .1, -.45, .2); o[P.LL] = .25; o[P.RL] = -.2; }, eye: () => FACE.EYE_HAPPY, mouth: () => FACE.MOUTH_LAUGH },
};
// How far the body drops so the lower foot stays on the floor when the legs swing (a straight leg of length L at angle a
// reaches L cos a below the hip). Sitting uses the same rule, which puts the seat on the floor.
export const footDrop = (o: Float32Array, hipY: number) => { const a = Math.min(1.5, Math.max(Math.abs(o[P.LL]), Math.abs(o[P.RL]))); return hipY * (1 - Math.cos(a)); };
// Stride length per full walk cycle (two steps), in model units, for a leg of length L swinging by amplitude A.
export const strideLength = (hipY: number, amplitude: number) => 4 * hipY * Math.sin(amplitude);
