// A canvas that redraws itself at a capped frame rate (background waves,
// particles, towers). When animations are off it draws one still frame.
import { CSSProperties, useEffect, useRef } from "react";
import { frameLoop, useThemeActive } from "./performance";
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
  const active = useThemeActive();
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
    const start = performance.now();
    const loop = frameLoop(cv, (now, moving) => {
      ctx.clearRect(0, 0, width, height);
      drawRef.current(ctx, moving ? (now - start) / 1000 : 12.3, width, height);
      if (tint) tintCanvas(ctx, cv.width, cv.height, tint);
    }, () => animate, () => active, fps);
    return () => loop.dispose();
  }, [width, height, fps, animate, active, k, tint, ...deps]);
  return <canvas ref={ref} className={className} width={Math.round(width * k)} height={Math.round(height * k)} data-dht-quality={k < 1 ? "half" : "full"} style={{ position: "absolute", left: 0, top: 0, width, height, pointerEvents: "none", ...style, ...(dim ? { filter: [style?.filter, dim].filter(Boolean).join(" ") } : {}) }} />;
}
