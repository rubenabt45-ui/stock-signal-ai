import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/auth.provider';
import { supabase } from '@/integrations/supabase/client';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const { user } = useAuth();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Load user's preferred theme from profile
  useEffect(() => {
    const loadTheme = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('preferred_theme')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error loading user theme preference:', error);
          } else if (data?.preferred_theme) {
            const savedTheme = data.preferred_theme as Theme;
            setThemeState(savedTheme);
            localStorage.setItem(storageKey, savedTheme);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    loadTheme();
  }, [user, storageKey]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);

    // Save to user profile if logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ preferred_theme: newTheme })
          .eq('id', user.id);

        if (error) {
          console.error('Error saving theme preference:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
