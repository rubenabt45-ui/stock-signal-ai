
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface TradingViewChartProps {
  symbol: string;
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewChart = ({ symbol, height = "500px", className = "" }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { actualTheme } = useTheme();
  
  // Generate unique container ID to avoid conflicts
  const containerId = `tv-chart-${symbol}-${Date.now()}`;

  useEffect(() => {
    const loadTradingViewScript = () => {
      if (window.TradingView) {
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
        console.error('Failed to load TradingView script');
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
        console.log('Widget cleanup:', e);
      }
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Set the container ID
    if (containerRef.current) {
      containerRef.current.id = containerId;
    }

    try {
      // Create new widget
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: "1D",
        timezone: "Etc/UTC",
        theme: actualTheme === 'dark' ? 'dark' : 'light',
        style: "1",
        locale: "en",
        toolbar_bg: actualTheme === 'dark' ? "#1e293b" : "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: containerId,
        width: "100%",
        height: "100%"
      });

      console.log(`📈 TradingView chart loaded for ${symbol} with ${actualTheme} theme`);
    } catch (error) {
      console.error('Error creating TradingView widget:', error);
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
  }, [symbol, actualTheme, isLoaded, containerId]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-black/20 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading TradingView Chart...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-black/20 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Chart Unavailable</p>
          <p className="text-gray-500 text-sm">Failed to load TradingView widget</p>
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
