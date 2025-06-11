
import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  availableLanguages: { code: string; name: string; }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  // Load language from user_profiles on mount
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (!user?.id) {
        // If no user, check localStorage for fallback
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
          i18n.changeLanguage(savedLanguage);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('language')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading user language:', error);
          return;
        }

        if (data?.language && availableLanguages.some(lang => lang.code === data.language)) {
          i18n.changeLanguage(data.language);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadUserLanguage();
  }, [user?.id, i18n, availableLanguages]);

  const changeLanguage = async (language: string) => {
    try {
      // Change language immediately
      await i18n.changeLanguage(language);
      
      // Save to localStorage
      localStorage.setItem('i18nextLng', language);

      if (user?.id) {
        // Save to database
        const { error } = await supabase
          .from('user_profiles')
          .update({ language })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating language:', error);
          toast({
            title: t('toasts.languageUpdateFailed'),
            description: t('toasts.languageUpdateFailed'),
            variant: "destructive",
          });
        } else {
          toast({
            title: t('toasts.languageUpdated'),
            description: t('toasts.languageUpdated'),
          });
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        title: t('toasts.languageUpdateFailed'),
        description: t('toasts.languageUpdateFailed'),
        variant: "destructive",
      });
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage: i18n.language,
      changeLanguage,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
