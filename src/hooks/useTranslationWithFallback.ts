
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18n from '@/i18n/config';
import { getFallbackTranslation } from '@/utils/i18n-fallback';

export const useTranslationWithFallback = () => {
  const { t, i18n: hookI18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const tWithFallback = (key: string, options?: any): string => {
    try {
      // First try to get the translation
      const translation = t(key, options);
      const translationStr = typeof translation === 'string' ? translation : String(translation);
      
      // If translation returns the key itself (no translation found) or is empty, use fallback
      if ((translationStr === key || !translationStr || translationStr.trim() === '')) {
        const fallback = getFallbackTranslation(key);
        if (fallback !== key) {
          console.warn(`[i18n] Using fallback for missing translation key: ${key}`);
          return fallback;
        }
        
        console.warn(`[i18n] No translation or fallback found for key: ${key}`);
        return key.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || key;
      }
      
      return translationStr;
    } catch (error) {
      console.error(`[i18n] Translation error for key: ${key}`, error);
      return getFallbackTranslation(key);
    }
  };

  return { 
    t: tWithFallback, 
    i18n, 
    ready: true,
    // Helper function to check if a key exists
    hasKey: (key: string) => {
      const translation = t(key);
      return translation !== key && translation && translation.trim() !== '';
    }
  };
};
