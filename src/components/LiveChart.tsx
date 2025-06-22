
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { TradingViewAdvancedChart } from "@/components/TradingViewAdvancedChart";
import { LivePriceDisplay } from "@/components/LivePriceDisplay";
import { useEffect, useState } from "react";

interface LiveChartProps {
  asset: string;
  timeframe: string;
}

export const LiveChart = ({ asset, timeframe }: LiveChartProps) => {
  const [chartKey, setChartKey] = useState(0);
  
  // Force chart to remount when asset or timeframe changes
  useEffect(() => {
    console.log(`🔄 LiveChart: Switched to symbol ${asset} (${timeframe}) - refreshing chart at ${new Date().toLocaleTimeString()}`);
    setChartKey(prev => prev + 1);
  }, [asset, timeframe]);

  return (
    <div className="space-y-6">
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
            <div>
              <h3 className="text-xl font-bold text-white">{asset} Professional Chart</h3>
              <p className="text-sm text-gray-400">100% synchronized with TradingView chart data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Live Price Display - Synced with TradingView */}
            <div className="text-right">
              <LivePriceDisplay 
                symbol={asset} 
                showSymbol={false} 
                size="md" 
              />
            </div>
            
            <div className="bg-tradeiq-blue/20 px-3 py-1.5 rounded-lg border border-tradeiq-blue/30">
              <span className="text-sm font-bold text-tradeiq-blue">Timeframe: {timeframe}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-500">Chart Synced</span>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          {/* TradingView Chart - Single Source of Truth */}
          <TradingViewAdvancedChart 
            key={`${asset}-${timeframe}-${chartKey}`}
            symbol={asset} 
            timeframe={timeframe}
            className="w-full"
            height="600px"
          />
        </div>
      </Card>
    </div>
  );
};
