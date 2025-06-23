
import { Card } from "@/components/ui/card";
import { BarChart3, Activity } from "lucide-react";
import { OptimizedTradingViewWidget } from "@/components/OptimizedTradingViewWidget";
import { useEffect, useState, useRef } from "react";

interface LiveChartProps {
  asset: string;
}

export const LiveChart = ({ asset }: LiveChartProps) => {
  const [isChartReady, setIsChartReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Reset states when asset changes
  useEffect(() => {
    console.log(`🎯 LiveChart: Asset changed to ${asset} - resetting chart`);
    setIsChartReady(false);
    setHasError(false);
  }, [asset]);

  const handleChartReady = () => {
    console.log(`✅ LiveChart: Chart ready for ${asset}`);
    setIsChartReady(true);
    setHasError(false);
  };

  const handleChartError = (error: any) => {
    console.error(`❌ LiveChart: Chart error for ${asset}:`, error);
    setHasError(true);
    setIsChartReady(false);
  };

  if (hasError) {
    return (
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="text-center py-8">
          <p className="text-red-400 text-lg mb-2">⚠️ Chart data unavailable</p>
          <p className="text-gray-500 text-sm">TradingView service temporarily unavailable</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-tradeiq-blue/20 text-tradeiq-blue rounded-lg text-sm hover:bg-tradeiq-blue/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Professional TradingView Chart - Full Width */}
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
            <div>
              <h3 className="text-xl font-bold text-white">{asset} Professional Chart</h3>
              <p className="text-sm text-gray-400">Real-time trading analysis powered by TradingView</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isChartReady ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <span className={`text-sm font-medium ${isChartReady ? 'text-green-500' : 'text-yellow-500'}`}>
                {isChartReady ? 'Live' : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="w-full" ref={chartContainerRef}>
          <OptimizedTradingViewWidget 
            symbol={asset} 
            className="w-full"
            height="600px"
            onReady={handleChartReady}
            onError={handleChartError}
          />
        </div>
      </Card>
    </div>
  );
};
