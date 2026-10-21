import { t } from "../i18n";
import {customProfilePicture} from "../profilePicture";
// The NXE avatar creator (2008), after the console's own: a short intro, the
// "Choose an avatar as a starting point" line-up under a spotlight, then the
// editor with your avatar on the left and a 3×3 grid of choices on the right.
// Moving over a choice tries it on; A keeps it, B puts back what you had.
// Used by the NXE and Kinect dashboards; the avatar is saved with the Xbox 360
// settings (settings.x360.avatar).
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { callable } from "@decky/api";
import { Navigation } from "@decky/ui";
import { resourcesChanged } from "../marketplaceState";
import type { MenuItem } from "../common";
import { pushModalInput, Press, useStage } from "../input";
import { playSound } from "../steam";
import { loadAssets, useAssets } from "../assets";
import { updateSettings, Settings } from "../settings";
import { AvatarScene, AvatarSpec, avatarForName, avatarHeadY, avatarThumb, Cam, CLOTH_COLORS, EYE_COLORS, HAIR_COLORS, normalizeAvatar, OPTIONS, Placed, randomAvatar, RANGE, SKIN_COLORS } from "./X360Avatar";

/** The saved avatar, if there is one. */
export function savedAvatar(s: Settings): AvatarSpec | undefined {
  return normalizeAvatar((s.x360 as { avatar?: unknown }).avatar);
}
export function saveAvatar(spec: AvatarSpec) {
  updateSettings((p) => ({ x360: { ...p.x360, avatar: spec } as Settings["x360"] }));
}

/**
 * Your avatar for the NXE and Kinect homes. An exported model of your own
 * (for example from 360sona) in the asset set "my-avatar" as avatar.glb, with
 * gamerpic.png beside it, takes the place of the built one; without it the
 * first visit opens the creator.
 */
export const OWN_AVATAR_SET = "my-avatar";
export type Editing = null | "first" | "edit" | "import";
export function useMyAvatar(s: Settings, user: string) {
  const own = useAssets(OWN_AVATAR_SET);
  const saved = savedAvatar(s);
  const [editing, setEditing] = useState<Editing>(null);
  useEffect(() => {
    let alive = true;
    if (!saved) loadAssets(OWN_AVATAR_SET).then((r) => alive && !r.avatar && setEditing((e) => e ?? "first"));
    return () => {
      alive = false;
    };
  }, []);
  return { spec: saved ?? avatarForName(user), model: own.avatar as string | undefined, gamerpic: customProfilePicture()??own.gamerpic as string | undefined, editing, setEditing };
}

// ───────────────────────── 360sona ─────────────────────────
// 360sona (https://360sona.com) rebuilds the console's own avatar editor with
// the full item catalogue; "Export a 3D model" downloads MyAvatar.glb (rigged,
// textures baked in, the console animations included) and "Save as gamerpic"
// a PNG. The site has no API or messages for other pages, and its exports are
// downloads, so the way in is: open it in Steam's browser, export, then pick
// the file up from Downloads here. Exports are for personal use (its terms):
// we only read the user's own file on their own Deck.
export const SONA_URL = "https://360sona.com/";
export const openSona = () => Navigation.NavigateToSteamWeb(SONA_URL);
type Found = { path: string; name: string; kind: "model" | "picture"; size: number; mtime: number; animations?: number; sona?: boolean };
const scanAvatars = callable<[], Found[]>("x360_avatar_scan");
const importAvatar = callable<[path: string], { success: boolean; kind?: string; error?: string }>("x360_avatar_import");
const removeAvatar = callable<[what: string], { success: boolean }>("x360_avatar_remove");

/** The avatar entries for a dashboard's Y menu. */
export function avatarMenu(model: string | undefined, setEditing: (e: Editing) => void): MenuItem[] {
  return [
    { label: t("editMyAvatar"), action: () => setEditing("edit") },
    { label: t("createOn360sona"), action: openSona },
    { label: t("importAvatar"), action: () => setEditing("import") },
    ...(model ? [{ label: t("removeImportedAvatar"), action: () => void removeAvatar("model").then(() => resourcesChanged()) }] : []),
  ];
}

type Cat = { key: keyof AvatarSpec; label: string; framing: "head" | "body"; colors?: number[]; names?: readonly string[] };
const getFeatures = (): Cat[] => [
  { key: "hair", label: t("catHairstyles"), framing: "head", names: OPTIONS.hair },
  { key: "hairColor", label: t("catHairColor"), framing: "head", colors: HAIR_COLORS },
  { key: "eyes", label: t("catEyes"), framing: "head", names: OPTIONS.eyes },
  { key: "eyeColor", label: t("catEyeColor"), framing: "head", colors: EYE_COLORS },
  { key: "brows", label: t("catEyebrows"), framing: "head", names: OPTIONS.brows },
  { key: "nose", label: t("catNose"), framing: "head", names: OPTIONS.nose },
  { key: "mouth", label: t("catMouth"), framing: "head", names: OPTIONS.mouth },
  { key: "ears", label: t("catEars"), framing: "head", names: OPTIONS.ears },
  { key: "facialHair", label: t("catFacialHair"), framing: "head", names: OPTIONS.facialHair },
  { key: "face", label: t("catFaceShape"), framing: "head", names: OPTIONS.face },
  { key: "skin", label: t("catSkinColor"), framing: "body", colors: SKIN_COLORS },
  { key: "body", label: t("catBodyType"), framing: "body", names: OPTIONS.body },
  { key: "height", label: t("catHeight"), framing: "body", names: OPTIONS.height },
  { key: "build", label: t("catBuild"), framing: "body", names: OPTIONS.build },
];
const getClothes = (): Cat[] => [
  { key: "top", label: t("catTops"), framing: "body", names: OPTIONS.top },
  { key: "topColor", label: t("catTopColor"), framing: "body", colors: CLOTH_COLORS },
  { key: "top2Color", label: t("catTrimColor"), framing: "body", colors: CLOTH_COLORS },
  { key: "bottom", label: t("catBottoms"), framing: "body", names: OPTIONS.bottom },
  { key: "bottomColor", label: t("catBottomsColor"), framing: "body", colors: CLOTH_COLORS },
  { key: "shoes", label: t("catShoes"), framing: "body", names: OPTIONS.shoes },
  { key: "shoeColor", label: t("catShoeColor"), framing: "body", colors: CLOTH_COLORS },
];
const getMenu = () => [
  { id: "features", label: t("changeMyFeatures") },
  { id: "clothes", label: t("changeMyClothes") },
  { id: "startOver", label: t("startOver") },
  { id: "sona", label: t("use360sonaAvatar") },
  { id: "exit", label: t("saveAndExit") },
];
const LINEUP = 11;
const hex = (c: number) => `#${c.toString(16).padStart(6, "0")}`;

type Step = { s: "intro" } | { s: "lineup" } | { s: "menu" } | { s: "sona" } | { s: "grid"; which: "features" | "clothes" } | { s: "options"; which: "features" | "clothes"; cat: Cat };

export function AvatarEditor({ name, initial, firstRun, start, model, motion = true, onDone }: { name: string; initial: AvatarSpec; firstRun: boolean; start?: "import"; model?: string; motion?: boolean; onDone: (spec?: AvatarSpec) => void }) {
  const { W, H } = useStage();
  const legend = useAssets("x360-nxe-dash");
  const [step, setStep] = useState<Step>(start === "import" ? { s: "sona" } : firstRun ? (motion ? { s: "intro" } : { s: "lineup" }) : { s: "menu" });
  // the 360sona page: what is in Downloads, and what the last import said
  const [found, setFound] = useState<Found[] | null>(null);
  const [sonaSel, setSonaSel] = useState(0);
  const [note, setNote] = useState("");
  useEffect(() => {
    if (step.s !== "sona") return;
    let alive = true;
    setFound(null);
    scanAvatars().then((r) => alive && setFound(Array.isArray(r) ? r : [])).catch(() => alive && setFound([]));
    return () => {
      alive = false;
    };
  }, [step.s]);
  type SonaItem = { label: string; sub: string; run: () => void };
  const sonaItems: SonaItem[] = [
    { label: t("createOn360sona"), sub: t("createOn360sonaDesc"), run: () => (openSona(), setNote(t("sonaWhenDownloadFinished"))) },
    ...(found ?? []).map((f) => ({
      label: f.name,
      sub: `${f.kind === "model" ? `${t("sona3DModel")}${f.animations ? t("sonaAnimationsCount", { count: f.animations }) : ""}` : t("gamerPicture")} · ${(f.size / 1048576).toFixed(1)} MB · ${new Date(f.mtime * 1000).toLocaleString()}`,
      run: () => {
        setNote(t("sonaImporting"));
        importAvatar(f.path)
          .then((r) => {
            if (!r?.success) return setNote(r?.error || t("sonaFileCouldNotBeUsed"));
            resourcesChanged();
            setNote(r.kind === "model" ? t("avatarImported") : t("gamerpicImported"));
            if (r.kind === "model") setTimeout(() => onDone(firstRun ? initial : undefined), 900);
          })
          .catch(() => setNote(t("sonaFileCouldNotBeUsed")));
      },
    })),
    { label: t("lookAgain"), sub: t("lookAgainDesc"), run: () => (setFound(null), scanAvatars().then((r) => setFound(Array.isArray(r) ? r : []))) },
    ...(model ? [{ label: t("removeImportedAvatar"), sub: t("removeImportedAvatarDesc"), run: () => void removeAvatar("model").then(() => (resourcesChanged(), setNote(t("importedAvatarRemoved")))) }] : []),
  ];
  const [spec, setSpec] = useState(initial);
  const [lineup, setLineup] = useState<AvatarSpec[]>(() => Array.from({ length: LINEUP }, () => randomAvatar()));
  const [pick, setPick] = useState(Math.floor(LINEUP / 2));
  const [menuSel, setMenuSel] = useState(0);
  const [gridSel, setGridSel] = useState(0);
  const [optSel, setOptSel] = useState(0);
  const [kept, setKept] = useState(spec); // what an options page reverts to
  const menuItems = getMenu();

  // ── intro: plays once, any button skips it ──
  useEffect(() => {
    if (step.s !== "intro") return;
    const t = setTimeout(() => setStep({ s: "lineup" }), 5200);
    return () => clearTimeout(t);
  }, [step.s]);

  const cats = step.s === "grid" || step.s === "options" ? (step.which === "features" ? getFeatures() : getClothes()) : [];
  const cat = step.s === "options" ? step.cat : undefined;
  const count = cat ? RANGE[cat.key] : 0;

  const openOptions = (which: "features" | "clothes", c: Cat) => {
    setKept(spec);
    setOptSel(spec[c.key]);
    setStep({ s: "options", which, cat: c });
  };
  const tryOn = (v: number) => {
    if (!cat) return;
    setOptSel(v);
    setSpec((p) => ({ ...p, [cat.key]: v }));
  };

  const handle = (p: Press): boolean => {
    const k = p.btn;
    const move = () => playSound("move");
    if (step.s === "intro") {
      if (k === "a" || k === "b" || k === "menu") (setStep({ s: "lineup" }), playSound("select"));
      return true;
    }
    if (step.s === "lineup") {
      if (k === "left" || k === "right") {
        const n = Math.max(0, Math.min(LINEUP - 1, pick + (k === "left" ? -1 : 1)));
        n !== pick ? (setPick(n), move()) : playSound("end");
      } else if (k === "x") (setLineup(Array.from({ length: LINEUP }, () => randomAvatar())), playSound("tab"));
      else if (k === "a") (setSpec(lineup[pick]), setMenuSel(0), setStep({ s: "menu" }), playSound("select"));
      else if (k === "b") (firstRun ? onDone(initial) : setStep({ s: "menu" }), playSound("back"));
      return true;
    }
    if (step.s === "sona") {
      if (k === "up" || k === "down") {
        const n = Math.max(0, Math.min(sonaItems.length - 1, sonaSel + (k === "up" ? -1 : 1)));
        n !== sonaSel ? (setSonaSel(n), move()) : playSound("end");
      } else if (k === "a") (playSound("select"), sonaItems[sonaSel]?.run());
      else if (k === "b") (playSound("back"), start === "import" ? onDone(undefined) : (setNote(""), setStep({ s: "menu" })));
      return true;
    }
    if (step.s === "menu") {
      if (k === "up" || k === "down") {
        const n = Math.max(0, Math.min(menuItems.length - 1, menuSel + (k === "up" ? -1 : 1)));
        n !== menuSel ? (setMenuSel(n), move()) : playSound("end");
      } else if (k === "a") {
        playSound("select");
        if (menuSel === 0) (setGridSel(0), setStep({ s: "grid", which: "features" }));
        else if (menuSel === 1) (setGridSel(0), setStep({ s: "grid", which: "clothes" }));
        else if (menuSel === 2) setStep({ s: "lineup" });
        else if (menuSel === 3) (setSonaSel(0), setNote(""), setStep({ s: "sona" }));
        else onDone(spec);
      } else if (k === "b") (playSound("back"), onDone(firstRun ? spec : undefined));
      return true;
    }
    if (step.s === "grid") {
      const n = gridNav(gridSel, cats.length, k);
      if (n !== undefined) n !== gridSel ? (setGridSel(n), move()) : playSound("end");
      else if (k === "a") (playSound("select"), openOptions(step.which, cats[gridSel]));
      else if (k === "b") (playSound("back"), setStep({ s: "menu" }));
      return true;
    }
    if (step.s === "options" && cat) {
      const n = gridNav(optSel, count, k);
      if (n !== undefined) n !== optSel ? (tryOn(n), move()) : playSound("end");
      else if (k === "a") (playSound("select"), setStep({ s: "grid", which: step.which }));
      else if (k === "b") (playSound("back"), setSpec(kept), setStep({ s: "grid", which: step.which }));
      return true;
    }
    return true;
  };
  const latest = useRef(handle);
  latest.current = handle;
  useEffect(() => pushModalInput((p) => latest.current(p)), []);

  // ── camera and avatars ──
  const headY = avatarHeadY(spec);
  const closeUp = (step.s === "options" && step.cat.framing === "head") || (step.s === "grid" && cats[gridSel]?.framing === "head");
  const cam: Cam =
    step.s === "lineup" || step.s === "intro"
      ? { x: 0, y: 1.9, z: 13.5, lx: 0, ly: 1.5, lz: 0, fov: 30 }
      : closeUp
        ? { x: 0.75, y: headY + 0.05, z: 5.6, lx: 0.75, ly: headY - 0.25, lz: 0, fov: 26 }
        : { x: 1.25, y: 1.75, z: 8.6, lx: 1.25, ly: 1.5, lz: 0, fov: 26 };
  const avatars: Placed[] =
    step.s === "lineup" || step.s === "intro"
      ? lineup.map((a, i) => ({ spec: a, x: (i - (LINEUP - 1) / 2) * 1.0, z: i === pick ? 0.9 : i % 2 ? -0.55 : 0, ry: i === pick ? 0 : (i - pick) * -0.04, wave: i === pick, phase: i * 1.7 }))
      : [{ spec, model: step.s === "sona" ? model : undefined, x: 0, ry: closeUp ? 0.12 : 0.2, wave: step.s === "menu", phase: 0 }];
  // where the picked avatar stands on screen, for the spotlight (1280×720 scene units)
  const beamX = 640 + ((((pick - (LINEUP - 1) / 2) * 1.0) / (13.5 - 0.9)) * 360) / Math.tan((15 * Math.PI) / 180);

  const k = Math.min(W / 1280, H / 720);
  const ox = (W - 1280 * k) / 2;
  const oy = (H - 720 * k) / 2;

  const title = step.s === "grid" ? (step.which === "features" ? t("myFeatures") : t("myClothes")) : cat ? cat.label : step.s === "menu" ? t("avatarEditor") : step.s === "sona" ? t("sonaAvatar") : "";
  const subtitle = step.s === "grid" ? cats[gridSel]?.label : cat ? optionName(cat, optSel) : "";

  return (
    <div className="dht-x360-avatar-editor" style={{ position: "absolute", inset: 0, zIndex: 200, overflow: "hidden", background: BG, fontFamily: `var(--dht-font, "Segoe UI", "Helvetica Neue", Arial, sans-serif)`, color: "#fff" }}>
      {/* the horizon streak the avatars stand in front of */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "44%", height: "9%", background: "linear-gradient(180deg, transparent, rgba(255,255,255,.75) 45%, rgba(255,255,255,.85) 52%, transparent)", filter: "blur(6px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "38%", background: "linear-gradient(180deg, rgba(60,72,90,0) 0%, rgba(40,50,64,.55) 100%)" }} />

      {step.s === "lineup" && (
        <div style={{ position: "absolute", left: ox, top: oy, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: "0 0", pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: beamX - 34, top: 0, width: 68, height: 400, background: "linear-gradient(180deg, rgba(255,160,190,.95), rgba(255,200,215,.55) 55%, transparent)", filter: "blur(3px)", transition: motion ? "left 220ms ease-out" : undefined, pointerEvents: "none", }} />
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, opacity: step.s === "intro" ? 0 : 1, transition: "opacity 600ms" }}>
        <AvatarScene avatars={avatars} cam={cam} motion={motion} light="studio" />
      </div>

      <div style={{ position: "absolute", left: ox, top: oy, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: "0 0" }}>
        {step.s === "lineup" && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontSize: 26, textShadow: SHADOW }}>{t("chooseAvatarStartingPoint")}</div>
          </>
        )}
        {step.s !== "lineup" && step.s !== "intro" && <div style={{ position: "absolute", left: 64, top: 40, fontSize: 26, textShadow: SHADOW }}>{name}</div>}

        {step.s === "menu" && (
          <div style={{ position: "absolute", left: 800, top: 180, display: "flex", flexDirection: "column", gap: 12 }}>
            {menuItems.map((m, i) => (
              <div key={m.id} data-selected={i === menuSel} style={{ ...tile(i === menuSel), width: 330, height: 62, display: "flex", alignItems: "center", padding: "0 22px", fontSize: 21 }}>{m.label}</div>
            ))}
          </div>
        )}

        {step.s === "sona" && (
          <div className="dht-x360-avatar-sona" style={{ position: "absolute", left: 700, top: 40, width: 520 }}>
            <div style={{ fontSize: 24, textShadow: SHADOW, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 14, opacity: 0.85, textShadow: SHADOW, marginBottom: 14, minHeight: 18 }}>{note || (found === null ? t("lookingInDownloads") : found.length ? t("pickFileExported") : t("noExportedAvatarFound"))}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sonaItems.slice(Math.max(0, sonaSel - 5), Math.max(0, sonaSel - 5) + 7).map((it) => {
                const on = it === sonaItems[sonaSel];
                return (
                  <div key={it.label + it.sub} data-selected={on} style={{ ...tile(on), padding: "8px 18px", minHeight: 58 }}>
                    <div style={{ fontSize: 19, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</div>
                    <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.25 }}>{it.sub}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 12, textShadow: SHADOW }}>{t("sonaDisclaimer")}</div>
          </div>
        )}
        {(step.s === "grid" || step.s === "options") && (
          <div style={{ position: "absolute", left: 770, top: 46, width: 400, textAlign: "center", textShadow: SHADOW }}>
            <div style={{ fontSize: 24 }}>{title}</div>
            <div style={{ fontSize: 15, opacity: 0.85, minHeight: 20 }}>{subtitle}</div>
          </div>
        )}
        {step.s === "grid" && <Grid items={cats.map((c) => ({ label: c.label, color: c.colors?.[spec[c.key]], thumb: c.colors ? undefined : () => avatarThumb(spec, c.framing) }))} sel={gridSel} />}
        {step.s === "options" && cat && <Grid items={Array.from({ length: count }, (_, v) => ({ label: optionName(cat, v), color: cat.colors?.[v], thumb: cat.colors ? undefined : () => avatarThumb({ ...kept, [cat.key]: v }, cat.framing), check: v === kept[cat.key] }))} sel={optSel} />}

        {/* legend */}
        {step.s !== "intro" && (
          <div style={{ position: "absolute", left: 64, top: 650, display: "flex", gap: 30, alignItems: "center", fontSize: 17, textShadow: SHADOW }}>
            <Legend img={legend["legend-a"]} letter="A" color="#3fb83f" text={t("select")} />
            {step.s === "lineup" && <Legend img={legend["legend-x"]} letter="X" color="#2f6fc4" text={t("moreChoices")} />}
            <Legend img={legend["legend-b"]} letter="B" color="#d23a2a" text={step.s === "menu" ? (firstRun ? t("saveAndExit") : t("exit")) : step.s === "lineup" && firstRun ? t("skip") : t("back")} />
          </div>
        )}
      </div>

      {step.s === "intro" && <Intro />}
    </div>
  );
}

/** Up/down/left/right in a 3-wide grid of `n`, paged by 9; L1/R1 turn the page. */
function gridNav(i: number, n: number, k: Press["btn"]): number | undefined {
  const page = Math.floor(i / 9);
  const pos = i % 9;
  let to: number;
  if (k === "left") to = pos % 3 === 0 ? (page > 0 ? i - 7 : i) : i - 1;
  else if (k === "right") to = pos % 3 === 2 || i + 1 >= n ? ((page + 1) * 9 < n ? Math.min(n - 1, (page + 1) * 9 + Math.floor(pos / 3) * 3) : i) : i + 1;
  else if (k === "up") to = pos >= 3 ? i - 3 : i;
  else if (k === "down") to = pos < 6 && i + 3 < n ? i + 3 : i;
  else if (k === "l1") to = page > 0 ? (page - 1) * 9 : i;
  else if (k === "r1") to = (page + 1) * 9 < n ? (page + 1) * 9 : i;
  else return undefined;
  return Math.max(0, Math.min(n - 1, to));
}

function optionName(c: Cat, v: number) {
  if (c.names) return c.names[v] ?? "";
  return t("colorNumber", { val: v + 1 });
}

type Item = { label: string; color?: number; thumb?: () => string; check?: boolean };
/** The 3×3 page of choices with its arrows and page count; thumbnails render one at a time so moving stays quick. */
function Grid({ items, sel }: { items: Item[]; sel: number }) {
  const page = Math.floor(sel / 9);
  const pages = Math.max(1, Math.ceil(items.length / 9));
  const shown = items.slice(page * 9, page * 9 + 9);
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const sig = useMemo(() => shown.map((it) => it.label + (it.color ?? "")).join("|") + page, [shown, page]);
  const thumbFns = useRef(shown);
  thumbFns.current = shown;
  useEffect(() => {
    setThumbs({});
    let i = 0;
    let t = 0;
    const next = () => {
      const it = thumbFns.current[i];
      if (!it) return;
      if (it.thumb) {
        const url = it.thumb();
        const at = i;
        setThumbs((m) => ({ ...m, [at]: url }));
      }
      i++;
      t = window.setTimeout(next, 16);
    };
    t = window.setTimeout(next, 30);
    return () => clearTimeout(t);
  }, [sig]);
  const arrow = (dir: -1 | 1, on: boolean): CSSProperties => ({ position: "absolute", top: 130 + 168, [dir < 0 ? "left" : "right"]: -40, width: 0, height: 0, borderTop: "22px solid transparent", borderBottom: "22px solid transparent", [dir < 0 ? "borderRight" : "borderLeft"]: "20px solid rgba(40,60,90,.85)", opacity: on ? 1 : 0.25 });
  return (
    <div style={{ position: "absolute", left: 800, top: 0, width: 340, height: 720 }}>
      <div style={arrow(-1, page > 0)} />
      <div style={arrow(1, page < pages - 1)} />
      <div style={{ position: "absolute", left: 0, top: 120, display: "grid", gridTemplateColumns: "repeat(3, 104px)", gap: 14 }}>
        {shown.map((it, j) => {
          const on = page * 9 + j === sel;
          return (
            <div key={j} data-selected={on} style={{ ...tile(on), width: 104, height: 104, padding: 0, overflow: "hidden", position: "relative", transform: on ? "scale(1.12)" : "none", zIndex: on ? 2 : 1, transition: "transform 120ms" }}>
              {it.color !== undefined ? (
                <div style={{ position: "absolute", inset: 8, background: hex(it.color), boxShadow: "inset 0 0 0 1px rgba(0,0,0,.25), inset 0 8px 14px rgba(255,255,255,.25)" }} />
              ) : thumbs[j] ? (
                <img src={thumbs[j]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 6, textAlign: "center", fontSize: 13, color: "#334" }}>{it.label}</div>
              )}
              {it.check && <div style={{ position: "absolute", right: 5, bottom: 5, width: 20, height: 20, borderRadius: "50%", background: "#6bb120", color: "#fff", fontSize: 14, lineHeight: "20px", textAlign: "center", fontWeight: 700 }}>✓</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 120 + 3 * 118 + 16, width: 340, textAlign: "center", fontSize: 14, opacity: 0.75, textShadow: SHADOW }}>{t("pageOf", { page: page + 1, pages })}</div>
    </div>
  );
}

function tile(on: boolean): CSSProperties {
  return {
    boxSizing: "border-box",
    background: on ? "linear-gradient(180deg, #9ad83a, #5fa318)" : "linear-gradient(180deg, rgba(235,240,246,.92), rgba(196,206,218,.88))",
    color: on ? "#fff" : "#2a3340",
    border: on ? "3px solid #d6ff8a" : "3px solid rgba(70,82,98,.75)",
    borderRadius: 6,
    boxShadow: on ? "0 0 18px rgba(170,255,80,.6), 0 6px 14px rgba(0,0,0,.35)" : "0 4px 10px rgba(0,0,0,.3)",
    textShadow: on ? "0 1px 2px rgba(0,0,0,.4)" : "none",
  };
}

function Legend({ img, letter, color, text }: { img?: string; letter: string; color: string; text: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {img ? <img src={img} style={{ width: 28, height: 28 }} /> : <span style={{ width: 24, height: 24, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${color} 60%)`, color: "#000", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</span>}
      {text}
    </span>
  );
}

/** The NXE's first-run intro, redrawn: a white flight through drifting colour, the green light-lines, then the sphere rising with its orange rim before the white flash. */
function Intro() {
  const dots = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ a: (i * 137.5) % 360, d: 0.2 + ((i * 53) % 100) / 120, c: ["#f2a01e", "#6bb120", "#d23a2a", "#2f6fc4", "#c85aa0", "#ffffff"][i % 6], s: 10 + ((i * 29) % 30), delay: ((i * 17) % 100) / 100 })), []);
  const lines = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ r: (i * 47) % 180, w: 1 + (i % 3), delay: (i % 7) * 0.12 })), []);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5, overflow: "hidden", background: "#fff", animation: "dhtNxeIntroBg 5.2s linear forwards" }}>
      <style>{`
@keyframes dhtNxeIntroBg { 0% { background: #000 } 6% { background: #f4f7fa } 32% { background: #dfe9f2 } 36% { background: #0f3a12 } 66% { background: #123f14 } 70% { background: #1d4a1a } 92% { background: #20381c } 96% { background: #fff } 100% { background: #fff } }
@keyframes dhtNxeDot { from { transform: translate(-50%,-50%) rotate(var(--a)) translateX(0) scale(.2); opacity: 0 } 20% { opacity: 1 } to { transform: translate(-50%,-50%) rotate(var(--a)) translateX(var(--d)) scale(2.6); opacity: 0 } }
@keyframes dhtNxePhaseA { 0%, 30% { opacity: 1 } 34%, 100% { opacity: 0 } }
@keyframes dhtNxePhaseB { 0%, 33% { opacity: 0 } 37%, 66% { opacity: 1 } 70%, 100% { opacity: 0 } }
@keyframes dhtNxePhaseC { 0%, 66% { opacity: 0 } 70%, 92% { opacity: 1 } 96%, 100% { opacity: 0 } }
@keyframes dhtNxeLine { from { transform: translate(-50%,-50%) rotate(var(--r)) scaleX(.1); opacity: 0 } 30% { opacity: .9 } to { transform: translate(-50%,-50%) rotate(calc(var(--r) + 40deg)) scaleX(1.4); opacity: 0 } }
@keyframes dhtNxeSphere { from { transform: translate(-50%, 30%) scale(.8) } to { transform: translate(-50%, -8%) scale(1.15) } }
@keyframes dhtNxeFlash { 0%, 90% { opacity: 0 } 96% { opacity: 1 } 100% { opacity: 0 } }
`}</style>
      <div style={{ position: "absolute", inset: 0, animation: "dhtNxePhaseA 5.2s linear forwards" }}>
        <div style={{ position: "absolute", left: "-10%", right: "-10%", top: "55%", height: "60%", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 0%, #ffffff, #c9d6e2 60%, transparent 70%)" }} />
        {dots.map((d, i) => (
          <div key={i} style={{ position: "absolute", left: "50%", top: "52%", width: d.s, height: d.s, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${d.c} 60%)`, filter: "blur(1px)", ["--a" as string]: `${d.a}deg`, ["--d" as string]: `${d.d * 70}vw`, animation: `dhtNxeDot 1.6s ease-in ${d.delay}s infinite` } as CSSProperties} />
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, animation: "dhtNxePhaseB 5.2s linear forwards", background: "radial-gradient(ellipse at 50% 60%, #2f7a1e, #0f3a12 70%)" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: "120vw", height: l.w, background: "linear-gradient(90deg, transparent, #8cff4a, transparent)", boxShadow: "0 0 8px #6bff2a", ["--r" as string]: `${l.r}deg`, animation: `dhtNxeLine 1.4s ease-out ${1.8 + l.delay}s infinite` } as CSSProperties} />
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, animation: "dhtNxePhaseC 5.2s linear forwards", background: "radial-gradient(ellipse at 50% 30%, #2d5a22, #10200e 75%)" }}>
        <div style={{ position: "absolute", left: "50%", top: "62%", width: "120vh", height: "120vh", borderRadius: "50%", background: "radial-gradient(circle at 50% 35%, #f2f2f2, #b9bec4 55%, #7d848c 75%)", boxShadow: "0 -6px 0 2px #ff9a2a, 0 -16px 40px 8px rgba(255,150,40,.7), 0 -40px 90px 20px rgba(140,255,60,.35)", animation: "dhtNxeSphere 5.2s ease-out forwards" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", animation: "dhtNxeFlash 5.2s linear forwards" }} />
    </div>
  );
}

const SHADOW = "0 1px 3px rgba(10,20,40,.55)";
const BG = [
  "radial-gradient(ellipse 45% 22% at 22% 48%, rgba(255,140,40,.95), rgba(255,140,40,0))",
  "radial-gradient(ellipse 40% 16% at 78% 50%, rgba(170,200,255,.6), rgba(170,200,255,0))",
  "linear-gradient(180deg, #4b5a6e 0%, #7e8da0 30%, #c8c2bc 46%, #eef0f2 50%, #a9b7c8 56%, #5f6e82 78%, #3a4656 100%)",
].join(", ");
