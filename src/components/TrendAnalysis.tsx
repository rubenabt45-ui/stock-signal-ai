
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";

interface TrendAnalysisProps {
  asset: string;
}

const analyzeTrendFromTradingView = (price: number | null, change: number | null) => {
  if (!price || change === null) return null;
  
  const changePercent = change;
  
  let direction = "Sideways";
  let strength = "Neutral";
  let color = "text-gray-400";
  let icon = <Minus className="h-5 w-5" />;
  
  if (changePercent > 1) {
    direction = "Uptrend";
    strength = changePercent > 3 ? "Strong" : "Moderate";
    color = "text-tradeiq-success";
    icon = <TrendingUp className="h-5 w-5" />;
  } else if (changePercent < -1) {
    direction = "Downtrend";
    strength = changePercent < -3 ? "Strong" : "Moderate";
    color = "text-tradeiq-danger";
    icon = <TrendingDown className="h-5 w-5" />;
  }
  
  return {
    direction,
    strength,
    color,
    icon,
    confidence: Math.min(95, 60 + Math.abs(changePercent) * 5),
    momentum: Math.abs(changePercent) > 2 ? "High" : "Low"
  };
};

export const TrendAnalysis = ({ asset }: TrendAnalysisProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const trendData = analyzeTrendFromTradingView(price, change);

  if (isLoading) {
    return (
      <Card className="tradeiq-card flex flex-col h-full">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Trend Analysis</h3>
          </div>
          <div className="animate-pulse space-y-3 mt-4">
            <div className="h-5 bg-gray-700/30 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700/30 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!trendData) {
    return (
      <Card className="tradeiq-card flex flex-col h-full">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Trend Analysis</h3>
          </div>
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Waiting for TradingView data...</p>
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
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Trend Analysis</h3>
          </div>
          <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
            TradingView
          </Badge>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        {/* Trend Direction */}
        <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className={trendData.color}>
              {trendData.icon}
            </div>
            <div>
              <span className="text-white font-medium text-sm">Direction</span>
              <p className="text-xs text-gray-500">Current market trend</p>
            </div>
          </div>
          <Badge variant="outline" className={`${trendData.color} border-current/30 font-semibold text-xs`}>
            {trendData.direction}
          </Badge>
        </div>

        {/* Trend Strength */}
        <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800/50">
          <div>
            <span className="text-white font-medium text-sm">Strength</span>
            <p className="text-xs text-gray-500">Trend intensity</p>
          </div>
          <Badge variant="outline" className="border-gray-600 text-white font-semibold text-xs">
            {trendData.strength}
          </Badge>
        </div>

        {/* Confidence */}
        <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium text-sm">Confidence</span>
            <span className="text-white font-bold text-xs">{trendData.confidence.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div 
              className="bg-tradeiq-blue h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${trendData.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Current Data */}
        {change !== null && (
          <div className="pt-3 border-t border-gray-800/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Change:</span>
              <span className={change >= 0 ? "text-tradeiq-success font-semibold" : "text-tradeiq-danger font-semibold"}>
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-500">Momentum:</span>
              <span className="text-white font-medium">{trendData.momentum}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
