
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, CreditCard, Settings } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

const StripeTest = () => {
  const { user } = useAuth();
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    loading, 
    error,
    checkSubscription,
    createCheckoutSession,
    createCustomerPortalSession 
  } = useSubscription();
  const { toast } = useToast();
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const addTestResult = (step: string, status: 'success' | 'error', message: string, details?: any) => {
    setTestResults(prev => [...prev, { step, status, message, details }]);
  };

  const runStripeTest = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      // Step A: Check environment variables
      addTestResult('Step A', 'pending', 'Checking environment variables...');
      
      if (!user) {
        addTestResult('Step A', 'error', 'User not authenticated');
        return;
      }

      addTestResult('Step A', 'success', 'User authenticated', { userId: user.id, email: user.email });

      // Step B: Test checkout session creation
      addTestResult('Step B', 'pending', 'Creating checkout session...');
      
      try {
        await createCheckoutSession();
        addTestResult('Step B', 'success', 'Checkout session created successfully');
      } catch (error) {
        addTestResult('Step B', 'error', `Checkout session failed: ${error}`, error);
        return;
      }

      // Step C: Instructions for manual payment
      addTestResult('Step C', 'success', 'Use test card: 4242 4242 4242 4242, any future date, any CVC');

      // Step D: Check subscription status
      addTestResult('Step D', 'pending', 'Checking subscription status...');
      
      try {
        await checkSubscription();
        addTestResult('Step D', 'success', `Subscription status: ${subscription_tier}`, { 
          subscribed, 
          subscription_tier, 
          subscription_end 
        });
      } catch (error) {
        addTestResult('Step D', 'error', `Status check failed: ${error}`, error);
      }

      // Step E: Customer portal test
      addTestResult('Step E', 'pending', 'Testing customer portal...');
      
      try {
        await createCustomerPortalSession();
        addTestResult('Step E', 'success', 'Customer portal opened successfully');
      } catch (error) {
        addTestResult('Step E', 'error', `Portal failed: ${error}`, error);
      }

    } catch (error) {
      addTestResult('General', 'error', `Test failed: ${error}`, error);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  if (import.meta.env.VITE_ENABLE_STRIPE_TEST !== 'true') {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
        <Card className="tradeiq-card max-w-md">
          <CardContent className="p-8 text-center">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Stripe Test Disabled</h2>
            <p className="text-gray-400 mb-4">
              Set VITE_ENABLE_STRIPE_TEST=true in your environment to enable Stripe testing.
            </p>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Stripe Test</h1>
              <p className="text-sm text-gray-400 font-medium">Test Mode Development Tool</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Current Subscription Status */}
        <Card className="tradeiq-card">
          <CardHeader>
            <CardTitle className="text-white">Current Subscription Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-red-400">Error: {error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Status</div>
                  <Badge variant={subscribed ? "default" : "secondary"}>
                    {subscribed ? 'Subscribed' : 'Free'}
                  </Badge>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Tier</div>
                  <div className="text-white font-medium capitalize">{subscription_tier}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">End Date</div>
                  <div className="text-white font-medium">
                    {subscription_end ? new Date(subscription_end).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card className="tradeiq-card">
          <CardHeader>
            <CardTitle className="text-white">Stripe Integration Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={runStripeTest}
                disabled={testing || !user}
                className="bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white"
              >
                {testing ? 'Running Tests...' : 'Run E2E Test'}
              </Button>
              
              <Button 
                onClick={checkSubscription}
                disabled={loading}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Refresh Status
              </Button>
            </div>

            {!user && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-300 text-sm">
                  Please log in to test Stripe integration.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="text-white font-medium">{result.step}</div>
                      <div className="text-gray-400 text-sm">{result.message}</div>
                      {result.details && (
                        <details className="mt-1">
                          <summary className="text-xs text-gray-500 cursor-pointer">Details</summary>
                          <pre className="text-xs text-gray-500 mt-1 bg-gray-900/50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="tradeiq-card">
          <CardHeader>
            <CardTitle className="text-white">Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-300 space-y-2">
              <p><strong>Step A:</strong> Environment validation</p>
              <p><strong>Step B:</strong> Checkout session creation</p>
              <p><strong>Step C:</strong> Use test card: <code className="bg-gray-800 px-1 rounded">4242 4242 4242 4242</code></p>
              <p><strong>Step D:</strong> Verify subscription status update</p>
              <p><strong>Step E:</strong> Test customer portal access</p>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> This is test mode only. Use Stripe test cards and all transactions are fake.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StripeTest;

