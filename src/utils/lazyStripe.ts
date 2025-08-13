
// Lazy load Stripe.js only when needed
export const loadStripe = async () => {
  // Dynamic import of Stripe - only loads when payment is initiated
  const { loadStripe } = await import('@stripe/stripe-js');
  
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!stripePublishableKey) {
    throw new Error('Stripe publishable key not found');
  }
  
  return loadStripe(stripePublishableKey);
};

// Preload Stripe when user hovers over payment buttons (smart preloading)
export const preloadStripe = () => {
  // Preload on interaction, not on page load
  import('@stripe/stripe-js');
};
