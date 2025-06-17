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
  'chart ai', 'news ai', 'pattern detection', 'app', 'tradeiq', 'interface',
  'setting', 'settings', 'enable', 'disable', 'configure'
];

// Trading-related keywords with higher weights for strategy/education terms
const TRADING_KEYWORDS = [
  // Strategy keywords (high confidence)
  'strategy', 'strategies', 'invest', 'investing', 'investment', 'trade', 'trading',
  'buy', 'sell', 'portfolio', 'allocation', 'diversification', 'risk management',
  
  // Technical analysis (high confidence)
  'technical', 'analysis', 'indicator', 'indicators', 'rsi', 'macd', 'moving average',
  'support', 'resistance', 'trend', 'breakout', 'pattern', 'fibonacci',
  'candlestick', 'volume', 'momentum', 'oscillator',
  
  // Market concepts (medium confidence)
  'bullish', 'bearish', 'volatile', 'volatility', 'market', 'price', 'asset',
  'stock', 'crypto', 'bitcoin', 'ethereum', 'forex', 'currency',
  
  // Educational terms (medium confidence)
  'learn', 'explain', 'understand', 'concept', 'basics', 'beginner'
];

// High-confidence trading keywords that strongly indicate trading intent
const HIGH_CONFIDENCE_TRADING = [
  'strategy', 'strategies', 'invest', 'investing', 'rsi', 'macd', 'support', 'resistance',
  'portfolio', 'allocation', 'risk management', 'technical analysis'
];

// High-confidence product keywords that strongly indicate product intent
const HIGH_CONFIDENCE_PRODUCT = [
  'chart ai', 'how to use', 'where to find', 'upgrade', 'pro', 'alert', 'notification',
  'favorite', 'watchlist', 'feature', 'navigate'
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
  
  // Check for high-confidence signals
  const highConfidenceTrading = HIGH_CONFIDENCE_TRADING.filter(keyword =>
    lowerMessage.includes(keyword)
  );
  
  const highConfidenceProduct = HIGH_CONFIDENCE_PRODUCT.filter(keyword =>
    lowerMessage.includes(keyword)
  );
  
  // Check for specific product features
  const featureMatches = PRODUCT_FEATURES.filter(feature =>
    feature.keywords.some(keyword => lowerMessage.includes(keyword))
  );
  
  // Determine intent type with improved confidence scoring
  let type: 'trading' | 'product' | 'mixed';
  let confidence: number;
  
  // High confidence product intent
  if (highConfidenceProduct.length > 0 || featureMatches.length > 0) {
    type = 'product';
    confidence = Math.min(0.95, 0.7 + (highConfidenceProduct.length + featureMatches.length) * 0.1);
  }
  // High confidence trading intent
  else if (highConfidenceTrading.length > 0) {
    type = 'trading';
    confidence = Math.min(0.95, 0.7 + highConfidenceTrading.length * 0.1);
  }
  // Medium confidence based on keyword counts
  else if (productMatches.length > tradingMatches.length * 1.5) {
    type = 'product';
    confidence = Math.min(0.8, 0.5 + productMatches.length * 0.05);
  }
  else if (tradingMatches.length > productMatches.length * 1.5) {
    type = 'trading';
    confidence = Math.min(0.8, 0.5 + tradingMatches.length * 0.05);
  }
  // Mixed or low confidence
  else if (tradingMatches.length > 0 || productMatches.length > 0) {
    type = 'mixed';
    confidence = Math.min(0.6, 0.4 + (tradingMatches.length + productMatches.length) * 0.03);
  }
  // Very low confidence
  else {
    type = 'mixed';
    confidence = 0.3;
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
