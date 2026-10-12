// PS3 dynamic themes: draws a running .raf scene with WebGL (textured meshes, the material
// effects' blending/depth modes, simple lighting), from the camera the theme defines.
import type { RafRuntime, RafSceneData } from "./rafScene";
import { base64Bytes, decodeArgb, decodeDxt } from "./dxt";
import { posedJoints } from "./edgeAnim";

type M4 = Float32Array;
const ident = (): M4 => { const m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; };
function mul(a: M4, b: M4): M4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let s = 0;
    for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
    o[c * 4 + r] = s;
  }
  return o;
}
function translate(x: number, y: number, z: number): M4 { const m = ident(); m[12] = x; m[13] = y; m[14] = z; return m; }
function scale(x: number, y: number, z: number): M4 { const m = ident(); m[0] = x; m[5] = y; m[10] = z; return m; }
function rotX(a: number): M4 { const m = ident(), c = Math.cos(a), s = Math.sin(a); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; }
function rotY(a: number): M4 { const m = ident(), c = Math.cos(a), s = Math.sin(a); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; }
function rotZ(a: number): M4 { const m = ident(), c = Math.cos(a), s = Math.sin(a); m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m; }
/** An orientation from a forward (+Z) and an up (+Y) vector, like a camera's: X = Y × Z. */
function basis(dir: number[], up: number[]): M4 {
  const nz = (v: number[]) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross = (p: number[], q: number[]) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const z = nz(dir);
  let x = cross(up, z);
  if (Math.hypot(x[0], x[1], x[2]) < 1e-6) x = cross(Math.abs(z[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], z);
  x = nz(x);
  const y = cross(z, x), m = ident();
  m[0] = x[0]; m[1] = x[1]; m[2] = x[2]; m[4] = y[0]; m[5] = y[1]; m[6] = y[2]; m[8] = z[0]; m[9] = z[1]; m[10] = z[2];
  return m;
}
/** joint transform (quaternion x y z w, translation, scale) → matrix */
function trs(q: number[], t: number[], sc: number[]): M4 {
  const [x, y, z, w] = q;
  const m = ident();
  m[0] = (1 - 2 * (y * y + z * z)) * sc[0]; m[1] = 2 * (x * y + z * w) * sc[0]; m[2] = 2 * (x * z - y * w) * sc[0];
  m[4] = 2 * (x * y - z * w) * sc[1]; m[5] = (1 - 2 * (x * x + z * z)) * sc[1]; m[6] = 2 * (y * z + x * w) * sc[1];
  m[8] = 2 * (x * z + y * w) * sc[2]; m[9] = 2 * (y * z - x * w) * sc[2]; m[10] = (1 - 2 * (x * x + y * y)) * sc[2];
  m[12] = t[0]; m[13] = t[1]; m[14] = t[2];
  return m;
}
/** 3×4 row-major matrix → column-major 4×4 */
function rows34(r: number[]): M4 {
  const m = ident();
  m[0] = r[0]; m[4] = r[1]; m[8] = r[2]; m[12] = r[3];
  m[1] = r[4]; m[5] = r[5]; m[9] = r[6]; m[13] = r[7];
  m[2] = r[8]; m[6] = r[9]; m[10] = r[10]; m[14] = r[11];
  return m;
}
export interface Joint { parent: number; rot: number[]; pos: number[]; scale: number[] }
/** world matrices of a skeleton's joints in its base pose */
export function jointWorlds(joints: Joint[]): M4[] {
  const out: M4[] = [];
  joints.forEach((j, i) => {
    const local = trs(j.rot, j.pos, j.scale);
    out[i] = j.parent >= 0 && j.parent < i && out[j.parent] ? mul(out[j.parent], local) : local;
  });
  return out;
}
function perspective(fovy: number, aspect: number, near: number, far: number): M4 {
  const f = 1 / Math.tan(fovy / 2), m = new Float32Array(16);
  m[0] = f / aspect; m[5] = f; m[10] = (far + near) / (near - far); m[11] = -1; m[14] = (2 * far * near) / (near - far);
  return m;
}
function ortho(h: number, aspect: number, near: number, far: number): M4 {
  const m = ident(), w = h * aspect;
  m[0] = 1 / w; m[5] = 1 / h; m[10] = -2 / (far - near); m[14] = -(far + near) / (far - near);
  return m;
}
function lookAt(eye: number[], dir: number[], up: number[]): M4 {
  const norm = (v: number[]) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const f = norm(dir);
  // an up vector parallel to the view direction (a camera looking straight down the up axis) has no
  // defined roll: fall back to -Z, then +Y
  let side = cross(f, up);
  if (Math.hypot(...side) < 1e-6) side = cross(f, Math.abs(f[2]) < 0.9 ? [0, 0, -1] : [0, 1, 0]);
  const s = norm(side), u = cross(s, f);
  const m = ident();
  m[0] = s[0]; m[4] = s[1]; m[8] = s[2];
  m[1] = u[0]; m[5] = u[1]; m[9] = u[2];
  m[2] = -f[0]; m[6] = -f[1]; m[10] = -f[2];
  m[12] = -(s[0] * eye[0] + s[1] * eye[1] + s[2] * eye[2]);
  m[13] = -(u[0] * eye[0] + u[1] * eye[1] + u[2] * eye[2]);
  m[14] = f[0] * eye[0] + f[1] * eye[1] + f[2] * eye[2];
  return m;
}

const VS = `
attribute vec3 aPos; attribute vec2 aUV; attribute vec3 aNrm; attribute vec4 aCol;
uniform mat4 uMVP; uniform mat4 uModel; uniform vec4 uUV;
varying vec2 vUV; varying vec3 vNrm; varying vec3 vWorld; varying vec4 vCol;
void main() {
  vUV = aUV * uUV.xy + uUV.zw;
  vNrm = mat3(uModel) * aNrm;
  vWorld = (uModel * vec4(aPos, 1.0)).xyz;
  vCol = aCol;
  gl_Position = uMVP * vec4(aPos, 1.0);
}`;
const FS = `
precision mediump float;
varying vec2 vUV; varying vec3 vNrm; varying vec3 vWorld; varying vec4 vCol;
uniform sampler2D uTex; uniform float uHasTex; uniform vec4 uColor; uniform float uLit;
uniform vec3 uAmbient; uniform vec3 uLightPos; uniform vec3 uLightCol; uniform float uRim; uniform vec3 uEye; uniform float uOpaque;
uniform sampler2D uSpec; uniform float uHasSpec;
void main() {
  vec4 t = mix(vec4(1.0), texture2D(uTex, vUV), uHasTex);
  if (uOpaque > 0.5) t.a = 1.0;
  vec4 c = t * uColor * vCol;
  if (uLit > 0.5) {
    vec3 n = normalize(vNrm);
    vec3 l = normalize(uLightPos - vWorld);
    vec3 light = uAmbient + uLightCol * max(dot(n, l), 0.0);
    if (uRim > 0.5) { vec3 v = normalize(uEye - vWorld); light += uLightCol * pow(1.0 - max(dot(n, v), 0.0), 2.0) * 0.6; }
    c.rgb *= light;
    if (uHasSpec > 0.5) { // specular map (texture type 2): white highlights, even on a black diffuse (Symbol Art 3)
      vec3 v = normalize(uEye - vWorld);
      float d = dot(n, l) > 0.0 ? pow(max(dot(n, normalize(l + v)), 0.0), 24.0) : 0.0;
      c.rgb += texture2D(uSpec, vUV).rgb * uLightCol * d * 2.0;
    }
  }
  if (c.a < 0.004) discard; // fully transparent texels must not write depth
  gl_FragColor = c;
}`;

interface Skin { pos: Float32Array; nrm: Float32Array | null; joints: Uint16Array; weights: Float32Array; outP: Float32Array; outN: Float32Array | null; last: string }
interface GpuMesh { pos: WebGLBuffer; uv: WebGLBuffer | null; nrm: WebGLBuffer | null; col: WebGLBuffer | null; idx: WebGLBuffer; count: number; big: boolean; skin: Skin | null }

/** Linear blend skinning on the CPU: 4 (joint, weight) pairs per vertex against a matrix palette. */
function skinVertexes(sk: Skin, palette: M4[]) {
  const n = sk.pos.length / 3, P = sk.pos, N = sk.nrm, oP = sk.outP, oN = sk.outN;
  for (let v = 0; v < n; v++) {
    let x = 0, y = 0, z = 0, nx = 0, ny = 0, nz = 0;
    const px = P[v * 3], py = P[v * 3 + 1], pz = P[v * 3 + 2];
    for (let k = 0; k < 4; k++) {
      const w = sk.weights[v * 4 + k];
      if (!w) continue;
      const m = palette[sk.joints[v * 4 + k]];
      if (!m) continue;
      x += w * (m[0] * px + m[4] * py + m[8] * pz + m[12]);
      y += w * (m[1] * px + m[5] * py + m[9] * pz + m[13]);
      z += w * (m[2] * px + m[6] * py + m[10] * pz + m[14]);
      if (N) {
        const qx = N[v * 3], qy = N[v * 3 + 1], qz = N[v * 3 + 2];
        nx += w * (m[0] * qx + m[4] * qy + m[8] * qz);
        ny += w * (m[1] * qx + m[5] * qy + m[9] * qz);
        nz += w * (m[2] * qx + m[6] * qy + m[10] * qz);
      }
    }
    oP[v * 3] = x; oP[v * 3 + 1] = y; oP[v * 3 + 2] = z;
    if (oN) { oN[v * 3] = nx; oN[v * 3 + 1] = ny; oN[v * 3 + 2] = nz; }
  }
}

export class RafRenderer {
  gl: WebGLRenderingContext;
  prog: WebGLProgram;
  meshes = new Map<string, GpuMesh | null>();
  textures = new Map<string, WebGLTexture | null>();
  white: WebGLTexture;
  loc: Record<string, any> = {};
  ready = 0;
  pending = 0; // textures still downloading

  /** baseUrl: where a texture's cached .bin file (t.bin) is fetched from. */
  constructor(public canvas: HTMLCanvasElement, public scene: RafSceneData, onTextureLoaded?: () => void, baseUrl = "") {
    const gl = (canvas.getContext("webgl2", { premultipliedAlpha: false, antialias: true }) || canvas.getContext("webgl", { premultipliedAlpha: false, antialias: true })) as WebGLRenderingContext;
    if (!gl) throw new Error("no WebGL");
    this.gl = gl;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(p);
    this.prog = p;
    for (const n of ["aPos", "aUV", "aNrm", "aCol"]) this.loc[n] = gl.getAttribLocation(p, n);
    for (const n of ["uMVP", "uModel", "uUV", "uTex", "uHasTex", "uColor", "uLit", "uAmbient", "uLightPos", "uLightCol", "uRim", "uEye", "uOpaque", "uSpec", "uHasSpec"]) this.loc[n] = gl.getUniformLocation(p, n);
    this.white = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.white);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    const isGL2 = typeof (window as any).WebGL2RenderingContext !== "undefined" && gl instanceof (window as any).WebGL2RenderingContext;
    // textures
    const s3tc: any = gl.getExtension("WEBGL_compressed_texture_s3tc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
    const setParams = (w: number, h: number, mip = false) => {
      const pow2 = (n: number) => (n & (n - 1)) === 0;
      const wrap = isGL2 || (pow2(w) && pow2(h)) ? gl.REPEAT : gl.CLAMP_TO_EDGE;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    for (const [id, t0] of Object.entries(scene.textures)) {
      const t = t0 as any;
      if (!t.url && (t.data || t.bin) && t.format) {
        // raw GTF data (inline base64, or a cached .bin file next to the scene): straight to the
        // GPU when it takes DXT, else decoded here
        const upload = (bytes: Uint8Array) => {
          const tex = gl.createTexture()!;
          gl.bindTexture(gl.TEXTURE_2D, tex);
          const w = t.width, h = t.height;
          const dxtFmt = s3tc && t.format !== "argb" && w % 4 === 0 && h % 4 === 0
            ? { dxt1: s3tc.COMPRESSED_RGBA_S3TC_DXT1_EXT, dxt3: s3tc.COMPRESSED_RGBA_S3TC_DXT3_EXT, dxt5: s3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT }[t.format as "dxt1"]
            : 0;
          if (dxtFmt) (gl as any).compressedTexImage2D(gl.TEXTURE_2D, 0, dxtFmt, w, h, 0, bytes);
          else {
            const px = t.format === "argb" ? decodeArgb(bytes, w, h, t.pitch || w * 4) : decodeDxt(bytes, w, h, t.format);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
          }
          setParams(w, h);
          this.textures.set(id, tex);
          this.ready++;
        };
        if (t.data) upload(base64Bytes(t.data));
        else {
          this.textures.set(id, null);
          this.pending++;
          fetch(baseUrl + t.bin)
            .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
            .then((b) => { upload(new Uint8Array(b)); onTextureLoaded?.(); })
            .catch(() => {})
            .finally(() => this.pending--);
        }
        continue;
      }
      if (!t.url) { this.textures.set(id, null); continue; }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        const pow2 = (n: number) => (n & (n - 1)) === 0;
        const wrap = isGL2 || (pow2(img.width) && pow2(img.height)) ? gl.REPEAT : gl.CLAMP_TO_EDGE;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.textures.set(id, tex);
        this.ready++;
        this.pending--;
        onTextureLoaded?.();
      };
      img.onerror = () => { this.textures.set(id, null); this.pending--; };
      this.pending++;
      img.src = t.url;
    }
    // meshes
    const uintIdx = !!(gl as any).getExtension?.("OES_element_index_uint") || isGL2;
    for (const [id, m] of Object.entries(scene.meshes)) {
      if (!m || !m.indexes.length) { this.meshes.set(id, null); continue; }
      const buf = (data: ArrayBufferView, target: number = gl.ARRAY_BUFFER) => { const b = gl.createBuffer()!; gl.bindBuffer(target, b); gl.bufferData(target, data, gl.STATIC_DRAW); return b; };
      const big = m.vertexes > 65535;
      if (big && !uintIdx) { this.meshes.set(id, null); continue; }
      const mm = m as any;
      // several joints with weights: skinned per frame on the CPU into dynamic buffers
      const multi = mm.joints && mm.weights && (mm.joints as number[]).some((j: number) => j > 0);
      const skin: Skin | null = multi ? {
        pos: new Float32Array(m.positions), nrm: m.normals ? new Float32Array(m.normals) : null,
        joints: new Uint16Array(mm.joints), weights: new Float32Array(mm.weights),
        outP: new Float32Array(m.positions.length), outN: m.normals ? new Float32Array(m.normals.length) : null, last: "",
      } : null;
      const dyn = (data: Float32Array) => { const b = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW); return b; };
      this.meshes.set(id, {
        skin,
        pos: skin ? dyn(new Float32Array(m.positions)) : buf(new Float32Array(m.positions)),
        uv: m.uvs ? buf(new Float32Array(m.uvs)) : null,
        nrm: m.normals ? (skin ? dyn(new Float32Array(m.normals)) : buf(new Float32Array(m.normals))) : null,
        col: m.colors ? buf(new Float32Array(m.colors)) : null,
        idx: buf(big ? new Uint32Array(m.indexes) : new Uint16Array(m.indexes), gl.ELEMENT_ARRAY_BUFFER),
        count: m.indexes.length,
        big,
      });
    }
  }

  private roots = new Map<string, M4 | null>();
  private baseWorlds = new Map<string, M4[]>();
  /** The model's joint world matrices: posed by the actor's animation slots when any of them
   *  plays (fresh array), else the base pose (cached). */
  private worlds(a: { _anim_time: number[]; _anim_weight: number[] }, model: string): { w: M4[]; animated: boolean } | null {
    const md = this.scene.models[model] as any;
    const j = md?.joints as Joint[] | undefined;
    if (!j || !j.length) return null;
    if (md?.anims?.length) {
      const posed = posedJoints(j, md.anims, a._anim_time, a._anim_weight);
      if (posed) return { w: jointWorlds(posed), animated: true };
    }
    if (!this.baseWorlds.has(model)) this.baseWorlds.set(model, jointWorlds(j));
    return { w: this.baseWorlds.get(model)!, animated: false };
  }
  /** Where a model hangs: rigid meshes on the first joint; skinned ones through that joint's inverse
   *  bind matrix too (meshes weighted to several joints are skinned per vertex instead). */
  private rootJoint(a: { _anim_time: number[]; _anim_weight: number[] }, model: string, skinned: boolean): M4 | null {
    const md = this.scene.models[model] as any;
    const ib = md?.invbind?.[0] as number[] | undefined;
    const W = this.worlds(a, model);
    if (!W) return null;
    const key = model + (skinned ? ":s" : "");
    if (!W.animated && this.roots.has(key)) return this.roots.get(key)!;
    const m = skinned ? (ib ? mul(W.w[0], rows34(ib)) : null) : W.w[0]; // skinned without an inverse bind: already in model space
    if (!W.animated) this.roots.set(key, m);
    return m;
  }
  /** Skins a multi-joint mesh for this actor's pose; false when the model has no usable palette. */
  private skin(a: { _anim_time: number[]; _anim_weight: number[] }, model: string, mesh: GpuMesh): boolean {
    const sk = mesh.skin!, md = this.scene.models[model] as any;
    const ib = md?.invbind as number[][] | undefined;
    const W = this.worlds(a, model);
    if (!W || !ib || !ib.length) return false;
    const key = W.animated ? "" : model;
    if (!key || sk.last !== key) {
      const palette = W.w.map((w, i) => (ib[i] ? mul(w, rows34(ib[i])) : w));
      skinVertexes(sk, palette);
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.pos); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sk.outP);
      if (mesh.nrm && sk.outN) { gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nrm); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sk.outN); }
      sk.last = key;
    }
    return true;
  }

  draw(rt: RafRuntime, width: number, height: number) {
    const gl = this.gl, L = this.loc;
    if (this.canvas.width !== width || this.canvas.height !== height) { this.canvas.width = width; this.canvas.height = height; }
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.prog);
    const cam = rt.camera;
    const aspect = width / height;
    rt.aspect = aspect;
    const proj = cam.type === 1 || (cam._ymag[0] > 0 && cam.type !== 0) ? ortho((cam._ymag[0] || 10) / 2, aspect, cam._znear[0], cam._zfar[0]) /* ymag = full view height */ : perspective(cam._yfov[0] || 0.9, aspect, Math.max(0.001, cam._znear[0]), (cam._zfar[0] || 1000) * 1.01 /* backdrops placed exactly at zfar (Dark Souls) */);
    // a zero direction (some themes) means the default: looking down -Z
    const dir = Math.hypot(...cam._direction) < 1e-6 ? [0, 0, -1] : cam._direction;
    const view = lookAt(cam._position, dir, cam._up);
    const vp = mul(proj, view);
    // lights: one ambient + one point light, like the PS3's limit of two
    const amb = rt.lights.find((l) => l.type === 2 && l.enable);
    const pt = rt.lights.find((l) => l.type !== 2 && l.enable);
    gl.uniform3fv(L.uAmbient, amb ? amb._color.slice(0, 3) : [0.35, 0.35, 0.35]);
    gl.uniform3fv(L.uLightPos, pt ? pt._position : [0, 50, 100]);
    gl.uniform3fv(L.uLightCol, pt ? pt._color.slice(0, 3) : [0.7, 0.7, 0.7]);
    gl.uniform3fv(L.uEye, cam._position);
    gl.uniform1i(L.uTex, 0);
    gl.uniform1i(L.uSpec, 1);
    gl.activeTexture(gl.TEXTURE0);
    for (const a of rt.actors) {
      if (!a.enable || a._color[3] <= 0.001) continue;
      const s = a._scale;
      if (Math.abs(s[0]) < 1e-6 && Math.abs(s[1]) < 1e-6 && Math.abs(s[2]) < 1e-6) continue;
      const model = rt.scene.models[a.model];
      const mesh = model?.mesh ? this.meshes.get(model.mesh) : null;
      if (!mesh) continue;
      // an actor whose material is missing from the scene draws nothing (The Game Is Just The Start's logo card)
      const mat = rt.scene.materials[a.material];
      if (!mat) continue;
      const fx = mat.effect || "pure_texture";
      const alphaMode = /alpha_add/.test(fx) ? 2 : Number(/alpha_(\d)/.exec(fx)?.[1] ?? (/alpha/.test(fx) ? 1 : 0));
      const depth = /depth_0/.test(fx) ? 0 : 1;
      const lit = /basic_lighting/.test(fx) ? 1 : 0;
      const r = a._rotation;
      let M = mul(rotZ(r[2]), mul(rotY(r[1]), mul(rotX(r[0]), scale(s[0], s[1], s[2]))));
      if (a._direction || a._up) M = mul(basis(a._direction ?? [0, 0, 1], a._up ?? [0, 1, 0]), M);
      M = mul(translate(a._position[0], a._position[1], a._position[2]), M);
      // a skinned model without animations stays in its bind pose (the skin matrices are identity);
      // its skeleton's base pose need not match the bind pose (Zenescopes' Wonderland)
      if (rt.scene.meshes[model.mesh!]?.skinned && !model.anims?.length) { /* bind pose: vertexes as they are */ }
      else if (mesh.skin && this.skin(a, a.model, mesh)) { /* vertexes already in model space */ }
      else {
        const root = model?.mesh ? this.rootJoint(a, a.model, !!rt.scene.meshes[model.mesh]?.skinned) : null;
        if (root) M = mul(M, root);
      }
      gl.uniformMatrix4fv(L.uMVP, false, mul(vp, M));
      gl.uniformMatrix4fv(L.uModel, false, M);
      gl.uniform4f(L.uUV, a._uv_scale[0], a._uv_scale[1], a._uv_offset[0], a._uv_offset[1]);
      gl.uniform4fv(L.uColor, a._color);
      gl.uniform1f(L.uLit, lit);
      gl.uniform1f(L.uRim, /edge_lit/.test(fx) ? 1 : 0);
      // "alpha_0" turns blending off: the texture's alpha is ignored (many A8R8G8B8 backgrounds
      // carry alpha 0, Dark Souls for one); plain "pure_texture" still cuts out with it
      gl.uniform1f(L.uOpaque, /alpha_0/.test(fx) ? 1 : 0);
      const texId = mat.textures[0];
      const tex = texId ? this.textures.get(texId) : null;
      gl.bindTexture(gl.TEXTURE_2D, tex ?? this.white);
      gl.uniform1f(L.uHasTex, tex ? 1 : 0);
      // lit effects take a specular map (texture type 2) after the diffuse one; normal maps (types 1, 3) are not used
      const specId = lit ? mat.textures.slice(1).find((id: string) => (rt.scene.textures[id] as any)?.type === 2) : undefined;
      const spec = specId ? this.textures.get(specId) : null;
      gl.uniform1f(L.uHasSpec, spec ? 1 : 0);
      if (spec) { gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, spec); gl.activeTexture(gl.TEXTURE0); }
      // every effect but "alpha_0", "pure_texture" included, uses the texture's alpha
      {
        gl.enable(gl.BLEND);
        if (alphaMode === 2) gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        else gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      }
      if (depth) { gl.enable(gl.DEPTH_TEST); gl.depthMask(alphaMode === 0); }
      else { gl.disable(gl.DEPTH_TEST); gl.depthMask(false); }
      gl.disable(gl.CULL_FACE);
      const bind = (b: WebGLBuffer | null, loc: number, n: number, def: number[]) => {
        if (loc < 0) return;
        if (b) { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, n, gl.FLOAT, false, 0, 0); }
        else { gl.disableVertexAttribArray(loc); (gl as any)[`vertexAttrib${def.length}f`](loc, ...def); }
      };
      bind(mesh.pos, L.aPos, 3, [0, 0, 0]);
      bind(mesh.uv, L.aUV, 2, [0, 0]);
      bind(mesh.nrm, L.aNrm, 3, [0, 0, 1]);
      bind(mesh.col, L.aCol, 4, [1, 1, 1, 1]);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.idx);
      gl.drawElements(gl.TRIANGLES, mesh.count, mesh.big ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT, 0);
    }
  }
  /** Frees the GPU side (buffers, textures, the context itself). */
  dispose() {
    const gl = this.gl;
    for (const m of this.meshes.values()) if (m) for (const b of [m.pos, m.uv, m.nrm, m.col, m.idx]) if (b) gl.deleteBuffer(b);
    for (const t of this.textures.values()) if (t) gl.deleteTexture(t);
    this.meshes.clear(); this.textures.clear();
    (gl.getExtension("WEBGL_lose_context") as any)?.loseContext();
  }
}
