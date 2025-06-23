
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { OptimizedTradingViewWidget } from "@/components/OptimizedTradingViewWidget";
import { LivePriceDisplay } from "@/components/LivePriceDisplay";
import { memo } from "react";

interface LiveChartProps {
  asset: string;
  timeframe: string;
}

const LiveChartComponent = ({ asset, timeframe }: LiveChartProps) => {
  return (
    <div className="space-y-6">
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
            <div>
              <h3 className="text-xl font-bold text-white">{asset} Live Chart</h3>
              <p className="text-sm text-gray-400">Real-time TradingView data only</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
          </div>
        </div>
        
        <div className="w-full">
          <OptimizedTradingViewWidget 
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

export const LiveChart = memo(LiveChartComponent, (prevProps, nextProps) => {
  const shouldNotRerender = 
    prevProps.asset === nextProps.asset &&
    prevProps.timeframe === nextProps.timeframe;
  
  if (!shouldNotRerender) {
    console.log(`🔄 LiveChart re-rendering: ${prevProps.asset} → ${nextProps.asset}, ${prevProps.timeframe} → ${nextProps.timeframe}`);
  }
  
  return shouldNotRerender;
});
