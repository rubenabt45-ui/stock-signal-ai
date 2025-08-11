
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { StripeTestRunner } from '@/components/StripeTestRunner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

const StripeTestPage: React.FC = () => {
  const { user, loading } = useAuth();

  // Check if testing is enabled via environment flag
  const isTestingEnabled = import.meta.env.VITE_ENABLE_STRIPE_TEST === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if testing is disabled
  if (!isTestingEnabled) {
    return (
      <div className="min-h-screen bg-tradeiq-navy p-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Stripe Testing Disabled</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">
                Stripe testing is currently disabled. To enable it, set the environment variable:
              </p>
              <code className="block mt-2 p-2 bg-gray-800 rounded text-green-400">
                VITE_ENABLE_STRIPE_TEST=true
              </code>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-tradeiq-blue" />
            <h1 className="text-2xl font-bold text-white">Stripe Test Environment</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            This is a developer-only testing environment for validating Stripe integration. 
            All tests run in Stripe test mode with test payment methods.
          </p>
        </div>

        {/* Test Runner */}
        <div className="mb-8">
          <StripeTestRunner />
        </div>

        {/* Developer Notes */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-blue-400">Developer Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-300 space-y-2">
            <p>• Use test card: <code className="bg-gray-800 px-2 py-1 rounded">4242 4242 4242 4242</code></p>
            <p>• All transactions are in Stripe test mode</p>
            <p>• Check console logs for detailed step-by-step debugging</p>
            <p>• Webhook events are logged in the edge function console</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StripeTestPage;
