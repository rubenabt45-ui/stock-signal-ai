
import React from "react";
import { Calendar, TrendingUp, Bell, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { PageWrapper } from '@/components/PageWrapper';

const EconomicEvents = () => {
  const { t } = useTranslationWithFallback();

  const features = [
    {
      icon: TrendingUp,
      title: t('economicEvents.features.realtime'),
      description: t('economicEvents.features.realtime')
    },
    {
      icon: BarChart3,
      title: t('economicEvents.features.filtered'),
      description: t('economicEvents.features.filtered')
    },
    {
      icon: Calendar,
      title: t('economicEvents.features.historical'),
      description: t('economicEvents.features.historical')
    },
    {
      icon: Bell,
      title: t('economicEvents.features.alerts'),
      description: t('economicEvents.features.alerts')
    }
  ];

  return (
    <PageWrapper pageName="EconomicEvents">
      <div className="min-h-screen bg-tradeiq-navy">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-tradeiq-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">{t('economicEvents.title')}</h1>
                  <p className="text-sm text-gray-400 font-medium">{t('economicEvents.subtitle')}</p>
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
                {t('economicEvents.description')}
              </p>
            </div>

            {/* Features Grid */}
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
              <Card className="tradeiq-card border-tradeiq-blue/30">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-tradeiq-blue/20 rounded-full">
                      <Calendar className="h-8 w-8 text-tradeiq-blue" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Economic Calendar In Development</h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    {t('economicEvents.availability')}
                  </p>
                  <div className="text-sm text-gray-400">
                    Get ready for comprehensive market event tracking
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

export default EconomicEvents;
