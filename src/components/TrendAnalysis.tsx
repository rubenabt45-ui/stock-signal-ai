
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertCircle, Activity, BarChart3, Target } from "lucide-react";
import { useTradingViewWidgetData } from "@/hooks/useTradingViewWidgetData";
import { useState, useEffect } from "react";

interface TrendAnalysisProps {
  asset: string;
}

// Generate simulated technical analysis data
const generateTechnicalData = (price: number, change: number) => {
  // Support and Resistance levels
  const support1 = price * (1 - Math.random() * 0.05);
  const support2 = price * (1 - Math.random() * 0.10);
  const resistance1 = price * (1 + Math.random() * 0.05);
  const resistance2 = price * (1 + Math.random() * 0.10);
  
  // Volume analysis
  const volumeChange = (Math.random() * 40 - 20).toFixed(1); // -20% to +20%
  const volumeStatus = parseFloat(volumeChange) > 0 ? "Increasing" : "Decreasing";
  
  // RSI (Relative Strength Index)
  const rsi = Math.floor(30 + Math.random() * 40); // 30-70 range
  const rsiStatus = rsi > 65 ? "Overbought" : rsi < 35 ? "Oversold" : "Neutral";
  
  // MACD status
  const macdSignals = ["Bullish", "Bearish", "Neutral"];
  const macdStatus = change > 1 ? "Bullish" : change < -1 ? "Bearish" : "Neutral";
  
  // Trading signals
  const signals = [];
  if (rsi < 35 && change < -2) signals.push({ type: "Buy", reason: "Oversold + Downtrend" });
  if (rsi > 65 && change > 2) signals.push({ type: "Sell", reason: "Overbought + Uptrend" });
  if (Math.abs(change) < 1) signals.push({ type: "Hold", reason: "Consolidation" });
  
  return {
    support: [support1, support2],
    resistance: [resistance1, resistance2],
    volume: { change: volumeChange, status: volumeStatus },
    rsi: { value: rsi, status: rsiStatus },
    macd: macdStatus,
    signals: signals.length > 0 ? signals : [{ type: "Hold", reason: "Monitor closely" }]
  };
};

const analyzeTrendFromTradingView = (price: number | null, change: number | null) => {
  if (!price || change === null) return null;
  
  const changePercent = change;
  
  let direction = "Sideways";
  let strength = "Neutral";
  let color = "text-gray-400";
  let icon = <Minus className="h-5 w-5" />;
  
  if (changePercent > 1) {
    direction = "Uptrend";
    strength = changePercent > 3 ? "Strong" : "Moderate";
    color = "text-tradeiq-success";
    icon = <TrendingUp className="h-5 w-5" />;
  } else if (changePercent < -1) {
    direction = "Downtrend";
    strength = changePercent < -3 ? "Strong" : "Moderate";
    color = "text-tradeiq-danger";
    icon = <TrendingDown className="h-5 w-5" />;
  }
  
  return {
    direction,
    strength,
    color,
    icon,
    confidence: Math.min(95, 60 + Math.abs(changePercent) * 5),
    momentum: Math.abs(changePercent) > 2 ? "High" : "Low"
  };
};

export const TrendAnalysis = ({ asset }: TrendAnalysisProps) => {
  const { price, change, isLoading } = useTradingViewWidgetData(asset);
  const trendData = analyzeTrendFromTradingView(price, change);
  const [technicalData, setTechnicalData] = useState<ReturnType<typeof generateTechnicalData> | null>(null);

  useEffect(() => {
    if (price && change !== null) {
      setTechnicalData(generateTechnicalData(price, change));
    }
  }, [price, change]);

  if (isLoading) {
    return (
      <Card className="tradeiq-card flex flex-col h-full">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Trend Analysis</h3>
          </div>
          <div className="animate-pulse space-y-3 mt-4">
            <div className="h-5 bg-gray-700/30 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700/30 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!trendData) {
    return (
      <Card className="tradeiq-card flex flex-col h-full">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Trend Analysis</h3>
          </div>
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Waiting for TradingView data...</p>
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
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Trend Analysis</h3>
          </div>
          <Badge variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
            TradingView
          </Badge>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        {/* Trend Direction */}
        <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className={trendData.color}>
              {trendData.icon}
            </div>
            <div>
              <span className="text-white font-medium text-sm">Direction</span>
              <p className="text-xs text-gray-500">Current market trend</p>
            </div>
          </div>
          <Badge variant="outline" className={`${trendData.color} border-current/30 font-semibold text-xs`}>
            {trendData.direction}
          </Badge>
        </div>

        {/* Trend Strength */}
        <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800/50">
          <div>
            <span className="text-white font-medium text-sm">Strength</span>
            <p className="text-xs text-gray-500">Trend intensity</p>
          </div>
          <Badge variant="outline" className="border-gray-600 text-white font-semibold text-xs">
            {trendData.strength}
          </Badge>
        </div>

        {/* Confidence */}
        <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium text-sm">Confidence</span>
            <span className="text-white font-bold text-xs">{trendData.confidence.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div 
              className="bg-tradeiq-blue h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${trendData.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Current Data */}
        {change !== null && (
          <div className="pt-3 border-t border-gray-800/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Change:</span>
              <span className={change >= 0 ? "text-tradeiq-success font-semibold" : "text-tradeiq-danger font-semibold"}>
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-500">Momentum:</span>
              <span className="text-white font-medium">{trendData.momentum}</span>
            </div>
          </div>
        )}

        {/* Technical Indicators Section */}
        {technicalData && (
          <>
            {/* Support & Resistance */}
            <div className="pt-3 border-t border-gray-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-tradeiq-blue" />
                <span className="text-white font-medium text-sm">Key Levels</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                  <div className="text-[10px] text-gray-500 mb-1">RESISTANCE</div>
                  <div className="text-xs font-semibold text-tradeiq-danger">
                    ${technicalData.resistance[0].toFixed(2)}
                  </div>
                  <div className="text-[10px] text-gray-600">
                    ${technicalData.resistance[1].toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
                  <div className="text-[10px] text-gray-500 mb-1">SUPPORT</div>
                  <div className="text-xs font-semibold text-tradeiq-success">
                    ${technicalData.support[0].toFixed(2)}
                  </div>
                  <div className="text-[10px] text-gray-600">
                    ${technicalData.support[1].toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Volume Analysis */}
            <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-tradeiq-warning" />
                  <span className="text-white font-medium text-sm">Volume</span>
                </div>
                <Badge variant="outline" className={`text-xs ${parseFloat(technicalData.volume.change) > 0 ? 'text-tradeiq-success border-tradeiq-success/30' : 'text-tradeiq-danger border-tradeiq-danger/30'}`}>
                  {technicalData.volume.status}
                </Badge>
              </div>
              <div className="text-xs text-gray-400">
                {parseFloat(technicalData.volume.change) > 0 ? '+' : ''}{technicalData.volume.change}% vs avg
              </div>
            </div>

            {/* Technical Indicators Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* RSI */}
              <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/50">
                <div className="text-[10px] text-gray-500 mb-1">RSI (14)</div>
                <div className="text-lg font-bold text-white mb-1">
                  {technicalData.rsi.value}
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-[10px] ${
                    technicalData.rsi.status === 'Overbought' ? 'text-tradeiq-danger border-tradeiq-danger/30' :
                    technicalData.rsi.status === 'Oversold' ? 'text-tradeiq-success border-tradeiq-success/30' :
                    'text-gray-400 border-gray-600'
                  }`}
                >
                  {technicalData.rsi.status}
                </Badge>
              </div>

              {/* MACD */}
              <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/50">
                <div className="text-[10px] text-gray-500 mb-1">MACD Signal</div>
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className={`h-4 w-4 ${
                    technicalData.macd === 'Bullish' ? 'text-tradeiq-success' :
                    technicalData.macd === 'Bearish' ? 'text-tradeiq-danger' :
                    'text-gray-400'
                  }`} />
                  <span className="text-sm font-semibold text-white">{technicalData.macd}</span>
                </div>
                <div className="text-[10px] text-gray-500">12/26/9 EMA</div>
              </div>
            </div>

            {/* Trading Signals */}
            <div className="pt-3 border-t border-gray-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-tradeiq-blue" />
                <span className="text-white font-medium text-sm">Trading Signals</span>
              </div>
              <div className="space-y-2">
                {technicalData.signals.map((signal, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/20 rounded-lg p-2 border border-gray-700/50">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          signal.type === 'Buy' ? 'text-tradeiq-success border-tradeiq-success/30' :
                          signal.type === 'Sell' ? 'text-tradeiq-danger border-tradeiq-danger/30' :
                          'text-gray-400 border-gray-600'
                        }`}
                      >
                        {signal.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{signal.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
