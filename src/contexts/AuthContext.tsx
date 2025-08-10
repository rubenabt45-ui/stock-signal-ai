import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseHost } from '@/lib/supabasePreflight';

// Log Supabase URL on boot
console.info('[Supabase]', process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xnrvqfclyroagzknedhs.supabase.co');

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

// Cache for preflight check to avoid repeated DNS queries
let preflightCache: { checked: boolean; result: any } = { checked: false, result: null };

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
    
    console.log('🔐 [EMAIL_VERIFICATION] Starting signup process');
    console.log('🔐 [EMAIL_VERIFICATION] Email:', email);
    console.log('🔐 [EMAIL_VERIFICATION] Redirect URL:', redirectUrl);
    console.log('🔐 [EMAIL_VERIFICATION] Current environment:', {
      hostname: window.location.hostname,
      origin: window.location.origin,
      href: window.location.href
    });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: fullName ? { full_name: fullName } : undefined
        }
      });
      
      if (error) {
        console.error('🔐 [EMAIL_VERIFICATION] Signup error:', error);
        console.error('🔐 [EMAIL_VERIFICATION] Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        return { error };
      }

      console.log('🔐 [EMAIL_VERIFICATION] Signup response:', {
        user: data.user ? 'created' : 'null',
        session: data.session ? 'active' : 'null',
        userConfirmed: data.user?.email_confirmed_at ? 'confirmed' : 'pending'
      });

      if (data.user && !data.user.email_confirmed_at) {
        console.log('🔐 [EMAIL_VERIFICATION] Email verification required');
        console.log('🔐 [EMAIL_VERIFICATION] User should check email for verification link');
        
        // Log email delivery attempt
        console.log('🔐 [EMAIL_MONITORING] Verification email delivery initiated for:', email);
        
        // Optional: Add a small delay and then check if email was delivered
        setTimeout(() => {
          console.log('🔐 [EMAIL_MONITORING] Email delivery status check - verification email should have been sent');
        }, 2000);
      } else if (data.user && data.user.email_confirmed_at) {
        console.log('🔐 [EMAIL_VERIFICATION] User already verified');
      }

      return { error: null };
    } catch (error: any) {
      console.error('🔐 [EMAIL_VERIFICATION] Signup exception:', error);
      console.error('🔐 [EMAIL_MONITORING] Email delivery failed during signup:', error);
      return { error: { message: 'An unexpected error occurred during signup' } };
    }
  };

  const resendConfirmation = async (email: string) => {
    const redirectUrl = 'https://tradeiqpro.com/verify-email';
    
    console.log('🔐 [EMAIL_VERIFICATION] Resending confirmation email');
    console.log('🔐 [EMAIL_VERIFICATION] Email:', email);
    console.log('🔐 [EMAIL_VERIFICATION] Redirect URL:', redirectUrl);
    console.log('🔐 [EMAIL_MONITORING] Retry attempt for email delivery');
    
    // Retry mechanism with exponential backoff
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (error) {
          console.error('🔐 [EMAIL_VERIFICATION] Resend error (attempt ' + (retryCount + 1) + '):', error);
          console.error('🔐 [EMAIL_VERIFICATION] Error details:', {
            message: error.message,
            status: error.status,
            name: error.name
          });
          
          retryCount++;
          
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log('🔐 [EMAIL_MONITORING] Retrying email delivery in ' + delay + 'ms');
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          console.error('🔐 [EMAIL_MONITORING] Email delivery failed after ' + maxRetries + ' attempts');
          return { error };
        }

        console.log('🔐 [EMAIL_VERIFICATION] Email resent successfully');
        console.log('🔐 [EMAIL_MONITORING] Email delivery successful on attempt ' + (retryCount + 1));
        return { error: null };
      } catch (error: any) {
        console.error('🔐 [EMAIL_VERIFICATION] Resend exception (attempt ' + (retryCount + 1) + '):', error);
        console.error('🔐 [EMAIL_MONITORING] Email delivery exception:', error);
        
        retryCount++;
        
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log('🔐 [EMAIL_MONITORING] Retrying after exception in ' + delay + 'ms');
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        console.error('🔐 [EMAIL_MONITORING] Email delivery failed with exceptions after ' + maxRetries + ' attempts');
        return { error: { message: 'Failed to resend verification email after multiple attempts' } };
      }
    }
    
    return { error: { message: 'Maximum retry attempts exceeded' } };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = 'https://tradeiqpro.com/reset-password';
    
    console.log('🔐 [AUTH_FLOW] Password reset request for:', email);
    console.log('🔐 [AUTH_FLOW] Reset redirect URL:', redirectUrl);
    console.log('🔐 [EMAIL_MONITORING] Password reset email delivery initiated');
    
    // Retry mechanism for password reset emails
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        
        if (error) {
          console.error('🔐 [AUTH_FLOW] Password reset error (attempt ' + (retryCount + 1) + '):', error);
          console.error('🔐 [EMAIL_MONITORING] Password reset email delivery failed:', error);
          
          retryCount++;
          
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log('🔐 [EMAIL_MONITORING] Retrying password reset email in ' + delay + 'ms');
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          console.error('🔐 [EMAIL_MONITORING] Password reset email delivery failed after ' + maxRetries + ' attempts');
          return { error };
        }
        
        console.log('🔐 [AUTH_FLOW] Password reset email sent successfully');
        console.log('🔐 [EMAIL_MONITORING] Password reset email delivery successful on attempt ' + (retryCount + 1));
        return { error: null };
      } catch (error: any) {
        console.error('🔐 [AUTH_FLOW] Password reset exception (attempt ' + (retryCount + 1) + '):', error);
        console.error('🔐 [EMAIL_MONITORING] Password reset email delivery exception:', error);
        
        retryCount++;
        
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log('🔐 [EMAIL_MONITORING] Retrying after exception in ' + delay + 'ms');
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        console.error('🔐 [EMAIL_MONITORING] Password reset email delivery failed with exceptions after ' + maxRetries + ' attempts');
        return { error: { message: 'Failed to send password reset email after multiple attempts' } };
      }
    }
    
    return { error: { message: 'Maximum retry attempts exceeded' } };
  };

  const updatePassword = async (password: string) => {
    console.log('🔐 [AUTH_FLOW] Updating password');
    console.log('🔐 [AUTH_FLOW] Password reset completion initiated');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      console.error('🔐 [AUTH_FLOW] Password update error:', error);
      console.error('🔐 [EMAIL_MONITORING] Password reset completion failed:', error);
    } else {
      console.log('🔐 [AUTH_FLOW] Password updated successfully');
      console.log('🔐 [EMAIL_MONITORING] Password reset completion successful');
    }
    
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    // Get Supabase URL from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xnrvqfclyroagzknedhs.supabase.co';
    
    // Perform preflight check (cache result to avoid repeated DNS queries)
    if (!preflightCache.checked) {
      console.log('🔐 [OAuth:preflight] Checking Supabase host:', supabaseUrl);
      preflightCache.result = await checkSupabaseHost(supabaseUrl);
      preflightCache.checked = true;
    }
    
    if (!preflightCache.result.ok) {
      const errorMsg = `Supabase host invalid (${preflightCache.result.reason}). Check NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`;
      console.error('🔐 [OAuth:preflight:failed]', errorMsg, preflightCache.result);
      return { error: { message: errorMsg } };
    }
    
    // Use runtime origin to avoid env mismatch between dev/prod
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectTo = `${origin}/auth/callback`;
    
    console.log('[OAUTH] start', { provider, redirectTo });
    console.log('🔐 [OAuth:start] Attempting OAuth with provider:', provider);
    console.log('🔐 [OAuth:start] Redirect URL:', redirectTo);
    console.log('🔐 [OAuth:start] Current origin:', origin);
    console.log('🔐 [OAuth:start] Supabase URL:', supabaseUrl);
    
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo
      }
    });
    
    if (error) {
      console.error('[OAUTH] start error', provider, error.message);
      console.error('🔐 [OAuth:start:error]', provider, error.name, error.message);
      console.error('🔐 [OAuth:start:error] Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('[OAUTH] start url', provider, data?.url);
      console.log('🔐 [OAuth:start:ok]', provider, data?.url);
      
      // If Supabase provides a URL, redirect to it
      if (data?.url) {
        window.location.href = data.url;
      }
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
