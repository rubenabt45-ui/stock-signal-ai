
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createContextGuard } from '@/utils/providerGuards';
import { logger } from '@/utils/logger';

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

const authGuard = createContextGuard('AuthProvider', 'useAuth');

export const useAuth = () => {
  const context = useContext(AuthContext);
  return authGuard(context);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logger.info('🔐 [AUTH_FLOW] AuthProvider: Initializing auth state');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      logger.info('🔐 [AUTH_FLOW] Initial session check:', session ? 'authenticated' : 'not authenticated');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check subscription status on login
      if (session?.user) {
        setTimeout(() => {
          supabase.functions.invoke('check-subscription').catch(logger.error);
        }, 0);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('🔐 [AUTH_FLOW] Auth state changed:', event, session ? 'authenticated' : 'not authenticated');
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check subscription status on auth state change
      if (session?.user) {
        setTimeout(() => {
          supabase.functions.invoke('check-subscription').catch(logger.error);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    logger.info('🔐 [AUTH_FLOW] Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      logger.error('🔐 [AUTH_FLOW] Sign in error:', error);
    } else {
      logger.info('🔐 [AUTH_FLOW] Sign in successful');
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Always use production domain for email verification
    const redirectUrl = 'https://tradeiqpro.com/verify-email';
    
    logger.info('🔐 [EMAIL_VERIFICATION] Starting signup process');
    logger.info('🔐 [EMAIL_VERIFICATION] Email:', email);
    logger.info('🔐 [EMAIL_VERIFICATION] Redirect URL:', redirectUrl);
    logger.debug('🔐 [EMAIL_VERIFICATION] Current environment:', {
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
        logger.error('🔐 [EMAIL_VERIFICATION] Signup error:', error);
        logger.error('🔐 [EMAIL_VERIFICATION] Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        return { error };
      }

      logger.debug('🔐 [EMAIL_VERIFICATION] Signup response:', {
        user: data.user ? 'created' : 'null',
        session: data.session ? 'active' : 'null',
        userConfirmed: data.user?.email_confirmed_at ? 'confirmed' : 'pending'
      });

      if (data.user && !data.user.email_confirmed_at) {
        logger.info('🔐 [EMAIL_VERIFICATION] Email verification required');
        logger.debug('🔐 [EMAIL_VERIFICATION] User should check email for verification link');
        
        // Log email delivery attempt
        logger.debug('🔐 [EMAIL_MONITORING] Verification email delivery initiated for:', email);
        
        // Optional: Add a small delay and then check if email was delivered
        setTimeout(() => {
          logger.debug('🔐 [EMAIL_MONITORING] Email delivery status check - verification email should have been sent');
        }, 2000);
      } else if (data.user && data.user.email_confirmed_at) {
        logger.info('🔐 [EMAIL_VERIFICATION] User already verified');
      }

      return { error: null };
    } catch (error: any) {
      logger.error('🔐 [EMAIL_VERIFICATION] Signup exception:', error);
      logger.error('🔐 [EMAIL_MONITORING] Email delivery failed during signup:', error);
      return { error: { message: 'An unexpected error occurred during signup' } };
    }
  };

  const resendConfirmation = async (email: string) => {
    const redirectUrl = 'https://tradeiqpro.com/verify-email';
    
    logger.info('🔐 [EMAIL_VERIFICATION] Resending confirmation email');
    logger.debug('🔐 [EMAIL_VERIFICATION] Email:', email);
    logger.debug('🔐 [EMAIL_VERIFICATION] Redirect URL:', redirectUrl);
    logger.debug('🔐 [EMAIL_MONITORING] Retry attempt for email delivery');
    
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
          logger.error('🔐 [EMAIL_VERIFICATION] Resend error (attempt ' + (retryCount + 1) + '):', error);
          logger.error('🔐 [EMAIL_VERIFICATION] Error details:', {
            message: error.message,
            status: error.status,
            name: error.name
          });
          
          retryCount++;
          
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            logger.debug('🔐 [EMAIL_MONITORING] Retrying email delivery in ' + delay + 'ms');
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          logger.error('🔐 [EMAIL_MONITORING] Email delivery failed after ' + maxRetries + ' attempts');
          return { error };
        }

        logger.info('🔐 [EMAIL_VERIFICATION] Email resent successfully');
        logger.debug('🔐 [EMAIL_MONITORING] Email delivery successful on attempt ' + (retryCount + 1));
        return { error: null };
      } catch (error: any) {
        logger.error('🔐 [EMAIL_VERIFICATION] Resend exception (attempt ' + (retryCount + 1) + '):', error);
        logger.error('🔐 [EMAIL_MONITORING] Email delivery exception:', error);
        
        retryCount++;
        
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          logger.debug('🔐 [EMAIL_MONITORING] Retrying after exception in ' + delay + 'ms');
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        logger.error('🔐 [EMAIL_MONITORING] Email delivery failed with exceptions after ' + maxRetries + ' attempts');
        return { error: { message: 'Failed to resend verification email after multiple attempts' } };
      }
    }
    
    return { error: { message: 'Maximum retry attempts exceeded' } };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = 'https://tradeiqpro.com/reset-password';
    
    logger.info('🔐 [AUTH_FLOW] Password reset request for:', email);
    logger.debug('🔐 [AUTH_FLOW] Reset redirect URL:', redirectUrl);
    logger.debug('🔐 [EMAIL_MONITORING] Password reset email delivery initiated');
    
    // Retry mechanism for password reset emails
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        
        if (error) {
          logger.error('🔐 [AUTH_FLOW] Password reset error (attempt ' + (retryCount + 1) + '):', error);
          logger.error('🔐 [EMAIL_MONITORING] Password reset email delivery failed:', error);
          
          retryCount++;
          
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            logger.debug('🔐 [EMAIL_MONITORING] Retrying password reset email in ' + delay + 'ms');
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          logger.error('🔐 [EMAIL_MONITORING] Password reset email delivery failed after ' + maxRetries + ' attempts');
          return { error };
        }
        
        logger.info('🔐 [AUTH_FLOW] Password reset email sent successfully');
        logger.debug('🔐 [EMAIL_MONITORING] Password reset email delivery successful on attempt ' + (retryCount + 1));
        return { error: null };
      } catch (error: any) {
        logger.error('🔐 [AUTH_FLOW] Password reset exception (attempt ' + (retryCount + 1) + '):', error);
        logger.error('🔐 [EMAIL_MONITORING] Password reset email delivery exception:', error);
        
        retryCount++;
        
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          logger.debug('🔐 [EMAIL_MONITORING] Retrying after exception in ' + delay + 'ms');
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        logger.error('🔐 [EMAIL_MONITORING] Password reset email delivery failed with exceptions after ' + maxRetries + ' attempts');
        return { error: { message: 'Failed to send password reset email after multiple attempts' } };
      }
    }
    
    return { error: { message: 'Maximum retry attempts exceeded' } };
  };

  const updatePassword = async (password: string) => {
    logger.info('🔐 [AUTH_FLOW] Updating password');
    logger.debug('🔐 [AUTH_FLOW] Password reset completion initiated');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      logger.error('🔐 [AUTH_FLOW] Password update error:', error);
      logger.error('🔐 [EMAIL_MONITORING] Password reset completion failed:', error);
    } else {
      logger.info('🔐 [AUTH_FLOW] Password updated successfully');
      logger.debug('🔐 [EMAIL_MONITORING] Password reset completion successful');
    }
    
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const redirectUrl = 'https://tradeiqpro.com/app';
    
    logger.info('🔐 [AUTH_FLOW] OAuth sign in with provider:', provider);
    logger.debug('🔐 [AUTH_FLOW] OAuth redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl
      }
    });
    
    if (error) {
      logger.error('🔐 [AUTH_FLOW] OAuth sign in error:', error);
    } else {
      logger.info('🔐 [AUTH_FLOW] OAuth sign in initiated');
    }
    
    return { error };
  };

  const signOut = async () => {
    logger.info('🔐 [AUTH_FLOW] Signing out');
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
