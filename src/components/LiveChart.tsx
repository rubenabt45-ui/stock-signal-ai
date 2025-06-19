
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
    <div className="space-y-8">
      {/* Live Price Header - Now using real market data */}
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
              <BarChart3 className="h-7 w-7 text-tradeiq-blue" />
              <span>{asset} Live Price</span>
            </h2>
            {/* Updated to use real market data that matches TradingView */}
            <LivePriceDisplay symbol={asset} showSymbol={false} size="lg" />
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 text-sm text-gray-400 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Real-time Data</span>
            </div>
            <div className="bg-tradeiq-blue/20 px-3 py-1.5 rounded-lg border border-tradeiq-blue/30">
              <span className="text-sm font-bold text-tradeiq-blue">Timeframe: {timeframe}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced TradingView Chart - Synchronized with same symbol */}
      <Card className="tradeiq-card p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
            <div>
              <h3 className="text-xl font-bold text-white">{asset} Advanced Chart</h3>
              <p className="text-sm text-gray-400">Professional trading analysis powered by TradingView</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-500">Live</span>
          </div>
        </div>
        
        <div className="py-4">
          <TradingViewAdvancedChart 
            symbol={asset} 
            timeframe={timeframe}
            className="w-full"
            key={chartKey}
          />
        </div>
      </Card>

      {/* Future AI Chart Summary Container */}
      <div id="chart-summary-ai" className="hidden">
        {/* This container is prepared for future AI-powered chart interpretations */}
        <Card className="tradeiq-card p-6 rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-tradeiq-blue/20 rounded-lg flex items-center justify-center">
              <Activity className="h-4 w-4 text-tradeiq-blue" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Chart Analysis</h3>
              <p className="text-sm text-gray-400">Intelligent insights about price patterns and trends</p>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4 border border-gray-700/30">
            <p className="text-gray-400 text-center">AI analysis coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
