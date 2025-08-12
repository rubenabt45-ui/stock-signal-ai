
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
    // Ensure initialization completes immediately
    load: 'languageOnly',
    cleanCode: true,
    initImmediate: false,
    // Add namespace support
    ns: ['translation'],
    defaultNS: 'translation',
    // Add missing common translations directly to prevent raw keys
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.warn(`Missing translation: ${lng}.${ns}.${key}`);
      return fallbackValue || key.split('.').pop() || key;
    }
  });

// Log configuration for debugging
console.log('i18n config:', {
  lng: i18n.language,
  fallbackLng: i18n.options.fallbackLng,
  supportedLngs: i18n.options.supportedLngs,
  load: i18n.options.load,
  ns: i18n.options.ns,
  defaultNS: i18n.options.defaultNS,
  resources: Object.keys(resources)
});

export default i18n;
