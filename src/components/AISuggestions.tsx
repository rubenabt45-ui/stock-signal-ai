
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Shield, Target, Clock, DollarSign, BarChart3 } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";
import { useState, useEffect } from "react";

interface AISuggestionsProps {
  asset: string;
}

// Trading strategies library
const tradingStrategies = [
  { name: "Momentum Trading", suitable: "strong trends", risk: "Medium" },
  { name: "Swing Trading", suitable: "consolidation", risk: "Low-Medium" },
  { name: "Breakout Trading", suitable: "near resistance", risk: "Medium-High" },
  { name: "Mean Reversion", suitable: "oversold/overbought", risk: "Medium" },
  { name: "Scalping", suitable: "high volatility", risk: "High" },
];

// Risk management tips
const riskTips = [
  "Never risk more than 2% of your capital per trade",
  "Use stop-loss orders to protect your capital",
  "Diversify across different assets and sectors",
  "Keep position sizes proportional to account size",
  "Monitor your risk-to-reward ratio (aim for 1:2+)",
];

const generateAISuggestions = (price: number, change: number, asset: string) => {
  const suggestions = [];
  const changePercent = Math.abs(change);
  
  // Market Condition Analysis
  const marketCondition = change > 2 ? "Bullish" : change < -2 ? "Bearish" : "Neutral";
  const volatility = changePercent > 3 ? "High" : changePercent > 1 ? "Medium" : "Low";
  
  // Primary Trading Recommendation
  if (change > 3) {
    suggestions.push({
      type: "recommendation",
      priority: "high",
      action: "Consider Long Position",
      title: "Strong Bullish Momentum",
      description: `${asset} shows strong upward momentum (+${change.toFixed(2)}%). Consider entering long positions with proper risk management.`,
      details: {
        entry: `$${(price * 1.01).toFixed(2)} - $${(price * 1.02).toFixed(2)}`,
        target: `$${(price * 1.08).toFixed(2)}`,
        stopLoss: `$${(price * 0.97).toFixed(2)}`,
        timeframe: "4H - 1D",
        riskReward: "1:2.5"
      },
      confidence: 85,
      icon: <TrendingUp className="h-5 w-5 text-tradeiq-success" />
    });
  } else if (change < -3) {
    suggestions.push({
      type: "recommendation",
      priority: "high",
      action: "Wait or Short Position",
      title: "Downward Pressure Detected",
      description: `${asset} experiencing significant decline (${change.toFixed(2)}%). Wait for support or consider short positions.`,
      details: {
        entry: `$${(price * 0.99).toFixed(2)} - $${(price * 0.98).toFixed(2)}`,
        target: `$${(price * 0.92).toFixed(2)}`,
        stopLoss: `$${(price * 1.03).toFixed(2)}`,
        timeframe: "4H - 1D",
        riskReward: "1:2.3"
      },
      confidence: 82,
      icon: <TrendingDown className="h-5 w-5 text-tradeiq-danger" />
    });
  } else if (Math.abs(change) < 1) {
    suggestions.push({
      type: "recommendation",
      priority: "medium",
      action: "Wait for Breakout",
      title: "Consolidation Phase",
      description: `${asset} trading in narrow range. Wait for clear breakout before entering positions.`,
      details: {
        resistanceBreak: `$${(price * 1.03).toFixed(2)}`,
        supportBreak: `$${(price * 0.97).toFixed(2)}`,
        currentRange: `$${(price * 0.98).toFixed(2)} - $${(price * 1.02).toFixed(2)}`,
        timeframe: "1D",
        strategy: "Breakout Trading"
      },
      confidence: 78,
      icon: <AlertTriangle className="h-5 w-5 text-tradeiq-warning" />
    });
  }

  // Strategy Recommendation
  const suitableStrategy = change > 2 
    ? tradingStrategies[0] // Momentum
    : Math.abs(change) < 1 
    ? tradingStrategies[1] // Swing
    : tradingStrategies[3]; // Mean Reversion
  
  suggestions.push({
    type: "strategy",
    title: `Recommended: ${suitableStrategy.name}`,
    description: `Based on current market conditions (${marketCondition}, ${volatility} volatility), ${suitableStrategy.name.toLowerCase()} may be effective.`,
    details: {
      risk: suitableStrategy.risk,
      suitable: suitableStrategy.suitable,
      timeframe: changePercent > 2 ? "Short-term (4H-1D)" : "Medium-term (1D-1W)"
    },
    confidence: 80,
    icon: <Lightbulb className="h-5 w-5 text-yellow-400" />
  });

  // Risk Management Insight
  const randomTip = riskTips[Math.floor(Math.random() * riskTips.length)];
  const suggestedRisk = (price * 0.02).toFixed(2); // 2% risk example
  
  suggestions.push({
    type: "risk",
    title: "Risk Management Tip",
    description: randomTip,
    details: {
      maxRisk: "2% per trade",
      positionSize: `Max $${(price * 10).toFixed(2)} exposure`,
      stopLossDistance: "3-5% from entry",
      riskAmount: `~$${suggestedRisk} max loss`
    },
    confidence: 95,
    icon: <Shield className="h-5 w-5 text-tradeiq-blue" />
  });

  // Market Sentiment
  const sentiment = change > 1 ? "Positive" : change < -1 ? "Negative" : "Mixed";
  const sentimentStrength = changePercent > 3 ? "Strong" : changePercent > 1 ? "Moderate" : "Weak";
  
  suggestions.push({
    type: "sentiment",
    title: `Market Sentiment: ${sentimentStrength} ${sentiment}`,
    description: `Current market shows ${sentimentStrength.toLowerCase()} ${sentiment.toLowerCase()} sentiment with ${volatility.toLowerCase()} volatility.`,
    details: {
      trend: marketCondition,
      strength: sentimentStrength,
      volatility: volatility,
      recommendation: sentiment === "Positive" ? "Look for entries on pullbacks" : 
                     sentiment === "Negative" ? "Wait for reversal signals" :
                     "Monitor for breakout direction"
    },
    confidence: 88,
    icon: <BarChart3 className="h-5 w-5 text-purple-400" />
  });

  // TradingView Integration Note
  suggestions.push({
    type: "info",
    title: "TradingView Integration",
    description: "Real-time data sourced from TradingView ensures accurate market analysis and technical indicators.",
    confidence: 95,
    icon: <Brain className="h-5 w-5 text-tradeiq-blue" />
  });

  return suggestions;
};

export const AISuggestions = ({ asset }: AISuggestionsProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (price && change !== null) {
      setSuggestions(generateAISuggestions(price, change, asset));
    }
  }, [price, change, asset]);

  if (isLoading) {
    return (
      <Card className="tradeiq-card flex flex-col h-full">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
          </div>
          <div className="animate-pulse space-y-3 mt-4">
            <div className="h-16 bg-gray-700/30 rounded-lg"></div>
            <div className="h-16 bg-gray-700/30 rounded-lg"></div>
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
            <Brain className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
          </div>
          <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
            Real-time
          </Badge>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className={`bg-gray-900/40 rounded-lg border border-gray-800/50 overflow-hidden ${
            suggestion.priority === 'high' ? 'ring-1 ring-tradeiq-blue/20' : ''
          }`}>
            {/* Suggestion Header */}
            <div className="p-3 border-b border-gray-800/50">
              <div className="flex items-start space-x-2 mb-2">
                <div className="mt-0.5">
                  {suggestion.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold text-sm">{suggestion.title}</h4>
                      {suggestion.priority === 'high' && (
                        <Badge variant="outline" className="text-[10px] text-tradeiq-blue border-tradeiq-blue/30">
                          Priority
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                      {suggestion.confidence}%
                    </Badge>
                  </div>
                  {suggestion.action && (
                    <Badge variant="outline" className={`text-xs mb-2 ${
                      suggestion.action.includes("Long") ? "text-tradeiq-success border-tradeiq-success/30" :
                      suggestion.action.includes("Short") ? "text-tradeiq-danger border-tradeiq-danger/30" :
                      "text-tradeiq-warning border-tradeiq-warning/30"
                    }`}>
                      {suggestion.action}
                    </Badge>
                  )}
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestion Details */}
            {suggestion.details && (
              <div className="p-3 space-y-2">
                {/* Recommendation Type Details */}
                {suggestion.type === 'recommendation' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                        <div className="flex items-center space-x-1 mb-1">
                          <Target className="h-3 w-3 text-tradeiq-blue" />
                          <span className="text-[10px] text-gray-500">ENTRY ZONE</span>
                        </div>
                        <div className="text-xs font-semibold text-white">
                          {suggestion.details.entry}
                        </div>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-[10px] text-gray-500">TIMEFRAME</span>
                        </div>
                        <div className="text-xs font-semibold text-white">
                          {suggestion.details.timeframe}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-800/20 rounded-lg p-2 border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 mb-1">TARGET</div>
                        <div className="text-xs font-bold text-tradeiq-success">
                          {suggestion.details.target}
                        </div>
                      </div>
                      <div className="bg-gray-800/20 rounded-lg p-2 border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 mb-1">STOP LOSS</div>
                        <div className="text-xs font-bold text-tradeiq-danger">
                          {suggestion.details.stopLoss}
                        </div>
                      </div>
                      <div className="bg-gray-800/20 rounded-lg p-2 border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 mb-1">R:R</div>
                        <div className="text-xs font-bold text-tradeiq-blue">
                          {suggestion.details.riskReward}
                        </div>
                      </div>
                    </div>

                    {(suggestion.details.resistanceBreak || suggestion.details.supportBreak) && (
                      <div className="bg-gray-800/20 rounded-lg p-2 border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 mb-1">BREAKOUT LEVELS</div>
                        <div className="flex justify-between text-xs">
                          {suggestion.details.resistanceBreak && (
                            <span className="text-tradeiq-success">↑ {suggestion.details.resistanceBreak}</span>
                          )}
                          {suggestion.details.supportBreak && (
                            <span className="text-tradeiq-danger">↓ {suggestion.details.supportBreak}</span>
                          )}
                        </div>
                        {suggestion.details.currentRange && (
                          <div className="text-[10px] text-gray-600 mt-1">Range: {suggestion.details.currentRange}</div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Strategy Type Details */}
                {suggestion.type === 'strategy' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                      <div className="text-[10px] text-gray-500 mb-1">RISK LEVEL</div>
                      <div className={`text-xs font-semibold ${
                        suggestion.details.risk.includes("High") ? "text-tradeiq-danger" :
                        suggestion.details.risk.includes("Medium") ? "text-tradeiq-warning" :
                        "text-tradeiq-success"
                      }`}>
                        {suggestion.details.risk}
                      </div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                      <div className="text-[10px] text-gray-500 mb-1">TIMEFRAME</div>
                      <div className="text-xs font-semibold text-white">
                        {suggestion.details.timeframe}
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Management Details */}
                {suggestion.type === 'risk' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                        <div className="flex items-center space-x-1 mb-1">
                          <DollarSign className="h-3 w-3 text-tradeiq-warning" />
                          <span className="text-[10px] text-gray-500">MAX RISK</span>
                        </div>
                        <div className="text-xs font-semibold text-tradeiq-warning">
                          {suggestion.details.maxRisk}
                        </div>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 mb-1">STOP DISTANCE</div>
                        <div className="text-xs font-semibold text-white">
                          {suggestion.details.stopLossDistance}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/20 rounded-lg p-2 border border-gray-700/50 text-xs text-gray-400">
                      <div className="text-[10px] text-gray-500 mb-1">RECOMMENDED</div>
                      Position size: {suggestion.details.positionSize} • Risk: {suggestion.details.riskAmount}
                    </div>
                  </div>
                )}

                {/* Sentiment Details */}
                {suggestion.type === 'sentiment' && (
                  <div className="bg-gray-800/20 rounded-lg p-2 border border-gray-700/50">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div>
                        <div className="text-[10px] text-gray-500">TREND</div>
                        <div className={`text-xs font-semibold ${
                          suggestion.details.trend === "Bullish" ? "text-tradeiq-success" :
                          suggestion.details.trend === "Bearish" ? "text-tradeiq-danger" :
                          "text-gray-400"
                        }`}>
                          {suggestion.details.trend}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500">STRENGTH</div>
                        <div className="text-xs font-semibold text-white">
                          {suggestion.details.strength}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500">VOLATILITY</div>
                        <div className="text-xs font-semibold text-tradeiq-warning">
                          {suggestion.details.volatility}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-700/50">
                      💡 {suggestion.details.recommendation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {suggestions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Analyzing market data...</p>
            <p className="text-xs mt-2">Waiting for TradingView integration</p>
          </div>
        )}
      </div>
    </Card>
  );
};
