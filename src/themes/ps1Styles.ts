// PS1 looks shared outside the home: the options menu (MenuView variant "ps1")
// and the themed store's colours. The PS1 had no friends, trophies or store of
// its own, so its pages keep the recoloured list (no page look of their own).
import type { CSSProperties } from "react";

export const PS1_FONT = `var(--dht-font, "Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif)`;

/** The menu colour option: [top, middle, bottom] of the BIOS-style gradient. */
export const PS1_BACKS: Record<string, [string, string, string]> = {
  blue: ["#20315e", "#0c1636", "#03050f"],
  slate: ["#5a6474", "#2c323d", "#0e1014"],
  black: ["#15161a", "#060608", "#000"],
  teal: ["#1d5a66", "#0b2a33", "#020c10"],
};

/** A raised, bevelled BIOS button. */
export const ps1Bevel = (on: boolean, accent = "#8fd0ff"): CSSProperties => ({
  background: on ? "linear-gradient(180deg,#7e95c8 0%,#3f5794 48%,#2a3c6e 52%,#4a64a6 100%)" : "linear-gradient(180deg,#56627e 0%,#2d3650 48%,#222a40 52%,#323d5a 100%)",
  border: "2px solid",
  borderColor: on ? "#d6e6ff #26345c #1a2442 #c2d6ff" : "#8892aa #1a2032 #121726 #7a849c",
  boxShadow: on ? `0 0 0 2px ${accent}, 0 0 24px ${accent}99, inset 0 1px 0 #ffffff55` : "0 4px 0 #0008, inset 0 1px 0 #ffffff22",
  color: "#fff",
  fontFamily: PS1_FONT,
  fontWeight: 700,
  letterSpacing: 2,
  textShadow: "2px 2px 0 #000a",
});

export const PS1_MENU: { panel: CSSProperties; item: (sel: boolean, dis?: boolean) => CSSProperties; title?: CSSProperties } = {
  panel: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", minWidth: 440, padding: "14px 10px", background: "linear-gradient(180deg,#2b3a66f2,#0c1430f5)", border: "2px solid", borderColor: "#b9c8ee #141c34 #0d1326 #a3b4de", boxShadow: "0 0 0 2px #000, 0 20px 60px #000c", fontFamily: PS1_FONT },
  item: (s, d) => ({ color: d ? "#6b7594" : "#fff", fontSize: 21, fontWeight: 700, letterSpacing: 1, padding: "10px 24px", margin: "2px 0", textShadow: "2px 2px 0 #000a", background: s ? "linear-gradient(180deg,#6f86c0,#3a5190)" : "none", outline: s ? "2px solid #8fd0ff" : "none" }),
  title: { color: "#b8c8f0", fontSize: 17, fontWeight: 700, letterSpacing: 3, padding: "4px 24px 12px", textTransform: "uppercase" },
};

const ring = (c: string) => (on: boolean): CSSProperties => (on ? { boxShadow: `0 0 0 3px ${c}, 0 0 18px ${c}99`, transform: "scale(1.03)" } : {});
export const PS1_STORE = {
  title: "Store",
  sale: "#ffd84a",
  layout: "list" as const,
  bg: "linear-gradient(180deg,#20315e 0%,#0c1636 55%,#03050f 100%)",
  panel: "linear-gradient(180deg,#56627e,#2d3650)",
  text: "#fff",
  sub: "#b8c8f0",
  accent: "#8fd0ff",
  accentText: "#0b1430",
  radius: 4,
  upper: true,
  font: PS1_FONT,
  ring: ring("#8fd0ff"),
};
