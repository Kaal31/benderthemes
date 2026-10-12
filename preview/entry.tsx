import "./skinsetup";
import "./main";
import { updateSettings, getSettings, updateVita } from "../src/settings";
import { applyPreset, getPresets, currentPresetId } from "../src/presets";
import { lockVita } from "../src/themes/vitaLock";
import { closeMarketplace } from "../src/marketplaceState";
import { playBootIntro } from "../src/bootIntro";
import { openThemeSettings } from "../src/themeSettingsMenu";
Object.assign(window as any, { __t: { updateSettings, getSettings, updateVita, applyPreset, getPresets, currentPresetId, lockVita, closeMarketplace, playBootIntro, openThemeSettings } });
