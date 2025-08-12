
import React from 'react';
import { Crown, Calendar, CreditCard, ArrowRight, CheckCircle, AlertTriangle, XCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

export const SubscriptionDashboard: React.FC = () => {
  const { 
    subscription_tier = 'free',
    subscription_end,
    loading = true,
    error,
    subscribed = false,
    stripeConfigured = true,
    createCheckoutSession,
    createCustomerPortalSession,
    checkSubscription 
  } = useSubscription() || {};
  const { toast } = useToast();

  const isPro = subscription_tier === 'pro';
  const isExpired = subscription_end ? new Date(subscription_end) < new Date() : false;
  const daysUntilExpiry = subscription_end ? Math.ceil((new Date(subscription_end).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;
  
  const role = isPro && !isExpired ? 'pro' : isExpired ? 'expired' : 'free';

  const handleUpgrade = async () => {
    if (!createCheckoutSession) {
      toast({
        title: "Error",
        description: "Checkout functionality is not available. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Redirecting to checkout...",
        description: "Please wait while we prepare your subscription.",
      });
      
      await createCheckoutSession();
    } catch (error) {
      console.error('Checkout error:', error);
      
      let errorMessage = "Failed to start checkout process. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('not configured')) {
          errorMessage = "Stripe is not properly configured. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    if (!createCustomerPortalSession) {
      toast({
        title: "Error",
        description: "Portal functionality is not available. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Opening customer portal...",
        description: "Redirecting you to manage your subscription.",
      });
      
      await createCustomerPortalSession();
    } catch (error) {
      console.error('Portal error:', error);
      
      let errorMessage = "Failed to open customer portal. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('not configured')) {
          errorMessage = "Stripe is not properly configured. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRefreshStatus = async () => {
    if (!checkSubscription) {
      toast({
        title: "Error",
        description: "Refresh functionality is not available. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Refreshing...",
        description: "Checking your latest subscription status.",
      });
      
      await checkSubscription();
      
      toast({
        title: "Status Updated",
        description: "Your subscription status has been refreshed.",
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Error",
        description: "Failed to refresh subscription status.",
        variant: "destructive",
      });
    }
  };

  if (error && !stripeConfigured) {
    return (
      <Card className="border-yellow-500/30 bg-yellow-900/10">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Settings className="h-12 w-12 text-yellow-400 mx-auto" />
            <h3 className="text-white font-semibold">Stripe Configuration Required</h3>
            <p className="text-gray-400 text-sm">
              Stripe payment processing is not configured. Please contact support to enable subscriptions.
            </p>
            <Button 
              onClick={handleRefreshStatus} 
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/30 bg-red-900/10">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h3 className="text-white font-semibold">Subscription Error</h3>
            <p className="text-gray-400 text-sm">
              Unable to load subscription information: {error}
            </p>
            <Button 
              onClick={handleRefreshStatus} 
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusInfo = () => {
    switch (role) {
      case 'pro':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-400" />,
          title: 'Pro Active',
          description: 'You have full access to all features',
          badgeVariant: 'default' as const,
          cardClass: 'border-green-500/30 bg-green-900/10'
        };
      case 'expired':
        return {
          icon: <XCircle className="h-5 w-5 text-red-400" />,
          title: 'Subscription Expired',
          description: 'Your Pro features have been disabled',
          badgeVariant: 'destructive' as const,
          cardClass: 'border-red-500/30 bg-red-900/10'
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
          title: 'Free Plan',
          description: 'Limited access to basic features',
          badgeVariant: 'secondary' as const,
          cardClass: 'border-gray-600/30 bg-gray-800/10'
        };
    }
  };

  const statusInfo = getStatusInfo();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-8 bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${statusInfo.cardClass} border transition-all duration-200`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {statusInfo.icon}
            <div>
              <h3 className="text-white text-lg font-semibold">Subscription Status</h3>
              <p className="text-gray-400 text-sm">{statusInfo.description}</p>
            </div>
          </div>
          <Badge variant={statusInfo.badgeVariant} className="ml-auto">
            {statusInfo.title}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Plan Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-orange-400" />
              <span className="text-white font-medium">Current Plan</span>
            </div>
            <p className="text-lg font-bold text-white capitalize">
              {role === 'pro' ? 'TradeIQ Pro' : role === 'expired' ? 'Expired Pro' : 'Free Plan'}
            </p>
            {role === 'pro' && (
              <p className="text-green-400 text-sm">$9.99/month • Active</p>
            )}
          </div>

          {subscription_end && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">
                  {role === 'expired' ? 'Expired On' : 'Next Billing'}
                </span>
              </div>
              <p className="text-lg font-bold text-white">
                {formatDate(subscription_end)}
              </p>
              {daysUntilExpiry !== null && (
                <p className={`text-sm ${
                  daysUntilExpiry > 7 ? 'text-green-400' : 
                  daysUntilExpiry > 0 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {daysUntilExpiry > 0 
                    ? `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} remaining`
                    : `Expired ${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) !== 1 ? 's' : ''} ago`
                  }
                </p>
              )}
            </div>
          )}
        </div>

        {/* Feature Access */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Feature Access</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: 'StrategyAI', available: role === 'pro' },
              { name: 'Market Updates', available: role === 'pro' },
              { name: 'Full Learn Access', available: role === 'pro' },
              { name: 'Priority Support', available: role === 'pro' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                {feature.available ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-500" />
                )}
                <span className={`text-sm ${
                  feature.available ? 'text-white' : 'text-gray-500'
                }`}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons - Only show if Stripe is configured */}
        {stripeConfigured && (
          <div className="flex flex-col sm:flex-row gap-3">
            {role !== 'pro' && (
              <Button 
                onClick={handleUpgrade}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                {role === 'expired' ? 'Renew Subscription' : 'Upgrade to Pro'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {role === 'pro' && (
              <Button 
                onClick={handleManageSubscription}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={handleRefreshStatus}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        )}

        {/* Management Note for Pro Users */}
        {role === 'pro' && stripeConfigured && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm text-center">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Subscription managed through Stripe. Use the button above to update billing details.
            </p>
          </div>
        )}

        {/* Configuration Warning */}
        {!stripeConfigured && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-300 text-sm text-center">
              <Settings className="h-4 w-4 inline mr-1" />
              Payment processing is temporarily unavailable. Please contact support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

