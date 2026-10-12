// iisu's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "startTab",
    label: "Start on",
    choices: [
      { id: "home", name: "Home" },
      { id: "collections", name: "Collections" },
      { id: "achievements", name: "Achievements" },
      { id: "friends", name: "Friends" },
      { id: "apps", name: "Apps" },
    ],
    def: "home",
  },
  {
    key: "scheme",
    label: "Look",
    choices: [
      { id: "light", name: "Light (iiSU's default)" },
      { id: "dark", name: "Dark" },
    ],
    def: "light",
  },
  {
    key: "accent",
    label: "Theme colour",
    choices: [
      { id: "lavender", name: "Lavender" },
      { id: "sky", name: "Sky" },
      { id: "mint", name: "Mint" },
      { id: "peach", name: "Peach" },
      { id: "rose", name: "Rose" },
      { id: "mono", name: "Mono" },
    ],
    def: "sky",
  },
  {
    key: "browse",
    label: "Browsing style",
    group: "Library",
    choices: [
      { id: "pages", name: "Rows that scroll sideways" },
      { id: "grid", name: "Grid that scrolls down" },
      { id: "row", name: "Single row" },
    ],
    def: "pages",
  },
  {
    key: "rows",
    label: "Rows (sideways browsing)",
    group: "Library",
    choices: [
      { id: "auto", name: "Auto (3, 4 on a 4:3 screen)" },
      { id: 2, name: "2" },
      { id: 3, name: "3" },
      { id: 4, name: "4" },
    ],
    def: "auto",
  },
  {
    key: "columns",
    label: "Icons per row (grid)",
    group: "Library",
    choices: [
      { id: 6, name: "6" },
      { id: 8, name: "8" },
      { id: 10, name: "10" },
    ],
    def: 8,
  },
  {
    key: "jumpBack",
    label: "Jump back in card",
    group: "Library",
    choices: [
      { id: true, name: "Show" },
      { id: false, name: "Hide" },
    ],
    def: true,
  },
  {
    key: "featureCards",
    label: "Big icon and cards (Been a while, Your Favorites)",
    group: "Library",
    choices: [
      { id: true, name: "Show" },
      { id: false, name: "Hide" },
    ],
    def: true,
  },
  {
    key: "iconArt",
    label: "Icon art",
    group: "Library",
    choices: [
      { id: "cover", name: "Cover art" },
      { id: "header", name: "Header art" },
    ],
    def: "cover",
  },
  {
    key: "background",
    label: "Background",
    group: "Background",
    choices: [
      { id: "pattern", name: "Dots and shapes" },
      { id: "art", name: "Focused game art" },
      { id: "blur", name: "Blurred game art" },
      { id: "colour", name: "Theme colour" },
    ],
    def: "pattern",
  },
  {
    key: "glass",
    label: "Panel glass",
    group: "Background",
    choices: [
      { id: "light", name: "Frosted" },
      { id: "dark", name: "Solid" },
      { id: "clear", name: "None" },
    ],
    def: "light",
  },
  {
    key: "darkIcons",
    label: "Dock icons",
    group: "Bars",
    choices: [
      { id: false, name: "Colourful" },
      { id: true, name: "Dark mode" },
    ],
    def: false,
  },
  {
    key: "hints",
    label: "Button hints",
    group: "Bars",
    choices: [
      { id: true, name: "Show" },
      { id: false, name: "Hide" },
    ],
    def: true,
  },
  {
    key: "statusDate",
    label: "Date in status bar",
    group: "Bars",
    choices: [
      { id: true, name: "Show" },
      { id: false, name: "Hide" },
    ],
    def: true,
  },
];
