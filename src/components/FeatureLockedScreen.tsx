
import React from 'react';
import { Lock, Crown, ArrowRight, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { useNavigate } from 'react-router-dom';

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
  const { createCheckoutSession, subscription_tier, subscribed, subscription_end } = useSubscription();
  const { toast } = useToast();
  const { t } = useTranslationWithFallback();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    try {
      toast({
        title: t('features.locked.redirecting'),
        description: t('features.locked.redirectingDescription'),
      });
      
      await createCheckoutSession();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('features.locked.checkoutError'),
        variant: "destructive",
      });
    }
  };

  const handleViewPricing = () => {
    navigate('/pricing');
  };

  // Determine user role based on subscription status
  const getUserRole = () => {
    if (!subscribed) return 'free';
    if (subscribed && subscription_end) {
      const endDate = new Date(subscription_end);
      const now = new Date();
      if (endDate < now) return 'expired';
    }
    return subscription_tier;
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    if (!subscription_end) return null;
    const endDate = new Date(subscription_end);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const role = getUserRole();
  const daysUntilExpiry = getDaysUntilExpiry();

  const getStatusMessage = () => {
    switch (role) {
      case 'expired':
        return {
          title: t('features.locked.subscriptionExpired.title'),
          message: t('features.locked.subscriptionExpired.message'),
          action: t('features.locked.subscriptionExpired.action'),
          variant: "destructive" as const,
          showPricing: false
        };
      case 'free':
        return {
          title: t('features.locked.proFeature.title'),
          message: t('features.locked.proFeature.message'),
          action: t('features.locked.proFeature.action'),
          variant: "default" as const,
          showPricing: true
        };
      default:
        return {
          title: t('features.locked.accessRestricted.title'),
          message: t('features.locked.accessRestricted.message'),
          action: t('features.locked.accessRestricted.action'),
          variant: "default" as const,
          showPricing: true
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
                  {t('features.locked.expired', { 
                    days: Math.abs(daysUntilExpiry),
                    plural: Math.abs(daysUntilExpiry) !== 1 ? 's' : ''
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Pro Features List */}
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
            <h3 className="text-white font-semibold text-sm">{t('features.locked.benefits.title')}</h3>
            <div className="space-y-2">
              {[
                t('features.locked.benefits.unlimited'),
                t('features.locked.benefits.realtime'),
                t('features.locked.benefits.learning'),
                t('features.locked.benefits.support'),
                t('features.locked.benefits.insights')
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
              {t('features.locked.pricing.monthly')}<span className="text-lg font-normal text-gray-400">{t('features.locked.pricing.period')}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{t('common.cancelAnytime')}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {statusInfo.showPricing ? (
              <>
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Unlock {title} Pro
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={handleViewPricing}
                >
                  See Plans & Benefits
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                {statusInfo.action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => window.history.back()}
            >
              {t('common.goBack')}
            </Button>
          </div>

          {/* Status Message */}
          <p className="text-gray-400 text-sm">{statusInfo.message}</p>
        </CardContent>
      </Card>
    </div>
  );
};
