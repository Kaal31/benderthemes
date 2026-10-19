// Theme packs from the Hub's catalog (py_modules: theme_catalog / theme_install): shared by the Hub
// (Marketplace.tsx) and the themed store's Themes section (storeSections.tsx), so both download the same way.
import { callable, toaster } from "@decky/api";
import type { ThemePack } from "./Marketplace";
import { refreshPacks } from "./steam";
import { refreshPresets } from "./presets";

export type PackProgress = { busy: boolean; id: string; percent: number; message: string };
/** art: the Hub preview gallery (Kaal31/deckthemes-assets) by theme id, including the built-in themes that have no pack. */
export type ThemeArt = Record<string, { poster?: string; preview?: string }>;
export const themeCatalog = callable<[refresh: boolean], { themes: ThemePack[]; art?: ThemeArt; error?: string; progress: PackProgress }>("theme_catalog");
export const themeInstall = callable<[ident: string], { success: boolean; error?: string; audioWarning?:string }>("theme_install");
export const themeDownloadProgress = callable<[], PackProgress>("theme_download_progress");

/** Installed and up to date ("legacy" = installed before versions existed). */
export const packIsCurrent = (p: ThemePack) => p.installedVersion === "legacy" || (!!p.installedVersion && p.installedVersion === p.version);

/** Download the pack when it is missing or older than the catalog's, then reload the theme lists. Throws on failure. */
export async function ensurePackInstalled(p: ThemePack): Promise<void> {
  if (!packIsCurrent(p)) {
    const result = await themeInstall(p.id);
    if (!result.success) throw new Error(result.error || "Download failed");
    if(result.audioWarning)toaster.toast({title:"Theme installed · audio incomplete",body:result.audioWarning});
  }
  await Promise.all([refreshPacks(), refreshPresets()]);
}
