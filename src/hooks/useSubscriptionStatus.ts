import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

export type UserRole = 'free' | 'pro' | 'expired';

export interface SubscriptionStatus {
  role: UserRole;
  subscribed: boolean;
  subscription_tier: 'free' | 'pro';
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
  isExpired: boolean;
  daysUntilExpiry: number | null;
}

export const useSubscriptionStatus = () => {
  const { user } = useAuth();
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    loading, 
    error, 
    checkSubscription,
    createCheckoutSession 
  } = useSubscription();

  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    role: 'free',
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null,
    loading: true,
    error: null,
    isExpired: false,
    daysUntilExpiry: null
  });

  useEffect(() => {
    if (!user) {
      setSubscriptionStatus(prev => ({
        ...prev,
        loading: false,
        role: 'free'
      }));
      return;
    }

    // Calculate role based on subscription status
    let role: UserRole = 'free';
    let isExpired = false;
    let daysUntilExpiry: number | null = null;

    if (subscription_end) {
      const expiryDate = new Date(subscription_end);
      const now = new Date();
      const timeDiff = expiryDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      daysUntilExpiry = daysDiff;
      
      if (daysDiff <= 0) {
        // Subscription has expired
        role = 'expired';
        isExpired = true;
      } else if (subscribed && subscription_tier === 'pro') {
        // Active pro subscription
        role = 'pro';
      }
    } else if (subscribed && subscription_tier === 'pro') {
      // Pro subscription without end date (shouldn't happen, but handle it)
      role = 'pro';
    }

    setSubscriptionStatus({
      role,
      subscribed,
      subscription_tier,
      subscription_end,
      loading,
      error,
      isExpired,
      daysUntilExpiry
    });
  }, [user, subscribed, subscription_tier, subscription_end, loading, error]);

  // Auto-refresh subscription status on login
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription]);

  return {
    ...subscriptionStatus,
    checkSubscription,
    createCheckoutSession,
    canAccessFeature: (feature: 'strategy-ai' | 'market-updates' | 'learn' | 'all-features') => {
      if (subscriptionStatus.role === 'pro') return true;
      
      // Define free features
      const freeFeatures = ['dashboard', 'basic-learn'];
      
      switch (feature) {
        case 'strategy-ai':
        case 'market-updates':
        case 'learn':
        case 'all-features':
          return false;
        default:
          return true;
      }
    }
  };
};