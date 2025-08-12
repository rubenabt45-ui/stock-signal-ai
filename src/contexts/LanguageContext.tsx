
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import i18n from '@/i18n/config';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  availableLanguages: { code: string; name: string; }[];
}

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n: hookI18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Diagnostic logging
  console.log('[i18n] Diagnosis - config i18n:', typeof i18n, i18n && Object.keys(i18n));
  console.log('[i18n] Diagnosis - hook i18n:', typeof hookI18n, hookI18n && Object.keys(hookI18n));
  console.log('[i18n] Are they the same instance?', i18n === hookI18n);
  console.log('[i18n] Current config:', {
    language: i18n.language,
    isInitialized: i18n.isInitialized,
    supportedLngs: i18n.options.supportedLngs,
    fallbackLng: i18n.options.fallbackLng,
    defaultNS: i18n.options.defaultNS,
    ns: i18n.options.ns
  });

  // Initialize language from localStorage, user profile, or browser
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        let targetLanguage = 'en';

        // 1. Try localStorage first
        const storedLanguage = localStorage.getItem('tiq_lang');
        if (storedLanguage && AVAILABLE_LANGUAGES.some(lang => lang.code === storedLanguage)) {
          targetLanguage = storedLanguage;
        }

        // 2. If user is authenticated, try to get preference from database
        if (user?.id) {
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('language')
              .eq('id', user.id)
              .single();

            if (profile?.language && AVAILABLE_LANGUAGES.some(lang => lang.code === profile.language)) {
              targetLanguage = profile.language;
              // Update localStorage to match user preference
              localStorage.setItem('tiq_lang', profile.language);
            }
          } catch (dbError) {
            console.warn('Could not fetch user language preference:', dbError);
          }
        }

        // 3. Apply the language using the singleton instance
        if (i18n.language !== targetLanguage) {
          console.log('[i18n] Initializing language to:', targetLanguage);
          await i18n.changeLanguage(targetLanguage);
        }
        setCurrentLanguage(targetLanguage);
        
      } catch (error) {
        console.error('Language initialization error:', error);
        // Fallback to English
        setCurrentLanguage('en');
        try {
          await i18n.changeLanguage('en');
        } catch (fallbackError) {
          console.error('Failed to set fallback language:', fallbackError);
        }
      }
    };

    // Only initialize if i18n is ready
    if (i18n.isInitialized) {
      initializeLanguage();
    }
  }, [user?.id]);

  // Listen to i18n language changes using the singleton instance
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('[i18n] Language changed to:', lng);
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = async (language: string) => {
    if (!AVAILABLE_LANGUAGES.some(lang => lang.code === language)) {
      console.error('[i18n] Unsupported language:', language);
      toast({
        title: "Language Change Failed",
        description: `Language "${language}" is not supported`,
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('[i18n] Changing language to:', language);
      console.log('[i18n] Using i18n instance:', typeof i18n, 'hasChangeLanguage:', typeof i18n.changeLanguage);
      
      // Use the singleton instance directly
      await i18n.changeLanguage(language);
      
      // Save to localStorage
      localStorage.setItem('tiq_lang', language);

      // Save to database if user is authenticated
      if (user?.id) {
        try {
          await supabase
            .from('user_profiles')
            .upsert({ 
              id: user.id, 
              language 
            }, {
              onConflict: 'id'
            });
        } catch (dbError) {
          console.warn('Failed to save language preference to database:', dbError);
        }
      }

      // Show success feedback
      const languageName = AVAILABLE_LANGUAGES.find(l => l.code === language)?.name;
      toast({
        title: "🌐 Language Updated",
        description: `Interface language changed to ${languageName}`,
        duration: 2000,
      });
      
    } catch (error) {
      console.error('[i18n] Language change failed:', error);
      toast({
        title: "Language Change Failed",
        description: `Could not change interface language: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
