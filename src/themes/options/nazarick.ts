// nazarick's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  { key: "palette", label: "Aura colour", group: "Look", def: "ainz", choices: [{ id: "ainz", name: "Ainz violet" }, { id: "shalltear", name: "Shalltear crimson" }, { id: "demiurge", name: "Demiurge ember" }, { id: "cocytus", name: "Cocytus frost" }] },
  { key: "ornaments", label: "Ornaments", group: "Look", def: "full", choices: [{ id: "full", name: "Filigree and skulls" }, { id: "light", name: "Filigree only" }, { id: "plain", name: "Plain gold" }] },
  { key: "glow", label: "Focus glow", group: "Look", def: "aura", choices: [{ id: "aura", name: "Violet aura" }, { id: "gold", name: "Gold rim" }, { id: "both", name: "Aura and rim" }] },
  { key: "tabs", label: "Tab style", group: "Look", def: "underline", choices: [{ id: "underline", name: "Underline" }, { id: "plates", name: "Gilded plates" }, { id: "glow", name: "Glowing text" }] },
  { key: "shade", label: "Backdrop", group: "Backdrop", def: "standard", choices: [{ id: "standard", name: "Standard" }, { id: "shadowed", name: "Shadowed" }, { id: "clear", name: "Clear" }] },
  { key: "motes", label: "Floating motes", group: "Backdrop", def: "none", choices: [{ id: "none", name: "None" }, { id: "few", name: "Few" }, { id: "many", name: "Many" }] },
  { key: "quote", label: "Ainz quote", group: "Panels", def: "reality", choices: [{ id: "reality", name: "All of reality" }, { id: "eternal", name: "Eternal" }, { id: "none", name: "Hidden" }] },
  { key: "side", label: "Side panels", group: "Panels", def: "both", choices: [{ id: "both", name: "Both" }, { id: "game", name: "Selected game" }, { id: "terminal", name: "Terminal" }, { id: "none", name: "Hidden" }] },
  { key: "stats", label: "Game stats", group: "Panels", def: "all", choices: [{ id: "all", name: "All" }, { id: "times", name: "Play times" }, { id: "none", name: "Hidden" }] },
  { key: "caption", label: "Tile caption", group: "Panels", def: "playtime", choices: [{ id: "playtime", name: "Play time" }, { id: "last", name: "Last played" }, { id: "name", name: "Name" }, { id: "none", name: "None" }] },
];
