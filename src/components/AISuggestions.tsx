
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, Info } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";

interface AISuggestionsProps {
  asset: string;
  timeframe: string;
}

const generateTradingViewBasedSuggestions = (price: number | null, change: number | null, asset: string) => {
  if (!price || change === null) return [];
  
  const suggestions = [];
  const changePercent = change;
  
  // Market condition analysis
  if (changePercent > 3) {
    suggestions.push({
      type: "opportunity",
      title: "Strong Upward Momentum",
      description: `${asset} is showing significant positive movement (+${changePercent.toFixed(2)}%). Consider monitoring for continuation patterns.`,
      icon: TrendingUp,
      priority: "high"
    });
  } else if (changePercent < -3) {
    suggestions.push({
      type: "warning",
      title: "Bearish Pressure Detected",
      description: `${asset} is experiencing downward pressure (${changePercent.toFixed(2)}%). Review risk management strategies.`,
      icon: AlertCircle,
      priority: "high"
    });
  } else if (Math.abs(changePercent) < 0.5) {
    suggestions.push({
      type: "info",
      title: "Range-Bound Trading",
      description: `${asset} is consolidating around $${price.toFixed(2)}. Watch for breakout signals.`,
      icon: Info,
      priority: "medium"
    });
  }
  
  // Volume and price relationship (simulated based on movement)
  if (Math.abs(changePercent) > 2) {
    suggestions.push({
      type: "insight",
      title: "Active Trading Session",
      description: "Increased price volatility suggests higher market participation. Monitor key support/resistance levels.",
      icon: Brain,
      priority: "medium"
    });
  }
  
  return suggestions.slice(0, 3); // Limit to 3 suggestions
};

export const AISuggestions = ({ asset, timeframe }: AISuggestionsProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (price !== null && change !== null) {
      const newSuggestions = generateTradingViewBasedSuggestions(price, change, asset);
      setSuggestions(newSuggestions);
    }
  }, [price, change, asset]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'warning': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'insight': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  if (isLoading) {
    return (
      <Card className="tradeiq-card h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <Brain className="h-5 w-5 text-tradeiq-blue animate-pulse" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700/30 rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tradeiq-card h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-tradeiq-blue" />
            <span>AI Market Insights</span>
          </div>
          <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
            TradingView
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div key={index} className="p-4 bg-black/20 rounded-xl border border-gray-800/50">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <suggestion.icon className="h-5 w-5 text-tradeiq-blue" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold text-sm">{suggestion.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTypeColor(suggestion.type)} border`}
                    >
                      {suggestion.type}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Analyzing market data...</p>
            {price && change !== null && (
              <p className="text-xs mt-2">
                Current: ${price.toFixed(2)} ({change > 0 ? '+' : ''}{change.toFixed(2)}%)
              </p>
            )}
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            Insights powered by TradingView real-time data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
