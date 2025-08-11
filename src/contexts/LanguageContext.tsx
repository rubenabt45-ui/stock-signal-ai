
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState('en');

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
            console.log('Could not fetch user language preference:', dbError);
          }
        }

        // 3. Apply the language
        if (i18n.language !== targetLanguage) {
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

    initializeLanguage();
  }, [user?.id, i18n]);

  // Listen to i18n language changes
  useEffect(() => {
    if (!i18n || typeof i18n.on !== 'function') {
      return;
    }

    const handleLanguageChange = (lng: string) => {
      console.log('i18n language changed to:', lng);
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      if (i18n && typeof i18n.off === 'function') {
        i18n.off('languageChanged', handleLanguageChange);
      }
    };
  }, [i18n]);

  const changeLanguage = async (language: string) => {
    if (!AVAILABLE_LANGUAGES.some(lang => lang.code === language)) {
      console.error('Unsupported language:', language);
      return;
    }

    try {
      console.log('Changing language to:', language);
      
      // Change language immediately
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
          console.log('Failed to save language preference to database:', dbError);
        }
      }

      // Show feedback
      const languageName = AVAILABLE_LANGUAGES.find(l => l.code === language)?.name;
      toast({
        title: "🌐 Language Updated",
        description: `Interface language changed to ${languageName}`,
        duration: 2000,
      });
      
    } catch (error) {
      console.error('Language change failed:', error);
      toast({
        title: "Language Change Failed",
        description: "Could not change interface language. Please try again.",
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
