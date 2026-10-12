// Stock Vita system bubbles as finished images, the way the console stores them:
// one picture per app (coloured glossy sphere + white glyph), drawn once to a
// canvas, cached, then shown flat — the same path a theme's own bubble takes.
import { useEffect, useRef, useState } from "react";
import { Icon, IconName } from "../common";

const S = 368; // 2× the on-screen diameter, so it stays crisp when focused/scaled
const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

function hex(c: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(c.trim());
  const n = m ? parseInt(m[1], 16) : 0x6d7a8c;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const mix = (c: [number, number, number], t: [number, number, number], k: number) =>
  `rgb(${c.map((v, i) => Math.round(v + (t[i] - v) * k)).join(",")})`;
const W: [number, number, number] = [255, 255, 255];
const K: [number, number, number] = [0, 8, 24];

function loadSvg(svg: string): Promise<HTMLImageElement> {
  return new Promise((ok, bad) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = bad;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

async function bake(glyphSvg: string, color: string): Promise<string> {
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const r = S / 2 - 3, cx = S / 2, cy = S / 2;
  const base = hex(color);
  g.save();
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2);
  g.clip();
  // body: lit from above, colour deepening towards the rim
  let gr = g.createRadialGradient(cx, cy - r * 0.45, r * 0.05, cx, cy, r);
  gr.addColorStop(0, mix(base, W, 0.42));
  gr.addColorStop(0.55, mix(base, W, 0.08));
  gr.addColorStop(0.9, mix(base, K, 0.28));
  gr.addColorStop(1, mix(base, K, 0.45));
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  // light pooling along the lower inner edge (refraction through the glass)
  gr = g.createRadialGradient(cx, cy + r * 0.95, 0, cx, cy + r * 0.95, r * 0.75);
  gr.addColorStop(0, "rgba(255,255,255,.38)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  // glyph: white, slightly shadowed, ~55% of the sphere
  const glyph = await loadSvg(glyphSvg);
  const gs = S * 0.55;
  g.shadowColor = "rgba(0,10,30,.35)";
  g.shadowBlur = S * 0.025;
  g.shadowOffsetY = S * 0.012;
  g.drawImage(glyph, cx - gs / 2, cy - gs / 2 + S * 0.01, gs, gs);
  g.shadowColor = "transparent";
  // top gloss cap
  g.save();
  g.beginPath();
  g.ellipse(cx, cy - r * 0.5, r * 0.78, r * 0.46, 0, 0, Math.PI * 2);
  g.clip();
  gr = g.createLinearGradient(0, cy - r * 0.96, 0, cy - r * 0.05);
  gr.addColorStop(0, "rgba(255,255,255,.62)");
  gr.addColorStop(0.55, "rgba(255,255,255,.14)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  g.restore();
  // rim: darker curvature edge, then a thin bright glass shell
  gr = g.createRadialGradient(cx, cy, r * 0.82, cx, cy, r);
  gr.addColorStop(0, "rgba(0,10,30,0)");
  gr.addColorStop(1, "rgba(0,10,30,.32)");
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  g.restore();
  g.beginPath();
  g.arc(cx, cy, r - 1.5, 0, Math.PI * 2);
  g.lineWidth = 3;
  g.strokeStyle = "rgba(225,248,255,.55)";
  g.stroke();
  g.beginPath();
  g.arc(cx, cy, r + 1, 0, Math.PI * 2);
  g.lineWidth = 2;
  g.strokeStyle = "rgba(0,25,60,.3)";
  g.stroke();
  return c.toDataURL("image/png");
}

/** Finished stock bubble image for `icon` in `color` (data URL), or null while it's baking. */
export function useStockBubble(icon: IconName, color: string) {
  const key = `${icon}|${color}`;
  const [url, setUrl] = useState<string | null>(() => cache.get(key) ?? null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hit = cache.get(key);
    if (hit) return setUrl(hit);
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    let alive = true;
    let p = pending.get(key);
    if (!p) {
      const markup = svg.outerHTML.includes("xmlns") ? svg.outerHTML : svg.outerHTML.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
      p = bake(markup, color).then((u) => (cache.set(key, u), u));
      pending.set(key, p);
    }
    p.then((u) => alive && setUrl(u)).catch(() => {});
    return () => { alive = false; };
  }, [key]);
  // hidden white glyph, rendered by React so the icon set stays in one place
  const probe = url ? null : (
    <div ref={ref} style={{ display: "none" }} aria-hidden>
      <Icon name={icon} size={256} color="#ffffff" />
    </div>
  );
  return { url, probe };
}
