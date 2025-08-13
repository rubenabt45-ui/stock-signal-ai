
import { logger } from '@/utils/logger';

// Provider Guard utilities to prevent context crashes
export const createContextGuard = (contextName: string, hookName: string) => {
  return (context: any) => {
    if (context === undefined) {
      logger.error(`🚨 [PROVIDER_GUARD] ${hookName} must be used within a ${contextName}`);
      logger.error(`🚨 [PROVIDER_GUARD] This indicates a provider mounting issue in the app root`);
      
      // Return safe no-op values to prevent hard crashes
      if (hookName === 'useAuth') {
        return {
          user: null,
          session: null,
          loading: false,
          signIn: async () => ({ error: new Error('AuthProvider not mounted') }),
          signUp: async () => ({ error: new Error('AuthProvider not mounted') }),
          signOut: async () => {},
          resendConfirmation: async () => ({ error: new Error('AuthProvider not mounted') }),
          resetPassword: async () => ({ error: new Error('AuthProvider not mounted') }),
          updatePassword: async () => ({ error: new Error('AuthProvider not mounted') }),
          signInWithOAuth: async () => ({ error: new Error('AuthProvider not mounted') }),
        };
      }
      
      if (hookName === 'useTheme') {
        return {
          theme: 'dark' as const,
          setTheme: () => {},
          actualTheme: 'dark' as const,
        };
      }
      
      if (hookName === 'useLanguage') {
        return {
          currentLanguage: 'en',
          changeLanguage: async () => {},
          availableLanguages: [{ code: 'en', name: 'English' }],
        };
      }
      
      if (hookName === 'useRealTimePriceContext') {
        return {
          prices: {},
          isConnected: false,
          error: 'RealTimePriceProvider not mounted',
          subscribe: () => {},
          unsubscribe: () => {},
          reconnect: () => {},
        };
      }
      
      // Fallback for unknown contexts
      throw new Error(`${hookName} must be used within a ${contextName}`);
    }
    return context;
  };
};
