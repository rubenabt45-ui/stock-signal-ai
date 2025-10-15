
import { supabase } from '@/integrations/supabase/client-fake';
import { STRIPE_SANDBOX } from '@/config/env';

// Helper function to check if user has Pro access
export const checkProAccess = (userProfile: any) => {
  if (!userProfile) return false;
  
  const isPro = userProfile.is_pro === true;
  const hasActiveSubscription = ['active', 'trialing'].includes(userProfile.subscription_status);
  const isProTier = userProfile.subscription_tier === 'pro';
  
  return isPro && hasActiveSubscription && isProTier;
};

// Safe Stripe checkout function (only works when STRIPE_SANDBOX is true)
export const createStripeCheckout = async () => {
  if (!STRIPE_SANDBOX) {
    console.warn('[STRIPE] Checkout disabled - VITE_STRIPE_SANDBOX not enabled');
    return null;
  }

  try {
    console.log('[STRIPE] Creating checkout session...');
    
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      console.error('[STRIPE] Checkout error:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }

    if (!data?.url) {
      console.error('[STRIPE] No checkout URL returned:', data);
      throw new Error('No checkout URL received');
    }

    console.log('[STRIPE] Checkout session created successfully');
    return data.url;
  } catch (error) {
    console.error('[STRIPE] Checkout failed:', error);
    throw error;
  }
};

// Safe Stripe portal function (only works when STRIPE_SANDBOX is true)
export const createStripePortal = async () => {
  if (!STRIPE_SANDBOX) {
    console.warn('[STRIPE] Portal disabled - VITE_STRIPE_SANDBOX not enabled');
    return null;
  }

  try {
    console.log('[STRIPE] Creating portal session...');
    
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      console.error('[STRIPE] Portal error:', error);
      throw new Error(error.message || 'Failed to create portal session');
    }

    if (!data?.url) {
      console.error('[STRIPE] No portal URL returned:', data);
      throw new Error('No portal URL received');
    }

    console.log('[STRIPE] Portal session created successfully');
    return data.url;
  } catch (error) {
    console.error('[STRIPE] Portal failed:', error);
    throw error;
  }
};

// Safe redirect function for Stripe URLs
export const redirectToStripe = (url: string) => {
  if (!url) {
    console.error('[STRIPE] No URL provided for redirect');
    return;
  }

  // Validate URL is from Stripe
  if (!url.includes('stripe.com')) {
    console.error('[STRIPE] Invalid URL - not from Stripe:', url);
    return;
  }

  console.log('[STRIPE] Redirecting to:', url.substring(0, 50) + '...');
  window.location.href = url;
};
