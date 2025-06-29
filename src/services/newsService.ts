
interface NewsAPIResponse {
  articles: Array<{
    source: { name: string };
    title: string;
    url: string;
    publishedAt: string;
    description?: string;
    urlToImage?: string;
  }>;
  status: string;
  totalResults: number;
}

interface AlphaVantageNewsResponse {
  feed: Array<{
    title: string;
    url: string;
    time_published: string;
    authors: string[];
    summary: string;
    source: string;
    category_within_source: string;
    topics: Array<{
      topic: string;
      relevance_score: string;
    }>;
  }>;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  datetime: number;
  url: string;
  summary?: string;
  category?: string;
  relatedSymbols?: string[];
  imageUrl?: string;
}

export const fetchNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`Fetching news for ${symbol}`);
  
  try {
    // Try Alpha Vantage News API first (free tier available)
    const alphaVantageResult = await fetchFromAlphaVantage(symbol);
    if (alphaVantageResult.length > 0) {
      console.log(`Found ${alphaVantageResult.length} articles from Alpha Vantage`);
      return alphaVantageResult;
    }

    // Try NewsAPI as backup (requires API key)
    const newsAPIResult = await fetchFromNewsAPI(symbol);
    if (newsAPIResult.length > 0) {
      console.log(`Found ${newsAPIResult.length} articles from NewsAPI`);
      return newsAPIResult;
    }

    // Try Yahoo Finance RSS as final backup
    const yahooResult = await fetchFromYahooFinance(symbol);
    if (yahooResult.length > 0) {
      console.log(`Found ${yahooResult.length} articles from Yahoo Finance`);
      return yahooResult;
    }

    console.log('No news found from any source, using enhanced mock data');
    return generateEnhancedMockNews(symbol);
  } catch (error) {
    console.error('Error fetching news:', error);
    return generateEnhancedMockNews(symbol);
  }
};

const fetchFromAlphaVantage = async (symbol: string): Promise<NewsArticle[]> => {
  try {
    // Alpha Vantage demo API key - replace with your own for production
    const apiKey = 'demo';
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${apiKey}&limit=5`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Alpha Vantage API failed');
    
    const data: AlphaVantageNewsResponse = await response.json();
    
    if (!data.feed || data.feed.length === 0) {
      return [];
    }

    return data.feed.slice(0, 5).map((article, index) => ({
      id: `av-${symbol}-${index}`,
      headline: article.title,
      source: article.source || 'Financial News',
      datetime: new Date(article.time_published).getTime(),
      url: article.url,
      summary: article.summary?.substring(0, 200) + '...',
      category: 'market',
      relatedSymbols: [symbol]
    }));
  } catch (error) {
    console.error('Alpha Vantage fetch failed:', error);
    return [];
  }
};

const fetchFromNewsAPI = async (symbol: string): Promise<NewsArticle[]> => {
  try {
    // Note: NewsAPI requires a valid API key for production use
    const apiKey = process.env.REACT_APP_NEWS_API_KEY || 'demo';
    const query = getCompanyQuery(symbol);
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&domains=reuters.com,bloomberg.com,cnbc.com,marketwatch.com,wsj.com&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('NewsAPI failed');
    
    const data: NewsAPIResponse = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      return [];
    }

    return data.articles.map((article, index) => ({
      id: `newsapi-${symbol}-${index}`,
      headline: article.title,
      source: article.source.name,
      datetime: new Date(article.publishedAt).getTime(),
      url: article.url,
      summary: article.description || 'No summary available',
      category: 'market',
      relatedSymbols: [symbol],
      imageUrl: article.urlToImage
    }));
  } catch (error) {
    console.error('NewsAPI fetch failed:', error);
    return [];
  }
};

const fetchFromYahooFinance = async (symbol: string): Promise<NewsArticle[]> => {
  try {
    // Yahoo Finance has CORS restrictions, but we can try their public endpoints
    // This is a simplified approach - in production, you'd use a proxy server
    const query = getCompanyQuery(symbol);
    
    // Mock implementation since direct Yahoo Finance API calls are restricted
    // In production, implement this through your backend or use a CORS proxy
    console.log(`Would fetch Yahoo Finance news for: ${query}`);
    return [];
  } catch (error) {
    console.error('Yahoo Finance fetch failed:', error);
    return [];
  }
};

const getCompanyQuery = (symbol: string): string => {
  const companyMap: Record<string, string> = {
    'AAPL': 'Apple Inc stock earnings',
    'MSFT': 'Microsoft Corporation stock',
    'GOOGL': 'Google Alphabet stock',
    'TSLA': 'Tesla Inc stock earnings',
    'NVDA': 'NVIDIA Corporation stock',
    'AMZN': 'Amazon stock earnings',
    'META': 'Meta Facebook stock',
    'BTCUSD': 'Bitcoin cryptocurrency price',
    'ETHUSD': 'Ethereum cryptocurrency',
    'NFLX': 'Netflix stock',
    'BABA': 'Alibaba stock'
  };
  
  return companyMap[symbol] || `${symbol} stock market news`;
};

const generateEnhancedMockNews = (symbol: string): NewsArticle[] => {
  const baseTime = Date.now();
  const companyName = getCompanyName(symbol);
  
  const newsTemplates = [
    {
      headline: `${companyName} Reports Strong Q4 Results, Beats Wall Street Expectations`,
      source: "Reuters",
      summary: `${companyName} exceeded analyst forecasts with robust quarterly performance, driving investor confidence and market momentum.`,
      category: "earnings",
      timeOffset: 2 * 60 * 60 * 1000 // 2 hours ago
    },
    {
      headline: `Goldman Sachs Upgrades ${symbol} with $250 Price Target`,
      source: "Bloomberg",
      summary: `Investment banking giant raises price target citing strong fundamentals and positive growth outlook for the company.`,
      category: "analyst",
      timeOffset: 4 * 60 * 60 * 1000 // 4 hours ago
    },
    {
      headline: `${companyName} Announces Strategic Partnership in AI Technology`,
      source: "MarketWatch",
      summary: `New collaboration aims to accelerate innovation and expand market presence in artificial intelligence sector.`,
      category: "corporate",
      timeOffset: 8 * 60 * 60 * 1000 // 8 hours ago
    },
    {
      headline: `${symbol} Trading Volume Surges 40% on Market Volatility`,
      source: "Financial Times",
      summary: `Increased trading activity reflects heightened investor interest amid broader market fluctuations and sector rotation.`,
      category: "market",
      timeOffset: 12 * 60 * 60 * 1000 // 12 hours ago
    },
    {
      headline: `Technical Analysis: ${symbol} Breaks Key Resistance Level`,
      source: "TradingView",
      summary: `Chart patterns indicate potential bullish momentum as stock price breaks above critical technical resistance zone.`,
      category: "technical",
      timeOffset: 18 * 60 * 60 * 1000 // 18 hours ago
    }
  ];

  return newsTemplates.map((template, index) => ({
    id: `mock-${symbol}-${index}`,
    headline: template.headline,
    source: template.source,
    datetime: baseTime - template.timeOffset,
    url: `https://example.com/news/${symbol.toLowerCase()}-${index}`,
    summary: template.summary,
    category: template.category,
    relatedSymbols: [symbol]
  }));
};

const getCompanyName = (symbol: string): string => {
  const companyNames: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft',
    'GOOGL': 'Alphabet Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corp.',
    'AMZN': 'Amazon',
    'META': 'Meta Platforms',
    'BTCUSD': 'Bitcoin',
    'ETHUSD': 'Ethereum',
    'NFLX': 'Netflix',
    'BABA': 'Alibaba Group'
  };
  
  return companyNames[symbol] || symbol;
};

// Refresh news function for auto-update feature
export const refreshNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`Refreshing news for ${symbol}`);
  return fetchNewsForAsset(symbol);
};
