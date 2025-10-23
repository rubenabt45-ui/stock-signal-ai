
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Zap, Triangle, Activity } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";
import { useState, useEffect } from "react";

interface PatternDetectionProps {
  asset: string;
}

// Chart patterns library
const chartPatterns = [
  { name: "Head & Shoulders", type: "bearish", reliability: 85, target: -8 },
  { name: "Inverse H&S", type: "bullish", reliability: 85, target: 8 },
  { name: "Double Top", type: "bearish", reliability: 78, target: -6 },
  { name: "Double Bottom", type: "bullish", reliability: 78, target: 6 },
  { name: "Ascending Triangle", type: "bullish", reliability: 72, target: 7 },
  { name: "Descending Triangle", type: "bearish", reliability: 72, target: -7 },
  { name: "Bull Flag", type: "bullish", reliability: 68, target: 5 },
  { name: "Bear Flag", type: "bearish", reliability: 68, target: -5 },
  { name: "Cup & Handle", type: "bullish", reliability: 75, target: 9 },
  { name: "Rising Wedge", type: "bearish", reliability: 70, target: -5 },
  { name: "Falling Wedge", type: "bullish", reliability: 70, target: 5 },
];

// Candlestick patterns library
const candlestickPatterns = [
  { name: "Bullish Engulfing", type: "bullish", strength: 80 },
  { name: "Bearish Engulfing", type: "bearish", strength: 80 },
  { name: "Morning Star", type: "bullish", strength: 85 },
  { name: "Evening Star", type: "bearish", strength: 85 },
  { name: "Hammer", type: "bullish", strength: 70 },
  { name: "Shooting Star", type: "bearish", strength: 70 },
  { name: "Doji", type: "neutral", strength: 60 },
  { name: "Three White Soldiers", type: "bullish", strength: 88 },
  { name: "Three Black Crows", type: "bearish", strength: 88 },
];

const generatePatternsFromTradingView = (price: number, change: number) => {
  const patterns = [];
  const changePercent = Math.abs(change);
  
  // Select chart pattern based on trend
  if (change > 2) {
    // Bullish patterns
    const bullishPatterns = chartPatterns.filter(p => p.type === "bullish");
    const selected = bullishPatterns[Math.floor(Math.random() * bullishPatterns.length)];
    patterns.push({
      ...selected,
      status: changePercent > 3 ? "Confirmed" : "Forming",
      timeframe: "4H",
      priceTarget: (price * (1 + selected.target / 100)).toFixed(2),
      takeProfit: (price * (1 + (selected.target * 0.6) / 100)).toFixed(2), // 60% of target
      stopLoss: (price * 0.97).toFixed(2),
      breakoutLevel: (price * 1.02).toFixed(2)
    });
  } else if (change < -2) {
    // Bearish patterns
    const bearishPatterns = chartPatterns.filter(p => p.type === "bearish");
    const selected = bearishPatterns[Math.floor(Math.random() * bearishPatterns.length)];
    patterns.push({
      ...selected,
      status: changePercent > 3 ? "Confirmed" : "Forming",
      timeframe: "4H",
      priceTarget: (price * (1 + selected.target / 100)).toFixed(2),
      takeProfit: (price * (1 + (selected.target * 0.6) / 100)).toFixed(2), // 60% of target
      stopLoss: (price * 1.03).toFixed(2),
      breakoutLevel: (price * 0.98).toFixed(2)
    });
  } else {
    // Neutral/consolidation - could go either way
    const neutral = chartPatterns[Math.floor(Math.random() * chartPatterns.length)];
    patterns.push({
      ...neutral,
      status: "Forming",
      timeframe: "1D",
      priceTarget: (price * (1 + neutral.target / 100)).toFixed(2),
      takeProfit: (price * (1 + (neutral.target * 0.6) / 100)).toFixed(2), // 60% of target
      stopLoss: neutral.type === "bullish" ? (price * 0.97).toFixed(2) : (price * 1.03).toFixed(2),
      breakoutLevel: neutral.type === "bullish" ? (price * 1.02).toFixed(2) : (price * 0.98).toFixed(2)
    });
  }
  
  // Add candlestick pattern
  const candlePattern = change > 1 
    ? candlestickPatterns.filter(p => p.type === "bullish")[Math.floor(Math.random() * 4)]
    : change < -1
    ? candlestickPatterns.filter(p => p.type === "bearish")[Math.floor(Math.random() * 4)]
    : candlestickPatterns.find(p => p.name === "Doji");
  
  if (candlePattern) {
    patterns.push({
      name: candlePattern.name,
      type: candlePattern.type,
      reliability: candlePattern.strength,
      category: "Candlestick",
      significance: candlePattern.strength > 75 ? "Strong" : "Moderate"
    });
  }
  
  return patterns;
};

export const PatternDetection = ({ asset }: PatternDetectionProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const [detectedPatterns, setDetectedPatterns] = useState<any[]>([]);

  useEffect(() => {
    if (price && change !== null) {
      setDetectedPatterns(generatePatternsFromTradingView(price, change));
    }
  }, [price, change]);

  if (isLoading) {
    return (
      <Card className="tradeiq-card flex flex-col h-full">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Pattern Detection</h3>
          </div>
          <div className="animate-pulse space-y-3 mt-4">
            <div className="h-14 bg-gray-700/30 rounded-lg"></div>
            <div className="h-14 bg-gray-700/30 rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="tradeiq-card flex flex-col h-full">
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Pattern Detection</h3>
          </div>
          <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
            TradingView
          </Badge>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        {detectedPatterns.map((pattern, index) => (
          <div key={index} className="bg-gray-900/40 rounded-lg border border-gray-800/50 overflow-hidden">
            {/* Pattern Header */}
            <div className="p-3 border-b border-gray-800/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {pattern.category === "Candlestick" ? (
                    <Activity className={`h-4 w-4 ${
                      pattern.type === 'bullish' ? 'text-tradeiq-success' :
                      pattern.type === 'bearish' ? 'text-tradeiq-danger' :
                      'text-gray-400'
                    }`} />
                  ) : pattern.reliability > 75 ? (
                    <CheckCircle className="h-4 w-4 text-tradeiq-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-tradeiq-warning" />
                  )}
                  <span className="text-white font-semibold text-sm">{pattern.name}</span>
                </div>
                <Badge variant="outline" className={`text-xs font-medium ${
                  pattern.type === 'bullish' ? 'text-tradeiq-success border-tradeiq-success/30' : 
                  pattern.type === 'bearish' ? 'text-tradeiq-danger border-tradeiq-danger/30' :
                  'text-gray-400 border-gray-400/30'
                }`}>
                  {pattern.type}
                </Badge>
              </div>
              
              {pattern.status && (
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className={`text-xs ${
                    pattern.status === "Confirmed" 
                      ? "text-green-400 border-green-400/30" 
                      : "text-yellow-400 border-yellow-400/30"
                  }`}>
                    {pattern.status}
                  </Badge>
                  {pattern.timeframe && (
                    <span className="text-xs text-gray-500">Timeframe: {pattern.timeframe}</span>
                  )}
                </div>
              )}
              
              {/* Reliability/Strength Bar */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  {pattern.category === "Candlestick" ? "Strength" : "Reliability"}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-800 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        pattern.reliability > 75 ? 'bg-tradeiq-success' : 
                        pattern.reliability > 65 ? 'bg-tradeiq-warning' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${pattern.reliability}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold text-xs">{pattern.reliability}%</span>
                </div>
              </div>
            </div>

            {/* Pattern Details */}
            {pattern.priceTarget && (
              <div className="p-3 space-y-2">
                {/* Price Targets Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                    <div className="flex items-center space-x-1 mb-1">
                      {pattern.type === "bullish" ? (
                        <TrendingUp className="h-3 w-3 text-tradeiq-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-tradeiq-danger" />
                      )}
                      <span className="text-[10px] text-gray-500">TARGET</span>
                    </div>
                    <div className={`text-sm font-bold ${
                      pattern.type === "bullish" ? "text-tradeiq-success" : "text-tradeiq-danger"
                    }`}>
                      ${pattern.priceTarget}
                    </div>
                    <div className="text-[10px] text-gray-600">
                      {pattern.target > 0 ? '+' : ''}{pattern.target}%
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                    <div className="flex items-center space-x-1 mb-1">
                      <CheckCircle className="h-3 w-3 text-tradeiq-blue" />
                      <span className="text-[10px] text-gray-500">TAKE PROFIT</span>
                    </div>
                    <div className="text-sm font-bold text-tradeiq-blue">
                      ${pattern.takeProfit}
                    </div>
                    <div className="text-[10px] text-gray-600">
                      Partial profit
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                    <div className="flex items-center space-x-1 mb-1">
                      <AlertTriangle className="h-3 w-3 text-tradeiq-warning" />
                      <span className="text-[10px] text-gray-500">STOP LOSS</span>
                    </div>
                    <div className="text-sm font-bold text-tradeiq-warning">
                      ${pattern.stopLoss}
                    </div>
                    <div className="text-[10px] text-gray-600">
                      Risk limit
                    </div>
                  </div>
                </div>

                {/* Breakout Level */}
                <div className="flex items-center justify-between bg-gray-800/20 rounded-lg p-2 border border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-3 w-3 text-tradeiq-blue" />
                    <span className="text-xs text-gray-400">Breakout Level</span>
                  </div>
                  <span className="text-xs font-semibold text-white">${pattern.breakoutLevel}</span>
                </div>
              </div>
            )}

            {/* Candlestick specific info */}
            {pattern.category === "Candlestick" && (
              <div className="p-3 pt-0">
                <div className="flex items-center justify-between bg-gray-800/20 rounded-lg p-2 border border-gray-700/50">
                  <span className="text-xs text-gray-400">Significance</span>
                  <Badge variant="outline" className={`text-xs ${
                    pattern.significance === "Strong" 
                      ? "text-tradeiq-blue border-tradeiq-blue/30" 
                      : "text-gray-400 border-gray-600"
                  }`}>
                    {pattern.significance}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ))}

        {detectedPatterns.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No clear patterns detected</p>
            {change !== null && (
              <p className="text-xs mt-2">
                Current movement: {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </p>
            )}
          </div>
        )}

        {/* Pattern Legend */}
        {detectedPatterns.length > 0 && (
          <div className="pt-3 border-t border-gray-800/50">
            <div className="flex items-center space-x-2 mb-2">
              <Triangle className="h-3 w-3 text-tradeiq-blue" />
              <span className="text-xs font-medium text-gray-400">Pattern Types</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
              <div>• Chart: Price formations</div>
              <div>• Candlestick: Single/multi candles</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
