import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/i18n/config';
import { useAuth } from '@/contexts/auth/auth.provider';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load user's preferred language from profile or localStorage
  useEffect(() => {
    const loadLanguage = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('preferred_language')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error loading user language preference:', error);
          } else if (data?.preferred_language) {
            const savedLang = data.preferred_language;
            setLanguageState(savedLang);
            i18n.changeLanguage(savedLang);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

      // Fallback to localStorage or browser language
      const savedLang = localStorage.getItem('language') || navigator.language.split('-')[0];
      const supportedLang = ['en', 'es'].includes(savedLang) ? savedLang : 'en';
      setLanguageState(supportedLang);
      i18n.changeLanguage(supportedLang);
      setLoading(false);
    };

    loadLanguage();
  }, [user]);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);

    // Save to user profile if logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ preferred_language: lang })
          .eq('id', user.id);

        if (error) {
          console.error('Error saving language preference:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};
