
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');
  const { user } = useAuth();
  const { toast } = useToast();

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ theme: newTheme })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating theme:', error);
          toast({
            title: "Theme update failed",
            description: "Failed to save theme preference.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Theme update error:', error);
      }
    }
  };

  useEffect(() => {
    const updateActualTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setActualTheme(systemTheme);
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateActualTheme);
      return () => mediaQuery.removeEventListener('change', updateActualTheme);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [actualTheme]);

  useEffect(() => {
    const fetchUserTheme = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('theme')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            // Type guard to ensure the theme value is valid
            const fetchedTheme = data.theme;
            if (fetchedTheme === 'light' || fetchedTheme === 'dark' || fetchedTheme === 'system') {
              setThemeState(fetchedTheme);
            }
          }
        } catch (error) {
          console.error('Error fetching user theme:', error);
        }
      }
    };

    fetchUserTheme();
  }, [user]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
