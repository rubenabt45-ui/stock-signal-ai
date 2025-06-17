import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Wifi, WifiOff, Activity, AlertCircle } from "lucide-react";
import { StockChart } from "@/components/StockChart";
import { LivePriceBadge } from "@/components/LivePriceBadge";
import { useRealTimePriceContext } from "@/components/RealTimePriceProvider";
import { useMarketData } from "@/hooks/useMarketData";
import { useEffect } from "react";

interface LiveChartProps {
  asset: string;
  timeframe: string;
}

export const LiveChart = ({ asset, timeframe }: LiveChartProps) => {
  const { prices, isConnected, subscribe, error } = useRealTimePriceContext();
  const { price, change, isLoading: marketDataLoading, error: marketDataError, lastUpdated } = useMarketData(asset);
  
  useEffect(() => {
    console.log(`🎯 LiveChart: Subscribing to ${asset} with timeframe ${timeframe}`);
    subscribe([asset]);
  }, [asset, subscribe]);

  const currentPriceData = prices[asset];
  const displayPrice = currentPriceData?.currentPrice || price;
  const displayChange = currentPriceData?.change || change;
  
  const isPositive = displayChange && displayChange > 0;
  const isNegative = displayChange && displayChange < 0;

  const getConnectionStatus = () => {
    // Critical connection failures
    if (error && error.includes('Maximum reconnection')) {
      return { 
        text: 'Connection Failed', 
        color: 'text-red-500', 
        icon: WifiOff,
        description: 'Unable to establish real-time connection'
      };
    }
    
    // Market data unavailable
    if (marketDataError && !isConnected && !displayPrice) {
      return { 
        text: 'Data Unavailable', 
        color: 'text-red-500', 
        icon: AlertCircle,
        description: 'Market data service unavailable'
      };
    }
    
    // Reconnection attempts
    if (error && error.includes('reconnecting')) {
      return { 
        text: 'Reconnecting...', 
        color: 'text-yellow-500', 
        icon: Activity,
        description: 'Attempting to restore connection'
      };
    }
    
    // Other errors
    if (error && !displayPrice) {
      return { 
        text: 'Connection Error', 
        color: 'text-red-500', 
        icon: WifiOff,
        description: error
      };
    }
    
    // Loading states
    if (marketDataLoading && !displayPrice) {
      return { 
        text: 'Loading Data...', 
        color: 'text-blue-500', 
        icon: Activity,
        description: 'Fetching market data'
      };
    }
    
    if (!isConnected && !displayPrice) {
      return { 
        text: 'Connecting...', 
        color: 'text-yellow-500', 
        icon: Activity,
        description: 'Establishing connection'
      };
    }
    
    // Connected states
    if ((isConnected && currentPriceData) || (!isConnected && displayPrice)) {
      return { 
        text: 'Live Feed', 
        color: 'text-green-500', 
        icon: Wifi,
        description: 'Real-time data active'
      };
    }
    
    // Fallback
    return { 
      text: 'Demo Mode', 
      color: 'text-gray-500', 
      icon: Activity,
      description: 'Using simulated data'
    };
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
              <LivePriceBadge symbol={asset} />
              {displayPrice && displayChange !== undefined && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {isPositive && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {isNegative && <TrendingDown className="h-4 w-4 text-red-500" />}
                    <span className={`text-sm font-medium ${
                      isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {displayChange > 0 ? '+' : ''}
                      {displayChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-400">{timeframe} • Chart Analysis</p>
              {(lastUpdated || currentPriceData) && (
                <span className="text-xs text-gray-500">
                  Updated: {lastUpdated ? 
                    new Date(lastUpdated).toLocaleTimeString() : 
                    currentPriceData ? new Date(currentPriceData.timestamp).toLocaleTimeString() : ''
                  }
                </span>
              )}
            </div>
            {(error || marketDataError) && (
              <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{error || marketDataError}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <StatusIcon className={`h-5 w-5 ${connectionStatus.color}`} />
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus.text === 'Live Feed' ? 'bg-green-500 animate-pulse' : 
            connectionStatus.text.includes('Loading') || connectionStatus.text.includes('Connecting') ? 'bg-blue-500 animate-pulse' : 
            connectionStatus.text.includes('Reconnecting') ? 'bg-yellow-500 animate-pulse' : 
            connectionStatus.text.includes('Error') || connectionStatus.text.includes('Failed') ? 'bg-red-500' : 'bg-gray-500'
          }`}></div>
          <div className="text-right">
            <span className={`text-sm font-medium ${connectionStatus.color}`}>
              {connectionStatus.text}
            </span>
            <p className="text-xs text-gray-500">
              {connectionStatus.description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <StockChart symbol={asset} timeframe={timeframe} />
      </div>
    </Card>
  );
};
