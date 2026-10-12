// wii's own options (see src/engine/themeStyles.ts).
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "grid",
    label: "Channels per page",
    group: "Channels",
    choices: [
      { id: 12, name: "12 (4 × 3)" },
      { id: 20, name: "20 (zoomed out)" },
    ],
    def: 12,
  },
  {
    key: "highlight",
    label: "Highlight",
    group: "Channels",
    choices: [
      { id: "pulse", name: "Pulsing" },
      { id: "steady", name: "Steady" },
    ],
    def: "pulse",
  },
  {
    key: "preview",
    label: "Channel preview",
    group: "Channels",
    choices: [
      { id: "still", name: "Still" },
      { id: "moving", name: "Moving on focus" },
    ],
    def: "still",
  },
  {
    key: "pointer",
    label: "Wii Remote pointer",
    group: "Channels",
    choices: [
      { id: "off", name: "Off" },
      { id: "on", name: "On" },
    ],
    def: "off",
  },
  {
    key: "menu",
    label: "System Menu",
    group: "Bottom bar",
    choices: [
      { id: "4", name: "4.0 and later (SD Card button)" },
      { id: "3", name: "Before 4.0" },
    ],
    def: "4",
  },
  {
    key: "board",
    label: "Message Board button",
    group: "Bottom bar",
    choices: [
      { id: "on", name: "Show" },
      { id: "off", name: "Hide" },
    ],
    def: "on",
  },
  {
    key: "colon",
    label: "Clock colon",
    group: "Bottom bar",
    choices: [
      { id: "steady", name: "Steady" },
      { id: "blink", name: "Blinking" },
    ],
    def: "blink",
  },
  {
    key: "burnIn",
    label: "Screen burn-in reduction",
    choices: [
      { id: "off", name: "Off" },
      { id: "on", name: "On (dim after 5 min)" },
    ],
    def: "off",
  },
];
