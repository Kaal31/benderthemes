// VSMX: Sony's compiled "PlayStation JavaScript" (PSP RCOs, PS3 .raf scene scripts).
// A small stack machine; this interpreter runs the scripts of PS3 dynamic themes.
// Instruction set worked out from the scripts themselves (see HANDOFF/ps3/README.md).

const undef0 = (a: any, b: any) => (a === undefined && b === 0) || (b === undefined && a === 0);

export interface VsmxProgram {
  version: number;
  code: [number, number][]; // [opcode word, value]
  text: string[];
  prop: string[];
  names: string[];
}

export class VFunc {
  prototype: any = {};
  constructor(public start: number, public args: number, public locals: number) {}
}

type Ref =
  | { k: "var"; name: string }
  | { k: "local"; i: number }
  | { k: "prop"; obj: any; name: string }
  | { k: "idx"; obj: any; i: any };
const isRef = (v: any): v is Ref => v && typeof v === "object" && v.__ref === true;
const ref = (r: Ref): any => Object.assign(r, { __ref: true });

class Throw {
  constructor(public value: any) {}
}

interface Frame {
  locals: any[];
  self: any;
}

const isVec = (v: any) => Array.isArray(v);
function arith(op: string, a: any, b: any): any {
  if (isVec(a) || isVec(b)) {
    const n = Math.max(isVec(a) ? a.length : 0, isVec(b) ? b.length : 0);
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = arith(op, isVec(a) ? a[i] ?? 0 : a, isVec(b) ? b[i] ?? 0 : b);
    return out;
  }
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return a / b;
    case "%": return a % b;
  }
}

export class VsmxVM {
  globals: Record<string, any>;
  steps = 0;
  maxSteps = 2_000_000; // per call: a runaway loop must not freeze the home screen
  log: (msg: string) => void = () => {};

  constructor(public prog: VsmxProgram, globals: Record<string, any>) {
    this.globals = globals;
  }

  /** Runs the top-level program. */
  run() {
    this.exec(0, { locals: [], self: this.globals });
  }

  /** Calls a script function (timer callbacks and the like). */
  call(fn: any, self: any = this.globals, args: any[] = []): any {
    if (fn instanceof VFunc) {
      const locals = new Array(Math.max(fn.locals, fn.args) + 2).fill(undefined);
      args.forEach((a, i) => (locals[i + 1] = a));
      locals[0] = args.slice(); // local 0 is the function's `arguments`
      return this.exec(fn.start, { locals, self });
    }
    if (typeof fn === "function") {
      // script callbacks handed to array methods (list.sort(compare)) run in this VM
      if (Array.isArray(self)) args = args.map((a) => (a instanceof VFunc ? (...x: any[]) => this.call(a, this.globals, x) : a));
      return fn.apply(self, args);
    }
    return undefined;
  }

  private get(v: any, f: Frame): any {
    if (!isRef(v)) return v;
    const r = v as Ref;
    switch (r.k) {
      case "var": return r.name in this.globals ? this.globals[r.name] : undefined;
      case "local": return f.locals[r.i];
      case "prop": return r.obj == null ? undefined : r.obj[r.name];
      case "idx": return r.obj == null ? undefined : r.obj[r.i];
    }
  }
  private set(r: Ref, val: any, f: Frame) {
    switch (r.k) {
      case "var": this.globals[r.name] = val; break;
      case "local": f.locals[r.i] = val; break;
      case "prop": if (r.obj != null) r.obj[r.name] = val; break;
      case "idx": if (r.obj != null) r.obj[r.i] = val; break;
    }
  }

  private construct(ctor: any, args: any[]): any {
    if (ctor instanceof VFunc) {
      const obj = Object.create(ctor.prototype ?? {});
      this.call(ctor, obj, args);
      return obj;
    }
    if (typeof ctor === "function") {
      try {
        return new (ctor as any)(...args);
      } catch {
        return ctor(...args);
      }
    }
    return {};
  }

  private exec(pc: number, f: Frame): any {
    const { code, text, prop, names } = this.prog;
    let st: any[] = [];
    const handlers: { catchPc: number; depth: number }[] = [];
    let thrown: any = undefined;
    const pop = () => st.pop();
    const val = (x: any) => this.get(x, f);
    const popv = () => val(st.pop());
    let steps = 0;
    for (;;) {
      if (pc < 0 || pc >= code.length) return undefined;
      if (++steps > this.maxSteps) {
        this.log("vsmx: step limit");
        return undefined;
      }
      const [word, v] = code[pc];
      const op = word & 0xff;
      pc++;
      try {
        switch (op) {
          case 0x00: break;
          case 0x01: { // assign: ref = value (leaves the value)
            const value = popv();
            const r = pop();
            if (isRef(r)) this.set(r, value, f);
            st.push(value);
            break;
          }
          case 0x02: { const b = popv(), a = popv(); st.push(isVec(a) || isVec(b) ? arith("+", a, b) : a + b); break; }
          case 0x03: { const b = popv(), a = popv(); st.push(arith("-", a, b)); break; }
          case 0x04: { const b = popv(), a = popv(); st.push(arith("*", a, b)); break; }
          case 0x05: { const b = popv(), a = popv(); st.push(arith("/", a, b)); break; }
          case 0x06: { const b = popv(), a = popv(); st.push(arith("%", a, b)); break; }
          case 0x07: st.push(+popv()); break;
          case 0x08: { const a = popv(); st.push(isVec(a) ? a.map((x: number) => -x) : -a); break; }
          case 0x09: st.push(!popv()); break;
          case 0x0a: case 0x0b: case 0x0c: case 0x0d: { // ++ / --
            const r = pop();
            const old = Number(val(r)) || 0;
            const nv = op === 0x0a || op === 0x0c ? old + 1 : old - 1;
            if (isRef(r)) this.set(r, nv, f);
            st.push(op === 0x0a || op === 0x0b ? old : nv);
            break;
          }
          // == and != treat an unset variable as 0: The Game Is Just The Start compares a global it
          // never sets with 0 and only shows its scene when that is true (as on a PS3 video)
          case 0x0e: { const b = popv(), a = popv(); st.push(a == b || undef0(a, b)); break; }
          case 0x0f: { const b = popv(), a = popv(); st.push(a != b && !undef0(a, b)); break; }
          case 0x10: { const b = popv(), a = popv(); st.push(a === b); break; }
          case 0x11: { const b = popv(), a = popv(); st.push(a !== b); break; }
          case 0x12: { const b = popv(), a = popv(); st.push(a < b); break; }
          case 0x13: { const b = popv(), a = popv(); st.push(a <= b); break; }
          case 0x14: { const b = popv(), a = popv(); st.push(a >= b); break; }
          case 0x15: { const b = popv(), a = popv(); st.push(a > b); break; }
          case 0x16: { const b = popv(), a = popv(); st.push(b instanceof VFunc ? a != null && Object.getPrototypeOf(a) === b.prototype : typeof b === "function" ? a instanceof b : false); break; }
          case 0x17: { const b = popv(), a = popv(); st.push(b != null && a in b); break; }
          case 0x18: { const a = popv(); st.push(a instanceof VFunc ? "function" : isVec(a) ? "object" : typeof a); break; }
          case 0x19: { const b = popv(), a = popv(); st.push(a & b); break; }
          case 0x1a: { const b = popv(), a = popv(); st.push(a ^ b); break; }
          case 0x1b: { const b = popv(), a = popv(); st.push(a | b); break; }
          case 0x1c: st.push(~popv()); break;
          case 0x1d: { const b = popv(), a = popv(); st.push(a << b); break; }
          case 0x1e: { const b = popv(), a = popv(); st.push(a >> b); break; }
          case 0x1f: { const b = popv(), a = popv(); st.push(a >>> b); break; }
          case 0x20: st.push(val(st[st.length - 1])); break; // duplicate the top value (x op= y)
          case 0x21: st.push(thrown); break; // the caught exception
          case 0x22: st = []; break; // end of statement
          case 0x23: st.push(null); break;
          case 0x24: st.push([]); break;
          case 0x25: st.push(v === 1); break;
          case 0x26: st.push(v | 0); break;
          case 0x27: st.push(v); break;
          case 0x28: st.push(text[v]); break;
          case 0x29: st.push({}); break;
          case 0x2a: { // function literal; its body follows and is skipped by the next jump
            const fn = new VFunc(v, (word >> 8) & 0xff, (word >> 24) & 0xff);
            st.push(fn);
            break;
          }
          case 0x2b: st.push([]); break;
          case 0x2c: st.push(f.self); break;
          case 0x2d: st.push(ref({ k: "local", i: v })); break;
          case 0x2e: st.push(ref({ k: "var", name: names[v] })); break;
          case 0x2f: { const o = popv(); st.push(ref({ k: "prop", obj: o, name: prop[v] })); break; }
          case 0x30: { // method / property read that keeps the object (for a call or a write-back)
            const o = val(st[st.length - 1]);
            st[st.length - 1] = o;
            st.push(o == null ? undefined : o[prop[v]]);
            break;
          }
          case 0x31: { // object.prop = value
            const value = popv();
            const o = popv();
            if (o != null) o[prop[v]] = value;
            st.push(value);
            break;
          }
          case 0x32: { const o = popv(); if (o != null) delete o[prop[v]]; break; }
          case 0x33: { const value = popv(); const o = val(st[st.length - 1]); if (o != null) o[prop[v]] = value; break; }
          case 0x34: { const i = popv(); const o = popv(); st.push(ref({ k: "idx", obj: o, i })); break; }
          case 0x36: { // obj[i] = value
            const value = popv(), i = popv(), o = popv();
            if (o != null) o[i] = value;
            st.push(value);
            break;
          }
          case 0x37: { const i = popv(), o = popv(); if (o != null) { if (isVec(o)) o[i] = undefined; else delete o[i]; } break; }
          case 0x38: { const value = popv(); const a = val(st[st.length - 1]); if (isVec(a)) a.push(value); break; }
          case 0x39: pc = v; break;
          case 0x3a: if (popv()) pc = v; break;
          case 0x3b: if (!popv()) pc = v; break;
          case 0x3c: { // call fn(args)
            const args = st.splice(st.length - v, v).map(val);
            const fn = popv();
            st.push(this.call(fn, this.globals, args));
            break;
          }
          case 0x3d: { // object.method(args)
            const args = st.splice(st.length - v, v).map(val);
            const fn = popv();
            const self = popv();
            st.push(this.call(fn, self, args));
            break;
          }
          case 0x3e: { // new Ctor(args)
            const args = st.splice(st.length - v, v).map(val);
            const ctor = popv();
            st.push(this.construct(ctor, args));
            break;
          }
          case 0x3f: return st.length ? popv() : undefined;
          case 0x40: throw new Throw(popv());
          case 0x41: handlers.push({ catchPc: v + 1, depth: 0 }); break; // try { … }, catch code after v
          case 0x42: handlers.pop(); break; // try block finished normally
          case 0x43: pc = v; break; // skip the catch block
          case 0x44: break;
          case 0x45: return undefined;
          case 0x46: case 0x47: break; // debug info
          case 0x48: { // obj[i], keeping obj and i for a write-back
            const i = val(st[st.length - 1]);
            const o = val(st[st.length - 2]);
            st[st.length - 1] = i;
            st[st.length - 2] = o;
            st.push(o == null ? undefined : o[i]);
            break;
          }
          case 0x49: { const items = st.splice(st.length - v, v).map(val); st.push(items); break; } // [a, b, c]
          // Vector components (.x .y .z .w; the component is in bits 8-15 of the op word).
          // 0x4a reads a component of the value on top (consuming it); 0x4b reads through a
          // reference and keeps the reference for a later 0x4c. The writes re-read the vector:
          // 0x4c from a reference, 0x4d from obj[prop[value]], 0x4e from obj[i], change the
          // component and store the vector back (compound "+=" compiles to read, op, write).
          case 0x4a: case 0x4b: {
            const c = (word >> 8) & 0xff;
            const a = op === 0x4a ? popv() : val(st[st.length - 1]);
            st.push(isVec(a) ? a[c] : a?.[["x", "y", "z", "w"][c]]);
            break;
          }
          case 0x4c: case 0x4d: case 0x4e: {
            const c = (word >> 8) & 0xff;
            const value = popv();
            const put = (vec: any) => { const nv = isVec(vec) ? vec.slice() : [0, 0, 0, 0]; nv[c] = value; return nv; };
            if (op === 0x4c) { const top = st.pop(); if (isRef(top)) this.set(top, put(val(top)), f); }
            else if (op === 0x4d) { const o = popv(); if (o != null) o[prop[v]] = put(o[prop[v]]); }
            else { const i = popv(), o = popv(); if (o != null) o[i] = put(o[i]); }
            st.push(value);
            break;
          }
          default:
            this.log(`vsmx: unknown op 0x${op.toString(16)} at ${pc - 1}`);
        }
      } catch (e) {
        const h = handlers.pop();
        if (!h) throw e instanceof Throw ? e : new Throw(e);
        thrown = e instanceof Throw ? e.value : String(e);
        st = [];
        pc = h.catchPc;
      }
    }
  }
}
