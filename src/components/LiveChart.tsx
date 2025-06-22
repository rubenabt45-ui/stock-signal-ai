
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
    console.log(`🔄 LiveChart: Symbol changed to ${asset} (${timeframe}) - forcing iframe refresh`);
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
              <p className="text-sm text-gray-400">Real-time trading analysis with live price data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Live Price Display - Fetched via API */}
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
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-500">Live</span>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          {/* TradingView Iframe Chart - Force remount with key change */}
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
