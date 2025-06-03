
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Minus, Target, Clock, AlertTriangle } from "lucide-react";

interface AISuggestionsProps {
  asset: string;
  timeframe: string;
}

const generateAISuggestion = () => {
  const recommendations = ['BUY', 'HOLD', 'SELL'];
  const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
  const confidence = Math.random() * 40 + 60; // 60-100%
  
  const reasons = {
    BUY: [
      'Strong upward momentum detected',
      'Bullish pattern formation confirmed',
      'Volume surge indicates institutional interest',
      'Breaking above key resistance level'
    ],
    SELL: [
      'Bearish divergence in momentum indicators',
      'Approaching key resistance level',
      'Decreasing volume suggests weakening trend',
      'Technical indicators showing overbought conditions'
    ],
    HOLD: [
      'Consolidation phase in progress',
      'Mixed signals from technical indicators',
      'Awaiting clear directional breakout',
      'Current risk-reward ratio unfavorable'
    ]
  };

  const selectedReasons = reasons[recommendation as keyof typeof reasons].slice(0, 2);
  
  return {
    recommendation,
    confidence: confidence.toFixed(0),
    reasons: selectedReasons,
    targetPrice: (150 + Math.random() * 50).toFixed(2),
    timeHorizon: Math.floor(Math.random() * 14) + 3 // 3-17 days
  };
};

export const AISuggestions = ({ asset, timeframe }: AISuggestionsProps) => {
  const suggestion = generateAISuggestion();
  
  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return {
          bg: 'bg-gradient-to-r from-tradeiq-success to-emerald-400',
          text: 'text-white',
          icon: TrendingUp,
          iconColor: 'text-white',
          borderColor: 'border-tradeiq-success/30'
        };
      case 'SELL':
        return {
          bg: 'bg-gradient-to-r from-tradeiq-danger to-red-400',
          text: 'text-white',
          icon: TrendingDown,
          iconColor: 'text-white',
          borderColor: 'border-tradeiq-danger/30'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-tradeiq-warning to-yellow-400',
          text: 'text-black',
          icon: Minus,
          iconColor: 'text-black',
          borderColor: 'border-tradeiq-warning/30'
        };
    }
  };

  const style = getRecommendationStyle(suggestion.recommendation);
  const RecommendationIcon = style.icon;

  return (
    <Card className="tradeiq-card p-6 rounded-2xl h-fit">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">AI Suggestions</h3>
      </div>

      <div className="space-y-6">
        {/* Main Recommendation */}
        <div className="text-center space-y-4">
          <div className={`${style.bg} rounded-2xl p-6 shadow-lg`}>
            <div className="flex items-center justify-center space-x-3 mb-3">
              <RecommendationIcon className={`h-8 w-8 ${style.iconColor}`} />
              <span className={`text-3xl font-bold ${style.text}`}>
                {suggestion.recommendation}
              </span>
            </div>
            <p className={`${style.text} opacity-90 font-medium`}>
              AI Confidence: {suggestion.confidence}%
            </p>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-tradeiq-blue to-blue-400 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${suggestion.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg">Key Insights</h4>
          <div className="space-y-3">
            {suggestion.reasons.map((reason, index) => (
              <div key={index} className="flex items-start space-x-3 text-sm bg-black/20 p-3 rounded-xl">
                <div className="w-2 h-2 bg-tradeiq-blue rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300 leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target & Timeline */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg">Targets</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 bg-black/20 rounded-xl border ${style.borderColor}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-tradeiq-blue" />
                <span className="text-gray-400 text-sm">Target Price</span>
              </div>
              <span className="text-white font-bold text-lg">${suggestion.targetPrice}</span>
            </div>
            
            <div className="p-4 bg-black/20 rounded-xl border border-gray-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-tradeiq-blue" />
                <span className="text-gray-400 text-sm">Time Horizon</span>
              </div>
              <span className="text-white font-bold text-lg">{suggestion.timeHorizon} days</span>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-200 font-semibold text-sm mb-1">Risk Disclaimer</p>
              <p className="text-yellow-200/80 text-xs leading-relaxed">
                AI suggestions are for informational purposes only. Always conduct your own research and consider your risk tolerance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
