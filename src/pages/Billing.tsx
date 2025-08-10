
import React from 'react';
import { CreditCard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { PageWrapper } from '@/components/PageWrapper';

const Billing = () => {
  const { createCustomerPortalSession, isPro, loading } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      await createCustomerPortalSession();
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="text-white text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto"></div>
          <div>Loading billing information...</div>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper pageName="Billing">
      <div className="min-h-screen bg-tradeiq-navy">
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Billing</h1>
                <p className="text-sm text-gray-400 font-medium">Manage your subscription</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Card className="max-w-2xl mx-auto tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Subscription Management</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  {isPro 
                    ? "You're currently on the Pro plan. Use the customer portal to manage your subscription, update payment methods, or view billing history."
                    : "Manage your billing preferences and subscription settings through Stripe's secure customer portal."
                  }
                </p>
                
                <Button 
                  onClick={handleManageSubscription}
                  className="bg-tradeiq-blue hover:bg-tradeiq-blue/90"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Open Customer Portal
                </Button>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">What you can do:</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Update payment methods</li>
                  <li>• View billing history and invoices</li>
                  <li>• Cancel or modify your subscription</li>
                  <li>• Download receipts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </PageWrapper>
  );
};

export default Billing;
