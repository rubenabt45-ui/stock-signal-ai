
import React, { createContext, useContext, useEffect, useMemo } from 'react';
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

// Define available languages outside component to prevent re-creation
const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Memoize available languages to prevent dependency changes
  const availableLanguages = useMemo(() => AVAILABLE_LANGUAGES, []);

  // Load language from user_profiles on mount with proper error handling
  useEffect(() => {
    const loadUserLanguage = async () => {
      // Always start with default language
      const defaultLanguage = 'en';
      
      if (!user?.id) {
        console.log('🌐 No user found, using default language:', defaultLanguage);
        // Check localStorage for fallback
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
          console.log('🌐 Using saved language from localStorage:', savedLanguage);
          i18n.changeLanguage(savedLanguage);
        } else {
          console.log('🌐 Setting default language:', defaultLanguage);
          i18n.changeLanguage(defaultLanguage);
        }
        return;
      }

      try {
        console.log('🌐 Loading user language for user:', user.id);
        
        // Use .maybeSingle() instead of .single() to handle missing records gracefully
        const { data, error } = await supabase
          .from('user_profiles')
          .select('language')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.log('🌐 Error loading user language (non-critical):', error);
          // Fallback to default language
          console.log('🌐 Using fallback language:', defaultLanguage);
          i18n.changeLanguage(defaultLanguage);
          return;
        }

        if (data?.language && availableLanguages.some(lang => lang.code === data.language)) {
          console.log('🌐 Loaded user language successfully:', data.language);
          i18n.changeLanguage(data.language);
        } else {
          console.log('🌐 No user language found or invalid, using default:', defaultLanguage);
          i18n.changeLanguage(defaultLanguage);
        }
      } catch (error) {
        console.log('🌐 Exception loading user language (non-critical):', error);
        // Fallback to default language
        console.log('🌐 Using fallback language due to exception:', defaultLanguage);
        i18n.changeLanguage(defaultLanguage);
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
      console.log('🌐 Language changed to:', language);

      if (user?.id) {
        // Try to save to database, but don't fail if it doesn't work
        try {
          const { error } = await supabase
            .from('user_profiles')
            .upsert({ 
              id: user.id, 
              language 
            }, {
              onConflict: 'id'
            });

          if (error) {
            console.log('🌐 Could not save language to database (non-critical):', error);
          } else {
            console.log('🌐 Language saved to database successfully');
            toast({
              title: t('toasts.languageUpdated'),
              description: t('toasts.languageUpdated'),
            });
          }
        } catch (dbError) {
          console.log('🌐 Database save failed (non-critical):', dbError);
        }
      }
    } catch (error) {
      console.error('🌐 Error changing language:', error);
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
