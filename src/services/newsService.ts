
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
    // Use broader filters to get more results - remove strict filtering
    const url = `https://api.marketaux.com/v1/news/all?symbols=${symbol}&language=en&limit=20&api_token=${MARKETAUX_API_KEY}`;
    
    console.log(`API Request URL: ${url.replace(MARKETAUX_API_KEY, '[API_KEY_HIDDEN]')}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Marketaux API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`Error response body:`, errorBody);
      
      // Log specific error codes for debugging
      if (response.status === 429) {
        console.warn('Rate limit exceeded for Marketaux API');
      } else if (response.status === 401) {
        console.error('API key authentication failed');
      } else if (response.status === 403) {
        console.error('API access forbidden - check subscription');
      }
      
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data: MarketauxResponse = await response.json();
    console.log(`API Response meta:`, data.meta);
    
    if (!data.data || data.data.length === 0) {
      console.log(`No news found for ${symbol}. API returned ${data.meta?.found || 0} total articles, ${data.meta?.returned || 0} returned.`);
      return [];
    }

    console.log(`Found ${data.data.length} articles for ${symbol}. Processing articles...`);

    const processedArticles = data.data
      .filter(article => {
        // Filter out articles with missing essential data
        if (!article.title || !article.source) {
          console.warn('Skipping article with missing title or source:', article);
          return false;
        }
        return true;
      })
      .map((article, index) => {
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

        // Validate URL
        const isValidUrl = article.url && article.url.trim() !== '' && article.url.startsWith('http');
        if (!isValidUrl) {
          console.warn(`Invalid URL for article: ${article.title}`, article.url);
        }

        return {
          id: `marketaux-${symbol}-${index}`,
          headline: article.title,
          source: article.source || 'Financial News',
          datetime: new Date(article.published_at).getTime(),
          url: article.url || '', // Keep empty string for invalid URLs
          summary: article.description?.length > 200 
            ? article.description.substring(0, 200) + '...' 
            : article.description || 'No summary available',
          category: 'market',
          relatedSymbols: article.entities?.map(e => e.symbol) || [symbol],
          sentiment
        };
      });

    console.log(`Successfully processed ${processedArticles.length} articles for ${symbol}`);
    return processedArticles;
    
  } catch (error) {
    console.error('Error fetching news from Marketaux:', error);
    
    // Log additional debugging information
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error - check internet connection or API endpoint');
    } else if (error instanceof SyntaxError) {
      console.error('Invalid JSON response from API');
    }
    
    return [];
  }
};

// Refresh news function for auto-update feature
export const refreshNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`Refreshing news for ${symbol}`);
  return fetchNewsForAsset(symbol);
};
