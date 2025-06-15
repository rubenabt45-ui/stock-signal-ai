
import { useState, useEffect } from "react";
import { Newspaper, TrendingUp, ExternalLink, Clock, ChevronRight, X, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetSelection } from "@/components/AssetSelection";
import { useQuery } from "@tanstack/react-query";
import { fetchNewsForAsset, NewsArticle } from "@/services/newsService";
import { analyzeNewsArticle, AIAnalysis } from "@/services/aiAnalysisService";

const NewsAI = () => {
  const [selectedAsset, setSelectedAsset] = useState("AAPL");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Fetch news for selected asset
  const { data: newsArticles, isLoading, error, refetch } = useQuery({
    queryKey: ['news', selectedAsset],
    queryFn: () => fetchNewsForAsset(selectedAsset),
    enabled: !!selectedAsset,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for real-time updates
  });

  const handleArticleClick = async (article: NewsArticle) => {
    setSelectedArticle(article);
    setLoadingAnalysis(true);
    setAiAnalysis(null);
    
    try {
      const analysis = await analyzeNewsArticle(article.headline, article.summary);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing article:', error);
    } finally {
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
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const formatAbsoluteTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "Bearish": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const handleViewSource = (url: string) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Original article not available.');
    }
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  AI Market News for {selectedAsset}
                </h1>
                <p className="text-sm text-gray-400 font-medium">
                  Real-time news insights and sentiment powered by AI
                </p>
              </div>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800 text-gray-300"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh
            </Button>
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
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            </div>

            {error && (
              <Card className="tradeiq-card border-red-500/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Failed to load news</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Unable to fetch latest news. Please check your connection and try again.
                  </p>
                </CardHeader>
              </Card>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="tradeiq-card animate-pulse">
                    <CardHeader className="pb-4">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/3"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : newsArticles && newsArticles.length > 0 ? (
              <div className="space-y-4">
                {newsArticles.map((article) => (
                  <Card 
                    key={article.id}
                    className="tradeiq-card hover:border-tradeiq-blue/50 transition-all duration-200 cursor-pointer hover-scale"
                    onClick={() => handleArticleClick(article)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-lg leading-tight mb-3 pr-4">
                            {article.headline}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                            <span className="font-medium">{article.source}</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(article.datetime)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {article.relatedSymbols?.map(symbol => (
                              <Badge key={symbol} variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
                                {symbol}
                              </Badge>
                            ))}
                            {article.category && (
                              <Badge variant="outline" className="text-xs text-gray-400 border-gray-600/50">
                                {article.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="tradeiq-card">
                <CardHeader className="text-center py-8">
                  <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold text-white mb-2">No News Found</h3>
                  <p className="text-gray-400">
                    No recent news articles found for {selectedAsset}. Try selecting a different asset or check back later.
                  </p>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* AI Analysis Modal/Panel */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
          <div className="w-full max-w-4xl mx-4 bg-tradeiq-navy border border-gray-800 rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-hidden animate-slide-in-right">
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
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <span className="font-medium">{selectedArticle.source}</span>
                    <span>{formatTimeAgo(selectedArticle.datetime)}</span>
                    <span className="text-xs">({formatAbsoluteTime(selectedArticle.datetime)})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedArticle.relatedSymbols?.map(symbol => (
                      <Badge key={symbol} variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* AI Analysis Content */}
                {loadingAnalysis ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-3 text-tradeiq-blue">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-sm font-medium">Analyzing article with AI...</span>
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

                    {/* Key Metrics */}
                    {aiAnalysis.keyMetrics && (
                      <div>
                        <h5 className="text-white font-medium mb-3">Key Metrics</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {aiAnalysis.keyMetrics.eps && (
                            <div className="bg-black/20 p-3 rounded-xl">
                              <div className="text-xs text-gray-400 mb-1">EPS</div>
                              <div className="text-sm font-medium text-white">{aiAnalysis.keyMetrics.eps}</div>
                            </div>
                          )}
                          {aiAnalysis.keyMetrics.growth && (
                            <div className="bg-black/20 p-3 rounded-xl">
                              <div className="text-xs text-gray-400 mb-1">Growth</div>
                              <div className="text-sm font-medium text-white">{aiAnalysis.keyMetrics.growth}</div>
                            </div>
                          )}
                          {aiAnalysis.keyMetrics.forecast && (
                            <div className="bg-black/20 p-3 rounded-xl">
                              <div className="text-xs text-gray-400 mb-1">Forecast</div>
                              <div className="text-sm font-medium text-white">{aiAnalysis.keyMetrics.forecast}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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

                    {/* Trading Insights */}
                    <div>
                      <h5 className="text-white font-medium mb-3">Trading Implications</h5>
                      <div className="bg-black/20 p-4 rounded-xl space-y-3">
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                          {aiAnalysis.insights}
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {aiAnalysis.tradingImplications.volatilityTrigger && (
                            <div className="flex items-start space-x-2">
                              <span className="text-xs text-gray-500 min-w-[80px]">Trigger:</span>
                              <span className="text-sm text-gray-300">{aiAnalysis.tradingImplications.volatilityTrigger}</span>
                            </div>
                          )}
                          {aiAnalysis.tradingImplications.supportResistance && (
                            <div className="flex items-start space-x-2">
                              <span className="text-xs text-gray-500 min-w-[80px]">Levels:</span>
                              <span className="text-sm text-gray-300">{aiAnalysis.tradingImplications.supportResistance}</span>
                            </div>
                          )}
                          {aiAnalysis.tradingImplications.sectorImpact && (
                            <div className="flex items-start space-x-2">
                              <span className="text-xs text-gray-500 min-w-[80px]">Impact:</span>
                              <span className="text-sm text-gray-300">{aiAnalysis.tradingImplications.sectorImpact}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-800">
                  <Button
                    onClick={() => handleViewSource(selectedArticle.url)}
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
