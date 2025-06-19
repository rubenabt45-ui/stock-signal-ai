
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface TradingViewAdvancedChartProps {
  symbol: string;
  timeframe: string;
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

// Map our timeframes to TradingView intervals
const getInterval = (timeframe: string): string => {
  const intervalMap: Record<string, string> = {
    '1D': '15',      // 15 minutes for 1 day
    '1W': '1D',      // Daily for 1 week
    '1M': '1D',      // Daily for 1 month
    '3M': '1W',      // Weekly for 3 months
    '6M': '1W',      // Weekly for 6 months
    '1Y': '1M'       // Monthly for 1 year
  };
  return intervalMap[timeframe] || '1D';
};

export const TradingViewAdvancedChart = ({ 
  symbol, 
  timeframe, 
  height = "600px", 
  className = "" 
}: TradingViewAdvancedChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { actualTheme } = useTheme();
  
  const containerId = `tv-advanced-chart-${symbol}-${Date.now()}`;

  useEffect(() => {
    const loadTradingViewScript = () => {
      if (window.TradingView) {
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
        console.log('📈 TradingView Advanced Chart script loaded successfully');
      };
      script.onerror = () => {
        setIsLoading(false);
        console.error('❌ Failed to load TradingView Advanced Chart script');
      };
      
      document.head.appendChild(script);
    };

    loadTradingViewScript();
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    // Clean up previous widget
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        console.log('Widget cleanup:', e);
      }
    }

    // Clear container and set ID
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.id = containerId;
    }

    try {
      const widgetConfig = {
        autosize: true,
        symbol: symbol,
        interval: getInterval(timeframe),
        timezone: "Etc/UTC",
        theme: actualTheme === 'dark' ? 'dark' : 'light',
        style: "1", // Candlestick style
        locale: "en",
        toolbar_bg: actualTheme === 'dark' ? "#1e293b" : "#ffffff",
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        details: true,
        hotlist: true,
        calendar: true,
        studies: [
          "Volume@tv-basicstudies",
          "MACD@tv-basicstudies"
        ],
        container_id: containerId,
        width: "100%",
        height: "100%"
      };

      widgetRef.current = new window.TradingView.widget(widgetConfig);

      console.log(`📈 TradingView Advanced Chart loaded: ${symbol} (${timeframe}) with ${actualTheme} theme`);
    } catch (error) {
      console.error('❌ Error creating TradingView Advanced Chart widget:', error);
    }

    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.log('Widget cleanup on unmount:', e);
        }
      }
    };
  }, [symbol, timeframe, actualTheme, isLoaded, containerId]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-black/5 rounded-xl border border-gray-700/20 min-h-[600px] lg:min-h-[700px] h-[60vh] lg:h-[700px] ${className}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tradeiq-blue mx-auto"></div>
          <div>
            <p className="text-white font-medium">Loading Advanced Chart...</p>
            <p className="text-gray-400 text-sm">Initializing TradingView widget</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-black/5 rounded-xl border border-gray-700/20 min-h-[600px] lg:min-h-[700px] h-[60vh] lg:h-[700px] ${className}`}>
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg font-medium">Chart Unavailable</p>
          <p className="text-gray-500 text-sm">Failed to load the TradingView widget</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/5 rounded-xl border border-gray-700/20 overflow-hidden w-full min-h-[600px] lg:min-h-[700px] h-[60vh] lg:h-[700px] ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
