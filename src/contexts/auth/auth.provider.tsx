import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { fakeClient } from '@/lib/fakeClient';
import { createContextGuard } from '@/utils/providerGuards';
import { logger } from '@/utils/logger';
import { AuthState, authReducer, initialAuthState } from './auth.state';
import { AuthActions, createAuthActions } from './auth.actions';

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
    
    // Get initial session
    fakeClient.auth.getSession().then(({ data }) => {
      const session = data?.session;
      logger.info('🔐 [AUTH_FLOW] Initial session check:', session ? 'authenticated' : 'not authenticated');
      dispatch({ type: 'SET_SESSION', session });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = fakeClient.auth.onAuthStateChange(async (event, session) => {
      logger.info('🔐 [AUTH_FLOW] Auth state changed:', event, session ? 'authenticated' : 'not authenticated');
      dispatch({ type: 'SET_SESSION', session });
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    ...state,
    ...actions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
