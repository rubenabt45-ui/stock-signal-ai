
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getFallbackTranslation } from '@/utils/i18n-fallback';

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

// Missing key handler that matches i18next's expected signature
const handleMissingTranslation = (
  lngs: readonly string[], 
  ns: string, 
  key: string, 
  fallbackValue: string
): void => {
  if (import.meta.env.DEV) {
    console.warn(`[i18n] Missing translation: ${lngs[0]}.${ns}.${key}`);
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
      debug: false, // Always disable debug in production
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
      load: 'languageOnly',
      cleanCode: true,
      initImmediate: false,
      ns: ['translation'],
      defaultNS: 'translation',
      missingKeyHandler: handleMissingTranslation
    });
}

// Only log in development
if (import.meta.env.DEV) {
  console.log('[i18n] Configuration initialized:', {
    lng: i18n.language,
    supportedLngs: i18n.options.supportedLngs,
    resources: Object.keys(resources)
  });
}

export default i18n;
