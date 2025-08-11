
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Don't wait for i18n to be "ready" - initialize immediately
    const initializeLanguage = async () => {
      try {
        // Set initial language from i18n or fallback to 'en'
        const initialLang = i18n.language || 'en';
        setCurrentLanguage(initialLang);

        if (user?.id) {
          // Try to get user's language preference from database
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('language')
            .eq('id', user.id)
            .single();

          if (profile?.language && AVAILABLE_LANGUAGES.some(lang => lang.code === profile.language)) {
            if (i18n.changeLanguage) {
              await i18n.changeLanguage(profile.language);
              setCurrentLanguage(profile.language);
            }
            setInitialized(true);
            return;
          }
        }

        // Fallback to localStorage or default
        const storedLanguage = localStorage.getItem('i18nextLng');
        const targetLanguage = storedLanguage && AVAILABLE_LANGUAGES.some(lang => lang.code === storedLanguage) 
          ? storedLanguage 
          : 'en';

        if (i18n.changeLanguage) {
          await i18n.changeLanguage(targetLanguage);
        }
        setCurrentLanguage(targetLanguage);
        setInitialized(true);
        
      } catch (error) {
        console.error('Language initialization error:', error);
        // Fallback to English and continue
        setCurrentLanguage('en');
        setInitialized(true);
      }
    };

    initializeLanguage();
  }, [user?.id, i18n]);

  // Listen to i18n language changes only if i18n is available and has the methods
  useEffect(() => {
    if (!i18n || typeof i18n.on !== 'function' || typeof i18n.off !== 'function') {
      return;
    }

    const handleLanguageChange = (lng: string) => {
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
    if (!i18n || typeof i18n.changeLanguage !== 'function') {
      toast({
        title: "Language Change Failed",
        description: "Translation system not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Change language immediately
      await i18n.changeLanguage(language);
      
      // Save to localStorage
      localStorage.setItem('i18nextLng', language);

      if (user?.id) {
        // Try to save to database, but don't fail if it doesn't work
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
          console.log('Database save failed (non-critical):', dbError);
        }
      }

      // Show visual feedback
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
