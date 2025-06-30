import { useState, useEffect, useMemo } from "react";
import { Newspaper, TrendingUp, X, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetSelection } from "@/components/AssetSelection";
import { useQuery } from "@tanstack/react-query";
import { fetchNewsForAsset, NewsArticle, refreshNewsForAsset } from "@/services/newsService";
import { analyzeNewsArticle, AIAnalysis } from "@/services/aiAnalysisService";
import { NewsCard } from "@/components/NewsAI/NewsCard";
import { AIInsights } from "@/components/NewsAI/AIInsights";
import { SourceButton } from "@/components/NewsAI/SourceButton";
import { NewsFilters, FilterState } from "@/components/NewsAI/NewsFilters";
import { NewsDigest } from "@/components/NewsAI/NewsDigest";
import { DigestArticle } from "@/hooks/useNewsDigest";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";

const NewsAI = () => {
  const [selectedAsset, setSelectedAsset] = useState("AAPL");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sentiments: [],
    newsTypes: []
  });

  const { toast } = useToast();
  const { favorites, loading: favoritesLoading } = useFavorites();

  // Fetch news for selected asset with auto-refresh
  const { data: newsArticles, isLoading, error, refetch } = useQuery({
    queryKey: ['news', selectedAsset],
    queryFn: () => fetchNewsForAsset(selectedAsset),
    enabled: !!selectedAsset && activeTab === "live",
    refetchInterval: 15 * 60 * 1000, // Auto refresh every 15 minutes
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });

  // Manual refresh function
  const handleManualRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "News Updated",
        description: `Latest news for ${selectedAsset} has been refreshed.`,
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to fetch latest news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Helper function to determine article category
  const getArticleCategory = (symbol: string): string => {
    if (symbol.includes('USD') || symbol.includes('BTC') || symbol.includes('ETH')) return 'crypto';
    if (symbol.includes('EUR') || symbol.includes('JPY') || symbol.includes('GBP')) return 'forex';
    return 'stocks';
  };

  // Helper function to get sentiment badge color
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'Bullish': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Bearish': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Helper function to get sentiment from AI analysis or article data
  const getArticleSentiment = (article: NewsArticle): string => {
    // Use API sentiment if available
    if (article.sentiment) {
      return article.sentiment;
    }
    
    // Fallback to keyword analysis
    const text = `${article.headline} ${article.summary || ''}`.toLowerCase();
    
    const bullishKeywords = ['beats', 'exceeds', 'growth', 'upgrade', 'partnership', 'expansion', 'strong', 'positive', 'rises', 'gains', 'profit', 'revenue'];
    const bearishKeywords = ['misses', 'declines', 'downgrade', 'concerns', 'falls', 'drops', 'weak', 'losses', 'challenges', 'cut', 'layoffs'];
    
    const bullishScore = bullishKeywords.filter(word => text.includes(word)).length;
    const bearishScore = bearishKeywords.filter(word => text.includes(word)).length;
    
    if (bullishScore > bearishScore) return 'Bullish';
    if (bearishScore > bullishScore) return 'Bearish';
    return 'Neutral';
  };

  // Check if article is related to user's favorites
  const isArticleInFavorites = (article: NewsArticle): boolean => {
    if (!favorites || favorites.length === 0) return false;
    
    const favoriteSymbols = favorites.map(fav => fav.symbol);
    
    if (article.relatedSymbols && article.relatedSymbols.length > 0) {
      return article.relatedSymbols.some(symbol => favoriteSymbols.includes(symbol));
    }
    
    return favoriteSymbols.includes(selectedAsset);
  };

  // Filter news articles based on selected filters and favorites toggle
  const filteredNewsArticles = useMemo(() => {
    console.log('Filtering articles with filters:', filters);
    console.log('Show only favorites:', showOnlyFavorites);
    console.log('Total articles:', newsArticles?.length || 0);

    if (!newsArticles || newsArticles.length === 0) {
      return [];
    }

    return newsArticles.filter(article => {
      // Favorites filter
      if (showOnlyFavorites && !isArticleInFavorites(article)) {
        return false;
      }

      // Apply filters only if they are specifically set (to allow broader results)
      if (filters.categories.length > 0) {
        const articleCategory = getArticleCategory(article.relatedSymbols?.[0] || selectedAsset);
        if (!filters.categories.includes(articleCategory)) {
          return false;
        }
      }

      if (filters.sentiments.length > 0) {
        const articleSentiment = getArticleSentiment(article);
        if (!filters.sentiments.includes(articleSentiment)) {
          return false;
        }
      }

      if (filters.newsTypes.length > 0) {
        const articleType = article.category || 'market';
        if (!filters.newsTypes.includes(articleType)) {
          return false;
        }
      }
      
      return true;
    });
  }, [newsArticles, filters.categories, filters.sentiments, filters.newsTypes, selectedAsset, showOnlyFavorites, favorites]);

  const handleArticleClick = async (article: NewsArticle | DigestArticle) => {
    const newsArticle: NewsArticle = {
      id: article.id,
      headline: article.headline,
      source: article.source,
      datetime: article.datetime,
      url: article.url,
      summary: article.summary,
      category: article.category,
      relatedSymbols: article.relatedSymbols
    };

    setSelectedArticle(newsArticle);
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

  const formatAbsoluteTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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
                  AI Market News{activeTab === "live" ? ` for ${selectedAsset}` : ""}
                </h1>
                <p className="text-sm text-gray-400 font-medium">
                  {activeTab === "live" 
                    ? "Real-time financial news powered by Marketaux API"
                    : "Personalized news digest based on your alert preferences"
                  }
                </p>
              </div>
            </div>
            {activeTab === "live" && (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleManualRefresh}
                  variant="outline"
                  size="sm"
                  disabled={refreshing}
                  className="border-gray-700 hover:bg-gray-800 text-gray-300"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-gray-800/50">
              <TabsTrigger 
                value="live" 
                className="data-[state=active]:bg-tradeiq-blue data-[state=active]:text-white text-gray-400"
              >
                Live Feed
              </TabsTrigger>
              <TabsTrigger 
                value="digest" 
                className="data-[state=active]:bg-tradeiq-blue data-[state=active]:text-white text-gray-400"
              >
                Digest
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="space-y-6">
              {/* Asset Selection */}
              <AssetSelection 
                selectedAsset={selectedAsset}
                onAssetSelect={setSelectedAsset}
              />

              {/* Favorites Toggle */}
              <div className="bg-black/20 p-4 rounded-xl border border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="favorites-toggle"
                      checked={showOnlyFavorites}
                      onCheckedChange={setShowOnlyFavorites}
                      disabled={favoritesLoading}
                    />
                    <label htmlFor="favorites-toggle" className="text-white font-medium cursor-pointer">
                      Show Only My Favorites
                    </label>
                    {showOnlyFavorites && (
                      <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
                        {favorites?.length || 0} favorites
                      </Badge>
                    )}
                  </div>
                  {showOnlyFavorites && (!favorites || favorites.length === 0) && (
                    <p className="text-sm text-gray-400">
                      You haven't added any favorite assets yet.
                    </p>
                  )}
                </div>
              </div>

              {/* News Filters */}
              <NewsFilters
                filters={filters}
                onFilterChange={setFilters}
                newsCount={filteredNewsArticles.length}
              />

              {/* News Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Latest Financial News</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Auto-refresh every 15min</span>
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
                        Unable to fetch latest news from Marketaux API. This might be due to rate limits or network issues. Please try again later.
                      </p>
                      <div className="mt-2">
                        <Button
                          onClick={handleManualRefresh}
                          variant="outline"
                          size="sm"
                          disabled={refreshing}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                          Try Again
                        </Button>
                      </div>
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
                ) : filteredNewsArticles && filteredNewsArticles.length > 0 ? (
                  <div className="space-y-4">
                    {filteredNewsArticles.map((article) => (
                      <Card key={article.id} className="tradeiq-card hover:bg-gray-800/30 transition-colors cursor-pointer">
                        <CardHeader className="pb-4" onClick={() => handleArticleClick(article)}>
                          <div className="space-y-3">
                            <h3 className="text-white font-semibold text-lg leading-tight hover:text-tradeiq-blue transition-colors">
                              {article.headline}
                            </h3>
                            
                            <div className="flex items-center justify-between flex-wrap gap-2 text-sm text-gray-400">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">{article.source}</span>
                                <span>{new Date(article.datetime).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {article.sentiment && (
                                  <Badge className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                                    {article.sentiment}
                                  </Badge>
                                )}
                                {article.relatedSymbols?.map(symbol => (
                                  <Badge key={symbol} variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
                                    {symbol}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {article.summary && (
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {article.summary}
                              </p>
                            )}
                            
                            <div className="flex justify-between items-center pt-2">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <TrendingUp className="h-3 w-3" />
                                <span>Click for AI analysis</span>
                              </div>
                              
                              <SourceButton 
                                url={article.url}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="tradeiq-card">
                    <CardHeader className="text-center py-8">
                      <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {showOnlyFavorites && (!favorites || favorites.length === 0)
                          ? "No Favorite Assets"
                          : newsArticles && newsArticles.length > 0 
                            ? "No Articles Match Filters" 
                            : "No Recent Articles Found"
                        }
                      </h3>
                      <p className="text-gray-400">
                        {showOnlyFavorites && (!favorites || favorites.length === 0)
                          ? "Add some favorite assets to see personalized news updates."
                          : newsArticles && newsArticles.length > 0 
                            ? "Try adjusting your filters to see more articles."
                            : `No recent articles found for ${selectedAsset}. Please try a different asset or wait for new news updates.`
                        }
                      </p>
                      {(!newsArticles || newsArticles.length === 0) && (
                        <div className="mt-4 space-y-2">
                          <Button
                            onClick={handleManualRefresh}
                            variant="outline"
                            disabled={refreshing}
                            className="border-gray-700 hover:bg-gray-800 text-gray-300"
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Try Again
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            Try popular assets like AAPL, MSFT, TSLA, GOOGL, or AMZN for better results
                          </p>
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="digest">
              <NewsDigest onArticleSelect={handleArticleClick} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* AI Analysis Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
          <div className="w-full max-w-4xl mx-4 bg-tradeiq-navy border border-gray-800 rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-hidden animate-slide-in-right">
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

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2 leading-tight">
                    {selectedArticle.headline}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <span className="font-medium">{selectedArticle.source}</span>
                    <span>{formatAbsoluteTime(selectedArticle.datetime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedArticle.relatedSymbols?.map(symbol => (
                      <Badge key={symbol} variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>

                <AIInsights 
                  analysis={aiAnalysis}
                  loading={loadingAnalysis}
                />

                <div className="flex space-x-3 pt-4 border-t border-gray-800">
                  <SourceButton 
                    url={selectedArticle.url}
                    className="flex-1"
                  />
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
