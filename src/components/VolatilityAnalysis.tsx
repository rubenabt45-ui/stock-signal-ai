
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";

interface VolatilityAnalysisProps {
  asset: string;
}

const analyzeVolatilityFromTradingView = (price: number | null, change: number | null) => {
  if (!price || change === null) return null;
  
  const absChange = Math.abs(change);
  
  let level = "Low";
  let color = "text-green-400";
  let icon = <CheckCircle className="h-5 w-5" />;
  let description = "Stable price movement";
  
  if (absChange > 5) {
    level = "Very High";
    color = "text-red-400";
    icon = <AlertTriangle className="h-5 w-5" />;
    description = "Extreme price fluctuation";
  } else if (absChange > 3) {
    level = "High";
    color = "text-orange-400";
    icon = <AlertTriangle className="h-5 w-5" />;
    description = "Significant price movement";
  } else if (absChange > 1.5) {
    level = "Moderate";
    color = "text-yellow-400";
    icon = <Activity className="h-5 w-5" />;
    description = "Normal market activity";
  }
  
  return {
    level,
    color,
    icon,
    description,
    riskScore: Math.min(100, absChange * 15),
    intensity: absChange
  };
};

export const VolatilityAnalysis = ({ asset }: VolatilityAnalysisProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const volatilityData = analyzeVolatilityFromTradingView(price, change);

  if (isLoading) {
    return (
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="h-6 w-6 text-orange-400" />
          <h3 className="text-xl font-bold text-white">Volatility Analysis</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700/30 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700/30 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (!volatilityData) {
    return (
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="h-6 w-6 text-orange-400" />
          <h3 className="text-xl font-bold text-white">Volatility Analysis</h3>
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
          <Activity className="h-6 w-6 text-orange-400" />
          <h3 className="text-xl font-bold text-white">Volatility Analysis</h3>
        </div>
        <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
          TradingView Data
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Volatility Level */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className={volatilityData.color}>
              {volatilityData.icon}
            </div>
            <div>
              <span className="text-white font-semibold">Volatility Level</span>
              <p className="text-sm text-gray-400">{volatilityData.description}</p>
            </div>
          </div>
          <Badge variant="outline" className={`${volatilityData.color} border-current/30 font-bold`}>
            {volatilityData.level}
          </Badge>
        </div>

        {/* Risk Score */}
        <div className="p-4 bg-black/20 rounded-xl border border-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Risk Score</span>
            <span className="text-white font-bold text-sm">{volatilityData.riskScore.toFixed(0)}/100</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                volatilityData.riskScore > 60 ? 'bg-red-400' :
                volatilityData.riskScore > 30 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${Math.min(100, volatilityData.riskScore)}%` }}
            ></div>
          </div>
        </div>

        {/* Movement Metrics - Price field temporarily hidden */}
        {change !== null && (
          <div className="grid grid-cols-1 gap-4">
            <div className="p-3 bg-black/20 rounded-xl border border-gray-800/50">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Price Movement</p>
                <p className={`text-lg font-bold ${change >= 0 ? 'text-tradeiq-success' : 'text-tradeiq-danger'}`}>
                  {change > 0 ? '+' : ''}{change.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="p-4 bg-black/20 rounded-xl border border-gray-800/50">
          <h4 className="text-white font-semibold mb-2">Market Insight</h4>
          <p className="text-sm text-gray-300">
            {volatilityData.level === "Very High" ? 
              "Extreme price movements suggest high market uncertainty. Consider risk management strategies." :
            volatilityData.level === "High" ?
              "Significant price swings indicate active trading. Monitor closely for trend confirmation." :
            volatilityData.level === "Moderate" ?
              "Normal market activity with reasonable price movements." :
              "Low volatility suggests stable market conditions with minimal price fluctuation."
            }
          </p>
        </div>
      </div>
    </Card>
  );
};
