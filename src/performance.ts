import { createContext, useContext, useEffect, useRef } from "react";

// Theme-only work may pause independently of music and visible destination panels.
export const ThemeActivity = createContext(true);
export const UiDocument = createContext<Document | null>(null);
export function useThemeActive() { return useContext(ThemeActivity); }

/** No timer while hidden/inactive; refresh immediately when the UI returns. */
export function useActiveInterval(read: () => void, every: number, enabled = true) {
  const active = useThemeActive(), owner = useContext(UiDocument);
  const callback = useRef(read); callback.current = read;
  useEffect(() => {
    const doc = owner ?? document;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer); timer = undefined;
      if (!active || !enabled || doc.hidden) return;
      callback.current();
      timer = setInterval(() => callback.current(), every);
    };
    sync(); doc.addEventListener("visibilitychange", sync);
    return () => { clearInterval(timer); doc.removeEventListener("visibilitychange", sync); };
  }, [active, enabled, owner, every]);
}

/** Render only invalidated static frames, or capped moving frames. */
export function frameLoop(
  canvas: HTMLCanvasElement,
  draw: (now: number, moving: boolean) => void,
  moving: () => boolean,
  active: () => boolean = () => true,
  fps = 30,
) {
  const doc = canvas.ownerDocument, view = doc.defaultView!;
  const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0, disposed = false, dirty = true, last = -Infinity;
  const request = () => {
    if (!disposed && !raf && !doc.hidden && active()) raf = view.requestAnimationFrame(frame);
  };
  const frame = (now: number) => {
    raf = 0;
    if (disposed || doc.hidden || !active()) return;
    const animate = moving() && !reduced.matches;
    if (dirty || now - last >= 1000 / Math.max(1, fps) - 1) {
      dirty = false; last = now; draw(now, animate);
    }
    if (animate || dirty) request();
  };
  const invalidate = () => {
    dirty = true;
    if (doc.hidden || !active()) { view.cancelAnimationFrame(raf); raf = 0; }
    else request();
  };
  doc.addEventListener("visibilitychange", invalidate);
  reduced.addEventListener("change", invalidate);
  request();
  return {
    invalidate,
    dispose() {
      disposed = true; view.cancelAnimationFrame(raf);
      doc.removeEventListener("visibilitychange", invalidate);
      reduced.removeEventListener("change", invalidate);
    },
  };
}
