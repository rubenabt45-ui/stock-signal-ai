
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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

// Optimized component with lazy loading and better performance
const TradingViewAdvancedChartComponent = ({ 
  symbol, 
  timeframe, 
  height = "600px", 
  className = "" 
}: TradingViewAdvancedChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { actualTheme } = useTheme();
  
  // Lazy loading with intersection observer
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px', // Load when getting close
    triggerOnce: true
  });
  
  const containerId = useRef(`tv-advanced-chart-${symbol}-${Date.now()}`).current;

  // Debug logging to track performance
  useEffect(() => {
    console.log(`🎯 TradingViewAdvancedChart: ${symbol} (${timeframe}) - Visible: ${isIntersecting}`);
  });

  // Memoized script loading
  const loadTradingViewScript = useCallback(() => {
    if (!isIntersecting) return;
    
    if (window.TradingView) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      console.log('📈 TradingView Advanced Chart script loaded');
    };
    script.onerror = () => {
      setIsLoading(false);
      console.error('❌ Failed to load TradingView Advanced Chart script');
    };
    
    document.head.appendChild(script);
  }, [isIntersecting]);

  useEffect(() => {
    if (isIntersecting && !isLoaded && !isLoading) {
      loadTradingViewScript();
    }
  }, [isIntersecting, isLoaded, isLoading, loadTradingViewScript]);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !isIntersecting) return;

    console.log(`🎯 TradingView: Creating optimized widget for ${symbol} (${timeframe})`);

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
      // Highly optimized widget configuration
      const widgetConfig = {
        autosize: false,
        width: "100%",
        height: 600,
        symbol: symbol,
        interval: getInterval(timeframe),
        timezone: "Etc/UTC",
        theme: actualTheme === 'dark' ? 'dark' : 'light',
        style: "1", // Candlestick style
        locale: "en",
        toolbar_bg: actualTheme === 'dark' ? "#1e293b" : "#ffffff",
        // Performance optimizations
        enable_publishing: false,
        withdateranges: false,
        hide_side_toolbar: true,
        allow_symbol_change: false,
        details: false,
        hotlist: false,
        calendar: false,
        hide_volume: false,
        hide_legend: false,
        save_image: false,
        // Minimal studies to reduce load
        studies: [
          "Volume@tv-basic-study"
        ],
        // Performance-oriented overrides
        overrides: {
          "paneProperties.background": actualTheme === 'dark' ? "#0f172a" : "#ffffff",
          "paneProperties.backgroundType": "solid",
          "mainSeriesProperties.candleStyle.upColor": "#2563eb",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor": "#2563eb",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#2563eb",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444"
        },
        container_id: containerId,
      };

      widgetRef.current = new window.TradingView.widget(widgetConfig);
      console.log(`📈 Optimized TradingView chart created: ${symbol} (${timeframe})`);
    } catch (error) {
      console.error('❌ Error creating optimized TradingView widget:', error);
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
  }, [symbol, timeframe, actualTheme, isLoaded, containerId, isIntersecting]);

  if (!isIntersecting) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/5 rounded-xl border border-gray-700/20 min-h-[600px] ${className}`}
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-tradeiq-blue/30 rounded-full mx-auto"></div>
          <div>
            <p className="text-white font-medium">Chart loading when visible...</p>
            <p className="text-gray-400 text-sm">Performance optimized</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/5 rounded-xl border border-gray-700/20 min-h-[600px] ${className}`}
      >
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
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/5 rounded-xl border border-gray-700/20 min-h-[600px] ${className}`}
      >
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg font-medium">Chart Unavailable</p>
          <p className="text-gray-500 text-sm">Failed to load the TradingView widget</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={targetRef}
      className={`bg-black/5 rounded-xl border border-gray-700/20 overflow-hidden w-full min-h-[600px] ${className}`}
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

// Export heavily memoized component for maximum performance
export const TradingViewAdvancedChart = memo(TradingViewAdvancedChartComponent, (prevProps, nextProps) => {
  // Only re-render if symbol or timeframe actually change
  const shouldNotRerender = 
    prevProps.symbol === nextProps.symbol &&
    prevProps.timeframe === nextProps.timeframe &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className;
  
  if (shouldNotRerender) {
    console.log(`✅ TradingView: Performance skip for ${nextProps.symbol} - no changes`);
  } else {
    console.log(`🔄 TradingView: Re-rendering ${nextProps.symbol} - props changed`);
  }
  
  return shouldNotRerender;
});
