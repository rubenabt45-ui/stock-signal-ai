import i18n from '@/i18n/config';

/**
 * Language Utilities for TradeIQ
 * Provides helper functions for managing translations and adding new languages
 */

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Available languages configuration
export const SUPPORTED_LANGUAGES: Language[] = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English' 
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español' 
  }
];

/**
 * Get language by code
 */
export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

/**
 * Check if a language is supported
 */
export const isLanguageSupported = (code: string): boolean => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
};

/**
 * Get the default language
 */
export const getDefaultLanguage = (): Language => {
  return SUPPORTED_LANGUAGES[0]; // English as default
};

/**
 * Format language display name
 */
export const formatLanguageDisplay = (code: string): string => {
  const language = getLanguageByCode(code);
  return language ? `${language.nativeName} (${language.name})` : code.toUpperCase();
};

/**
 * Get saved language from localStorage with fallback
 */
export const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem('tiq_lang');
    return saved && isLanguageSupported(saved) ? saved : 'en';
  } catch (error) {
    console.warn('[i18n] Could not access localStorage for language:', error);
    return 'en';
  }
};

/**
 * Save language to localStorage safely
 */
export const saveLanguage = (code: string): void => {
  try {
    if (isLanguageSupported(code)) {
      localStorage.setItem('tiq_lang', code);
    }
  } catch (error) {
    console.warn('[i18n] Could not save language to localStorage:', error);
  }
};

/**
 * Change language using the singleton instance
 */
export const changeLanguageSafely = async (code: string): Promise<boolean> => {
  try {
    if (!isLanguageSupported(code)) {
      console.warn('[i18n] Unsupported language code:', code);
      return false;
    }
    
    await i18n.changeLanguage(code);
    saveLanguage(code);
    console.log('[i18n] Language changed successfully to:', code);
    return true;
  } catch (error) {
    console.error('[i18n] Failed to change language:', error);
    return false;
  }
};
