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
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    console.log('🌐 [TRANSLATION_DEBUG] LanguageProvider mounted');
    console.log('🌐 [TRANSLATION_DEBUG] Initial i18n language:', i18n.language);
    console.log('🌐 [TRANSLATION_DEBUG] User authenticated:', !!user?.id);
    
    const loadUserLanguage = async () => {
      try {
        if (user?.id) {
          console.log('🌐 [TRANSLATION_DEBUG] Loading language for user:', user.id);
          
          // Try to get user's language preference from database
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('language')
            .eq('id', user.id)
            .single();

          if (profile?.language && AVAILABLE_LANGUAGES.some(lang => lang.code === profile.language)) {
            console.log('🌐 [TRANSLATION_DEBUG] Found user language in database:', profile.language);
            await i18n.changeLanguage(profile.language);
            setCurrentLanguage(profile.language);
            return;
          }
        }

        // Fallback to localStorage or default
        const storedLanguage = localStorage.getItem('i18nextLng');
        const targetLanguage = storedLanguage && AVAILABLE_LANGUAGES.some(lang => lang.code === storedLanguage) 
          ? storedLanguage 
          : 'en';

        console.log('🌐 [TRANSLATION_DEBUG] Using language:', targetLanguage);
        console.log('🌐 [TRANSLATION_DEBUG] Source: localStorage =', storedLanguage);
        
        await i18n.changeLanguage(targetLanguage);
        setCurrentLanguage(targetLanguage);
        
      } catch (error) {
        console.error('🌐 [TRANSLATION_DEBUG] Error loading user language:', error);
        // Fallback to English
        await i18n.changeLanguage('en');
        setCurrentLanguage('en');
      }
    };

    loadUserLanguage();
  }, [user?.id, i18n]);

  // Listen to i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('🌐 [TRANSLATION_DEBUG] i18n language changed event:', lng);
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  const changeLanguage = async (language: string) => {
    console.log('🌐 [TRANSLATION_DEBUG] ====== LANGUAGE CHANGE INITIATED ======');
    console.log('🌐 [TRANSLATION_DEBUG] Previous language:', currentLanguage);
    console.log('🌐 [TRANSLATION_DEBUG] Requested language:', language);
    console.log('🌐 [TRANSLATION_DEBUG] Available languages:', AVAILABLE_LANGUAGES.map(l => l.code));
    console.log('🌐 [TRANSLATION_DEBUG] Current i18n language before change:', i18n.language);
    
    try {
      // Change language immediately
      await i18n.changeLanguage(language);
      console.log('🌐 [TRANSLATION_DEBUG] i18n.changeLanguage() completed successfully');
      console.log('🌐 [TRANSLATION_DEBUG] New i18n language:', i18n.language);
      
      // Save to localStorage
      localStorage.setItem('i18nextLng', language);
      console.log('🌐 [TRANSLATION_DEBUG] Language saved to localStorage:', language);
      console.log('🌐 [TRANSLATION_DEBUG] localStorage verification:', localStorage.getItem('i18nextLng'));

      if (user?.id) {
        // Try to save to database, but don't fail if it doesn't work
        try {
          console.log('🌐 [TRANSLATION_DEBUG] Attempting to save language to user profile...');
          const { error } = await supabase
            .from('user_profiles')
            .upsert({ 
              id: user.id, 
              language 
            }, {
              onConflict: 'id'
            });

          if (error) {
            console.log('🌐 [TRANSLATION_DEBUG] Could not save language to database (non-critical):', error);
          } else {
            console.log('🌐 [TRANSLATION_DEBUG] Language saved to database successfully');
          }
        } catch (dbError) {
          console.log('🌐 [TRANSLATION_DEBUG] Database save failed (non-critical):', dbError);
        }
      } else {
        console.log('🌐 [TRANSLATION_DEBUG] No user logged in, language only saved locally');
      }

      // Show visual feedback
      const languageName = AVAILABLE_LANGUAGES.find(l => l.code === language)?.name;
      toast({
        title: "🌐 Language Updated",
        description: `Interface language changed to ${languageName}`,
        duration: 2000,
      });
      
      console.log('🌐 [TRANSLATION_DEBUG] ====== LANGUAGE CHANGE COMPLETED ======');
      console.log('🌐 [TRANSLATION_DEBUG] Final state - currentLanguage:', language);
      console.log('🌐 [TRANSLATION_DEBUG] Final state - i18n.language:', i18n.language);
      
    } catch (error) {
      console.error('🌐 [TRANSLATION_DEBUG] Language change failed:', error);
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