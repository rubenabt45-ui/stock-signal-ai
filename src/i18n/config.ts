
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

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'es'],
      debug: import.meta.env.DEV, // Only enable debug in development
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
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation: ${lng}.${ns}.${key}`);
        }
        return fallbackValue || key.split('.').pop() || key;
      }
    });
}

// Log configuration for debugging only in development
if (import.meta.env.DEV) {
  console.log('[i18n] Final config:', {
    lng: i18n.language,
    fallbackLng: i18n.options.fallbackLng,
    supportedLngs: i18n.options.supportedLngs,
    load: i18n.options.load,
    ns: i18n.options.ns,
    defaultNS: i18n.options.defaultNS,
    isInitialized: i18n.isInitialized,
    resources: Object.keys(resources),
    hasChangeLanguage: typeof i18n.changeLanguage
  });
}

export default i18n;
