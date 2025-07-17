import React from 'react';
import { Lock, Crown, ArrowRight, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { useToast } from '@/hooks/use-toast';

interface FeatureLockedScreenProps {
  feature: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const FeatureLockedScreen: React.FC<FeatureLockedScreenProps> = ({
  feature,
  title,
  description,
  icon
}) => {
  const { createCheckoutSession, role, daysUntilExpiry } = useSubscriptionStatus();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      toast({
        title: "Redirecting to checkout...",
        description: "Please wait while we prepare your subscription.",
      });
      
      await createCheckoutSession();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusMessage = () => {
    switch (role) {
      case 'expired':
        return {
          title: "Subscription Expired",
          message: "Your Pro subscription has expired. Renew to regain access to premium features.",
          action: "Renew Subscription",
          variant: "destructive" as const
        };
      case 'free':
        return {
          title: "Pro Feature",
          message: "Upgrade to Pro to unlock this feature and get unlimited access.",
          action: "Upgrade to Pro",
          variant: "default" as const
        };
      default:
        return {
          title: "Access Restricted",
          message: "This feature requires a Pro subscription.",
          action: "Get Pro Access",
          variant: "default" as const
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center space-y-6">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                {icon || <Lock className="h-10 w-10 text-gray-400" />}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
            {statusInfo.title}
          </Badge>

          {/* Feature Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>

          {/* Expiry Warning for Expired Users */}
          {role === 'expired' && daysUntilExpiry !== null && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 text-red-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Expired {Math.abs(daysUntilExpiry)} day{Math.abs(daysUntilExpiry) !== 1 ? 's' : ''} ago
                </span>
              </div>
            </div>
          )}

          {/* Pro Features List */}
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
            <h3 className="text-white font-semibold text-sm">What you get with Pro:</h3>
            <div className="space-y-2">
              {[
                'Unlimited StrategyAI messages',
                'Real-time market updates',
                'Complete learning modules',
                'Priority customer support',
                'Advanced trading insights'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              $9.99<span className="text-lg font-normal text-gray-400">/month</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Cancel anytime</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              {statusInfo.action}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>

          {/* Status Message */}
          <p className="text-gray-400 text-sm">{statusInfo.message}</p>
        </CardContent>
      </Card>
    </div>
  );
};