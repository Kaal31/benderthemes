// Switch's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "themeColor",
    label: "switchColorTheme",
    choices: [
      { id: "light", name: "switchBasicWhite" },
      { id: "dark", name: "switchBasicBlack" },
    ],
    def: "light",
  },
];
