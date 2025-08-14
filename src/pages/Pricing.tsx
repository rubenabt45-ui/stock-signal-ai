import React, { useState } from 'react';
import { Check, Star, TrendingUp, Brain, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { LanguageSelector } from '@/components/LanguageSelector';
import Footer from '@/components/Footer';

const Pricing = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const { t } = useTranslationWithFallback();

  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');

  const features = {
    free: [
      t('pricing.feature1.free'),
      t('pricing.feature2.free'),
      t('pricing.feature3.free'),
      t('pricing.feature4.free'),
    ],
    pro: [
      t('pricing.feature1.pro'),
      t('pricing.feature2.pro'),
      t('pricing.feature3.pro'),
      t('pricing.feature4.pro'),
      t('pricing.feature5.pro'),
      t('pricing.feature6.pro'),
      t('pricing.feature7.pro'),
    ],
  };

  const togglePlan = (plan: 'free' | 'pro') => {
    setSelectedPlan(plan);
  };

  const pricingDetails = {
    free: {
      title: t('pricing.freePlan'),
      price: t('pricing.free'),
      description: t('pricing.freePlanDescription'),
      features: features.free,
      buttonText: t('pricing.getStarted'),
      badge: t('dashboard.plan.free'),
    },
    pro: {
      title: t('pricing.proPlan'),
      price: '$29/month',
      description: t('pricing.proPlanDescription'),
      features: features.pro,
      buttonText: t('pricing.subscribeNow'),
      badge: t('dashboard.plan.pro'),
    },
  };

  const currentPlan = pricingDetails[selectedPlan];

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      <div className="container mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">{t('pricing.title')}</h1>
          <p className="text-gray-400 text-lg">{t('pricing.subtitle')}</p>
          <div className="mt-6 flex items-center justify-center space-x-4">
            <span className="text-gray-400">{t('pricing.monthly')}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={selectedPlan === 'pro'}
                onChange={() => togglePlan(selectedPlan === 'free' ? 'pro' : 'free')}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-tradeiq-blue rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-tradeiq-blue"></div>
            </label>
            <span className="text-white">{t('pricing.annual')}</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan Card */}
          <Card className="tradeiq-card">
            <CardHeader className="space-y-2.5">
              <CardTitle className="text-2xl font-bold text-white">{pricingDetails.free.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {pricingDetails.free.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="text-6xl font-semibold text-white">{pricingDetails.free.price}</div>
              <ul className="grid gap-2">
                {pricingDetails.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="h-4 w-4 mr-2 text-tradeiq-blue" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6">
              <Button className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90">
                {pricingDetails.free.buttonText}
              </Button>
            </div>
          </Card>

          {/* Pro Plan Card */}
          <Card className="tradeiq-card border-2 border-tradeiq-blue">
            <CardHeader className="space-y-2.5">
              <div className="absolute top-4 right-4">
                <Badge className="bg-tradeiq-blue text-white">{pricingDetails.pro.badge}</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-white">{pricingDetails.pro.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {pricingDetails.pro.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="text-6xl font-semibold text-white">{pricingDetails.pro.price}</div>
              <ul className="grid gap-2">
                {pricingDetails.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="h-4 w-4 mr-2 text-tradeiq-blue" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6">
              <Button className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90">
                {pricingDetails.pro.buttonText}
              </Button>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">{t('pricing.faqTitle')}</h2>
          <div className="space-y-4">
            <details className="tradeiq-card rounded-lg">
              <summary className="px-4 py-3 text-lg font-semibold text-white cursor-pointer list-none marker:hidden">
                {t('pricing.faq1.question')}
              </summary>
              <div className="px-4 py-3 text-gray-300">{t('pricing.faq1.answer')}</div>
            </details>

            <details className="tradeiq-card rounded-lg">
              <summary className="px-4 py-3 text-lg font-semibold text-white cursor-pointer list-none marker:hidden">
                {t('pricing.faq2.question')}
              </summary>
              <div className="px-4 py-3 text-gray-300">{t('pricing.faq2.answer')}</div>
            </details>

            <details className="tradeiq-card rounded-lg">
              <summary className="px-4 py-3 text-lg font-semibold text-white cursor-pointer list-none marker:hidden">
                {t('pricing.faq3.question')}
              </summary>
              <div className="px-4 py-3 text-gray-300">{t('pricing.faq3.answer')}</div>
            </details>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
