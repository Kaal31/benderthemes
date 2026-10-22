import { callable, toaster } from "@decky/api";
import { getSettings, ThemeId, updateSettings } from "./settings";
import { resourcesChanged } from "./marketplaceState";
import { refreshPresets } from "./presets";
import {invalidateThemeResources} from "./themeResources";
const remove = callable<[ident: string], { success: boolean; error?: string }>("theme_remove");
export async function deleteTheme(theme: ThemeId, packId: string = theme, dataTheme?: string) {
  // removes the downloaded pack (a built-in theme's extras too); a theme with nothing downloaded removes nothing and succeeds
  const result = await remove(packId);
  if (!result.success) throw new Error(result.error || "Could not delete theme");
  invalidateThemeResources(dataTheme??theme);
  const settings = getSettings();
  updateSettings({ hiddenThemes: dataTheme ? settings.hiddenThemes : [...new Set([...(settings.hiddenThemes || []), theme])], ...((dataTheme ? settings.activeTheme === dataTheme : (!settings.activeTheme || settings.activeTheme === theme) && settings.theme === theme) ? { enabled: false } : {}) });
  await refreshPresets();
  resourcesChanged();
}
export function deleteCurrentTheme() {
  void deleteTheme(getSettings().theme).catch(error => toaster.toast({ title: "Could not delete theme", body: String(error) }));
}
