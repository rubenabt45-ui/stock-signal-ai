
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
  // Simulate GPT-4-like intelligent responses for trading questions
  static async answerTradingQuestion(question: string): Promise<string> {
    const lowerQuestion = question.toLowerCase();
    
    // RSI Questions
    if (lowerQuestion.includes('rsi') || lowerQuestion.includes('relative strength')) {
      if (lowerQuestion.includes('sideways') || lowerQuestion.includes('ranging')) {
        return `**RSI in Sideways Markets:**

In ranging markets, RSI is extremely effective:

• **Overbought (70+)**: Look for short entries near resistance
• **Oversold (30-)**: Look for long entries near support
• **Divergence**: Watch for price/RSI divergence at range extremes

**Strategy**: Buy RSI oversold bounces off support, sell RSI overbought rejections at resistance. Works best in clear horizontal ranges.

**Tip**: Use 14-period RSI with 30/70 levels in sideways markets rather than trending market levels.`;
      }
      
      return `**RSI (Relative Strength Index) Explained:**

RSI measures momentum on a 0-100 scale:

• **Above 70**: Potentially overbought (consider selling)
• **Below 30**: Potentially oversold (consider buying)
• **50 Line**: Momentum shift level

**Best Uses:**
- Divergence signals (price vs RSI direction)
- Overbought/oversold in ranging markets
- Momentum confirmation in trending markets

**Settings**: 14-period is standard, but 21 for less noise or 9 for more sensitivity.`;
    }
    
    // Stop Loss Questions
    if (lowerQuestion.includes('stop loss') || lowerQuestion.includes('stop-loss') || lowerQuestion.includes('sl')) {
      return `**Effective Stop Loss Strategies:**

**1. Technical Levels**
• Below support for longs, above resistance for shorts
• Beyond recent swing high/low
• Outside chart patterns (triangles, flags)

**2. ATR-Based Stops**
• 1.5-2x ATR below entry for swing trades
• 0.5-1x ATR for day trades

**3. Risk-Based Stops**
• Never risk more than 1-2% of account
• Position size = Risk Amount ÷ Stop Distance

**Golden Rule**: Set your stop BEFORE entering the trade, not after it moves against you.`;
    }
    
    // Breakout Questions
    if (lowerQuestion.includes('breakout') || lowerQuestion.includes('break out')) {
      return `**Breakout Entry Strategies:**

**1. Classic Breakout**
• Enter on close above resistance with volume
• Stop below the breakout level
• Target: Height of pattern added to breakout point

**2. Pullback Entry**
• Wait for price to retest breakout level as support
• Enter on bounce with confirmation candle
• Lower risk, higher probability

**3. Volume Confirmation**
• Breakouts need 2x average volume
• Without volume = likely false breakout

**Best Timeframes**: 4H-Daily for reliability, 1H for active trading.`;
    }
    
    // Timeframe Questions
    if (lowerQuestion.includes('timeframe') || lowerQuestion.includes('time frame')) {
      return `**Choosing Trading Timeframes:**

**Day Trading**: 1M-15M charts
• Fast execution, high frequency
• Requires full attention
• Higher stress, smaller profits per trade

**Swing Trading**: 1H-Daily charts
• Hold 2-10 days
• Less screen time needed
• Better risk/reward ratios

**Position Trading**: Daily-Weekly charts
• Hold weeks to months
• Fundamental analysis important
• Less frequent trading

**Rule**: Use higher timeframe for bias, lower for entry timing.`;
    }
    
    // Support and Resistance
    if (lowerQuestion.includes('support') || lowerQuestion.includes('resistance')) {
      return `**Support & Resistance Levels:**

**Identification:**
• Previous swing highs/lows
• Round numbers (psychological levels)
• Moving averages (50, 200 EMA)
• Volume profile levels

**Trading Rules:**
• Buy near support, sell near resistance
• Wait for confirmation (bounce/rejection)
• Break above resistance = new support
• Break below support = new resistance

**Strength Factors:**
• More touches = stronger level
• Higher timeframe = more significant
• High volume at level = more reliable`;
    }
    
    // Moving Averages
    if (lowerQuestion.includes('moving average') || lowerQuestion.includes('ma') || lowerQuestion.includes('ema')) {
      return `**Moving Averages Guide:**

**Popular Settings:**
• 20 EMA: Short-term trend
• 50 EMA: Medium-term trend  
• 200 EMA: Long-term trend/major support-resistance

**Trading Strategies:**
• Golden Cross: 50 MA above 200 MA (bullish)
• Death Cross: 50 MA below 200 MA (bearish)
• Price above/below MA = trend direction

**EMA vs SMA:**
• EMA: More responsive, better for entries
• SMA: Smoother, better for overall trend

**Entry**: Buy when price bounces off rising MA with volume.`;
    }
    
    // MACD Questions
    if (lowerQuestion.includes('macd')) {
      return `**MACD (Moving Average Convergence Divergence):**

**Components:**
• MACD Line: 12 EMA - 26 EMA
• Signal Line: 9 EMA of MACD line
• Histogram: MACD - Signal line

**Signals:**
• MACD above signal = bullish momentum
• MACD below signal = bearish momentum
• Zero line cross = trend change
• Divergence = momentum shift

**Best Use**: Trend confirmation and momentum analysis. Works poorly in choppy, sideways markets.`;
    }
    
    // Position Sizing
    if (lowerQuestion.includes('position size') || lowerQuestion.includes('position sizing')) {
      return `**Position Sizing Formula:**

**Risk-Based Sizing:**
Position Size = Account Risk $ ÷ (Entry Price - Stop Loss)

**Example:**
• Account: $10,000
• Risk per trade: 2% = $200
• Entry: $100, Stop: $95
• Position Size = $200 ÷ $5 = 40 shares

**Kelly Criterion:**
f = (bp - q) / b
f = fraction to risk
b = odds received
p = probability of winning
q = probability of losing

**Rule**: Never risk more than 2% per trade, 6% total portfolio.`;
    }
    
    // Default fallback for other trading questions
    return `**Trading Insight:**

Your question touches on an important trading concept. Here are key principles:

• **Risk Management**: Always define your risk before entering
• **Market Analysis**: Combine technical and fundamental analysis  
• **Psychology**: Stick to your trading plan and manage emotions
• **Continuous Learning**: Markets evolve, keep studying

For specific strategies, consider uploading a chart screenshot for personalized analysis, or ask about particular indicators, patterns, or market conditions.

**Popular Topics**: RSI, MACD, Support/Resistance, Breakouts, Stop Losses, Position Sizing`;
  }
  
  // Enhanced chart analysis with more realistic pattern detection
  static analyzeChartPatterns(userMessage: string): {
    pattern: string;
    entry: string;
    stopLoss: string;
    takeProfit: string[];
    timeframe: string;
    analysis: string;
  } {
    const isSwing = userMessage.toLowerCase().includes('swing');
    const isScalping = userMessage.toLowerCase().includes('scalp');
    const isDay = userMessage.toLowerCase().includes('day');
    
    const patterns = [
      {
        pattern: "Bullish Flag Breakout",
        entry: "$2,847.30 - $2,852.60",
        stopLoss: "$2,815.40", 
        takeProfit: ["$2,915.80", "$2,978.20"],
        timeframe: isScalping ? "5M - 15M" : isSwing ? "4H - 1D" : "1H - 4H",
        analysis: "Strong bullish flag pattern with volume confirmation. RSI showing momentum build-up and price breaking above descending trendline resistance."
      },
      {
        pattern: "Double Bottom Reversal", 
        entry: "$157.20 - $158.90",
        stopLoss: "$154.30",
        takeProfit: ["$164.50", "$169.80"],
        timeframe: isScalping ? "15M - 30M" : isSwing ? "Daily - Weekly" : "4H - Daily",
        analysis: "Classic double bottom formation completed with neckline break. Volume spike confirms reversal pattern with 200 EMA acting as dynamic support."
      },
      {
        pattern: "Ascending Triangle",
        entry: "$0.6735 - $0.6755", 
        stopLoss: "$0.6685",
        takeProfit: ["$0.6845", "$0.6920"],
        timeframe: isScalping ? "5M - 15M" : isSwing ? "4H - 1D" : "1H - 4H",
        analysis: "Ascending triangle breakout with increasing volume. Multiple touches on resistance show accumulation. MACD showing bullish divergence."
      },
      {
        pattern: "Cup & Handle",
        entry: "$43,180 - $43,450",
        stopLoss: "$42,250", 
        takeProfit: ["$45,200", "$47,100"],
        timeframe: isScalping ? "15M - 1H" : isSwing ? "Daily - Weekly" : "4H - Daily",
        analysis: "Cup and handle pattern completion with handle forming above 50% retracement. Strong institutional buying evident from volume profile."
      },
      {
        pattern: "Falling Wedge Reversal",
        entry: "$184.60 - $186.20",
        stopLoss: "$181.90",
        takeProfit: ["$192.40", "$197.80"], 
        timeframe: isScalping ? "15M - 30M" : isSwing ? "4H - 1D" : "1H - 4H",
        analysis: "Falling wedge pattern showing bullish divergence on RSI. Decreasing volume on decline indicates selling exhaustion. Breakout imminent."
      }
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
}
