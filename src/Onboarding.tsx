import { t } from "./i18n";
// First-run flow, shown once (setting `onboardingDone`, false only on a fresh install; updates keep it true).
// Welcome → pick a theme (the page takes on the highlighted theme's look) → done. Finishing selects the theme and plays
// its intro (its own boot sequence when it has one, else the generic reveal of themeIntro.tsx).
// B on the first step skips the setup and keeps the default theme.
import { HubLogo } from "./hubLogo";
import { useEffect, useMemo, useRef, useState } from "react";
import { pushModalInput } from "./input";
import { getSettings, THEMES, ThemeId, updateSettings } from "./settings";
import { hubStyle, hubThemeKey, hubVarsCss, HUB_DECO_CSS, HUB_STYLES } from "./hubStyles";
import { ensurePackInstalled, themeCatalog, themeDownloadProgress } from "./themePacks";
import { inventory } from "./Marketplace";
import { playThemeIntro } from "./themeIntro";
import { playSound } from "./steam";
import { loadLibrary } from "./library";
import { Img } from "./common";

const CHOICES = THEMES.filter((t) => t.id !== "frame" && t.id !== "native");

export function Onboarding() {
  const start = Math.max(0, CHOICES.findIndex((t) => t.id === getSettings().theme));
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(start);
  const [installed, setInstalled] = useState<Record<string, string> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [busy,setBusy]=useState(false), [error,setError]=useState(""),[progress,setProgress]=useState("");
  const installing=useRef(false);
  useEffect(()=>{if(!busy)return;const timer=setInterval(()=>{void themeDownloadProgress().then(p=>setProgress(`${p.percent}% · ${p.message}`)).catch(()=>{});},500);return()=>clearInterval(timer);},[busy]);
  useEffect(() => { let live = true; inventory().then((i) => live && setInstalled(i || {})).catch(() => live && setInstalled({})); return () => { live = false; }; }, []);
  useEffect(() => { listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: "nearest" }); }, [sel, step]);
  const chosen = CHOICES[sel];
  const isInstalled = (id: string) => !!installed?.[id];
  const finish = async (pick: boolean) => {
    if(installing.current)return;
    installing.current=true;setBusy(true);setError("");setProgress("Preparing download…");
    const theme = pick ? chosen.id : getSettings().theme;
    try{
      if(!isInstalled(theme)){
        const catalog=await themeCatalog(false);
        const pack=catalog.themes.find(p=>p.theme===theme);
        if(!pack)throw new Error("This theme is unavailable. Choose another theme or retry.");
        await ensurePackInstalled(pack);
      }
      updateSettings({ onboardingDone: true, theme: theme as ThemeId, activeTheme:"", enabled: true });
      playThemeIntro(theme, { fresh: true });
    }catch(e){setError(String(e));}finally{installing.current=false;setBusy(false);}
  };
  const act = useRef({ step, sel, finish });
  act.current = { step, sel, finish };
  useEffect(() => pushModalInput((p) => {
    if(installing.current)return true;
    const a = act.current;
    if (p.btn === "a" && !p.repeat) { playSound("select"); if (a.step < 2) setStep(a.step + 1); else a.finish(true); }
    else if (p.btn === "b" && !p.repeat) { playSound("back"); if (a.step === 0) a.finish(false); else setStep(a.step - 1); }
    else if (a.step === 1 && (p.btn === "up" || p.btn === "down")) { playSound("move"); setSel((i) => Math.max(0, Math.min(CHOICES.length - 1, i + (p.btn === "up" ? -1 : 1)))); }
    else if (a.step === 1 && (p.btn === "l1" || p.btn === "r1") && !p.repeat) setSel((i) => Math.max(0, Math.min(CHOICES.length - 1, i + (p.btn === "l1" ? -6 : 6))));
    return true;
  }), []);
  const s = getSettings();
  const sampleGames = useMemo(() => loadLibrary("all", "recent", 4).games.filter(g => !g.hidden).slice(0, 4), []);
  const previewTheme = step === 0 ? s.theme : chosen.id;
  // The Hub deliberately uses neutral styling for bonus themes; onboarding
  // previews their own registered palette without that console-only restriction.
  const shown = previewTheme === "x360" ? hubStyle(previewTheme, s.x360?.style) : HUB_STYLES[previewTheme];
  const key = previewTheme === "x360" ? hubThemeKey(previewTheme, s.x360?.style) : previewTheme;
  const go = () => {if(!installing.current){if(step<2)setStep(step+1);else void finish(true);}};
  return (
    <div className="dht-onboarding" data-hub-theme={key} data-step={step} data-motion={s.animations} role="dialog" aria-modal="true" aria-label={t("obWelcomeAria")}>
      {error&&<div role="alert" style={{position:"absolute",top:20,zIndex:5,color:"#ffc7c7"}}>{error}</div>}
      <style>{hubVarsCss()}{HUB_DECO_CSS}{ONBOARDING_CSS}</style>
      <div className="dht-hub-deco" data-deco={shown.deco} aria-hidden="true" />
      <div className="dht-ob-dots" aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} data-on={i <= step} />)}</div>
      {step === 0 && <section className="dht-ob-card dht-ob-welcome">
        <HubLogo className="dht-ob-logo" />
        <span className="dht-ob-eyebrow">DECK HOME THEMES</span>
        <h1>{t("obWelcomeTitle")}</h1>
        <p>{t("obWelcomeDesc")}</p>
        <button className="dht-ob-primary" onClick={go}>{t("obGetStarted")}</button>
        <small>{t("obWelcomePrompt")}</small>
      </section>}
      {step === 1 && <section className="dht-ob-pick">
        <header><span className="dht-ob-eyebrow">{t("obStep2Of3")}</span><h1>{t("obPickThemeTitle")}</h1></header>
        <div className="dht-ob-body">
          <div className="dht-ob-list" ref={listRef}>
            {CHOICES.map((choice, i) => <button key={choice.id} className="dht-ob-item" data-selected={i === sel} onClick={() => (i === sel ? setStep(2) : setSel(i))} onFocus={() => setSel(i)}>
              <strong>{choice.name}</strong><span>{!installed ? t("checkingDots") : !installed[choice.id] ? t("download") : t("obReady")}</span>
            </button>)}
          </div>
          <div className="dht-ob-preview">
            <div className="dht-ob-swatch" aria-label={t("obSwatchAria", { name: chosen.name })}>
              <div className="dht-ob-swatch-bar" />
              <div className="dht-ob-swatch-tiles">{sampleGames.length ? sampleGames.map(game =>
                <div key={game.appid} className="dht-ob-game" title={game.name}>
                  <Img srcs={game.art.portrait} className="dht-ob-game-cover" fit="contain" fallback={<div className="dht-ob-game-fallback">{game.name}</div>} />
                </div>) : <><i /><i /><i /><i /></>}</div>
            </div>
            {sampleGames.length > 0 && <small className="dht-ob-library-note">{t("obCoverExamples")}</small>}
            <h2>{chosen.name}</h2>
            <p>{chosen.blurb}</p>
            <small>{installed && !installed[chosen.id] ? t("obDownloadLaterNote") : t("obBuiltInNote")}</small>
            <button className="dht-ob-primary" onClick={() => setStep(2)}>{t("obChooseThemeBtn", { name: chosen.name })}</button>
          </div>
        </div>
        <footer>{t("obPickFooter")}</footer>
      </section>}
      {step === 2 && <section className="dht-ob-card dht-ob-done">
        <span className="dht-ob-eyebrow">{t("obAllSetEyebrow")}</span>
        <h1>{chosen.name}</h1>
        <p>{shown.tagline}</p>
        <p className="dht-ob-sub">{installed && !installed[chosen.id] ? t("obAllSetDownloadSub") : t("obAllSetIntroSub")}</p>
        <button className="dht-ob-primary" disabled={busy} onClick={() => void finish(true)}>{busy ? progress : installed && !installed[chosen.id] ? `Download ${chosen.name} & start` : t("obStart")}</button>
        <small>{t("obLaterHint")}</small>
        <small>{t("obStartBackPrompt")}</small>
      </section>}
    </div>
  );
}

const ONBOARDING_CSS = `
.dht-onboarding{position:absolute;inset:0;z-index:420;background:var(--dht-hub-bg);color:var(--dht-hub-text);font:16px var(--dht-hub-font);color-scheme:var(--dht-hub-scheme);overflow:hidden;display:grid;place-items:center;text-transform:var(--dht-hub-case);transition:background .35s}
.dht-onboarding *{box-sizing:border-box}.dht-onboarding>*:not(.dht-hub-deco){position:relative;z-index:1}.dht-onboarding>.dht-intro{position:absolute}
.dht-onboarding button{font:inherit;color:inherit;border:0;cursor:pointer;text-transform:inherit}.dht-onboarding button:focus-visible{outline:3px solid var(--dht-hub-accent);outline-offset:3px}
.dht-ob-dots{position:absolute!important;top:26px;left:0;right:0;display:flex;gap:10px;justify-content:center}.dht-ob-dots i{width:10px;height:10px;border-radius:50%;background:var(--dht-hub-line)}.dht-ob-dots i[data-on=true]{background:var(--dht-hub-accent)}
.dht-ob-logo{display:block;width:72px;height:72px;margin:0 auto 16px;filter:drop-shadow(0 4px 10px #0003)}
.dht-ob-eyebrow{font-size:11px;letter-spacing:2.5px;font-weight:700;color:var(--dht-hub-sub)}
.dht-onboarding h1{font-size:44px;letter-spacing:var(--dht-hub-track);margin:10px 0 14px}.dht-onboarding h2{font-size:28px;letter-spacing:var(--dht-hub-track);margin:18px 0 8px}.dht-onboarding p{color:var(--dht-hub-sub);line-height:1.6;font-size:15px;margin:0 0 12px;text-transform:none}.dht-onboarding small{display:block;color:var(--dht-hub-sub);font-size:11px;opacity:.85;text-transform:none}
.dht-ob-card{text-align:center;max-width:560px;padding:44px 48px;background:var(--dht-hub-panel);color:var(--dht-hub-card-text);border-radius:calc(var(--dht-hub-radius) * 1.6);box-shadow:var(--dht-hub-shadow),0 20px 60px #0004}.dht-ob-card p,.dht-ob-card small,.dht-ob-card .dht-ob-eyebrow{color:var(--dht-hub-card-sub)}.dht-ob-card small{margin-top:16px}
.dht-ob-primary{background:var(--dht-hub-accent);color:var(--dht-hub-accent-text)!important;border-radius:var(--dht-hub-pill);padding:14px 30px;font-weight:700;font-size:15px;margin-top:10px;box-shadow:var(--dht-hub-shadow)}
.dht-ob-pick{width:min(1040px,92vw);height:min(660px,88vh);display:flex;flex-direction:column}.dht-ob-pick header{padding-top:38px}.dht-ob-pick h1{font-size:34px;margin:6px 0 16px}.dht-ob-pick footer{font-size:11px;color:var(--dht-hub-sub);padding-top:12px;border-top:1px solid var(--dht-hub-line);margin-top:12px;text-transform:none}
.dht-ob-body{display:grid;grid-template-columns:320px 1fr;gap:34px;flex:1;min-height:0}.dht-ob-list{overflow:auto;display:flex;flex-direction:column;gap:8px;padding:6px 8px 8px 4px}
.dht-ob-preview .dht-ob-swatch{height:260px}.dht-ob-game{min-width:0;min-height:0;overflow:hidden;border-radius:var(--dht-hub-radius);background:var(--dht-hub-panel-hi)}.dht-ob-game-cover{display:block;width:100%;height:100%;object-fit:contain}.dht-ob-game-fallback{height:100%;display:grid;place-items:center;padding:12px;text-align:center;color:var(--dht-hub-text);font-size:14px}.dht-ob-library-note{margin-top:8px}
.dht-onboarding[data-hub-theme=onyx]{--dht-hub-bg:repeating-linear-gradient(135deg,#ffffff03 0 1px,transparent 1px 4px),radial-gradient(ellipse at 50% 20%,#27292c,#08090b);--dht-hub-panel:linear-gradient(#24262a,#111215);--dht-hub-panel-hi:#34373c;--dht-hub-accent:#eeeeef;--dht-hub-accent-text:#111;--dht-hub-ring:0 0 0 2px #ddd;--dht-hub-radius:18px;--dht-hub-pill:30px}
.dht-onboarding[data-hub-theme=silver] .dht-ob-swatch{background:repeating-linear-gradient(0deg,#ffffff33 0 1px,#00000005 1px 2px),linear-gradient(120deg,#e9e9e9,#a7a7a7,#f6f6f6);border-color:#aaa}
.dht-ob-item{display:flex;justify-content:space-between;align-items:center;text-align:left;padding:13px 16px;background:var(--dht-hub-panel);color:var(--dht-hub-card-text)!important;border-radius:var(--dht-hub-radius);box-shadow:var(--dht-hub-shadow);flex:none}.dht-ob-item span{font-size:10px;color:var(--dht-hub-card-sub)}.dht-ob-item[data-selected=true]{background:var(--dht-hub-panel-hi);box-shadow:var(--dht-hub-ring);transform:translateX(4px)}
.dht-ob-preview{padding:6px 4px;overflow:auto}.dht-ob-swatch{height:170px;border-radius:var(--dht-hub-radius);background:var(--dht-hub-panel);box-shadow:var(--dht-hub-shadow);padding:16px;display:flex;flex-direction:column;gap:14px;border:1px solid var(--dht-hub-line)}.dht-ob-swatch-bar{height:16px;width:46%;border-radius:var(--dht-hub-pill);background:var(--dht-hub-accent)}.dht-ob-swatch-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;flex:1}.dht-ob-swatch-tiles i{border-radius:var(--dht-hub-radius);background:var(--dht-hub-panel-hi);box-shadow:var(--dht-hub-shadow)}.dht-ob-swatch-tiles i:first-child{box-shadow:var(--dht-hub-ring)}
@media(max-width:850px){.dht-ob-body{grid-template-columns:230px 1fr;gap:18px}.dht-onboarding h1{font-size:34px}.dht-ob-card{padding:30px 26px}}
`;
