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
  
  // Ultra-aggressive lazy loading
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.05,
    rootMargin: '100px',
    triggerOnce: true
  });
  
  const containerId = useRef(`ultra-optimized-chart-${symbol}-${Date.now()}`).current;

  console.log(`⚡ Ultra-optimized TradingViewChart: ${symbol} (${timeframe}) - Visible: ${isIntersecting}`);

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
      console.log('⚡ Ultra-optimized TradingView script loaded');
    };
    script.onerror = () => {
      setIsLoading(false);
      console.error('❌ Failed to load ultra-optimized TradingView script');
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

    console.log(`⚡ Creating ultra-optimized TradingView widget for ${symbol} (${timeframe})`);

    // Aggressive cleanup
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        console.log('Widget cleanup:', e);
      }
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.id = containerId;
    }

    try {
      // Use ultra-optimized configuration
      const baseConfig = getTradingViewConfig(actualTheme);
      
      const widgetConfig = {
        ...baseConfig,
        symbol: symbol,
        interval: getInterval(timeframe),
        height: 600,
        container_id: containerId,
        
        // Ultra-lightweight studies (minimal CPU usage)
        studies: [],
        
        // Aggressive performance overrides
        overrides: {
          ...baseConfig.overrides,
          "paneProperties.background": actualTheme === 'dark' ? "#0f172a" : "#ffffff"
        }
      };

      const widget = new window.TradingView.widget(widgetConfig);
      widgetRef.current = widget;

      // 🎯 CRITICAL: Set the widget reference for data extraction
      widget.onChartReady(() => {
        console.log('🎯 TradingView widget ready - setting global reference');
        setTradingViewWidget(widget);
      });

      console.log(`✅ Ultra-optimized TradingView chart created: ${symbol} (${timeframe})`);
    } catch (error) {
      console.error('❌ Error creating ultra-optimized TradingView widget:', error);
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
            <p className="text-gray-400 text-sm">Ultra-optimized for performance</p>
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
            <p className="text-white font-medium">Loading Advanced Chart...</p>
            <p className="text-gray-400 text-sm">Initializing ultra-optimized widget</p>
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

// Ultra-aggressive memoization for maximum performance
export const TradingViewAdvancedChart = memo(TradingViewAdvancedChartComponent, (prevProps, nextProps) => {
  const shouldNotRerender = 
    prevProps.symbol === nextProps.symbol &&
    prevProps.timeframe === nextProps.timeframe &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className;
  
  if (shouldNotRerender) {
    console.log(`✅ Ultra-optimized TradingView: Performance skip for ${nextProps.symbol} - no changes`);
  } else {
    console.log(`🔄 Ultra-optimized TradingView: Re-rendering ${nextProps.symbol} - props changed`);
  }
  
  return shouldNotRerender;
});
