import {openDestination} from "./destinations";
import type { MenuItem } from "./common";
import { startThemeScreensavers } from "./themeScreensavers";
import { startAchievementPopups } from "./achievementPopups";
import {stopSilverPad} from "./themes/silverPad";
import { ButtonItem, Navigation, PanelSection, PanelSectionRow, staticClasses, ToggleField } from "@decky/ui";
import { definePlugin, openFilePicker, routerHook } from "@decky/api";
import { importThemeZip, onThemesChanged, userThemes } from "./engine/registry";
import { useEffect, useState } from "react";
import { HomeSwitch, SafeBoundary, showNativeSteamHome, showThemedHomeAgain, ThemedHome } from "./Home";
import { loadLibrary } from "./library";
import { useDiag, logInfo, reportError } from "./diag";
import { Updates } from "./Updates";
const PLUGIN_VERSION = "__DHT_VERSION__";
import { retryHome, useHomeFailure } from "./compatibility";
import { restoreFooter } from "./steam";
import { openMarketplace } from "./marketplaceState";
import { initSettings, useSettings } from "./settings";
import { refreshPacks, restoreHeader, soundDiag } from "./steam";
import { getUiDocument } from "./cssvars";
import { useOtherPlugins } from "./otherPlugins";
import { startKeyboardSkins } from "./keyboardSkins";
import { startExperimentalDiagnostics } from "./experimentalDiagnostics";
import { themeSettingsItems, refreshThemeLists } from "./themeSettingsMenu";
import { applyPreset, getPresets, refreshPresets, usePresets } from "./presets";
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
  const s = useSettings();
  usePresets();
  const failure = useHomeFailure();
  const [path, setPath] = useState<number[]>([]);
  const [, setRevision] = useState(0);
  useEffect(() => {refreshThemeLists(); void refreshPresets();}, []);
  useEffect(() => setPath([]), [s.theme, s.activeTheme]);
  let items = themeSettingsItems();
  const titles: string[] = [];
  for (const index of path) {
    const item = items[index];
    if (!item?.sub) break;
    titles.push(item.label);
    items = item.sub();
  }
  const select = (item: MenuItem, index: number) => {
    if(item.sub) setPath(previous => [...previous,index]);
    else {item.action?.(); if(item.settingsId === "native:change-skin") Navigation.CloseSideMenus(); setRevision(value=>value+1);}
  };
  return <>
    <Updates showCommunityUpdates={false} onManageThemes={() => {openMarketplace(); Navigation.Navigate(ROUTE); Navigation.CloseSideMenus();}} />
    <PanelSection title={lang("qamThemes")}>
      <AddThemeRow />
      <PanelSectionRow><ButtonItem layout="below" onClick={() => {showThemedHomeAgain(); Navigation.Navigate(ROUTE); Navigation.CloseSideMenus();}}>{lang("openThemedHome")}</ButtonItem></PanelSectionRow>
      <PanelSectionRow><ButtonItem layout="below" onClick={showNativeSteamHome}>{lang("steamHome")}</ButtonItem></PanelSectionRow>
      <PanelSectionRow><ButtonItem layout="below" onClick={() => {openMarketplace(); Navigation.Navigate(ROUTE); Navigation.CloseSideMenus();}}>{lang("qamHub")}</ButtonItem></PanelSectionRow>
      <PanelSectionRow><ButtonItem layout="below" onClick={() => void openDestination({place:"music"})}>{lang("musicPlayer")}</ButtonItem></PanelSectionRow>
      <PanelSectionRow><ButtonItem layout="below" onClick={() => void openDestination({place:"media"})}>{lang("captures")}</ButtonItem></PanelSectionRow>
      {failure && <PanelSectionRow><ButtonItem layout="below" description={failure} onClick={retryHome}>{lang("retryThemedHome")}</ButtonItem></PanelSectionRow>}
    </PanelSection>
    <PanelSection title={titles.length ? titles.join(" / ") : lang("themeSettings")}>
      {!!path.length && <PanelSectionRow><ButtonItem layout="below" onClick={() => setPath(previous => previous.slice(0,-1))}>{lang("back")}</ButtonItem></PanelSectionRow>}
      {items.map((item,index) => <PanelSectionRow key={`${titles.join("/")}:${index}`}>
        {item.keepOpen && typeof item.checked === "boolean" ? <ToggleField label={item.label} disabled={item.disabled} checked={item.checked} onChange={() => select(item,index)} /> :
          <ButtonItem layout="below" disabled={item.disabled} onClick={() => select(item,index)}>{item.checked ? "✓ " : ""}{item.label}</ButtonItem>}
      </PanelSectionRow>)}
    </PanelSection>
  </>;
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
