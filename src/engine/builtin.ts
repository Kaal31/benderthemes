// The themes that come with the plugin, written in the same format as community
// themes. Their artwork comes from the Hub's resource packs, so their slots are
// empty: an empty slot means "the layout's own default".
// Ids match the preset ids the plugin used before the engine, so nothing a user
// had selected changes.
import type { ThemeManifest } from "./manifest";

const t = (id: string, name: string, company: ThemeManifest["company"], layout: ThemeManifest["layout"], layoutOptions?: ThemeManifest["layoutOptions"]): ThemeManifest => ({
  schema: 1,
  id,
  name,
  author: "ThemeHub",
  company,
  layout,
  ...(layoutOptions ? { layoutOptions } : {}),
});

export const BUILTIN_THEMES: ThemeManifest[] = [
  t("ios6", "iOS 6 Classic", "Community", "ios6"),
  t("gameamp", "GameAmp", "Bonus", "gameamp"),
  t("old-big-picture", "Old Big Picture", "Bonus", "old-big-picture"),
  t("onyx", "Onyx Wheel (bonus)", "Bonus", "onyx"),
  t("silver", "Silver Wheel (bonus)", "Bonus", "silver"),
  t("wii", "Wii", "Nintendo", "wii"),
  t("wiiu", "Wii U", "Nintendo", "wiiu"),
  t("switch", "Switch", "Nintendo", "switch"),
  t("n3ds", "Nintendo 3DS", "Nintendo", "n3ds"),
  t("vita", "PS Vita · Default", "Sony", "vita", { vitaLook: "" }),
  t("vita-look:sakura", "PS Vita · Sakura", "Sony", "vita", { vitaLook: "sakura" }),
  t("ps1", "PS1", "Sony", "ps1"),
  t("ps2", "PS2", "Sony", "ps2"),
  t("ps3", "PS3 · Original wave", "Sony", "ps3"),
  t("psp", "PSP", "Sony", "psp"),
  t("ps4", "PS4", "Sony", "ps4"),
  t("ps5", "PS5", "Sony", "ps5"),
  t("xbox", "Xbox", "Microsoft", "xbox"),
  t("x360:blades", "Xbox 360 · Blades (2005)", "Microsoft", "x360", { x360Style: "blades" }),
  t("x360:nxe", "Xbox 360 · NXE (2008)", "Microsoft", "x360", { x360Style: "nxe" }),
  t("x360:kinect", "Xbox 360 · Kinect (2010)", "Microsoft", "x360", { x360Style: "kinect" }),
  t("x360:metro", "Xbox 360 · Metro (2011)", "Microsoft", "x360", { x360Style: "metro" }),
  t("aero", "Aero (bonus)", "Bonus", "aero"),
  t("aero2", "Aero v.2 (bonus)", "Bonus", "aero2"),
  t("dial", "Alien Dial (bonus)", "Bonus", "dial"),
  t("castle", "Floating Castle (bonus)", "Bonus", "castle"),
  t("republic", "Galactic Republic (bonus)", "Bonus", "republic"),
  t("nazarick", "Nazarick (bonus)", "Bonus", "nazarick"),
  t("pain", "Six Paths (bonus)", "Bonus", "pain"),
  t("minecraft", "Block Worlds (bonus)", "Bonus", "minecraft"),
  t("iisu", "iiSU style (bonus)", "Bonus", "iisu"),
];
