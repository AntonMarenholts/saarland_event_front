// src/lib/i18n.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import deTranslation from "./locales/de.json";
import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

// Ресурсы с нашими переводами
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
  // Хук для определения языка в браузере
  .use(LanguageDetector)
  // Передает экземпляр i18n в react-i18next
  .use(initReactI18next)
  .init({
    resources,
    // Язык по умолчанию, если не удалось определить язык пользователя
    fallbackLng: "de", 
    interpolation: {
      escapeValue: false, // не нужно для React
    },
    detection: {
      // Порядок определения языка:
      // 1. localStorage (если пользователь уже выбирал язык на сайте)
      // 2. Язык браузера
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;