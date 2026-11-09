import type { MenuItem } from "./common";
import type { ThemeId } from "./settings";

export type SettingsCategory = "screen" | "games" | "audio" | "presets" | "manage" | "global";
/** Keep descriptors (especially live label/checked getters) intact. */
export function categorized(category: SettingsCategory, id: string, item: MenuItem): MenuItem {
  item.settingsCategory = category;
  item.settingsId = id;
  return item;
}
export const categoryOf = (item: MenuItem): SettingsCategory => item.settingsCategory ?? "screen";
const gameKeys: Partial<Record<ThemeId, string[]>> = {
  onyx:["carousel"], ps1:["cards","iconLook","iconMotion","colours"],
  ps2:["iconMotion","boxArt","columns"], ps5:["tileSize","tileLabel","activityCards","playtime"],
  xbox:["disc","rows"], wii:["grid","preview","pointer"],
  wiiu:["grid","titleBubbles","posts","postRate","drawings","crowd","plazaArtwork","iconGlass"],
  vita:["bubbleArtworkFit","bubbleArtworkScale"], nazarick:["caption"], pain:["density","rows"],
  iisu:["browse","rows","columns","jumpBack","featureCards","iconArt"],
};
export function styleCategory(theme: ThemeId, key: string): SettingsCategory {
  if (theme === "gameamp" && key === "visualizerMode") return "audio";
  if (theme === "switch" && key === "consoleConversion") return "manage";
  return gameKeys[theme]?.includes(key) ? "games" : "screen";
}
