import { callable, toaster } from "@decky/api";
import { resourcesChanged } from "./marketplaceState";
import { refreshPresets } from "./presets";

interface Ps4ImportResult {
  success: boolean;
  imported?: string[];
  existing?: string[];
  errors?: string[];
  error?: string;
}
const importDownloads = callable<[], Ps4ImportResult>("import_ps4_downloads");
let importing = false;

export async function importPs4Downloads() {
  if (importing) return;
  importing = true;
  toaster.toast({ title: "Importing PS4 themes", body: "Checking Downloads for theme folders, ZIPs and RARs…" });
  try {
    const result = await importDownloads();
    if (!result.success) throw new Error(result.error ?? "Import failed");
    resourcesChanged();
    await refreshPresets();
    const imported = result.imported?.length ?? 0;
    const existing = result.existing?.length ?? 0;
    toaster.toast({ title: "PS4 import complete", body: `${imported} imported, ${existing} already installed.${result.errors?.length ? ` ${result.errors.slice(0, 3).join("; ")}` : imported || existing ? " Select a theme in Presets." : " No PS4 theme folders, ZIPs or RARs found in Downloads."}` });
  } catch (error) {
    toaster.toast({ title: "Could not import PS4 themes", body: String(error) });
  } finally {
    importing = false;
  }
}
