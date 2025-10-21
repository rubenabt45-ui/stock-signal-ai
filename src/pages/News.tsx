import React, { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, TrendingUp, AlertCircle, Globe, RefreshCw, Newspaper, Search, DollarSign, Zap, Activity, BarChart3 } from 'lucide-react';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrapper';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Stocks', 'Crypto', 'Forex', 'Indices', 'ETFs', 'Commodities'];
  const sentiments = ['Bullish', 'Bearish', 'Neutral'];
  const newsTypes = ['Earnings', 'Analyst', 'Corporate', 'Market', 'Technical', 'Macro'];

  // Mock news data for demonstration
  const mockNews = [
    {
      id: 1,
      title: "Apple Announces Record Q4 Earnings, Stock Surges 5%",
      summary: "Apple Inc. reported better-than-expected earnings for Q4, driven by strong iPhone 15 sales and growing services revenue. The company's revenue reached $123.5B, beating analyst estimates.",
      source: "Financial Times",
      time: "2 hours ago",
      sentiment: "Bullish",
      category: "Earnings",
      symbol: "AAPL",
      impact: "High"
    },
    {
      id: 2,
      title: "Federal Reserve Hints at Rate Cuts in 2025",
      summary: "In today's FOMC meeting, Chair Powell suggested that interest rate cuts could begin in Q2 2025 if inflation continues to trend downward. Markets rallied on the news.",
      source: "Bloomberg",
      time: "3 hours ago",
      sentiment: "Bullish",
      category: "Macro",
      symbol: "SPY",
      impact: "High"
    },
    {
      id: 3,
      title: "Tesla Recalls 2M Vehicles Over Autopilot Safety Concerns",
      summary: "Tesla announced a voluntary recall affecting 2 million vehicles to update Autopilot software following NHTSA safety review. Stock dropped 3% in after-hours trading.",
      source: "Reuters",
      time: "5 hours ago",
      sentiment: "Bearish",
      category: "Corporate",
      symbol: "TSLA",
      impact: "Medium"
    },
    {
      id: 4,
      title: "Microsoft Azure Growth Accelerates, Beats Cloud Expectations",
      summary: "Microsoft reported 30% year-over-year growth in Azure revenue, outpacing AWS and Google Cloud. AI integration driving enterprise adoption.",
      source: "CNBC",
      time: "6 hours ago",
      sentiment: "Bullish",
      category: "Earnings",
      symbol: "MSFT",
      impact: "High"
    },
    {
      id: 5,
      title: "Oil Prices Decline on Demand Concerns",
      summary: "WTI crude falls below $75/barrel as global demand forecasts are revised downward. OPEC+ production cuts failing to support prices.",
      source: "Wall Street Journal",
      time: "8 hours ago",
      sentiment: "Bearish",
      category: "Commodities",
      symbol: "USO",
      impact: "Medium"
    },
    {
      id: 6,
      title: "Goldman Sachs Upgrades NVIDIA to Buy",
      summary: "Goldman Sachs analysts raised their price target for NVIDIA to $850, citing strong AI chip demand and expanding market share in data center segment.",
      source: "MarketWatch",
      time: "1 day ago",
      sentiment: "Bullish",
      category: "Analyst",
      symbol: "NVDA",
      impact: "High"
    }
  ];

  const handleRefresh = () => {
    console.log('Refreshing news...');
  };

  // Filter news based on selected filters and search query
  const filteredNews = useMemo(() => {
    return mockNews.filter(news => {
      // Filter by category
      if (selectedCategory && news.category !== selectedCategory) {
        return false;
      }
      
      // Filter by sentiment
      if (selectedSentiment && news.sentiment !== selectedSentiment) {
        return false;
      }
      
      // Filter by news type
      if (selectedType && news.category !== selectedType) {
        return false;
      }
      
      // Filter by search query (searches in title, summary, and symbol)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          news.title.toLowerCase().includes(query) ||
          news.summary.toLowerCase().includes(query) ||
          news.symbol.toLowerCase().includes(query) ||
          news.source.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [selectedCategory, selectedSentiment, selectedType, searchQuery]);

  return (
    <PageWrapper pageName="News">
      <div className="min-h-screen bg-tradeiq-navy pb-20">
        {/* Header */}
        <header className="bg-black/90 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50 shadow-lg">
          <MotionWrapper animation="slide" className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Newspaper className="h-10 w-10 text-tradeiq-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-white">News</h1>
                  <p className="text-sm text-gray-400">Real-time financial news</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="gap-2 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <div className="text-white font-medium">
                  Free Plan
                </div>
              </div>
            </div>
          </MotionWrapper>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <StaggerContainer>

          {/* Header Section */}
          <StaggerItem>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Filter News</h2>
              <p className="text-gray-400">Find relevant financial news for your portfolio</p>
            </div>
          </StaggerItem>

          {/* Search Bar */}
          <StaggerItem>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search symbols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-4 text-lg bg-gray-900/50 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-tradeiq-blue focus:ring-2 focus:ring-tradeiq-blue/20"
                />
              </div>
            </div>
          </StaggerItem>

          {/* Asset Categories */}
          <StaggerItem>
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                const getIcon = () => {
                  switch(category) {
                    case 'Stocks': return <TrendingUp className="h-4 w-4" />;
                    case 'Crypto': return <DollarSign className="h-4 w-4" />;
                    case 'Forex': return <Globe className="h-4 w-4" />;
                    case 'Indices': return <BarChart3 className="h-4 w-4" />;
                    case 'Commodities': return <Zap className="h-4 w-4" />;
                    case 'ETFs': return <Activity className="h-4 w-4" />;
                    default: return null;
                  }
                };
                
                return (
                  <Button
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                    className={`gap-2 rounded-full px-6 transition-all ${
                      isSelected 
                        ? "bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white border-tradeiq-blue" 
                        : "bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    {getIcon()}
                    {category}
                  </Button>
                );
              })}
            </div>
          </div>
        </StaggerItem>

        {/* Filters: Market Sentiment & News Types */}
        <StaggerItem>
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Market Sentiment */}
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Market Sentiment</label>
                <div className="flex flex-wrap gap-2">
                  {sentiments.map((sentiment) => {
                    const isSelected = selectedSentiment === sentiment;
                    return (
                      <Button
                        key={sentiment}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSentiment(selectedSentiment === sentiment ? '' : sentiment)}
                        className={`rounded-full transition-all ${
                          isSelected 
                            ? "bg-tradeiq-blue/20 border-tradeiq-blue text-tradeiq-blue" 
                            : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-600"
                        }`}
                      >
                        {sentiment}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* News Types */}
              <div>
                <label className="text-sm text-gray-400 mb-3 block">News Types</label>
                <div className="flex flex-wrap gap-2">
                  {newsTypes.map((type) => {
                    const isSelected = selectedType === type;
                    return (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedType(selectedType === type ? '' : type)}
                        className={`rounded-full transition-all ${
                          isSelected 
                            ? "bg-tradeiq-blue/20 border-tradeiq-blue text-tradeiq-blue" 
                            : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-600"
                        }`}
                      >
                        {type}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Latest Financial News Section */}
        <StaggerItem>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Latest Financial News</h2>
              <p className="text-sm text-gray-400 mt-1">
                Showing {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Auto-refresh every 15min
            </div>
          </div>

          {/* News Grid or Empty State */}
          {filteredNews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((news) => (
              <StaggerItem key={news.id}>
                <Card className="tradeiq-card hover:border-tradeiq-blue/50 transition-all cursor-pointer group h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          news.sentiment === 'Bullish' 
                            ? 'border-green-500/50 text-green-400' 
                            : news.sentiment === 'Bearish'
                            ? 'border-red-500/50 text-red-400'
                            : 'border-gray-500/50 text-gray-400'
                        }`}
                      >
                        {news.sentiment}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {news.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-2 group-hover:text-tradeiq-blue transition-colors">
                      {news.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-3 mt-2">
                      {news.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span>{news.source}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{news.time}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-tradeiq-blue/30 text-tradeiq-blue"
                      >
                        {news.symbol}
                      </Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Impact</span>
                        <div className="flex items-center gap-1">
                          {news.impact === 'High' && (
                            <>
                              <TrendingUp className="h-3 w-3 text-tradeiq-blue" />
                              <span className="text-xs font-medium text-tradeiq-blue">High</span>
                            </>
                          )}
                          {news.impact === 'Medium' && (
                            <>
                              <AlertCircle className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs font-medium text-yellow-400">Medium</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
          ) : (
            <Card className="tradeiq-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-lg bg-gray-800/50 flex items-center justify-center mb-4">
                  <Newspaper className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">No News Found</h3>
                <p className="text-gray-400 text-sm mb-6 text-center max-w-md">
                  No articles match your current filters. Try adjusting your search or filter criteria.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSentiment('');
                    setSelectedType('');
                    setSearchQuery('');
                  }}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </StaggerItem>
      </StaggerContainer>
        </div>
      </div>
    </PageWrapper>
  );
};

export default News;
