
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
  const { actualTheme } = useTheme();
  
  // Use provided theme or fall back to user's theme preference
  const widgetTheme = theme || actualTheme;
  
  // Generate unique container ID
  const containerId = `market-overview-${Date.now()}`;

  useEffect(() => {
    const loadTradingViewScript = () => {
      if (window.TradingView) {
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
        console.error('Failed to load TradingView market overview script');
      };
      
      document.head.appendChild(script);
    };

    loadTradingViewScript();
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    // Clear any existing widget
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        console.log('Market overview widget cleanup:', e);
      }
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.id = containerId;
    }

    try {
      // Format symbols for TradingView display
      const formattedSymbols = symbols.map(symbol => ({
        s: symbol,
        d: symbol.replace('NASDAQ:', '').replace('NYSE:', '')
      }));

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

      containerRef.current.innerHTML = `
        <div class="tradingview-widget-container" style="height:100%;width:100%">
          <div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>
          ${JSON.stringify(widgetConfig)}
          </script>
        </div>
      `;

      console.log(`📊 MarketOverview loaded with ${widgetTheme} theme and ${symbols.length} symbols`);
    } catch (error) {
      console.error('Error creating MarketOverview widget:', error);
    }
  }, [symbols, widgetTheme, isLoaded, containerId, height]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-black/10 rounded-2xl border border-gray-700/20 shadow-lg ${className}`} 
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tradeiq-blue mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading Market Overview...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div 
        className={`flex items-center justify-center bg-black/10 rounded-2xl border border-gray-700/20 shadow-lg ${className}`} 
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Market Overview Unavailable</p>
          <p className="text-gray-500 text-sm">Failed to load market data</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-black/5 rounded-2xl border border-gray-700/20 shadow-lg overflow-hidden w-full ${className}`}
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
