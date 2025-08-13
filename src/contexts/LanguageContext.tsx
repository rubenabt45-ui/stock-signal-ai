import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import i18n from '@/i18n/config';
import { createContextGuard } from '@/utils/providerGuards';

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

const languageGuard = createContextGuard('LanguageProvider', 'useLanguage');

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  return languageGuard(context);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

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
            if (import.meta.env.DEV) {
              console.warn('Could not fetch user language preference:', dbError);
            }
          }
        }

        // 3. Apply the language using the singleton instance
        if (i18n.language !== targetLanguage) {
          if (import.meta.env.DEV) {
            console.log('[i18n] Initializing language to:', targetLanguage);
          }
          await i18n.changeLanguage(targetLanguage);
        }
        setCurrentLanguage(targetLanguage);
        
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Language initialization error:', error);
        }
        // Fallback to English
        setCurrentLanguage('en');
        try {
          await i18n.changeLanguage('en');
        } catch (fallbackError) {
          if (import.meta.env.DEV) {
            console.error('Failed to set fallback language:', fallbackError);
          }
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
      if (import.meta.env.DEV) {
        console.log('[i18n] Language changed to:', lng);
      }
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
      return Promise.reject(new Error(`Language "${language}" is not supported`));
    }

    try {
      if (import.meta.env.DEV) {
        console.log('[i18n] Changing language to:', language);
      }
      
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
          if (import.meta.env.DEV) {
            console.warn('Failed to save language preference to database:', dbError);
          }
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Language Change Failed",
        description: `Could not change interface language: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
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
