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
 * Add a new language to the system
 * This utility function helps maintain consistency when adding new languages
 */
export const addLanguage = (language: Language): Language[] => {
  // Check if language already exists
  const exists = SUPPORTED_LANGUAGES.some(lang => lang.code === language.code);
  
  if (exists) {
    console.warn(`Language ${language.code} already exists`);
    return SUPPORTED_LANGUAGES;
  }
  
  return [...SUPPORTED_LANGUAGES, language];
};

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
 * Future languages that can be easily added:
 * 
 * French: { code: 'fr', name: 'French', nativeName: 'Français' }
 * German: { code: 'de', name: 'German', nativeName: 'Deutsch' }
 * Portuguese: { code: 'pt', name: 'Portuguese', nativeName: 'Português' }
 * Italian: { code: 'it', name: 'Italian', nativeName: 'Italiano' }
 * Japanese: { code: 'ja', name: 'Japanese', nativeName: '日本語' }
 * Chinese: { code: 'zh', name: 'Chinese', nativeName: '中文' }
 * Korean: { code: 'ko', name: 'Korean', nativeName: '한국어' }
 * Russian: { code: 'ru', name: 'Russian', nativeName: 'Русский' }
 * Arabic: { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
 * Hindi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
 */