import { Navigation } from "@decky/ui";
import { useState, useEffect, useRef } from "react";
import { SPOTLIGHT_PLUGINS } from "./spotlightCatalog";

export function openSpotlightProject(index: number) {
  const plugin = SPOTLIGHT_PLUGINS[index];
  if (plugin) Navigation.NavigateToSteamWeb(plugin.projectUrl);
}

export async function installSpotlightPlugin(index: number): Promise<string> {
  const plugin = SPOTLIGHT_PLUGINS[index];
  if (!plugin?.install) return "Installation is not available yet for this plugin.";
  const { pluginName, version, zipUrl } = plugin.install;
  const project = new URL(plugin.projectUrl);
  const zip = new URL(zipUrl);
  const repo = project.pathname.split("/").filter(Boolean).slice(0,2).join("/");
  if (project.origin !== "https://github.com" || zip.origin !== "https://github.com" || !zip.pathname.startsWith(`/${repo}/releases/download/`) || !zip.pathname.endsWith(".zip") || !pluginName || !version) throw new Error("This plugin needs a verified release ZIP before it can be installed.");
  if ((window as any).__isThemePreview) return "Preview: Decky would ask you to confirm this plugin installation.";
  const backend = (window as any).DeckyBackend ?? (window.opener as any)?.DeckyBackend;
  if (!backend?.call) throw new Error("Decky installation is unavailable in this window.");
  await backend.call("utilities/install_plugin", zipUrl, pluginName, version, "", 1);
  return "Continue in Decky's installation dialog. Decky will download and install the plugin after confirmation.";
}

export function PluginSpotlight({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setMessage(""); listRef.current?.querySelector<HTMLElement>('[data-selected="true"]')?.scrollIntoView({block:"nearest"}); }, [selected]);
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);
  const install = async () => { if(busy)return;setBusy(true);try{setMessage(await installSpotlightPlugin(selected));}catch(e){setMessage(String(e));}finally{setBusy(false);} };
  const current = SPOTLIGHT_PLUGINS[selected];
  return <section className="plugin-spotlight" aria-label="Plugin Spotlight">
    <style>{`.plugin-spotlight{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;padding:10px 2px 20px}.spotlight-intro{max-width:660px;margin-bottom:16px;flex-shrink:0}.spotlight-intro h2{font-size:30px;margin:0 0 10px}.spotlight-intro p{color:#a3adbd;line-height:1.7;margin:0}.spotlight-empty{border:1px solid #303845;border-radius:12px;padding:40px;background:linear-gradient(130deg,#1b2530,#121720);min-height:240px;display:flex;flex-direction:column;justify-content:center}.spotlight-empty span{font-size:34px;color:var(--accent);margin-bottom:18px}.spotlight-empty h3{font-size:22px;margin:0 0 10px}.spotlight-empty p{color:#a3adbd;max-width:520px;line-height:1.6;margin:0}.spotlight-layout{display:grid;grid-template-columns:1fr 1fr;gap:24px;flex:1;min-height:0}.spotlight-list{display:flex;flex-direction:column;gap:12px;overflow:auto;min-height:0;scroll-padding:4px}.spotlight-card{flex-shrink:0;text-align:left;background:#171c26;padding:22px;border:2px solid transparent!important;border-radius:10px}.spotlight-card[data-selected=true]{border-color:var(--accent)!important;background:#252e30}.spotlight-card strong{display:block;font-size:22px}.spotlight-card small{display:block;color:#a3adbd;margin:7px 0 12px}.spotlight-card p{font-size:14px;line-height:1.6;margin:0}.spotlight-detail{overflow:auto;min-height:0;padding:25px;border:1px solid #303845;border-radius:12px;background:#151b24}.spotlight-detail h3{font-size:24px;margin:0 0 20px}.spotlight-detail p{color:#a3adbd;line-height:1.7}.spotlight-detail a{display:block;color:var(--accent);margin:18px 0}.spotlight-detail button{margin-top:20px}`}</style>
    <div className="spotlight-intro"><h2>Plugin Spotlight</h2><p>A closer look at independent Decky plugins worth discovering, including projects built with AI assistance.</p></div>
    {!current ? <div className="spotlight-empty"><span aria-hidden="true">✦</span><h3>The first spotlight is coming soon.</h3><p>Featured plugins will appear here with a closer look at what they do and a link to their creators’ projects.</p></div> : <div className="spotlight-layout">
      <div className="spotlight-list" ref={listRef}>{SPOTLIGHT_PLUGINS.map((plugin, i) => <button key={plugin.id} className="spotlight-card" data-selected={i === selected} onClick={() => onSelect(i)} onFocus={() => onSelect(i)}><strong>{plugin.name}</strong><small>By {plugin.author}</small><p>{plugin.description}</p></button>)}</div>
      <div className="spotlight-detail"><h3>{current.name}</h3><p>{current.whyFeatured}</p>{current.aiAssisted && <><p>{current.aiAssisted.note}</p><a href={current.aiAssisted.sourceUrl} target="_blank" rel="noreferrer">Read the creator’s development notes ↗</a></>}<button className="market-primary" disabled={busy || !current.install} onClick={() => void install()}>{busy ? "Opening Decky…" : current.install ? `Install · ${current.install.version}` : "Coming soon"}</button><button className="market-remove" onClick={() => openSpotlightProject(selected)}>Visit project · X ↗</button><p>Decky will ask you to confirm before downloading and installing.</p>{message && <p role="status">{message}</p>}</div>
    </div>}
  </section>;
}
