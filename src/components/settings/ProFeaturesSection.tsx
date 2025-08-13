
import { Crown } from "lucide-react";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface ProFeaturesSectionProps {
  isPro: boolean;
}

export const ProFeaturesSection: React.FC<ProFeaturesSectionProps> = ({ isPro }) => {
  const { t } = useTranslationWithFallback();

  if (!isPro) return null;

  return (
    <ErrorBoundary componentName="Pro Subscription Management">
      <div className="tradeiq-card border-green-500/20 bg-black/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Crown className="h-5 w-5 text-green-500" />
          <h3 className="text-white text-lg font-semibold">{t('settings.pro.title') || 'Pro Features'}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-white font-medium">{t('settings.pro.currentPlan') || 'Current Plan'}</p>
            <p className="text-green-400 text-sm">{t('settings.pro.proPlan') || 'Pro Plan'}</p>
          </div>
          <div>
            <p className="text-white font-medium">{t('settings.pro.benefits') || 'Benefits'}</p>
            <ul className="text-gray-400 text-sm space-y-1">
              {(() => {
                try {
                  const benefits = t('settings.pro.benefitsList', { returnObjects: true });
                  return Array.isArray(benefits) ? benefits.map((benefit: string, index: number) => (
                    <li key={index}>• {benefit}</li>
                  )) : <li>• Unlimited access to all features</li>;
                } catch {
                  return <li>• Unlimited access to all features</li>;
                }
              })()}
            </ul>
          </div>
          <div className="text-gray-500 text-xs">
            <p>{t('settings.pro.managedBy') || 'Managed through Stripe'}</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
