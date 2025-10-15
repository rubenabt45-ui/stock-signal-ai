// Fake subscription hook for frontend-only mode
import { useState, useEffect } from 'react';
import { useFakeAuth } from '@/providers/FakeAuthProvider';
import { fakeMarketClient } from '@/lib/fakeClient';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_status: 'active' | 'inactive' | 'trialing';
  subscription_end?: string;
  loading: boolean;
  error?: string;
}

export const useSubscription = () => {
  const { userProfile, user } = useFakeAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_status: 'inactive',
    loading: true,
  });

  useEffect(() => {
    if (user && userProfile) {
      setSubscriptionInfo({
        subscribed: userProfile.is_pro,
        subscription_tier: userProfile.subscription_tier,
        subscription_status: userProfile.subscription_status,
        subscription_end: userProfile.subscription_expires_at,
        loading: false,
      });
    } else {
      setSubscriptionInfo({
        subscribed: false,
        subscription_tier: 'free',
        subscription_status: 'inactive',
        loading: false,
      });
    }
  }, [user, userProfile]);

  const createCheckoutSession = async () => {
    await fakeMarketClient.upgradeToPro();
    // Reload to update state
    window.location.reload();
  };

  const createPortalSession = async () => {
    console.log('Opening customer portal (fake)');
  };

  const checkSubscription = async () => {
    // No-op in fake mode
  };

  return {
    subscriptionInfo,
    isPro: subscriptionInfo.subscribed,
    createCheckoutSession,
    createPortalSession,
    checkSubscription,
    // Backward compatibility aliases
    createCustomerPortalSession: createPortalSession,
    checkProAccess: () => subscriptionInfo.subscribed,
  };
};
