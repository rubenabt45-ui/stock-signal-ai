
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Target, Zap } from "lucide-react";

interface TechnicalIndicatorsProps {
  symbol: string;
}

// Generate mock technical indicators
const generateIndicators = () => {
  return {
    rsi: Math.random() * 100,
    macd: {
      value: (Math.random() - 0.5) * 2,
      signal: Math.random() > 0.5 ? 'bullish' : 'bearish'
    },
    movingAverages: {
      sma20: 150 + Math.random() * 20,
      sma50: 145 + Math.random() * 25,
      ema12: 152 + Math.random() * 18
    },
    support: 140 + Math.random() * 10,
    resistance: 165 + Math.random() * 15,
    volatility: Math.random() * 50 + 10
  };
};

export const TechnicalIndicators = ({ symbol }: TechnicalIndicatorsProps) => {
  const indicators = generateIndicators();
  
  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { text: 'Overbought', color: 'text-tradeiq-danger', icon: TrendingDown };
    if (rsi < 30) return { text: 'Oversold', color: 'text-tradeiq-success', icon: TrendingUp };
    return { text: 'Neutral', color: 'text-gray-400', icon: Minus };
  };

  const rsiSignal = getRSISignal(indicators.rsi);

  return (
    <Card className="tradeiq-card p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="h-6 w-6 text-tradeiq-warning" />
        <h3 className="text-xl font-bold text-white">Technical Indicators</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* RSI */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-semibold">RSI (14)</span>
            <Badge variant="outline" className={`border-gray-600 ${rsiSignal.color} font-bold`}>
              {rsiSignal.text}
            </Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Value</span>
              <span className="text-white font-bold text-lg">{indicators.rsi.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  indicators.rsi > 70 ? 'bg-tradeiq-danger' : 
                  indicators.rsi < 30 ? 'bg-tradeiq-success' : 'bg-tradeiq-blue'
                }`}
                style={{ width: `${indicators.rsi}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* MACD */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-semibold">MACD</span>
            <div className="flex items-center space-x-2">
              {indicators.macd.signal === 'bullish' ? (
                <TrendingUp className="h-4 w-4 text-tradeiq-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-tradeiq-danger" />
              )}
              <span className={`text-sm font-bold ${
                indicators.macd.signal === 'bullish' ? 'text-tradeiq-success' : 'text-tradeiq-danger'
              }`}>
                {indicators.macd.signal}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Value</span>
              <span className="text-white font-bold text-lg">{indicators.macd.value.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Support & Resistance */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-400" />
            <span className="text-gray-300 font-semibold">Key Levels</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm p-3 bg-black/20 rounded-xl">
              <span className="text-gray-400">Resistance</span>
              <span className="text-tradeiq-danger font-bold text-lg">${indicators.resistance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm p-3 bg-black/20 rounded-xl">
              <span className="text-gray-400">Support</span>
              <span className="text-tradeiq-success font-bold text-lg">${indicators.support.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="space-y-4">
          <span className="text-gray-300 font-semibold">Moving Averages</span>
          <div className="space-y-3">
            <div className="flex justify-between text-sm p-3 bg-black/20 rounded-xl">
              <span className="text-gray-400">SMA (20)</span>
              <span className="text-white font-bold">${indicators.movingAverages.sma20.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm p-3 bg-black/20 rounded-xl">
              <span className="text-gray-400">SMA (50)</span>
              <span className="text-white font-bold">${indicators.movingAverages.sma50.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm p-3 bg-black/20 rounded-xl">
              <span className="text-gray-400">EMA (12)</span>
              <span className="text-white font-bold">${indicators.movingAverages.ema12.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Volatility */}
        <div className="space-y-4">
          <span className="text-gray-300 font-semibold">Volatility</span>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">30-Day</span>
              <span className="text-white font-bold text-lg">{indicators.volatility.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  indicators.volatility > 30 ? 'bg-tradeiq-danger' : 
                  indicators.volatility > 15 ? 'bg-tradeiq-warning' : 'bg-tradeiq-success'
                }`}
                style={{ width: `${Math.min(indicators.volatility * 2, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
