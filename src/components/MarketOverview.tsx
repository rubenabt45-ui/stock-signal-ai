
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

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

export const MarketOverview = ({ 
  symbols = ['NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:TSLA', 'NASDAQ:NVDA', 'NASDAQ:AMZN'], 
  theme,
  height = 400, 
  className = "" 
}: MarketOverviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { actualTheme } = useTheme();
  
  // Use provided theme or fall back to user's theme preference
  const widgetTheme = theme || actualTheme;
  
  // Generate unique container ID
  const containerId = `market-overview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log(`🔧 MarketOverview Debug:`, {
    symbols,
    theme: widgetTheme,
    height,
    containerId,
    isLoaded,
    containerExists: !!containerRef.current
  });

  useEffect(() => {
    const loadTradingViewScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="market-overview"]');
      if (existingScript) {
        console.log('📊 TradingView market overview script already exists');
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      if (window.TradingView) {
        console.log('📊 TradingView object already available');
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      console.log('📊 Loading TradingView market overview script...');
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ TradingView market overview script loaded successfully');
        setIsLoaded(true);
        setIsLoading(false);
        setError(null);
      };
      script.onerror = (err) => {
        console.error('❌ Failed to load TradingView market overview script:', err);
        setIsLoading(false);
        setError('Failed to load market overview');
      };
      
      document.head.appendChild(script);
    };

    loadTradingViewScript();
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) {
      console.log('📊 Not ready to create widget:', { isLoaded, containerExists: !!containerRef.current });
      return;
    }

    // Clear any existing widget
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
        console.log('🧹 Cleaned up previous widget');
      } catch (e) {
        console.log('🧹 Widget cleanup note:', e);
      }
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    try {
      // Format symbols for TradingView display
      const formattedSymbols = symbols.map(symbol => {
        const displayName = symbol.replace('NASDAQ:', '').replace('NYSE:', '');
        return {
          s: symbol,
          d: displayName
        };
      });

      console.log('📊 Creating widget with symbols:', formattedSymbols);

      const widgetConfig = {
        "colorTheme": widgetTheme === 'dark' ? 'dark' : 'light',
        "dateRange": "12M",
        "showChart": true,
        "locale": "en",
        "width": "100%",
        "height": height,
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "plotLineColorGrowing": "rgba(37, 99, 235, 1)",
        "plotLineColorFalling": "rgba(239, 68, 68, 1)",
        "gridLineColor": "rgba(240, 243, 250, 0.06)",
        "scaleFontColor": "rgba(120, 123, 134, 1)",
        "belowLineFillColorGrowing": "rgba(37, 99, 235, 0.12)",
        "belowLineFillColorFalling": "rgba(239, 68, 68, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(37, 99, 235, 0)",
        "belowLineFillColorFallingBottom": "rgba(239, 68, 68, 0)",
        "symbolActiveColor": "rgba(60, 120, 216, 0.12)",
        "tabs": [
          {
            "title": "Watchlist",
            "symbols": formattedSymbols
          }
        ]
      };

      // Create widget container with proper structure
      const widgetHTML = `
        <div class="tradingview-widget-container" style="height:100%;width:100%">
          <div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div>
          <div class="tradingview-widget-copyright">
            <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
              <span class="blue-text">Track all markets on TradingView</span>
            </a>
          </div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>
          ${JSON.stringify(widgetConfig)}
          </script>
        </div>
      `;

      containerRef.current.innerHTML = widgetHTML;

      console.log(`✅ MarketOverview widget created with ${widgetTheme} theme and ${symbols.length} symbols`);
    } catch (error) {
      console.error('❌ Error creating MarketOverview widget:', error);
      setError('Failed to create market overview widget');
    }
  }, [symbols, widgetTheme, isLoaded, height]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-black/10 rounded-2xl border border-gray-700/20 shadow-lg ${className}`} 
        style={{ height, minHeight: '300px' }}
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
        className={`flex items-center justify-center bg-black/10 rounded-2xl border border-gray-700/20 shadow-lg ${className}`} 
        style={{ height, minHeight: '300px' }}
      >
        <div className="text-center py-8">
          <p className="text-red-400 text-lg mb-2">Market data unavailable at the moment</p>
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
      className={`bg-black/5 rounded-2xl border border-gray-700/20 shadow-lg overflow-hidden w-full ${className}`}
      style={{ height, minHeight: '300px', paddingTop: '1rem', paddingBottom: '1rem' }}
    >
      <div 
        ref={containerRef} 
        id={containerId}
        className="w-full h-full"
        style={{ minHeight: '280px' }}
      />
    </div>
  );
};
