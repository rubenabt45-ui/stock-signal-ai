
import React, { createContext, useContext, useState, useEffect } from 'react';
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');
  const { user } = useAuth();
  const { toast } = useToast();

  // Load theme from user_profiles on mount
  useEffect(() => {
    const loadUserTheme = async () => {
      if (!user?.id) {
        // If no user, check localStorage for fallback
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('theme')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading user theme:', error);
          return;
        }

        if (data?.theme && ['light', 'dark', 'system'].includes(data.theme)) {
          setThemeState(data.theme as Theme);
          localStorage.setItem('theme', data.theme);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadUserTheme();
  }, [user?.id]);

  // Apply theme changes to document
  useEffect(() => {
    const applyTheme = () => {
      let resolvedTheme: 'light' | 'dark' = 'dark';

      if (theme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolvedTheme = theme;
      }

      setActualTheme(resolvedTheme);

      // Apply theme class to document
      const root = document.documentElement;
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }

      // Save to localStorage for persistence
      localStorage.setItem('theme', theme);
    };

    applyTheme();

    // Listen for system theme changes if theme is 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);

    // Save to localStorage immediately
    localStorage.setItem('theme', newTheme);

    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ theme: newTheme })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating theme:', error);
          toast({
            title: "Failed to save theme",
            description: "Theme applied locally but couldn't save to profile.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Theme updated",
            description: `Theme changed to ${newTheme}`,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
