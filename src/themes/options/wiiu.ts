// wiiu's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "grid",
    label: "Icons per page",
    group: "Software grid",
    choices: [
      { id: 15, name: "15 (5 × 3)" },
      { id: 28, name: "28 (7 × 4)" },
    ],
    def: 15,
  },
  {
    key: "titleBubbles",
    label: "Game title bubbles",
    group: "Software grid",
    choices: [
      { id: "on", name: "Show" },
      { id: "off", name: "Hide" },
    ],
    def: "on",
  },
  {
    key: "profile",
    label: "User and Mii",
    group: "Software grid",
    choices: [
      { id: "on", name: "Show" },
      { id: "off", name: "Hide" },
    ],
    def: "on",
  },
  {
    key: "logo",
    label: "Wii U logo",
    group: "Software grid",
    choices: [
      { id: "on", name: "Show" },
      { id: "off", name: "Hide" },
    ],
    def: "on",
  },
  {
    key: "dock",
    label: "Dock buttons",
    group: "Software grid",
    choices: [
      { id: "auto", name: "Auto (as the theme file draws them)" },
      { id: "icons", name: "Console icons (stock menu)" },
      { id: "round", name: "Round white buttons" },
    ],
    def: "auto",
  },
  {
    key: "boot",
    label: "Startup logo",
    choices: [
      { id: "on", name: "Show" },
      { id: "off", name: "Skip" },
    ],
    def: "on",
  },
  {
    key: "posts",
    label: "Miiverse posts",
    group: "WaraWara Plaza",
    choices: [
      { id: "on", name: "On" },
      { id: "off", name: "Off" },
    ],
    def: "on",
  },
  {
    key: "postRate",
    label: "Post frequency",
    group: "WaraWara Plaza",
    choices: [
      { id: "calm", name: "Calm" },
      { id: "normal", name: "Normal" },
      { id: "busy", name: "Busy" },
    ],
    def: "calm",
  },
  {
    key: "drawings",
    label: "Screenshot posts",
    group: "WaraWara Plaza",
    choices: [
      { id: "on", name: "On" },
      { id: "off", name: "Off" },
    ],
    def: "on",
  },
  {
    key: "crowd",
    label: "Crowd size",
    group: "WaraWara Plaza",
    choices: [
      { id: "small", name: "Small" },
      { id: "normal", name: "Normal" },
      { id: "large", name: "Large" },
    ],
    def: "normal",
  },
  {
    key: "plazaArtwork",
    label: "Artwork",
    group: "WaraWara Plaza",
    choices: [
      { id: "square", name: "Square cover crops" },
      { id: "covers", name: "Full box covers" },
      { id: "landscape", name: "Fitted landscape" },
      { id: "logos", name: "Game logos / square icons" },
    ],
    def: "square",
  },
  {
    key: "iconGlass",
    label: "Icon edges",
    group: "WaraWara Plaza",
    choices: [
      { id: "clean", name: "Clean" },
      { id: "glass", name: "Frosted glass" },
    ],
    def: "clean",
  },
  {
    key: "notify",
    label: "Notifications",
    group: "Notifications and details",
    choices: [
      { id: "on", name: "Show" },
      { id: "off", name: "Hide" },
    ],
    def: "on",
  },
  {
    key: "detail",
    label: "Game details and achievements",
    group: "Notifications and details",
    choices: [
      { id: "on", name: "Show" },
      { id: "off", name: "Hide" },
    ],
    def: "on",
  },
];
