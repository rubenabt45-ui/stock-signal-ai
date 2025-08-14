
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscription_tier: 'free' | 'pro';
  subscription_status: string | null;
  subscription_id: string | null;
  subscription_expires_at: string | null;
  customer_id: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscription_tier: 'free',
    subscription_status: null,
    subscription_id: null,
    subscription_expires_at: null,
    customer_id: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription({
        subscription_tier: 'free',
        subscription_status: null,
        subscription_id: null,
        subscription_expires_at: null,
        customer_id: null,
      });
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_tier, subscription_status, subscription_id, subscription_expires_at, customer_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading subscription:', error);
        setError('Failed to load subscription data');
      } else if (data) {
        setSubscription({
          subscription_tier: data.subscription_tier || 'free',
          subscription_status: data.subscription_status,
          subscription_id: data.subscription_id,
          subscription_expires_at: data.subscription_expires_at,
          customer_id: data.customer_id,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async () => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { userId: user.id }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const createCustomerPortalSession = async () => {
    if (!user || !subscription.customer_id) {
      throw new Error('Customer ID required');
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { customerId: subscription.customer_id }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Portal error:', error);
      throw error;
    }
  };

  const checkSubscription = async () => {
    await loadSubscription();
  };

  const refreshSubscription = () => {
    if (user) {
      loadSubscription();
    }
  };

  return {
    ...subscription,
    subscription_end: subscription.subscription_expires_at,
    subscribed: subscription.subscription_tier === 'pro',
    loading,
    error,
    isPro: subscription.subscription_tier === 'pro',
    createCheckoutSession,
    createCustomerPortalSession,
    checkSubscription,
    refreshSubscription,
  };
};
