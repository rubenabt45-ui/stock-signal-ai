import React, { useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, AlertCircle, Globe, RefreshCw, Newspaper } from 'lucide-react';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Stocks');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const categories = ['Stocks', 'Crypto', 'Forex', 'Indices', 'ETFs', 'Commodities'];
  const sentiments = ['Bullish', 'Bearish', 'Neutral'];
  const newsTypes = ['Earnings', 'Analyst', 'Corporate', 'Market', 'Technical', 'Macro'];

  const handleRefresh = () => {
    // Placeholder for refresh functionality
    console.log('Refreshing news...');
  };

  return (
    <PageWrapper pageName="News">
      <div className="min-h-screen bg-tradeiq-navy pb-20">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-tradeiq-blue/20 flex items-center justify-center flex-shrink-0">
                <Newspaper className="h-6 w-6 text-tradeiq-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">AI Market News for AAPL</h1>
                <p className="text-gray-400 text-sm">Real-time financial news powered by Marketaux API</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Asset Categories */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Asset Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-tradeiq-blue hover:bg-tradeiq-blue/90" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Market Sentiment</h3>
            <div className="flex flex-wrap gap-2">
              {sentiments.map((sentiment) => (
                <Button
                  key={sentiment}
                  variant={selectedSentiment === sentiment ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSentiment(selectedSentiment === sentiment ? '' : sentiment)}
                  className={selectedSentiment === sentiment ? "bg-tradeiq-blue hover:bg-tradeiq-blue/90" : ""}
                >
                  {sentiment}
                </Button>
              ))}
            </div>
          </div>

          {/* News Types */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-3">News Types</h3>
            <div className="flex flex-wrap gap-2">
              {newsTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(selectedType === type ? '' : type)}
                  className={selectedType === type ? "bg-tradeiq-blue hover:bg-tradeiq-blue/90" : ""}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Latest Financial News Section */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Latest Financial News</h2>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Auto-refresh every 15min
            </div>
          </div>

          {/* Empty State */}
          <Card className="tradeiq-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-lg bg-gray-800/50 flex items-center justify-center mb-4">
                <Newspaper className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No News Available</h3>
              <p className="text-gray-400 text-sm mb-6 text-center max-w-md">
                No recent financial news found for AAPL from Marketaux API.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default News;
