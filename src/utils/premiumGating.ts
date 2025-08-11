
import { UserRole } from '@/hooks/useSubscriptionStatus';

/**
 * Centralized premium gating utility
 * Determines if user has access to specific features based on subscription status
 */
export interface PremiumGatingConfig {
  role: UserRole;
  subscribed: boolean;
  isExpired: boolean;
}

export const hasProAccess = (config: PremiumGatingConfig): boolean => {
  return config.role === 'pro' && config.subscribed && !config.isExpired;
};

export const canAccessFeature = (
  feature: 'strategy-ai' | 'market-updates' | 'learn' | 'advanced-features' | 'priority-support',
  config: PremiumGatingConfig
): boolean => {
  // Free features available to all users
  const freeFeatures = ['basic-dashboard', 'basic-learn'];
  
  // Pro features require active subscription
  const proFeatures = ['strategy-ai', 'market-updates', 'learn', 'advanced-features', 'priority-support'];
  
  if (proFeatures.includes(feature)) {
    return hasProAccess(config);
  }
  
  // Default to allowing access for unspecified features
  return true;
};

export const getFeatureAccessMessage = (feature: string): string => {
  const messages = {
    'strategy-ai': 'Unlimited StrategyAI access requires a Pro subscription',
    'market-updates': 'Real-time market updates are available with Pro',
    'learn': 'Complete Learn access requires Pro subscription',
    'advanced-features': 'Advanced features are available with Pro',
    'priority-support': 'Priority support is included with Pro subscription'
  };
  
  return messages[feature as keyof typeof messages] || 'This feature requires a Pro subscription';
};
