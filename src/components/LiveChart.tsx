
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Wifi, WifiOff, Activity } from "lucide-react";
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

  const getConnectionStatus = () => {
    if (error && error.includes('Maximum reconnection')) {
      return { text: 'Connection Failed', color: 'text-red-500', icon: WifiOff };
    }
    if (error && error.includes('reconnecting')) {
      return { text: 'Reconnecting...', color: 'text-yellow-500', icon: Activity };
    }
    if (error) {
      return { text: 'Error', color: 'text-red-500', icon: WifiOff };
    }
    if (!isConnected) {
      return { text: 'Connecting...', color: 'text-yellow-500', icon: Activity };
    }
    if (isConnected && !currentPriceData) {
      return { text: 'Waiting for data...', color: 'text-blue-500', icon: Activity };
    }
    return { text: 'Live Feed', color: 'text-green-500', icon: Wifi };
  };

  const connectionStatus = getConnectionStatus();
  const StatusIcon = connectionStatus.icon;

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
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-400">{timeframe} • Real-time Data</p>
              {currentPriceData && (
                <span className="text-xs text-gray-500">
                  Last update: {new Date(currentPriceData.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-1">⚠️ {error}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-5 w-5 ${connectionStatus.color}`} />
          <div className={`w-2 h-2 rounded-full ${
            isConnected && currentPriceData ? 'bg-green-500 animate-pulse' : 
            isConnected ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm font-medium ${connectionStatus.color}`}>
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
