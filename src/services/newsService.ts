
// Future Feature: News Service
/*

interface FMPNewsResponse {
  symbol: string;
  publishedDate: string;
  title: string;
  image: string;
  site: string;
  text: string;
  url: string;
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

// Financial Modeling Prep API key - real key provided
const FMP_API_KEY = 'cd750c0e64d47967b4fcdd0ab0674328';

export const fetchNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`🔍 [DEBUG] Starting fetchNewsForAsset for symbol: ${symbol}`);
  console.log(`🔑 [DEBUG] API Key being used: ${FMP_API_KEY ? FMP_API_KEY.substring(0, 8) + '...' : 'MISSING'}`);
  
  try {
    // Build FMP API URL
    const baseUrl = 'https://financialmodelingprep.com/api/v3/stock_news';
    const params = new URLSearchParams({
      tickers: symbol,
      limit: '20',
      apikey: FMP_API_KEY
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    
    console.log(`🌐 [DEBUG] Full FMP API Request URL: ${fullUrl}`);
    console.log(`📋 [DEBUG] Request parameters breakdown:`, {
      baseUrl,
      tickers: symbol,
      limit: '20',
      apikey: FMP_API_KEY ? '[PRESENT]' : '[MISSING]'
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
      
      // Specific error handling for FMP API
      switch (response.status) {
        case 401:
          console.error('🔒 [DEBUG] 401 Unauthorized - FMP API key may be invalid or missing');
          break;
        case 403:
          console.error('🚫 [DEBUG] 403 Forbidden - FMP API key may lack permissions or plan limits exceeded');
          break;
        case 429:
          console.error('⏰ [DEBUG] 429 Rate Limited - too many requests, need to wait');
          break;
        case 500:
          console.error('🏥 [DEBUG] 500 Server Error - FMP API is having issues');
          break;
        default:
          console.error(`❓ [DEBUG] Unexpected HTTP status: ${response.status}`);
      }
      
      throw new Error(`FMP API request failed: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ [DEBUG] Response OK, parsing JSON...`);
    
    let data: FMPNewsResponse[];
    try {
      data = await response.json();
      console.log(`📊 [DEBUG] Successfully parsed JSON response:`, data);
      console.log(`📰 [DEBUG] Number of articles in response:`, data?.length || 0);
    } catch (jsonError) {
      console.error(`💥 [DEBUG] Failed to parse response as JSON:`, jsonError);
      console.error(`💥 [DEBUG] Response text that failed to parse:`, responseText);
      throw new Error(`Failed to parse FMP API response as JSON: ${jsonError.message}`);
    }
    
    if (!data || !Array.isArray(data)) {
      console.warn(`⚠️ [DEBUG] No data array in response or data is not an array`);
      console.warn(`⚠️ [DEBUG] Data structure received:`, typeof data, data);
      return [];
    }
    
    if (data.length === 0) {
      console.log(`📭 [DEBUG] No articles found for ${symbol}. Possible reasons:`);
      console.log(`   - Symbol not found in recent news`);
      console.log(`   - No relevant articles for this ticker`);
      console.log(`   - Try popular symbols: AAPL, MSFT, TSLA, GOOGL, AMZN`);
      return [];
    }

    console.log(`✅ [DEBUG] Processing ${data.length} articles for ${symbol}:`);
    
    // Log each article for debugging
    data.forEach((article, index) => {
      console.log(`📰 [DEBUG] Article ${index + 1}:`, {
        title: article.title?.substring(0, 80) + (article.title?.length > 80 ? '...' : ''),
        source: article.site,
        url: article.url ? 'Has URL' : 'NO URL',
        urlValid: article.url && (article.url.startsWith('http://') || article.url.startsWith('https://')),
        published: article.publishedDate,
        hasText: !!article.text,
        textLength: article.text?.length || 0
      });
    });

    const processedArticles = data
      .filter(article => {
        const isValid = article.title && article.site && article.url;
        if (!isValid) {
          console.warn(`⚠️ [DEBUG] Skipping article with missing required fields:`, {
            hasTitle: !!article.title,
            hasSite: !!article.site,
            hasUrl: !!article.url,
            article: article
          });
        }
        return isValid;
      })
      .map((article, index) => {
        // Simple sentiment analysis based on keywords
        let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
        
        const text = `${article.title} ${article.text || ''}`.toLowerCase();
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
          id: `fmp-${symbol}-${index}`,
          headline: article.title,
          source: article.site || 'FMP',
          datetime: new Date(article.publishedDate).getTime(),
          url: isValidUrl ? article.url : '',
          summary: article.text || 'No summary available',
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

    console.log(`🎉 [DEBUG] Successfully processed ${processedArticles.length} articles for ${symbol}`);
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
      console.error('📝 [DEBUG] FMP API may be returning HTML error page instead of JSON');
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
*/

