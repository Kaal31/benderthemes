import { startThemeScreensavers, useScreensaverStatus } from "./themeScreensavers";
import { startAchievementPopups } from "./achievementPopups";
import {stopSilverPad} from "./themes/silverPad";
import { ButtonItem, DropdownItem, Navigation, PanelSection, PanelSectionRow, SliderField, staticClasses, TextField, ToggleField } from "@decky/ui";
import { definePlugin, openFilePicker, routerHook } from "@decky/api";
import { importThemeZip, onThemesChanged, userThemes } from "./engine/registry";
import { useEffect, useRef, useState } from "react";
import { HomeSwitch, SafeBoundary, showNativeSteamHome, showThemedHomeAgain, ThemedHome } from "./Home";
import { loadLibrary } from "./library";
import { useDiag, logInfo, reportError } from "./diag";
const PLUGIN_VERSION = "__DHT_VERSION__";
import { retryHome, useHomeFailure } from "./compatibility";
import { restoreFooter } from "./steam";
import { openMarketplace } from "./marketplaceState";
import { initSettings, resetAllSettings, resetThemeSettings, SortMode, THEMES, ThemeId, updateSettings, useSettings, useSettingsLoaded, FOOTER_MODES } from "./settings";
import { refreshPacks, restoreHeader, soundDiag } from "./steam";
import { getUiDocument } from "./cssvars";
import { useOtherPlugins } from "./otherPlugins";
import { startKeyboardSkins } from "./keyboardSkins";
import { startExperimentalDiagnostics } from "./experimentalDiagnostics";
import { refreshThemeLists } from "./themeSettingsMenu";
import { deleteCurrentTheme } from "./themeActions";
import { applyPreset, currentLook, currentPresetId, deleteUserPreset, getPresets, isDownloaded, refreshPresets, renamePreset, saveUserPreset, usePresets, PRESET_GROUPS } from "./presets";
import { customizeControls } from "./customize";
import { useLocalization } from "./i18n";

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
  const lang = useLocalization();
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
  const [advanced, setAdvanced] = useState(false);
  const th: ThemeId = s.theme;
  const themeName = THEMES.find((t) => t.id === th)?.name ?? th;
  const look = currentLook(s);
  const current = currentPresetId(s);
  const preset = presets.find((p) => p.id === current);
  const mine = presets.filter((p) => p.look === look);
  // Look: every downloaded look (and the one in use), grouped by company (its own presets are under Preset)
  const looks = PRESET_GROUPS.map((company) => ({ label: company, options: presets.filter((p) => p.company === company && p.origin === "default" && (isDownloaded(p.theme) || p.look === look)).map((p) => ({ data: p.look, label: p.label })) })).filter((g) => g.options.length);
  // Customize: the slots this look draws, each with every installed asset grouped by source
  const controls = s.enabled ? customizeControls() : [];

  return (
    <>
      <PanelSection title="Screensavers">
        <PanelSectionRow><ScreensaverStatus /></PanelSectionRow>
        <PanelSectionRow><ToggleField label="Disable screensavers" description="Disable all Steam screensavers while ThemeHub is loaded. Overrides every theme’s screensaver." checked={s.screensaversDisabled===true} onChange={screensaversDisabled=>updateSettings({screensaversDisabled})}/></PanelSectionRow>
      </PanelSection>
      <PanelSection title={lang("qamThemes")}>
        <PanelSectionRow><ButtonItem layout="below" description={lang("qamHubDesc")} onClick={() => { openMarketplace(); Navigation.Navigate(ROUTE); Navigation.CloseSideMenus(); }}>{lang("qamHub")}</ButtonItem></PanelSectionRow>
        <AddThemeRow />
        <PanelSectionRow>
          <ToggleField label={lang("qamThemedHome")} description={lang("qamThemedHomeDesc")} checked={s.enabled} onChange={(v) => updateSettings({ enabled: v })} />
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
      {failure && <PanelSection title={lang("qamHomeRestored")}><PanelSectionRow><ButtonItem layout="below" description={failure} onClick={retryHome}>{lang("qamRetryHome")}</ButtonItem></PanelSectionRow></PanelSection>}

      <PanelSection title={lang("qamPresets")}>
        <PanelSectionRow>
          <DropdownItem label={lang("qamLook")} rgOptions={looks} selectedOption={look} onChange={(o) => { const p = presets.find((x) => x.id === o.data); if (p) applyPreset(p); }} />
        </PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label={lang("qamPreset")}
            description={`${themeName}'s presets: its own look, its imported theme files and the ones you saved. Changes are kept in the preset in use. On the home: hold L2 / R2 + ▲▼ to change console, L2 / R2 + ◀▶ for its presets; L2 / R2 previous / next theme; △ / Y → Presets.`}
            key={look}
            rgOptions={mine.map((p) => ({ data: p.id, label: p.label }))}
            selectedOption={current}
            onChange={(o) => { const p = presets.find((x) => x.id === o.data); if (p) applyPreset(p); }}
          />
        </PanelSectionRow>
        <PanelSectionRow><ButtonItem layout="below" onClick={() => void saveUserPreset()}>{lang("qamSaveNewPreset")}</ButtonItem></PanelSectionRow>
        <PanelSectionRow>
          <DeferredText key={`${current}|${preset?.label}`} label={lang("qamName")} initial={preset?.label ?? ""} onCommit={(v) => { if (v.trim() && v !== preset?.label) renamePreset(current, v); }} />
        </PanelSectionRow>
        {(preset?.origin === "saved" || preset?.user) && <PresetDeleteRow id={current} saved={preset?.origin === "saved"} name={preset?.label ?? ""} />}
      </PanelSection>

      {controls.length > 0 && (
        <PanelSection title={lang("qamCustomize")}>
          {controls.map((c) => (
            <PanelSectionRow key={c.id}>
              <DropdownItem
                label={c.label}
                rgOptions={[...c.special.map((o) => ({ data: o.id, label: o.name })), ...c.groups.map((g) => ({ label: g.source, options: g.items.map((i) => ({ data: i.ref, label: i.name })) }))]}
                selectedOption={c.get()}
                onChange={(o) => c.set(o.data)}
              />
            </PanelSectionRow>
          ))}
        </PanelSection>
      )}

      <PanelSection title={lang("qamAdvanced")}>
        <PanelSectionRow>
          <ToggleField label={lang("qamShowAdvanced")} description={lang("qamShowAdvancedDesc")} checked={advanced} onChange={setAdvanced} />
        </PanelSectionRow>
        {advanced && (
          <>
            {s.enabled && (
              <PanelSectionRow>
                <ButtonItem layout="below" description="Open the native Steam home screen" onClick={showNativeSteamHome}>
                  Go to Steam Home
                </ButtonItem>
              </PanelSectionRow>
            )}
            <PanelSectionRow><ToggleField label="Firmware update notifications" checked={s.firmwareNotifications !== false} onChange={(value) => updateSettings({ firmwareNotifications: value })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label="TV mode" description="Safe screen margins and larger menu text" checked={s.tvMode} onChange={(tvMode) => updateSettings({ tvMode })} /></PanelSectionRow>
            <PanelSectionRow>
              <DropdownItem label="Sort · all themes" rgOptions={[{ data: "recent", label: "Recently played" }, { data: "alpha", label: "A–Z" }, { data: "playtime", label: "Most played" }]} selectedOption={s.sort} onChange={(o) => updateSettings({ sort: o.data as SortMode })} />
            </PanelSectionRow>
            <PanelSectionRow>
              <DropdownItem label="Ⓐ on a game" rgOptions={[{ data: "theme", label: "Like the console (LiveArea, Start…)" }, { data: "launch", label: "Launch right away" }, { data: "details", label: "Open Steam's game page" }]} selectedOption={s.aAction} onChange={(o) => updateSettings({ aAction: o.data })} />
            </PanelSectionRow>
            <PanelSectionRow><ToggleField label="Themed store" description="Store entries open the Steam Store styled like this theme (off: Steam's own store)" checked={s.themedStore !== false} onChange={(v) => updateSettings({ themedStore: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label="Steam Deck compatibility badges" checked={s.badges.deck} onChange={(v) => updateSettings((p) => ({ badges: { ...p.badges, deck: v } }))} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label="Hide Steam's top bar" description="While the themed home is on screen" checked={s.hideSteamHeader} onChange={(v) => updateSettings({ hideSteamHeader: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label="Themed keyboard" description="Off by default. Steam's on-screen keyboard looks like the active console's keyboard, in every theme (a CSS Loader keyboard theme or a Points Shop keyboard wins)" checked={s.keyboardSkin === true} onChange={(v) => updateSettings({ keyboardSkin: v })} /></PanelSectionRow>
            {s.keyboardSkin === true && (
              <PanelSectionRow>
                <div style={{ paddingLeft: 12 }}>
                  <SliderField label="Keyboard spacing (px)" description="Gap around each key · default 1 px" min={0} max={5} step={0.5} value={Math.max(0, Math.min(5, Number.isFinite(s.keyboardSpacing) ? s.keyboardSpacing! : 1))} showValue onChange={(value) => updateSettings({ keyboardSpacing: value })} />
                </div>
              </PanelSectionRow>
            )}
            <PanelSectionRow><DropdownItem label="Steam's bottom bar" description="Steam Menu · Ⓐ Select · Ⓑ Back, while the themed home is on screen" rgOptions={FOOTER_MODES.map((f) => ({ data: f.id, label: f.name }))} selectedOption={s.footer} onChange={(o) => updateSettings({ footer: o.data })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label="Background animations" checked={s.animations} onChange={(v) => updateSettings({ animations: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label="24-hour clock" checked={s.clock24} onChange={(v) => updateSettings({ clock24: v })} /></PanelSectionRow>
            <PanelSectionRow><DeferredText key={String(loaded)} label="Profile name (blank = Steam name)" initial={s.profileName} onCommit={(v) => updateSettings({ profileName: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label="Background music" description="Master switch; keeps each preset's own music" checked={s.backgroundMusic !== false} onChange={(v) => updateSettings({ backgroundMusic: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label="Navigation sounds" checked={s.sounds} onChange={(v) => updateSettings({ sounds: v })} /></PanelSectionRow>
            <PanelSectionRow><SliderField label="Sound volume" min={0} max={100} step={5} value={s.sfxVolume} showValue onChange={(v) => updateSettings({ sfxVolume: v })} /></PanelSectionRow>
            <PanelSectionRow><SliderField label="Music volume" min={0} max={100} step={5} value={s.musicVolume} showValue onChange={(v) => updateSettings({ musicVolume: v })} /></PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" description="After adding sound packs, wallpapers or theme files" onClick={refresh}>
                Rescan packs, wallpapers and skins
              </ButtonItem>
            </PanelSectionRow>
            <ResetSection th={th} themeName={themeName} />
          </>
        )}
      </PanelSection>
    </>
  );
}

/** Delete a saved preset, or forget a built-in / theme-file preset's changes (press twice). */
function PresetDeleteRow({ id, saved, name }: { id: string; saved: boolean; name: string }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <PanelSectionRow>
      <ButtonItem layout="below" description={saved ? undefined : "Back to how this preset starts (the look's defaults, its theme file)"} onClick={() => (armed ? (deleteUserPreset(id), setArmed(false)) : setArmed(true))}>
        {armed ? "Press again" : saved ? `Delete ${name}` : `Reset ${name}`}
      </ButtonItem>
    </PanelSectionRow>
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
    <>
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
    </>
  );
}

function Diagnostics() {
  const lang = useLocalization();
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
    <PanelSection title={lang("qamDiagnostics")}>
      <PanelSectionRow><div style={{fontSize:12}}>Experimental diagnostics run automatically for thirty minutes after plugin load. Keyboard, input lifecycle and idle overlay events share the Decky log at ~/homebrew/logs/DeckHomeThemes. Messages and typed text are excluded.</div></PanelSectionRow>
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
          {others.support.map(p => <div key={p.name}>{row(p.name, `${p.mode}: ${p.detail}`, p.mode === "conflict")}</div>)}
          {row("Last error", d.lastError || "none", !!d.lastError)}
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
}

function ScreensaverStatus(){const status=useScreensaverStatus();return <div style={{fontSize:12,opacity:.8}}>{status}</div>;}

export default definePlugin(() => {
  logInfo(`frontend loaded v${PLUGIN_VERSION}`);
  initSettings();
  const stopScreensavers = startThemeScreensavers();
  const stopDiagnostics = startExperimentalDiagnostics();
  const stopAchievementPopups = startAchievementPopups();
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
      stopScreensavers();
      stopDiagnostics();
      stopAchievementPopups();
      stopSilverPad();
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
