
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FeatureLockedScreen } from '@/components/FeatureLockedScreen';

interface ProtectedFeatureProps {
  feature: 'strategy-ai' | 'market-updates' | 'learn' | 'all-features';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  feature,
  children,
  fallback,
  title,
  description,
  icon
}) => {
  const { subscription_tier, loading } = useSubscription();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check if user can access the feature
  const hasAccess = subscription_tier === 'pro';

  if (!hasAccess) {
    // Use custom fallback or default locked screen
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default titles and descriptions for different features
    const featureInfo = {
      'strategy-ai': {
        title: 'StrategyAI Chat',
        description: 'Get personalized trading insights and chart analysis with AI-powered assistance.'
      },
      'market-updates': {
        title: 'Real-Time Market Updates',
        description: 'Stay informed with live market data, news, and economic events.'
      },
      'learn': {
        title: 'Complete Learning Center',
        description: 'Access comprehensive trading courses, tutorials, and educational resources.'
      },
      'all-features': {
        title: 'Premium Features',
        description: 'Unlock all TradeIQ Pro features for the complete trading experience.'
      }
    };

    const info = featureInfo[feature];

    return (
      <FeatureLockedScreen
        feature={feature}
        title={title || info.title}
        description={description || info.description}
        icon={icon}
      />
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
};
