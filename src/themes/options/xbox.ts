// xbox's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  { key: "dash", label: "Dashboard", group: "Look", choices: [{ id: "2001", name: "2001 launch" }, { id: "2003", name: "2003 Xbox Live" }], def: "2001" },
  { key: "colour", label: "Colour", group: "Look", choices: [{ id: "green", name: "Green" }, { id: "blue", name: "Live blue" }], def: "green" },
  { key: "glow", label: "Orb glow", group: "Look", choices: [{ id: "soft", name: "Soft" }, { id: "normal", name: "Normal" }, { id: "bright", name: "Bright" }], def: "normal" },
  { key: "wall", label: "Background", group: "Look", choices: [{ id: "cells", name: "Cell wall" }, { id: "plain", name: "Plain" }], def: "cells" },
  { key: "disc", label: "Disc item", group: "Menu", choices: [{ id: "off", name: "Off" }, { id: "last", name: "Last game" }], def: "off" },
  { key: "lang", label: "Language", group: "Menu", choices: [{ id: "en", name: "English" }, { id: "de", name: "Deutsch" }, { id: "fr", name: "Français" }, { id: "es", name: "Español" }, { id: "it", name: "Italiano" }], def: "en" },
  { key: "rows", label: "List rows", group: "Menu", choices: [{ id: 5, name: "5" }, { id: 8, name: "8" }], def: 5 },
];
