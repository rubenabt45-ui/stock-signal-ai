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

  static async getGPTResponse(userMessage: string): Promise<string> {
    try {
      // Get API key from environment
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        console.error('OpenAI API key not found');
        return "⚠️ **Configuration Error**\n\nOpenAI API key is not configured. Please add your OpenAI API key to continue using StrategyAI.";
      }

      const response = await fetch(this.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: this.SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', response.status, errorData);
        
        if (response.status === 401) {
          return "🔑 **Authentication Error**\n\nInvalid OpenAI API key. Please check your API key configuration.";
        } else if (response.status === 429) {
          return "⏰ **Rate Limit**\n\nToo many requests. Please wait a moment and try again.";
        } else {
          return "❌ **API Error**\n\nSorry, there was an issue connecting to the AI service. Please try again.";
        }
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected API response format:', data);
        return "⚠️ **Response Error**\n\nReceived an unexpected response format. Please try again.";
      }

      return data.choices[0].message.content || "Sorry, I couldn't generate a response. Please try again.";
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return "🔧 **Connection Error**\n\nSorry, something went wrong while processing your request. Please check your internet connection and try again.";
    }
  }

  // Keep the legacy method for backward compatibility but make it use GPT-4o
  static async answerTradingQuestion(question: string): Promise<string> {
    return this.getGPTResponse(question);
  }
  
  // Enhanced chart analysis with GPT-4o
  static async analyzeChartWithAI(userMessage: string, hasImage: boolean = false): Promise<string> {
    const contextualMessage = hasImage 
      ? `Please analyze this trading chart image and provide a complete trading strategy. User context: ${userMessage}`
      : `Please provide trading analysis for: ${userMessage}`;
      
    return this.getGPTResponse(contextualMessage);
  }
}
