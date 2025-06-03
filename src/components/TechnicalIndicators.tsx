
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
    if (rsi > 70) return { text: 'Overbought', color: 'text-red-400', icon: TrendingDown };
    if (rsi < 30) return { text: 'Oversold', color: 'text-emerald-400', icon: TrendingUp };
    return { text: 'Neutral', color: 'text-slate-400', icon: Minus };
  };

  const rsiSignal = getRSISignal(indicators.rsi);

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Technical Indicators</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* RSI */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">RSI (14)</span>
            <Badge variant="outline" className={`border-slate-600 ${rsiSignal.color}`}>
              {rsiSignal.text}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Value</span>
              <span className="text-white font-semibold">{indicators.rsi.toFixed(1)}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  indicators.rsi > 70 ? 'bg-red-400' : 
                  indicators.rsi < 30 ? 'bg-emerald-400' : 'bg-blue-400'
                }`}
                style={{ width: `${indicators.rsi}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* MACD */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">MACD</span>
            <div className="flex items-center space-x-1">
              {indicators.macd.signal === 'bullish' ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm ${
                indicators.macd.signal === 'bullish' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {indicators.macd.signal}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Value</span>
              <span className="text-white font-semibold">{indicators.macd.value.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Support & Resistance */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-400" />
            <span className="text-slate-300 font-medium">Key Levels</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Resistance</span>
              <span className="text-red-400 font-semibold">${indicators.resistance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Support</span>
              <span className="text-emerald-400 font-semibold">${indicators.support.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="space-y-3">
          <span className="text-slate-300 font-medium">Moving Averages</span>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">SMA (20)</span>
              <span className="text-white font-semibold">${indicators.movingAverages.sma20.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">SMA (50)</span>
              <span className="text-white font-semibold">${indicators.movingAverages.sma50.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">EMA (12)</span>
              <span className="text-white font-semibold">${indicators.movingAverages.ema12.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Volatility */}
        <div className="space-y-3">
          <span className="text-slate-300 font-medium">Volatility</span>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">30-Day</span>
              <span className="text-white font-semibold">{indicators.volatility.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  indicators.volatility > 30 ? 'bg-red-400' : 
                  indicators.volatility > 15 ? 'bg-yellow-400' : 'bg-emerald-400'
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
