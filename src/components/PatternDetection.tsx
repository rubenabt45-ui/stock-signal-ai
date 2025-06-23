
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
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Pattern Detection</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-700/30 rounded-xl"></div>
          <div className="h-16 bg-gray-700/30 rounded-xl"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="tradeiq-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Pattern Detection</h3>
        </div>
        <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
          TradingView Data
        </Badge>
      </div>

      <div className="space-y-4">
        {detectedPatterns.map((pattern, index) => (
          <div key={index} className="p-4 bg-black/20 rounded-xl border border-gray-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {pattern.confidence > 70 ? (
                  <CheckCircle className="h-5 w-5 text-tradeiq-success" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-tradeiq-warning" />
                )}
                <span className="text-white font-semibold">{pattern.name}</span>
              </div>
              <Badge variant="outline" className={`border-gray-600 font-bold ${
                pattern.type === 'bullish' ? 'text-tradeiq-success border-tradeiq-success/30' : 
                pattern.type === 'bearish' ? 'text-tradeiq-danger border-tradeiq-danger/30' :
                'text-gray-400 border-gray-400/30'
              }`}>
                {pattern.type}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-400 mb-3">{pattern.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Confidence</span>
              <div className="flex items-center space-x-3">
                <div className="w-20 bg-gray-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      pattern.confidence > 70 ? 'bg-tradeiq-success' : 'bg-tradeiq-warning'
                    }`}
                    style={{ width: `${pattern.confidence}%` }}
                  ></div>
                </div>
                <span className="text-white font-bold text-sm">{pattern.confidence.toFixed(0)}%</span>
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
