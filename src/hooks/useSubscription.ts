
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
  stripeConfigured: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null,
    loading: true,
    error: null,
    stripeConfigured: true // Assume configured, will be checked server-side
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscriptionInfo(prev => ({ 
        ...prev, 
        loading: false, 
        subscribed: false, 
        subscription_tier: 'free',
        error: null
      }));
      return;
    }

    try {
      setSubscriptionInfo(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Subscription check error:', error);
        throw error;
      }
      
      setSubscriptionInfo({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || 'free',
        subscription_end: data.subscription_end || null,
        loading: false,
        error: null,
        stripeConfigured: true
      });
    } catch (error) {
      console.error('Subscription check failed:', error);
      setSubscriptionInfo(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check subscription',
        stripeConfigured: false
      }));
    }
  }, [user]);

  const createCheckoutSession = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) {
        console.error('Checkout session error:', error);
        throw error;
      }
      
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
      
      return data;
    } catch (error) {
      console.error('Checkout session creation failed:', error);
      throw error;
    }
  }, [user]);

  const createCustomerPortalSession = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Customer portal error:', error);
        throw error;
      }
      
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL received');
      }
      
      return data;
    } catch (error) {
      console.error('Customer portal creation failed:', error);
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

