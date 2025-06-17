
export interface IntentAnalysis {
  type: 'trading' | 'product' | 'mixed';
  confidence: number;
  keywords: string[];
  productFeatures?: string[];
  tradingTopics?: string[];
}

export interface ProductFeature {
  name: string;
  keywords: string[];
  description: string;
  location: string;
}

// TradeIQ product features and knowledge base
const PRODUCT_FEATURES: ProductFeature[] = [
  {
    name: 'Chart AI',
    keywords: ['chart ai', 'chart analysis', 'ai chart', 'chart assistant'],
    description: 'AI-powered chart analysis that provides technical insights and pattern recognition',
    location: 'Available in the main dashboard and individual asset pages'
  },
  {
    name: 'Favorites',
    keywords: ['favorite', 'favorites', 'watchlist', 'bookmark'],
    description: 'Save and track your preferred assets for quick access',
    location: 'Star icon next to assets, accessible via Favorites page'
  },
  {
    name: 'Pattern Detection',
    keywords: ['pattern detection', 'patterns', 'chart patterns'],
    description: 'Automatically identifies technical chart patterns like triangles, flags, and breakouts',
    location: 'Available in Chart AI and technical analysis sections'
  },
  {
    name: 'Alerts & Notifications',
    keywords: ['alert', 'notification', 'notify', 'reminder'],
    description: 'Set price alerts and get notified when assets reach target levels',
    location: 'Settings > Notifications or alert icon on asset pages'
  },
  {
    name: 'Pro Upgrade',
    keywords: ['pro', 'upgrade', 'premium', 'subscription', 'plan'],
    description: 'Premium features including advanced analytics, unlimited alerts, and priority support',
    location: 'Settings > Upgrade or upgrade prompts throughout the app'
  },
  {
    name: 'News AI',
    keywords: ['news ai', 'news analysis', 'market news'],
    description: 'AI-powered news analysis and market sentiment tracking',
    location: 'News AI tab in the main navigation'
  },
  {
    name: 'Live Charts',
    keywords: ['live chart', 'real time', 'chart', 'technical analysis'],
    description: 'Real-time price charts with technical indicators and analysis tools',
    location: 'Main dashboard and individual asset pages'
  }
];

// Product-related keywords that indicate user needs app guidance
const PRODUCT_KEYWORDS = [
  'how', 'where', 'use', 'feature', 'navigate', 'find', 'access', 'upgrade',
  'pro', 'subscription', 'alert', 'notification', 'favorite', 'watchlist',
  'chart ai', 'news ai', 'pattern detection', 'app', 'tradeiq', 'interface'
];

// Trading-related keywords
const TRADING_KEYWORDS = [
  'strategy', 'invest', 'buy', 'sell', 'trade', 'analysis', 'technical',
  'fundamental', 'risk', 'portfolio', 'diversification', 'asset allocation',
  'bullish', 'bearish', 'trend', 'support', 'resistance', 'moving average',
  'rsi', 'macd', 'fibonacci', 'candlestick', 'volume', 'momentum'
];

export const analyzeUserIntent = (message: string): IntentAnalysis => {
  const lowerMessage = message.toLowerCase();
  
  // Check for product-related keywords
  const productMatches = PRODUCT_KEYWORDS.filter(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for trading-related keywords
  const tradingMatches = TRADING_KEYWORDS.filter(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for specific product features
  const featureMatches = PRODUCT_FEATURES.filter(feature =>
    feature.keywords.some(keyword => lowerMessage.includes(keyword))
  );
  
  // Determine intent type
  let type: 'trading' | 'product' | 'mixed';
  let confidence: number;
  
  if (productMatches.length > tradingMatches.length || featureMatches.length > 0) {
    type = 'product';
    confidence = Math.min(0.9, (productMatches.length + featureMatches.length * 2) / 5);
  } else if (tradingMatches.length > productMatches.length) {
    type = 'trading';
    confidence = Math.min(0.9, tradingMatches.length / 5);
  } else {
    type = 'mixed';
    confidence = 0.5;
  }
  
  return {
    type,
    confidence,
    keywords: [...productMatches, ...tradingMatches],
    productFeatures: featureMatches.map(f => f.name),
    tradingTopics: tradingMatches
  };
};

export const getProductFeatureInfo = (featureName: string): ProductFeature | undefined => {
  return PRODUCT_FEATURES.find(feature => 
    feature.name.toLowerCase() === featureName.toLowerCase() ||
    feature.keywords.some(keyword => keyword.includes(featureName.toLowerCase()))
  );
};

export const searchProductFeatures = (query: string): ProductFeature[] => {
  const lowerQuery = query.toLowerCase();
  return PRODUCT_FEATURES.filter(feature =>
    feature.name.toLowerCase().includes(lowerQuery) ||
    feature.description.toLowerCase().includes(lowerQuery) ||
    feature.keywords.some(keyword => keyword.includes(lowerQuery))
  );
};
