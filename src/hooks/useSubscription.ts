
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null,
    loading: true,
    error: null
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscriptionInfo(prev => ({ ...prev, loading: false, subscribed: false, subscription_tier: 'free' }));
      return;
    }

    try {
      setSubscriptionInfo(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionInfo({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || 'free',
        subscription_end: data.subscription_end || null,
        loading: false,
        error: null
      });
    } catch (error) {
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
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }, [user]);

  const createCustomerPortalSession = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
      
      return data;
    } catch (error) {
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
    isPro: subscriptionInfo.subscription_tier === 'pro',
    isFree: subscriptionInfo.subscription_tier === 'free'
  };
};
