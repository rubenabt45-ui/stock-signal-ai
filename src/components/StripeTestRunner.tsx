import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStripeTest } from '@/hooks/useStripeTest';
import { Play, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

const StripeTestRunner: React.FC = () => {
  const { 
    testResults, 
    loading, 
    runAutomatedTest, 
    verifyPayment, 
    verifyCancellation, 
    printFinalReport 
  } = useStripeTest();
  const [testPhase, setTestPhase] = useState<'ready' | 'checkout' | 'payment' | 'cancellation' | 'complete'>('ready');

  const handleStartTest = async () => {
    setTestPhase('checkout');
    const checkoutUrl = await runAutomatedTest();
    if (checkoutUrl) {
      setTestPhase('payment');
    }
  };

  const handleVerifyPayment = async () => {
    const result = await verifyPayment();
    if (result?.isPremium) {
      setTestPhase('cancellation');
    }
  };

  const handleVerifyCancellation = async () => {
    await verifyCancellation();
    setTestPhase('complete');
    printFinalReport();
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Clock className="h-4 w-4 text-gray-400" />;
    return status ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5" />
          <span>Stripe Test Runner</span>
          <Badge variant={testPhase === 'complete' ? 'default' : 'secondary'}>
            {testPhase.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Test Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Environment Check</span>
            {getStatusIcon(testResults.envCheck || null)}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Checkout URL Generated</span>
            {getStatusIcon(testResults.checkoutUrl ? true : null)}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Payment Verified</span>
            {getStatusIcon(testResults.isPremiumBefore ? true : null)}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Cancellation Verified</span>
            {getStatusIcon(testPhase === 'complete' ? !testResults.isPremiumAfter : null)}
          </div>
        </div>

        {/* Checkout URL Display */}
        {testResults.checkoutUrl && testPhase === 'payment' && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm mb-2">
              Complete payment with test card: <code>4242 4242 4242 4242</code>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(testResults.checkoutUrl!, '_blank')}
              className="text-blue-300 border-blue-500/30"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Checkout
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {testPhase === 'ready' && (
            <Button 
              onClick={handleStartTest}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Running...' : 'Start Automated Test'}
            </Button>
          )}

          {testPhase === 'payment' && (
            <Button 
              onClick={handleVerifyPayment}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Verify Payment (after completing checkout)
            </Button>
          )}

          {testPhase === 'cancellation' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 text-center">
                Please cancel your subscription in the Customer Portal, then verify:
              </p>
              <Button 
                onClick={handleVerifyCancellation}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Verify Cancellation
              </Button>
            </div>
          )}

          {testPhase === 'complete' && (
            <div className="text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
              <p className="text-green-400 font-medium">Test Complete!</p>
              <p className="text-sm text-gray-400">Check console for detailed report</p>
            </div>
          )}
        </div>

        {/* Test Results Summary */}
        {testResults.statusBefore && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Test Results</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Initial Premium Status:</span>
                <span className={testResults.isPremiumBefore ? 'text-green-400' : 'text-red-400'}>
                  {testResults.isPremiumBefore ? 'True' : 'False'}
                </span>
              </div>
              {testResults.statusAfter && (
                <div className="flex justify-between">
                  <span>Final Premium Status:</span>
                  <span className={testResults.isPremiumAfter ? 'text-green-400' : 'text-red-400'}>
                    {testResults.isPremiumAfter ? 'True' : 'False'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeTestRunner;
