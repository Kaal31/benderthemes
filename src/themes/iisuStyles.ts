// iiSU looks shared outside the home: the options menu (MenuView variant
// "iisu"), the themed store (tokens + IISU_STORE_CSS), the shared pages
// (IISU_PAGE_LOOKS, applied by src/pageLooks.ts) and the music / captures
// screens (IISU_MEDIA_CSS, in MEDIA_CSS of src/mediaCenter.tsx).
//
// Every one of them follows the look's "scheme" option: light (iiSU's default:
// white page with a dot grid, white rounded panels on soft shadows, pill
// buttons, the theme colour as focus ring and pill fill) or dark (the glass
// cards on the deep theme colour). The roots carry data-scheme="light|dark"
// and the scheme's colours as --iisu-* variables (iisuPageVars), so one set of
// rules draws both schemes; --dht-iisu-* variables (CSS-THEMING.md) override them.
import type { CSSProperties } from "react";
import type { Settings } from "../settings";
import { style } from "../engine/themeStyles";

export const IISU_FONT = `var(--dht-font, "Nunito", "Varela Round", "Arial Rounded MT Bold", "Segoe UI", sans-serif)`;

/** The "Theme colour" option: [focus ring, soft fill, deep background]. */
export const IISU_ACCENTS: Record<string, [string, string, string]> = {
  lavender: ["#b4a2ff", "#8b78f0", "#241a4a"],
  sky: ["#8fd2ff", "#4aa6ee", "#0f2a48"],
  mint: ["#8ff0c8", "#3cc495", "#0d3328"],
  peach: ["#ffc29a", "#f08a4f", "#4a2412"],
  rose: ["#ffa8cb", "#ee5f97", "#4a1430"],
  mono: ["#f2f2f5", "#9a9aa6", "#1c1c22"],
};
export const iisuAccent = (s: Settings) => {
  // presets v2: an accent colour chosen in Customize → Accent colour (#rrggbb) replaces the theme colour
  const own = s.mix?.[s.activeTheme || "iisu"]?.accent;
  if (own && /^#[0-9a-f]{6}$/i.test(own)) return [own, own, `color-mix(in srgb, ${own} 45%, #000)`] as typeof IISU_ACCENTS.sky;
  return IISU_ACCENTS[String(s.styles?.iisu?.accent ?? "sky")] ?? IISU_ACCENTS.sky;
};

/** A pill of the top or bottom bars. */
export const iisuPill: CSSProperties = {
  background: "linear-gradient(180deg,#ffffff2e,#ffffff14)",
  border: "1.5px solid #ffffff55",
  boxShadow: "0 6px 20px #0006, inset 0 1px 0 #ffffff55",
  backdropFilter: "blur(14px)",
  borderRadius: 999,
  color: "#fff",
  fontFamily: IISU_FONT,
  fontWeight: 800,
};

export type IisuScheme = "light" | "dark";
export const iisuScheme = (s: Settings): IisuScheme => (style<string>(s, "iisu", "scheme") === "dark" ? "dark" : "light");
/** The page background of the light scheme: the home's dot grid on pale grey. */
export const IISU_LIGHT_BG = "var(--dht-iisu-bg, radial-gradient(#0000000f 1.6px, transparent 1.8px) 0 0 / 24px 24px, #f2f3f7)";

/** Colours of one scheme as --iisu-* variables (the pages, store, media screens and the options menu read them). */
export function iisuSchemeVars(light: boolean): Record<string, string> {
  return light
    ? {
        "--iisu-ink": "var(--dht-iisu-text, #3a3d4a)",
        "--iisu-sub": "var(--dht-iisu-sub, #6c7182)",
        "--iisu-pill": "var(--dht-iisu-pill, linear-gradient(180deg,#ffffff,#f4f5f9))",
        "--iisu-edge": "var(--dht-iisu-pill-edge, #00000012)",
        "--iisu-pill-shadow": "0 4px 14px #00000020",
        "--iisu-card": "var(--dht-iisu-card, #ffffff)",
        "--iisu-card-on": "var(--dht-iisu-card, #ffffff)",
        "--iisu-card-shadow": "0 4px 14px #0000001a",
        "--iisu-tile-edge": "#ffffff",
        "--iisu-chip": "#eef0f5",
        "--iisu-track": "#00000014",
        // iiSU's sky pills sweep from cyan to lavender; ours sweep the theme colour the same way
        "--iisu-active": "linear-gradient(90deg, color-mix(in srgb, var(--dht-iisu-accent-fill, #4aa6ee) 75%, #3ee0f0), color-mix(in srgb, var(--dht-iisu-accent-fill, #4aa6ee) 70%, #b49cff))",
        "--iisu-active-ink": "#ffffff",
        "--iisu-active-edge": "#ffffff",
        "--iisu-menu-bg": "linear-gradient(180deg,#fffffff7,#f4f5f9f7)",
        "--iisu-menu-ink": "#3a3d4a",
        "--iisu-menu-dim": "#3a3d4a55",
        "--iisu-menu-title": "#6c7182",
        "--iisu-menu-sel": "#ffffff",
        "--iisu-menu-edge": "#00000014",
        "--iisu-menu-shadow": "0 24px 60px #0000003a, inset 0 1px 0 #fff",
      }
    : {
        "--iisu-ink": "var(--dht-iisu-text, #ffffff)",
        "--iisu-sub": "var(--dht-iisu-sub, #ffffffb0)",
        "--iisu-pill": "var(--dht-iisu-pill, linear-gradient(180deg,#ffffff2e,#ffffff14))",
        "--iisu-edge": "var(--dht-iisu-pill-edge, #ffffff44)",
        "--iisu-pill-shadow": "0 6px 20px #0006, inset 0 1px 0 #ffffff55",
        "--iisu-card": "var(--dht-iisu-card, #ffffff18)",
        "--iisu-card-on": "var(--dht-iisu-card, #ffffff30)",
        "--iisu-card-shadow": "none",
        "--iisu-tile-edge": "#ffffff40",
        "--iisu-chip": "#ffffff22",
        "--iisu-track": "#00000040",
        "--iisu-active": "#ffffff44",
        "--iisu-active-ink": "#ffffff",
        "--iisu-active-edge": "transparent",
        "--iisu-menu-bg": "linear-gradient(180deg,#34363ff2,#1f2027f4)",
        "--iisu-menu-ink": "#ffffff",
        "--iisu-menu-dim": "#ffffff55",
        "--iisu-menu-title": "#ffffffaa",
        "--iisu-menu-sel": "linear-gradient(180deg,#ffffff38,#ffffff1a)",
        "--iisu-menu-edge": "#ffffff55",
        "--iisu-menu-shadow": "0 24px 70px #000c, inset 0 1px 0 #ffffff44",
      };
}
/** The focus ring colour every iiSU rule uses. */
const RING = "var(--dht-iisu-ring, var(--dht-iisu-accent-ring, #8fd2ff))";
/** Variables for the root of a page, the store or a media screen drawn in the iiSU look ({} for other looks). */
export function iisuPageVars(s: Settings): CSSProperties {
  if (s.theme !== "iisu") return {};
  const [ringC, fill, deep] = iisuAccent(s);
  return { "--dht-iisu-accent-ring": ringC, "--dht-iisu-accent-fill": fill, "--dht-iisu-accent-deep": deep, "--iisu-ring": RING, ...iisuSchemeVars(iisuScheme(s) === "light") } as CSSProperties;
}
/** data-scheme of a page root: "light" / "dark" for the iiSU look, nothing for the others. */
export const iisuSchemeAttr = (s: Settings): IisuScheme | undefined => (s.theme === "iisu" ? iisuScheme(s) : undefined);

export const IISU_MENU: { panel: CSSProperties; item: (sel: boolean, dis?: boolean) => CSSProperties; title?: CSSProperties } = {
  panel: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", minWidth: 420, padding: 12, background: "var(--dht-iisu-menu, var(--iisu-menu-bg, linear-gradient(180deg,#34363ff2,#1f2027f4)))", border: "1.5px solid var(--iisu-menu-edge, #ffffff55)", borderRadius: 26, boxShadow: "var(--iisu-menu-shadow, 0 24px 70px #000c, inset 0 1px 0 #ffffff44)", fontFamily: IISU_FONT },
  item: (s, d) => ({ color: d ? "var(--iisu-menu-dim, #ffffff55)" : "var(--iisu-menu-ink, #fff)", fontSize: 21, fontWeight: 800, padding: "12px 22px", margin: "3px 0", borderRadius: 16, background: s ? "var(--iisu-menu-sel, linear-gradient(180deg,#ffffff38,#ffffff1a))" : "none", boxShadow: s ? `0 0 0 3px ${RING}` : "none" }),
  title: { color: "var(--iisu-menu-title, #ffffffaa)", fontSize: 15, fontWeight: 800, padding: "6px 22px 10px" },
};

const ring = (c: string, base = "") => (on: boolean): CSSProperties => (on ? { boxShadow: `0 0 0 4px ${c}, 0 0 22px ${c}88${base ? `, ${base}` : ""}`, transform: "scale(1.04)" } : base ? { boxShadow: base } : {});
export function iisuStore(s: Settings) {
  const [ringC, fill, deep] = iisuAccent(s);
  if (iisuScheme(s) === "light")
    return {
      title: "Store",
      sale: "#ff8fb8",
      layout: "grid" as const,
      bg: IISU_LIGHT_BG,
      panel: "#ffffff",
      text: "#3a3d4a",
      sub: "#6c7182",
      accent: `linear-gradient(90deg, color-mix(in srgb, ${fill} 75%, #3ee0f0), color-mix(in srgb, ${fill} 70%, #b49cff))`,
      accentText: "#ffffff",
      radius: 18,
      font: IISU_FONT,
      ring: ring(ringC, "0 4px 14px #0000001a"),
    };
  return {
    title: "Store",
    sale: fill,
    layout: "grid" as const,
    // the tinted glow sits on an opaque base, so the home does not show through the pages
    bg: `radial-gradient(ellipse at 30% 0%, ${fill}55 0%, ${deep} 55%, #0b0a12 100%), ${deep}`,
    panel: "#ffffff1c",
    text: "#fff",
    sub: "#ffffffb0",
    accent: ringC,
    accentText: "#16122a",
    radius: 18,
    font: IISU_FONT,
    ring: ring(ringC),
  };
}

// ───────────── the shared pages (src/destinations.tsx) ─────────────
const D = `.dht-destination[data-theme=iisu]`;
const lib = (tail: string) => `${D}:is([data-place=library],[data-place=search]) .dht-page-list${tail}`;
/** A white (light) or glass (dark) pill: the top-bar pills of the home. */
const PILL = "background:var(--iisu-pill)!important;border:1.5px solid var(--iisu-edge)!important;box-shadow:var(--iisu-pill-shadow)!important;color:var(--iisu-ink)!important;border-radius:999px!important";
/** The selected pill: the theme colour (light: with a white edge, as iiSU's sky pills). */
const ACTIVE = "background:var(--iisu-active)!important;color:var(--iisu-active-ink)!important;border-color:var(--iisu-active-edge)!important;box-shadow:0 0 0 3px var(--iisu-active-edge),0 6px 16px #00000026!important;outline:none!important";
export const IISU_PAGE_LOOKS = [
  `${D} .dht-page-frame{font-family:${IISU_FONT}!important;color:var(--iisu-ink)!important}`,
  // header: the Back pill at the left, the title in the centre pill (as the home's title pill)
  `${D} .dht-page-header{position:relative;justify-content:center;min-height:56px}`,
  `${D} .dht-page-back{position:absolute;left:0;top:50%;transform:translateY(-50%);${PILL};font-weight:800!important;font-size:19px!important;padding:0 22px!important;min-height:46px!important}`,
  `${D} .dht-page-title{${PILL};padding:6px 32px;font-size:28px!important;font-weight:900!important;max-width:58%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
  // tabs: pills in a centred row; the open one filled with the theme colour
  `${D} .dht-page-tabs{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}`,
  `${D} .dht-page-tabs button{${PILL};font-family:inherit;font-weight:800;font-size:18px;padding:8px 22px;cursor:pointer;transform:none!important}`,
  `${D} .dht-page-tabs button[aria-current=page]{${ACTIVE}}`,
  `${D} .dht-page-subtitle{color:var(--iisu-sub)!important;font-weight:700;text-align:center}`,
  `${D} .dht-page-list>p{color:var(--iisu-sub);font-weight:700;text-align:center;margin-top:40px}`,
  // rows: rounded cards (white on soft shadows / glass), the focused one in the ring
  `${D} .dht-page-list{padding:12px!important}`,
  `${D} .dht-page-list .dht-destination-row{border-radius:20px!important;background:var(--iisu-card)!important;border:1.5px solid var(--iisu-edge)!important;box-shadow:var(--iisu-card-shadow)!important;color:var(--iisu-ink)!important;outline:none!important;margin-bottom:12px!important;font-weight:800!important}`,
  `${D} .dht-page-list .dht-destination-row[data-selected=true]{background:var(--iisu-card-on)!important;box-shadow:0 0 0 4px var(--iisu-ring),0 8px 22px #00000026!important;outline:none!important;color:var(--iisu-ink)!important}`,
  `${D} .dht-row-sub{color:var(--iisu-sub);font-weight:700}`,
  `${D} .dht-row-icon{flex:none;display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:var(--iisu-chip);color:var(--dht-iisu-accent-fill,#4aa6ee)}`,
  `${D}[data-scheme=dark] .dht-row-icon{color:#fff}`,
  `${D} .dht-row-icon>img,${D} .dht-row-icon>div{border-radius:12px!important}`,
  `${D} .dht-row-progress{background:var(--iisu-track)!important;border-radius:999px!important}`,
  `${D} .dht-row-progress>i{background:linear-gradient(90deg,var(--iisu-ring),var(--dht-iisu-accent-fill,#4aa6ee))!important;border-radius:999px}`,
  // footer: the button hints in a pill at the bottom left (as the home's hints)
  `${D} .dht-page-footer{align-self:flex-start;${PILL};padding:6px 20px;font-weight:800;font-size:16px!important}`,
  // the search field and the game's cover (white edge and shadow, as iiSU's covers)
  `${D} .dht-page-frame input{${PILL};font-family:inherit;font-weight:700;font-size:20px!important;padding:10px 24px!important;outline:none}`,
  `${D} .dht-page-body>img,${D} .dht-page-body>div:not(.dht-page-list){border:5px solid var(--iisu-tile-edge);border-radius:20px!important;box-shadow:0 10px 26px #00000033;box-sizing:border-box}`,
  // library / search: iiSU's rounded square icons six across; the focused one in the ring, its name in a pill under it
  `${lib("")}{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:22px 18px;align-content:start;grid-auto-rows:max-content;padding:14px 14px 30px!important}`,
  `${lib(" .dht-destination-row")}{position:relative;display:block!important;min-height:0!important;min-width:0;margin:0!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;overflow:visible}`,
  `${lib(" .dht-row-icon")}{display:block;width:100%;height:auto;border-radius:20px;background:none}`,
  `${lib(" .dht-row-icon>*")}{width:100%!important;height:auto!important;aspect-ratio:1/1;object-fit:cover;display:block;border-radius:20px!important;border:4px solid var(--iisu-tile-edge);box-shadow:0 3px 10px #00000030;box-sizing:border-box}`,
  `${lib(" .dht-row-text")}{display:block;margin-top:8px;text-align:center}`,
  `${lib(" .dht-row-label")}{font-size:15px!important;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--iisu-sub)}`,
  `${lib(" .dht-row-sub")}{display:none!important}`,
  `${lib(" .dht-destination-row[data-selected=true]")}{box-shadow:none!important;background:transparent!important;z-index:2}`,
  `${lib(" .dht-destination-row[data-selected=true] .dht-row-icon>*")}{box-shadow:0 0 0 4px var(--iisu-ring),0 10px 24px #00000040!important;transform:scale(1.05)}`,
  `${lib(" .dht-destination-row[data-selected=true] .dht-row-label")}{display:inline-block;max-width:100%;padding:2px 12px;border-radius:999px;background:var(--iisu-active);color:var(--iisu-active-ink)}`,
  // game details: the actions as pill buttons; Play in the theme colour
  `${D}[data-place=game] .dht-page-list .dht-destination-row{border-radius:999px!important;min-height:60px!important;padding:10px 26px!important}`,
  `${D}[data-place=game] .dht-page-list .dht-destination-row:first-child{background:var(--iisu-active)!important;color:var(--iisu-active-ink)!important;border-color:var(--iisu-active-edge)!important}`,
  `${D}[data-place=game] .dht-page-list .dht-destination-row:first-child .dht-row-icon{background:#ffffff40;color:#fff}`,
  `${D}[data-place=game] .dht-row-icon{width:42px;height:42px}`,
  // friends: cards with a round avatar in a white ring, the status in a chip (online ones in the theme colour)
  `${D} .dht-page-list[data-place=friends]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;align-content:start}`,
  `${D} .dht-page-list[data-place=friends] .dht-destination-row{flex-direction:column;justify-content:center;text-align:center!important;min-height:200px!important;margin:0!important;gap:12px!important;border-radius:26px!important}`,
  `${D} .dht-page-list[data-place=friends] .dht-row-icon{width:84px;height:84px;background:linear-gradient(135deg,var(--iisu-ring),var(--dht-iisu-accent-fill,#4aa6ee));color:#fff;box-shadow:0 0 0 4px var(--iisu-tile-edge),0 4px 12px #00000033}`,
  `${D} .dht-page-list[data-place=friends] .dht-destination-row[data-state=off] .dht-row-icon{filter:grayscale(1);opacity:.7}`,
  `${D} .dht-page-list[data-place=friends] .dht-row-sub{display:inline-block!important;margin-top:8px!important;padding:3px 14px;border-radius:999px;background:var(--iisu-chip);font-size:15px!important}`,
  `${D} .dht-page-list[data-place=friends] .dht-destination-row[data-state=on] .dht-row-sub{background:var(--iisu-active);color:var(--iisu-active-ink)}`,
  // achievements: earned ones gold, locked ones dimmed
  `${D} .dht-page-list[data-place=achievements] .dht-destination-row[data-state=on] .dht-row-icon{color:#e9a400;background:#ffe9a8;filter:drop-shadow(0 0 6px #ffd36b88)}`,
  `${D} .dht-page-list[data-place=achievements] .dht-destination-row[data-state=off]{opacity:.55}`,
  `${D} .dht-page-list::-webkit-scrollbar{width:8px}`,
  `${D} .dht-page-list::-webkit-scrollbar-thumb{background:var(--iisu-track);border-radius:4px}`,
].join("\n");

// ───────────── the store (src/storeView.tsx) ─────────────
const S = `.dht-store[data-dht-store-skin=iisu]`;
export const IISU_STORE_CSS = [
  `${S} .dht-store-title{${PILL};padding:4px 26px;font-weight:900!important}`,
  `${S} .dht-store-tab{border-radius:999px!important;font-weight:800!important}`,
  `${S} .dht-store-tab[data-selected=false]{background:var(--iisu-pill)!important;border:1.5px solid var(--iisu-edge);box-shadow:var(--iisu-pill-shadow);color:var(--iisu-ink)!important}`,
  `${S} .dht-store-tab[data-selected=true]{${ACTIVE}}`,
  `${S} .dht-store-prompt{${PILL};padding:4px 16px;font-weight:800}`,
  // tiles: white (light) / glass (dark) cards with the art inset, as iiSU's cards; the price at the right
  `${S} .dht-store-tile{background:var(--iisu-card);border:1.5px solid var(--iisu-edge);padding:6px;box-sizing:content-box;font-weight:800}`,
  `${S} .dht-store-tile>div:first-child{border-radius:14px!important}`,
  `${S} .dht-store-tile>div:not(:first-child){padding:0 6px}`,
  `${S} .dht-store-tile>div:last-child{text-align:right;padding-bottom:4px}`,
  `${S} .dht-store-tile[data-selected=true]{box-shadow:0 0 0 4px var(--iisu-ring),0 10px 24px #00000033!important}`,
  `${S} .dht-store-action{border-radius:999px!important;border:1.5px solid var(--iisu-edge)}`,
  `${S} .dht-store-action[data-selected=true]{${ACTIVE}}`,
  `${S} .dht-store-name{font-weight:900!important}`,
].join("\n");

// ───────────── music and captures (src/mediaCenter.tsx) ─────────────
const M = `.dht-media[data-theme=iisu]`;
export const IISU_MEDIA_CSS = [
  `${M},.dht-media-mini[data-theme=iisu]{font-weight:700}`,
  // header: the title pill in the centre with the tab pills beside it
  `${M} .dht-media-head{justify-content:center}`,
  `${M} .dht-media-title{${PILL};padding:5px 30px;font-size:26px;font-weight:900}`,
  `${M} .dht-media-tabs button{${PILL};font-weight:800}`,
  `${M} .dht-media-tabs button[aria-current=true]{${ACTIVE}}`,
  // panels: the home's big rounded panel; rows rounded, the focused one in the ring
  `${M} .dht-media-panel{background:var(--iisu-card);border:1.5px solid var(--iisu-edge);border-radius:28px;box-shadow:var(--iisu-card-shadow)}`,
  `${M} .dht-media-row{border-radius:18px;font-weight:800}`,
  `${M} .dht-media-row[data-on=true]{background:var(--iisu-card-on);color:var(--iisu-ink);box-shadow:inset 0 0 0 4px var(--iisu-ring)}`,
  `${M} .dht-media-row small{color:var(--iisu-sub)}`,
  `${M} .dht-media-cover{border-radius:14px;background:var(--iisu-chip);color:var(--dht-iisu-accent-fill,#4aa6ee)}`,
  `${M} .dht-media-bar{background:var(--iisu-track);height:8px;border-radius:999px}`,
  `${M} .dht-media-bar>div{background:linear-gradient(90deg,var(--iisu-ring),var(--dht-iisu-accent-fill,#4aa6ee))}`,
  // controls: round pills; Play in the theme colour
  `${M} .dht-media-ctl button{background:var(--iisu-pill);border:1.5px solid var(--iisu-edge);box-shadow:var(--iisu-pill-shadow);color:var(--iisu-ink)}`,
  `${M} .dht-media-ctl button[data-on=true],${M} .dht-media-ctl button.dht-media-big{background:var(--iisu-active);color:var(--iisu-active-ink);border-color:var(--iisu-active-edge)}`,
  // captures: iiSU's tiles with the white edge; the focused one in the ring
  `${M} .dht-media-tile{border-radius:20px;border:4px solid var(--iisu-tile-edge);box-shadow:0 3px 10px #00000030}`,
  `${M} .dht-media-tile[data-on=true]{outline:none!important;box-shadow:0 0 0 4px var(--iisu-ring),0 10px 24px #00000040!important}`,
  `${M} .dht-media-tile span{border-radius:999px;background:var(--iisu-pill);color:var(--iisu-ink);font-weight:800}`,
  // the button hints: a pill at the bottom left, as on the home
  `${M} .dht-media-hints{right:auto;bottom:14px;${PILL};padding:5px 20px;font-weight:800;gap:16px}`,
  `${M} .dht-media-info{background:linear-gradient(180deg,transparent,var(--iisu-card) 55%);color:var(--iisu-ink)}`,
  `.dht-media-mini[data-theme=iisu]{border-radius:22px;border:1.5px solid var(--iisu-edge);box-shadow:var(--iisu-pill-shadow)}`,
].join("\n");
