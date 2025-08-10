
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';

const BillingSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { checkSubscription } = useSubscription();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh subscription status after successful payment
    const refreshStatus = async () => {
      try {
        await checkSubscription();
      } catch (error) {
        console.error('Error refreshing subscription status:', error);
      } finally {
        setLoading(false);
      }
    };

    refreshStatus();
  }, [checkSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="text-white text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto"></div>
          <div>Processing your subscription...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center p-4">
      <Card className="max-w-md w-full tradeiq-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-white text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 mb-2">
              Welcome to TradeIQ Pro! Your subscription is now active.
            </p>
            <p className="text-gray-400 text-sm">
              You now have access to all premium features.
            </p>
          </div>

          {sessionId && (
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-400 text-xs">
                Session ID: {sessionId.slice(0, 20)}...
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link to="/app" className="block">
              <Button className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/app/settings" className="block">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                Manage Subscription
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSuccess;
