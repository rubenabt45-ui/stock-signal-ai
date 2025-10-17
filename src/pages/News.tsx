import React from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, AlertCircle, Globe } from 'lucide-react';

const News = () => {
  const newsArticles = [
    {
      title: "Federal Reserve Signals Potential Rate Changes",
      excerpt: "The Federal Reserve has indicated possible adjustments to interest rates in the coming quarter, impacting global markets.",
      category: "Central Banks",
      time: "2 hours ago",
      impact: "High",
      icon: TrendingUp,
    },
    {
      title: "Tech Stocks Rally on Strong Earnings Reports",
      excerpt: "Major technology companies exceed expectations, driving NASDAQ to new highs this week.",
      category: "Equities",
      time: "4 hours ago",
      impact: "Medium",
      icon: TrendingUp,
    },
    {
      title: "Oil Prices Surge Amid Supply Concerns",
      excerpt: "Crude oil prices jump 3% as geopolitical tensions raise concerns about global supply chains.",
      category: "Commodities",
      time: "6 hours ago",
      impact: "High",
      icon: AlertCircle,
    },
    {
      title: "Cryptocurrency Markets Show Mixed Signals",
      excerpt: "Bitcoin consolidates while altcoins experience varied performance across the crypto market.",
      category: "Crypto",
      time: "8 hours ago",
      impact: "Medium",
      icon: Globe,
    },
    {
      title: "European Markets React to Economic Data",
      excerpt: "European indices fluctuate following release of key manufacturing and employment statistics.",
      category: "Global Markets",
      time: "10 hours ago",
      impact: "Low",
      icon: Globe,
    },
    {
      title: "Gold Reaches New Highs Amid Economic Uncertainty",
      excerpt: "Precious metals attract investors seeking safe-haven assets during market volatility.",
      category: "Commodities",
      time: "12 hours ago",
      impact: "Medium",
      icon: TrendingUp,
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <PageWrapper pageName="News">
      <div className="min-h-screen bg-tradeiq-navy pb-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Market News</h1>
            <p className="text-gray-400">Stay updated with the latest market developments and trading insights</p>
          </div>

          <div className="space-y-4">
            {newsArticles.map((article, index) => (
              <Card key={index} className="tradeiq-card hover:border-tradeiq-blue/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getImpactColor(article.impact)}`}>
                          {article.impact} Impact
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-lg leading-tight">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{article.time}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-tradeiq-blue/20 flex items-center justify-center">
                        <article.icon className="h-5 w-5 text-tradeiq-blue" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-sm leading-relaxed">
                    {article.excerpt}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              News updates refresh automatically. All market data is for educational purposes only.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default News;
