
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// Declare TradingView types
declare global {
  interface Window {
    TradingView: any;
    Datafeeds: any;
  }
}

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
  const priceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { actualTheme } = useTheme();

  // Cleanup function
  const cleanup = () => {
    if (priceIntervalRef.current) {
      clearInterval(priceIntervalRef.current);
      priceIntervalRef.current = null;
    }
    
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

  // Extract price data from widget using TradingView API
  const extractPriceData = async () => {
    if (!widgetRef.current || !widgetReady) return;

    try {
      const chart = widgetRef.current.activeChart();
      if (!chart) return;

      // Get symbol info and latest data
      const symbolInfo = await chart.symbolInfo();
      const priceScale = chart.getPanes()[0].getMainSourcePriceScale();
      
      // Get the latest bar data
      chart.onDataLoaded().subscribe(null, () => {
        try {
          const dataWindow = chart.getDataWindow();
          if (dataWindow && dataWindow.length > 0) {
            const latestData = dataWindow[dataWindow.length - 1];
            const previousData = dataWindow[dataWindow.length - 2];
            
            if (latestData && latestData.close !== undefined) {
              const currentPrice = latestData.close;
              const prevClose = previousData?.close || currentPrice;
              const changePercent = ((currentPrice - prevClose) / prevClose) * 100;
              
              const extractedData = {
                price: currentPrice,
                changePercent: changePercent,
                high: latestData.high || currentPrice,
                low: latestData.low || currentPrice,
                volume: latestData.volume,
                lastUpdated: Date.now()
              };

              console.log(`📊 TradingView price extracted: ${symbol} $${currentPrice.toFixed(2)} (${changePercent.toFixed(2)}%) at ${new Date().toLocaleTimeString()}`);
              onPriceUpdate?.(extractedData);
            }
          }
        } catch (error) {
          console.warn('Price extraction from data window failed:', error);
          // Fallback: try to get price from symbol info
          if (symbolInfo && symbolInfo.last_price) {
            const extractedData = {
              price: symbolInfo.last_price,
              changePercent: symbolInfo.change_percent || 0,
              high: symbolInfo.high || symbolInfo.last_price,
              low: symbolInfo.low || symbolInfo.last_price,
              volume: symbolInfo.volume,
              lastUpdated: Date.now()
            };
            
            console.log(`📊 TradingView price (fallback): ${symbol} $${symbolInfo.last_price.toFixed(2)} at ${new Date().toLocaleTimeString()}`);
            onPriceUpdate?.(extractedData);
          }
        }
      });
    } catch (error) {
      console.warn('TradingView price extraction error:', error);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    console.log(`🔄 TradingView widget initializing for ${symbol} (${timeframe}) at ${new Date().toLocaleTimeString()}`);
    
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
            
            // Start price extraction after widget is ready
            setTimeout(() => {
              extractPriceData();
              
              // Set up periodic price updates every 5 seconds
              priceIntervalRef.current = setInterval(() => {
                extractPriceData();
              }, 5000);
            }, 2000);
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
