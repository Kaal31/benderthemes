import { OPTIONS as gameamp } from "../themes/options/gameamp";
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
import { OPTIONS as onyx } from "../themes/options/onyx";
import { OPTIONS as silver } from "../themes/options/silver";
import { OPTIONS as iisu } from "../themes/options/iisu";

export type StyleOption = {
  key: string;
  label: string;
  /** Sub-menu the option sits in, e.g. "Background". */
  group?: string;
  choices: { id: StyleValue; name: string }[];
  def: StyleValue;
};

export const THEME_STYLES: Partial<Record<ThemeId, StyleOption[]>> = { gameamp, onyx, silver, wii, wiiu, ps2, ps5, xbox, aero, aero2, pain, nazarick, ps1, iisu };

// Only layouts with game hero backgrounds expose this control. Cover tiles and
// console wallpapers keep their own sizing.
export const HERO_SCALING_THEMES: ThemeId[] = ["ps4", "ps5", "ps3", "psp", "vita"];
for (const theme of HERO_SCALING_THEMES) {
  THEME_STYLES[theme] = [...(THEME_STYLES[theme] ?? []), {
    key: "heroScaling", label: "Game artwork scaling", group: "Background",
    choices: [
      { id: "cover", name: "Fill screen" },
      { id: "contain", name: "Show full artwork" },
      { id: "blur", name: "Full artwork + blurred backdrop" },
    ],
    def: "cover",
  }];
}

THEME_STYLES.switch = [...(THEME_STYLES.switch ?? []), {
  key: "standardSkin", label: "Standard skin", group: "Appearance",
  choices: [{id:"white",name:"Basic White"},{id:"black",name:"Basic Black"}], def:"white",
}, {
  key: "consoleConversion", label: "Console theme conversion", group: "Theme file",
  choices: [{id:true,name:"Convert supported layout and animations"},{id:false,name:"Artwork only"}], def:true,
},{key:"firmwareLayout",label:"Switch firmware layout",group:"Theme file",choices:[{id:"auto",name:"Automatic - detect from theme"},{id:"classic",name:"Classic Home Menu - six applets"},{id:"modern",name:"Modern Home Menu - nine applets"}],def:"auto"},{key:"clockFormat",label:"Switch clock format",group:"Theme file",choices:[{id:"24",name:"24-hour"},{id:"12",name:"12-hour"}],def:"24"},{key:"firmwareColors",label:"Switch system colors",group:"Theme file",choices:[{id:"auto",name:"Automatic"},{id:"light",name:"Basic White"},{id:"dark",name:"Basic Black"}],def:"auto"}];

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
