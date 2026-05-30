import translations from './translations.json';

export type Language = 'pl';

const SUPPORTED_LANGUAGES: Language[] = ['pl'];

export function normalizeLanguage(value: string | null | undefined): Language {
  return 'pl';
}

export function pickLocalizedName(language: Language, value: { name: string; namePL?: string | null } | null | undefined): string {
  if (!value) return '';
  return value.namePL?.trim() || value.name;
}

export function getTranslations(language: Language) {
  return translations['pl']; // Hardcode 'pl'
}
