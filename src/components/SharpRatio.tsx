import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SharpRatioProps {
  asset: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const SharpRatio = ({ asset }: SharpRatioProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    setLoading(true);
    
    // Clean up previous widget
    if (widgetRef.current) {
      widgetRef.current = null;
    }
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Load TradingView script if not already loaded
    const initWidget = () => {
      if (containerRef.current && window.TradingView) {
        const symbol = asset.includes(':') ? asset : `NASDAQ:${asset}`;
        
        widgetRef.current = new window.TradingView.MiniChart({
          container_id: containerRef.current.id,
          symbol: symbol,
          locale: "en",
          width: "100%",
          height: "300",
          dateRange: "12M",
          colorTheme: "dark",
          trendLineColor: "#F7931A",
          underLineColor: "rgba(247, 147, 26, 0.3)",
          isTransparent: true,
          autosize: false,
          largeChartUrl: ""
        });
        
        setLoading(false);
      }
    };

    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-chart.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [asset]);

  return (
    <Card className="tradeiq-card flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-white">Sharpe Ratio</CardTitle>
        <p className="text-sm text-gray-400">Risk-adjusted return measurement</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 h-full flex flex-col">
          {loading ? (
            <div className="space-y-4 animate-pulse flex-1">
              <div className="h-[250px] bg-gray-800/50 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-800/50 rounded w-full"></div>
                <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* TradingView Chart */}
              <div 
                id={`sharpe-ratio-chart-${asset}`}
                ref={containerRef}
                style={{ minHeight: '250px', flex: 1 }}
                className="mb-4"
              />

              {/* Explanation */}
              <div className="pt-4 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-white mb-3">Understanding Sharpe Ratio</h4>
                <div className="space-y-2 text-xs text-gray-400">
                  <p>
                    <span className="text-tradeiq-success font-medium">&gt; 1.0:</span> Good risk-adjusted returns
                  </p>
                  <p>
                    <span className="text-tradeiq-warning font-medium">&gt; 2.0:</span> Very good performance
                  </p>
                  <p>
                    <span className="text-tradeiq-blue font-medium">&gt; 3.0:</span> Excellent returns for the risk taken
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
