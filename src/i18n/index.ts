import { el } from "@/i18n/el";
import { en, type TranslationKey } from "@/i18n/en";

export type Locale = "en" | "el";

const dictionaries: Record<Locale, TranslationKey> = {
  en,
  el,
};

export function getDictionary(locale: Locale): TranslationKey {
  return dictionaries[locale];
}
