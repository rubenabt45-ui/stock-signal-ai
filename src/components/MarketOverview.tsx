
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { getMarketOverviewConfig } from "@/utils/tradingViewConfig";

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
  
  // Ultra-aggressive lazy loading - only load when very close to viewport
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.05,
    rootMargin: '50px',
    triggerOnce: true
  });
  
  const widgetTheme = theme || actualTheme;
  const containerId = useRef(`ultra-optimized-widget-${Date.now()}`).current;

  console.log(`⚡ Ultra-optimized MarketOverview: Visible=${isIntersecting}, Symbols=${symbols.length}`);

  // Memoized script loading with aggressive optimization
  const loadScript = useCallback(() => {
    if (!isIntersecting) return;
    
    if (window.TradingView) {
      console.log('⚡ TradingView already loaded - using existing instance');
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    console.log('⚡ Loading ultra-optimized TradingView script...');
    setIsLoading(true);
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Ultra-optimized TradingView script loaded');
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
    };
    script.onerror = () => {
      console.error('❌ Failed to load ultra-optimized TradingView script');
      setIsLoading(false);
      setError('Failed to load market overview');
    };
    
    document.head.appendChild(script);
  }, [isIntersecting]);

  // Load script only when visible
  useEffect(() => {
    if (isIntersecting && !isLoaded && !isLoading) {
      loadScript();
    }
  }, [isIntersecting, isLoaded, isLoading, loadScript]);

  // Create ultra-lightweight widget
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !isIntersecting) {
      return;
    }

    // Aggressive cleanup
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        console.log('Ultra-optimized widget cleanup:', e);
      }
    }

    containerRef.current.innerHTML = '';
    containerRef.current.id = containerId;

    try {
      console.log('⚡ Creating ultra-optimized widget with minimal features');

      // Use the ultra-optimized config
      const config = getMarketOverviewConfig(widgetTheme, symbols);

      // Create widget with minimal overhead
      if (window.TradingView) {
        widgetRef.current = new window.TradingView.widget({
          container_id: containerId,
          ...config
        });
        console.log('✅ Ultra-optimized widget created successfully');
      } else {
        // Fallback with script injection
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
        console.log('⚡ Ultra-optimized widget script injected');
      }

    } catch (error) {
      console.error('❌ Error creating ultra-optimized widget:', error);
      setError('Failed to create widget');
    }
  }, [symbols, widgetTheme, isLoaded, height, containerId, isIntersecting]);

  // Aggressive cleanup on unmount
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
        className={`flex items-center justify-center bg-black/5 rounded-2xl border border-gray-700/20 ${className}`} 
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        <div className="text-center py-8">
          <div className="w-6 h-6 border border-tradeiq-blue/40 rounded-full mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm font-medium">Chart loading when visible...</p>
          <p className="text-gray-500 text-xs mt-1">Ultra-optimized for performance</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/5 rounded-2xl border border-gray-700/20 ${className}`} 
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        <div className="text-center py-8">
          <div className="animate-pulse rounded-full h-6 w-6 bg-tradeiq-blue/40 mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm font-medium">Loading optimized chart...</p>
          <p className="text-gray-500 text-xs mt-1">Symbols: {symbols.length}</p>
        </div>
      </div>
    );
  }

  if (error || !isLoaded) {
    return (
      <div 
        ref={targetRef}
        className={`flex items-center justify-center bg-black/5 rounded-2xl border border-gray-700/20 ${className}`} 
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        <div className="text-center py-8">
          <p className="text-red-400 text-lg mb-2">⚠️ Chart unavailable</p>
          <p className="text-gray-500 text-sm">Please refresh to retry</p>
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
      className={`bg-black/5 rounded-2xl border border-gray-700/20 overflow-hidden w-full ${className}`}
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

// Ultra-aggressive memoization - only re-render when absolutely necessary
export const MarketOverview = memo(MarketOverviewComponent, (prevProps, nextProps) => {
  const symbolsChanged = JSON.stringify(prevProps.symbols) !== JSON.stringify(nextProps.symbols);
  const propsChanged = 
    symbolsChanged ||
    prevProps.theme !== nextProps.theme ||
    prevProps.height !== nextProps.height ||
    prevProps.className !== nextProps.className;
  
  if (!propsChanged) {
    console.log('⚡ Ultra-optimized MarketOverview: Skipping re-render - no changes');
  } else {
    console.log('🔄 Ultra-optimized MarketOverview: Re-rendering - props changed');
  }
  
  return !propsChanged;
});
