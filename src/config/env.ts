
// Environment configuration for TradeIQ
// This file centralizes all environment variable access and provides defaults

// Supabase Configuration (Required)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Financial Modeling Prep API (Optional)
export const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;

// Stripe Configuration
export const STRIPE_SANDBOX = import.meta.env.VITE_STRIPE_SANDBOX === 'true';

// Development/Production Detection
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;

// Validate required environment variables in production only
const requiredEnvVars = {
  VITE_SUPABASE_URL: SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
};

// Only validate in production builds
if (IS_PRODUCTION && !IS_DEVELOPMENT) {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

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
