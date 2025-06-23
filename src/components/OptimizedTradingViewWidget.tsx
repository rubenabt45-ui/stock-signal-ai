
import { useEffect, useRef, useState } from "react";

interface OptimizedTradingViewWidgetProps {
  symbol: string;
  height?: string;
  className?: string;
  onReady?: () => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const OptimizedTradingViewWidget = ({ 
  symbol, 
  height = "600px", 
  className = "",
  onReady,
  onError
}: OptimizedTradingViewWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate unique container ID
  const containerId = `tradingview-widget-${symbol}-${Date.now()}`;

  useEffect(() => {
    let isMounted = true;
    
    const loadWidget = async () => {
      if (!isMounted) return;

      try {
        setIsLoading(true);
        setError(null);

        // Defensive check for container
        if (!containerRef.current) {
          console.warn('⚠️ Container ref not available yet, retrying...');
          setTimeout(() => {
            if (isMounted) loadWidget();
          }, 100);
          return;
        }

        // Clean up previous widget with defensive checks
        if (widgetRef.current) {
          try {
            // Check if widget still has a valid parent before removing
            if (widgetRef.current.iframe && widgetRef.current.iframe.parentNode) {
              widgetRef.current.remove();
            }
          } catch (e) {
            console.log('Widget cleanup handled:', e);
          }
          widgetRef.current = null;
        }

        // Clear container safely
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.id = containerId;
        }

        // Wait for TradingView script
        if (!window.TradingView) {
          console.log('📊 Loading TradingView script...');
          await loadTradingViewScript();
        }

        if (!isMounted || !containerRef.current) return;

        console.log(`📈 Creating TradingView widget for ${symbol}`);

        // Create widget with error handling
        const widget = new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1a1a1a",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerId,
          studies: [
            "Volume@tv-basicstudies"
          ],
          onChartReady: () => {
            if (isMounted) {
              console.log(`✅ Chart ready for ${symbol}`);
              setIsLoading(false);
              onReady?.();
            }
          }
        });

        widgetRef.current = widget;

        // Timeout fallback
        setTimeout(() => {
          if (isMounted && isLoading) {
            console.log('⏰ Chart loading timeout, assuming ready');
            setIsLoading(false);
            onReady?.();
          }
        }, 10000);

      } catch (error) {
        if (isMounted) {
          console.error('❌ TradingView widget error:', error);
          setError('Failed to load chart');
          setIsLoading(false);
          onError?.(error);
        }
      }
    };

    loadWidget();

    return () => {
      isMounted = false;
      
      // Cleanup with defensive checks
      if (widgetRef.current) {
        try {
          if (widgetRef.current.iframe && widgetRef.current.iframe.parentNode) {
            widgetRef.current.remove();
          }
        } catch (e) {
          console.log('Cleanup handled:', e);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, containerId, onReady, onError]);

  const loadTradingViewScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector('script[src*="tradingview.com/tv.js"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load TradingView script'));
      
      document.head.appendChild(script);
    });
  };

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-black/10 rounded-lg border border-gray-700/20 ${className}`}
        style={{ height }}
      >
        <div className="text-center py-8">
          <p className="text-red-400 text-lg mb-2">⚠️ Chart unavailable</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-black/10 rounded-lg border border-gray-700/20 ${className}`}
        style={{ height }}
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm font-medium">Loading Chart...</p>
          <p className="text-gray-500 text-xs mt-1">{symbol}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className={`bg-black/5 rounded-lg border border-gray-700/20 overflow-hidden ${className}`}
      style={{ height, minHeight: height }}
    />
  );
};
