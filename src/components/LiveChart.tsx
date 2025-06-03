
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { StockChart } from "@/components/StockChart";

interface LiveChartProps {
  asset: string;
  timeframe: string;
}

export const LiveChart = ({ asset, timeframe }: LiveChartProps) => {
  return (
    <Card className="tradeiq-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
          <div>
            <h3 className="text-xl font-bold text-white">{asset} Chart</h3>
            <p className="text-sm text-gray-400">{timeframe} • Live Data</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-tradeiq-success rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>
      
      <div className="h-80">
        <StockChart symbol={asset} />
      </div>
    </Card>
  );
};
