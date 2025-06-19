
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
  const containerId = `tradingview-widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log(`🔧 MarketOverview mounting with symbols:`, symbols);
  console.log(`🎨 Theme: ${widgetTheme}`);

  // Load TradingView script
  useEffect(() => {
    const loadScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="market-overview"]');
      if (existingScript) {
        console.log('📊 TradingView script already loaded');
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      console.log('📊 Loading TradingView market overview script...');
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
    };

    loadScript();

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⏰ Script loading timeout');
        setIsLoading(false);
        setError('Loading timeout');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Create widget when script is loaded
  useEffect(() => {
    if (!isLoaded || !containerRef.current) {
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

      console.log('📊 Creating widget with symbolsGroups:', symbolsGroups);

      // Widget configuration
      const config = {
        colorTheme: widgetTheme === 'dark' ? 'dark' : 'light',
        dateRange: "12M",
        showChart: true,
        locale: "en",
        width: "100%",
        height: height,
        largeChartUrl: "",
        isTransparent: false,
        showSymbolLogo: true,
        showFloatingTooltip: false,
        plotLineColorGrowing: "rgba(37, 99, 235, 1)",
        plotLineColorFalling: "rgba(239, 68, 68, 1)",
        gridLineColor: "rgba(240, 243, 250, 0.06)",
        scaleFontColor: "rgba(120, 123, 134, 1)",
        belowLineFillColorGrowing: "rgba(37, 99, 235, 0.12)",
        belowLineFillColorFalling: "rgba(239, 68, 68, 0.12)",
        belowLineFillColorGrowingBottom: "rgba(37, 99, 235, 0)",
        belowLineFillColorFallingBottom: "rgba(239, 68, 68, 0)",
        symbolActiveColor: "rgba(60, 120, 216, 0.12)",
        symbolsGroups: symbolsGroups
      };

      // Create the widget using TradingView constructor
      if (window.TradingView) {
        widgetRef.current = new window.TradingView.widget({
          container_id: containerId,
          ...config
        });
        console.log('✅ TradingView widget created successfully');
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
        console.log('📊 Widget script injected as fallback');
      }

    } catch (error) {
      console.error('❌ Error creating widget:', error);
      setError('Failed to create widget');
    }
  }, [symbols, widgetTheme, isLoaded, height, containerId]);

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

  if (isLoading) {
    return (
      <div 
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
