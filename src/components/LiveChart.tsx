
import { Card } from "@/components/ui/card";
import { BarChart3, Activity } from "lucide-react";
import { TradingViewAdvancedChart } from "@/components/TradingViewAdvancedChart";
import { LivePriceDisplay } from "@/components/LivePriceDisplay";
import { useEffect, useState } from "react";

interface LiveChartProps {
  asset: string;
  timeframe: string;
}

export const LiveChart = ({ asset, timeframe }: LiveChartProps) => {
  const [chartKey, setChartKey] = useState(`${asset}-${timeframe}-${Date.now()}`);
  
  // Force chart regeneration when timeframe changes
  useEffect(() => {
    console.log(`🎯 LiveChart: Asset ${asset} timeframe changed to ${timeframe} - updating chart`);
    setChartKey(`${asset}-${timeframe}-${Date.now()}`);
  }, [asset, timeframe]);

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
            {/* Live Price Display */}
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
              <span className="text-sm font-medium text-green-500">Live</span>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          <TradingViewAdvancedChart 
            symbol={asset} 
            timeframe={timeframe}
            className="w-full"
            height="600px"
            key={chartKey}
          />
        </div>
      </Card>
    </div>
  );
};
