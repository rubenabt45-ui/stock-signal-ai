
import { supabase } from '@/integrations/supabase/client-fake';
import { logger } from '@/utils/logger';

export interface AuthResponse {
  error: any;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
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
  },

  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
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
        return { error };
      }

      logger.debug('🔐 [EMAIL_VERIFICATION] Signup response:', {
        user: data.user ? 'created' : 'null',
        session: data.session ? 'active' : 'null',
        userConfirmed: data.user?.email_confirmed_at ? 'confirmed' : 'pending'
      });

      if (data.user && !data.user.email_confirmed_at) {
        logger.info('🔐 [EMAIL_VERIFICATION] Email verification required');
        setTimeout(() => {
          logger.debug('🔐 [EMAIL_MONITORING] Email delivery status check - verification email should have been sent');
        }, 2000);
      }

      return { error: null };
    } catch (error: any) {
      logger.error('🔐 [EMAIL_VERIFICATION] Signup exception:', error);
      return { error: { message: 'An unexpected error occurred during signup' } };
    }
  },

  async resendConfirmation(email: string): Promise<AuthResponse> {
    const redirectUrl = 'https://tradeiqpro.com/verify-email';
    
    logger.info('🔐 [EMAIL_VERIFICATION] Resending confirmation email');
    logger.debug('🔐 [EMAIL_VERIFICATION] Email:', email);
    logger.debug('🔐 [EMAIL_VERIFICATION] Redirect URL:', redirectUrl);
    
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
          retryCount++;
          
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            logger.debug('🔐 [EMAIL_MONITORING] Retrying email delivery in ' + delay + 'ms');
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          return { error };
        }

        logger.info('🔐 [EMAIL_VERIFICATION] Email resent successfully');
        return { error: null };
      } catch (error: any) {
        logger.error('🔐 [EMAIL_VERIFICATION] Resend exception (attempt ' + (retryCount + 1) + '):', error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        return { error: { message: 'Failed to resend verification email after multiple attempts' } };
      }
    }
    
    return { error: { message: 'Maximum retry attempts exceeded' } };
  },

  async resetPassword(email: string): Promise<AuthResponse> {
    const redirectUrl = 'https://tradeiqpro.com/reset-password';
    
    logger.info('🔐 [AUTH_FLOW] Password reset request for:', email);
    logger.debug('🔐 [AUTH_FLOW] Reset redirect URL:', redirectUrl);
    
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        
        if (error) {
          logger.error('🔐 [AUTH_FLOW] Password reset error (attempt ' + (retryCount + 1) + '):', error);
          retryCount++;
          
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          return { error };
        }
        
        logger.info('🔐 [AUTH_FLOW] Password reset email sent successfully');
        return { error: null };
      } catch (error: any) {
        logger.error('🔐 [AUTH_FLOW] Password reset exception (attempt ' + (retryCount + 1) + '):', error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        return { error: { message: 'Failed to send password reset email after multiple attempts' } };
      }
    }
    
    return { error: { message: 'Maximum retry attempts exceeded' } };
  },

  async updatePassword(password: string): Promise<AuthResponse> {
    logger.info('🔐 [AUTH_FLOW] Updating password');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      logger.error('🔐 [AUTH_FLOW] Password update error:', error);
    } else {
      logger.info('🔐 [AUTH_FLOW] Password updated successfully');
    }
    
    return { error };
  },

  async signInWithOAuth(provider: 'google' | 'github'): Promise<AuthResponse> {
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
  },

  async signOut(): Promise<void> {
    logger.info('🔐 [AUTH_FLOW] Signing out');
    await supabase.auth.signOut();
  }
};
