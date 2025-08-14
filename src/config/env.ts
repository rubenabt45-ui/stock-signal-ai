
// Financial Modeling Prep API Configuration
export const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY || 'uuPa9k1Mt74dnplLjU0HIyIjLo2tpuxl';
export const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v4';

// Supabase Configuration (for client-side)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xnrvqfclyroagzknedhs.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucnZxZmNseXJvYWd6a25lZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mjg0MTgsImV4cCI6MjA2NDUwNDQxOH0.vIFgqNFnfLVoqtSs4xGWAAVmDiAeIUS3fo6C-1sbQog";

// Stripe safety flags
export const STRIPE_SANDBOX = import.meta.env.VITE_STRIPE_SANDBOX === 'true';

// Environment validation helper
export const validateEnvironment = () => {
  const clientEnv = {
    hasSupabaseUrl: !!SUPABASE_URL,
    hasSupabaseAnonKey: !!SUPABASE_ANON_KEY,
    hasFmpApiKey: !!FMP_API_KEY,
    stripeEnabled: STRIPE_SANDBOX
  };
  
  if (import.meta.env.DEV) {
    console.log('[ENV-AUDIT] Client environment validated:', clientEnv);
  }
  return clientEnv;
};
