// A canvas that redraws itself at a capped frame rate (background waves,
// particles, towers). When animations are off it draws one still frame.
import { CSSProperties, useEffect, useRef } from "react";
import { getSettings } from "./settings";
import { tintOf } from "./color";
import { tintCanvas } from "./steam";

export type DrawFn = (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void;

export function AnimCanvas({
  draw,
  width,
  height,
  fps = 30,
  animate = true,
  style,
  deps = [],
  className,
}: {
  draw: DrawFn;
  width: number;
  height: number;
  fps?: number;
  animate?: boolean;
  style?: CSSProperties;
  deps?: any[];
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  // Standard options: half-resolution drawing saves battery; brightness dims the background
  const opt = getSettings();
  const k = opt.bgQuality === "half" ? 0.5 : 1;
  const tint = tintOf(opt);
  const dim = opt.bgBrightness < 100 ? `brightness(${opt.bgBrightness}%)` : "";
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    const view: any = cv.ownerDocument?.defaultView ?? window;
    const start = performance.now();
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      raf = view.requestAnimationFrame(frame);
      if (ref.current?.ownerDocument.hidden || now - last < 1000 / fps - 2) return;
      last = now;
      ctx.clearRect(0, 0, width, height);
      drawRef.current(ctx, (now - start) / 1000, width, height);
      if (tint) tintCanvas(ctx, cv.width, cv.height, tint);
    };
    if (animate && !view.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = view.requestAnimationFrame(frame);
    else {
      ctx.clearRect(0, 0, width, height);
      drawRef.current(ctx, 12.3, width, height);
      if (tint) tintCanvas(ctx, cv.width, cv.height, tint);
    }
    return () => view.cancelAnimationFrame(raf);
  }, [width, height, fps, animate, k, tint, ...deps]);
  return <canvas ref={ref} className={className} width={Math.round(width * k)} height={Math.round(height * k)} data-dht-quality={k < 1 ? "half" : "full"} style={{ position: "absolute", left: 0, top: 0, width, height, pointerEvents: "none", ...style, ...(dim ? { filter: [style?.filter, dim].filter(Boolean).join(" ") } : {}) }} />;
}
