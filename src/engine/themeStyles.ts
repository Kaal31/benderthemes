// Each theme's own options: a short list per theme (src/themes/options/<theme>.ts)
// describing choices that stay true to that console. The values are saved per
// theme in settings.styles, so they follow the theme wherever it draws: the home,
// any page a preset gives it, Mix and match and saved presets.
import type { Settings, StyleValue, ThemeId } from "../settings";
import { getSettings, updateSettings } from "../settings";
import { OPTIONS as wii } from "../themes/options/wii";
import { OPTIONS as wiiu } from "../themes/options/wiiu";
import { OPTIONS as ps2 } from "../themes/options/ps2";
import { OPTIONS as ps5 } from "../themes/options/ps5";
import { OPTIONS as xbox } from "../themes/options/xbox";
import { OPTIONS as aero } from "../themes/options/aero";
import { OPTIONS as aero2 } from "../themes/options/aero2";
import { OPTIONS as pain } from "../themes/options/pain";
import { OPTIONS as nazarick } from "../themes/options/nazarick";
import { OPTIONS as ps1 } from "../themes/options/ps1";
import { OPTIONS as iisu } from "../themes/options/iisu";

export type StyleOption = {
  key: string;
  label: string;
  /** Sub-menu the option sits in, e.g. "Background". */
  group?: string;
  choices: { id: StyleValue; name: string }[];
  def: StyleValue;
};

export const THEME_STYLES: Partial<Record<ThemeId, StyleOption[]>> = { wii, wiiu, ps2, ps5, xbox, aero, aero2, pain, nazarick, ps1, iisu };

/** A theme's own option, or its default. */
export function style<T extends StyleValue>(s: Settings, theme: ThemeId, key: string): T {
  const own = s.styles?.[theme]?.[key];
  const opt = THEME_STYLES[theme]?.find((o) => o.key === key);
  if (own !== undefined && (!opt || opt.choices.some((c) => c.id === own))) return own as T;
  return (opt?.def ?? own) as T;
}
/** Shorthand for a theme's component: `const st = styleOf(s, "ps5"); st("background")`. */
export const styleOf = (s: Settings, theme: ThemeId) => <T extends StyleValue>(key: string) => style<T>(s, theme, key);

export function setStyle(theme: ThemeId, key: string, value: StyleValue | undefined) {
  updateSettings((p) => {
    const mine = { ...(p.styles?.[theme] ?? {}) };
    if (value === undefined) delete mine[key];
    else mine[key] = value;
    return { styles: { ...p.styles, [theme]: mine } };
  });
}
export const currentStyle = (theme: ThemeId, key: string) => style(getSettings(), theme, key);
