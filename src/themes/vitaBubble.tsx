// PS Vita bubble renderer with several selectable styles. The styles were
// tuned by rendering them onto a real Vita home capture and comparing:
//   lens    – glass sphere + slight lens bulge (closest overall)
//   glass   – same glass shading, no bulge
//   gloss   – brighter, earlier "glossy" look
//   classic – strong top dome highlight
//   flat    – plain circular icon (emulator-style)
import { CSSProperties, ReactNode, useMemo } from "react";

export type BubbleStyle = "lens" | "glass" | "gloss" | "classic" | "flat";
export const BUBBLE_STYLES: { id: BubbleStyle; name: string }[] = [
  { id: "lens", name: "Vita glass + lens (closest)" },
  { id: "glass", name: "Vita glass" },
  { id: "gloss", name: "Glossy" },
  { id: "classic", name: "Classic dome" },
  { id: "flat", name: "Flat" },
];

interface Spec {
  zoom: number;
  layers: string[];
  mask?: string;
  glow?: string;
  outline?: string;
  lens?: number;
  shadow: string;
  specular?: number[]; // layer indexes that are light reflections (move against the drift)
}

// Shading measured against the real home screen: the top of the sphere is lit,
// the lower part sits in its own shade, the rim darkens with curvature while the
// glass shell catches light, and light pools along the lower inner edge.
const VITA_LAYERS = [
  "background:linear-gradient(180deg,#f8f8f8 0%,#f4f4f4 30%,#e2e2e2 46%,#d8d8d8 100%);mix-blend-mode:multiply",
  "background:radial-gradient(circle at 50% 46%,#fff 0%,#fff 66%,#ececec 76%,#b4b4b4 91%,#6e6e6e 99%,#5a5a5a 100%);mix-blend-mode:multiply",
  "background:radial-gradient(circle at 50% 50%,rgb(4,5,6) 0%,rgb(4,5,6) 74%,rgb(30,42,50) 90%,rgb(90,120,135) 98%,rgb(110,140,155) 100%);mix-blend-mode:screen",
  "background:radial-gradient(circle at 50% 30%,rgba(0,0,0,0) 66%,rgba(150,215,240,.5) 71%,rgba(0,0,0,0) 74%),radial-gradient(ellipse 58% 20% at 50% 100%,rgba(140,205,230,.65),rgba(140,205,230,0) 100%);mix-blend-mode:screen",
  "box-shadow:inset 0 1px 2px rgba(255,255,255,.12),inset 0 -2px 2px rgba(205,244,255,.58)",
  "background:radial-gradient(ellipse 49% 48% at 50% 49%,transparent 86%,rgba(215,249,255,.18) 91%,rgba(235,253,255,.42) 96%,transparent 100%);mask-image:linear-gradient(transparent 68%,#000 90%);mix-blend-mode:screen",
];
// The outer few percent of the sphere is see-through glass: the wallpaper shows
// through it, which is the faint coloured halo around real bubbles.
const RIM_MASK = "radial-gradient(circle at 50% 50%,#000 0%,#000 88%,rgba(0,0,0,.7) 95%,rgba(0,0,0,.35) 100%)";
const RIM_GLOW = "0 0 5px 1px rgba(200,240,255,.35)";
const SHADOW = "drop-shadow(0 6px 7px rgba(0,20,50,.45))";

const SPECS: Record<BubbleStyle, Spec> = {
  lens: { zoom: 1.08, layers: VITA_LAYERS, specular: [5], mask: RIM_MASK, glow: RIM_GLOW, outline: "0 0 0 1px rgba(0,25,60,.35)", lens: 0.12, shadow: SHADOW },
  glass: { zoom: 1.12, layers: VITA_LAYERS, specular: [5], mask: RIM_MASK, glow: RIM_GLOW, outline: "0 0 0 1px rgba(0,25,60,.35)", shadow: SHADOW },
  gloss: {
    zoom: 1.12,
    specular: [1],
    outline: "0 0 0 1px rgba(0,25,60,.35)",
    shadow: SHADOW,
    layers: [
      "background:radial-gradient(circle at 50% 40%,rgba(0,15,35,0) 55%,rgba(0,15,35,.14) 74%,rgba(0,15,35,.38) 93%),linear-gradient(180deg,rgba(0,10,25,0) 40%,rgba(0,10,25,.08) 70%,rgba(0,10,25,.12) 100%);mix-blend-mode:multiply",
      "background:radial-gradient(ellipse 49% 48% at 50% 49%,transparent 84%,rgba(225,250,255,.25) 91%,rgba(245,255,255,.52) 96%,transparent 100%);mask-image:linear-gradient(transparent 66%,#000 88%);mix-blend-mode:screen",
      "background:radial-gradient(circle at 50% 50%,rgba(200,238,255,0) 80%,rgba(200,238,255,.16) 89%,rgba(225,247,255,.42) 97%,rgba(255,255,255,.55) 100%);mix-blend-mode:screen",
      "background:radial-gradient(circle at 50% 22%,rgba(255,255,255,0) 72%,rgba(235,250,255,.55) 76.5%,rgba(235,250,255,0) 79%),radial-gradient(ellipse 55% 16% at 50% 99%,rgba(190,240,255,.45),rgba(190,240,255,0) 100%);mix-blend-mode:screen",
      "box-shadow:inset 0 1px 2px rgba(255,255,255,.12),inset 0 -2px 3px rgba(220,250,255,.6)",
    ],
  },
  classic: {
    zoom: 1.08,
    specular: [5, 6],
    mask: RIM_MASK,
    glow: RIM_GLOW,
    shadow: SHADOW,
    layers: [
      ...VITA_LAYERS,
      "left:8%;right:8%;top:2%;bottom:auto;height:44%;border-radius:50%/50% 50% 46% 46%;background:linear-gradient(180deg,rgba(255,255,255,.42),rgba(255,255,255,.1) 70%,rgba(255,255,255,0));mix-blend-mode:screen",
    ],
  },
  flat: { zoom: 1.0, layers: [], shadow: "drop-shadow(0 3px 4px rgba(0,20,50,.35))" },
};

// ───── lens bulge: an SVG displacement map, generated once per size ─────
const lensCache = new Map<string, { url: string; scale: number }>();
function lensMap(size: number, k: number) {
  const key = `${size}:${k}`;
  const hit = lensCache.get(key);
  if (hit) return hit;
  let out = { url: "", scale: 0 };
  try {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(size, size);
    const s = size * 0.25;
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const nx = ((x + 0.5) / size) * 2 - 1;
        const ny = ((y + 0.5) / size) * 2 - 1;
        const r = Math.hypot(nx, ny);
        let dx = 0;
        let dy = 0;
        if (r < 1) {
          // centre magnified, edges compressed back to the rim
          const f = 1 - k + k * r * r;
          dx = ((nx * f - nx) * size) / 2;
          dy = ((ny * f - ny) * size) / 2;
        }
        const i = (y * size + x) * 4;
        img.data[i] = 255 * Math.max(0, Math.min(1, dx / s + 0.5));
        img.data[i + 1] = 255 * Math.max(0, Math.min(1, dy / s + 0.5));
        img.data[i + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
    out = { url: c.toDataURL(), scale: s };
  } catch {
    /* no canvas: no lens */
  }
  lensCache.set(key, out);
  return out;
}

/** Put once per screen: the shared lens filter for bubbles of size `d`. */
export function BubbleDefs({ d, style }: { d: number; style: BubbleStyle }) {
  const spec = SPECS[style];
  const m = useMemo(() => (spec.lens ? lensMap(d, spec.lens) : null), [d, spec.lens]);
  return (
    <>
      <style>{MOTION_CSS}</style>
      {m && m.url && (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <filter id={`dht-lens-${d}`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feImage href={m.url} result="map" width={d} height={d} preserveAspectRatio="none" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={m.scale} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
    </>
  );
}

// ───── 3D motion ─────
// Bubbles stay still until the Deck moves. Tilting it (gyro → --dht-tilt-x/y,
// −1…1, relative to how you hold it) turns each sphere: the icon wrapped on it
// rotates in perspective and slides under the glass, the highlight and a
// reflection band slide the other way, and the whole bubble sways a little on
// its own spring (--dht-sway-k varies per bubble). Held still, it settles back.
const MOTION_CSS = `
@keyframes dhtBubbleFloat { 0%,100% {transform:translateY(0) rotate(calc(var(--dht-float-angle) * -1))} 50% {transform:translateY(calc(var(--dht-float-distance) * -1)) rotate(var(--dht-float-angle))} }
@media(prefers-reduced-motion:reduce){.dht-bubble-float{animation:none!important}.dht-bubble-sway,.dht-bubble-tilt,.dht-bubble-spec,.dht-bubble-env{transform:none!important;transition:none!important}}
@keyframes dhtFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.dht-bubble-sway { transform: translate(calc(var(--dht-tilt-x, 0) * var(--dht-sway-k, 1) * 7px), calc(var(--dht-tilt-y, 0) * var(--dht-sway-k, 1) * 7px)); transition: transform 180ms ease-out; }
.dht-bubble-tilt { transform: perspective(var(--dht-bubble-persp, 300px)) rotateY(calc(var(--dht-tilt-x, 0) * 26deg)) rotateX(calc(var(--dht-tilt-y, 0) * -26deg)) translate(calc(var(--dht-tilt-x, 0) * -8%), calc(var(--dht-tilt-y, 0) * -8%)); transition: transform 140ms linear; }
.dht-bubble-spec { transform: translate(calc(var(--dht-tilt-x, 0) * 7%), calc(var(--dht-tilt-y, 0) * 7%)); transition: transform 140ms linear; }
.dht-bubble-env { opacity: calc(0.15 + (var(--dht-tilt-x, 0) * var(--dht-tilt-x, 0) + var(--dht-tilt-y, 0) * var(--dht-tilt-y, 0)) * 0.6); transform: translate(calc(var(--dht-tilt-x, 0) * 22%), calc(var(--dht-tilt-y, 0) * 22%)); transition: transform 140ms linear, opacity 140ms linear; }
`;

function parse(css: string): CSSProperties {
  const o: any = { position: "absolute", inset: 0, borderRadius: "50%", display: "block", pointerEvents: "none" };
  for (const decl of css.split(/;(?![^(]*\))/)) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const k = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    o[k] = decl.slice(i + 1).trim();
  }
  if (o.left || o.top || o.right || o.width) {
    if (o.bottom === "auto") o.bottom = "auto";
  }
  return o;
}
const parsedCache = new Map<string, CSSProperties>();
const layerStyle = (css: string) => {
  let v = parsedCache.get(css);
  if (!v) parsedCache.set(css, (v = parse(css)));
  return v;
};

/**
 * One bubble. `children` is the icon (square image); `zoomArt` = false for
 * built-in glyph bubbles and folders that must not be enlarged or bulged.
 */
export function VitaBubble({
  d,
  style,
  children,
  bg,
  zoomArt = true,
  motion = false,
  phase = 0,
  sway = "off",
}: {
  d: number;
  style: BubbleStyle;
  children: ReactNode;
  bg?: string;
  zoomArt?: boolean;
  motion?: boolean; // 3D drift + tilt response
  sway?: "off" | "gentle" | "lively";
  phase?: number; // per-bubble variation, so they don't all sway identically
}) {
  const spec = SPECS[style];
  const lens = zoomArt && spec.lens ? `url(#dht-lens-${d})` : undefined;
  // Extra zoom while 3D is on, so the turning icon never shows its edge.
  const zoom = (zoomArt ? spec.zoom : 1) * (motion ? 1.22 : 1);
  const swayK = 0.75 + ((phase * 7.3) % 1) * 0.5;
  const spec2 = spec.specular ?? [];
  return (
    <div className="dht-bubble-float" data-sway={sway} style={{width:d,height:d,animation:sway === "off" ? "none" : `dhtBubbleFloat ${sway === "gentle" ? 7.5 : 5.5}s ease-in-out ${-phase}s infinite`, ["--dht-float-distance" as any]: sway === "lively" ? "5px" : "2px", ["--dht-float-angle" as any]: sway === "lively" ? "1.3deg" : ".55deg"}}>
    <div className={`dht-bubble-sphere dht-bubble-style--${style}${motion ? " dht-bubble-sway" : ""}`} style={{ width: d, height: d, position: "relative", filter: `var(--dht-bubble-shadow, ${spec.shadow})`, ["--dht-sway-k" as any]: swayK, ["--dht-bubble-persp" as any]: `${Math.round(d * 1.6)}px` }}>
      {spec.glow && <div className="dht-bubble-glow" style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `var(--dht-bubble-glow, ${spec.glow})` }} />}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          isolation: "isolate",
          background: bg ?? "#0d2a4a",
          boxShadow: spec.outline,
          WebkitMaskImage: spec.mask,
          maskImage: spec.mask,
        }}
      >
        <div className="dht-bubble-art" style={{ position: "absolute", inset: 0, filter: lens, overflow: "hidden", borderRadius: "50%" }}>
          <div className={motion ? "dht-bubble-tilt" : undefined} style={{ position: "absolute", inset: 0 }}>
            <div className="dht-bubble-spin" style={{ position: "absolute", inset: 0 }}>
              <div style={{ position: "absolute", inset: 0, transform: zoom !== 1 ? `scale(${zoom})` : undefined }}>{children}</div>
            </div>
          </div>
        </div>
        {motion && (
          // a soft window reflection that slides across the glass as the sphere turns
          <div className="dht-bubble-env" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <i style={{ position: "absolute", left: "8%", top: "4%", width: "60%", height: "40%", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.16), rgba(255,255,255,0) 70%)", transform: "rotate(-24deg)", display: "block" }} />
          </div>
        )}
        {(style === "lens" || style === "glass" || style === "gloss") && <div className={`dht-bubble-clearcoat${motion ? " dht-bubble-spec" : ""}`} style={{position:"absolute",inset:0,borderRadius:"50%",pointerEvents:"none",mixBlendMode:"screen",background:"radial-gradient(ellipse 40% 7% at 48% 95%,rgba(240,253,255,.55),rgba(210,243,255,.12) 48%,transparent 100%),radial-gradient(ellipse 17% 4% at 33% 90%,rgba(255,255,255,.4),transparent 100%)",opacity:.65}}/>}
        {spec.layers.map((l, i) =>
          spec2.includes(i) && motion ? (
            <div key={i} className="dht-bubble-spec" style={{ position: "absolute", inset: 0 }}>
              <i className={`dht-bubble-shade dht-bubble-shade-${i + 1}`} style={layerStyle(l)} />
            </div>
          ) : (
            <i key={i} className={`dht-bubble-shade dht-bubble-shade-${i + 1}`} style={layerStyle(l)} />
          ),
        )}
      </div>
    </div>
    </div>
  );
}
