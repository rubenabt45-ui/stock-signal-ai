
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface StripeTestResults {
  envCheck: boolean;
  checkoutUrl: string | null;
  statusBefore: any;
  statusAfter: any;
  webhookEvents: string[];
  isPremiumBefore: boolean;
  isPremiumAfter: boolean;
}

export const useStripeTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<StripeTestResults>({
    envCheck: false,
    checkoutUrl: null,
    statusBefore: null,
    statusAfter: null,
    webhookEvents: [],
    isPremiumBefore: false,
    isPremiumAfter: false
  });
  const [loading, setLoading] = useState(false);

  const checkEnvironment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('test-stripe-env');
      if (error) throw error;
      
      const allPresent = data.allRequired;
      if (!allPresent) {
        const missing = Object.entries(data)
          .filter(([key, value]) => key !== 'allRequired' && !value)
          .map(([key]) => key);
        toast({
          title: "Missing Environment Variables",
          description: `Missing: ${missing.join(', ')}`,
          variant: "destructive",
        });
        return false;
      }
      
      console.log('✅ Environment check passed - all required variables present');
      return true;
    } catch (error) {
      console.error('❌ Environment check failed:', error);
      toast({
        title: "Environment Check Failed",
        description: "Failed to verify environment variables",
        variant: "destructive",
      });
      return false;
    }
  };

  const generateCheckoutUrl = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('test-stripe-checkout-url', {
        method: 'POST'
      });
      if (error) throw error;
      
      const isTestUrl = data.url && data.url.includes('checkout.stripe.com/c/pay/');
      if (!isTestUrl) {
        throw new Error('Generated URL is not a valid Stripe test checkout URL');
      }
      
      console.log('✅ Checkout URL generated:', data.url.substring(0, 50) + '...');
      return data.url;
    } catch (error) {
      console.error('❌ Checkout URL generation failed:', error);
      toast({
        title: "Checkout URL Generation Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      return null;
    }
  };

  const checkStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('test-stripe-status');
      if (error) throw error;
      
      console.log('📊 Status check result:', {
        isPremium: data.isPremium,
        supabase: data.supabase,
        stripe: data.stripe
      });
      
      return data;
    } catch (error) {
      console.error('❌ Status check failed:', error);
      toast({
        title: "Status Check Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      return null;
    }
  };

  const runAutomatedTest = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to run the test",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const results: Partial<StripeTestResults> = {};

    try {
      // Step A: Check environment
      console.log('🔍 Step A: Checking environment...');
      results.envCheck = await checkEnvironment();
      if (!results.envCheck) {
        throw new Error('Environment check failed');
      }

      // Step B: Generate checkout URL
      console.log('🔗 Step B: Generating checkout URL...');
      results.checkoutUrl = await generateCheckoutUrl();
      if (!results.checkoutUrl) {
        throw new Error('Checkout URL generation failed');
      }

      // Step C: Get initial status
      console.log('📊 Step C: Getting initial status...');
      results.statusBefore = await checkStatus();
      results.isPremiumBefore = results.statusBefore?.isPremium || false;

      setTestResults(prev => ({ ...prev, ...results }));

      toast({
        title: "Test Ready",
        description: "Please complete payment with test card 4242 4242 4242 4242",
      });

      console.log('🎯 Test is ready! Please complete payment and then call verifyPayment()');
      console.log('💳 Checkout URL:', results.checkoutUrl);
      
      return results.checkoutUrl;
    } catch (error) {
      console.error('❌ Automated test failed:', error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    try {
      console.log('✅ Step D: Verifying payment...');
      const statusAfter = await checkStatus();
      
      if (!statusAfter) {
        throw new Error('Failed to get status after payment');
      }

      const isPremiumAfter = statusAfter.isPremium;
      
      setTestResults(prev => ({
        ...prev,
        statusAfter,
        isPremiumAfter
      }));

      if (isPremiumAfter && statusAfter.supabase?.subscription_status === 'active') {
        console.log('✅ Payment verification successful!');
        toast({
          title: "Payment Verified",
          description: "User is now Premium with active subscription",
        });
      } else {
        console.log('❌ Payment verification failed - user not premium');
        toast({
          title: "Payment Verification Failed",
          description: "User is not showing as Premium after payment",
          variant: "destructive",
        });
      }
      
      return statusAfter;
    } catch (error) {
      console.error('❌ Payment verification failed:', error);
      toast({
        title: "Payment Verification Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const verifyCancellation = async () => {
    try {
      console.log('🚫 Step E: Verifying cancellation...');
      const statusAfter = await checkStatus();
      
      if (!statusAfter) {
        throw new Error('Failed to get status after cancellation');
      }

      const isPremiumAfter = statusAfter.isPremium;
      
      setTestResults(prev => ({
        ...prev,
        statusAfter,
        isPremiumAfter
      }));

      if (!isPremiumAfter) {
        console.log('✅ Cancellation verification successful!');
        toast({
          title: "Cancellation Verified",
          description: "User is no longer Premium",
        });
      } else {
        console.log('❌ Cancellation verification failed - user still premium');
        toast({
          title: "Cancellation Verification Failed",
          description: "User is still showing as Premium after cancellation",
          variant: "destructive",
        });
      }
      
      return statusAfter;
    } catch (error) {
      console.error('❌ Cancellation verification failed:', error);
      toast({
        title: "Cancellation Verification Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const printFinalReport = () => {
    console.log('\n📋 FINAL TEST REPORT');
    console.log('==================');
    console.log('Environment Check:', testResults.envCheck ? '✅ PASS' : '❌ FAIL');
    console.log('Checkout URL:', testResults.checkoutUrl ? '✅ Generated' : '❌ Failed');
    console.log('Initial Premium Status:', testResults.isPremiumBefore ? '✅ True' : '❌ False');
    console.log('Final Premium Status:', testResults.isPremiumAfter ? '✅ True' : '❌ False');
    console.log('\nFiles Modified (Logic Only):');
    console.log('- src/hooks/useStripeTest.ts (enhanced)');
    console.log('- src/hooks/useStripeActions.ts (wired CTAs)');
    console.log('- src/components/StripeTestRunner.tsx (enhanced UI)');
    console.log('\nWebhook Events: Check function logs for stripe-webhook');
  };

  return {
    testResults,
    loading,
    runAutomatedTest,
    verifyPayment,
    verifyCancellation,
    printFinalReport,
    checkEnvironment,
    generateCheckoutUrl,
    checkStatus
  };
};
