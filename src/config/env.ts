
// Environment configuration for TradeIQ
// This file centralizes all environment variable access and provides defaults

// Supabase Configuration - Using actual project values
export const SUPABASE_URL = 'https://xnrvqfclyroagzknedhs.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucnZxZmNseXJvYWd6a25lZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mjg0MTgsImV4cCI6MjA2NDUwNDQxOH0.vIFgqNFnfLVoqtSs4xGWAAVmDiAeIUS3fo6C-1sbQog';

// Financial Modeling Prep API (Optional)
export const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;

// Stripe Configuration
export const STRIPE_SANDBOX = import.meta.env.VITE_STRIPE_SANDBOX === 'true';

// Development/Production Detection
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;

// Debug logging (only in development)
if (IS_DEVELOPMENT) {
  console.log('[ENV] Configuration loaded:', {
    hasSupabaseUrl: !!SUPABASE_URL,
    hasSupabaseKey: !!SUPABASE_ANON_KEY,
    hasFmpKey: !!FMP_API_KEY,
    stripeSandbox: STRIPE_SANDBOX,
    isDevelopment: IS_DEVELOPMENT,
  });
}
