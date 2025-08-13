
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { createStripeCheckout, createStripePortal, redirectToStripe, checkProAccess } from '@/utils/stripeUtils';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_status: string;
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_status: 'inactive',
    subscription_end: null,
    loading: true,
    error: null
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscriptionInfo(prev => ({ 
        ...prev, 
        loading: false, 
        subscribed: false, 
        subscription_tier: 'free',
        subscription_status: 'inactive'
      }));
      return;
    }

    try {
      setSubscriptionInfo(prev => ({ ...prev, loading: true, error: null }));
      
      // Get user profile from user_profiles table
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('is_pro, subscription_tier, subscription_status, subscription_end')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      const isPro = checkProAccess(profile);
      
      setSubscriptionInfo({
        subscribed: isPro,
        subscription_tier: profile?.subscription_tier || 'free',
        subscription_status: profile?.subscription_status || 'inactive',
        subscription_end: profile?.subscription_end || null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('[SUBSCRIPTION] Check failed:', error);
      setSubscriptionInfo(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check subscription'
      }));
    }
  }, [user]);

  const createCheckoutSession = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const url = await createStripeCheckout();
      if (url) {
        redirectToStripe(url);
      }
    } catch (error) {
      console.error('[SUBSCRIPTION] Checkout failed:', error);
      throw error;
    }
  }, [user]);

  const createCustomerPortalSession = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const url = await createStripePortal();
      if (url) {
        redirectToStripe(url);
      }
    } catch (error) {
      console.error('[SUBSCRIPTION] Portal failed:', error);
      throw error;
    }
  }, [user]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    ...subscriptionInfo,
    checkSubscription,
    createCheckoutSession,
    createCustomerPortalSession,
    isPro: checkProAccess({ 
      is_pro: subscriptionInfo.subscribed,
      subscription_tier: subscriptionInfo.subscription_tier,
      subscription_status: subscriptionInfo.subscription_status
    }),
    isFree: !subscriptionInfo.subscribed
  };
};
