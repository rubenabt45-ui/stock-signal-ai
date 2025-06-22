
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface MarketOverviewProps {
  symbols?: string[];
  theme?: "dark" | "light";
  height?: number;
  className?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const MarketOverviewComponent = ({ 
  symbols = ['NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:TSLA', 'NASDAQ:NVDA', 'NASDAQ:AMZN'], 
  theme,
  height = 400, 
  className = "" 
}: MarketOverviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { actualTheme } = useTheme();
  
  // Lazy loading: only load when component is visible
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });
  
  // Use provided theme or fall back to user's theme preference
  const widgetTheme = theme || actualTheme;
  
  // Generate stable container ID
  const containerId = useRef(`tradingview-widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`).current;

  console.log(`🔧 MarketOverview: Visible=${isIntersecting}, Symbols=${symbols.length}`);

  // Memoized script loading function
  const loadScript = useCallback(() => {
    if (!isIntersecting) return;
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="market-overview"]');
    if (existingScript) {
      console.log('📊 TradingView script already loaded');
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    console.log('📊 Loading TradingView market overview script...');
    setIsLoading(true);
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ TradingView script loaded');
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
    };
    script.onerror = () => {
      console.error('❌ Failed to load TradingView script');
      setIsLoading(false);
      setError('Failed to load market overview');
    };
    
    document.head.appendChild(script);
  }, [isIntersecting]);

  // Load script when component becomes visible
  useEffect(() => {
    if (isIntersecting && !isLoaded && !isLoading) {
      loadScript();
    }
  }, [isIntersecting, isLoaded, isLoading, loadScript]);

  // Create widget when script is loaded and component is visible
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !isIntersecting) {
      return;
    }

    // Clean up previous widget
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        console.log('Widget cleanup:', e);
      }
    }

    // Clear container
    containerRef.current.innerHTML = '';
    containerRef.current.id = containerId;

    try {
      // Create symbol groups from provided symbols
      const symbolsGroups = [
        {
          name: "Related Assets",
          symbols: symbols.map(symbol => {
            const displayName = symbol.replace('NASDAQ:', '').replace('NYSE:', '');
            return {
              name: symbol,
              displayName: displayName
            };
          })
        }
      ];

      console.log('📊 Creating optimized widget with symbolsGroups:', symbolsGroups);

      // Highly optimized widget configuration for minimal resource usage
      const config = {
        colorTheme: widgetTheme === 'dark' ? 'dark' : 'light',
        dateRange: "12M",
        showChart: true,
        locale: "en",
        width: "100%",
        height: height,
        largeChartUrl: "",
        isTransparent: false,
        showSymbolLogo: false,        // Disable logos for performance
        showFloatingTooltip: false,   // Disable tooltips for performance
        // Performance-optimized styling
        plotLineColorGrowing: "rgba(37, 99, 235, 1)",
        plotLineColorFalling: "rgba(239, 68, 68, 1)",
        gridLineColor: "rgba(240, 243, 250, 0.06)",
        scaleFontColor: "rgba(120, 123, 134, 1)",
        belowLineFillColorGrowing: "rgba(37, 99, 235, 0.12)",
        belowLineFillColorFalling: "rgba(239, 68, 68, 0.12)",
        belowLineFillColorGrowingBottom: "rgba(37, 99, 235, 0)",
        belowLineFillColorFallingBottom: "rgba(239, 68, 68, 0)",
        symbolActiveColor: "rgba(60, 120, 216, 0.12)",
        // Aggressive cleanup for performance
        hideTopToolbar: true,         // Hide timeframe toolbar
        hideBottomToolbar: true,      // Hide settings and controls
        hideDateRanges: true,         // Hide date selectors
        hideMarketStatus: true,       // Hide market status for cleaner look
        hideSymbolSearch: true,       // Hide search to prevent interactions
        hideVolumeMA: true,          // Hide volume indicators
        allowSymbolChange: false,     // Lock symbols to prevent changes
        details: false,              // Hide detailed panels
        hotlist: false,              // Hide trending lists
        calendar: false,             // Hide economic calendar
        news: false,                 // Hide news feed
        screener_popup: false,       // Hide screener popups
        enable_publishing: false,    // Disable publishing features
        withdateranges: false,       // Disable date ranges
        hide_side_toolbar: true,     // Hide side controls
        save_image: false,           // Disable image saving
        studies_overrides: {},       // Disable technical studies
        overrides: {
          // Minimal chart styling for performance
          "mainSeriesProperties.candleStyle.upColor": "rgba(37, 99, 235, 1)",
          "mainSeriesProperties.candleStyle.downColor": "rgba(239, 68, 68, 1)",
          "mainSeriesProperties.candleStyle.borderUpColor": "rgba(37, 99, 235, 1)",
          "mainSeriesProperties.candleStyle.borderDownColor": "rgba(239, 68, 68, 1)",
          "paneProperties.background": widgetTheme === 'dark' ? "#0f172a" : "#ffffff",
          "paneProperties.backgroundType": "solid"
        },
        symbolsGroups: symbolsGroups
      };

      // Create the widget using TradingView constructor
      if (window.TradingView) {
        widgetRef.current = new window.TradingView.widget({
          container_id: containerId,
          ...config
        });
        console.log('✅ Optimized TradingView widget created');
      } else {
        // Fallback: inject script directly
        const scriptContent = `
          new TradingView.widget({
            "container_id": "${containerId}",
            ${Object.entries(config).map(([key, value]) => 
              `"${key}": ${JSON.stringify(value)}`
            ).join(',\n')}
          });
        `;

        const widgetScript = document.createElement('script');
        widgetScript.innerHTML = scriptContent;
        containerRef.current.appendChild(widgetScript);
        console.log('📊 Optimized widget script injected');
      }

    } catch (error) {
      console.error('❌ Error creating optimized widget:', error);
      setError('Failed to create widget');
    }
  }, [symbols, widgetTheme, isLoaded, height, containerId, isIntersecting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, []);

  if (!isIntersecting) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/10 rounded-2xl border border-gray-700/20 shadow-lg ${className}`} 
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-tradeiq-blue/30 rounded-full mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm font-medium">Chart loading when visible...</p>
          <p className="text-gray-500 text-xs mt-1">Performance optimized</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/10 rounded-2xl border border-gray-700/20 shadow-lg ${className}`} 
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm font-medium">Loading Market Overview...</p>
          <p className="text-gray-500 text-xs mt-1">Symbols: {symbols.length}</p>
        </div>
      </div>
    );
  }

  if (error || !isLoaded) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/10 rounded-2xl border border-gray-700/20 shadow-lg ${className}`} 
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        <div className="text-center py-8">
          <p className="text-red-400 text-lg mb-2">⚠️ Market data unavailable</p>
          <p className="text-gray-500 text-sm">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-tradeiq-blue/20 text-tradeiq-blue rounded-lg text-sm hover:bg-tradeiq-blue/30 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={targetRef}
      className={`bg-black/5 rounded-2xl border border-gray-700/20 shadow-lg overflow-hidden w-full ${className}`}
      style={{ height: `${height}px`, minHeight: '400px' }}
    >
      <div 
        ref={containerRef} 
        id={containerId}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

// Export memoized component that only re-renders when props actually change
export const MarketOverview = memo(MarketOverviewComponent, (prevProps, nextProps) => {
  // Only re-render if symbols, theme, height, or className change
  const symbolsChanged = JSON.stringify(prevProps.symbols) !== JSON.stringify(nextProps.symbols);
  const propsChanged = 
    symbolsChanged ||
    prevProps.theme !== nextProps.theme ||
    prevProps.height !== nextProps.height ||
    prevProps.className !== nextProps.className;
  
  if (!propsChanged) {
    console.log('🎯 MarketOverview: Skipping re-render - props unchanged');
  } else {
    console.log('🔄 MarketOverview: Re-rendering - props changed');
  }
  
  return !propsChanged;
});
