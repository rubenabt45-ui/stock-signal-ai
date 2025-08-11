
import React from 'react';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { canAccessFeature, getFeatureAccessMessage } from '@/utils/premiumGating';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumGateProps {
  feature: 'strategy-ai' | 'market-updates' | 'learn' | 'advanced-features' | 'priority-support';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ 
  feature, 
  children, 
  fallback 
}) => {
  const subscriptionStatus = useSubscriptionStatus();
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  const hasAccess = canAccessFeature(feature, {
    role: subscriptionStatus.role,
    subscribed: subscriptionStatus.subscribed,
    isExpired: subscriptionStatus.isExpired
  });

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <Card className="border-amber-500/30 bg-amber-900/10">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-amber-500/20">
              <Crown className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              Pro Feature
            </h3>
            <p className="text-gray-400">
              {getFeatureAccessMessage(feature)}
            </p>
          </div>

          <Button 
            onClick={() => setShowUpgradeModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>

      <UpgradeModal 
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={feature}
      />
    </>
  );
};
