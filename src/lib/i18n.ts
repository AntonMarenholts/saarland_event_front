import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import deTranslation from "./locales/de.json";
import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

const resources = {
  de: {
    translation: deTranslation,
  },
  en: {
    translation: enTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
};

i18n

  .use(LanguageDetector)

  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "de",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
