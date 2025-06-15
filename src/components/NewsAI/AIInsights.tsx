
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AIAnalysis } from "@/services/aiAnalysisService";

interface AIInsightsProps {
  analysis: AIAnalysis | null;
  loading: boolean;
}

export const AIInsights = ({ analysis, loading }: AIInsightsProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "Bearish": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div data-testid="ai-insights-loading" className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3 text-tradeiq-blue">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-medium">Analyzing article with AI...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div data-testid="ai-insights" className="space-y-6">
      {/* Sentiment */}
      <div>
        <h5 className="text-white font-medium mb-3">Market Sentiment</h5>
        <Badge className={`${getSentimentColor(analysis.sentiment)} font-medium px-3 py-1`}>
          {analysis.sentiment}
        </Badge>
      </div>

      {/* Key Metrics */}
      {analysis.keyMetrics && (
        <div>
          <h5 className="text-white font-medium mb-3">Key Metrics</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.keyMetrics.eps && (
              <div className="bg-black/20 p-3 rounded-xl">
                <div className="text-xs text-gray-400 mb-1">EPS</div>
                <div className="text-sm font-medium text-white">{analysis.keyMetrics.eps}</div>
              </div>
            )}
            {analysis.keyMetrics.growth && (
              <div className="bg-black/20 p-3 rounded-xl">
                <div className="text-xs text-gray-400 mb-1">Growth</div>
                <div className="text-sm font-medium text-white">{analysis.keyMetrics.growth}</div>
              </div>
            )}
            {analysis.keyMetrics.forecast && (
              <div className="bg-black/20 p-3 rounded-xl">
                <div className="text-xs text-gray-400 mb-1">Forecast</div>
                <div className="text-sm font-medium text-white">{analysis.keyMetrics.forecast}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div>
        <h5 className="text-white font-medium mb-3">Key Points</h5>
        <ul className="space-y-2">
          {analysis.summary.map((point, index) => (
            <li key={index} className="flex items-start space-x-2 text-gray-300">
              <div className="w-1.5 h-1.5 bg-tradeiq-blue rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trading Insights */}
      <div>
        <h5 className="text-white font-medium mb-3">Trading Implications</h5>
        <div className="bg-black/20 p-4 rounded-xl space-y-3">
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {analysis.insights}
          </p>
          <div className="grid grid-cols-1 gap-3">
            {analysis.tradingImplications.volatilityTrigger && (
              <div className="flex items-start space-x-2">
                <span className="text-xs text-gray-500 min-w-[80px]">Trigger:</span>
                <span className="text-sm text-gray-300">{analysis.tradingImplications.volatilityTrigger}</span>
              </div>
            )}
            {analysis.tradingImplications.supportResistance && (
              <div className="flex items-start space-x-2">
                <span className="text-xs text-gray-500 min-w-[80px]">Levels:</span>
                <span className="text-sm text-gray-300">{analysis.tradingImplications.supportResistance}</span>
              </div>
            )}
            {analysis.tradingImplications.sectorImpact && (
              <div className="flex items-start space-x-2">
                <span className="text-xs text-gray-500 min-w-[80px]">Impact:</span>
                <span className="text-sm text-gray-300">{analysis.tradingImplications.sectorImpact}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
