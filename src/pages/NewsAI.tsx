
import { useState, useEffect } from "react";
import { Newspaper, TrendingUp, ExternalLink, Clock, ChevronRight, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetSelection } from "@/components/AssetSelection";
import { useQuery } from "@tanstack/react-query";

interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  datetime: number;
  url: string;
  summary?: string;
  category?: string;
}

interface AIAnalysis {
  summary: string[];
  sentiment: "Bullish" | "Bearish" | "Neutral";
  insights: string;
}

const NewsAI = () => {
  const [selectedAsset, setSelectedAsset] = useState("AAPL");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Fetch news for selected asset
  const { data: newsArticles, isLoading } = useQuery({
    queryKey: ['news', selectedAsset],
    queryFn: async () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      try {
        // Using a mock data structure for demo purposes
        // In production, this would call the Finnhub API
        const mockNews: NewsArticle[] = [
          {
            id: "1",
            headline: `${selectedAsset} Reports Strong Q4 Earnings, Beats Analyst Expectations`,
            source: "MarketWatch",
            datetime: Date.now() - 1000 * 60 * 60 * 2,
            url: "https://example.com/news1",
            category: "earnings"
          },
          {
            id: "2",
            headline: `Major Investment Firm Upgrades ${selectedAsset} Price Target`,
            source: "Bloomberg",
            datetime: Date.now() - 1000 * 60 * 60 * 4,
            url: "https://example.com/news2",
            category: "analyst"
          },
          {
            id: "3",
            headline: `${selectedAsset} Announces New Strategic Partnership`,
            source: "Reuters",
            datetime: Date.now() - 1000 * 60 * 60 * 6,
            url: "https://example.com/news3",
            category: "corporate"
          },
          {
            id: "4",
            headline: `Market Volatility Affects ${selectedAsset} Trading Volume`,
            source: "Financial Times",
            datetime: Date.now() - 1000 * 60 * 60 * 8,
            url: "https://example.com/news4",
            category: "market"
          },
          {
            id: "5",
            headline: `${selectedAsset} Stock Technical Analysis: Key Support Levels`,
            source: "TradingView",
            datetime: Date.now() - 1000 * 60 * 60 * 12,
            url: "https://example.com/news5",
            category: "technical"
          }
        ];
        
        return mockNews;
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
    },
    enabled: !!selectedAsset,
  });

  const handleArticleClick = async (article: NewsArticle) => {
    setSelectedArticle(article);
    setLoadingAnalysis(true);
    
    try {
      // Mock AI analysis for demo
      // In production, this would call the Supabase Edge Function
      const mockAnalysis: AIAnalysis = {
        summary: [
          "Company reported revenue growth of 12% year-over-year",
          "Earnings per share exceeded analyst estimates by $0.05",
          "Management raised full-year guidance above market expectations"
        ],
        sentiment: Math.random() > 0.6 ? "Bullish" : Math.random() > 0.3 ? "Neutral" : "Bearish",
        insights: "This earnings beat could drive positive momentum in the short term, with technical indicators suggesting potential upside movement if it breaks above current resistance levels."
      };
      
      setTimeout(() => {
        setAiAnalysis(mockAnalysis);
        setLoadingAnalysis(false);
      }, 1500);
    } catch (error) {
      console.error('Error analyzing article:', error);
      setLoadingAnalysis(false);
    }
  };

  const closeAnalysis = () => {
    setSelectedArticle(null);
    setAiAnalysis(null);
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "Bearish": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Newspaper className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                AI Market News for {selectedAsset}
              </h1>
              <p className="text-sm text-gray-400 font-medium">
                Summarized news insights and sentiment powered by AI
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Asset Selection */}
          <AssetSelection 
            selectedAsset={selectedAsset}
            onAssetSelect={setSelectedAsset}
          />

          {/* News Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Latest News</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <TrendingUp className="h-4 w-4" />
                <span>AI-Powered Analysis</span>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="tradeiq-card animate-pulse">
                    <CardHeader className="pb-4">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {newsArticles?.map((article) => (
                  <Card 
                    key={article.id}
                    className="tradeiq-card hover:border-tradeiq-blue/50 transition-all duration-200 cursor-pointer hover-scale"
                    onClick={() => handleArticleClick(article)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-lg leading-tight mb-2 pr-4">
                            {article.headline}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="font-medium">{article.source}</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(article.datetime)}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* AI Analysis Modal/Panel */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
          <div className="w-full max-w-2xl mx-4 bg-tradeiq-navy border border-gray-800 rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-hidden animate-slide-in-right">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <Newspaper className="h-6 w-6 text-tradeiq-blue" />
                <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeAnalysis}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Article Info */}
                <div>
                  <h4 className="text-white font-semibold mb-2 leading-tight">
                    {selectedArticle.headline}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{selectedArticle.source}</span>
                    <span>{formatTimeAgo(selectedArticle.datetime)}</span>
                  </div>
                </div>

                {/* AI Analysis Content */}
                {loadingAnalysis ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-tradeiq-blue">
                      <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-sm font-medium ml-2">Analyzing article...</span>
                    </div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-6">
                    {/* Sentiment */}
                    <div>
                      <h5 className="text-white font-medium mb-3">Market Sentiment</h5>
                      <Badge className={`${getSentimentColor(aiAnalysis.sentiment)} font-medium px-3 py-1`}>
                        {aiAnalysis.sentiment}
                      </Badge>
                    </div>

                    {/* Summary */}
                    <div>
                      <h5 className="text-white font-medium mb-3">Key Points</h5>
                      <ul className="space-y-2">
                        {aiAnalysis.summary.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2 text-gray-300">
                            <div className="w-1.5 h-1.5 bg-tradeiq-blue rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Insights */}
                    <div>
                      <h5 className="text-white font-medium mb-3">Trading Insights</h5>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {aiAnalysis.insights}
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-800">
                  <Button
                    onClick={() => window.open(selectedArticle.url, '_blank')}
                    className="tradeiq-button-primary flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Source
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsAI;
