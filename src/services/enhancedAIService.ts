
import { MessageContext } from './symbolDetectionService';
import { UseMarketDataReturn } from '@/hooks/useMarketData';

export interface EnhancedAIRequest {
  userMessage: string;
  context: MessageContext;
  marketData: Record<string, UseMarketDataReturn>;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface EnhancedAIResponse {
  content: string;
  confidence: number;
  dataUsed: string[];
  suggestedFollowUps: string[];
}

export const generateEnhancedTradingResponse = async (request: EnhancedAIRequest): Promise<EnhancedAIResponse> => {
  const { userMessage, context, marketData } = request;
  
  // Build market data context string
  const marketDataContext = Object.entries(marketData)
    .map(([symbol, data]) => {
      if (data.error || data.isLoading) return '';
      
      const changeDirection = data.change >= 0 ? 'up' : 'down';
      const changePercent = ((data.change / data.price) * 100).toFixed(2);
      
      return `${symbol}: $${data.price.toFixed(2)} (${changeDirection} ${Math.abs(data.change).toFixed(2)} or ${Math.abs(parseFloat(changePercent))}%)`;
    })
    .filter(Boolean)
    .join(', ');
  
  // Generate technical analysis context
  const technicalContext = context.technicalRequests
    .map(req => `User is asking about ${req.type.replace('_', ' ')}`)
    .join(', ');
  
  // Generate timeframe context
  const timeframeContext = context.timeframes
    .map(tf => `for ${tf.timeframe} timeframe`)
    .join(', ');
  
  // Build enhanced prompt
  let enhancedPrompt = `You are an expert trading assistant with real-time market access. `;
  
  if (context.isQuestionAboutTrading) {
    enhancedPrompt += `User asks: "${userMessage}". `;
    
    if (marketDataContext) {
      enhancedPrompt += `Current market data: ${marketDataContext}. `;
    }
    
    if (technicalContext) {
      enhancedPrompt += `Technical analysis requested: ${technicalContext}. `;
    }
    
    if (timeframeContext) {
      enhancedPrompt += `Timeframe context: ${timeframeContext}. `;
    }
    
    enhancedPrompt += `Provide detailed technical analysis with specific price levels, trend direction, and actionable insights. Use the current market data to support your analysis.`;
  } else {
    enhancedPrompt += `User asks: "${userMessage}". Provide helpful trading education or general market insights.`;
  }
  
  // Generate response based on detected patterns
  const response = generateContextualResponse(userMessage, context, marketData);
  
  return {
    content: response.content,
    confidence: response.confidence,
    dataUsed: Object.keys(marketData).filter(symbol => marketData[symbol] && !marketData[symbol].error),
    suggestedFollowUps: generateFollowUpSuggestions(context, marketData)
  };
};

const generateContextualResponse = (
  userMessage: string, 
  context: MessageContext, 
  marketData: Record<string, UseMarketDataReturn>
) => {
  const { symbols, technicalRequests, timeframes } = context;
  
  // If we have symbols and market data, provide data-driven response
  if (symbols.length > 0 && Object.keys(marketData).length > 0) {
    return generateMarketDataResponse(userMessage, symbols, marketData, technicalRequests);
  }
  
  // If technical analysis is requested, provide educational response
  if (technicalRequests.length > 0) {
    return generateTechnicalEducationResponse(userMessage, technicalRequests);
  }
  
  // Default enhanced response
  return generateGeneralTradingResponse(userMessage);
};

const generateMarketDataResponse = (
  userMessage: string,
  symbols: any[],
  marketData: Record<string, UseMarketDataReturn>,
  technicalRequests: any[]
) => {
  const responses: string[] = [];
  
  symbols.forEach(symbolInfo => {
    const data = marketData[symbolInfo.symbol];
    if (!data || data.error || data.isLoading) return;
    
    const changePercent = ((data.change / data.price) * 100);
    const direction = data.change >= 0 ? 'up' : 'down';
    const momentum = Math.abs(changePercent) > 2 ? 'strong' : 'moderate';
    
    let response = `**${symbolInfo.symbol}** is currently trading at **$${data.price.toFixed(2)}**, ${direction} ${momentum}ly by ${Math.abs(changePercent).toFixed(2)}% (${data.change >= 0 ? '+' : ''}$${data.change.toFixed(2)}).`;
    
    // Add technical context if requested
    if (technicalRequests.some(req => req.type === 'support_resistance')) {
      const support = data.price * 0.95;
      const resistance = data.price * 1.05;
      response += ` Key levels: Support around $${support.toFixed(2)}, Resistance near $${resistance.toFixed(2)}.`;
    }
    
    if (technicalRequests.some(req => req.type === 'trend')) {
      const trendDirection = data.change >= 0 ? 'bullish' : 'bearish';
      response += ` Current trend appears ${trendDirection} with ${momentum} momentum.`;
    }
    
    if (technicalRequests.some(req => req.type === 'rsi')) {
      const rsiValue = 50 + (Math.random() * 40 - 20); // Mock RSI
      const rsiSignal = rsiValue > 70 ? 'overbought' : rsiValue < 30 ? 'oversold' : 'neutral';
      response += ` RSI indicates ${rsiSignal} conditions at ${rsiValue.toFixed(1)}.`;
    }
    
    responses.push(response);
  });
  
  return {
    content: responses.join('\n\n'),
    confidence: 0.9
  };
};

const generateTechnicalEducationResponse = (userMessage: string, technicalRequests: any[]) => {
  const responses: Record<string, string> = {
    'support_resistance': 'Support and resistance levels are key price points where buying or selling pressure tends to emerge. Support acts as a floor where price tends to bounce, while resistance acts as a ceiling where price faces selling pressure.',
    'macd': 'MACD (Moving Average Convergence Divergence) shows the relationship between two moving averages. When MACD crosses above the signal line, it suggests bullish momentum. When it crosses below, it indicates bearish momentum.',
    'rsi': 'RSI (Relative Strength Index) measures momentum on a 0-100 scale. Values above 70 suggest overbought conditions (potential sell signal), while values below 30 suggest oversold conditions (potential buy signal).',
    'moving_averages': 'Moving averages smooth out price data to identify trend direction. When price is above the moving average, it suggests an uptrend. When below, it suggests a downtrend.',
    'volume': 'Volume confirms price movements. High volume during price increases suggests strong buying interest, while high volume during declines suggests strong selling pressure.',
    'trend': 'Trend analysis helps identify the overall direction of price movement. Uptrends show higher highs and higher lows, while downtrends show lower highs and lower lows.',
    'breakout': 'Breakouts occur when price moves beyond established support or resistance levels with increased volume, potentially signaling the start of a new trend.',
    'pattern': 'Chart patterns are formations created by price movements that can help predict future price direction. Common patterns include triangles, flags, and head-and-shoulders.'
  };
  
  const relevantResponses = technicalRequests
    .map(req => responses[req.type])
    .filter(Boolean);
  
  return {
    content: relevantResponses.join('\n\n') || 'I can help you understand various technical analysis concepts. What specific indicator or pattern would you like to learn about?',
    confidence: 0.8
  };
};

const generateGeneralTradingResponse = (userMessage: string) => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('strategy')) {
    return {
      content: 'Trading strategies should align with your risk tolerance and market outlook. Consider factors like timeframe, risk management, and market conditions when developing your approach.',
      confidence: 0.7
    };
  }
  
  if (lowerMessage.includes('risk')) {
    return {
      content: 'Risk management is crucial in trading. Consider position sizing, stop-losses, and diversification. Never risk more than you can afford to lose on a single trade.',
      confidence: 0.8
    };
  }
  
  return {
    content: 'I can help you analyze markets, understand technical indicators, and develop trading strategies. What specific aspect of trading would you like to explore?',
    confidence: 0.6
  };
};

const generateFollowUpSuggestions = (context: MessageContext, marketData: Record<string, UseMarketDataReturn>): string[] => {
  const suggestions: string[] = [];
  
  if (context.symbols.length > 0) {
    suggestions.push(`Analyze ${context.symbols[0].symbol} technical indicators`);
    suggestions.push(`What are key support/resistance levels for ${context.symbols[0].symbol}?`);
  }
  
  if (context.technicalRequests.length > 0) {
    suggestions.push('Show me volume analysis');
    suggestions.push('What about moving average crossovers?');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Analyze BTC price action', 'SPY market outlook', 'Best technical indicators for day trading');
  }
  
  return suggestions.slice(0, 3);
};
