import {themeHomeOwnsRoute} from "./otherPlugins";
// One focusable root per theme. Steam's gamepad events are turned into a
// simple button stream; the theme decides what each press does and whether
// it consumed it (unconsumed Ⓑ goes back to Steam).
import { Focusable, GamepadButton } from "@decky/ui";
import { failHome } from "./compatibility";
import { createContext, CSSProperties, ReactNode, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";

export type Btn = "up" | "down" | "left" | "right" | "a" | "b" | "x" | "y" | "menu" | "l1" | "r1" | "l2" | "r2";
export interface Press {
  btn: Btn;
  repeat: boolean;
}
export type InputHandler = (p: Press) => boolean | void;

export interface Hints {
  a?: string;
  b?: string;
  x?: string;
  y?: string;
  menu?: string;
}

const DIRS: Record<number, Btn> = {
  [GamepadButton.DIR_UP]: "up",
  [GamepadButton.DIR_DOWN]: "down",
  [GamepadButton.DIR_LEFT]: "left",
  [GamepadButton.DIR_RIGHT]: "right",
};
const OTHER: Record<number, Btn> = {
  [GamepadButton.CANCEL]: "b",
  [GamepadButton.BUMPER_LEFT]: "l1",
  [GamepadButton.BUMPER_RIGHT]: "r1",
  [GamepadButton.TRIGGER_LEFT]: "l2",
  [GamepadButton.TRIGGER_RIGHT]: "r2",
};

const consume = (e: any) => {
  e?.preventDefault?.();
  e?.stopPropagation?.();
};

/**
 * The single gamepad-focused element of a theme. Handlers are routed through
 * a ref so Steam's Focusable (which may keep the first render's callbacks)
 * always calls the latest ones.
 */
/** Buttons handled the same on every theme (L2 / R2 = theme / skin switching). */
let globalInput: InputHandler | null = null;

// L2 / R2 plus vertical direction selects themes; horizontal selects skins.
export type SwitchAxis = "console" | "variant";
export interface L1Switcher {
 available(): boolean;
 begin(): void;
 step(axis: SwitchAxis, dir: -1 | 1, repeat: boolean): void;
 end(stepped: boolean): void;
}
let l1Switcher: L1Switcher | null = null;
export function setL1Switcher(h: L1Switcher | null) { l1Switcher = h; }
const hold = { on: false, trigger: "" as Btn | "", used: false, guard: 0 as any };
export const l1Held = () => hold.on;
const DIR_AXIS: Partial<Record<Btn, [SwitchAxis, -1 | 1]>> = { up: ["console", -1], down: ["console", 1], left: ["variant", -1], right: ["variant", 1] };
function stopHold() {
 clearTimeout(hold.guard);
 if (hold.on) {
  if (!hold.used) l1Switcher?.step("console", hold.trigger === "l2" ? -1 : 1, false);
  hold.on = false; hold.trigger = ""; hold.used = false; l1Switcher?.end(true);
 }
}
export function setGlobalInput(h: InputHandler | null) {
  globalInput = h;
}
/** A full-screen overlay (gallery, trailer) takes every press while it's open. */
let modalInput: InputHandler | null = null;
const modalLayers: InputHandler[]=[];
export function pushModalInput(handler:InputHandler) {modalLayers.push(handler);return()=>{const i=modalLayers.indexOf(handler);if(i>=0)modalLayers.splice(i,1);};}
export function setModalInput(h: InputHandler | null) {
  modalInput = h;
}

export function ThemeRoot({
  onInput,
  activationGate,
  hints,
  children,
  style,
}: {
  onInput: InputHandler;
  activationGate?: (press:Press,run:()=>boolean)=>boolean;
  hints?: Hints;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const direction = useRef<Btn | null>(null);
  const latest = useRef(onInput);
  latest.current = onInput;
  const gate=useRef(activationGate);gate.current=activationGate;
  const fire = (btn: Btn, e: any, direct = false): boolean => {
    if(!themeHomeOwnsRoute()){hold.used=true;stopHold();return false;}
    if (document.querySelector("[data-dht-screensaver=true]")) { stopHold(); return false; }
    const press = { btn, repeat: !!e?.detail?.is_repeat };
    if (!direct) {
      const modalOpen = modalLayers.length > 0 || !!modalInput;
      if (modalOpen || !l1Switcher?.available()) stopHold();
      if (!modalOpen && l1Switcher?.available()) {
        if (btn === "l2" || btn === "r2") {
          if (press.repeat) return true;
          if (!hold.on) { hold.on = true; l1Switcher.begin(); }
          hold.trigger = btn;
          const axis = direction.current ? DIR_AXIS[direction.current] : undefined;
          if (axis) { hold.used = true; l1Switcher.step(axis[0], axis[1], false); }
          clearTimeout(hold.guard);
          hold.guard = setTimeout(stopHold, 4000);
          return true;
        }
        const axis = DIR_AXIS[btn];
        if (hold.on && axis) {
          hold.used = true;
          l1Switcher.step(axis[0], axis[1], press.repeat);
          clearTimeout(hold.guard);
          hold.guard = setTimeout(stopHold, 4000);
          return true;
        }
        if (hold.on) stopHold();
      }
    }
    const run=()=>{
    const modal=modalLayers[modalLayers.length-1]??modalInput;
    if(modal)return !!modal(press);
    if ((btn === "l2" || btn === "r2") && globalInput?.(press)) return true;
    return !!latest.current(press);
    };
    try {
      return gate.current?gate.current(press,run):run();
    }
    catch (error) { failHome(error); return false; }
  };
  const call = useMemo(
    () => ({
      dir: (e: any) => {
        const b = DIRS[e?.detail?.button];
        if (b) direction.current = b;
        if (b && fire(b, e)) consume(e);
      },
      down: (e: any) => {
        const b = OTHER[e?.detail?.button];
        if (b && fire(b, e)) consume(e);
      },
      up: (e: any) => {
        const button = e?.detail?.button;
        const dir = DIRS[button];
        if (dir && direction.current === dir) direction.current = null;
        if (hold.on && OTHER[button] === hold.trigger) { consume(e); stopHold(); }
      },
      ok:(e: any) => {
        if (fire("a", e)) consume(e);
      },
      x: (e: any) => {
        if (fire("x", e)) consume(e);
      },
      y: (e: any) => {
        if (fire("y", e)) consume(e);
      },
      menu: (e: any) => {
        if (fire("menu", e)) consume(e);
      },
    }),
    [],
  );
  return (
    <Focusable
      // @ts-ignore autoFocus exists at runtime
      autoFocus
      noFocusRing
      onGamepadDirection={call.dir}
      onButtonDown={call.down}
      onButtonUp={call.up}
      onOKButton={call.ok}
      onOKActionDescription={hints?.a}
      onSecondaryButton={call.x}
      onSecondaryActionDescription={hints?.x}
      onOptionsButton={call.y}
      onOptionsActionDescription={hints?.y}
      onMenuButton={call.menu}
      onMenuActionDescription={hints?.menu}
      style={{ position: "absolute", inset: 0, overflow: "hidden", outline: "none", ...style }}
    >
      {children}
    </Focusable>
  );
}

// ───────────── Stage: a fixed-width design surface ─────────────
// Every theme is laid out on a 1280-wide surface whose height follows the
// screen's aspect (800 on the Deck), then scaled to the real window.
export interface StageSize {
  W: number;
  H: number;
  scale: number;
}
const StageCtx = createContext<StageSize & { host?: boolean }>({ W: 1280, H: 800, scale: 1 });
export const useStage = () => useContext(StageCtx);

/** Measures an element: the 1280-wide design surface scaled to fit it. */
function useMeasure(ref: { current: HTMLDivElement | null }, on: boolean): StageSize {
  const [size, setSize] = useState<StageSize>({ W: 1280, H: 800, scale: 1 });
  // Resolve the stage scale before paint so newly opened pages never flash
  // at the default 1280px size before settling into their actual viewport.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !on) return;
    const view: any = el.ownerDocument?.defaultView ?? window;
    const measure = () => {
      const w = el.clientWidth || view.innerWidth || 1280;
      const h = el.clientHeight || view.innerHeight || 800;
      const scale = w / 1280;
      const H = Math.round(h / scale);
      setSize((s) => (s.scale === scale && s.H === H ? s : { W: 1280, H, scale }));
    };
    measure();
    view.addEventListener("resize", measure);
    let iv: ReturnType<typeof setInterval> | undefined;
    let ro: any = null;
    try {
      ro = view.ResizeObserver ? new view.ResizeObserver(measure) : null;
      ro?.observe(el);
    } catch {
      ro = null;
    }
    if (!ro) iv = setInterval(measure, 2000);
    return () => {
      view.removeEventListener("resize", measure);
      clearInterval(iv);
      ro?.disconnect?.();
    };
  }, [on]);
  return size;
}

/**
 * Measures the home area once so a theme's own component (which renders its
 * <Stage>) already knows the real W×H, not just its children.
 */
export function StageHost({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useMeasure(ref, true);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0 }}>
      <StageCtx.Provider value={{ ...size, host: true }}>{children}</StageCtx.Provider>
    </div>
  );
}

export function Stage({ children, background }: { children: ReactNode; background?: string }) {
  const outer = useContext(StageCtx);
  const ref = useRef<HTMLDivElement>(null);
  const own = useMeasure(ref, !outer.host);
  const size = outer.host ? outer : own;
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden", background: background ?? "#000" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size.W,
          height: size.H,
          transform: `scale(${size.scale})`,
          transformOrigin: "0 0",
          overflow: "hidden",
        }}
      >
        <StageCtx.Provider value={size}>{children}</StageCtx.Provider>
      </div>
    </div>
  );
}

/** Wrap index into [0, n). */
export const wrap = (i: number, n: number) => (n ? ((i % n) + n) % n : 0);
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Spatial navigation over item centres: the nearest item in the pressed
 * direction (off-axis distance weighs double). Returns -1 when there is none.
 */
export function spatial(points: { x: number; y: number }[], cur: number, dir: "up" | "down" | "left" | "right"): number {
  const c = points[cur];
  if (!c) return -1;
  // 1) everything in the pressed direction, inside a cone (narrow sideways, wide up/down)
  const cand: { i: number; primary: number; off: number }[] = [];
  points.forEach((p, i) => {
    if (i === cur) return;
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const primary = dir === "left" ? -dx : dir === "right" ? dx : dir === "up" ? -dy : dy;
    const off = dir === "left" || dir === "right" ? Math.abs(dy) : Math.abs(dx);
    const cone = dir === "left" || dir === "right" ? 0.9 : 1.8; // stay in the row when moving sideways
    if (primary <= 8 || off > primary * cone) return;
    cand.push({ i, primary, off });
  });
  if (!cand.length) return -1;
  // 2) the nearest row/column wins, then the closest item within it
  const p0 = Math.min(...cand.map((k) => k.primary));
  const row = cand.filter((k) => k.primary <= p0 + 40);
  row.sort((a, b) => a.off - b.off || a.primary - b.primary);
  return row[0].i;
}

