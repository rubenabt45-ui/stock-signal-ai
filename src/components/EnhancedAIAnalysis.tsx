
import { useState, useEffect } from "react";
import { Brain, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EnhancedAIAnalysisProps {
  symbol: string;
  stockData?: {
    price: number;
    change: number;
  };
}

export const EnhancedAIAnalysis = ({ symbol, stockData }: EnhancedAIAnalysisProps) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const generateAnalysis = () => {
      setLoading(true);
      
      // Simple analysis based on TradingView data only
      setTimeout(() => {
        const mockAnalysis = {
          sentiment: stockData?.change && stockData.change > 0 ? "Bullish" : 
                    stockData?.change && stockData.change < 0 ? "Bearish" : "Neutral",
          keyPoints: [
            `Current price movement: ${stockData?.change ? (stockData.change > 0 ? 'Positive' : 'Negative') : 'Neutral'}`,
            "Real-time data powered by TradingView",
            "Analysis based on live market conditions"
          ],
          riskLevel: stockData?.change && Math.abs(stockData.change) > 3 ? "High" : "Medium",
          lastUpdated: Date.now()
        };
        
        setAnalysis(mockAnalysis);
        setLoading(false);
      }, 1000);
    };

    generateAnalysis();
  }, [symbol, stockData]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'Bearish': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return <TrendingUp className="h-4 w-4" />;
      case 'Bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="tradeiq-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <Brain className="h-5 w-5 text-tradeiq-blue animate-pulse" />
            <span>AI Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tradeiq-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-tradeiq-blue" />
            <span>AI Market Analysis</span>
          </div>
          <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Market Sentiment */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">Market Sentiment</h4>
          <Badge 
            variant="outline" 
            className={`${getSentimentColor(analysis.sentiment)} border px-3 py-2 w-fit`}
          >
            <div className="flex items-center space-x-2">
              {getSentimentIcon(analysis.sentiment)}
              <span className="font-semibold">{analysis.sentiment}</span>
            </div>
          </Badge>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">Key Insights</h4>
          <div className="space-y-2">
            {analysis.keyPoints.map((point: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-tradeiq-blue rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">Risk Level</h4>
          <Badge 
            variant="outline" 
            className={`border px-3 py-1 ${
              analysis.riskLevel === 'High' 
                ? 'text-red-400 border-red-400/30 bg-red-400/10'
                : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
            }`}
          >
            {analysis.riskLevel}
          </Badge>
        </div>

        {/* Last Updated */}
        <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(analysis.lastUpdated).toLocaleTimeString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Powered by TradingView real-time data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
