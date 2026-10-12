// PS3 dynamic themes: the scene runtime. Holds actors, camera and lights as the .raf describes
// them, runs the theme's script (VSMX) with the objects it expects (Actor, Camera, Light, System,
// timers, Math, Date) and animates property changes over time (linear or bezier), like the PS3.
import { VFunc, VsmxProgram, VsmxVM } from "./vsmx";

export interface RafMesh {
  vertexes: number;
  positions: number[];
  normals?: number[];
  uvs?: number[];
  colors?: number[];
  indexes: number[];
  ok: boolean;
  skinned: boolean;
}
export interface RafSceneData {
  actors: Record<string, any>[];
  models: Record<string, { mesh?: string; anims?: { id: string; file: string; data?: import("./edgeAnim").AnimData | null }[] }>;
  materials: Record<string, { effect: string; textures: string[] }>;
  textures: Record<string, { url: string | null }>;
  meshes: Record<string, RafMesh>;
  cameras: Record<string, any>[];
  lights: Record<string, any>[];
  script: VsmxProgram | null;
}

export const INTERPOLATION_LINEAR = 0;
export const INTERPOLATION_BEZIER = 1;

type Vec = number[];
const copy = (v: any, n: number, def: number): Vec => {
  const out = new Array(n).fill(def);
  if (Array.isArray(v)) for (let i = 0; i < n; i++) if (typeof v[i] === "number") out[i] = v[i];
  return out;
};

/** cubic bezier easing (CSS-style x1, y1, x2, y2) */
function bezierEase(t: number, p: number[]): number {
  const [x1, y1, x2, y2] = [p[0] ?? 0.4, p[1] ?? 0, p[2] ?? 0.6, p[3] ?? 1].map((x) => Math.min(1, Math.max(0, x)));
  const bx = (s: number) => 3 * x1 * s * (1 - s) ** 2 + 3 * x2 * s * s * (1 - s) + s ** 3;
  const by = (s: number) => 3 * y1 * s * (1 - s) ** 2 + 3 * y2 * s * s * (1 - s) + s ** 3;
  let lo = 0, hi = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (bx(mid) < t) lo = mid;
    else hi = mid;
  }
  return by((lo + hi) / 2);
}

interface Tween {
  obj: any;
  key: string;
  from: Vec;
  to: Vec;
  t0: number;
  dur: number;
  mode: number;
  bez?: number[];
}

/** An object whose vector properties can be set at once or animated (setX(value, seconds, interpolation, bezier)). */
class Animated {
  constructor(protected rt: RafRuntime) {}
  protected animate(key: string, n: number, value: any, dur?: number, mode?: number, bez?: number[]) {
    const to = typeof value === "number" ? [value] : copy(value, n, 0);
    this.rt.cancelTween(this, key);
    if (!dur || dur <= 0) {
      (this as any)["_" + key] = n === 1 ? [to[0]] : to;
      return;
    }
    const from = copy((this as any)["_" + key], n, 0);
    this.rt.tweens.push({ obj: this, key, from, to: copy(to, n, 0), t0: this.rt.time, dur, mode: mode ?? INTERPOLATION_LINEAR, bez });
  }
}

export class ActorState extends Animated {
  _position: Vec; _rotation: Vec; _scale: Vec; _color: Vec; _uv_offset: Vec; _uv_scale: Vec;
  _anim_speed: Vec; _anim_time: Vec; _anim_weight: Vec;
  /** Orientation set by the script (actor.direction / actor.up): the model's +Z and +Y axes in the
   *  world, applied before rotation. Null until a script sets one (Dark Souls billboards). */
  _direction: Vec | null = null; _up: Vec | null = null;
  enable = true;
  id: string; model: string; material: string; zsort: string;
  constructor(rt: RafRuntime, a: Record<string, any>) {
    super(rt);
    this.id = a.id;
    this.model = a.model;
    this.material = a.material;
    this.zsort = a.zsort ?? "";
    this._position = copy(a.position, 3, 0);
    this._rotation = copy(a.rotation, 3, 0);
    this._scale = copy(a.scale, 3, 1);
    this._color = copy(a.color, 4, 1);
    this._uv_offset = copy(a.uv_offset, 2, 0);
    this._uv_scale = copy(a.uv_scale, 2, 1);
    this._anim_speed = copy(a.anim_speed, 8, 1);
    this._anim_time = copy(a.anim_time, 8, 0);
    this._anim_weight = copy(a.anim_weight, 8, 0);
  }
  get position() { return this._position.slice(); } set position(v: any) { this.animate("position", 3, v); }
  get rotation() { return this._rotation.slice(); } set rotation(v: any) { this.animate("rotation", 3, v); }
  get scale() { return this._scale.slice(); } set scale(v: any) { this.animate("scale", 3, v); }
  get color() { return this._color.slice(); } set color(v: any) { this.animate("color", 4, v); }
  get uv_offset() { return this._uv_offset.slice(); } set uv_offset(v: any) { this.animate("uv_offset", 2, v); }
  get uv_scale() { return this._uv_scale.slice(); } set uv_scale(v: any) { this.animate("uv_scale", 2, v); }
  get anim_speed() { return this._anim_speed.slice(); } set anim_speed(v: any) { this.animate("anim_speed", 8, v); }
  get anim_time() { return this._anim_time.slice(); } set anim_time(v: any) { this.animate("anim_time", 8, v); }
  get anim_weight() { return this._anim_weight.slice(); } set anim_weight(v: any) { this.animate("anim_weight", 8, v); }
  get direction() { return (this._direction ?? [0, 0, 1]).slice(); } set direction(v: any) { this._direction ??= [0, 0, 1]; this.animate("direction", 3, v); }
  get up() { return (this._up ?? [0, 1, 0]).slice(); } set up(v: any) { this._up ??= [0, 1, 0]; this.animate("up", 3, v); }
  get name() { return this.id; }
  setPosition(v: any, d?: number, m?: number, b?: number[]) { this.animate("position", 3, v, d, m, b); }
  setRotation(v: any, d?: number, m?: number, b?: number[]) { this.animate("rotation", 3, v, d, m, b); }
  setScale(v: any, d?: number, m?: number, b?: number[]) { this.animate("scale", 3, v, d, m, b); }
  setColor(v: any, d?: number, m?: number, b?: number[]) { this.animate("color", 4, v, d, m, b); }
  setUVOffset(v: any, d?: number, m?: number, b?: number[]) { this.animate("uv_offset", 2, v, d, m, b); }
  setUVScale(v: any, d?: number, m?: number, b?: number[]) { this.animate("uv_scale", 2, v, d, m, b); }
  setAnimSpeed(v: any, d?: number, m?: number, b?: number[]) { this.animate("anim_speed", 8, typeof v === "number" ? new Array(8).fill(v) : v, d, m, b); }
  setAnimTime(v: any, d?: number, m?: number, b?: number[]) { this.animate("anim_time", 8, typeof v === "number" ? [v, ...this._anim_time.slice(1)] : v, d, m, b); }
  setAnimWeight(v: any, d?: number, m?: number, b?: number[]) { this.animate("anim_weight", 8, v, d, m, b); }
  setDirection(v: any, d?: number, m?: number, b?: number[]) { this._direction ??= [0, 0, 1]; this.animate("direction", 3, v, d, m, b); }
  setUp(v: any, d?: number, m?: number, b?: number[]) { this._up ??= [0, 1, 0]; this.animate("up", 3, v, d, m, b); }
  getAnimIndex(_name?: string) { return 0; }
}

export class CameraState extends Animated {
  _position: Vec; _direction: Vec; _up: Vec; _yfov: Vec; _ymag: Vec; _znear: Vec; _zfar: Vec;
  type: number;
  constructor(rt: RafRuntime, a: Record<string, any>) {
    super(rt);
    this.type = a.type ?? 0;
    this._position = copy(a.position, 3, 0);
    this._direction = copy(a.direction ?? [0, 0, -1], 3, 0);
    this._up = copy(a.up ?? [0, 1, 0], 3, 0);
    this._yfov = [a.yfov ?? 0.9];
    this._ymag = [a.ymag ?? 0];
    this._znear = [a.znear ?? 0.1];
    this._zfar = [a.zfar ?? 1000];
  }
  get position() { return this._position.slice(); } set position(v: any) { this.animate("position", 3, v); }
  get direction() { return this._direction.slice(); } set direction(v: any) { this.animate("direction", 3, v); }
  get up() { return this._up.slice(); } set up(v: any) { this.animate("up", 3, v); }
  get yfov() { return this._yfov[0]; } set yfov(v: any) { this.animate("yfov", 1, v); }
  get ymag() { return this._ymag[0]; } set ymag(v: any) { this.animate("ymag", 1, v); }
  get aspect() { return this.rt.aspect; }
  setPosition(v: any, d?: number, m?: number, b?: number[]) { this.animate("position", 3, v, d, m, b); }
  setDirection(v: any, d?: number, m?: number, b?: number[]) { this.animate("direction", 3, v, d, m, b); }
  setUp(v: any, d?: number, m?: number, b?: number[]) { this.animate("up", 3, v, d, m, b); }
  setYfov(v: any, d?: number, m?: number, b?: number[]) { this.animate("yfov", 1, v, d, m, b); }
}

export class LightState extends Animated {
  _position: Vec; _direction: Vec; _color: Vec; _attenuation: Vec;
  type: number;
  enable = true;
  constructor(rt: RafRuntime, a: Record<string, any>) {
    super(rt);
    this.type = a.type ?? 0;
    this._position = copy(a.position, 3, 0);
    this._direction = copy(a.direction ?? [0, 0, -1], 3, 0);
    this._color = copy(a.color, 3, 1);
    this._attenuation = copy(a.attenuation ?? [1, 0, 0], 3, 0);
  }
  get position() { return this._position.slice(); } set position(v: any) { this.animate("position", 3, v); }
  get direction() { return this._direction.slice(); } set direction(v: any) { this.animate("direction", 3, v); }
  get color() { return this._color.slice(); } set color(v: any) { this.animate("color", 3, v); }
  setPosition(v: any, d?: number, m?: number, b?: number[]) { this.animate("position", 3, v, d, m, b); }
  setDirection(v: any, d?: number, m?: number, b?: number[]) { this.animate("direction", 3, v, d, m, b); }
  setColor(v: any, d?: number, m?: number, b?: number[]) { this.animate("color", 3, v, d, m, b); }
}

interface Timer {
  next: number;
  interval: number;
  fn: any;
  repeat: boolean;
}

export class RafRuntime {
  time = 0;
  aspect = 16 / 9;
  frameDt = 1 / 30;
  tweens: Tween[] = [];
  actors: ActorState[] = [];
  byId = new Map<string, ActorState>();
  camera: CameraState;
  lights: LightState[];
  vm: VsmxVM | null = null;
  timers = new Map<any, Timer>();
  errors = 0;
  log: (m: string) => void = () => {};

  constructor(public scene: RafSceneData) {
    for (const a of scene.actors) {
      const s = new ActorState(this, a);
      this.actors.push(s);
      if (a.id) this.byId.set(a.id, s);
    }
    this.camera = new CameraState(this, scene.cameras[0] ?? {});
    this.lights = scene.lights.map((l) => new LightState(this, l));
  }

  cancelTween(obj: any, key: string) {
    this.tweens = this.tweens.filter((t) => !(t.obj === obj && t.key === key));
  }

  /** Starts the theme's script. */
  start() {
    if (!this.scene.script) return;
    const rt = this;
    // System.timer and every actor's, camera's and light's .timer[] hold timers: storing one starts it
    const makeTimerList = (): any[] => new Proxy([], {
      set(target: any, p, value) {
        const old = target[p as any];
        if (old && rt.timers.has(old)) rt.timers.delete(old);
        target[p as any] = value;
        if (value && value.__timer) rt.timers.set(value, value.__timer);
        return true;
      },
      deleteProperty(target: any, p) {
        const old = target[p as any];
        if (old) rt.timers.delete(old);
        delete target[p as any];
        return true;
      },
    });
    const timerList = makeTimerList();
    for (const o of [...this.actors, this.camera, ...this.lights] as any[]) if (o) o.timer = makeTimerList();
    function makeTimer(repeat: boolean) {
      return function (this: any, interval: number, fn: any) {
        const t = { __timer: { next: rt.time + Math.max(0.001, Number(interval) || 0), interval: Math.max(0.001, Number(interval) || 0), fn, repeat } as Timer, interval, func: fn };
        return t;
      };
    }
    const byName = (list: any[], name: any) => list.find((x) => x.id === name);
    const ActorCtor = function (name: string) {
      const a: any = rt.byId.get(name) ?? new ActorState(rt, { id: name });
      if (!a.timer) a.timer = makeTimerList();
      return a;
    };
    const CameraCtor = function (_name?: string) {
      return rt.camera;
    };
    const LightCtor = function (name: string) {
      const i = rt.scene.lights.findIndex((l) => l.id === name);
      return i >= 0 ? rt.lights[i] : byName(rt.lights, name) ?? rt.lights[0] ?? new LightState(rt, {});
    };
    const DateCtor = function () {
      const d = new Date();
      return {
        hours: d.getHours(), minutes: d.getMinutes(), seconds: d.getSeconds(), day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear(), weekday: d.getDay(),
        getHours: () => d.getHours(), getMinutes: () => d.getMinutes(), getSeconds: () => d.getSeconds(), getDate: () => d.getDate(), getDay: () => d.getDay(), getMonth: () => d.getMonth(), getFullYear: () => d.getFullYear(), getTime: () => d.getTime(),
      };
    };
    // the PS3's Math works on vectors too, element by element: Math.sin([a, b, c, d]) (ICO's camera sway)
    const vec1 = (f: (x: number) => number) => (x: any) => (Array.isArray(x) ? x.map((v) => f(v)) : f(x));
    const vec2 = (f: (x: number, y: number) => number) => (x: any, y: any) =>
      Array.isArray(x) || Array.isArray(y)
        ? (Array.isArray(x) ? x : y).map((_: any, i: number) => f(Array.isArray(x) ? x[i] : x, Array.isArray(y) ? y[i] : y))
        : f(x, y);
    const elementwise: Record<string, any> = {};
    for (const k of ["sin", "cos", "tan", "asin", "acos", "atan", "exp", "log", "sqrt", "abs", "floor", "ceil", "round", "sign", "trunc"] as const) elementwise[k] = vec1((Math as any)[k]);
    for (const k of ["atan2", "pow"] as const) elementwise[k] = vec2((Math as any)[k]);
    elementwise.min = (...a: any[]) => (a.some(Array.isArray) ? a.reduce((p, q) => vec2(Math.min)(p, q)) : Math.min(...a));
    elementwise.max = (...a: any[]) => (a.some(Array.isArray) ? a.reduce((p, q) => vec2(Math.max)(p, q)) : Math.max(...a));
    const MathObj = Object.assign(Object.create(Math), elementwise, {
      dot: (a: number[], b: number[]) => (a ?? []).reduce((s, x, i) => s + x * (b?.[i] ?? 0), 0),
      cross: (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
      length: (a: number[]) => Math.hypot(...(a ?? [])),
      normalize: (a: number[]) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); },
      lerp: (a: any, b: any, t: number) => (Array.isArray(a) ? a.map((x: number, i: number) => x + (b[i] - x) * t) : a + (b - a) * t),
    });
    const globals: Record<string, any> = {
      Actor: ActorCtor,
      Camera: CameraCtor,
      Light: LightCtor,
      IntervalTimer: makeTimer(true),
      OneShotTimer: makeTimer(false),
      Math: MathObj,
      Date: DateCtor,
      Array: function (...a: any[]) { return a.length === 1 && typeof a[0] === "number" ? new Array(a[0]) : a; },
      Object: function () { return {}; },
      // conversions the PS3's script engine provides (Int(x) truncates; used for frame numbers)
      Int: (x: any) => Math.trunc(Number(x)) || 0,
      Float: (x: any) => Number(x) || 0,
      Boolean,
      Error: function (this: any, m?: any) { this.message = m == null ? "" : String(m); this.toString = () => "Error: " + this.message; },
      String,
      Number,
      parseInt,
      parseFloat,
      isNaN,
      undefined: undefined,
      INTERPOLATION_LINEAR,
      INTERPOLATION_BEZIER,
      System: {
        timer: timerList,
        get resolution() { return [1920, 1080]; },
        get aspect() { return rt.aspect; },
        printPerf() {},
        printHeap() {},
        get time() { return rt.time; },
        // the frame interval in seconds: scripts run IntervalTimer(System.interval, …) as their
        // per-frame update and add it to their own clocks (Crackling Fireplace)
        get interval() { return rt.frameDt; },
      },
      writeln: (...m: any[]) => rt.log(m.join(" ")),
      print: (...m: any[]) => rt.log(m.join(" ")),
      write: (...m: any[]) => rt.log(m.join(" ")),
    };
    this.vm = new VsmxVM(this.scene.script, globals);
    this.vm.log = (m) => this.log(m);
    this.safe(() => this.vm!.run());
  }

  private safe(f: () => void) {
    try {
      f();
    } catch (e) {
      this.errors++;
      this.log("raf script error: " + String((e as any)?.value ?? e));
    }
  }

  /** Advances the scene by dt seconds: timers fire, animations move. */
  update(dt: number) {
    this.frameDt = Math.min(dt, 0.25);
    this.time += this.frameDt;
    for (const [key, t] of [...this.timers]) {
      if (this.time >= t.next) {
        if (t.repeat) t.next += t.interval * Math.max(1, Math.ceil((this.time - t.next) / t.interval + 1e-9));
        else this.timers.delete(key);
        this.safe(() => this.vm?.call(t.fn instanceof VFunc || typeof t.fn === "function" ? t.fn : undefined));
      }
    }
    const done: Tween[] = [];
    for (const tw of this.tweens) {
      let p = tw.dur > 0 ? (this.time - tw.t0) / tw.dur : 1;
      if (p >= 1) { p = 1; done.push(tw); }
      const e = tw.mode === INTERPOLATION_BEZIER ? bezierEase(p, tw.bez ?? []) : p;
      const v = tw.from.map((a, i) => a + (tw.to[i] - a) * e);
      tw.obj["_" + tw.key] = v;
    }
    if (done.length) this.tweens = this.tweens.filter((t) => !done.includes(t));
    // model animations run on their own clocks
    for (const a of this.actors) a._anim_time = a._anim_time.map((t, i) => t + dt * (a._anim_speed[i] ?? 1));
  }
}
