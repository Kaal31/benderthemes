import { ButtonItem, DropdownItem, Navigation, PanelSection, PanelSectionRow, SliderField, staticClasses, TextField, ToggleField } from "@decky/ui";
import { definePlugin, openFilePicker, routerHook } from "@decky/api";
import { importThemeZip, onThemesChanged, userThemes } from "./engine/registry";
import { useEffect, useRef, useState } from "react";
import { HomeSwitch, SafeBoundary, showThemedHomeAgain, ThemedHome } from "./Home";
import { loadLibrary } from "./library";
import { useDiag, logInfo, reportError } from "./diag";
const PLUGIN_VERSION = "__DHT_VERSION__";
import { Updates } from "./Updates";
import { retryHome, useHomeFailure } from "./compatibility";
import { restoreFooter } from "./steam";
import { openMarketplace } from "./marketplaceState";
import { initSettings, resetAllSettings, resetThemeSettings, SortMode, THEMES, ThemeId, updateSettings, useSettings, useSettingsLoaded, FOOTER_MODES } from "./settings";
import { refreshPacks, restoreHeader, soundDiag } from "./steam";
import { getUiDocument } from "./cssvars";
import { useOtherPlugins } from "./otherPlugins";
import { startKeyboardSkins } from "./keyboardSkins";
import { refreshThemeLists } from "./themeSettingsMenu";
import { deleteCurrentTheme } from "./themeActions";
import { applyPreset, getPresets, refreshPresets, usePresets, presetPickerState, PRESET_GROUPS } from "./presets";

const ROUTE = "/deck-home-themes";
const HOME_ROUTE = "/library/home";

const HomeIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="7" cy="8" r="4" />
    <circle cx="16.5" cy="7" r="3" opacity=".75" />
    <circle cx="13" cy="16" r="5" opacity=".9" />
  </svg>
);

function DeferredText({ label, initial, onCommit }: { label: string; initial: string; onCommit: (v: string) => void }) {
  const [v, setV] = useState(initial);
  const t = useRef<any>(null);
  useEffect(() => () => clearTimeout(t.current), []);
  return (
    <TextField
      label={label}
      value={v}
      onChange={(e: any) => {
        const nv = e.target.value;
        setV(nv);
        clearTimeout(t.current);
        t.current = setTimeout(() => onCommit(nv), 900);
      }}
      onBlur={() => onCommit(v)}
    />
  );
}

/** Community themes (docs/THEME-FORMAT.md): pick a theme .zip; the plugin checks it and copies it into its themes folder. */
function AddThemeRow() {
  const [msg, setMsg] = useState("");
  const [, setRev] = useState(0);
  useEffect(() => onThemesChanged(() => setRev((r) => r + 1)), []); // refused zips change after a Rescan
  const add = async () => {
    try {
      const picked = await openFilePicker(0 as any /* FileSelectionType.FILE */, "/home/deck/Downloads", true, true, undefined, ["zip"]);
      if (!picked?.realpath) return;
      setMsg("Checking…");
      const r = await importThemeZip(picked.realpath);
      if (r.ok) {
        await refreshPresets();
        const p = getPresets().find((x) => x.id === r.id);
        if (p) applyPreset(p);
        setMsg(`Added ${r.name || r.id}`);
      } else setMsg(`Not added: ${r.error ?? "unknown reason"}`);
    } catch {
      setMsg("");
    }
  };
  const refused = userThemes.errors;
  return (
    <PanelSectionRow>
      <ButtonItem layout="below" description={msg || `A community theme as a .zip (theme.json inside). Or copy a theme folder / .zip into ${userThemes.dir || "the plugin's themes folder"} and Rescan.${refused.length ? ` Refused: ${refused.map((e) => `${e.file} (${e.error})`).join("; ")}` : ""}`} onClick={() => void add()}>
        Add a theme from a file
      </ButtonItem>
    </PanelSectionRow>
  );
}

function Panel() {
  const failure = useHomeFailure();
  const s = useSettings();
  const loaded = useSettingsLoaded();
  const refresh = () => {
    refreshPacks();
    refreshPresets();
    refreshThemeLists();
  };
  useEffect(refresh, []);
  const presets = usePresets();
  const {company,selected:selectedPreset,options:presetOptions} = presetPickerState(s,presets);
  const th: ThemeId = s.theme;
  const themeName = THEMES.find((t) => t.id === th)?.name ?? th;

  return (
    <>
      <Updates />
      <PanelSection title="Themes"><PanelSectionRow><ButtonItem layout="below" description="Browse animated previews, download a theme and activate it." onClick={() => { openMarketplace(); Navigation.Navigate(ROUTE); Navigation.CloseSideMenus(); }}>Hub</ButtonItem></PanelSectionRow>
      <AddThemeRow />
      <PanelSectionRow><ToggleField label="Firmware update notifications" checked={s.firmwareNotifications !== false} onChange={value => updateSettings({ firmwareNotifications: value })} /></PanelSectionRow></PanelSection>
      {failure && <PanelSection title="Steam Home restored"><PanelSectionRow><ButtonItem layout="below" description={failure} onClick={retryHome}>Retry themed home</ButtonItem></PanelSectionRow></PanelSection>}
      <PanelSection>
        <PanelSectionRow>
          <ToggleField label="Themed home screen" description="Replace Steam's home with the console theme" checked={s.enabled} onChange={(v) => updateSettings({ enabled: v })} />
        </PanelSectionRow>
        <PanelSectionRow><DropdownItem label="Company" rgOptions={PRESET_GROUPS.filter(c=>(c!=="Community"&&c!=="My presets")||presets.some(p=>p.company===c)).map(data=>({data,label:data}))} selectedOption={company} onChange={o=>{if(PRESET_GROUPS.includes(o.data))updateSettings({presetCompany:o.data});}} /></PanelSectionRow>
        <PanelSectionRow><ToggleField label="TV mode" description="Safe screen margins and larger menu text" checked={s.tvMode} onChange={tvMode=>updateSettings({tvMode})}/></PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label="Preset"
            description={`Console theme + skin. On the home: hold L1 + ▲▼ to change console, L1 + ◀▶ for that console's looks and theme files; L2 / R2 step through all presets. ${themeName}'s own options (icons, theme file, brightness, wallpaper, sounds…): △ / Y on the home → Theme options.`}
            key={company}
            rgOptions={presetOptions}
            selectedOption={selectedPreset}
            onChange={(o) => {
              const p = presets.find((x) => x.id === o.data);
              if (p) applyPreset(p);
            }}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => {
              showThemedHomeAgain();
              Navigation.CloseSideMenus();
              // The standalone page works even if Steam's home can't be patched.
              setTimeout(() => Navigation.Navigate(ROUTE), 80);
            }}
          >
            Open themed home
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      {s.enabled && (
        <PanelSection>
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              description="Steam's Home button / Library → Home shows the theme"
              onClick={() => {
                showThemedHomeAgain();
                Navigation.CloseSideMenus();
                setTimeout(() => Navigation.Navigate(HOME_ROUTE), 80);
              }}
            >
              Go to Steam Home
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      )}

      <PanelSection title="Library · all themes">
        <PanelSectionRow>
          <DropdownItem
            label="Sort"
            rgOptions={[
              { data: "recent", label: "Recently played" },
              { data: "alpha", label: "A–Z" },
              { data: "playtime", label: "Most played" },
            ]}
            selectedOption={s.sort}
            onChange={(o) => updateSettings({ sort: o.data as SortMode })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label="Ⓐ on a game"
            rgOptions={[
              { data: "theme", label: "Like the console (LiveArea, Start…)" },
              { data: "launch", label: "Launch right away" },
              { data: "details", label: "Open Steam's game page" },
            ]}
            selectedOption={s.aAction}
            onChange={(o) => updateSettings({ aAction: o.data })}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Look · all themes">
        <PanelSectionRow>
          <ToggleField label="Themed store" description="Store entries open the Steam Store styled like this theme (off: Steam's own store)" checked={s.themedStore !== false} onChange={(v) => updateSettings({ themedStore: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="ProtonDB badges" description="Community rating on game details (needs internet)" checked={s.badges.protondb} onChange={(v) => updateSettings((p) => ({ badges: { ...p.badges, protondb: v } }))} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Steam Deck compatibility badges" checked={s.badges.deck} onChange={(v) => updateSettings((p) => ({ badges: { ...p.badges, deck: v } }))} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Hide Steam's top bar" description="While the themed home is on screen" checked={s.hideSteamHeader} onChange={(v) => updateSettings({ hideSteamHeader: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Themed keyboard" description="Off by default. Steam's on-screen keyboard looks like the active console's keyboard, in every theme (a CSS Loader keyboard theme or a Points Shop keyboard wins)" checked={s.keyboardSkin === true} onChange={(v) => updateSettings({ keyboardSkin: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem label="Steam's bottom bar" description="Steam Menu · Ⓐ Select · Ⓑ Back, while the themed home is on screen" rgOptions={FOOTER_MODES.map((f) => ({ data: f.id, label: f.name }))} selectedOption={s.footer} onChange={(o) => updateSettings({ footer: o.data })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Background animations" checked={s.animations} onChange={(v) => updateSettings({ animations: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="24-hour clock" checked={s.clock24} onChange={(v) => updateSettings({ clock24: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <DeferredText key={String(loaded)} label="Profile name (blank = Steam name)" initial={s.profileName} onCommit={(v) => updateSettings({ profileName: v })} />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Sound · all themes"><PanelSectionRow><ToggleField label="Background music" description="Master switch; keeps each theme's own music setting" checked={s.backgroundMusic!==false} onChange={v=>updateSettings({backgroundMusic:v})}/></PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Navigation sounds" checked={s.sounds} onChange={(v) => updateSettings({ sounds: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField label="Sound volume" min={0} max={100} step={5} value={s.sfxVolume} showValue onChange={(v) => updateSettings({ sfxVolume: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField label="Music volume" min={0} max={100} step={5} value={s.musicVolume} showValue onChange={(v) => updateSettings({ musicVolume: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" description="After adding sound packs, wallpapers or theme files" onClick={refresh}>
            Rescan packs, wallpapers and skins
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
      <ResetSection th={th} themeName={themeName} />
    </>
  );
}

/** Settings are kept across reboots, plugin updates and theme deletion; these put them back to defaults. */
function ResetSection({ th, themeName }: { th: ThemeId; themeName: string }) {
  const [armed, setArmed] = useState<"" | "theme" | "all" | "delete">("");
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(""), 5000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <PanelSection title="Reset and delete">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          description={`Look, options, icon size, sounds and theme-file tunings of ${themeName}. Your folders and chosen theme files stay.`}
          onClick={() => (armed === "theme" ? (resetThemeSettings(th), setArmed("")) : setArmed("theme"))}
        >
          {armed === "theme" ? "Press again to reset" : `Reset ${themeName} settings`}
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          description={`Removes ${themeName}'s downloaded resources and returns to Steam's home. Its settings are kept (Reset clears them).`}
          onClick={() => (armed === "delete" ? (deleteCurrentTheme(), setArmed("")) : setArmed("delete"))}
        >
          {armed === "delete" ? "Press again to delete" : `Delete ${themeName}`}
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          description="Every setting of every theme back to defaults (the current theme stays selected)."
          onClick={() => (armed === "all" ? (resetAllSettings(), setArmed("")) : setArmed("all"))}
        >
          {armed === "all" ? "Press again to reset everything" : "Reset all settings"}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

function Diagnostics() {
  const d = useDiag();
  const lib = loadLibrary(useSettings().source, "recent", 9999);
  const others = useOtherPlugins();
  const row = (k: string, v: string, bad?: boolean) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, padding: "2px 0" }}>
      <span style={{ color: "#8b929a" }}>{k}</span>
      <span style={{ color: bad ? "#ff8a80" : "#dcdedf", textAlign: "right", wordBreak: "break-word" }}>{v}</span>
    </div>
  );
  return (
    <PanelSection title="Diagnostics">
      <PanelSectionRow>
        <div>
          {row("Version", PLUGIN_VERSION)}
          {row("Settings (backend)", d.settingsBackend, d.settingsBackend !== "ok")}
          {row("Steam home patched", d.homePatchRenders ? `yes (${d.homePatchRenders}×)` : "not yet — open Steam's Home", !d.homePatchRenders)}
          {row("Themed home shown", d.themedMounts ? `${d.themedMounts}×` : "not yet", !d.themedMounts)}
          {row("Sound", soundDiag(useSettings().theme))}
          {row("Library", `${lib.games.length} games · ${lib.apps.length} apps · ${lib.collections.length} collections`, !lib.games.length)}
          {others.homes.length > 0 && row("Also replacing Home", `${others.homes.join(", ")}: only one home can show. Turn off its home option or this plugin.`, true)}
          {others.music.length > 0 && row("Other music", `${others.music.join(", ")} paused while theme music plays`)}
          {row("Last error", d.lastError || "none", !!d.lastError)}
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => {
  logInfo(`frontend loaded v${PLUGIN_VERSION}`);
  initSettings();
  refreshPacks();
  refreshPresets();
  let stopKeyboardSkins: (() => void) | null = null;
  try {
    stopKeyboardSkins = startKeyboardSkins();
  } catch (e) {
    reportError("keyboard skin", e);
  }
  routerHook.addRoute(
    ROUTE,
    () => (
      <SafeBoundary where="page" fallback={<div style={{ padding: 48, color: "#ccc" }}>ThemeHub: something went wrong. See Quick Access → Diagnostics.</div>}>
        <ThemedHome standalone />
      </SafeBoundary>
    ),
    { exact: true },
  );
  let patch: any = null;
  try {
    patch = routerHook.addPatch(HOME_ROUTE, (props: any) => {
      try {
        const original = props.children;
        if (original != null && original?.type !== HomeSwitch) props.children = <HomeSwitch original={original} />;
      } catch (e) {
        reportError("home patch", e);
      }
      return props;
    });
  } catch (e) {
    reportError("addPatch", e);
  }
  return {
    name: "ThemeHub",
    titleView: <div className={staticClasses.Title}>ThemeHub</div>,
    content: (
      <SafeBoundary fallback={<div style={{ padding: 16, color: "#ccc" }}>Settings failed to load.</div>}>
        <Panel />
        <Diagnostics />
      </SafeBoundary>
    ),
    icon: <HomeIcon />,
    onDismount() {
      routerHook.removeRoute(ROUTE);
      if (patch) routerHook.removePatch(HOME_ROUTE, patch);
      stopKeyboardSkins?.();
      try {
        restoreHeader(getUiDocument() ?? document);
        restoreFooter(getUiDocument() ?? document);
      } catch {
        /* ignore */
      }
    },
  };
});
