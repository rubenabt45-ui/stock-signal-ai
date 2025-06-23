
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
  const { updateData } = useTradingViewData();

  // Enhanced widget cleanup
  const cleanupWidget = useCallback(() => {
    console.log(`🧹 Cleaning up TradingView widget for ${symbol}`);
    
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }
    
    if (widgetRef.current) {
      try {
        if (typeof widgetRef.current.remove === 'function') {
          widgetRef.current.remove();
        }
      } catch (e) {
        console.warn('Widget cleanup error:', e);
      }
      widgetRef.current = null;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    if (window.tvWidget) {
      window.tvWidget = undefined;
    }
  }, [symbol]);

  // Enhanced price extraction with error handling
  const extractPriceData = useCallback(() => {
    if (!widgetRef.current) return;

    try {
      console.log(`💰 Attempting price extraction for ${symbol}`);
      const chart = widgetRef.current.activeChart?.();
      
      if (chart) {
        // Try to get current price from chart
        chart.onDataLoaded?.().subscribe?.(null, () => {
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
                
                console.log(`✅ TradingView price extracted: ${symbol} $${lastBar.close.toFixed(2)} at ${new Date().toLocaleTimeString()}`);
                updateData(symbol, priceData);
              }
            }
          } catch (err) {
            console.warn(`⚠️ Price extraction failed for ${symbol}:`, err);
          }
        });
      }
    } catch (error) {
      console.warn(`❌ Chart data extraction error for ${symbol}:`, error);
    }
  }, [symbol, updateData]);

  // Robust widget initialization
  const initializeWidget = useCallback(async () => {
    if (!containerRef.current) {
      console.warn(`⚠️ Container not ready for ${symbol}`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🚀 Initializing TradingView widget: ${symbol} (${timeframe})`);

      // Clean up first
      cleanupWidget();

      // Wait a tick for DOM cleanup
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify container still exists after cleanup
      if (!containerRef.current) {
        throw new Error('Container disappeared during initialization');
      }

      // Load TradingView script if needed
      if (!window.TradingView) {
        console.log('📦 Loading TradingView script...');
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://s3.tradingview.com/tv.js';
          script.async = true;
          script.onload = () => {
            console.log('✅ TradingView script loaded');
            resolve();
          };
          script.onerror = () => reject(new Error('Failed to load TradingView script'));
          document.head.appendChild(script);
        });
      }

      // Set initialization timeout
      initTimeoutRef.current = setTimeout(() => {
        setError('Chart initialization timeout');
        setIsLoading(false);
        console.error(`⏰ Widget initialization timeout for ${symbol}`);
      }, 15000);

      // Create widget with enhanced error handling
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
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
          }
          
          console.log(`✅ TradingView chart ready: ${symbol} at ${new Date().toLocaleTimeString()}`);
          setIsLoading(false);
          
          // Start price extraction after chart is ready
          setTimeout(() => {
            extractPriceData();
            // Set up periodic extraction
            const interval = setInterval(extractPriceData, 10000);
            return () => clearInterval(interval);
          }, 2000);
        }
      });

      widgetRef.current = widget;
      window.tvWidget = widget;

      console.log(`🎯 Widget created for ${symbol} (${timeframe})`);

    } catch (error) {
      console.error(`❌ Widget initialization failed for ${symbol}:`, error);
      setError(error instanceof Error ? error.message : 'Chart failed to load');
      setIsLoading(false);
      
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      // Auto-retry once
      if (retryCount === 0) {
        setRetryCount(1);
        setTimeout(() => initializeWidget(), 3000);
      }
    }
  }, [symbol, timeframe, extractPriceData, retryCount, cleanupWidget]);

  const handleRetry = () => {
    console.log(`🔄 Manual retry for ${symbol}`);
    setRetryCount(0);
    initializeWidget();
  };

  // Initialize widget on mount and symbol/timeframe changes
  useEffect(() => {
    console.log(`🔄 Effect triggered: ${symbol} (${timeframe})`);
    initializeWidget();
    
    return () => {
      console.log(`🧹 Cleanup effect for ${symbol}`);
      cleanupWidget();
    };
  }, [symbol, timeframe]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-black/20 rounded-xl border border-red-500/30 ${className}`}
        style={{ height }}
      >
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">Chart Error</p>
          <p className="text-gray-400 text-sm">{error}</p>
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
