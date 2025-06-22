
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
    tvWidget: any;
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
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  // Fixed container ID for stable widget management
  const containerId = 'tv_chart_container';

  console.log(`[TV-DEBUG] ${new Date().toISOString()} - Chart Component: ${symbol} (${timeframe}) - Visible: ${isIntersecting}, Ready: ${chartReady}`);

  // Complete widget cleanup
  const destroyWidget = useCallback(() => {
    console.log(`[TV-CLEANUP] ${new Date().toISOString()} - Destroying widget for ${symbol}`);
    
    // Clear initialization timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
    
    // Destroy global widget instance
    if (window.tvWidget) {
      try {
        if (typeof window.tvWidget.remove === 'function') {
          window.tvWidget.remove();
        }
      } catch (e) {
        console.log(`[TV-CLEANUP] Widget removal error:`, e);
      }
      window.tvWidget = null;
    }
    
    // Destroy local widget reference
    if (widgetRef.current) {
      try {
        if (typeof widgetRef.current.remove === 'function') {
          widgetRef.current.remove();
        }
      } catch (e) {
        console.log(`[TV-CLEANUP] Local widget removal error:`, e);
      }
      widgetRef.current = null;
    }
    
    // Clear container completely
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.id = containerId;
    }
    
    setChartReady(false);
    setError(null);
  }, [symbol]);

  // Load TradingView script
  const loadTradingViewScript = useCallback(async (): Promise<boolean> => {
    if (window.TradingView) {
      setIsLoaded(true);
      setIsLoading(false);
      return true;
    }

    setIsLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      
      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
        console.log(`[TV-SCRIPT] ${new Date().toISOString()} - TradingView script loaded successfully`);
        resolve(true);
      };
      
      script.onerror = () => {
        setIsLoading(false);
        setError('Failed to load TradingView script');
        console.error(`[TV-SCRIPT] ${new Date().toISOString()} - Failed to load TradingView script`);
        resolve(false);
      };
      
      document.head.appendChild(script);
    });
  }, []);

  // Create widget with clean initialization
  const createWidget = useCallback(() => {
    if (!isLoaded || !containerRef.current || !isIntersecting) {
      return;
    }

    console.log(`[TV-INIT] ${new Date().toISOString()} - Creating TradingView widget for ${symbol} (${timeframe})`);
    
    // Ensure complete cleanup before creating new widget
    destroyWidget();
    
    // Wait a moment for cleanup to complete
    setTimeout(() => {
      try {
        // Ensure container is ready
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.id = containerId;
        }

        const baseConfig = getTradingViewConfig(actualTheme);
        
        const widgetConfig = {
          ...baseConfig,
          symbol: symbol,
          interval: getInterval(timeframe),
          height: 600,
          container_id: containerId,
          studies: [],
          autosize: true,
          overrides: {
            ...baseConfig.overrides,
            "paneProperties.background": actualTheme === 'dark' ? "#0f172a" : "#ffffff"
          }
        };

        const widget = new window.TradingView.widget(widgetConfig);
        widgetRef.current = widget;
        window.tvWidget = widget;

        console.log(`[TV-INIT] ${new Date().toISOString()} - TradingView widget created for ${symbol}`);

        // Set initialization timeout (10 seconds max)
        initTimeoutRef.current = setTimeout(() => {
          if (!chartReady) {
            console.warn(`[TV-TIMEOUT] ${new Date().toISOString()} - Widget initialization timeout for ${symbol}`);
            setError(`Chart failed to load within 10 seconds for ${symbol}`);
          }
        }, 10000);

        // Use onChartReady for reliable initialization
        widget.onChartReady(() => {
          console.log(`[TV-DEBUG] ${new Date().toISOString()} - Symbol Loaded: ${symbol}, Chart Ready`);
          
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
            initTimeoutRef.current = null;
          }
          
          // Set up widget for data extraction
          setTradingViewWidget(widget, symbol);
          setChartReady(true);
          setError(null);
          
          // Setup symbol change listener
          try {
            const chart = widget.activeChart();
            if (chart && chart.onSymbolChanged) {
              chart.onSymbolChanged().subscribe(null, () => {
                console.log(`[TV-SYMBOL] ${new Date().toISOString()} - Symbol changed detected for ${symbol}`);
              });
            }
          } catch (e) {
            console.log(`[TV-LISTENER] Setup warning:`, e);
          }
        });
        
      } catch (error) {
        console.error(`[TV-ERROR] ${new Date().toISOString()} - Error creating TradingView widget:`, error);
        setError(`Widget creation failed: ${error}`);
      }
    }, 100);
  }, [symbol, timeframe, actualTheme, isLoaded, containerId, isIntersecting, destroyWidget]);

  // Load script when component mounts
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadTradingViewScript();
    }
  }, [isLoaded, isLoading, loadTradingViewScript]);

  // Create/recreate widget when dependencies change
  useEffect(() => {
    createWidget();
    return destroyWidget;
  }, [symbol, timeframe, actualTheme, isLoaded, isIntersecting, createWidget, destroyWidget]);

  // Manual retry function
  const handleManualRetry = () => {
    setError(null);
    destroyWidget();
    
    if (!isLoaded) {
      loadTradingViewScript().then((success) => {
        if (success) {
          setTimeout(createWidget, 200);
        }
      });
    } else {
      setTimeout(createWidget, 200);
    }
  };

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
            onClick={handleManualRetry}
            className="px-4 py-2 bg-tradeiq-blue text-white rounded-lg hover:bg-tradeiq-blue/80 transition-colors"
          >
            Retry Chart
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
        id={containerId}
        className="w-full h-full" 
        style={{ 
          height: '600px',
          minHeight: '600px',
          overflow: 'hidden'
        }}
      />
      
      {/* Loading overlay when chart is not ready */}
      {!chartReady && isLoaded && !error && (
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
    console.log(`[TV-MEMO] ${new Date().toISOString()} - Re-rendering: ${prevProps.symbol} → ${nextProps.symbol}, ${prevProps.timeframe} → ${nextProps.timeframe}`);
  }
  
  return shouldNotRerender;
});
