
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { getTradingViewConfig } from "@/utils/tradingViewConfig";
import { setTradingViewWidget } from "@/hooks/useTradingViewWidgetData";

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

// Map timeframes to TradingView intervals
const getInterval = (timeframe: string): string => {
  const intervalMap: Record<string, string> = {
    '1D': '15',
    '1W': '1D',
    '1M': '1D',
    '3M': '1W',
    '6M': '1W',
    '1Y': '1M'
  };
  return intervalMap[timeframe] || '1D';
};

const TradingViewAdvancedChartComponent = ({ 
  symbol, 
  timeframe, 
  height = "600px", 
  className = "" 
}: TradingViewAdvancedChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const cleanupRef = useRef<() => void>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { actualTheme } = useTheme();
  
  // Force chart to be visible for data extraction
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '50px',
    triggerOnce: false
  });
  
  // Generate unique container ID for each symbol/timeframe combination
  const containerId = `tradingview-chart-${symbol}-${timeframe}-${Date.now()}`;

  console.log(`🎯 [${new Date().toLocaleTimeString()}] TradingView Chart: ${symbol} (${timeframe}) - Visible: ${isIntersecting}, Ready: ${chartReady}`);

  // Load TradingView script
  const loadTradingViewScript = useCallback(() => {
    if (window.TradingView) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      console.log(`📊 [${new Date().toLocaleTimeString()}] TradingView script loaded successfully`);
    };
    script.onerror = () => {
      setIsLoading(false);
      setError('Failed to load TradingView script');
      console.error(`❌ [${new Date().toLocaleTimeTime()}] Failed to load TradingView script`);
    };
    
    document.head.appendChild(script);
  }, []);

  // Load script when component mounts
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadTradingViewScript();
    }
  }, [isLoaded, isLoading, loadTradingViewScript]);

  // Cleanup function
  const cleanupWidget = useCallback(() => {
    console.log(`🧹 [${new Date().toLocaleTimeString()}] Cleaning up widget for ${symbol}`);
    
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = undefined;
    }
    
    if (widgetRef.current) {
      try {
        if (typeof widgetRef.current.remove === 'function') {
          widgetRef.current.remove();
        }
      } catch (e) {
        console.log('Widget cleanup error:', e);
      }
      widgetRef.current = null;
    }
    
    setChartReady(false);
    setError(null);
  }, [symbol]);

  // Create/recreate widget when symbol or timeframe changes
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !isIntersecting) {
      return;
    }

    console.log(`🔄 [${new Date().toLocaleTimeString()}] Creating TradingView widget for ${symbol} (${timeframe})`);
    
    // Cleanup previous widget
    cleanupWidget();

    // Clear container and set new ID
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.id = containerId;
    }

    try {
      const baseConfig = getTradingViewConfig(actualTheme);
      
      const widgetConfig = {
        ...baseConfig,
        symbol: symbol,
        interval: getInterval(timeframe),
        height: 600,
        container_id: containerId,
        
        // Minimal studies for performance
        studies: [],
        
        // Force widget refresh
        autosize: true,
        
        // Theme-based overrides
        overrides: {
          ...baseConfig.overrides,
          "paneProperties.background": actualTheme === 'dark' ? "#0f172a" : "#ffffff"
        }
      };

      const widget = new window.TradingView.widget(widgetConfig);
      widgetRef.current = widget;

      console.log(`📊 [${new Date().toLocaleTimeString()}] TradingView widget created for ${symbol}`);

      // Setup cleanup function
      cleanupRef.current = () => {
        try {
          if (widget && typeof widget.remove === 'function') {
            widget.remove();
          }
        } catch (e) {
          console.log('Widget removal error:', e);
        }
      };

      // Set widget reference for data extraction (enhanced method)
      setTimeout(() => {
        setTradingViewWidget(widget, symbol);
        setChartReady(true);
      }, 1000);

      console.log(`✅ [${new Date().toLocaleTimeString()}] TradingView widget setup complete for ${symbol} (${timeframe})`);
      
    } catch (error) {
      console.error(`❌ [${new Date().toLocaleTimeString()}] Error creating TradingView widget:`, error);
      setError(`Failed to create TradingView widget: ${error}`);
      setChartReady(false);
    }

    return cleanupWidget;
  }, [symbol, timeframe, actualTheme, isLoaded, containerId, isIntersecting, cleanupWidget]);

  if (error) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/5 rounded-xl border border-red-500/20 min-h-[600px] ${className}`}
      >
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg font-medium">Chart Error</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              loadTradingViewScript();
            }}
            className="px-4 py-2 bg-tradeiq-blue text-white rounded-lg hover:bg-tradeiq-blue/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isIntersecting) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/5 rounded-xl border border-gray-700/20 min-h-[600px] ${className}`}
      >
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border border-tradeiq-blue/40 rounded-full mx-auto"></div>
          <div>
            <p className="text-white font-medium">Chart loading when visible...</p>
            <p className="text-gray-400 text-sm">Symbol: {symbol}</p>
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
          <div className="animate-pulse rounded-full h-8 w-8 bg-tradeiq-blue/40 mx-auto"></div>
          <div>
            <p className="text-white font-medium">Loading TradingView...</p>
            <p className="text-gray-400 text-sm">Initializing chart for {symbol}</p>
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
          <p className="text-gray-500 text-sm">Failed to load TradingView for {symbol}</p>
          <button 
            onClick={loadTradingViewScript}
            className="px-4 py-2 bg-tradeiq-blue text-white rounded-lg hover:bg-tradeiq-blue/80 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={targetRef}
      className={`bg-black/5 rounded-xl border border-gray-700/20 overflow-hidden w-full min-h-[600px] relative ${className}`}
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
      
      {/* Loading overlay when chart is not ready */}
      {!chartReady && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tradeiq-blue mx-auto"></div>
            <p className="text-white text-sm">Initializing chart...</p>
            <p className="text-gray-400 text-xs">{symbol} - {timeframe}</p>
          </div>
        </div>
      )}
      
      {/* Ready indicator */}
      {chartReady && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-500 text-xs font-medium">Live</span>
        </div>
      )}
    </div>
  );
};

// Enhanced memo comparator to force re-render on symbol/timeframe change
export const TradingViewAdvancedChart = memo(TradingViewAdvancedChartComponent, (prevProps, nextProps) => {
  const shouldNotRerender = 
    prevProps.symbol === nextProps.symbol &&
    prevProps.timeframe === nextProps.timeframe &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className;
  
  if (!shouldNotRerender) {
    console.log(`🔄 [${new Date().toLocaleTimeString()}] TradingView re-rendering: ${prevProps.symbol} → ${nextProps.symbol}, ${prevProps.timeframe} → ${nextProps.timeframe}`);
  }
  
  return shouldNotRerender;
});
