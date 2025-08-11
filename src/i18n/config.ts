
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    debug: false,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'tiq_lang',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    // Ensure initialization completes
    load: 'languageOnly',
    cleanCode: true,
    initImmediate: false,
    // Add namespace support
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;
