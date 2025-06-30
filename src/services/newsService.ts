
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
  console.log(`🔍 [DEBUG] Starting fetchNewsForAsset for symbol: ${symbol}`);
  console.log(`🔑 [DEBUG] API Key being used: ${MARKETAUX_API_KEY ? MARKETAUX_API_KEY.substring(0, 8) + '...' : 'MISSING'}`);
  console.log(`📏 [DEBUG] API Key length: ${MARKETAUX_API_KEY?.length || 0} characters`);
  
  try {
    // Build URL with minimal, essential parameters only
    const baseUrl = 'https://api.marketaux.com/v1/news/all';
    const params = new URLSearchParams({
      symbols: symbol,
      language: 'en',
      limit: '20',
      api_token: MARKETAUX_API_KEY
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    
    console.log(`🌐 [DEBUG] Full API Request URL: ${fullUrl}`);
    console.log(`📋 [DEBUG] Request parameters breakdown:`, {
      baseUrl,
      symbols: symbol,
      language: 'en',
      limit: '20',
      api_token: MARKETAUX_API_KEY ? '[PRESENT]' : '[MISSING]'
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
      
      // Specific error handling with detailed logging
      switch (response.status) {
        case 401:
          console.error('🔒 [DEBUG] 401 Unauthorized - API key may be invalid or missing');
          break;
        case 403:
          console.error('🚫 [DEBUG] 403 Forbidden - API key may lack permissions or plan limits exceeded');
          break;
        case 429:
          console.error('⏰ [DEBUG] 429 Rate Limited - too many requests, need to wait');
          break;
        case 500:
          console.error('🏥 [DEBUG] 500 Server Error - Marketaux API is having issues');
          break;
        default:
          console.error(`❓ [DEBUG] Unexpected HTTP status: ${response.status}`);
      }
      
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ [DEBUG] Response OK, parsing JSON...`);
    
    let data: MarketauxResponse;
    try {
      data = await response.json();
      console.log(`📊 [DEBUG] Successfully parsed JSON response:`, data);
      console.log(`📈 [DEBUG] Response meta information:`, data.meta);
      console.log(`📰 [DEBUG] Number of articles in data array:`, data.data?.length || 0);
    } catch (jsonError) {
      console.error(`💥 [DEBUG] Failed to parse response as JSON:`, jsonError);
      console.error(`💥 [DEBUG] Response text that failed to parse:`, responseText);
      throw new Error(`Failed to parse API response as JSON: ${jsonError.message}`);
    }
    
    // Check for API-level errors in response
    if (data.error) {
      console.error(`🚨 [DEBUG] API returned error in response:`, data.error);
      throw new Error(`API Error: ${data.error.code} - ${data.error.message}`);
    }
    
    if (!data.data || !Array.isArray(data.data)) {
      console.warn(`⚠️ [DEBUG] No data array in response or data is not an array`);
      console.warn(`⚠️ [DEBUG] Data structure received:`, typeof data.data, data.data);
      return [];
    }
    
    if (data.data.length === 0) {
      console.log(`📭 [DEBUG] No articles found for ${symbol}. Possible reasons:`);
      console.log(`   - Symbol not covered in current API plan`);
      console.log(`   - No recent news for this symbol`);
      console.log(`   - API rate limits or restrictions`);
      console.log(`   - Try popular symbols: AAPL, MSFT, TSLA, GOOGL, AMZN`);
      return [];
    }

    console.log(`✅ [DEBUG] Processing ${data.data.length} articles for ${symbol}:`);
    
    // Log each article for debugging
    data.data.forEach((article, index) => {
      console.log(`📰 [DEBUG] Article ${index + 1}:`, {
        title: article.title?.substring(0, 80) + (article.title?.length > 80 ? '...' : ''),
        source: article.source,
        url: article.url ? 'Has URL' : 'NO URL',
        urlValid: article.url && (article.url.startsWith('http://') || article.url.startsWith('https://')),
        published: article.published_at,
        hasDescription: !!article.description,
        descriptionLength: article.description?.length || 0
      });
    });

    const processedArticles = data.data
      .filter(article => {
        const isValid = article.title && article.source;
        if (!isValid) {
          console.warn(`⚠️ [DEBUG] Skipping article with missing required fields:`, {
            hasTitle: !!article.title,
            hasSource: !!article.source,
            article: article
          });
        }
        return isValid;
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
          console.warn(`🔗 [DEBUG] Invalid URL for article: "${article.title?.substring(0, 50)}..." - URL: ${article.url}`);
        }

        const processedArticle = {
          id: `marketaux-${symbol}-${index}`,
          headline: article.title,
          source: article.source || 'Financial News',
          datetime: new Date(article.published_at).getTime(),
          url: isValidUrl ? article.url : '',
          summary: article.description?.length > 200 
            ? article.description.substring(0, 200) + '...' 
            : article.description || 'No summary available',
          category: 'market',
          relatedSymbols: article.entities?.map(e => e.symbol) || [symbol],
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
      console.error('📝 [DEBUG] API may be returning HTML error page instead of JSON');
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

// Refresh news function for auto-update feature
export const refreshNewsForAsset = async (symbol: string): Promise<NewsArticle[]> => {
  console.log(`🔄 [DEBUG] Refreshing news for ${symbol}`);
  return fetchNewsForAsset(symbol);
};
