
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
      sentiment_score?: number;
    }>;
    sentiment?: number;
  }>;
  meta: {
    found: number;
    returned: number;
  };
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
  sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
}

const MARKETAUX_API_KEY = 'qflpF00L3Ui07FOjQImcLaRURUJc2UMI5tPiiRE1';

export const fetchNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`Fetching real news for ${symbol} using Marketaux API`);
  
  try {
    const url = `https://api.marketaux.com/v1/news/all?symbols=${symbol}&filter_entities=true&language=en&limit=10&api_token=${MARKETAUX_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Marketaux API error: ${response.status} ${response.statusText}`);
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data: MarketauxResponse = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log(`No news found for ${symbol}`);
      return [];
    }

    console.log(`Found ${data.data.length} articles for ${symbol}`);

    return data.data.map((article, index) => {
      // Determine sentiment based on API data
      let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
      
      if (article.sentiment) {
        if (article.sentiment > 0.1) sentiment = 'Bullish';
        else if (article.sentiment < -0.1) sentiment = 'Bearish';
      } else if (article.entities && article.entities.length > 0) {
        const entitySentiment = article.entities[0].sentiment_score;
        if (entitySentiment) {
          if (entitySentiment > 0.1) sentiment = 'Bullish';
          else if (entitySentiment < -0.1) sentiment = 'Bearish';
        }
      }

      return {
        id: `marketaux-${symbol}-${index}`,
        headline: article.title,
        source: article.source || 'Financial News',
        datetime: new Date(article.published_at).getTime(),
        url: article.url,
        summary: article.description?.length > 200 
          ? article.description.substring(0, 200) + '...' 
          : article.description || 'No summary available',
        category: 'market',
        relatedSymbols: article.entities?.map(e => e.symbol) || [symbol],
        sentiment
      };
    });
  } catch (error) {
    console.error('Error fetching news from Marketaux:', error);
    return [];
  }
};

// Refresh news function for auto-update feature
export const refreshNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`Refreshing news for ${symbol}`);
  return fetchNewsForAsset(symbol);
};
