import type { StyleOption } from "../../engine/themeStyles";

export const PLAYSTATION_SURFACE_OPTIONS: StyleOption[] = [
  { key: "artworkFade", label: "Artwork edge fade", group: "Background", choices: [{ id: "off", name: "Off · original theme" }, { id: "soft", name: "Soft fade" }, { id: "radial", name: "Radial fade" }], def: "off" },
  { key: "artworkOverlay", label: "Readability overlay strength", group: "Background", choices: [0, 25, 50, 75, 100].map(value => ({ id: value, name: value === 100 ? "100% · original theme" : `${value}%` })), def: 100 },
  { key: "playGlass", label: "Glass Play panel", group: "Game hub", choices: [{ id: "off", name: "Off" }, { id: "light", name: "Light · 8px blur" }, { id: "strong", name: "Strong · 16px blur" }], def: "off" },
];
