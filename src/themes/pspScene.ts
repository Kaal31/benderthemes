// PSP .ctf theme backgrounds, drawn in the UI.
//  • createPspScene: the layout objects of system_plugin_bg.rco — planes with images on the
//    PSP's 480 x 272 screen (origin in the centre, y up) — run by the RCO's own animation
//    scripts (move, recolour, rotate, scale, fade, delay, chain).
//  • createPspWave: the 3D XMB wave from the theme's GMO model — a cubic B-spline surface,
//    posed by its fcurve animation, lit by its reflection (sphere) map and added onto the screen.
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SceneNode {
  k: string;
  n: string;
  img?: string;
  model?: string; // 3D model objects: which model of the layout they show
  init?: [string, string];
  x?: number; y?: number; z?: number; r?: number; g?: number; b?: number; a?: number;
  w?: number; h?: number; sx?: number; sy?: number; sz?: number;
  ch: SceneNode[];
}
export interface SceneStep { t: string; o?: string | null; d: number; e?: number; v?: number[]; a?: string | null; kind?: string | null }
export interface PspWaveData {
  u: number; v: number; morphs: number; ctrl: number[]; knotsU: number[]; knotsV: number[];
  matrix: number[]; restMorph: number[];
  matrixTrack: { dims: number; t: number[]; v: number[] } | null;
  morphTrack: { dims: number; t: number[]; v: number[] } | null;
  frameStart: number; frameEnd: number; rate: number; diffuse: number[]; alpha: number; blend: number[];
  tex: string | null;
  obj?: any;
}
export interface PspSceneData {
  pages: Record<string, SceneNode[]>;
  anims: Record<string, SceneStep[]>;
  images: Record<string, string>;
  wave: PspWaveData | null;
  waves?: Record<string, PspWaveData>; // every 3D model of the layout, by name
}
/** front: pages drawn on a second canvas (e.g. above a 3D model that sits between the pages). */
interface SceneOpts { wallpaper?: string | null; background?: string | null; pages?: string[]; tint?: number[] | null; front?: { canvas: HTMLCanvasElement; pages: string[] } }
interface WaveOpts { uSamples?: number; vSamples?: number; speed?: number; intensity?: number; tint?: number[]; yOffset?: number; clear?: boolean; zoom?: (timeMs: number) => number }

/** Which pages of the layout to show: the wallpaper page when a wallpaper is in use or when the
 *  theme put its animation there, otherwise the theme's own background pages. */
export function scenePages(scene: PspSceneData, userWallpaper: boolean): string[] {
  if (userWallpaper) return ["page_wallpaper_theme"];
  const pics = (ns: SceneNode[] = []): number => ns.reduce((a, n) => a + (n.img ? 1 : 0) + pics(n.ch), 0);
  const own = pics(scene.pages.page_default_theme) + pics(scene.pages.page_default_theme_3D);
  return !own && pics(scene.pages.page_wallpaper_theme) ? ["page_wallpaper_theme"] : ["page_default_theme", "page_default_theme_3D"];
}

/** The first 3D model object in the shown pages (where the wave sits), if any. */
export function sceneModel(scene: PspSceneData, pages: string[]): SceneNode | null {
  return sceneModels(scene, pages)[0] ?? null;
}
/** Every 3D model object in the shown pages, in drawing order. */
export function sceneModels(scene: PspSceneData, pages: string[]): SceneNode[] {
  const out: SceneNode[] = [];
  const find = (n: SceneNode) => { if (n.k === "model") out.push(n); n.ch.forEach(find); };
  for (const p of pages) (scene.pages[p] || []).forEach(find);
  return out;
}
/** Wave data a model object shows (its own model, else the layout's main one). */
export const modelWave = (scene: PspSceneData, n: SceneNode | null): PspWaveData | null =>
  (n?.model && scene.waves?.[n.model]) || scene.wave || null;
/** Models the firmware places itself (started by a native event) sit where the stock wave sits. */
export const nativeModel = (n: SceneNode | null) => !n || !!(n.init && n.init[0] === "event");

const EASE: ((t: number) => number)[] = [
  (t: number) => t, // 0 linear
  (t: number) => t * t, // 1 accelerate
  (t: number) => 1 - (1 - t) * (1 - t), // 2 decelerate
  (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)), // 3 accelerate, then decelerate
  (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t), // 4 smooth
];

export function createPspScene(canvas: HTMLCanvasElement, scene: PspSceneData, opts: SceneOpts = {}) {
  const g = canvas.getContext("2d")!;
  const imgs: Record<string, HTMLImageElement> = {};
  for (const [k, url] of Object.entries(scene.images || {})) {
    if (!url) continue;
    const im = new Image();
    im.src = url;
    imgs[k] = im;
  }
  let wall: HTMLImageElement | null = null;
  if (opts.wallpaper) { wall = new Image(); wall.src = opts.wallpaper; }
  let bgImg: HTMLImageElement | null = null;
  if (opts.background) { bgImg = new Image(); bgImg.src = opts.background; }
  // the user's own wallpaper shows the wallpaper page; otherwise the theme's own pages
  const pageNames = opts.pages || (wall ? ["page_wallpaper_theme"] : ["page_default_theme", "page_default_theme_3D"]);
  const objs: Record<string, any> = {}; // name -> live state
  const roots: any[] = [];
  function build(n: any) {
    const o: any = { n: n.n, k: n.k, img: n.img, ch: [],
      x: n.x || 0, y: n.y || 0, z: n.z || 0, r: n.r ?? 1, g: n.g ?? 1, b: n.b ?? 1, a: n.a ?? 1,
      w: n.w || 0, h: n.h || 0, sx: n.sx ?? 1, sy: n.sy ?? 1, sz: n.sz ?? 1, rx: 0, ry: 0, rz: 0, su: 0, sv: 0, init: n.init, tw: {} };
    if (o.n && !objs[o.n]) objs[o.n] = o;
    for (const c of n.ch || []) o.ch.push(build(c));
    return o;
  }
  const fronts: any[] = [];
  for (const p of pageNames) for (const n of (scene.pages || {})[p] || []) roots.push(build(n));
  const g2 = opts.front ? opts.front.canvas.getContext("2d")! : null;
  if (opts.front) for (const p of opts.front.pages) for (const n of (scene.pages || {})[p] || []) fronts.push(build(n));
  const all = () => roots.concat(fronts);

  // ── animation runner ──
  const runs: any[] = [];
  let now = 0;
  function start(name: any, owner: any) {
    const steps = (scene.anims || {})[name];
    if (!steps || runs.length > 400) return;
    if (runs.some((r) => r.name === name && r.i === 0)) return; // several objects starting the same script
    runs.push({ name, owner, steps, i: 0, wait: 0 });
  }
  function tween(o: any, keys: any, to: any, d: any, e: any) {
    for (let j = 0; j < keys.length; j++) {
      const k = keys[j];
      if (d <= 0) { o[k] = to[j]; delete o.tw[k]; }
      else o.tw[k] = { from: o[k], to: to[j], t0: now, d, e: EASE[e] || EASE[0] };
    }
  }
  function step(run: any) {
    let guard = 0;
    while (run.i < run.steps.length && now >= run.wait && guard++ < 500) {
      const s = run.steps[run.i++];
      const o = s.o ? objs[s.o] : run.owner;
      switch (s.t) {
        case "delay": run.wait = now + s.d; break;
        case "fire": if (s.kind === "anim" && s.a) start(s.a, run.owner); break;
        case "move": if (o) tween(o, ["x", "y", "z"], s.v, s.d, s.e); break;
        case "color": if (o) tween(o, ["r", "g", "b", "a"], s.v, s.d, s.e); break;
        case "fade": if (o) tween(o, ["a"], s.v, s.d, s.e); break;
        case "rotate": if (o) tween(o, ["rx", "ry", "rz"], s.v, s.d, s.e); break;
        case "resize": if (o) tween(o, ["sx", "sy", "sz"].slice(0, s.v.length), s.v.slice(0, 3), s.d, s.e); break;
        case "slide": if (o) tween(o, ["su", "sv"], s.v.slice(0, 2), s.d, s.e); break; // texture scroll (SlideOut)
        default: break;
      }
    }
    return run.i < run.steps.length || now < run.wait;
  }
  function startInits(o: any) {
    if (o.init && o.init[0] === "anim") start(o.init[1], o);
    o.ch.forEach(startInits);
  }
  all().forEach(startInits);

  function update(o: any) {
    for (const k in o.tw) {
      const t = o.tw[k], p = Math.min(1, (now - t.t0) / t.d);
      o[k] = t.from + (t.to - t.from) * t.e(p);
      if (p >= 1) delete o.tw[k];
    }
    o.ch.forEach(update);
  }

  // the firmware's own background: its grey texture × the month colour, brightened (fitted to console screenshots)
  let monthKey = "", monthCanvas: HTMLCanvasElement | null = null;
  function monthTinted(im: HTMLImageElement, c: number[]) {
    if (!im.complete || !im.naturalWidth) return null;
    const key = c.join(",");
    if (monthCanvas && monthKey === key) return monthCanvas;
    const cv = document.createElement("canvas");
    cv.width = im.naturalWidth; cv.height = im.naturalHeight;
    const x = cv.getContext("2d")!;
    x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, cv.width, cv.height);
    for (let i = 0; i < d.data.length; i += 4)
      for (let k = 0; k < 3; k++) d.data[i + k] = Math.min(255, d.data[i + k] * c[k] * 1.5);
    x.putImageData(d, 0, 0);
    monthKey = key; monthCanvas = cv;
    return cv;
  }
  const tintCache = new Map<string, HTMLCanvasElement>();
  function tinted(im: any, r: any, gg: any, b: any) {
    if (r > 0.98 && gg > 0.98 && b > 0.98) return im;
    const src = im.src ?? "canvas" + (im.width + "x" + im.height);
    const key = src.length + ":" + src.slice(-24) + ":" + Math.round(r * 16) + Math.round(gg * 16) + Math.round(b * 16);
    let c = tintCache.get(key);
    if (!c && (im.naturalWidth || im.width)) {
      c = document.createElement("canvas");
      c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height;
      const x = c.getContext("2d")!;
      x.drawImage(im, 0, 0);
      x.globalCompositeOperation = "multiply";
      x.fillStyle = `rgb(${Math.round(r * 255)},${Math.round(gg * 255)},${Math.round(b * 255)})`;
      x.fillRect(0, 0, c.width, c.height);
      x.globalCompositeOperation = "destination-in";
      x.drawImage(im, 0, 0);
      if (tintCache.size > 200) tintCache.clear();
      tintCache.set(key, c);
    }
    return c || im;
  }

  // texture scrolled by a SlideOut step: the picture wraps around inside its plane
  function drawScrolled(g: CanvasRenderingContext2D, im: any, su: number, sv: number, w: number, h: number) {
    const iw = im.width || im.naturalWidth, ih = im.height || im.naturalHeight;
    const ox = (((su % 1) + 1) % 1) * iw, oy = (((sv % 1) + 1) % 1) * ih;
    // shown x maps to texture (x + ox) mod width: two spans per axis
    const xs = [[ox, iw - ox, 0], [0, ox, iw - ox]].filter((p) => p[1] > 0.5);
    const ys = [[oy, ih - oy, 0], [0, oy, ih - oy]].filter((p) => p[1] > 0.5);
    for (const [sx0, sw, dx] of xs) for (const [sy0, sh, dy] of ys)
      g.drawImage(im, sx0, sy0, sw, sh, -w / 2 + (dx / iw) * w, -h / 2 + (dy / ih) * h, (sw / iw) * w, (sh / ih) * h);
  }
  function draw(g: CanvasRenderingContext2D, o: any, alpha: any) {
    const a = alpha * Math.max(0, Math.min(1, o.a));
    if (a <= 0.003) return;
    g.save();
    g.translate(o.x, -o.y);
    g.rotate(-o.rz);
    g.scale(o.sx * Math.cos(o.ry), o.sy * Math.cos(o.rx));
    // planes the firmware fills itself: the theme's background picture and the user's wallpaper
    const native = o.n === "default_theme_plane" ? bgImg : o.n === "wallpaper_theme_plane" ? wall ?? bgImg : null;
    let im: any = o.img ? imgs[o.img] : native;
    if (im && im === bgImg && opts.tint) im = monthTinted(im, opts.tint) ?? im;
    let w = o.w, h = o.h;
    if (native && im === native) { w = 480; h = 272; }
    if (o.n === "wallpaper_theme_cover") {
      // dims the wallpaper underneath (multiply), it is not a solid layer
      g.globalAlpha = a;
      g.globalCompositeOperation = "multiply";
      g.fillStyle = `rgb(${Math.round(Math.min(1, o.r) * 255)},${Math.round(Math.min(1, o.g) * 255)},${Math.round(Math.min(1, o.b) * 255)})`;
      g.fillRect(-240, -136, 480, 272);
      g.globalCompositeOperation = "source-over";
    } else if (im && (im instanceof HTMLCanvasElement || (im.complete && im.naturalWidth))) {
      if (!w && !h) { w = im.naturalWidth || im.width; h = im.naturalHeight || im.height; }
      g.globalAlpha = a;
      if (o.su || o.sv) drawScrolled(g, tinted(im, o.r, o.g, o.b), o.su, o.sv, w, h);
      else g.drawImage(tinted(im, o.r, o.g, o.b), -w / 2, -h / 2, w, h);
    } else if (!o.img && !native && o.k === "plane" && w && h && o.n !== "default_theme_plane" && o.n !== "wallpaper_theme_plane") {
      g.globalAlpha = a;
      g.fillStyle = `rgb(${Math.round(Math.min(1, o.r) * 255)},${Math.round(Math.min(1, o.g) * 255)},${Math.round(Math.min(1, o.b) * 255)})`;
      g.fillRect(-w / 2, -h / 2, w, h);
    }
    for (const c of o.ch) draw(g, c, a);
    g.restore();
  }

  function paint(g: CanvasRenderingContext2D, list: any[]) {
    const cw = g.canvas.width, ch = g.canvas.height;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, cw, ch);
    const k = Math.max(cw / 480, ch / 272); // cover
    g.setTransform(k, 0, 0, k, cw / 2, ch / 2);
    g.imageSmoothingEnabled = true;
    list.forEach((o) => draw(g, o, 1));
  }
  function frame(ms: any) {
    now = ms;
    for (let i = runs.length - 1; i >= 0; i--) if (!step(runs[i])) runs.splice(i, 1);
    all().forEach(update);
    paint(g, roots);
    if (g2) paint(g2, fronts);
  }
  function model() {
    let m: any = null;
    const find = (o: any) => { if (!m && o.k === "model") m = o; o.ch.forEach(find); };
    all().forEach(find);
    return m;
  }
  /** Run one of the layout's scripts by name (e.g. the scripts the firmware starts itself). */
  const run = (name: string) => start(name, null);
  /** Is a script with this name (or, without a name, any script) still running? */
  const busy = (name?: string) => runs.some((r) => !name || r.name === name);
  return { frame, objs, model, start: run, busy };
}


function track(t: any, f: any, out: any) {
  const n = t.t.length, D = t.dims;
  if (n === 1 || f <= t.t[0]) { for (let c = 0; c < D; c++) out[c] = t.v[c]; return; }
  if (f >= t.t[n - 1]) { for (let c = 0; c < D; c++) out[c] = t.v[(n - 1) * D + c]; return; }
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (t.t[m] <= f) lo = m; else hi = m; }
  const k = (f - t.t[lo]) / (t.t[hi] - t.t[lo] || 1);
  for (let c = 0; c < D; c++) out[c] = t.v[lo * D + c] + (t.v[hi * D + c] - t.v[lo * D + c]) * k;
}

// Basis functions (value + first derivative) of degree p at u, Cox–de Boor.
function basis(U: any, count: any, samples: any) {
  const p = Math.max(1, Math.min(3, U.length - count - 1));
  const n = count - 1, u0 = U[p], u1 = U[n + 1], out = [];
  for (let s = 0; s < samples; s++) {
    const u = Math.min(u1 - 1e-6 * (u1 - u0), u0 + ((u1 - u0) * s) / (samples - 1));
    let span = p;
    while (span < n && u >= U[span + 1]) span++;
    // N[j][i]: degree j functions starting at span-j .. span
    const N: number[][] = [[1]];
    for (let j = 1; j <= p; j++) {
      const row = new Array(j + 1).fill(0);
      for (let r = 0; r <= j; r++) {
        const i = span - j + r; // function index
        let v = 0;
        const a = r - 1 >= 0 ? N[j - 1][r - 1] : 0; // N_{i, j-1}
        const b = r <= j - 1 ? N[j - 1][r] : 0; // N_{i+1, j-1}
        const d1 = U[i + j] - U[i], d2 = U[i + j + 1] - U[i + 1];
        if (d1) v += ((u - U[i]) / d1) * a;
        if (d2) v += ((U[i + j + 1] - u) / d2) * b;
        row[r] = v;
      }
      N.push(row);
    }
    const d = new Array(p + 1).fill(0);
    for (let r = 0; r <= p; r++) {
      const i = span - p + r;
      const a = r - 1 >= 0 ? N[p - 1][r - 1] : 0, b = r <= p - 1 ? N[p - 1][r] : 0;
      const d1 = U[i + p] - U[i], d2 = U[i + p + 1] - U[i + 1];
      d[r] = (d1 ? (p / d1) * a : 0) - (d2 ? (p / d2) * b : 0);
    }
    out.push({ span: span - p, n: N[p], d, p });
  }
  return out;
}

const VS = "attribute vec3 p;attribute vec3 nm;uniform mat4 mvp;varying vec3 vn;void main(){vn=nm;gl_Position=mvp*vec4(p,1.0);}";
const FS = "precision mediump float;varying vec3 vn;uniform sampler2D tex;uniform vec4 col;void main(){vec3 n=normalize(vn);if(n.z<0.0)n=-n;vec2 uv=vec2(n.x,-n.y)*0.5+0.5;vec3 c=texture2D(tex,uv).rgb*col.rgb;gl_FragColor=vec4(c*col.a,0.0);}";

/** Camera distance of the PSP's XMB and boot intro (firmware 6.61). */
export const PSP_CAMERA_Z = 236;
/** Models the firmware places itself sit this far below the screen centre (fitted against console screenshots). */
export const PSP_NATIVE_Y = -24;

function perspective(fovy: any, aspect: any, near: any, far: any) {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}

export function createPspWave(canvas: HTMLCanvasElement, w: PspWaveData, opts: WaveOpts = {}) {
  const gl0 = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true });
  if (!gl0) return null;
  const gl: WebGLRenderingContext = gl0;
  const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  gl.useProgram(pr);
  const US = opts.uSamples || 72, VSm = opts.vSamples || 28;
  const bu = basis(w.knotsU, w.u, US), bv = basis(w.knotsV, w.v, VSm);
  const idx: number[] = [];
  for (let v = 0; v + 1 < VSm; v++) for (let u = 0; u + 1 < US; u++) { const a = v * US + u; idx.push(a, a + US, a + 1, a + 1, a + US, a + US + 1); }
  const ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  const vb = gl.createBuffer();
  const verts = new Float32Array(US * VSm * 6);
  const lp = gl.getAttribLocation(pr, "p"), ln = gl.getAttribLocation(pr, "nm");
  const uM = gl.getUniformLocation(pr, "mvp"), uC = gl.getUniformLocation(pr, "col");
  const tx = gl.createTexture();
  let texReady = false;
  const img = new Image();
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texReady = true;
  };
  img.src = w.tex || "";
  const cps = w.u * w.v, M: number[] = new Array(16), W: number[] = new Array(w.morphs);
  const blended = new Float32Array(cps * 3), rowP = new Float32Array(w.v * US * 3), rowD = new Float32Array(w.v * US * 3);
  const STOCK = { x: 0, y: 0, z: 0, sx: 8.5, sy: 8.5, sz: 8.5, r: 1, g: 1, b: 1, a: 1, rx: 0, ry: 0, rz: 0 };
  // a live scene object (moved, faded, rotated by the layout's scripts) or a fixed placement
  let obj: any = w.obj || STOCK;

  function pose(frame: any) {
    for (let i = 0; i < 16; i++) M[i] = w.matrix[i];
    if (w.matrixTrack) track(w.matrixTrack, frame, M);
    for (let i = 0; i < w.morphs; i++) W[i] = w.restMorph[i];
    if (w.morphTrack) { const t: number[] = new Array(w.morphTrack.dims); track(w.morphTrack, frame, t); for (let i = 0; i < w.morphs && i < t.length; i++) W[i] = t[i]; }
    // keep the interpolated rotation orthonormal
    for (let c = 0; c < 3; c++) {
      for (let q = 0; q < c; q++) { const d = M[c * 4] * M[q * 4] + M[c * 4 + 1] * M[q * 4 + 1] + M[c * 4 + 2] * M[q * 4 + 2]; for (let k = 0; k < 3; k++) M[c * 4 + k] -= d * M[q * 4 + k]; }
      const l = Math.hypot(M[c * 4], M[c * 4 + 1], M[c * 4 + 2]) || 1;
      for (let k = 0; k < 3; k++) M[c * 4 + k] /= l;
    }
    blended.fill(0);
    for (let m = 0; m < w.morphs; m++) { const k = W[m]; if (!k) continue; const o = m * cps * 3; for (let i = 0; i < cps * 3; i++) blended[i] += w.ctrl[o + i] * k; }
    // the object's own rotation (radians, X then Y then Z), as its scripts set it
    const rx = obj.rx || 0, ry = obj.ry || 0, rz = obj.rz || 0;
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
    const rot = rx || ry || rz;
    const ssx = obj.sx ?? 1, ssy = obj.sy ?? 1, ssz = obj.sz ?? obj.sx ?? 1;
    for (let i = 0; i < cps; i++) {
      const x = blended[i * 3], y = blended[i * 3 + 1], z = blended[i * 3 + 2];
      let px = (M[0] * x + M[4] * y + M[8] * z + M[12]) * ssx;
      let py = (M[1] * x + M[5] * y + M[9] * z + M[13]) * ssy;
      let pz = (M[2] * x + M[6] * y + M[10] * z + M[14]) * ssz;
      if (rot) {
        let t = py * cx - pz * sx; pz = py * sx + pz * cx; py = t;
        t = px * cy + pz * sy; pz = -px * sy + pz * cy; px = t;
        t = px * cz - py * sz; py = px * sz + py * cz; px = t;
      }
      blended[i * 3] = px + (obj.x || 0);
      blended[i * 3 + 1] = py + (obj.y || 0) + (opts.yOffset ?? 0);
      blended[i * 3 + 2] = pz + (obj.z || 0);
    }
  }

  function tessellate() {
    for (let r = 0; r < w.v; r++) for (let s = 0; s < US; s++) {
      const b = bu[s];
      let px = 0, py = 0, pz = 0, dx = 0, dy = 0, dz = 0;
      for (let i = 0; i <= b.p; i++) {
        const ci = b.span + i; if (ci < 0 || ci >= w.u) continue;
        const o = (r * w.u + ci) * 3;
        px += blended[o] * b.n[i]; py += blended[o + 1] * b.n[i]; pz += blended[o + 2] * b.n[i];
        dx += blended[o] * b.d[i]; dy += blended[o + 1] * b.d[i]; dz += blended[o + 2] * b.d[i];
      }
      const o = (r * US + s) * 3;
      rowP[o] = px; rowP[o + 1] = py; rowP[o + 2] = pz; rowD[o] = dx; rowD[o + 1] = dy; rowD[o + 2] = dz;
    }
    let k = 0;
    for (let t = 0; t < VSm; t++) {
      const b = bv[t];
      for (let s = 0; s < US; s++) {
        let px = 0, py = 0, pz = 0, ux = 0, uy = 0, uz = 0, vx = 0, vy = 0, vz = 0;
        for (let j = 0; j <= b.p; j++) {
          const r = b.span + j; if (r < 0 || r >= w.v) continue;
          const o = (r * US + s) * 3;
          px += rowP[o] * b.n[j]; py += rowP[o + 1] * b.n[j]; pz += rowP[o + 2] * b.n[j];
          ux += rowD[o] * b.n[j]; uy += rowD[o + 1] * b.n[j]; uz += rowD[o + 2] * b.n[j];
          vx += rowP[o] * b.d[j]; vy += rowP[o + 1] * b.d[j]; vz += rowP[o + 2] * b.d[j];
        }
        let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        const l = Math.hypot(nx, ny, nz) || 1;
        verts[k++] = px; verts[k++] = py; verts[k++] = pz;
        verts[k++] = nx / l; verts[k++] = ny / l; verts[k++] = nz / l;
      }
    }
  }

  /** live: the scene object to follow this frame; clear: false when several models share the canvas. */
  function draw(timeMs: any, live?: any, clear = opts.clear ?? true) {
    if (live) obj = live;
    const cw = canvas.width, ch = canvas.height;
    gl.viewport(0, 0, cw, ch);
    if (clear) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    if (!texReady || (obj.a ?? 1) <= 0.003) return;
    const span = w.frameEnd - w.frameStart;
    const frame = span > 0 ? w.frameStart + ((timeMs / 1000) * w.rate * (opts.speed || 1)) % span : w.frameStart;
    pose(frame);
    tessellate();
    gl.useProgram(pr);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    // camera, as the PSP firmware sets it (vshmain / opening_plugin): at (0, 0, 236) looking at the
    // origin, with a projection that shows the z = 0 plane as the 480 x 272 screen (≈ 60° vertical
    // field of view). It never moves; all motion comes from the model's own animation.
    const dist = PSP_CAMERA_Z, fov = 2 * Math.atan(136 / dist), aspect = cw / ch;
    const fovy = aspect >= 480 / 272 ? 2 * Math.atan(240 / aspect / dist) : fov;
    // zoom: the camera's distance as a multiple of the standard one (a camera move, e.g. the boot intro's)
    const dz = dist * (opts.zoom ? opts.zoom(timeMs) : 1);
    const P = perspective(fovy, aspect, dz * 0.1, dz * 4);
    P[14] += P[10] * -dz; P[15] += P[11] * -dz; // translate by -dz along z (lookAt from +z)
    gl.uniformMatrix4fv(uM, false, new Float32Array(P));
    const a = w.alpha * (obj.a ?? 1) * (opts.intensity ?? 1);
    const tint = opts.tint || [1, 1, 1];
    gl.uniform4f(uC, w.diffuse[0] * 1.3 * obj.r * tint[0], w.diffuse[1] * 1.3 * obj.g * tint[1], w.diffuse[2] * 1.3 * obj.b * tint[2], a);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(ln); gl.vertexAttribPointer(ln, 3, gl.FLOAT, false, 24, 12);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // additive, like the PSP (SRC_ALPHA, ONE with alpha folded in)
    gl.disable(gl.DEPTH_TEST);
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
  }
  return { draw, ready: () => texReady };
}
