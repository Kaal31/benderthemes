import { callable, toaster } from "@decky/api";
import { getSettings, ThemeId, updateSettings } from "./settings";
import { resourcesChanged } from "./marketplaceState";
import { refreshPresets } from "./presets";
const remove = callable<[ident: string], { success: boolean; error?: string }>("theme_remove");
export async function deleteTheme(theme: ThemeId) {
  const result = await remove(theme);
  if (!result.success) throw new Error(result.error || "Could not delete theme");
  const settings = getSettings();
  updateSettings({ hiddenThemes: [...new Set([...(settings.hiddenThemes || []), theme])], ...(settings.theme === theme ? { enabled: false } : {}) });
  await refreshPresets();
  resourcesChanged();
}
export function deleteCurrentTheme() {
  void deleteTheme(getSettings().theme).catch(error => toaster.toast({ title: "Could not delete theme", body: String(error) }));
}
