
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
  const retryCountRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { actualTheme } = useTheme();
  
  // Force chart to be visible for data extraction
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '50px',
    triggerOnce: false
  });
  
  // Generate unique container ID for each symbol/timeframe combination
  const containerId = `tradingview-chart-${symbol}-${timeframe}-${Date.now()}`;

  console.log(`🎯 [${new Date().toLocaleTimeString()}] TradingView Chart: ${symbol} (${timeframe}) - Visible: ${isIntersecting}, Ready: ${chartReady}, Retries: ${retryCountRef.current}`);

  // Load TradingView script with retry logic
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
        console.log(`📊 [${new Date().toLocaleTimeString()}] TradingView script loaded successfully`);
        resolve(true);
      };
      
      script.onerror = () => {
        setIsLoading(false);
        setError('Failed to load TradingView script');
        console.error(`❌ [${new Date().toLocaleTimeString()}] Failed to load TradingView script`);
        resolve(false);
      };
      
      document.head.appendChild(script);
    });
  }, []);

  // Enhanced cleanup function
  const cleanupWidget = useCallback(() => {
    console.log(`🧹 [${new Date().toLocaleTimeString()}] Cleaning up widget for ${symbol}`);
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Run custom cleanup
    if (cleanupRef.current) {
      try {
        cleanupRef.current();
      } catch (e) {
        console.log('Custom cleanup error:', e);
      }
      cleanupRef.current = undefined;
    }
    
    // Remove widget
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

  // Retry widget creation with exponential backoff
  const retryWidgetCreation = useCallback(async () => {
    const maxRetries = 3;
    
    if (retryCountRef.current >= maxRetries) {
      setError(`Widget failed to initialize after ${maxRetries} attempts`);
      setIsRetrying(false);
      console.error(`❌ [${new Date().toLocaleTimeString()}] Widget initialization failed permanently for ${symbol}`);
      return;
    }

    retryCountRef.current++;
    setIsRetrying(true);
    
    console.log(`🔄 [${new Date().toLocaleTimeString()}] Retrying widget creation for ${symbol} (attempt ${retryCountRef.current}/${maxRetries})`);
    
    // Wait with exponential backoff
    const delay = Math.pow(2, retryCountRef.current - 1) * 1000; // 1s, 2s, 4s
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Clean up previous attempt
    cleanupWidget();
    
    // Try again
    createWidget();
  }, [symbol, cleanupWidget]);

  // Create widget with robust error handling
  const createWidget = useCallback(() => {
    if (!isLoaded || !containerRef.current || !isIntersecting) {
      return;
    }

    console.log(`🔄 [${new Date().toLocaleTimeString()}] Creating TradingView widget for ${symbol} (${timeframe})`);
    
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
        studies: [],
        autosize: true,
        overrides: {
          ...baseConfig.overrides,
          "paneProperties.background": actualTheme === 'dark' ? "#0f172a" : "#ffffff"
        }
      };

      const widget = new window.TradingView.widget(widgetConfig);
      widgetRef.current = widget;

      console.log(`📊 [${new Date().toLocaleTimeString()}] TradingView widget created for ${symbol}`);

      // Set up initialization timeout (10 seconds)
      timeoutRef.current = setTimeout(() => {
        if (!chartReady) {
          console.warn(`⏰ [${new Date().toLocaleTimeString()}] Widget initialization timeout for ${symbol}`);
          retryWidgetCreation();
        }
      }, 10000);

      // Enhanced widget ready detection
      const initializeWidget = () => {
        try {
          // Method 1: Use onChartReady if available
          if (widget.onChartReady && typeof widget.onChartReady === 'function') {
            console.log(`📊 [${new Date().toLocaleTimeString()}] Using onChartReady for ${symbol}`);
            
            widget.onChartReady(() => {
              console.log(`✅ [TV-DEBUG] Symbol Loaded: ${symbol}, Chart Ready: ${new Date().toLocaleTimeString()}`);
              
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              
              setupWidgetListeners(widget, symbol);
              setTradingViewWidget(widget, symbol);
              setChartReady(true);
              setIsRetrying(false);
              retryCountRef.current = 0; // Reset retry count on success
            });
          } else {
            // Method 2: Polling fallback
            console.log(`⏰ [${new Date().toLocaleTimeString()}] Using polling fallback for ${symbol}`);
            let attempts = 0;
            const maxAttempts = 50;
            
            const pollForReady = () => {
              attempts++;
              
              try {
                const chart = widget.activeChart && widget.activeChart();
                if (chart && chart.symbol) {
                  console.log(`✅ [TV-DEBUG] Symbol Loaded: ${symbol}, Chart Ready: ${new Date().toLocaleTimeString()} (polling attempt ${attempts})`);
                  
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                  }
                  
                  setupWidgetListeners(widget, symbol);
                  setTradingViewWidget(widget, symbol);
                  setChartReady(true);
                  setIsRetrying(false);
                  retryCountRef.current = 0;
                  return;
                }
              } catch (e) {
                // Continue polling
              }
              
              if (attempts < maxAttempts) {
                setTimeout(pollForReady, 200);
              } else {
                console.error(`❌ [${new Date().toLocaleTimeString()}] Widget polling failed after ${attempts} attempts for ${symbol}`);
                retryWidgetCreation();
              }
            };
            
            setTimeout(pollForReady, 500);
          }
        } catch (error) {
          console.error(`❌ [${new Date().toLocaleTimeString()}] Widget initialization error for ${symbol}:`, error);
          retryWidgetCreation();
        }
      };

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

      // Initialize with delay
      setTimeout(initializeWidget, 100);
      
    } catch (error) {
      console.error(`❌ [${new Date().toLocaleTimeString()}] Error creating TradingView widget:`, error);
      retryWidgetCreation();
    }
  }, [symbol, timeframe, actualTheme, isLoaded, containerId, isIntersecting, retryWidgetCreation]);

  // Setup widget event listeners
  const setupWidgetListeners = useCallback((widget: any, widgetSymbol: string) => {
    try {
      const chart = widget.activeChart();
      if (!chart) return;

      // Listen for symbol changes
      if (chart.onSymbolChanged && typeof chart.onSymbolChanged === 'function') {
        chart.onSymbolChanged().subscribe(null, () => {
          console.log(`📈 [${new Date().toLocaleTimeString()}] Symbol changed detected for ${widgetSymbol}`);
        });
      }

      // Listen for data updates
      if (chart.onDataLoaded && typeof chart.onDataLoaded === 'function') {
        chart.onDataLoaded().subscribe(null, () => {
          console.log(`📊 [${new Date().toLocaleTimeString()}] Data loaded for ${widgetSymbol}`);
        });
      }

      console.log(`🎧 [${new Date().toLocaleTimeString()}] Event listeners setup for ${widgetSymbol}`);
    } catch (error) {
      console.warn(`⚠️ Event listener setup failed for ${widgetSymbol}:`, error);
    }
  }, []);

  // Load script when component mounts
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadTradingViewScript();
    }
  }, [isLoaded, isLoading, loadTradingViewScript]);

  // Create/recreate widget when dependencies change
  useEffect(() => {
    // Reset retry count on symbol/timeframe change
    retryCountRef.current = 0;
    setIsRetrying(false);
    
    createWidget();
    return cleanupWidget;
  }, [symbol, timeframe, actualTheme, isLoaded, isIntersecting, createWidget, cleanupWidget]);

  // Manual retry function
  const handleManualRetry = () => {
    retryCountRef.current = 0;
    setError(null);
    setIsRetrying(false);
    cleanupWidget();
    
    if (!isLoaded) {
      loadTradingViewScript().then((success) => {
        if (success) {
          createWidget();
        }
      });
    } else {
      createWidget();
    }
  };

  if (error && !isRetrying) {
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
            Retry Widget
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

  if (isLoading || isRetrying) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/5 rounded-xl border border-gray-700/20 min-h-[600px] ${className}`}
      >
        <div className="text-center space-y-4">
          <div className="animate-pulse rounded-full h-8 w-8 bg-tradeiq-blue/40 mx-auto"></div>
          <div>
            <p className="text-white font-medium">
              {isRetrying ? `Retrying... (${retryCountRef.current}/3)` : 'Loading TradingView...'}
            </p>
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
    console.log(`🔄 [${new Date().toLocaleTimeString()}] TradingView re-rendering: ${prevProps.symbol} → ${nextProps.symbol}, ${prevProps.timeframe} → ${nextProps.timeframe}`);
  }
  
  return shouldNotRerender;
});
