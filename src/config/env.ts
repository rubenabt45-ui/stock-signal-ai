
// Financial Modeling Prep API Configuration
export const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY || 'uuPa9k1Mt74dnplLjU0HIyIjLo2tpuxl';
export const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v4';

// Supabase Configuration (for client-side)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xnrvqfclyroagzknedhs.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucnZxZmNseXJvYWd6a25lZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mjg0MTgsImV4cCI6MjA2NDUwNDQxOH0.vIFgqNFnfLVoqtSs4xGWAAVmDiAeIUS3fo6C-1sbQog";

// Development flags
export const ENABLE_DEV_DIAG = import.meta.env.VITE_ENABLE_DEV_DIAG === 'true';

// Stripe safety flags
export const STRIPE_MODE = import.meta.env.VITE_STRIPE_MODE || 'test';
export const ENABLE_STRIPE_TEST = import.meta.env.VITE_ENABLE_STRIPE_TEST === 'true';
export const STRIPE_SANDBOX = import.meta.env.VITE_STRIPE_SANDBOX === 'true';

// Environment validation helper (boolean checks only)
export const validateEnvironment = () => {
  const clientEnv = {
    hasSupabaseUrl: !!SUPABASE_URL,
    hasSupabaseAnonKey: !!SUPABASE_ANON_KEY,
  };
  
  console.log('[ENV-AUDIT] Client environment validated:', clientEnv);
  return clientEnv;
};
