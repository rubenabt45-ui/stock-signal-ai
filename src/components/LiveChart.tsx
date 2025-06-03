
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";
import { StockChart } from "@/components/StockChart";
import { useRealTimePriceContext } from "@/components/RealTimePriceProvider";
import { useEffect } from "react";

interface LiveChartProps {
  asset: string;
  timeframe: string;
}

export const LiveChart = ({ asset, timeframe }: LiveChartProps) => {
  const { prices, isConnected, subscribe, error } = useRealTimePriceContext();
  
  useEffect(() => {
    console.log(`🎯 LiveChart subscribing to ${asset}`);
    subscribe([asset]);
  }, [asset, subscribe]);

  const currentPriceData = prices[asset];
  const isPositive = currentPriceData?.change && currentPriceData.change > 0;
  const isNegative = currentPriceData?.change && currentPriceData.change < 0;

  // Connection status display
  const getConnectionStatus = () => {
    if (error) return { text: 'Error', color: 'text-red-500' };
    if (!isConnected) return { text: 'Connecting...', color: 'text-yellow-500' };
    if (isConnected && !currentPriceData) return { text: 'Waiting for data...', color: 'text-yellow-500' };
    return { text: 'Live Feed', color: 'text-green-500' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <Card className="tradeiq-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-white">{asset} Chart</h3>
              {currentPriceData && (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-white">
                    ${currentPriceData.currentPrice.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-1">
                    {isPositive && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {isNegative && <TrendingDown className="h-4 w-4 text-red-500" />}
                    <span className={`text-sm font-medium ${
                      isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {currentPriceData.change > 0 ? '+' : ''}
                      {currentPriceData.change.toFixed(2)} ({currentPriceData.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400">{timeframe} • Real-time Data</p>
            {error && (
              <p className="text-xs text-red-500 mt-1">⚠️ {error}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected && currentPriceData ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          <div className={`w-2 h-2 rounded-full ${
            isConnected && currentPriceData ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm ${connectionStatus.color}`}>
            {connectionStatus.text}
          </span>
        </div>
      </div>
      
      <div className="h-80">
        <StockChart symbol={asset} />
      </div>
    </Card>
  );
};
