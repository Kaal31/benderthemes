// Switch's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "standardSkin",
    label: "switchColorTheme",
    group: "Appearance",
    choices: [
      { id: "white", name: "switchBasicWhite" },
      { id: "black", name: "switchBasicBlack" },
    ],
    def: "white",
  },
];
