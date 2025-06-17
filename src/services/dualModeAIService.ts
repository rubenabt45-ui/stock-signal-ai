
import { IntentAnalysis, analyzeUserIntent, getProductFeatureInfo, searchProductFeatures } from './intentDetectionService';
import { MessageContext } from './symbolDetectionService';
import { UseMarketDataReturn } from '@/hooks/useMarketData';

export interface DualModeAIRequest {
  userMessage: string;
  context?: MessageContext;
  marketData?: Record<string, UseMarketDataReturn>;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface DualModeAIResponse {
  content: string;
  mode: 'trading' | 'product' | 'mixed';
  confidence: number;
  suggestedFollowUps: string[];
  relatedFeatures?: string[];
  riskDisclaimer?: boolean;
}

export const generateDualModeResponse = async (request: DualModeAIRequest): Promise<DualModeAIResponse> => {
  const { userMessage, context, marketData } = request;
  
  // Analyze user intent
  const intentAnalysis = analyzeUserIntent(userMessage);
  
  // Use confidence threshold of 60% for direct responses
  if (intentAnalysis.confidence < 0.4) {
    return generateDefaultResponse(userMessage);
  }
  
  // Route to appropriate response generator based on primary intent
  switch (intentAnalysis.type) {
    case 'product':
      return generateProductResponse(userMessage, intentAnalysis);
    case 'trading':
      return generateTradingResponse(userMessage, intentAnalysis, context, marketData);
    case 'mixed':
      // For mixed intent with reasonable confidence, choose the stronger signal
      if (intentAnalysis.confidence >= 0.6) {
        if (intentAnalysis.productFeatures && intentAnalysis.productFeatures.length > 0) {
          return generateProductResponse(userMessage, intentAnalysis);
        }
        if (intentAnalysis.tradingTopics && intentAnalysis.tradingTopics.length > 0) {
          return generateTradingResponse(userMessage, intentAnalysis, context, marketData);
        }
      }
      return generateMixedResponse(userMessage, intentAnalysis);
    default:
      return generateDefaultResponse(userMessage);
  }
};

const generateProductResponse = (userMessage: string, intent: IntentAnalysis): DualModeAIResponse => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Handle specific product features
  if (intent.productFeatures && intent.productFeatures.length > 0) {
    const feature = getProductFeatureInfo(intent.productFeatures[0]);
    if (feature) {
      return {
        content: `${feature.name} is ${feature.description}. You can find this feature at ${feature.location}. This tool helps enhance your trading analysis by providing automated insights and pattern recognition, making it easier to spot opportunities in real-time market data.`,
        mode: 'product',
        confidence: intent.confidence,
        suggestedFollowUps: [
          `How do I get the most out of ${feature.name}?`,
          'What other TradeIQ features complement this?',
          'Show me advanced TradeIQ capabilities'
        ],
        relatedFeatures: intent.productFeatures
      };
    }
  }
  
  // Handle upgrade questions
  if (lowerMessage.includes('upgrade') || lowerMessage.includes('pro')) {
    return {
      content: `TradeIQ Pro unlocks advanced trading capabilities including enhanced Chart AI with deeper pattern recognition, unlimited price alerts for comprehensive monitoring, premium technical indicators, and priority customer support. To upgrade, navigate to Settings and select the Upgrade option, or look for upgrade prompts throughout the app. Pro users gain access to institutional-grade analytics that can significantly improve trading decision-making.`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'What specific Chart AI upgrades are included?',
        'How do unlimited alerts improve my trading?',
        'Show me Pro vs Free feature comparison'
      ]
    };
  }
  
  // Handle favorites/watchlist questions
  if (lowerMessage.includes('favorite') || lowerMessage.includes('watchlist')) {
    return {
      content: `Favorites in TradeIQ let you create a personalized watchlist of assets you want to monitor closely. Tap the star icon next to any asset to add it to your favorites, then access your complete list through the Favorites tab in the main navigation. Your favorites display real-time prices and percentage changes, making it easy to track multiple positions and opportunities without constantly searching for specific assets.`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'How can I organize my favorites effectively?',
        'Can I set alerts on my favorite assets?',
        'What other portfolio tracking tools are available?'
      ]
    };
  }
  
  // Handle alerts and notifications
  if (lowerMessage.includes('alert') || lowerMessage.includes('notification')) {
    return {
      content: `Price alerts in TradeIQ help you stay informed of market movements without constant monitoring. To set alerts, use the alert icon on individual asset pages or go to Settings, then Notifications. You can create alerts for price targets, percentage changes, volume spikes, and technical indicator signals. When your conditions are met, you receive instant push notifications, allowing you to respond quickly to market opportunities.`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'What types of technical alerts can I create?',
        'How do I manage multiple alerts efficiently?',
        'Do I need Pro for advanced alert features?'
      ]
    };
  }
  
  // Handle Chart AI questions
  if (lowerMessage.includes('chart ai')) {
    return {
      content: `Chart AI provides automated technical analysis using artificial intelligence to identify patterns, support and resistance levels, and trend changes. Available on individual asset pages and integrated into the main dashboard, Chart AI analyzes current market conditions and provides actionable recommendations. The Pro version includes advanced pattern detection, deeper historical analysis, and enhanced prediction capabilities for more sophisticated trading strategies.`,
      mode: 'product',
      confidence: 0.95,
      suggestedFollowUps: [
        'What chart patterns does AI detect most accurately?',
        'How do I interpret Chart AI recommendations?',
        'What makes Pro Chart AI more powerful?'
      ]
    };
  }
  
  // General product help with feature search
  const features = searchProductFeatures(userMessage);
  if (features.length > 0) {
    const primaryFeature = features[0];
    const additionalFeatures = features.slice(1, 3);
    
    let content = `${primaryFeature.name} ${primaryFeature.description}. You can access this at ${primaryFeature.location}.`;
    
    if (additionalFeatures.length > 0) {
      content += ` Related features include ${additionalFeatures.map(f => f.name).join(' and ')}, which work together to provide comprehensive market analysis and portfolio management.`;
    }
    
    return {
      content,
      mode: 'product',
      confidence: intent.confidence,
      suggestedFollowUps: [
        `How do I maximize ${primaryFeature.name} effectiveness?`,
        'Show me advanced TradeIQ workflows',
        'What Pro features enhance this capability?'
      ],
      relatedFeatures: features.map(f => f.name)
    };
  }
  
  // Fallback for unclear product questions
  return {
    content: `TradeIQ offers comprehensive tools for modern traders including Chart AI for automated technical analysis, customizable alerts for price monitoring, and favorites for portfolio tracking. Most features are accessible from the main dashboard or individual asset pages. The Pro plan unlocks advanced analytics, unlimited alerts, and priority support for serious traders.`,
    mode: 'product',
    confidence: 0.7,
    suggestedFollowUps: [
      'Explain Chart AI capabilities in detail',
      'How do I upgrade to Pro features?',
      'Help me set up my first price alerts'
    ]
  };
};

const generateTradingResponse = (
  userMessage: string, 
  intent: IntentAnalysis, 
  context?: MessageContext, 
  marketData?: Record<string, UseMarketDataReturn>
): DualModeAIResponse => {
  const lowerMessage = userMessage.toLowerCase();
  let content = '';
  let needsRiskDisclaimer = false;
  
  // Long-term holding strategy
  if (lowerMessage.includes('long term') || lowerMessage.includes('hold') || lowerMessage.includes('buy and hold')) {
    needsRiskDisclaimer = true;
    content = `Long-term holding focuses on buying quality assets and holding them for years to benefit from compound growth. Invest in established companies with strong fundamentals, diversified index funds like SPY or QQQ, and blue-chip stocks with consistent dividend payments. The key principles are patience, emotional discipline during market volatility, and annual portfolio rebalancing. This strategy works best when you can ignore short-term market noise and focus on long-term wealth building through consistent investing and reinvestment of dividends.`;
  }
  
  // Diversification strategy
  else if (lowerMessage.includes('diversif') || lowerMessage.includes('allocation') || lowerMessage.includes('portfolio')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('conservative')) {
      content = `Conservative portfolio allocation emphasizes capital preservation with 70-80% bonds and fixed income, 20-30% stocks focusing on dividend-paying blue chips and utility companies. This approach minimizes volatility while providing steady income through interest and dividends. Rebalance quarterly to maintain target allocation and consider treasury bonds, high-grade corporate bonds, and dividend aristocrat stocks for stability.`;
    } else if (lowerMessage.includes('aggressive')) {
      content = `Aggressive portfolio allocation targets maximum growth with 80-90% stocks including growth companies, small-cap stocks, and emerging markets, plus 10-20% alternative investments like REITs or commodities. This higher-risk approach aims for superior long-term returns but requires tolerance for significant volatility. Focus on growth stocks, technology sectors, and international diversification while maintaining strict risk management.`;
    } else {
      content = `Effective diversification spreads risk across asset classes, sectors, and geographic regions. A balanced approach might include 60% domestic stocks, 20% international stocks, 15% bonds, and 5% alternatives like REITs. Within stocks, diversify across large-cap, mid-cap, and small-cap companies in different sectors. Never put more than 5-10% in any single stock, and rebalance annually to maintain your target allocation based on your risk tolerance and investment timeline.`;
    }
  }
  
  // Crypto-specific strategies
  else if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('ethereum')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('beginner')) {
      content = `Beginner crypto strategy should start with dollar-cost averaging into established cryptocurrencies like Bitcoin and Ethereum. Invest only what you can afford to lose completely, as crypto markets are extremely volatile. Start with 1-5% of your total investment portfolio, use reputable exchanges with strong security, and store significant amounts in hardware wallets. Focus on learning blockchain fundamentals before expanding to altcoins, and never invest based on social media hype or fear of missing out.`;
    } else {
      content = `Crypto trading strategies include momentum trading for trending coins with high volume, swing trading to capture multi-day price movements, and long-term holding of fundamentally strong projects. Diversify across different cryptocurrency categories like store of value (Bitcoin), smart contract platforms (Ethereum), and emerging sectors like DeFi or Layer 2 solutions. The 24/7 nature of crypto markets creates both opportunities and risks, requiring disciplined risk management and clear entry and exit strategies.`;
    }
  }
  
  // Stock-specific strategies
  else if (lowerMessage.includes('stock') || lowerMessage.includes('equity')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('growth')) {
      content = `Growth investing targets companies with above-average earnings growth potential, typically in technology, healthcare, or emerging industries. Look for companies with strong revenue growth, expanding market share, and innovative products or services. Growth stocks often trade at higher valuations but can provide superior returns during bull markets. Focus on companies with sustainable competitive advantages, strong management teams, and clear paths to future profitability.`;
    } else if (lowerMessage.includes('value')) {
      content = `Value investing seeks undervalued companies trading below their intrinsic worth, often measured by low price-to-earnings ratios, price-to-book ratios, or high dividend yields. Look for profitable companies with strong balance sheets, stable cash flows, and temporary challenges that have depressed their stock price. Value stocks often outperform during market downturns and provide dividend income while you wait for price appreciation.`;
    } else {
      content = `Stock investment strategies should align with your investment timeline and risk tolerance. Consider index fund investing for broad market exposure with minimal effort, dividend growth investing for income and inflation protection, or sector rotation based on economic cycles. Successful stock investing requires fundamental analysis, understanding company financials, and maintaining discipline during market volatility. Diversify across sectors and company sizes to reduce single-stock risk.`;
    }
  }
  
  // Strategy questions - general
  else if (lowerMessage.includes('strategy') || lowerMessage.includes('strategies')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('beginner')) {
      content = `Beginner trading strategies should emphasize risk management and education over quick profits. Start with dollar-cost averaging into index funds to learn market behavior, then progress to swing trading with small position sizes. Focus on trend-following strategies using simple moving averages, and always use stop-losses to limit downside risk. Paper trade new strategies before risking real money, and never risk more than 1-2% of your portfolio on any single trade.`;
    } else {
      content = `Effective trading strategies combine technical analysis, fundamental research, and disciplined risk management. Consider momentum trading for trending markets, mean reversion for range-bound conditions, and breakout strategies for volatile periods. Successful traders often use multiple timeframes, maintain detailed trading journals, and adapt their strategies to current market conditions. The key is finding an approach that matches your personality, available time, and risk tolerance while maintaining consistent execution.`;
    }
  }
  
  // Technical analysis questions
  else if (intent.tradingTopics?.some(topic => ['rsi', 'macd', 'moving average', 'support', 'resistance'].includes(topic))) {
    const topics = intent.tradingTopics.filter(topic => ['rsi', 'macd', 'moving average', 'support', 'resistance'].includes(topic));
    
    if (topics.includes('rsi')) {
      content = `RSI (Relative Strength Index) measures momentum on a 0-100 scale to identify overbought and oversold conditions. Values above 70 suggest potential selling pressure and possible price reversal, while values below 30 indicate potential buying opportunities. The most reliable RSI signals occur when combined with trend analysis and divergences between RSI and price action. In strong trending markets, RSI can remain overbought or oversold for extended periods, so use additional confirmation before taking positions.`;
    } else if (topics.includes('macd')) {
      content = `MACD (Moving Average Convergence Divergence) tracks trend changes and momentum through the relationship between two exponential moving averages. Bullish signals occur when the MACD line crosses above the signal line, while bearish signals occur when it crosses below. The histogram shows momentum strength and potential turning points. MACD works best on longer timeframes and should be combined with price action analysis for confirmation of trend changes.`;
    } else if (topics.includes('support') || topics.includes('resistance')) {
      content = `Support and resistance levels represent price zones where buying and selling pressure historically emerge. Support acts as a floor where demand increases, while resistance acts as a ceiling where supply increases. These levels become more significant when tested multiple times with high volume. Trading strategies include buying near support for long positions, selling near resistance for short positions, and trading breakouts when price moves decisively beyond these levels with increased volume.`;
    } else {
      content = `Technical analysis combines price patterns, volume analysis, and momentum indicators to make trading decisions. Moving averages help identify trend direction and dynamic support/resistance levels. Successful technical analysis requires understanding that no single indicator is perfect, so combine multiple signals for confirmation. Focus on higher timeframes for trend direction and lower timeframes for precise entry and exit points.`;
    }
  }
  
  // Risk management
  else if (lowerMessage.includes('risk')) {
    content = `Risk management is the foundation of successful trading and involves position sizing, diversification, and emotional discipline. Never risk more than 1-2% of your total portfolio on any single trade, and use stop-losses to limit downside exposure. Diversify across different assets, sectors, and strategies to reduce correlation risk. Maintain a risk-reward ratio of at least 1:2, meaning you target twice the profit as your potential loss. Most importantly, stick to your risk management rules regardless of market emotions or recent performance.`;
  }
  
  // Market data context analysis
  else if (context?.symbols && marketData && Object.keys(marketData).length > 0) {
    const symbol = context.symbols[0];
    const data = marketData[symbol.symbol];
    
    if (data && !data.error && !data.isLoading) {
      const changePercent = ((data.change / data.price) * 100);
      const trend = data.change >= 0 ? 'bullish' : 'bearish';
      const momentum = Math.abs(changePercent) > 2 ? 'strong' : 'moderate';
      
      content = `${symbol.symbol} is currently trading at $${data.price.toFixed(2)}, showing ${momentum} ${trend} momentum with a ${changePercent.toFixed(2)}% change. This ${momentum} movement suggests ${data.change >= 0 ? 'buying interest and potential continuation of upward momentum' : 'selling pressure with possible further downside'}. Key levels to monitor include support around $${(data.price * 0.95).toFixed(2)} and resistance near $${(data.price * 1.05).toFixed(2)}. Consider the broader market context and volume confirmation before making trading decisions.`;
      needsRiskDisclaimer = true;
    }
  }
  
  // Default trading response for unclear questions
  else {
    content = `I can provide specific guidance on trading strategies, technical analysis, risk management, and market insights. Whether you're interested in long-term investing, day trading, or technical indicators, I can help you understand the concepts and practical applications. What specific aspect of trading or investing would you like to explore?`;
  }
  
  return {
    content: needsRiskDisclaimer ? `${content}\n\nThis is educational content, not financial advice. Please do your own research before making investment decisions.` : content,
    mode: 'trading',
    confidence: intent.confidence,
    suggestedFollowUps: generateTradingFollowUps(lowerMessage, context),
    riskDisclaimer: needsRiskDisclaimer
  };
};

const generateMixedResponse = (userMessage: string, intent: IntentAnalysis): DualModeAIResponse => {
  // Only use mixed response for very low confidence or truly ambiguous cases
  return {
    content: `I can help you with both trading education and TradeIQ app features. Could you clarify if you're asking about investment strategies and market analysis, or how to use specific features like Chart AI, alerts, or navigation within the app?`,
    mode: 'mixed',
    confidence: intent.confidence,
    suggestedFollowUps: [
      'Explain cryptocurrency trading strategies',
      'How do I use Chart AI for analysis?',
      'Show me technical indicator basics'
    ]
  };
};

const generateDefaultResponse = (userMessage: string): DualModeAIResponse => {
  return {
    content: `Hello and welcome to the TradeIQ Assistant. I can help you with trading and investment education including strategies, technical analysis, and market insights, as well as guidance on using TradeIQ features like Chart AI, alerts, and portfolio management. What would you like to learn about?`,
    mode: 'mixed',
    confidence: 0.5,
    suggestedFollowUps: [
      'What are effective beginner trading strategies?',
      'How do I set up price alerts?',
      'Explain key technical indicators'
    ]
  };
};

const generateTradingFollowUps = (message: string, context?: MessageContext): string[] => {
  const suggestions: string[] = [];
  
  if (context?.symbols && context.symbols.length > 0) {
    const symbol = context.symbols[0].symbol;
    suggestions.push(`${symbol} technical analysis`, `${symbol} support and resistance levels`);
  }
  
  if (message.includes('strategy')) {
    suggestions.push('Risk management principles', 'Portfolio diversification tips');
  }
  
  if (message.includes('crypto')) {
    suggestions.push('Best crypto for beginners', 'Crypto risk management');
  }
  
  if (message.includes('stock')) {
    suggestions.push('Growth vs value investing', 'Dividend stock strategies');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Current market outlook', 'Technical indicators guide', 'Investment strategy basics');
  }
  
  return suggestions.slice(0, 3);
};
