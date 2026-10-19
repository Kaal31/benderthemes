import { useState } from 'react';
import languages, { TranslationKey } from './languages';

export type { TranslationKey };

export function getCurrentLanguage(): keyof typeof languages {
  try {
    const steamLang =
      typeof window !== 'undefined'
        ? (window as any).LocalizationManager?.m_rgLocalesToUse?.[0]
        : undefined;

    if (!steamLang || typeof steamLang !== 'string') {
      return 'en';
    }

    const lang = steamLang.replace(/-([a-z])/g, (_, letter: string) =>
      letter.toUpperCase()
    ) as keyof typeof languages;

    return languages[lang] ? lang : 'en';
  } catch {
    return 'en';
  }
}

/**
 * Translates a key, with fallback to English and template parameter substitution.
 * Usable anywhere in the codebase (both React and non-React files).
 *
 * Example:
 *   t('play') -> 'Jogar'
 *   t('itemsCount', { count: 5 }) -> '5 itens'
 */
export function t(
  key: TranslationKey | (string & {}),
  params?: Record<string, string | number>
): string {
  const lang = getCurrentLanguage();
  let text = (languages[lang] as Record<string, string | undefined>)?.[key] || (languages.en as Record<string, string | undefined>)?.[key] || (key as string);

  if (params) {
    for (const [paramKey, paramVal] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
  }

  return text;
}

/**
 * React hook for localized strings, following the HLTB convention.
 */
export function useLocalization() {
  const [lang] = useState(getCurrentLanguage());
  return function (
    key: TranslationKey,
    params?: Record<string, string | number>
  ): string {
    let text =
      languages[lang]?.[key]?.length
        ? languages[lang]![key]!
        : languages.en?.[key]?.length
        ? languages.en[key]
        : (key as string);

    if (params) {
      for (const [paramKey, paramVal] of Object.entries(params)) {
        text = text.replace(
          new RegExp(`\\{${paramKey}\\}`, 'g'),
          String(paramVal)
        );
      }
    }

    return text;
  };
}

export const lang = t;
export default t;
