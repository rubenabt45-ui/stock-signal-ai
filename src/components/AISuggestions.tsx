
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";

interface AISuggestionsProps {
  asset: string;
}

const generateAISuggestions = (price: number | null, change: number | null, asset: string) => {
  if (!price || change === null) return [];

  const suggestions = [];
  const changePercent = change;

  // Generate context-aware suggestions based on TradingView data
  if (changePercent > 3) {
    suggestions.push({
      type: "bullish",
      title: "Strong Momentum Detected",
      description: `${asset} is showing strong upward momentum (+${changePercent.toFixed(2)}%). Consider monitoring for continuation patterns.`,
      confidence: 85,
      icon: <TrendingUp className="h-5 w-5 text-green-400" />
    });
  } else if (changePercent < -3) {
    suggestions.push({
      type: "bearish",
      title: "Downward Pressure",
      description: `${asset} is experiencing significant decline (${changePercent.toFixed(2)}%). Monitor support levels closely.`,
      confidence: 80,
      icon: <TrendingDown className="h-5 w-5 text-red-400" />
    });
  } else if (Math.abs(changePercent) < 1) {
    suggestions.push({
      type: "neutral",
      title: "Consolidation Phase",
      description: `${asset} is trading in a narrow range. Watch for breakout signals in either direction.`,
      confidence: 75,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />
    });
  }

  // Add general market insight
  suggestions.push({
    type: "analysis",
    title: "TradingView Integration",
    description: "Real-time data sourced from TradingView ensures accurate market analysis and technical indicators.",
    confidence: 95,
    icon: <Brain className="h-5 w-5 text-blue-400" />
  });

  return suggestions;
};

export const AISuggestions = ({ asset }: AISuggestionsProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const suggestions = generateAISuggestions(price, change, asset);

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
          <div key={index} className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/50">
            <div className="flex items-start space-x-2">
              <div className="mt-0.5">
                {suggestion.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium text-sm">{suggestion.title}</h4>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                    {suggestion.confidence}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>
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
