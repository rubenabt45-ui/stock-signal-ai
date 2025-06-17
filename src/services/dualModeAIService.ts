
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
  
  // Route to appropriate response generator
  switch (intentAnalysis.type) {
    case 'product':
      return generateProductResponse(userMessage, intentAnalysis);
    case 'trading':
      return generateTradingResponse(userMessage, intentAnalysis, context, marketData);
    case 'mixed':
      return generateMixedResponse(userMessage, intentAnalysis, context, marketData);
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
        content: `${feature.name} is ${feature.description}.\n\nLocation: ${feature.location}\n\nThis feature helps you get more insights and control over your trading experience. To access it, look for the relevant option in your main dashboard or navigate to the specified location.`,
        mode: 'product',
        confidence: intent.confidence,
        suggestedFollowUps: [
          `How do I use ${feature.name} effectively?`,
          'Show me other key TradeIQ features',
          'What are the benefits of upgrading to Pro?'
        ],
        relatedFeatures: intent.productFeatures
      };
    }
  }
  
  // Handle upgrade questions
  if (lowerMessage.includes('upgrade') || lowerMessage.includes('pro')) {
    return {
      content: `TradeIQ Pro provides access to advanced trading tools:\n\nAdvanced Chart AI with deeper technical analysis and pattern recognition\nUnlimited alerts so you can monitor as many price points as needed\nPremium indicators including advanced technical analysis tools\nPriority support for faster assistance\n\nTo upgrade: Navigate to Settings, then select Upgrade, or look for upgrade prompts throughout the app.\n\nPro users also get enhanced news analysis and market insights.`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'What specific Chart AI features are in Pro?',
        'How much does the Pro plan cost?',
        'Can I try Pro features before upgrading?'
      ]
    };
  }
  
  // Handle favorites/watchlist questions
  if (lowerMessage.includes('favorite') || lowerMessage.includes('watchlist')) {
    return {
      content: `Favorites allow you to save and quickly access your preferred assets for faster monitoring.\n\nTo add favorites: Tap the star icon next to any asset in search results or asset pages\nTo view favorites: Access the Favorites tab in your main navigation\nReal-time updates: Your favorites display live prices and percentage changes\n\nThis streamlines your workflow by keeping important assets easily accessible without repeated searching.`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'How can I organize my favorites list?',
        'Can I set price alerts on my favorites?',
        'What other tools help track multiple assets?'
      ]
    };
  }
  
  // Handle alerts and notifications
  if (lowerMessage.includes('alert') || lowerMessage.includes('notification')) {
    return {
      content: `Alerts and notifications keep you informed of important price movements without constant monitoring.\n\nSetting alerts: Use the alert icon on individual asset pages or navigate to Settings, then Notifications\nAlert types: Price targets, percentage changes, volume spikes, and technical indicator signals\nDelivery: Instant push notifications when your specified conditions are met\n\nPro tip: Set multiple alerts on the same asset to track different price levels and market scenarios.`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'What types of technical alerts can I create?',
        'How do I manage and edit existing alerts?',
        'Do I need Pro for unlimited alert creation?'
      ]
    };
  }
  
  // Handle Chart AI questions
  if (lowerMessage.includes('chart ai')) {
    return {
      content: `Chart AI provides automated technical analysis and pattern recognition for any asset you are viewing.\n\nCore features: Identifies support and resistance levels, trend analysis, and chart patterns\nUsage: Available on individual asset pages and integrated into the main dashboard\nInsights: Provides actionable recommendations based on current market conditions\n\nPro version includes advanced pattern detection, deeper historical analysis, and enhanced prediction capabilities.`,
      mode: 'product',
      confidence: 0.95,
      suggestedFollowUps: [
        'What patterns can Chart AI detect?',
        'How accurate are Chart AI predictions?',
        'What additional features come with Pro Chart AI?'
      ]
    };
  }
  
  // General product help with feature search
  const features = searchProductFeatures(userMessage);
  if (features.length > 0) {
    const primaryFeature = features[0];
    const additionalFeatures = features.slice(1, 3);
    
    let content = `${primaryFeature.name}: ${primaryFeature.description}\nLocation: ${primaryFeature.location}`;
    
    if (additionalFeatures.length > 0) {
      content += `\n\nRelated features:\n${additionalFeatures.map(f => `${f.name}: ${f.description}`).join('\n')}`;
    }
    
    return {
      content,
      mode: 'product',
      confidence: intent.confidence,
      suggestedFollowUps: [
        `How do I get started with ${primaryFeature.name}?`,
        'Show me advanced TradeIQ features',
        'What Pro features would benefit my trading?'
      ],
      relatedFeatures: features.map(f => f.name)
    };
  }
  
  // Fallback for unclear product questions
  return {
    content: `I can help you navigate TradeIQ features and functionality.\n\nCore features: Chart AI for technical analysis, Favorites for asset tracking, Alerts for price monitoring\nUpgrade options: Pro plan with advanced analytics and unlimited alerts\nNavigation: Most features are accessible from the main dashboard or individual asset pages\n\nCould you specify which feature or task you need help with?`,
    mode: 'product',
    confidence: 0.7,
    suggestedFollowUps: [
      'Explain Chart AI capabilities',
      'How do I upgrade to Pro?',
      'Help me set up price alerts'
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
  
  // Crypto strategy questions
  if (lowerMessage.includes('crypto') && (lowerMessage.includes('strategy') || lowerMessage.includes('invest'))) {
    needsRiskDisclaimer = true;
    content = `Three common crypto trading strategies:\n\nDollar-cost averaging: Regular purchases regardless of price to reduce volatility impact\nMomentum trading: Focus on coins with strong upward price trends and high volume\nLong-term holding: Research-based investments in established projects like Bitcoin and Ethereum\n\nRisk management: Start with small positions, never invest more than you can afford to lose, and diversify across multiple assets.\n\nCrypto markets operate 24/7 with high volatility, making both opportunities and risks greater than traditional markets.`;
  }
  
  // Stock strategy questions
  else if (lowerMessage.includes('stock') && (lowerMessage.includes('strategy') || lowerMessage.includes('invest'))) {
    needsRiskDisclaimer = true;
    content = `Four stock investment approaches:\n\nGrowth investing: Focus on companies with strong earnings growth potential\nValue investing: Look for undervalued companies trading below intrinsic value\nDividend investing: Target companies with consistent dividend payments for income\nIndex investing: Diversify through ETFs like SPY, QQQ for broad market exposure\n\nTime horizon matters: Longer-term investments typically reduce volatility risk, while shorter-term trading requires more active management and technical analysis.`;
  }
  
  // General strategy questions
  else if (lowerMessage.includes('strategy') || lowerMessage.includes('invest')) {
    needsRiskDisclaimer = true;
    content = `Investment strategy framework by risk level:\n\nLow risk: Index funds, blue-chip stocks, government bonds for steady growth\nMedium risk: Growth stocks, sector ETFs, dividend aristocrats for balanced returns\nHigh risk: Small-cap stocks, crypto, options trading for potential higher returns\n\nPortfolio allocation guideline: Consider age-based approach where stock percentage equals 100 minus your age, with remainder in bonds and cash.\n\nAlways maintain an emergency fund covering 3-6 months of expenses before investing.`;
  }
  
  // Technical analysis questions
  else if (intent.tradingTopics?.some(topic => ['rsi', 'macd', 'moving average', 'support', 'resistance'].includes(topic))) {
    const topics = intent.tradingTopics.filter(topic => ['rsi', 'macd', 'moving average', 'support', 'resistance'].includes(topic));
    
    if (topics.includes('rsi')) {
      content = `RSI (Relative Strength Index) measures momentum on a 0-100 scale:\n\nOverbought: Above 70 suggests potential selling pressure ahead\nOversold: Below 30 indicates possible buying opportunity\nNeutral zone: 30-70 range shows balanced momentum\n\nTrading application: Use RSI divergences with price action for stronger signals. In strong trends, RSI can remain overbought or oversold for extended periods.`;
    } else if (topics.includes('macd')) {
      content = `MACD (Moving Average Convergence Divergence) tracks trend changes:\n\nBullish signal: MACD line crosses above signal line, indicating upward momentum\nBearish signal: MACD line crosses below signal line, suggesting downward momentum\nHistogram: Shows momentum strength and potential trend changes\n\nBest application: Combine with trend analysis and use on higher timeframes for more reliable signals.`;
    } else if (topics.includes('support') || topics.includes('resistance')) {
      content = `Support and resistance are key price levels for trading decisions:\n\nSupport: Price level where buying interest typically emerges, acting as a floor\nResistance: Price level where selling pressure appears, acting as a ceiling\nBreakouts: When price moves beyond these levels with volume, new trends often begin\n\nTrading approach: Look for bounces at support for long entries, or resistance for short entries. Confirmed breakouts often lead to strong moves.`;
    } else {
      content = `Technical analysis combines multiple indicators for better trading decisions:\n\nMoving averages: Smooth price trends and identify direction\nVolume: Confirms price movements and breakouts\nMomentum indicators: RSI and MACD show overbought/oversold conditions\n\nKey principle: No single indicator is perfect. Combine multiple signals and always consider overall market context.`;
    }
  }
  
  // Market data context analysis
  else if (context?.symbols && marketData && Object.keys(marketData).length > 0) {
    const symbol = context.symbols[0];
    const data = marketData[symbol.symbol];
    
    if (data && !data.error && !data.isLoading) {
      const changePercent = ((data.change / data.price) * 100);
      const trend = data.change >= 0 ? 'bullish' : 'bearish';
      const momentum = Math.abs(changePercent) > 2 ? 'strong' : 'moderate';
      
      content = `${symbol.symbol} current analysis:\n\nPrice: $${data.price.toFixed(2)}\nChange: ${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)} (${changePercent.toFixed(2)}%)\nMomentum: ${momentum} ${trend} movement\n\nTechnical outlook: The ${momentum} ${trend} momentum suggests ${data.change >= 0 ? 'buying interest and potential upward continuation' : 'selling pressure with possible further decline'}.\n\nKey levels to watch: Support around ${(data.price * 0.95).toFixed(2)}, resistance near ${(data.price * 1.05).toFixed(2)}.`;
      needsRiskDisclaimer = true;
    }
  }
  
  // Risk management questions
  else if (lowerMessage.includes('risk')) {
    content = `Essential risk management principles:\n\nPosition sizing: Never risk more than 1-2% of portfolio on single trade\nStop losses: Set predetermined exit points to limit downside\nDiversification: Spread risk across different assets and sectors\nRisk-reward ratio: Target at least 1:2 ratio (risk $1 to potentially gain $2)\n\nEmotional discipline: Stick to your plan regardless of fear or greed. Most trading losses come from abandoning risk management during volatile periods.`;
  }
  
  // Default trading response for unclear questions
  else {
    content = `I can provide guidance on trading and investment topics:\n\nStrategy development: Risk-appropriate approaches for different goals and timeframes\nTechnical analysis: Chart patterns, indicators, and market timing\nRisk management: Position sizing, diversification, and loss prevention\nAsset classes: Stocks, crypto, forex, and commodities analysis\n\nWhat specific trading topic would you like to explore?`;
  }
  
  return {
    content,
    mode: 'trading',
    confidence: intent.confidence,
    suggestedFollowUps: generateTradingFollowUps(lowerMessage, context),
    riskDisclaimer: needsRiskDisclaimer
  };
};

const generateMixedResponse = (
  userMessage: string, 
  intent: IntentAnalysis, 
  context?: MessageContext, 
  marketData?: Record<string, UseMarketDataReturn>
): DualModeAIResponse => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Try to infer primary intent from context
  if (lowerMessage.includes('how') || lowerMessage.includes('where') || lowerMessage.includes('use')) {
    return {
      content: `Could you clarify if you're asking about trading strategies or how to use a specific feature in the TradeIQ app?\n\nFor trading: I can explain strategies, technical analysis, or market insights\nFor app features: I can guide you through Chart AI, alerts, favorites, or navigation`,
      mode: 'mixed',
      confidence: intent.confidence,
      suggestedFollowUps: [
        'Explain crypto trading strategies',
        'How do I use Chart AI?',
        'Show me technical analysis basics'
      ]
    };
  }
  
  return {
    content: `I can assist with both trading knowledge and TradeIQ app guidance.\n\nTrading topics: Investment strategies, technical analysis, risk management, and market insights\nApp features: Chart AI usage, setting up alerts, managing favorites, and navigation help\n\nWhat would you like to focus on?`,
    mode: 'mixed',
    confidence: intent.confidence,
    suggestedFollowUps: [
      'Best trading strategies for beginners',
      'How do I set up price alerts?',
      'Explain RSI and MACD indicators'
    ]
  };
};

const generateDefaultResponse = (userMessage: string): DualModeAIResponse => {
  return {
    content: `I am your TradeIQ Assistant, ready to help with trading knowledge and app guidance.\n\nTrading assistance: Strategies, technical analysis, risk management, and market insights\nApp guidance: Chart AI, alerts, favorites, navigation, and Pro features\n\nWhat would you like to learn about?`,
    mode: 'mixed',
    confidence: 0.5,
    suggestedFollowUps: [
      'What are effective crypto strategies?',
      'How do I set price alerts?',
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
