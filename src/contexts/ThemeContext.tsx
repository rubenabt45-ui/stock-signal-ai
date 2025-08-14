
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth/auth.provider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createContextGuard } from '@/utils/providerGuards';
import { logger } from '@/utils/logger';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeGuard = createContextGuard('ThemeProvider', 'useTheme');

export function useTheme() {
  const context = useContext(ThemeContext);
  return themeGuard(context);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');
  const { user } = useAuth();
  const { toast } = useToast();

  // Load theme from user_profiles on mount with proper error handling
  useEffect(() => {
    const loadUserTheme = async () => {
      // Always start with default theme
      const defaultTheme: Theme = 'dark';
      
      if (!user?.id) {
        logger.debug('🎨 No user found, using default theme:', defaultTheme);
        // Check localStorage for fallback
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          logger.debug('🎨 Using saved theme from localStorage:', savedTheme);
          setThemeState(savedTheme);
        } else {
          logger.debug('🎨 Setting default theme:', defaultTheme);
          setThemeState(defaultTheme);
        }
        return;
      }

      try {
        logger.debug('🎨 Loading user theme for user:', user.id);
        
        // Use .maybeSingle() instead of .single() to handle missing records gracefully
        const { data, error } = await supabase
          .from('user_profiles')
          .select('preferred_theme')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          logger.debug('🎨 Error loading user theme (non-critical):', error);
          logger.debug('🎨 Using fallback theme:', defaultTheme);
          setThemeState(defaultTheme);
          localStorage.setItem('theme', defaultTheme);
          return;
        }

        if (data?.preferred_theme && ['light', 'dark', 'system'].includes(data.preferred_theme)) {
          logger.debug('🎨 Loaded user theme successfully:', data.preferred_theme);
          setThemeState(data.preferred_theme as Theme);
          localStorage.setItem('theme', data.preferred_theme);
        } else {
          logger.debug('🎨 No user theme found or invalid, using default:', defaultTheme);
          setThemeState(defaultTheme);
          localStorage.setItem('theme', defaultTheme);
        }
      } catch (error) {
        logger.debug('🎨 Exception loading user theme (non-critical):', error);
        logger.debug('🎨 Using fallback theme due to exception:', defaultTheme);
        setThemeState(defaultTheme);
        localStorage.setItem('theme', defaultTheme);
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
      logger.debug('🎨 Theme applied:', resolvedTheme, '(from setting:', theme + ')');
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
    logger.debug('🎨 Theme changed to:', newTheme);

    if (user?.id) {
      try {
        // Try to save to database, but don't fail if it doesn't work
        const { error } = await supabase
          .from('user_profiles')
          .upsert({ 
            id: user.id, 
            preferred_theme: newTheme 
          }, {
            onConflict: 'id'
          });

        if (error) {
          logger.debug('🎨 Could not save theme to database (non-critical):', error);
        } else {
          logger.debug('🎨 Theme saved to database successfully');
          toast({
            title: "Theme updated",
            description: `Theme changed to ${newTheme}`,
          });
        }
      } catch (dbError) {
        logger.debug('🎨 Database save failed (non-critical):', dbError);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
