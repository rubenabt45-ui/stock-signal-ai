
import { useEffect, useRef, useState, memo } from "react";
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

// Memoized component to prevent unnecessary re-renders
const TradingViewAdvancedChartComponent = ({ 
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

  // Debug logging to track re-renders
  useEffect(() => {
    console.log(`🔄 TradingViewAdvancedChart: Component rendered for ${symbol} (${timeframe})`);
  });

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

    console.log(`🎯 TradingView: Creating widget for ${symbol} (${timeframe}) - Theme: ${actualTheme}`);

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
        autosize: false,
        width: "100%",
        height: 600, // Fixed height for proper rendering
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
        // Remove scrollbars and ensure full content visibility
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        hide_volume: false
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
    <div 
      className={`bg-black/5 rounded-xl border border-gray-700/20 overflow-hidden w-full min-h-[600px] lg:min-h-[700px] ${className}`}
      style={{ 
        height: '600px',
        minHeight: '600px'
      }}
    >
      <div 
        ref={containerRef} 
        className="w-full h-full" 
        style={{ 
          height: '600px',
          minHeight: '600px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

// Export memoized component that only re-renders when symbol, timeframe, or theme changes
export const TradingViewAdvancedChart = memo(TradingViewAdvancedChartComponent, (prevProps, nextProps) => {
  // Only re-render if symbol, timeframe, height, or className actually change
  const shouldNotRerender = 
    prevProps.symbol === nextProps.symbol &&
    prevProps.timeframe === nextProps.timeframe &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className;
  
  if (shouldNotRerender) {
    console.log(`✅ TradingView: Skipping re-render for ${nextProps.symbol} - props unchanged`);
  } else {
    console.log(`🔄 TradingView: Re-rendering for ${nextProps.symbol} - props changed`);
  }
  
  return shouldNotRerender;
});
