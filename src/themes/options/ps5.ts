// ps5's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "startTab",
    label: "Start on",
    choices: [
      { id: "games", name: "Games" },
      { id: "media", name: "Media" },
    ],
    def: "games",
  },
  {
    key: "hubBackground",
    label: "Game hub background",
    group: "Background",
    choices: [
      { id: "hero", name: "Game art" },
      { id: "blur", name: "Blurred art" },
      { id: "solid", name: "Wallpaper colour" },
    ],
    def: "hero",
  },
  {
    key: "wallpaper",
    label: "Wallpaper colour",
    group: "Background",
    choices: [
      { id: "dark", name: "Dark" },
      { id: "black", name: "Black" },
      { id: "blue", name: "Deep blue" },
      { id: "purple", name: "Purple" },
      { id: "light", name: "Light" },
    ],
    def: "dark",
  },
  {
    key: "transition",
    label: "Art transition",
    group: "Background",
    choices: [
      { id: "zoom", name: "Fade and zoom" },
      { id: "fade", name: "Fade" },
      { id: "cut", name: "Cut" },
    ],
    def: "zoom",
  },
  {
    key: "tileSize",
    label: "Tile size",
    group: "Tiles",
    choices: [
      { id: "small", name: "Small" },
      { id: "normal", name: "Normal" },
      { id: "large", name: "Large" },
    ],
    def: "normal",
  },
  {
    key: "tileLabel",
    label: "Focused tile name",
    group: "Tiles",
    choices: [
      { id: "beside", name: "Beside" },
      { id: "below", name: "Below" },
      { id: "hidden", name: "Hidden" },
    ],
    def: "beside",
  },
  {
    key: "activityCards",
    label: "Activity cards",
    group: "Game hub",
    choices: [
      { id: true, name: "Show" },
      { id: false, name: "Hide" },
    ],
    def: true,
  },
  {
    key: "playtime",
    label: "Play time by Play",
    group: "Game hub",
    choices: [
      { id: true, name: "Show" },
      { id: false, name: "Hide" },
    ],
    def: true,
  },
  {
    key: "topBar",
    label: "Top right",
    group: "Game hub",
    choices: [
      { id: "full", name: "Icons and clock" },
      { id: "clock", name: "Clock only" },
    ],
    def: "full",
  },
];
