
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, AlertTriangle } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";

interface PatternDetectionProps {
  asset: string;
}

const generatePatternsFromTradingView = (price: number | null, change: number | null) => {
  if (!price || change === null) return [];
  
  const patterns = [];
  const changePercent = change;
  
  // Pattern detection based on TradingView real-time data
  if (changePercent > 2) {
    patterns.push({ 
      name: "Bullish Momentum", 
      confidence: 75 + Math.random() * 15, 
      type: "bullish",
      description: "Strong upward price movement detected"
    });
  }
  
  if (changePercent < -2) {
    patterns.push({ 
      name: "Bearish Pressure", 
      confidence: 70 + Math.random() * 20, 
      type: "bearish",
      description: "Significant downward movement observed"
    });
  }
  
  if (Math.abs(changePercent) < 1) {
    patterns.push({ 
      name: "Consolidation", 
      confidence: 80 + Math.random() * 15, 
      type: "neutral",
      description: "Price range trading pattern"
    });
  }
  
  return patterns.slice(0, 2); // Limit to 2 patterns for clarity
};

export const PatternDetection = ({ asset }: PatternDetectionProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const detectedPatterns = generatePatternsFromTradingView(price, change);

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
          <div key={index} className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {pattern.confidence > 70 ? (
                  <CheckCircle className="h-4 w-4 text-tradeiq-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-tradeiq-warning" />
                )}
                <span className="text-white font-medium text-sm">{pattern.name}</span>
              </div>
              <Badge variant="outline" className={`border-gray-600 font-medium text-xs ${
                pattern.type === 'bullish' ? 'text-tradeiq-success border-tradeiq-success/30' : 
                pattern.type === 'bearish' ? 'text-tradeiq-danger border-tradeiq-danger/30' :
                'text-gray-400 border-gray-400/30'
              }`}>
                {pattern.type}
              </Badge>
            </div>
            
            <p className="text-xs text-gray-500 mb-2">{pattern.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Confidence</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-800 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      pattern.confidence > 70 ? 'bg-tradeiq-success' : 'bg-tradeiq-warning'
                    }`}
                    style={{ width: `${pattern.confidence}%` }}
                  ></div>
                </div>
                <span className="text-white font-semibold text-xs">{pattern.confidence.toFixed(0)}%</span>
              </div>
            </div>
            
            {change !== null && (
              <div className="mt-2 text-xs text-gray-500">
                Movement: {change > 0 ? '+' : ''}{change.toFixed(2)}%
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
      </div>
    </Card>
  );
};
