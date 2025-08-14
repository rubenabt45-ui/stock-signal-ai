import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/auth.provider';

interface SubscriptionData {
  subscription_tier: 'free' | 'pro';
  subscription_status: string | null;
  subscription_id: string | null;
  subscription_expires_at: string | null;
  customer_id: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscription_tier: 'free',
    subscription_status: null,
    subscription_id: null,
    subscription_expires_at: null,
    customer_id: null,
  });
  const [loading, setLoading] = useState(true);

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
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_tier, subscription_status, subscription_id, subscription_expires_at, customer_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading subscription:', error);
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
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    if (user) {
      loadSubscription();
    }
  };

  return {
    ...subscription,
    loading,
    isPro: subscription.subscription_tier === 'pro',
    refreshSubscription,
  };
};
