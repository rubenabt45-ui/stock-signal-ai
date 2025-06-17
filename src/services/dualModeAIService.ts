
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
        content: `${feature.name} is ${feature.description}.\n\nLocation: ${feature.location}\n\nThis feature helps you get more insights and control over your trading experience. Would you like to know more about how to use it effectively?`,
        mode: 'product',
        confidence: intent.confidence,
        suggestedFollowUps: [
          `How do I use ${feature.name}?`,
          'Show me other TradeIQ features',
          'How do I upgrade to Pro?'
        ],
        relatedFeatures: intent.productFeatures
      };
    }
  }
  
  // Handle general product questions
  if (lowerMessage.includes('upgrade') || lowerMessage.includes('pro')) {
    return {
      content: `TradeIQ Pro provides access to:\n\n- Advanced Chart AI with deeper technical analysis\n- Unlimited alerts so you can set as many price alerts as needed\n- Premium indicators and professional trading tools\n- Priority support for faster assistance when you need it\n\nTo upgrade: Navigate to Settings, then Upgrade, or look for upgrade prompts throughout the app.\n\nWould you like to know more about any specific Pro feature?`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'What Chart AI features are in Pro?',
        'How much does Pro cost?',
        'Can I try Pro for free?'
      ]
    };
  }
  
  if (lowerMessage.includes('favorite') || lowerMessage.includes('watchlist')) {
    return {
      content: `Favorites allow you to save and quickly access your preferred assets.\n\nTo add favorites: Tap the star icon next to any asset\nTo view favorites: Use the Favorites tab in navigation\nReal-time updates: Your favorites show live prices and changes\n\nThis helps you stay focused on the assets you care about most without searching every time.`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'How do I organize my favorites?',
        'Can I set alerts on favorites?',
        'What other features help track assets?'
      ]
    };
  }
  
  if (lowerMessage.includes('alert') || lowerMessage.includes('notification')) {
    return {
      content: `Alerts and notifications keep you informed when important price movements happen.\n\nSetting alerts: Use the alert icon on asset pages or Settings, then Notifications\nTypes available: Price targets, percentage changes, volume spikes\nReal-time delivery: Get instant notifications when conditions are met\n\nPro tip: Combine alerts with your favorites for a powerful monitoring system.`,
      mode: 'product',
      confidence: 0.9,
      suggestedFollowUps: [
        'What types of alerts can I set?',
        'How do I manage my alerts?',
        'Do I need Pro for unlimited alerts?'
      ]
    };
  }
  
  // General product help
  const features = searchProductFeatures(userMessage);
  if (features.length > 0) {
    const featureList = features.slice(0, 3).map(f => `${f.name}: ${f.description}`).join('\n');
    return {
      content: `Here are some TradeIQ features that might help:\n\n${featureList}\n\nWould you like to learn more about any of these features?`,
      mode: 'product',
      confidence: intent.confidence,
      suggestedFollowUps: features.slice(0, 3).map(f => `Tell me about ${f.name}`),
      relatedFeatures: features.map(f => f.name)
    };
  }
  
  return {
    content: `I can help you navigate TradeIQ. I can assist with:\n\n- Features such as Chart AI, Pattern Detection, and Alerts\n- Usage guidance including how to favorite assets and set notifications\n- Pro upgrade benefits and premium features\n- Navigation help for finding tools and settings\n\nWhat would you like to know about?`,
    mode: 'product',
    confidence: 0.7,
    suggestedFollowUps: [
      'What is Chart AI?',
      'How do I upgrade to Pro?',
      'Show me how to set alerts'
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
  
  // Risk and strategy questions
  if (lowerMessage.includes('strategy') || lowerMessage.includes('invest')) {
    needsRiskDisclaimer = true;
    
    if (lowerMessage.includes('crypto')) {
      content = `Crypto Trading Strategies:\n\nFor beginners: Dollar-cost averaging (DCA) into major coins like BTC and ETH\nActive trading: Use technical analysis with shorter timeframes (1h-4h)\nRisk management: Never invest more than you can afford to lose\nLong-term approach: HODL strategy for major cryptocurrencies\n\nKey consideration: Crypto is highly volatile, so start small and learn gradually.`;
    } else if (lowerMessage.includes('stock')) {
      content = `Stock Investment Strategies:\n\nGrowth investing: Focus on companies with strong earnings growth\nValue investing: Look for undervalued companies with strong fundamentals\nIndex investing: Diversify with ETFs like SPY and QQQ\nSwing trading: Hold positions for days to weeks based on technical analysis\n\nRemember: Diversification and time in market typically beat timing the market.`;
    } else {
      content = `General Investment Strategies:\n\nLow risk: Index funds, blue-chip stocks, government bonds\nMedium risk: Growth stocks, sector ETFs, dividend stocks\nHigh risk: Small-cap stocks, crypto, options trading\n\nPortfolio allocation considerations:\n- Age-based approach: (100 - your age) percent in stocks\n- Three-fund portfolio: Total market, international, bonds\n- Emergency fund first: 3-6 months expenses`;
    }
  }
  
  // Technical analysis questions
  else if (intent.tradingTopics?.some(topic => ['rsi', 'macd', 'moving average', 'support', 'resistance'].includes(topic))) {
    const topics = intent.tradingTopics.filter(topic => ['rsi', 'macd', 'moving average', 'support', 'resistance'].includes(topic));
    
    if (topics.includes('rsi')) {
      content = `RSI (Relative Strength Index):\n\nRange: 0-100 scale measuring momentum\nOverbought: Above 70 (potential sell signal)\nOversold: Below 30 (potential buy signal)\nNeutral: 30-70 range\n\nTrading consideration: Use with other indicators, works best in ranging markets.`;
    } else if (topics.includes('macd')) {
      content = `MACD (Moving Average Convergence Divergence):\n\nSignal: When MACD line crosses above signal line (bullish)\nWarning: When MACD line crosses below signal line (bearish)\nHistogram: Shows momentum strength\nBest use: Trend following and momentum confirmation`;
    } else {
      content = `Technical Analysis Basics:\n\nSupport: Price level where buying pressure emerges\nResistance: Price level where selling pressure appears\nMoving averages: Smooth price trends (20, 50, 200 day common)\nVolume: Confirms price movements\n\nKey principle: Combine multiple indicators for better signals.`;
    }
  }
  
  // Market data context
  else if (context?.symbols && marketData && Object.keys(marketData).length > 0) {
    const symbol = context.symbols[0];
    const data = marketData[symbol.symbol];
    
    if (data && !data.error && !data.isLoading) {
      const changePercent = ((data.change / data.price) * 100);
      const trend = data.change >= 0 ? 'bullish' : 'bearish';
      
      content = `${symbol.symbol} Analysis:\n\nCurrent price: $${data.price.toFixed(2)}\nChange: ${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)} (${changePercent.toFixed(2)}%)\nTrend: ${trend.charAt(0).toUpperCase() + trend.slice(1)}\n\nTechnical outlook: The ${Math.abs(changePercent) > 2 ? 'strong' : 'moderate'} ${trend} momentum suggests ${data.change >= 0 ? 'buying interest' : 'selling pressure'}. Watch key support and resistance levels for confirmation.`;
      needsRiskDisclaimer = true;
    }
  }
  
  // Default trading response
  else {
    content = `Trading and Investment Guidance:\n\nI can assist with:\n- Analysis including technical indicators, chart patterns, and market trends\n- Strategies with risk-appropriate approaches for different goals\n- Risk management including position sizing, stop losses, and diversification\n- Asset classes such as stocks, crypto, forex, and commodities\n\nWhat would you like to explore?`;
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
  return {
    content: `I can help you with both trading insights and TradeIQ features.\n\nFor trading: Ask about strategies, technical analysis, or specific assets\nFor TradeIQ: Ask about features like Chart AI, alerts, or navigation\n\nBased on your question, would you like me to focus on trading analysis or app guidance?`,
    mode: 'mixed',
    confidence: intent.confidence,
    suggestedFollowUps: [
      'Show me trading strategies',
      'How do I use Chart AI?',
      'Analyze current market trends'
    ]
  };
};

const generateDefaultResponse = (userMessage: string): DualModeAIResponse => {
  return {
    content: `I am your TradeIQ Assistant. I can help with:\n\n- Trading and investing including strategies, analysis, and risk management\n- TradeIQ features such as Chart AI, alerts, favorites, and navigation\n\nWhat would you like to explore?`,
    mode: 'mixed',
    confidence: 0.5,
    suggestedFollowUps: [
      'What are good crypto strategies?',
      'How do I set price alerts?',
      'Explain technical indicators'
    ]
  };
};

const generateTradingFollowUps = (message: string, context?: MessageContext): string[] => {
  const suggestions: string[] = [];
  
  if (context?.symbols && context.symbols.length > 0) {
    const symbol = context.symbols[0].symbol;
    suggestions.push(`${symbol} technical analysis`, `${symbol} price prediction`);
  }
  
  if (message.includes('strategy')) {
    suggestions.push('Risk management tips', 'Portfolio diversification');
  }
  
  if (message.includes('crypto')) {
    suggestions.push('Best crypto for beginners', 'DeFi investment strategies');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Market outlook today', 'Technical indicators guide', 'Investment strategies');
  }
  
  return suggestions.slice(0, 3);
};
