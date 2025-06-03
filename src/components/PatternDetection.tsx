
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, AlertTriangle } from "lucide-react";

interface PatternDetectionProps {
  asset: string;
  timeframe: string;
}

const generatePatterns = () => {
  const patterns = [
    { name: "Ascending Triangle", confidence: 85, type: "bullish" },
    { name: "Double Bottom", confidence: 72, type: "bullish" },
    { name: "Head & Shoulders", confidence: 45, type: "bearish" },
    { name: "Bull Flag", confidence: 91, type: "bullish" },
  ];
  
  return patterns.slice(0, Math.floor(Math.random() * 3) + 1);
};

export const PatternDetection = ({ asset, timeframe }: PatternDetectionProps) => {
  const detectedPatterns = generatePatterns();

  return (
    <Card className="tradeiq-card p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Pattern Detection</h3>
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
                pattern.type === 'bullish' ? 'text-tradeiq-success border-tradeiq-success/30' : 'text-tradeiq-danger border-tradeiq-danger/30'
              }`}>
                {pattern.type}
              </Badge>
            </div>
            
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
                <span className="text-white font-bold text-sm">{pattern.confidence}%</span>
              </div>
            </div>
          </div>
        ))}

        {detectedPatterns.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No clear patterns detected</p>
          </div>
        )}
      </div>
    </Card>
  );
};
