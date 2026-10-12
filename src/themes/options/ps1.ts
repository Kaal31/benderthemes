// ps1's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "startScreen",
    label: "Start on",
    choices: [
      { id: "main", name: "Main menu" },
      { id: "card", name: "Memory card" },
    ],
    def: "main",
  },
  {
    key: "boot",
    label: "Start-up screens",
    choices: [
      { id: "show", name: "Show" },
      { id: "skip", name: "Skip" },
    ],
    def: "show",
  },
  {
    key: "background",
    label: "Menu colour",
    group: "Background",
    choices: [
      { id: "blue", name: "Midnight blue" },
      { id: "slate", name: "Slate grey" },
      { id: "black", name: "Black" },
      { id: "teal", name: "Teal" },
    ],
    def: "blue",
  },
  {
    key: "backgroundMotion",
    label: "Background light",
    group: "Background",
    choices: [
      { id: "drift", name: "Drifting" },
      { id: "still", name: "Still" },
    ],
    def: "drift",
  },
  {
    key: "cards",
    label: "Cards on screen",
    group: "Memory card",
    choices: [
      { id: 2, name: "Two (slot 1 and 2)" },
      { id: 1, name: "One" },
    ],
    def: 2,
  },
  {
    key: "iconLook",
    label: "Save icons",
    group: "Memory card",
    choices: [
      { id: "16", name: "16 × 16 pixels" },
      { id: "32", name: "32 × 32 pixels" },
      { id: "smooth", name: "Full game art" },
    ],
    def: "16",
  },
  {
    key: "iconMotion",
    label: "Icon animation",
    group: "Memory card",
    choices: [
      { id: "anim", name: "Animated" },
      { id: "selected", name: "Selected only" },
      { id: "still", name: "Still" },
    ],
    def: "anim",
  },
  {
    key: "colours",
    label: "Icon colours",
    group: "Memory card",
    choices: [
      { id: "15bit", name: "15-bit (console)" },
      { id: "full", name: "Full" },
    ],
    def: "15bit",
  },
  {
    key: "cdColour",
    label: "CD Player colour",
    group: "CD Player",
    choices: [
      { id: "blue", name: "Blue" },
      { id: "silver", name: "Silver" },
    ],
    def: "blue",
  },
  {
    key: "disc",
    label: "Disc",
    group: "CD Player",
    choices: [
      { id: "spin", name: "Spins while open" },
      { id: "still", name: "Still" },
    ],
    def: "spin",
  },
  {
    key: "clock",
    label: "Clock",
    choices: [
      { id: true, name: "Show" },
      { id: false, name: "Hide (like the console)" },
    ],
    def: true,
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
