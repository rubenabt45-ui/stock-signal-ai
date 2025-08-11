
import { useEffect } from 'react';

export const StartupChecklist = () => {
  useEffect(() => {
    const runStartupChecklist = () => {
      console.log('🚀 TradeIQ Pro - Startup Environment Checklist');
      console.log('================================================');
      
      // Check Stripe testing flag
      const stripeTestingEnabled = import.meta.env.VITE_ENABLE_STRIPE_TEST === 'true';
      console.log(`🧪 Stripe Testing: ${stripeTestingEnabled ? '✅ ENABLED' : '❌ DISABLED'}`);
      
      // Check if we're in development mode
      const isDev = import.meta.env.DEV;
      console.log(`🔧 Development Mode: ${isDev ? '✅ YES' : '❌ NO'}`);
      
      // Environment mode detection
      if (stripeTestingEnabled) {
        console.log('⚠️  TEST MODE - Using Stripe test environment');
        console.log('   • Test webhooks should end with /stripe-webhook');
        console.log('   • Use test cards: 4242 4242 4242 4242');
        console.log('   • All transactions are simulated');
      } else {
        console.log('🔴 LIVE MODE - Using Stripe production environment');
        console.log('   • Live webhooks should be configured');
        console.log('   • Real payment processing active');
        console.log('   • Test utilities are disabled');
      }
      
      // Supabase configuration check
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log(`📊 Supabase URL: ${supabaseUrl ? '✅ CONFIGURED' : '❌ MISSING'}`);
      console.log(`🔑 Supabase Anon Key: ${supabaseAnonKey ? '✅ CONFIGURED' : '❌ MISSING'}`);
      
      // Additional configuration hints
      if (!stripeTestingEnabled) {
        console.log('');
        console.log('📝 Production Checklist:');
        console.log('   □ STRIPE_SECRET_KEY set to live key');
        console.log('   □ STRIPE_WEBHOOK_SECRET updated for live endpoint');
        console.log('   □ STRIPE_PRICE_ID_PRO set to live price ID');
        console.log('   □ VITE_ENABLE_STRIPE_TEST=false');
        console.log('   □ Webhook endpoint configured for production domain');
      }
      
      console.log('================================================');
    };
    
    // Run checklist after a short delay to ensure environment is loaded
    setTimeout(runStartupChecklist, 1000);
  }, []);
  
  return null; // This component doesn't render anything
};
