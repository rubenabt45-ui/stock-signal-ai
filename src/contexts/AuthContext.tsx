
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing auth state');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 AuthProvider: Initial session check:', session ? 'authenticated' : 'not authenticated');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check subscription status on login
      if (session?.user) {
        setTimeout(() => {
          supabase.functions.invoke('check-subscription').catch(console.error);
        }, 0);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 AuthProvider: Auth state changed:', event, session ? 'authenticated' : 'not authenticated');
      
      // Handle email verification specifically
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        console.log('🔐 Auth event detected:', event);
        
        // Check if this is from an email verification
        const urlParams = new URLSearchParams(window.location.search);
        const tokenHash = urlParams.get('token_hash');
        const type = urlParams.get('type');
        
        if (tokenHash && type === 'email') {
          console.log('🔐 Email verification detected, token hash present');
          
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'email'
            });
            
            if (error) {
              console.error('🔐 Email verification failed:', error);
              // Redirect to login with error message
              window.location.href = '/login?verification_error=invalid_token';
              return;
            }
            
            console.log('🔐 Email verification successful');
            // Clean up URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (verifyError) {
            console.error('🔐 Email verification exception:', verifyError);
            window.location.href = '/login?verification_error=verification_failed';
            return;
          }
        }
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check subscription status on auth state change
      if (session?.user) {
        setTimeout(() => {
          supabase.functions.invoke('check-subscription').catch(console.error);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Use production domain for redirect URL
    const isProduction = window.location.hostname === 'tradeiqpro.com';
    const redirectUrl = isProduction 
      ? 'https://tradeiqpro.com/verify-email'
      : `${window.location.origin}/verify-email`;
    
    console.log('🔐 Sign up with redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });
    
    if (error) {
      console.error('🔐 Sign up error:', error);
    }
    
    return { error };
  };

  const resendConfirmation = async (email: string) => {
    const isProduction = window.location.hostname === 'tradeiqpro.com';
    const redirectUrl = isProduction 
      ? 'https://tradeiqpro.com/verify-email'
      : `${window.location.origin}/verify-email`;
    
    console.log('🔐 Resending confirmation with redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('🔐 Resend confirmation error:', error);
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
