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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { actualTheme } = useTheme();
  
  // Force chart to be visible for data extraction
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '50px',
    triggerOnce: false
  });
  
  // Generate unique container ID for each symbol/timeframe combination
  const containerId = `tradingview-chart-${symbol}-${timeframe}-${Date.now()}`;

  console.log(`🎯 TradingView Chart: ${symbol} (${timeframe}) - Visible: ${isIntersecting}`);

  // Load TradingView script
  const loadTradingViewScript = useCallback(() => {
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
      console.log('📊 TradingView script loaded successfully');
    };
    script.onerror = () => {
      setIsLoading(false);
      console.error('❌ Failed to load TradingView script');
    };
    
    document.head.appendChild(script);
  }, []);

  // Load script when component mounts
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadTradingViewScript();
    }
  }, [isLoaded, isLoading, loadTradingViewScript]);

  // Create/recreate widget when symbol or timeframe changes
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !isIntersecting) return;

    console.log(`🔄 Creating TradingView widget for ${symbol} (${timeframe})`);

    // Clean up previous widget
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        console.log('Previous widget cleanup:', e);
      }
      widgetRef.current = null;
    }

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
        
        // Theme-based overrides
        overrides: {
          ...baseConfig.overrides,
          "paneProperties.background": actualTheme === 'dark' ? "#0f172a" : "#ffffff"
        }
      };

      const widget = new window.TradingView.widget(widgetConfig);
      widgetRef.current = widget;

      // 🎯 CRITICAL: Set the widget reference and setup price extraction
      widget.onChartReady(() => {
        console.log(`✅ TradingView widget ready for ${symbol} - setting global reference for price extraction`);
        setTradingViewWidget(widget);
        
        // Setup real-time price monitoring
        try {
          const chart = widget.activeChart();
          if (chart) {
            // Monitor symbol changes
            chart.onSymbolChanged().subscribe(null, () => {
              console.log(`📊 Symbol changed in TradingView: ${symbol}`);
              // Trigger price extraction after symbol change
              setTimeout(() => setTradingViewWidget(widget), 500);
            });
            
            // Monitor data updates
            chart.onDataLoaded().subscribe(null, () => {
              console.log(`📈 Data loaded for ${symbol} - triggering price extraction`);
              setTimeout(() => setTradingViewWidget(widget), 100);
            });
          }
        } catch (e) {
          console.log('Chart event setup:', e);
        }
      });

      console.log(`✅ TradingView chart created for ${symbol} (${timeframe})`);
    } catch (error) {
      console.error('❌ Error creating TradingView widget:', error);
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

// Custom memo comparator - only re-render if symbol or timeframe actually changes
export const TradingViewAdvancedChart = memo(TradingViewAdvancedChartComponent, (prevProps, nextProps) => {
  const shouldNotRerender = 
    prevProps.symbol === nextProps.symbol &&
    prevProps.timeframe === nextProps.timeframe &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className;
  
  if (!shouldNotRerender) {
    console.log(`🔄 TradingView re-rendering: ${prevProps.symbol} → ${nextProps.symbol}`);
  }
  
  return shouldNotRerender;
});
