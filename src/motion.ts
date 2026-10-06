// Drives the Vita bubbles' 3D sway: Deck gyro (gravity vector relative to a
// slowly-adapting rest pose) plus springy impulses from scrolling. Writes CSS
// variables (--dht-tilt-x / --dht-tilt-y, −1…1) straight onto an element, so
// nothing re-renders per frame.
import { useEffect, useRef } from "react";

declare const SteamClient: any;

export interface MotionHandle {
  kick: (dx: number, dy: number) => void;
}

export function useBubbleMotion(el: HTMLElement | null, opts: { enabled: boolean; gyro: boolean }): MotionHandle {
  const kickRef = useRef<(dx: number, dy: number) => void>(() => {});
  useEffect(() => {
    if (!el || !opts.enabled) {
      el?.style.removeProperty("--dht-tilt-x");
      el?.style.removeProperty("--dht-tilt-y");
      kickRef.current = () => {};
      return;
    }
    // spring for scroll impulses
    const sp = { x: 0, y: 0, vx: 0, vy: 0 };
    kickRef.current = (dx, dy) => {
      sp.vx += dx * 0.35;
      sp.vy += dy * 0.35;
    };
    // gyro
    let g: { x: number; y: number; z: number } | null = null;
    let base: { x: number; y: number; z: number } | null = null;
    let reg: any = null;
    if (opts.gyro) {
      try {
        reg = SteamClient?.Input?.RegisterForControllerStateChanges?.((changes: any[]) => {
          const c = changes?.[changes.length - 1];
          if (!c) return;
          const x = Number(c.flGravityVectorX) || 0;
          const y = Number(c.flGravityVectorY) || 0;
          const z = Number(c.flGravityVectorZ) || 0;
          const len = Math.hypot(x, y, z);
          if (len < 1e-3) return; // controller without motion sensors
          g = { x: x / len, y: y / len, z: z / len };
        });
      } catch {
        reg = null;
      }
    }
    let lx = 99;
    let ly = 99;
    const iv = setInterval(() => {
      // damped spring → a jelly-like settle after a page scroll
      sp.vx = sp.vx * 0.82 - sp.x * 0.14;
      sp.vy = sp.vy * 0.82 - sp.y * 0.14;
      sp.x += sp.vx;
      sp.y += sp.vy;
      let tx = sp.x;
      let ty = sp.y;
      if (g) {
        // rest pose follows slowly, so only movement makes the bubbles sway
        base = base ? { x: base.x + (g.x - base.x) * 0.012, y: base.y + (g.y - base.y) * 0.012, z: base.z + (g.z - base.z) * 0.012 } : { ...g };
        tx += (g.x - base.x) * 5;
        ty += ((g.z - base.z) + (g.y - base.y)) * 3.2;
      }
      tx = Math.max(-1, Math.min(1, tx));
      ty = Math.max(-1, Math.min(1, ty));
      if (Math.abs(tx - lx) > 0.004 || Math.abs(ty - ly) > 0.004) {
        lx = tx;
        ly = ty;
        el.style.setProperty("--dht-tilt-x", tx.toFixed(3));
        el.style.setProperty("--dht-tilt-y", ty.toFixed(3));
      }
    }, 33);
    return () => {
      clearInterval(iv);
      try {
        reg?.unregister?.();
      } catch {
        /* ignore */
      }
      el.style.removeProperty("--dht-tilt-x");
      el.style.removeProperty("--dht-tilt-y");
    };
  }, [el, opts.enabled, opts.gyro]);
  return { kick: (dx, dy) => kickRef.current(dx, dy) };
}
