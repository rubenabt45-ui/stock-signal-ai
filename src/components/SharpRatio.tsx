import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface SharpRatioProps {
  asset: string;
}

// Simulated data generator
const generateSimulatedData = (asset: string) => {
  // Simulate different Sharpe ratios based on asset
  const baseRatio = Math.random() * 3.5;
  const ratio = parseFloat(baseRatio.toFixed(2));
  
  // Calculate metrics
  const annualReturn = (5 + Math.random() * 20).toFixed(2);
  const volatility = (8 + Math.random() * 15).toFixed(2);
  const riskFreeRate = 4.5;
  
  // Historical data for mini chart (last 12 months)
  const historicalRatios = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString('en', { month: 'short' }),
    value: parseFloat((ratio + (Math.random() - 0.5) * 0.8).toFixed(2))
  }));
  
  return {
    ratio,
    annualReturn,
    volatility,
    riskFreeRate,
    historicalRatios,
    performance: ratio > 2.0 ? 'excellent' : ratio > 1.0 ? 'good' : 'moderate'
  };
};

export const SharpRatio = ({ asset }: SharpRatioProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReturnType<typeof generateSimulatedData> | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    const timer = setTimeout(() => {
      setData(generateSimulatedData(asset));
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [asset]);

  const getRatioColor = (ratio: number) => {
    if (ratio >= 3.0) return "text-tradeiq-blue";
    if (ratio >= 2.0) return "text-tradeiq-warning";
    if (ratio >= 1.0) return "text-tradeiq-success";
    return "text-gray-400";
  };

  const getRatioLabel = (ratio: number) => {
    if (ratio >= 3.0) return { text: "Excellent", variant: "default" as const };
    if (ratio >= 2.0) return { text: "Very Good", variant: "secondary" as const };
    if (ratio >= 1.0) return { text: "Good", variant: "outline" as const };
    return { text: "Moderate", variant: "outline" as const };
  };

  return (
    <Card className="tradeiq-card flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Sharpe Ratio</CardTitle>
            <p className="text-xs text-gray-400 mt-1">Risk-adjusted return measurement</p>
          </div>
          {data && (
            <Badge variant={getRatioLabel(data.ratio).variant}>
              {getRatioLabel(data.ratio).text}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-800/50 h-full flex flex-col">
          {loading ? (
            <div className="space-y-4 animate-pulse flex-1">
              <div className="h-[120px] bg-gray-800/50 rounded-lg"></div>
              <div className="h-[80px] bg-gray-800/50 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-800/50 rounded w-full"></div>
                <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
              </div>
            </div>
          ) : data ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Main Ratio Display */}
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Current Sharpe Ratio</span>
                  {data.ratio >= 1.0 ? (
                    <TrendingUp className="h-4 w-4 text-tradeiq-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className={`text-4xl font-bold ${getRatioColor(data.ratio)} mb-1`}>
                  {data.ratio}
                </div>
                <div className="text-xs text-gray-500">Based on 12-month data</div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-800/50">
                  <div className="text-xs text-gray-400 mb-1">Annual Return</div>
                  <div className="text-lg font-semibold text-tradeiq-success">
                    {data.annualReturn}%
                  </div>
                </div>
                <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-800/50">
                  <div className="text-xs text-gray-400 mb-1">Volatility</div>
                  <div className="text-lg font-semibold text-tradeiq-warning">
                    {data.volatility}%
                  </div>
                </div>
                <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-800/50">
                  <div className="text-xs text-gray-400 mb-1">Risk-Free Rate</div>
                  <div className="text-lg font-semibold text-gray-300">
                    {data.riskFreeRate}%
                  </div>
                </div>
              </div>

              {/* Mini Historical Chart */}
              <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-800/50">
                <div className="text-xs text-gray-400 mb-2">12-Month Trend</div>
                <div className="flex items-end justify-between h-16 gap-1">
                  {data.historicalRatios.map((point, index) => {
                    const maxValue = Math.max(...data.historicalRatios.map(p => p.value));
                    const height = (point.value / maxValue) * 100;
                    const color = point.value >= 2.0 ? 'bg-tradeiq-blue' : 
                                  point.value >= 1.0 ? 'bg-tradeiq-success' : 'bg-gray-600';
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div 
                          className={`w-full ${color} rounded-t transition-all hover:opacity-80`}
                          style={{ height: `${height}%` }}
                          title={`${point.month}: ${point.value}`}
                        />
                        {index % 3 === 0 && (
                          <span className="text-[8px] text-gray-500 mt-1">{point.month}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div className="pt-3 border-t border-gray-800/50 mt-auto">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-tradeiq-blue" />
                  Understanding Sharpe Ratio
                </h4>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <p>
                    <span className="text-tradeiq-success font-medium">&gt; 1.0:</span> Good risk-adjusted returns
                  </p>
                  <p>
                    <span className="text-tradeiq-warning font-medium">&gt; 2.0:</span> Very good performance
                  </p>
                  <p>
                    <span className="text-tradeiq-blue font-medium">&gt; 3.0:</span> Excellent returns for the risk taken
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
