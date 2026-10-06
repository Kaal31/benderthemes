// Compatibility badges shown inside the themes: Steam Deck compatibility
// (from Steam's own app overview) and the ProtonDB community tier (fetched from
// protondb.com, cached). Plugins that add badges to Steam's game page (ProtonDB
// Badges, HLTB…) keep working there; every theme can open that page.
import { fetchNoCors } from "@decky/api";
import { CSSProperties, useEffect, useState } from "react";
import { Game } from "./library";
import { getSettings } from "./settings";

export type ProtonTier = "native" | "platinum" | "gold" | "silver" | "bronze" | "borked" | "pending";
const PROTON_COLORS: Record<ProtonTier, string> = {
  native: "#00c853",
  platinum: "#b4c7dc",
  gold: "#cfb53b",
  silver: "#a6a6a6",
  bronze: "#cd7f32",
  borked: "#ff3b30",
  pending: "#6b7a8f",
};

const tierCache = new Map<number, ProtonTier | null>();
const pending = new Map<number, Promise<ProtonTier | null>>();
let previewTier: ((appid: number) => ProtonTier | null) | null = null;
export function setPreviewTier(f: typeof previewTier) {
  previewTier = f;
}

async function loadTier(appid: number): Promise<ProtonTier | null> {
  if (previewTier) return previewTier(appid);
  if (tierCache.has(appid)) return tierCache.get(appid)!;
  if (pending.has(appid)) return pending.get(appid)!;
  const p = (async () => {
    try {
      const r = await fetchNoCors(`https://www.protondb.com/api/v1/reports/summaries/${appid}.json`, { method: "GET" } as any);
      if (!r.ok) return null;
      const j: any = await r.json();
      const t = String(j?.tier ?? "").toLowerCase();
      return (t in PROTON_COLORS ? (t as ProtonTier) : null) as ProtonTier | null;
    } catch {
      return null;
    }
  })();
  pending.set(appid, p);
  const t = await p;
  tierCache.set(appid, t);
  pending.delete(appid);
  return t;
}

export function useProtonTier(g: Game | undefined): ProtonTier | null {
  const on = getSettings().badges.protondb;
  const id = g && !g.shortcut ? g.appid : 0;
  const [t, setT] = useState<ProtonTier | null>(id ? tierCache.get(id) ?? null : null);
  useEffect(() => {
    if (!on || !id) return setT(null);
    let alive = true;
    const timer = setTimeout(() => loadTier(id).then((v) => alive && setT(v)), 250); // only for the resting selection
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [id, on]);
  return t;
}

/** Steam's own Deck compatibility: 3 verified, 2 playable, 1 unsupported, 0 unknown. */
export function deckCompat(g: Game | undefined): "verified" | "playable" | "unsupported" | null {
  if (!g || !getSettings().badges.deck) return null;
  const c = Number(g.overview?.steam_deck_compat_category ?? 0);
  return c === 3 ? "verified" : c === 2 ? "playable" : c === 1 ? "unsupported" : null;
}

const DECK_LOOK = {
  verified: { label: "Verified", color: "#59bf40" },
  playable: { label: "Playable", color: "#ffc82c" },
  unsupported: { label: "Unsupported", color: "#a0a0a0" },
};

/**
 * Badge row. `variant` adapts the look to the theme; everything carries
 * stable class names (dht-badge, dht-badge--deck-verified, dht-badge--protondb-gold…)
 * so CSS Loader themes can restyle it.
 */
export function Badges({ g, size = 15, style, light }: { g: Game | undefined; size?: number; style?: CSSProperties; light?: boolean }) {
  const tier = useProtonTier(g);
  const deck = deckCompat(g);
  if (!g || (!tier && !deck)) return null;
  const pill = (color: string): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: size * 0.4,
    padding: `${size * 0.2}px ${size * 0.6}px`,
    borderRadius: size,
    fontSize: size,
    fontWeight: 700,
    letterSpacing: 0.3,
    lineHeight: 1.1,
    color: light ? "#1c2433" : "#fff",
    background: light ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.45)",
    border: `1.5px solid ${color}`,
    whiteSpace: "nowrap",
  });
  return (
    <div className="dht-badges" style={{ display: "flex", gap: size * 0.5, flexWrap: "wrap", ...style }}>
      {deck && (
        <span className={`dht-badge dht-badge--deck dht-badge--deck-${deck}`} style={pill(DECK_LOOK[deck].color)}>
          <svg width={size} height={size} viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7.5" fill={DECK_LOOK[deck].color} />
            {deck === "verified" && <path d="M4.5 8.3l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />}
            {deck === "playable" && <path d="M8 4v5M8 11.2v.6" stroke="#222" strokeWidth="2" strokeLinecap="round" />}
            {deck === "unsupported" && <path d="M5 5l6 6M11 5l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />}
          </svg>
          {DECK_LOOK[deck].label}
        </span>
      )}
      {tier && (
        <span className={`dht-badge dht-badge--protondb dht-badge--protondb-${tier}`} style={pill(PROTON_COLORS[tier])}>
          <span style={{ width: size * 0.7, height: size * 0.7, borderRadius: "50%", background: PROTON_COLORS[tier], display: "inline-block" }} />
          ProtonDB {tier[0].toUpperCase() + tier.slice(1)}
        </span>
      )}
    </div>
  );
}
