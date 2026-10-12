// aero2's own options (see src/engine/themeStyles.ts). Modelled on Windows Vista / 7
// "Window Color and Appearance", the taskbar properties and the Sidebar.
import type { StyleOption } from "../../engine/themeStyles";

export const OPTIONS: StyleOption[] = [
  {
    key: "windowColor",
    label: "Window colour",
    group: "Window colour",
    choices: [
      { id: "sky", name: "Sky" },
      { id: "twilight", name: "Twilight" },
      { id: "sea", name: "Sea" },
      { id: "leaf", name: "Leaf" },
      { id: "lime", name: "Lime" },
      { id: "sun", name: "Sun" },
      { id: "pumpkin", name: "Pumpkin" },
      { id: "blush", name: "Blush" },
      { id: "violet", name: "Violet" },
      { id: "lavender", name: "Lavender" },
      { id: "taupe", name: "Taupe" },
      { id: "chocolate", name: "Chocolate" },
      { id: "slate", name: "Slate" },
      { id: "frost", name: "Frost" },
    ],
    def: "sky",
  },
  {
    key: "intensity",
    label: "Colour intensity",
    group: "Window colour",
    choices: [
      { id: "high", name: "High" },
      { id: "medium", name: "Medium" },
      { id: "low", name: "Low" },
    ],
    def: "high",
  },
  {
    key: "transparency",
    label: "Transparency",
    group: "Window colour",
    choices: [
      { id: "on", name: "On" },
      { id: "off", name: "Off" },
    ],
    def: "on",
  },
  {
    key: "scheme",
    label: "Colour scheme",
    group: "Window colour",
    choices: [
      { id: "aero", name: "Aero" },
      { id: "basic", name: "Basic" },
    ],
    def: "aero",
  },
  {
    key: "orb",
    label: "Start orb",
    group: "Taskbar",
    choices: [
      { id: "7", name: "Windows 7" },
      { id: "vista", name: "Vista" },
    ],
    def: "7",
  },
  {
    key: "taskbarIcons",
    label: "Taskbar icons",
    group: "Taskbar",
    choices: [
      { id: "large", name: "Large" },
      { id: "small", name: "Small" },
    ],
    def: "large",
  },
  {
    key: "batteryPercent",
    label: "Battery percent",
    group: "Taskbar",
    choices: [
      { id: "show", name: "Show" },
      { id: "hide", name: "Hide" },
    ],
    def: "show",
  },
  {
    key: "gadgets",
    label: "Gadgets",
    choices: [
      { id: "on", name: "On" },
      { id: "off", name: "Off" },
    ],
    def: "on",
  },
  {
    key: "windowAnim",
    label: "Window animation",
    choices: [
      { id: "none", name: "None" },
      { id: "zoom", name: "Zoom" },
      { id: "fade", name: "Fade" },
    ],
    def: "none",
  },
  {
    key: "highlight",
    label: "Selection",
    choices: [
      { id: "glow", name: "Lime glow" },
      { id: "explorer", name: "Explorer blue" },
    ],
    def: "glow",
  },
];
