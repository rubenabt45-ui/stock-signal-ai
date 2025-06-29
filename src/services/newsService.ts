
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

interface MarketauxResponse {
  data: Array<{
    title: string;
    url: string;
    published_at: string;
    source: string;
    description: string;
    entities: Array<{
      symbol: string;
      name: string;
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
  console.log(`Fetching real news for ${symbol}`);
  
  try {
    // Try Marketaux API first (good for financial news)
    const marketauxResult = await fetchFromMarketaux(symbol);
    if (marketauxResult.length > 0) {
      console.log(`Found ${marketauxResult.length} articles from Marketaux`);
      return marketauxResult;
    }

    // Try Alpha Vantage News API
    const alphaVantageResult = await fetchFromAlphaVantage(symbol);
    if (alphaVantageResult.length > 0) {
      console.log(`Found ${alphaVantageResult.length} articles from Alpha Vantage`);
      return alphaVantageResult;
    }

    // Try NewsAPI as backup
    const newsAPIResult = await fetchFromNewsAPI(symbol);
    if (newsAPIResult.length > 0) {
      console.log(`Found ${newsAPIResult.length} articles from NewsAPI`);
      return newsAPIResult;
    }

    console.log('No news found from any API source');
    return [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

const fetchFromMarketaux = async (symbol: string): Promise<NewsArticle[]> => {
  try {
    // Marketaux API - replace 'demo' with your actual API key
    const apiKey = process.env.REACT_APP_MARKETAUX_API_KEY || 'demo';
    const url = `https://api.marketaux.com/v1/news/all?symbols=${symbol}&filter_entities=true&limit=5&api_token=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Marketaux API failed');
    
    const data: MarketauxResponse = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((article, index) => ({
      id: `marketaux-${symbol}-${index}`,
      headline: article.title,
      source: article.source || 'Financial News',
      datetime: new Date(article.published_at).getTime(),
      url: article.url,
      summary: article.description?.substring(0, 200) + '...' || 'No summary available',
      category: 'market',
      relatedSymbols: article.entities?.map(e => e.symbol) || [symbol]
    }));
  } catch (error) {
    console.error('Marketaux fetch failed:', error);
    return [];
  }
};

const fetchFromAlphaVantage = async (symbol: string): Promise<NewsArticle[]> => {
  try {
    // Alpha Vantage API - replace 'demo' with your actual API key
    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo';
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
    // NewsAPI - replace with your actual API key
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    if (!apiKey || apiKey === 'demo') {
      console.log('NewsAPI key not available, skipping');
      return [];
    }
    
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

// Refresh news function for auto-update feature
export const refreshNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`Refreshing news for ${symbol}`);
  return fetchNewsForAsset(symbol);
};
