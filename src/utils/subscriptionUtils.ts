
/**
 * Premium gating helper - determines if user has active Pro subscription
 */
export const hasProAccess = (planTier?: string, subscriptionStatus?: string): boolean => {
  return planTier === 'pro' && (subscriptionStatus === 'active' || subscriptionStatus === 'trialing');
};

/**
 * Check if subscription is expired or cancelled
 */
export const isSubscriptionExpired = (subscriptionStatus?: string): boolean => {
  return subscriptionStatus === 'canceled' || subscriptionStatus === 'past_due' || subscriptionStatus === 'unpaid';
};
