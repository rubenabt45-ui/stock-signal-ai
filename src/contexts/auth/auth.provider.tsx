
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createContextGuard } from '@/utils/providerGuards';
import { logger } from '@/utils/logger';
import { AuthState, authReducer, initialAuthState } from './auth.state';
import { AuthActions, createAuthActions } from './auth.actions';
import { IS_DEVELOPMENT, SUPABASE_URL } from '@/config/env';

interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authGuard = createContextGuard('AuthProvider', 'useAuth');

export const useAuth = () => {
  const context = useContext(AuthContext);
  return authGuard(context);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const actions = createAuthActions();

  useEffect(() => {
    logger.info('🔐 [AUTH_FLOW] AuthProvider: Initializing auth state');
    
    // Skip auth initialization if using placeholder Supabase config
    const isPlaceholderConfig = SUPABASE_URL?.includes('placeholder');
    
    if (isPlaceholderConfig && IS_DEVELOPMENT) {
      logger.warn('🔐 [AUTH_FLOW] Using placeholder Supabase config - skipping auth initialization');
      dispatch({ type: 'SET_SESSION', session: null });
      return;
    }
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      logger.info('🔐 [AUTH_FLOW] Initial session check:', session ? 'authenticated' : 'not authenticated');
      dispatch({ type: 'SET_SESSION', session });
      
      // Check subscription status on login
      if (session?.user && !isPlaceholderConfig) {
        setTimeout(() => {
          supabase.functions.invoke('check-subscription').catch(logger.error);
        }, 0);
      }
    }).catch((error) => {
      logger.error('🔐 [AUTH_FLOW] Failed to get initial session:', error);
      dispatch({ type: 'SET_SESSION', session: null });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('🔐 [AUTH_FLOW] Auth state changed:', event, session ? 'authenticated' : 'not authenticated');
      
      dispatch({ type: 'SET_SESSION', session });
      
      // Check subscription status on auth state change
      if (session?.user && !isPlaceholderConfig) {
        setTimeout(() => {
          supabase.functions.invoke('check-subscription').catch(logger.error);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    ...state,
    ...actions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
