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
    <Card className="h-full flex flex-col bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-tradeiq-blue" />
          Sharpe Ratio
        </CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          Retorno ajustado por riesgo
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-[300px] bg-gray-800/50 rounded-lg"></div>
            <div className="h-16 bg-gray-800/50 rounded-lg"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* TradingView Chart */}
            <div className="bg-gray-900/80 rounded-lg overflow-hidden border border-gray-800">
              <div 
                id={`sharpe-ratio-chart-${asset}`}
                ref={containerRef}
                style={{ minHeight: '300px' }}
              />
            </div>

            {/* Explanation */}
            <div className="space-y-2 p-4 bg-gray-800/30 rounded-lg border border-gray-800">
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">Sharpe &gt; 1</strong> → Very good (the reward compensates for the risk).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">Sharpe 0 to 1</strong> → Positive, but moderate (there is profit, although not outstanding).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">Sharpe &lt; 0</strong> → Bad, means the risk does not compensate, a risk-free bond is better.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
