
import { MessageContext, detectSymbolsInMessage } from './symbolDetectionService';
import { generateEnhancedTradingResponse, EnhancedAIRequest } from './enhancedAIService';
import { analyzeUserIntent, IntentAnalysis, getProductFeatureInfo, searchProductFeatures } from './intentDetectionService';

// Define the interface locally instead of importing
interface UseMarketDataReturn {
  price: number;
  change: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

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
  const { userMessage, context, marketData, conversationHistory } = request;
  
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
      return generateTradingResponse(userMessage, intentAnalysis, context, marketData, conversationHistory);
    case 'mixed':
      // For mixed intent with reasonable confidence, choose the stronger signal
      if (intentAnalysis.confidence >= 0.6) {
        if (intentAnalysis.productFeatures && intentAnalysis.productFeatures.length > 0) {
          return generateProductResponse(userMessage, intentAnalysis);
        }
        if (intentAnalysis.tradingTopics && intentAnalysis.tradingTopics.length > 0) {
          return generateTradingResponse(userMessage, intentAnalysis, context, marketData, conversationHistory);
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
        content: `${feature.name} is ${feature.description}. You can find this feature at ${feature.location}.\n\nThis tool helps enhance your trading analysis by providing automated insights and pattern recognition, making it easier to spot opportunities in real-time market data.\n\nNext step: Try exploring the feature to see how it can improve your trading workflow.`,
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
      content: `TradeIQ Pro unlocks advanced trading capabilities including enhanced Chart AI with deeper pattern recognition, unlimited price alerts for comprehensive monitoring, premium technical indicators, and priority customer support.\n\nTo upgrade, navigate to Settings and select the Upgrade option, or look for upgrade prompts throughout the app. Pro users gain access to institutional-grade analytics that can significantly improve trading decision-making.\n\nReady to upgrade? Check Settings > Upgrade to unlock these powerful features.`,
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
      content: `Favorites in TradeIQ let you create a personalized watchlist of assets you want to monitor closely. Tap the star icon next to any asset to add it to your favorites, then access your complete list through the Favorites tab in the main navigation.\n\nYour favorites display real-time prices and percentage changes, making it easy to track multiple positions and opportunities without constantly searching for specific assets.\n\nTip: Start building your watchlist by adding 3-5 assets you trade most frequently.`,
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
      content: `Price alerts in TradeIQ help you stay informed of market movements without constant monitoring. To set alerts, use the alert icon on individual asset pages or go to Settings, then Notifications.\n\nYou can create alerts for price targets, percentage changes, volume spikes, and technical indicator signals. When your conditions are met, you receive instant push notifications, allowing you to respond quickly to market opportunities.\n\nNext step: Set your first alert on an asset you're watching for a specific price level.`,
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
      content: `Chart AI provides automated technical analysis using artificial intelligence to identify patterns, support and resistance levels, and trend changes. Available on individual asset pages and integrated into the main dashboard, Chart AI analyzes current market conditions and provides actionable recommendations.\n\nThe Pro version includes advanced pattern detection, deeper historical analysis, and enhanced prediction capabilities for more sophisticated trading strategies.\n\nTry it now: Navigate to any asset page and look for the Chart AI section to see automated analysis in action.`,
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
      content += `\n\nRelated features include ${additionalFeatures.map(f => f.name).join(' and ')}, which work together to provide comprehensive market analysis and portfolio management.`;
    }
    
    content += `\n\nNext step: Explore these features to enhance your trading workflow.`;
    
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
    content: `TradeIQ offers comprehensive tools for modern traders including Chart AI for automated technical analysis, customizable alerts for price monitoring, and favorites for portfolio tracking. Most features are accessible from the main dashboard or individual asset pages.\n\nThe Pro plan unlocks advanced analytics, unlimited alerts, and priority support for serious traders.\n\nStart exploring: Try Chart AI on any asset to see automated technical analysis in action.`,
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
  marketData?: Record<string, UseMarketDataReturn>,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): DualModeAIResponse => {
  const lowerMessage = userMessage.toLowerCase();
  let content = '';
  let needsRiskDisclaimer = false;
  let activeSymbol = context?.symbols?.[0]?.symbol;
  
  // Check for context from previous conversation
  if (!activeSymbol && conversationHistory) {
    const lastMessages = conversationHistory.slice(-4);
    for (const msg of lastMessages.reverse()) {
      const contextCheck = detectSymbolsInMessage(msg.content);
      if (contextCheck.symbols.length > 0) {
        activeSymbol = contextCheck.symbols[0].symbol;
        break;
      }
    }
  }
  
  // Long-term holding strategy
  if (lowerMessage.includes('long term') || lowerMessage.includes('hold') || lowerMessage.includes('buy and hold')) {
    needsRiskDisclaimer = true;
    content = `Long-term holding focuses on buying quality assets and holding them for years to benefit from compound growth. The strategy works best with established companies showing strong fundamentals, diversified index funds like SPY or QQQ, and blue-chip stocks with consistent dividend payments.\n\nKey principles include patience during market volatility, emotional discipline to avoid panic selling, and annual portfolio rebalancing. This approach has historically outperformed active trading for most investors.\n\nConsider starting with broad market ETFs before moving to individual stocks.`;
    
    if (activeSymbol) {
      content += `\n\nFor ${activeSymbol}, evaluate its long-term fundamentals and consider using Chart AI to assess entry points.`;
    }
  }
  
  // Diversification strategy
  else if (lowerMessage.includes('diversif') || lowerMessage.includes('allocation') || lowerMessage.includes('portfolio')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('conservative')) {
      content = `Conservative portfolio allocation emphasizes capital preservation with 70-80% bonds and fixed income, 20-30% stocks focusing on dividend-paying blue chips and utility companies.\n\nThis approach minimizes volatility while providing steady income through interest and dividends. Rebalance quarterly to maintain target allocation and consider treasury bonds, high-grade corporate bonds, and dividend aristocrat stocks for stability.\n\nUse TradeIQ alerts to monitor your positions and rebalancing opportunities.`;
    } else if (lowerMessage.includes('aggressive')) {
      content = `Aggressive portfolio allocation targets maximum growth with 80-90% stocks including growth companies, small-cap stocks, and emerging markets, plus 10-20% alternative investments like REITs or commodities.\n\nThis higher-risk approach aims for superior long-term returns but requires tolerance for significant volatility. Focus on growth stocks, technology sectors, and international diversification while maintaining strict risk management.\n\nSet price alerts on your positions to manage volatility effectively.`;
    } else {
      content = `Effective diversification spreads risk across asset classes, sectors, and geographic regions. A balanced approach might include 60% domestic stocks, 20% international stocks, 15% bonds, and 5% alternatives like REITs.\n\nWithin stocks, diversify across large-cap, mid-cap, and small-cap companies in different sectors. Never put more than 5-10% in any single stock, and rebalance annually to maintain your target allocation based on your risk tolerance and investment timeline.\n\nUse your TradeIQ favorites to track your diversified holdings efficiently.`;
    }
  }
  
  // Crypto-specific strategies
  else if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('ethereum')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('beginner')) {
      content = `Beginner crypto strategy should start with dollar-cost averaging into established cryptocurrencies like Bitcoin and Ethereum. Invest only what you can afford to lose completely, as crypto markets are extremely volatile.\n\nStart with 1-5% of your total investment portfolio, use reputable exchanges with strong security, and store significant amounts in hardware wallets. Focus on learning blockchain fundamentals before expanding to altcoins, and never invest based on social media hype or fear of missing out.\n\nSet price alerts to monitor your positions without constantly checking prices.`;
    } else {
      content = `Crypto trading strategies include momentum trading for trending coins with high volume, swing trading to capture multi-day price movements, and long-term holding of fundamentally strong projects.\n\nDiversify across different cryptocurrency categories like store of value (Bitcoin), smart contract platforms (Ethereum), and emerging sectors like DeFi or Layer 2 solutions. The 24/7 nature of crypto markets creates both opportunities and risks, requiring disciplined risk management and clear entry and exit strategies.\n\nUse Chart AI to identify key support and resistance levels for your crypto positions.`;
    }
  }
  
  // Stock-specific strategies
  else if (lowerMessage.includes('stock') || lowerMessage.includes('equity')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('growth')) {
      content = `Growth investing targets companies with above-average earnings growth potential, typically in technology, healthcare, or emerging industries. Look for companies with strong revenue growth, expanding market share, and innovative products or services.\n\nGrowth stocks often trade at higher valuations but can provide superior returns during bull markets. Focus on companies with sustainable competitive advantages, strong management teams, and clear paths to future profitability.\n\nUse Chart AI to time your entries during growth stock pullbacks.`;
    } else if (lowerMessage.includes('value')) {
      content = `Value investing seeks undervalued companies trading below their intrinsic worth, often measured by low price-to-earnings ratios, price-to-book ratios, or high dividend yields.\n\nLook for profitable companies with strong balance sheets, stable cash flows, and temporary challenges that have depressed their stock price. Value stocks often outperform during market downturns and provide dividend income while you wait for price appreciation.\n\nSet alerts on value opportunities to catch them at attractive entry points.`;
    } else {
      content = `Stock investment strategies should align with your investment timeline and risk tolerance. Consider index fund investing for broad market exposure with minimal effort, dividend growth investing for income and inflation protection, or sector rotation based on economic cycles.\n\nSuccessful stock investing requires fundamental analysis, understanding company financials, and maintaining discipline during market volatility. Diversify across sectors and company sizes to reduce single-stock risk.\n\nTrack your positions in TradeIQ favorites and use Chart AI for technical timing.`;
    }
  }
  
  // Strategy questions - general
  else if (lowerMessage.includes('strategy') || lowerMessage.includes('strategies')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('beginner')) {
      content = `Beginner trading strategies should emphasize risk management and education over quick profits. Start with dollar-cost averaging into index funds to learn market behavior, then progress to swing trading with small position sizes.\n\nFocus on trend-following strategies using simple moving averages, and always use stop-losses to limit downside risk. Paper trade new strategies before risking real money, and never risk more than 1-2% of your portfolio on any single trade.\n\nUse TradeIQ's Chart AI to learn pattern recognition before developing your own analysis skills.`;
    } else {
      content = `Effective trading strategies combine technical analysis, fundamental research, and disciplined risk management. Consider momentum trading for trending markets, mean reversion for range-bound conditions, and breakout strategies for volatile periods.\n\nSuccessful traders often use multiple timeframes, maintain detailed trading journals, and adapt their strategies to current market conditions. The key is finding an approach that matches your personality, available time, and risk tolerance while maintaining consistent execution.\n\nLeverage Chart AI for objective technical analysis and set alerts for key levels.`;
    }
  }
  
  // Technical analysis questions
  else if (intent.tradingTopics?.some(topic => ['rsi', 'macd', 'moving average', 'support', 'resistance'].includes(topic))) {
    const topics = intent.tradingTopics.filter(topic => ['rsi', 'macd', 'moving average', 'support', 'resistance'].includes(topic));
    
    if (topics.includes('rsi')) {
      content = `RSI (Relative Strength Index) measures momentum on a 0-100 scale to identify overbought and oversold conditions. Values above 70 suggest potential selling pressure and possible price reversal, while values below 30 indicate potential buying opportunities.\n\nThe most reliable RSI signals occur when combined with trend analysis and divergences between RSI and price action. In strong trending markets, RSI can remain overbought or oversold for extended periods, so use additional confirmation before taking positions.\n\nChart AI can help identify RSI divergences automatically for more accurate signals.`;
    } else if (topics.includes('macd')) {
      content = `MACD (Moving Average Convergence Divergence) tracks trend changes and momentum through the relationship between two exponential moving averages. Bullish signals occur when the MACD line crosses above the signal line, while bearish signals occur when it crosses below.\n\nThe histogram shows momentum strength and potential turning points. MACD works best on longer timeframes and should be combined with price action analysis for confirmation of trend changes.\n\nUse Chart AI to spot MACD crossovers and set alerts for key signal confirmations.`;
    } else if (topics.includes('support') || topics.includes('resistance')) {
      content = `Support and resistance levels represent price zones where buying and selling pressure historically emerge. Support acts as a floor where demand increases, while resistance acts as a ceiling where supply increases.\n\nThese levels become more significant when tested multiple times with high volume. Trading strategies include buying near support for long positions, selling near resistance for short positions, and trading breakouts when price moves decisively beyond these levels with increased volume.\n\nChart AI automatically identifies key support and resistance levels to save you analysis time.`;
    } else {
      content = `Technical analysis combines price patterns, volume analysis, and momentum indicators to make trading decisions. Moving averages help identify trend direction and dynamic support/resistance levels.\n\nSuccessful technical analysis requires understanding that no single indicator is perfect, so combine multiple signals for confirmation. Focus on higher timeframes for trend direction and lower timeframes for precise entry and exit points.\n\nLet Chart AI handle the heavy lifting while you focus on trade execution and risk management.`;
    }
    
    if (activeSymbol) {
      content += `\n\nFor ${activeSymbol}, check Chart AI for current technical signals and consider setting alerts at key levels.`;
    }
  }
  
  // Risk management
  else if (lowerMessage.includes('risk')) {
    content = `Risk management is the foundation of successful trading and involves position sizing, diversification, and emotional discipline. Never risk more than 1-2% of your total portfolio on any single trade, and use stop-losses to limit downside exposure.\n\nDiversify across different assets, sectors, and strategies to reduce correlation risk. Maintain a risk-reward ratio of at least 1:2, meaning you target twice the profit as your potential loss. Most importantly, stick to your risk management rules regardless of market emotions or recent performance.\n\nSet price alerts to automate your risk management and remove emotion from decisions.`;
  }
  
  // Market data context analysis
  if (context?.symbols && marketData && Object.keys(marketData).length > 0) {
    const symbol = context.symbols[0];
    const data = marketData[symbol.symbol];
    
    if (data && !data.error && !data.isLoading) {
      const changePercent = ((data.change / data.price) * 100);
      const trend = data.change >= 0 ? 'bullish' : 'bearish';
      const momentum = Math.abs(changePercent) > 2 ? 'strong' : 'moderate';
      
      content = `${symbol.symbol} is currently trading at $${data.price.toFixed(2)}, showing ${momentum} ${trend} momentum with a ${changePercent.toFixed(2)}% change.\n\nThis ${momentum} movement suggests ${data.change >= 0 ? 'buying interest and potential continuation of upward momentum' : 'selling pressure with possible further downside'}. Key levels to monitor include support around $${(data.price * 0.95).toFixed(2)} and resistance near $${(data.price * 1.05).toFixed(2)}.\n\nConsider the broader market context and volume confirmation before making trading decisions.\n\nUse Chart AI for deeper analysis and set alerts at these key levels to stay informed.`;
      needsRiskDisclaimer = true;
    }
  }
  
  // Default trading response for unclear questions
  else {
    content = `I can provide specific guidance on trading strategies, technical analysis, risk management, and market insights. Whether you're interested in long-term investing, day trading, or technical indicators, I can help you understand the concepts and practical applications.\n\nWhat specific aspect of trading or investing would you like to explore?`;
  }
  
  return {
    content: needsRiskDisclaimer ? `${content}\n\nThis is educational content, not financial advice. Please do your own research before making investment decisions.` : content,
    mode: 'trading',
    confidence: intent.confidence,
    suggestedFollowUps: generateTradingFollowUps(lowerMessage, context, activeSymbol),
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

const generateTradingFollowUps = (message: string, context?: MessageContext, activeSymbol?: string): string[] => {
  const suggestions: string[] = [];
  
  if (activeSymbol) {
    suggestions.push(`${activeSymbol} technical analysis`, `${activeSymbol} support and resistance levels`);
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
