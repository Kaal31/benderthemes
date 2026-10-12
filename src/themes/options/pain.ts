// pain's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  { key: "palette", label: "Chakra colour", group: "Look", def: "rinnegan", choices: [{ id: "rinnegan", name: "Rinnegan purple" }, { id: "akatsuki", name: "Akatsuki red" }, { id: "chakra", name: "Chakra blue" }, { id: "sage", name: "Sage gold" }] },
  { key: "glow", label: "Focus glow", group: "Look", def: "halo", choices: [{ id: "halo", name: "Halo" }, { id: "ring", name: "Thin ring" }, { id: "bloom", name: "Bloom" }] },
  { key: "status", label: "Status bar", group: "Look", def: "full", choices: [{ id: "full", name: "Full" }, { id: "icons", name: "Icons only" }, { id: "clock", name: "Clock only" }] },
  { key: "rings", label: "Rings", group: "Rinnegan", def: "four", choices: [{ id: "four", name: "Four seals" }, { id: "six", name: "Six paths" }, { id: "bare", name: "Bare rings" }, { id: "none", name: "Hidden" }] },
  { key: "ringMotion", label: "Ring light", group: "Rinnegan", def: "orbit", choices: [{ id: "orbit", name: "Orbit" }, { id: "pulse", name: "Pulse" }, { id: "still", name: "Still" }] },
  { key: "path", label: "Path", group: "Rinnegan", def: "deva", choices: [{ id: "deva", name: "Deva" }, { id: "asura", name: "Asura" }, { id: "human", name: "Human" }, { id: "animal", name: "Animal" }, { id: "preta", name: "Preta" }, { id: "naraka", name: "Naraka" }] },
  { key: "quote", label: "Quote", group: "Rinnegan", def: "world", choices: [{ id: "world", name: "One world" }, { id: "know", name: "Know pain" }, { id: "peace", name: "True peace" }, { id: "none", name: "Hidden" }] },
  { key: "density", label: "Row size", group: "Layout", def: "standard", choices: [{ id: "roomy", name: "Roomy" }, { id: "standard", name: "Standard" }, { id: "dense", name: "Dense" }] },
  { key: "rows", label: "Rows", group: "Layout", def: "both", choices: [{ id: "both", name: "Recent and installed" }, { id: "recent", name: "Recent only" }, { id: "installed", name: "Installed only" }] },
];
