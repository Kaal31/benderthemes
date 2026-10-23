import {ThemeLoadingScreen} from "../ThemeLoadingScreen";
// Native API v1. This deliberately executes installed code in the plugin realm.
import * as React from "react";
import { Component, ReactNode, useEffect, useState } from "react";
import { activeTheme, themeFileUrl } from "./registry";
import { ThemeEntry } from "./manifest";
import { getSettings, updateSettings, useSettings } from "../settings";
import { useHome } from "../common";
import { Stage, ThemeRoot } from "../input";
import { Destination, openDestination } from "../destinations";
import { framePageRequest } from "./framePages";
import { useDownloads } from "../downloads";
import { playSound } from "../steam";

type Module = { Home: React.ComponentType<any>; pages?: Record<string, React.ComponentType<any>>; dispose?: () => void };
const cache = new Map<string, Promise<Module>>();
function load(theme: ThemeEntry): Promise<Module> {
  const native = theme.native;
  const url = native && themeFileUrl(theme, native.entry);
  if (!url || !native) return Promise.reject(new Error("Native layout is not installed or verified"));
  const key = `${theme.id}:${native.sha256}`;
  if (!cache.has(key)) {
    const request = (async () => {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("Cannot load native layout");
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > 8 * 1024 * 1024) throw new Error("Native entry too large");
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), b => b.toString(16).padStart(2, "0")).join("");
      if (hash !== native.sha256) throw new Error("Native layout checksum changed. Reinstall the package.");
      const host = Object.freeze({ api: 1, React, ThemeRoot, Stage, useHome, useSettings, getSettings, updateSettings,
        openDestination, playSound, asset: (path: string) => {
          if (typeof path !== "string" || !/^(?!\/)(?!.*(?:^|\/)\.\.?(?:\/|$))[\w .()&'+,-]+(?:\/[\w .()&'+,-]+)*$/.test(path)) throw new Error("Asset path must stay inside the theme");
          return themeFileUrl(theme, path);
        } });
      // Entry is a bundled factory body: return { Home, pages?, dispose? }.
      const module = new Function("host", '"use strict";\n' + new TextDecoder().decode(bytes))(host) as Module;
      if (!module || typeof module.Home !== "function" || (module.dispose !== undefined && typeof module.dispose !== "function")) throw new Error("Native API v1 entry must return { Home, pages?, dispose? }");
      return module;
    })();
    cache.set(key, request);
    request.catch(() => cache.delete(key));
  }
  return cache.get(key)!;
}

class NativeBoundary extends Component<{ children: ReactNode; reset: string }, { error: string }> {
  state = { error: "" };
  static getDerivedStateFromError(e: Error) { return { error: String(e) }; }
  render() { return this.state.error ? <Failure message={this.state.error}/> : this.props.children; }
}
function Failure({ message }: { message: string }) {
  return <div role="alert" style={{ position: "absolute", inset: 0, padding: 40, background: "#16202b", color: "white", zIndex: 10 }}><h2>Native layout could not load</h2><p>{message}</p><button onClick={() => updateSettings({ enabled: false })}>Return to Steam Home</button><p>Open ThemeHub to select another theme, reinstall, or restore the previous version.</p></div>;
}

export function NativeLayout({ destination, fallback, onClose }: { destination?: Destination; fallback?: ReactNode; onClose?: () => void }) {
  const settings = useSettings();
  const theme = activeTheme(settings);
  const [loaded, setLoaded] = useState<{ key: string; module: Module } | null>(null);
  const [error, setError] = useState("");
  const key = `${theme?.id}:${theme?.native?.sha256}`;
  useEffect(() => {
    let alive = true;
    setError("");
    if (theme?.native) void load(theme).then(module => { if (alive) setLoaded({ key, module }); }, e => { if (alive) setError(String(e)); });
    return () => { alive = false; };
  }, [key]);
  // Home owns lifecycle; page mounts share the same module.
  useEffect(() => {
    if (destination || loaded?.key !== key) return;
    const module = loaded?.module;
    return () => { try { module?.dispose?.(); } catch (e) { console.warn("Native theme cleanup failed", e); } cache.delete(key); };
  }, [key, loaded, !!destination]);
  if (!theme?.native) return <>{fallback ?? <Failure message="No installed native layout selected"/>}</>;
  if (error) return <Failure message={error}/>;
  if (loaded?.key !== key) return <ThemeLoadingScreen id={theme.id}/>;
  const View = destination ? loaded.module.pages?.[destination.place] : loaded.module.Home;
  if (!View) return <>{fallback}</>;
  return <NativeBoundary key={key + (destination?.place ?? "home")} reset={key}><NativeView View={View} theme={theme} destination={destination} onClose={onClose}/></NativeBoundary>;
}

function NativeView({ View, theme, destination, onClose }: { View: React.ComponentType<any>; theme: ThemeEntry; destination?: Destination; onClose?: () => void }) {
  const home = useHome();
  const downloads = useDownloads();
  return <View home={home} theme={theme} destination={destination} onClose={onClose}
    request={(operation: string, args: unknown = {}) => framePageRequest(operation, args, home, downloads)}/>;
}
