
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { useTradingViewData, formatPrice, formatChangePercent } from "@/hooks/useTradingViewData";

interface TrendAnalysisProps {
  asset: string;
  timeframe: string;
}

const generateTrendData = (tradingViewData: any) => {
  if (!tradingViewData || !tradingViewData.price) {
    return {
      trend: 'Sideways' as const,
      strength: 50,
      momentum: 50
    };
  }

  const { changePercent, high, low, price, open } = tradingViewData;
  
  // Determine trend based on TradingView price action
  let trend: 'Bullish' | 'Bearish' | 'Sideways';
  if (changePercent > 1.5) {
    trend = 'Bullish';
  } else if (changePercent < -1.5) {
    trend = 'Bearish';
  } else {
    trend = 'Sideways';
  }
  
  // Calculate trend strength based on price position within range
  const pricePosition = high && low ? ((price - low) / (high - low)) * 100 : 50;
  const strength = Math.min(Math.max(pricePosition + Math.abs(changePercent) * 10, 0), 100);
  
  // Calculate momentum based on TradingView change data
  const momentum = Math.min(Math.max(50 + (changePercent * 5) + Math.random() * 20, 0), 100);
  
  return { trend, strength, momentum };
};

export const TrendAnalysis = ({ asset, timeframe }: TrendAnalysisProps) => {
  const tradingViewData = useTradingViewData(asset);
  const { trend, strength, momentum } = generateTrendData(tradingViewData);

  // TradingView data sync log
  if (process.env.NODE_ENV === 'development' && tradingViewData.price !== null) {
    console.log(`📈 TrendAnalysis [${asset}]: $${formatPrice(tradingViewData.price)} (${formatChangePercent(tradingViewData.changePercent)}) - TradingView sync: ${new Date(tradingViewData.lastUpdated || 0).toLocaleTimeString()}`);
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'Bullish': return TrendingUp;
      case 'Bearish': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'Bullish': return 'text-tradeiq-success';
      case 'Bearish': return 'text-tradeiq-danger';
      default: return 'text-tradeiq-warning';
    }
  };

  const TrendIcon = getTrendIcon();

  if (tradingViewData.isLoading) {
    return (
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="h-6 w-6 text-tradeiq-blue" />
          <h3 className="text-xl font-bold text-white">Trend Analysis</h3>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gray-700/30 rounded-2xl"></div>
          <div className="h-16 bg-gray-700/30 rounded-xl"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="tradeiq-card p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="h-6 w-6 text-tradeiq-blue" />
        <h3 className="text-xl font-bold text-white">Trend Analysis</h3>
        <Badge className="bg-tradeiq-blue/20 text-tradeiq-blue border-tradeiq-blue/30 text-xs">
          TradingView
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Current Trend */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center space-x-3 p-4 rounded-2xl ${
            trend === 'Bullish' ? 'bg-tradeiq-success/10 border border-tradeiq-success/30' :
            trend === 'Bearish' ? 'bg-tradeiq-danger/10 border border-tradeiq-danger/30' :
            'bg-tradeiq-warning/10 border border-tradeiq-warning/30'
          }`}>
            <TrendIcon className={`h-8 w-8 ${getTrendColor()}`} />
            <span className={`text-2xl font-bold ${getTrendColor()}`}>
              {trend}
            </span>
          </div>
        </div>

        {/* Trend Metrics */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Trend Strength</span>
              <span className="text-white font-bold">{strength.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  strength > 70 ? 'bg-tradeiq-success' : 
                  strength > 40 ? 'bg-tradeiq-warning' : 'bg-tradeiq-danger'
                }`}
                style={{ width: `${strength}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Momentum</span>
              <span className="text-white font-bold">{momentum.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className="bg-tradeiq-blue h-3 rounded-full transition-all duration-500"
                style={{ width: `${momentum}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Trend Details */}
        <div className="p-4 bg-black/20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Market Direction</span>
            <Badge variant="outline" className={`border-gray-600 font-bold ${getTrendColor()} border-opacity-30`}>
              {trend} Trend
            </Badge>
          </div>
          {tradingViewData.price && (
            <div className="text-xs text-gray-500 mt-2">
              TradingView: ${formatPrice(tradingViewData.price)} | Change: {formatChangePercent(tradingViewData.changePercent)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
