
export interface DetectedSymbol {
  symbol: string;
  type: 'stock' | 'crypto' | 'forex' | 'index';
  confidence: number;
}

export interface TimeframeInfo {
  timeframe: string;
  type: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M';
  confidence: number;
}

export interface TechnicalRequest {
  type: 'support_resistance' | 'macd' | 'rsi' | 'moving_averages' | 'volume' | 'trend' | 'breakout' | 'pattern';
  confidence: number;
  details?: string;
}

export interface MessageContext {
  symbols: DetectedSymbol[];
  timeframes: TimeframeInfo[];
  technicalRequests: TechnicalRequest[];
  isQuestionAboutTrading: boolean;
}

// Symbol mappings for better detection
const SYMBOL_MAPPINGS: Record<string, DetectedSymbol> = {
  // Stocks
  'apple': { symbol: 'AAPL', type: 'stock', confidence: 0.9 },
  'microsoft': { symbol: 'MSFT', type: 'stock', confidence: 0.9 },
  'google': { symbol: 'GOOGL', type: 'stock', confidence: 0.9 },
  'tesla': { symbol: 'TSLA', type: 'stock', confidence: 0.9 },
  'nvidia': { symbol: 'NVDA', type: 'stock', confidence: 0.9 },
  'amazon': { symbol: 'AMZN', type: 'stock', confidence: 0.9 },
  'meta': { symbol: 'META', type: 'stock', confidence: 0.9 },
  'netflix': { symbol: 'NFLX', type: 'stock', confidence: 0.9 },
  'sp500': { symbol: 'SPX', type: 'index', confidence: 0.9 },
  's&p500': { symbol: 'SPX', type: 'index', confidence: 0.9 },
  'spy': { symbol: 'SPY', type: 'index', confidence: 0.9 },
  'nasdaq': { symbol: 'QQQ', type: 'index', confidence: 0.9 },
  
  // Crypto
  'bitcoin': { symbol: 'BTCUSD', type: 'crypto', confidence: 0.9 },
  'ethereum': { symbol: 'ETHUSD', type: 'crypto', confidence: 0.9 },
  'btc': { symbol: 'BTCUSD', type: 'crypto', confidence: 1.0 },
  'eth': { symbol: 'ETHUSD', type: 'crypto', confidence: 1.0 },
  'ada': { symbol: 'ADAUSD', type: 'crypto', confidence: 1.0 },
  'sol': { symbol: 'SOLUSD', type: 'crypto', confidence: 1.0 },
  'matic': { symbol: 'MATICUSD', type: 'crypto', confidence: 1.0 },
  
  // Forex
  'eurusd': { symbol: 'EURUSD', type: 'forex', confidence: 1.0 },
  'gbpusd': { symbol: 'GBPUSD', type: 'forex', confidence: 1.0 },
  'usdjpy': { symbol: 'USDJPY', type: 'forex', confidence: 1.0 },
  'audusd': { symbol: 'AUDUSD', type: 'forex', confidence: 1.0 },
  'usdcad': { symbol: 'USDCAD', type: 'forex', confidence: 1.0 },
};

// Timeframe patterns
const TIMEFRAME_PATTERNS = [
  { pattern: /\b(\d+)\s*m(?:in)?(?:ute)?s?\b/gi, type: '1m' as const },
  { pattern: /\b(\d+)\s*h(?:our)?s?\b/gi, type: '1h' as const },
  { pattern: /\b(\d+)\s*d(?:ay)?s?\b/gi, type: '1d' as const },
  { pattern: /\b(\d+)\s*w(?:eek)?s?\b/gi, type: '1w' as const },
  { pattern: /\bdaily\b/gi, type: '1d' as const },
  { pattern: /\bweekly\b/gi, type: '1w' as const },
  { pattern: /\bhourly\b/gi, type: '1h' as const },
  { pattern: /\bintraday\b/gi, type: '1h' as const },
];

// Technical analysis patterns
const TECHNICAL_PATTERNS = [
  { pattern: /\b(?:support|resistance|levels?)\b/gi, type: 'support_resistance' as const },
  { pattern: /\bmacd\b/gi, type: 'macd' as const },
  { pattern: /\brsi\b/gi, type: 'rsi' as const },
  { pattern: /\b(?:moving\s*average|ma|sma|ema)\b/gi, type: 'moving_averages' as const },
  { pattern: /\b(?:volume|trading\s*volume)\b/gi, type: 'volume' as const },
  { pattern: /\b(?:trend|trending|direction)\b/gi, type: 'trend' as const },
  { pattern: /\b(?:breakout|break\s*out|breakdown)\b/gi, type: 'breakout' as const },
  { pattern: /\b(?:pattern|chart\s*pattern|flag|triangle|wedge)\b/gi, type: 'pattern' as const },
];

export const detectSymbolsInMessage = (message: string): DetectedSymbol[] => {
  const lowerMessage = message.toLowerCase();
  const symbols: DetectedSymbol[] = [];
  
  // Check for known symbol mappings
  Object.entries(SYMBOL_MAPPINGS).forEach(([key, value]) => {
    if (lowerMessage.includes(key)) {
      symbols.push(value);
    }
  });
  
  // Check for direct ticker symbols (3-5 uppercase letters)
  const tickerPattern = /\b[A-Z]{2,5}\b/g;
  const matches = message.match(tickerPattern);
  
  if (matches) {
    matches.forEach(match => {
      // Skip common words that might match the pattern
      const skipWords = ['USD', 'API', 'AI', 'UI', 'CEO', 'CFO', 'IPO', 'FAQ'];
      if (!skipWords.includes(match) && !symbols.find(s => s.symbol === match)) {
        symbols.push({
          symbol: match,
          type: 'stock',
          confidence: 0.7
        });
      }
    });
  }
  
  return symbols;
};

export const detectTimeframes = (message: string): TimeframeInfo[] => {
  const timeframes: TimeframeInfo[] = [];
  
  TIMEFRAME_PATTERNS.forEach(({ pattern, type }) => {
    const matches = message.match(pattern);
    if (matches) {
      timeframes.push({
        timeframe: matches[0],
        type,
        confidence: 0.9
      });
    }
  });
  
  return timeframes;
};

export const detectTechnicalRequests = (message: string): TechnicalRequest[] => {
  const requests: TechnicalRequest[] = [];
  
  TECHNICAL_PATTERNS.forEach(({ pattern, type }) => {
    const matches = message.match(pattern);
    if (matches) {
      requests.push({
        type,
        confidence: 0.9,
        details: matches[0]
      });
    }
  });
  
  return requests;
};

export const analyzeMessageContext = (message: string): MessageContext => {
  const symbols = detectSymbolsInMessage(message);
  const timeframes = detectTimeframes(message);
  const technicalRequests = detectTechnicalRequests(message);
  
  // Determine if this is a trading-related question
  const tradingKeywords = [
    'price', 'chart', 'analysis', 'buy', 'sell', 'trade', 'market', 'stock',
    'crypto', 'forex', 'technical', 'fundamental', 'bullish', 'bearish',
    'trend', 'support', 'resistance', 'volume', 'indicator'
  ];
  
  const isQuestionAboutTrading = tradingKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  ) || symbols.length > 0 || technicalRequests.length > 0;
  
  return {
    symbols,
    timeframes,
    technicalRequests,
    isQuestionAboutTrading
  };
};
