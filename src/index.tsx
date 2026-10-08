import { ButtonItem, DropdownItem, Navigation, PanelSection, PanelSectionRow, SliderField, staticClasses, TextField, ToggleField } from "@decky/ui";
import { definePlugin, routerHook } from "@decky/api";
import { useEffect, useRef, useState } from "react";
import { HomeSwitch, SafeBoundary, showThemedHomeAgain, ThemedHome } from "./Home";
import { listCollectionsForSettings, loadLibrary } from "./library";
import { useDiag, logInfo, reportError } from "./diag";
const PLUGIN_VERSION = "__DHT_VERSION__";
import { Updates } from "./Updates";
import { retryHome, useHomeFailure } from "./compatibility";
import { restoreFooter } from "./steam";
import { openMarketplace } from "./marketplaceState";
import { CASE_THEMES } from "./CaseArt";
import { initSettings, SortMode, THEMES, ThemeId, TITLE_MODES, updateSettings, updateVita, useSettings, useSettingsLoaded, X360_STYLES, FOOTER_MODES } from "./settings";
import { autoPack, getPacks, listWallpapers, matchKey, musicFile, PACK_MATCH, packFor, refreshPacks, restoreHeader, sfxCoverage, soundDiag, SoundPack } from "./steam";
import { listSkins } from "./skins";
import { MONTH_NAMES } from "./color";
import { getUiDocument } from "./cssvars";
import { BUBBLE_STYLES } from "./themes/vitaBubble";
import { applyPreset, refreshPresets, usePresets, presetPickerState } from "./presets";

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

function Panel() {
  const failure = useHomeFailure();
  const s = useSettings();
  const loaded = useSettingsLoaded();
  const [packs, setPacks] = useState<SoundPack[]>(getPacks());
  const [walls, setWalls] = useState<{ dir: string; files: string[] }>({ dir: "", files: [] });
  const [skins, setSkins] = useState<{ p3t: string[]; vita: string[]; dir: string }>({ p3t: [], vita: [], dir: "" });
  const refresh = () => {
    refreshPacks().then(setPacks);
    listWallpapers().then(setWalls);
    listSkins()
      .then((r) => setSkins(r ?? { p3t: [], vita: [], dir: "" }))
      .catch(() => {});
    refreshPresets();
  };
  useEffect(refresh, []);
  const presets = usePresets();
  const {company,selected:selectedPreset,options:presetOptions} = presetPickerState(s,presets);
  const th: ThemeId = s.theme;
  const themeName = THEMES.find((t) => t.id === th)?.name ?? th;

  const sources = [
    ...(s.themeCollections?.[th]?.source === "collections" ? [{ data: "collections", label: "Selected collections" }] : []),
    { data: "installed", label: "Installed games" },
    { data: "all", label: "All games" },
    ...listCollectionsForSettings().map((c) => ({ data: `col:${c.id}`, label: `${c.name} (${c.count})` })),
  ];

  return (
    <>
      <Updates />
      <PanelSection title="Themes"><PanelSectionRow><ButtonItem layout="below" description="Browse animated previews, download a theme and activate it." onClick={() => { openMarketplace(); Navigation.Navigate(ROUTE); Navigation.CloseSideMenus(); }}>Hub</ButtonItem></PanelSectionRow>
      <PanelSectionRow><ToggleField label="Firmware update notifications" checked={s.firmwareNotifications !== false} onChange={value => updateSettings({ firmwareNotifications: value })} /></PanelSectionRow></PanelSection>
      {failure && <PanelSection title="Steam Home restored"><PanelSectionRow><ButtonItem layout="below" description={failure} onClick={retryHome}>Retry themed home</ButtonItem></PanelSectionRow></PanelSection>}
      <PanelSection>
        <PanelSectionRow>
          <ToggleField label="Themed home screen" description="Replace Steam's home with the console theme" checked={s.enabled} onChange={(v) => updateSettings({ enabled: v })} />
        </PanelSectionRow>
        <PanelSectionRow><DropdownItem label="Company" rgOptions={["Sony","Microsoft","Bonus"].map(data=>({data,label:data}))} selectedOption={company} onChange={o=>{if(["Sony","Microsoft","Bonus"].includes(o.data))updateSettings({presetCompany:o.data});}} /></PanelSectionRow>
        <PanelSectionRow><ToggleField label="TV mode" description="Safe screen margins and larger menu text" checked={s.tvMode} onChange={tvMode=>updateSettings({tvMode})}/></PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label="Preset"
            description="Console theme + skin. On the home: L2 / R2 switch presets, △ → Presets."
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

      <PanelSection title="Library">
        <PanelSectionRow>
          <DropdownItem label="Show in this theme" rgOptions={sources} selectedOption={s.themeCollections?.[th]?.source ?? s.source} onChange={(o) => updateSettings(p => ({ themeCollections: { ...p.themeCollections, [th]: { ...p.themeCollections?.[th], source: o.data as string } } }))} />
          <SliderField label="Icon size in this theme" value={s.iconSizes?.[th] ?? 100} min={75} max={110} step={5} showValue onChange={value => updateSettings(p => ({ iconSizes: { ...p.iconSizes, [th]: value } }))} />
        </PanelSectionRow>
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

      {CASE_THEMES.includes(th) && <PanelSection title="Game covers"><PanelSectionRow><DropdownItem label="Cover style" rgOptions={[{data:"flat",label:"Flat"},{data:"case3d",label:"3D case"}]} selectedOption={s.coverStyles?.[th]??"flat"} onChange={o=>updateSettings(v=>({coverStyles:{...v.coverStyles,[th]:o.data}}))}/></PanelSectionRow></PanelSection>}
      {th === "vita" && (
        <PanelSection title="PS Vita">
          <PanelSectionRow>
            <ToggleField label="System bubbles" description="Library, Store, Friends, Screenshots…" checked={s.vita.systemBubbles} onChange={(v) => updateVita({ systemBubbles: v })} />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField label="Collections as folders" checked={s.vita.collectionFolders} onChange={(v) => updateVita({ collectionFolders: v })} />
          </PanelSectionRow>
          <PanelSectionRow>
            <DropdownItem
              label="Bubble art"
              rgOptions={[
                { data: "portrait", label: "Cover art" },
                { data: "landscape", label: "Header art" },
              ]}
              selectedOption={s.vita.art}
              onChange={(o) => updateVita({ art: o.data })}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <DropdownItem
              label="Bubble style"
              rgOptions={BUBBLE_STYLES.map((b) => ({ data: b.id, label: b.name }))}
              selectedOption={s.vita.bubbleStyle}
              onChange={(o) => updateVita({ bubbleStyle: o.data })}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <DropdownItem
              label="Focus highlight"
              rgOptions={[
                { data: "vita", label: "Vita glow (soft)" },
                { data: "ring", label: "Ring" },
                { data: "none", label: "None (grow only)" },
              ]}
              selectedOption={s.vita.focus}
              onChange={(o) => updateVita({ focus: o.data })}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField label="3D bubbles" description="Turn the artwork and reflections inside each glass bubble when you tilt the Deck" checked={s.vita.motion} onChange={(v) => updateVita({ motion: v })} />
          </PanelSectionRow>
          <PanelSectionRow>
            <DropdownItem label="Bubble sway" rgOptions={[{data:"off",label:"Off"},{data:"gentle",label:"Gentle"},{data:"lively",label:"Lively"}]} selectedOption={s.vita.sway} onChange={(o) => updateVita({sway:o.data})} />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField label="Gyro" description="Use the Deck\u2019s motion sensor to drive the 3D bubbles" checked={s.vita.gyro} disabled={!s.vita.motion} onChange={(v) => updateVita({ gyro: v })} />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField label="Touch controls" description="Tap to open, swipe for pages, hold to rearrange" checked={s.vita.touch} onChange={(v) => updateVita({ touch: v })} />
          </PanelSectionRow>
          <PanelSectionRow>
            <DropdownItem
              label="Custom Vita theme"
              description={skins.dir ? `Folders or .zip files in ${skins.dir}/vita` : undefined}
              rgOptions={[{ data: "", label: "None" }, ...skins.vita.map((n) => ({ data: n, label: n }))]}
              selectedOption={s.vita.skin}
              onChange={(o) => updateVita({ skin: o.data })}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem layout="below" description={`${s.vita.folders.length} folder(s). Folders are made with △ on the home.`} onClick={() => updateVita({ order: [] })}>
              Reset bubble arrangement
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      )}

      {(th === "ps3" || th === "psp") && (
        <PanelSection title={themeName}>
          <PanelSectionRow>
            <DropdownItem
              label="Background colour"
              rgOptions={[{ data: -1, label: "By month (original)" }, ...MONTH_NAMES.map((m, i) => ({ data: i, label: m }))]}
              selectedOption={th === "ps3" ? s.xmb.ps3Color : s.xmb.pspColor}
              onChange={(o) => updateSettings((p) => ({ xmb: { ...p.xmb, [th === "ps3" ? "ps3Color" : "pspColor"]: o.data } }))}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField label="Collections as folders" checked={s.xmb.collectionFolders} onChange={(v) => updateSettings((p) => ({ xmb: { ...p.xmb, collectionFolders: v } }))} />
          </PanelSectionRow>
          {th === "ps3" && (
            <PanelSectionRow>
              <DropdownItem
                label="PS3 theme (.p3t)"
                description={skins.dir ? `Put .p3t files in ${skins.dir}/p3t` : undefined}
                rgOptions={[{ data: "", label: "None (wave)" }, ...skins.p3t.map((n) => ({ data: n, label: n.replace(/\.p3t$/i, "") }))]}
                selectedOption={s.xmb.p3t}
                onChange={(o) => updateSettings((p) => ({ xmb: { ...p.xmb, p3t: o.data } }))}
              />
            </PanelSectionRow>
          )}
        </PanelSection>
      )}

      <PanelSection title="Look">
        <PanelSectionRow>
          <DropdownItem
            label={`Game titles (${themeName})`}
            rgOptions={TITLE_MODES.map((m) => ({ data: m.id, label: m.name }))}
            selectedOption={s.titles[th] ?? "show"}
            onChange={(o) => updateSettings((p) => ({ titles: { ...p.titles, [th]: o.data } }))}
          />
        </PanelSectionRow>
        {(th === "ps3" || th === "psp") && (
          <PanelSectionRow>
            <ToggleField label="Game trailers in Video" description="Adds a Game Trailers folder to Video (needs internet). Off: Video shows only the videos stored on your Deck" checked={s.trailers.video} onChange={(v) => updateSettings((p) => ({ trailers: { ...p.trailers, video: v } }))} />
          </PanelSectionRow>
        )}
        {(th === "ps3" || th === "psp") && (
          <PanelSectionRow>
            <ToggleField label="Animated icons" description="Rest on a game or video: it plays inside the icon (games use their store trailer) and the art becomes the background" checked={s.trailers.preview} onChange={(v) => updateSettings((p) => ({ trailers: { ...p.trailers, preview: v } }))} />
          </PanelSectionRow>
        )}
        {(th === "ps3" || th === "psp") && (
          <PanelSectionRow>
            <ToggleField label="Trailer sound" description="Play the trailer's audio when you rest on a game (theme music fades out meanwhile)" checked={s.trailers.sound} onChange={(v) => updateSettings((p) => ({ trailers: { ...p.trailers, sound: v } }))} />
          </PanelSectionRow>
        )}
        {th === "x360" && (
          <PanelSectionRow>
            <DropdownItem label="Xbox 360 dashboard" rgOptions={X360_STYLES.map((x) => ({ data: x.id, label: x.name }))} selectedOption={s.x360.style} onChange={(o) => updateSettings((p) => ({ x360: { ...p.x360, style: o.data } }))} />
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <DropdownItem
            label={`Wallpaper (${themeName})`}
            description={walls.dir ? `Images in ${walls.dir}` : undefined}
            rgOptions={[{ data: "", label: "Theme default" }, ...walls.files.map((f) => ({ data: f, label: f }))]}
            selectedOption={s.wallpapers[th] ?? ""}
            onChange={(o) => updateSettings((p) => ({ wallpapers: { ...p.wallpapers, [th]: o.data } }))}
          />
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
          <DropdownItem label="Steam's bottom bar" description="Steam Menu · Ⓐ Select · Ⓑ Back, while the themed home is on screen" rgOptions={FOOTER_MODES.map((f) => ({ data: f.id, label: f.name }))} selectedOption={s.footer} onChange={(o) => updateSettings({ footer: o.data })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Background animations" checked={s.animations} onChange={(v) => updateSettings({ animations: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          {s.theme==="castle"&&<ToggleField label="Weather instead of Deck status" description="Automatic IP location · Celsius · Open-Meteo · refreshes every 10 minutes" checked={s.castleWeather} onChange={v=>updateSettings({castleWeather:v})}/>}
          <ToggleField label="24-hour clock" checked={s.clock24} onChange={(v) => updateSettings({ clock24: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <DeferredText key={String(loaded)} label="Profile name (blank = Steam name)" initial={s.profileName} onCommit={(v) => updateSettings({ profileName: v })} />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Sound"><PanelSectionRow><ToggleField label="Background music · all themes" description="Master switch; preserves each theme’s music setting" checked={s.backgroundMusic!==false} onChange={v=>updateSettings({backgroundMusic:v})}/></PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Navigation sounds" checked={s.sounds} onChange={(v) => updateSettings({ sounds: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label={`Sound effects (${themeName})`}
            description={(() => {
              const auto = autoPack(th, "sfx");
              const cur = packFor(th, "sfx");
              if ((s.packs[th] ?? "") === "" && !auto) return `No matching pack installed. In AudioLoader's store, install "${(PACK_MATCH[matchKey(th)] ?? PACK_MATCH[th]).suggest}", then Rescan below. Using Steam's sounds.`;
              return cur ? `Using "${cur.name}"` : "Using Steam's own sounds";
            })()}
            rgOptions={[
              { data: "", label: `Automatic${autoPack(th, "sfx") ? ` (${autoPack(th, "sfx")!.name})` : ""}` },
              { data: "steam", label: "Steam sounds" },
              ...packs.filter((p) => sfxCoverage(p) > 0).map((p) => ({ data: p.folder, label: p.name })),
            ]}
            selectedOption={s.packs[th] ?? ""}
            onChange={(o) => updateSettings((p) => ({ packs: { ...p.packs, [th]: o.data } }))}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField label="Sound volume" min={0} max={100} step={5} value={s.sfxVolume} showValue onChange={(v) => updateSettings({ sfxVolume: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Theme music"
            description={packFor(th, "music") ? `Plays "${packFor(th, "music")!.name}" on the home` : "No music pack for this theme yet (install one, then Rescan)"}
            checked={s.music[th] !== false}
            onChange={(v) => updateSettings((p) => ({ music: { ...p.music, [th]: v } }))}
          />
        </PanelSectionRow>
        {s.music[th] !== false && (
          <PanelSectionRow>
            <DropdownItem
              label="Music from"
              rgOptions={[
                { data: "", label: `Automatic${autoPack(th, "music") ? ` (${autoPack(th, "music")!.name})` : " (none found)"}` },
                ...packs.filter((p) => !!musicFile(p)).map((p) => ({ data: p.folder, label: p.name })),
              ]}
              selectedOption={s.musicPacks[th] ?? ""}
              onChange={(o) => updateSettings((p) => ({ musicPacks: { ...p.musicPacks, [th]: o.data } }))}
            />
          </PanelSectionRow>
        )}
        {s.music[th] !== false && (
          <PanelSectionRow>
            <SliderField label="Music volume" min={0} max={100} step={5} value={s.musicVolume} showValue onChange={(v) => updateSettings({ musicVolume: v })} />
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={refresh}>
            Rescan packs, wallpapers and skins
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
}

function Diagnostics() {
  const d = useDiag();
  const lib = loadLibrary(useSettings().source, "recent", 9999);
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
  routerHook.addRoute(
    ROUTE,
    () => (
      <SafeBoundary where="page" fallback={<div style={{ padding: 48, color: "#ccc" }}>Deck Home Themes: something went wrong. See Quick Access → Diagnostics.</div>}>
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
    name: "Deck Home Themes",
    titleView: <div className={staticClasses.Title}>Deck Home Themes</div>,
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
      try {
        restoreHeader(getUiDocument() ?? document);
        restoreFooter(getUiDocument() ?? document);
      } catch {
        /* ignore */
      }
    },
  };
});
