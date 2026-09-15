import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "./en";
import { fr } from "./fr";

export const LANGUAGES = ["en", "fr"] as const;
export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = "pulseboard.language.v1";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    supportedLngs: LANGUAGES,
    fallbackLng: "en",
    // The dataset is US-denominated and the spec fixes the number formats, so
    // interpolation never reformats values; format.ts owns that.
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

/**
 * Keep `<html lang>` in step with the active language. Without this the document
 * stays lang="en" in French, which mis-cues screen reader pronunciation, `:lang()`
 * rules and browser translation prompts.
 */
function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language.split("-")[0];
}

syncDocumentLanguage(i18n.resolvedLanguage ?? "en");
i18n.on("languageChanged", syncDocumentLanguage);

/** Dates follow the active language; currency and percentages do not. */
export function dateLocale(language: string): string {
  return language.startsWith("fr") ? "fr-FR" : "en-US";
}

export default i18n;
