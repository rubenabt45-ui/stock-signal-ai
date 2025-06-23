
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";

interface TrendAnalysisProps {
  asset: string;
  timeframe: string;
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

export const TrendAnalysis = ({ asset, timeframe }: TrendAnalysisProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const trendData = analyzeTrendFromTradingView(price, change);

  if (isLoading) {
    return (
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Trend Analysis</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700/30 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700/30 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (!trendData) {
    return (
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Trend Analysis</h3>
        </div>
        <div className="text-center py-8 text-gray-400">
          <p>Waiting for TradingView data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="tradeiq-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Trend Analysis</h3>
        </div>
        <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
          Real-time
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Trend Direction */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className={trendData.color}>
              {trendData.icon}
            </div>
            <div>
              <span className="text-white font-semibold">Direction</span>
              <p className="text-sm text-gray-400">Current market trend</p>
            </div>
          </div>
          <Badge variant="outline" className={`${trendData.color} border-current/30 font-bold`}>
            {trendData.direction}
          </Badge>
        </div>

        {/* Trend Strength */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800/50">
          <div>
            <span className="text-white font-semibold">Strength</span>
            <p className="text-sm text-gray-400">Trend intensity</p>
          </div>
          <Badge variant="outline" className="border-gray-600 text-white font-bold">
            {trendData.strength}
          </Badge>
        </div>

        {/* Confidence */}
        <div className="p-4 bg-black/20 rounded-xl border border-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Confidence</span>
            <span className="text-white font-bold text-sm">{trendData.confidence.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-tradeiq-blue h-2 rounded-full transition-all duration-500"
              style={{ width: `${trendData.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Current Data */}
        {price && change !== null && (
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Current Price:</span>
              <span className="text-white font-semibold">${price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-400">Change:</span>
              <span className={change >= 0 ? "text-tradeiq-success" : "text-tradeiq-danger"}>
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-400">Momentum:</span>
              <span className="text-white">{trendData.momentum}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
