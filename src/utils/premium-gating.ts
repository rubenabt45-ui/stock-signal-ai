
import { SubscriptionInfo } from '@/hooks/useSubscription';

export interface PremiumGatingConfig {
  requiresPro: boolean;
  fallbackMessage?: string;
  redirectTo?: string;
}

export const checkProAccess = (subscriptionInfo: SubscriptionInfo): boolean => {
  if (!subscriptionInfo) return false;
  
  const isPro = subscriptionInfo.subscription_tier === 'pro';
  const hasActiveStatus = ['active', 'trialing'].includes(subscriptionInfo.subscription_status);
  const hasValidEnd = !subscriptionInfo.subscription_end || new Date(subscriptionInfo.subscription_end) > new Date();
  
  return isPro && hasActiveStatus && hasValidEnd;
};

export const isPremiumFeature = (featureName: string): boolean => {
  // Define which features require premium access
  const premiumFeatures = [
    'advanced-analysis',
    'unlimited-charts', 
    'priority-support',
    'custom-alerts',
    'export-data',
    'advanced-patterns',
    'real-time-data',
    'market-updates'
  ];
  
  return premiumFeatures.includes(featureName);
};

export const getPremiumGatingMessage = (featureName: string): string => {
  const messages: Record<string, string> = {
    'advanced-analysis': 'Advanced AI analysis requires a Pro subscription',
    'unlimited-charts': 'Unlimited chart access requires a Pro subscription',
    'priority-support': 'Priority support is available for Pro subscribers',
    'custom-alerts': 'Custom alerts require a Pro subscription',
    'export-data': 'Data export features require a Pro subscription',
    'advanced-patterns': 'Advanced pattern recognition requires a Pro subscription',
    'real-time-data': 'Real-time market data requires a Pro subscription',
    'market-updates': 'Live market updates require a Pro subscription'
  };
  
  return messages[featureName] || 'This feature requires a Pro subscription';
};

export const shouldShowPremiumUpgrade = (
  subscriptionInfo: SubscriptionInfo,
  featureName?: string
): boolean => {
  if (!subscriptionInfo || subscriptionInfo.loading) return false;
  
  const hasProAccess = checkProAccess(subscriptionInfo);
  
  if (featureName && isPremiumFeature(featureName)) {
    return !hasProAccess;
  }
  
  return !hasProAccess;
};

// Backward compatibility exports
export { checkProAccess as checkProAccessLegacy };
