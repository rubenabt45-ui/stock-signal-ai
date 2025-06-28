interface TradingQuestion {
  question: string;
  context?: string;
}

interface TradingAnswer {
  answer: string;
  examples?: string[];
  relatedTopics?: string[];
}

export class TradingAIService {
  private static readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly OPENAI_MODELS_URL = 'https://api.openai.com/v1/models';
  private static readonly SYSTEM_PROMPT = `You are StrategyAI, a professional trading assistant and mentor. You specialize in:

📊 **Technical Analysis**: Chart patterns, indicators (RSI, MACD, Bollinger Bands, Fibonacci), support/resistance levels
📈 **Trading Strategies**: Entry zones, stop losses, take profit targets, risk management
🎓 **Education**: Clear explanations for beginners and advanced traders
💡 **Market Psychology**: Trading discipline, emotional control, position sizing

**Response Style:**
- Use structured markdown with emojis for readability
- Provide actionable trading advice with specific levels when possible
- Include risk management tips
- Be professional but conversational
- For chart analysis requests, provide: Entry Zone, Stop Loss, Take Profit targets, Pattern detected, Timeframe suggestion, Technical reasoning

**Format example for trade setups:**
📊 **Trade Analysis**
💥 **Entry Zone:** [specific levels]
🛡️ **Stop Loss:** [level]
🎯 **Take Profits:** TP1: [level], TP2: [level]
🔍 **Pattern:** [pattern name]
🕒 **Timeframe:** [suggestion]
📈 **Analysis:** [technical reasoning]
⚠️ **Risk Management:** [specific advice]`;

  private static getApiKey(): string | null {
    // For frontend apps, we'll need to store the API key in localStorage
    // This is not ideal for production but works for development
    return localStorage.getItem('openai_api_key') || null;
  }

  static setApiKey(apiKey: string): void {
    localStorage.setItem('openai_api_key', apiKey);
  }

  static async validateApiKey(): Promise<{isValid: boolean, error?: string}> {
    try {
      const apiKey = this.getApiKey();
      
      if (!apiKey) {
        console.log('🔑 No API key found for validation');
        return { isValid: false, error: 'No API key found' };
      }

      console.log('🔍 Validating OpenAI API key...');
      console.log('🔑 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');

      const response = await fetch(this.OPENAI_MODELS_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 API Key Validation Response:');
      console.log('📊 Status:', response.status);
      console.log('📊 Status Text:', response.statusText);
      console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        console.log('✅ API key validation successful');
        return { isValid: true };
      }

      // Handle specific error cases
      let errorData;
      try {
        errorData = await response.json();
        console.log('❌ API Key Validation Error Response:', errorData);
      } catch (parseError) {
        console.log('❌ Could not parse validation error response:', parseError);
        errorData = {};
      }

      if (response.status === 401) {
        console.log('🔑 AUTHENTICATION ERROR: Invalid API key');
        return { isValid: false, error: 'Invalid API key' };
      } else if (response.status === 403) {
        console.log('🚫 AUTHORIZATION ERROR: API key unauthorized or billing issue');
        return { isValid: false, error: 'API key unauthorized or billing not enabled' };
      } else {
        console.log('❌ UNKNOWN VALIDATION ERROR:', response.status, errorData);
        return { isValid: false, error: `Validation failed with status ${response.status}` };
      }

    } catch (error) {
      console.error('💥 Error validating API key:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🌐 Network error during validation');
        return { isValid: false, error: 'Network error during validation' };
      }
      
      return { isValid: false, error: 'Validation request failed' };
    }
  }

  static async getGPTResponse(userMessage: string, imageBase64?: string): Promise<string> {
    try {
      // Get API key from localStorage
      const apiKey = this.getApiKey();
      
      if (!apiKey) {
        console.error('OpenAI API key not found in localStorage');
        return "⚠️ **API Key Missing**\n\nPlease set your OpenAI API key in the settings to use StrategyAI. Go to Settings → API Configuration.";
      }

      // Prepare messages array
      const messages: any[] = [
        {
          role: 'system',
          content: this.SYSTEM_PROMPT
        }
      ];

      // Add user message with optional image
      if (imageBase64) {
        messages.push({
          role: 'user',
          content: [
            {
              type: 'text',
              text: userMessage || 'Please analyze this trading chart and provide a complete strategy analysis.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64
              }
            }
          ]
        });
      } else {
        messages.push({
          role: 'user',
          content: userMessage
        });
      }

      const requestBody = {
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      };

      console.log('🚀 Sending request to OpenAI API:');
      console.log('📋 Request body:', requestBody);
      console.log('🔑 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');

      const response = await fetch(this.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 OpenAI API Response Details:');
      console.log('📊 Status:', response.status);
      console.log('📊 Status Text:', response.statusText);
      console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

      // Log specific rate limit headers if present
      const retryAfter = response.headers.get('Retry-After');
      const rateLimitLimit = response.headers.get('X-RateLimit-Limit');
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');

      if (retryAfter || rateLimitLimit || rateLimitRemaining || rateLimitReset) {
        console.log('⏱️ Rate Limit Headers:');
        console.log('  Retry-After:', retryAfter);
        console.log('  X-RateLimit-Limit:', rateLimitLimit);
        console.log('  X-RateLimit-Remaining:', rateLimitRemaining);
        console.log('  X-RateLimit-Reset:', rateLimitReset);
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('❌ OpenAI API Error Response Body:', errorData);
        } catch (parseError) {
          console.log('❌ Could not parse error response as JSON:', parseError);
          errorData = {};
        }

        // Handle specific error cases with improved messaging
        if (response.status === 401) {
          console.log('🔑 AUTHENTICATION ERROR: Invalid API key');
          return "🔑 **Invalid API Key**\n\nYour OpenAI API key is invalid. Please check your API key in Settings.";
        } else if (response.status === 403) {
          console.log('🚫 AUTHORIZATION ERROR: API key unauthorized or billing issue');
          return "🚫 **Unauthorized API Key**\n\nYour API key is unauthorized or your OpenAI account billing is not enabled. Please check your OpenAI account settings.";
        } else if (response.status === 429) {
          // Enhanced 429 error logging - only show "Rate Limit Exceeded" for 429
          console.log('🚫 RATE LIMIT ERROR DETAILS:');
          console.log('📊 Status Code:', response.status);
          console.log('📄 Error Message:', errorData?.error?.message || 'No message provided');
          console.log('🔍 Error Type:', errorData?.error?.type || 'No type provided');
          console.log('🔍 Error Code:', errorData?.error?.code || 'No code provided');
          console.log('🔍 Error Param:', errorData?.error?.param || 'No param provided');
          console.log('📋 Full Error Object:', errorData);
          
          // Check for quota vs rate limit
          if (errorData?.error?.code === 'insufficient_quota') {
            console.log('💰 QUOTA ISSUE: API key has exceeded its quota limit');
          } else if (errorData?.error?.code === 'rate_limit_exceeded') {
            console.log('⏰ RATE LIMIT: Too many requests per minute/hour');
          }

          // Throw error to trigger retry logic in TradingChat
          const errorMessage = errorData?.error?.message || 'Rate limit exceeded';
          throw new Error(`429: ${errorMessage}`);
        } else if (response.status === 400) {
          console.log('❌ BAD REQUEST ERROR:', errorData);
          return "❌ **Bad Request**\n\nThere was an issue with your request. Please try again with a different message.";
        } else if (response.status === 406) {
          console.log('🔧 406 CONFIGURATION ERROR:', errorData);
          return "🔧 **Configuration Error**\n\nConfiguration error. Please reset theme/language or check your API settings.";
        } else {
          console.log('❌ UNKNOWN API ERROR:', response.status, errorData);
          return `❌ **API Error (${response.status})**\n\nSorry, there was an issue connecting to the AI service. Please try again.`;
        }
      }

      const data = await response.json();
      console.log('✅ OpenAI API Success Response:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Unexpected API response format:', data);
        return "⚠️ **Response Error**\n\nReceived an unexpected response format. Please try again.";
      }

      console.log('✅ Successfully received response from OpenAI');
      return data.choices[0].message.content || "Sorry, I couldn't generate a response. Please try again.";
      
    } catch (error) {
      console.error('💥 Error in getGPTResponse:', error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.log('🔍 Error Details:');
        console.log('  Message:', error.message);
        console.log('  Stack:', error.stack);
        console.log('  Name:', error.name);
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🌐 Network error detected');
        return "🌐 **Network Error**\n\nUnable to connect to the AI service. Please check your internet connection and try again.";
      }
      
      // Re-throw 429 errors to be handled by retry logic
      if (error instanceof Error && error.message.includes('429')) {
        throw error;
      }
      
      return "🔧 **Connection Error**\n\nSorry, something went wrong while processing your request. Please check your internet connection and try again.";
    }
  }

  // Keep the legacy method for backward compatibility but make it use GPT-4.1
  static async answerTradingQuestion(question: string): Promise<string> {
    return this.getGPTResponse(question);
  }
  
  // Enhanced chart analysis with image support
  static async analyzeChartWithAI(userMessage: string, imageBase64?: string): Promise<string> {
    const contextualMessage = imageBase64 
      ? `Please analyze this trading chart image and provide a complete trading strategy. User context: ${userMessage}`
      : `Please provide trading analysis for: ${userMessage}`;
      
    return this.getGPTResponse(contextualMessage, imageBase64);
  }
}
