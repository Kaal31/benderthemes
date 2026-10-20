import { callable, openFilePicker, toaster } from "@decky/api";
import { refreshPacks } from "./steam";

const folders = callable<[], { downloads: string; music: string }>("local_music_folders");
const importMusic = callable<[path: string], { ok: boolean; folder?: string; error?: string }>("import_local_music");
export async function chooseLocalMusic(location: "downloads" | "music"): Promise<string | null> {
  try {
    const paths = await folders();
    const picked = await openFilePicker(0 as any, paths[location], true, true, undefined, ["mp3", "ogg", "oga", "opus", "wav", "flac", "m4a"]);
    if (!picked?.realpath) return null;
    const result = await importMusic(picked.realpath);
    if (!result.ok || !result.folder) throw new Error(result.error || "Could not import music");
    await refreshPacks();
    return result.folder;
  } catch (error) {
    // Decky's picker rejects when cancelled on some versions.
    if (!/cancel/i.test(String(error))) toaster.toast({ title: "Could not select music", body: String(error) });
    return null;
  }
}
