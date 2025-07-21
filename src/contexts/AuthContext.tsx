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
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>;
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
    console.log('🔐 [AUTH_FLOW] AuthProvider: Initializing auth state');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 [AUTH_FLOW] Initial session check:', session ? 'authenticated' : 'not authenticated');
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
      console.log('🔐 [AUTH_FLOW] Auth state changed:', event, session ? 'authenticated' : 'not authenticated');
      
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
    console.log('🔐 [AUTH_FLOW] Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('🔐 [AUTH_FLOW] Sign in error:', error);
    } else {
      console.log('🔐 [AUTH_FLOW] Sign in successful');
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Always use production domain for email verification
    const redirectUrl = 'https://tradeiqpro.com/verify-email';
    
    console.log('🔐 [AUTH_FLOW] Sign up with redirect URL:', redirectUrl);
    console.log('🔐 [AUTH_FLOW] Current hostname:', window.location.hostname);
    console.log('🔐 [AUTH_FLOW] Using production redirect for all environments');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });
    
    if (error) {
      console.error('🔐 [AUTH_FLOW] Sign up error:', error);
    } else {
      console.log('🔐 [AUTH_FLOW] Sign up successful, verification email sent');
    }
    
    return { error };
  };

  const resendConfirmation = async (email: string) => {
    const redirectUrl = 'https://tradeiqpro.com/verify-email';
    
    console.log('🔐 [AUTH_FLOW] Resending confirmation with redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('🔐 [AUTH_FLOW] Resend confirmation error:', error);
    } else {
      console.log('🔐 [AUTH_FLOW] Resend confirmation successful');
    }
    
    return { error };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = 'https://tradeiqpro.com/reset-password';
    
    console.log('🔐 [AUTH_FLOW] Password reset request for:', email);
    console.log('🔐 [AUTH_FLOW] Reset redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('🔐 [AUTH_FLOW] Password reset error:', error);
    } else {
      console.log('🔐 [AUTH_FLOW] Password reset email sent successfully');
    }
    
    return { error };
  };

  const updatePassword = async (password: string) => {
    console.log('🔐 [AUTH_FLOW] Updating password');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      console.error('🔐 [AUTH_FLOW] Password update error:', error);
    } else {
      console.log('🔐 [AUTH_FLOW] Password updated successfully');
    }
    
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const redirectUrl = 'https://tradeiqpro.com/app';
    
    console.log('🔐 [AUTH_FLOW] OAuth sign in with provider:', provider);
    console.log('🔐 [AUTH_FLOW] OAuth redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('🔐 [AUTH_FLOW] OAuth sign in error:', error);
    } else {
      console.log('🔐 [AUTH_FLOW] OAuth sign in initiated');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('🔐 [AUTH_FLOW] Signing out');
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
    resetPassword,
    updatePassword,
    signInWithOAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
