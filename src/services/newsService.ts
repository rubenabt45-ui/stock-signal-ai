
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
  error?: {
    code: string;
    message: string;
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
  console.log(`🔍 Fetching news for ${symbol} using Marketaux API`);
  
  try {
    // Build URL with minimal, essential parameters only
    const baseUrl = 'https://api.marketaux.com/v1/news/all';
    const params = new URLSearchParams({
      symbols: symbol, // Use 'symbols' not 'symbol'
      language: 'en',
      limit: '20',
      api_token: MARKETAUX_API_KEY
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    
    // Log the complete URL (with API key hidden for security)
    console.log(`🌐 API Request URL: ${fullUrl.replace(MARKETAUX_API_KEY, '[API_KEY_HIDDEN]')}`);
    console.log(`🔑 API Key length: ${MARKETAUX_API_KEY.length} characters`);
    console.log(`📋 Request parameters:`, {
      symbols: symbol,
      language: 'en',
      limit: '20'
    });
    
    const response = await fetch(fullUrl);
    
    // Log response status and headers
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    console.log(`📄 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ Marketaux API error: ${response.status} ${response.statusText}`);
      console.error(`💥 Error response body:`, errorBody);
      
      // Parse error response if it's JSON
      try {
        const errorJson = JSON.parse(errorBody);
        console.error(`🔍 Parsed error:`, errorJson);
        
        if (errorJson.error) {
          console.error(`🚨 API Error: ${errorJson.error.code} - ${errorJson.error.message}`);
        }
      } catch (parseError) {
        console.error(`📝 Raw error text:`, errorBody);
      }
      
      // Specific error handling
      switch (response.status) {
        case 401:
          console.error('🔒 Authentication failed - API key may be invalid');
          break;
        case 403:
          console.error('🚫 Access forbidden - check API subscription/plan');
          break;
        case 429:
          console.error('⏰ Rate limit exceeded - too many requests');
          break;
        case 500:
          console.error('🏥 Server error - API service may be down');
          break;
        default:
          console.error(`❓ Unexpected error: ${response.status}`);
      }
      
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data: MarketauxResponse = await response.json();
    
    // Log complete API response for debugging
    console.log(`📊 Full API Response:`, data);
    console.log(`📈 Response meta:`, data.meta);
    console.log(`📰 Articles found: ${data.meta?.found || 0}, returned: ${data.meta?.returned || 0}`);
    
    // Check for API-level errors in response
    if (data.error) {
      console.error(`🚨 API returned error:`, data.error);
      throw new Error(`API Error: ${data.error.code} - ${data.error.message}`);
    }
    
    if (!data.data || !Array.isArray(data.data)) {
      console.warn(`⚠️ No data array in response for ${symbol}`);
      return [];
    }
    
    if (data.data.length === 0) {
      console.log(`📭 No articles found for ${symbol}. This might indicate:`);
      console.log(`   - Symbol not available in free tier`);
      console.log(`   - No recent news for this symbol`);
      console.log(`   - Try popular symbols: AAPL, MSFT, TSLA, GOOGL, AMZN`);
      return [];
    }

    console.log(`✅ Processing ${data.data.length} articles for ${symbol}:`);
    
    // Log each article for debugging
    data.data.forEach((article, index) => {
      console.log(`📰 Article ${index + 1}:`, {
        title: article.title?.substring(0, 60) + '...',
        source: article.source,
        url: article.url ? 'Valid URL' : 'Missing URL',
        published: article.published_at,
        hasDescription: !!article.description
      });
    });

    const processedArticles = data.data
      .filter(article => {
        if (!article.title || !article.source) {
          console.warn(`⚠️ Skipping article with missing title or source:`, {
            title: !!article.title,
            source: !!article.source
          });
          return false;
        }
        return true;
      })
      .map((article, index) => {
        // Determine sentiment
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

        // Validate and clean URL
        const isValidUrl = article.url && 
                          article.url.trim() !== '' && 
                          (article.url.startsWith('http://') || article.url.startsWith('https://'));
        
        if (!isValidUrl && article.url) {
          console.warn(`🔗 Invalid URL for article: "${article.title?.substring(0, 50)}..." - URL: ${article.url}`);
        }

        const processedArticle = {
          id: `marketaux-${symbol}-${index}`,
          headline: article.title,
          source: article.source || 'Financial News',
          datetime: new Date(article.published_at).getTime(),
          url: isValidUrl ? article.url : '', // Only keep valid URLs
          summary: article.description?.length > 200 
            ? article.description.substring(0, 200) + '...' 
            : article.description || 'No summary available',
          category: 'market',
          relatedSymbols: article.entities?.map(e => e.symbol) || [symbol],
          sentiment
        };

        console.log(`✅ Processed article ${index + 1}:`, {
          headline: processedArticle.headline.substring(0, 50) + '...',
          hasValidUrl: !!processedArticle.url,
          sentiment: processedArticle.sentiment
        });

        return processedArticle;
      });

    console.log(`🎉 Successfully processed ${processedArticles.length} articles for ${symbol}`);
    console.log(`🔗 Articles with valid URLs: ${processedArticles.filter(a => a.url).length}`);
    
    return processedArticles;
    
  } catch (error) {
    console.error('💥 Error fetching news from Marketaux:', error);
    
    // Enhanced error logging
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('🌐 Network error - check internet connection or API endpoint accessibility');
    } else if (error instanceof SyntaxError) {
      console.error('📝 Invalid JSON response from API - API may be returning HTML error page');
    } else if (error instanceof Error) {
      console.error('🚨 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      });
    }
    
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

// Refresh news function for auto-update feature
export const refreshNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`🔄 Refreshing news for ${symbol}`);
  return fetchNewsForAsset(symbol);
};
