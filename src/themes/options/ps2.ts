// ps2's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {key:'presentation',label:'PS2 presentation',group:'Startup',choices:[{id:'stock',name:'Stock BIOS'},{id:'filmstrip',name:'Filmstrip disc loader'}],def:'stock'},
  {
    key: "towers",
    label: "Tower count",
    group: "Startup",
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
    group: "Startup",
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
    group: "Startup",
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
      { id: "en", name: "English" },{ id: "ru", name: "Русский" },
      { id: "fr", name: "Français" },{ id: "es", name: "Español" },{ id: "de", name: "Deutsch" },{ id: "it", name: "Italiano" },{ id: "nl", name: "Nederlands" },{ id: "pt", name: "Português" },
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
