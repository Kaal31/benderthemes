import { useCallback } from "react";
import languages, { TranslationKey } from "./languages";

export type { TranslationKey };
export type Language = keyof typeof languages;

/** Steam and browser locale identifiers use different case and separator conventions. */
export function normalizeLanguage(locale: unknown): Language {
  if (typeof locale !== "string") return "en";
  const normalized = locale.trim().replace(/_/g, "-").toLowerCase();
  return normalized === "pt-br" || normalized === "ptbr" || normalized === "brazilian" ? "ptBr" : "en";
}

export function getCurrentLanguage(): Language {
  try {
    return normalizeLanguage(typeof window !== "undefined" ? (window as any).LocalizationManager?.m_rgLocalesToUse?.[0] : undefined);
  } catch {
    return "en";
  }
}

/** English is the fallback catalog; literal labels used by existing theme options stay readable. */
export function t(key: TranslationKey | (string & {}), params?: Record<string, string | number>): string {
  const language = getCurrentLanguage();
  const catalog = languages[language] as Record<string, string | undefined>;
  const english = languages.en as Record<string, string | undefined>;
  const lookup = (source: Record<string, string | undefined>) => Object.prototype.hasOwnProperty.call(source, key) ? source[key] : undefined;
  const text = lookup(catalog) || lookup(english) || key;
  return params ? text.replace(/\{(\w+)\}/g, (placeholder, name: string) => Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : placeholder) : text;
}

/** Resolve the current locale on each render rather than retaining the mount-time locale. */
export function useLocalization() {
  return useCallback(t, []);
}

export const lang = t;
export default t;
