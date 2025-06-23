
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

const CHART_CONFIG = {
  library_path: "/charting_library/",
  locale: "en",
  disabled_features: [
    "use_localstorage_for_settings",
    "volume_force_overlay",
    "create_volume_indicator_by_default"
  ],
  enabled_features: ["study_templates"],
  theme: "dark",
  autosize: true,
  fullscreen: false
};

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
  const { updateData } = useTradingViewData();

  const extractPriceData = useCallback(async () => {
    if (!widgetRef.current) return;

    try {
      const chart = widgetRef.current.activeChart();
      if (!chart) return;

      // Try to get the latest bar data
      chart.onDataLoaded().subscribe(null, () => {
        try {
          const study = chart.getAllStudies()[0];
          if (study) {
            const data = study.export();
            const lastBar = data[data.length - 1];
            
            if (lastBar && lastBar.close) {
              const priceData = {
                price: lastBar.close,
                changePercent: ((lastBar.close - lastBar.open) / lastBar.open) * 100,
                high: lastBar.high,
                low: lastBar.low,
                volume: lastBar.volume || null,
                lastUpdated: Date.now()
              };
              
              console.log(`✅ TradingView price synced: ${symbol} $${lastBar.close.toFixed(2)} at ${new Date().toLocaleTimeString()}`);
              updateData(symbol, priceData);
            }
          }
        } catch (err) {
          console.warn('Price extraction failed:', err);
        }
      });
    } catch (error) {
      console.warn('Chart data extraction error:', error);
    }
  }, [symbol, updateData]);

  const initializeWidget = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Clean up existing widget
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.warn('Widget cleanup error:', e);
        }
        widgetRef.current = null;
      }

      // Clear container
      containerRef.current.innerHTML = '';

      // Load TradingView script if needed
      if (!window.TradingView) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://s3.tradingview.com/tv.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load TradingView script'));
          document.head.appendChild(script);
        });
      }

      // Create widget with timeout
      const widgetPromise = new Promise<any>((resolve, reject) => {
        const widget = new window.TradingView.widget({
          ...CHART_CONFIG,
          symbol: symbol,
          interval: timeframe,
          container: containerRef.current,
          onChartReady: () => {
            console.log(`✅ TradingView chart ready: ${symbol} at ${new Date().toLocaleTimeString()}`);
            resolve(widget);
          }
        });
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Chart load timeout')), 10000);
      });

      const widget = await Promise.race([widgetPromise, timeoutPromise]);
      widgetRef.current = widget;
      window.tvWidget = widget;

      // Start price extraction
      setTimeout(() => {
        extractPriceData();
        setInterval(extractPriceData, 5000); // Extract every 5 seconds
      }, 2000);

      setIsLoading(false);
      console.log(`🎯 Switched to symbol ${symbol} (${timeframe}) - chart loaded at ${new Date().toLocaleTimeString()}`);

    } catch (error) {
      console.error('Widget initialization failed:', error);
      setError(error instanceof Error ? error.message : 'Chart failed to load');
      setIsLoading(false);
      
      // Auto-retry once
      if (retryCount === 0) {
        setRetryCount(1);
        setTimeout(() => initializeWidget(), 2000);
      }
    }
  }, [symbol, timeframe, extractPriceData, retryCount]);

  const handleRetry = () => {
    setRetryCount(0);
    initializeWidget();
  };

  useEffect(() => {
    initializeWidget();
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
      }
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
