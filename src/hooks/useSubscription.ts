
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client-fake';
import { useAuth } from '@/contexts/auth/auth.provider';
import { logger } from '@/utils/logger';
import { STRIPE_SANDBOX } from '@/config/env';
import { checkProAccess } from '@/utils/premium-gating';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_status: string;
  subscription_end: string | null;
  loading: boolean;
  error?: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_status: 'inactive',
    subscription_end: null,
    loading: true,
  });

  const fetchSubscriptionInfo = async () => {
    if (!user?.id) {
      setSubscriptionInfo({
        subscribed: false,
        subscription_tier: 'free',
        subscription_status: 'inactive',
        subscription_end: null,
        loading: false,
      });
      return;
    }

    try {
      logger.debug('[SUBSCRIPTION] Fetching subscription info for user:', user.id);
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('subscription_tier, subscription_status, subscription_expires_at')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        logger.error('[SUBSCRIPTION] Error fetching subscription info:', error);
        setSubscriptionInfo(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }));
        return;
      }
    
      // Create a proper SubscriptionInfo object with all required properties
      const subscriptionData: SubscriptionInfo = {
        loading: false,
        subscription_tier: profile?.subscription_tier === 'pro' ? 'pro' : 'free',
        subscription_status: profile?.subscription_status || 'inactive',
        subscription_end: profile?.subscription_expires_at || null,
        subscribed: false, // Will be set by checkProAccess
      };

      const isPro = checkProAccess(subscriptionData);
      subscriptionData.subscribed = isPro;
      
      setSubscriptionInfo(subscriptionData);

      logger.debug('[SUBSCRIPTION] Subscription info updated:', {
        subscribed: isPro,
        tier: subscriptionData.subscription_tier,
        status: profile?.subscription_status,
        end: profile?.subscription_expires_at
      });
      
    } catch (error: any) {
      logger.error('[SUBSCRIPTION] Exception fetching subscription info:', error);
      setSubscriptionInfo(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  useEffect(() => {
    fetchSubscriptionInfo();
  }, [user?.id]);

  const createCheckoutSession = async () => {
    if (!STRIPE_SANDBOX) {
      logger.warn('[STRIPE] Stripe sandbox mode is disabled - checkout not available');
      throw new Error('Stripe integration is not enabled in this environment');
    }

    if (!user?.id) {
      throw new Error('User must be authenticated to create checkout session');
    }

    try {
      logger.info('[STRIPE] Creating checkout session for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { userId: user.id }
      });

      if (error) {
        logger.error('[STRIPE] Error creating checkout session:', error);
        throw error;
      }

      if (!data?.url) {
        logger.error('[STRIPE] No checkout URL returned from function');
        throw new Error('Failed to create checkout session');
      }

      logger.debug('[STRIPE] Checkout session created successfully');
      
      window.open(data.url, '_blank');
      
      return data;
    } catch (error: any) {
      logger.error('[STRIPE] Exception creating checkout session:', error);
      throw error;
    }
  };

  const createPortalSession = async () => {
    if (!STRIPE_SANDBOX) {
      logger.warn('[STRIPE] Stripe sandbox mode is disabled - portal not available');
      throw new Error('Stripe integration is not enabled in this environment');
    }

    if (!user?.id) {
      throw new Error('User must be authenticated to access billing portal');
    }

    try {
      logger.info('[STRIPE] Creating portal session for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { userId: user.id }
      });

      if (error) {
        logger.error('[STRIPE] Error creating portal session:', error);
        throw error;
      }

      if (!data?.url) {
        logger.error('[STRIPE] No portal URL returned from function');
        throw new Error('Failed to create portal session');
      }

      logger.debug('[STRIPE] Portal session created successfully');
      
      window.open(data.url, '_blank');
      
      return data;
    } catch (error: any) {
      logger.error('[STRIPE] Exception creating portal session:', error);
      throw error;
    }
  };

  // Computed values for backward compatibility
  const isPro = subscriptionInfo.subscription_tier === 'pro' && subscriptionInfo.subscribed;

  return {
    ...subscriptionInfo,
    isPro,
    createCheckoutSession,
    createPortalSession,
    // Aliases for backward compatibility
    createCustomerPortalSession: createPortalSession,
    checkSubscription: fetchSubscriptionInfo,
    checkProAccess: () => checkProAccess(subscriptionInfo),
  };
};
