
import React from "react";
import { TrendingUp, Zap, Bell, Globe } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { PageWrapper } from '@/components/PageWrapper';

const MarketUpdates = () => {
  const { t } = useTranslationWithFallback();

  const features = [
    {
      icon: Globe,
      title: t('marketUpdates.features.monitoring'),
      description: t('marketUpdates.features.monitoring')
    },
    {
      icon: TrendingUp,
      title: t('marketUpdates.features.analysis'),
      description: t('marketUpdates.features.analysis')
    },
    {
      icon: Bell,
      title: t('marketUpdates.features.alerts'),
      description: t('marketUpdates.features.alerts')
    },
    {
      icon: Zap,
      title: t('marketUpdates.features.news'),
      description: t('marketUpdates.features.news')
    }
  ];

  return (
    <PageWrapper pageName="MarketUpdates">
      <div className="min-h-screen bg-tradeiq-navy">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">{t('marketUpdates.title')}</h1>
                  <p className="text-sm text-gray-400 font-medium">{t('marketUpdates.subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-12 pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <div className="text-center mb-12">
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                {t('marketUpdates.description')}
              </p>
            </div>

            {/* Main Features */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="tradeiq-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-tradeiq-blue/20 rounded-lg">
                      <Zap className="h-6 w-6 text-tradeiq-blue" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">{t('marketUpdates.liveData.title')}</h3>
                      <p className="text-gray-400 text-sm">{t('marketUpdates.liveData.description')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="tradeiq-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-tradeiq-blue/20 rounded-lg">
                      <Bell className="h-6 w-6 text-tradeiq-blue" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">{t('marketUpdates.smartAlerts.title')}</h3>
                      <p className="text-gray-400 text-sm">{t('marketUpdates.smartAlerts.description')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="tradeiq-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-tradeiq-blue/20 rounded-lg">
                        <feature.icon className="h-6 w-6 text-tradeiq-blue" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Availability Notice */}
            <div className="text-center">
              <Card className="tradeiq-card border-green-500/30">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-green-500/20 rounded-full">
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Pro Feature Available</h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    {t('marketUpdates.availability')}
                  </p>
                  <div className="text-sm text-gray-400">
                    Upgrade to Pro to access real-time market data and AI-powered insights
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
};

export default MarketUpdates;
