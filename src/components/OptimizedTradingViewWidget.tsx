
import { useEffect, useRef, useState, useCallback } from "react";
import { useTradingViewData } from "@/contexts/TradingViewDataContext";

declare global {
  interface Window {
    TradingView: any;
    tvWidget?: any;
  }
}

interface OptimizedTradingViewWidgetProps {
  symbol: string;
  timeframe: string;
  height?: string;
  className?: string;
}

export const OptimizedTradingViewWidget = ({ 
  symbol, 
  timeframe, 
  height = "600px", 
  className = "" 
}: OptimizedTradingViewWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const initTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const { updateData } = useTradingViewData();

  // Generate unique container ID for each widget instance
  const containerId = `tv_chart_container_${symbol}_${timeframe}_${Date.now()}`;

  // Enhanced cleanup with proper DOM verification
  const cleanupWidget = useCallback(() => {
    console.log(`🧹 [${containerId}] Starting cleanup for ${symbol}`);
    
    // Clear any pending timeouts
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = undefined;
    }
    
    // Destroy widget instance
    if (widgetRef.current) {
      try {
        console.log(`🗑️ [${containerId}] Destroying widget instance`);
        if (typeof widgetRef.current.remove === 'function') {
          widgetRef.current.remove();
        }
      } catch (e) {
        console.warn(`⚠️ [${containerId}] Widget cleanup error:`, e);
      }
      widgetRef.current = null;
    }

    // Clean global widget reference
    if (window.tvWidget) {
      window.tvWidget = undefined;
    }

    // Clear container DOM content if it exists
    if (containerRef.current) {
      console.log(`🧽 [${containerId}] Clearing container DOM`);
      containerRef.current.innerHTML = '';
    }

    console.log(`✅ [${containerId}] Cleanup completed`);
  }, [containerId, symbol]);

  // Verify container exists in DOM
  const verifyContainer = useCallback((): boolean => {
    const container = containerRef.current;
    const exists = container && container.parentNode && document.contains(container);
    
    console.log(`🔍 [${containerId}] Container verification:`, {
      exists: !!container,
      hasParent: !!(container?.parentNode),
      inDocument: container ? document.contains(container) : false,
      result: exists
    });
    
    return !!exists;
  }, [containerId]);

  // Enhanced price extraction with error handling
  const extractPriceData = useCallback(() => {
    if (!widgetRef.current || !mountedRef.current) return;

    try {
      console.log(`💰 [${containerId}] Extracting price data for ${symbol}`);
      const chart = widgetRef.current.activeChart?.();
      
      if (chart) {
        // Try to get current price from chart
        chart.onDataLoaded?.().subscribe?.(null, () => {
          if (!mountedRef.current) return;
          
          try {
            const studies = chart.getAllStudies?.() || [];
            if (studies.length > 0) {
              const data = studies[0].export?.();
              const lastBar = data?.[data.length - 1];
              
              if (lastBar?.close) {
                const priceData = {
                  price: lastBar.close,
                  changePercent: lastBar.open ? ((lastBar.close - lastBar.open) / lastBar.open) * 100 : 0,
                  high: lastBar.high || lastBar.close,
                  low: lastBar.low || lastBar.close,
                  volume: lastBar.volume || null,
                  lastUpdated: Date.now()
                };
                
                console.log(`✅ [${containerId}] Price extracted: ${symbol} $${lastBar.close.toFixed(2)}`);
                updateData(symbol, priceData);
              }
            }
          } catch (err) {
            console.warn(`⚠️ [${containerId}] Price extraction failed:`, err);
          }
        });
      }
    } catch (error) {
      console.warn(`❌ [${containerId}] Chart data extraction error:`, error);
    }
  }, [containerId, symbol, updateData]);

  // Robust widget initialization with proper DOM checks
  const initializeWidget = useCallback(async () => {
    if (!mountedRef.current) {
      console.log(`🚫 [${containerId}] Component unmounted, skipping initialization`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🚀 [${containerId}] Starting widget initialization for ${symbol} (${timeframe})`);

      // Step 1: Verify container exists
      if (!verifyContainer()) {
        throw new Error('Container not ready or not in DOM');
      }

      // Step 2: Clean up any existing widget
      cleanupWidget();

      // Step 3: Wait for DOM to be ready (double-check after cleanup)
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          if (!mountedRef.current) return;
          
          if (!verifyContainer()) {
            throw new Error('Container disappeared after cleanup');
          }
          resolve();
        });
      });

      // Step 4: Load TradingView script if needed
      if (!window.TradingView) {
        console.log(`📦 [${containerId}] Loading TradingView script...`);
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://s3.tradingview.com/tv.js';
          script.async = true;
          script.onload = () => {
            console.log(`✅ [${containerId}] TradingView script loaded`);
            resolve();
          };
          script.onerror = () => reject(new Error('Failed to load TradingView script'));
          document.head.appendChild(script);
        });
      }

      // Step 5: Final container verification before widget creation
      if (!mountedRef.current || !verifyContainer()) {
        throw new Error('Container not available for widget creation');
      }

      // Step 6: Set timeout for initialization
      initTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setError('Chart initialization timeout (15s)');
          setIsLoading(false);
          console.error(`⏰ [${containerId}] Widget initialization timeout`);
        }
      }, 15000);

      // Step 7: Create widget with enhanced error handling
      console.log(`🎯 [${containerId}] Creating TradingView widget...`);
      
      const widget = new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: timeframe,
        container: containerRef.current,
        library_path: "/charting_library/",
        locale: "en",
        disabled_features: [
          "use_localstorage_for_settings",
          "volume_force_overlay",
          "create_volume_indicator_by_default"
        ],
        enabled_features: ["study_templates"],
        theme: "dark",
        fullscreen: false,
        onChartReady: () => {
          if (!mountedRef.current) return;
          
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
            initTimeoutRef.current = undefined;
          }
          
          console.log(`✅ [${containerId}] TradingView chart ready for ${symbol}`);
          setIsLoading(false);
          
          // Start price extraction after chart is ready
          setTimeout(() => {
            if (mountedRef.current) {
              extractPriceData();
              // Set up periodic extraction
              const interval = setInterval(() => {
                if (mountedRef.current) {
                  extractPriceData();
                } else {
                  clearInterval(interval);
                }
              }, 10000);
            }
          }, 2000);
        }
      });

      widgetRef.current = widget;
      window.tvWidget = widget;

      console.log(`🎯 [${containerId}] Widget created successfully for ${symbol}`);

    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error(`❌ [${containerId}] Widget initialization failed:`, error);
      setError(error instanceof Error ? error.message : 'Chart failed to load');
      setIsLoading(false);
      
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = undefined;
      }
      
      // Auto-retry once on first failure
      if (retryCount === 0) {
        console.log(`🔄 [${containerId}] Auto-retry scheduled`);
        setRetryCount(1);
        setTimeout(() => {
          if (mountedRef.current) {
            initializeWidget();
          }
        }, 3000);
      }
    }
  }, [containerId, symbol, timeframe, extractPriceData, retryCount, cleanupWidget, verifyContainer]);

  const handleRetry = () => {
    console.log(`🔄 [${containerId}] Manual retry triggered for ${symbol}`);
    setRetryCount(0);
    setError(null);
    initializeWidget();
  };

  // Initialize widget when container is ready and symbol/timeframe changes
  useEffect(() => {
    console.log(`🔄 [${containerId}] Effect triggered: ${symbol} (${timeframe})`);
    
    // Use requestAnimationFrame to ensure container is in DOM
    requestAnimationFrame(() => {
      if (mountedRef.current && containerRef.current) {
        initializeWidget();
      }
    });
    
    return () => {
      console.log(`🧹 [${containerId}] Effect cleanup for ${symbol}`);
      cleanupWidget();
    };
  }, [symbol, timeframe, initializeWidget, cleanupWidget, containerId]);

  // Track component mount state
  useEffect(() => {
    mountedRef.current = true;
    console.log(`🏗️ [${containerId}] Component mounted`);
    
    return () => {
      mountedRef.current = false;
      console.log(`🏗️ [${containerId}] Component will unmount`);
    };
  }, [containerId]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-black/20 rounded-xl border border-red-500/30 ${className}`}
        style={{ height }}
      >
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">Chart Error</p>
          <p className="text-gray-400 text-sm max-w-md">{error}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Retry Chart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-black/5 rounded-xl border border-gray-700/20 overflow-hidden relative ${className}`}
      style={{ height, minHeight: height }}
    >
      <div
        ref={containerRef}
        id={containerId}
        className="w-full h-full"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white font-medium">Loading TradingView Chart...</p>
            <p className="text-gray-400 text-sm">{symbol} • {timeframe}</p>
            <div className="w-48 bg-gray-800 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="absolute top-3 right-3 flex items-center space-x-2 bg-green-500/20 px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-500 text-xs font-medium">TradingView Synced</span>
        </div>
      )}
    </div>
  );
};
