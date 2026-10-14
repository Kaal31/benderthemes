// Shared integration policies. Detection describes capabilities, not a promise
// that another plugin's React patches render inside our replacement pages.
import type { Game } from "./library";

export interface PluginSupport {
  id: string;
  name: string;
  mode: "shared" | "native" | "conflict" | "unknown";
  detail: string;
}
const policies: { match: RegExp; support: PluginSupport }[] = [
  { match: /^(CSS Loader|CSSLoader)$/i, support: { id: "css-loader", name: "CSS Loader", mode: "shared", detail: "Keyboard themes take priority; custom home uses dht-* style hooks." } },
  { match: /^(ProtonDB Badges|protondb-decky)$/i, support: { id: "protondb", name: "ProtonDB Badges", mode: "shared", detail: "Shared ProtonDB ratings and report actions; plugin badge settings remain on Steam's game page." } },
  { match: /^(SteamGridDB|steamgriddb)$/i, support: { id: "steamgriddb", name: "SteamGridDB", mode: "shared", detail: "Custom Steam artwork is read by all themes; edit artwork through Steam's game page." } },
  { match: /^(Audio Loader|AudioLoader)$/i, support: { id: "audio-loader", name: "AudioLoader", mode: "shared", detail: "Menu music pauses while ThemeHub music owns playback." } },
  { match: /^ThemeDeck$/i, support: { id: "themedeck", name: "ThemeDeck", mode: "shared", detail: "Shared focused-game playback and audio handoff." } },
  { match: /^(HLTB for Deck|HowLongToBeat|How Long to Beat)$/i, support: { id: "hltb", name: "HLTB", mode: "native", detail: "Open Steam's game page for the plugin's completion-time panel." } },
  { match: /^(DeckyXMB|Spindeck)$/i, support: { id: "home-replacement", name: "Home replacement", mode: "conflict", detail: "Only one plugin can own the home route." } },
];
export function pluginSupport(names: readonly string[]): PluginSupport[] {
  return [...new Set(names)].map(name => {
    const policy = policies.find(p => p.match.test(name));
    return policy ? { ...policy.support, name } : { id: name, name, mode: "unknown", detail: "No adapter verified. Native Steam pages remain available." };
  });
}

export interface PluginGameAction { id: string; label: string; run: () => void }
export type GameActionProvider = (game: Game) => readonly PluginGameAction[];
const providers = new Map<string, GameActionProvider>();
/** Explicit adapters contribute controller-accessible actions to every theme's game details. */
export function registerPluginGameActions(id: string, provider: GameActionProvider): () => void {
  if (providers.has(id)) throw new Error(`Plugin adapter already registered: ${id}`);
  providers.set(id, provider);
  return () => { if (providers.get(id) === provider) providers.delete(id); };
}
export function pluginGameActions(game: Game): PluginGameAction[] {
  const actions: PluginGameAction[] = [];
  for (const [id, provider] of providers) {
    try {
      const items = provider(game);
      for (const item of items) if (item.id && item.label && typeof item.run === "function") {
        actions.push({ ...item, id: `${id}:${item.id}` });
      }
    } catch { /* A failing adapter must not break game details. */ }
  }
  return actions;
}
