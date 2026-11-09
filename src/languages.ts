import en from './localizations/en.json';
import ptBr from './localizations/pt-br.json';

export type TranslationKey = keyof typeof en;
type Catalog = Partial<Record<TranslationKey, string>>;

const catalogs = {
  en,
  ptBr,
} as const;

// English defines all keys; missing translations fall back to English.
const languages = catalogs as Record<keyof typeof catalogs, Catalog> & {
  en: typeof en;
};

export default languages;
