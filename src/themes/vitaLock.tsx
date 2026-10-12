// PS Vita style lock screen: shown when the Deck wakes from sleep and/or the first time the
// home opens in a session. Purely visual: it never replaces Steam's own PIN screen
// (Settings → Security). When a Steam PIN is set, Steam asks for it first on wake, and
// this screen waits underneath; nothing here reads or stores a PIN.
//
// Unlocking peels the screen away like the Vita: the top-right corner curls toward the
// finger (a real fold: the page is clipped along the fold line and its back is drawn
// mirrored over it), and a button press plays the same curl automatically.
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as RPointerEvent } from "react";
import { fmtTime, useClock } from "../steam";
import { getSettings, Settings } from "../settings";
import type { VitaSkin } from "../skins";

declare const SteamClient: any;

let locked = false;
let openedThisSession = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const mode = (): Settings["vita"]["lock"] => getSettings().vita?.lock ?? "off";

/** Show the lock screen now (also used by the browser preview). */
export function lockVita() {
  if (mode() === "off") return;
  locked = true;
  emit();
}
function unlockVita() {
  locked = false;
  emit();
}

let resumeReg: { unregister?: () => void } | null = null;
let regCount = 0;
function registerWake() {
  if (regCount++ > 0) return;
  try {
    // Undocumented Steam client call (also used by other Decky plugins); missing → wake lock just doesn't fire.
    resumeReg = SteamClient?.System?.RegisterForOnResumeFromSuspend?.(() => {
      if (getSettings().theme === "vita") lockVita();
    }) ?? null;
  } catch {
    resumeReg = null;
  }
}
function unregisterWake() {
  if (--regCount > 0) return;
  try {
    resumeReg?.unregister?.();
  } catch {
    /* ignore */
  }
  resumeReg = null;
}

export function useVitaLock() {
  const [, setRev] = useState(0);
  useEffect(() => {
    const l = () => setRev((r) => r + 1);
    listeners.add(l);
    registerWake();
    if (!openedThisSession) {
      openedThisSession = true;
      if (mode() === "always") lockVita();
    }
    return () => {
      listeners.delete(l);
      unregisterWake();
    };
  }, []);
  return { locked: locked && mode() !== "off", unlock: unlockVita };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ───────────── page-curl geometry ─────────────
type Pt = { x: number; y: number };
/** Rectangle W×H folded so its top-right corner lands on `p`: the part still lying flat and the folded flap. */
function fold(W: number, H: number, p: Pt): { flat: Pt[]; flap: Pt[]; shade: string } {
  const c = { x: W, y: 0 };
  const dx = c.x - p.x, dy = c.y - p.y, len = Math.hypot(dx, dy);
  const rect = [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }];
  if (len < 0.5) return { flat: rect, flap: [], shade: "#fff" };
  const n = { x: dx / len, y: dy / len }, m = { x: (c.x + p.x) / 2, y: (c.y + p.y) / 2 };
  const side = (q: Pt) => (q.x - m.x) * n.x + (q.y - m.y) * n.y; // > 0: on the corner's side of the fold
  const clip = (keepCorner: boolean) => {
    const out: Pt[] = [];
    for (let i = 0; i < rect.length; i++) {
      const a = rect[i], b = rect[(i + 1) % rect.length];
      const sa = side(a) * (keepCorner ? 1 : -1), sb = side(b) * (keepCorner ? 1 : -1);
      if (sa >= 0) out.push(a);
      if ((sa >= 0) !== (sb >= 0)) {
        const t = sa / (sa - sb);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return out;
  };
  const reflect = (q: Pt) => { const d = side(q); return { x: q.x - 2 * d * n.x, y: q.y - 2 * d * n.y }; };
  // shading of the page's back: grey in the crease, white toward the tip (stops placed in px along the gradient line)
  const d = { x: -n.x, y: -n.y };
  const deg = (Math.atan2(d.x, -d.y) * 180) / Math.PI;
  const L = Math.abs(W * d.x) + Math.abs(H * d.y);
  const s0 = (m.x - W / 2) * d.x + (m.y - H / 2) * d.y + L / 2, half = len / 2;
  const shade = `linear-gradient(${deg.toFixed(1)}deg, #8e98a9 ${s0.toFixed(0)}px, #d6dce6 ${(s0 + half * 0.22).toFixed(0)}px, #f3f5f9 ${(s0 + half * 0.6).toFixed(0)}px, #ffffff ${(s0 + half).toFixed(0)}px)`;
  return { flat: clip(false), flap: clip(true).map(reflect), shade };
}
const poly = (pts: Pt[]) => `polygon(${pts.map((q) => `${q.x.toFixed(1)}px ${q.y.toFixed(1)}px`).join(",")})`;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let pressHandler: (() => void) | null = null;
/** Forward a controller press to the visible lock screen. */
export function pressLock() {
  if (pressHandler) pressHandler();
  else unlockVita();
}

/** The lock screen itself. */
export function VitaLockScreen({ skin, h24, W, H, onUnlock, animate }: { skin: VitaSkin | null; h24: boolean; W: number; H: number; onUnlock: () => void; animate: boolean }) {
  const now = useClock(5000);
  const IDLE = 56;
  const [p, setP] = useState<Pt>({ x: W - IDLE, y: IDLE });
  const pRef = useRef(p);
  pRef.current = p;
  const root = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ fromCorner: boolean; sx: number; sy: number; base: Pt } | null>(null);
  const anim = useRef<number | null>(null);
  const leaving = useRef(false);

  const tween = (to: Pt, ms: number, done?: () => void) => {
    if (anim.current) cancelAnimationFrame(anim.current);
    const from = pRef.current, t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms), e = ease(k);
      setP({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
      if (k < 1) anim.current = requestAnimationFrame(step);
      else { anim.current = null; done?.(); }
    };
    anim.current = requestAnimationFrame(step);
  };
  const finish = () => {
    if (leaving.current) return;
    leaving.current = true;
    if (!animate) return onUnlock();
    // carry the corner past the bottom-left so the whole page lifts away
    tween({ x: -W * 0.95, y: H * 2.1 }, 720, onUnlock);
  };
  useEffect(() => {
    pressHandler = finish;
    return () => { if (pressHandler === finish) pressHandler = null; };
  });
  // stop a running curl only when the screen goes away (not on every frame's re-render)
  useEffect(() => () => { if (anim.current) cancelAnimationFrame(anim.current); }, []);
  // the resting curl breathes a little, inviting a swipe
  useEffect(() => {
    if (!animate) return;
    let id = 0;
    const loop = (t: number) => {
      if (!drag.current && !anim.current && !leaving.current) {
        const d = IDLE + Math.sin(t / 650) * 7;
        setP({ x: W - d, y: d });
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [animate, W]);

  const local = (e: { clientX: number; clientY: number }): Pt => {
    const r = root.current?.getBoundingClientRect();
    if (!r || !r.width) return { x: 0, y: 0 };
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
  };
  const onDown = (e: RPointerEvent) => {
    if (leaving.current) return;
    if (anim.current) { cancelAnimationFrame(anim.current); anim.current = null; }
    const q = local(e);
    drag.current = { fromCorner: Math.hypot(W - q.x, q.y) < 220, sx: q.x, sy: q.y, base: pRef.current };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d || leaving.current) return;
    const q = local(e);
    if (!animate) return;
    // from the corner the fold follows the finger; elsewhere a swipe pulls the corner along
    setP(d.fromCorner ? { x: Math.min(W, q.x), y: Math.max(0, q.y) } : { x: Math.min(W, d.base.x + (q.x - d.sx) * 1.1 - Math.max(0, q.y - d.sy) * 0.5), y: Math.max(0, d.base.y + Math.abs(q.y - d.sy) * 0.9 + Math.max(0, d.sx - q.x) * 0.4) });
  };
  const onUp = (e: RPointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || leaving.current) return;
    const q = local(e);
    const pulled = animate ? Math.hypot(W - pRef.current.x, pRef.current.y) : Math.hypot(q.x - d.sx, q.y - d.sy);
    if (pulled > Math.min(W, H) * 0.42) finish();
    else if (animate) tween({ x: W - IDLE, y: IDLE }, 320);
  };

  const { flat, flap, shade } = fold(W, H, p);
  const color = skin?.lockDateColor || "#fff";
  const bg = skin?.lock || skin?.pages?.[0] || null;
  const layout = skin?.lockDateLayout ?? 0;
  const clockPos = layout === 1 ? { right: 60, top: 70, textAlign: "right" as const } : layout === 2 ? { left: 0, right: 0, top: H * 0.3, textAlign: "center" as const } : { left: 60, top: 70 };
  const pulled = Math.hypot(W - p.x, p.y);
  return (
    <div
      ref={root}
      className="dht-vita-lock"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ position: "absolute", inset: 0, zIndex: 60, overflow: "hidden", touchAction: "none", cursor: "grab" }}
    >
      <style>{"@keyframes dhtLockIn { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } } @keyframes dhtLockHint { 0%,100% { opacity: .55 } 50% { opacity: .95 } }"}</style>
      {/* the page itself, cut along the fold */}
      <div
        className="dht-vita-lock-page"
        style={{
          position: "absolute", inset: 0, clipPath: poly(flat), WebkitClipPath: poly(flat),
          background: bg ? `#000 url("${bg}") center / cover no-repeat` : "linear-gradient(176deg, #031d42 0%, #08427e 30%, #1477bd 60%, #33b2e6 100%)",
        }}
      >
        <div style={{ position: "absolute", ...clockPos, color, textShadow: "0 2px 8px rgba(0,0,0,0.55)", pointerEvents: "none", animation: animate ? "dhtLockIn 700ms cubic-bezier(.2,.8,.2,1) both" : undefined }}>
          <div className="dht-vita-lock-time" style={{ fontSize: 96, fontWeight: 300, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fmtTime(now, h24)}</div>
          <div className="dht-vita-lock-date" style={{ fontSize: 30, marginTop: 10 }}>{DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", color: "#fff", fontSize: 18, textShadow: "0 1px 3px #000", pointerEvents: "none", opacity: Math.max(0, 1 - pulled / 260), animation: animate ? "dhtLockHint 2.6s ease-in-out infinite" : undefined }}>
          Swipe or press Ⓐ to unlock
        </div>
      </div>
      {/* the folded-over back of the page */}
      {flap.length > 2 && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", filter: "drop-shadow(-6px 8px 10px rgba(0,0,0,0.38))" }}>
          <div className="dht-vita-lock-flap" style={{ position: "absolute", inset: 0, clipPath: poly(flap), WebkitClipPath: poly(flap),
            background: shade }} />
        </div>
      )}
    </div>
  );
}
