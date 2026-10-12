// ps2's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "mainBackdrop",
    label: "Main menu backdrop",
    group: "Main menu",
    choices: [
      { id: "orbs", name: "Orbs" },
      { id: "both", name: "Orbs and towers" },
      { id: "towers", name: "Towers" },
    ],
    def: "orbs",
  },
  {
    key: "towers",
    label: "Tower count",
    group: "Main menu",
    choices: [
      { id: "few", name: "Few" },
      { id: "normal", name: "Normal" },
      { id: "many", name: "Many" },
      { id: "saves", name: "By saves" },
    ],
    def: "normal",
  },
  {
    key: "towerMotion",
    label: "Tower motion",
    group: "Main menu",
    choices: [
      { id: "still", name: "Still" },
      { id: "slow", name: "Slow turn" },
      { id: "fast", name: "Fast turn" },
    ],
    def: "slow",
  },
  {
    key: "fog",
    label: "Fog",
    group: "Main menu",
    choices: [
      { id: "clear", name: "Clear" },
      { id: "light", name: "Light" },
      { id: "heavy", name: "Heavy" },
    ],
    def: "light",
  },
  {
    key: "browserColor",
    label: "Browser colour",
    group: "Browser",
    choices: [
      { id: "grey", name: "Grey" },
      { id: "time", name: "Time of day" },
    ],
    def: "grey",
  },
  {
    key: "iconMotion",
    label: "Save icon motion",
    group: "Browser",
    choices: [
      { id: "sway", name: "All move" },
      { id: "selected", name: "Selected only" },
      { id: "still", name: "Still" },
    ],
    def: "sway",
  },
  {
    key: "boxArt",
    label: "Box art shape",
    group: "Browser",
    choices: [
      { id: "square", name: "Square icons" },
      { id: "portrait", name: "Steam portrait (2:3)" },
    ],
    def: "square",
  },
  {
    key: "columns",
    label: "Icons per row",
    group: "Browser",
    choices: [
      { id: 5, name: "5" },
      { id: 6, name: "6" },
      { id: 7, name: "7" },
    ],
    def: 6,
  },
  {
    key: "language",
    label: "Menu language",
    choices: [
      { id: "en", name: "English" },
      { id: "ja", name: "日本語" },
    ],
    def: "en",
  },
  {
    key: "scanlines",
    label: "TV scanlines",
    choices: [
      { id: true, name: "On" },
      { id: false, name: "Off" },
    ],
    def: true,
  },
];
