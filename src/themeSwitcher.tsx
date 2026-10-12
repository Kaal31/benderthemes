// Hold L1 + direction on the home: a quick theme switcher.
//   L1 + up/down     the previous / next console (its own default look): Wii, Wii U, Switch, 3DS, PS1 … Xbox 360,
//                    then the bonus looks, then installed themes.
//   L1 + left/right  that console's looks: its default, its other built-in looks (Xbox 360 eras, Vita Sakura),
//                    its theme files (.p3t, .ptf, .nxtheme, .utheme, …) and the user's saved presets based on it.
// The HUD names the place ("PS3 · ZenGarden.p3t (3/12)"). Stepping only moves the HUD's cursor; the preset is applied
// once stepping pauses (APPLY_MS) or when L1 is released, so running through twenty looks does not load twenty homes.
// The button handling (L1 held, L1's own action kept for a plain press) is in input.tsx.
import { useEffect, useRef, useState } from "react";
import { setL1Switcher, SwitchAxis } from "./input";
import { applyPreset, ConsoleRow, consoleRows, currentPresetId, switcherPosition, variantLabel } from "./presets";
import { playSound } from "./steam";

/** Stepping pauses this long before the look under the cursor is loaded. */
export const APPLY_MS = 350;
/** Holding L1 this long without a direction shows the HUD as a hint. */
const HINT_MS = 450;
/** The HUD stays this long after L1 is released. */
const LINGER_MS = 1100;

interface HudState {
  rows: ConsoleRow[];
  r: number;
  v: number;
  /** The look under the cursor is the one on screen. */
  applied: boolean;
  /** L1 still down. */
  held: boolean;
}

const wrap = (i: number, n: number) => (n ? ((i % n) + n) % n : 0);

/** Wires the switcher to the input layer while the home is mounted; returns its HUD. */
export function ThemeSwitcher({ available }: { available: () => boolean }) {
  const avail = useRef(available);
  avail.current = available;
  const [hud, setHud] = useState<HudState | null>(null);
  const st = useRef({ rows: null as ConsoleRow[] | null, r: 0, v: 0, applyT: 0 as any, hintT: 0 as any, hideT: 0 as any, pending: false });

  useEffect(() => {
    const s = st.current;
    const show = (held: boolean) => s.rows && setHud({ rows: s.rows, r: s.r, v: s.v, applied: !s.pending, held });
    const start = () => {
      const rows = consoleRows();
      const pos = switcherPosition(rows, currentPresetId()) ?? [0, 0];
      s.rows = rows;
      [s.r, s.v] = pos;
      s.pending = false;
    };
    const apply = () => {
      clearTimeout(s.applyT);
      if (!s.pending || !s.rows) return;
      s.pending = false;
      const p = s.rows[s.r]?.presets[s.v];
      if (p && p.id !== currentPresetId()) applyPreset(p);
    };
    setL1Switcher({
      available: () => {
        try { return avail.current(); } catch { return false; }
      },
      begin() {
        clearTimeout(s.hideT);
        clearTimeout(s.hintT);
        start();
        s.hintT = setTimeout(() => show(true), HINT_MS);
      },
      step(axis: SwitchAxis, dir: -1 | 1) {
        clearTimeout(s.hintT);
        clearTimeout(s.hideT);
        if (!s.rows) start();
        const rows = s.rows!;
        if (!rows.length) return;
        if (axis === "console") {
          s.r = wrap(s.r + dir, rows.length);
          s.v = 0; // a console's own default look
        } else s.v = wrap(s.v + dir, rows[s.r].presets.length);
        const target = rows[s.r].presets[s.v];
        s.pending = !!target && target.id !== currentPresetId();
        playSound("move");
        show(true);
        clearTimeout(s.applyT);
        if (s.pending) s.applyT = setTimeout(() => { apply(); show(true); }, APPLY_MS);
      },
      end(stepped: boolean) {
        clearTimeout(s.hintT);
        if (!stepped) {
          s.rows = null;
          setHud(null);
          return;
        }
        const was = s.pending;
        apply();
        if (was) playSound("tab");
        show(false);
        s.rows = null;
        s.hideT = setTimeout(() => setHud(null), LINGER_MS);
      },
    });
    return () => {
      setL1Switcher(null);
      clearTimeout(s.applyT);
      clearTimeout(s.hintT);
      clearTimeout(s.hideT);
      apply();
    };
  }, []);

  if (!hud || !hud.rows.length) return null;
  return <SwitcherHud {...hud} />;
}

function SwitcherHud({ rows, r, v, applied, held }: HudState) {
  const row = rows[r];
  const n = row.presets.length;
  const p = row.presets[v];
  const name = p ? variantLabel(row, p) : "";
  const near = (d: number) => rows[wrap(r + d, rows.length)];
  return (
    <div className="dht-switcher" data-held={held} data-applied={applied} role="status" aria-live="polite" aria-label={`${row.label} · ${name} (${v + 1}/${n})`}>
      <style>{SWITCHER_CSS}</style>
      <div className="dht-switcher-console">
        <div className="dht-switcher-axis"><b>L1</b> + ▲▼ Console <span>{r + 1}/{rows.length}</span></div>
        <div className="dht-switcher-ring">
          {rows.length > 2 && <span className="dht-switcher-near">{near(-1).label}</span>}
          <strong>{row.label}</strong>
          {rows.length > 1 && <span className="dht-switcher-near">{near(1).label}</span>}
        </div>
      </div>
      <div className="dht-switcher-variant">
        <div className="dht-switcher-axis"><b>L1</b> + ◀▶ {row.label} looks <span>{v + 1}/{n}</span></div>
        <div className="dht-switcher-name">
          <i aria-hidden="true">{n > 1 ? "◀" : ""}</i>
          <strong>{name}</strong>
          <i aria-hidden="true">{n > 1 ? "▶" : ""}</i>
        </div>
        <div className="dht-switcher-dots" aria-hidden="true">
          {n <= 24 ? row.presets.map((x, i) => <i key={x.id} data-on={i === v} data-user={!!x.user} />) : <em style={{ width: `${((v + 1) / n) * 100}%` }} />}
        </div>
      </div>
      <div className="dht-switcher-foot">{held ? (applied ? "Release L1 to keep" : "Loading when you stop…") : "Kept"} · {row.label} · {name} ({v + 1}/{n})</div>
    </div>
  );
}

// Neutral on every look (it floats over all of them). Hooks: .dht-switcher, -console, -variant, -name, -dots, -foot.
const SWITCHER_CSS = `
.dht-switcher{position:absolute;left:50%;top:56px;transform:translateX(-50%);z-index:120;width:min(720px,calc(100% - 32px));box-sizing:border-box;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.3fr);gap:0 18px;padding:14px 20px 12px;border-radius:16px;background:rgba(18,20,24,.86);color:#f2f4f7;font:15px "Motiva Sans",Arial,sans-serif;box-shadow:0 10px 36px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.08);pointer-events:none;backdrop-filter:blur(8px);animation:dht-switcher-in .14s ease-out}
.dht-switcher[data-held=false]{opacity:.92}
@keyframes dht-switcher-in{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}
.dht-switcher-axis{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#9aa3ad;display:flex;gap:6px;align-items:center;white-space:nowrap;overflow:hidden}
.dht-switcher-axis b{font-weight:700;color:#d6dbe1;border:1px solid #6b737c;border-radius:4px;padding:0 4px;letter-spacing:0}
.dht-switcher-axis span{margin-left:auto;color:#d6dbe1;font-variant-numeric:tabular-nums;letter-spacing:0}
.dht-switcher-ring{display:flex;flex-direction:column;align-items:flex-start;margin-top:4px;line-height:1.25}
.dht-switcher-ring strong{font-size:22px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.dht-switcher-near{font-size:12px;color:#7d858e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.dht-switcher-variant{border-left:1px solid rgba(255,255,255,.12);padding-left:18px;min-width:0}
.dht-switcher-name{display:flex;align-items:center;gap:10px;margin-top:10px}
.dht-switcher-name strong{flex:1;min-width:0;text-align:center;font-size:20px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-switcher-name i{font-style:normal;color:#9aa3ad;font-size:13px;width:14px}
.dht-switcher-dots{display:flex;gap:5px;justify-content:center;margin-top:9px;height:6px;position:relative}
.dht-switcher-dots i{width:6px;height:6px;border-radius:50%;background:#4a5058}
.dht-switcher-dots i[data-user=true]{border-radius:1px}
.dht-switcher-dots i[data-on=true]{background:#f2f4f7}
.dht-switcher-dots em{position:absolute;left:0;top:2px;height:2px;background:#f2f4f7;border-radius:1px}
.dht-switcher-dots:has(em){background:#4a5058;height:2px;margin-top:11px;border-radius:1px}
.dht-switcher-foot{grid-column:1/-1;margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:#9aa3ad;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-switcher[data-applied=false] .dht-switcher-foot{color:#c9cfd6}
.dht-root[data-motion=false] .dht-switcher{animation:none}
`;
