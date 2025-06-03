
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, CheckCircle } from "lucide-react";

interface AIAnalysisProps {
  symbol: string;
  stockData: any;
}

// Generate mock AI analysis
const generateAIAnalysis = (stockData: any) => {
  const isPositive = parseFloat(stockData.change) > 0;
  const recommendations = ['BUY', 'HOLD', 'SELL'];
  const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
  
  const confidence = Math.random() * 40 + 60; // 60-100%
  
  const patterns = [
    'Head and Shoulders',
    'Double Bottom',
    'Ascending Triangle',
    'Bull Flag',
    'Cup and Handle',
    'Descending Wedge'
  ];
  
  const detectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  const insights = [
    'Strong momentum indicators suggest continued upward movement',
    'Volume analysis shows increased institutional interest',
    'Technical patterns indicate potential breakout above resistance',
    'Risk-reward ratio favors current entry point',
    'Market sentiment remains bullish despite recent volatility'
  ];
  
  return {
    recommendation,
    confidence: confidence.toFixed(1),
    targetPrice: (parseFloat(stockData.price) * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2),
    stopLoss: (parseFloat(stockData.price) * (1 - Math.random() * 0.1)).toFixed(2),
    timeHorizon: Math.floor(Math.random() * 30) + 7, // 7-37 days
    detectedPattern,
    keyInsights: insights.slice(0, 3),
    riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
  };
};

export const AIAnalysis = ({ symbol, stockData }: AIAnalysisProps) => {
  const analysis = generateAIAnalysis(stockData);
  
  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return {
          bg: 'bg-gradient-to-r from-tradeiq-success to-emerald-400',
          text: 'text-white',
          icon: TrendingUp,
          iconColor: 'text-white'
        };
      case 'SELL':
        return {
          bg: 'bg-gradient-to-r from-tradeiq-danger to-red-400',
          text: 'text-white',
          icon: TrendingDown,
          iconColor: 'text-white'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-tradeiq-warning to-yellow-400',
          text: 'text-black',
          icon: Minus,
          iconColor: 'text-black'
        };
    }
  };

  const style = getRecommendationStyle(analysis.recommendation);
  const RecommendationIcon = style.icon;

  return (
    <div className="space-y-6">
      {/* Main Recommendation */}
      <div className="text-center space-y-4">
        <div className={`${style.bg} rounded-2xl p-6 shadow-lg`}>
          <div className="flex items-center justify-center space-x-3 mb-3">
            <RecommendationIcon className={`h-7 w-7 ${style.iconColor}`} />
            <span className={`text-3xl font-bold ${style.text}`}>
              {analysis.recommendation}
            </span>
          </div>
          <p className={`${style.text} opacity-90 font-medium`}>
            AI Confidence: {analysis.confidence}%
          </p>
        </div>
        
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-tradeiq-blue to-blue-400 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${analysis.confidence}%` }}
          ></div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <h4 className="text-white font-bold text-lg">Key Targets</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
            <span className="text-gray-400 font-medium">Target Price</span>
            <span className="text-tradeiq-success font-bold text-lg">${analysis.targetPrice}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
            <span className="text-gray-400 font-medium">Stop Loss</span>
            <span className="text-tradeiq-danger font-bold text-lg">${analysis.stopLoss}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
            <span className="text-gray-400 font-medium">Time Horizon</span>
            <span className="text-white font-bold text-lg">{analysis.timeHorizon} days</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
            <span className="text-gray-400 font-medium">Risk Level</span>
            <Badge variant="outline" className={`border-gray-600 font-bold ${
              analysis.riskLevel === 'Low' ? 'text-tradeiq-success border-tradeiq-success/30' :
              analysis.riskLevel === 'Medium' ? 'text-tradeiq-warning border-tradeiq-warning/30' : 'text-tradeiq-danger border-tradeiq-danger/30'
            }`}>
              {analysis.riskLevel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Pattern Detection */}
      <div className="space-y-4">
        <h4 className="text-white font-bold text-lg">Pattern Detected</h4>
        <div className="bg-black/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-tradeiq-success" />
            <span className="text-white font-semibold text-lg">{analysis.detectedPattern}</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="space-y-4">
        <h4 className="text-white font-bold text-lg">AI Insights</h4>
        <div className="space-y-3">
          {analysis.keyInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 text-sm bg-black/10 p-3 rounded-xl">
              <div className="w-2 h-2 bg-tradeiq-blue rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300 leading-relaxed">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Button className="w-full tradeiq-button-primary h-12 text-lg font-semibold rounded-xl">
        Get Detailed Report
      </Button>
    </div>
  );
};
