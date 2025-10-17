import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { PageWrapper } from '@/components/PageWrapper';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Bell,
  Zap,
  Activity,
  Construction
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MarketUpdates = () => {
  const { t } = useTranslationWithFallback();

  return (
    <PageWrapper pageName="MarketUpdates">
      <div className="min-h-screen bg-tradeiq-navy p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-8 w-8 text-tradeiq-blue" />
            <h1 className="text-3xl font-bold text-white">{t('marketUpdates.title')}</h1>
            <Badge variant="outline" className="text-xs">
              <Construction className="h-3 w-3 mr-1" />
              {t('marketUpdates.comingSoon')}
            </Badge>
          </div>
          <p className="text-gray-400 text-lg">
            {t('marketUpdates.subtitle')}
          </p>
        </div>

        {/* Coming Soon Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="tradeiq-card">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <CardTitle className="text-white">{t('marketUpdates.liveData.title')}</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                {t('marketUpdates.liveData.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Live price updates for stocks, forex, crypto
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Volume and volatility indicators
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Market sentiment analysis
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Custom watchlists and portfolios
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="tradeiq-card">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="h-6 w-6 text-blue-400" />
                <CardTitle className="text-white">{t('marketUpdates.smartAlerts.title')}</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                {t('marketUpdates.smartAlerts.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Price breakout alerts
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Pattern recognition notifications
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Volume spike alerts
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  News sentiment triggers
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Preview */}
        <Card className="tradeiq-card mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Activity className="h-8 w-8 text-tradeiq-blue" />
              <CardTitle className="text-2xl text-white">Market Dashboard Preview</CardTitle>
            </div>
            <CardDescription className="text-gray-300 text-lg">
              Get a glimpse of what's coming to TradeIQ Pro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800/50 rounded-lg p-8 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">+2.4%</div>
                  <div className="text-gray-400 text-sm">S&P 500</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">-0.8%</div>
                  <div className="text-gray-400 text-sm">NASDAQ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">+1.2%</div>
                  <div className="text-gray-400 text-sm">DOW JONES</div>
                </div>
              </div>
              
              <div className="aspect-video bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-tradeiq-blue mx-auto mb-4" />
                  <p className="text-xl text-gray-300">Interactive Market Charts</p>
                  <p className="text-gray-400">Real-time data visualization coming soon</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="tradeiq-card">
            <CardHeader>
              <Zap className="h-6 w-6 text-yellow-400 mb-2" />
              <CardTitle className="text-white text-lg">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Sub-second data updates ensure you never miss a market movement
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="tradeiq-card">
            <CardHeader>
              <Activity className="h-6 w-6 text-purple-400 mb-2" />
              <CardTitle className="text-white text-lg">AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Machine learning algorithms identify patterns and opportunities automatically
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="tradeiq-card">
            <CardHeader>
              <Clock className="h-6 w-6 text-green-400 mb-2" />
              <CardTitle className="text-white text-lg">24/7 Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Round-the-clock market surveillance across global exchanges
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Disclaimer: TradeIQ provides educational content and market analysis tools. 
            None of the information provided should be considered financial advice or a recommendation to invest. 
            Always do your own research and consult with a financial advisor before making investment decisions.
          </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MarketUpdates;