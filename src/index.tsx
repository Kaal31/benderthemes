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
import { Updates } from "./Updates";
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
import { applyPreset, currentLook, currentPresetId, deleteUserPreset, getPresets, presetAvailable, refreshPresets, renamePreset, saveUserPreset, usePresets, PRESET_GROUPS } from "./presets";
import { customizeControls } from "./customize";
import { t, useLocalization } from "./i18n";

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
  const lang = useLocalization();
  const [msg, setMsg] = useState("");
  const [, setRev] = useState(0);
  useEffect(() => onThemesChanged(() => setRev((r) => r + 1)), []); // refused zips change after a Rescan
  const add = async () => {
    try {
      const picked = await openFilePicker(0 as any /* FileSelectionType.FILE */, "/home/deck/Downloads", true, true, undefined, ["zip"]);
      if (!picked?.realpath) return;
      setMsg(lang("checkingDots"));
      const r = await importThemeZip(picked.realpath);
      if (r.ok) {
        await refreshPresets();
        const p = getPresets().find((x) => x.id === r.id);
        if (p) applyPreset(p);
        setMsg(lang("themeAdded", { name: r.name || r.id || "" }));
      } else setMsg(lang("themeNotAdded", { error: r.error ?? lang("unknownReason") }));
    } catch {
      setMsg("");
    }
  };
  const refused = userThemes.errors;
  return (
    <PanelSectionRow>
      <ButtonItem layout="below" description={msg || `${lang("addThemeFromFileDesc", { dir: userThemes.dir || "the plugin's themes folder" })}${refused.length ? ` ${lang("refusedThemes", { errors: refused.map((e) => `${e.file} (${e.error})`).join("; ") })}` : ""}`} onClick={() => void add()}>
        {lang("addThemeFromFile")}
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
  const looks = PRESET_GROUPS.map((company) => ({ label: company, options: presets.filter((p) => p.company === company && p.origin === "default" && (presetAvailable(p) || p.look === look)).map((p) => ({ data: p.look, label: p.label })) })).filter((g) => g.options.length);
  // Customize: the slots this look draws, each with every installed asset grouped by source
  const controls = s.enabled ? customizeControls() : [];

  return (
    <>
      <Updates showCommunityUpdates={false} onManageThemes={() => { openMarketplace(); Navigation.Navigate(ROUTE); Navigation.CloseSideMenus(); }} />
      <PanelSection title={lang("screensavers")}>
        <PanelSectionRow><ScreensaverStatus /></PanelSectionRow>
        <PanelSectionRow><ToggleField label={lang("disableScreensavers")} description={lang("disableScreensaversDesc")} checked={s.screensaversDisabled===true} onChange={screensaversDisabled=>updateSettings({screensaversDisabled})}/></PanelSectionRow>
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
            {lang("openThemedHome")}
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
            description={lang("themePresetsInfoDetailed", { theme: themeName })}
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
                <ButtonItem layout="below" description={lang("openNativeSteamHomeDesc")} onClick={showNativeSteamHome}>
                  {lang("goToSteamHome")}
                </ButtonItem>
              </PanelSectionRow>
            )}
            <PanelSectionRow><ToggleField label={lang("firmwareNotifications")} checked={s.firmwareNotifications !== false} onChange={(value) => updateSettings({ firmwareNotifications: value })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("tvMode")} description={lang("tvModeDesc")} checked={s.tvMode} onChange={(tvMode) => updateSettings({ tvMode })} /></PanelSectionRow>
            <PanelSectionRow>
              <DropdownItem label={lang("sortAllThemes")} rgOptions={[{ data: "recent", label: lang("sortRecent") }, { data: "alpha", label: lang("sortAlpha") }, { data: "playtime", label: lang("sortPlaytime") }]} selectedOption={s.sort} onChange={(o) => updateSettings({ sort: o.data as SortMode })} />
            </PanelSectionRow>
            <PanelSectionRow>
              <DropdownItem label={lang("aOnGame")} rgOptions={[{ data: "theme", label: lang("aActionConsole") }, { data: "launch", label: lang("aActionLaunch") }, { data: "details", label: lang("aActionDetails") }]} selectedOption={s.aAction} onChange={(o) => updateSettings({ aAction: o.data })} />
            </PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("themedStore")} description={lang("themedStoreDesc")} checked={s.themedStore !== false} onChange={(v) => updateSettings({ themedStore: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("deckBadges")} checked={s.badges.deck} onChange={(v) => updateSettings((p) => ({ badges: { ...p.badges, deck: v } }))} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("hideSteamHeader")} description={lang("whileThemedHomeOnScreen")} checked={s.hideSteamHeader} onChange={(v) => updateSettings({ hideSteamHeader: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("themedKeyboard")} description={lang("themedKeyboardDesc")} checked={s.keyboardSkin === true} onChange={(v) => updateSettings({ keyboardSkin: v })} /></PanelSectionRow>
            {s.keyboardSkin === true && (
              <PanelSectionRow>
                <div style={{ paddingLeft: 12 }}>
                  <SliderField label={lang("keyboardSpacing")} description={lang("keyboardSpacingDesc")} min={0} max={5} step={0.5} value={Math.max(0, Math.min(5, Number.isFinite(s.keyboardSpacing) ? s.keyboardSpacing! : 1))} showValue onChange={(value) => updateSettings({ keyboardSpacing: value })} />
                </div>
              </PanelSectionRow>
            )}
            <PanelSectionRow><DropdownItem label={lang("steamBottomBar")} description={lang("steamBottomBarDesc")} rgOptions={FOOTER_MODES.map((f) => ({ data: f.id, label: f.name }))} selectedOption={s.footer} onChange={(o) => updateSettings({ footer: o.data })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("backgroundAnimations")} checked={s.animations} onChange={(v) => updateSettings({ animations: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("clock24")} checked={s.clock24} onChange={(v) => updateSettings({ clock24: v })} /></PanelSectionRow>
            <PanelSectionRow><DeferredText key={String(loaded)} label={lang("profileNameLabel")} initial={s.profileName} onCommit={(v) => updateSettings({ profileName: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("backgroundMusic")} description={lang("backgroundMusicDesc")} checked={s.backgroundMusic !== false} onChange={(v) => updateSettings({ backgroundMusic: v })} /></PanelSectionRow>
            <PanelSectionRow><ToggleField label={lang("navigationSounds")} checked={s.sounds} onChange={(v) => updateSettings({ sounds: v })} /></PanelSectionRow>
            <PanelSectionRow><SliderField label={lang("soundVolume")} min={0} max={100} step={5} value={s.sfxVolume} showValue onChange={(v) => updateSettings({ sfxVolume: v })} /></PanelSectionRow>
            <PanelSectionRow><SliderField label={lang("musicVolume")} min={0} max={100} step={5} value={s.musicVolume} showValue onChange={(v) => updateSettings({ musicVolume: v })} /></PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" description={lang("rescanPacksDesc")} onClick={refresh}>
                {lang("rescanPacks")}
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
  const lang = useLocalization();
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <PanelSectionRow>
      <ButtonItem layout="below" description={saved ? undefined : lang("resetPresetDesc")} onClick={() => (armed ? (deleteUserPreset(id), setArmed(false)) : setArmed(true))}>
        {armed ? lang("pressAgain") : saved ? lang("deletePresetNamed", { name }) : lang("resetPresetNamed", { name })}
      </ButtonItem>
    </PanelSectionRow>
  );
}

/** Settings are kept across reboots, plugin updates and theme deletion; these put them back to defaults. */
function ResetSection({ th, themeName }: { th: ThemeId; themeName: string }) {
  const lang = useLocalization();
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
          description={lang("resetThemeSettingsDesc", { theme: themeName })}
          onClick={() => (armed === "theme" ? (resetThemeSettings(th), setArmed("")) : setArmed("theme"))}
        >
          {armed === "theme" ? lang("pressAgainReset") : lang("resetThemeSettingsNamed", { theme: themeName })}
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          description={lang("deleteThemeDesc", { theme: themeName })}
          onClick={() => (armed === "delete" ? (deleteCurrentTheme(), setArmed("")) : setArmed("delete"))}
        >
          {armed === "delete" ? lang("pressAgainDelete") : lang("deleteThemeNamed", { theme: themeName })}
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          description={lang("resetAllSettingsDesc")}
          onClick={() => (armed === "all" ? (resetAllSettings(), setArmed("")) : setArmed("all"))}
        >
          {armed === "all" ? lang("pressAgainResetAll") : lang("resetAllSettings")}
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
      <PanelSectionRow><div style={{fontSize:12}}>{lang("diagNotice")}</div></PanelSectionRow>
      <PanelSectionRow>
        <div>
          {row(lang("diagVersion"), PLUGIN_VERSION)}
          {row(lang("diagSettingsBackend"), d.settingsBackend, d.settingsBackend !== "ok")}
          {row(lang("diagSteamHomePatched"), d.homePatchRenders ? lang("diagYesCount", { count: d.homePatchRenders }) : lang("diagNotYetOpenHome"), !d.homePatchRenders)}
          {row(lang("diagThemedHomeShown"), d.themedMounts ? `${d.themedMounts}×` : lang("diagNotYet"), !d.themedMounts)}
          {row(lang("diagSound"), soundDiag(useSettings().theme))}
          {row(lang("diagLibrary"), lang("diagLibraryCount", { games: lib.games.length, apps: lib.apps.length, collections: lib.collections.length }), !lib.games.length)}
          {others.homes.length > 0 && row(lang("diagAlsoReplacingHome"), lang("diagOnlyOneHomeDesc", { homes: others.homes.join(", ") }), true)}
          {others.music.length > 0 && row(lang("diagOtherMusic"), lang("diagOtherMusicPaused", { music: others.music.join(", ") }))}
          {others.support.map(p => <div key={p.name}>{row(p.name, `${p.mode}: ${p.detail}`, p.mode === "conflict")}</div>)}
          {row(lang("diagLastError"), d.lastError || lang("diagNone"), !!d.lastError)}
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
      <SafeBoundary where="page" fallback={<div style={{ padding: 48, color: "#ccc" }}>{t("themeHubError")}</div>}>
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
      <SafeBoundary fallback={<div style={{ padding: 16, color: "#ccc" }}>{t("settingsFailed")}</div>}>
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
