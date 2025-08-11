
/**
 * Environment validation utilities for production readiness
 */

export type StripeMode = 'test' | 'live';

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  mode: StripeMode;
}

export const validateEnvironment = (): EnvValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Determine Stripe mode
  const stripeMode: StripeMode = import.meta.env.VITE_STRIPE_MODE === 'live' ? 'live' : 'test';
  
  // Core Supabase validation
  if (!import.meta.env.VITE_SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }

  // Stripe validation based on mode
  if (stripeMode === 'live') {
    // In live mode, we expect live keys
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_')) {
      errors.push('Live Stripe publishable key (pk_live_...) is required in live mode');
    }
    
    // Warn if test mode flag is enabled in live mode
    if (import.meta.env.VITE_ENABLE_STRIPE_TEST === 'true') {
      warnings.push('VITE_ENABLE_STRIPE_TEST should be false in live mode');
    }
  } else {
    // In test mode, we expect test keys
    if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
      warnings.push('Test Stripe publishable key (pk_test_...) recommended in test mode');
    }
  }

  // Analytics validation
  if (!import.meta.env.VITE_ANALYTICS_ID && import.meta.env.PROD) {
    warnings.push('VITE_ANALYTICS_ID not set - analytics will be disabled');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    mode: stripeMode
  };
};

export const logEnvironmentValidation = (): void => {
  const validation = validateEnvironment();
  
  console.log(`🔧 Environment Mode: ${validation.mode.toUpperCase()}`);
  
  if (validation.errors.length > 0) {
    console.error('❌ Environment Validation Errors:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Environment Validation Warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  if (validation.isValid) {
    console.log('✅ Environment validation passed');
  }
};
