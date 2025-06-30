
interface GNewsResponse {
  totalArticles: number;
  articles: Array<{
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: string;
    source: {
      name: string;
      url: string;
    };
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
  sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
}

// GNews API key - real key provided
const GNEWS_API_KEY = 'cd750c0e64d47967b4fcdd0ab0674328';

// Smart keyword mapping for better GNews search results
const SYMBOL_TO_KEYWORD_MAP: Record<string, string> = {
  'AAPL': 'Apple stock',
  'TSLA': 'Tesla stock',
  'MSFT': 'Microsoft stock',
  'GOOGL': 'Google stock',
  'AMZN': 'Amazon stock',
  'NVDA': 'Nvidia stock',
  'META': 'Meta stock',
  'NFLX': 'Netflix stock',
  'AMD': 'AMD stock',
  'INTC': 'Intel stock',
  'BTCUSD': 'Bitcoin cryptocurrency',
  'ETHUSD': 'Ethereum cryptocurrency',
  'SOLUSD': 'Solana cryptocurrency',
  'EURUSD': 'Euro USD forex',
  'GBPUSD': 'GBP USD forex',
  'SPX': 'S&P 500 index',
  'QQQ': 'Nasdaq index'
};

// Helper function to get search keyword for symbol
const getSearchKeyword = (symbol: string): string => {
  return SYMBOL_TO_KEYWORD_MAP[symbol] || `${symbol} stock`;
};

export const fetchNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  const searchKeyword = getSearchKeyword(symbol);
  
  console.log(`🔍 [DEBUG] Starting fetchNewsForAsset for symbol: ${symbol}`);
  console.log(`🔍 [DEBUG] Using search keyword: "${searchKeyword}"`);
  console.log(`🔑 [DEBUG] API Key being used: ${GNEWS_API_KEY ? GNEWS_API_KEY.substring(0, 8) + '...' : 'MISSING'}`);
  
  try {
    // Build GNews API URL
    const baseUrl = 'https://gnews.io/api/v4/search';
    const params = new URLSearchParams({
      q: searchKeyword,
      lang: 'en',
      max: '20',
      token: GNEWS_API_KEY
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    
    console.log(`🌐 [DEBUG] Full GNews API Request URL: ${fullUrl}`);
    console.log(`📋 [DEBUG] Request parameters breakdown:`, {
      baseUrl,
      q: searchKeyword,
      lang: 'en',
      max: '20',
      token: GNEWS_API_KEY ? '[PRESENT]' : '[MISSING]'
    });
    
    console.log(`📡 [DEBUG] About to make fetch request...`);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TradeIQ-NewsApp/1.0'
      }
    });
    
    console.log(`📡 [DEBUG] Fetch completed. Response received:`);
    console.log(`📊 [DEBUG] Response status: ${response.status}`);
    console.log(`📊 [DEBUG] Response statusText: ${response.statusText}`);
    console.log(`📊 [DEBUG] Response ok: ${response.ok}`);
    console.log(`📊 [DEBUG] Response headers:`, Object.fromEntries(response.headers.entries()));
    
    // Clone response to read body twice (once for logging, once for processing)
    const responseClone = response.clone();
    
    let responseText;
    try {
      responseText = await responseClone.text();
      console.log(`📄 [DEBUG] Raw response body:`, responseText);
    } catch (textError) {
      console.error(`❌ [DEBUG] Error reading response text:`, textError);
    }
    
    if (!response.ok) {
      console.error(`❌ [DEBUG] Response not OK. Status: ${response.status} ${response.statusText}`);
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(responseText || '{}');
        console.error(`💥 [DEBUG] Parsed error response:`, errorDetails);
      } catch (parseError) {
        console.error(`💥 [DEBUG] Could not parse error response as JSON:`, parseError);
        console.error(`💥 [DEBUG] Raw error text:`, responseText);
      }
      
      // Specific error handling for GNews API
      switch (response.status) {
        case 401:
          console.error('🔒 [DEBUG] 401 Unauthorized - GNews API key may be invalid or missing');
          break;
        case 403:
          console.error('🚫 [DEBUG] 403 Forbidden - GNews API key may lack permissions or plan limits exceeded');
          break;
        case 429:
          console.error('⏰ [DEBUG] 429 Rate Limited - too many requests, need to wait');
          break;
        case 500:
          console.error('🏥 [DEBUG] 500 Server Error - GNews API is having issues');
          break;
        default:
          console.error(`❓ [DEBUG] Unexpected HTTP status: ${response.status}`);
      }
      
      throw new Error(`GNews API request failed: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ [DEBUG] Response OK, parsing JSON...`);
    
    let data: GNewsResponse;
    try {
      data = await response.json();
      console.log(`📊 [DEBUG] Successfully parsed JSON response:`, data);
      console.log(`📈 [DEBUG] Total articles available:`, data.totalArticles);
      console.log(`📰 [DEBUG] Number of articles in response:`, data.articles?.length || 0);
    } catch (jsonError) {
      console.error(`💥 [DEBUG] Failed to parse response as JSON:`, jsonError);
      console.error(`💥 [DEBUG] Response text that failed to parse:`, responseText);
      throw new Error(`Failed to parse GNews API response as JSON: ${jsonError.message}`);
    }
    
    if (!data.articles || !Array.isArray(data.articles)) {
      console.warn(`⚠️ [DEBUG] No articles array in response or articles is not an array`);
      console.warn(`⚠️ [DEBUG] Data structure received:`, typeof data.articles, data.articles);
      return [];
    }
    
    if (data.articles.length === 0) {
      console.log(`📭 [DEBUG] No articles found for ${symbol} (searched: "${searchKeyword}"). Possible reasons:`);
      console.log(`   - Keyword not found in recent news`);
      console.log(`   - No relevant articles for this search term`);
      console.log(`   - Try popular symbols: AAPL, MSFT, TSLA, GOOGL, AMZN`);
      return [];
    }

    console.log(`✅ [DEBUG] Processing ${data.articles.length} articles for ${symbol} (searched: "${searchKeyword}"):`);
    
    // Log each article for debugging
    data.articles.forEach((article, index) => {
      console.log(`📰 [DEBUG] Article ${index + 1}:`, {
        title: article.title?.substring(0, 80) + (article.title?.length > 80 ? '...' : ''),
        source: article.source?.name,
        url: article.url ? 'Has URL' : 'NO URL',
        urlValid: article.url && (article.url.startsWith('http://') || article.url.startsWith('https://')),
        published: article.publishedAt,
        hasDescription: !!article.description,
        descriptionLength: article.description?.length || 0
      });
    });

    const processedArticles = data.articles
      .filter(article => {
        const isValid = article.title && article.source?.name && article.url;
        if (!isValid) {
          console.warn(`⚠️ [DEBUG] Skipping article with missing required fields:`, {
            hasTitle: !!article.title,
            hasSource: !!article.source?.name,
            hasUrl: !!article.url,
            article: article
          });
        }
        return isValid;
      })
      .map((article, index) => {
        // Simple sentiment analysis based on keywords
        let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
        
        const text = `${article.title} ${article.description || ''}`.toLowerCase();
        const bullishKeywords = ['beats', 'exceeds', 'growth', 'upgrade', 'partnership', 'expansion', 'strong', 'positive', 'rises', 'gains', 'profit', 'revenue'];
        const bearishKeywords = ['misses', 'declines', 'downgrade', 'concerns', 'falls', 'drops', 'weak', 'losses', 'challenges', 'cut', 'layoffs'];
        
        const bullishScore = bullishKeywords.filter(word => text.includes(word)).length;
        const bearishScore = bearishKeywords.filter(word => text.includes(word)).length;
        
        if (bullishScore > bearishScore) sentiment = 'Bullish';
        else if (bearishScore > bullishScore) sentiment = 'Bearish';

        // Validate URL
        const isValidUrl = article.url && 
                          article.url.trim() !== '' && 
                          (article.url.startsWith('http://') || article.url.startsWith('https://'));
        
        if (!isValidUrl) {
          console.warn(`🔗 [DEBUG] Invalid URL for article: "${article.title?.substring(0, 50)}..." - URL: ${article.url}`);
        }

        const processedArticle = {
          id: `gnews-${symbol}-${index}`,
          headline: article.title,
          source: article.source.name || 'GNews',
          datetime: new Date(article.publishedAt).getTime(),
          url: isValidUrl ? article.url : '',
          summary: article.description || 'No summary available',
          category: 'market',
          relatedSymbols: [symbol],
          imageUrl: article.image || undefined,
          sentiment
        };

        console.log(`✅ [DEBUG] Processed article ${index + 1}:`, {
          id: processedArticle.id,
          headline: processedArticle.headline.substring(0, 60) + '...',
          hasValidUrl: !!processedArticle.url,
          sentiment: processedArticle.sentiment,
          source: processedArticle.source
        });

        return processedArticle;
      });

    console.log(`🎉 [DEBUG] Successfully processed ${processedArticles.length} articles for ${symbol} (searched: "${searchKeyword}")`);
    console.log(`🔗 [DEBUG] Articles with valid URLs: ${processedArticles.filter(a => a.url).length}`);
    console.log(`📊 [DEBUG] Final processed articles:`, processedArticles);
    
    return processedArticles;
    
  } catch (error) {
    console.error('💥 [DEBUG] CRITICAL ERROR in fetchNewsForAsset:', error);
    
    // Enhanced error logging
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('🌐 [DEBUG] Network/Fetch Error Details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      console.error('🌐 [DEBUG] This could indicate network connectivity issues or CORS problems');
    } else if (error instanceof SyntaxError) {
      console.error('📝 [DEBUG] JSON Parse Error Details:', {
        message: error.message,
        stack: error.stack
      });
      console.error('📝 [DEBUG] GNews API may be returning HTML error page instead of JSON');
    } else if (error instanceof Error) {
      console.error('🚨 [DEBUG] General Error Details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error('❓ [DEBUG] Unknown error type:', typeof error, error);
    }
    
    // Return empty array instead of throwing to prevent app crash
    console.log('🔄 [DEBUG] Returning empty array due to error');
    return [];
  }
};

// Refresh news function for manual refresh feature
export const refreshNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`🔄 [DEBUG] Refreshing news for ${symbol}`);
  return fetchNewsForAsset(symbol);
};
