// Theme packs from the Hub's catalog (py_modules: theme_catalog / theme_install): shared by the Hub
// (Marketplace.tsx) and the themed store's Themes section (storeSections.tsx), so both download the same way.
import { callable, toaster } from "@decky/api";
import type { ThemePack } from "./Marketplace";
import { refreshPacks } from "./steam";
import { refreshPresets } from "./presets";
import {invalidateThemeResources,prepareThemeResources} from "./themeResources";

export type PackProgress = { busy: boolean; id: string; percent: number; message: string };
/** art: the Hub preview gallery (Kaal31/deckthemes-assets) by theme id, including the built-in themes that have no pack. */
export type ThemeArt = Record<string, { poster?: string; preview?: string }>;
export const themeCatalog = callable<[refresh: boolean], { themes: ThemePack[]; art?: ThemeArt; error?: string; progress: PackProgress }>("theme_catalog");
export const themeInstall = callable<[ident: string], { success: boolean; error?: string; audioWarning?:string }>("theme_install");
const backendProgress = callable<[], PackProgress>("theme_download_progress");
let preparation:PackProgress|null=null;
let downloadingPack=false;
export async function themeDownloadProgress():Promise<PackProgress>{
 const current=preparation;
 if(!current)return backendProgress();
 if(!downloadingPack)return current;
 const progress=await backendProgress();
 return {...current,percent:Math.min(80,progress.percent*.8),message:progress.percent===100?"Preparing theme audio…":progress.message||"Downloading theme…"};
}

/** Installed and up to date ("legacy" = installed before versions existed). */
export const packIsCurrent = (p: ThemePack) => p.installedVersion === "legacy" || (!!p.installedVersion && p.installedVersion === p.version);

/** Download the pack when it is missing or older than the catalog's, then reload the theme lists. Throws on failure. */
export async function ensurePackInstalled(p: ThemePack): Promise<void> {
  preparation={busy:true,id:p.id,percent:0,message:"Preparing download…"};
  try{
    if (!packIsCurrent(p)) {
      invalidateThemeResources(p.frameTheme??p.theme??p.id);
      downloadingPack=true;
      const result = await themeInstall(p.id);
      downloadingPack=false;
      if (!result.success) throw new Error(result.error || "Download failed");
      if(result.audioWarning)toaster.toast({title:"Theme installed · audio incomplete",body:result.audioWarning});
    }
    const theme=p.frameTheme??p.theme;
    if(theme)await prepareThemeResources(theme,progress=>{preparation={busy:true,id:p.id,...progress};});
    preparation={busy:true,id:p.id,percent:99,message:"Updating theme lists…"};
    await Promise.all([refreshPacks(), refreshPresets()]);
  }finally{downloadingPack=false;preparation=null;}
}
