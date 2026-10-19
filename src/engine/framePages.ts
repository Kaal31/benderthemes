// Explicit, bounded services for community pages. Frames cannot choose fetch URLs
// or arbitrary Steam methods; all data comes from the plugin's existing services.
import { Navigation } from "@decky/ui";
import { fetchNoCors } from "@decky/api";
import { readFriends } from "../activity";
import { Downloads, pauseDownload, resumeDownload } from "../downloads";
import { loadScreenshots, loadVideos, recordingPlan } from "../media";
import { loadStoreLists, loadStoreDetails, searchStore, fmtPrice } from "../store";
import { getSettings, updateSettings } from "../settings";
import type { HomeApi } from "../common";
import { loadMusic, musicPlayer } from "../musicPlayer";

function audioState() {
  const s = musicPlayer.state();
  return { albumId: s.album?.id ?? null, albumName: s.album?.name ?? "", artist: s.album?.artist ?? "", title: s.album?.tracks[s.index]?.title ?? "", index: s.index, playing: s.playing, time: s.time, duration: s.duration, shuffle: s.shuffle, repeat: s.repeat, error: s.error };
}

// Local media thumbnails live on the authenticated media server, outside the
// frame's CSP. Transfer bounded image bytes without widening the sandbox policy.
const imageCache = new Map<string, string>();
async function frameImage(url: string): Promise<string> {
  if (!url || !/^https?:/.test(url)) return "";
  if (imageCache.has(url)) return imageCache.get(url)!;
  try {
    const r = await fetchNoCors(url, { method: "GET" });
    if (!r.ok) return "";
    const type = r.headers.get("content-type")?.split(";")[0] ?? "";
    if (!["image/jpeg", "image/png", "image/webp"].includes(type)) return "";
    const buffer = await r.arrayBuffer();
    if (buffer.byteLength > 8 * 1024 * 1024) return "";
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    const data = `data:${type};base64,${btoa(binary)}`;
    if (imageCache.size >= 24) imageCache.delete(imageCache.keys().next().value!);
    imageCache.set(url, data); return data;
  } catch { return ""; }
}

export async function framePageRequest(op: string, args: any, api: HomeApi, downloads: Downloads) {
  switch (op) {
    case "videoSource": {
      const v = (await loadVideos()).find(v => v.id === args?.id);
      if (!v) throw Error("Video is no longer available");
      if (v.kind === "file") return { title: v.name, url: v.url };
      const plan = recordingPlan(v, true);
      if (!plan) throw Error("Recording is unavailable");
      return { title: v.name, sequence: plan.sequence, streams: plan.streams.map(s => ({ mime: s.mime, codecs: s.codecs, urls: s.urls, inits: [...(s.inits ?? [])] })) };
    }
    case "audioLibrary": {
      const albums = await loadMusic();
      return { albums: albums.slice(0, 200).map(a => ({ id: a.id, name: a.name, artist: a.artist, appid: a.appid, tracks: a.tracks.slice(0, 500).map(t => ({ id: t.id, title: t.title })) })), state: audioState() };
    }
    case "audio": {
      switch (args?.action) {
        case "state": break;
        case "play": {
          const album = (await loadMusic()).find(a => a.id === args.albumId);
          if (!album || !Number.isInteger(args.index) || args.index < 0 || args.index >= album.tracks.length) throw Error("Track is unavailable");
          musicPlayer.play(album, args.index); break;
        }
        case "toggle": musicPlayer.toggle(); break;
        case "next": musicPlayer.next(); break;
        case "prev": musicPlayer.prev(); break;
        case "shuffle": musicPlayer.setShuffle(!musicPlayer.state().shuffle); break;
        case "repeat": musicPlayer.cycleRepeat(); break;
        case "seek": {
          if (typeof args.time !== "number" || !Number.isFinite(args.time) || args.time < 0 || args.time > musicPlayer.state().duration) throw Error("Invalid seek position");
          musicPlayer.seekTo(args.time); break;
        }
        default: throw Error("Unsupported audio action");
      }
      return audioState();
    }
    case "friends": return { items: readFriends().slice(0, 250).map(f => ({ id: f.id, name: f.name, online: f.online, game: f.game, appid: f.appid })) };
    case "downloads": return { items: downloads.items.slice(0, 150) };
    case "download": {
      if (!downloads.byApp.has(args?.appid) || !["pause", "resume"].includes(args?.action)) throw Error("Download is no longer in the queue");
      if (args.action === "pause") pauseDownload(args.appid); else resumeDownload(args.appid);
      return { ok: true };
    }
    case "store": {
      const tab = args?.tab;
      if (!["featured", "specials", "top", "new", "soon", "search"].includes(tab)) throw Error("Unknown store section");
      const list = tab === "search" ? await searchStore(String(args?.query ?? "").slice(0, 120)) : (await loadStoreLists())[tab] ?? [];
      return { items: list.slice(0, 40).map(g => ({ ...g, priceText: g.free ? "Free to Play" : fmtPrice(g.price, g.currency) })) };
    }
    case "storeDetails": {
      if (!Number.isSafeInteger(args?.appid) || args.appid <= 0) throw Error("Invalid app");
      return await loadStoreDetails(args.appid);
    }
    case "checkout": {
      if (!Number.isSafeInteger(args?.appid) || args.appid <= 0) throw Error("Invalid app");
      Navigation.NavigateToSteamWeb(`https://store.steampowered.com/app/${args.appid}/`);
      return { ok: true };
    }
    case "media": {
      const [shots, videos] = await Promise.all([loadScreenshots(), loadVideos()]);
      const offset = Number.isSafeInteger(args?.offset) ? Math.max(0, Math.min(100000, args.offset)) : 0;
      return {
        shots: await Promise.all(shots.slice(offset, offset + 12).map(async s => ({ ...s, url: await frameImage(s.url) }))),
        videos: await Promise.all(videos.slice(offset, offset + 12).map(async v => ({ id: v.id, name: v.name, appid: v.appid, duration: v.duration, thumb: await frameImage(v.thumb), kind: v.kind }))),
        totalShots: shots.length, totalVideos: videos.length,
      };
    }
    case "video": {
      const v = (await loadVideos()).find(v => v.id === args?.id);
      if (!v) throw Error("Video is no longer available");
      api.playVideo(v); return { ok: true };
    }
    case "settings": {
      const key = args?.key;
      if (key !== undefined) {
        if (["sfxVolume", "musicVolume"].includes(key)) {
          if (!Number.isInteger(args?.value) || args.value < 0 || args.value > 100) throw Error("Invalid volume");
          updateSettings({ [key]: args.value });
        } else if (["animations", "clock24", "sounds", "tvMode"].includes(key) && typeof args?.value === "boolean") {
          updateSettings({ [key]: args.value });
        } else throw Error("Unsupported setting");
      }
      const s = getSettings(); return { animations: s.animations, clock24: s.clock24, sounds: s.sounds, tvMode: s.tvMode, sfxVolume: s.sfxVolume, musicVolume: s.musicVolume };
    }
    default: throw Error("Page service is unavailable. Update ThemeHub to use live pages.");
  }
}
