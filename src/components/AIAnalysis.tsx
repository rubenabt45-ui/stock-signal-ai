
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
          bg: 'bg-emerald-500',
          text: 'text-white',
          icon: TrendingUp,
          iconColor: 'text-white'
        };
      case 'SELL':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: TrendingDown,
          iconColor: 'text-white'
        };
      default:
        return {
          bg: 'bg-yellow-500',
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
        <div className={`${style.bg} rounded-xl p-6`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <RecommendationIcon className={`h-6 w-6 ${style.iconColor}`} />
            <span className={`text-2xl font-bold ${style.text}`}>
              {analysis.recommendation}
            </span>
          </div>
          <p className={`${style.text} opacity-90`}>
            AI Confidence: {analysis.confidence}%
          </p>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-emerald-400 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${analysis.confidence}%` }}
          ></div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold">Key Targets</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Target Price</span>
            <span className="text-emerald-400 font-semibold">${analysis.targetPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Stop Loss</span>
            <span className="text-red-400 font-semibold">${analysis.stopLoss}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Time Horizon</span>
            <span className="text-white font-semibold">{analysis.timeHorizon} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Risk Level</span>
            <Badge variant="outline" className={`border-slate-600 ${
              analysis.riskLevel === 'Low' ? 'text-emerald-400' :
              analysis.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {analysis.riskLevel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Pattern Detection */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold">Pattern Detected</h4>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span className="text-white font-medium">{analysis.detectedPattern}</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold">AI Insights</h4>
        <div className="space-y-2">
          {analysis.keyInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-slate-300">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
        Get Detailed Report
      </Button>
    </div>
  );
};
