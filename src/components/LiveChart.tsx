
import { Card } from "@/components/ui/card";
import { BarChart3, Activity } from "lucide-react";
import { TradingViewWidget } from "@/components/TradingViewWidget";
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
    <div className="w-full" ref={chartContainerRef}>
      <TradingViewWidget 
        symbol={asset} 
        interval="240"
        timezone="Etc/UTC"
        theme="dark"
        locale="en"
      />
    </div>
  );
};
