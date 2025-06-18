
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface TradingViewOverviewProps {
  symbols: string[];
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewOverview = ({ 
  symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA"], 
  height = "300px", 
  className = "" 
}: TradingViewOverviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { actualTheme } = useTheme();
  
  // Generate unique container ID
  const containerId = `tv-overview-${Date.now()}`;

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
        console.error('Failed to load TradingView overview script');
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
        console.log('Overview widget cleanup:', e);
      }
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.id = containerId;
    }

    try {
      // Create the overview widget using innerHTML method since it's a different widget type
      const widgetConfig = {
        "colorTheme": actualTheme === 'dark' ? 'dark' : 'light',
        "dateRange": "12M",
        "showChart": true,
        "locale": "en",
        "width": "100%",
        "height": "100%",
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
            "title": "Indices",
            "symbols": [
              { "s": "FOREXCOM:SPXUSD", "d": "S&P 500" },
              { "s": "FOREXCOM:NSXUSD", "d": "US 100" },
              { "s": "FOREXCOM:DJI", "d": "Dow 30" },
              { "s": "INDEX:NKY", "d": "Nikkei 225" },
              { "s": "INDEX:DEU40", "d": "DAX Index" },
              { "s": "FOREXCOM:UKXGBP", "d": "UK 100" }
            ]
          },
          {
            "title": "Futures",
            "symbols": [
              { "s": "CME_MINI:ES1!", "d": "S&P 500" },
              { "s": "CME:6E1!", "d": "Euro" },
              { "s": "COMEX:GC1!", "d": "Gold" },
              { "s": "NYMEX:CL1!", "d": "Crude Oil" },
              { "s": "NYMEX:NG1!", "d": "Natural Gas" },
              { "s": "CBOT:ZC1!", "d": "Corn" }
            ]
          },
          {
            "title": "Bonds",
            "symbols": [
              { "s": "CME:GE1!", "d": "Eurodollar" },
              { "s": "CBOT:ZB1!", "d": "T-Bond" },
              { "s": "CBOT:UB1!", "d": "Ultra T-Bond" },
              { "s": "EUREX:FGBL1!", "d": "Euro Bund" },
              { "s": "EUREX:FBTP1!", "d": "Euro BTP" },
              { "s": "EUREX:FGBM1!", "d": "Euro BOBL" }
            ]
          },
          {
            "title": "Forex",
            "symbols": [
              { "s": "FX:EURUSD", "d": "EUR/USD" },
              { "s": "FX:GBPUSD", "d": "GBP/USD" },
              { "s": "FX:USDJPY", "d": "USD/JPY" },
              { "s": "FX:USDCHF", "d": "USD/CHF" },
              { "s": "FX:AUDUSD", "d": "AUD/USD" },
              { "s": "FX:USDCAD", "d": "USD/CAD" }
            ]
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

      console.log(`📊 TradingView overview loaded with ${actualTheme} theme`);
    } catch (error) {
      console.error('Error creating TradingView overview widget:', error);
    }
  }, [actualTheme, isLoaded, containerId, symbols]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-black/20 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tradeiq-blue mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading Market Overview...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-black/20 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Overview Unavailable</p>
          <p className="text-gray-500 text-sm">Failed to load market overview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/10 rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
