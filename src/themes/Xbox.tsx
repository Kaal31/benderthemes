import { openDestination } from "../destinations";
// Original Xbox dashboard: the glowing green orb with its jelly shells and
// orbit rings, round pods beside chamfered menu bars, the wireframe sphere
// around it all, and "A SELECT" on a wire. Settings and Games use the
// dashboard's big chamfered plate with a glass sphere on the left.
// Everything is drawn here; sounds come from the theme's sound pack.
import { CSSProperties, ReactNode, useMemo, useState } from "react";
import { GameArt, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openAchievements, openSteam } from "../library";
import { showTitle, THEMES, updateSettings } from "../settings";
import { Badges } from "../badges";
import { fmtTime, playSound, useClock, useWallpaper } from "../steam";
import { XBOX_ORIGINAL_FONT_CSS } from "./xboxOriginalFont";
import { useAssets } from "../assets";
import { TheseusSurface } from "./TheseusSurface";

const FONT = '"DHT Xbox Original", sans-serif';
const TEXT = "#a8d86b";
const CSS = `${XBOX_ORIGINAL_FONT_CSS}
@keyframes dhtXbSpin { to { transform: rotate(360deg) } }
@keyframes dhtXbBreath { 0%,100% { transform: scale(1) } 50% { transform: scale(1.025) } }
@keyframes dhtXbIn { from { opacity: 0; transform: scale(1.05) } to { opacity: 1; transform: none } }
@keyframes dhtXbFlash { from { opacity: 1 } to { opacity: 0 } }
`;

type Screen = "main" | "games" | "settings";

// ───────────── wireframe sphere background ─────────────
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
/** Irregular web of cells (dual of a jittered triangulation), warped as if seen from inside a sphere. */
function meshPath(W: number, H: number, cx: number, cy: number): string {
  const r = rng(11);
  const C = 48;
  const R = 36;
  const pts: [number, number][] = [];
  for (let j = 0; j <= R; j++)
    for (let i = 0; i <= C; i++) {
      const edge = i === 0 || j === 0 || i === C || j === R;
      pts.push([(i / C) * 2 - 1 + (edge ? 0 : (r() - 0.5) * 0.09), (j / R) * 2 - 1 + (edge ? 0 : (r() - 0.5) * 0.12)]);
    }
  const id = (i: number, j: number) => j * (C + 1) + i;
  const tris: number[][] = [];
  for (let j = 0; j < R; j++)
    for (let i = 0; i < C; i++) {
      const a = id(i, j);
      const b = id(i + 1, j);
      const c = id(i, j + 1);
      const d = id(i + 1, j + 1);
      if (r() < 0.5) tris.push([a, b, d], [a, d, c]);
      else tris.push([a, b, c], [b, d, c]);
    }
  const cen = tris.map((t) => [(pts[t[0]][0] + pts[t[1]][0] + pts[t[2]][0]) / 3, (pts[t[0]][1] + pts[t[1]][1] + pts[t[2]][1]) / 3]);
  const edges = new Map<string, number[]>();
  tris.forEach((t, k) => {
    for (const [u, v] of [
      [t[0], t[1]],
      [t[1], t[2]],
      [t[2], t[0]],
    ]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      edges.set(key, [...(edges.get(key) ?? []), k]);
    }
  });
  // seen from inside a sphere: cells grow toward the edges of the view
  const warp = ([x, y]: number[]) => {
    const d = Math.hypot(x, y);
    const k = 1 + 0.55 * d * d;
    return [cx + x * k * W * 0.62, cy + y * k * H * 0.62];
  };
  let out = "";
  for (const ts of edges.values()) {
    if (ts.length !== 2) continue;
    const a = warp(cen[ts[0]]);
    const b = warp(cen[ts[1]]);
    out += `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  return out;
}

function Backdrop({ W, H, cx, cy, animate }: { W: number; H: number; cx: number; cy: number; animate: boolean }) {
  const d = useMemo(() => meshPath(W, H, cx, cy), [W, H, cx, cy]);
  const assets = useAssets("xbox-original");
  return (
    <div className="dht-xbox-bg" style={{ position: "absolute", inset: 0, overflow: "hidden", background: `var(--dht-xbox-bg, radial-gradient(ellipse at ${(cx / W) * 100}% ${(cy / H) * 100}%, #000d00 0%, #001300 30%, #032603 62%, #073005 100%))` }}>
      {assets.cellwall && <TheseusSurface src={assets.cellwall} W={W} H={H} animate={animate}/>}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}> 
        <defs>
          <radialGradient id="dhtXbMeshFade" cx={cx / W} cy={cy / H} r="0.8">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.4" stopColor="#050505" />
            <stop offset=".9" stopColor="#fff" />
          </radialGradient>
          <mask id="dhtXbMeshMask">
            <rect width={W} height={H} fill="url(#dhtXbMeshFade)" />
          </mask>
        </defs>
        <g mask="url(#dhtXbMeshMask)">
          <path d={assets.cellwall?"":d} stroke="#21821a" strokeOpacity="0.38" strokeWidth="1.2" fill="none" />
          {/* a few long great-circle lines across the web */}
          <path d={`M ${-W * 0.1} ${H * 0.95} Q ${W * 0.35} ${H * 0.62} ${W * 1.1} ${H * 0.98}`} stroke="#5cc22a" strokeOpacity="0.5" strokeWidth="2" fill="none" />
          <path d={`M ${W * 0.62} ${-H * 0.1} Q ${W * 0.82} ${H * 0.45} ${W * 0.7} ${H * 1.1}`} stroke="#5cc22a" strokeOpacity="0.4" strokeWidth="2" fill="none" />
          <path d={`M ${-W * 0.05} ${H * 0.18} Q ${W * 0.2} ${H * 0.4} ${W * 0.08} ${H * 1.05}`} stroke="#5cc22a" strokeOpacity="0.35" strokeWidth="2" fill="none" />
        </g>
      </svg>
    </div>
  );
}

// ───────────── the orb ─────────────
function Orb({ x, y, r, animate, burst }: { x: number; y: number; r: number; animate: boolean; burst: number }) {
  const S = r * 3.4;
  const assets = useAssets("xbox-original");


  return (
    <div className="dht-xbox-orb" style={{ position: "absolute", left: x - S / 2, top: y - S / 2, width: S, height: S, pointerEvents: "none", animation: undefined }}>
      <svg width={S} height={S} viewBox={`${-S / 2} ${-S / 2} ${S} ${S}`} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="dhtXbCore" cx="0.6" cy="0.72" r="0.75">
            <stop offset="0" stopColor="#e8f529" />
            <stop offset="0.28" stopColor="#c4d900" />
            <stop offset="0.58" stopColor="#58b200" />
            <stop offset="0.86" stopColor="#147c0a" />
            <stop offset="1" stopColor="#013a03" />
          </radialGradient>
          <radialGradient id="dhtXbLobe" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.55" stopColor="rgba(120,230,50,0.05)" />
            <stop offset="0.9" stopColor="rgba(160,255,80,0.38)" />
            <stop offset="1" stopColor="rgba(200,255,120,0.55)" />
          </radialGradient>
          <linearGradient id="dhtXbBlade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(255,255,220,0.25)" />
            <stop offset="1" stopColor="rgba(245,255,190,0.85)" />
          </linearGradient>
          <radialGradient id="dhtXbGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.3" stopColor="rgba(190,255,60,0.45)" />
            <stop offset="1" stopColor="rgba(120,230,30,0)" />
          </radialGradient>
        </defs>
        <circle r={r * 1.55} fill="url(#dhtXbGlow)" opacity={burst ? 1 : 0.65} />
        {/* orbit rings and the translucent band */}
        <g style={{ transformOrigin: "0 0", animation: animate ? "dhtXbSpin 60s linear infinite" : undefined }}>
          <ellipse rx={r * 1.42} ry={r * 0.44} transform="rotate(-64)" fill="none" stroke="rgba(150,235,70,0.18)" strokeWidth={r * 0.2} />
          <ellipse rx={r * 1.42} ry={r * 0.44} transform="rotate(-64)" fill="none" stroke="rgba(190,255,110,0.4)" strokeWidth={1.5} />
        </g>
        <ellipse rx={r * 1.3} ry={r * 1.3} fill="none" stroke="rgba(150,235,70,0.22)" strokeWidth={2} />
        <ellipse cx={-r * 1.18} cy={r * 0.08} rx={r * 0.55} ry={r * 0.045} fill="rgba(170,250,90,0.4)" />
        {/* Native rotating shell geometry is rendered above the textured core. */}


        {assets.orb && <image href={assets.orb} x={-r*1.5} y={-r*1.5} width={r*3} height={r*3} style={{filter:"brightness(1.3) saturate(1.5)"}}/>}
        {/* jelly shells in front */}


        {burst > 0 && <circle key={burst} r={r * 1.1} fill="rgba(250,255,190,0.9)" style={{ animation: "dhtXbFlash 700ms ease-out forwards" }} />}
      </svg>
      <TheseusSurface orb W={S} H={S} animate={animate}/>
    </div>
  );
}

// ───────────── shapes ─────────────
/** Menu bar with the dashboard's chamfered ends. */
function Bar({ x, y, w, h, on, children, onClick, className, name }: { x: number; y: number; w: number; h: number; on: boolean; children: ReactNode; onClick?: () => void; className?: string; name?: string }) {
  const assets=useAssets("xbox-original");
  const c = h * 0.32;
  const pts = `0,${c * 0.6} ${c * 0.6},0 ${w - c},0 ${w},${c} ${w},${h - c * 0.4} ${w - c * 0.4},${h} ${c},${h} 0,${h - c}`;
  return (
    <div className={className} data-selected={on} data-name={name} onClick={onClick} style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible", filter: on ? "drop-shadow(0 0 10px rgba(220,255,40,0.55))" : "none" }}>
        <defs>
          <linearGradient id={`dhtXbBar${on ? 1 : 0}`} x1="0" y1="0" x2="0" y2="1">
            {on ? (
              <>
                <stop offset="0" stopColor="#ecf84a" />
                <stop offset="0.5" stopColor="#cbe200" />
                <stop offset="1" stopColor="#9fbd00" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#1f5009" />
                <stop offset="1" stopColor="#0c2a04" />
              </>
            )}
          </linearGradient>
        </defs>
        <polygon points={pts} fill={`url(#dhtXbBar${on ? 1 : 0})`} stroke={on ? "#bbdc38" : "#568b28"} strokeWidth={1.6} />
        {on && assets["menu-highlight"] && <image href={assets["menu-highlight"]} width={w} height={h} preserveAspectRatio="none" style={{clipPath:"polygon(0 18%,6% 0,94% 0,100% 30%,100% 92%,96% 100%,6% 100%,0 70%)"}}/>}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: `0 ${h * 0.5}px`, color: on ? "#1f2a00" : TEXT, fontFamily: FONT, fontWeight: 400, letterSpacing: .4, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textShadow: on ? "none" : "0 0 6px rgba(160,255,60,0.45)" }}>{children}</div>
    </div>
  );
}

/** Round glowing pod beside each main-menu bar. */
function Pod({ x, y, r, on }: { x: number; y: number; r: number; on: boolean }) {
  return (
    <div style={{ position: "absolute", left: x - r * 1.35, top: y - r * 1.35, width: r * 2.7, height: r * 2.7, pointerEvents: "none" }}>
      <svg width={r * 2.7} height={r * 2.7} viewBox={`${-r * 1.35} ${-r * 1.35} ${r * 2.7} ${r * 2.7}`}>
        <defs>
          <radialGradient id={`dhtXbPod${on ? 1 : 0}`} cx="0.42" cy="0.38" r="0.62">
            {on ? (
              <>
                <stop offset="0" stopColor="#fbffc0" />
                <stop offset="0.45" stopColor="#d5f040" />
                <stop offset="1" stopColor="#4c9a12" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#0e2c05" />
                <stop offset="0.6" stopColor="#1a4a08" />
                <stop offset="1" stopColor="#5fb52a" />
              </>
            )}
          </radialGradient>
        </defs>
        <circle r={r * 1.3} fill="rgba(120,220,50,0.12)" stroke="rgba(150,240,70,0.45)" strokeWidth={1.5} />
        <circle r={r} fill={`url(#dhtXbPod${on ? 1 : 0})`} stroke={on ? "#eaff8a" : "#7fd23a"} strokeWidth={2} />
        {!on && <circle r={r * 0.38} fill="none" stroke="#9be04a" strokeWidth={1.6} />}
        <path d={`M ${-r * 1.25} ${-r * 0.55} q ${-r * 0.3} ${-r * 0.2} ${-r * 0.2} ${-r * 0.6}`} stroke="rgba(150,240,70,0.6)" strokeWidth={1.4} fill="none" />
      </svg>
    </div>
  );
}

/** A / B buttons on their curved wires. */
function Hint({ x, y, k, label, side, H, W }: { x: number; y: number; k: string; label: string; side: "left" | "right"; H: number; W: number }) {
  const r = H * 0.036;
  const wire =
    side === "right"
      ? `M ${x - r * 9} ${y + r * 4} Q ${x - r * 3} ${y - r * 2.4} ${x + r * 3} ${y - r * 1.2} T ${x + r * 13} ${y + r * 6}`
      : `M ${x + r * 9} ${y + r * 4} Q ${x + r * 3} ${y - r * 2.4} ${x - r * 3} ${y - r * 1.2} T ${x - r * 13} ${y + r * 6}`;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <path d={wire} stroke="rgba(110,210,50,0.65)" strokeWidth={2} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #c6f56a, #5fb52a 55%, #1f5a08)", boxShadow: "0 0 12px rgba(150,255,60,0.55), inset 0 0 0 2px rgba(220,255,140,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: r * 1.05, color: "#103005" }}>{k}</div>
      <div style={{ position: "absolute", top: y - H * 0.016, ...(side === "right" ? { left: x + r * 1.5 } : { right: W - (x - r * 1.5) }), fontFamily: FONT, fontWeight: 700, fontSize: H * 0.03, letterSpacing: 1.5, color: "#a6e05a", textShadow: "0 0 6px rgba(150,255,60,0.4)" }}>{label}</div>
    </>
  );
}

/** The big chamfered plate of the Settings / Games screens. */
function Plate({ W, H, title, sub, children }: { W: number; H: number; title: string; sub?: string; children: ReactNode }) {
  const x0 = W * 0.37;
  const x1 = W * 0.83;
  const y0 = H * 0.17;
  const y1 = H * 0.735;
  const tx0 = W * 0.4;
  const tx1 = W * 0.76;
  const ty0 = H * 0.04;
  return (
    <div style={{position:"absolute",inset:0,transform:"perspective(1400px) rotateY(-7deg) rotateZ(-2deg)",transformOrigin:"60% 45%"}}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <linearGradient id="dhtXbPlate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d4c0a" />
            <stop offset="1" stopColor="#0b2603" />
          </linearGradient>
          <linearGradient id="dhtXbRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8ad83a" />
            <stop offset="1" stopColor="#2f7a0c" />
          </linearGradient>
        </defs>
        {/* title tab */}
        <polygon points={`${tx0},${y0 + 4} ${tx0 + H * 0.06},${ty0} ${tx1 - H * 0.02},${ty0} ${tx1 + H * 0.05},${y0 - H * 0.03} ${x1 - H * 0.02},${y0 + H * 0.02} ${x1},${y0 + H * 0.06}`} fill="url(#dhtXbPlate)" stroke="url(#dhtXbRim)" strokeWidth={3} />
        {/* plate */}
        <polygon points={`${x0 + H * 0.05},${y0} ${x1 - H * 0.05},${y0} ${x1},${y0 + H * 0.06} ${x1},${y1} ${x0 + H * 0.03},${y1} ${x0},${y1 - H * 0.04} ${x0},${y0 + H * 0.05}`} fill="rgba(4,18,1,0.88)" stroke="url(#dhtXbRim)" strokeWidth={5} />
        {/* side plate with knobs */}
        <polygon points={`${x1 + 8},${y0 + H * 0.1} ${x1 + W * 0.04},${y0 + H * 0.04} ${x1 + W * 0.04},${y1 - H * 0.08} ${x1 + 8},${y1 - H * 0.02}`} fill="url(#dhtXbPlate)" stroke="url(#dhtXbRim)" strokeWidth={2} />
        {[0, 1].map((i) => (
          <ellipse key={i} cx={x1 + W * 0.055} cy={y0 + H * 0.16 + i * H * 0.05} rx={W * 0.012} ry={H * 0.018} fill="#4fa318" stroke="#9be04a" strokeWidth={1.5} />
        ))}
      </svg>
      <div className="dht-xbox-header" style={{ position: "absolute", left: tx0 + H * 0.06, top: ty0 + H * 0.015, fontFamily: FONT, fontWeight: 900, fontSize: H * 0.075, letterSpacing: 4, color: "#a9e626", textShadow: "0 3px 0 #2c6a08, 0 0 18px rgba(170,255,40,0.35)" }}>{title}</div>
      {sub && <div style={{ position: "absolute", right: W - x1 + H * 0.02, top: y0 + H * 0.012, fontFamily: FONT, fontSize: H * 0.022, letterSpacing: 1.5, color: "#8fd34a" }}>{sub}</div>}
      {children}
    </div>
  );
}

/** Rows inside the plate (slanted right end, bright yellow-green when selected). */
function Rows({ W, H, items, sel, onPick }: { W: number; H: number; items: { key: string; label: string; value?: string }[]; sel: number; onPick: (i: number) => void }) {
  const assets=useAssets("xbox-original");
  const x = W * 0.39;
  const w = W * 0.415;
  const y0 = H * 0.215;
  const rh = H * 0.088;
  const gap = H * 0.011;
  const vis = 5;
  const top = clamp(sel - (vis - 2), 0, Math.max(0, items.length - vis));
  return (
    <>
      {items.slice(top, top + vis).map((it, k) => {
        const i = top + k;
        const on = i === sel;
        const y = y0 + k * (rh + gap);
        const c = rh * 0.32;
        return (
          <div key={it.key} className="dht-xbox-row" data-selected={on} data-name={it.label} onClick={() => onPick(i)} style={{ position: "absolute", left: x, top: y, width: w, height: rh }}>
            <svg width={w} height={rh} style={{ position: "absolute", inset: 0, overflow: "visible", filter: on ? "drop-shadow(0 0 10px rgba(220,255,40,0.5))" : "none" }}>
              <polygon points={`0,${c * 0.5} ${c * 0.5},0 ${w - c},0 ${w},${c} ${w},${rh} ${c * 0.4},${rh} 0,${rh - c * 0.4}`} fill={on ? "#c9e000" : "rgba(10,34,4,0.9)"} stroke={on ? "#f0ff8a" : "#4f9a1c"} strokeWidth={on ? 2 : 1.5} />
              {on && assets["menu-highlight"] && <image href={assets["menu-highlight"]} width={w} height={rh} preserveAspectRatio="none" style={{clipPath:"polygon(0 16%,3% 0,94% 0,100% 30%,100% 100%,3% 100%,0 86%)"}}/>}
            </svg>
            <div style={{ position: "absolute", left: rh * 0.45, right: rh * 0.6, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "space-between", color: on ? "#1d2a00" : TEXT, fontFamily:'"DHT Xbox Book", sans-serif', fontSize: rh * 0.6, fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden" }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</span>
              {it.value && <span style={{ fontSize: rh * 0.32, fontFamily: FONT, letterSpacing: 1, opacity: 0.85, paddingLeft: 12 }}>{it.value}</span>}
            </div>
            {k === vis - 1 && top + vis < items.length && <div style={{ position: "absolute", right: rh * 0.5, top: rh * 0.12, color: on ? "#1d2a00" : "#c9e000", fontSize: rh * 0.55, fontWeight: 900 }}>▼</div>}
          </div>
        );
      })}
    </>
  );
}

/** Glass sphere on the left of the plate (clock for Settings, the cover for Games). */
function GlassSphere({ W, H, children }: { W: number; H: number; children: ReactNode }) {
  const r = H * 0.2;
  const cx = W * 0.255;
  const cy = H * 0.45;
  return (
    <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2 }}>
      <div style={{ position: "absolute", inset: -r * 0.12, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, rgba(120,220,50,0.08) 55%, rgba(150,240,70,0.32) 80%, rgba(200,255,120,0.45) 100%)", boxShadow: "0 0 40px rgba(120,230,40,0.3)" }} />
      <div style={{ position: "absolute", inset: r * 0.16, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 6px rgba(200,230,190,0.6), 0 0 0 10px rgba(140,230,60,0.5)" }}>{children}</div>
      <div style={{ position: "absolute", left: r * 0.4, top: r * 0.22, width: r * 0.8, height: r * 0.4, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.35), transparent 70%)", pointerEvents: "none" }} />
    </div>
  );
}


function InfoBox({ W, H, children }: { W: number; H: number; children: ReactNode }) {
  const x = W * 0.09;
  const y = H * 0.765;
  const w = W * 0.34;
  const h = H * 0.085;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <polygon points={`${h * 0.35},0 ${w - h * 0.3},0 ${w},${h * 0.35} ${w},${h} ${h * 0.35},${h} 0,${h * 0.6} 0,${h * 0.35}`} fill="rgba(20,58,8,0.92)" stroke="#6ab82e" strokeWidth={2} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, fontWeight: 500, fontSize: h * 0.32, color: "#c6ef8a", letterSpacing: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{children}</div>
    </div>
  );
}

// ───────────── the dashboard ─────────────
export function XboxHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const now = useClock(15000);
  const wall = useWallpaper("xbox");
  const menu = useMenu();
  const [screen, setScreen] = useRemembered<Screen>("xb-screen", "main");
  const [msel, setMsel] = useRemembered("xb-main", 1);
  const burst = 0;

  const lists = [{ id: "all", name: "All Games", games: api.lib.games }, ...api.lib.collections.map((c) => ({ id: c.id, name: c.name, games: c.games }))];
  const [lsel, setLsel] = useRemembered("xb-list", 0);
  const [gsel, setGsel] = useRemembered("xb-game", 0);
  const list = lists[clamp(lsel, 0, lists.length - 1)];
  const games = list?.games ?? [];
  const cur: Game | undefined = games[clamp(gsel, 0, games.length - 1)];
  const recent = api.lib.games[0];
  const [ssel, setSsel] = useState(0);

  const SETTINGS: { key: string; label: string; value?: string; run: () => void }[] = [
    {key:"clock",label:"Clock",run:()=>menu.open([{label:"12-hour clock",checked:!s.clock24,action:()=>updateSettings({clock24:false})},{label:"24-hour clock",checked:s.clock24,action:()=>updateSettings({clock24:true})}],"Clock")},
    {key:"language",label:"Language",run:()=>menu.open([{label:"Steam system language",action:()=>openSteam("settings")}],"Language")},
    {key:"audio",label:"Audio",run:()=>menu.open([{label:"Sound effects",checked:s.sounds,action:()=>updateSettings({sounds:!s.sounds})},{label:"Background music",checked:s.music.xbox!==false,action:()=>updateSettings(p=>({music:{...p.music,xbox:p.music.xbox===false}}))},{label:"Volume",sub:()=>[0,20,40,60,80,100].map(n=>({label:`${n}%`,checked:s.sfxVolume===n,action:()=>updateSettings({sfxVolume:n})}))}],"Audio")},
    {key:"video",label:"Video",run:()=>menu.open([{label:"TV mode",checked:s.tvMode,action:()=>updateSettings({tvMode:!s.tvMode})},{label:"Animations",checked:s.animations,action:()=>updateSettings({animations:!s.animations})}],"Video")},
    {key:"network",label:"Network Settings",run:()=>openSteam("settings")},
    {key:"parental",label:"Parental Control",run:()=>openSteam("settings")},
    {key:"autooff",label:"Auto Off",run:()=>openSteam("power")},
    {key:"skins",label:"Skins",run:()=>menu.open(themeMenu(s.theme,api.switchTheme,THEMES),"Skins")},
    {key:"system",label:"System Info",run:()=>api.openSettings()},
    {key:"power",label:"Shutdown",run:()=>openSteam("power")},
  ];
  const categoryModels = {clock:"ClockIcon",language:"GlobeIcon",audio:"StereoIcon",video:"FullscreenIcon",network:"network_icon",parental:"LockIcon",autooff:"AutoOffIcon",skins:"ConsoleIcon",system:"ConsoleIcon",power:"AutoOffIcon"} as const;
  const selectedCategory=SETTINGS[clamp(ssel,0,SETTINGS.length-1)].key as keyof typeof categoryModels;

  type MainItem = { id: string; label: string; small?: string; run: () => void };
  const MAIN: MainItem[] = [
    { id: "games", label: "MEMORY", run: () => go("games") },
    { id: "media", label: "MUSIC", run: () => openDestination({place:"music"}) },
    { id: "settings", label: "SETTINGS", run: () => go("settings") },
  ];
  const mcur = clamp(msel, 0, MAIN.length - 1);

  function go(sc: Screen) {
    setScreen(sc);
    playSound(sc === "main" ? "back" : "open");
  }
  const gameMenu = (g: Game) =>
    menu.open(
      [
        { label: "Launch", action: () => api.launch(g) },
        { label: "Game Details", action: () => api.details(g) },
        { label: "Watch Trailer", action: () => api.playTrailer(g) },
        { label: "Achievements", action: () => openAchievements(g) },
        { label: "Game Options", action: () => api.nativeMenu(g) },
      ],
      g.name,
    );
  const options = () => {
    const extra: MenuItem[] = [
      { label:"Xbox Live", action:()=>openSteam("friends") },
      { label:"Marketplace", action:()=>openSteam("store") },
      { label:"Screenshots", action:api.openMedia },
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    if (screen === "games" && cur) gameMenu(cur);
    else menu.open(extra);
  };
  const move = (set: (n: number) => void, v: number, d: number, max: number, kind: "move" | "tab" = "move") => {
    const n = clamp(v + d, 0, max);
    if (n !== v) (set(n), playSound(kind));
    else playSound("end");
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (b === "y") return options(), true;
    if (screen === "main") {
      if (b === "up" || b === "down") move(setMsel, mcur, b === "up" ? -1 : 1, MAIN.length - 1, "tab");
      else if (b === "a") (playSound("select"), MAIN[mcur].run());
      else if (b === "x" && recent) api.launch(recent);
      else if (b === "menu" && recent) api.nativeMenu(recent);
      else if (b === "b") return false;
      return true;
    }
    if (b === "b") return go("main"), true;
    if (screen === "settings") {
      if (b === "up" || b === "down") move(setSsel, ssel, b === "up" ? -1 : 1, SETTINGS.length - 1);
      else if (b === "a") (playSound("toggle"), SETTINGS[ssel].run());
      return true;
    }
    // games
    if (b === "up" || b === "down") move(setGsel, gsel, b === "up" ? -1 : 1, games.length - 1);
    else if (b === "left" || b === "right" || b === "l1" || b === "r1") {
      const n = clamp(lsel + (b === "left" || b === "l1" ? -1 : 1), 0, lists.length - 1);
      if (n !== lsel) (setLsel(n), setGsel(0), playSound("tab"));
    } else if (b === "a" && cur) (playSound("select"), gameMenu(cur));
    else if (b === "x" && cur) api.launch(cur);
    else if (b === "menu" && cur) api.nativeMenu(cur);
    return true;
  };

  // ── main menu geometry (after the 1280×720 dashboard) ──
  const ox = W * 0.35;
  const oy = H * 0.43;
  const or = H * 0.205;
  const n = MAIN.length;
  const gap = Math.min(H * 0.17, (H * 0.66) / Math.max(1, n - 1));
  const mid = (n - 1) / 2;
  const R = W * 0.15;
  const items = MAIN.map((_, i) => {
    const y = oy + (i - mid) * gap;
    const dx = Math.sqrt(Math.max(0, R * R - (y - oy) * (y - oy) * .3));
    return { y, px: ox + dx * 0.98 };
  });
  const barH = H * 0.045;
  const pr = H * 0.034;
  const main: CSSProperties = { position: "absolute", inset: 0, animation: s.animations ? "dhtXbIn 380ms ease-out" : undefined };

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", b: "Back", y: "Options" }}>
      <Stage background="#061402">
        <style>{CSS}</style>
        {wall ? <img src={wall} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} /> : <Backdrop W={W} H={H} cx={ox} cy={oy} animate={s.animations}/>}

        {screen === "main" && (
          <div key="main" style={main}>
            <Orb x={ox} y={oy} r={or} animate={s.animations} burst={burst}/>
            {MAIN.map((it, i) => {
              const on = i === mcur;
              const { y, px } = items[i];
              return (
                <div key={it.id}>
                  <Pod x={px} y={y} r={on ? pr * 1.12 : pr} on={on} />
                  <Bar className="dht-xbox-button" name={it.label} on={on} x={px + pr * 1.7} y={y - barH / 2 + barH * 0.08} w={W * 0.25} h={barH} onClick={() => (setMsel(i), it.run())}>
                    <span style={{ fontSize: it.id === "disc" ? barH * 0.4 : barH * 0.67, overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</span>
                    {it.small && <span style={{ marginLeft: "auto", paddingLeft: 10, fontSize: barH * 0.26, opacity: 0.75 }}>{it.small}</span>}
                  </Bar>
                </div>
              );
            })}
            <Hint x={W * 0.665} y={H * 0.86} k="A" label="SELECT" side="right" H={H} W={W} />
          </div>
        )}

        {screen === "settings" && (
          <div key="settings" style={main}>
            <div className="dht-xbox-category" style={{position:"absolute",left:W*.255-H*.245,top:H*.45-H*.245,width:H*.49,height:H*.49}}>
              <div style={{position:"absolute",inset:"6%",borderRadius:"50%",background:"radial-gradient(circle,#b4ff2310,transparent 70%)",boxShadow:"inset 0 0 20px #9aff1928"}}/>
              <TheseusSurface key={selectedCategory} model={categoryModels[selectedCategory]} W={H*.49} H={H*.49} animate={s.animations}/>
            </div>
            <Plate W={W} H={H} title="SETTINGS">
              <Rows W={W} H={H} items={SETTINGS} sel={ssel} onPick={(i) => (setSsel(i), SETTINGS[i].run())} />
            </Plate>
            <InfoBox W={W} H={H}>
              {selectedCategory === "clock" ? `${now.toLocaleDateString()} ${fmtTime(now,s.clock24)}` : SETTINGS[ssel]?.label.toUpperCase()}
            </InfoBox>
            <Hint x={W * 0.27} y={H * 0.905} k="B" label="BACK" side="left" H={H} W={W} />
            <Hint x={W * 0.68} y={H * 0.905} k="A" label="SELECT" side="right" H={H} W={W} />
          </div>
        )}

        {screen === "games" && (
          <div key="games" style={main}>
            <GlassSphere W={W} H={H}>{cur ? <GameArt flat g={cur} kind="portrait" position="50% 20%" style={{ width: "100%", height: "100%" }} /> : <div style={{ width: "100%", height: "100%", background: "#0b2604" }} />}</GlassSphere>
            <Plate W={W} H={H} title="MEMORY" sub={`◀ ${list?.name.toUpperCase()} ▶`}>
              <Rows W={W} H={H} items={games.map((g, i) => ({ key: String(g.appid), label: showTitle(s, "xbox", i === gsel) ? g.name : "· · ·" }))} sel={clamp(gsel, 0, Math.max(0, games.length - 1))} onPick={(i) => (i === gsel && cur ? gameMenu(cur) : setGsel(i))} />
              {!games.length && <div style={{ position: "absolute", left: W * 0.4, top: H * 0.25, fontFamily: FONT, color: TEXT, fontSize: H * 0.03 }}>NO SAVED GAMES</div>}
            </Plate>
            <InfoBox W={W} H={H}>
              {cur ? (
                <>
                  <span>{fmtLastPlayed(cur.lastPlayed).toUpperCase()}</span>
                  <span style={{ opacity: 0.7 }}>·</span>
                  <span>{fmtPlaytime(cur.playtime).toUpperCase()}</span>
                </>
              ) : (
                "—"
              )}
            </InfoBox>
            {cur && (
              <div style={{ position: "absolute", left: W * 0.45, top: H * 0.775 }}>
                <Badges g={cur} size={12} />
              </div>
            )}
            <Hint x={W * 0.27} y={H * 0.905} k="B" label="BACK" side="left" H={H} W={W} />
            <Hint x={W * 0.68} y={H * 0.905} k="A" label="SELECT" side="right" H={H} W={W} />
          </div>
        )}

        <MenuView menu={menu} variant="xbox" />
      </Stage>
    </ThemeRoot>
  );
}
