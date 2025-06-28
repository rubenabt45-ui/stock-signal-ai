
interface TradingQuestion {
  question: string;
  context?: string;
}

interface TradingAnswer {
  answer: string;
  examples?: string[];
  relatedTopics?: string[];
}

interface ModelFallbackConfig {
  primary: string;
  fallbacks: string[];
  current: string;
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

  // Model fallback configuration
  private static modelConfig: ModelFallbackConfig = {
    primary: 'gpt-4.1-2025-04-14',
    fallbacks: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    current: 'gpt-4.1-2025-04-14'
  };

  private static getApiKey(): string | null {
    return localStorage.getItem('openai_api_key') || null;
  }

  static setApiKey(apiKey: string): void {
    localStorage.setItem('openai_api_key', apiKey);
  }

  private static getCurrentModel(): string {
    const savedModel = localStorage.getItem('current_ai_model');
    if (savedModel) {
      this.modelConfig.current = savedModel;
      console.log('🤖 Using saved model from localStorage:', savedModel);
    }
    return this.modelConfig.current;
  }

  private static setCurrentModel(model: string): void {
    this.modelConfig.current = model;
    localStorage.setItem('current_ai_model', model);
    console.log('💾 Saved current model to localStorage:', model);
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
        
        // Test the current model with a lightweight request
        await this.testCurrentModel();
        
        return { isValid: true };
      }

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
      } else if (response.status === 429) {
        console.log('⏰ RATE LIMIT ERROR during validation');
        return { isValid: false, error: 'Rate limit exceeded during validation' };
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

  private static async testCurrentModel(): Promise<void> {
    try {
      const currentModel = this.getCurrentModel();
      console.log('🧪 Testing current model:', currentModel);
      
      const apiKey = this.getApiKey();
      if (!apiKey) return;

      const testResponse = await fetch(this.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 1
        })
      });

      if (testResponse.ok) {
        console.log('✅ Current model test successful:', currentModel);
      } else {
        console.log('⚠️ Current model test failed, may need fallback:', currentModel);
        const errorData = await testResponse.json().catch(() => ({}));
        console.log('🔍 Model test error details:', errorData);
      }
    } catch (error) {
      console.log('🧪 Model test error (non-critical):', error);
    }
  }

  private static detectQuotaOrBillingIssue(status: number, errorData: any): boolean {
    // Check for quota exceeded
    if (errorData?.error?.code === 'insufficient_quota') {
      console.log('💰 QUOTA ISSUE DETECTED: insufficient_quota');
      return true;
    }

    // Check for billing issues
    if (status === 403 && errorData?.error?.message?.toLowerCase().includes('billing')) {
      console.log('💳 BILLING ISSUE DETECTED: billing related 403 error');
      return true;
    }

    // Check for rate limit due to no credits
    if (status === 429 && errorData?.error?.code === 'insufficient_quota') {
      console.log('💰 QUOTA RATE LIMIT DETECTED: 429 with insufficient_quota');
      return true;
    }

    return false;
  }

  private static async tryModelFallback(userMessage: string, imageBase64?: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('No API key available for fallback');
    }

    console.log('🔄 Starting model fallback sequence...');
    console.log('🎯 Available fallback models:', this.modelConfig.fallbacks);

    for (const fallbackModel of this.modelConfig.fallbacks) {
      try {
        console.log(`🧪 Attempting fallback model: ${fallbackModel}`);

        const messages: any[] = [
          {
            role: 'system',
            content: this.SYSTEM_PROMPT
          }
        ];

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

        const response = await fetch(this.OPENAI_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: fallbackModel,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        console.log(`📡 Fallback model ${fallbackModel} response:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ SUCCESS: Fallback model ${fallbackModel} worked!`);
          
          // Update current model to the working fallback
          this.setCurrentModel(fallbackModel);
          
          return data.choices[0].message?.content || "Sorry, I couldn't generate a response. Please try again.";
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.log(`❌ Fallback model ${fallbackModel} failed:`, response.status, errorData);
        }

      } catch (error) {
        console.log(`💥 Exception with fallback model ${fallbackModel}:`, error);
      }
    }

    console.log('🚫 All fallback models failed');
    throw new Error('All models failed including fallbacks');
  }

  static async getGPTResponse(userMessage: string, imageBase64?: string): Promise<string> {
    try {
      const apiKey = this.getApiKey();
      
      if (!apiKey) {
        console.error('OpenAI API key not found in localStorage');
        return "⚠️ **API Key Missing**\n\nPlease set your OpenAI API key in the settings to use StrategyAI. Go to Settings → API Configuration.";
      }

      const currentModel = this.getCurrentModel();
      console.log('🤖 Using model:', currentModel);

      const messages: any[] = [
        {
          role: 'system',
          content: this.SYSTEM_PROMPT
        }
      ];

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
        model: currentModel,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      };

      console.log('🚀 Sending request to OpenAI API:');
      console.log('📋 Model:', currentModel);
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

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('❌ OpenAI API Error Response Body:', errorData);
        } catch (parseError) {
          console.log('❌ Could not parse error response as JSON:', parseError);
          errorData = {};
        }

        // Handle specific error cases with enhanced messaging and fallback logic
        if (response.status === 401) {
          console.log('🔑 AUTHENTICATION ERROR: Invalid API key');
          return "🔑 **Invalid API Key**\n\nYour OpenAI API key is invalid. Please check your API key in Settings.";
        } else if (response.status === 403) {
          console.log('🚫 AUTHORIZATION ERROR: API key unauthorized or billing issue');
          
          if (this.detectQuotaOrBillingIssue(response.status, errorData)) {
            console.log('💰 Attempting model fallback due to quota/billing issue...');
            try {
              const fallbackResponse = await this.tryModelFallback(userMessage, imageBase64);
              return `🔄 **Fallback Model Activated**\n\nYour primary model hit quota limits. Switched to: ${this.getCurrentModel()}\n\n${fallbackResponse}`;
            } catch (fallbackError) {
              console.log('💥 All fallback attempts failed:', fallbackError);
              return "💰 **Quota Exceeded**\n\nYou've reached your API quota limit. Please check your OpenAI billing settings and add credits to continue.";
            }
          }
          
          return "🚫 **Unauthorized API Key**\n\nYour API key is unauthorized or your OpenAI account billing is not enabled. Please check your OpenAI account settings.";
        } else if (response.status === 429) {
          console.log('🚫 RATE LIMIT ERROR DETAILS:');
          console.log('📊 Status Code:', response.status);
          console.log('📄 Error Message:', errorData?.error?.message || 'No message provided');
          console.log('🔍 Error Type:', errorData?.error?.type || 'No type provided');
          console.log('🔍 Error Code:', errorData?.error?.code || 'No code provided');
          
          if (this.detectQuotaOrBillingIssue(response.status, errorData)) {
            console.log('💰 429 due to quota issue, attempting fallback...');
            try {
              const fallbackResponse = await this.tryModelFallback(userMessage, imageBase64);
              return `🔄 **Fallback Model Activated**\n\nYour primary model hit quota limits. Switched to: ${this.getCurrentModel()}\n\n${fallbackResponse}`;
            } catch (fallbackError) {
              console.log('💥 All fallback attempts failed:', fallbackError);
              return "💰 **Quota Exceeded**\n\nYou've reached your API quota limit. Please check your OpenAI billing settings and add credits to continue.";
            }
          }
          
          // Regular rate limit - throw error to trigger retry logic
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
      console.log('✅ OpenAI API Success Response with model:', currentModel);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Unexpected API response format:', data);
        return "⚠️ **Response Error**\n\nReceived an unexpected response format. Please try again.";
      }

      console.log('✅ Successfully received response from OpenAI');
      return data.choices[0].message.content || "Sorry, I couldn't generate a response. Please try again.";
      
    } catch (error) {
      console.error('💥 Error in getGPTResponse:', error);
      
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

  // Get current model info for UI display
  static getCurrentModelInfo(): { model: string; isPrimary: boolean } {
    const current = this.getCurrentModel();
    return {
      model: current,
      isPrimary: current === this.modelConfig.primary
    };
  }

  // Reset to primary model (useful for testing after credits are added)
  static resetToPrimaryModel(): void {
    this.setCurrentModel(this.modelConfig.primary);
    console.log('🔄 Reset to primary model:', this.modelConfig.primary);
  }
}
