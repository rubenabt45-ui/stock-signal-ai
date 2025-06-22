
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface TradingViewWidgetProps {
  symbol: string;
  timeframe: string;
  onPriceUpdate?: (priceData: {
    price: number;
    changePercent: number;
    high: number;
    low: number;
    volume?: number;
    lastUpdated: number;
  }) => void;
  height?: string;
  className?: string;
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

export const TradingViewWidget = ({ 
  symbol, 
  timeframe, 
  onPriceUpdate,
  height = "600px", 
  className = "" 
}: TradingViewWidgetProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [widgetReady, setWidgetReady] = useState(false);
  const widgetRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { actualTheme } = useTheme();

  // Cleanup function
  const cleanup = () => {
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
        console.log(`🧹 TradingView widget cleaned up for ${symbol}`);
      } catch (error) {
        console.warn('Widget cleanup error:', error);
      }
      widgetRef.current = null;
    }
    setWidgetReady(false);
    setIsLoading(true);
  };

  // Extract price data from widget
  const extractPriceData = () => {
    if (!widgetRef.current || !widgetReady) return;

    try {
      const chart = widgetRef.current.activeChart();
      if (!chart) return;

      // Get the last bar data
      chart.onDataLoaded().subscribe(null, () => {
        try {
          const series = chart.getAllSeries()[0];
          if (series) {
            const lastBar = series.lastBarClose();
            const priceData = series.data();
            
            if (lastBar && priceData && priceData.length > 0) {
              const currentData = priceData[priceData.length - 1];
              const previousData = priceData[priceData.length - 2];
              
              const price = lastBar;
              const prevClose = previousData?.close || price;
              const changePercent = ((price - prevClose) / prevClose) * 100;
              
              const extractedData = {
                price: price,
                changePercent: changePercent,
                high: currentData?.high || price,
                low: currentData?.low || price,
                volume: currentData?.volume,
                lastUpdated: Date.now()
              };

              console.log(`📊 TradingView price extracted: ${symbol} $${price.toFixed(2)} (${changePercent.toFixed(2)}%)`);
              onPriceUpdate?.(extractedData);
            }
          }
        } catch (error) {
          console.warn('Price extraction error:', error);
        }
      });
    } catch (error) {
      console.warn('Widget data extraction error:', error);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous widget
    cleanup();

    // Clear container
    containerRef.current.innerHTML = '';

    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => initializeWidget();
      document.head.appendChild(script);
    } else {
      initializeWidget();
    }

    function initializeWidget() {
      if (!containerRef.current) return;

      try {
        const widget = new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: getInterval(timeframe),
          container: containerRef.current,
          datafeed: new window.Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
          library_path: "/charting_library/",
          locale: "en",
          disabled_features: ["use_localstorage_for_settings"],
          enabled_features: ["study_templates"],
          charts_storage_url: "https://saveload.tradingview.com",
          charts_storage_api_version: "1.1",
          client_id: "tradingview.com",
          user_id: "public_user_id",
          fullscreen: false,
          autosize: true,
          studies_overrides: {},
          theme: actualTheme === 'dark' ? 'dark' : 'light',
          onChartReady: () => {
            console.log(`✅ TradingView widget ready: ${symbol} at ${new Date().toLocaleTimeString()}`);
            setIsLoading(false);
            setWidgetReady(true);
            
            // Extract initial price data
            setTimeout(() => {
              extractPriceData();
            }, 1000);
          }
        });

        widgetRef.current = widget;

      } catch (error) {
        console.error('Widget initialization error:', error);
        setIsLoading(false);
      }
    }

    return cleanup;
  }, [symbol, timeframe, actualTheme]);

  // Set up price update polling
  useEffect(() => {
    if (!widgetReady) return;

    const interval = setInterval(() => {
      extractPriceData();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [widgetReady]);

  return (
    <div 
      className={`bg-black/5 rounded-xl border border-gray-700/20 overflow-hidden w-full min-h-[600px] relative ${className}`}
      style={{ 
        height: height,
        minHeight: height
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: isLoading ? 'none' : 'block'
        }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tradeiq-blue mx-auto"></div>
            <p className="text-white text-sm">Loading TradingView chart...</p>
            <p className="text-gray-400 text-xs">{symbol} - {timeframe}</p>
          </div>
        </div>
      )}
      
      {/* Ready indicator */}
      {widgetReady && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-500 text-xs font-medium">Synced</span>
        </div>
      )}
    </div>
  );
};
