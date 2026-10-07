// PS2 main menu: towers of light in a dark space, the Browser /
// System Configuration menu, memory-card devices, and a grid of slowly
// turning save-data style icons for the games.
import { CSSProperties, useMemo, useState } from "react";
import { AnimCanvas } from "../canvas";
import { GameArt, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openSteam } from "../library";
import { showTitle, THEMES, updateSettings } from "../settings";
import { currentPresetId, getPresets } from "../presets";
import { Badges } from "../badges";
import { fmtTime, playSound, useClock } from "../steam";

type Screen = "main" | "browser" | "card" | "info" | "config";
const BLUE = "var(--dht-ps2-text, #9fb4ff)";
const FONT = `var(--dht-font, "Motiva Sans", "Helvetica Neue", Arial, sans-serif)`;

// ───────────── towers ─────────────
interface Tower {
  x: number;
  z: number;
  h: number;
  ph: number;
}
const TOWERS: Tower[] = (() => {
  const out: Tower[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let x = -9; x <= 9; x++)
    for (let z = -9; z <= 9; z++) {
      if (rnd() < 0.55) continue;
      out.push({ x: x * 1.1, z: z * 1.1, h: 0.15 + rnd() * rnd() * 3.2, ph: rnd() * 6.28 });
    }
  return out;
})();

function makeTowerDraw(dim: number) {
  return (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#000002");
    sky.addColorStop(0.55, "#02061a");
    sky.addColorStop(1, "#071030");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const a = t * 0.05;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const f = w * 0.7;
    const cx = w / 2;
    const horizon = h * 0.5;
    const camY = 3.4;
    const pts = TOWERS.map((tw) => {
      const X = tw.x * ca - tw.z * sa;
      const Z = tw.x * sa + tw.z * ca + 13;
      return { tw, X, Z };
    })
      .filter((p) => p.Z > 4.5)
      .sort((p, q) => q.Z - p.Z);
    ctx.globalCompositeOperation = "lighter";
    for (const { tw, X, Z } of pts) {
      const hh = tw.h * (0.85 + 0.15 * Math.sin(t * 0.6 + tw.ph));
      const sx = cx + (X / Z) * f;
      const base = horizon + (camY / Z) * f;
      const top = horizon + ((camY - hh) / Z) * f;
      const bw = (0.3 / Z) * f;
      const fog = Math.max(0, Math.min(1, 1.15 - Z / 24)) * dim * Math.min(1, (Z - 4.5) / 3);
      const g = ctx.createLinearGradient(0, top, 0, base);
      g.addColorStop(0, `rgba(200,215,255,${0.4 * fog})`);
      g.addColorStop(0.15, `rgba(120,150,255,${0.14 * fog})`);
      g.addColorStop(1, `rgba(60,90,220,${0.02 * fog})`);
      ctx.fillStyle = g;
      ctx.fillRect(sx - bw / 2, top, bw, base - top);
      // glowing cap
      ctx.fillStyle = `rgba(230,240,255,${0.6 * fog})`;
      ctx.fillRect(sx - bw / 2, top, bw, Math.max(1.5, bw * 0.18));
    }
    ctx.globalCompositeOperation = "source-over";
    // floor haze
    const haze = ctx.createLinearGradient(0, horizon, 0, h);
    haze.addColorStop(0, "rgba(40,70,200,0)");
    haze.addColorStop(0.3, "rgba(40,70,200,0.08)");
    haze.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizon, w, h - horizon);
  };
}

// ───────────── pieces ─────────────
// Orbiting light cluster inspired by the PS2 presentation at imsaud.me.
function drawMenuOrbs(ctx:CanvasRenderingContext2D,t:number,w:number,h:number){
 ctx.clearRect(0,0,w,h);
 for(let i=0;i<8;i++){
  const angle=t*.5+i*Math.PI/4;
  const x=w*.30+Math.cos(angle)*w*.065;
  const y=h*.49+Math.sin(angle*1.5+i*.12)*h*.055;
  const radius=18+6*Math.sin(angle);
  const glow=ctx.createRadialGradient(x,y,0,x,y,radius*2.4);
  glow.addColorStop(0,'#edffff');glow.addColorStop(.10,'#b9f6ff');glow.addColorStop(.24,'#43c6ff');glow.addColorStop(.5,'#0872c76b');glow.addColorStop(1,'#004b9600');
  ctx.fillStyle=glow;ctx.fillRect(x-radius*2.4,y-radius*2.4,radius*4.8,radius*4.8);
 }
}

function Orb({ on, size = 46, color = "#6f8cff" }: { on: boolean; size?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, #fff, ${color} 45%, #0a1450 100%)`,
        boxShadow: on ? `0 0 26px 8px ${color}` : `0 0 8px 1px ${color}55`,
        opacity: on ? 1 : 0.55,
        transition: "all 200ms",
      }}
    />
  );
}

function MemoryCard({ label, color, on, kind }: { label: string; color: string; on: boolean; kind: "card" | "disc" }) {
  return (
    <div className="dht-ps2-device" data-selected={on} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: on ? "translateY(-12px) scale(1.12)" : "none", transition: "transform 220ms", width: 220 }}>
      <div style={{ animation: on ? "dhtTurn 3.6s linear infinite" : "none", transformStyle: "preserve-3d", filter: on ? "drop-shadow(0 0 18px rgba(120,150,255,0.9))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}>
        {kind === "card" ? (
          <svg width="120" height="150" viewBox="0 0 120 150">
            <path d="M8 4h86l18 18v120a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4z" fill={color} />
            <path d="M8 4h86l18 18v120a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4z" fill="url(#mcShine)" />
            <rect x="18" y="24" width="72" height="52" rx="3" fill="rgba(255,255,255,0.18)" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={18 + i * 14} y="118" width="9" height="22" rx="1.5" fill="rgba(0,0,0,0.35)" />
            ))}
            <defs>
              <linearGradient id="mcShine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity=".35" />
                <stop offset=".5" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <svg width="150" height="150" viewBox="0 0 150 150">
            <defs>
              <radialGradient id="disc" cx=".4" cy=".35">
                <stop offset="0" stopColor="#e9f0ff" />
                <stop offset=".6" stopColor="#7f95d8" />
                <stop offset="1" stopColor="#2b3a80" />
              </radialGradient>
            </defs>
            <circle cx="75" cy="75" r="70" fill="url(#disc)" />
            <circle cx="75" cy="75" r="16" fill="#050a20" />
            <circle cx="75" cy="75" r="26" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          </svg>
        )}
      </div>
      <div style={{ color: on ? "#fff" : BLUE, fontSize: 19, textAlign: "center", textShadow: on ? "0 0 10px #6f8cff" : "none", fontFamily: FONT }}>{label}</div>
    </div>
  );
}

function SaveIcon({ g, on, size, animate }: { g: Game; on: boolean; size: number; animate:boolean }) {
  return (
    <div className="dht-ps2-save-model" data-selected={on} style={{ position:"relative",width: size, height: size * 1.25, perspective: 600 }}>
      {on&&<div aria-hidden className="dht-ps2-save-light"/>}
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          animation: !animate?"none":on ? "dhtTurn 9s linear infinite" : "dhtSway 6s ease-in-out infinite",
          animationDelay: on ? "0s" : `${(g.appid % 7) * -0.8}s`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden",transform:"translateZ(7px)", boxShadow: "0 4px 10px rgba(0,0,0,0.6)", borderRadius: 4, overflow: "hidden" }}>
          <GameArt g={g} kind="portrait" style={{ width: "100%", height: "100%",objectFit:"cover" }} />
        </div>
        <div aria-hidden style={{position:"absolute",left:0,top:0,bottom:0,width:14,background:"linear-gradient(90deg,#191b24,#606775,#171a24)",transform:"translateZ(7px) rotateY(90deg)",transformOrigin:"left center"}}/>
        <div aria-hidden style={{position:"absolute",right:0,top:0,bottom:0,width:14,background:"linear-gradient(90deg,#11141b,#667080,#252a34)",transform:"translateZ(7px) rotateY(-90deg)",transformOrigin:"right center"}}/>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg) translateZ(7px)", borderRadius: 4, overflow: "hidden", filter: "brightness(0.55) saturate(0.6)" }}>
          <GameArt g={g} kind="portrait" style={{ width: "100%", height: "100%", transform: "scaleX(-1)" }} />
        </div>
      </div>
    </div>
  );
}

const PS2_CSS = `
.dht-ps2-save-light{position:absolute;left:-35%;right:-35%;bottom:-30px;height:64px;background:radial-gradient(ellipse,#f4ffffb0, #d9f2ff44 35%,transparent 70%);filter:blur(8px);pointer-events:none}
.dht-ps2-scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,#0000000a 0 1px,transparent 1px 3px);z-index:1}
@media(prefers-reduced-motion:reduce){.dht-ps2-save-model *{animation:none!important}}

@keyframes dhtTurn { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
@keyframes dhtSway { 0%,100% { transform: rotateY(-14deg) translateY(0); } 50% { transform: rotateY(14deg) translateY(-4px); } }
@keyframes dhtIn2 { from { opacity: 0; } to { opacity: 1; } }
`;

// ───────────── main ─────────────
export function Ps2Home() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const now = useClock(15000);
  const menu = useMenu();

  const [screen, setScreen] = useRemembered<Screen>("ps2-screen", "main");
  const [msel, setMsel] = useRemembered("ps2-main", 0);
  const [dsel, setDsel] = useRemembered("ps2-dev", 0);
  const [gsel, setGsel] = useRemembered("ps2-game", 0);
  const [isel, setIsel] = useState(0);
  const [csel, setCsel] = useState(0);

  const devices = useMemo(
    () => [
      { label: "Memory Card (PS2) /1", sub: "Your games", color: "#2a2f3a", games: api.lib.games, kind: "card" as const },
      { label: "Memory Card (PS2) /2", sub: "All games", color: "#5a6170", games: api.lib.all.slice(0, s.maxGames), kind: "card" as const },
      { label: "Steam Library", sub: "Open the library", color: "", games: [] as Game[], kind: "disc" as const },
      { label: "Online Store", sub: "Steam Store", color: "", games: [] as Game[], kind: "disc" as const },
    ],
    [api.lib, s.maxGames],
  );
  const dev = devices[clamp(dsel, 0, devices.length - 1)];
  const games = dev.games;
  const COLS = 6;
  const gi = clamp(gsel, 0, Math.max(0, games.length - 1));
  const g = games[gi];

  const infoOpts = g
    ? [
        { label: "Start", run: () => api.launch(g) },
        { label: "Watch Trailer", run: () => api.playTrailer(g) },
        { label: "Game Page", run: () => api.details(g) },
        { label: "Steam Menu", run: () => api.nativeMenu(g) },
        { label: "Back", run: () => go("card") },
      ]
    : [];
  const configOpts: { label: string; value?: string; run: () => void }[] = [
    { label: "Preset", value: getPresets().find((p) => p.id === currentPresetId(s))?.label, run: () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "Presets") },
    { label: "Clock", value: s.clock24 ? "24-hour" : "12-hour", run: () => updateSettings({ clock24: !s.clock24 }) },
    { label: "Sound Effects", value: s.sounds ? "On" : "Off", run: () => updateSettings({ sounds: !s.sounds }) },
    { label: "Home Screen Settings", run: api.openSettings },
    { label: "System Settings", run: () => openSteam("settings") },
    { label: "Steam Home", run: api.showSteamHome },
    { label: "Exit", run: () => go("main") },
  ];

  const go = (sc: Screen) => {
    setScreen(sc);
    playSound(sc === "main" ? "back" : "open");
  };

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
    ];
    if ((screen === "card" || screen === "info") && g) menu.open([{ label: "Start", action: () => api.launch(g) }, { label: "Game Page", action: () => api.details(g) }, ...extra], g.name);
    else menu.open(extra);
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (b === "y") return options(), true;
    if (b === "menu") {
      if (g && (screen === "card" || screen === "info")) api.nativeMenu(g);
      return true;
    }
    const mv = (cur: number, set: (n: number) => void, n: number, d: number) => {
      const nx = clamp(cur + d, 0, n - 1);
      if (nx !== cur) (set(nx), playSound("move"));
    };
    switch (screen) {
      case "main":
        if (b === "up" || b === "down") mv(msel, setMsel, 2, b === "up" ? -1 : 1);
        else if (b === "a") go(msel === 0 ? "browser" : "config");
        else if (b === "b") return false;
        return true;
      case "browser":
        if (b === "left" || b === "right") mv(dsel, setDsel, devices.length, b === "left" ? -1 : 1);
        else if (b === "a") {
          if (dev.kind === "disc") (playSound("select"), openSteam(dev.label === "Online Store" ? "store" : "library"));
          else (setGsel(0), go("card"));
        } else if (b === "b") go("main");
        return true;
      case "card": {
        if (b === "left" || b === "right") mv(gi, setGsel, games.length, b === "left" ? -1 : 1);
        else if (b === "up" || b === "down") mv(gi, setGsel, games.length, b === "up" ? -COLS : COLS);
        else if (b === "l1" || b === "r1") mv(gi, setGsel, games.length, b === "l1" ? -COLS * 3 : COLS * 3);
        else if (b === "a" && g) {
          setIsel(0);
          go("info");
        } else if (b === "x" && g) api.launch(g);
        else if (b === "b") go("browser");
        return true;
      }
      case "info":
        if (b === "up" || b === "down") mv(isel, setIsel, infoOpts.length, b === "up" ? -1 : 1);
        else if (b === "a") {
          const o = infoOpts[isel];
          if (o?.label === "Start" && g) api.activate(g, () => api.launch(g));
          else o?.run();
        } else if (b === "b") go("card");
        return true;
      case "config":
        if (b === "up" || b === "down") mv(csel, setCsel, configOpts.length, b === "up" ? -1 : 1);
        else if (b === "a") (playSound("select"), configOpts[csel].run());
        else if (b === "b") go("main");
        return true;
    }
    return false;
  };

  const towerDraw = useMemo(() => makeTowerDraw(screen === "main" ? 1 : 0.55), [screen]);
  const text = (on: boolean, size = 24): CSSProperties => ({ color: on ? (screen === "main"?"#55caff":"#f4f4dd") : (screen === "main"?"#919295":screen === "card"||screen === "browser"?"#dedede":BLUE), fontSize: size, fontFamily: FONT, textShadow: "0 1px 2px #000,1px 0 1px #0008", transition: "all 150ms" });

  // card grid geometry
  const ICON = 118;
  const GX = 168;
  const GY = 190;
  const row = Math.floor(gi / COLS);
  const firstRow = Math.max(0, row - 1);

  const hints =
    screen === "main" ? { a: "Enter" } : screen === "card" ? { a: "Information", b: "Back", x: "Start", y: "Options" } : { a: "Enter", b: "Back" };

  return (
    <ThemeRoot onInput={onInput} hints={hints}>
      <Stage background="#000">
        <style>{PS2_CSS}</style>
        {screen==="main"?<><div style={{position:"absolute",inset:0,opacity:.12}}><AnimCanvas width={W} height={H} animate={s.animations} fps={20} draw={towerDraw} deps={[screen]}/></div><AnimCanvas width={W} height={H} animate={s.animations} fps={30} draw={drawMenuOrbs}/></>:screen==="browser"||screen==="card"||screen==="info"?<div className="dht-ps2-browser-field" style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 40%,#9b9b9d 0%,#737376 38%,#3e3f43 80%,#222329 100%)"}}/>:<AnimCanvas width={W} height={H} animate={s.animations} fps={30} draw={towerDraw} deps={[screen]}/>}
        <div className="dht-ps2-scan"/>

        {/* clock */}
        <div style={{ position: "absolute", right: 46, top: 30, ...text(false, 20), opacity: 0.85 }}>
          {now.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" })} {fmtTime(now, s.clock24)}
        </div>

        {screen === "main" && (
          <div style={{ position: "absolute", left: W * 0.54, top: H * 0.44, display: "flex", flexDirection: "column", gap: 14, animation: "dhtIn2 500ms" }}>
            {["Browser", "System Configuration"].map((label, i) => (
              <div key={label} className="dht-ps2-item" data-selected={msel === i} style={{ display: "flex", alignItems: "center", gap: 26 }}>
                
                <span style={text(msel === i, 28)}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {screen === "browser" && (
          <div style={{ position: "absolute", inset: 0, animation: "dhtIn2 300ms" }}>
            <div style={{ position: "absolute", left: 60, top: 36, ...text(true, 26) }}>Browser</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.33, display: "flex", justifyContent: "center", gap: 60 }}>
              {devices.map((d, i) => (
                <MemoryCard key={d.label} label={d.label} color={d.color} on={i === dsel} kind={d.kind} />
              ))}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.75, textAlign: "center", ...text(false, 18) }}>
              {dev.sub}
              {dev.kind === "card" ? ` · ${dev.games.length} items` : ""}
            </div>
          </div>
        )}

        {screen === "card" && (
          <div style={{ position: "absolute", inset: 0, animation: "dhtIn2 300ms" }}>
            <div style={{ position: "absolute", left: 60, top: 36, ...text(true, 24) }}>{dev.label}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", ...text(true, 26), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 120px" }}>{g ? (showTitle(s, "ps2", true) ? g.name : "") : "No data"}</div>
            <div style={{ position: "absolute", left: (W - COLS * GX) / 2 + (GX - ICON) / 2, top: 150 }}>
              {games.slice(firstRow * COLS, firstRow * COLS + COLS * 3).map((gm, k) => {
                const i = firstRow * COLS + k;
                const on = i === gi;
                return (
                  <div key={gm.appid} className="dht-ps2-save dht-tile" data-selected={on} data-name={gm.name} style={{ position: "absolute", left: (i % COLS) * GX, top: (Math.floor(i / COLS) - firstRow) * GY, transform: on ? "scale(1.12)" : "none", transition: "transform 150ms" }}>
                    <SaveIcon g={gm} on={on} size={ICON} animate={s.animations}/>
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 60, bottom: 50, ...text(false, 17) }}>
              {games.length} items · {g ? fmtPlaytime(g.playtime) : ""}
            </div>
          </div>
        )}

        {screen === "info" && g && (
          <div style={{ position: "absolute", inset: 0, animation: "dhtIn2 300ms" }}>
            <div style={{ position: "absolute", left: 60, top: 36, ...text(true, 24) }}>{dev.label}</div>
            <div style={{ position: "absolute", left: W * 0.12, top: H * 0.22 }}>
              <SaveIcon g={g} on size={250} animate={s.animations}/>
            </div>
            <div style={{ position: "absolute", left: W * 0.5, top: H * 0.22, width: W * 0.42 }}>
              <div style={{ ...text(true, 30), marginBottom: 14 }}>{g.name}</div>
              <div style={{ ...text(false, 18), lineHeight: 1.7 }}>
                {fmtPlaytime(g.playtime)}
                <br />
                Last played: {fmtLastPlayed(g.lastPlayed)}
                <br />
                {g.installed ? "Installed" : "Not installed"}
              </div>
              <Badges g={g} size={15} style={{ marginTop: 12 }} />
              <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
                {infoOpts.map((o, i) => (
                  <div key={o.label} className="dht-ps2-item" data-selected={i === isel} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <Orb on={i === isel} size={22} />
                    <span style={text(i === isel, 24)}>{o.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {screen === "config" && (
          <div style={{ position: "absolute", inset: 0, animation: "dhtIn2 300ms" }}>
            <div style={{ position: "absolute", left: 60, top: 36, ...text(true, 26) }}>System Configuration</div>
            <div style={{ position: "absolute", left: W * 0.2, top: H * 0.2, width: W * 0.6, display: "flex", flexDirection: "column", gap: 4 }}>
              {configOpts.map((o, i) => (
                <div key={o.label} className="dht-ps2-item" data-selected={i === csel} style={{ display: "flex", justifyContent: "space-between", padding: "12px 24px", background: i === csel ? "linear-gradient(90deg, rgba(80,110,255,0.35), rgba(80,110,255,0))" : "none", borderLeft: i === csel ? "3px solid #9fb4ff" : "3px solid transparent" }}>
                  <span style={text(i === csel, 24)}>{o.label}</span>
                  {o.value && <span style={text(i === csel, 22)}>{o.value}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <MenuView menu={menu} variant="ps2" />
      </Stage>
    </ThemeRoot>
  );
}
