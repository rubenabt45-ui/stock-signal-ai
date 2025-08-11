
// Dynamic Stripe.js loader - only loads when needed
let stripePromise: Promise<any> | null = null;

export const loadStripe = async () => {
  if (!stripePromise) {
    // Add preconnect for Stripe
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://js.stripe.com';
    document.head.appendChild(preconnect);

    // Dynamic import of Stripe
    stripePromise = import('@stripe/stripe-js').then(({ loadStripe }) => 
      loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
    );
  }
  return stripePromise;
};
